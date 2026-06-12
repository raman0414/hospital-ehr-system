<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Patient List</h1>
      <p class="text-gray-600 mt-2">Manage and view all patient records</p>
    </div>

    <div v-if="errorMessage" class="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
      {{ errorMessage }}
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, ID, or room..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <button @click="openAddModal" class="bg-hospital-600 hover:bg-hospital-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Patient
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <LoadingSpinner
        :loading="isLoading"
        :empty="filteredPatients.length === 0 && !isLoading"
        empty-title="No Patients Found"
        :empty-message="searchQuery ? 'Try a different search term' : 'Start by adding your first patient'"
        :empty-action="searchQuery ? undefined : 'Add Patient'"
        @empty-action="openAddModal"
        icon-path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Diagnosis</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-hospital-100 rounded-full flex items-center justify-center mr-3">
                      <span class="text-hospital-700 font-semibold">{{ patient.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ patient.name }}</div>
                      <div class="text-sm text-gray-500">{{ patient.sex }} | {{ calculateAge(patient.dateOfBirth) }} years</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ patient.patientIdNumber }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ patient.hospitalRoom }} - Bed {{ patient.bedNumber }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">{{ patient.admittingDiagnoses }}</div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      patient.isICU ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ patient.isICU ? 'ICU' : 'Active' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center space-x-3">
                    <button @click="viewPatient(patient.id)" class="text-hospital-600 hover:text-hospital-800 font-medium transition-colors">
                      View
                    </button>
                    <button @click="editPatient(patient)" class="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                      Edit
                    </button>
                    <button @click="confirmDelete(patient)" class="text-red-600 hover:text-red-800 font-medium transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingSpinner>
    </div>

    <!-- Patient Form Modal -->
    <Modal :isOpen="isModalOpen" :title="editingPatient ? 'Edit Patient' : 'Add New Patient'" @close="closeModal">
      <form @submit.prevent="savePatient" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input v-model="formData.name" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hospital Room *</label>
            <input v-model="formData.hospitalRoom" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bed Number *</label>
            <input v-model="formData.bedNumber" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sex *</label>
            <select v-model="formData.sex" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <input v-model="formData.dateOfBirth" required type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input v-model="formData.email" required type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input v-model="formData.phone" required type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <input v-model="formData.maritalStatus" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input v-model="formData.country" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
            <input v-model="formData.religion" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
          <div class="flex items-center">
            <input v-model="formData.isICU" type="checkbox" id="isICU" class="w-4 h-4 text-hospital-600 border-gray-300 rounded focus:ring-hospital-500" />
            <label for="isICU" class="ml-2 text-sm font-medium text-gray-700">ICU Patient</label>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input v-model="formData.address" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Admitting Diagnoses *</label>
              <input v-model="formData.admittingDiagnoses" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Final Diagnoses</label>
              <input v-model="formData.finalDiagnoses" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Health Insurance Provider</label>
              <input v-model="formData.healthInsuranceProvider" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
              <input v-model="formData.emergencyContactNumber" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">History of Present Illness</label>
              <textarea v-model="formData.historyOfPresentIllness" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500"></textarea>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent's Name</label>
              <input v-model="formData.parentsName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent's Contact</label>
              <input v-model="formData.parentsContact" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent's Address</label>
              <input v-model="formData.parentsAddress" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-4">Attending Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Attending Physician</label>
              <input v-model="formData.attendingPhysician" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Morning Nurse</label>
              <input v-model="formData.nurseByShift.morning" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Afternoon Nurse</label>
              <input v-model="formData.nurseByShift.afternoon" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Night Nurse</label>
              <input v-model="formData.nurseByShift.night" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500" />
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" @click="closeModal" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            @click="savePatient"
            :disabled="isSaving"
            class="px-6 py-2 bg-hospital-600 hover:bg-hospital-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : editingPatient ? 'Update Patient' : 'Add Patient' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Patient"
      :message="`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`"
      @close="isDeleteModalOpen = false"
      @confirm="deletePatientConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Patient List - MedCare EHR'
})

const {
  patients,
  isLoaded,
  isLoading,
  errorMessage,
  loadPatients,
  addPatient,
  updatePatient,
  deletePatient,
  searchPatients
} = usePatients()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isSaving = ref(false)
const editingPatient = ref<any>(null)
const patientToDelete = ref<any>(null)

const formData = reactive({
  name: '',
  hospitalRoom: '',
  bedNumber: '',
  sex: 'Male' as 'Male' | 'Female',
  address: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  maritalStatus: '',
  country: '',
  religion: '',
  admittingDiagnoses: '',
  finalDiagnoses: '',
  healthInsuranceProvider: '',
  emergencyContactNumber: '',
  historyOfPresentIllness: '',
  parentsName: '',
  parentsContact: '',
  parentsAddress: '',
  attendingPhysician: '',
  nurseByShift: {
    morning: '',
    afternoon: '',
    night: ''
  },
  isICU: false
})

const filteredPatients = computed(() => {
  return searchPatients(searchQuery.value)
})

onMounted(async () => {
  if (!isLoaded.value) {
    await loadPatients()
  }
})

const calculateAge = (dob: string) => {
  if (!dob) return 0
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    hospitalRoom: '',
    bedNumber: '',
    sex: 'Male',
    address: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    maritalStatus: '',
    country: '',
    religion: '',
    admittingDiagnoses: '',
    finalDiagnoses: '',
    healthInsuranceProvider: '',
    emergencyContactNumber: '',
    historyOfPresentIllness: '',
    parentsName: '',
    parentsContact: '',
    parentsAddress: '',
    attendingPhysician: '',
    nurseByShift: {
      morning: '',
      afternoon: '',
      night: ''
    },
    isICU: false
  })
}

const openAddModal = () => {
  editingPatient.value = null
  resetForm()
  isModalOpen.value = true
}

const editPatient = (patient: any) => {
  editingPatient.value = patient
  Object.assign(formData, {
    name: patient.name,
    hospitalRoom: patient.hospitalRoom,
    bedNumber: patient.bedNumber,
    sex: patient.sex,
    address: patient.address,
    email: patient.email,
    dateOfBirth: patient.dateOfBirth,
    phone: patient.phone,
    maritalStatus: patient.maritalStatus,
    country: patient.country,
    religion: patient.religion,
    admittingDiagnoses: patient.admittingDiagnoses,
    finalDiagnoses: patient.finalDiagnoses,
    healthInsuranceProvider: patient.healthInsuranceProvider,
    emergencyContactNumber: patient.emergencyContactNumber,
    historyOfPresentIllness: patient.historyOfPresentIllness,
    parentsName: patient.parentsName,
    parentsContact: patient.parentsContact,
    parentsAddress: patient.parentsAddress,
    attendingPhysician: patient.attendingPhysician,
    nurseByShift: { ...patient.nurseByShift },
    isICU: patient.isICU
  })
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingPatient.value = null
  resetForm()
}

const savePatient = async () => {
  isSaving.value = true
  try {
    if (editingPatient.value) {
      await updatePatient(editingPatient.value.id, formData)
    } else {
      await addPatient(formData)
    }
    closeModal()
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (patient: any) => {
  patientToDelete.value = patient
  isDeleteModalOpen.value = true
}

const deletePatientConfirmed = async () => {
  if (patientToDelete.value) {
    try {
      await deletePatient(patientToDelete.value.id)
      patientToDelete.value = null
      isDeleteModalOpen.value = false
    } catch {
      return
    }
  }
}

const viewPatient = (id: string) => {
  navigateTo(`/patients/${id}`)
}
</script>
