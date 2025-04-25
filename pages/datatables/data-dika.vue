<script setup>
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { ref, onMounted } from 'vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

definePageMeta({
    middleware: 'auth'
});

// Initialize date range with yesterday's date for start and end
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const dateRange = ref({
  startDate: yesterday,
  endDate: yesterday
});

// Initialize rows with empty array
const rows = ref([]);
const isLoading = ref(true);
const search1 = ref('');

// Add these refs after other ref declarations
const selectedLocation = ref('');
const selectedPayment = ref('');

// Add these computed properties after other const declarations
const uniqueLocations = computed(() => {
    const locations = [...new Set(rows.value.map(row => row.merchant_name))];
    return ['All', ...locations.filter(Boolean)];
});

const uniquePayments = computed(() => {
    const payments = [...new Set(rows.value.map(row => row.batch_group_name))];
    return ['All', ...payments.filter(Boolean)];
});

// Format date for API
const formatDateForAPI = (date) => {
  if (!date) return '';
  const dt = new Date(date);
  return dt.toISOString().split('T')[0];
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  const dt = new Date(date);
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${dt.getFullYear()}`;
};

// Fetch data from API with date range
const fetchData = async () => {
  isLoading.value = true;
  try {
    const startDate = formatDateForAPI(dateRange.value.startDate);
    const endDate = formatDateForAPI(dateRange.value.endDate);
    
    const { data } = await useFetch('/api/getFiles', {
      method: 'GET',
      params: {
        startDate,
        endDate,
        location: selectedLocation.value !== 'All' ? selectedLocation.value : '',
        payment: selectedPayment.value !== 'All' ? selectedPayment.value : ''
      }
    });

    if (data.value) {
      rows.value = data.value;
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    rows.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Search function
const onSearch = async () => {
  await fetchData();
};

// Handle date selection
const onStartDateSelect = async (date) => {
  dateRange.value.startDate = date;
 // await fetchData();
};

const onEndDateSelect = async (date) => {
  dateRange.value.endDate = date;
  // await fetchData();
};

// Random color for badge
const viewColor = () => {
  return 'success';
};

const colorAmount = () => {
  return 'dark';
};

// Define columns for the datatable
const datatable1Cols = [
  { field: 'request_id', title: 'No. Request' },
  { field: 'created_at', title: 'Tanggal Transaksi' },
  { field: 'base_amount', title: 'Amount'},
  { field: 'batch_group_name', title: 'Payment' },
  { field: 'payment_status', title: 'Status Payment' },
  { field: 'upload_status', title: 'Upload Status'},
  { field: 'mid', title: 'MID' },
  { field: 'tid', title: 'TID' },
  { field: 'username', title: 'Code Location' },  
  { field: 'merchant_name', title: 'Location' },  
];

const excelColumns = () => {
  return {
    'Request ID': 'request_id',
    Tanggal: 'created_at',
    Amount: 'base_amount', 
    Payment: 'batch_group_name',  
    'Status Payment': 'payment_status',
    'Upload Status': 'upload_status',
    MID: 'mid',
    TID: 'tid',
    Location: 'merchant_name'   
    
  };
};

const excelItems = () => {
  return rows.value;
};

// Fetch data on component mount
onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex items-center justify-between">
        <h5 class="text-lg font-semibold dark:text-white-light">Monitoring Data Dika</h5>

        <div class="flex items-center gap-4">
          <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" />
          
          <vue3-json-excel 
            class="btn btn-success btn-sm cursor-pointer" 
            :name="`data_${formatDateForAPI(dateRange.startDate)}_to_${formatDateForAPI(dateRange.endDate)}.xls`"
            :fields="excelColumns()" 
            :json-data="excelItems()"
          >
            <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            EXCEL
          </vue3-json-excel>
        </div>
      </div>
        
       <!-- Second row: Filters -->
      <div class="mb-5 flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <DatePicker
            v-model="dateRange.startDate"
            @update:model-value="onStartDateSelect"
            placeholder="Start Date"
            format="dd/MM/yyyy"
            :enable-time-picker="false"
            class="form-input"
            :min-date="new Date('2024-01-01')"
            :max-date="today"
          />
          <span>to</span>
          <DatePicker
            v-model="dateRange.endDate"
            @update:model-value="onEndDateSelect"
            placeholder="End Date"
            format="dd/MM/yyyy"
            :enable-time-picker="false"
            class="form-input"
            :min-date="new Date('2024-01-01')"
            :max-date="today"
          />
        </div>
        <button @click="onSearch" class="btn btn-primary">Apply</button>
        <div style="display: flex; gap: 1rem; align-items: center; width: 100%; margin-top: 1rem;">
          <select
          v-model="selectedLocation"
          class="form-select"
          @change="onSearch"
        >
          <option disabled value="">Select Location</option>
          <option v-for="location in uniqueLocations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>

        <select
          v-model="selectedPayment"
          class="form-select"
          @change="onSearch"
        >
          <option disabled value="">Select Payment</option>
          <option v-for="payment in uniquePayments" :key="payment" :value="payment">
            {{ payment }}
          </option>
        </select>
        </div>                
      </div>

      <div class="datatable">
        <div v-if="isLoading" class="flex justify-center items-center p-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        
        <div v-else-if="rows.length === 0" class="text-center py-4">
          No data available
        </div>
        
        <vue3-datatable
          v-else
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows.length"
          :sortable="true"
          sortColumn="created_at"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #request_id="data">
            <div class="flex w-max items-center">
              {{ data.value.request_id }}
            </div>
          </template>
          <template #created_at="data">
            {{ formatDate(data.value.created_at) }}
          </template>
          <template #base_amount="data">
            <div class="badge" :class="`bg-${colorAmount()}`">
              {{ data.value.base_amount }}
            </div>
          </template>
          <template #payment_status="data">
            <div class="badge" :class="`bg-${viewColor()}`">
              {{ data.value.payment_status }}
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>
  </div>
</template>