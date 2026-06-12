import { createClient, type User } from '@supabase/supabase-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const publishableKey = config.public.supabasePublishableKey

  if (!url || !publishableKey) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const supabase = createClient(url, publishableKey)
  const user = useState<User | null>('supabase-user', () => null)

  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })

  return {
    provide: {
      supabase,
    },
  }
})
