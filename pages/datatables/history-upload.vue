<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">History Data</h5>
        <div class="ml-auto">
          <input
            type="text"
            v-model="search1"
            placeholder="🔍 Search in main table..."
            class="form-input w-auto"
          />
        </div>        
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
          skin="whitespace-nowrap table-hover"
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
            <div class="badge bg-dark">{{ formatDate(data.value.upload_date) }}</div>
          </template>
          <template #action="data">
            <div class="text-center">
              <button
                type="button"
                class="btn"
                :class="selectedUploadKe === data.value.upload_ke ? 'btn-danger' : 'btn-primary'"
                @click="toggleDetails(data.value.upload_ke)"
              >
                {{ selectedUploadKe === data.value.upload_ke ? 'Hide Details' : 'Show Details' }}
              </button>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <!-- Details Section -->
    <transition name="fade">
      <div v-if="selectedUploadKe" class="panel mt-6">
        <div class="mb-5 flex items-center justify-between">
          <h5 class="text-lg font-semibold dark:text-white-light">Details for Data #{{ selectedUploadKe }}</h5>
          <div class="flex items-center gap-4">
            <input
              type="text"
              v-model="search2"
              placeholder="🔍 Search in details..."
              class="form-input w-auto"
            />
            <button 
              @click="downloadExcel" 
              class="btn btn-success"
              :disabled="!details.length"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Excel
            </button>
            <button 
              @click="closeDetails" 
              class="btn btn-outline-danger"
            >
              Close Details
            </button>
          </div>
        </div>

        <!-- Loading state for details -->
        <div v-if="loadingDetails" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error state for details -->
        <div v-else-if="detailsError" class="p-4 bg-red-100 text-red-700 rounded-lg">
          {{ detailsError }}
          <button 
            @click="retryLoadDetails" 
            class="ml-4 btn btn-outline-primary btn-sm"
          >
            Retry
          </button>
        </div>

        <!-- Details table -->
        <div v-else-if="details.length" class="datatable">
          <vue3-datatable
            :rows="details"
            :columns="detailsCols"
            :totalRows="details.length"
            :sortable="true"
            sortColumn="t_id"
            :search="search2"
            skin="whitespace-nowrap table-hover"
          >
            <template #tanggal="data">
              <div class="badge bg-dark">{{ formatDate(data.value.tanggal) }}</div>
            </template>
            <template #tarif="data">
              <div class="badge bg-warning">{{ formatCurrency(data.value.tarif) }}</div>
            </template>
            <template #status="data">
              <div class="badge" :class="getStatusClass(data.value.status)">
                {{ data.value.status }}
              </div>
            </template>
          </vue3-datatable>
        </div>
        
        <!-- No details found -->
        <div v-else class="p-4 text-center text-gray-500">
          No details found for this upload.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import JsonExcel from 'vue-json-excel3';
import * as XLSX from 'xlsx';

useHead({ title: 'History Data' });

// State management
const search1 = ref('');
const search2 = ref('');
const headers = ref([]);
const details = ref([]);
const selectedUploadKe = ref(null);
const loading = ref(false);
const loadingDetails = ref(false);
const error = ref(null);
const detailsError = ref(null);

// Table columns configuration
const datatable1Cols = ref([
  { field: 'upload_ke', title: 'Data' },
  { field: 'upload_date', title: 'Tanggal' },  
  { field: 'action', title: 'Action' },
]);

const detailsCols = ref([
  { field: 't_id', title: 'T_ID' },
  { field: 'tanggal', title: 'Tanggal' },
  { field: 'user', title: 'User' },
  { field: 'status', title: 'Status' },
  { field: 'tarif', title: 'Tarif' },
  { field: 'pembayaran', title: 'Pembayaran' },
  { field: 'lokasi', title: 'Lokasi' },
  { field: 'kendaraan', title: 'Kendaraan' },
  { field: 'uji_emisi', title: 'Uji Emisi' },
]);

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

// Toggle details visibility
async function toggleDetails(uploadKe) {
  if (selectedUploadKe.value === uploadKe) {
    closeDetails();
  } else {
    await loadDetails(uploadKe);
  }
}

// Load details for selected upload
async function loadDetails(uploadKe) {
  selectedUploadKe.value = uploadKe;
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

// Close details section
function closeDetails() {
  selectedUploadKe.value = null;
  details.value = [];
  detailsError.value = null;
  search2.value = '';
}

// Retry loading details
function retryLoadDetails() {
  if (selectedUploadKe.value) {
    loadDetails(selectedUploadKe.value);
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return date.toLocaleString('en-GB', options);
};

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get status badge class
const getStatusClass = (status) => {
  const statusClasses = {
    'active': 'bg-success',
    'pending': 'bg-warning',
    'inactive': 'bg-danger',
    'completed': 'bg-info'
  };
  return statusClasses[status?.toLowerCase()] || 'bg-secondary';
};

// Download Excel
// Download Excel
function downloadExcel() {
  if (!details.value.length) return;
  
  const data = details.value.map(item => ({
    'T_ID': item.t_id,
    'Tanggal': formatDate(item.tanggal),
    'User': item.user,
    'Status': item.status,
    'Tarif': formatCurrency(item.tarif),
    'Pembayaran': item.pembayaran,
    'Lokasi': item.lokasi,
    'Kendaraan': item.kendaraan,
    'Uji Emisi': item.uji_emisi
  }));

  const fileName = `details_${selectedUploadKe.value}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Details');
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    // You might want to show an error message to the user here
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.btn {
  @apply px-4 py-2 rounded-lg transition-all duration-200 font-medium;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.btn-success {
  @apply bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline-danger {
  @apply border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white;
}

.btn-outline-primary {
  @apply border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white;
}

.btn-sm {
  @apply px-3 py-1 text-sm;
}

.form-input {
  @apply border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.badge {
  @apply px-2 py-1 rounded-full text-white text-sm font-medium;
}

.bg-success {
  @apply bg-green-500;
}

.bg-warning {
  @apply bg-yellow-500;
}

.bg-danger {
  @apply bg-red-500;
}

.bg-info {
  @apply bg-blue-500;
}

.bg-secondary {
  @apply bg-gray-500;
}

.bg-dark {
  @apply bg-gray-800;
}
</style>