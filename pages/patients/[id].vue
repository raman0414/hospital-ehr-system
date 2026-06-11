<template>
  <div>
    <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Patient List
    </button>

    <div v-if="patient">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-hospital-100 rounded-full flex items-center justify-center mr-4">
            <span class="text-3xl font-bold text-hospital-700">{{ patient.name.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ patient.name }}</h1>
            <p class="text-gray-600">{{ patient.hospitalRoom }} | {{ patient.patientIdNumber }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-4 md:mt-0">
          <button @click="editPatient" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Edit Patient
          </button>
          <button @click="goToVitalSigns" class="bg-hospital-600 hover:bg-hospital-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Record Vitals
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Demographic Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p class="text-gray-900 font-medium">{{ patient.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                <p class="text-gray-900">{{ formatDate(patient.dateOfBirth) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Sex</label>
                <p class="text-gray-900">{{ patient.sex }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Marital Status</label>
                <p class="text-gray-900">{{ patient.maritalStatus }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <p class="text-gray-900">{{ patient.phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p class="text-gray-900">{{ patient.email }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p class="text-gray-900">{{ patient.address }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Country</label>
                <p class="text-gray-900">{{ patient.country }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Religion</label>
                <p class="text-gray-900">{{ patient.religion }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Medical Information
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Admitting Diagnoses</label>
                <p class="text-gray-900">{{ patient.admittingDiagnoses }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Final Diagnoses</label>
                <p class="text-gray-900">{{ patient.finalDiagnoses }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Health Insurance Provider</label>
                <p class="text-gray-900">{{ patient.healthInsuranceProvider }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Emergency Contact Number</label>
                <p class="text-gray-900">{{ patient.emergencyContactNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">History of Present Illness</label>
                <p class="text-gray-900">{{ patient.historyOfPresentIllness }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Parent/Guardian Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Parent's Name</label>
                <p class="text-gray-900">{{ patient.parentsName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Parent's Contact</label>
                <p class="text-gray-900">{{ patient.parentsContact }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">Parent's Address</label>
                <p class="text-gray-900">{{ patient.parentsAddress }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Hospital Details</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Hospital Room</label>
                <p class="text-gray-900 font-semibold text-lg">{{ patient.hospitalRoom }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Patient ID</label>
                <p class="text-gray-900">{{ patient.patientIdNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span
                  :class="[
                    'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                    patient.isICU ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ patient.isICU ? 'ICU Patient' : 'Active' }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Admitted Date</label>
                <p class="text-gray-900">{{ formatDate(patient.admittedDate) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Attending Staff</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Attending Physician</label>
                <p class="text-gray-900 font-medium">{{ patient.attendingPhysician }}</p>
              </div>
              <div class="border-t pt-4">
                <label class="block text-sm font-medium text-gray-500 mb-3">Nurse by Shift</label>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Morning:</span>
                    <span class="text-gray-900 text-sm">{{ patient.nurseByShift.morning || 'Not assigned' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Afternoon:</span>
                    <span class="text-gray-900 text-sm">{{ patient.nurseByShift.afternoon || 'Not assigned' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Night:</span>
                    <span class="text-gray-900 text-sm">{{ patient.nurseByShift.night || 'Not assigned' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-hospital-50 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <button @click="goToVitalSigns" class="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-hospital-100 transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span class="text-gray-900 font-medium">View Vital Signs</span>
              </button>
              <button class="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-hospital-100 transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span class="text-gray-900 font-medium">Lab Results</span>
              </button>
              <button class="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-hospital-100 transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-gray-900 font-medium">Medical Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
      <p class="text-gray-600 mb-6">The patient you're looking for doesn't exist or has been removed.</p>
      <button @click="goBack" class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        Back to Patient List
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Patient Details - MedCare EHR'
})

const route = useRoute()
const { patients, getPatient, initializeMockData, isLoaded } = usePatients()
const patient = getPatient(route.params.id as string)

onMounted(async () => {
  if (!isLoaded.value || patients.value.length === 0) {
    await initializeMockData()
  }
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  navigateTo('/patients')
}

const editPatient = () => {
  navigateTo(`/patients?id=${route.params.id}`)
}

const goToVitalSigns = () => {
  navigateTo(`/vital-signs?patientId=${route.params.id}`)
}
</script>
