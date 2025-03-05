<template>
    <div>
       
        <div class="pt-5">
            <div class="mb-6 grid gap-6 xl:grid-cols-2"> <!-- Change to 2 columns -->
                <div class="panel h-full">
                    <div class="mb-5 flex items-center">
                        <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">Pembayaran By Category</h5>
                    </div>
                    <div>
                        <client-only>
                            <apexchart
                                height="460"
                                :options="salesByCategory"
                                :series="salesByCategorySeries"
                                class="overflow-hidden rounded-lg bg-white dark:bg-black"
                            >
                                <!-- loader -->
                                <div class="grid min-h-[460px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                    <span
                                        class="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"
                                    ></span>
                                </div>
                            </apexchart>
                        </client-only>
                    </div>
                </div>

                <div class="panel h-full"> <!-- Move Summary section here -->
                    <div class="mb-5 flex items-center dark:text-white-light">
                        <h5 class="text-lg font-semibold drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">Summary</h5>                        
                    </div>
                    <div class="space-y-9">
                        <!-- Base Amount Section -->
                        <div class="flex items-center">
                            <div class="h-9 w-9 ltr:mr-3 rtl:ml-3">
                                <div
                                    class="grid h-9 w-9 place-content-center rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light"
                                >
                                    <icon-inbox />
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="mb-2 flex font-semibold text-white-dark">
                                    <h6>Base Amount</h6>
                                    <p class="ltr:ml-auto rtl:mr-auto">{{ totalBaseAmount }}</p>
                                </div>
                                <div class="h-2 rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                                    <div class="h-full w-full rounded-full bg-gradient-to-r from-[#7579ff] to-[#b224ef]" :style="{ width: totalBaseAmountPercentage + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Tarif Section -->
                        <div class="flex items-center">
                            <div class="h-9 w-9 ltr:mr-3 rtl:ml-3">
                                <div
                                    class="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light"
                                >
                                    <icon-tag />
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="mb-2 flex font-semibold text-white-dark">
                                    <h6>Tarif</h6>
                                    <p class="ltr:ml-auto rtl:mr-auto">{{ totalTarif }}</p>
                                </div>
                                <div class="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                                    <div class="h-full w-full rounded-full bg-gradient-to-r from-[#3cba92] to-[#0ba360]" :style="{ width: totalTarifPercentage + '%' }"></div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>               
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '@/stores/index';
import { useFetch } from '#app';

const store = useAppStore();
const totalBaseAmount = ref(0);
const totalTarif = ref(0);
const loading = ref(true);
// const error = ref(null);

// Fungsi untuk mengambil data dari API
const fetchData = async () => {
    try {
        const response = await fetch('/api/sum-data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        totalBaseAmount.value = data[0].total_base_amount;
        totalTarif.value = data[0].total_tarif;
    } catch (err) {
        error.value = 'Gagal mengambil data: ' + err.message;
    } finally {
        loading.value = false;
    }
};

// Menghitung persentase untuk tampilan progress bar
const totalBaseAmountPercentage = computed(() => {
    return totalBaseAmount.value > 0 ? (totalBaseAmount.value / (totalBaseAmount.value + totalTarif.value)) * 100 : 0;
});

const totalTarifPercentage = computed(() => {
    return totalTarif.value > 0 ? (totalTarif.value / (totalBaseAmount.value + totalTarif.value)) * 100 : 0;
});

// Fetch data from API
const { data: mergedData, error } = await useFetch('/api/get-merged');

if (error.value) {
    console.error('Error fetching data:', error.value);
}

// Process data to group by payment category
const groupedData = computed(() => {
    if (!mergedData.value) return {};

    const grouped = {};
    mergedData.value.forEach((item) => {
        const category = item.pembayaran || 'Others';
        if (!grouped[category]) {
            grouped[category] = 0;
        }
        grouped[category] += parseFloat(item.tarif) || 0; // Assuming tarif is the payment amount
    });
    return grouped;
});

// Extract labels and series for the chart
const salesByCategoryLabels = computed(() => Object.keys(groupedData.value));
const salesByCategorySeries = computed(() => Object.values(groupedData.value));

// Chart options
const salesByCategory = computed(() => {
    const isDark = store.theme === 'dark' || store.isDarkMode ? true : false;
    return {
        chart: {
            type: 'donut',
            height: 460,
            fontFamily: 'Nunito, sans-serif',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 25,
            colors: isDark ? '#0e1726' : '#fff',
        },
        colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            markers: {
                width: 10,
                height: 10,
                offsetX: -2,
            },
            height: 50,
            offsetY: 20,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '29px',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '26px',
                            color: isDark ? '#bfc9d4' : undefined,
                            offsetY: 16,
                            formatter: (val) => val,
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#888ea8',
                            fontSize: '29px',
                            formatter: (w) =>
                                w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                        },
                    },
                },
            },
        },
        labels: salesByCategoryLabels.value,
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
        },
    };
});

onMounted(() => {
    nextTick(() => {
        window.dispatchEvent(new Event('resize'));
    });
    fetchData();
});
</script>