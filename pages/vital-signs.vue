<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Vital Signs Monitoring</h1>
      <p class="text-gray-600 mt-2">Track and monitor patient vital signs</p>
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
        <div>
          <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
          <input
            id="date-filter"
            v-model="selectedDate"
            type="date"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500"
          />
        </div>
        <button @click="openModal" class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Record Vital Signs
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <LoadingSpinner
        :loading="isLoading"
        :empty="filteredVitalSigns.length === 0 && !isLoading"
        empty-title="No Vital Signs Records"
        empty-message="Start by recording vital signs for a patient"
        empty-action="Record Vital Signs"
        @empty-action="openModal"
        icon-path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wt<br/><span class="font-normal">(kg)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Temp<br/><span class="font-normal">(C)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BP<br/><span class="font-normal">(mmHg)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pulse<br/><span class="font-normal">(bpm)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resp<br/><span class="font-normal">(/min)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pain<br/><span class="font-normal">(0-10)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Intake<br/><span class="font-normal">(ml)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Output<br/><span class="font-normal">(ml)</span></th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IV Fluid</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="vital in filteredVitalSigns" :key="vital.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{{ vital.date }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{{ vital.time }}</td>
                <td class="px-4 py-3">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ getPatientName(vital.patientId) }}</div>
                    <div class="text-xs text-gray-500">{{ getPatientRoom(vital.patientId) }}</div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.weight }}</td>
                <td class="px-4 py-3 text-sm" :class="getTempColor(vital.temperature)">
                  {{ vital.temperature }}
                  <span v-if="vital.temperature > 37.5" class="ml-1 text-xs">(Fever)</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.bloodPressure }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.pulseRate }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.respirationRate }}</td>
                <td class="px-4 py-3">
                  <span :class="getPainColor(vital.pain)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ vital.pain }}/10
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.intake }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ vital.output }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 max-w-32 truncate">{{ vital.ivFluid }}</td>
                <td class="px-4 py-3 text-sm">
                  <button @click="deleteVitalSign(vital.id)" class="text-red-600 hover:text-red-800 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingSpinner>
    </div>

    <!-- Record Vital Signs Modal -->
    <Modal :isOpen="isModalOpen" title="Record Vital Signs" @close="closeModal">
      <form @submit.prevent="saveVitalSigns" class="space-y-6">
        <div v-if="formError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ formError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
            <select v-model="formData.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500">
              <option value="">Select Patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patient.name }} - {{ patient.hospitalRoom }} (Bed {{ patient.bedNumber }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input v-model="formData.date" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Time *</label>
            <input v-model="formData.time" type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input v-model.number="formData.weight" type="number" step="0.1" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 65.5" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Temperature (C)</label>
            <input v-model.number="formData.temperature" type="number" step="0.1" min="30" max="42" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 36.8" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (mmHg)</label>
            <input v-model="formData.bloodPressure" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 120/80" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pulse Rate (bpm)</label>
            <input v-model.number="formData.pulseRate" type="number" min="0" max="300" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 72" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Respiration Rate (/min)</label>
            <input v-model.number="formData.respirationRate" type="number" min="0" max="60" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 16" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pain Scale (0-10)</label>
            <input v-model.number="formData.pain" type="number" min="0" max="10" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="0 = No pain, 10 = Worst" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Intake (ml)</label>
            <input v-model.number="formData.intake" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Output (ml)</label>
            <input v-model.number="formData.output" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., 450" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stool</label>
            <select v-model="formData.stool" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500">
              <option value="">Select</option>
              <option value="Normal">Normal</option>
              <option value="Constipation">Constipation</option>
              <option value="Diarrhea">Diarrhea</option>
              <option value="None">None</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">IV Fluid</label>
            <input v-model="formData.ivFluid" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" placeholder="e.g., D5NS @ 100ml/hr" />
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" @click="closeModal" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            @click="saveVitalSigns"
            :disabled="isSaving"
            class="px-6 py-2 bg-hospital-600 hover:bg-hospital-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Vital Signs' }}
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
  title: 'Vital Signs - MedCare EHR'
})

const { patients, isLoaded: patientsLoaded, loadPatients } = usePatients()
const {
  isLoaded: vitalSignsLoaded,
  isLoading,
  errorMessage,
  loadVitalSigns,
  addVitalSign,
  deleteVitalSign: deleteVitalSignRecord,
  getAllVitalSigns
} = useVitalSigns()

const route = useRoute()
const isModalOpen = ref(false)
const isSaving = ref(false)
const formError = ref('')
const selectedPatientId = ref('')
const selectedDate = ref('')

onMounted(async () => {
  if (!patientsLoaded.value) {
    await loadPatients()
  }
  if (!vitalSignsLoaded.value) {
    await loadVitalSigns()
  }

  // Check for patientId in query params
  if (route.query.patientId) {
    selectedPatientId.value = route.query.patientId as string
    formData.patientId = selectedPatientId.value
  }
})

const formData = reactive({
  patientId: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  weight: null as number | null,
  temperature: null as number | null,
  bloodPressure: '',
  pulseRate: null as number | null,
  respirationRate: null as number | null,
  pain: 0,
  intake: null as number | null,
  output: null as number | null,
  stool: '',
  ivFluid: ''
})

const filteredVitalSigns = computed(() => {
  let result = getAllVitalSigns.value

  if (selectedPatientId.value) {
    result = result.filter(v => v.patientId === selectedPatientId.value)
  }

  if (selectedDate.value) {
    result = result.filter(v => v.date === selectedDate.value)
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

const getTempColor = (temp: number) => {
  if (temp > 37.5) return 'text-red-600 font-semibold'
  if (temp < 36.0) return 'text-blue-600 font-semibold'
  return 'text-gray-900'
}

const getPainColor = (pain: number) => {
  if (pain <= 3) return 'bg-green-100 text-green-800'
  if (pain <= 6) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
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
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    weight: null,
    temperature: null,
    bloodPressure: '',
    pulseRate: null,
    respirationRate: null,
    pain: 0,
    intake: null,
    output: null,
    stool: '',
    ivFluid: ''
  })
}

const saveVitalSigns = async () => {
  formError.value = ''

  if (!formData.patientId) {
    formError.value = 'Please select a patient.'
    return
  }

  if (formData.temperature !== null && (formData.temperature < 30 || formData.temperature > 42)) {
    formError.value = 'Temperature must be between 30 and 42 degrees Celsius.'
    return
  }

  if (formData.pain < 0 || formData.pain > 10) {
    formError.value = 'Pain scale must be between 0 and 10.'
    return
  }

  isSaving.value = true
  try {
    await addVitalSign({
      patientId: formData.patientId,
      date: formData.date,
      time: formData.time,
      weight: formData.weight || 0,
      temperature: formData.temperature || 36.5,
      bloodPressure: formData.bloodPressure || 'N/A',
      pulseRate: formData.pulseRate || 0,
      respirationRate: formData.respirationRate || 0,
      pain: formData.pain,
      intake: formData.intake || 0,
      output: formData.output || 0,
      stool: formData.stool || 'None',
      ivFluid: formData.ivFluid || 'None'
    })
    closeModal()
  } catch (error: any) {
    formError.value = error.message || 'Unable to save vital signs.'
  } finally {
    isSaving.value = false
  }
}

const deleteVitalSign = async (id: string) => {
  if (confirm('Are you sure you want to delete this vital sign record?')) {
    await deleteVitalSignRecord(id)
  }
}
</script>
