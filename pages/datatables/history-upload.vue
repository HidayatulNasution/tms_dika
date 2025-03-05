<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">History Upload CSV</h5>
        <!-- <div class="ltr:ml-auto rtl:mr-auto">
          <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" autofocus="on" />
        </div> -->
      </div>

      <div class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows?.length"
          :sortable="true"
          sortColumn="upload_ke"
          :search="search1"
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
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
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                @click="openModal(data.value.upload_ke)"
              >
                Detail
              </button>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <!-- Modal for displaying details -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Details for Upload #{{ selectedUploadKe }}</h4>
          <button 
    type="button" 
    class="
        text-red-500 
        hover:text-red-700 
        focus:outline-none 
        focus:ring-2 
        focus:ring-red-300 
        rounded-full 
        p-2 
        transition-all 
        duration-200 
        ease-in-out 
        hover:bg-red-50 
        active:bg-red-100 
        group"
    @click="isModalOpen = false"
>          
    <svg 
        class="
            w-6 
            h-6 
            group-hover:scale-110 
            transition-transform 
            duration-150 
            ease-in-out"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12" 
        />
    </svg>
</button>
        </div>
        <div class="modal-body">
          <div class="box box-warning">
            <div class="box-body">
              <table class="detail-table">
                <thead>
                  <tr>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10v10H7z" />
                        </svg>
                      </i>
                      T ID
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </i>
                      Date
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </i>
                      User
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </i>
                      Status
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </i>
                      Tarif
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </i>
                      Payment
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </i>
                      Location
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </i>
                      Vehicle
                    </th>
                    <th>
                      <i class="icon-left">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </i>
                      Uji Emisi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in details" :key="detail.id">
                    <td>{{ detail.t_id }}</td>
                    <td>{{ formatDate(detail.tanggal) }}</td>
                    <td>{{ detail.user }}</td>
                    <td>{{ detail.status }}</td>
                    <td>{{ detail.tarif }}</td>
                    <td>{{ detail.pembayaran }}</td>
                    <td>{{ detail.lokasi }}</td>
                    <td>{{ detail.kendaraan }}</td>
                    <td>{{ detail.uji_emisi }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Vue3Datatable from '@bhplugin/vue3-datatable';

useHead({ title: 'History Upload CSV' });

const search1 = ref('');
const headers = ref([]);
const details = ref([]);
const isModalOpen = ref(false);
const selectedUploadKe = ref(null);

// Fetch headers when the page loads
onMounted(async () => {
  try {
    const response = await axios.get('/api/get-headers');
    headers.value = response.data;
  } catch (error) {
    console.error('Error fetching headers:', error);
  }
});

const datatable1Cols = ref([
  { field: 'upload_ke', title: 'Upload Ke' },
  { field: 'upload_date', title: 'Tanggal' },
  { field: 'action'}, // Kolom Action
]);

const rows = ref([]);
const updateRows = () => {
  rows.value = headers.value.map((header) => ({
    upload_ke: header.upload_ke,
    upload_date: header.upload_date,
    action: '', // Placeholder untuk kolom Action
  }));
};
watch(headers, updateRows);

// Open modal and fetch details
const openModal = async (uploadKe) => {
  try {
    selectedUploadKe.value = uploadKe;
    const response = await axios.get(`/api/get-details?upload_ke=${uploadKe}`);
    details.value = response.data;
    isModalOpen.value = true;
  } catch (error) {
    console.error('Error fetching details:', error);
  }
};

// Helper function to format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const vDateColor = () => {
  const color = ['dark'];
  const random = Math.floor(Math.random() * color.length);
  return color[random];
};
</script>