<script setup>
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { ref } from 'vue';

// Fetch data from API
const { data, error } = await useFetch('/api/getFiles');
if (error.value) {
  console.error('❌ Error fetching data:', error.value);
}

// Define reactive variables
const rows = ref(data.value || []);
const search1 = ref('');

// Format date function
const formatDate = (date) => {
  if (date) {
    const dt = new Date(date);
    const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    return day + '/' + month + '/' + dt.getFullYear();
  }
  return '';
};

// Random color for badge
const viewColor = () => {
  const color = ['primary', 'secondary', 'success', 'info'];
  const random = Math.floor(Math.random() * color.length);
  return color[random];
};

const colorAmount = () => {
    const color = ['dark'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
}

// Define columns for the datatable
const datatable1Cols = [
  { field: 'request_id', title: 'No. Request' },
  { field: 'created_at', title: 'Tanggal Transaksi' },
  { field: 'base_amount', title: 'Amount'},
  { field: 'payment_status', title: 'Status Payment' },
  { field: 'mid', title: 'MID' },
  { field: 'tid', title: 'TID' },
  { field: 'username', title: 'Username' },
  { field: 'merchant_id', title: 'Merchant ID' },
  { field: 'name', title: 'Username' },

];

const excelColumns = () => {
        return {
            'Request ID': 'request_id',
            Tanggal: 'created_at',
            'Base Amount': 'base_amount',          
            Status: 'status',
            'Status Payment': 'payment_status',
            MID: 'mid',
            TID: 'tid',
            Username: 'username',
            'Merchant ID': 'merchant_id',
            Username: 'name'
        };
    };

    const excelItems = () => {
        return rows.value;
    };
</script>

<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 class="text-lg font-semibold dark:text-white-light">Monitoring Data Dika</h5>
        <div class="ltr:ml-auto rtl:mr-auto">
          <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" autofocus="on" />
        </div>
        <vue3-json-excel class="btn btn-success btn-sm m-1 cursor-pointer" name="table.xls" :fields="excelColumns()" :json-data="excelItems()">
                            <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />

                            EXCEL
          </vue3-json-excel>
      </div>
      <div class="datatable">
        <div v-if="error">❌ Error: {{ error.message }}</div>
        <vue3-datatable
          v-else
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows?.length"
          :sortable="true"
          sortColumn="request_id"
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
          <!-- <template #action>
            <div class="text-center">
              <client-only>
                <button type="button" v-tippy>
                  <icon-x-circle />
                </button>
                <tippy>Delete</tippy>
              </client-only>
            </div>
          </template> -->
        </vue3-datatable>
      </div>
    </div>
  </div>
</template>