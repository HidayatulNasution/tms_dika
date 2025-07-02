import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';
import { useAppStore} from '@/stores/index';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ambil token dari cookie
  const authToken = useCookie('authToken').value;
  const accessToken = useCookie('accessToken').value;

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

   // Set user role in store
    const store = useAppStore();
    store.setUserRole((decoded as any).role);

    // Admin always has access to all routes
    if ((decoded as any).role === 'admin') return;
    
    // Check user capabilities
    const bapendaResponse = await fetch(`/api/auth/check-capability?userId=${(decoded as any).id}&capability=data-bapenda`);
    const bapendaData = await bapendaResponse.json();
    const hasBapendaAccess = bapendaData.hasAccess;
    
    const datatableResponse = await fetch(`/api/auth/check-capability?userId=${(decoded as any).id}&capability=datatables`);
    const datatableData = await datatableResponse.json();
    const hasDatatableAccess = datatableData.hasAccess;
    
    // // Check if user has access to the route
    // if (to.path.includes('/bapenda/')) {
    //   if (!hasBapendaAccess) {
    //     if (hasDatatableAccess) {
    //       // User has only datatables capability
    //       await Swal.fire({
    //         icon: 'info',
    //         title: 'Akses Terbatas',
    //         text: 'Anda hanya bisa akses di datatable',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //       return navigateTo('/datatables/proses-data');
    //     } else {
    //       // User has no relevant capabilities
    //       await Swal.fire({
    //         icon: 'error',
    //         title: 'Access Denied',
    //         text: 'You do not have permission to access this page',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //       return navigateTo('/');
    //     }
    //   }
    // } else if (to.path.includes('/datatables/')) {
    //   if (!hasDatatableAccess) {
    //     if (hasBapendaAccess) {
    //       // User has only data-bapenda capability
    //       await Swal.fire({
    //         icon: 'info',
    //         title: 'Akses Terbatas',
    //         text: 'Anda hanya bisa akses di data-bapenda',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //       return navigateTo('/bapenda/data-bapenda');
    //     } else {
    //       // User has no relevant capabilities
    //       await Swal.fire({
    //         icon: 'error',
    //         title: 'Access Denied',
    //         text: 'You do not have permission to access this page',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //       return navigateTo('/');
    //     }
    //   }
    // }
    
    // // If user has both capabilities, show notification on first access
    // if (hasBapendaAccess && hasDatatableAccess && (to.path === '/' || from.path === '/')) {
    //   await Swal.fire({
    //     icon: 'success',
    //     title: 'Full Access',
    //     text: 'Anda mendapatkan full capability',
    //     timer: 2000,
    //     showConfirmButton: false
    //   });
    //   return navigateTo('/datatables/proses-data');
    // }

    // Jika user baru login (berada di halaman root)
    if (to.path === '/') {
      if (hasBapendaAccess && hasDatatableAccess) {
        // User memiliki kedua capability
        await Swal.fire({
          icon: 'success',
          title: 'Full Access',
          text: 'Anda mendapatkan full capability',
          timer: 2000,
          showConfirmButton: false
        });
        return navigateTo('/datatables/proses-data');
      } else if (hasBapendaAccess && !hasDatatableAccess) {
        // User hanya memiliki capability data-bapenda
        await Swal.fire({
          icon: 'info',
          title: 'Akses Terbatas',
          text: 'Anda hanya bisa akses di data-bapenda',
          timer: 2000,
          showConfirmButton: false
        });
        return navigateTo('/bapenda/data-bapenda');
      } else if (!hasBapendaAccess && hasDatatableAccess) {
        // User hanya memiliki capability datatables
        await Swal.fire({
          icon: 'info',
          title: 'Akses Terbatas',
          text: 'Anda hanya bisa akses di datatable',
          timer: 2000,
          showConfirmButton: false
        });
        return navigateTo('/datatables/proses-data');
      }
    }
    
    // Check if user has access to the route
    if (to.path.includes('/bapenda/')) {
      if (!hasBapendaAccess) {
        if (hasDatatableAccess) {
          // User has only datatables capability
          await Swal.fire({
            icon: 'info',
            title: 'Akses Terbatas',
            text: 'Anda hanya bisa akses di datatable',
            timer: 2000,
            showConfirmButton: false
          });
          return navigateTo('/datatables/proses-data');
        } else {
          // User has no relevant capabilities
          await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to access this page',
            timer: 2000,
            showConfirmButton: false
          });
          return navigateTo('/');
        }
      }
    } else if (to.path.includes('/datatables/')) {
      if (!hasDatatableAccess) {
        if (hasBapendaAccess) {
          // User has only data-bapenda capability
          await Swal.fire({
            icon: 'info',
            title: 'Akses Terbatas',
            text: 'Anda hanya bisa akses di data-bapenda',
            timer: 2000,
            showConfirmButton: false
          });
          return navigateTo('/bapenda/data-bapenda');
        } else {
          // User has no relevant capabilities
          await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to access this page',
            timer: 2000,
            showConfirmButton: false
          });
          return navigateTo('/');
        }
      }
    }

    // (Opsional) Verifikasi expiry manual
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token expired');
    }
  } catch (error) {
    console.error('Token verification failed:', error);

    // Hapus token dari cookie
    useCookie('authToken').value = null;
    useCookie('accessToken').value = null;

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