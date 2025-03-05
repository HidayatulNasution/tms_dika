<template>
    <div>
        <div class="pt-5">
            <div class="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">  
                <div class="panel h-full">
                    <div class="mb-5 flex items-center dark:text-white-light">
                        <h5 class="text-lg font-semibold">Summary</h5>                        
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

<script setup>
import { ref, onMounted } from 'vue';

const totalBaseAmount = ref(0);
const totalTarif = ref(0);
const loading = ref(true);
const error = ref(null);

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

// Mengambil data saat komponen dimuat
onMounted(() => {
    fetchData();
});
</script>

