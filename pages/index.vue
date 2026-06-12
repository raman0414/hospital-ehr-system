<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

onMounted(async () => {
  const { user } = useAuth()
  await navigateTo(user.value ? '/dashboard' : '/login', { replace: true })
})
</script>
