export interface Patient {
  id: string
  name: string
  hospitalRoom: string
  patientIdNumber: string
  sex: 'Male' | 'Female'
  address: string
  email: string
  dateOfBirth: string
  phone: string
  maritalStatus: string
  country: string
  religion: string
  admittingDiagnoses: string
  finalDiagnoses: string
  healthInsuranceProvider: string
  emergencyContactNumber: string
  historyOfPresentIllness: string
  parentsName: string
  parentsContact: string
  parentsAddress: string
  attendingPhysician: string
  nurseByShift: {
    morning: string
    afternoon: string
    night: string
  }
  admittedDate: string
  isICU: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalPatients: number
  admittedToday: number
  icuPatients: number
  nursesOnDuty: number
}

type PatientRow = {
  id: string
  name: string
  hospital_room: string
  patient_id_number: string
  sex: 'Male' | 'Female'
  address: string
  email: string
  date_of_birth: string | null
  phone: string
  marital_status: string
  country: string
  religion: string
  admitting_diagnoses: string
  final_diagnoses: string
  health_insurance_provider: string
  emergency_contact_number: string
  history_of_present_illness: string
  parents_name: string
  parents_contact: string
  parents_address: string
  attending_physician: string
  nurse_by_shift: Patient['nurseByShift']
  admitted_date: string
  is_icu: boolean
  created_at: string
  updated_at: string
}

const mapPatient = (row: PatientRow): Patient => ({
  id: row.id,
  name: row.name,
  hospitalRoom: row.hospital_room,
  patientIdNumber: row.patient_id_number,
  sex: row.sex,
  address: row.address,
  email: row.email,
  dateOfBirth: row.date_of_birth || '',
  phone: row.phone,
  maritalStatus: row.marital_status,
  country: row.country,
  religion: row.religion,
  admittingDiagnoses: row.admitting_diagnoses,
  finalDiagnoses: row.final_diagnoses,
  healthInsuranceProvider: row.health_insurance_provider,
  emergencyContactNumber: row.emergency_contact_number,
  historyOfPresentIllness: row.history_of_present_illness,
  parentsName: row.parents_name,
  parentsContact: row.parents_contact,
  parentsAddress: row.parents_address,
  attendingPhysician: row.attending_physician,
  nurseByShift: row.nurse_by_shift,
  admittedDate: row.admitted_date,
  isICU: row.is_icu,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const toPatientRow = (patient: Partial<Patient>) => ({
  name: patient.name || '',
  hospital_room: patient.hospitalRoom || '',
  sex: patient.sex || 'Male',
  address: patient.address || '',
  email: patient.email || '',
  date_of_birth: patient.dateOfBirth || null,
  phone: patient.phone || '',
  marital_status: patient.maritalStatus || '',
  country: patient.country || '',
  religion: patient.religion || '',
  admitting_diagnoses: patient.admittingDiagnoses || '',
  final_diagnoses: patient.finalDiagnoses || '',
  health_insurance_provider: patient.healthInsuranceProvider || '',
  emergency_contact_number: patient.emergencyContactNumber || '',
  history_of_present_illness: patient.historyOfPresentIllness || '',
  parents_name: patient.parentsName || '',
  parents_contact: patient.parentsContact || '',
  parents_address: patient.parentsAddress || '',
  attending_physician: patient.attendingPhysician || '',
  nurse_by_shift: patient.nurseByShift || {
    morning: '',
    afternoon: '',
    night: '',
  },
  is_icu: patient.isICU || false,
})

const generatePatientIdNumber = () => {
  const year = new Date().getFullYear()
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000
  return `HN-${year}-${random.toString().padStart(6, '0')}`
}

export const usePatients = () => {
  const { $supabase } = useNuxtApp()
  const patients = useState<Patient[]>('patients', () => [])
  const isLoaded = useState('patients-loaded', () => false)
  const isLoading = useState('patients-loading', () => false)
  const errorMessage = useState('patients-error', () => '')

  const loadPatients = async (force = false) => {
    if (isLoading.value || (isLoaded.value && !force)) return

    isLoading.value = true
    errorMessage.value = ''
    try {
      const { data, error } = await $supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      patients.value = (data as PatientRow[]).map(mapPatient)
      isLoaded.value = true
    } catch (error: any) {
      errorMessage.value = error.message || 'Unable to load patient records.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addPatient = async (patientData: Partial<Patient>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('patients')
      .insert({
        ...toPatientRow(patientData),
        patient_id_number: generatePatientIdNumber(),
      })
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const patient = mapPatient(data as PatientRow)
    patients.value = [patient, ...patients.value]
    return patient
  }

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('patients')
      .update(toPatientRow(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const patient = mapPatient(data as PatientRow)
    patients.value = patients.value.map(item => item.id === id ? patient : item)
    return patient
  }

  const deletePatient = async (id: string) => {
    errorMessage.value = ''
    const { error } = await $supabase.from('patients').delete().eq('id', id)
    if (error) {
      errorMessage.value = error.message
      throw error
    }
    patients.value = patients.value.filter(patient => patient.id !== id)
  }

  const getPatient = (id: string) => {
    return computed(() => patients.value.find(patient => patient.id === id))
  }

  const searchPatients = (query: string) => {
    if (!query) return patients.value
    const lowerQuery = query.toLowerCase()
    return patients.value.filter(patient =>
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.patientIdNumber.toLowerCase().includes(lowerQuery) ||
      patient.hospitalRoom.toLowerCase().includes(lowerQuery)
    )
  }

  const getDashboardStats = computed((): DashboardStats => {
    const today = new Date().toISOString().split('T')[0]
    return {
      totalPatients: patients.value.length,
      admittedToday: patients.value.filter(patient => patient.admittedDate === today).length,
      icuPatients: patients.value.filter(patient => patient.isICU).length,
      nursesOnDuty: 24,
    }
  })

  const getRecentPatients = computed(() => patients.value.slice(0, 5))

  return {
    patients,
    isLoaded,
    isLoading,
    errorMessage,
    loadPatients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    searchPatients,
    getDashboardStats,
    getRecentPatients,
  }
}
