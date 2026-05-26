<template>
  <div class="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" :class="borderColor">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-gray-500 text-sm font-medium">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-2" v-if="!loading">
          {{ value }}
        </p>
        <div v-else class="mt-2">
          <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <p v-if="subtitle && !loading" class="text-sm mt-2" :class="subtitleColor">
          {{ subtitle }}
        </p>
      </div>
      <div class="rounded-full p-4" :class="iconBgColor" v-if="icon">
        <component :is="icon" :class="['w-8 h-8', iconColor]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'gray'

const props = defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: any
  color?: ColorType
  loading?: boolean
}>()

const colorClasses = {
  blue: {
    border: 'border-hospital-500',
    iconBg: 'bg-hospital-100',
    icon: 'text-hospital-600',
    subtitle: 'text-hospital-600'
  },
  green: {
    border: 'border-green-500',
    iconBg: 'bg-green-100',
    icon: 'text-green-600',
    subtitle: 'text-green-600'
  },
  yellow: {
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    subtitle: 'text-yellow-600'
  },
  red: {
    border: 'border-red-500',
    iconBg: 'bg-red-100',
    icon: 'text-red-600',
    subtitle: 'text-red-600'
  },
  gray: {
    border: 'border-gray-500',
    iconBg: 'bg-gray-100',
    icon: 'text-gray-600',
    subtitle: 'text-gray-600'
  }
}

const borderColor = computed(() => colorClasses[props.color || 'blue'].border)
const iconBgColor = computed(() => colorClasses[props.color || 'blue'].iconBg)
const iconColor = computed(() => colorClasses[props.color || 'blue'].icon)
const subtitleColor = computed(() => colorClasses[props.color || 'blue'].subtitle)
</script>
