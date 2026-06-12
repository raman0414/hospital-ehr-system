<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Lab Results</h1>
      <p class="text-gray-600 mt-2">Manage patient laboratory test results</p>
    </div>

    <div v-if="errorMessage" class="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
      {{ errorMessage }}
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1">
          <label for="patient-select" class="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
          <select
            id="patient-select"
            v-model="selectedPatientId"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500 bg-white"
          >
            <option value="">All Patients</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} - {{ patient.hospitalRoom }} (Bed {{ patient.bedNumber }})
            </option>
          </select>
        </div>
        <button @click="openModal" class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Record Lab Result
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <LoadingSpinner
        :loading="isLoading"
        :empty="filteredLabResults.length === 0 && !isLoading"
        empty-title="No Lab Results"
        empty-message="Start by adding a lab result for a patient"
        empty-action="Record Lab Result"
        @empty-action="openModal"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test Name</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Result</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ref Range</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="lab in filteredLabResults" :key="lab.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-sm text-gray-900">{{ lab.date }}</td>
                <td class="px-4 py-3">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ getPatientName(lab.patientId) }}</div>
                    <div class="text-xs text-gray-500">{{ getPatientRoom(lab.patientId) }}</div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ lab.testName }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="font-semibold text-hospital-700">{{ lab.resultValue }}</span>
                  <span v-if="lab.unit" class="text-gray-500 ml-1">{{ lab.unit }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ lab.referenceRange || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm">
                  <button @click="editLabResult(lab)" class="text-hospital-600 hover:text-hospital-800 font-medium transition-colors mr-3">
                    Edit
                  </button>
                  <button @click="deleteLab(lab.id)" class="text-red-600 hover:text-red-800 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingSpinner>
    </div>

    <!-- Record / Edit Lab Result Modal -->
    <Modal :isOpen="isModalOpen" :title="editId ? 'Edit Lab Result' : 'Record Lab Result'" @close="closeModal">
      <form @submit.prevent="saveLabResult" class="space-y-6">
        <div v-if="formError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ formError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
            <select v-model="formData.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500">
              <option value="">Select Patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patient.name }} - {{ patient.hospitalRoom }} (Bed {{ patient.bedNumber }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
            <input v-model="formData.testName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., Complete Blood Count" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input v-model="formData.date" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Result Value *</label>
            <input v-model="formData.resultValue" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 14.5 or Positive" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <input v-model="formData.unit" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., g/dL" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reference Range</label>
            <input v-model="formData.referenceRange" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 13.8 - 17.2" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea v-model="formData.notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="Any additional observations..."></textarea>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" @click="closeModal" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            @click="saveLabResult"
            :disabled="isSaving"
            class="px-6 py-2 bg-hospital-600 hover:bg-hospital-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : (editId ? 'Update Lab Result' : 'Save Lab Result') }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Lab Results - MedCare EHR'
})

const { patients, isLoaded: patientsLoaded, loadPatients } = usePatients()
const {
  isLoaded: labResultsLoaded,
  isLoading,
  errorMessage,
  loadLabResults,
  addLabResult,
  updateLabResult,
  deleteLabResult: deleteLabRecord,
  getAllLabResults
} = useLabResults()

const route = useRoute()
const isModalOpen = ref(false)
const isSaving = ref(false)
const formError = ref('')
const editId = ref('')
const selectedPatientId = ref('')

onMounted(async () => {
  if (!patientsLoaded.value) {
    await loadPatients()
  }
  if (!labResultsLoaded.value) {
    await loadLabResults()
  }

  if (route.query.patientId) {
    selectedPatientId.value = route.query.patientId as string
    formData.patientId = selectedPatientId.value
  }
})

const formData = reactive({
  patientId: '',
  testName: '',
  date: new Date().toISOString().split('T')[0],
  resultValue: '',
  referenceRange: '',
  unit: '',
  notes: ''
})

const filteredLabResults = computed(() => {
  let result = getAllLabResults.value

  if (selectedPatientId.value) {
    result = result.filter(v => v.patientId === selectedPatientId.value)
  }

  return result
})

const getPatientName = (patientId: string) => {
  const patient = patients.value.find(p => p.id === patientId)
  return patient?.name || 'Unknown'
}

const getPatientRoom = (patientId: string) => {
  const patient = patients.value.find(p => p.id === patientId)
  return patient ? `${patient.hospitalRoom} - Bed ${patient.bedNumber}` : ''
}

const openModal = () => {
  formError.value = ''
  editId.value = ''
  resetForm()
  isModalOpen.value = true
}

const editLabResult = (lab: any) => {
  formError.value = ''
  editId.value = lab.id
  Object.assign(formData, {
    patientId: lab.patientId,
    testName: lab.testName,
    date: lab.date,
    resultValue: lab.resultValue,
    referenceRange: lab.referenceRange || '',
    unit: lab.unit || '',
    notes: lab.notes || ''
  })
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formError.value = ''
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    patientId: selectedPatientId.value || '',
    testName: '',
    date: new Date().toISOString().split('T')[0],
    resultValue: '',
    referenceRange: '',
    unit: '',
    notes: ''
  })
}

const saveLabResult = async () => {
  formError.value = ''

  if (!formData.patientId || !formData.testName || !formData.date || !formData.resultValue) {
    formError.value = 'Please fill out all required fields.'
    return
  }

  isSaving.value = true
  try {
    const payload = {
      patientId: formData.patientId,
      testName: formData.testName,
      date: formData.date,
      resultValue: formData.resultValue,
      referenceRange: formData.referenceRange,
      unit: formData.unit,
      notes: formData.notes
    }

    if (editId.value) {
      await updateLabResult(editId.value, payload)
    } else {
      await addLabResult(payload)
    }
    closeModal()
  } catch (error: any) {
    formError.value = error.message || 'Unable to save lab result.'
  } finally {
    isSaving.value = false
  }
}

const deleteLab = async (id: string) => {
  if (confirm('Are you sure you want to delete this lab result record?')) {
    await deleteLabRecord(id)
  }
}
</script>
