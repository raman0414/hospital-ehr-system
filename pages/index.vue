<template>
  <div></div>
</template>

<script setup lang="ts">
onMounted(() => {
  const isAuthenticated = localStorage.getItem('ehr_auth')
  if (isAuthenticated) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>
