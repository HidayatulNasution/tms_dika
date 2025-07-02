<template>
    <div>
        <div class="panel mt-6 pb-0">
            <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 class="text-lg font-semibold dark:text-white-light">Monitoring Jak Parkir</h5>
                <div class="ltr:ml-auto rtl:mr-auto">
                    <input v-model="search1" type="text" class="form-input w-auto" placeholder="🔍 Search" autofocus="on" />
                </div>
            </div>

            <div class="datatable">
                <vue3-datatable
                    :rows="rows"
                    :columns="datatable1Cols"
                    :totalRows="rows?.length"
                    :sortable="true"
                    sortColumn="u_name"
                    :search="search1"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #u_name="data">
                        <div class="flex w-max items-center">                           
                            {{ (data.value.u_name) }}
                        </div>
                    </template>
                    <template #t_date="data">
                        {{ formatDate(data.value.t_date) }}
                    </template>
                    <template #t_status="data">
                        <div class="badge" :class="`bg-${viewColor()}`">{{ (data.value.t_status) }}</div>
                    </template>
                    <template #v_number="data">
                        <div class="badge" :class="`bg-${vNumberColor()}`">{{ formatVNumber(data.value.v_number) }}</div>
                    </template>
                    <template #action>
                        <div class="text-center">
                            <client-only>
                                <button type="button" v-tippy>
                                    <icon-x-circle />
                                </button>
                                <tippy>Delete</tippy>
                            </client-only>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>       
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
useHead({ title: 'Monitoring Jak Parkir' });

const search1 = ref('');

const transactions = ref([]);

const fetchTransactions = async () => {
    try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        if (data.success) {
            transactions.value = data.data; 
        }
    } catch (error) {
        console.error("Error Fetching Transactions : ", error);
    }
};

onMounted(fetchTransactions);

const datatable1Cols = ref([
    { field: 'u_name', title: 'User' },
    { field: 't_date', title: 'Tanggal' },    
    { field: 't_status', title: 'Status' },   
    { field: 't_amount_pay', title: 'Tarif' },
    { field: 'pay_with', title: 'Pembayaran' },
    { field: 'l_name', title: 'Lokasi' },
    { field: 'v_number', title: 'No. Polisi' },
    { field: 'uji_emisi', title: 'Uji Emisi' },

]);

const rows = ref([]);


const updateRows = () => {
    rows.value = transactions.value.map(transaction => ({
        u_name: transaction.u_name,
        t_date: transaction.t_date,        
        t_status: transaction.t_status,       
        t_amount_pay: transaction.t_amount_pay,
        pay_with: transaction.pay_with,
        l_name: transaction.l_name,
        v_number: transaction.v_number,
        uji_emisi: transaction.uji_emisi,
        
    }));
};

watch(transactions, updateRows); 
const formatDate = (date) => {
    if (date) {
        const dt = new Date(date);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        return day + '/' + month + '/' + dt.getFullYear() ;
    }
    return '';
};

const viewColor = () => {
    const color = ['primary', 'secondary', 'success','info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
};

const vNumberColor = () => {
    const color = ['dark'];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
}

const formatVNumber = (v_number) => {
    return v_number.replace(/([A-Z])(\d+)/, '$1 $2 ').trim();
};
</script>
