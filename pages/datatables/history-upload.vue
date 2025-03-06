<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">History Upload CSV</h5>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Data table -->
      <div v-else class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows?.length"
          :sortable="true"
          sortColumn="upload_ke"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #upload_ke="data">
            <div class="flex w-max items-center">
              {{ data.value.upload_ke }}
            </div>
          </template>
          <template #upload_date="data">
            <div class="badge" :class="`bg-${vDateColor()}`">{{ formatDate(data.value.upload_date) }}</div>
          </template>
          <template #action="data">
            <div class="text-center">
              <button
                type="button"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                @click="openModal(data.value.upload_ke)"
              >
                Detail
              </button>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="p-4 border-b flex justify-between items-center">
            <h4 class="text-xl font-semibold">Details for Upload #{{ selectedUploadKe }}</h4>
            <button 
              type="button" 
              class="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full p-2 transition-all duration-200 ease-in-out hover:bg-red-50 active:bg-red-100 group"
              @click="closeModal"
            >          
              <svg 
                class="w-6 h-6 group-hover:scale-110 transition-transform duration-150 ease-in-out"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
            <!-- Loading state for details -->
            <div v-if="loadingDetails" class="flex justify-center items-center p-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>

            <!-- Error state for details -->
            <div v-else-if="detailsError" class="p-4 bg-red-100 text-red-700 rounded-lg">
              {{ detailsError }}
            </div>

            <!-- Details table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="header in tableHeaders" :key="header.icon" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div class="flex items-center space-x-2">
                        <i class="icon-left" v-html="header.icon"></i>
                        <span>{{ header.title }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="detail in details" :key="detail.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.t_id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(detail.tanggal) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.user }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.status }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.tarif }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.pembayaran }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.lokasi }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.kendaraan }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ detail.uji_emisi }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

useHead({ title: 'History Upload CSV' });

// State management
const search1 = ref('');
const headers = ref([]);
const details = ref([]);
const isModalOpen = ref(false);
const selectedUploadKe = ref(null);
const loading = ref(false);
const loadingDetails = ref(false);
const error = ref(null);
const detailsError = ref(null);

// Table columns configuration
const datatable1Cols = ref([
  { field: 'upload_ke', title: 'Upload Ke' },
  { field: 'upload_date', title: 'Tanggal' },
  { field: 'action', title: 'Action' },
]);

// Table headers for details modal
const tableHeaders = [
  { title: 'T ID', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10v10H7z" /></svg>' },
  { title: 'Date', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' },
  { title: 'User', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>' },
  { title: 'Status', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  { title: 'Tarif', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  { title: 'Payment', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
  { title: 'Location', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
  { title: 'Vehicle', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>' },
  { title: 'Uji Emisi', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
];

// Fetch headers when component mounts
onMounted(async () => {
  await fetchHeaders();
});

// Fetch headers data
async function fetchHeaders() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('/api/get-headers');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || 'Failed to fetch headers');
    }
    headers.value = await response.json();
  } catch (err) {
    error.value = err.message || 'Failed to load data. Please try again later.';
    console.error('Error fetching headers:', err);
  } finally {
    loading.value = false;
  }
}

// Update rows when headers change
const rows = ref([]);
watch(headers, () => {
  rows.value = headers.value.map((header) => ({
    upload_ke: header.upload_ke,
    upload_date: header.upload_date,
    action: '',
  }));
});

// Open modal and fetch details
async function openModal(uploadKe) {
  selectedUploadKe.value = uploadKe;
  isModalOpen.value = true;
  loadingDetails.value = true;
  detailsError.value = null;
  
  try {
    const response = await fetch(`/api/get-details?upload_ke=${uploadKe}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || 'Failed to fetch details');
    }
    details.value = await response.json();
  } catch (err) {
    detailsError.value = err.message || 'Failed to load details. Please try again later.';
    console.error('Error fetching details:', err);
  } finally {
    loadingDetails.value = false;
  }
}

// Close modal and reset states
function closeModal() {
  isModalOpen.value = false;
  selectedUploadKe.value = null;
  details.value = [];
  detailsError.value = null;
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateStr;
  }
}

// Date color helper
function vDateColor() {
  return 'dark';
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.badge {
  @apply px-2.5 py-0.5 text-xs rounded-full;
}

.badge.bg-dark {
  @apply bg-gray-800 text-white;
}
</style>