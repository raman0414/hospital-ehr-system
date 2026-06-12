<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Medications</h1>
      <p class="text-gray-600 mt-2">Manage patient prescriptions and medications</p>
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
              {{ patient.name }} - {{ patient.hospitalRoom }}
            </option>
          </select>
        </div>
        <button @click="openModal" class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Medication
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <LoadingSpinner
        :loading="isLoading"
        :empty="filteredMedications.length === 0 && !isLoading"
        empty-title="No Medications"
        empty-message="Start by adding a medication for a patient"
        empty-action="Add Medication"
        @empty-action="openModal"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Medication</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dosage</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Frequency</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="med in filteredMedications" :key="med.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ getPatientName(med.patientId) }}</div>
                    <div class="text-xs text-gray-500">{{ getPatientRoom(med.patientId) }}</div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ med.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ med.dosage }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ med.frequency }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ med.startDate }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <span v-if="med.endDate">{{ med.endDate }}</span>
                  <span v-else class="text-gray-400 italic">Ongoing</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ med.prescribingDoctor }}</td>
                <td class="px-4 py-3 text-sm">
                  <button @click="deleteMed(med.id)" class="text-red-600 hover:text-red-800 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingSpinner>
    </div>

    <!-- Add Medication Modal -->
    <Modal :isOpen="isModalOpen" title="Add Medication" @close="closeModal">
      <form @submit.prevent="saveMedication" class="space-y-6">
        <div v-if="formError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ formError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
            <select v-model="formData.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500">
              <option value="">Select Patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patient.name }} - {{ patient.hospitalRoom }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
            <input v-model="formData.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., Amoxicillin" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
            <input v-model="formData.dosage" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 500mg" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
            <input v-model="formData.frequency" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., Twice a day" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
            <input v-model="formData.startDate" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input v-model="formData.endDate" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Prescribing Doctor *</label>
            <input v-model="formData.prescribingDoctor" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="Dr. Smith" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea v-model="formData.notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="Take with food..."></textarea>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" @click="closeModal" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            @click="saveMedication"
            :disabled="isSaving"
            class="px-6 py-2 bg-hospital-600 hover:bg-hospital-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Medication' }}
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
  title: 'Medications - MedCare EHR'
})

const { patients, isLoaded: patientsLoaded, loadPatients } = usePatients()
const {
  isLoaded: medicationsLoaded,
  isLoading,
  errorMessage,
  loadMedications,
  addMedication,
  deleteMedication: deleteMedRecord,
  getAllMedications
} = useMedications()

const route = useRoute()
const isModalOpen = ref(false)
const isSaving = ref(false)
const formError = ref('')
const selectedPatientId = ref('')

onMounted(async () => {
  if (!patientsLoaded.value) {
    await loadPatients()
  }
  if (!medicationsLoaded.value) {
    await loadMedications()
  }

  if (route.query.patientId) {
    selectedPatientId.value = route.query.patientId as string
    formData.patientId = selectedPatientId.value
  }
})

const formData = reactive({
  patientId: '',
  name: '',
  dosage: '',
  frequency: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  prescribingDoctor: '',
  notes: ''
})

const filteredMedications = computed(() => {
  let result = getAllMedications.value

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
  return patient?.hospitalRoom || ''
}

const openModal = () => {
  formError.value = ''
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
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    prescribingDoctor: '',
    notes: ''
  })
}

const saveMedication = async () => {
  formError.value = ''

  if (!formData.patientId || !formData.name || !formData.dosage || !formData.frequency || !formData.startDate || !formData.prescribingDoctor) {
    formError.value = 'Please fill out all required fields.'
    return
  }

  isSaving.value = true
  try {
    await addMedication({
      patientId: formData.patientId,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      prescribingDoctor: formData.prescribingDoctor,
      notes: formData.notes
    })
    closeModal()
  } catch (error: any) {
    formError.value = error.message || 'Unable to save medication.'
  } finally {
    isSaving.value = false
  }
}

const deleteMed = async (id: string) => {
  if (confirm('Are you sure you want to delete this medication record?')) {
    await deleteMedRecord(id)
  }
}
</script>
