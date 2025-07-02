<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
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
                    class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"
                    ></div>
                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">                       
                        <div class="hidden w-full max-w-[500px] lg:block">
                            <img src="/assets/images/auth/register.svg" alt="Cover Image" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="w-full max-w-[440px] lg:mt-10">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Enter your username and password to register</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="handleSubmit">
                            <div>
                                <label for="Username">Username</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Username" 
                                        type="text" 
                                        v-model="formData.username"
                                        placeholder="Enter Username" 
                                        class="form-input ps-10 placeholder:text-white-dark" 
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-user :fill="true" />
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
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label for="Role">Role</label>
                                <div class="relative text-white-dark">
                                    <select 
                                        id="Role" 
                                        v-model="formData.role"
                                        class="form-select ps-10 placeholder:text-white-dark"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>                           
                            <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                Sign Up
                            </button>
                        </form>
                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.DIKA All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
    username: '',
    password: '',
    role: 'user'
});

const handleSubmit = async () => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData.value),
        });

        const data = await response.json();

        if (data.status === 200) {
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Registration successful!',
                timer: 1500,
                showConfirmButton: false
            });
            router.push('/auth/cover-login');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.message,
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred during registration',
        });
    }
};

definePageMeta({
    layout: 'auth-layout',
});
</script>