<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :isOpen="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />
    <div class="lg:ml-64">
      <header class="bg-hospital-700 text-white shadow-md">
        <div class="flex items-center justify-between px-4 md:px-6 py-4">
          <div class="flex items-center">
            <!-- Hamburger - only visible on mobile when sidebar is closed -->
            <button
              v-if="!sidebarOpen"
              @click="sidebarOpen = true"
              class="lg:hidden text-white mr-4 p-1"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold">MedCare EHR</h1>
              <p class="text-hospital-200 text-sm hidden sm:block">Hospital Electronic Health Record System</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm hidden md:block">{{ userName }}</span>
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="bg-hospital-600 hover:bg-hospital-500 px-4 py-2 rounded-md text-sm transition-colors font-medium disabled:opacity-50"
            >
              {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
        </div>
      </header>
      <main class="p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const isLoggingOut = ref(false)
const { user, signOut } = useAuth()

onMounted(() => {
  // On desktop (lg+), sidebar should be open by default
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true
  }
})

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email || 'User'
})

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await signOut()
  } finally {
    isLoggingOut.value = false
  }
}
</script>
