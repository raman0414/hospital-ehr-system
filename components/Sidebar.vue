<template>
  <!-- Mobile overlay backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
    @click="$emit('toggle')"
  ></div>

  <aside :class="[
    'fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-hospital-800 text-white',
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    <div class="h-full w-64 flex flex-col">
      <div class="h-full px-4 py-6 overflow-y-auto">
        <!-- Close button on mobile -->
        <div class="flex items-center justify-between mb-8 lg:justify-center">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-hospital-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="ml-3 text-xl font-bold">MedCare</span>
          </div>
          <!-- X button to close sidebar on mobile -->
          <button class="lg:hidden p-1 rounded-md hover:bg-hospital-700 transition-colors" @click="$emit('toggle')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="space-y-2">
          <NuxtLink to="/dashboard" @click="closeOnMobile" class="flex items-center p-3 rounded-lg hover:bg-hospital-700 transition-colors group" active-class="bg-hospital-700">
            <svg class="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="ml-3">Dashboard</span>
          </NuxtLink>

          <NuxtLink to="/patients" @click="closeOnMobile" class="flex items-center p-3 rounded-lg hover:bg-hospital-700 transition-colors group" active-class="bg-hospital-700">
            <svg class="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="ml-3">Patient List</span>
          </NuxtLink>

          <NuxtLink to="/vital-signs" @click="closeOnMobile" class="flex items-center p-3 rounded-lg hover:bg-hospital-700 transition-colors group" active-class="bg-hospital-700">
            <svg class="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="ml-3">Vital Signs</span>
          </NuxtLink>
        </nav>

        <div class="mt-auto pt-8">
          <div class="border-t border-hospital-700 pt-4">
            <div class="flex items-center px-3 py-2">
              <div class="w-8 h-8 bg-hospital-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">Staff Portal</p>
                <p class="text-xs text-gray-400">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const closeOnMobile = () => {
  // Only close on small screens
  if (window.innerWidth < 1024) {
    emit('toggle')
  }
}
</script>
