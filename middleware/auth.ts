export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const isAuthenticated = localStorage.getItem('ehr_auth')
    if (!isAuthenticated && to.path !== '/login') {
      return navigateTo('/login')
    }
    if (isAuthenticated && to.path === '/login') {
      return navigateTo('/dashboard')
    }
  }
})
