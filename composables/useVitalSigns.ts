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

const STORAGE_KEY = 'ehr_vital_signs'

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useVitalSigns = () => {
  const { data: vitalSigns, isLoaded } = useLocalStorage<VitalSign[]>(STORAGE_KEY, [])

  const isLoading = ref(false)

  const initializeMockData = async (patients: any[]) => {
    if (vitalSigns.value.length === 0 && patients.length > 0) {
      isLoading.value = true
      await new Promise(resolve => setTimeout(resolve, 300))

      const today = new Date().toISOString().split('T')[0]
      const mockVitalSigns: VitalSign[] = []

      patients.slice(0, 3).forEach((patient, idx) => {
        mockVitalSigns.push({
          id: generateId(),
          patientId: patient.id,
          date: today,
          time: '08:00',
          weight: 70 + idx * 5,
          temperature: 36.5 + idx * 0.2,
          bloodPressure: '120/80',
          pulseRate: 72 + idx * 3,
          respirationRate: 16 + idx,
          pain: idx + 1,
          intake: 1500,
          output: 1200,
          stool: 'Normal',
          ivFluid: 'NS @ 100ml/hr',
          createdAt: new Date().toISOString()
        })

        mockVitalSigns.push({
          id: generateId(),
          patientId: patient.id,
          date: today,
          time: '12:00',
          weight: 70 + idx * 5,
          temperature: 36.6 + idx * 0.2,
          bloodPressure: '118/78',
          pulseRate: 70 + idx * 3,
          respirationRate: 16 + idx,
          pain: idx,
          intake: 600,
          output: 450,
          stool: 'None',
          ivFluid: 'NS @ 80ml/hr',
          createdAt: new Date().toISOString()
        })
      })

      vitalSigns.value = mockVitalSigns
      isLoading.value = false
    }
  }

  const addVitalSign = (vitalSignData: Partial<VitalSign>) => {
    const newVitalSign: VitalSign = {
      id: generateId(),
      patientId: vitalSignData.patientId || '',
      date: vitalSignData.date || new Date().toISOString().split('T')[0],
      time: vitalSignData.time || new Date().toTimeString().slice(0, 5),
      weight: vitalSignData.weight || 0,
      temperature: vitalSignData.temperature || 36.5,
      bloodPressure: vitalSignData.bloodPressure || '',
      pulseRate: vitalSignData.pulseRate || 0,
      respirationRate: vitalSignData.respirationRate || 0,
      pain: vitalSignData.pain || 0,
      intake: vitalSignData.intake || 0,
      output: vitalSignData.output || 0,
      stool: vitalSignData.stool || '',
      ivFluid: vitalSignData.ivFluid || '',
      createdAt: new Date().toISOString()
    }

    vitalSigns.value = [...vitalSigns.value, newVitalSign]
    return newVitalSign
  }

  const updateVitalSign = (id: string, updates: Partial<VitalSign>) => {
    const index = vitalSigns.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vitalSigns.value = vitalSigns.value.map((v, i) =>
        i === index ? { ...v, ...updates } : v
      )
      return vitalSigns.value[index]
    }
    return null
  }

  const deleteVitalSign = (id: string) => {
    vitalSigns.value = vitalSigns.value.filter(v => v.id !== id)
  }

  const getVitalSignsByPatient = (patientId: string) => {
    return vitalSigns.value
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getVitalSign = (id: string) => {
    return vitalSigns.value.find(v => v.id === id)
  }

  const getAllVitalSigns = computed(() => {
    return [...vitalSigns.value].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  return {
    vitalSigns,
    isLoaded,
    isLoading,
    initializeMockData,
    addVitalSign,
    updateVitalSign,
    deleteVitalSign,
    getVitalSignsByPatient,
    getVitalSign,
    getAllVitalSigns
  }
}
