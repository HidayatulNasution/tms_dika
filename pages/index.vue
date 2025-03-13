<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:;" class="text-primary hover:underline">Monitoring Data</a>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Proses Data</span>
            </li>
        </ul>
        <div class="pt-5">
            <div class="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                <!-- Upload CSV -->
                <div class="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div class="flex justify-between">
                        <div class="text-md font-semibold ltr:mr-1 rtl:ml-1">Upload Data</div>
                        <div class="dropdown">
                            <client-only>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                                    <button type="button">
                                        <icon-horizontal-dots class="opacity-70 hover:opacity-80" />
                                    </button>
                                    <template #content="{ close }">
                                        <ul @click="close()" class="text-black dark:text-white-dark">
                                            <!-- <li>
                                                <a href="#" @click="toggleHistori">{{ isHistoryVisible ? 'Hiden History' : 'History Proses' }}</a>
                                            </li> -->
                                            <li>
                                                <a href="#" @click="toggleUpload">{{ isUploadVisible ? 'Hide Upload' : 'Upload Data' }}</a>
                                            </li>                                            
                                        </ul>
                                    </template>
                                </Popper>
                            </client-only>
                        </div>
                    </div>
                     <!-- <div class="mt-5 flex items-center">
                        <div class="text-3xl font-bold ltr:mr-3 rtl:ml-3">100</div>
                        <div class="badge bg-white/30">Total Upload</div>
                    </div> -->
                                      
                </div>  
                              <!-- Sinkronisasi -->
                 <div class="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div class="flex justify-between">
                        <div class="text-md font-semibold ltr:mr-1 rtl:ml-1">Sinkronisasi Data</div>
                        <div class="dropdown">
                            <client-only>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                                    <button type="button">
                                        <icon-horizontal-dots class="opacity-70 hover:opacity-80" />
                                    </button>
                                    <template #content="{ close }">
                                        <ul @click="close()" class="text-black dark:text-white-dark">
                                            <li>
                                                <a href="#" @click="toggleMerged">{{ isMergedVisible ? 'Hide Result' : 'Hasil Sinkron' }}</a>
                                            </li>
                                            <li>
                                                <a href="#" @click="toggleSinkronisasi">{{ isSinkronisasiVisible ? 'Hide Sinkron' : 'Proses Sinkron' }}</a>
                                            </li>
                                        </ul>
                                    </template>
                                </Popper>
                            </client-only>
                        </div>
                    </div>
                     <!-- <div class="mt-5 flex items-center">
                        <div class="text-3xl font-bold ltr:mr-3 rtl:ml-3">74,137</div>
                        <div class="badge bg-white/30">- 2.35%</div>
                    </div>
                     <div class="mt-5 flex items-center font-semibold">
                        <icon-eye class="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 84,709
                    </div>  -->
                </div>
                <!-- Grafik -->
                <div class="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div class="flex justify-between">
                        <div class="text-md font-semibold ltr:mr-1 rtl:ml-1">Grafik</div>
                        <div class="dropdown">
                            <client-only>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                                    <button type="button">
                                        <icon-horizontal-dots class="opacity-70 hover:opacity-80" />
                                    </button>
                                    <template #content="{ close }">
                                        <ul @click="close()" class="text-black dark:text-white-dark">
                                            <li>
                                                <a href="#" @click="toggleGrafik">{{ isGrafikVisible ? 'Hide Grafik' : 'View Grafik' }}</a>
                                            </li>
                                            
                                        </ul>
                                    </template>
                                </Popper>
                            </client-only>
                        </div>
                    </div>
                    <!-- <div class="mt-5 flex items-center">
                        <div class="text-3xl font-bold ltr:mr-3 rtl:ml-3">38,085</div>
                        <div class="badge bg-white/30">+ 1.35%</div>
                    </div>
                    <div class="mt-5 flex items-center font-semibold">
                        <icon-eye class="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 37,894
                    </div> -->
                </div>
                <div class="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div class="flex justify-between">
                        <div class="text-md font-semibold ltr:mr-1 rtl:ml-1">History Data</div>
                        <div class="dropdown">
                            <client-only>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                                    <button type="button">
                                        <icon-horizontal-dots class="opacity-70 hover:opacity-80" />
                                    </button>
                                    <template #content="{ close }">
                                        <ul @click="close()" class="text-black dark:text-white-dark">
                                            <li>
                                                <a href="#" @click="toggleHistori">{{ isHistoryVisible ? 'Hide History' : 'History Upload' }}</a>
                                            </li>                                            
                                        </ul>
                                    </template>
                                </Popper>
                            </client-only>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>

        <!-- Tampilkan range-search.vue jika isUploadVisible bernilai true -->
        <div v-if="isUploadVisible">
            <RangeSearch />
        </div>
        <div v-if="isHistoryVisible">
            <historyUpload />
        </div>
        <div v-if="isSinkronisasiVisible">
            <mergedDb />
        </div>
        <div v-if="isMergedVisible">
            <viewMerged />
        </div>
        <div v-if="isGrafikVisible">
            <grafik />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/index';
import rangeSearch from './datatables/range-search.vue';
import RangeSearch from './datatables/range-search.vue'; 
import historyUpload from './datatables/history-upload.vue';
import mergedDb from './datatables/merged-db.vue';
import viewMerged from './datatables/view-merged.vue';
import grafik from './datatables/grafik.vue';

const store = useAppStore();
useHead({ title: 'Proses Data' });

// State untuk mengontrol visibilitas upload CSV
const isUploadVisible = ref(false);
const isHistoryVisible = ref(false);
const isSinkronisasiVisible = ref(false);
const isMergedVisible = ref(false);
const isGrafikVisible = ref(false);

// Fungsi untuk toggle visibilitas upload CSV
const toggleUpload = () => {
    isUploadVisible.value = !isUploadVisible.value;
};

const toggleSinkronisasi = () => {
    isSinkronisasiVisible.value = !isSinkronisasiVisible.value;
};

const toggleMerged = () => {
    isMergedVisible.value = !isMergedVisible.value;
};

const toggleGrafik = () => {
    isGrafikVisible.value = !isGrafikVisible.value;
};

const toggleHistori = () => {
    isHistoryVisible.value = !isHistoryVisible.value;
};

onMounted(() => {
    nextTick(() => {
        window.dispatchEvent(new Event('resize'));
    });
});
</script>