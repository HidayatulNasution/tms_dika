<template>
    <div>
        <!-- Tombol untuk membuka modal -->
        <button 
            @click="openModal" 
            class="btn btn-gradient uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        >
            Add Users
        </button>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="relative w-full max-w-[600px] rounded-lg bg-white p-8 shadow-lg dark:bg-black/70">
                <!-- Tombol Close Modal -->
                <button 
                    @click="closeModal" 
                    class="absolute end-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300"
                >
                    &times;
                </button>

                <!-- Konten Modal -->
                <div class="space-y-6">
                    <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                    <p class="text-base font-bold leading-normal text-white-dark">Enter your username and password to register</p>

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
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();

// State untuk mengontrol modal
const isModalOpen = ref(false);

// Data formulir
const formData = ref({
    username: '',
    password: '',
    role: 'user'
});

// Fungsi untuk membuka dan menutup modal
const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// Handle submit form
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
            closeModal(); // Tutup modal setelah berhasil
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
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>