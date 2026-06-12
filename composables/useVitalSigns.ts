export interface VitalSign {
  id: string
  patientId: string
  date: string
  time: string
  weight: number
  temperature: number
  bloodPressure: string
  pulseRate: number
  respirationRate: number
  pain: number
  intake: number
  output: number
  stool: string
  ivFluid: string
  createdAt: string
}

type VitalSignRow = {
  id: string
  patient_id: string
  date: string
  time: string
  weight: number
  temperature: number
  blood_pressure: string
  pulse_rate: number
  respiration_rate: number
  pain: number
  intake: number
  output: number
  stool: string
  iv_fluid: string
  created_at: string
}

const mapVitalSign = (row: VitalSignRow): VitalSign => ({
  id: row.id,
  patientId: row.patient_id,
  date: row.date,
  time: row.time.slice(0, 5),
  weight: Number(row.weight),
  temperature: Number(row.temperature),
  bloodPressure: row.blood_pressure,
  pulseRate: row.pulse_rate,
  respirationRate: row.respiration_rate,
  pain: row.pain,
  intake: Number(row.intake),
  output: Number(row.output),
  stool: row.stool,
  ivFluid: row.iv_fluid,
  createdAt: row.created_at,
})

const toVitalSignRow = (vitalSign: Partial<VitalSign>) => ({
  patient_id: vitalSign.patientId,
  date: vitalSign.date || new Date().toISOString().split('T')[0],
  time: vitalSign.time || new Date().toTimeString().slice(0, 5),
  weight: vitalSign.weight ?? 0,
  temperature: vitalSign.temperature ?? 36.5,
  blood_pressure: vitalSign.bloodPressure || '',
  pulse_rate: vitalSign.pulseRate ?? 0,
  respiration_rate: vitalSign.respirationRate ?? 0,
  pain: vitalSign.pain ?? 0,
  intake: vitalSign.intake ?? 0,
  output: vitalSign.output ?? 0,
  stool: vitalSign.stool || '',
  iv_fluid: vitalSign.ivFluid || '',
})

export const useVitalSigns = () => {
  const { $supabase } = useNuxtApp()
  const vitalSigns = useState<VitalSign[]>('vital-signs', () => [])
  const isLoaded = useState('vital-signs-loaded', () => false)
  const isLoading = useState('vital-signs-loading', () => false)
  const errorMessage = useState('vital-signs-error', () => '')

  const loadVitalSigns = async (force = false) => {
    if (isLoading.value || (isLoaded.value && !force)) return

    isLoading.value = true
    errorMessage.value = ''
    try {
      const { data, error } = await $supabase
        .from('vital_signs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      vitalSigns.value = (data as VitalSignRow[]).map(mapVitalSign)
      isLoaded.value = true
    } catch (error: any) {
      errorMessage.value = error.message || 'Unable to load vital signs.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addVitalSign = async (vitalSignData: Partial<VitalSign>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('vital_signs')
      .insert(toVitalSignRow(vitalSignData))
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const vitalSign = mapVitalSign(data as VitalSignRow)
    vitalSigns.value = [vitalSign, ...vitalSigns.value]
    return vitalSign
  }

  const updateVitalSign = async (id: string, updates: Partial<VitalSign>) => {
    errorMessage.value = ''
    const { data, error } = await $supabase
      .from('vital_signs')
      .update(toVitalSignRow(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      errorMessage.value = error.message
      throw error
    }

    const vitalSign = mapVitalSign(data as VitalSignRow)
    vitalSigns.value = vitalSigns.value.map(item => item.id === id ? vitalSign : item)
    return vitalSign
  }

  const deleteVitalSign = async (id: string) => {
    errorMessage.value = ''
    const { error } = await $supabase.from('vital_signs').delete().eq('id', id)
    if (error) {
      errorMessage.value = error.message
      throw error
    }
    vitalSigns.value = vitalSigns.value.filter(vitalSign => vitalSign.id !== id)
  }

  const getVitalSignsByPatient = (patientId: string) => {
    return vitalSigns.value.filter(vitalSign => vitalSign.patientId === patientId)
  }

  const getVitalSign = (id: string) => {
    return vitalSigns.value.find(vitalSign => vitalSign.id === id)
  }

  const getAllVitalSigns = computed(() => vitalSigns.value)

  return {
    vitalSigns,
    isLoaded,
    isLoading,
    errorMessage,
    loadVitalSigns,
    addVitalSign,
    updateVitalSign,
    deleteVitalSign,
    getVitalSignsByPatient,
    getVitalSign,
    getAllVitalSigns,
  }
}
