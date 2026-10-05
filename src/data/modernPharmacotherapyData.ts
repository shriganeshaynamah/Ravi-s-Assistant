export interface ModernDrugItem {
  drugClass: string;
  genericName: string;
  standardRegimen: string;
  cautionOrMonitoring: string;
  reference?: string;
}

export interface ModernDiseasePharmacology {
  pathophysiologySummary: string;
  pharmacotherapyStandard: ModernDrugItem[];
  textbookReferences: string[];
}

function getBaseModernPharmacologyForDisease(
  diseaseName: string,
  symptoms: string = ''
): ModernDiseasePharmacology {
  const q = `${diseaseName} ${symptoms}`.toLowerCase();

  // 1. VATARAKTA / GOUT
  if (q.includes('vatarakta') || q.includes('gout') || q.includes('uric acid') || q.includes('podagra')) {
    return {
      pathophysiologySummary:
        'Supersaturation of extracellular urate (>6.8 mg/dL) leads to monosodium urate (MSU) crystal deposition in synovium, triggering NLRP3 inflammasome activation, IL-1β release, and acute neutrophilic synovitis.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Acute Flare Anti-Inflammatory (Microtubule Inhibitor)',
          genericName: 'Tab. Colchicine',
          standardRegimen: '1.2 mg stat orally at flare onset, followed by 0.6 mg 1 hour later; then 0.6 mg OD/BD for flare prophylaxis',
          cautionOrMonitoring: 'Monitor for GI diarrhea; reduce dose in renal impairment (eGFR < 30 mL/min) and avoid strong CYP3A4/P-gp inhibitors (Harrison’s 21e / Katzung 15e)',
        },
        {
          drugClass: 'First-Line Urate-Lowering Therapy (Xanthine Oxidase Inhibitor)',
          genericName: 'Tab. Febuxostat / Tab. Allopurinol',
          standardRegimen: 'Febuxostat 40 mg–80 mg OD after breakfast OR Allopurinol 100 mg OD titrated up to 300 mg/day (Target Serum Uric Acid < 6.0 mg/dL)',
          cautionOrMonitoring: 'Do not initiate during acute flare without Colchicine/NSAID cover; monitor LFTs and screen HLA-B*5801 before Allopurinol',
        },
        {
          drugClass: 'Acute Flare NSAID Analgesic',
          genericName: 'Tab. Indomethacin / Tab. Etoricoxib',
          standardRegimen: 'Indomethacin 50 mg TDS for 3–5 days OR Etoricoxib 90 mg–120 mg OD for 5 days after meals',
          cautionOrMonitoring: 'Contraindicated in active peptic ulcer, CKD, and uncontrolled hypertension; co-prescribe PPI gastroprotection',
        },
        {
          drugClass: 'Urinary Alkalinizer (Uric Acid Calculi Prevention)',
          genericName: 'Syrup Potassium Citrate + Citric Acid',
          standardRegimen: '10 mL–15 mL diluted in 1 glass of water TDS after meals',
          cautionOrMonitoring: 'Maintains urine pH between 6.5 and 7.0 to prevent urate nephrolithiasis; monitor serum potassium in renal disease',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 372: Gout and Other Crystal-Associated Arthropathies",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 15: Drugs for Gout",
        "Katzung's Basic & Clinical Pharmacology 15th Edition - Ch. 36: NSAIDs, DMARDs & Drugs Used in Gout",
      ],
    };
  }

  // 2. GRIDHRASI / SCIATICA / LUMBAR RADICULOPATHY
  if (q.includes('gridhrasi') || q.includes('sciatica') || q.includes('radiculopathy') || q.includes('slipped disc') || q.includes('slr')) {
    return {
      pathophysiologySummary:
        'Mechanical compression and chemical inflammation of L4–S1 nerve roots due to intervertebral disc herniation (nucleus pulposus extrusion) or foraminal stenosis causing ectopic nociceptive firing along the sciatic nerve.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Neuropathic Pain Modulator (α2δ Calcium Channel Ligand)',
          genericName: 'Cap. Pregabalin / Tab. Gabapentin',
          standardRegimen: 'Pregabalin 75 mg HS at bedtime for 5 days, titrated to 75 mg BD (or Gabapentin 300 mg HS to TDS)',
          cautionOrMonitoring: 'Causes sedation and dizziness initially; taper gradually over 1 week before discontinuation; adjust dose in renal insufficiency',
        },
        {
          drugClass: 'Selective COX-2 Inhibitor / NSAID Analgesic',
          genericName: 'Tab. Aceclofenac 100 mg + Thiocolchicoside 4 mg (or Tab. Etoricoxib 90 mg)',
          standardRegimen: '1 tablet BD after meals for 5–7 days during acute radicular pain and paraspinal spasm',
          cautionOrMonitoring: 'Avoid prolonged NSAID use >7–10 days; monitor renal function and epigastric tolerance',
        },
        {
          drugClass: 'Neurotropic Myelin Repair Vitamin Complex',
          genericName: 'Tab. Methylcobalamin 1500 mcg + Alpha Lipoic Acid 100 mg + Pyridoxine + Folic Acid',
          standardRegimen: '1 tablet OD after lunch for 4–8 weeks',
          cautionOrMonitoring: 'Supports axonal regeneration and remyelination of compressed lumbosacral nerve roots',
        },
        {
          drugClass: 'Short-Course Oral Corticosteroid (Severe Acute Radiculitis)',
          genericName: 'Tab. Methylprednisolone (Medrol Dose Pack / Tapering)',
          standardRegimen: '16 mg daily for 3 days, then 8 mg for 3 days, then 4 mg for 3 days after breakfast',
          cautionOrMonitoring: 'Reduces perineural nerve root edema; monitor blood glucose in diabetics',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 19: Back and Neck Pain",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Gabapentinoids & Skeletal Muscle Relaxants",
        "Adams and Victor's Principles of Neurology 11th Edition - Disorders of the Spinal Cord and Nerve Roots",
      ],
    };
  }

  // 3. MANYASTAMBHA / CERVICAL SPONDYLOSIS
  if (q.includes('manyastambha') || q.includes('cervical') || q.includes('neck pain')) {
    return {
      pathophysiologySummary:
        'Degenerative cervical disc desiccation, uncinate process osteophytosis, and facet joint arthropathy (C5–C7) producing axial neck stiffness, trapezius spasm, and C6/C7 cervical radiculopathy.',
      pharmacotherapyStandard: [
        {
          drugClass: 'NSAID + Central Muscle Relaxant Combination',
          genericName: 'Tab. Aceclofenac 100 mg + Tizanidine 2 mg (or Chlorzoxazone 250 mg)',
          standardRegimen: '1 tablet BD after meals for 5–7 days',
          cautionOrMonitoring: 'Tizanidine may cause drowsiness, dry mouth, and mild hypotension; avoid driving after dose',
        },
        {
          drugClass: 'Neuropathic Analgesic + Neurotropic',
          genericName: 'Tab. Nortriptyline 10 mg + Pregabalin 75 mg + Methylcobalamin 1500 mcg',
          standardRegimen: '1 tablet HS at bedtime for 2–4 weeks if brachial radiculopathy/tingling is present',
          cautionOrMonitoring: 'Monitor for daytime somnolence and anticholinergic effects',
        },
        {
          drugClass: 'Topical Analgesic Counter-Irritant Gel',
          genericName: 'Diclofenac Diethylamine 1.16% + Methyl Salicylate + Menthol Gel',
          standardRegimen: 'Apply gently over posterior cervical spine and trapezius 3 times daily',
          cautionOrMonitoring: 'Avoid application on broken skin; combine with isometric neck exercises after acute pain subsides',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 19: Cervical Spondylosis & Radiculopathy",
        "Apley & Solomon's System of Orthopaedics and Trauma 10th Edition - Cervical Spine Disorders",
      ],
    };
  }

  // 4. KATIGRAHA / LOW BACK PAIN / LUMBAR SPRAIN
  if (q.includes('katigraha') || q.includes('low back') || q.includes('lumbago') || q.includes('lumbar')) {
    return {
      pathophysiologySummary:
        'Mechanical strain of lumbosacral paraspinal muscles/ligaments or lumbar facet joint arthropathy and intervertebral disc degeneration causing nociceptive lower back pain and protective muscle spasm.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line NSAID Analgesic',
          genericName: 'Tab. Etoricoxib 60 mg / Tab. Naproxen 500 mg',
          standardRegimen: 'Etoricoxib 60 mg–90 mg OD after breakfast OR Naproxen 500 mg BD after meals for 5–7 days',
          cautionOrMonitoring: 'Co-administer Pantoprazole 40 mg OD in patients with gastric sensitivity; monitor BP and renal function',
        },
        {
          drugClass: 'Centrally Acting Skeletal Muscle Relaxant',
          genericName: 'Tab. Tolperisone 150 mg (or Tab. Baclofen 10 mg)',
          standardRegimen: 'Tolperisone 150 mg TDS after meals for 5–7 days',
          cautionOrMonitoring: 'Relieves paraspinal muscle spasm without heavy sedation; take with food to maximize bioavailability',
        },
        {
          drugClass: 'Bone Mineral & Vitamin D3 Supplementation',
          genericName: 'Cap. Cholecalciferol (Vitamin D3) 60,000 IU + Tab. Calcium Citrate Malate 500 mg',
          standardRegimen: 'Vitamin D3 60,000 IU once weekly for 8 weeks with milk; Calcium 500 mg OD after dinner',
          cautionOrMonitoring: 'Corrects underlying osteomalacia/osteopenia contributing to chronic mechanical backache',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 19: Acute and Chronic Low Back Pain",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - NSAIDs & Skeletal Muscle Relaxants",
      ],
    };
  }

  // 5. PRAMEHA / MADHUMEHA / DIABETES MELLITUS
  if (q.includes('prameha') || q.includes('madhumeha') || q.includes('diabet') || q.includes('hyperglycemia') || q.includes('hba1c')) {
    return {
      pathophysiologySummary:
        'Progressive pancreatic β-cell secretory defect combined with peripheral insulin resistance in skeletal muscle, adipose tissue, and liver (increased hepatic gluconeogenesis) leading to chronic hyperglycemia and microvascular complications.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Biguanide (AMPK Activator / Insulin Sensitizer)',
          genericName: 'Tab. Metformin Hydrochloride (Sustained Release)',
          standardRegimen: '500 mg OD/BD with meals, titrated gradually up to 1000 mg BD (Max 2000 mg/day)',
          cautionOrMonitoring: 'Contraindicated if eGFR < 30 mL/min (lactic acidosis risk); monitor Vitamin B12 levels annually (ADA / Harrison’s 21e)',
        },
        {
          drugClass: 'SGLT-2 Inhibitor (Cardio-Renal Protective Glucosuric)',
          genericName: 'Tab. Dapagliflozin 10 mg / Tab. Empagliflozin 10 mg–25 mg',
          standardRegimen: '10 mg orally once daily in the morning (with or without food)',
          cautionOrMonitoring: 'Ensure adequate hydration; counsel on genital mycotic hygiene; reduces heart failure hospitalization and slows CKD progression',
        },
        {
          drugClass: 'DPP-4 Inhibitor (Incretin Enhancer)',
          genericName: 'Tab. Sitagliptin 100 mg / Tab. Teneligliptin 20 mg / Tab. Vildagliptin 50 mg',
          standardRegimen: 'Sitagliptin 100 mg OD (or Vildagliptin 50 mg BD) before meals',
          cautionOrMonitoring: 'Weight-neutral with minimal hypoglycemia risk; adjust Sitagliptin dose if eGFR < 45 mL/min',
        },
        {
          drugClass: 'Second-Generation Sulfonylurea (Insulin Secretagogue — if HbA1c remains >8%)',
          genericName: 'Tab. Glimepiride',
          standardRegimen: '1 mg–2 mg OD 15 minutes before breakfast',
          cautionOrMonitoring: 'Educate patient on hypoglycemia symptoms (sweating, tremors) and carrying glucose sachets',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 404: Diabetes Mellitus: Management and Therapies",
        "American Diabetes Association (ADA) Standards of Care in Diabetes 2024",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 19: Insulin and Oral Antidiabetic Drugs",
      ],
    };
  }

  // 6. KUSHTHA / PSORIASIS / ECZEMA / VICHARCHIKA / DADRU
  if (q.includes('kushtha') || q.includes('psoriasis') || q.includes('eczema') || q.includes('vicharchika') || q.includes('dadru') || q.includes('tinea') || q.includes('dermatitis')) {
    return {
      pathophysiologySummary:
        'In Psoriasis (Ekakushtha): Th1/Th17-mediated epidermal keratinocyte hyperproliferation (transit time reduced from 28 days to 3–5 days). In Dadru (Tinea): Dermatophyte keratinase invasion of stratum corneum. In Eczema (Vicharchika): IgE/Th2-driven epidermal barrier spongiosis.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Topical Corticosteroid + Keratolytic (For Psoriasis / Eczema Plaques)',
          genericName: 'Ointment Clobetasol Propionate 0.05% + Salicylic Acid 3% (or Mometasone Furoate 0.1%)',
          standardRegimen: 'Apply a thin film over hyperkeratotic plaques BD for 2 weeks, then taper to weekend pulse therapy',
          cautionOrMonitoring: 'Do NOT apply potent steroids on face, axilla, or groin; avoid abrupt withdrawal to prevent pustular rebound',
        },
        {
          drugClass: 'Systemic / Topical Antifungal (Specifically if KOH Positive for Dadru / Tinea Corporis)',
          genericName: 'Cap. Itraconazole 100 mg–200 mg + Cream Luliconazole 1% (or Terbinafine 250 mg)',
          standardRegimen: 'Itraconazole 100 mg BD after full meal for 2–4 weeks + Luliconazole 1% cream applied 2 cm beyond lesion margin OD',
          cautionOrMonitoring: 'Strictly avoid steroid creams in fungal Tinea (prevents Tinea Incognito); monitor baseline LFT with Itraconazole',
        },
        {
          drugClass: 'Second-Generation Non-Sedating H1 Antihistamine (Antipruritic)',
          genericName: 'Tab. Levocetirizine 5 mg / Tab. Bilastine 20 mg / Tab. Hydroxyzine 25 mg (for nocturnal itch)',
          standardRegimen: 'Bilastine 20 mg OD on empty stomach OR Levocetirizine 5 mg HS at bedtime',
          cautionOrMonitoring: 'Breaks the itch-scratch cycle and prevents secondary bacterial impetiginization',
        },
        {
          drugClass: 'Barrier-Repair Ceramide Emollient',
          genericName: 'White Soft Paraffin + Liquid Paraffin + Ceramide Moisturizing Lotion',
          standardRegimen: 'Apply liberally within 3 minutes after bathing on damp skin 2–3 times daily',
          cautionOrMonitoring: 'Restores stratum corneum lipid barrier and reduces transepidermal water loss (TEWL)',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 57: Eczema, Psoriasis, Cutaneous Infections",
        "Rook's Textbook of Dermatology 9th Edition - Papulosquamous and Eczematous Dermatoses",
        "IADVL Textbook of Dermatology 5th Edition - Management of Dermatophytosis & Psoriasis",
      ],
    };
  }

  // 7. GRAHANI / IBS / CHRONIC COLITIS / MALABSORPTION
  if (q.includes('grahani') || q.includes('ibs') || q.includes('irritable bowel') || q.includes('malabsorption') || q.includes('colitis')) {
    return {
      pathophysiologySummary:
        'Disordered gut-brain axis signaling, visceral hypersensitivity, altered intestinal motility, post-infectious mucosal low-grade inflammation, and gut microbiome dysbiosis (Rome IV Criteria).',
      pharmacotherapyStandard: [
        {
          drugClass: 'Gut-Selective Luminal Antibiotic (For IBS-D / SIBO)',
          genericName: 'Tab. Rifaximin',
          standardRegimen: '400 mg–550 mg orally TDS for 14 days',
          cautionOrMonitoring: 'Non-absorbable (<0.4% systemic absorption); eradicates small intestinal bacterial overgrowth (SIBO) and reduces bloating/diarrhea',
        },
        {
          drugClass: 'Direct Smooth Muscle Antispasmodic (Anticholinergic-free)',
          genericName: 'Tab. Mebeverine Hydrochloride 135 mg (or Tab. Drotaverine 80 mg)',
          standardRegimen: 'Mebeverine 135 mg TDS 20 minutes before meals (or 200 mg SR BD)',
          cautionOrMonitoring: 'Relieves post-prandial abdominal cramping and tenesmus without causing dry mouth or urinary retention',
        },
        {
          drugClass: 'Multi-Strain Lyophilized Probiotic + Prebiotic Synbiotic',
          genericName: 'Cap. Saccharomyces boulardii + Lactobacillus rhamnosus GG + Bifidobacterium',
          standardRegimen: '1 capsule BD after meals for 4 weeks',
          cautionOrMonitoring: 'Restores colonic commensal flora and strengthens mucosal tight junctions',
        },
        {
          drugClass: 'Low-Dose Gut Neuromodulator (For Refractory Visceral Pain / IBS-D)',
          genericName: 'Tab. Amitriptyline',
          standardRegimen: '10 mg orally HS at bedtime',
          cautionOrMonitoring: 'Modulates central visceral pain pathways and slows rapid colonic transit',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 326: Irritable Bowel Syndrome",
        "Sleisenger and Fordtran's Gastrointestinal and Liver Disease 11th Edition - Functional Bowel Disorders",
      ],
    };
  }

  // 8. ARSHA / HEMORRHOIDS / PILES
  if (q.includes('arsha') || q.includes('hemorrhoid') || q.includes('piles')) {
    return {
      pathophysiologySummary:
        'Downward sliding of anal vascular cushions (superior and inferior hemorrhoidal venous plexuses) due to chronic straining, low-fiber diet, and venous congestion leading to painless bright red rectal bleeding and prolapse.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Micronized Purified Flavonoid Fraction (Venotonic / Capillary Stabilizer)',
          genericName: 'Tab. Diosmin 450 mg + Hesperidin 50 mg (Daflon 500)',
          standardRegimen: 'Acute bleeding/thrombosis: 2 tablets TDS for 4 days, then 2 tablets BD for 3 days; Maintenance: 1 tablet BD after meals for 4–8 weeks',
          cautionOrMonitoring: 'Increases venous tone, reduces capillary hyperpermeability, and stops hemorrhoidal bleeding',
        },
        {
          drugClass: 'Osmotic Bulk-Forming Laxative Stool Softener',
          genericName: 'Syrup Lactulose 15 mL / Ispaghula Husk (Psyllium) + Polyethylene Glycol (PEG 3350)',
          standardRegimen: '15 mL–20 mL (or 2 teaspoons in warm water) HS at bedtime',
          cautionOrMonitoring: 'Prevents defecation straining (Bristol Stool Type 4 target); ensure 2.5–3 L daily water intake',
        },
        {
          drugClass: 'Topical Anorectal Local Anesthetic + Astringent + Venoprotective Cream',
          genericName: 'Cream Lidocaine 2.5% + Calcium Dobesilate 4% + Hydrocortisone 0.25% + Zinc Oxide',
          standardRegimen: 'Apply perianally and intrarectally with applicator BD (morning after defecation & bedtime) after warm Sitz bath',
          cautionOrMonitoring: 'Limit topical hydrocortisone use to 7–10 days to avoid perianal skin atrophy',
        },
      ],
      textbookReferences: [
        "Bailey & Love's Short Practice of Surgery 28th Edition - Ch. 77: The Anus and Anal Canal",
        "Sabiston Textbook of Surgery 21st Edition - Hemorrhoidal Disease",
      ],
    };
  }

  // 9. BHAGANDARA / FISTULA-IN-ANO & PARIKARTIKA / ANAL FISSURE
  if (q.includes('bhagandara') || q.includes('fistula') || q.includes('parikartika') || q.includes('fissure')) {
    return {
      pathophysiologySummary:
        'In Anal Fissure (Parikartika): Longitudinal tear in anoderm distal to dentate line with internal anal sphincter hypertonia and posterior midline ischemia. In Fistula-in-Ano (Bhagandara): Chronic cryptoglandular infection forming an epithelialized track between anal canal and perianal skin.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Chemical Sphincterotomy (Topical Calcium Channel Blocker / Nitric Oxide Donor)',
          genericName: 'Ointment Diltiazem 2% (or Glyceryl Trinitrate 0.2% + Lidocaine 2%)',
          standardRegimen: 'Apply 1.5 cm strip digitally inside anal margin BD/TDS for 6–8 weeks (especially for Anal Fissure)',
          cautionOrMonitoring: 'Relaxes internal anal sphincter hypertonia and restores anodermal blood flow; GTN may cause transient headache',
        },
        {
          drugClass: 'Anaerobic + Gram-Negative Antibiotic Cover (For Acute Perianal Sepsis / Fistula Discharge)',
          genericName: 'Tab. Ciprofloxacin 500 mg + Tab. Metronidazole 400 mg (or Tab. Amoxicillin-Clavulanate 625 mg)',
          standardRegimen: 'BD/TDS after meals for 5–7 days during acute purulent cryptoglandular flare',
          cautionOrMonitoring: 'Avoid alcohol strictly during Metronidazole therapy (disulfiram reaction); definitive cure of Fistula requires Ksharasutra / Fistulotomy',
        },
        {
          drugClass: 'Osmotic Stool Softener',
          genericName: 'Syrup Liquid Paraffin + Milk of Magnesia + Sodium Picosulfate (Cremaffin)',
          standardRegimen: '10 mL–15 mL with warm water at bedtime',
          cautionOrMonitoring: 'Prevents hard bolus trauma to healing anoderm',
        },
      ],
      textbookReferences: [
        "Bailey & Love's Short Practice of Surgery 28th Edition - Anal Fissure and Fistula-in-Ano",
        "ASCRS Clinical Practice Guidelines for Management of Anal Fissures and Cryptoglandular Fistula",
      ],
    };
  }

  // 10. KAMALA / JAUNDICE / HEPATITIS / FATTY LIVER
  if (q.includes('kamala') || q.includes('jaundice') || q.includes('hepatitis') || q.includes('liver') || q.includes('bilirubin')) {
    return {
      pathophysiologySummary:
        'Hepatocellular inflammation/necrosis or intrahepatic/extrahepatic cholestasis impairing bilirubin conjugation and canalicular excretion, resulting in hyperbilirubinemia (>2.5 mg/dL), icterus, and elevated transaminases (ALT/AST).',
      pharmacotherapyStandard: [
        {
          drugClass: 'Hydrophilic Bile Acid (Cytoprotective & Choleretic)',
          genericName: 'Tab. Ursodeoxycholic Acid (UDCA)',
          standardRegimen: '300 mg BD after meals (10–15 mg/kg/day in divided doses)',
          cautionOrMonitoring: 'Displaces toxic hydrophobic bile acids, stabilizes hepatocyte membranes, and relieves cholestatic pruritus',
        },
        {
          drugClass: 'Hepatic Glutathione Precursor & Membrane Stabilizer',
          genericName: 'Tab. S-Adenosyl-L-Methionine (SAMe) 400 mg / Tab. Silymarin 140 mg + L-Ornithine L-Aspartate (LOLA)',
          standardRegimen: '1 tablet BD/TDS after meals',
          cautionOrMonitoring: 'Replenishes intrahepatic glutathione stores and lowers ammonia in hepatic dysfunction',
        },
        {
          drugClass: 'Bile Acid Sequestrant (For Cholestatic Pruritus in Obstructive/Shakhashrita Jaundice)',
          genericName: 'Sachet Cholestyramine',
          standardRegimen: '4 g dissolved in water/juice 1–2 times daily before meals',
          cautionOrMonitoring: 'Administer other oral medications at least 1 hour before or 4 hours after Cholestyramine',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 49: Jaundice & Ch. 339: Acute Viral Hepatitis",
        "Sherlock's Diseases of the Liver and Biliary System 13th Edition",
      ],
    };
  }

  // 11. ATISARA / PRAVAHIKA / ACUTE GASTROENTERITIS & DYSENTERY
  if (q.includes('atisara') || q.includes('pravahika') || q.includes('diarrhea') || q.includes('dysentery') || q.includes('gastroenteritis')) {
    return {
      pathophysiologySummary:
        'Enterotoxin-mediated intestinal chloride hypersecretion (secretory diarrhea) or mucosal invasion by Shigella/Entamoeba histolytica (inflammatory dysentery) causing fluid-electrolyte depletion and tenesmus.',
      pharmacotherapyStandard: [
        {
          drugClass: 'WHO Low-Osmolarity Oral Rehydration Therapy + Zinc',
          genericName: 'WHO Reduced-Osmolarity ORS Sachet (245 mOsm/L) + Tab. Zinc Sulfate 20 mg',
          standardRegimen: '1 sachet in 1 Liter clean boiled-cooled water (200 mL after each loose stool) + Zinc 20 mg OD for 14 days',
          cautionOrMonitoring: 'Cornerstone of dehydration prevention via SGLT-1 sodium-glucose cotransport; regenerates intestinal villi',
        },
        {
          drugClass: 'Enkephalinase Inhibitor (Antisecretory Antidiarrheal)',
          genericName: 'Cap. Racecadotril',
          standardRegimen: '100 mg orally TDS before meals until 2 normal stools are passed (max 7 days)',
          cautionOrMonitoring: 'Reduces intestinal hypersecretion without causing rebound constipation or paralytic ileus (unlike Loperamide)',
        },
        {
          drugClass: 'Antimicrobial + Antiamoebic (For Pravahika / Invasive Dysentery with Mucus & Blood)',
          genericName: 'Tab. Ofloxacin 200 mg + Ornidazole 500 mg (or Tab. Azithromycin 500 mg OD for 3 days)',
          standardRegimen: '1 tablet BD after meals for 5 days',
          cautionOrMonitoring: 'Indicated when stool microscopy shows >10 pus cells/hpf, RBCs, or Entamoeba trophozoites',
        },
        {
          drugClass: 'Probiotic Yeast Biotherapeutic',
          genericName: 'Sachet / Cap. Saccharomyces boulardii (250 mg)',
          standardRegimen: '1 capsule/sachet BD for 5–7 days',
          cautionOrMonitoring: 'Neutralizes bacterial enterotoxins and shortens duration of acute diarrhea',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 133: Acute Infectious Diarrheal Diseases",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Treatment of Diarrhoea",
      ],
    };
  }

  // 12. KASA / BRONCHITIS / CHRONIC COUGH
  if (q.includes('kasa') || q.includes('cough') || q.includes('bronchitis')) {
    return {
      pathophysiologySummary:
        'Tracheobronchial mucosal inflammation, vagal afferent cough-receptor sensitization (Vataja/Pittaja Kasa), or goblet cell hyperplasia with mucopurulent hypersecretion (Kaphaja Kasa).',
      pharmacotherapyStandard: [
        {
          drugClass: 'Mucolytic + Bronchodilator Expectorant (For Productive / Kaphaja Kasa)',
          genericName: 'Syrup Ambroxol 30 mg + Levosalbutamol 1 mg + Guaiphenesin 50 mg (per 5 mL)',
          standardRegimen: '10 mL orally TDS after meals',
          cautionOrMonitoring: 'Clears viscid bronchial mucus plugs and relieves bronchospasm; may cause mild tremor',
        },
        {
          drugClass: 'Centrally Acting Non-Opioid Antitussive (For Dry Hacking / Vataja Kasa)',
          genericName: 'Syrup Dextromethorphan Hydrobromide 15 mg + Chlorpheniramine Maleate 2 mg (per 5 mL)',
          standardRegimen: '10 mL orally TDS/HS (strictly for dry non-productive cough)',
          cautionOrMonitoring: 'Do not suppress productive cough; may cause mild sedation',
        },
        {
          drugClass: 'Macrolide / Beta-Lactam Antibiotic (If Secondary Bacterial Bronchitis / Purulent Sputum)',
          genericName: 'Tab. Azithromycin 500 mg (or Tab. Amoxicillin-Clavulanate 625 mg)',
          standardRegimen: 'Azithromycin 500 mg OD 1 hour before meals for 3–5 days (or Augmentin 625 mg BD for 5 days)',
          cautionOrMonitoring: 'Rule out pulmonary tuberculosis (Kshayaja Kasa) via sputum AFB/CBNAAT if cough persists > 2 weeks',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 38: Cough & Acute Bronchitis",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 16: Drugs for Cough and Bronchial Asthma",
      ],
    };
  }

  // 13. TAMAKA SHWASA / BRONCHIAL ASTHMA / COPD
  if (q.includes('shwasa') || q.includes('asthma') || q.includes('wheez') || q.includes('copd') || q.includes('dyspnea')) {
    return {
      pathophysiologySummary:
        'Chronic eosinophilic/Th2 airway inflammation, bronchial hyperresponsiveness, reversible smooth muscle bronchoconstriction, and mucosal edema with mucus plugging (GINA Guidelines).',
      pharmacotherapyStandard: [
        {
          drugClass: 'GINA Track-1 Controller + Reliever Inhaler (ICS + Fast-Acting LABA)',
          genericName: 'MDI / Rotacaps Budesonide 200 mcg + Formoterol Fumarate 6 mcg',
          standardRegimen: '1–2 inhalations BD daily as maintenance + 1 inhalation SOS for acute wheezing relief (SMART Regimen)',
          cautionOrMonitoring: 'Mandatory warm water gargling after each inhalation to prevent oral candidiasis and hoarseness',
        },
        {
          drugClass: 'Leukotriene Receptor Antagonist (LTRA) + Antihistamine',
          genericName: 'Tab. Montelukast 10 mg + Levocetirizine 5 mg',
          standardRegimen: '1 tablet orally HS at bedtime',
          cautionOrMonitoring: 'Prevents nocturnal asthma exacerbations (Tamaka Shwasa night/cloudy weather flares) and allergic rhinitis trigger',
        },
        {
          drugClass: 'Methylxanthine Bronchodilator & Histone Deacetylase Activator',
          genericName: 'Tab. Acebrophylline 100 mg SR (or Tab. Doxofylline 400 mg)',
          standardRegimen: '1 tablet BD after meals',
          cautionOrMonitoring: 'Better cardiac safety profile than conventional Theophylline; avoid excessive caffeine intake',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 287: Asthma",
        "Global Initiative for Asthma (GINA) Pocket Guide for Asthma Management 2024",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Bronchial Asthma Pharmacotherapy",
      ],
    };
  }

  // 14. PRATISHYAYA / ALLERGIC RHINITIS / SINUSITIS
  if (q.includes('pratishyaya') || q.includes('rhinitis') || q.includes('sinusitis') || q.includes('sneezing') || q.includes('coryza')) {
    return {
      pathophysiologySummary:
        'IgE-mediated mast cell degranulation in nasal mucosa upon allergen exposure releasing histamine, leukotrienes, and prostaglandins, causing paroxysmal sneezing, watery rhinorrhea, and turbinate congestion.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Intranasal Corticosteroid Spray',
          genericName: 'Nasal Spray Fluticasone Furoate 27.5 mcg (or Mometasone Furoate 50 mcg)',
          standardRegimen: '2 sprays in each nostril once daily in the morning (directed laterally away from nasal septum)',
          cautionOrMonitoring: 'Most effective therapy for nasal congestion and mucosal eosinophilia; full effect in 3–5 days',
        },
        {
          drugClass: 'Second-Generation Non-Sedating Antihistamine + Leukotriene Blocker',
          genericName: 'Tab. Fexofenadine 120 mg + Montelukast 10 mg (or Tab. Bilastine 20 mg)',
          standardRegimen: '1 tablet orally HS at bedtime for 14–28 days',
          cautionOrMonitoring: 'Non-sedating; avoid taking Fexofenadine with fruit juices (reduces OATP absorption)',
        },
        {
          drugClass: 'Isotonic / Hypertonic Saline Nasal Irrigation',
          genericName: 'Sterile Sodium Chloride 0.9% w/v Nasal Drops / Spray',
          standardRegimen: '2–3 sprays in each nostril TDS to clear allergens and thick mucoid crusts',
          cautionOrMonitoring: 'Avoid topical Oxymetazoline decongestant drops for >5 days (causes Rhinitis Medicamentosa)',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 353: Allergies, Anaphylaxis, and Systemic Mastocytosis",
        "Dhingra's Diseases of Ear, Nose and Throat 8th Edition - Allergic & Vasomotor Rhinitis",
      ],
    };
  }

  // 15. PANDU ROGA / ANEMIA
  if (q.includes('pandu') || q.includes('anemia') || q.includes('hemoglobin') || q.includes('iron deficiency')) {
    return {
      pathophysiologySummary:
        'Depleted body iron stores (low serum ferritin <30 ng/mL) or impaired erythroblast DNA synthesis (Vitamin B12/Folate deficiency) resulting in reduced hemoglobin synthesis, microcytic hypochromic or megaloblastic RBCs, and tissue hypoxia.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Oral Hematinic (Elemental Ferrous Iron + Folate)',
          genericName: 'Tab. Ferrous Ascorbate (equiv. to 100 mg Elemental Iron) + Folic Acid 1.5 mg',
          standardRegimen: '1 tablet OD/BD on empty stomach or 1 hour after meals with Vitamin C/lemon water (continue for 3–6 months after Hb normalizes to replenish Ferritin)',
          cautionOrMonitoring: 'Avoid taking with tea, coffee, milk, or calcium tablets (chelates iron); dark stools are harmless',
        },
        {
          drugClass: 'Megaloblastic Maturation Factors (Vitamin B12 + Folate)',
          genericName: 'Tab. Methylcobalamin 1500 mcg + Folic Acid 5 mg + Pyridoxine 10 mg',
          standardRegimen: '1 tablet OD after breakfast',
          cautionOrMonitoring: 'Essential in nutritional/vegetarian dimorphic anemia to prevent subacute combined degeneration of spinal cord',
        },
        {
          drugClass: 'Broad-Spectrum Anthelmintic (De-worming Protocol to Stop Occult Hookworm Blood Loss)',
          genericName: 'Tab. Albendazole 400 mg',
          standardRegimen: '400 mg single chewable dose at bedtime (repeat after 2 weeks if eosinophilia/ova present)',
          cautionOrMonitoring: 'Eliminates Ancylostoma/Necator hookworm infestation causing chronic occult GI blood loss',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 97: Iron Deficiency and Other Hypoproliferative Anemias",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 43: Haematinics and Erythropoietin",
      ],
    };
  }

  // 16. RAKTAPITTA / EPISTAXIS / BLEEDING DISORDERS
  if (q.includes('raktapitta') || q.includes('epistaxis') || q.includes('bleeding') || q.includes('hemorrhage')) {
    return {
      pathophysiologySummary:
        'Microvascular capillary fragility, platelet dysfunction, or hyperfibrinolysis leading to spontaneous mucosal hemorrhage (epistaxis, hemoptysis, hematuria, or GI bleeding).',
      pharmacotherapyStandard: [
        {
          drugClass: 'Antifibrinolytic Hemostatic Agent (Plasminogen Inhibitor)',
          genericName: 'Tab. Tranexamic Acid',
          standardRegimen: '500 mg–1000 mg orally TDS for 3–5 days during active mucosal bleeding',
          cautionOrMonitoring: 'Inhibits fibrin clot breakdown; contraindicated in active thromboembolic disease and macroscopic hematuria of upper urinary tract origin',
        },
        {
          drugClass: 'Capillary Hemostatic & Platelet Adhesiveness Enhancer',
          genericName: 'Tab. Ethamsylate',
          standardRegimen: '250 mg–500 mg orally TDS after meals',
          cautionOrMonitoring: 'Improves capillary wall stability via prostacyclin inhibition and P-selectin expression',
        },
        {
          drugClass: 'Vascular Endothelial & Collagen Co-Factor',
          genericName: 'Tab. Ascorbic Acid (Vitamin C) 500 mg + Rutin + Menadione / Vitamin K1 (if INR elevated)',
          standardRegimen: '1 tablet BD after meals',
          cautionOrMonitoring: 'Monitor PT/INR, aPTT, and platelet count to identify underlying coagulopathy or thrombocytopenia',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 66: Bleeding andaru Thrombosis",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Coagulants and Anticoagulants",
      ],
    };
  }

  // 17. HRIDROGA / ISCHEMIC HEART DISEASE / ANGINA
  if (q.includes('hridroga') || q.includes('angina') || q.includes('ischemic heart') || q.includes('coronary') || q.includes('cardiac')) {
    return {
      pathophysiologySummary:
        'Coronary atherosclerotic plaque stenosis causing myocardial oxygen supply-demand mismatch, subendocardial ischemia, and exertional retrosternal angina pectoris.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Antiplatelet COX-1 / P2Y12 Inhibitor',
          genericName: 'Tab. Aspirin 75 mg EC + Tab. Clopidogrel 75 mg (if post-ACS/stent)',
          standardRegimen: '1 tablet OD after lunch daily',
          cautionOrMonitoring: 'Prevents coronary platelet thrombus aggregation; monitor for GI bleeding',
        },
        {
          drugClass: 'HMG-CoA Reductase Inhibitor (Plaque-Stabilizing High-Intensity Statin)',
          genericName: 'Tab. Atorvastatin 40 mg / Tab. Rosuvastatin 20 mg',
          standardRegimen: '1 tablet orally HS at bedtime',
          cautionOrMonitoring: 'Target LDL-C < 55–70 mg/dL; monitor baseline LFT and CPK if myalgia occurs',
        },
        {
          drugClass: 'Cardioselective Beta-1 Blocker (Reduces Myocardial O2 Demand)',
          genericName: 'Tab. Metoprolol Succinate XL 25 mg–50 mg (or Tab. Bisoprolol 2.5 mg–5 mg)',
          standardRegimen: '1 tablet OD in the morning (target resting HR 55–65 bpm)',
          cautionOrMonitoring: 'Do not stop abruptly; avoid in severe bradycardia (<50 bpm) or decompensated heart block',
        },
        {
          drugClass: 'Rapid-Acting Organic Nitrate Vasodilator (Acute Angina Relief)',
          genericName: 'Sublingual Tab. Nitroglycerin (Glyceryl Trinitrate) 0.5 mg',
          standardRegimen: '1 tablet kept under the tongue SOS at onset of chest pain (may repeat every 5 mins up to 3 doses)',
          cautionOrMonitoring: 'Sit down before taking (postural hypotension risk); if chest pain persists >15 mins after 3 doses, seek emergency ECG/Troponin',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 273: Ischemic Heart Disease",
        "Braunwald's Heart Disease: A Textbook of Cardiovascular Medicine 12th Edition",
      ],
    };
  }

  // 18. RAKTACHAPA / VYANA BALA VAISHAMYA / HYPERTENSION
  if (q.includes('raktachapa') || q.includes('vyana bala') || q.includes('hypertension') || q.includes('blood pressure') || q.includes('high bp')) {
    return {
      pathophysiologySummary:
        'Increased systemic vascular resistance (SVR) driven by Renin-Angiotensin-Aldosterone System (RAAS) overactivity, sympathetic nervous system hypertonia, endothelial dysfunction, and renal sodium retention.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Angiotensin II Receptor Blocker (ARB)',
          genericName: 'Tab. Telmisartan 40 mg (or Tab. Losartan 50 mg / Olmesartan 20 mg)',
          standardRegimen: '40 mg orally once daily in the morning',
          cautionOrMonitoring: 'Renoprotective (reduces microalbuminuria); monitor serum creatinine and potassium; strictly contraindicated in pregnancy',
        },
        {
          drugClass: 'Dihydropyridine Calcium Channel Blocker (CCB)',
          genericName: 'Tab. Cilnidipine 10 mg / Tab. Amlodipine 5 mg',
          standardRegimen: '1 tablet OD after breakfast (or HS for non-dippers)',
          cautionOrMonitoring: 'Cilnidipine blocks both L-type and N-type calcium channels, causing significantly less pedal edema and reflex tachycardia than Amlodipine',
        },
        {
          drugClass: 'Thiazide-Like Diuretic (Add-on if Dual Therapy Needed)',
          genericName: 'Tab. Chlorthalidone 6.25 mg–12.5 mg (or Indapamide 1.5 mg SR)',
          standardRegimen: '1 tablet OD in the morning (avoid evening dosing to prevent nocturia)',
          cautionOrMonitoring: 'Monitor serum sodium, potassium, and uric acid levels periodically',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 277: Hypertensive Vascular Disease",
        "ESC/ESH & ACC/AHA Clinical Practice Guidelines for Management of Arterial Hypertension",
      ],
    };
  }

  // 19. MUTRAKRICHRA / UTI / DYSURIA
  if (q.includes('mutrakrichra') || q.includes('uti') || q.includes('urinary tract') || q.includes('dysuria') || q.includes('cystitis')) {
    return {
      pathophysiologySummary:
        'Ascending uropathogenic Escherichia coli (UPEC) colonization of bladder urothelium via P-fimbriae adhesins triggering mucosal neutrophil infiltration, dysuria, frequency, and suprapubic pain.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Urinary-Specific Bactericidal Antibiotic',
          genericName: 'Tab. Nitrofurantoin Monohydrate/Macrocrystals (or Sachet Fosfomycin Trometamol 3 g)',
          standardRegimen: 'Nitrofurantoin 100 mg BD after meals for 5–7 days (or Fosfomycin 3 g single-dose sachet at bedtime)',
          cautionOrMonitoring: 'Concentrates specifically in lower urinary tract; avoid Nitrofurantoin if eGFR < 45 mL/min or in G6PD deficiency',
        },
        {
          drugClass: 'Urinary Alkalinizer (Relieves Burning Micturition)',
          genericName: 'Syrup Disodium Hydrogen Citrate (Citralka)',
          standardRegimen: '10 mL diluted in 1 full glass of water TDS after meals for 5 days',
          cautionOrMonitoring: 'Neutralizes acidic urine to immediately soothe inflamed bladder mucosa and potentiates antibiotic action',
        },
        {
          drugClass: 'Urinary Tract Antispasmodic / Analgesic',
          genericName: 'Tab. Flavoxate 200 mg (or Tab. Phenazopyridine 200 mg)',
          standardRegimen: '1 tablet TDS after meals for 3–5 days',
          cautionOrMonitoring: 'Relieves detrusor spasm, suprapubic pain, and urinary urgency',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 135: Urinary Tract Infections, Pyelonephritis, and Prostatitis",
        "Campbell-Walsh-Wein Urology 12th Edition - Infections of the Urinary Tract",
      ],
    };
  }

  // 20. MUTRASHMARI / RENAL CALCULI / UROLITHIASIS
  if (q.includes('mutrashmari') || q.includes('ashmari') || q.includes('calculi') || q.includes('kidney stone') || q.includes('renal colic')) {
    return {
      pathophysiologySummary:
        'Urinary supersaturation of calcium oxalate, calcium phosphate, or uric acid with low urinary citrate levels leading to crystal nucleation, aggregation, and ureteric peristaltic spasm (renal colic).',
      pharmacotherapyStandard: [
        {
          drugClass: 'Medical Expulsive Therapy (Selective α1A-Adrenoceptor Blocker)',
          genericName: 'Cap. Tamsulosin 0.4 mg (or Cap. Silodosin 8 mg)',
          standardRegimen: '1 capsule orally HS 30 minutes after dinner for 2–4 weeks (for distal ureteric calculi ≤ 8–10 mm)',
          cautionOrMonitoring: 'Relaxes distal ureteric smooth muscle to facilitate spontaneous stone passage; warn regarding first-dose postural dizziness',
        },
        {
          drugClass: 'Urinary Crystallization Inhibitor & Alkalinizer',
          genericName: 'Syrup Potassium Magnesium Citrate + Vitamin B6 (Pyridoxine)',
          standardRegimen: '10 mL–15 mL diluted in 1 glass of water TDS after meals',
          cautionOrMonitoring: 'Citrate chelates urinary calcium into soluble complexes and Pyridoxine reduces endogenous oxalate synthesis',
        },
        {
          drugClass: 'Acute Ureteric Colic Analgesic + Antispasmodic',
          genericName: 'Tab. Drotaverine 80 mg + Mefenamic Acid 250 mg (or Tab. Ketorolac / Diclofenac 50 mg)',
          standardRegimen: '1 tablet BD/TDS SOS during acute flank-to-groin colic',
          cautionOrMonitoring: 'NSAIDs reduce glomerular filtration pressure and ureteric edema; avoid if serum creatinine is elevated',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 319: Nephrolithiasis",
        "Bailey & Love's Short Practice of Surgery 28th Edition - Upper Urinary Tract Calculi",
      ],
    };
  }

  // 21. PAKSHAGHATA / ISCHEMIC STROKE / HEMIPLEGIA
  if (q.includes('pakshaghata') || q.includes('stroke') || q.includes('hemiplegia') || q.includes('cerebrovascular') || q.includes('paralysis')) {
    return {
      pathophysiologySummary:
        'Thromboembolic occlusion of cerebral artery (commonly Middle Cerebral Artery territory) causing ischemic penumbra, excitotoxicity, and upper motor neuron contralateral hemiparesis.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Secondary Stroke Prevention Antiplatelet Therapy',
          genericName: 'Tab. Aspirin 75 mg–150 mg + Tab. Clopidogrel 75 mg',
          standardRegimen: 'Dual antiplatelet for first 21–90 days post-ischemic stroke (after ruling out hemorrhage on NCCT Head), followed by single antiplatelet OD',
          cautionOrMonitoring: 'Strictly confirm non-hemorrhagic ischemic etiology on CT/MRI Brain before initiating antiplatelets',
        },
        {
          drugClass: 'High-Intensity Statin (Atherosclerotic Plaque Stabilization)',
          genericName: 'Tab. Atorvastatin 40 mg–80 mg (or Tab. Rosuvastatin 20 mg–40 mg)',
          standardRegimen: '1 tablet orally HS at bedtime',
          cautionOrMonitoring: 'Reduces recurrent ischemic stroke risk by >25%; monitor lipid profile and liver enzymes',
        },
        {
          drugClass: 'Cerebroprotective Phospholipid Precursor (Neuro-Recovery Adjuvant)',
          genericName: 'Tab. Citicoline (CDP-Choline) 500 mg + Piracetam 800 mg',
          standardRegimen: '1 tablet BD after meals during post-stroke neurorehabilitation phase',
          cautionOrMonitoring: 'Supports neuronal membrane phosphatidylcholine synthesis alongside structured physiotherapy',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 426: Ischemic Stroke",
        "Adams and Victor's Principles of Neurology 11th Edition - Cerebrovascular Diseases",
      ],
    };
  }

  // 22. APASMARA / EPILEPSY / SEIZURE DISORDER
  if (q.includes('apasmara') || q.includes('epilepsy') || q.includes('seizure') || q.includes('convulsion')) {
    return {
      pathophysiologySummary:
        'Paroxysmal hypersynchronous neuronal discharges in cerebral cortex due to imbalance between glutamatergic excitation and GABAergic inhibition.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Broad-Spectrum Synaptic Vesicle (SV2A) Antiepileptic Drug',
          genericName: 'Tab. Levetiracetam',
          standardRegimen: '500 mg BD orally (every 12 hours), titrated up to 1000 mg BD based on seizure control',
          cautionOrMonitoring: 'Minimal hepatic CYP450 drug interactions; monitor for behavioral irritability; never stop antiepileptics abruptly',
        },
        {
          drugClass: 'Broad-Spectrum Sodium Channel & GABA Enhancer (GTCS / Absence / Myoclonic)',
          genericName: 'Tab. Sodium Valproate Chrono 300 mg–500 mg (or Tab. Lamotrigine / Oxcarbazepine for Focal)',
          standardRegimen: '1 tablet BD after meals (15–20 mg/kg/day)',
          cautionOrMonitoring: 'Valproate is strictly contraindicated in women of childbearing potential (neural tube defects); monitor LFT and platelets',
        },
        {
          drugClass: 'Folate & Neurotropic Supplementation',
          genericName: 'Tab. Folic Acid 5 mg + Pyridoxine (Vitamin B6) 20 mg',
          standardRegimen: '1 tablet OD after breakfast',
          cautionOrMonitoring: 'Prevents antiepileptic-induced folate depletion and behavioral side effects',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 425: Seizures and Epilepsy",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 30: Antiepileptic Drugs",
      ],
    };
  }

  // 23. UNMADA / CHITTAODVEGA / ANXIETY & PSYCHOSIS
  if (q.includes('unmada') || q.includes('anxiety') || q.includes('psychosis') || q.includes('depression') || q.includes('psychiatric')) {
    return {
      pathophysiologySummary:
        'Dysregulation of mesolimbic/mesocortical dopaminergic, serotonergic (5-HT), and GABAergic neurotransmission within prefrontal-limbic circuits.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Selective Serotonin Reuptake Inhibitor (SSRI — For Anxiety / Depressive Spectrum)',
          genericName: 'Tab. Escitalopram 10 mg (or Tab. Sertraline 50 mg)',
          standardRegimen: 'Escitalopram 5 mg OD for 1 week, then 10 mg OD after breakfast',
          cautionOrMonitoring: 'Full anxiolytic/antidepressant effect takes 2–4 weeks; taper gradually when discontinuing',
        },
        {
          drugClass: 'Second-Generation Atypical Antipsychotic (For Acute Unmada / Psychotic Agitation)',
          genericName: 'Tab. Olanzapine 5 mg–10 mg / Tab. Risperidone 2 mg',
          standardRegimen: '1 tablet orally HS at bedtime',
          cautionOrMonitoring: 'Blocks D2 and 5-HT2A receptors; monitor weight, fasting blood glucose, and lipid profile',
        },
        {
          drugClass: 'Short-Term Benzodiazepine Anxiolytic Bridge',
          genericName: 'Tab. Clonazepam 0.25 mg–0.5 mg MD',
          standardRegimen: '1 mouth-dissolving tablet HS at bedtime for 7–14 days only',
          cautionOrMonitoring: 'Restrict to short-term bridge to avoid dependence and cognitive blunting',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 452: Psychiatric Disorders",
        "Kaplan & Sadock's Synopsis of Psychiatry 12th Edition",
      ],
    };
  }

  // 24. ANIDRA / INSOMNIA
  if (q.includes('anidra') || q.includes('insomnia') || q.includes('sleepless')) {
    return {
      pathophysiologySummary:
        'Hyperarousal of ascending reticular activating system (ARAS), elevated nocturnal cortisol/sympathetic tone, and circadian melatonin phase delay.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Circadian MT1/MT2 Melatonin Receptor Agonist',
          genericName: 'Tab. Melatonin 3 mg (or Tab. Ramelteon 8 mg)',
          standardRegimen: '1 tablet orally 45–60 minutes before target bedtime in a dark room',
          cautionOrMonitoring: 'Non-habit forming; resets suprachiasmatic nucleus circadian sleep-wake rhythm without hangover sedation',
        },
        {
          drugClass: 'Non-Benzodiazepine Z-Drug (GABAA α1-Subunit Selective Hypnotic)',
          genericName: 'Tab. Zolpidem Tartrate 5 mg–10 mg (or Tab. Eszopiclone 2 mg)',
          standardRegimen: '1 tablet immediately before getting into bed (short-term use < 2 weeks)',
          cautionOrMonitoring: 'Ensure 7–8 hours of dedicated sleep window; avoid alcohol and long-term habitual use',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 31: Sleep Disorders",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Sedatives and Hypnotics",
      ],
    };
  }

  // 25. ARDITA / BELL'S PALSY / FACIAL PARALYSIS
  if (q.includes('ardita') || q.includes('bell') || q.includes('facial palsy') || q.includes('facial paralysis')) {
    return {
      pathophysiologySummary:
        'Acute inflammatory edema and entrapment of Cranial Nerve VII (Facial Nerve) within the narrow labyrinthine segment of the fallopian canal (often triggered by HSV-1 reactivation), causing ipsilateral LMN facial paresis.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Early Oral Corticosteroid (Initiate within 72 hours of onset)',
          genericName: 'Tab. Prednisolone',
          standardRegimen: '60 mg OD (or 1 mg/kg/day) after breakfast for 5 days, then taper by 10 mg/day over the next 5 days (Total 10-day course)',
          cautionOrMonitoring: 'Significantly increases complete facial nerve recovery rate; co-prescribe PPI and monitor blood sugar',
        },
        {
          drugClass: 'Nucleoside Analog Antiviral (For Severe Palsy / Ramsay Hunt Exclusion)',
          genericName: 'Tab. Valacyclovir 1000 mg (or Tab. Acyclovir 400 mg)',
          standardRegimen: 'Valacyclovir 1000 mg TDS for 7 days (or Acyclovir 400 mg 5 times daily for 7 days)',
          cautionOrMonitoring: 'Combined with Prednisolone in severe House-Brackmann Grade IV–VI palsy; maintain hydration',
        },
        {
          drugClass: 'Corneal Exposure Protection (Mandatory in Lagophthalmos)',
          genericName: 'Carboxymethylcellulose 0.5% Eye Drops + Hydroxypropyl Methylcellulose Eye Gel + Eye Patch',
          standardRegimen: 'Lubricating drops every 2 hours during day + thick eye ointment and protective eye taping at night',
          cautionOrMonitoring: 'Crucial to prevent exposure keratitis and corneal ulceration due to incomplete eyelid closure',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 433: Trigeminal Neuralgia, Bell's Palsy, and Other Cranial Nerve Disorders",
        "Dhingra's Diseases of Ear, Nose and Throat 8th Edition - Facial Nerve Paralysis",
      ],
    };
  }

  // 26. STHAULYA / MEDOROGA / OBESITY & DYSLIPIDEMIA
  if (q.includes('sthaulya') || q.includes('medoroga') || q.includes('obesity') || q.includes('overweight') || q.includes('dyslipidemia') || q.includes('cholesterol')) {
    return {
      pathophysiologySummary:
        'Chronic positive energy balance with visceral adipocyte hypertrophy, leptin resistance, adipokine dysregulation (high TNF-α/IL-6, low adiponectin), insulin resistance, and atherogenic dyslipidemia.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Gastrointestinal Lipase Inhibitor (Reduces Dietary Fat Absorption by 30%)',
          genericName: 'Cap. Orlistat',
          standardRegimen: '60 mg–120 mg orally TDS with each main fat-containing meal',
          cautionOrMonitoring: 'Supplement fat-soluble vitamins (A, D, E, K) at bedtime; high-fat meals cause steatorrhea',
        },
        {
          drugClass: 'GLP-1 Receptor Agonist / Insulin Sensitizer (For Metabolic Syndrome / Prediabetes)',
          genericName: 'Tab. Oral Semaglutide 3 mg–7 mg OD (or Tab. Metformin SR 500 mg BD)',
          standardRegimen: 'Semaglutide 3 mg OD on empty stomach with ≤120 mL water 30 mins before breakfast (or Metformin 500 mg BD)',
          cautionOrMonitoring: 'Improves satiety, reduces visceral adiposity, and corrects insulin resistance',
        },
        {
          drugClass: 'Lipid-Lowering HMG-CoA Reductase Inhibitor / Fibrate (If Associated Dyslipidemia)',
          genericName: 'Tab. Rosuvastatin 10 mg HS (or Tab. Saroglitazar 4 mg OD if Triglycerides > 200 mg/dL & NAFLD)',
          standardRegimen: '1 tablet daily',
          cautionOrMonitoring: 'Monitor fasting lipid profile and hepatic transaminases after 12 weeks',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 402: Obesity: Evaluation and Management",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Anti-obesity & Hypolipidemic Drugs",
      ],
    };
  }

  // 27. GALAGANDA / HYPOTHYROIDISM
  if (q.includes('galaganda') || q.includes('hypothyroid') || q.includes('thyroid') || q.includes('tsh')) {
    return {
      pathophysiologySummary:
        'Autoimmune lymphocytic thyroiditis (Hashimoto’s anti-TPO antibodies) or iodine deficiency causing reduced follicular synthesis of T4 and T3 with compensatory pituitary TSH elevation.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Synthetic Thyroid Hormone Replacement (L-Thyroxine)',
          genericName: 'Tab. Levothyroxine Sodium',
          standardRegimen: '25 mcg–100 mcg (1.6 mcg/kg/day) orally once daily on an empty stomach 45–60 minutes before breakfast/tea',
          cautionOrMonitoring: 'Recheck serum TSH after 6–8 weeks (Target TSH 0.5–2.5 mIU/L); keep 4-hour gap from iron, calcium, and antacids',
        },
        {
          drugClass: 'Deiodinase Co-Factor Micronutrient (Reduces Anti-TPO Titers)',
          genericName: 'Tab. L-Selenomethionine (Selenium) 100 mcg–200 mcg + Zinc + Myo-Inositol',
          standardRegimen: '1 tablet OD after lunch for 3 months',
          cautionOrMonitoring: 'Selenium is an essential cofactor for 5’-deiodinase converting peripheral T4 into active T3',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 382: Hypothyroidism",
        "Williams Textbook of Endocrinology 14th Edition - Thyroid Disorders",
      ],
    };
  }

  // 28. SHITAPITTA / UDARDA / URTICARIA
  if (q.includes('shitapitta') || q.includes('udarda') || q.includes('urticaria') || q.includes('hives') || q.includes('wheal')) {
    return {
      pathophysiologySummary:
        'Cutaneous mast cell and basophil degranulation releasing histamine, platelet-activating factor (PAF), and cytokines, causing dermal capillary vasodilation (erythema), plasma extravasation (wheals), and intense pruritus.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Second-Generation Non-Sedating H1 Antihistamine (EAACI Guideline)',
          genericName: 'Tab. Bilastine 20 mg / Tab. Fexofenadine 180 mg / Tab. Levocetirizine 5 mg',
          standardRegimen: 'Bilastine 20 mg OD 1 hour before food (may up-dose up to 2x–4x in refractory chronic spontaneous urticaria per EAACI guidelines)',
          cautionOrMonitoring: 'Non-sedating; preferred over first-generation antihistamines for daytime functioning',
        },
        {
          drugClass: 'H2 Receptor Blocker + Leukotriene Antagonist Adjuvant (For Refractory Wheals)',
          genericName: 'Tab. Famotidine 20 mg BD + Tab. Montelukast 10 mg HS',
          standardRegimen: 'Add to H1 antihistamine for 2–4 weeks when H1 blockade alone is insufficient (15% of cutaneous histamine receptors are H2)',
          cautionOrMonitoring: 'Synergistically suppresses vascular wheal-and-flare response',
        },
        {
          drugClass: 'Short-Course Rescue Oral Corticosteroid (For Acute Severe Angioedema / Generalized Flare)',
          genericName: 'Tab. Prednisolone',
          standardRegimen: '20 mg–30 mg OD after breakfast for 3–5 days only',
          cautionOrMonitoring: 'Avoid long-term steroids in chronic urticaria; keep soothing Calamine lotion for topical pruritus relief',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 353: Urticaria and Angioedema",
        "EAACI/GA²LEN/EuroGuiDerm Guideline for Management of Urticaria",
      ],
    };
  }

  // 29. INDRALUPTA / KHALITYA / ALOPECIA
  if (q.includes('indralupta') || q.includes('khalitya') || q.includes('alopecia') || q.includes('hair fall') || q.includes('baldness')) {
    return {
      pathophysiologySummary:
        'In Alopecia Areata (Indralupta): CD8+ T-cell autoimmune collapse of hair follicle immune privilege. In Androgenetic/Telogen Effluvium (Khalitya): DHT-mediated follicular miniaturization or premature entry of anagen follicles into telogen phase.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Topical Follicular Potassium Channel Opener & Vasodilator',
          genericName: 'Topical Solution Minoxidil 5% (Men) / 2%–5% (Women)',
          standardRegimen: 'Apply 1 mL (6 sprays) on dry scalp over affected areas BD daily',
          cautionOrMonitoring: 'Prolongs anagen phase and enlarges miniaturized follicles; transient telogen shedding in first 4 weeks is expected',
        },
        {
          drugClass: 'Topical / Intralesional Corticosteroid (Specifically for Patchy Alopecia Areata / Indralupta)',
          genericName: 'Lotion Mometasone Furoate 0.1% (or Intralesional Triamcinolone Acetonide 5 mg/mL by Dermatologist)',
          standardRegimen: 'Apply topical lotion OD at night on smooth bald patches for 6–8 weeks',
          cautionOrMonitoring: 'Suppresses peribulbar lymphocytic infiltrate around hair follicles',
        },
        {
          drugClass: 'Anagen Hair Matrix Nutritional Supplement',
          genericName: 'Tab. Biotin 10 mg + Calcium Pantothenate + L-Cysteine + Elemental Iron + Zinc',
          standardRegimen: '1 tablet OD after lunch for 3 months',
          cautionOrMonitoring: 'Check serum Ferritin (target >50 ng/mL), Vitamin D3, and TSH to correct root causes of telogen effluvium',
        },
      ],
      textbookReferences: [
        "Rook's Textbook of Dermatology 9th Edition - Disorders of Hair Follicles",
        "IADVL Textbook of Dermatology 5th Edition - Alopecia Areata & Androgenetic Alopecia",
      ],
    };
  }

  // 30. MUKHAPAKA / APHTHOUS STOMATITIS / ORAL ULCERS
  if (q.includes('mukhapaka') || q.includes('stomatitis') || q.includes('mouth ulcer') || q.includes('aphthous')) {
    return {
      pathophysiologySummary:
        'T-cell mediated focal mucosal epithelial necrosis of non-keratinized oral mucosa, often precipitated by Vitamin B12/Folate/Iron deficiency, local trauma, stress, or GI hyperacidity.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Topical Mucosal Anti-Inflammatory + Local Anesthetic Gel',
          genericName: 'Oral Paste Triamcinolone Acetonide 0.1% (Kenacort Orabase) OR Gel Choline Salicylate 8.7% + Lidocaine 2%',
          standardRegimen: 'Dab over oral ulcers 3–4 times daily (20 minutes before meals for pain-free eating and at bedtime)',
          cautionOrMonitoring: 'Do not eat or drink for 15 minutes after applying Triamcinolone mucosal paste',
        },
        {
          drugClass: 'Antiseptic & Anti-Inflammatory Oral Rinse',
          genericName: 'Mouthwash Benzydamine Hydrochloride 0.15% (or Chlorhexidine Gluconate 0.2%)',
          standardRegimen: 'Rinse with 15 mL undiluted for 30 seconds and spit out TDS after meals',
          cautionOrMonitoring: 'Provides topical NSAID analgesia and prevents secondary bacterial colonization of ulcers',
        },
        {
          drugClass: 'Mucosal Epithelialization Vitamin B-Complex + Folic Acid + Lactic Acid Bacillus',
          genericName: 'Cap. Becosules-Z (Vitamin B-Complex + Vitamin C + Zinc) + Tab. Folic Acid 5 mg + Riboflavin 10 mg',
          standardRegimen: '1 capsule + 1 tablet OD after lunch for 14–21 days',
          cautionOrMonitoring: 'Rapidly corrects Riboflavin (B2), Cobalamin (B12), and Folate mucosal deficiency',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 44: Oral Manifestations of Disease",
        "Burket's Oral Medicine 13th Edition - Recurrent Aphthous Stomatitis",
      ],
    };
  }

  // 31. SHWITRA / KILASA / VITILIGO
  if (q.includes('shwitra') || q.includes('kilasa') || q.includes('vitiligo') || q.includes('leucoderma')) {
    return {
      pathophysiologySummary:
        'Autoimmune CD8+ cytotoxic T-lymphocyte destruction of epidermal melanocytes resulting in sharply demarcated depigmented macules.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Topical Calcineurin Inhibitor (Melanocyte-Sparing Immunomodulator — Safe for Face & Children)',
          genericName: 'Ointment Tacrolimus 0.1% (or Pimecrolimus 1% Cream)',
          standardRegimen: 'Apply thin layer over depigmented patches BD daily',
          cautionOrMonitoring: 'Suppresses local T-cell melanocyte destruction without causing steroid-induced skin atrophy',
        },
        {
          drugClass: 'Topical Corticosteroid (For Non-Facial Acral/Trunk Patches)',
          genericName: 'Cream Mometasone Furoate 0.1% (or Fluticasone Propionate 0.05%)',
          standardRegimen: 'Apply OD in the morning for 2 months (or cyclical 2 weeks on / 1 week off)',
          cautionOrMonitoring: 'Monitor for telangiectasia or skin thinning; combine with Narrowband UV-B (NB-UVB 311 nm) phototherapy',
        },
        {
          drugClass: 'Melanogenesis Antioxidant & Copper/Tyrosinase Co-Factor',
          genericName: 'Tab. Ginkgo Biloba 60 mg BD + Tab. Alpha Lipoic Acid + Vitamin E + Copper/Zinc',
          standardRegimen: '1 tablet BD after meals',
          cautionOrMonitoring: 'Reduces oxidative H2O2 stress in epidermal melanocytes and halts Koebner progression',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 59: Disorders of Pigmentation (Vitiligo)",
        "Rook's Textbook of Dermatology 9th Edition - Vitiligo and Disorders of Hypomelanosis",
      ],
    };
  }

  // 32. JWARA / FEVER / VIRAL OR ENTERIC PYREXIA
  if (q.includes('jwara') || q.includes('fever') || q.includes('pyrexia') || q.includes('malaria') || q.includes('typhoid') || q.includes('dengue')) {
    return {
      pathophysiologySummary:
        'Exogenous microbial pyrogens stimulate macrophage release of endogenous pyrogens (IL-1, IL-6, TNF-α), inducing hypothalamic COX-2 synthesis of Prostaglandin E2 (PGE2) and elevating the thermoregulatory set-point.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Safe Antipyretic & Analgesic (Central COX-3 / PGE2 Inhibitor)',
          genericName: 'Tab. Paracetamol (Acetaminophen)',
          standardRegimen: '500 mg–650 mg orally every 6 hours SOS when temperature > 100°F (Max 3000–4000 mg/24 hrs)',
          cautionOrMonitoring: 'Strictly AVOID NSAIDs (Ibuprofen, Diclofenac, Aspirin) until Dengue hemorrhagic fever / thrombocytopenia is ruled out',
        },
        {
          drugClass: 'Targeted Antimicrobial (ONLY after Etiological Confirmation)',
          genericName: 'Tab. Cefixime 200 mg BD / Tab. Azithromycin 500 mg OD (for confirmed Enteric Fever) OR Tab. Doxycycline 100 mg BD (for Scrub Typhus/Rickettsia)',
          standardRegimen: 'Administer full course strictly guided by Blood Culture, NS1/IgM, MP/ICT, or CBC findings',
          cautionOrMonitoring: 'Avoid empirical antibiotics in uncomplicated viral fever; monitor platelet count and hematocrit daily if Dengue is suspected',
        },
        {
          drugClass: 'Electrolyte & Antiemetic Supportive Care',
          genericName: 'WHO ORS Solution + Tab. Ondansetron 4 mg MD (if associated nausea/vomiting)',
          standardRegimen: '2.5–3 Liters oral fluid hydration daily + tepid water sponging during temperature spikes',
          cautionOrMonitoring: 'Prevents febrile dehydration and prerenal azotemia',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 17: Fever & Ch. 20: Fever of Unknown Origin",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Antipyretic-Analgesics",
      ],
    };
  }

  // 33. KRIMI ROGA / HELMINTHIASIS / INTESTINAL PARASITES
  if (q.includes('krimi') || q.includes('worm') || q.includes('helminth') || q.includes('parasit') || q.includes('pinworm')) {
    return {
      pathophysiologySummary:
        'Luminal colonization by nematodes (Ascaris, Enterobius, Ancylostoma), cestodes (Taenia), or protozoa (Giardia, Entamoeba) causing mucosal malabsorption, eosinophilia, iron loss, and perianal nocturnal pruritus.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Broad-Spectrum Benzimidazole Anthelmintic (β-Tubulin Polymerization Inhibitor)',
          genericName: 'Tab. Albendazole 400 mg (or Tab. Mebendazole 100 mg BD for 3 days)',
          standardRegimen: 'Albendazole 400 mg single chewable tablet at bedtime (Repeat a second 400 mg dose after 14 days to eradicate newly hatched Enterobius larvae)',
          cautionOrMonitoring: 'Take with a fatty meal for systemic tissue parasites; contraindicated in first trimester of pregnancy',
        },
        {
          drugClass: 'Antiprotozoal / Luminal Amoebicide (If Giardiasis or Amoebic Cysts on Stool Microscopy)',
          genericName: 'Tab. Tinidazole 500 mg / Tab. Secnidazole 1 g / Tab. Nitazoxanide 500 mg',
          standardRegimen: 'Nitazoxanide 500 mg BD after meals for 3 days (or Secnidazole 2 g single dose)',
          cautionOrMonitoring: 'Treat all household members simultaneously in Enterobius (pinworm) infestation and trim fingernails closely',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 232: Intestinal Nematode Infections",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 61: Anthelmintic Drugs",
      ],
    };
  }

  // 34. ASRIGDARA / MENORRHAGIA / ABNORMAL UTERINE BLEEDING (AUB)
  if (q.includes('asrigdara') || q.includes('menorrhagia') || q.includes('metrorrhagia') || q.includes('aub') || q.includes('heavy menstrual')) {
    return {
      pathophysiologySummary:
        'Excessive endometrial fibrinolytic activity, prostaglandin E2/I2 imbalance, or anovulatory unopposed estrogen stimulation (PALM-COEIN classification) causing menstrual blood loss >80 mL/cycle.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Non-Hormonal Antifibrinolytic (Reduces Menstrual Blood Loss by 40–50%)',
          genericName: 'Tab. Tranexamic Acid 500 mg',
          standardRegimen: '500 mg–1000 mg orally TDS for 4–5 days ONLY during heavy bleeding days of menstruation',
          cautionOrMonitoring: 'Does not alter ovulation or fertility; rule out history of thromboembolism',
        },
        {
          drugClass: 'Endometrial Prostaglandin Synthetase Inhibitor (NSAID)',
          genericName: 'Tab. Mefenamic Acid 500 mg (often combined as Tranexamic Acid 500 mg + Mefenamic Acid 250 mg)',
          standardRegimen: '1 tablet TDS after meals for 3–5 days during menses',
          cautionOrMonitoring: 'Reduces endometrial PGE2/PGI2 vasodilation and relieves associated dysmenorrhea',
        },
        {
          drugClass: 'Oral Progestogen (For Anovulatory AUB-O Cycle Regulation)',
          genericName: 'Tab. Norethisterone Acetate 5 mg (or Medroxyprogesterone Acetate 10 mg)',
          standardRegimen: '5 mg BD/TDS from Day 5 to Day 25 of cycle (or for 10 days in luteal phase) under gynecological supervision',
          cautionOrMonitoring: 'Stabilizes hyperplastic endometrium; co-prescribe oral Ferrous Ascorbate to correct secondary anemia',
        },
      ],
      textbookReferences: [
        "Shaw's Textbook of Gynaecology 18th Edition - Abnormal Uterine Bleeding (PALM-COEIN)",
        "DC Dutta's Textbook of Gynecology 8th Edition - Menorrhagia & Dysfunctional Uterine Bleeding",
      ],
    };
  }

  // 35. KASHTARTAVA / DYSMENORRHEA / PCOS
  if (q.includes('kashtartava') || q.includes('dysmenorrhea') || q.includes('menstrual cramp') || q.includes('pcos') || q.includes('pcod')) {
    return {
      pathophysiologySummary:
        'Excessive endometrial release of Prostaglandin F2α (PGF2α) during luteal progesterone withdrawal causing hypercontractile uterine myometrial ischemia and spasmodic lower abdominal pain.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Endometrial Prostaglandin (PGF2α) Inhibitor + Antispasmodic',
          genericName: 'Tab. Mefenamic Acid 250 mg + Dicyclomine Hydrochloride 10 mg (or Drotaverine 80 mg)',
          standardRegimen: '1 tablet TDS after meals starting at onset of menses for 2–3 days',
          cautionOrMonitoring: 'Directly blocks endometrial COX-mediated PGF2α synthesis and relaxes uterine smooth muscle spasm',
        },
        {
          drugClass: 'Insulin-Sensitizing Inositol Stereoisomers (If Associated PCOS / Oligomenorrhea)',
          genericName: 'Tab. Myo-Inositol 550 mg + D-Chiro-Inositol 13.8 mg + Chromium Picolinate + Vitamin D3',
          standardRegimen: '1 tablet BD after meals for 3–6 months',
          cautionOrMonitoring: 'Restores ovarian FSH signaling, reduces hyperandrogenism, and regularizes ovulatory cycles',
        },
        {
          drugClass: 'Smooth Muscle Calcium & Magnesium Cofactor',
          genericName: 'Tab. Magnesium Glycinate 250 mg + Vitamin B1 (Thiamine 100 mg) + Vitamin E 400 IU',
          standardRegimen: '1 tablet OD daily during luteal phase',
          cautionOrMonitoring: 'Clinically proven to reduce myometrial hypercontractility and premenstrual cramps',
        },
      ],
      textbookReferences: [
        "Shaw's Textbook of Gynaecology 18th Edition - Dysmenorrhoea and Premenstrual Syndrome",
        "Berek & Novak's Gynecology 16th Edition - Pelvic Pain and Dysmenorrhea",
      ],
    };
  }

  // 36. KLAIBYA / ERECTILE DYSFUNCTION / MALE INFERTILITY
  if (q.includes('klaibya') || q.includes('erectile') || q.includes('impotence') || q.includes('oligospermia') || q.includes('vajikarana')) {
    return {
      pathophysiologySummary:
        'Endothelial nitric oxide (NO)–cGMP pathway impairment in corpus cavernosum smooth muscle, psychogenic sympathetic vasoconstriction, or hypothalamic-pituitary-gonadal axis hypogonadism.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Selective Phosphodiesterase-5 (PDE-5) Inhibitor',
          genericName: 'Tab. Tadalafil 5 mg–10 mg (or Tab. Sildenafil Citrate 50 mg)',
          standardRegimen: 'Tadalafil 5 mg OD daily (or 10 mg–20 mg 60 minutes prior to activity)',
          cautionOrMonitoring: 'STRICTLY CONTRAINDICATED with organic Nitrates (Nitroglycerin/Isosorbide) due to life-threatening hypotension; screen cardiovascular fitness',
        },
        {
          drugClass: 'Endothelial Nitric Oxide Precursor & Spermatogenic Antioxidant',
          genericName: 'Sachet / Tab. L-Arginine 3 g + Coenzyme Q10 (Ubiquinol 100 mg) + L-Carnitine + Lycopene + Zinc',
          standardRegimen: '1 sachet/tablet OD after breakfast for 8–12 weeks',
          cautionOrMonitoring: 'Enhances endothelial NO synthesis and improves sperm motility and morphology',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 390: Sexual Dysfunction",
        "Campbell-Walsh-Wein Urology 12th Edition - Physiology and Management of Erectile Dysfunction",
      ],
    };
  }

  // 37. KARNA SHOOLA / OTITIS MEDIA / OTITIS EXTERNA
  if (q.includes('karna') || q.includes('otitis') || q.includes('earache') || q.includes('ear pain') || q.includes('tinnitus')) {
    return {
      pathophysiologySummary:
        'Eustachian tube dysfunction following upper respiratory infection leading to middle ear effusion and bacterial colonization (S. pneumoniae, H. influenzae) with tympanic membrane bulging and otalgia.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Beta-Lactam + Beta-Lactamase Inhibitor Antibiotic (For Acute Otitis Media)',
          genericName: 'Tab. Amoxicillin 500 mg + Clavulanic Acid 125 mg (Augmentin 625)',
          standardRegimen: '1 tablet BD/TDS after meals for 5–7 days',
          cautionOrMonitoring: 'Eradicates beta-lactamase producing middle ear pathogens; keep ear canal strictly dry',
        },
        {
          drugClass: 'Topical Aural Antibiotic + Anti-Inflammatory + Anesthetic Drops (ONLY if Tympanic Membrane is Intact / Otitis Externa)',
          genericName: 'Ear Drops Ciprofloxacin 0.3% + Dexamethasone 0.1% (or Benzocaine + Chlorbutol + Paradichlorobenzene for impacted wax)',
          standardRegimen: '3–4 drops instilled into affected ear canal TDS for 5 days',
          cautionOrMonitoring: 'Perform otoscopy first; avoid aminoglycoside (Gentamicin/Neomycin) drops if tympanic membrane perforation is present (ototoxicity risk)',
        },
        {
          drugClass: 'Eustachian Tube Decongestant + NSAID Analgesic',
          genericName: 'Tab. Ibuprofen 400 mg + Paracetamol 325 mg + Nasal Drops Xylometazoline 0.1%',
          standardRegimen: '1 tablet BD after meals for otalgia + 2 nasal drops in each nostril TDS for 4 days to open Eustachian tube ostium',
          cautionOrMonitoring: 'Relieves middle ear negative pressure and throbbing earache',
        },
      ],
      textbookReferences: [
        "Dhingra's Diseases of Ear, Nose and Throat 8th Edition - Acute Suppurative Otitis Media & Otitis Externa",
        "Scott-Brown's Otorhinolaryngology Head and Neck Surgery 8th Edition",
      ],
    };
  }

  // 38. NETRA ABHISHYANDA / CONJUNCTIVITIS / DRY EYE
  if (q.includes('netra') || q.includes('abhishyanda') || q.includes('conjunctivitis') || q.includes('eye') || q.includes('red eye')) {
    return {
      pathophysiologySummary:
        'Conjunctival bulbar and palpebral vascular hyperemia, cellular exudation, and tear film instability caused by bacterial (Staphylococcus/Streptococcus), adenoviral, or IgE allergic inflammation.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Topical Fourth-Generation Fluoroquinolone Ophthalmic Solution (For Bacterial / Mucopurulent Conjunctivitis)',
          genericName: 'Eye Drops Moxifloxacin Hydrochloride 0.5% w/v',
          standardRegimen: '1 drop in affected eye(s) 4 times daily (QID) for 5–7 days',
          cautionOrMonitoring: 'STRICTLY AVOID topical steroid eye drops without slit-lamp fluorescein staining (steroids worsen corneal ulcer and Herpetic keratitis)',
        },
        {
          drugClass: 'Dual-Action Mast Cell Stabilizer + H1 Antihistamine Eye Drops (For Allergic / Itchy Conjunctivitis)',
          genericName: 'Eye Drops Olopatadine Hydrochloride 0.1% (or Bepotastine 1.5%)',
          standardRegimen: '1 drop in both eyes BD (12 hours apart)',
          cautionOrMonitoring: 'Relieves ocular itching, chemosis, and papillary reaction',
        },
        {
          drugClass: 'Preservative-Free Tear Film Lubricant',
          genericName: 'Eye Drops Carboxymethylcellulose Sodium 0.5% (or Sodium Hyaluronate 0.1%)',
          standardRegimen: '1–2 drops in both eyes 4–6 times daily',
          cautionOrMonitoring: 'Flushes inflammatory mediators and soothes foreign-body grittiness',
        },
      ],
      textbookReferences: [
        "Parsons' Diseases of the Eye 23rd Edition - Diseases of the Conjunctiva",
        "Khurana's Comprehensive Ophthalmology 7th Edition - Conjunctivitis & Dry Eye Disease",
      ],
    };
  }

  // 39. SHIRAHSHOOLA / ARDHAVABHEDAKA / MIGRAINE / HEADACHE
  if (q.includes('shirah') || q.includes('ardhavabhedaka') || q.includes('migraine') || q.includes('headache') || q.includes('suryavarta')) {
    return {
      pathophysiologySummary:
        'Activation of the trigeminovascular system with neurogenic release of Calcitonin Gene-Related Peptide (CGRP), meningeal vasodilation, and central sensitization causing unilateral throbbing headache, photophobia, and nausea.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Acute Migraine Abortive Therapy (Selective 5-HT1B/1D Receptor Agonist + NSAID)',
          genericName: 'Tab. Sumatriptan 50 mg–85 mg + Naproxen Sodium 500 mg (or Tab. Rizatriptan 10 mg)',
          standardRegimen: '1 tablet orally at the earliest onset of migraine headache (Max 2 doses in 24 hours)',
          cautionOrMonitoring: 'Contraindicated in ischemic heart disease, uncontrolled hypertension, and hemiplegic migraine; limit abortive use to <10 days/month to prevent medication-overuse headache',
        },
        {
          drugClass: 'Prokinetic Antiemetic (Enhances Gastric Motility & Relieves Migraine Nausea)',
          genericName: 'Tab. Domperidone 10 mg (or Tab. Metoclopramide 10 mg)',
          standardRegimen: '1 tablet 15 minutes before meals SOS during acute migraine attack',
          cautionOrMonitoring: 'Overcomes migraine-induced gastroparesis and improves absorption of oral analgesics',
        },
        {
          drugClass: 'First-Line Migraine Prophylaxis (If ≥ 4 Attacks/Month)',
          genericName: 'Tab. Propranolol SR 40 mg (or Tab. Flunarizine 10 mg / Topiramate 25 mg / Amitriptyline 10 mg)',
          standardRegimen: 'Propranolol 40 mg OD or Flunarizine 10 mg HS at bedtime for 3–6 months',
          cautionOrMonitoring: 'Avoid Propranolol in bronchial asthma; Flunarizine may cause mild weight gain or drowsiness',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 430: Migraine and Other Primary Headache Disorders",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - 5-HT Antagonists and Drug Therapy of Migraine",
      ],
    };
  }

  // 39b. RAJAYAKSHMA / PULMONARY TUBERCULOSIS (NTEP / WHO DOTS)
  if (q.includes('rajayakshma') || q.includes('tuberculosis') || q.includes('shosha') || q.includes('koch')) {
    return {
      pathophysiologySummary:
        'Mycobacterium tuberculosis alveolar macrophage infection triggering Th1 granulomatous caseous necrosis, cavitary lung destruction, chronic evening pyrexia, night sweats, and cachexia.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line NTEP Fixed-Dose Anti-Tubercular Therapy (Intensive Phase — 2 Months)',
          genericName: 'FDC Tab. Isoniazid (H 75 mg) + Rifampicin (R 150 mg) + Pyrazinamide (Z 400 mg) + Ethambutol (E 275 mg) [2HRZE]',
          standardRegimen: '3–4 FDC tablets OD orally on empty stomach according to body weight band for 8 weeks',
          cautionOrMonitoring: 'Monitor baseline and monthly LFTs (hepatotoxicity with H, R, Z), serum uric acid (Z), and visual acuity/red-green color vision (E); informs patient of orange urine (R)',
        },
        {
          drugClass: 'Continuation Phase Anti-Tubercular Regimen (4 Months)',
          genericName: 'FDC Tab. Isoniazid (H 75 mg) + Rifampicin (R 150 mg) + Ethambutol (E 275 mg) [4HRE]',
          standardRegimen: '3–4 FDC tablets OD daily for 16 weeks (extended to 9–12 months in CNS/Skeletal TB)',
          cautionOrMonitoring: 'Ensure strict daily adherence and Sputum AFB / GeneXpert conversion at end of Intensive Phase',
        },
        {
          drugClass: 'Mandatory Neuropathy Prophylaxis',
          genericName: 'Tab. Pyridoxine Hydrochloride (Vitamin B6) 20 mg–40 mg',
          standardRegimen: '1 tablet OD daily throughout Isoniazid therapy',
          cautionOrMonitoring: 'Prevents Isoniazid-induced peripheral sensory neuropathy',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 178: Tuberculosis",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Ch. 55: Antitubercular Drugs",
      ],
    };
  }

  // 39c. ASTHI-KSHAYA / OSTEOPOROSIS & METABOLIC BONE DISEASE
  if (q.includes('asthi-kshaya') || q.includes('asthikshaya') || q.includes('osteoporosis') || q.includes('osteopenia')) {
    return {
      pathophysiologySummary:
        'Uncoupling of bone remodeling with excessive RANKL-mediated osteoclastic resorption over osteoblastic bone matrix formation, resulting in reduced bone mineral density (DEXA T-score ≤ -2.5) and microarchitectural fragility.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Antiresorptive Nitrogen-Containing Bisphosphonate',
          genericName: 'Tab. Alendronate Sodium 70 mg (or Tab. Risedronate 35 mg / Inj. Zoledronic Acid 5 mg IV yearly)',
          standardRegimen: '1 tablet (70 mg) orally ONCE WEEKLY early morning on empty stomach with a full glass of plain water; remain upright for 30 minutes',
          cautionOrMonitoring: 'Strict upright posture prevents erosive esophagitis; check serum calcium, Vitamin D, and renal eGFR (>35 mL/min); dental check for osteonecrosis of jaw risk',
        },
        {
          drugClass: 'Bone Mineral Matrix & Vitamin D3 Repletion',
          genericName: 'Tab. Calcium Citrate Malate 500 mg + Calcitriol 0.25 mcg (or Cholecalciferol 60,000 IU weekly x 8 weeks) + Vitamin K2-7',
          standardRegimen: '1 tablet BD after meals (keep ≥ 2-hour gap from Bisphosphonate or iron)',
          cautionOrMonitoring: 'Monitor serum calcium and 24-hour urinary calcium in patients with history of nephrolithiasis',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 411: Osteoporosis",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Hormones & Drugs Affecting Calcium Balance",
      ],
    };
  }

  // 39d. MUTRAGHATA / BENIGN PROSTATIC HYPERPLASIA (BPH) & LUTS
  if (q.includes('mutraghata') || q.includes('vastikundala') || q.includes('prostate') || q.includes('bph') || q.includes('retention')) {
    return {
      pathophysiologySummary:
        'Dihydrotestosterone (DHT)-driven fibromuscular and glandular hyperplasia of the periurethral transition zone of the prostate plus heightened α1A-adrenergic smooth muscle tone at the bladder neck.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Uroselective Alpha-1A Adrenergic Receptor Antagonist (Dynamic Component Relief)',
          genericName: 'Cap. Tamsulosin Hydrochloride 0.4 mg MR (or Cap. Silodosin 8 mg)',
          standardRegimen: '1 capsule OD 30 minutes after dinner daily',
          cautionOrMonitoring: 'Monitor for first-dose postural hypotension and retrograde ejaculation; inform ophthalmologist before cataract surgery (Intraoperative Floppy Iris Syndrome - IFIS)',
        },
        {
          drugClass: '5-Alpha Reductase Inhibitor (Static Prostate Volume Reduction if Prostate > 30–40 cc)',
          genericName: 'Tab. Dutasteride 0.5 mg (or Tab. Finasteride 5 mg)',
          standardRegimen: '1 tablet OD daily for ≥ 6 months (often combined as Tamsulosin 0.4 mg + Dutasteride 0.5 mg)',
          cautionOrMonitoring: 'Reduces serum PSA by ~50% after 6 months (double measured PSA when screening for prostate cancer)',
        },
      ],
      textbookReferences: [
        "Bailey & Love's Short Practice of Surgery 28th Edition - Benign Prostatic Hyperplasia",
        "Campbell-Walsh-Wein Urology 12th Edition - Medical Management of LUTS/BPH",
      ],
    };
  }

  // 39e. SHLIPADA / LYMPHATIC FILARIASIS
  if (q.includes('shlipada') || q.includes('filaria') || q.includes('elephantiasis') || q.includes('lymphedema')) {
    return {
      pathophysiologySummary:
        'Wuchereria bancrofti / Brugia malayi adult worm habitation in afferent lymphatic vessels causing lymphangiectasia, Wolbachia endosymbiont-driven inflammation, and chronic non-pitting fibrotic lymphedema.',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Antifilarial Piperazine Derivative + Broad-Spectrum Anthelmintic',
          genericName: 'Tab. Diethylcarbamazine Citrate (DEC) 100 mg + Tab. Albendazole 400 mg',
          standardRegimen: 'DEC 6 mg/kg/day in 3 divided doses (typically 100 mg TDS after meals) for 12 days + Albendazole 400 mg single stat dose',
          cautionOrMonitoring: 'Monitor for Mazzotti-like febrile inflammatory reaction from dying microfilariae (manage with Paracetamol + Cetirizine)',
        },
        {
          drugClass: 'Anti-Wolbachia Endosymbiont Tetracycline (Macrofilaricidal Sterilization)',
          genericName: 'Cap. Doxycycline 100 mg',
          standardRegimen: '100 mg BD after meals for 4–6 weeks',
          cautionOrMonitoring: 'Depletes symbiotic Wolbachia bacteria, sterilizing adult filarial worms and reducing lymphatic VEGF-C lymphedema',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 233: Filariasis and Related Infections",
        "Park's Textbook of Preventive and Social Medicine 26th Edition - Lymphatic Filariasis",
      ],
    };
  }

  // 39f. YAKRITODARA / PLEEHODARA / FATTY LIVER (NAFLD/MASLD) & CIRRHOSIS
  if (q.includes('yakritodara') || q.includes('pleehodara') || q.includes('fatty liver') || q.includes('cirrhosis') || q.includes('hepatomegaly') || q.includes('splenomegaly')) {
    return {
      pathophysiologySummary:
        'Hepatic insulin resistance and free fatty acid lipotoxicity triggering steatohepatitis, stellate cell activation, sinusoidal portal hypertension, and progressive hepatic fibrosis.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Hydrophilic Hepatoprotective Bile Acid & Anticholestatic',
          genericName: 'Tab. Ursodeoxycholic Acid (UDCA) 300 mg',
          standardRegimen: '1 tablet BD immediately after meals',
          cautionOrMonitoring: 'Stabilizes hepatocyte canalicular membranes, reduces toxic hydrophobic bile acids, and lowers transaminases',
        },
        {
          drugClass: 'Hepatic Lipid Peroxidation Inhibitor (In Non-Diabetic NASH) / Portal Decongestant',
          genericName: 'Cap. Vitamin E (d-Alpha-Tocopherol) 400 IU OD (or Tab. Spironolactone 50 mg + Furosemide 20 mg if Ascites/Portal Hypertension)',
          standardRegimen: '1 capsule/tablet OD after breakfast',
          cautionOrMonitoring: 'Monitor LFTs, FibroScan (LSM/CAP), serum electrolytes, and portal vein Doppler',
        },
      ],
      textbookReferences: [
        "Harrison's Principles of Internal Medicine 21st Edition - Ch. 341: Non-Alcoholic Fatty Liver Disease & Cirrhosis",
        "Sherlock's Diseases of the Liver and Biliary System 13th Edition",
      ],
    };
  }

  // 39g. YONIVYAPAD / VULVOVAGINITIS & PELVIC INFLAMMATORY DISEASE
  if (q.includes('yonivyapad') || q.includes('vaginitis') || q.includes('cervicitis') || q.includes('pelvic inflammatory')) {
    return {
      pathophysiologySummary:
        'Disruption of protective vaginal Lactobacillus acidophilus flora leading to Candida albicans, Trichomonas vaginalis, or polymicrobial ascending cervicovaginal inflammation.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Syndromic Antiprotozoal + Antifungal Vaginal & Systemic Regimen',
          genericName: 'Tab. Fluconazole 150 mg Oral Stat + Vaginal Pessary Clotrimazole 100 mg + Tinidazole/Metronidazole',
          standardRegimen: 'Fluconazole 150 mg single oral dose + 1 vaginal pessary inserted high at bedtime for 6 nights',
          cautionOrMonitoring: 'Treat partner if Trichomoniasis suspected; avoid alcohol during Metronidazole/Tinidazole therapy',
        },
        {
          drugClass: 'Vaginal Microbiome & pH Restoration',
          genericName: 'Cap. Lactobacillus rhamnosus GR-1 + Lactobacillus reuteri RC-14 Probiotic',
          standardRegimen: '1 capsule BD orally for 14 days',
          cautionOrMonitoring: 'Restores physiological vaginal acidic pH (3.8–4.5) and prevents recurrence',
        },
      ],
      textbookReferences: [
        "Shaw's Textbook of Gynaecology 18th Edition - Infections of the Lower Genital Tract",
        "CDC Sexually Transmitted Infections Treatment Guidelines",
      ],
    };
  }

  // 39h. AGNIMANDYA / AJIRNA / ANAHA / FUNCTIONAL DYSPEPSIA & TYMPANITES
  if (q.includes('agnimandya') || q.includes('ajirna') || q.includes('anaha') || q.includes('dyspepsia') || q.includes('indigestion') || q.includes('bloating') || q.includes('flatulence')) {
    return {
      pathophysiologySummary:
        'Impaired gastric fundic accommodation, delayed antral motility, visceral hypersensitivity, and brush-border digestive enzyme insufficiency leading to postprandial fullness, early satiety, and gaseous distension.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Gastroprokinetic (Dopamine D2 Antagonist + Acetylcholinesterase Inhibitor)',
          genericName: 'Tab. Itopride Hydrochloride 50 mg (or Tab. Acotiamide 100 mg for Postprandial Distress Syndrome)',
          standardRegimen: '1 tablet TDS 20 minutes before meals',
          cautionOrMonitoring: 'Enhances antroduodenal coordination without extrapyramidal or QTc prolongation side effects',
        },
        {
          drugClass: 'Pancreatic / Fungal Digestive Enzyme + Defoaming Surfactant',
          genericName: 'Tab./Syrup Alpha-Amylase (Diastase) + Pepsin + Activated Dimethicone / Simethicone 80 mg',
          standardRegimen: '1 tablet or 10 mL immediately after meals TDS',
          cautionOrMonitoring: 'Coalesces trapped gastrointestinal gas bubbles and aids carbohydrate/protein hydrolysis',
        },
      ],
      textbookReferences: [
        "Sleisenger and Fordtran's Gastrointestinal and Liver Disease 11th Edition - Functional Dyspepsia",
        "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Digestants, Antiflatulents and Prokinetics",
      ],
    };
  }

  // 39i. TIMIRA / CATARACT & GLAUCOMA / APACHI / URUSTAMBHA / UPADANSHA
  if (q.includes('timira') || q.includes('cataract') || q.includes('glaucoma') || q.includes('vision')) {
    return {
      pathophysiologySummary:
        'Oxidative crystallization of lens crystallin proteins (Cataract) or elevated intraocular pressure / optic nerve head retinal ganglion cell apoptosis (Open-Angle Glaucoma / Adhimantha).',
      pharmacotherapyStandard: [
        {
          drugClass: 'First-Line Intraocular Pressure Lowering Prostaglandin F2α Analogue (If Glaucoma / Raised IOP)',
          genericName: 'Eye Drops Latanoprost 0.005% (or Eye Drops Timolol Maleate 0.5%)',
          standardRegimen: 'Latanoprost 1 drop in affected eye(s) ONCE daily at bedtime (increases uveoscleral outflow)',
          cautionOrMonitoring: 'Monitor IOP by applanation tonometry, visual fields (perimetry), and optic disc cup-to-disc ratio; definitive management of mature cataract is Phacoemulsification with IOL implantation',
        },
        {
          drugClass: 'Macular & Lenticular Carotenoid Antioxidant (AREDS2 Formula)',
          genericName: 'Cap. Lutein 10 mg + Zeaxanthin 2 mg + Astaxanthin + Bilberry + Zinc + Vitamin C & E',
          standardRegimen: '1 capsule OD after breakfast',
          cautionOrMonitoring: 'Protects retinal photoreceptors and lens fibers from photo-oxidative damage',
        },
      ],
      textbookReferences: [
        "Parsons' Diseases of the Eye 23rd Edition - Diseases of the Lens and Glaucoma",
        "Khurana's Comprehensive Ophthalmology 7th Edition",
      ],
    };
  }

  if (q.includes('apachi') || q.includes('granthi') || q.includes('lymphadenitis') || q.includes('scrofula') || q.includes('upadansha') || q.includes('urustambha')) {
    return {
      pathophysiologySummary:
        'Localized nodal inflammatory hyperplasia, granulomatous lymphadenitis, or neurometabolic lower-limb myofascial stiffness requiring targeted antimicrobial or antispastic therapy.',
      pharmacotherapyStandard: [
        {
          drugClass: 'Targeted First-Line Antimicrobial / Antispastic Agent',
          genericName: q.includes('urustambha')
            ? 'Tab. Baclofen 10 mg (or Tab. Tizanidine 2 mg) + Tab. Methylcobalamin 1500 mcg'
            : 'Tab. Amoxicillin 500 mg + Clavulanic Acid 125 mg (or Tab. Doxycycline 100 mg BD)',
          standardRegimen: '1 tablet BD/TDS after meals for 7–14 days (perform FNAC/Biopsy if cervical lymphadenopathy persists >2 weeks)',
          cautionOrMonitoring: 'Rule out tubercular lymphadenitis (scrofula) by FNAC + GeneXpert before empirical courses',
        },
        {
          drugClass: 'Anti-Inflammatory Proteolytic Enzyme + Analgesic',
          genericName: 'Tab. Trypsin-Chymotrypsin (1,00,000 AU) + Aceclofenac 100 mg + Paracetamol 325 mg',
          standardRegimen: '1 tablet BD after meals for 5 days',
          cautionOrMonitoring: 'Resolves perinodal inflammatory edema and local tenderness',
        },
      ],
      textbookReferences: [
        "Bailey & Love's Short Practice of Surgery 28th Edition - Neck Swellings & Specific Infections",
        "Harrison's Principles of Internal Medicine 21st Edition",
      ],
    };
  }

  // 40. INTELLIGENT CLINICAL FALLBACK FOR ANY OTHER QUERIED DISEASE / SYMPTOM
  return {
    pathophysiologySummary:
      `Targeted cellular, neuro-humoral, and inflammatory response in ${diseaseName} (${symptoms || 'presenting clinical syndrome'}), requiring etiology-specific pharmacotherapy and organ function monitoring.`,
    pharmacotherapyStandard: [
      {
        drugClass: 'First-Line Symptomatic Analgesic / Anti-Inflammatory / Antipyretic',
        genericName: 'Tab. Paracetamol 650 mg (or Tab. Aceclofenac 100 mg + Paracetamol 325 mg if musculoskeletal inflammation)',
        standardRegimen: '1 tablet BD/TDS after meals SOS for pain, fever, or inflammatory discomfort',
        cautionOrMonitoring: 'Assess baseline hepatic and renal function; avoid NSAIDs in peptic ulcer disease or thrombocytopenia',
      },
      {
        drugClass: 'Gastric Mucosal Cytoprotection (PPI + Prokinetic)',
        genericName: 'Cap. Pantoprazole 40 mg + Domperidone 30 mg SR',
        standardRegimen: '1 capsule orally on empty stomach 30 minutes before breakfast',
        cautionOrMonitoring: 'Protects gastroduodenal mucosa during concurrent pharmacotherapy and relieves dyspepsia',
      },
      {
        drugClass: 'Cellular Antioxidant, Neurotropic & Micronutrient Support',
        genericName: 'Tab. Methylcobalamin 1500 mcg + Alpha Lipoic Acid 100 mg + Vitamin D3 + Zinc + Vitamin C',
        standardRegimen: '1 tablet OD after lunch for 4 weeks',
        cautionOrMonitoring: 'Supports tissue repair, immune competence, and metabolic recovery alongside primary Ayurvedic Chikitsa',
      },
    ],
    textbookReferences: [
      "Harrison's Principles of Internal Medicine 21st Edition - McGraw-Hill Medical",
      "KD Tripathi Essentials of Medical Pharmacology 8th Edition - Jaypee Brothers",
      "Davidson's Principles and Practice of Medicine 24th Edition",
    ],
  };
}

export function getModernPharmacologyForDisease(
  diseaseName: string,
  symptoms: string = ''
): ModernDiseasePharmacology {
  const base = getBaseModernPharmacologyForDisease(diseaseName, symptoms);
  const refs =
    base.textbookReferences && base.textbookReferences.length > 0
      ? base.textbookReferences
      : [
          "Harrison's Principles of Internal Medicine 21st Ed",
          "KD Tripathi Essentials of Medical Pharmacology 8th Ed",
          "Katzung's Basic & Clinical Pharmacology 15th Ed",
        ];

  return {
    ...base,
    pharmacotherapyStandard: base.pharmacotherapyStandard.map((item, idx) => ({
      ...item,
      reference:
        item.reference ||
        refs[idx % refs.length] ||
        "KD Tripathi Essentials of Medical Pharmacology 8th Ed / Harrison's 21st Ed",
    })),
  };
}
