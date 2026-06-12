export interface LabResult {
  id: string
  patientId: string
  testName: string
  date: string
  resultValue: string
  referenceRange: string
  unit: string
  notes: string
  createdAt: string
}

type LabResultRow = {
  id: string
  patient_id: string
  test_name: string
  date: string
  result_value: string
  reference_range: string
  unit: string
  notes: string
  created_at: string
}

const mapLabResult = (row: LabResultRow): LabResult => ({
  id: row.id,
  patientId: row.patient_id,
  testName: row.test_name,
  date: row.date,
  resultValue: row.result_value,
  referenceRange: row.reference_range,
  unit: row.unit,
  notes: row.notes,
  createdAt: row.created_at,
})

const toLabResultRow = (labResult: Partial<LabResult>) => ({
  patient_id: labResult.patientId,
  test_name: labResult.testName,
  date: labResult.date || new Date().toISOString().split('T')[0],
  result_value: labResult.resultValue,
  reference_range: labResult.referenceRange || '',
  unit: labResult.unit || '',
  notes: labResult.notes || '',
})

export const useLabResults = () => {
  const { $supabase } = useNuxtApp()
  const labResults = useState<LabResult[]>('lab-results', () => [])
  const isLoaded = useState('lab-results-loaded', () => false)
  const isLoading = useState('lab-results-loading', () => false)
  const errorMessage = useState('lab-results-error', () => '')

  const loadLabResults = async (force = false) => {
    if (isLoading.value || (isLoaded.value && !force)) return

    isLoading.value = true
    errorMessage.value = ''
    try {
      const { data, error } = await $supabase
        .from('lab_results')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      labResults.value = (data as LabResultRow[]).map(mapLabResult)
      isLoaded.value = true
    } catch (error: any) {
      errorMessage.value = error.message || 'Unable to load lab results.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addLabResult = async (labResultData: Partial<LabResult>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('lab_results')
      .insert(toLabResultRow(labResultData))
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const labResult = mapLabResult(data as LabResultRow)
    labResults.value = [labResult, ...labResults.value]
    return labResult
  }

  const updateLabResult = async (id: string, updates: Partial<LabResult>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('lab_results')
      .update(toLabResultRow(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const labResult = mapLabResult(data as LabResultRow)
    labResults.value = labResults.value.map(item => item.id === id ? labResult : item)
    return labResult
  }

  const deleteLabResult = async (id: string) => {
    errorMessage.value = ''
    const { error } = await $supabase.from('lab_results').delete().eq('id', id)
    if (error) {
      errorMessage.value = error.message
      throw error
    }
    labResults.value = labResults.value.filter(labResult => labResult.id !== id)
  }

  const getLabResultsByPatient = (patientId: string) => {
    return labResults.value.filter(labResult => labResult.patientId === patientId)
  }

  const getLabResult = (id: string) => {
    return labResults.value.find(labResult => labResult.id === id)
  }

  const getAllLabResults = computed(() => labResults.value)

  return {
    labResults,
    isLoaded,
    isLoading,
    errorMessage,
    loadLabResults,
    addLabResult,
    updateLabResult,
    deleteLabResult,
    getLabResultsByPatient,
    getLabResult,
    getAllLabResults,
  }
}
