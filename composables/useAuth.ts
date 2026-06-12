import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const { $supabase } = useNuxtApp()
  const user = useState<User | null>('supabase-user', () => null)

  const signIn = async (email: string, password: string) => {
    const { error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await $supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/login')
  }

  return {
    user,
    signIn,
    signUp,
    signOut,
  }
}
