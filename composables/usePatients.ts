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

const STORAGE_KEY = 'ehr_patients'

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const generatePatientIdNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900000) + 100000
  return `HN-${year}-${random}`
}

export const usePatients = () => {
  const { data: patients, isLoaded, save } = useLocalStorage<Patient[]>(STORAGE_KEY, [])

  const isLoading = ref(false)

  const initializeMockData = async () => {
    if (patients.value.length === 0) {
      isLoading.value = true
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockPatients: Patient[] = [
        {
          id: generateId(),
          name: 'John Michael Anderson',
          hospitalRoom: 'Room 301-A',
          patientIdNumber: 'HN-2024-001234',
          sex: 'Male',
          address: '1234 Maple Street, Springfield, IL 62701',
          email: 'john.anderson@email.com',
          dateOfBirth: '1985-03-15',
          phone: '(555) 123-4567',
          maritalStatus: 'Married',
          country: 'United States',
          religion: 'Catholic',
          admittingDiagnoses: 'Acute Myocardial Infarction, Hypertension',
          finalDiagnoses: 'NSTEMI, Essential Hypertension Stage 2',
          healthInsuranceProvider: 'Blue Cross Blue Shield',
          emergencyContactNumber: '(555) 234-5678',
          historyOfPresentIllness: 'Patient presented with chest pain radiating to left arm, started 4 hours prior to admission. Associated with diaphoresis and shortness of breath.',
          parentsName: 'Robert Anderson (Father), Mary Anderson (Mother)',
          parentsContact: '(555) 345-6789',
          parentsAddress: '5678 Oak Avenue, Springfield, IL 62702',
          attendingPhysician: 'Dr. Sarah Thompson, MD, FACC',
          nurseByShift: {
            morning: 'Nurse Rebecca Martinez, RN',
            afternoon: 'Nurse David Kim, RN',
            night: 'Nurse Amanda Foster, RN'
          },
          admittedDate: new Date().toISOString().split('T')[0],
          isICU: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: 'Sarah Elizabeth Williams',
          hospitalRoom: 'ICU-205-B',
          patientIdNumber: 'HN-2024-001235',
          sex: 'Female',
          address: '456 Pine Road, Oakdale, CA 94561',
          email: 's.williams@email.com',
          dateOfBirth: '1992-07-22',
          phone: '(555) 234-5678',
          maritalStatus: 'Single',
          country: 'United States',
          religion: 'Protestant',
          admittingDiagnoses: 'Pneumonia, Type 2 Diabetes Mellitus',
          finalDiagnoses: 'Community-Acquired Pneumonia, T2DM',
          healthInsuranceProvider: 'Aetna',
          emergencyContactNumber: '(555) 345-6789',
          historyOfPresentIllness: 'Patient with fever, productive cough, and dyspnea for 5 days. Chest X-ray shows right lower lobe consolidation.',
          parentsName: 'James Williams (Father), Patricia Williams (Mother)',
          parentsContact: '(555) 456-7890',
          parentsAddress: '890 Cedar Lane, Oakdale, CA 94562',
          attendingPhysician: 'Dr. Michael Chen, MD, FCCP',
          nurseByShift: {
            morning: 'Nurse Lisa Park, RN',
            afternoon: 'Nurse Thomas Wright, RN',
            night: 'Nurse Jennifer Adams, RN'
          },
          admittedDate: new Date().toISOString().split('T')[0],
          isICU: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: 'Carlos Rodriguez Martinez',
          hospitalRoom: 'Room 412-C',
          patientIdNumber: 'HN-2024-001236',
          sex: 'Male',
          address: '789 Elm Street, Riverside, TX 75001',
          email: 'carlos.martinez@email.com',
          dateOfBirth: '1978-11-08',
          phone: '(555) 345-6789',
          maritalStatus: 'Married',
          country: 'United States',
          religion: 'Catholic',
          admittingDiagnoses: 'Cerebrovascular Accident, Suspected',
          finalDiagnoses: 'Ischemic Stroke, Left MCA Territory',
          healthInsuranceProvider: 'UnitedHealthcare',
          emergencyContactNumber: '(555) 456-7890',
          historyOfPresentIllness: 'Patient found by family with right-sided weakness and speech difficulty 2 hours prior to arrival.',
          parentsName: 'Miguel Rodriguez (Father), Rosa Martinez (Mother)',
          parentsContact: '(555) 567-8901',
          parentsAddress: '234 Birch Boulevard, Riverside, TX 75002',
          attendingPhysician: 'Dr. Emily Watson, MD, FAAN',
          nurseByShift: {
            morning: 'Nurse Carlos Santos, RN',
            afternoon: 'Nurse Maria Gonzales, RN',
            night: 'Nurse Kevin Brown, RN'
          },
          admittedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          isICU: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: 'Emily Grace Johnson',
          hospitalRoom: 'Room 118-A',
          patientIdNumber: 'HN-2024-001237',
          sex: 'Female',
          address: '321 Walnut Court, Lakeside, FL 32065',
          email: 'emily.johnson@email.com',
          dateOfBirth: '1990-01-30',
          phone: '(555) 456-7890',
          maritalStatus: 'Single',
          country: 'United States',
          religion: 'Baptist',
          admittingDiagnoses: 'Acute Appendicitis',
          finalDiagnoses: 'Acute Appendicitis, Ruptured',
          healthInsuranceProvider: 'Cigna',
          emergencyContactNumber: '(555) 567-8901',
          historyOfPresentIllness: 'Patient with 24-hour history of periumbilical pain migrating to right lower quadrant.',
          parentsName: 'William Johnson (Father), Susan Johnson (Mother)',
          parentsContact: '(555) 678-9012',
          parentsAddress: '654 Spruce Drive, Lakeside, FL 32066',
          attendingPhysician: 'Dr. Andrew Mitchell, MD, FACS',
          nurseByShift: {
            morning: 'Nurse Rachel Green, RN',
            afternoon: 'Nurse Steven Cole, RN',
            night: 'Nurse Laura Phillips, RN'
          },
          admittedDate: new Date().toISOString().split('T')[0],
          isICU: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: 'Robert James Thompson',
          hospitalRoom: 'ICU-309-D',
          patientIdNumber: 'HN-2024-001238',
          sex: 'Male',
          address: '987 Hickory Lane, Hillview, NY 12501',
          email: 'r.thompson@email.com',
          dateOfBirth: '1965-09-12',
          phone: '(555) 567-8901',
          maritalStatus: 'Married',
          country: 'United States',
          religion: 'Methodist',
          admittingDiagnoses: 'Chronic Kidney Disease, End Stage',
          finalDiagnoses: 'ESRD, Diabetic Nephropathy',
          healthInsuranceProvider: 'Medicare',
          emergencyContactNumber: '(555) 678-9012',
          historyOfPresentIllness: 'Patient with ESRD secondary to diabetic nephropathy presents for scheduled hemodialysis.',
          parentsName: 'Donald Thompson (Father), Betty Thompson (Mother)',
          parentsContact: '(555) 789-0123',
          parentsAddress: '210 Ash Street, Hillview, NY 12502',
          attendingPhysician: 'Dr. Patricia Lee, MD, FASN',
          nurseByShift: {
            morning: 'Nurse Michelle Taylor, RN',
            afternoon: 'Nurse Brian Harris, RN',
            night: 'Nurse Nicole Lewis, RN'
          },
          admittedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          isICU: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      patients.value = mockPatients
      isLoading.value = false
    }
  }

  const addPatient = (patientData: Partial<Patient>) => {
    const newPatient: Patient = {
      id: generateId(),
      name: patientData.name || '',
      hospitalRoom: patientData.hospitalRoom || '',
      patientIdNumber: generatePatientIdNumber(),
      sex: patientData.sex || 'Male',
      address: patientData.address || '',
      email: patientData.email || '',
      dateOfBirth: patientData.dateOfBirth || '',
      phone: patientData.phone || '',
      maritalStatus: patientData.maritalStatus || '',
      country: patientData.country || '',
      religion: patientData.religion || '',
      admittingDiagnoses: patientData.admittingDiagnoses || '',
      finalDiagnoses: patientData.finalDiagnoses || '',
      healthInsuranceProvider: patientData.healthInsuranceProvider || '',
      emergencyContactNumber: patientData.emergencyContactNumber || '',
      historyOfPresentIllness: patientData.historyOfPresentIllness || '',
      parentsName: patientData.parentsName || '',
      parentsContact: patientData.parentsContact || '',
      parentsAddress: patientData.parentsAddress || '',
      attendingPhysician: patientData.attendingPhysician || '',
      nurseByShift: patientData.nurseByShift || {
        morning: '',
        afternoon: '',
        night: ''
      },
      admittedDate: new Date().toISOString().split('T')[0],
      isICU: patientData.isICU || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    patients.value = [...patients.value, newPatient]
    return newPatient
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const index = patients.value.findIndex(p => p.id === id)
    if (index !== -1) {
      patients.value = patients.value.map((p, i) =>
        i === index ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
      return patients.value[index]
    }
    return null
  }

  const deletePatient = (id: string) => {
    patients.value = patients.value.filter(p => p.id !== id)
  }

  const getPatient = (id: string) => {
    return patients.value.find(p => p.id === id)
  }

  const searchPatients = (query: string) => {
    if (!query) return patients.value
    const lowerQuery = query.toLowerCase()
    return patients.value.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.patientIdNumber.toLowerCase().includes(lowerQuery) ||
      p.hospitalRoom.toLowerCase().includes(lowerQuery)
    )
  }

  const getDashboardStats = computed((): DashboardStats => {
    const today = new Date().toISOString().split('T')[0]
    return {
      totalPatients: patients.value.length,
      admittedToday: patients.value.filter(p => p.admittedDate === today).length,
      icuPatients: patients.value.filter(p => p.isICU).length,
      nursesOnDuty: 24
    }
  })

  const getRecentPatients = computed(() => {
    return [...patients.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  return {
    patients,
    isLoaded,
    isLoading,
    initializeMockData,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    searchPatients,
    getDashboardStats,
    getRecentPatients
  }
}
