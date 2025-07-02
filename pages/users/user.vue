<template>
  <div>
    <div class="panel mt-6 pb-0">
      <div class="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 class="text-lg font-semibold dark:text-white-light drop-shadow-[0px_10px_5px_rgba(0,0,0,0.6)]">List Users</h5>
        <div class="ml-auto">
          <input
            type="text"
            v-model="search1"
            placeholder="🔍 Search Users"
            class="form-input w-auto"
          />
        </div> 
        <button 
          @click="openCapabilityModal()" 
          class="btn btn-success uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        >
          Add Capability
        </button> 
        <button 
          @click="openModal('add')" 
          class="btn btn-primary uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        >
          Add Users
        </button>   
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Data table -->
      <div v-else class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="datatable1Cols"
          :totalRows="rows?.length"
          :sortable="true"
          sortColumn="username"
          :search="search1"
          skin="whitespace-nowrap table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #username="data">
            <div class="flex w-max items-center">
              {{ data.value.username }}
            </div>
          </template>
          <template #status="data">
            <div class="flex w-max items-center">
              <span :class="['badge', data.value.status === 1 ? 'bg-success' : 'bg-secondary']">
                {{ data.value.status === 1 ? 'Admin' : 'User' }}
              </span>
            </div>
          </template>
          <template #action="data">
            <div class="flex space-x-2">
              <button type="button" @click="getUserAndOpenModal(data.value)" class="btn btn-warning">Edit</button> 
              <button type="button" @click="openUserCapabilitiesModal(data.value)" class="btn btn-info">Edit Capabilities</button>
              <button type="button" @click="deleteUser(data.value.id)" class="btn btn-danger">Delete</button>
            </div>
          </template>            
        </vue3-datatable>
      </div>
    </div>     

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="relative w-full max-w-[600px] rounded-lg bg-white p-8 shadow-lg dark:bg-black/70">
        <button 
          @click="closeModal" 
          class="absolute end-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300"
        >
          &times;
        </button>

        <div class="space-y-6">
          <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
            {{ modalMode === 'add' ? 'Add User' : 'Edit User' }}
          </h1>
          <p class="text-base font-bold leading-normal text-white-dark">
            {{ modalMode === 'add' ? 'Enter user details to create a new user' : 'Update user details' }}
          </p>

          <form class="space-y-5 dark:text-white" @submit.prevent="handleSubmit">
            <div>
              <label for="Username">Username</label>
              <div class="relative text-white-dark">
                <input 
                  id="Username" 
                  type="text" 
                  v-model="formData.username"
                  placeholder="Enter Username" 
                  class="form-input ps-4 pe-10 placeholder:text-white-dark" 
                  autocomplete="off"
                />
                <span class="absolute end-4 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
            </div>                            
            <div>
              <label for="Password">Password {{ modalMode === 'edit' ? '(Leave blank to keep current)' : '' }}</label>
              <div class="relative text-white-dark">
                <input 
                  id="Password" 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="formData.password"
                  :placeholder="modalMode === 'edit' ? '' : 'Enter Password'"
                  class="form-input ps-4 pe-10 placeholder:text-white-dark" 
                />
                <button 
                  type="button"
                  @click="togglePassword"
                  class="absolute end-4 top-1/2 -translate-y-1/2 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label for="Role">Role</label>
              <div class="relative text-white-dark">
                <select 
                  id="Role" 
                  v-model="formData.role"
                  class="form-select ps-4 pe-10 placeholder:text-white-dark"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>                           
            <button type="submit" class="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
              {{ modalMode === 'add' ? 'Save' : 'Update' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Capability Modal -->
    <div v-if="isCapabilityModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="relative w-full max-w-[600px] rounded-lg bg-white p-8 shadow-lg dark:bg-black/70">
        <button 
          @click="closeCapabilityModal" 
          class="absolute end-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300"
        >
          &times;
        </button>

        <div class="space-y-6">
          <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
            Add Capability
          </h1>
          <p class="text-base font-bold leading-normal text-white-dark">
            Enter capability name to create a new capability
          </p>

          <form class="space-y-5 dark:text-white" @submit.prevent="handleCapabilitySubmit">
            <div>
              <label for="Capability">Capability Name</label>
              <div class="relative text-white-dark">
                <input 
                  id="Capability" 
                  type="text" 
                  v-model="capabilityForm.capability"
                  placeholder="Enter Capability Name (e.g. data-bapenda)" 
                  class="form-input ps-4 pe-10 placeholder:text-white-dark" 
                  autocomplete="off"
                />
              </div>
            </div>                           
            <button type="submit" class="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
              Save
            </button>
          </form>

          <!-- Capabilities List -->
          <div class="mt-8">
            <h2 class="text-xl font-bold mb-4">Existing Capabilities</h2>
            <div v-if="loadingCapabilities" class="flex justify-center items-center p-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="capabilities.length === 0" class="text-center py-4 text-gray-500">
              No capabilities found
            </div>
            <div v-else class="space-y-2">
              <div v-for="capability in capabilities" :key="capability.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span>{{ capability.capability }}</span>
                <button @click="deleteCapability(capability.id)" class="btn btn-sm btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Capabilities Modal -->
    <div v-if="isUserCapabilitiesModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="relative w-full max-w-[600px] rounded-lg bg-white p-8 shadow-lg dark:bg-black/70">
        <button 
          @click="closeUserCapabilitiesModal" 
          class="absolute end-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300"
        >
          &times;
        </button>

        <div class="space-y-6">
          <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
            User Capabilities
          </h1>
          <p class="text-base font-bold leading-normal text-white-dark">
            Manage capabilities for user: <span class="text-blue-500">{{ selectedUser?.username }}</span>
          </p>

          <div v-if="loadingUserCapabilities || loadingCapabilities" class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          <div v-else>
            <!-- Assign new capability -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="font-bold mb-3">Assign New Capability</h3>
              <div class="flex space-x-2">
                <select v-model="selectedCapability" class="form-select flex-grow">
                  <option value="">Select a capability</option>
                  <option v-for="cap in availableCapabilities" :key="cap.id" :value="cap.capability">
                    {{ cap.capability }}
                  </option>
                </select>
                <button 
                  @click="assignCapability" 
                  class="btn btn-success" 
                  :disabled="!selectedCapability"
                >
                  Assign
                </button>
              </div>
            </div>

            <!-- Current capabilities -->
            <div>
              <h3 class="font-bold mb-3">Current Capabilities</h3>
              <div v-if="userCapabilities.length === 0" class="text-center py-4 text-gray-500">
                No capabilities assigned to this user
              </div>
              <div v-else class="space-y-2">
                <div v-for="userCap in userCapabilities" :key="userCap.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <span>{{ userCap.capability_name }}</span>
                  <button @click="removeCapability(userCap.id)" class="btn btn-sm btn-danger">
                    Remove
                  </button>
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
import { ref, onMounted, watch, computed } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index';

useHead({ title: 'List Users' });

const store = useAppStore();
const router = useRouter();
const search1 = ref(''); 
const users = ref([]);  
const loading = ref(false);
const error = ref(null);
const isModalOpen = ref(false);
const modalMode = ref('add');
const showPassword = ref(false);

// Capabilities state
const isCapabilityModalOpen = ref(false);
const capabilityForm = ref({
  capability: ''
});
const capabilities = ref([]);
const loadingCapabilities = ref(false);

// User capabilities state
const isUserCapabilitiesModalOpen = ref(false);
const selectedUser = ref(null);
const userCapabilities = ref([]);
const loadingUserCapabilities = ref(false);
const selectedCapability = ref('');

const availableCapabilities = computed(() => {
  if (!userCapabilities.value || !capabilities.value) return [];
  
  // Filter out capabilities that are already assigned to the user
  const assignedCapabilities = userCapabilities.value.map(uc => uc.capability);
  return capabilities.value.filter(cap => !assignedCapabilities.includes(cap.capability));
});

definePageMeta({
  middleware: 'auth'
});

const formData = ref({
  id: null,
  username: '',
  password: '',
  role: 'user'
});

// Capability functions
const openCapabilityModal = () => {
  isCapabilityModalOpen.value = true;
  fetchCapabilities();
};

const closeCapabilityModal = () => {
  isCapabilityModalOpen.value = false;
  capabilityForm.value.capability = '';
};

const handleCapabilitySubmit = async () => {
  if (!capabilityForm.value.capability) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Capability name is required',
    });
    return;
  }

  try {
    const response = await fetch('/api/auth/capabilities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(capabilityForm.value),
    });

    const data = await response.json();

    if (data.status === 200) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      capabilityForm.value.capability = '';
      fetchCapabilities();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Operation error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred during the operation',
    });
  }
};

const fetchCapabilities = async () => {
  loadingCapabilities.value = true;
  try {
    const response = await fetch('/api/auth/capabilities');
    if (!response.ok) {
      throw new Error('Failed to fetch capabilities');
    }
    capabilities.value = await response.json();
  } catch (err) {
    console.error('Error fetching capabilities:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to fetch capabilities',
    });
  } finally {
    loadingCapabilities.value = false;
  }
};

const deleteCapability = async (id) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will also remove this capability from all users.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const response = await fetch('/api/auth/capabilities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Capability has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchCapabilities();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.message,
        });
      }
    }
  } catch (error) {
    console.error('Delete error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred while deleting the capability',
    });
  }
};

// User capabilities functions
const openUserCapabilitiesModal = async (user) => {
  selectedUser.value = user;
  isUserCapabilitiesModalOpen.value = true;
  selectedCapability.value = '';
  await Promise.all([fetchUserCapabilities(user.id), fetchCapabilities()]);
};

const closeUserCapabilitiesModal = () => {
  isUserCapabilitiesModalOpen.value = false;
  selectedUser.value = null;
  userCapabilities.value = [];
  selectedCapability.value = '';
};

const fetchUserCapabilities = async (userId) => {
  loadingUserCapabilities.value = true;
  try {
    const response = await fetch(`/api/auth/user-capabilities?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user capabilities');
    }
    userCapabilities.value = await response.json();
  } catch (err) {
    console.error('Error fetching user capabilities:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to fetch user capabilities',
    });
  } finally {
    loadingUserCapabilities.value = false;
  }
};

const assignCapability = async () => {
  if (!selectedCapability.value || !selectedUser.value) return;

  try {
    const response = await fetch('/api/auth/user-capabilities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: selectedUser.value.id,
        capability: selectedCapability.value
      }),
    });

    const data = await response.json();

    if (data.status === 200) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      selectedCapability.value = '';
      fetchUserCapabilities(selectedUser.value.id);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Operation error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred during the operation',
    });
  }
};

const removeCapability = async (id) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      const response = await fetch('/api/auth/user-capabilities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Capability has been removed from user.',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchUserCapabilities(selectedUser.value.id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.message,
        });
      }
    }
  } catch (error) {
    console.error('Remove error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred while removing the capability',
    });
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const getUserAndOpenModal = async (user) => {
  try {
    loading.value = true;
    const response = await fetch(`/api/auth/user/${user.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    const userData = await response.json();
    
    formData.value = {
      id: userData.id,
      username: userData.username,
      password: '',
      role: userData.status === 1 ? 'admin' : 'user'
    };
    
    modalMode.value = 'edit';
    isModalOpen.value = true;
  } catch (err) {
    console.error('Error fetching user details:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to fetch user details',
    });
  } finally {
    loading.value = false;
  }
};

const openModal = (mode, user = null) => {
  modalMode.value = mode;
  if (mode === 'edit' && user) {
    formData.value = {
      id: user.id,
      username: user.username,
      password: '',
      role: user.status === 1 ? 'admin' : 'user'
    };
  } else {
    formData.value = {
      id: null,
      username: '',
      password: '',
      role: 'user'
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  formData.value = {
    id: null,
    username: '',
    password: '',
    role: 'user'
  };
  showPassword.value = false;
};

const handleSubmit = async () => {
  try {
    const method = modalMode.value === 'add' ? 'POST' : 'PUT';
    const response = await fetch('/api/auth/user', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    const data = await response.json();

    if (data.status === 200) {
      // Get current user info to maintain role
      const token = useCookie('authToken').value;
      if (token) {
        const [, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        store.setUserRole(decodedPayload.role);
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });
      
      closeModal();
      await fetchUsers();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Operation error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred during the operation',
    });
  }
};

const deleteUser = async (id) => {
  if (!id) {
    console.error('No user ID provided for deletion');
    return;
  }

  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      // Get current user info before deletion
      const token = useCookie('authToken').value;
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const currentUserRole = decodedPayload.role;

      const response = await fetch('/api/auth/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.status === 200) {
        // Maintain current user's role
        store.setUserRole(currentUserRole);
        
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
        
        await fetchUsers();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.message,
        });
      }
    }
  } catch (error) {
    console.error('Delete error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred while deleting the user',
    });
  }
};

const datatable1Cols = ref([
  { field: 'username', title: 'Username' },
  { field: 'status', title: 'Role' },  
  { field: 'action', title: 'Action' },
]);

onMounted(async () => {
  await fetchUsers();
  // initialize capabilities if user is admin
  if (store.userRole === 'admin') {
    await fetchCapabilities();
  }
});

async function fetchUsers() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('/api/auth/user');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || 'Failed to fetch users');
    }
    users.value = await response.json();
  } catch (err) {
    error.value = err.message || 'Failed to load data. Please try again later.';
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
}

const rows = ref([]);
watch(users, () => {
  rows.value = users.value.map((user) => ({
    id: user.id,
    username: user.username,
    status: user.status,
    action: '',
  }));
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.btn {
  @apply px-4 py-2 rounded-lg transition-all duration-200 font-medium;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.btn-warning {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}

.btn-success {
  @apply bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline-danger {
  @apply border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white;
}

.btn-outline-primary {
  @apply border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white;
}

.btn-sm {
  @apply px-3 py-1 text-sm;
}

.form-input {
  @apply border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.badge {
  @apply px-2 py-1 rounded-full text-white text-sm font-medium;
}

.bg-success {
  @apply bg-green-500;
}

.bg-warning {
  @apply bg-yellow-500;
}

.bg-danger {
  @apply bg-red-500;
}

.bg-info {
  @apply bg-blue-500;
}

.bg-secondary {
  @apply bg-gray-500;
}

.bg-dark {
  @apply bg-gray-800;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>