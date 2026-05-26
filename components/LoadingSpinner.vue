<template>
  <div v-if="loading" class="space-y-4">
    <div class="animate-pulse flex space-x-4">
      <div class="rounded-full bg-gray-200 h-10 w-10"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div class="animate-pulse flex space-x-4">
      <div class="rounded-full bg-gray-200 h-10 w-10"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
  <div v-else-if="empty" class="text-center py-12">
    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
    </svg>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ emptyTitle }}</h3>
    <p class="text-gray-600 mb-6">{{ emptyMessage }}</p>
    <button
      v-if="emptyAction"
      @click="$emit('emptyAction')"
      class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      {{ emptyAction }}
    </button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  empty?: boolean
  emptyTitle?: string
  emptyMessage?: string
  emptyAction?: string
  iconPath?: string
}>()

defineEmits<{
  emptyAction: []
}>()
</script>
