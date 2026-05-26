<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome back! Here's an overview of your hospital today.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        title="Total Patients"
        :value="stats.totalPatients"
        subtitle="+12% from last month"
        :color="'blue'"
        :loading="isLoading"
      >
        <template #icon>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </template>
      </Card>

      <Card
        title="Admitted Today"
        :value="stats.admittedToday"
        subtitle="New admissions"
        :color="'green'"
        :loading="isLoading"
      >
        <template #icon>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </template>
      </Card>

      <Card
        title="ICU Patients"
        :value="stats.icuPatients"
        subtitle="In intensive care"
        :color="'red'"
        :loading="isLoading"
      >
        <template #icon>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </template>
      </Card>

      <Card
        title="Nurses On Duty"
        :value="stats.nursesOnDuty"
        subtitle="All shifts covered"
        :color="'yellow'"
        :loading="isLoading"
      >
        <template #icon>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Recent Patients</h2>
        <LoadingSpinner
          :loading="isLoading"
          :empty="recentPatients.length === 0"
          empty-title="No Patients Yet"
          empty-message="Start by adding your first patient"
          empty-action="Add Patient"
          @empty-action="goToPatientList"
          icon-path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        >
          <div class="space-y-4">
            <div
              v-for="patient in recentPatients"
              :key="patient.id"
              class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              @click="goToPatient(patient.id)"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-hospital-100 rounded-full flex items-center justify-center">
                  <span class="text-hospital-700 font-semibold">{{ patient.name.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ patient.name }}</p>
                  <p class="text-sm text-gray-500">{{ patient.hospitalRoom }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ patient.admittingDiagnoses.split(',')[0] }}</p>
                <p class="text-xs text-gray-500">{{ patient.patientIdNumber }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button @click="goToPatientList" class="text-hospital-600 hover:text-hospital-700 font-medium text-sm">
              View All Patients
            </button>
          </div>
        </LoadingSpinner>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <button @click="goToPatientList" class="p-6 bg-hospital-50 hover:bg-hospital-100 rounded-lg transition-colors text-left">
            <svg class="w-8 h-8 text-hospital-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <p class="font-semibold text-gray-900">Add Patient</p>
            <p class="text-sm text-gray-600 mt-1">Register new admission</p>
          </button>

          <button @click="goToVitalSigns" class="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <svg class="w-8 h-8 text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="font-semibold text-gray-900">Vital Signs</p>
            <p class="text-sm text-gray-600 mt-1">Record patient vitals</p>
          </button>

          <button @click="goToPatientList" class="p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left">
            <svg class="w-8 h-8 text-yellow-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p class="font-semibold text-gray-900">Patient Records</p>
            <p class="text-sm text-gray-600 mt-1">View all records</p>
          </button>

          <button class="p-6 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
            <svg class="w-8 h-8 text-red-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p class="font-semibold text-gray-900">Alerts</p>
            <p class="text-sm text-gray-600 mt-1">Critical notifications</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - MedCare EHR'
})

const {
  patients,
  isLoaded,
  isLoading,
  initializeMockData,
  getDashboardStats,
  getRecentPatients
} = usePatients()

const stats = computed(() => getDashboardStats.value)
const recentPatients = computed(() => getRecentPatients.value)

onMounted(async () => {
  if (!isLoaded.value) {
    await initializeMockData()
  }
})

const goToPatient = (id: string) => {
  navigateTo(`/patients/${id}`)
}

const goToPatientList = () => {
  navigateTo('/patients')
}

const goToVitalSigns = () => {
  navigateTo('/vital-signs')
}
</script>
