<template>
  <div class="panel mt-6 pb-0">
    <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
      <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">Sinkronisasi Data</h5>
      <div class="ltr:ml-auto rtl:mr-auto flex gap-4">
        <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" autofocus="on" />
        <button @click="saveToDatabase" class="btn btn-primary">
          <icon-save class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Save
        </button>
      </div>
    </div>
  
    <!-- Matched Data Table -->
    <div class="mb-6">
      <h6 class="text-base font-semibold mb-3 dark:text-white-light">Matched Data</h6>
      <div class="datatable">
        <vue3-datatable
          v-if="matchedRows.length > 0"
          :rows="matchedRows"
          :columns="datatable1Cols"
          :totalRows="matchedRows.length"
          :sortable="true"
          sortColumn="request_id"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
        >
          <template #created_at="data">
            <div class="badge" :class="`bg-${vDateColor()}`">{{ formatDate(data.value.created_at) }}</div>
          </template>
          <template #tanggal="data">
            <div class="badge" :class="`bg-${vDateColor()}`">{{ formatDate(data.value.tanggal) }}</div>
          </template>
          <template #tarif="data">
            <div class="badge" :class="`bg-${tarifColor()}`">{{ data.value.tarif }}</div>
          </template>
          <template #base_amount="data">
            <div class="badge" :class="`bg-${tarifColor()}`">{{ data.value.base_amount }}</div>
          </template>
        </vue3-datatable>
        <p v-else>No matched data found...</p>
      </div>
    </div>
  
    <!-- Unmatched Data Table -->
    <div>
      <h6 class="text-base font-semibold mb-3 dark:text-white-light">Unmatched Data</h6>
      <div class="datatable">
        <vue3-datatable
          v-if="unmatchedRows.length > 0"
          :rows="unmatchedRows"
          :columns="datatable2Cols"
          :totalRows="unmatchedRows.length"
          :sortable="true"
          sortColumn="id"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
        >
          <template #tanggal="data">
            <div class="badge" :class="`bg-${vDateColor()}`">{{ formatDate(data.value.tanggal) }}</div>
          </template>
          <template #tarif="data">
            <div class="badge" :class="`bg-${tarifColor()}`">{{ data.value.tarif }}</div>
          </template>
        </vue3-datatable>
        <p v-else>No unmatched data found...</p>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  import Vue3Datatable from '@bhplugin/vue3-datatable';

  definePageMeta({
    middleware: 'auth'
});
  
const search1 = ref('');
const matchedRows = ref([]);
const unmatchedRows = ref([]);
const matchedTable = ref(null);
const unmatchedTable = ref(null);
  
  // Fetch data dari API
  const fetchSinkronisasi = async () => {
    try {
      const response = await fetch("/api/merged-data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        matchedRows.value = data.matchedData;
        unmatchedRows.value = data.unmatchedData;
      } else {
        console.error("Error fetching data: ", data.error);
      }
    } catch (error) {
      console.error("Error Fetching sinkronisasi: ", error);
    }
  };
  
  onMounted(fetchSinkronisasi);

  // Fungsi untuk animasi dan reset data
const animateAndReset = () => {
  // Animasi untuk matched table
  if (matchedTable.value && matchedTable.value.$el) {
    const tableElement = matchedTable.value.$el.querySelector('table');
    if (tableElement) {
      tableElement.classList.add('rotate-out');
    }
  }

  // Animasi untuk unmatched table
  if (unmatchedTable.value && unmatchedTable.value.$el) {
    const tableElement = unmatchedTable.value.$el.querySelector('table');
    if (tableElement) {
      tableElement.classList.add('rotate-out');
    }
  }

  // Setelah animasi selesai, kosongkan data dan hapus class animasi
  setTimeout(() => {
    matchedRows.value = [];
    unmatchedRows.value = [];
    
    // Hapus class animasi
    if (matchedTable.value && matchedTable.value.$el) {
      const tableElement = matchedTable.value.$el.querySelector('table');
      if (tableElement) {
        tableElement.classList.remove('rotate-out');
      }
    }
    
    if (unmatchedTable.value && unmatchedTable.value.$el) {
      const tableElement = unmatchedTable.value.$el.querySelector('table');
      if (tableElement) {
        tableElement.classList.remove('rotate-out');
      }
    }
  }, 500);
};
  
  // Fungsi untuk menyimpan data ke database dengan SweetAlert2
  const saveToDatabase = async () => {
    // Konfirmasi pengguna sebelum menyimpan data
    const confirmation = await Swal.fire({
      title: "Are you sure save data?",
      text: "Have you ensured that all the data is correct?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!"
    });
  
    // Jika pengguna membatalkan, hentikan proses
    if (!confirmation.isConfirmed) {
      return;
    }
  
    try {
      // Kirim data ke API
      const response = await fetch('/api/save-to-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchedRows.value),
      });
  
      const result = await response.json();
  
      // Tampilkan notifikasi sesuai hasil
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Your data has been saved.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        .then(() => {
        animateAndReset();
      });

      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to save data. Please try again.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error saving data: ", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while saving data.",
        icon: "error"
      });
    }
  };
  
  // Definisi kolom tabel untuk data yang cocok
  const datatable1Cols = ref([
    { field: 'request_id', title: 'Request ID' },
    { field: 'created_at', title: 'Tanggal Created' },
    { field: 'base_amount', title: 'Biaya' },
    { field: 'payment_status_file', title: 'Status Payment' },
    { field: 't_id', title: 'T_ID' },
    { field: 'tanggal', title: 'Tanggal' },
    { field: 'tarif', title: 'Tarif' },
    { field: 'status', title: 'Status' },
    { field: 'user', title: 'user' },
    { field: 'pembayaran', title: 'Pembayaran' },
    { field: 'lokasi', title: 'Lokasi'},
    { field: 'kendaraan', title: 'Kendaraan'},
  ]);
  
  // Definisi kolom tabel untuk data yang tidak cocok
  const datatable2Cols = ref([
    { field: 't_id', title: 'T_ID' },
    { field: 'tanggal', title: 'Tanggal' },
    { field: 'tarif', title: 'Tarif' },
    { field: 'status', title: 'Status' },
    { field: 'user', title: 'user' },
    { field: 'pembayaran', title: 'Pembayaran' },
    { field: 'lokasi', title: 'Lokasi'},
    { field: 'kendaraan', title: 'Kendaraan'},
  ]);
  
  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-GB', options);
  };
  
  const vDateColor = () => {
    const color = ['dark'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
  };
  
  const tarifColor = () => {
    const color = ['warning'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
  };
  </script>

<style scoped>
/* Animasi Rotate Out */
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