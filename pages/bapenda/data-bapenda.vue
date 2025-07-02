<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex items-center justify-between">
        <h5 class="text-lg font-semibold dark:text-white-light">Transaction Monitoring - BAPENDA System</h5>

        <div class="flex items-center gap-4">
          <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" />
          
          <vue3-json-excel 
            class="btn btn-success btn-sm cursor-pointer" 
            :name="`transactions_${formatDateForAPI(dateRange.startDate)}_to_${formatDateForAPI(dateRange.endDate)}.xls`"
            :fields="excelColumns()" 
            :json-data="excelItems()"
          >
            <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            EXCEL
          </vue3-json-excel>
        </div>
      </div>
        
       <!-- Filters -->
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
        
        <select
          v-model="selectedStatus"
          class="form-select"
        >
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        
        <select
          v-model="limit"
          class="form-select"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        
        <button @click="onSearch" class="btn btn-primary">Apply Filters</button>
      </div>

      <div class="datatable">
        <div v-if="isLoading" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span class="ml-3 text-lg">Loading transactions...</span>
        </div>
        
        <div v-else-if="rows.length === 0" class="text-center py-8">
          <div class="text-gray-500 text-lg">No transactions found</div>
          <p class="text-sm text-gray-400 mt-2">Try adjusting your filters or date range</p>
        </div>
        
        <vue3-datatable
          v-else
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows.length"
          :sortable="true"
          sortColumn="createdAt"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #accountNo="data">
            <div class="font-mono text-sm">
              {{ data.value.accountNo?.trim() || '-' }}
            </div>
          </template>
          <template #createdAt="data">
            <div class="text-sm">
              {{ formatDate(data.value.createdAt) }}
            </div>
          </template>
          <template #amount="data">
            <div class="badge bg-dark font-semibold">
              {{ formatCurrency(data.value.amount) }}
            </div>
          </template>
          <template #status="data">
            <div class="badge" :class="`bg-${getStatusColor(data.value.status)}`">
              {{ data.value.status }}
            </div>
          </template>
          <template #channelName="data">
            <div class="badge bg-info">
              {{ data.value.channelName }}
            </div>
          </template>
          <template #customerName="data">
            <div class="font-medium">
              {{ data.value.customerName }}
            </div>
          </template>
          <template #vehicleNo="data">
            <div class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {{ data.value.vehicleNo }}
            </div>
          </template>
          <template #actions="data">
            <button 
              @click="showBillDetail(data.value)"
              class="btn btn-sm btn-outline-primary"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2"/>
                <path d="M2.45801 12C3.73228 7.94288 7.52257 5 12.0002 5C16.4778 5 20.2681 7.94291 21.5424 12C20.2681 16.0571 16.4778 19 12.0002 19C7.52256 19 3.73227 16.0571 2.45801 12Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Detail
            </button>
          </template>
        </vue3-datatable>
        
        <!-- Pagination Info -->
        <div v-if="rows.length > 0" class="mt-4 text-sm text-gray-600 text-center">
          Showing {{ rows.length }} transactions | Page {{ currentPage }} | {{ limit }} per page
        </div>
      </div>
    </div>

    <!-- Bill Detail Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            Bill Detail Information
          </h3>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedTransaction" class="p-6">
          <!-- Customer Info -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Customer Name:</span>
                <span class="font-medium">{{ selectedTransaction.customerName || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Vehicle No:</span>
                <span class="font-medium font-mono">{{ selectedTransaction.vehicleNo || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Account No:</span>
                <span class="font-medium font-mono">{{ selectedTransaction.accountNo || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Bill Details -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Bill Details</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">BBNKB:</span>
                <span class="font-semibold text-blue-600">{{ formatCurrency(selectedTransaction.bbnkb || 0) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">PKB:</span>
                <span class="font-semibold text-green-600">{{ formatCurrency(selectedTransaction.pkb || 0) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">Admin:</span>
                <span class="font-semibold text-orange-600">{{ formatCurrency(selectedTransaction.admin || 0) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">SWDKLLJ:</span>
                <span class="font-semibold text-purple-600">{{ formatCurrency(selectedTransaction.swdkllj || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Total Amount -->
          <div class="border-t pt-4">
            <div class="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span class="text-lg font-medium text-gray-900">Total Amount:</span>
              <span class="text-xl font-bold text-blue-600">{{ formatCurrency(selectedTransaction.amount || 0) }}</span>
            </div>
          </div>

          <!-- Transaction Info -->
          <div class="mt-4 pt-4 border-t">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Status:</span>
                <div class="mt-1">
                  <span class="badge" :class="`bg-${getStatusColor(selectedTransaction.status)}`">
                    {{ selectedTransaction.status }}
                  </span>
                </div>
              </div>
              <div>
                <span class="text-gray-600">Channel:</span>
                <div class="mt-1">
                  <span class="badge bg-info">{{ selectedTransaction.channelName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-6 border-t">
          <button 
            @click="closeModal"
            class="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

// Add these refs for pagination and filtering
const currentPage = ref(1);
const limit = ref(10);
const selectedStatus = ref('ALL');
const totalRows = ref(0);

// Modal state management
const showModal = ref(false);
const selectedTransaction = ref(null);

// Status options for the new API
const statusOptions = ['ALL', 'PAID', 'UNPAID', 'CANCEL_BILL', 'EXPIRE'];

// Modal functions
const showBillDetail = (transaction) => {
  selectedTransaction.value = transaction;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedTransaction.value = null;
};

// Format date for API (YYYY-MM-DD HH:mm:ss)
const formatDateForAPI = (date) => {
  if (!date) return '';
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  const dt = new Date(date);
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  const time = dt.toTimeString().split(' ')[0];
  return `${day}/${month}/${dt.getFullYear()} ${time}`;
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Fetch data from new API using server-side route
const fetchData = async () => {
  isLoading.value = true;
  try {
    const accessToken = useCookie('accessToken');
    
    if (!accessToken.value) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login first to access the data',
      });
      await navigateTo('/');
      return;
    }

    const startDate = formatDateForAPI(dateRange.value.startDate);
    const endDate = formatDateForAPI(dateRange.value.endDate);
    
    const params = {
      status: selectedStatus.value,
      from: `${startDate} 00:00:00`,
      to: `${endDate} 23:59:59`,
      page: currentPage.value.toString(),
      limit: limit.value.toString()
    };

    // Use server-side API route with authorization header
    const response = await $fetch('/api/report/transactions', {
      method: 'GET',
      query: params,
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });

    if (response.code === '0200' && response.data) {
      // Transform the data to match our table structure
      rows.value = response.data.map(item => ({
        ...item,
        // Add computed fields for better display
        customerName: item.billInfo?.customerName || '-',
        vehicleNo: item.billInfo?.vehicleNo || '-',
        frameNo: item.billInfo?.frameNo || '-',
        machineNo: item.billInfo?.machineNo || '-',
        totalAmount: item.amount,
        formattedAmount: formatCurrency(item.amount),
        formattedCreatedAt: formatDate(item.createdAt),
        // Bill details
        bbnkb: item.billDetail?.bbnkb || 0,
        pkb: item.billDetail?.pkb || 0,
        admin: item.billDetail?.admin || 0,
        swdkllj: item.billDetail?.swdkllj || 0
      }));
      
      // Note: The API doesn't seem to return total count, so we'll use the returned data length
      totalRows.value = response.data.length;
    } else {
      rows.value = [];
      totalRows.value = 0;
      
      if (response.code !== '0200') {
        await Swal.fire({
          icon: 'error',
          title: 'API Error',
          text: response.message || 'Failed to fetch data from server',
        });
      }
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    rows.value = [];
    totalRows.value = 0;
    
    // Check if it's an authentication error
    if (error.statusCode === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      await Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your session has expired. Please login again.',
      });
      await navigateTo('/');
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: error.data?.message || error.message || 'Failed to connect to the server. Please try again.',
      });
    }
  } finally {
    isLoading.value = false;
  }
};

// Search function
const onSearch = async () => {
  currentPage.value = 1; // Reset to first page when searching
  await fetchData();
};

// Handle date selection
const onStartDateSelect = async (date) => {
  dateRange.value.startDate = date;
};

const onEndDateSelect = async (date) => {
  dateRange.value.endDate = date;
};

// Pagination handlers
const onPageChange = async (page) => {
  currentPage.value = page;
  await fetchData();
};

// Status color helper
const getStatusColor = (status) => {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'UNPAID':
      return 'warning';
    case 'CANCEL_BILL':
      return 'danger';
    case 'EXPIRE':
      return 'secondary';
    default:
      return 'primary';
  }
};

// Define columns for the new data structure (added actions column)
const datatable1Cols = [
  { field: 'accountNo', title: 'Account No' },
  { field: 'createdAt', title: 'Transaction Date' },
  { field: 'amount', title: 'Amount'},
  { field: 'channelName', title: 'Channel' },
  { field: 'status', title: 'Status' },
  { field: 'trxType', title: 'Transaction Type'},
  { field: 'payCode', title: 'Pay Code'},
  { field: 'customerName', title: 'Customer Name' },
  { field: 'vehicleNo', title: 'Vehicle No' },
  { field: 'frameNo', title: 'Frame No' },
  { field: 'actions', title: 'Actions', sortable: false }
];

const excelColumns = () => {
  return {
    'Account No': 'accountNo',
    'Transaction Date': 'createdAt',
    'Amount': 'amount', 
    'Channel': 'channelName',  
    'Status': 'status',
    'Transaction Type': 'trxType',
    'Pay Code': 'payCode',
    'Customer Name': 'customerName',
    'Vehicle No': 'vehicleNo',
    'Frame No': 'frameNo',
    'Machine No': 'machineNo',
    'BBNKB': 'bbnkb',
    'PKB': 'pkb',
    'Admin': 'admin',
    'SWDKLLJ': 'swdkllj'
  };
};

const excelItems = () => {
  return rows.value.map(row => ({
    ...row,
    createdAt: formatDate(row.createdAt),
    amount: formatCurrency(row.amount)
  }));
};

// Fetch data on component mount
onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
/* Custom styles for the modal */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.bg-primary {
  @apply bg-blue-100 text-blue-800;
}

.bg-success {
  @apply bg-green-100 text-green-800;
}

.bg-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.bg-danger {
  @apply bg-red-100 text-red-800;
}

.bg-secondary {
  @apply bg-gray-100 text-gray-800;
}

.bg-info {
  @apply bg-cyan-100 text-cyan-800;
}

.bg-dark {
  @apply bg-gray-800 text-white;
}

.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

.btn-outline-primary {
  @apply text-blue-600 bg-white border-blue-300 hover:bg-blue-50 focus:ring-blue-500;
}

/* Modal animation */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>