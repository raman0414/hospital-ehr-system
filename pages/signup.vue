<template>
  <div class="min-h-screen bg-gradient-to-br from-hospital-700 to-hospital-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-hospital-100 rounded-full mb-4">
            <svg class="w-12 h-12 text-hospital-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Create Staff Account</h1>
          <p class="text-gray-600 mt-2">Register for the MedCare EHR staff portal</p>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">
            {{ successMessage }}
          </div>

          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input id="fullName" v-model.trim="form.fullName" type="text" required autocomplete="name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input id="email" v-model.trim="form.email" type="email" required autocomplete="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="password" v-model="form.password" type="password" required minlength="8" autocomplete="new-password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            <p class="mt-1 text-xs text-gray-500">Use at least 8 characters.</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" required minlength="8" autocomplete="new-password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <button type="submit" :disabled="isLoading || !!successMessage" class="w-full bg-hospital-600 hover:bg-hospital-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="font-medium text-hospital-600 hover:text-hospital-700">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Sign Up - MedCare EHR'
})

const { user, signUp } = useAuth()
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  try {
    const data = await signUp(form.email, form.password, form.fullName)
    if (data.session) {
      await navigateTo('/dashboard')
      return
    }
    successMessage.value = 'Account created. Check your email to confirm your account before signing in.'
  } catch (error: any) {
    errorMessage.value = error.message || 'Unable to create the account. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
