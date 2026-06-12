DO $$
DECLARE
  v_user_id uuid;
  p1_id uuid; p2_id uuid; p3_id uuid; p4_id uuid; p5_id uuid;
  p6_id uuid; p7_id uuid; p8_id uuid; p9_id uuid; p10_id uuid;
BEGIN
  -- Get the first available user to act as the creator
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in auth.users. Please create an account in the app first.';
  END IF;

  ---------------------------------------------------------------------------
  -- PATIENTS
  ---------------------------------------------------------------------------
  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1001', 'James Smith', '101', 'A', 'Male', '1985-04-12', 'Pneumonia', 'Dr. Sarah Connor', false, v_user_id) RETURNING id INTO p1_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1002', 'Maria Garcia', '102', 'B', 'Female', '1972-11-05', 'Type 2 Diabetes Complications', 'Dr. Mark Sloan', false, v_user_id) RETURNING id INTO p2_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1003', 'Robert Johnson', 'ICU-1', '1', 'Male', '1960-08-22', 'Myocardial Infarction', 'Dr. Gregory House', true, v_user_id) RETURNING id INTO p3_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1004', 'Linda Williams', '104', 'C', 'Female', '1990-02-15', 'Appendicitis', 'Dr. Meredith Grey', false, v_user_id) RETURNING id INTO p4_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1005', 'Michael Brown', '105', 'A', 'Male', '1988-07-30', 'Fractured Femur', 'Dr. Owen Hunt', false, v_user_id) RETURNING id INTO p5_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1006', 'Patricia Davis', '106', 'B', 'Female', '1955-12-11', 'COPD Exacerbation', 'Dr. Sarah Connor', false, v_user_id) RETURNING id INTO p6_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1007', 'William Miller', 'ICU-2', '2', 'Male', '1945-03-25', 'Septic Shock', 'Dr. Gregory House', true, v_user_id) RETURNING id INTO p7_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1008', 'Elizabeth Wilson', '108', 'A', 'Female', '2001-09-08', 'Asthma Attack', 'Dr. Mark Sloan', false, v_user_id) RETURNING id INTO p8_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1009', 'David Moore', '109', 'C', 'Male', '1979-06-18', 'Kidney Stones', 'Dr. Meredith Grey', false, v_user_id) RETURNING id INTO p9_id;

  INSERT INTO public.patients (patient_id_number, name, hospital_room, bed_number, sex, date_of_birth, admitting_diagnoses, attending_physician, is_icu, created_by)
  VALUES ('PT-1010', 'Jennifer Taylor', '110', 'B', 'Female', '1995-01-02', 'Migraine', 'Dr. Sarah Connor', false, v_user_id) RETURNING id INTO p10_id;

  ---------------------------------------------------------------------------
  -- VITAL SIGNS
  ---------------------------------------------------------------------------
  INSERT INTO public.vital_signs (patient_id, weight, temperature, blood_pressure, pulse_rate, respiration_rate, pain, created_by) VALUES
  (p1_id, 75.5, 38.2, '130/85', 92, 20, 4, v_user_id),
  (p2_id, 82.0, 36.8, '145/90', 88, 16, 2, v_user_id),
  (p3_id, 90.5, 37.1, '110/70', 105, 24, 7, v_user_id),
  (p4_id, 65.2, 37.8, '120/80', 78, 18, 8, v_user_id),
  (p5_id, 88.9, 36.6, '125/82', 72, 16, 9, v_user_id),
  (p6_id, 70.3, 37.5, '150/95', 95, 26, 3, v_user_id),
  (p7_id, 78.1, 39.5, '90/60', 120, 28, 5, v_user_id),
  (p8_id, 55.4, 36.9, '115/75', 110, 22, 4, v_user_id),
  (p9_id, 85.6, 36.7, '135/88', 85, 18, 10, v_user_id),
  (p10_id, 62.8, 36.5, '110/72', 68, 14, 6, v_user_id);

  ---------------------------------------------------------------------------
  -- MEDICATIONS
  ---------------------------------------------------------------------------
  INSERT INTO public.medications (patient_id, name, dosage, frequency, prescribing_doctor, created_by) VALUES
  (p1_id, 'Azithromycin', '500mg', 'Once daily', 'Dr. Sarah Connor', v_user_id),
  (p1_id, 'Ibuprofen', '400mg', 'Every 6 hours as needed', 'Dr. Sarah Connor', v_user_id),
  (p2_id, 'Metformin', '1000mg', 'Twice daily with meals', 'Dr. Mark Sloan', v_user_id),
  (p2_id, 'Lisinopril', '10mg', 'Once daily', 'Dr. Mark Sloan', v_user_id),
  (p3_id, 'Aspirin', '81mg', 'Once daily', 'Dr. Gregory House', v_user_id),
  (p3_id, 'Heparin', '5000 units', 'Subcutaneous every 8 hours', 'Dr. Gregory House', v_user_id),
  (p4_id, 'Morphine', '4mg', 'IV every 4 hours PRN', 'Dr. Meredith Grey', v_user_id),
  (p5_id, 'Ketorolac', '30mg', 'IV every 6 hours', 'Dr. Owen Hunt', v_user_id),
  (p6_id, 'Albuterol Sulfate', '2.5mg', 'Nebulizer every 4 hours', 'Dr. Sarah Connor', v_user_id),
  (p6_id, 'Prednisone', '40mg', 'Once daily', 'Dr. Sarah Connor', v_user_id),
  (p7_id, 'Norepinephrine', '0.05 mcg/kg/min', 'Continuous IV drip', 'Dr. Gregory House', v_user_id),
  (p7_id, 'Meropenem', '1g', 'IV every 8 hours', 'Dr. Gregory House', v_user_id),
  (p8_id, 'Albuterol Inhaler', '2 puffs', 'Every 4-6 hours PRN', 'Dr. Mark Sloan', v_user_id),
  (p9_id, 'Ketorolac', '30mg', 'IV every 6 hours', 'Dr. Meredith Grey', v_user_id),
  (p9_id, 'Ondansetron', '4mg', 'IV every 8 hours PRN nausea', 'Dr. Meredith Grey', v_user_id),
  (p10_id, 'Sumatriptan', '50mg', 'Once at onset of migraine', 'Dr. Sarah Connor', v_user_id);

  ---------------------------------------------------------------------------
  -- LAB RESULTS
  ---------------------------------------------------------------------------
  INSERT INTO public.lab_results (patient_id, test_name, result_value, reference_range, unit, created_by) VALUES
  (p1_id, 'White Blood Cell Count (WBC)', '14.2', '4.5 - 11.0', 'x10^3/uL', v_user_id),
  (p1_id, 'Chest X-Ray', 'Infiltrates present in right lower lobe', 'Clear', 'N/A', v_user_id),
  (p2_id, 'Hemoglobin A1C', '8.5', '4.0 - 5.6', '%', v_user_id),
  (p2_id, 'Fasting Blood Glucose', '145', '70 - 99', 'mg/dL', v_user_id),
  (p3_id, 'Troponin I', '2.4', '0.0 - 0.04', 'ng/mL', v_user_id),
  (p3_id, 'CK-MB', '15.2', '0.0 - 5.0', 'ng/mL', v_user_id),
  (p4_id, 'White Blood Cell Count (WBC)', '16.5', '4.5 - 11.0', 'x10^3/uL', v_user_id),
  (p5_id, 'Hemoglobin', '13.2', '13.5 - 17.5', 'g/dL', v_user_id),
  (p6_id, 'Arterial Blood Gas - pH', '7.31', '7.35 - 7.45', 'pH', v_user_id),
  (p6_id, 'Arterial Blood Gas - pCO2', '55', '35 - 45', 'mmHg', v_user_id),
  (p7_id, 'Lactic Acid', '4.5', '0.5 - 2.2', 'mmol/L', v_user_id),
  (p7_id, 'Blood Culture', 'Positive for S. aureus', 'Negative', 'N/A', v_user_id),
  (p8_id, 'Peak Expiratory Flow', '250', '380 - 500', 'L/min', v_user_id),
  (p9_id, 'Urinalysis - RBC', 'Many', '0 - 2', '/HPF', v_user_id),
  (p9_id, 'BUN', '22', '7 - 20', 'mg/dL', v_user_id),
  (p10_id, 'Comprehensive Metabolic Panel', 'Normal', 'N/A', 'N/A', v_user_id);

END $$;
