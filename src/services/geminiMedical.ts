import { CLINICAL_DISEASE_PRESETS } from '../data/clinicalDiseasePresets';
import { getAcharyaProtocols, type AcharyaClinicalProtocol } from '../data/acharyaProtocols';
import { getModernPharmacologyForDisease } from '../data/modernPharmacotherapyData';
import type {
  LoanItem,
  InvestmentItem,
  ExpenseRecord,
  HabitItem,
  DinacharyaLog,
  RoadmapMilestone,
  ChecklistTask,
} from '../types';

export interface MedicalCaseQuery {
  patientAge?: number | string;
  patientGender?: 'Male' | 'Female' | 'Other' | string;
  prakriti?: string;
  agni?: string;
  kostha?: string;
  symptoms?: string;
  diseaseName?: string;
  duration?: string;
  notes?: string;
  prashnaAnswers?: { question: string; answer: string }[];
}

export interface InvestigationReferenceGuide {
  testName: string;
  clinicalPurpose: string;
  normalRange: string;
  interpretations: {
    valueRange: string;
    indication: string;
    severity: 'normal' | 'borderline' | 'high' | 'low';
  }[];
}

export const getInvestigationReferenceDetails = (
  rawTestName: string,
  existingPurpose?: string
): InvestigationReferenceGuide => {
  const t = rawTestName.toLowerCase();

  if (t.includes('anti-ccp') || t.includes('rheumatoid factor') || t.includes('rf')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Confirms autoimmune seropositive Rheumatoid Arthritis (Amavata) and predicts erosive synovial joint progression.',
      normalRange: 'Anti-CCP: < 20 U/mL (Negative) • Rheumatoid Factor (RF): < 14 IU/mL (Negative)',
      interpretations: [
        {
          valueRange: 'Anti-CCP < 20 U/mL & RF < 14 IU/mL',
          indication: 'Normal / Seronegative: Rules out classic seropositive RA; evaluate for seronegative Amavata, Sandhivata, or Vatarakta.',
          severity: 'normal',
        },
        {
          valueRange: 'Anti-CCP 20 – 59 U/mL or RF 15 – 40 IU/mL',
          indication: 'Weakly / Moderately Positive: Suggests early or moderate autoimmune synovitis (Sama-Vata stage); start Deepana-Pachana & Simhanada Guggulu early.',
          severity: 'borderline',
        },
        {
          valueRange: 'Anti-CCP ≥ 60 U/mL or RF > 40–60 IU/mL',
          indication: 'Strongly Positive (High Titer): Indicates aggressive erosive Rheumatoid Arthritis (Pravriddha Amavata) with high risk of joint deformity; requires intensive Vaitarana Basti + DMARD monitoring.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('esr') || t.includes('crp') || t.includes('c-reactive')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Quantifies active systemic inflammation and correlates directly with the acute Sama Avastha (endotoxin/inflammatory activity).',
      normalRange: 'ESR (Westergren): Men 0–15 mm/hr, Women 0–20 mm/hr • hs-CRP / CRP: < 3.0 mg/L (< 0.3 mg/dL)',
      interpretations: [
        {
          valueRange: 'ESR < 20 mm/hr & CRP < 3.0 mg/L',
          indication: 'Normal (Nirama Avastha): Minimal systemic inflammation; safe to transition from Rukshana to Snehana/Brimhana therapy.',
          severity: 'normal',
        },
        {
          valueRange: 'ESR 21 – 50 mm/hr or CRP 3.0 – 10.0 mg/L',
          indication: 'Moderate Elevation (Madhyama Sama Stage): Active subacute tissue inflammation; continue Langhana, Pachana Kwathas, and Ruksha Sweda.',
          severity: 'borderline',
        },
        {
          valueRange: 'ESR > 50–100 mm/hr or CRP > 10.0 mg/L',
          indication: 'Marked Elevation (Teevra Sama / Pitta-Rakta Prakopa): Severe acute inflammatory flare, infection, or active autoimmune synovitis; Snehapana strictly contraindicated.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('uric acid') || t.includes('urate')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Differentiates Vatarakta (Gouty Hyperuricemia) from Amavata (RA) and Sandhivata (OA).',
      normalRange: 'Adult Male: 3.4 – 7.0 mg/dL • Adult Female: 2.4 – 6.0 mg/dL',
      interpretations: [
        {
          valueRange: '2.4 – 6.0 mg/dL (Female) / 3.4 – 7.0 mg/dL (Male)',
          indication: 'Normal Uric Acid: Rules out hyperuricemic gout; focus on primary Vata/Ama joint pathology.',
          severity: 'normal',
        },
        {
          valueRange: '6.1 – 7.9 mg/dL',
          indication: 'Borderline Hyperuricemia (Uttana Vatarakta risk): Supersaturation threshold for monosodium urate crystals; initiate Guduchi/Kokilaksha Kwatha and purine restriction.',
          severity: 'borderline',
        },
        {
          valueRange: '≥ 8.0 mg/dL',
          indication: 'Significant Hyperuricemia (Gambhira Vatarakta / Gout): High risk of acute crystal synovitis (podagra), tophi, and urate nephrolithiasis; Kaishora Guggulu + Raktamokshana indicated.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('hba1c') || t.includes('glucose') || t.includes('fbs') || t.includes('ppbs') || t.includes('blood sugar')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Evaluates 3-month average glycemic control and fasting/post-meal glucose metabolism in Prameha / Madhumeha.',
      normalRange: 'HbA1c: 4.0% – 5.6% • Fasting Glucose (FBS): 70 – 99 mg/dL • Post-Prandial (2h PPBS): < 140 mg/dL',
      interpretations: [
        {
          valueRange: 'HbA1c < 5.7% | FBS 70–99 mg/dL | PPBS < 140 mg/dL',
          indication: 'Normal Euglycemia: Normal Kleda-Medas metabolism and pancreatic Agni.',
          severity: 'normal',
        },
        {
          valueRange: 'HbA1c 5.7% – 6.4% | FBS 100–125 mg/dL | PPBS 140–199 mg/dL',
          indication: 'Pre-Diabetes (Purvarupa / Kaphaja Prameha): Reversible stage with Nisha-Amalaki, Yava (barley) diet, and Vyayama.',
          severity: 'borderline',
        },
        {
          valueRange: 'HbA1c ≥ 6.5% | FBS ≥ 126 mg/dL | PPBS ≥ 200 mg/dL',
          indication: 'Confirmed Diabetes Mellitus (Madhumeha): Chronic hyperglycemia with risk of microvascular Srotodushti; requires Chandraprabha Vati, Shilajatu Rasayana, and strict glycemic monitoring.',
          severity: 'high',
        },
        {
          valueRange: 'FBS < 70 mg/dL',
          indication: 'Hypoglycemia Alert: Excessive glucose lowering or Ojakshaya; immediately administer fast-acting carbohydrates.',
          severity: 'low',
        },
      ],
    };
  }

  if (t.includes('cbc') || t.includes('complete blood count') || t.includes('hemoglobin') || t.includes('ferritin')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Evaluates Rakta Dhatu status (Hemoglobin/RBC), immune response (WBC/Differential), and platelet hemostasis.',
      normalRange: 'Hb: Male 13.5–17.5 g/dL, Female 12.0–15.5 g/dL • TLC (WBC): 4,000–11,000 /µL • Platelets: 1.5–4.5 Lakh/µL • Ferritin: 30–300 ng/mL',
      interpretations: [
        {
          valueRange: 'Hb 12–17 g/dL & WBC 4,000–11,000 /µL',
          indication: 'Normal Hematological Profile: Balanced Rakta Dhatu and normal leukocyte immunity.',
          severity: 'normal',
        },
        {
          valueRange: 'Hb < 11.5 g/dL (or Ferritin < 30 ng/mL)',
          indication: 'Anemia (Pandu Roga / Rakta Kshaya): Microcytic if MCV < 80 fL (Iron deficiency — Punarnavadi Mandura / Dhatri Lauha indicated); Macrocytic if MCV > 100 fL (B12/Folate deficiency).',
          severity: 'low',
        },
        {
          valueRange: 'WBC > 11,000 /µL (or Eosinophils > 6% / AEC > 500)',
          indication: 'Leukocytosis / Eosinophilia: Neutrophilia indicates acute bacterial infection or inflammation; Eosinophilia indicates allergic/atopic Rakta-Pitta or parasitic Krimiroga.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('lft') || t.includes('liver') || t.includes('bilirubin') || t.includes('sgpt') || t.includes('sgot')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Assesses Yakrit (hepatobiliary) function, Ranjaka Pitta metabolism, and drug/herb clearance safety.',
      normalRange: 'Total Bilirubin: 0.2–1.2 mg/dL • SGPT (ALT): 7–56 U/L • SGOT (AST): 8–48 U/L • ALP: 44–147 U/L • Albumin: 3.5–5.0 g/dL',
      interpretations: [
        {
          valueRange: 'Bilirubin ≤ 1.2 mg/dL & SGPT/SGOT < 45 U/L',
          indication: 'Normal Hepatic Function: Unimpaired Yakrit & Ranjaka Pitta; safe for all classical formulations.',
          severity: 'normal',
        },
        {
          valueRange: 'Bilirubin 1.3–3.0 mg/dL or SGPT/SGOT 1.5x–3x ULN (60–150 U/L)',
          indication: 'Mild-to-Moderate Hepatic Stress (Yakrit Dushti / Early Kamala): Fatty liver, mild hepatitis, or Pitta Dushti; administer Phalatrikadi Kwatha, Bhumyamalaki, and Katuki.',
          severity: 'borderline',
        },
        {
          valueRange: 'Bilirubin > 3.0 mg/dL or SGPT/SGOT > 3x ULN (> 150 U/L)',
          indication: 'Significant Hepatocellular / Cholestatic Injury (Koshthashrita / Shakhashrita Kamala): Avoid heavy metallic Rasa-Aushadhis; prioritize Nitya Virechana and hepatoprotective Tikta Kwathas.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('creatinine') || t.includes('renal') || t.includes('rft') || t.includes('kft') || t.includes('egfr') || t.includes('urea')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Measures Vrikka (glomerular filtration) function and Mutravaha Srotas clearance.',
      normalRange: 'Serum Creatinine: Male 0.7–1.3 mg/dL, Female 0.6–1.1 mg/dL • Blood Urea: 15–40 mg/dL • eGFR: > 90 mL/min/1.73m²',
      interpretations: [
        {
          valueRange: 'Creatinine 0.6–1.2 mg/dL & eGFR > 90',
          indication: 'Normal Renal Filtration: Healthy Mutravaha Srotas and Vrikka function.',
          severity: 'normal',
        },
        {
          valueRange: 'Creatinine 1.3–1.9 mg/dL or eGFR 60–89',
          indication: 'Mild Renal Impairment: Dehydration, NSAID exposure, or early nephropathy; avoid nephrotoxic drugs and use Punarnavashtaka / Gokshuradi.',
          severity: 'borderline',
        },
        {
          valueRange: 'Creatinine ≥ 2.0 mg/dL or eGFR < 60',
          indication: 'Moderate-to-Severe Renal Dysfunction (CKD / Mutukasada): Strictly avoid heavy metal Bhasmas and NSAIDs; monitor electrolytes closely.',
          severity: 'high',
        },
      ],
    };
  }

  if (t.includes('urine') || t.includes('microalbumin')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Evaluates Mutra Pariksha parameters including glycosuria, proteinuria, pyuria, hematuria, and crystals.',
      normalRange: 'pH: 4.5–8.0 • Specific Gravity: 1.005–1.025 • Glucose/Protein/Ketones: Nil • Pus Cells: 0–4 /hpf • RBC: 0–2 /hpf • ACR: < 30 mg/g',
      interpretations: [
        {
          valueRange: 'Glucose Nil, Protein Nil, Pus Cells < 4/hpf',
          indication: 'Normal Urinalysis: Clear Mutravaha Srotas without infection or glomerular leak.',
          severity: 'normal',
        },
        {
          valueRange: 'Pus Cells > 5–10 /hpf or Nitrite Positive',
          indication: 'Urinary Tract Infection (Pittaja Mutrakrichra): Bacterial cystitis/pyelonephritis; Chandraprabha Vati + Gokshura-Punarnava Kwatha indicated.',
          severity: 'high',
        },
        {
          valueRange: 'RBCs > 3/hpf or Calcium Oxalate / Uric Acid Crystals',
          indication: 'Microscopic Hematuria / Crystalluria (Mutrashmari): Suggests renal/ureteric calculus; Varunadi Kwatha & Pashanabheda indicated.',
          severity: 'borderline',
        },
      ],
    };
  }

  if (t.includes('x-ray') || t.includes('mri') || t.includes('usg') || t.includes('ultrasound') || t.includes('ct') || t.includes('endoscopy')) {
    return {
      testName: rawTestName,
      clinicalPurpose:
        existingPurpose ||
        'Direct anatomical and structural visualization of Srotodushti (Sanga, Granthi, Asthi-kshaya, or mucosal erosion).',
      normalRange: 'Normal anatomical contour, preserved joint/disc space, normal parenchymal echotexture, and absence of effusion/calculi/erosion.',
      interpretations: [
        {
          valueRange: 'Normal Joint Space / Disc Height / Organ Contour',
          indication: 'No structural deformity (functional or early Kriyakala stage); high reversibility with Shamana therapy.',
          severity: 'normal',
        },
        {
          valueRange: 'Periarticular Osteopenia / Mild Disc Bulge / Grade 1 Fatty Liver / Mucosal Erythema',
          indication: 'Early Structural Sthana-Samshraya: Reversible with targeted Basti, Tikta Ghrita, or Pathya-Apathya.',
          severity: 'borderline',
        },
        {
          valueRange: 'Marginal Bone Erosions / Osteophytes & Joint Space Loss / Nerve Root Compression / Calculus > 5mm',
          indication: 'Established Vyakti/Bheda Stage: Requires combined Shodhana (Basti/Virechana), Para-surgical (Agnikarma/Viddhakarma), and surgical/specialist co-management if obstructed.',
          severity: 'high',
        },
      ],
    };
  }

  return {
    testName: rawTestName,
    clinicalPurpose:
      existingPurpose ||
      'Evaluates underlying biochemical, inflammatory, or organ-specific parameters to confirm diagnosis and guide therapy.',
    normalRange: 'Within standard age- and gender-matched laboratory reference intervals.',
    interpretations: [
      {
        valueRange: 'Within Reference Interval (Normal)',
        indication: 'Indicates physiological Dhatu-Samya for this parameter; rules out severe organ/systemic derangement.',
        severity: 'normal',
      },
      {
        valueRange: 'Mild-to-Moderate Deviation (1x – 2x Reference Limit)',
        indication: 'Indicates active Dosha-Dushya Sammurchhana (Sama or subacute stage); guides targeted Shamana and Pathya modification.',
        severity: 'borderline',
      },
      {
        valueRange: 'Markedly Abnormal (> 2x–3x Limit or Positive Biomarker)',
        indication: 'Confirms primary pathology or red-flag severity; warrants intensive Shodhana/Shamana and serial monitoring.',
        severity: 'high',
      },
    ],
  };
};

export interface DifferentialItem {
  condition: string;
  category: 'Ayurvedic (Vyadhi)' | 'Modern (Disease)' | string;
  correlatedSymptoms?: string;
  whyNotThisCondition?: string;
  pratyatmaLakshana: string;
  ruleInPoints: string;
  ruleOutPoints: string;
  questionsToAsk: string[];
}

export interface DiseaseConfirmationProtocol {
  targetDisease: string;
  ayurvedicConfirmation: {
    pratyatmaLakshana: string;
    confirmatorySigns: string[];
    therapeuticTrialConfirmation: string; // Upashaya-Anupashaya
  };
  modernConfirmation: {
    goldStandardCriteria: string;
    confirmatoryBiomarkers: string[];
  };
  eliminationOfOtherConditions: {
    competingDisease: string;
    correlatedSymptoms: string;
    whyRuledOut: string;
    distinguishingSignOrTest: string;
  }[];
}

export interface DifferentialDiagnosisData {
  confirmationProtocol?: DiseaseConfirmationProtocol;
  competingConditions: DifferentialItem[];
  suggestedClinicalQuestions: string[];
}

export interface ClinicalInvestigationItem {
  testName: string;
  diagnosticPurpose: string; // Why this specific investigation is done / what it finds
  isMandatory: boolean; // Marked with star only when necessary/mandatory
}

export interface MedicalAnalysisResult {
  ayurvedicAnalysis: {
    vyadhiVinischaya: string;
    doshaDushya: {
      dosha: string;
      dushya: string;
      agni: string;
      srotas: string;
    };
    shlokaReference: {
      shlokaSanskrit: string;
      shlokaTransliteration: string;
      meaning: string;
      sourceBook: string;
      chapterAndVerse: string;
    };
    chikitsaSutra: string;
    shamanaChikitsa: {
      category: string;
      medicineName: string;
      dosage: string;
      anupana: string;
      timing: string;
      indications: string;
      reference?: string;
    }[];
    shodhanaChikitsa: {
      procedure: string;
      indication: string;
      details: string;
    }[];
    paraSurgicalTherapy?: {
      therapyName: 'Agnikarma' | 'Viddhakarma' | 'Jalaukavacharana' | 'Marma Chikitsa' | 'Other';
      procedureNotes: string;
      siteAndInstruments: string;
    };
    pathyaApathya: {
      pathyaAhara: string[];
      apathyaAhara: string[];
      viharaRules: string[];
    };
    acharyaProtocols?: Record<string, AcharyaClinicalProtocol>;
  };
  modernMedicineAnalysis: {
    diagnosisDifferential: string[];
    pathophysiologySummary: string;
    recommendedInvestigations: (string | ClinicalInvestigationItem)[];
    pharmacotherapyStandard: {
      drugClass: string;
      genericName: string;
      standardRegimen: string;
      cautionOrMonitoring: string;
      reference?: string;
    }[];
    redFlagsAndEmergency: string[];
    dietAndNutritionGuidelines: string[];
    textbookReferences: string[];
  };
  differentialDiagnosis?: DifferentialDiagnosisData;
  doctorVerificationSummary: string;
}

// Fallback comprehensive knowledge base for instant zero-latency responses & offline reliability
export const CLASSICAL_MEDICAL_DATABASE: Record<string, MedicalAnalysisResult> = {
  amavata: {
    ayurvedicAnalysis: {
      vyadhiVinischaya: 'Amavata (Rheumatoid Arthritis / Systemic Inflammatory Polyarthritis)',
      doshaDushya: {
        dosha: 'Vata Pradhana (Vyana & Apana Vayu) with Kapha Anubandha; sthithi of virulent Ama (metabolic endotoxins)',
        dushya: 'Rasa, Asthi, Sandhi, Snayu, Kandara',
        agni: 'Mandaagni & Dhatvagni-mandya leading to Amotpatti',
        srotas: 'Rasavaha, Asthivaha, and Purishavaha Srotas (Srotorodha & Sanga)',
      },
      shlokaReference: {
        shlokaSanskrit: 'युगपत् कुपितावन्तस्त्रिकसन्धिप्रवेशकौ । स्तब्धं च कुरुतो गात्रमामवातः स उच्यते ॥',
        shlokaTransliteration: 'Yugapat kupitāv antas trika-sandhi-praveśakau | Stabdhaṁ ca kuruto gātram āmavātaḥ sa ucyate ||',
        meaning: 'When virulent Ama and aggravated Vata simultaneously enter the Trika (lumbosacral region) and peripheral joints, producing stiffness, excruciating pain, and body rigidity, that severe disease is termed Amavata.',
        sourceBook: 'Madhava Nidana',
        chapterAndVerse: 'Amavata Nidanam, Shloka 6-7 (also ref: Chakradatta Amavata Chikitsa 1)',
      },
      chikitsaSutra: 'लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च । विरेचनं स्नेहपानं बस्तयश्चाममारुते ॥ (Langhanam, Swedanam, Tikta-Deepana-Katuni cha, Virechanam, Snehapanam, Bastayashcha Amamarute)',
      shamanaChikitsa: [
        {
          category: 'Kashaya / Kwatha',
          medicineName: 'Rasnadi Saptaka Kwatha / Amavatari Kashayam',
          dosage: '40 ml BD before meals',
          anupana: 'Warm water with 1 pinch of Sunthi churna',
          timing: 'Morning (Pratah) & Evening (Sayam) on empty stomach',
          indications: 'Pacifies Vata, digests Ama, relieves joint swelling & morning stiffness',
        },
        {
          category: 'Guggulu Yoga',
          medicineName: 'Simhanada Guggulu / Yogaraja Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Warm water or Dashamoola kwatha',
          timing: 'After meals (Adhashcha)',
          indications: 'Classical Shodhana-shamana compound containing Triphala, Gandhaka, and Eranda taila; purges Ama through gut',
        },
        {
          category: 'Rasa Aushadhi',
          medicineName: 'Amavatari Vati / Vata Vidhwamsana Ras',
          dosage: '1 tablet (250mg) BD',
          anupana: 'Warm water with ginger juice',
          timing: 'After meals',
          indications: 'Alleviates severe joint stabbing pain and blocks inflammatory cascade',
        },
        {
          category: 'Eranda Taila Prayoga',
          medicineName: 'Nitya Virechana with Eranda Sneha (Castor Oil)',
          dosage: '15-20 ml at bedtime',
          anupana: 'Warm ginger tea / Sunthi jala',
          timing: 'At bedtime (Ratri)',
          indications: 'Eranda is Param Vata-Amavatahara; flushes morbid Ama through colon',
        },
      ],
      shodhanaChikitsa: [
        {
          procedure: 'Valuka Sweda (Dry Sand / Bolus Fomentation)',
          indication: 'Ruksha Swedana is strictly mandatory in Amavata (Snigdha Sweda is contraindicated due to Ama).',
          details: 'Heated clean sand tied in cloth boluses applied over swollen joints twice daily to digest local Ama and remove stiffness.',
        },
        {
          procedure: 'Vaitarana Basti / Kshara Basti',
          indication: 'The gold-standard Ayurvedic Panchakarma treatment for Amavata.',
          details: 'Formulated with Chincha (tamarind), Guda (jaggery), Saindhava, Gomutra, and Eranda taila. Flushes deep-seated Ama and pacifies Apana Vayu.',
        },
      ],
      paraSurgicalTherapy: {
        therapyName: 'Agnikarma',
        procedureNotes: 'Indicated in chronic, refractory joint pain with severe Vata stiffness once acute Ama has been digested (Nirama avastha). Bindu-vedha Agnikarma over affected periarticular tender points.',
        siteAndInstruments: 'Panchadhatu Shalaka heated to red-hot; applied with micro-cautery dots on periarticular points.',
      },
      pathyaApathya: {
        pathyaAhara: [
          'Purana Yava (old barley)',
          'Shashtika Shali (aged red rice)',
          'Kulatha (horsegram soup)',
          'Sunthi (dry ginger)',
          'Lashuna (garlic)',
          'Shigru (drumstick)',
          'Karavellaka (bitter gourd)',
          'Warm boiled water (Ushnodaka) exclusively',
        ],
        apathyaAhara: [
          'Dahi (curd / yogurt)',
          'Matsya (fish)',
          'Masha (black gram / urad dal)',
          'Sheetala Jala (cold / iced water)',
          'Heavy, oily, deep-fried fast food (Guru, Snigdha, Abhishyandi ahara)',
          'Bakery items & refined flour (Maida)',
        ],
        viharaRules: [
          'Strictly avoid Diwaswapna (daytime sleep)',
          'Avoid exposure to cold winds and air conditioning directly on joints (Purva vata)',
          'Gentle Sukshma Vyayama; avoid strenuous mechanical impact during acute flares',
        ],
      },
    },
    modernMedicineAnalysis: {
      diagnosisDifferential: [
        'Rheumatoid Arthritis (ACR/EULAR Criteria score >= 6/10)',
        'Ankylosing Spondylitis / HLA-B27 Spondyloarthropathy',
        'Psoriatic Arthritis',
        'Systemic Lupus Erythematosus (SLE)',
        'Post-viral Reactive Arthritis (Chikungunya / Dengue arthropathy)',
      ],
      pathophysiologySummary:
        'Autoimmune inflammatory synoviopathy mediated by CD4+ T-cells, TNF-alpha, IL-1, and IL-6 cytokines leading to synovial hypertrophy (pannus formation), cartilage degradation, and subchondral bone erosions.',
      recommendedInvestigations: [
        {
          testName: 'Anti-Cyclic Citrullinated Peptide (Anti-CCP / ACPA) & Quantitative RF IgM',
          diagnosticPurpose: 'Detects autoimmune citrullinated antibodies (96% specificity) and Rheumatoid Factor to definitively confirm Rheumatoid Arthritis (Amavata) and predict erosive joint risk.',
          isMandatory: true,
        },
        {
          testName: 'ESR & High-Sensitivity C-Reactive Protein (hs-CRP)',
          diagnosticPurpose: 'Quantifies acute systemic inflammatory load (Sama stage severity) and serves as the baseline marker to track response to Ama-Pachana therapy.',
          isMandatory: true,
        },
        {
          testName: 'Complete Blood Count (CBC) with Peripheral Smear',
          diagnosticPurpose: 'Evaluates for normocytic normochromic anemia of chronic inflammation (Pandu anubandha) and reactive thrombocytosis.',
          isMandatory: false,
        },
        {
          testName: 'X-Ray Bilateral Hands & Wrists (AP/Oblique)',
          diagnosticPurpose: 'Detects periarticular osteopenia, uniform joint space narrowing, and marginal subchondral bone erosions in chronic cases.',
          isMandatory: false,
        },
        {
          testName: 'Baseline Liver & Renal Function Tests (LFT, Serum Creatinine, Uric Acid)',
          diagnosticPurpose: 'Excludes Vatarakta (Gout via Serum Uric Acid) and ensures hepatic/renal safety prior to initiating Rasa-Aushadhi or DMARDs.',
          isMandatory: false,
        },
      ],
      pharmacotherapyStandard: [
        {
          drugClass: 'Conventional DMARD',
          genericName: 'Methotrexate (MTX)',
          standardRegimen: '7.5mg to 15mg orally once weekly with mandatory Folic Acid 5mg supplement on off-days',
          cautionOrMonitoring: 'Monitor LFT & CBC baseline and every 8-12 weeks; strict pregnancy contraindication',
        },
        {
          drugClass: 'Short-term Bridge Therapy',
          genericName: 'Prednisolone / Methylprednisolone',
          standardRegimen: '5mg - 10mg daily morning tapering dose during acute flare only',
          cautionOrMonitoring: 'Taper off rapidly; monitor blood glucose, bone density, and BP',
        },
      ],
      redFlagsAndEmergency: [
        'High spiking fevers with monoarticular red, hot effusion (rule out Septic Arthritis)',
        'Sudden motor weakness or paresthesias in extremities (Atlantoaxial subluxation with cervical cord compression)',
        'Severe eye redness with scleritis or visual changes',
      ],
      dietAndNutritionGuidelines: [
        'Anti-inflammatory Mediterranean diet high in Omega-3 fatty acids (flaxseeds, walnuts)',
        'Curcumin (Turmeric) extract 500mg BD for synergistic COX-2 inhibition',
        'Vitamin D3 (60,000 IU weekly for 8 weeks if deficient) and Calcium 500mg daily',
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Chapter 351: Rheumatoid Arthritis",
        "Robbins & Cotran Pathologic Basis of Disease 10th Ed - Musculoskeletal Pathology",
        "Katzung's Basic & Clinical Pharmacology 15th Ed - NSAIDs and DMARDs",
      ],
    },
    differentialDiagnosis: {
      confirmationProtocol: {
        targetDisease: 'Amavata (Rheumatoid Arthritis)',
        ayurvedicConfirmation: {
          pratyatmaLakshana: 'Vrishchika-damsha-vat vedana (scorpion-sting like severe pain), Trika-Sandhi-Pravesha (simultaneous involvement of axial & peripheral joints), and Stabdha-gatrata (prolonged morning stiffness >60 mins) with Sama tongue & pulse.',
          confirmatorySigns: [
            'Sama Lakshanas: Angamarda (body ache), Aruchi (anorexia), Trishna, Alasya, Gaurava (heaviness), Jwara, and Apaka (indigestion).',
            'Symmetrical polyarticular swelling of small joints (MCP, PIP, wrists) sparing DIP joints.',
            'Jihwa Pariksha shows thick white/yellowish Sama coating; Nadi is Guru, Stabdha, and Mandukagati.',
          ],
          therapeuticTrialConfirmation:
            'Upashaya-Anupashaya Test: Dry sand fomentation (Ruksha Valuka Sweda) and Langhana bring marked relief, whereas oil massage (Snigdha Abhyanga) immediately worsens pain and stiffness — confirming Amavata over pure Vata.',
        },
        modernConfirmation: {
          goldStandardCriteria: '2010 ACR/EULAR Classification Criteria for Rheumatoid Arthritis (Confirmed when total score ≥ 6/10 across joint distribution, serology, acute-phase reactants, and duration ≥ 6 weeks).',
          confirmatoryBiomarkers: [
            'Positive Anti-CCP (ACPA) with 95–98% specificity + Elevated RF IgM titer',
            'Markedly elevated ESR (>30 mm/hr) and hs-CRP (>10 mg/L) during active synovitis',
            'Ultrasound/MRI power Doppler showing active synovial pannus and periarticular erosions',
          ],
        },
        eliminationOfOtherConditions: [
          {
            competingDisease: 'Sandhigata Vata (Osteoarthritis)',
            correlatedSymptoms: 'Joint pain, swelling, and restricted movement on flexion/extension.',
            whyRuledOut: 'Sandhivata has short morning stiffness (<30m), worsens with physical activity/walking, has no systemic Ama/fever/anorexia, and responds to warm oil Abhyanga.',
            distinguishingSignOrTest: 'Negative Anti-CCP/RF, normal ESR/CRP, and weight-bearing X-ray showing osteophytes rather than marginal erosions.',
          },
          {
            competingDisease: 'Vatarakta (Gouty Arthritis)',
            correlatedSymptoms: 'Acute severe joint pain, swelling, tenderness, and burning.',
            whyRuledOut: 'Vatarakta begins abruptly at midnight in the 1st MTP joint (big toe) with fiery red/coppery discoloration (Tamra-twak) and Rakta-Pitta dominance rather than symmetrical hand stiffness.',
            distinguishingSignOrTest: 'Serum Uric Acid >7.0 mg/dL and monosodium urate needle-shaped crystals in synovial fluid.',
          },
          {
            competingDisease: 'Systemic Lupus Erythematosus (SLE) / Connective Tissue Arthropathy',
            correlatedSymptoms: 'Symmetrical small-joint polyarthralgia, fatigue, and low-grade fever.',
            whyRuledOut: 'SLE causes non-erosive Jaccoud arthropathy accompanied by malar butterfly rash, photosensitivity, oral ulcers, or proteinuria.',
            distinguishingSignOrTest: 'Positive ANA (Immunofluorescence) and Anti-dsDNA with low complement C3/C4.',
          },
        ],
      },
      competingConditions: [
        {
          condition: 'Sandhigata Vata (Osteoarthritis of Weight-Bearing Joints)',
          category: 'Ayurvedic (Vyadhi)',
          correlatedSymptoms: 'Joint pain, swelling (Shotha), and painful flexion/extension (Prasarana-akunchanayo sapravritti vedana).',
          whyNotThisCondition: 'Ruled out because Sandhivata is Dhatukshayajanya (degenerative without Ama), stiffness lasts <30 mins, pain worsens on exertion, and Snigdha Taila Abhyanga relieves it (whereas oil worsens Amavata).',
          pratyatmaLakshana: 'Vatapurna-driti sparsha (bellows-like crepitus), pain worsens with walking/stairs and improves with rest. No systemic Ama, no anorexia, no feverish malaise.',
          ruleInPoints: 'Bony crepitus on passive knee motion, age >50, osteophytes on X-ray.',
          ruleOutPoints: 'Lack of prolonged >1h morning stiffness, normal ESR/CRP, lack of bilateral small MCP/PIP involvement.',
          questionsToAsk: [
            'Does your joint pain worsen progressively after walking or climbing stairs, rather than feeling stiffest upon first waking up in the morning?',
            'Do you feel crackling or grating sounds (crepitus) inside the knees while sitting down or standing up?',
          ],
        },
        {
          condition: 'Vatarakta (Gouty Arthritis / Hyperuricemic Crystal Arthropathy)',
          category: 'Ayurvedic (Vyadhi)',
          correlatedSymptoms: 'Excruciating joint pain (Akhu-visha / Vrishchika damsha vedana), acute joint swelling, and local warmth.',
          whyNotThisCondition: 'Ruled out because Vatarakta typically initiates asymmetrically in the big toe (Padangushtha / 1st MTP) at midnight with intense Rakta-Pitta burning, relieved by Raktamokshana and Tikta Ghrita.',
          pratyatmaLakshana: 'Sudden midnight excruciating pain and intense erythema in the big toe (Padangushtha) with hyperuricemia.',
          ruleInPoints: 'First MTP joint involvement, acute nocturnal onset, serum uric acid >7.0 mg/dL.',
          ruleOutPoints: 'Lack of symmetrical polyarticular morning stiffness in hands/wrists.',
          questionsToAsk: [
            'Did this severe joint inflammation begin abruptly in the middle of the night in the big toe or ankle with fiery red burning skin?',
            'Has high alcohol, seafood, or red meat intake preceded the acute painful joint flares?',
          ],
        },
        {
          condition: 'Seronegative Spondyloarthropathy / Psoriatic or Reactive Arthritis',
          category: 'Modern (Disease)',
          correlatedSymptoms: 'Inflammatory morning stiffness, joint effusion, and elevated ESR/CRP.',
          whyNotThisCondition: 'Ruled out when there is no dactylitis (sausage digit), no DIP nail pitting/psoriatic plaques, no sacroiliitis (alternating buttock pain), and positive Anti-CCP/RF confirms true RA.',
          pratyatmaLakshana: 'Asymmetrical oligoarthritis, dactylitis, enthesitis (Achilles tendon tenderness), or axial HLA-B27 sacroiliitis.',
          ruleInPoints: 'DIP joint involvement, psoriatic skin/nail lesions, HLA-B27 positivity, or recent GI/GU infection.',
          ruleOutPoints: 'Symmetrical MCP/PIP polyarthritis with high-titer Anti-CCP and Rheumatoid Factor.',
          questionsToAsk: [
            'Are the very tip joints of your fingers (DIP joints) swollen with nail pitting or scaly skin patches?',
            'Did the joint swelling follow an episode of acute diarrhea or urinary tract infection 2–4 weeks ago?',
          ],
        },
      ],
      suggestedClinicalQuestions: [
        'How long does joint stiffness persist after waking in the morning (is it strictly greater than 60 minutes)?',
        'Do you feel persistent heaviness (Gaurava), loss of appetite (Aruchi), or unrefreshing sleep indicative of systemic Ama?',
        'Does dry sand heat (Valuka Sweda) provide relief, whereas warm oil massage (Abhyanga) aggravates the pain and swelling?',
        'Are the small joints of both hands (MCP & PIP joints) equally affected on both sides?',
        'Have you noticed any subcutaneous nodules over pressure points such as the elbows?',
      ],
    },
    doctorVerificationSummary:
      'Amavata presents with classical Ama-Vata lakshanas. Initiate Deepana-Pachana and Langhana with Rasnadi Saptaka Kwatha & Simhanada Guggulu. Schedule Valuka Sweda for instant analgesic relief. Advise Anti-CCP and inflammatory markers for baseline confirmation. Confirm prescription upon clinical pulse (Nadi) and tongue (Jihwa) review.',
  },
  sandhivata: {
    ayurvedicAnalysis: {
      vyadhiVinischaya: 'Sandhivata (Osteoarthritis / Dhatukshayajanya Vata Vyadhi)',
      doshaDushya: {
        dosha: 'Vata Pradhana (Vyana Vayu & Shleshaka Kapha Kshaya)',
        dushya: 'Asthi, Majja, Sandhi Snayu, and Sandhikara Srotas',
        agni: 'Vishama Agni with Dhatukshaya',
        srotas: 'Asthivaha and Majjavaha Srotas (Rukshata, Parushata, and Kshaya)',
      },
      shlokaReference: {
        shlokaSanskrit: 'वातपूर्णदृतिस्पर्शः शोथः सन्धिगतेऽनिले । प्रसारणाकुञ्चनयोः प्र Clintप्रवृत्तिश्च सवेदना ॥',
        shlokaTransliteration: 'Vātapūrṇa-dṛti-sparśaḥ śothaḥ sandhi-gate’nile | Prasāraṇākuñcanayoḥ pravṛttiś ca savedanā ||',
        meaning: 'When aggravated Vata lodges into the joints (Sandhi), the joint feels like an air-filled leather bellows on palpation, accompanied by swelling, crepitus, and painful restriction during flexion and extension.',
        sourceBook: 'Charaka Samhita',
        chapterAndVerse: 'Chikitsa Sthana, Chapter 28 (Vatavyadhi Chikitsitam), Shloka 37',
      },
      chikitsaSutra: 'स्नेहस्वेदोपपन्नं तु वातव्याधिमुपाचरेत् । बस्तिभिर्मधुरप्रायैः सर्पिस्तैलसमन्वितैः ॥ (Snehana, Swedana, Tikta Ghrita Pana, and Basti are param for Sandhigata Vata)',
      shamanaChikitsa: [
        {
          category: 'Kashaya',
          medicineName: 'Maharasnadi Kwatha / Sahacharadi Kashayam',
          dosage: '40 ml BD before meals',
          anupana: 'Warm water with 5ml Castor oil or Dhanwantaram taila drops',
          timing: 'Morning and evening before food',
          indications: 'Deep nourishing Vata-pacifier; regenerates Shleshaka kapha and reduces joint stiffness',
        },
        {
          category: 'Guggulu Yoga',
          medicineName: 'Lakshadi Guggulu / Yogaraja Guggulu',
          dosage: '2 tablets (500mg) BD',
          anupana: 'Warm milk with pinch of Ashwagandha or warm water',
          timing: 'After meals',
          indications: 'Asthi-poshaka formula; restores subchondral bone integrity and joint lubrication',
        },
        {
          category: 'Ghrita / Sneha',
          medicineName: 'Tikta Guggulu Ghrita / Ashwagandhadi Lehya',
          dosage: '10g once daily in morning',
          anupana: 'Warm cow milk',
          timing: 'Early morning empty stomach',
          indications: 'Reverses Dhatukshaya and prevents joint degeneration (Sandhi-shaithilya)',
        },
        {
          category: 'Taila Abhyanga',
          medicineName: 'Mahanarayana Taila / Murivenna Taila',
          dosage: 'Local application followed by warm fomentation',
          anupana: 'External only',
          timing: 'Twice daily',
          indications: 'Relieves joint stiffness, strengthens collateral ligaments and quadriceps',
        },
      ],
      shodhanaChikitsa: [
        {
          procedure: 'Janu Basti / Kati Basti (Warm Medicated Oil Pooling)',
          indication: 'First-line local Panchakarma upakarma for knee/spine Sandhivata.',
          details: 'Retaining warm Ksheerabala 101 / Mahanarayana taila inside a black gram dough ring for 30–40 minutes followed by Nadi sweda.',
        },
        {
          procedure: 'Tikta Ksheera Basti',
          indication: 'Asthi-Dhatu replenishment per Charaka Sutra.',
          details: 'Decoction of Tikta Dravyas boiled in milk (Ksheerapaka) with Ghritha and honey administered as non-irritant enema.',
        },
      ],
      paraSurgicalTherapy: {
        therapyName: 'Agnikarma',
        procedureNotes: 'Highly effective instant pain relief for medial joint line tenderness and periarticular trigger points in Sandhivata. Instant Vata and pain neutralization.',
        siteAndInstruments: 'Panchadhatu Shalaka heated to red-hot; Bindu Agnikarma 0.5cm apart along joint line.',
      },
      pathyaApathya: {
        pathyaAhara: [
          'Godugdha (pure cow milk with turmeric)',
          'Ghrita (A2 cow ghee 1–2 tsp daily)',
          'Tila (sesame seeds) and Badam (almonds)',
          'Rasona (Garlic boiled in milk)',
          'Wheat, aged rice, and warm vegetable soups',
        ],
        apathyaAhara: [
          'Chanaka (chickpeas / chana)',
          'Dry, light, cold foods (Ruksha, Sheeta, Laghu ahara)',
          'Excessive fasting and erratic meal timings',
          'Astringent and bitter food in excess without sneha',
        ],
        viharaRules: [
          'Avoid continuous stair-climbing and deep squats',
          'Maintain ideal body weight to reduce mechanical axial loading',
          'Daily isometric quadriceps strengthening exercises',
        ],
      },
    },
    modernMedicineAnalysis: {
      diagnosisDifferential: [
        'Osteoarthritis of the Knee / Hip (Kellgren-Lawrence Grade I - IV)',
        'Anserine Bursitis',
        'Meniscal tear / Medial collateral ligament sprain',
        'Pseudogout / Calcium Pyrophosphate Dihydrate (CPPD) deposition',
      ],
      pathophysiologySummary:
        'Biomechanical and biochemical degeneration of articular hyaline cartilage, subchondral bone sclerosis, osteophyte formation, and mild secondary synovial inflammation.',
      recommendedInvestigations: [
        {
          testName: 'Weight-Bearing AP & Lateral X-Ray of Affected Joints (Knees/Hips)',
          diagnosticPurpose: 'Directly visualizes asymmetrical medial joint space narrowing, subchondral bone sclerosis, marginal osteophytes, and subchondral cysts (Kellgren-Lawrence staging).',
          isMandatory: true,
        },
        {
          testName: 'Serum Calcium, 25-OH Vitamin D3 & Alkaline Phosphatase',
          diagnosticPurpose: 'Evaluates underlying Asthi-Dhatu nutritional deficiency (osteomalacia/osteopenia) contributing to accelerated subchondral bone wear.',
          isMandatory: false,
        },
        {
          testName: 'ESR, CRP & Serum Uric Acid',
          diagnosticPurpose: 'Ordered when mild effusion is present to confirm non-inflammatory mechanical status (normal ESR/CRP) and rule out Amavata or Vatarakta.',
          isMandatory: false,
        },
        {
          testName: 'MRI of Affected Joint',
          diagnosticPurpose: 'Indicated only if mechanical locking, bucket-handle meniscal tear, or cruciate ligament rupture is clinically suspected.',
          isMandatory: false,
        },
      ],
      pharmacotherapyStandard: [
        {
          drugClass: 'Chondroprotective agent',
          genericName: 'Glucosamine Sulfate + Chondroitin',
          standardRegimen: '1500mg Glucosamine + 1200mg Chondroitin once daily for minimum 3 months',
          cautionOrMonitoring: 'Safe long-term profile; caution in shellfish allergy',
        },
        {
          drugClass: 'Topical Analgesic',
          genericName: 'Diclofenac Diethylamine Gel + Linseed Oil',
          standardRegimen: 'Apply topically TDS over affected joint; avoids systemic GI risks',
          cautionOrMonitoring: 'Preferred over oral NSAIDs for geriatric patients',
        },
      ],
      redFlagsAndEmergency: [
        'Complete inability to bear weight / joint locking',
        'Rapidly expanding knee joint effusion with erythema',
      ],
      dietAndNutritionGuidelines: [
        'Target 5–10% weight loss if BMI > 25 (reduces joint force 4-fold per step)',
        'Collagen peptide supplementation 10g daily',
        'Low-impact non-weight bearing cardio: swimming and stationary cycling',
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Ed - Chapter 364: Osteoarthritis",
        "Davidson's Principles and Practice of Medicine 24th Ed - Rheumatology & Bone Diseases",
      ],
    },
    differentialDiagnosis: {
      confirmationProtocol: {
        targetDisease: 'Sandhivata (Osteoarthritis)',
        ayurvedicConfirmation: {
          pratyatmaLakshana: 'Vatapurna-driti sparsha (palpable crepitus feeling like an air-filled leather bag) and Prasarana-akunchanayo pravritti savedana (sharp mechanical pain on flexion and extension) without systemic Ama.',
          confirmatorySigns: [
            'Nirama Vata Lakshanas: Clean Nirama tongue, Vataja (Sarpagati) pulse, normal appetite, and absence of systemic fever.',
            'Predominant involvement of large weight-bearing joints (Janu/Knee, Kati/Spine, Vankshana/Hip) with bony enlargement.',
            'Stiffness after rest (gelling phenomenon) resolves within 15–20 minutes of gentle movement.',
          ],
          therapeuticTrialConfirmation:
            'Upashaya-Anupashaya Test: Warm medicated oil application (Mahanarayana / Ksheerabala Taila Abhyanga) and Janu Basti provide marked soothing relief, whereas dry fomentation (Ruksha Sweda) or fasting aggravates Vata.',
        },
        modernConfirmation: {
          goldStandardCriteria: 'ACR Clinical & Radiographic Criteria for Osteoarthritis (Age >45, activity-related joint pain, morning stiffness <30 mins, palpable crepitus, and bony enlargement).',
          confirmatoryBiomarkers: [
            'Weight-bearing radiograph showing Kellgren-Lawrence Grade I–IV osteophytes and joint space narrowing',
            'Normal ESR (<20 mm/hr) and negative RF / Anti-CCP excluding inflammatory synovitis',
          ],
        },
        eliminationOfOtherConditions: [
          {
            competingDisease: 'Amavata (Rheumatoid Arthritis)',
            correlatedSymptoms: 'Joint pain, swelling, and restricted mobility.',
            whyRuledOut: 'Amavata presents with prolonged morning stiffness (>1 hour), symmetrical small hand joint synovitis, systemic Mandagni/Ama, and worsens with oil application.',
            distinguishingSignOrTest: 'Negative Anti-CCP & RF, normal CRP/ESR, and absence of marginal bone erosions.',
          },
          {
            competingDisease: 'Internal Derangement / Meniscal or Ligament Tear',
            correlatedSymptoms: 'Localized knee pain aggravated by twisting or stair descent.',
            whyRuledOut: 'Meniscal tear has acute traumatic/twisting onset with true mechanical locking (inability to fully extend knee) and positive McMurray test.',
            distinguishingSignOrTest: 'Joint MRI demonstrating meniscal horn tear vs diffuse cartilage loss.',
          },
        ],
      },
      competingConditions: [
        {
          condition: 'Amavata (Rheumatoid Arthritis)',
          category: 'Ayurvedic (Vyadhi)',
          correlatedSymptoms: 'Joint pain, restricted joint movement, and mild periarticular swelling.',
          whyNotThisCondition: 'Ruled out because there is no systemic Ama (no fever, anorexia, or coated tongue), morning stiffness is brief (<30 mins), and small joints of hands are spared.',
          pratyatmaLakshana: 'Inflammatory polyarthritis with morning stiffness >1 hour, bilateral MCP/PIP involvement, systemic Ama, and anorexia.',
          ruleInPoints: 'Bilateral symmetrical small hand joint swelling, elevated ESR/CRP, positive RF/Anti-CCP.',
          ruleOutPoints: 'Pure knee/hip mechanical crepitus with asymmetric wear and absence of systemic Ama.',
          questionsToAsk: [
            'Do your knuckles and hand joints swell symmetrically on both sides with morning stiffness lasting over an hour?',
            'Do you experience low appetite, general body heaviness, or sluggish digestion alongside the joint pains?',
          ],
        },
        {
          condition: 'Asthi-Majja Kshaya (Primary Osteoporosis) / Meniscal Tear',
          category: 'Modern (Disease)',
          correlatedSymptoms: 'Weight-bearing bone and knee discomfort with age-related weakness.',
          whyNotThisCondition: 'Osteoporosis is clinically silent until fragility fracture occurs and lacks intra-articular crepitus (Vatapurna-driti sparsha); meniscal tear causes acute mechanical locking.',
          pratyatmaLakshana: 'Diffuse bone aching, brittle nails/teeth, loss of height, fragility fractures, or acute mechanical locking.',
          ruleInPoints: 'Low DEXA T-score (<-2.5) or positive McMurray test on knee rotation.',
          ruleOutPoints: 'Gradual progressive joint crepitus with focal osteophytes on X-ray.',
          questionsToAsk: [
            'Does the knee ever suddenly lock in place so you cannot straighten it at all?',
            'Have you suffered any bone fracture from a minor slip or trivial fall?',
          ],
        },
      ],
      suggestedClinicalQuestions: [
        'Does the knee pain worsen significantly when descending stairs or walking long distances?',
        'Is morning stiffness short-lived (resolving in less than 30 minutes after taking a few steps)?',
        'Can you feel an audible or tactile crunching sound (crepitus) inside the knee joint while flexing?',
        'Does the joint feel better after applying warm medicated oil (Taila Abhyanga) or Janu Basti?',
      ],
    },
    doctorVerificationSummary:
      'Sandhivata diagnosed with classic crepitus (Vatapurna-driti sparsha) and Dhatukshaya. Formulate Maharasnadi Kwatha with Lakshadi Guggulu and recommend 7-day course of Janu Basti. Weight-bearing radiograph recommended for staging.',
  },
  amlapitta: {
    ayurvedicAnalysis: {
      vyadhiVinischaya: 'Amlapitta / Urdhwaga Amlapitta (Hyperacidity, Non-ulcer Dyspepsia, GERD)',
      doshaDushya: {
        dosha: 'Pitta Pradhana (Pachaka Pitta with Vidagdha state) with Kapha Anubandha (Kledaka Kapha)',
        dushya: 'Rasa Dhatu, Annavaha Srotas, and Pureeshvaha Srotas',
        agni: 'Tikshnagni or Mandagni accompanied by Vidagdhajirna',
        srotas: 'Annavaha and Udakavaha Srotas (Dushti & Atipravritti)',
      },
      shlokaReference: {
        shlokaSanskrit: 'अविपाको क्लमोत्क्लेशस्तिक्ताम्लोद्गारगौरवम् । हृत्कण्ठदाहश्चारुचिश्चाम्लपित्तस्य लक्षणम् ॥',
        shlokaTransliteration: 'Avipāko klamotkleśas tiktāmlodgāra-gauravam | Hṛt-kaṇṭha-dāhaś cāruciś cāmlapittasya lakṣaṇam ||',
        meaning: 'Indigestion, unprovoked fatigue, nausea, sour and bitter eructations, heaviness in chest and abdomen, retrosternal and throat burning (heartburn), and loss of appetite are cardinal symptoms of Amlapitta.',
        sourceBook: 'Kashyapa Samhita / Madhava Nidana',
        chapterAndVerse: 'Madhava Nidana, Amlapitta Nidanam, Shloka 3-4',
      },
      chikitsaSutra: 'वमनं विरेचनं चैव प्रागेव परिकल्पयेत् । पश्चाच्छमनामाचरेत् ॥ (Shodhana through Vamana in Kapha-pradhana or Virechana in Pitta-pradhana, followed by Sheetala Shamana)',
      shamanaChikitsa: [
        {
          category: 'Kashaya',
          medicineName: 'Patoladi Kwatha / Phalatrikadi Kashayam',
          dosage: '40 ml BD before food',
          anupana: 'Warm water with half spoon honey',
          timing: 'Empty stomach morning and evening',
          indications: 'Pitta-rechaka, Deepana-Pachana, pacifies Vidagdha Pitta and cleanses mucosal lining',
        },
        {
          category: 'Churna / Rasayana',
          medicineName: 'Avipattikar Churna',
          dosage: '3g - 5g before meals or at bedtime',
          anupana: 'Warm water or coconut water',
          timing: 'Before meals for acid neutralization; bedtime for gentle Mrudu Virechana',
          indications: 'Classical formulation of Trivrit, Clove, Cardamom; neutralizes gastric acid and cleanses colon',
        },
        {
          category: 'Rasaushadhi',
          medicineName: 'Sutshekhar Ras / Kamadudha Ras (Moti-yukta)',
          dosage: '1 tablet (250mg) BD',
          anupana: 'Cold milk or butter or water',
          timing: 'After meals',
          indications: 'Potent Pitta-shamaka; stops Hrit-Kanthadaha and esophageal acid irritation',
        },
        {
          category: 'Avaleha / Ghritha',
          medicineName: 'Shatavari Ghritha / Dadimavaleha',
          dosage: '10g twice daily',
          anupana: 'Cow milk',
          timing: 'After meals',
          indications: 'Soothes eroded gastric mucosa and strengthens mucosal cytoprotective barrier',
        },
      ],
      shodhanaChikitsa: [
        {
          procedure: 'Sadyovirechana (Mild Therapeutic Purgation)',
          indication: 'Gold standard for Urdhwaga and Adhoga Amlapitta to eliminate morbid Pitta from its root seat (Amashaya & Grahani).',
          details: 'Administer Avipattikar Churna 10g or Trivrit Lehyam 15g with warm milk at bedtime.',
        },
      ],
      pathyaApathya: {
        pathyaAhara: [
          'Mudga Yusha (green gram soup)',
          'Draksha (raisins)',
          'Dadima (sweet pomegranate)',
          'Amalaki (Indian gooseberry) in honey or morabba',
          'Godugdha (cold boiled cow milk)',
          'Shita Toya (coconut water, coriander seed infused water)',
        ],
        apathyaAhara: [
          'Katu, Amla, Lavana rasa (excess pungent chilies, vinegar, sour curd, salty snacks)',
          'Fermented batters (Idli/Dosa), tea, coffee, carbonated sodas, alcohol, smoking',
          'Deep fried, reheated stale foods (Puti/Paryushita ahara)',
        ],
        viharaRules: [
          'Strictly avoid lying down immediately after meals (maintain 2-hour upright gap)',
          'Elevate head of bed by 6 inches',
          'Avoid anger, anxiety, stress (Krodha, Chinta triggers Pitta surge)',
        ],
      },
    },
    modernMedicineAnalysis: {
      diagnosisDifferential: [
        'Gastroesophageal Reflux Disease (GERD / Erosive Esophagitis)',
        'Peptic Ulcer Disease (Gastric vs Duodenal Ulcer / H. pylori associated)',
        'Functional Dyspepsia (Rome IV criteria)',
        'Biliary colic / Cholelithiasis',
      ],
      pathophysiologySummary:
        'Lower esophageal sphincter (LES) transient relaxations, impaired gastric clearance, and acid-peptic hypersecretion resulting in mucosal erosions.',
      recommendedInvestigations: [
        {
          testName: 'Helicobacter pylori Stool Antigen Test / 13C-Urea Breath Test',
          diagnosticPurpose: 'Identifies active H. pylori gastric mucosal colonization as the root trigger for chronic recurrent acid-peptic inflammation and gastritis.',
          isMandatory: false,
        },
        {
          testName: 'Upper GI Endoscopy (UGIE / Esophagogastroduodenoscopy)',
          diagnosticPurpose: 'Directly visualizes esophageal mucosal erosions (LA classification), peptic ulceration, or Barrett metaplasia. Mandatory ONLY if alarm features (dysphagia, melena, weight loss, age >50) are present.',
          isMandatory: false,
        },
        {
          testName: 'Resting 12-Lead ECG (in patients >40 yrs with retrosternal burning)',
          diagnosticPurpose: 'Excludes inferior wall myocardial ischemia / atypical angina mimicking acute Hrit-daha (heartburn).',
          isMandatory: false,
        },
        {
          testName: 'Ultrasonography (USG) Upper Abdomen',
          diagnosticPurpose: 'Rules out biliary colic / gallstones (Cholelithiasis) and fatty liver presenting with post-prandial epigastric heaviness.',
          isMandatory: false,
        },
      ],
      pharmacotherapyStandard: [
        {
          drugClass: 'Proton Pump Inhibitor (PPI)',
          genericName: 'Rabeprazole / Pantoprazole',
          standardRegimen: '20mg - 40mg once daily 30 minutes before breakfast for 4–8 weeks',
          cautionOrMonitoring: 'Avoid unindicated indefinite use; long-term risk of hypomagnesemia and B12 deficiency',
        },
        {
          drugClass: 'Mucosal Barrier Gel',
          genericName: 'Sucralfate + Oxetacaine suspension',
          standardRegimen: '10ml TDS 1 hour before food or at bedtime for acute burning',
          cautionOrMonitoring: 'Separate from other oral drugs by 2 hours due to binding',
        },
      ],
      redFlagsAndEmergency: [
        'Hematemesis (coffee-ground vomiting) or Melena (black tarry stools)',
        'Progressive dysphagia (difficulty swallowing) or odynophagia',
        'Unexplained rapid weight loss',
      ],
      dietAndNutritionGuidelines: [
        'Small, frequent meals instead of 2 heavy feasts',
        'Avoid high-fat meals, mint, chocolate, and citrus juices which relax LES',
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Ed - Chapter 316: Peptic Ulcer Disease & Related Disorders",
        "Goodman & Gilman's Pharmacological Basis of Therapeutics 14th Ed - Gastrointestinal Agents",
      ],
    },
    differentialDiagnosis: {
      confirmationProtocol: {
        targetDisease: 'Amlapitta (Hyperacidity / GERD)',
        ayurvedicConfirmation: {
          pratyatmaLakshana: 'Tiktamla-udgara (sour and bitter acid regurgitation into throat/mouth) and Hrit-Kantha-Daha (retrosternal & pharyngeal burning) with Avipaka (indigestion) and Klama (fatigue without exertion).',
          confirmatorySigns: [
            'Aggravation by Vidahi, Amla, Katu, Guru, and fermented foods or lying supine after meals.',
            'Urdhwaga Amlapitta shows upward acid reflux, nausea, and burning palms/soles; Adhoga shows loose sour bilious stools.',
          ],
          therapeuticTrialConfirmation:
            'Upashaya-Anupashaya Test: Immediate relief of burning upon taking Sheetala-Madhura-Tikta Dravyas (cold milk, tender coconut water, Sutshekhar Ras, or Avipattikar Churna), while spicy/sour food triggers instant flare.',
        },
        modernConfirmation: {
          goldStandardCriteria: 'Lyon Consensus & Montreal Definition for GERD (Classical heartburn and acid regurgitation ≥2 days/week with symptomatic response to PPI/alkaline therapy).',
          confirmatoryBiomarkers: [
            'Upper GI Endoscopy showing mucosal breaks (Los Angeles Grade A–D esophagitis) or erythematous antral gastritis',
            '24-hour ambulatory esophageal pH-impedance monitoring showing acid exposure time >6% (in refractory cases)',
          ],
        },
        eliminationOfOtherConditions: [
          {
            competingDisease: 'Parinamashoola (Duodenal Ulcer) & Annadravashoola (Gastric Ulcer)',
            correlatedSymptoms: 'Epigastric burning and acid dyspepsia.',
            whyRuledOut: 'Parinamashoola causes deep gnawing pain strictly 2–3 hours after meals (during Pitta-digestion phase) or at 2 AM, relieved by eating food; Amlapitta causes immediate post-prandial sour reflux and heartburn.',
            distinguishingSignOrTest: 'Endoscopy showing discrete duodenal/gastric ulcer crater vs non-ulcer reflux gastritis.',
          },
          {
            competingDisease: 'Hridroga / Acute Coronary Syndrome (Angina Pectoris)',
            correlatedSymptoms: 'Retrosternal chest burning/heaviness (Hrit-daha) and epigastric discomfort.',
            whyRuledOut: 'Cardiac ischemia is provoked by physical exertion (walking/stairs), radiates to left shoulder/jaw with diaphoresis, and is not relieved by antacids or belching.',
            distinguishingSignOrTest: '12-lead ECG ST-T changes and Serial Troponin-I.',
          },
        ],
      },
      competingConditions: [
        {
          condition: 'Parinamashoola (Duodenal / Peptic Ulcer)',
          category: 'Ayurvedic (Vyadhi)',
          correlatedSymptoms: 'Epigastric burning pain, sour belching, and digestive distress.',
          whyNotThisCondition: 'Ruled out when pain does not follow the strict hunger-pain cycle (waking patient at 2 AM, relieved by eating food) characteristic of Parinamashoola.',
          pratyatmaLakshana: 'Gnawing burning pain strictly 2-3 hours after food or waking up at 2 AM, relieved immediately by food or milk.',
          ruleInPoints: 'Nocturnal hunger pain relieved by biscuits/milk, epigastric focal tenderness.',
          ruleOutPoints: 'Postprandial sour regurgitation immediately after heavy spices without midnight ulcer awakening.',
          questionsToAsk: [
            'Does your burning abdominal pain wake you up from deep sleep at 2 AM and disappear after having a snack or milk?',
            'Has there been any episode of passing pitch-black sticky stools (melena)?',
          ],
        },
        {
          condition: 'Hridroga (Angina Pectoris / Coronary Ischemia)',
          category: 'Modern (Disease)',
          correlatedSymptoms: 'Retrosternal chest burning, heaviness, and belching.',
          whyNotThisCondition: 'Ruled out when burning is strictly positional (worse on lying down/bending forward after meals) and never triggered by brisk walking or climbing stairs.',
          pratyatmaLakshana: 'Crushing retrosternal tightness provoked by exertion/stairs, radiating to left shoulder or jaw, relieved by rest.',
          ruleInPoints: 'Age >45, cardiovascular risk factors, exertional onset, ECG ST-T wave changes.',
          ruleOutPoints: 'Burning worsened by lying flat post-meal and relieved by alkaline cold drinks.',
          questionsToAsk: [
            'Does this chest burning or heaviness come on when walking uphill or climbing stairs and stop within 5 minutes of rest?',
            'Does the tightness spread down your left arm, throat, or jaw with cold sweating?',
          ],
        },
      ],
      suggestedClinicalQuestions: [
        'Do sour or bitter acidic liquids rise up into your throat (Tiktamla udgara) when you bend over or lie down after dinner?',
        'Is there burning in the retrosternal chest and throat (Hrit-kanthadaha) accompanied by nausea or sour belching?',
        'Do you feel persistent heaviness or fullness in the upper abdomen even after eating a very small meal (Avipaka / Guruta)?',
        'Has there been any difficulty swallowing solid foods or painful swallowing (Dysphagia/Odynophagia)?',
      ],
    },
    doctorVerificationSummary:
      'Amlapitta with classical Hrit-Kanthadaha and Avipaka. Initiate Sutshekhar Ras + Kamadudha Ras and Avipattikar Churna with coconut water. Implement strict Pathya ahara. Confirm therapy and rule out H. pylori.',
  },
};

/**
 * Live AI Generation via @google/genai with fallback to classical Ayurvedic & Modern Medical knowledge engine
 */
export const queryMedicalAssistant = async (
  query: MedicalCaseQuery
): Promise<MedicalAnalysisResult> => {
  const queryText = (query.diseaseName || query.symptoms || '').toLowerCase();

  // Try live server-side Gemini API call first
  try {
    const prashnaBlock =
      query.prashnaAnswers && query.prashnaAnswers.length > 0
        ? `\nPatient's Answers to Differential Inquiry (Prashna Pariksha):\n${query.prashnaAnswers
            .map((pa, i) => `${i + 1}. Q: ${pa.question}\n   Patient Answer: ${pa.answer}`)
            .join('\n')}\nCRITICAL: Use these patient answers to refine or update the primary diagnosis, Dosha-Dushya stage (Sama/Nirama), and tailor the Ayurvedic & Modern treatments accordingly!`
        : '';

    const prompt = `You are a clinical AI consultant for Dr. Ravi Shankar (BAMS Doctor).
Evaluate the following clinical presentation:
Patient Details: Age: ${query.patientAge || 'Adult'}, Gender: ${query.patientGender || 'Unspecified'}, Prakriti: ${query.prakriti || 'Tridoshic evaluation'}
Symptoms & Chief Complaints: ${query.symptoms}
Disease / Vyadhi: ${query.diseaseName || 'Diagnostic differentiation'}
Duration & Notes: ${query.duration || 'Not specified'}, ${query.notes || 'None'}${prashnaBlock}

Provide an authoritative, medical-grade analysis following this exact JSON structure:
{
  "ayurvedicAnalysis": {
    "vyadhiVinischaya": "Name of disease with Samprapti Ghatakas",
    "doshaDushya": { "dosha": "...", "dushya": "...", "agni": "...", "srotas": "..." },
    "shlokaReference": {
      "shlokaSanskrit": "Authentic Sanskrit verse in Devanagari from Charaka, Sushruta, Vagbhata or Madhava Nidana",
      "shlokaTransliteration": "Roman script transliteration",
      "meaning": "English translation and clinical significance",
      "sourceBook": "e.g. Charaka Samhita / Sushruta Samhita / Ashtanga Hridaya",
      "chapterAndVerse": "Specific Chapter and Shloka number"
    },
    "chikitsaSutra": "Classical treatment formula shloka or phrase",
    "shamanaChikitsa": [
      { "category": "Kwatha/Vati/Guggulu/Churna/Asava", "medicineName": "...", "dosage": "...", "anupana": "...", "timing": "...", "indications": "..." }
    ],
    "shodhanaChikitsa": [
      { "procedure": "Panchakarma name", "indication": "...", "details": "..." }
    ],
    "paraSurgicalTherapy": {
      "therapyName": "Agnikarma / Viddhakarma / Jalaukavacharana / Marma",
      "procedureNotes": "Clinical application",
      "siteAndInstruments": "Exact Shalaka/Needle site"
    },
    "pathyaApathya": {
      "pathyaAhara": ["..."],
      "apathyaAhara": ["..."],
      "viharaRules": ["..."]
    }
  },
  "modernMedicineAnalysis": {
    "diagnosisDifferential": ["..."],
    "pathophysiologySummary": "...",
    "recommendedInvestigations": [
      {
        "testName": "Specific Lab or Imaging Test Name",
        "diagnosticPurpose": "Clear clinical explanation of WHY this specific investigation is done and WHAT pathological finding or biomarker it detects",
        "isMandatory": true
      }
    ],
    "pharmacotherapyStandard": [
      { "drugClass": "...", "genericName": "...", "standardRegimen": "...", "cautionOrMonitoring": "..." }
    ],
    "redFlagsAndEmergency": ["..."],
    "dietAndNutritionGuidelines": ["..."],
    "textbookReferences": ["Harrison's 21st Ed...", "Robbins 10th Ed..."]
  },
  "differentialDiagnosis": {
    "confirmationProtocol": {
      "targetDisease": "Confirmed Primary Disease Name",
      "ayurvedicConfirmation": {
        "pratyatmaLakshana": "Hallmark pathognomonic Ayurvedic sign confirming this disease",
        "confirmatorySigns": ["Symptom correlation 1", "Nadi/Jihwa/Samprapti correlation 2"],
        "therapeuticTrialConfirmation": "Upashaya-Anupashaya therapeutic test that confirms this disease"
      },
      "modernConfirmation": {
        "goldStandardCriteria": "Gold standard clinical diagnostic criteria",
        "confirmatoryBiomarkers": ["Specific confirmatory lab test or imaging finding"]
      },
      "eliminationOfOtherConditions": [
        {
          "competingDisease": "Rival Disease Name (Ayurvedic or Modern)",
          "correlatedSymptoms": "Overlapping symptoms that mimic the patient's presentation",
          "whyRuledOut": "Why this rival condition is ruled out in favor of the primary diagnosis",
          "distinguishingSignOrTest": "Definitive differentiating clinical sign or diagnostic test"
        }
      ]
    },
    "competingConditions": [
      {
        "condition": "Rival Disease (Ayurvedic & Modern)",
        "category": "Ayurvedic (Vyadhi) or Modern (Disease)",
        "correlatedSymptoms": "Symptoms overlapping with user input",
        "whyNotThisCondition": "Clinical reason why this condition is excluded",
        "pratyatmaLakshana": "Differentiating hallmark sign",
        "ruleInPoints": "Criteria that would rule it in",
        "ruleOutPoints": "Criteria that rule it out",
        "questionsToAsk": ["Targeted clinical question"]
      }
    ],
    "suggestedClinicalQuestions": ["..."]
  },
  "doctorVerificationSummary": "Concise summary for Dr. Ravi Shankar to review and confirm."
}
IMPORTANT:
1. Give FIRST PRIORITY to Ayurveda with authentic Sanskrit shlokas related strictly to that disease.
2. In recommendedInvestigations, set "isMandatory": true ONLY when an investigation is strictly necessary/mandatory to confirm diagnosis or rule out danger (do NOT mark all tests as mandatory). Always explain WHY each investigation is done in diagnosticPurpose.
Return ONLY raw valid JSON.`;

    const apiRes = await fetch('/api/gemini/medical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.text) {
        const parsed = JSON.parse(data.text);
        if (parsed.ayurvedicAnalysis && parsed.modernMedicineAnalysis) {
          const baseline = getInstantClinicalAnalysis(query);
          const dName = query.diseaseName || parsed.ayurvedicAnalysis.vyadhiVinischaya;
          const acharyaMap = getAcharyaProtocols(dName, parsed.ayurvedicAnalysis);
          parsed.ayurvedicAnalysis.acharyaProtocols = acharyaMap;
          const primaryProto = acharyaMap.charaka?.isDirectlyMentioned
            ? acharyaMap.charaka
            : acharyaMap.chakradatta || acharyaMap.charaka;
          if (primaryProto && primaryProto.shlokaReference?.shlokaSanskrit && primaryProto.shlokaReference.shlokaSanskrit !== 'NA') {
            parsed.ayurvedicAnalysis.shlokaReference = primaryProto.shlokaReference;
            parsed.ayurvedicAnalysis.chikitsaSutra = primaryProto.chikitsaSutra;
            if (primaryProto.shamanaChikitsa?.length > 0) {
              parsed.ayurvedicAnalysis.shamanaChikitsa = primaryProto.shamanaChikitsa;
            }
            if (primaryProto.shodhanaChikitsa?.length > 0) {
              parsed.ayurvedicAnalysis.shodhanaChikitsa = primaryProto.shodhanaChikitsa;
            }
          }
          const modernPharm = getModernPharmacologyForDisease(dName, query.symptoms || '');
          parsed.modernMedicineAnalysis.pharmacotherapyStandard = modernPharm.pharmacotherapyStandard;
          parsed.modernMedicineAnalysis.pathophysiologySummary = modernPharm.pathophysiologySummary;
          parsed.modernMedicineAnalysis.textbookReferences = modernPharm.textbookReferences;

          // Always use the curated disease-specific differential diagnosis & Prashna Pariksha questions
          // so Quick Fill options match 100% both BEFORE and AFTER clicking Submit Patient Answers!
          parsed.differentialDiagnosis = baseline.differentialDiagnosis;
          if (query.prashnaAnswers && query.prashnaAnswers.length > 0) {
            parsed.ayurvedicAnalysis.vyadhiVinischaya = baseline.ayurvedicAnalysis.vyadhiVinischaya;
            parsed.ayurvedicAnalysis.doshaDushya.agni = baseline.ayurvedicAnalysis.doshaDushya.agni;
            parsed.doctorVerificationSummary = baseline.doctorVerificationSummary;
          }
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Live Gemini API call note (using comprehensive clinical database fallback):', err);
  }

  return getInstantClinicalAnalysis(query);
};

export const getInstantClinicalAnalysis = (query: MedicalCaseQuery): MedicalAnalysisResult => {
  const queryText = (query.diseaseName || query.symptoms || '').toLowerCase();

  const attachProtocols = (res: MedicalAnalysisResult): MedicalAnalysisResult => {
    const clone: MedicalAnalysisResult = JSON.parse(JSON.stringify(res));

    // If the doctor entered patient answers in Prashna Pariksha, dynamically refine Diagnosis & Treatments!
    if (query.prashnaAnswers && query.prashnaAnswers.length > 0) {
      const combinedAnswers = query.prashnaAnswers
        .map((pa) => `${pa.question} -> ${pa.answer}`)
        .join(' | ');
      const ansLower = query.prashnaAnswers.map((pa) => pa.answer.toLowerCase()).join(' ');

      // Check if patient answers point toward a specific competing condition or stage
      let stageNote = 'Refined via Prashna Pariksha';
      if (ansLower.includes('crepitus') || ansLower.includes('stairs') || ansLower.includes('< 30') || ansLower.includes('15 min') || ansLower.includes('warm oil')) {
        stageNote = 'Nirama / Dhatukshayaja Vata Predominance Confirmed on Prashna Pariksha';
      } else if (ansLower.includes('morning stiffness') || ansLower.includes('> 1 hour') || ansLower.includes('> 60') || ansLower.includes('fever') || ansLower.includes('heaviness') || ansLower.includes('oil worsens') || ansLower.includes('yes')) {
        stageNote = 'Active Sama Stage & Pratyatma Lakshana Confirmed on Prashna Pariksha';
      } else if (ansLower.includes('burning') || ansLower.includes('sour') || ansLower.includes('acid') || ansLower.includes('night')) {
        stageNote = 'Pitta-Anubandha / Vidagdha Stage Confirmed on Prashna Pariksha';
      }

      clone.ayurvedicAnalysis.vyadhiVinischaya = `${clone.ayurvedicAnalysis.vyadhiVinischaya} [${stageNote}]`;
      clone.ayurvedicAnalysis.doshaDushya.agni = `${clone.ayurvedicAnalysis.doshaDushya.agni} • Prashna Pariksha Findings: ${combinedAnswers.slice(0, 140)}`;
      clone.doctorVerificationSummary = `UPDATED AFTER PRASHNA PARIKSHA (${query.prashnaAnswers.length} Patient Answers Integrated): ${stageNote}. ${clone.doctorVerificationSummary}`;

      if (clone.differentialDiagnosis?.confirmationProtocol) {
        clone.differentialDiagnosis.confirmationProtocol.ayurvedicConfirmation.confirmatorySigns = [
          `Prashna Pariksha Patient Responses Confirmed: ${combinedAnswers}`,
          ...clone.differentialDiagnosis.confirmationProtocol.ayurvedicConfirmation.confirmatorySigns,
        ];
      }
    }

    const dName = query.diseaseName || clone.ayurvedicAnalysis.vyadhiVinischaya;
    const acharyaMap = getAcharyaProtocols(dName, clone.ayurvedicAnalysis);
    clone.ayurvedicAnalysis.acharyaProtocols = acharyaMap;

    const primaryProto = acharyaMap.charaka?.isDirectlyMentioned
      ? acharyaMap.charaka
      : acharyaMap.chakradatta || acharyaMap.charaka;
    if (primaryProto && primaryProto.shlokaReference?.shlokaSanskrit && primaryProto.shlokaReference.shlokaSanskrit !== 'NA') {
      clone.ayurvedicAnalysis.shlokaReference = primaryProto.shlokaReference;
      clone.ayurvedicAnalysis.chikitsaSutra = primaryProto.chikitsaSutra;
      if (primaryProto.shamanaChikitsa?.length > 0) {
        clone.ayurvedicAnalysis.shamanaChikitsa = primaryProto.shamanaChikitsa;
      }
      if (primaryProto.shodhanaChikitsa?.length > 0) {
        clone.ayurvedicAnalysis.shodhanaChikitsa = primaryProto.shodhanaChikitsa;
      }
    }

    const modernPharm = getModernPharmacologyForDisease(dName, query.symptoms || '');
    clone.modernMedicineAnalysis.pharmacotherapyStandard = modernPharm.pharmacotherapyStandard;
    clone.modernMedicineAnalysis.pathophysiologySummary = modernPharm.pathophysiologySummary;
    clone.modernMedicineAnalysis.textbookReferences = modernPharm.textbookReferences;

    return clone;
  };

  // Fallback pattern matching on classical database
  if (queryText.includes('amavata') || queryText.includes('rheumatoid') || queryText.includes('joint swelling') || queryText.includes('morning stiffness')) {
    return attachProtocols(CLASSICAL_MEDICAL_DATABASE.amavata);
  }
  if (queryText.includes('sandhi') || queryText.includes('osteo') || queryText.includes('crepitus')) {
    return attachProtocols(CLASSICAL_MEDICAL_DATABASE.sandhivata);
  }
  if (queryText.includes('amla') || queryText.includes('acidity') || queryText.includes('gerd') || queryText.includes('heartburn') || queryText.includes('reflux')) {
    return attachProtocols(CLASSICAL_MEDICAL_DATABASE.amlapitta);
  }

  // Generate dynamic clinical response customized for the query
  return attachProtocols(generateCustomClinicalResponse(query));
};

function generateCustomClinicalResponse(query: MedicalCaseQuery): MedicalAnalysisResult {
  const match = CLINICAL_DISEASE_PRESETS.find(
    (p) =>
      (query.diseaseName &&
        (query.diseaseName.toLowerCase().includes(p.ayurvedicName.toLowerCase()) ||
          query.diseaseName.toLowerCase().includes(p.modernName.toLowerCase()) ||
          p.name.toLowerCase().includes(query.diseaseName.toLowerCase()) ||
          (p.id && query.diseaseName.toLowerCase().includes(p.id)))) ||
      (query.symptoms && p.symptoms && query.symptoms.toLowerCase().slice(0, 25) === p.symptoms.toLowerCase().slice(0, 25))
  );

  const disease = query.diseaseName || match?.name || 'Clinical Condition';
  const sym = query.symptoms || match?.symptoms || 'Presenting clinical symptoms';
  const dLower = disease.toLowerCase();

  // Build disease-specific investigations with clear "Why Done / What It Finds" and selective mandatory star marking
  const buildSpecificInvestigations = (): ClinicalInvestigationItem[] => {
    if (dLower.includes('prameha') || dLower.includes('madhumeha') || dLower.includes('diabet')) {
      return [
        {
          testName: 'HbA1c (Glycated Hemoglobin) & Fasting / Post-Prandial Blood Glucose (FBS/PPBS)',
          diagnosticPurpose: 'Confirms chronic hyperglycemia over the preceding 8–12 weeks (HbA1c ≥ 6.5%) and quantifies post-meal insulin resistance.',
          isMandatory: true,
        },
        {
          testName: 'Complete Urine Examination (Routine & Microalbuminuria / ACR)',
          diagnosticPurpose: 'Detects glycosuria, turbid urine (Prabhuta-Avila Mutrata), and early diabetic nephropathy.',
          isMandatory: true,
        },
        {
          testName: 'Fasting Lipid Profile & Serum Creatinine (eGFR)',
          diagnosticPurpose: 'Assesses associated Medodushti (dyslipidemia) and baseline renal filtration capacity.',
          isMandatory: false,
        },
      ];
    }
    if (dLower.includes('kushtha') || dLower.includes('psoriasis') || dLower.includes('eczema') || dLower.includes('vicharchika') || dLower.includes('dadru') || dLower.includes('skin')) {
      return [
        {
          testName: '10% KOH Skin Scraping Mount / Dermoscopy Examination',
          diagnosticPurpose: 'Differentiates fungal dermatophytosis (Dadru - branching hyphae) from non-infectious autoimmune psoriasis (Ekakushtha - Auspitz sign).',
          isMandatory: true,
        },
        {
          testName: 'Complete Blood Count (CBC) with Absolute Eosinophil Count (AEC) & Total Serum IgE',
          diagnosticPurpose: 'Identifies allergic/atopic Rakta-Pitta hypersensitivity and systemic eosinophilia in weeping dermatitis.',
          isMandatory: false,
        },
        {
          testName: 'Skin Punch Biopsy (Histopathology)',
          diagnosticPurpose: 'Reserved only for atypical, recalcitrant plaques to confirm epidermal hyperkeratosis or rule out cutaneous malignancy.',
          isMandatory: false,
        },
      ];
    }
    if (dLower.includes('shwasa') || dLower.includes('kasa') || dLower.includes('asthma') || dLower.includes('copd') || dLower.includes('bronch')) {
      return [
        {
          testName: 'Spirometry with Post-Bronchodilator Reversibility (PFT)',
          diagnosticPurpose: 'Measures FEV1/FVC ratio and confirms reversible airway obstruction (>12% & 200mL FEV1 increase in Tamaka Shwasa / Asthma vs fixed COPD).',
          isMandatory: true,
        },
        {
          testName: 'Chest X-Ray (PA View)',
          diagnosticPurpose: 'Rules out parenchymal consolidation (pneumonia), pleural effusion, pulmonary tuberculosis (Rajayakshma), or pneumothorax.',
          isMandatory: true,
        },
        {
          testName: 'CBC with Differential Eosinophil Count & Sputum AFB / GeneXpert',
          diagnosticPurpose: 'Evaluates allergic eosinophilic airway inflammation and rules out mycobacterial infection if cough >2 weeks.',
          isMandatory: false,
        },
      ];
    }
    if (dLower.includes('pandu') || dLower.includes('kamala') || dLower.includes('yakrit') || dLower.includes('anemia') || dLower.includes('jaundice') || dLower.includes('liver')) {
      return [
        {
          testName: 'Complete Blood Count (CBC), Reticulocyte Count & Peripheral Blood Smear',
          diagnosticPurpose: 'Quantifies hemoglobin deficit, RBC indices (MCV/MCH for microcytic vs macrocytic Pandu), and cellular morphology.',
          isMandatory: true,
        },
        {
          testName: 'Liver Function Test (Total/Direct Bilirubin, SGOT, SGPT, ALP, Albumin)',
          diagnosticPurpose: 'Differentiates pre-hepatic (hemolytic), hepatic (Koshthukashrita Kamala), and obstructive (Shakhashrita Kamala) jaundice.',
          isMandatory: true,
        },
        {
          testName: 'Serum Ferritin, Total Iron Binding Capacity (TIBC) & Vitamin B12',
          diagnosticPurpose: 'Pinpoints depleted iron stores or megaloblastic nutritional deficiency to guide Lauha Kalpana therapy.',
          isMandatory: false,
        },
        {
          testName: 'USG Abdomen & Pelvis (Hepatobiliary Screening)',
          diagnosticPurpose: 'Evaluates liver parenchymal echotexture, hepatosplenomegaly (Yakrit-Pleehodara), and biliary tract patency.',
          isMandatory: false,
        },
      ];
    }
    if (dLower.includes('ashmari') || dLower.includes('mutra') || dLower.includes('stone') || dLower.includes('calculi') || dLower.includes('uti') || dLower.includes('renal')) {
      return [
        {
          testName: 'Urine Routine & Microscopy (Pus Cells, RBCs, Crystals) + Urine Culture',
          diagnosticPurpose: 'Detects microscopic hematuria, crystalluria (oxalate/urate), and causative uropathogens in Mutrakrichra / Ashmari.',
          isMandatory: true,
        },
        {
          testName: 'USG KUB (Kidney, Ureter, Bladder) / Non-Contrast CT KUB',
          diagnosticPurpose: 'Directly localizes calculus size, site (renal pelvis/ureteric junction), and rules out obstructive hydronephrosis.',
          isMandatory: true,
        },
        {
          testName: 'Renal Function Panel (Serum Creatinine, BUN, Uric Acid, Electrolytes)',
          diagnosticPurpose: 'Assesses glomerular filtration integrity and metabolic hyperuricemia.',
          isMandatory: false,
        },
      ];
    }
    if (dLower.includes('gridhrasi') || dLower.includes('sciatica') || dLower.includes('kati') || dLower.includes('disc') || dLower.includes('spondyl')) {
      return [
        {
          testName: 'Lumbosacral / Cervical Spine X-Ray (AP & Lateral Views)',
          diagnosticPurpose: 'Evaluates vertebral alignment, loss of lordosis, intervertebral disc space narrowing, and spondylolisthesis.',
          isMandatory: false,
        },
        {
          testName: 'MRI Lumbosacral Spine (if radiculopathy or neurological deficit present)',
          diagnosticPurpose: 'Gold standard to visualize L4-L5 / L5-S1 disc herniation and nerve root compression in Gridhrasi. Mandatory only if red-flag motor weakness or bowel/bladder symptoms exist.',
          isMandatory: false,
        },
        {
          testName: 'ESR, CRP & HLA-B27 (if young patient with morning back stiffness)',
          diagnosticPurpose: 'Rules out inflammatory axial spondyloarthropathy (Ankylosing Spondylitis) vs mechanical disc prolapse.',
          isMandatory: false,
        },
      ];
    }

    // Default selective investigations with clear purpose
    return [
      {
        testName: 'Complete Blood Count (CBC) with Differential & ESR',
        diagnosticPurpose: 'Establishes baseline hematological status, detects occult infection, anemia (Pandu), or systemic inflammatory activity (Sama stage).',
        isMandatory: true,
      },
      {
        testName: 'C-Reactive Protein (hs-CRP) & Fasting Blood Glucose',
        diagnosticPurpose: 'Quantifies acute tissue inflammation and rules out underlying metabolic comorbidity affecting tissue healing.',
        isMandatory: false,
      },
      {
        testName: 'Baseline Hepatic & Renal Safety Profile (LFT & Serum Creatinine)',
        diagnosticPurpose: 'Ensures normal hepatorenal clearance prior to initiating classical Rasa-Aushadhi or long-term pharmacotherapy.',
        isMandatory: false,
      },
      {
        testName: 'Targeted Organ Ultrasonography / Radiographic Imaging',
        diagnosticPurpose: 'Ordered selectively to confirm structural Srotodushti (organ enlargement, effusion, or mechanical obstruction) when clinically indicated.',
        isMandatory: false,
      },
    ];
  };

  return {
    ayurvedicAnalysis: {
      vyadhiVinischaya: disease,
      doshaDushya: {
        dosha: 'Tridoshic assessment: Vata-Pitta / Vata-Kapha Prakopa based on clinical Rogi Pariksha',
        dushya: 'Rasa, Rakta, Mamsa, and localized Srotas',
        agni: 'Deepana-Pachana indicated to alleviate Amadosha and restore Jatharagni',
        srotas: 'Annavaha and Roga-specific Srotas Sanga',
      },
      shlokaReference: {
        shlokaSanskrit: 'दोषाणां समवेतानां विकल्प्यांशांशकल्पनाम् । व्याधेः स्वलक्षणं बुद्ध्वा ततो भैषज्यमाचरेत् ॥',
        shlokaTransliteration: 'Doṣāṇāṁ samavetānāṁ vikalpyāṁśāṁśa-kalpanām | Vyādheḥ svalakṣaṇaṁ buddhvā tato bhaiṣajyam ācaret ||',
        meaning: `By analyzing the specific fractional involvement (Amshamsha Kalpana) of Doshas and Dushyas and confirming the pathognomonic signs (Svalakshana) of ${disease}, the physician institutes targeted Chikitsa.`,
        sourceBook: 'Charaka Samhita / Ashtanga Hridaya',
        chapterAndVerse: 'Chikitsa Sthana (Vyadhi-Vishesha Adhyaya)',
      },
      chikitsaSutra: 'हेतुविपरीतं व्याधिविपरीतं च औषधमाहारं विहारं च प्रयोजयेत् ॥ (Hetu-Viparita, Vyadhi-Viparita Aushadha, Ahara & Vihara)',
      shamanaChikitsa: [
        {
          category: 'Kashaya / Decoction',
          medicineName: 'Amruthotharam Kashayam / Dashamoola Kwatha',
          dosage: '40ml BD before food',
          anupana: 'Warm water with Sunthi churna',
          timing: 'Morning and evening before meals',
          indications: 'Deepana, Pachana, and systemic Srotoshodhana',
        },
        {
          category: 'Churna / Rasayana',
          medicineName: 'Triphala Churna with Yashthimadhu',
          dosage: '3g - 5g at bedtime',
          anupana: 'Lukewarm water or honey',
          timing: 'Bedtime (Ratri)',
          indications: 'Anulomana, Rasayana, and cell cytoprotection',
        },
        {
          category: 'Rasa Aushadhi',
          medicineName: 'Arogyavardhini Vati / Sanjivani Vati',
          dosage: '1 tablet (250mg) BD',
          anupana: 'Warm water or Punarnavadi Kwatha',
          timing: 'After meals',
          indications: 'Yakrit-Pleeha stimulation, digestive fire enhancement, and Ama clearance',
        },
      ],
      shodhanaChikitsa: [
        {
          procedure: 'Mrudu Virechana / Nitya Anulomana',
          indication: 'Safe elimination of localized morbid Doshas.',
          details: 'Haritaki or Eranda Sneha at bedtime with warm water.',
        },
      ],
      paraSurgicalTherapy: {
        therapyName: 'Marma Chikitsa',
        procedureNotes: 'Gentle digital stimulation of corresponding Marma points with medicated herbal oils to release stagnant Prana and relieve localized spasms.',
        siteAndInstruments: 'Padadhara or Kurpara Marma gentle thumb pressure for 18 breaths.',
      },
      pathyaApathya: {
        pathyaAhara: [
          'Warm freshly prepared Laghu Ahara (light food)',
          'Shali (aged rice), Mudga (green gram)',
          'Warm boiled water (Ushnodaka)',
          'Sunthi, Maricha, Pippali in culinary doses',
        ],
        apathyaAhara: [
          'Stale, cold, refrigerated food (Paryushita)',
          'Heavy deep-fried snacks, excessive sweets, and curd at night',
          'Incompatible food combinations (Viruddha Ahara)',
        ],
        viharaRules: [
          'Regular sleep schedule (Nidra before 10:30 PM)',
          'Avoid suppression of natural urges (Vega-Dharana)',
          'Daily 15m Pranayama (Anuloma Viloma)',
        ],
      },
    },
    modernMedicineAnalysis: {
      diagnosisDifferential: match
        ? [
            `${match.modernName} (Primary Confirmed Diagnosis)`,
            ...match.differentials.map((d) => d.condition),
          ]
        : [
            `${disease} (Primary working clinical assessment)`,
            'Secondary inflammatory or metabolic mimic',
            'Functional or neuro-humoral disorder',
          ],
      pathophysiologySummary: getModernPharmacologyForDisease(disease, sym).pathophysiologySummary,
      recommendedInvestigations: buildSpecificInvestigations(),
      pharmacotherapyStandard: getModernPharmacologyForDisease(disease, sym).pharmacotherapyStandard,
      redFlagsAndEmergency: [
        'Sudden severe unremitting pain or high-grade fever with rigors',
        'Altered mental status, syncope, or hemodynamic instability',
        'Shortness of breath or persistent hemoptysis/hematemesis',
      ],
      dietAndNutritionGuidelines: [
        'Balanced macronutrient distribution with anti-inflammatory foods',
        'Adequate hydration (2.5 - 3 Liters daily)',
        'Micronutrient replenishment (Vitamins D3, B12, and Minerals)',
      ],
      textbookReferences: getModernPharmacologyForDisease(disease, sym).textbookReferences,
    },
    differentialDiagnosis: (() => {
      if (match) {
        return {
          confirmationProtocol: {
            targetDisease: `${match.ayurvedicName} (${match.modernName})`,
            ayurvedicConfirmation: {
              pratyatmaLakshana: `Hallmark Rupa correlation: ${sym}`,
              confirmatorySigns: [
                `Direct correlation with patient's presenting symptoms: ${sym}`,
                `Classical Nidana Panchaka alignment in ${match.category} srotas with ${query.prakriti || 'Dosha-Dushya'} involvement.`,
                `Confirmation through Dashavidha & Ashtavidha Pariksha (Nadi, Jihwa, Mala, Mutra, Sparsha).`,
              ],
              therapeuticTrialConfirmation:
                `Upashaya-Anupashaya (Therapeutic Test): Positive symptomatic relief with ${match.ayurvedicName}-specific Shamana/Shodhana confirms the diagnosis and excludes mimic disorders.`,
            },
            modernConfirmation: {
              goldStandardCriteria: `Standard clinical diagnostic criteria for ${match.modernName} correlated with physical examination and symptom duration (${query.duration || match.typicalDuration}).`,
              confirmatoryBiomarkers: buildSpecificInvestigations().map((i) => `${i.testName}: ${i.diagnosticPurpose}`),
            },
            eliminationOfOtherConditions: match.differentials.map((diff) => ({
              competingDisease: diff.condition,
              correlatedSymptoms: `Overlaps with ${match.ayurvedicName} presentation (${sym.slice(0, 75)}...)`,
              whyRuledOut: `Excluded because ${diff.condition} specifically requires: ${diff.differentiatingPoint}`,
              distinguishingSignOrTest: diff.differentiatingPoint,
            })),
          },
          competingConditions: match.differentials.map((diff, idx) => ({
            condition: diff.condition,
            category: idx % 2 === 0 ? 'Ayurvedic (Vyadhi)' : 'Modern (Disease)',
            correlatedSymptoms: `Mimics presenting complaints (${sym.slice(0, 80)}...)`,
            whyNotThisCondition: `Ruled out in favor of ${match.ayurvedicName} because the patient lacks the hallmark feature of ${diff.condition}: ${diff.differentiatingPoint}`,
            pratyatmaLakshana: diff.differentiatingPoint,
            ruleInPoints: `Presence of ${diff.differentiatingPoint}`,
            ruleOutPoints: `Confirmation of ${match.ayurvedicName} (${sym.slice(0, 60)}...) without features of ${diff.condition}`,
            questionsToAsk: match.differentialQuestions,
          })),
          suggestedClinicalQuestions: match.differentialQuestions,
        };
      }

      return {
        confirmationProtocol: {
          targetDisease: disease,
          ayurvedicConfirmation: {
            pratyatmaLakshana: `Pathognomonic clinical correlation with presenting symptoms: ${sym}`,
            confirmatorySigns: [
              `Direct symptom match: ${sym}`,
              `Dosha-Dushya Samprapti localization in the target Srotas with corresponding Agni (${query.agni || 'Mandagni/Vishamagni'}) and Kostha (${query.kostha || 'Kostha'}) pattern.`,
            ],
            therapeuticTrialConfirmation:
              `Upashaya-Anupashaya: Symptomatic improvement upon administering Hetu-Viparita and Vyadhi-Viparita Chikitsa confirms ${disease}.`,
          },
          modernConfirmation: {
            goldStandardCriteria: `Clinical history, physical examination, and targeted biomarker/imaging correlation for ${disease}.`,
            confirmatoryBiomarkers: buildSpecificInvestigations().map((i) => `${i.testName} (${i.diagnosticPurpose})`),
          },
          eliminationOfOtherConditions: [
            {
              competingDisease: 'Sama vs Nirama Avastha Mimic (Ayurvedic Differential)',
              correlatedSymptoms: sym,
              whyRuledOut: 'Differentiated by tongue coating (Sama Jihwa), pulse quality, anorexia, and response to Langhana-Pachana vs Snehana.',
              distinguishingSignOrTest: 'Jihwa Pariksha, Nadi Pariksha & Upashaya therapeutic test',
            },
            {
              competingDisease: 'Secondary Structural / Metabolic Mimic (Modern Differential)',
              correlatedSymptoms: sym,
              whyRuledOut: 'Ruled out via targeted baseline hematological, biochemical, and radiological evaluation.',
              distinguishingSignOrTest: 'CBC, ESR/CRP, Organ Function Panel & Ultrasound/X-Ray',
            },
          ],
        },
        competingConditions: [
          {
            condition: 'Secondary Dhatugata Vata / Pitta-Kapha Avarana',
            category: 'Ayurvedic (Vyadhi)',
            correlatedSymptoms: `Shares presenting complaints: ${sym}`,
            whyNotThisCondition: `Ruled out by evaluating whether pathology is Dhatukshayajanya (degenerative) vs Margavarodhajanya (obstructive) through Upashaya-Anupashaya.`,
            pratyatmaLakshana: 'Deep-seated tissue depletion (Kshaya) or Avarana signs rather than primary Srotas pathology.',
            ruleInPoints: 'Chronicity >6 months, progressive tissue wasting, or classical Avarana Lakshanas.',
            ruleOutPoints: `Direct Pratyatma Lakshana confirmation of ${disease}.`,
            questionsToAsk: [
              'Is there progressive loss of body weight, muscle strength, or skin luster over the past few months?',
              'Does the digestive fire feel erratic (Vishamagni) or sluggish (Mandagni)?',
            ],
          },
          {
            condition: 'Systemic Metabolic or Structural Mimic',
            category: 'Modern (Disease)',
            correlatedSymptoms: `Overlapping clinical symptoms: ${sym}`,
            whyNotThisCondition: `Ruled out when specific laboratory biomarkers and imaging confirm ${disease} and exclude secondary organ pathology.`,
            pratyatmaLakshana: 'Systemic endocrine, infectious, or structural imaging abnormalities outside the primary presentation.',
            ruleInPoints: 'Abnormal organ-specific imaging or acute systemic red flags.',
            ruleOutPoints: `Typical clinical trajectory and confirmatory tests for ${disease}.`,
            questionsToAsk: [
              'Did the onset of complaints coincide with high fever, trauma, or medication changes?',
              'Do symptoms ease significantly with rest or specific posture adjustments?',
            ],
          },
        ],
        suggestedClinicalQuestions: [
          'What was the exact temporal sequence and circumstances surrounding the very first onset of symptoms?',
          'Do the complaints worsen during specific hours of the day (e.g. Vata kala: 2-6 PM/AM, Pitta kala: 10-2 PM/AM, Kapha kala: 6-10 AM/PM)?',
          'Does heat or cold application alleviate the discomfort, or does it aggravate symptoms?',
          'What is the state of Jatharagni (appetite), Kostha (bowel regularity), and sleep quality?',
          'Are there any red-flag signs such as unintended weight loss, nocturnal sweats, or severe unremitting localized pain?',
        ],
      };
    })(),
    doctorVerificationSummary: `Clinical appraisal completed for ${disease}. Ayurvedic treatment protocol prioritizes Deepana-Pachana and Shamana with Amruthotharam Kashayam & Arogyavardhini Vati. Modern investigations suggested with clinical rationale. Confirm prescription upon physical patient examination.`,
  };
}

/**
 * LifeOS Comprehensive Tracker & Strategic Problem Solver
 * Tracks all user data (Expenses, Income, Loans/EMIs, Investments, Works/To-Do, Roadmap, Habits & Dinacharya — excluding Life Journals)
 */
export interface LifeOSCategorySuggestion {
  id: string;
  category: 'loans_emi' | 'expenses_income' | 'investments' | 'tasks_todo' | 'roadmap_goals' | 'habits_dinacharya';
  title: string;
  trackedMetricsSummary: string;
  statusBadge: 'Critical Action' | 'Needs Attention' | 'On Track & Optimizing';
  analysisSummary: string;
  actionableSuggestions: string[];
  emergencyBufferNote?: string;
}

export interface LifeOSInvestmentRecommendation {
  id: string;
  name: string;
  instrumentType: 'Stable Money FD' | 'FD / RD' | 'Mutual Fund SIP' | 'Bonds & Gold';
  expectedReturn: string;
  riskLevel: 'Zero Risk (DICGC Insured)' | 'Low Risk' | 'Moderate-High (Long Term)' | 'Low-Moderate Risk';
  recommendedAllocationPct: number;
  suggestedMonthlyAmount: string;
  platformOrExamples: string;
  whyBestForYou: string;
  lockInAndLiquidity: string;
}

export interface LifeOSLoanPayoffStep {
  loanId: string;
  priorityRank: number;
  title: string;
  lender: string;
  remainingBalance: number;
  monthlyEmi: number;
  interestRate: number;
  strategyBadge: string;
  whyPrioritize: string;
  actionPlan: string;
  cashFlowFreedMonthly: number;
}

export interface LifeOSExpenseAuditItem {
  categoryLabel: string;
  currentSpend: number;
  targetCap: string;
  whereToReduce: string;
  estimatedMonthlySaving: string;
}

export interface LifeOSProblemAnalysis {
  overallHealthScore: number; // 0-100
  trackedModulesCount: number;
  categoryWiseSuggestions: LifeOSCategorySuggestion[];
  investmentBlueprint: {
    summaryHeadline: string;
    strategyNote: string;
    recommendations: LifeOSInvestmentRecommendation[];
    monthlyAllocationSteps: string[];
  };
  loanClearancePlan: {
    totalActiveLoans: number;
    totalRemainingPrincipal: number;
    totalMonthlyEmi: number;
    strategyHeadline: string;
    rankedPayoffSteps: LifeOSLoanPayoffStep[];
    goldenRules: string[];
  };
  expenseReductionPlan: {
    totalIncome: number;
    totalExpense: number;
    totalOutflowWithEmi: number;
    netAfterEmi: number;
    auditItems: LifeOSExpenseAuditItem[];
    topSavingRules: string[];
  };
  criticalProblems: {
    id: string;
    area: 'loans' | 'budget' | 'habits' | 'roadmap' | 'portfolio' | 'tasks';
    title: string;
    severity: 'critical' | 'moderate' | 'optimization';
    currentProblem: string;
    suggestedSolution: string;
    actionableSteps: string[];
    potentialBenefit: string;
  }[];
  strategicOpportunities: {
    title: string;
    category: 'income_generation' | 'debt_elimination' | 'clinical_monetization' | 'habit_optimization';
    description: string;
    actionPlan: string;
  }[];
}

export const analyzeLifeOSData = (data: {
  loans: LoanItem[];
  investments: InvestmentItem[];
  expenses: ExpenseRecord[];
  habits: HabitItem[];
  dinacharyaLogs: DinacharyaLog[];
  milestones: RoadmapMilestone[];
  tasks: ChecklistTask[];
}): LifeOSProblemAnalysis => {
  const problems: LifeOSProblemAnalysis['criticalProblems'] = [];
  const opportunities: LifeOSProblemAnalysis['strategicOpportunities'] = [];
  const categoryWiseSuggestions: LifeOSCategorySuggestion[] = [];

  // 1. LOANS & EMIs METRICS
  const activeLoans = data.loans.filter((l) => l.status === 'active' || l.status === 'partially_paid');
  const totalPrincipal = activeLoans.reduce((sum, l) => sum + (l.principalAmount || 0), 0);
  const totalPaid = activeLoans.reduce((sum, l) => sum + (l.totalPaid || 0), 0);
  const totalRemaining = Math.max(0, totalPrincipal - totalPaid);
  const totalMonthlyEmi = activeLoans.reduce((sum, l) => sum + (l.monthlyEmi || 0), 0);

  // 2. INCOME & EXPENSES METRICS
  const totalExpense = data.expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalIncome = data.expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalOutflowWithEmi = totalExpense + totalMonthlyEmi;
  const netAfterEmi = totalIncome - totalOutflowWithEmi;

  // 3. INVESTMENTS METRICS
  const totalInvested = data.investments.reduce((sum, i) => sum + (i.investedAmount || 0), 0);
  const totalCurrentWealth = data.investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
  const portfolioGain = totalCurrentWealth - totalInvested;
  const totalMonthlySip = data.investments.reduce((sum, i) => sum + (i.sipMonthly || 0), 0);

  // 4. WORKS / TO-DO TASKS METRICS
  const pendingTasks = data.tasks.filter((t) => !t.isCompleted);
  const completedTasks = data.tasks.filter((t) => t.isCompleted);
  const highPriorityPending = pendingTasks.filter((t) => t.priority === 'high' || t.priority === 'urgent');

  // 5. ROADMAP / JOURNEY GOALS METRICS
  const getMilestoneProgress = (m: RoadmapMilestone): number => {
    if (m.status === 'completed') return 100;
    if (m.activities && m.activities.length > 0) {
      const doneCount = m.activities.filter((a) => a.done).length;
      return Math.round((doneCount / m.activities.length) * 100);
    }
    return m.status === 'current' ? 50 : 0;
  };
  const inProgressMilestones = data.milestones.filter((m) => m.status === 'current');
  const completedMilestones = data.milestones.filter((m) => m.status === 'completed');
  const upcomingMilestones = data.milestones.filter((m) => m.status === 'upcoming');
  const avgMilestoneProgress =
    data.milestones.length > 0
      ? Math.round(data.milestones.reduce((s, m) => s + getMilestoneProgress(m), 0) / data.milestones.length)
      : 0;

  // 6. HABITS & DINACHARYA METRICS (Excluding Life Journals)
  let missedBrahma = 0;
  let totalSleepScore = 0;
  let totalDinacharyaPillars = 0;
  const recentLogs = data.dinacharyaLogs.slice(0, 14);
  recentLogs.forEach((l) => {
    if (!l.brahmaMuhurtaWakeup) missedBrahma++;
    totalSleepScore += l.nidraSleepQuality || 4;
    const pillarsDone = [
      l.brahmaMuhurtaWakeup,
      l.ushapanWarmWater,
      l.dantadhavanaJivhaNirlekhana,
      l.nasyaKavalaGandusha,
      l.abhyangaOilMassage,
      l.vyayamaYogaPranayama,
      l.snanaBathing,
      l.sattvicAharaDiet,
    ].filter(Boolean).length;
    totalDinacharyaPillars += (pillarsDone / 8) * 100;
  });
  const avgSleep = recentLogs.length > 0 ? totalSleepScore / recentLogs.length : 4;
  const avgDinacharyaScore = recentLogs.length > 0 ? Math.round(totalDinacharyaPillars / recentLogs.length) : 80;
  const avgHabitStreak =
    data.habits.length > 0
      ? Math.round(data.habits.reduce((s, h) => s + (h.streak || 0), 0) / data.habits.length)
      : 0;

  // ============================================================================
  // DYNAMIC LOAN CLEARANCE MASTERPLAN (CASH-FLOW VELOCITY + AVALANCHE HYBRID)
  // ============================================================================
  // Score loans by:
  // 1) High EMI-to-Remaining-Principal ratio (clearing a ₹22,746 loan with ₹3,791/mo EMI frees 16.6% of its principal every single month!)
  // 2) Tiny remaining balance (< ₹10,000) for quick closure
  // 3) High interest rate (e.g. 12% p.a. IDBI Education Loan)
  const scoredLoans = [...activeLoans].map((loan) => {
    const rem = Math.max(0, (loan.principalAmount || 0) - (loan.totalPaid || 0));
    const emi = loan.monthlyEmi || 0;
    const rate = loan.interestRate || 0;
    const emiVelocityRatio = rem > 0 ? emi / rem : 0; // e.g., 3791 / 22746 = 0.1667 (only ~6 months of EMI!)
    const isAppOrNbfc =
      loan.title.toLowerCase().includes('kredit') ||
      loan.lender.toLowerCase().includes('kredit') ||
      loan.lender.toLowerCase().includes('nbfc') ||
      emiVelocityRatio > 0.1;
    const isSmallBalance = rem > 0 && rem <= 10000;
    const isRelative =
      loan.lender.toLowerCase().includes('relative') ||
      loan.title.toLowerCase().includes('da') ||
      loan.title.toLowerCase().includes('brother') ||
      loan.title.toLowerCase().includes('friend');

    // Priority score: Higher = clear earlier
    let priorityScore = 0;
    if (isAppOrNbfc) priorityScore += 100; // #1 Cash-Flow Liberator (e.g. KreditBee ₹22,746 with ₹3,791/mo EMI)
    if (isSmallBalance) priorityScore += 80; // #2 Quick Win (e.g. Munchun Da ₹7,500)
    priorityScore += rate * 3; // #3 High Interest (12% IDBI Ed Loan beats 8.5% Relative loan)
    priorityScore += emiVelocityRatio * 200;
    if (isRelative && !isSmallBalance) priorityScore -= 15; // Flexible relative loan last

    return {
      loan,
      rem,
      emi,
      rate,
      emiVelocityRatio,
      isAppOrNbfc,
      isSmallBalance,
      isRelative,
      priorityScore,
    };
  });

  scoredLoans.sort((a, b) => b.priorityScore - a.priorityScore);

  const rankedPayoffSteps: LifeOSLoanPayoffStep[] = scoredLoans.map((item, idx) => {
    const { loan, rem, emi, rate, isAppOrNbfc, isSmallBalance, isRelative } = item;
    const rank = idx + 1;

    if (isAppOrNbfc) {
      return {
        loanId: loan.id,
        priorityRank: rank,
        title: loan.title,
        lender: loan.lender,
        remainingBalance: rem,
        monthlyEmi: emi,
        interestRate: rate,
        strategyBadge: `Priority #${rank} • Cash-Flow Liberator`,
        whyPrioritize: `Your ${loan.title} has a remaining principal of only ₹${rem.toLocaleString('en-IN')}, yet it drains ₹${emi.toLocaleString('en-IN')}/month (~${Math.round((emi / Math.max(1, totalMonthlyEmi)) * 100)}% of your entire monthly EMI burden!). Because it is an NBFC/App loan, closing it first boosts your CIBIL score and immediately frees up +₹${emi.toLocaleString('en-IN')}/month.`,
        actionPlan: `Target clearing ${loan.title} first! Any extra ₹2,000–₹3,000 from stipend/consultations or expense savings should go straight into prepaying this ₹${rem.toLocaleString('en-IN')} balance (~6 EMI equivalents). Once closed, redirect its entire ₹${emi.toLocaleString('en-IN')}/mo EMI into Priority #${rank + 1} and your Stable Money FD.`,
        cashFlowFreedMonthly: emi,
      };
    }

    if (isSmallBalance) {
      return {
        loanId: loan.id,
        priorityRank: rank,
        title: loan.title,
        lender: loan.lender,
        remainingBalance: rem,
        monthlyEmi: emi,
        interestRate: rate,
        strategyBadge: `Priority #${rank} • Quick Snowball Win`,
        whyPrioritize: `${loan.title} has the smallest remaining balance (₹${rem.toLocaleString('en-IN')}) with a ₹${emi.toLocaleString('en-IN')}/mo outflow. Eliminating this small balance quickly reduces your number of open creditors and mental clutter.`,
        actionPlan: `As soon as Priority #1 is cleared (or in 2–3 small lump sums of ₹2,500), pay off ${loan.title} completely (₹${rem.toLocaleString('en-IN')}) and mark it Full Paid.`,
        cashFlowFreedMonthly: emi,
      };
    }

    if (rate >= 10 || !isRelative) {
      return {
        loanId: loan.id,
        priorityRank: rank,
        title: loan.title,
        lender: loan.lender,
        remainingBalance: rem,
        monthlyEmi: emi,
        interestRate: rate,
        strategyBadge: `Priority #${rank} • High-Interest Avalanche (${rate}% p.a.)`,
        whyPrioritize: `${loan.title} (${loan.lender}) carries your highest annual interest rate at ${rate}% p.a. on ₹${rem.toLocaleString('en-IN')} with a ₹${emi.toLocaleString('en-IN')}/mo EMI. Unchecked 12% interest compounds heavily over 36 months.`,
        actionPlan: `1) Never miss the ₹${emi.toLocaleString('en-IN')}/mo auto-debit. 2) Once KreditBee (₹3,791/mo) & Munchun Da (₹237/mo) are closed, roll ₹3,000/mo of that freed EMI as extra principal prepayment into ${loan.title} to cut tenure by ~8–10 months and save ₹38,000+ in interest. 3) Claim Section 80E education loan interest deduction when filing taxes.`,
        cashFlowFreedMonthly: emi,
      };
    }

    return {
      loanId: loan.id,
      priorityRank: rank,
      title: loan.title,
      lender: loan.lender,
      remainingBalance: rem,
      monthlyEmi: emi,
      interestRate: rate,
      strategyBadge: `Priority #${rank} • Flexible Family/Relative Debt (${rate}%)`,
      whyPrioritize: `${loan.title} (${loan.lender}) has a ₹${rem.toLocaleString('en-IN')} balance at ${rate}% with a manageable ₹${emi.toLocaleString('en-IN')}/mo installment. Because it is a relative loan without rigid bank bounce penalties, keep paying its regular ₹${emi.toLocaleString('en-IN')}/mo while aggressively closing institutional loans first.`,
      actionPlan: `Maintain consistent ₹${emi.toLocaleString('en-IN')}/mo payments to preserve family trust, and clear the remaining principal via quarterly lump sums once KreditBee and high-interest bank chunks are settled.`,
      cashFlowFreedMonthly: emi,
    };
  });

  // ============================================================================
  // DYNAMIC BEST INVESTMENT PLAN FOR DR. RAVI SHANKAR
  // (Includes Stable Money FD 8.50%, FD/RD, Mutual Fund SIP, Bonds & Gold)
  // ============================================================================
  const investmentRecommendations: LifeOSInvestmentRecommendation[] = [
    {
      id: 'inv-rec-stable-fd',
      name: '1. Stable Money High-Yield FD (8.50% – 9.10% p.a.)',
      instrumentType: 'Stable Money FD',
      expectedReturn: '8.50% – 9.10% p.a. (Guaranteed)',
      riskLevel: 'Zero Risk (DICGC Insured)',
      recommendedAllocationPct: 35,
      suggestedMonthlyAmount: '₹1,500 – ₹3,000 / mo (or Lump Sum ₹5k–₹25k)',
      platformOrExamples: 'Stable Money App (Unity SF Bank 9.0%, Suryoday SF Bank 8.65%, Utkarsh SF Bank 8.50%)',
      whyBestForYou:
        'Beats regular bank savings accounts (2.7%–3.5%) by nearly 3x while staying 100% RBI DICGC-insured up to ₹5 Lakh per bank. Because your IDBI Education Loan is 12% and relative/KreditBee loans are 8.5%, locking your Emergency & EMI Buffer at 8.50%+ in Stable Money FD neutralizes your 8.5% loan interest cost and ensures you never miss an EMI!',
      lockInAndLiquidity: 'No stock market risk • Premature withdrawal available anytime for medical/EMI emergencies.',
    },
    {
      id: 'inv-rec-rd-fd',
      name: '2. Bank Recurring Deposit (RD) / Auto-Sweep FD (7.25% – 8.00% p.a.)',
      instrumentType: 'FD / RD',
      expectedReturn: '7.25% – 8.00% p.a.',
      riskLevel: 'Zero Risk (DICGC Insured)',
      recommendedAllocationPct: 20,
      suggestedMonthlyAmount: '₹1,000 – ₹2,000 / mo Automated RD',
      platformOrExamples: 'IDBI / SBI / Post Office RD or Small Finance Bank 12-Month RD',
      whyBestForYou:
        'Perfect for predictable short-term BAMS milestones over the next 6–18 months (Final Proff exam fees, AIAPGET registration, stethoscope/diagnostic kit, or clearing Munchun Da ₹7,500 loan in one shot at maturity).',
      lockInAndLiquidity: '6 to 12 months tenure • Disciplined monthly auto-debit builds lump-sum cash effortlessly.',
    },
    {
      id: 'inv-rec-mf-sip',
      name: '3. Equity Mutual Fund SIPs (Nifty 50 Index + Flexi-Cap)',
      instrumentType: 'Mutual Fund SIP',
      expectedReturn: '12.50% – 15.00% CAGR (3–5+ Yrs)',
      riskLevel: 'Moderate-High (Long Term)',
      recommendedAllocationPct: 30,
      suggestedMonthlyAmount: '₹1,500 – ₹3,500 / mo (Step-up ₹500 every 6 mos)',
      platformOrExamples: 'UTI Nifty 50 Index Fund Direct Growth (60%) + Parag Parikh Flexi Cap / Nippon Small-Mid Cap (40%)',
      whyBestForYou:
        'The only asset class that comfortably beats your 12% education loan interest rate over a 3–5 year horizon. Dedicated to building your ₹3.5L+ "Ayurveez Healthcare Clinic & Panchakarma Setup Capital" by 2028.',
      lockInAndLiquidity: 'Open-ended (3+ year horizon recommended) • Start with ₹500–₹1,000/mo now and step up to ₹5,000/mo once KreditBee (₹3,791/mo) is closed.',
    },
    {
      id: 'inv-rec-bonds-gold',
      name: '4. Senior Secured Corporate Bonds & Sovereign Gold / T-Bills',
      instrumentType: 'Bonds & Gold',
      expectedReturn: '9.50% – 11.00% p.a. (Bonds) / 10%+ (Gold)',
      riskLevel: 'Low-Moderate Risk',
      recommendedAllocationPct: 15,
      suggestedMonthlyAmount: '₹500 – ₹1,500 / mo (Gold ETF / Bond units)',
      platformOrExamples: 'Stable Bonds / Wint Wealth / GoldenPi (AAA to A+ Rated Bonds) + Nippon Gold BeES / Sovereign Gold',
      whyBestForYou:
        'Provides fixed monthly/quarterly interest payouts (9.5%–11% p.a.) higher than bank FDs plus a 10% Gold hedge that protects purchasing power during economic inflation.',
      lockInAndLiquidity: '9–24 months maturity for secured bonds; Gold ETF is instant-liquid on NSE/BSE.',
    },
  ];

  // ============================================================================
  // DYNAMIC EXPENSE REDUCTION & CASH-FLOW AUDIT
  // ============================================================================
  const expenseByCategory: Record<string, number> = {};
  data.expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + (e.amount || 0);
    });

  const rentOrLivingSpend = expenseByCategory['living_personal'] || 0;
  const foodSpend = expenseByCategory['food_dining'] || 0;
  const travelSpend = expenseByCategory['travel_commute'] || 0;
  const studySpend = expenseByCategory['study_books'] || 0;
  const otherSpend =
    totalExpense - (rentOrLivingSpend + foodSpend + travelSpend + studySpend);

  const expenseAuditItems: LifeOSExpenseAuditItem[] = [
    {
      categoryLabel: 'Living, Rent & Personal Utilities',
      currentSpend: rentOrLivingSpend,
      targetCap: 'Keep Fixed ≤ ₹3,000 – ₹3,500/mo',
      whereToReduce:
        rentOrLivingSpend > 0
          ? `Your recorded Living/Rent expense is ₹${rentOrLivingSpend.toLocaleString('en-IN')}. Rent (₹3,000) is an essential fixed cost—keep it locked, but audit mobile data plans, OTT subscriptions, and impulse personal care orders.`
          : 'Keep fixed room rent and personal utility bills bundled; avoid auto-renewing OTT or app subscriptions.',
      estimatedMonthlySaving: 'Save ₹300 – ₹500/mo on utilities/subscriptions',
    },
    {
      categoryLabel: 'Food, Dining, Tea & Online Delivery (Swiggy/Zomato)',
      currentSpend: foodSpend,
      targetCap: 'Cap Outside Snacks/Delivery ≤ ₹800/mo',
      whereToReduce:
        'Micro-UPI transactions (₹40–₹150 on daily tea/snacks, late-night study ordering, or packaged drinks) silently drain ₹1,800–₹2,500/month AND aggravate Ama/Amlapitta. Switch to Sattvic home/mess meals, roasted Chana/Makhana, and fruit.',
      estimatedMonthlySaving: 'Save ₹1,000 – ₹1,800/mo + Better Agni',
    },
    {
      categoryLabel: 'Travel, Commute & Hospital Posting Trips',
      currentSpend: travelSpend,
      targetCap: 'Cap ≤ ₹600 – ₹1,000/mo',
      whereToReduce:
        'Batch market/pharmacy errands into 1–2 trips per week, share auto/cab rides with BAMS batchmates for clinical postings, and use monthly student/bus passes where possible.',
      estimatedMonthlySaving: 'Save ₹400 – ₹700/mo',
    },
    {
      categoryLabel: 'BAMS Books, Photocopies & Study Materials',
      currentSpend: studySpend + Math.max(0, otherSpend),
      targetCap: 'Cap ≤ ₹500/mo',
      whereToReduce:
        'Use college library copies and digital PDF Samhitas for secondary reference books; buy only core Charaka/Sushruta/Kayachikitsa texts secondhand from seniors or share printout costs in a 3-student study group.',
      estimatedMonthlySaving: 'Save ₹400 – ₹800/mo',
    },
  ];

  // ============================================================================
  // BUILD CATEGORY 1: LOANS & EMIs MANAGEMENT
  // ============================================================================
  if (activeLoans.length > 0 || totalMonthlyEmi > 0 || totalRemaining > 0) {
    const topPriorityLoan = rankedPayoffSteps[0];
    categoryWiseSuggestions.push({
      id: 'cat-loans',
      category: 'loans_emi',
      title: '1. Loans & Step-by-Step Clearance Plan',
      trackedMetricsSummary: `${activeLoans.length} Active Loan(s) • Total Remaining: ₹${totalRemaining.toLocaleString('en-IN')} • Monthly EMI: ₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo`,
      statusBadge: totalMonthlyEmi > 10000 ? 'Critical Action' : 'Needs Attention',
      analysisSummary: `You have ₹${totalRemaining.toLocaleString('en-IN')} across ${activeLoans.length} loans (${activeLoans.map((l) => `${l.title}: ₹${((l.principalAmount || 0) - (l.totalPaid || 0)).toLocaleString('en-IN')}`).join(', ')}) requiring ₹${totalMonthlyEmi.toLocaleString('en-IN')}/month in total EMIs.`,
      actionableSuggestions: [
        topPriorityLoan
          ? `Target #1 — Clear ${topPriorityLoan.title} First (₹${topPriorityLoan.remainingBalance.toLocaleString('en-IN')}): It drains ₹${topPriorityLoan.monthlyEmi.toLocaleString('en-IN')}/mo. Closing this single loan frees up ₹${topPriorityLoan.monthlyEmi.toLocaleString('en-IN')}/month immediately!`
          : `Prioritize clearing highest EMI-to-principal loans first.`,
        `Target #2 — Clear Smallest Relative Loan Next (Munchun Da ₹7,500): Use 2 months of freed KreditBee EMI to wipe out ₹7,500 and drop from 4 loans down to 2.`,
        `Target #3 — Attack 12% BAMS Education Loan (IDBI ₹4,00,000): Roll freed EMIs (+₹4,028/mo) into IDBI principal prepayment and claim education loan interest subsidy / Section 80E tax benefit.`,
        `Zero-Default Liquidity Protection: Lock EMI cash 3 days before the 10th due date. If short by ₹1k–₹2k, use a 30-day friend bridge; reserve brother support (up to ₹5k) only for rare exam/clinical months.`,
      ],
    });

    problems.push({
      id: 'prob-loan-1',
      area: 'loans',
      title: `High Monthly EMI Outflow: ₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo across ${activeLoans.length} Loans`,
      severity: totalMonthlyEmi > 15000 ? 'critical' : 'moderate',
      currentProblem: `Total debt of ₹${totalRemaining.toLocaleString('en-IN')} requires ₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo (IDBI Ed Loan ₹13,286 + KreditBee ₹3,791 + Parvesh Da ₹1,578 + Munchun Da ₹237).`,
      suggestedSolution: `Execute the 4-Step Hybrid Velocity Payoff: 1) Close KreditBee (₹22,746) first to unlock +₹3,791/mo cash flow → 2) Close Munchun Da (₹7,500) → 3) Prepay IDBI 12% Loan → 4) Settle Parvesh Da (₹50,000).`,
      actionableSteps: [
        `Step 1: Direct all extra savings toward KreditBee (₹22,746 principal vs ₹3,791/mo EMI) — closing it cuts your monthly EMI burden by 20% immediately.`,
        `Step 2: Clear Munchun Da (₹7,500) in two ₹3,750 transfers using the freed KreditBee EMI.`,
        `Step 3: Channel +₹3,000/mo of freed cash flow into IDBI BAMS Ed. Loan (12% p.a.) principal and +₹1,000/mo into Stable Money FD (8.50%).`,
      ],
      potentialBenefit: `Frees up ₹4,028/month cash flow quickly + saves ₹42,000+ in 12% compound interest.`,
    });
  } else {
    categoryWiseSuggestions.push({
      id: 'cat-loans',
      category: 'loans_emi',
      title: '1. Loans & Step-by-Step Clearance Plan',
      trackedMetricsSummary: `0 Active Loans • ₹0/mo EMI Burden`,
      statusBadge: 'On Track & Optimizing',
      analysisSummary: `No active loans or monthly EMIs are currently recorded in your Loan Tracker (or all previous loans are cleared).`,
      actionableSuggestions: [
        `Redirect 100% of former EMI capacity into Stable Money FD (8.50%) and Nifty 50 / Flexi-Cap Mutual Fund SIPs.`,
        `Stay zero-debt on high-interest consumer/app loans: keep a ₹10,000 Stable Money FD emergency pot so you never need NBFC credit.`,
      ],
    });
  }

  // ============================================================================
  // BUILD CATEGORY 2: EXPENSES, INCOME & EXPENSE REDUCTION PLAN
  // ============================================================================
  const deficitAmount = totalOutflowWithEmi > totalIncome ? totalOutflowWithEmi - totalIncome : 0;
  categoryWiseSuggestions.push({
    id: 'cat-expenses',
    category: 'expenses_income',
    title: '2. Income, Expenses & Where to Cut Spending',
    trackedMetricsSummary: `Income: ₹${totalIncome.toLocaleString('en-IN')} • Expenses: ₹${totalExpense.toLocaleString('en-IN')} (Rent/Living: ₹${rentOrLivingSpend.toLocaleString('en-IN')}) • Net (after EMI): ${netAfterEmi >= 0 ? '+' : '-'}₹${Math.abs(netAfterEmi).toLocaleString('en-IN')}`,
    statusBadge: deficitAmount > 0 ? 'Critical Action' : totalIncome === 0 && totalExpense === 0 ? 'Needs Attention' : 'On Track & Optimizing',
    analysisSummary:
      deficitAmount > 0
        ? `Your recorded monthly income is ₹${totalIncome.toLocaleString('en-IN')} (e.g. Bhaiya ₹5,000) and living expense is ₹${totalExpense.toLocaleString('en-IN')} (Rent ₹3,000), leaving +₹${(totalIncome - totalExpense).toLocaleString('en-IN')} before EMIs — which is ₹${deficitAmount.toLocaleString('en-IN')} short when full ₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo EMIs are included.`
        : `Your recorded income (₹${totalIncome.toLocaleString('en-IN')}) covers your current expenses (₹${totalExpense.toLocaleString('en-IN')}) with a net balance of ₹${netAfterEmi.toLocaleString('en-IN')}.`,
    emergencyBufferNote:
      'Expense Control + Buffer Rule: Keep Fixed Rent at ₹3,000 | Cut daily UPI micro-spends by ₹1,500/mo | Tier-1 Friend Bridge (₹1k–₹2k) | Tier-2 Brother Support (up to ₹5k occasional).',
    actionableSuggestions: [
      `Separate Fixed Rent (₹3,000) from Variable Spends: Your ₹3,000 Rent is essential—protect it on Day 1 of the month. Focus all cost-cutting on daily UPI micro-spends (tea, snacks, food delivery, impulse online orders).`,
      `Daily ₹50 Variable UPI Cap: Set a strict daily ceiling of ₹50–₹70 for outside snacks/tea/commute extras. Switching from Swiggy/Zomato & packaged snacks to Sattvic mess/home food saves ₹1,200–₹1,800/month.`,
      `Zero-Cost BAMS Study Resources: Use library/PDF Samhitas and group printouts with batchmates to save ₹500–₹800/month on books and stationery.`,
      `48-Hour Pause Rule: Before any non-essential online purchase >₹300, wait 48 hours—if it isn't required for BAMS exams or clinical practice, move that ₹300 into your Stable Money FD (8.50%) or KreditBee prepayment.`,
    ],
  });

  if (deficitAmount > 0) {
    problems.push({
      id: 'prob-cash-1',
      area: 'budget',
      title: `Cash-Flow Gap Including Full EMIs: -₹${deficitAmount.toLocaleString('en-IN')}`,
      severity: deficitAmount > 5000 ? 'critical' : 'moderate',
      currentProblem: `While Income (₹${totalIncome.toLocaleString('en-IN')}) > Living Expenses (₹${totalExpense.toLocaleString('en-IN')}) by +₹${(totalIncome - totalExpense).toLocaleString('en-IN')}, total outflow with all 4 EMIs (₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo) creates a ₹${deficitAmount.toLocaleString('en-IN')} gap.`,
      suggestedSolution: `1) Check if IDBI BAMS Education Loan (₹13,286/mo) is eligible for student moratorium during Final Proff/Internship. 2) Use your +₹${Math.max(0, totalIncome - totalExpense).toLocaleString('en-IN')} operating surplus + expense cuts to clear KreditBee (₹3,791/mo) first.`,
      actionableSteps: [
        `Verify with IDBI Bank if your BAMS Education Loan (₹4L) repayment can be deferred under study/internship moratorium so ₹13,286/mo pressure is paused until internship stipend starts.`,
        `Keep living expenses strictly around ₹3,000–₹4,000/mo (Rent ₹3,000 + lean essentials) so your ₹2,000+ surplus directly covers KreditBee/relative installments.`,
        `For minor ₹1,000–₹2,000 timing gaps, use a 30-day friend bridge; reserve brother support (up to ₹5,000) for non-regular exam/clinical months.`,
      ],
      potentialBenefit: `Eliminates monthly EMI crunch and saves ₹1,500–₹2,500/mo in avoidable expenses.`,
    });
  }

  // ============================================================================
  // BUILD CATEGORY 3: INVESTMENTS & BEST INVESTMENT PLAN (8.50% STABLE MONEY FD, RD, SIP, BONDS)
  // ============================================================================
  categoryWiseSuggestions.push({
    id: 'cat-investments',
    category: 'investments',
    title: '3. Best Investment Plan (Stable Money FD 8.50%, RD, SIP & Bonds)',
    trackedMetricsSummary: `${data.investments.length} Active Asset(s) • Invested: ₹${totalInvested.toLocaleString('en-IN')} • Value: ₹${totalCurrentWealth.toLocaleString('en-IN')} • Monthly SIP: ₹${totalMonthlySip.toLocaleString('en-IN')}/mo`,
    statusBadge: totalCurrentWealth > 0 ? 'On Track & Optimizing' : 'Needs Attention',
    analysisSummary:
      data.investments.length > 0
        ? `Your portfolio holds ₹${totalCurrentWealth.toLocaleString('en-IN')} across ${data.investments.length} asset(s) (Gain: ${portfolioGain >= 0 ? '+' : ''}₹${portfolioGain.toLocaleString('en-IN')}). Follow the 4-Pillar Asset Allocation below to maximize safe 8.50%+ FD yields and 13–15% equity compounding.`
        : `You currently have ₹0 recorded in Investments. Starting even with ₹500–₹1,500/month across Stable Money FD (8.50% p.a.), a Recurring Deposit (RD), and a Nifty 50 SIP will build your Emergency Shield & 2028 Clinic Capital!`,
    actionableSuggestions: [
      `Pillar 1 — Stable Money FD (8.50% – 9.10% p.a. | 35% Allocation): Park your first ₹5,000–₹15,000 Emergency & EMI Buffer in a DICGC-insured Small Finance Bank FD via Stable Money (8.50%+ return, zero market risk, instant emergency withdrawal).`,
      `Pillar 2 — Monthly RD / Bank FD (7.25% – 8.00% p.a. | 20% Allocation): Start a ₹500–₹1,000/mo Recurring Deposit for upcoming BAMS Final Proff exam fees, clinical instruments, or one-shot small loan payoff.`,
      `Pillar 3 — Mutual Fund SIP (12.5% – 15% CAGR | 30% Allocation): Run a ₹1,000–₹2,500/mo Direct Growth SIP split between a Nifty 50 Index Fund (60%) and a Flexi-Cap Fund (40%) for your 2028 Ayurveez Clinic setup.`,
      `Pillar 4 — Secured Corporate Bonds & Gold (9.5% – 11% p.a. | 15% Allocation): Allocate ₹500–₹1,000/mo into AAA/A+ Senior Secured Bonds (Wint Wealth / Stable Bonds) and Gold ETF / SGB as an inflation hedge.`,
    ],
  });

  // ============================================================================
  // BUILD CATEGORY 4: WORKS / TO-DO & CLINICAL TASKS
  // ============================================================================
  categoryWiseSuggestions.push({
    id: 'cat-tasks',
    category: 'tasks_todo',
    title: '4. Works / To-Do & Clinical Execution',
    trackedMetricsSummary: `${pendingTasks.length} Pending Task(s) (${highPriorityPending.length} High Priority) • ${completedTasks.length} Completed`,
    statusBadge: highPriorityPending.length > 2 ? 'Critical Action' : pendingTasks.length > 0 ? 'Needs Attention' : 'On Track & Optimizing',
    analysisSummary:
      pendingTasks.length > 0
        ? `You have ${pendingTasks.length} pending task(s) in Keep To-Do, including ${highPriorityPending.length} high-priority item(s): ${pendingTasks.slice(0, 3).map((t) => `"${t.text}"`).join(', ')}.`
        : `All tracked To-Do tasks are completed! Ready to queue your next clinical and financial action items.`,
    actionableSuggestions: [
      highPriorityPending.length > 0
        ? `Execute Top High-Priority Task Today: Tackle "${highPriorityPending[0].text}" during your peak morning focus block (8:00 AM – 10:00 AM).`
        : `Batch Your Daily Clinical & Study Works: Add your top 3 daily targets in Keep To-Do each night before sleeping.`,
      `Separate Financial Tasks from Study Tasks: Keep EMI payment reminders and friend-repayment reminders tagged under 'financial' priority so they are never overlooked.`,
      `Use the 2-Minute Clinical Rule: Any hospital logbook entry, prescription follow-up, or quick revision task taking <2 minutes should be completed immediately.`,
    ],
  });

  if (highPriorityPending.length > 2) {
    problems.push({
      id: 'prob-tasks-1',
      area: 'tasks',
      title: `${highPriorityPending.length} High-Priority Works / To-Do Tasks Pending`,
      severity: 'moderate',
      currentProblem: `Backlog of ${highPriorityPending.length} urgent tasks (${highPriorityPending.map((t) => t.text).slice(0, 2).join('; ')}) can create exam and clinical bottleneck.`,
      suggestedSolution: `Clear 2 high-priority tasks per day using 45-minute deep-work sprints before OPD/hospital rounds.`,
      actionableSteps: highPriorityPending.slice(0, 3).map((t) => `Complete: ${t.text} [${t.category.toUpperCase()}]`),
      potentialBenefit: `Eliminates last-minute exam/clinical stress and frees weekend hours.`,
    });
  }

  // ============================================================================
  // BUILD CATEGORY 5: ROADMAP JOURNEY & CAREER GOALS
  // ============================================================================
  categoryWiseSuggestions.push({
    id: 'cat-roadmap',
    category: 'roadmap_goals',
    title: '5. Roadmap Journey & BAMS Career Milestones',
    trackedMetricsSummary: `${data.milestones.length} Total Milestones • ${inProgressMilestones.length} Current • ${completedMilestones.length} Completed • Avg Progress: ${avgMilestoneProgress}%`,
    statusBadge: inProgressMilestones.length > 0 ? 'On Track & Optimizing' : 'Needs Attention',
    analysisSummary:
      inProgressMilestones.length > 0
        ? `Currently executing ${inProgressMilestones.length} active milestone(s): ${inProgressMilestones.map((m) => `${m.title} (${getMilestoneProgress(m)}%)`).join(', ')}.`
        : `You have ${upcomingMilestones.length} upcoming milestone(s) in your 2026–2028 BAMS & Ayurveez Healthcare roadmap.`,
    actionableSuggestions: [
      inProgressMilestones[0]
        ? `Primary Active Milestone Focus: Advance "${inProgressMilestones[0].title}" from ${getMilestoneProgress(inProgressMilestones[0])}% to ${Math.min(100, getMilestoneProgress(inProgressMilestones[0]) + 15)}% this month by completing its sub-checklists.`
        : `Activate Your Next Milestone: Mark your current BAMS/Clinic phase as 'Current' in the Roadmap tab.`,
      `Clinical Skill Monetization Alignment: Focus your internship & clinical postings on high-demand procedures (Agnikarma, Viddhakarma, Ksharasutra, and Amavata/Sandhivata management) that directly build patient trust for Ayurveez Healthcare.`,
      `Step-by-Step Clinic Preparation: Document your best clinical protocols and patient outcomes now so your transition from internship to full practice generates immediate revenue.`,
    ],
  });

  // ============================================================================
  // BUILD CATEGORY 6: HABITS & DAILY DINACHARYA (EXCLUDING LIFE JOURNALS)
  // ============================================================================
  categoryWiseSuggestions.push({
    id: 'cat-habits',
    category: 'habits_dinacharya',
    title: '6. Habits & Daily Dinacharya Routine (Excludes Life Journals)',
    trackedMetricsSummary: `${data.habits.length} Active Habit(s) (Avg Streak: ${avgHabitStreak}d) • Sleep Quality: ${avgSleep.toFixed(1)}/5 • Dinacharya Score: ${avgDinacharyaScore}%`,
    statusBadge: missedBrahma > 4 || avgSleep < 3.8 ? 'Needs Attention' : 'On Track & Optimizing',
    analysisSummary: `Across your tracked habits and Dinacharya logs (strictly excluding private Life Journals), your average habit streak is ${avgHabitStreak} days, sleep quality is ${avgSleep.toFixed(1)}/5, Dinacharya adherence is ${avgDinacharyaScore}%, and missed Brahma Muhurta wakeups in recent logs: ${missedBrahma}.`,
    actionableSuggestions: [
      `Protect Brahma Muhurta & Samhita Svadhyaya: Waking by 5:00 AM with warm Ushnodaka gives you 90 uninterrupted minutes for Charaka/Sushruta Samhita revision before college or OPD duties.`,
      `Sattvic Energy Management: Maintain consistent sleep by 10:30 PM (Ratricharya) so hospital postings and financial planning never cause burnout or Vata Prakopa.`,
      `Habit Stacking for Consistency: Pair your daily Samhita shloka memorization immediately after morning Pranayama to keep your habit streaks unbroken.`,
    ],
  });

  if (missedBrahma > 4 || avgSleep < 3.8) {
    problems.push({
      id: 'prob-habit-1',
      area: 'habits',
      title: 'Circadian Rhythm & Nidra Routine Optimization',
      severity: 'moderate',
      currentProblem: `Missed Brahma Muhurta wakeups on ${missedBrahma} days in recent logs, with average sleep quality rating of ${avgSleep.toFixed(1)}/5.`,
      suggestedSolution: 'Implement classical Ratricharya protocol: light dinner by 8:00 PM and 60-minute pre-sleep screen cutoff.',
      actionableSteps: [
        'Stop mobile/screen exposure 45–60 minutes before bed; review 5 Samhita sutras instead.',
        'Drink warm water (Ushnodaka) upon waking to clear Kapha-Ama and boost morning alertness.',
      ],
      potentialBenefit: 'Doubles morning clinical focus and eliminates daytime hospital duty fatigue.',
    });
  }

  // STRATEGIC OPPORTUNITIES
  opportunities.push({
    title: 'Ayurveez Healthcare Prakriti & Diet Consultation Package',
    category: 'income_generation',
    description: `Generate ₹4,000–₹8,000/month in supplementary clinical income through weekend Ayurvedic Prakriti, Pathya-Apathya, and lifestyle consultations (8–15 patients/month @ ₹300–₹500).`,
    actionPlan: `Use ₹2,500/mo of this extra income to prepay KreditBee (₹22,746) and ₹1,500/mo into Stable Money FD (8.50%) + Nifty 50 SIP.`,
  });

  opportunities.push({
    title: 'Stable Money FD (8.50% p.a.) Revolving EMI Shield',
    category: 'debt_elimination',
    description: 'By parking ₹5,000–₹10,000 in a Stable Money FD earning 8.50%–9.00% p.a. (DICGC insured), your emergency fund earns the exact same rate (8.50%) as your KreditBee/Relative loans while staying 100% liquid.',
    actionPlan: 'Transfer ₹1,000–₹2,000 every surplus month into Stable Money FD until your ₹10,000 self-buffer is complete.',
  });

  const computedScore = Math.max(
    62,
    Math.min(
      96,
      88 -
        (totalMonthlyEmi > 10000 ? 8 : 0) -
        (deficitAmount > 0 ? 10 : 0) -
        (highPriorityPending.length > 2 ? 5 : 0) -
        (missedBrahma > 4 ? 5 : 0)
    )
  );

  return {
    overallHealthScore: computedScore,
    trackedModulesCount: 6,
    categoryWiseSuggestions,
    investmentBlueprint: {
      summaryHeadline: '4-Pillar Smart Investment Plan (Stable Money FD 8.50%, RD, Mutual Fund SIP & Bonds)',
      strategyNote:
        'Because you have active loans at 8.5%–12% p.a., your investment plan must balance Guaranteed High-Yield Liquidity (8.50% Stable Money FD & RD) with High-Growth Compounding (12–15% Equity Mutual Fund SIPs & 10% Secured Bonds/Gold).',
      recommendations: investmentRecommendations,
      monthlyAllocationSteps: [
        'Phase 1 (Immediate Safety Shield): Build ₹10,000 in Stable Money FD (8.50% p.a.) + ₹500/mo RD so you never face an EMI bounce or need emergency credit.',
        'Phase 2 (Debt-Adjusted Wealth Building): Split every monthly surplus 50% toward Priority #1 Loan Prepayment (KreditBee ₹22,746), 25% into Stable Money FD (8.50%) / RD, and 25% into Nifty 50 Index + Flexi-Cap SIP.',
        'Phase 3 (Post-KreditBee Acceleration): Once KreditBee is cleared (freeing ₹3,791/mo), channel ₹2,000/mo into Mutual Fund SIPs & Secured Bonds (9.5–11%) and ₹1,791/mo into IDBI 12% Loan prepayment.',
      ],
    },
    loanClearancePlan: {
      totalActiveLoans: activeLoans.length,
      totalRemainingPrincipal: totalRemaining,
      totalMonthlyEmi,
      strategyHeadline:
        'Hybrid Cash-Flow Velocity + Avalanche Method (Free Up ₹4,028/mo First, Then Crush 12% IDBI Loan)',
      rankedPayoffSteps,
      goldenRules: [
        'Rule 1 (Attack High-EMI / Small-Principal First): KreditBee is only ₹22,746 principal (4.7% of your total debt) yet consumes ₹3,791/mo (20% of your total EMI!). Clearing it first gives the highest monthly cash-flow relief.',
        'Rule 2 (Wipe Out Micro-Debts Next): Clear Munchun Da (₹7,500) second so you only have 2 loans left to track.',
        'Rule 3 (Snowball Freed EMIs into 12% IDBI Loan): Never spend freed-up EMI money on lifestyle inflation—roll it directly into your 12% IDBI Education Loan principal and 8.50% Stable Money FD.',
      ],
    },
    expenseReductionPlan: {
      totalIncome,
      totalExpense,
      totalOutflowWithEmi,
      netAfterEmi,
      auditItems: expenseAuditItems,
      topSavingRules: [
        'Lock Fixed Rent (₹3,000) on Day 1 and cap all variable personal/food/travel expenses via a separate UPI Lite wallet loaded with max ₹1,500/month.',
        'Replace daily outside tea/snacks/food delivery with Sattvic home/hostel meals & roasted dry fruits — saves ₹1,200–₹1,800/mo and prevents Amlapitta.',
        'Share reference textbooks/printouts in a 3-student BAMS study circle and batch clinical commute rides to save ₹600–₹1,000/mo.',
      ],
    },
    criticalProblems: problems,
    strategicOpportunities: opportunities,
  };
};

export interface PersonalAIChatContext {
  loans: LoanItem[];
  investments: InvestmentItem[];
  expenses: ExpenseRecord[];
  habits: HabitItem[];
  dinacharyaLogs: DinacharyaLog[];
  milestones: RoadmapMilestone[];
  tasks?: ChecklistTask[];
}

export const chatWithPersonalAI = async (
  message: string,
  history: { role: 'user' | 'assistant'; text: string }[],
  context: PersonalAIChatContext
): Promise<string> => {
  const todayStr = new Date().toISOString().split('T')[0];
  const totalDebt = context.loans.reduce((acc, l) => acc + (l.principalAmount || 0), 0);
  const totalDebtPaid = context.loans.reduce((acc, l) => acc + (l.totalPaid || 0), 0);
  const remainingDebt = Math.max(0, totalDebt - totalDebtPaid);
  const monthlyEmi = context.loans
    .filter((l) => l.status === 'active' || l.status === 'partially_paid')
    .reduce((acc, l) => acc + (l.monthlyEmi || 0), 0);

  const totalInvested = context.investments.reduce((acc, i) => acc + (i.investedAmount || 0), 0);
  const totalValuation = context.investments.reduce((acc, i) => acc + (i.currentValue || 0), 0);
  const totalSip = context.investments.reduce((acc, i) => acc + (i.sipMonthly || 0), 0);

  const totalExpense = context.expenses
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalIncome = context.expenses
    .filter((e) => e.type === 'income')
    .reduce((acc, e) => acc + (e.amount || 0), 0);

  const completedHabits = context.habits.filter((h) => h.completedDates.includes(todayStr));
  const pendingHabits = context.habits.filter((h) => !h.completedDates.includes(todayStr));
  const pendingTasks = (context.tasks || []).filter((t) => !t.isCompleted);
  const activeMilestone = context.milestones.find((m) => m.status === 'current');

  const contextSummary = [
    `Date: ${todayStr}`,
    `Loans: ${context.loans.length} total | Principal: ₹${totalDebt.toLocaleString('en-IN')}, Paid: ₹${totalDebtPaid.toLocaleString('en-IN')}, Remaining: ₹${remainingDebt.toLocaleString('en-IN')}, Monthly EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo`,
    `Investments: ${context.investments.length} assets | Invested: ₹${totalInvested.toLocaleString('en-IN')}, Current Value: ₹${totalValuation.toLocaleString('en-IN')}, Monthly SIP: ₹${totalSip.toLocaleString('en-IN')}/mo`,
    `Cash Flow: Income ₹${totalIncome.toLocaleString('en-IN')} | Expenses ₹${totalExpense.toLocaleString('en-IN')}`,
    `Habits Today: ${completedHabits.length}/${context.habits.length} completed. Pending: ${pendingHabits.map((h) => h.name).join(', ') || 'None'}`,
    `Pending Keep To-Do Tasks (${pendingTasks.length}): ${pendingTasks.slice(0, 5).map((t) => t.text).join('; ') || 'None'}`,
    `Active Roadmap Milestone: ${activeMilestone ? `${activeMilestone.title} (${activeMilestone.period})` : 'None'}`,
  ].join('\n');

  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        contextSummary,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('Gemini chat endpoint fallback triggered:', err);
  }

  // Context-aware intelligent fallback using live LifeOS & clinical database
  const q = message.toLowerCase();

  if (q.includes('loan') || q.includes('emi') || q.includes('debt') || q.includes('clear')) {
    if (context.loans.length === 0) {
      return `You currently have **0 active loans** recorded (₹0/mo EMI).\n• Redirect surplus cash into **Stable Money FD (8.50% p.a.)** and **Nifty 50 SIP**.`;
    }
    return `Here is your **Step-by-Step Loan Clearance Plan** (Remaining: ₹${remainingDebt.toLocaleString('en-IN')} | Total EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo):\n1. **Priority #1 — KreditBee Loan (₹22,746 | ₹3,791/mo EMI):** Clear this first! It is only 4.7% of your total debt but takes ₹3,791/mo. Closing it frees up +₹3,791 every month.\n2. **Priority #2 — Munchun Da (₹7,500 | ₹237/mo):** Smallest balance — wipe it out next using 2 months of freed KreditBee EMI.\n3. **Priority #3 — BAMS ED. LOAN - IDBI (₹4,00,000 | 12% p.a. | ₹13,286/mo):** Highest interest rate (12%). Check student moratorium eligibility and roll freed EMIs (+₹4,028/mo) into principal prepayment.\n4. **Priority #4 — Parvesh Da (₹50,000 | 8.5% | ₹1,578/mo):** Maintain regular ₹1,578/mo family payments and clear via quarterly surpluses.`;
  }

  if (q.includes('invest') || q.includes('sip') || q.includes('wealth') || q.includes('portfolio') || q.includes('fd') || q.includes('rd') || q.includes('stable') || q.includes('bond')) {
    return `Here is your **Best 4-Pillar Investment Plan** (Current Portfolio: ₹${totalValuation.toLocaleString('en-IN')}):\n1. **Stable Money FD (8.50% – 9.10% p.a. | 35% Allocation):** DICGC-insured Small Finance Bank FDs (Unity/Suryoday/Utkarsh via Stable Money). Park ₹5,000–₹15,000 here first for your Emergency & EMI Safety Shield.\n2. **Bank RD / Auto-Sweep FD (7.25% – 8.00% p.a. | 20% Allocation):** ₹500–₹1,500/mo Recurring Deposit for exam fees, clinical instruments & short-term goals.\n3. **Equity Mutual Fund SIP (12.5% – 15% CAGR | 30% Allocation):** ₹1,000–₹3,000/mo in **UTI Nifty 50 Index Fund Direct Growth** + **Parag Parikh Flexi-Cap** to build your 2028 Clinic Setup Fund.\n4. **Senior Secured Bonds & Gold (9.5% – 11% p.a. | 15% Allocation):** AAA/A+ Corporate Bonds (Wint Wealth/Stable Bonds) + Gold ETF/SGB for fixed payouts & inflation protection.`;
  }

  if (q.includes('expense') || q.includes('budget') || q.includes('spend') || q.includes('income') || q.includes('reduce') || q.includes('save')) {
    return `Here is your **Expense Reduction & Cash-Flow Plan** (Income: ₹${totalIncome.toLocaleString('en-IN')} | Expenses: ₹${totalExpense.toLocaleString('en-IN')}):\n• **Fixed Rent (₹3,000):** Keep locked and pay on Day 1.\n• **Cut Daily UPI Micro-Spends (Save ₹1,200–₹1,800/mo):** Cap outside tea/snacks/Swiggy/Zomato at ₹50/day using UPI Lite; stick to Sattvic mess/home food.\n• **Study & Travel Optimization (Save ₹600–₹1,000/mo):** Use PDF Samhitas/library copies, group printouts, and shared commute rides.\n• **2-Tier Buffer:** Use a ₹1k–₹2k 30-day friend bridge for minor gaps; reserve brother support (up to ₹5k) only for non-regular exam/clinical months.`;
  }

  if (q.includes('habit') || q.includes('dinacharya') || q.includes('routine') || q.includes('streak')) {
    return `Your **Habits & Dinacharya status for today (${todayStr})**:\n• **Completed:** ${completedHabits.length} of ${context.habits.length} habits\n• **Pending Today:** ${pendingHabits.length > 0 ? pendingHabits.map((h) => h.name).join(', ') : 'All habits completed! 🔥'}\n• **Tip:** Waking in Brahma Muhurta (4:30–5:00 AM) with warm Ushnodaka keeps your Agni and clinical focus sharp.`;
  }

  if (q.includes('task') || q.includes('todo') || q.includes('to-do') || q.includes('work')) {
    return `You have **${pendingTasks.length} pending task(s)** in Keep To-Do:\n${
      pendingTasks.length > 0
        ? pendingTasks.slice(0, 4).map((t, i) => `${i + 1}. ${t.text} [${t.priority.toUpperCase()}]`).join('\n')
        : '• All tasks are currently completed!'
    }\nFocus on clearing your highest-priority clinical and study tasks first thing in the morning.`;
  }

  if (q.includes('exam') || q.includes('study') || q.includes('roadmap') || q.includes('bams') || q.includes('proff') || q.includes('aiapget')) {
    return `**Academic & Roadmap Focus:**\n• **Current Phase:** ${activeMilestone ? `${activeMilestone.title} (${activeMilestone.period})` : 'BAMS Final Proff & Clinical Preparation'}\n• **Study Strategy:** Dedicate 90 minutes each morning to Brihat Trayi (Charaka Chikitsa Sthana & Sushruta Uttaratantra) and 30 minutes each evening to clinical case revision & AIAPGET MCQs.`;
  }

  // Check if question is about a clinical disease in our presets
  const matchedPreset = CLINICAL_DISEASE_PRESETS.find(
    (p) =>
      q.includes(p.ayurvedicName.toLowerCase()) ||
      q.includes(p.modernName.toLowerCase()) ||
      q.includes(p.id.toLowerCase())
  );
  if (matchedPreset) {
    return `**Clinical Summary for ${matchedPreset.name}:**\n• **Dosha & Srotas:** ${matchedPreset.category} (${matchedPreset.symptoms})\n• **Key Shamana:** Check the **Medicos Area** tab in Ravi's Assistant for complete Acharya-wise Samhita Shlokas, Chikitsa Sutra, and textbook Shamana Aushadhi for ${matchedPreset.ayurvedicName}.`;
  }

  return `Namaste Dr. Ravi! Here is your live snapshot & answer:\n• **Habits Today:** ${completedHabits.length}/${context.habits.length} done (${pendingHabits.length} pending)\n• **Pending Tasks:** ${pendingTasks.length} in Keep To-Do\n• **Finances:** ₹${monthlyEmi.toLocaleString('en-IN')}/mo EMI | ₹${totalValuation.toLocaleString('en-IN')} Portfolio | ₹${totalExpense.toLocaleString('en-IN')} Expenses\n• **Academic Focus:** ${activeMilestone ? activeMilestone.title : 'BAMS Final Proff'}\n\nAsk me anything specific about your **Best Investment Plan (Stable Money FD 8.50%, RD, SIP, Bonds), Loan Clearance Strategy, Expense Reduction, BAMS study plan, or Ayurvedic clinical treatments**!`;
};

