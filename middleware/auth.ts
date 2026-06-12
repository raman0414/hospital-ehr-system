export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const user = useState('supabase-user')
  if (!user.value) {
    return navigateTo('/login')
  }
})
