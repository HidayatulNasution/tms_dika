<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/screen3.jpg" alt="image" class="h-full w-full object-cover" />
        </div>
        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <img src="/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
            <div
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                <div
                    class="relative hidden w-full items-center justify-center bg-white p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"
                    ></div>
                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">                        
                        <div class="hidden w-full max-w-[500px] lg:block">
                            <img src="/assets/images/logo.png" alt="Cover Image" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <NuxtLink to="/" class="block w-8 lg:hidden">
                            <img src="/assets/images/logo.png" alt="Logo" class="mx-auto w-10" />
                        </NuxtLink>
                        <div class="dropdown ms-auto w-max">
                            <client-only>
                                <template #content="{ close }">
                                    <ul
                                        class="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90"
                                    >
                                        <template v-for="item in store.languageList" :key="item.code">
                                            <li>
                                                <button
                                                    type="button"
                                                    class="w-full hover:text-primary"
                                                    :class="{ 'bg-primary/10 text-primary': store.locale === item.code }"
                                                    @click="changeLanguage(item), close()"
                                                >
                                                    <img
                                                        class="h-5 w-5 rounded-full object-cover"
                                                        :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`"
                                                        alt=""
                                                    />
                                                    <span class="ltr:ml-3 rtl:mr-3">{{ item.name }}</span>
                                                </button>
                                            </li>
                                        </template>
                                    </ul>
                                </template>                            
                            </client-only>
                        </div>
                    </div>
                    <div class="w-full max-w-[440px] lg:mt-10">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Enter your username and password to login</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="handleLogin">
                            <div>
                                <label for="Username">Username</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Username" 
                                        type="text" 
                                        v-model="formData.username"
                                        placeholder="Enter Username" 
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        autocomplete="off"
                                        :disabled="isLoading"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/>
                                            <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" stroke="currentColor" stroke-width="1.5"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label for="Password">Password</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Password" 
                                        type="password" 
                                        v-model="formData.password"
                                        placeholder="Enter Password" 
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        :disabled="isLoading"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" stroke="currentColor" stroke-width="1.5"/>
                                            <circle cx="8" cy="16" r="2" fill="currentColor"/>
                                            <circle cx="16" cy="16" r="2" fill="currentColor"/>
                                            <circle cx="12" cy="16" r="2" fill="currentColor"/>
                                            <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div v-if="isLoading" class="text-center py-4">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p class="text-white-dark">{{ loadingMessage }}</p>
                            </div>

                            <button 
                                type="submit" 
                                :disabled="isLoading || !formData.username || !formData.password"
                                class="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-50"
                            >
                                <span v-if="!isLoading">Sign in</span>
                                <span v-else>{{ loadingMessage }}</span>
                            </button>
                        </form>
                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}. DIKA All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/index';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

useHead({ title: 'Login Page' });
const router = useRouter();
definePageMeta({
    layout: 'auth-layout',
});

const store = useAppStore();

const formData = ref({
    username: '',
    password: ''
});

const isLoading = ref(false);
const loadingMessage = ref('Authenticating...');

const handleLogin = async () => {
    isLoading.value = true;
    loadingMessage.value = 'Verifying credentials...';
    
    try {
        // Step 1: Login with username and password
        const loginResponse = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                username: formData.value.username,
                password: formData.value.password
            }
        });

        if (loginResponse.status === 200) {
            // Save auth token from login
            const authTokenCookie = useCookie('authToken', {
                maxAge: 60 * 60 * 1000, // 1 hour
                secure: true,
                sameSite: 'strict'
            });
            authTokenCookie.value = loginResponse.data.token;
            
            // Set user role in store
            store.setUserRole(loginResponse.data.role);

            // Step 2: Get access token for API access
            loadingMessage.value = 'Getting access token...';
            
            const accessTokenResponse = await $fetch('/api/auth/access-token', {
                method: 'POST',
                body: {
                    grantType: 'client_credentials'
                }
            });

            if (accessTokenResponse.data && accessTokenResponse.data.accessToken) {
                // Save access token
                const accessTokenCookie = useCookie('accessToken', {
                    maxAge: parseInt(accessTokenResponse.data.expiresIn) * 1000,
                    secure: true,
                    sameSite: 'strict'
                });
                accessTokenCookie.value = accessTokenResponse.data.accessToken;

                // Show success message
                const welcomeMessage = `Selamat Datang ${loginResponse.data.role === 'admin' ? 'Admin' : 'User'} ${loginResponse.data.username}!`;
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: welcomeMessage,
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Redirect to dashboard
                await router.push('/bapenda/data-bapenda');
            } else {
                throw new Error('Failed to get access token');
            }
        } else {
            throw new Error(loginResponse.message || 'Login failed');
        }
    } catch (error: any) {
        console.error('Authentication error:', error);
        
        // Clear any stored tokens on error
        useCookie('authToken').value = null;
        useCookie('accessToken').value = null;
        
        await Swal.fire({
            icon: 'error',
            title: 'Authentication Error!',
            text: error.data?.message || error.message || 'Failed to authenticate. Please check your credentials.',
        });
    } finally {
        isLoading.value = false;
        loadingMessage.value = 'Authenticating...';
    }
};

// Language change function (if needed)
const changeLanguage = (item: any) => {
    store.setLocale(item.code);
};
</script>