import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ambil token dari cookie
  const authToken = useCookie('authToken').value;

  if (!authToken) {
    // Tampilkan notifikasi jika token tidak ada
    await Swal.fire({
      icon: 'warning',
      title: 'Anda sudah logout',
      text: 'Silahkan login kembali',
      timer: 1500,
      showConfirmButton: false
    });

    // Refresh halaman dan redirect ke halaman login
    window.location.href = '/';
    return;
  }

  try {
    // Dekode token (tanpa verifikasi signature)
    const decoded = jwtDecode(authToken);
    console.log('Decoded token:', decoded);

    // (Opsional) Verifikasi expiry manual
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token expired');
    }
  } catch (error) {
    console.error('Token verification failed:', error);

    // Hapus token dari cookie
    useCookie('authToken').value = null;

    // Tampilkan notifikasi jika token tidak valid atau kadaluarsa
    await Swal.fire({
      icon: 'warning',
      title: 'Anda sudah logout',
      text: 'Silahkan login kembali',
      timer: 1500,
      showConfirmButton: false
    });

    // Refresh halaman dan redirect ke halaman login
    window.location.href = '/';
    return;
  }
});