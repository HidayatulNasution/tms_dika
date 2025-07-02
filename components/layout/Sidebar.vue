<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="h-full bg-white dark:bg-[#0e1726]">
                <div class="flex items-center justify-between px-4 py-3">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img class="ml-[5px] w-8 flex-none" src="/assets/images/logo.png" alt="" />
                        <span class="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">DIKA</span>
                    </NuxtLink>
                    <a
                        href="javascript:;"
                        class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <client-only>
                    <perfect-scrollbar
                        :options="{
                            swipeEasing: true,
                            wheelPropagation: false,
                        }"
                        class="relative h-[calc(100vh-80px)]"
                    >
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">                      
                            
                            <li v-if="hasCapability('datatables')" class="menu nav-item">
                                <button
                                    type="button"
                                    class="nav-link group w-full"
                                    :class="{ active: activeDropdown === 'datatables' }"
                                    @click="activeDropdown === 'datatables' ? (activeDropdown = null) : (activeDropdown = 'datatables')"
                                >
                                    <div class="flex items-center">
                                        <icon-menu-datatables class="shrink-0 group-hover:!text-primary" />

                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{
                                            $t('datatables')
                                        }}</span>
                                    </div>
                                    <div :class="{ '-rotate-90 rtl:rotate-90': activeDropdown !== 'datatables' }">
                                        <icon-caret-down />
                                    </div>
                                </button>
                                <vue-collapsible :isOpen="activeDropdown === 'datatables'">
                                    <ul class="sub-menu text-gray-500">                                  
                                        <li>
                                            <NuxtLink to="/datatables/data-dika" @click="toggleMobileMenu">{{ $t('data-dika') }}</NuxtLink>
                                        </li>                                      
                                        <li> 
                                            <NuxtLink to="/datatables/proses-data" @click="toggleMobileMenu">{{ $t('proses-data') }}</NuxtLink>
                                        </li>
                                    </ul>
                                </vue-collapsible>
                            </li>

                           <li v-if="hasCapability('data-bapenda')" class="menu nav-item">
                                <button
                                    type="button"
                                    class="nav-link group w-full"
                                    :class="{ active: activeDropdown === 'bapenda' }"
                                    @click="activeDropdown === 'bapenda' ? (activeDropdown = null) : (activeDropdown = 'bapenda')"
                                >
                                    <div class="flex items-center">
                                        <icon-menu-datatables class="shrink-0 group-hover:!text-primary" />

                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{
                                            $t('bapenda')
                                        }}</span>
                                    </div>
                                    <div :class="{ '-rotate-90 rtl:rotate-90': activeDropdown !== 'bapenda' }">
                                        <icon-caret-down />
                                    </div>
                                </button>
                                <vue-collapsible :isOpen="activeDropdown === 'bapenda'">
                                    <ul class="sub-menu text-gray-500">                                  
                                        <li>
                                            <NuxtLink to="/bapenda/data-bapenda" @click="toggleMobileMenu">{{ $t('data-bapenda') }}</NuxtLink>
                                        </li>                                      
                                       
                                    </ul>
                                </vue-collapsible>
                            </li>
                            
                            <!-- Show users menu only for admin role -->
                            <li v-if="store.userRole === 'admin'" class="menu nav-item">
                                <button
                                    type="button"
                                    class="nav-link group w-full"
                                    :class="{ active: activeDropdown === 'users' }"
                                    @click="activeDropdown === 'users' ? (activeDropdown = null) : (activeDropdown = 'users')"
                                >
                                    <div class="flex items-center">
                                        <icon-menu-users class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{ $t('users') }}</span>
                                    </div>
                                    <div :class="{ '-rotate-90 rtl:rotate-90': activeDropdown !== 'users' }">
                                        <icon-caret-down />
                                    </div>
                                </button>
                                <vue-collapsible :isOpen="activeDropdown === 'users'">
                                    <ul class="sub-menu text-gray-500">
                                        <li>
                                            <NuxtLink to="/users/user" @click="toggleMobileMenu">{{ $t('user') }}</NuxtLink>
                                        </li>
                                    </ul>
                                </vue-collapsible>
                            </li>                      
                                                      
                        </ul>
                    </perfect-scrollbar>
                </client-only>               
            </div>        
        </nav>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/index';
import VueCollapsible from 'vue-height-collapsible/vue3';

const store = useAppStore();
const activeDropdown: any = ref('');
const subActive: any = ref('');
const userCapabilities = ref([]);

// Function to check if user has a specific capability
const hasCapability = (capability) => {
  // Admin always has all capabilities
  if (store.userRole === 'admin') return true;
  
  // Check if the user has the specific capability
  return userCapabilities.value.includes(capability);
};

// Fetch user capabilities
const fetchUserCapabilities = async () => {
  try {
    // Get user ID from token
    const token = useCookie('authToken').value;
    if (!token) return;
    
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const userId = decodedPayload.id;
    
    // Fetch user capabilities
    const response = await fetch(`/api/auth/user-capabilities?userId=${userId}`);
    if (!response.ok) return;
    
    const data = await response.json();
    userCapabilities.value = data.map(uc => uc.capability);
  } catch (error) {
    console.error('Error fetching user capabilities:', error);
  }
};

onMounted(() => {
    // Fetch user capabilities
    fetchUserCapabilities();
    
    setTimeout(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');

        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];

                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    });
});

const toggleMobileMenu = () => {
    if (window.innerWidth < 1024) {
        store.toggleSidebar();
    }
};      
</script>