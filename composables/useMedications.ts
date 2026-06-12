export interface Medication {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string | null
  prescribingDoctor: string
  notes: string
  createdAt: string
}

type MedicationRow = {
  id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date: string | null
  prescribing_doctor: string
  notes: string
  created_at: string
}

const mapMedication = (row: MedicationRow): Medication => ({
  id: row.id,
  patientId: row.patient_id,
  name: row.name,
  dosage: row.dosage,
  frequency: row.frequency,
  startDate: row.start_date,
  endDate: row.end_date,
  prescribingDoctor: row.prescribing_doctor,
  notes: row.notes,
  createdAt: row.created_at,
})

const toMedicationRow = (medication: Partial<Medication>) => ({
  patient_id: medication.patientId,
  name: medication.name,
  dosage: medication.dosage,
  frequency: medication.frequency,
  start_date: medication.startDate || new Date().toISOString().split('T')[0],
  end_date: medication.endDate || null,
  prescribing_doctor: medication.prescribingDoctor,
  notes: medication.notes || '',
})

export const useMedications = () => {
  const { $supabase } = useNuxtApp()
  const medications = useState<Medication[]>('medications', () => [])
  const isLoaded = useState('medications-loaded', () => false)
  const isLoading = useState('medications-loading', () => false)
  const errorMessage = useState('medications-error', () => '')

  const loadMedications = async (force = false) => {
    if (isLoading.value || (isLoaded.value && !force)) return

    isLoading.value = true
    errorMessage.value = ''
    try {
      const { data, error } = await $supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      medications.value = (data as MedicationRow[]).map(mapMedication)
      isLoaded.value = true
    } catch (error: any) {
      errorMessage.value = error.message || 'Unable to load medications.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addMedication = async (medicationData: Partial<Medication>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('medications')
      .insert(toMedicationRow(medicationData))
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const medication = mapMedication(data as MedicationRow)
    medications.value = [medication, ...medications.value]
    return medication
  }

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('medications')
      .update(toMedicationRow(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const medication = mapMedication(data as MedicationRow)
    medications.value = medications.value.map(item => item.id === id ? medication : item)
    return medication
  }

  const deleteMedication = async (id: string) => {
    errorMessage.value = ''
    const { error } = await $supabase.from('medications').delete().eq('id', id)
    if (error) {
      errorMessage.value = error.message
      throw error
    }
    medications.value = medications.value.filter(medication => medication.id !== id)
  }

  const getMedicationsByPatient = (patientId: string) => {
    return medications.value.filter(medication => medication.patientId === patientId)
  }

  const getMedication = (id: string) => {
    return medications.value.find(medication => medication.id === id)
  }

  const getAllMedications = computed(() => medications.value)

  return {
    medications,
    isLoaded,
    isLoading,
    errorMessage,
    loadMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    getMedicationsByPatient,
    getMedication,
    getAllMedications,
  }
}
