/**
 * Dynamically generates accurate, question-specific Quick Fill answers for Prashna Pariksha (DDx Clinical Inquiry)
 * both BEFORE and AFTER submitting patient answers across all 55+ clinical diseases and custom queries.
 */
export function getQuestionSpecificQuickAnswers(question: string): string[] {
  const q = (question || '').toLowerCase();

  // --- A. LAB / BIOMARKER / IMAGING QUESTIONS ---
  // 1. CBC / Hemoglobin / MCV / Ferritin / Iron (Pandu / Anemia / Hookworm)
  if (q.includes('hemoglobin') || q.includes('ferritin') || q.includes('mcv') || (q.includes('cbc') && !q.includes('eosinophil'))) {
    return [
      'Hb < 9.5 g/dL, Low MCV < 76 fL & Low Ferritin (Microcytic Iron-Deficiency Pandu)',
      'Hb < 10 g/dL with High MCV > 100 fL (Megaloblastic B12/Folate Deficiency)',
      'Borderline Hb 10.5–11.5 g/dL (Mild Nutritional Pandu)',
      'Normal Hb (>12.5 g/dL) & Normal Iron Indices',
    ];
  }

  // 2. Eosinophilia / IgE / Hookworm / Allergic CBC
  if (q.includes('eosinophil') || q.includes('ige')) {
    return [
      'Elevated Absolute Eosinophil Count (AEC > 600/µL) + Mild Anemia',
      'Marked Eosinophilia with Elevated Total Serum IgE (Allergic / Parasitic)',
      'Normal Eosinophil Count (< 4%) & Normal Hb',
      'Lab Report Pending',
    ];
  }

  // 3. Fasting Blood Sugar / PPBS / HbA1c (Prameha / Madhumeha / Diabetes)
  if (q.includes('hba1c') || q.includes('fasting blood sugar') || q.includes('postprandial') || q.includes('fbs') || q.includes('ppbs')) {
    return [
      'FBS > 140 mg/dL, PPBS > 220 mg/dL, HbA1c ≥ 7.2% (Confirmed Madhumeha)',
      'Prediabetic Range: FBS 105–125 mg/dL, HbA1c 5.8–6.4% (Kaphaja Prameha)',
      'Severely Uncontrolled: FBS > 200 mg/dL, HbA1c > 9.0% with Glucosuria',
      'Normal Euglycemia (FBS < 99 mg/dL, HbA1c < 5.6%)',
    ];
  }

  // 4. Serum Uric Acid (Vatarakta / Gout)
  if (q.includes('uric acid') || q.includes('>6.8 mg/dl')) {
    return [
      'Elevated Serum Uric Acid: 8.2 mg/dL (Confirmed Hyperuricemia / Vatarakta)',
      'Markedly High Uric Acid (> 9.5 mg/dL) with Recurrent Podagra',
      'Borderline 6.2–6.8 mg/dL (Acute Flare Synovial Precipitation)',
      'Normal Uric Acid (< 5.8 mg/dL)',
    ];
  }

  // 5. Urine Microscopy / Pus Cells / Nitrites / Albuminuria / Creatinine / Bilirubin
  if (q.includes('pus cells') || q.includes('nitrite') || (q.includes('urine') && q.includes('microscopy'))) {
    return [
      'Significant Pyuria (15–20 Pus Cells/HPF) + Positive Leukocyte Esterase & Nitrites (UTI)',
      'Microscopic Hematuria (RBCs > 5/HPF) + Calcium Oxalate Crystals (Ashmari)',
      '2–4 Pus Cells/HPF, No Bacteria (Sterile / Pitta Irritative Dysuria)',
      'Normal Urine Routine & Microscopy',
    ];
  }

  if (q.includes('albuminuria') || (q.includes('urine protein') && q.includes('creatinine'))) {
    return [
      '3+ Proteinuria (>3.5 g/day) + Normal/Mildly Raised Creatinine (Vrikkaja / Nephrotic Shotha)',
      'Trace/Nil Urine Protein with Normal Creatinine (0.9 mg/dL — Cardiac/Venous Edema)',
      'Elevated Serum Creatinine (>2.2 mg/dL) + Reduced eGFR (Chronic Renal Impairment)',
      'Normal Urine Protein & Normal Renal Profile',
    ];
  }

  if (q.includes('direct bilirubin') || q.includes('stercobilinogen') || q.includes('coombs') || q.includes('spherocytes')) {
    return [
      'Unconjugated Hyperbilirubinemia + Urine Negative for Bile Salts + Reticulocytosis (Shakhashrita / Hemolytic)',
      'Conjugated Direct Hyperbilirubinemia + Dark Bile-Stained Urine (Koshthashrita Kamala)',
      'Positive Direct Coombs Test / Spherocytes on Peripheral Smear',
      'Normal Bilirubin Fractions & Negative Coombs Test',
    ];
  }

  // 6. Serum PSA & DRE (Mutraghata / BPH)
  if (q.includes('psa') || q.includes('digital rectal') || q.includes('dre')) {
    return [
      'Smooth, Firm, Symmetrical Grade II Prostatic Enlargement on DRE; PSA 2.4 ng/mL (Benign BPH)',
      'Large Median Lobe Enlargement with Post-Void Residual > 120 mL; PSA < 4.0 ng/mL',
      'Elevated PSA (> 4.5 ng/mL) — Multiparametric MRI / Urology Review Advised',
      'DRE & Serum PSA Pending',
    ];
  }

  // 7. Sputum CBNAAT / GeneXpert & Chest X-Ray (Rajayakshma / TB / Kasa)
  if (q.includes('cbnaat') || q.includes('genexpert') || q.includes('cavitation') || q.includes('apical infiltrate')) {
    return [
      'Sputum CBNAAT Positive for M. tuberculosis (Rifampicin Sensitive) + Upper Lobe Infiltrate',
      'Sputum AFB/CBNAAT Negative; CXR Shows Bronchiectasis / Chronic Bronchitis Only',
      'CXR Shows Apical Patchy Opacity — Sputum CBNAAT Report Awaited',
      'Normal Chest X-Ray & Negative Sputum AFB',
    ];
  }

  // 8. Peak Expiratory Flow Rate (PEFR) / Spirometry (Tamaka Shwasa / Asthma)
  if (q.includes('pefr') || q.includes('spirometry') || q.includes('bronchodilator inhalation') || q.includes('>12%')) {
    return [
      'Yes — PEFR / FEV1 Improves > 15% Post-Bronchodilator (Reversible Tamaka Shwasa / Asthma)',
      'Partial Reversibility (< 10%) with Fixed Expiratory Airflow Limitation (COPD)',
      'Markedly Reduced Baseline PEFR During Acute Nocturnal Wheezing Attack',
      'Normal Baseline PEFR Between Episodes',
    ];
  }

  // 9. Peripheral Smear for Malaria (Vishama Jwara)
  if (q.includes('malarial parasite') || q.includes('thick and thin smear') || q.includes('rapid antigen')) {
    return [
      'Positive for Plasmodium vivax Trophozoites/Schizonts (Tritiyaka Vishama Jwara)',
      'Positive for Plasmodium falciparum Ring Forms (Rapid Antigen Positive)',
      'Smear & Rapid Malaria Antigen Negative (Evaluate for Dengue / Enteric Jwara)',
      'Blood Smear Collected During Fever Spike — Report Awaited',
    ];
  }

  // 10. VDRL / TPHA / Genital Ulcer Serology (Upadansha / Firanga)
  if (q.includes('vdrl') || q.includes('tpha') || q.includes('viral serology')) {
    return [
      'VDRL Reactive (1:16) & TPHA Positive (Confirmed Firanga / Primary-Secondary Syphilis)',
      'HSV-2 IgM/PCR Positive with Non-Reactive VDRL (Herpes Genitalis / Pittaja Upadansha)',
      'Both VDRL & Viral Serology Negative (Non-Specific Traumatic / Candidal Balanitis)',
      'Serology Panel Sent — Report Pending',
    ];
  }

  // 11. Semen Analysis (Klaibya / Shukradushti)
  if (q.includes('semen analysis') || q.includes('sperm count') || q.includes('motility')) {
    return [
      'Oligozoospermia (Count < 15 Million/mL) with Reduced Progressive Motility (< 32% — Shukra Kshaya)',
      'Normal Sperm Count (> 40 Million/mL) & Normal Motility (Psychogenic / Vataja Klaibya)',
      'Asthenozoospermia + Increased Viscosity / Pus Cells (Kaphaja / Pittaja Shukradushti)',
      'Partner Semen Analysis Normal / Pending',
    ];
  }

  // 12. Ovulation / Follicular Study / HSG / Tubal Patency (Vandhyatva / Yonivyapad)
  if (q.includes('ovulatory') || q.includes('follicular') || q.includes('progesterone')) {
    return [
      'Anovulatory Cycles with Bilateral Polycystic Ovarian Morphology (PCOS / Artavakshaya)',
      'Documented Dominant Follicle Rupture & Day-21 Progesterone > 10 ng/mL (Ovulatory)',
      'Luteal Phase Defect / Unruptured Luteinized Follicle',
      'Follicular Study Scheduled for Next Cycle',
    ];
  }

  if (q.includes('hysterosalpingography') || q.includes('hsg') || q.includes('tubal patency')) {
    return [
      'Bilateral Free Peritoneal Spill Confirmed on HSG (Patent Fallopian Tubes)',
      'Unilateral / Bilateral Cornual or Fimbrial Tubal Block (Artavavaha Srotorodha — Uttara Basti Indicated)',
      'Normal Uterine Cavity Contour Without Synechiae or Fibroids',
      'HSG / Sonosalpingography Not Yet Done',
    ];
  }

  // 13. Non-Contrast CT Brain / Stroke Onset Window / BP (Pakshaghata)
  if (q.includes('critical window') || q.includes('thrombolysis') || q.includes('time of symptom onset')) {
    return [
      'Subacute / Post-Hospital Discharge Phase (> 2 weeks — Ready for Ayurvedic Pakshaghata Rehab)',
      'Acute Onset Within Last 24–72 Hours (Stabilized in Stroke Unit)',
      'Hyperacute Onset (< 4.5 Hours — Immediate Emergency Stroke Protocol)',
      'Chronic Post-Stroke Hemiparesis (> 3 Months Duration)',
    ];
  }

  if (q.includes('ct brain') || q.includes('intracranial hemorrhage')) {
    return [
      'NCCT Brain Shows Ischemic Infarct in MCA Territory (Hemorrhage Ruled Out)',
      'Lacunar Infarct in Internal Capsule / Basal Ganglia',
      'Prior Resolved Intracerebral Hemorrhage (Now Stable for Mridu Snehana-Basti)',
      'CT / MRI Brain Report Pending',
    ];
  }

  if (q.includes('carotid doppler') || (q.includes('blood pressure') && q.includes('blood glucose'))) {
    return [
      'Stage 2 Hypertension (BP 160/96 mmHg) + Mild Carotid Intimal Thickening (< 40% Stenosis)',
      'Controlled BP (130/80 mmHg) on Amlodipine/Telmisartan + Euglycemic',
      'Concurrent Diabetes (HbA1c 7.8%) & Dyslipidemia Requiring Statin + Antiplatelet',
      'Normal Carotid Doppler & Controlled Vitals',
    ];
  }

  // 14. Night-time Blood Smear for Microfilariae / Elephantiasis (Shlipada)
  if (q.includes('microfilaria') || q.includes('10 pm to 2 am') || q.includes('elephant')) {
    return [
      'Non-Pitting Brawny Swelling with Thickened Skin (Chronic Kaphaja Shlipada)',
      'Recurrent Acute Lymphangitis Attacks with Fever & Tender Inguinal Nodes',
      'Nocturnal Smear / Filariasis Antigen (ICT) Positive for Wuchereria bancrofti',
      'Soft Pitting Edema Only (Resolves on Limb Elevation — Shotha)',
    ];
  }

  // 15. Ultrasound Biliary / Portal Vein / Cirrhosis / Splenomegaly (Kamala / Yakritodara / Pleehodara)
  if (q.includes('biliary radicals') || q.includes('cbd stone') || q.includes('courvoisier') || q.includes('biliary colic')) {
    return [
      'USG Shows Calculous Cholecystitis / CBD Stone with Dilated Intrahepatic Biliary Radicals',
      'Hepatomegaly with Diffuse Hepatocellular Parenchymal Inflammation (No Biliary Block)',
      'Right Hypochondriac Colicky Pain After Fatty Meals',
      'No Biliary Dilatation on Ultrasound',
    ];
  }

  if (q.includes('portal vein') || q.includes('cirrhosis') || q.includes('spider angioma') || q.includes('palmar erythema') || q.includes('liver edge')) {
    return [
      'Firm Non-Tender Palpable Liver Edge (3 cm BCM) + Coarse Echotexture & Mild Ascites',
      'Smooth Tender Hepatomegaly with Fatty Infiltration (Grade II NAFLD / Yakrit Vriddhi)',
      'Palmar Erythema + Portal Vein > 13 mm with Mild Splenomegaly (Portal HTN)',
      'No Stigmata of Chronic Liver Failure or Ascites',
    ];
  }

  if (q.includes('splenic notch') || q.includes('left costal margin') || q.includes('kala-azar')) {
    return [
      'Firm Palpable Spleen Extending 4 cm Below Left Costal Margin with Distinct Splenic Notch',
      'History of Recurrent Endemic Malaria / ChronicVishama Jwara with Pallor',
      'Mild Splenomegaly on USG Without Portal Hypertension or Ascites',
      'No Palpable Mass in Left Hypochondrium',
    ];
  }

  // --- B. MUSCULOSKELETAL & JOINT QUESTIONS ---
  // 16. Subcutaneous nodules / Rheumatoid nodules / Tophi
  if (q.includes('nodule') || q.includes('tophi') || q.includes('pressure point')) {
    return [
      'Yes — Firm Subcutaneous Rheumatoid Nodules Over Extensor Forearm',
      'No Subcutaneous Nodules Noticed',
      'Chalky White Urate Tophi Over Helix of Ear / Great Toe (Vatarakta)',
      'Soft Boggy Synovial Swelling Only',
    ];
  }

  // 17. Knee locking / Meniscal tear / Patellar tap / Effusion (Sandhivata / Kroshtuka Shirsha)
  if (q.includes('patellar tap') || q.includes('fluid wave') || q.includes('knee effusion') || q.includes('twisting trauma') || q.includes('acl')) {
    return [
      'Positive Patellar Tap & Suprapatellar Boggy Swelling (Kroshtuka Shirsha / Synovial Effusion)',
      'Warm Swollen Knee Without High Fever or Septic Signs (Inflammatory Synovitis)',
      'History of Twisting Sports/Stair Injury Preceding Swelling',
      'Minimal Fluid — Predominantly Bony Osteophytic Enlargement (Sandhivata)',
    ];
  }

  if (q.includes('lock') || q.includes('straighten') || q.includes('give way') || q.includes('instability')) {
    return [
      'No True Mechanical Locking (Gradual Stiffness & Pain on Flexion Only)',
      'Yes — Sudden Mechanical Locking / Catching (Suspect Meniscal Tear)',
      'Painful Restriction of Full Squatting & Cross-Legged Sitting (Sandhivata)',
      'Occasional Instability When Descending Stairs',
    ];
  }

  // 18. Fragility fracture / Osteoporosis (Asthi-Kshaya)
  if (q.includes('fracture') || q.includes('trivial fall') || q.includes('minor slip') || q.includes('height loss')) {
    return [
      'No History of Fragility Fracture',
      'Yes — Prior Wrist/Vertebral Fracture from Minor Slip (Asthi-Kshaya)',
      'Diffuse Bone Aching, Hair Fall & Brittle Ridged Nails',
      'Gradual Thoracic Kyphosis / Stooping Posture',
    ];
  }

  // 19. Morning stiffness duration (Amavata >60m vs Sandhivata <30m vs Ankylosing Spondylitis)
  if (q.includes('stiffness') && (q.includes('morning') || q.includes('waking') || q.includes('60') || q.includes('30') || q.includes('45') || q.includes('hour') || q.includes('minute') || q.includes('long'))) {
    return [
      '> 60 Mins (1–2 Hours — Classic Amavata / Inflammatory Arthritis)',
      '< 30 Mins (10–15 Mins — Classic Degenerative Sandhivata / OA)',
      'Persists All Morning & Relieved After Warm Fomentation / Activity',
      'No Significant Morning Stiffness',
    ];
  }

  // 20. Systemic Ama signs: Heaviness (Gaurava), Loss of Appetite (Aruchi), Coated tongue
  if (q.includes('gaurava') || q.includes('aruchi') || q.includes('unrefreshing') || q.includes('systemic ama') || (q.includes('heaviness') && q.includes('appetite'))) {
    return [
      'Yes — Marked Body Heaviness (Gaurava) + Loss of Appetite (Aruchi)',
      'Thick White Coated Tongue (Sama Jihwa) + Low-Grade Malaise',
      'Sluggish Digestion & Constipation (Vibandha)',
      'No Heaviness — Good Appetite & Clear Tongue (Nirama Stage)',
    ];
  }

  // 21. Upashaya / Anupashaya: Dry heat (Valuka Sweda) vs Warm Oil Massage (Abhyanga / Janu Basti)
  if (q.includes('valuka') || q.includes('abhyanga') || q.includes('janu basti') || (q.includes('oil') && (q.includes('heat') || q.includes('massage') || q.includes('sweda') || q.includes('aggravat') || q.includes('better')))) {
    return [
      'Dry Sand Heat (Valuka Sweda) Relieves; Oil Application Worsens Pain (Amavata)',
      'Warm Medicated Oil (Abhyanga / Janu Basti) Gives Marked Relief (Sandhivata)',
      'Cooling Lepa / Shatadhauta Ghrita Relieves Burning Joint Pain (Vatarakta)',
      'Gentle Dry Warmth & Rest Provide Partial Relief',
    ];
  }

  // 22. Small hand joints (MCP / PIP / DIP) vs Big Toe (1st MTP) vs Weight-bearing Knee
  if (q.includes('mcp') || q.includes('pip') || q.includes('dip') || q.includes('small joint') || q.includes('both hands') || q.includes('knuckle')) {
    return [
      'Yes — Symmetrical MCP, PIP & Wrist Joints of Both Hands (Amavata / RA)',
      'No — Only Weight-Bearing Knees / Spine Affected (Sandhivata / OA)',
      'Distal Interphalangeal (DIP) Joints with Nail Pitting (Psoriatic)',
      'Acute Monoarticular 1st MTP (Big Toe) Involvement (Vatarakta / Gout)',
    ];
  }

  // 23. Descending stairs / Walking / Prolonged sitting or lifting (Sandhivata / Katishoola)
  if (q.includes('prolonged sitting') || q.includes('lifting') || q.includes('lying flat')) {
    return [
      'Yes — Worsens with Prolonged Sitting & Forward Bending; Better Lying Flat on Firm Bed',
      'Triggered After Lifting Heavy Weight (Mechanical Lumbar Strain / Katigraha)',
      'Stiffness Worse on Waking & Improves After Walking (Inflammatory Backache)',
      'Continuous Dull Lumbosacral Ache',
    ];
  }

  if (q.includes('stair') || q.includes('walking long') || q.includes('weight-bearing') || q.includes('prolonged standing')) {
    return [
      'Yes — Worsens on Climbing/Descending Stairs & Standing; Relieved by Rest (Sandhivata)',
      'Pain Worse at Rest & Early Morning, Improves with Movement (Amavata)',
      'Difficulty Rising from Squatting or Indian Toilet Posture',
      'Pain Present Both on Activity and at Rest',
    ];
  }

  // 24. Cervical Spondylosis / Manyastambha / Spurling test / Neck rotation
  if (q.includes('spurling') || q.includes('turning the neck') || q.includes('scapular') || q.includes('cervical radiculopathy') || q.includes('neck')) {
    return [
      'Restricted painful lateral neck rotation with trapezius spasm (Manyastambha)',
      'Pain radiates from neck to shoulder & thumb/index fingers (C6/C7 Radiculopathy)',
      'Positive Spurling test with tingling in forearm; aggravated by screen work',
      'Neck stiffness with occasional positional dizziness on looking up',
    ];
  }

  // 25. Crepitus / Crunching / Clicking sound in joint (Vatapurna-driti sparsha)
  if (q.includes('crepitus') || q.includes('crunching') || q.includes('clicking') || q.includes('grating') || q.includes('joint space narrowing')) {
    return [
      'Yes — Palpable & Audible Grating Crepitus on Knee Flexion + Medial Space Narrowing (Sandhivata)',
      'Soft Spongy Synovial Swelling Without Coarse Bony Crepitus (Amavata)',
      'Mild Clicking Without Radiographic Deformity (Early Stage)',
      'No Crepitus Detected',
    ];
  }

  // 26. Big toe / Midnight flare / Podagra (Vatarakta / Gout)
  if (q.includes('big toe') || q.includes('midnight') || q.includes('3 am') || q.includes('metatarsophalangeal') || q.includes('fiery red') || q.includes('light touch')) {
    return [
      'Yes — Sudden 2–3 AM Throbbing Pain in 1st MTP Big Toe (Podagra / Vatarakta)',
      'Joint Is Fiery Red, Hot, Shiny & Intolerant Even to Bedsheet Touch',
      'Triggered by High-Purine / Protein Meal or Alcohol Intake',
      'Subacute Polyarticular Ache Without Acute Redness',
    ];
  }

  // 27. Sciatica / Gridhrasi / Radiation down thigh, calf, foot / Urustambha
  if (q.includes('urustambha') || q.includes('inert stones') || q.includes('wooden logs') || q.includes('rukshana is permitted')) {
    return [
      'Yes — Thighs Feel Heavy, Cold & Stiff Like Lifeless Logs (Urustambha)',
      'History of Excess Curd/Dairy, Daytime Sleep & Severe Ama Accumulation',
      'Aggravated by Oil Massage (Snehana); Relieved by Dry Rukshana & Udwartana',
      'Sharp Radiating Neuralgic Pain instead of Wooden Heaviness (Gridhrasi)',
    ];
  }

  if (q.includes('radiat') || q.includes('thigh') || q.includes('calf') || q.includes('sciatic') || q.includes('paresthesia') || q.includes('tingling') || q.includes('numbness')) {
    if (q.includes('soles of the feet') || q.includes('diabetic peripheral')) {
      return [
        'Yes — Bilateral Stocking-Pattern Burning & Numbness in Soles (Karapada Daha / Diabetic Neuropathy)',
        'Tingling Worse at Night in Both Feet',
        'Mild Numbness in Toes Only',
        'No Peripheral Neuropathy Symptoms',
      ];
    }
    return [
      'Yes — Radiates Lumbar → Buttock → Posterior Thigh → Calf → Foot (Gridhrasi / SLR +ve)',
      'Confined to Lower Back Only — Does Not Cross Knee (Katishoola)',
      'Piercing Lancinating Pain Only (Pure Vataja Gridhrasi)',
      'Heavy, Stiff Limb with Anorexia & Drowsiness (Vata-Kaphaja Gridhrasi)',
    ];
  }

  // --- C. GI, HEPATOBILIARY & ANORECTAL QUESTIONS ---
  // 28. Dysphagia / Odynophagia / Difficulty swallowing
  if (q.includes('swallow') || q.includes('dysphagia') || q.includes('odynophagia') || q.includes('food stuck')) {
    return [
      'No Difficulty or Pain on Swallowing (Uncomplicated Amlapitta)',
      'Retrosternal Burning Only — Solids & Liquids Pass Freely',
      'Occasional Sensation of Acidic Regurgitation in Throat',
      'Progressive Difficulty Swallowing Solids (Urgent Upper GI Endoscopy Needed)',
    ];
  }

  // 29. Acid reflux / Sour-bitter eructation (Tiktamla Udgara) / Heartburn
  if (q.includes('tiktamla') || q.includes('sour or bitter') || q.includes('acidic liquid') || q.includes('bend over') || q.includes('lie down after dinner') || q.includes('hrit-kantha') || q.includes('retrosternal') || q.includes('heartburn')) {
    return [
      'Yes — Sour/Bitter Acid Rises to Throat on Lying Flat After Dinner (Urdhwaga Amlapitta)',
      'Marked Retrosternal & Epigastric Burning Relieved by Cold Milk / Shatavari',
      'Triggered by Spicy, Fermented, Deep-Fried, or Late-Night Meals',
      'Mild Sour Belching Without Postural Regurgitation',
    ];
  }

  // 30. Post-meal fullness / Avipaka / Early satiety / Dyspepsia
  if (q.includes('avipaka') || q.includes('guruta') || q.includes('fullness') || q.includes('small meal') || q.includes('bloating')) {
    return [
      'Yes — Epigastric Heaviness & Bloating Persisting 3–4 Hours Post-Meal (Mandagni)',
      'Early Satiety with Sour Eructations & Nausea',
      'Relieved by Warm Ginger-Jeeraka Water or Passing Flatus',
      'Normal Timely Digestion Without Bloating',
    ];
  }

  // 31. Duodenal vs Gastric Ulcer (1–3 AM nocturnal hunger pain / Parinamashoola / NSAID / H. pylori)
  if (q.includes('2 am') || q.includes('1 am and 3 am') || q.includes('wake you up') || q.includes('2–3 hours after') || q.includes('2-3 hours after') || q.includes('parinama') || q.includes('biscuit')) {
    return [
      'Yes — Gnawing Pain Peaks 2–3 Hrs After Meals / 2 AM & Relieved by Food/Milk (Parinamashoola / Duodenal Ulcer)',
      'Pain Worsens Immediately After Eating Food (Annadravashoola / Gastric Ulcer)',
      'Continuous Epigastric Burning Unrelated to Meal Timing (Amlapitta)',
      'No Nocturnal Pain Awakening',
    ];
  }

  if (q.includes('nsaid') || q.includes('painkiller') || q.includes('helicobacter') || q.includes('h. pylori')) {
    return [
      'Yes — History of Frequent NSAID / Painkiller Use on Empty Stomach',
      'Positive Rapid Urease Test / Stool Antigen for H. pylori',
      'High Tea/Coffee & Spicy Irregular Meal Schedule (No NSAID Use)',
      'No History of NSAID Use or Known H. pylori',
    ];
  }

  // 32. Pinworm / Perianal itching / Intestinal worms (Krumi Roga)
  if (q.includes('pinworm') || q.includes('enterobius') || q.includes('roundworm') || q.includes('ribbon-like') || (q.includes('anus') && q.includes('night') && q.includes('itch'))) {
    return [
      'Yes — Intense Nocturnal Perianal Itching (Guda Kandu) & Teeth Grinding in Sleep (Purishaja Krumi)',
      'Visible Thread-Like Pinworms or Roundworm Passed in Stool',
      'Periumbilical Colicky Pain with Craving for Sweets/Sour Foods',
      'No Visible Worms Passed — Stool Ova/Cyst Test Advised',
    ];
  }

  // 33. Melena / Anorectal bleeding / Piles / Fissure / Fistula / Stool pattern
  if (q.includes('melena') || q.includes('pitch-black') || q.includes('tarry')) {
    return [
      'No Black Tarry Stools (Normal Stool Color — No Upper GI Bleed)',
      'Yes — Dark Black Tarry Stool Episode (Melena — Urgent Endoscopy Indicated)',
      'Occasional Fresh Bright Red Streaks on Hard Stool Only (Lower GI / Arsha)',
    ];
  }

  if (q.includes('clay-colored') || q.includes('chalky white') || q.includes('stercobilin')) {
    return [
      'Yes — Pale Chalky Clay-Colored Stools (Tilapishtanibha — Ruddhapatha / Obstructive Kamala)',
      'No — Stools Are Normal Yellow-Brown or Dark (Bahupitta / Hepatocellular Kamala)',
      'Associated with Intense Generalized Skin Itching & Dark Mustard-Oil Urine',
    ];
  }

  if (q.includes('bright red') || q.includes('cutting pain') || q.includes('pile') || q.includes('fissure') || q.includes('defecation') || q.includes('stool')) {
    return [
      'Alternating Loose Mucoid & Constipated Stools (Muhur-baddha Muhur-drava — Grahani)',
      'Painless Bright Red Blood Drops After Stool (Raktarsha / Internal Piles)',
      'Severe Cutting/Burning Pain at 6 O’Clock Position Lasting Hours Post-Stool (Parikartika / Fissure)',
      'Hard Dry Scybalous Stools Passed Every 2–3 Days (Krura Kostha / Vibandha)',
    ];
  }

  // --- D. FEVER, RESPIRATORY, ENT & OPHTHALMOLOGY QUESTIONS ---
  // 34. Malaria periodic stages / Fever pattern (Jwara / Vishama Jwara)
  if (q.includes('cold shivering stage') || q.includes('tritiyaka') || q.includes('chaturthaka') || q.includes('alternate day')) {
    return [
      'Yes — Classic 3-Stage Paroxysm: Shivering Rigor (1h) → High Fever (4h) → Profuse Sweating (Vishama Jwara)',
      'Spikes Every Alternate Day (48-Hr Cycle — Tritiyaka / P. vivax Pattern)',
      'Daily Evening/Night Fever Spike (Anyedyushka)',
      'Continuous Unremitting Fever Without Rigor Stages (Santata / Taruna Jwara)',
    ];
  }

  if (q.includes('chronic cough >2 weeks') || q.includes('drenching night sweats') || q.includes('coughed up frank blood') || q.includes('blood-streaked sputum')) {
    return [
      'Yes — Cough > 3 Weeks + Evening Temperature Rise, Night Sweats & Weight Loss (Rajayakshma)',
      'Occasional Blood-Streaked Mucopurulent Sputum (Raktashthivana)',
      'Mucoid White Sputum Without Fever or Night Sweats (Kaphaja Kasa)',
      'Dry Irritative Cough Without Hemoptysis (Vataja Kasa)',
    ];
  }

  // 35. Allergic Rhinitis / Sinusitis (Pratishyaya)
  if (q.includes('sneezing') || q.includes('nasal discharge') || q.includes('maxillary or frontal sinus')) {
    return [
      'Paroxysmal Morning Sneezing Bouts (10–20+) on Exposure to Dust/Cold Wind (Vataja Pratishyaya)',
      'Thin Watery Nasal Discharge with Nasal Itching & Blockage (Allergic Rhinitis)',
      'Thick Yellowish-Green Mucopurulent Discharge + Frontal/Maxillary Sinus Tenderness (Pakwa / Sinusitis)',
      'Relieved by Steam Inhalation & Anu Taila Nasya',
    ];
  }

  // 36. Cataract / Vision loss / Colored halos (Netra Roga / Timira)
  if (q.includes('vision loss') || q.includes('second sight') || q.includes('pupillary aperture') || q.includes('greyish-white opacity') || q.includes('eye redness')) {
    return [
      'Gradual Painless Progressive Blurring of Distant Vision + Night Glare (Timira / Senile Cataract)',
      'Greyish-White Lenticular Opacity Visible in Pupil with Normal Intraocular Pressure',
      'Temporary Improvement in Near Reading Vision ("Second Sight" of Nuclear Sclerosis)',
      'No Acute Eye Redness, Pain, or Colored Halos (Glaucoma Ruled Out)',
    ];
  }

  // 37. Bronchial Asthma / Tripod position / Exertional Angina
  if (q.includes('tripod position') || q.includes('2 am - 4 am') || q.includes('cold air and allergen') || q.includes('suffocated if lying down')) {
    return [
      'Yes — Nocturnal/Early Morning (2–4 AM) Wheezing Attacks Aggravated by Cold Wind & Clouds (Tamaka Shwasa)',
      'Patient Sits Upright Leaning Forward (Asino Labhate Saukhyam); Relief After Expectorating Sticky Mucus',
      'Triggered by Dust, Pollen, Cold Drinks, or Curd at Night',
      'Exertional Breathlessness Only Without Wheezing',
    ];
  }

  if (q.includes('uphill') || q.includes('left arm') || q.includes('jaw') || q.includes('angina')) {
    return [
      'No — Burning Is Strictly Post-Meal & Positional, Not Exertional (GI Origin Confirmed)',
      'Yes — Heavy Retrosternal Tightness on Walking Uphill, Relieved by 5 Mins Rest (Urgent Cardiac Workup)',
      'No Radiation to Left Arm, Shoulder, or Jaw',
    ];
  }

  // --- E. DERMATOLOGY & HAIR QUESTIONS ---
  // 38. Alopecia Areata / Hair loss / Dandruff (Khalitya / Indralupta)
  if (q.includes('coin-shaped') || q.includes('alopecia') || q.includes('scalp scaling') || q.includes('bitemporal') || q.includes('central parting')) {
    return [
      'Smooth Coin-Shaped Patchy Hair Loss Without Scarring (Indralupta / Alopecia Areata)',
      'Diffuse Hair Thinning with Greasy White Scalp Dandruff & Itching (Darunaka + Khalitya)',
      'Bitemporal/Vertex Pattern Thinning (Male) or Central Parting Widening (Female Androgenetic)',
      'Post-Febrile / Nutritional Telogen Hair Shedding',
    ];
  }

  // 39. Psoriasis / Auspitz sign / Extensor plaques (Kitibha / Ekakushtha)
  if (q.includes('auspitz') || q.includes('extensor surface') || q.includes('nail') || q.includes('silvery')) {
    return [
      'Yes — Thick Erythematous Plaques with Silvery Scales & Positive Auspitz Sign (Ekakushtha / Kitibha)',
      'Distributed Over Elbows, Knees, Scalp & Lower Back with Nail Pitting',
      'Winter Aggravation with Intense Dryness & Scaling',
      'Annular Ring Border with Central Clearing Instead (Dadru / Tinea)',
    ];
  }

  // 40. Acne Vulgaris / Mukhadushika
  if (q.includes('comedones') || q.includes('blackheads') || q.includes('forehead, cheeks, jawline') || q.includes('premenstrually')) {
    return [
      'Inflammatory Papules, Pustules & Comedones Over Cheeks, Forehead & Chin (Kapha-Vata-Rakta Mukhadushika)',
      'Deep Tender Nodulocystic Lesions Leaving Post-Inflammatory Hyperpigmentation',
      'Premenstrual Flare with Oily Seborrhea & Mild Chin Hirsutism (Screen for PCOS)',
      'Mild Comedonal Acne Aggravated by Oily/High-Glycemic Diet',
    ];
  }

  // 41. Urticaria / Hives / Angioedema (Sheetapitta)
  if (q.includes('wheals') || q.includes('fade within 24 hours') || q.includes('angioedema') || q.includes('sheetala maruta') || q.includes('insect sting')) {
    return [
      'Yes — Evanescent Itchy Red Wheals (Varati-Damshavat) Fading Within < 24 Hours (Sheetapitta)',
      'Triggered by Cold Wind Exposure, Cold Water Bath, or Specific Food Allergen',
      'No Lip/Tongue Swelling or Stridor (No Anaphylaxis / Angioedema)',
      'Mild Periorbital or Lip Puffiness Accompanying Hives',
    ];
  }

  // 42. Vitiligo / Leukoderma / Leprosy sensation rule-out (Shwitra)
  if (q.includes('devoid of melanin') || q.includes('pinprick intact') || q.includes('hansen') || q.includes('leprosy') || q.includes('acrofacial')) {
    return [
      'Chalky-White Depigmented Macules Without Scaling or Itching (Shwitra / Vitiligo)',
      'Touch, Pain & Temperature Sensation 100% Intact; No Nerve Thickening (Leprosy Ruled Out)',
      'Symmetrical Acrofacial / Periorificial Distribution with White Hairs (Leukotrichia)',
      'Faint Hypopigmented Scaly Patch on Upper Trunk (Sidhma / Tinea Versicolor)',
    ];
  }

  // 43. Eczema / Flexural oozing / Atopy (Vicharchika)
  if (q.includes('lichenification') || q.includes('flexural creases') || q.includes('popliteal') || q.includes('atopic diathesis')) {
    return [
      'Intensely Itchy, Darkened, Lichenified Patches in Popliteal/Antecubital Flexures (Vicharchika)',
      'Acute Weeping/Serous Oozing (Bahu-Srava) After Scratching',
      'Positive Personal/Family History of Allergic Rhinitis or Asthma (Atopy)',
      'Dry Hyperkeratotic Eczema Over Hands/Ankles',
    ];
  }

  // 44. Visarpa / Erysipelas / Herpes Zoster / Jalaukavacharana
  if (q.includes('erysipelas') || q.includes('herpes zoster') || q.includes('dermatomal nerve band') || q.includes('jalaukavacharana')) {
    return [
      'Clustered Burning Vesicles Along Unilateral Thoracic/Facial Dermatome (Kaksha / Herpes Zoster)',
      'Rapidly Spreading Fiery-Red Tender Plaque with Sharp Border & Fever (Pittaja Visarpa / Erysipelas)',
      'Yes — Severe Localized Rakta-Pitta Burning Ideal for Jalaukavacharana & Shatadhauta Ghrita',
      'Localized Follicular Furuncle Without Rapid Spreading',
    ];
  }

  // --- F. UROLOGY, GYNECOLOGY, METABOLIC & NEURO-PSYCH QUESTIONS ---
  // 45. Bleeding disorders / Epistaxis / Purpura (Raktapitta)
  if (q.includes('upper orifices') || q.includes('lower orifices') || q.includes('petechiae') || q.includes('ushna, tikshna')) {
    return [
      'Bleeding from Upper Orifices — Nasal Epistaxis / Gingival Bleed (Urdhwaga Raktapitta — Virechana Indicated)',
      'Bleeding from Lower Orifices — Rectal / Urinary (Adhoga Raktapitta)',
      'History of Excessive Hot, Spicy, Sour & Sun-Exposed Pitta-Prakopa Nidana',
      'Cutaneous Petechiae / Easy Bruising — Platelet Count & Coagulation Profile Ordered',
    ];
  }

  // 46. Edema / Anasarca (Shotha)
  if (q.includes('eyelids and face in the morning') || q.includes('orthopnea') || q.includes('jugular venous')) {
    return [
      'Starts as Morning Periorbital/Facial Puffiness (Vrikkaja / Renal Shotha)',
      'Bilateral Pitting Pedal/Ankle Edema Worse in Evening (Kaphaja / Venous-Cardiac Shotha)',
      'No Orthopnea, Raised JVP, or Basal Crepitations',
      'Associated with Pallor & Hepatic Dysfunction (Pandu-Janya Shotha)',
    ];
  }

  // 47. Obesity / BMI / Sleep Apnea (Medoroga / Sthaulya)
  if (q.includes('bmi') || q.includes('waist-to-hip') || q.includes('sleep apnea') || q.includes('snoring') || q.includes('cushing')) {
    return [
      'BMI 31.5 kg/m² with Central Abdominal Adiposity (Waist-Hip Ratio > 0.95 — Medoroga)',
      'Excessive Appetite (Tikshnagni), Profuse Sweating & Exertional Breathlessness',
      'Loud Nocturnal Snoring with Daytime Drowsiness (Kapha-Medo Avarana)',
      'Associated Subclinical Hypothyroidism (TSH 6.8 mIU/L) / Dyslipidemia',
    ];
  }

  // 48. Erectile Dysfunction (Klaibya)
  if (q.includes('spontaneous erections') || q.includes('psychogenic etiology') || q.includes('arteriogenic')) {
    return [
      'Morning/Nocturnal Tumescence Intact — Performance Anxiety & Stress Dominant (Manasika Klaibya)',
      'Gradual Reduction in Both Morning & Coital Rigidity (Dhatukshayaja / Vascular Klaibya)',
      'History of Diabetes / Hypertension / Smoking Contributing to Endothelial Dysfunction',
      'Premature Ejaculation (Shukra-gata Vata) as Primary Complaint',
    ];
  }

  // 49. Leukorrhea / Vaginitis / Menstrual Disorders (Pradara / Asrigdara / Kashtartava)
  if (q.includes('curd-like') || q.includes('trichomoniasis') || q.includes('fishy odor') || q.includes('post-coital') || q.includes('speculum')) {
    return [
      'Thick White Curd-Like Discharge with Vulvar Pruritus (Kaphaja Yonivyapad / Candidal)',
      'Mucoid White Non-Offensive Discharge with Low Backache & Fatigue (Shweta Pradara)',
      'Yellowish Frothy or Malodorous Discharge with Burning (Pittaja / Infective Vaginitis)',
      'No Post-Coital Bleeding; Healthy Cervix on Speculum Exam',
    ];
  }

  if (q.includes('menstru') || q.includes('cycle') || q.includes('clot') || q.includes('cramp') || q.includes('dysmenorrhea')) {
    return [
      'Heavy Prolonged Bleeding > 7 Days with Dark Clots & Pallor (Asrigdara)',
      'Delayed Scanty Cycles (40–60 Days) with Weight Gain & Hirsutism (Artavakshaya / PCOS)',
      'Severe Spasmodic Lower Abdominal Pain on Day 1–2 Relieved After Flow Starts (Udavartini)',
      'Regular 28-Day Cycles',
    ];
  }

  // 50. Migraine / Suryavarta / Headache
  if (q.includes('rising sun') || q.includes('suryavarta') || q.includes('thunderclap') || q.includes('unilateral') || q.includes('photophobia')) {
    return [
      'Starts at Sunrise, Peaks at Noon & Subsides by Evening (Classic Suryavarta)',
      'Unilateral Pulsating Hemicranial Headache with Nausea & Photophobia (Ardhavabhedaka / Migraine)',
      'No Red Flags (No Thunderclap Onset, Fever, Neck Stiffness, or Focal Deficit)',
      'Relieved by Rest in Dark Quiet Room & Shadbindu / Anu Taila Nasya',
    ];
  }

  // 51. Alcohol Withdrawal (Madatyaya) & Psychosis (Unmada)
  if (q.includes('last drink') || q.includes('ciwa') || q.includes('delirium tremens') || q.includes('wernicke') || q.includes('thiamine')) {
    return [
      'Last Alcohol Intake 24–48 Hrs Ago; Fine Hand Tremors, Sweating & Insomnia Present',
      'No Visual/Tactile Hallucinations or Seizures (Uncomplicated Vata-Pittaja Madatyaya)',
      'Severe Agitation & Autonomic Tachycardia (Requires Thiamine + Supervised Detox)',
      'Chronic Daily Intake Seeking De-Addiction & Hepatoprotection (Kharjuradi Mantha)',
    ];
  }

  if (q.includes('auditory hallucinations') || q.includes('persecutory delusions') || q.includes('flight of ideas') || q.includes('grandiose')) {
    return [
      'Severe Insomnia, Restlessness, Pressured Speech & Irritability (Vata-Pittaja Unmada)',
      'Social Withdrawal, Low Mood, Anorexia & Psychomotor Retardation (Kaphaja Unmada)',
      'Acute Stress-Induced Anxiety, Racing Thoughts & Palpitations (Chittodvega)',
      'Organic / Substance-Induced Encephalopathy Ruled Out',
    ];
  }

  // 52. Urinary Tract Infection / Dysuria / Renal Calculus (Mutrakrichhra / Ashmari)
  if (q.includes('scalding burning') || q.includes('renal angle tenderness') || q.includes('pyelonephritis') || q.includes('hesitancy')) {
    if (q.includes('hesitancy') || q.includes('residual urine') || q.includes('elderly male')) {
      return [
        'Yes — Terminal Dribbling, Weak Stream, Hesitancy & Nocturia 3–4x/Night (Vatashthila / BPH)',
        'Sense of Incomplete Bladder Emptying Without Acute Fever',
        'Prior Episode of Acute Urinary Retention',
        'No Hesitancy — Only Acute Burning Micturition',
      ];
    }
    return [
      'Severe Scalding Burning Micturition with Increased Frequency (Pittaja Mutrakrichhra / Lower UTI)',
      'Afebrile with No Flank Pain or Renal Angle Tenderness (Uncomplicated Cystitis)',
      'Colicky Loin-to-Groin Pain with Hematuria (Mutrashmari / Ureteric Calculus)',
      'High Fever with Rigors & Flank Tenderness (Suspect Acute Pyelonephritis)',
    ];
  }

  // 53. Genital Ulcers (Upadansha / Firanga)
  if (q.includes('chancre') || q.includes('genital ulcer') || q.includes('crops of painful vesicles')) {
    return [
      'Multiple Painful Shallow Vesicular Erosions with Burning (Pittaja Upadansha / Herpes)',
      'Single Painless Indurated Ulcer with Firm Base (Firanga / Primary Chancre)',
      'Associated Tender Inguinal Lymphadenopathy',
      'Superficial Non-Ulcerative Balanoposthitis Only',
    ];
  }

  // 54. General / Custom Clinical Fallback Questions (Temporal onset, Diurnal Dosha Kala, Agni/Kostha, Red Flags)
  if (q.includes('temporal sequence') || q.includes('first onset') || q.includes('how long')) {
    return [
      'Gradual Onset Over 2–3 Months Following Dietary/Lifestyle Indiscretion',
      'Acute Sudden Onset Within Past 3–7 Days (Nava / Taruna Avastha)',
      'Chronic Relapsing-Remitting Course (> 1 Year — Jirna Vyadhi)',
      'Triggered After Seasonal Transition (Ritu-Sandhi) or Stress',
    ];
  }

  if (q.includes('hours of the day') || q.includes('vata kala') || q.includes('pitta kala') || q.includes('kapha kala')) {
    return [
      'Worse in Late Afternoon (2–6 PM) & Pre-Dawn (2–6 AM — Vata Kala)',
      'Worse at Midday (10 AM–2 PM) & Midnight (10 PM–2 AM — Pitta Kala)',
      'Worse in Early Morning (6–10 AM) & Post-Dinner (6–10 PM — Kapha Kala)',
      'Worse Immediately After Meals (Adhyashana / Mandagni)',
    ];
  }

  if (q.includes('heat or cold application') || q.includes('alleviate the discomfort')) {
    return [
      'Warm Application (Ushna Upashaya) Relieves; Cold Exposure Aggravates (Vata-Kapha)',
      'Cool Application (Sheeta Upashaya) Relieves; Heat/Sun Aggravates (Pitta-Rakta)',
      'Dry Heat (Ruksha Sweda) Relieves; Oily Application Aggravates (Sama Stage)',
      'Warm Oil Massage (Snigdha Upashaya) Gives Best Relief (Nirama Vata)',
    ];
  }

  if (q.includes('jatharagni') || q.includes('kostha') || q.includes('bowel regularity')) {
    return [
      'Mandagni (Low Appetite) + Sama Coated Tongue + Sluggish Bowels',
      'Vishamagni (Erratic Appetite) + Krura Kostha (Hard Dry Constipated Stools)',
      'Tikshnagni (Intense Hunger/Burning) + Mridu Kostha (Loose Frequent Stools)',
      'Samagni (Balanced Appetite) & Regular Morning Bowel Evacuation',
    ];
  }

  if (q.includes('red-flag') || q.includes('unintended weight loss') || q.includes('nocturnal sweats')) {
    return [
      'No Red Flags — Stable Weight, Afebrile & Normal Vital Signs',
      'Mild Unintended Weight Loss & Fatigue Over Past 2 Months',
      'Low-Grade Evening Fever with Night Sweats Present',
      'Severe Unremitting Pain Requiring Priority Imaging',
    ];
  }

  // Default fallback for any custom question
  return [
    'Yes — Clearly Present & Clinically Significant',
    'No — Absent / Ruled Out on Examination',
    'Mild / Intermittent Presentation',
    'Worse with Cold / Dry Exposure (Vata-Kapha Dominance)',
    'Worse with Hot / Spicy Intake (Pitta-Rakta Dominance)',
  ];
}
