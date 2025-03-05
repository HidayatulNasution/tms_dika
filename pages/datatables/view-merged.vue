<template>
    <div>
        <div class="panel mt-6 pb-0">
        <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
          <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">View Data Merged</h5>
          <div class="ltr:ml-auto rtl:mr-auto">
            <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" autofocus="on" />
          </div>
          <vue3-json-excel class="btn btn-success btn-sm m-1 cursor-pointer" name="table.xls" :fields="excelColumns()" :json-data="excelItems()">
                            <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />

                            EXCEL
          </vue3-json-excel>
          <button type="button" class="btn btn-danger btn-sm m-1" @click="exportTable('print')">
                        <icon-printer class="ltr:mr-2 rtl:ml-2" />
                        PRINT
          </button>
          
        </div>
  
        <div class="datatable">
          <vue3-datatable
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
            <template #tanggal="data">
                <div class="badge" :class="`bg-${vDateColor()}`">{{ formatDate(data.value.tanggal) }}</div>
              
            </template>
            
          </vue3-datatable>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import Vue3Datatable from '@bhplugin/vue3-datatable';

  useHead({ title: 'View Data' });
  const search1 = ref('');
  const merged = ref([]);

  // Fetch merged when the page loads
  onMounted(async () => {
    try {
      const response = await axios.get('/api/get-merged');
      merged.value = response.data;
    } catch (error) {
      console.error('Error fetching merged:', error);
    }
  });

  const datatable1Cols = ref([
    { field: 'request_id', title: 'Request ID' },
    { field: 'tanggal', title: 'Tanggal' },
    {field: 'base_amount', title: 'Base Amount'},
    {field: 'tarif', title: 'Tarif'},
    {field: 'status', title: 'Status'},
    {field: 'payment_status_file', title: 'Status Payment'},
    {field: 'user', title: 'User'},
    {field: 'pembayaran', title: 'Pembayaran'},
    {field: 'lokasi', title: 'Lokasi'},
    {field: 'kendaraan', title: 'Kendaraan'},
    
  ]);
  
  const rows = ref([]);
  const updateRows = () => {
    rows.value = merged.value.map((header) => ({
      request_id: header.request_id,
      tanggal: header.tanggal,
      base_amount: header.base_amount,
      tarif: header.tarif,
      status: header.status,
      payment_status_file: header.payment_status_file,
      user: header.user,
      pembayaran: header.pembayaran,
      lokasi: header.lokasi,
      kendaraan: header.kendaraan      
    }));
  };
  watch(merged, updateRows);

   // Helper function to format date
   const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const vDateColor = () => {
    const color = ['dark'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
}

const excelColumns = () => {
        return {
            'Request ID': 'request_id',
            Tanggal: 'tanggal',
            'Base Amount': 'base_amount',
            Tarif: 'tarif',
            Status: 'status',
            'Status Payment': 'payment_status_file',
            User: 'user',
            Pembayaran: 'pembayaran',
            Lokasi: 'lokasi',
            Kendaraan: 'kendaraan'
        };
    };

    const excelItems = () => {
        return rows.value;
    };

    const exportTable = (type: string) => {
    // Gunakan datatable1Cols untuk mendapatkan daftar kolom
    let columns = datatable1Cols.value.map((d) => {
        return d.field;
    });

    let records = rows.value;
    let filename = 'Report'; 

    if (type === 'print') {
        // Membuat header tabel
        let rowhtml = '<h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">' + filename + '</h1>';
        rowhtml +=
            '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;" cellpadding="0" cellspacing="0">' +
            '<thead>' +
            '<tr style="background-color: #f4f4f4; border: 1px solid #ddd; text-align: left;">';

        columns.forEach((d) => {
            rowhtml += '<th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">' + capitalize(d) + '</th>';
        });
        rowhtml += '</tr></thead>';
        rowhtml += '<tbody>';

        // Menambahkan data baris
        records.forEach((item) => {
            rowhtml += '<tr>';
            columns.forEach((d) => {
                let val = item[d] ? item[d] : '';
                rowhtml += '<td style="padding: 8px; border: 1px solid #ddd;">' + val + '</td>';
            });
            rowhtml += '</tr>';
        });
        rowhtml += '</tbody></table>';

        // Menambahkan gaya CSS untuk cetak
        rowhtml +=
            '<style>' +
            'body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }' +
            'h1 { text-align: center; font-size: 24px; margin-bottom: 20px; }' +
            'table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }' +
            'th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }' +
            'th { background-color: #f4f4f4; font-weight: bold; }' +
            'tr:nth-child(even) { background-color: #f9f9f9; }' +
            'tr:hover { background-color: #f1f1f1; }' +
            '</style>';

        // Membuka jendela baru untuk mencetak
        var winPrint = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
        winPrint.document.write('<title>Report</title>' + rowhtml); // Mengganti judul dokumen menjadi "Report"
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
    }
};

// Fungsi capitalize untuk mengubah huruf pertama menjadi kapital
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

</script>