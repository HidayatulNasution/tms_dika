<template>
    <div>
        <div class="panel mt-6 pb-1.5">  
            <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">Upload CSV</h5><br>       
            <div class="datatable">
                <!-- Form Upload -->
                
                <div class="flex items-center justify-left space-x-4 mb-4">
                    <!-- Tombol Upload File CSV -->
                    <button 
                        @click="handleFileUpload" 
                        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                        
                    >
                        <!-- Ikon File -->
                        <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <!-- Teks Tombol -->
                        Upload File CSV
                    </button>
                    
                    <button 
                        v-if="csvData.length" 
                        @click="saveToDatabase" 
                        class="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                    >
                        <!-- Ikon Save -->
                        <icon-save class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <!-- Teks Tombol -->
                        Save
                    </button>
                
                </div>
                    

                <!-- Tampilkan Data CSV -->
                <table v-if="csvData.length">
                    <thead>
                        <tr>
                            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in csvData" :key="index">
                            <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                        </tr>
                    </tbody>
                </table>

                
                
            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2'; // Impor SweetAlert2
import Papa from 'papaparse';
useHead({ title: 'Upload CSV' });

definePageMeta({
    middleware: 'auth'
});

const file = ref(null);
const csvData = ref([]);
const headers = ref([]);

// Handle file upload menggunakan SweetAlert2
const handleFileUpload = async () => {
    const { value: file } = await Swal.fire({
        title: "Pilih File CSV",
        input: "file",
        inputAttributes: {
            accept: ".csv", // Hanya menerima file CSV
            "aria-label": "Upload your CSV file"
        },
        showCancelButton: true,
        confirmButtonText: "Upload",
        cancelButtonText: "Cancel",
        customClass: {
            popup: "custom-swal-popup", // Opsional: Untuk styling kustom
        }
    });
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            const parsed = Papa.parse(csvText, { header: true });
            // Hilangkan kolom pertama yang kosong
            const filteredData = parsed.data
                .map((row) => {
                    // Hapus kolom pertama yang kosong
                    const keys = Object.keys(row);
                    if (keys[0] === "") {
                        delete row[keys[0]];
                    }
                    return row;
                })
                .filter((row) => {
                    // Filter hanya baris dengan t_id yang valid
                    return row.t_id && row.user && row.status && row.tarif && row.pembayaran && row.lokasi && row.kendaraan && row.tanggal;
                });
            headers.value = parsed.meta.fields.filter((header) => header !== ""); // Hilangkan header kosong
            csvData.value = filteredData; // Ambil data CSV yang valid
            // Tampilkan notifikasi sukses
            Swal.fire({
                icon: "success",
                title: "File Uploaded Successfully",
                text: "CSV file has been uploaded and processed.",
                confirmButtonText: "OK"
            });
        };
        reader.readAsText(file); // Baca file sebagai teks
    }
};


// Simpan data ke database dengan SweetAlert2
const saveToDatabase = async () => {
    // Konfigurasi SweetAlert2 dengan gaya Bootstrap
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success px-4 py-2",
            cancelButton: "btn btn-danger px-4 py-2",
            actions: "d-flex justify-content-center gap-3"
        },
        buttonsStyling: false
    });

    // Tampilkan dialog konfirmasi
    const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "Do you want to save the changes?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Save it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    });

    if (result.isConfirmed) {
        try {
            // Tampilkan animasi loading
            Swal.fire({
                title: "Saving...",
                text: "Please wait while we save your data.",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading(); // Menampilkan indikator loading
                }
            });

            // Filter data sebelum dikirim ke server
            const validData = csvData.value.filter((row) => {
                return row.t_id && row.user && row.status && row.tarif && row.pembayaran && row.lokasi && row.kendaraan && row.tanggal;
            });

            // Kirim data ke API
            const response = await fetch("/api/save-csv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validData),
            });

            const result = await response.json();

            // Tutup animasi loading
            Swal.close();

            // Tampilkan notifikasi sukses
            await swalWithBootstrapButtons.fire({
                title: "Saved!",
                text: "Your file has been saved successfully.",
                icon: "success",
                timer: 2000, // Menutup otomatis setelah 2 detik
                showConfirmButton: false // Hilangkan tombol OK
            });

            // Jalankan animasi rotate-out
            const tableElement = document.querySelector('table');
            if (tableElement) {
                tableElement.classList.add('rotate-out');

                // Setelah animasi selesai, kosongkan data dan hapus class animasi
                setTimeout(() => {
                    csvData.value = [];
                    headers.value = [];
                    tableElement.classList.remove('rotate-out');
                }, 500); // Sesuaikan dengan durasi animasi
            }
        } catch (error) {
            // Tangani error jika terjadi kesalahan saat menyimpan data
            console.error("Error saving data:", error);

            // Tutup animasi loading
            Swal.close();

            // Tampilkan notifikasi error
            await swalWithBootstrapButtons.fire({
                title: "Error!",
                text: "Failed to save the data. Please try again.",
                icon: "error"
            });
        }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Tampilkan notifikasi pembatalan
        await swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Changes are not saved :)",
            icon: "info"
        });
    }
};
</script>

<style scoped>
/* Animasi rotate out */
.rotate-out {
    animation: rotateOut 0.5s ease-in-out forwards;
}

@keyframes rotateOut {
    from {
        transform: rotateY(0);
        opacity: 1;
    }
    to {
        transform: rotateY(180deg);
        opacity: 0;
    }
}
</style>