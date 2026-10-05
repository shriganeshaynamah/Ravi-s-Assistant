import type { AcharyaClinicalProtocol } from './acharyaProtocols';
import { DISEASE_PROTOCOLS_PART1, buildProtocolsFromConfig } from './acharyaDiseaseProtocolsPart1';

interface CompactAcharyaEntry {
  mentioned?: boolean;
  dRef: string;
  cRef: string;
  nidanaSanskrit: string;
  nidanaTranslit: string;
  nidanaMeaning: string;
  sutra: string;
  chikitsaShlokas: {
    title: string;
    reference: string;
    shlokaSanskrit: string;
    shlokaTransliteration: string;
    meaning: string;
  }[];
  shamana: {
    category: string;
    medicineName: string;
    dosage: string;
    anupana: string;
    timing: string;
    indications: string;
    reference: string;
  }[];
  shodhana: {
    procedure: string;
    indication: string;
    details: string;
  }[];
  paraSurgical?: {
    therapyName: 'Agnikarma' | 'Viddhakarma' | 'Jalaukavacharana' | 'Marma Chikitsa' | 'Other';
    procedureNotes: string;
    siteAndInstruments: string;
  };
}

interface CompactDiseaseSpec {
  charaka: CompactAcharyaEntry;
  sushruta: CompactAcharyaEntry;
  vagbhata: CompactAcharyaEntry;
  chakradatta: CompactAcharyaEntry;
  sharangadhara: CompactAcharyaEntry;
}

function toProtocol(
  acharyaId: 'charaka' | 'sushruta' | 'vagbhata' | 'chakradatta' | 'sharangadhara',
  acharyaName: string,
  sourceTextbook: string,
  e: CompactAcharyaEntry
): AcharyaClinicalProtocol {
  const m = e.mentioned !== false;
  const shlokas = m ? e.chikitsaShlokas : [];
  return {
    acharyaId,
    acharyaName,
    sourceTextbook,
    isDirectlyMentioned: m,
    diseaseReference: m ? e.dRef : 'NA',
    chikitsaSutraReference: m ? e.cRef : 'NA',
    mentionStatusNote: m
      ? `Directly codified in ${e.dRef} with Chikitsa Sutra in ${e.cRef}.`
      : `NA — Not codified as a separate Vyadhi in ${sourceTextbook}.`,
    clinicalPhilosophy: m ? `Classical ${sourceTextbook} protocol (${e.cRef}).` : 'NA',
    shlokaReference: m
      ? {
          shlokaSanskrit: e.nidanaSanskrit,
          shlokaTransliteration: e.nidanaTranslit,
          meaning: e.nidanaMeaning,
          sourceBook: sourceTextbook,
          chapterAndVerse: e.dRef,
        }
      : {
          shlokaSanskrit: 'NA',
          shlokaTransliteration: 'NA',
          meaning: `NA — Not mentioned in ${sourceTextbook}.`,
          sourceBook: 'NA',
          chapterAndVerse: 'NA',
        },
    chikitsaSutra: m ? e.sutra : 'NA',
    chikitsaShlokas: shlokas,
    shamanaChikitsa: m ? e.shamana : [],
    shodhanaChikitsa: m ? e.shodhana : [],
    paraSurgicalTherapy: m ? e.paraSurgical : undefined,
  };
}

function buildCompact(spec: CompactDiseaseSpec): Record<string, AcharyaClinicalProtocol> {
  return {
    charaka: toProtocol('charaka', 'Acharya Charaka', 'Charaka Samhita', spec.charaka),
    sushruta: toProtocol('sushruta', 'Acharya Sushruta', 'Sushruta Samhita', spec.sushruta),
    vagbhata: toProtocol('vagbhata', 'Acharya Vagbhata', 'Ashtanga Hridaya', spec.vagbhata),
    chakradatta: toProtocol('chakradatta', 'Acharya Chakrapani Datta', 'Chakradatta', spec.chakradatta),
    sharangadhara: toProtocol('sharangadhara', 'Acharya Sharangadhara', 'Sharangadhara Samhita', spec.sharangadhara),
  };
}

export function getSpecificDiseaseAcharyaProtocols(
  diseaseQuery: string
): Record<string, AcharyaClinicalProtocol> | null {
  const q = diseaseQuery.toLowerCase();

  // Check Part 1 diseases first
  if (q.includes('vatarakta') || q.includes('gout') || q.includes('uric acid')) {
    return buildProtocolsFromConfig(DISEASE_PROTOCOLS_PART1.vatarakta);
  }
  if (q.includes('manyastambha') || q.includes('cervical')) {
    return buildProtocolsFromConfig(DISEASE_PROTOCOLS_PART1.manyastambha);
  }
  if (q.includes('katigraha') || q.includes('low back') || q.includes('lumbago') || q.includes('lumbar')) {
    return buildProtocolsFromConfig(DISEASE_PROTOCOLS_PART1.katigraha);
  }
  if (q.includes('grahani') || q.includes('ibs') || q.includes('irritable bowel') || q.includes('malabsorption')) {
    return buildProtocolsFromConfig(DISEASE_PROTOCOLS_PART1.grahani);
  }
  if (q.includes('arsha') || q.includes('hemorrhoid') || q.includes('piles')) {
    return buildProtocolsFromConfig(DISEASE_PROTOCOLS_PART1.arsha);
  }

  // 6. BHAGANDARA (FISTULA-IN-ANO)
  if (q.includes('bhagandara') || q.includes('fistula')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 12/96–97 (Shvayathu Chikitsa)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 12/97–98',
        nidanaSanskrit: 'कृमिभिरस्थिसूचीभिर्हर्षणाद्गुदसंश्रयात् । पक्वः पिडको भित्त्वा भगन्दर उदाहृतः ॥',
        nidanaTranslit: 'Kṛmibhir asthisūcībhir harṣaṇād guda-saṁśrayāt | Pakvaḥ piḍako bhittvā bhagandara udāhṛtaḥ ||',
        nidanaMeaning: 'When a perianal abscess (Pidaka) near the Guda suppurates and bursts open forming a discharging sinus tract, it is called Bhagandara.',
        sutra: 'भगन्दरं विरेचयेत्... एष्यात् पाटयेत् क्षारसूत्रेण वा दहेत् ॥ (Ch. Chi. 12/97)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Charaka Bhagandara Chikitsa Sutra (Ksharasutra & Virechana)',
            reference: 'Charaka Samhita, Chikitsa Sthana 12/97–98',
            shlokaSanskrit: 'भगन्दरे विरेकः स्यादेषणं पाटनं तथा । विशुद्धे क्षारसूत्रं वा तैलं व्रणहरं हितम् ॥',
            shlokaTransliteration: 'Bhagandare virekaḥ syād eṣaṇaṁ pāṭanaṁ tathā | Viśuddhe kṣārasūtraṁ vā tailaṁ vraṇaharaṁ hitam ||',
            meaning: 'In Bhagandara, perform Virechana, probing (Eshana), incision (Patana) or ligation with Ksharasutra, and dress with Vranahara Taila.',
          },
        ],
        shamana: [
          {
            category: 'Guggulu Yoga',
            medicineName: 'Triphala Guggulu & Saptavinshati Guggulu',
            dosage: '2 tablets (500 mg) TDS',
            anupana: 'Varunadi Kwatha or warm water',
            timing: 'After meals',
            indications: 'Dries purulent fistula discharge, promotes granulation, and prevents sepsis',
            reference: 'Charaka Samhita, Chikitsa Sthana 12/97 / Bhaishajya Ratnavali',
          },
          {
            category: 'Vrana Ropana Taila',
            medicineName: 'Jatyadi Taila / Madhukadi Taila (Perianal Tract Instillation)',
            dosage: '5 mL tract instillation BD after Sitz bath',
            anupana: 'External use',
            timing: 'Twice daily',
            indications: 'Vrana-Shodhana and Vrana-Ropana of fistulous tract',
            reference: 'Charaka Samhita, Chikitsa Sthana 12/98',
          },
        ],
        shodhana: [
          {
            procedure: 'Ksharasutra Ligation & Triphala-Panchavalkala Avagaha Sweda',
            indication: 'Fistula-in-ano tract cutting and healing (Ch. Chi. 12/97).',
            details: 'Weekly Apamarga Ksharasutra thread change with daily warm Triphala Sitz bath.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Nidana Sthana 4/1–13 (Bhagandara Nidana)',
        cRef: 'Sushruta Samhita, Chikitsa Sthana 8/1–55 & 17/29–33 (Ksharasutra)',
        nidanaSanskrit: 'भगं गुदं बस्तिरिति दारणाच्च भगन्दरः । अपक्वः पिडका प्रोक्ता पक्वस्तु स भगन्दरः ॥',
        nidanaTranslit: 'Bhagaṁ gudaṁ bastir iti dāraṇāc ca bhagandaraḥ | Apakvaḥ piḍakā proktā pakvas tu sa bhagandaraḥ ||',
        nidanaMeaning: 'Because it tears (Darana) the perineum (Bhaga), anal canal (Guda), and bladder region (Basti), it is called Bhagandara; unripe it is Bhagandara-Pidaka, and once suppurated it is Bhagandara.',
        sutra: 'कृशदुर्बलभीरुणां नाडीं मर्मगतां अपि । क्षारसूत्रेण छिन्द्यात्तु न तु शस्त्रेण बुद्धिमान् ॥ (Su. Chi. 17/29–30)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta’s Gold-Standard Ksharasutra Sutra for Bhagandara & Nadi Vrana',
            reference: 'Sushruta Samhita, Chikitsa Sthana 17/29–33 & 8/4',
            shlokaSanskrit: 'एषण्या गतिमन्विष्य क्षारसूत्रानुसारिणीम् । सूचीं निदध्याद्गत्यन्ते तथोन्नीय निबन्धयेत् ॥',
            shlokaTransliteration: 'Eṣaṇyā gatim anviṣya kṣārasūtrānusāriṇīm | Sūcīṁ nidadhyād gatyante tathonnīya nibandhayet ||',
            meaning: 'After probing the fistulous tract with an Eshani (malleable probe), pass the Ksharasutra through the internal opening and tie it snugly for simultaneous cutting and healing.',
          },
          {
            title: 'Shloka 2: Ekadasha Upakrama for Apakva Bhagandara Pidaka',
            reference: 'Sushruta Samhita, Chikitsa Sthana 8/4',
            shlokaSanskrit: 'अपतर्पणालेपपरिषेक... एकादशविधं कर्म पिडकायामपक्वयाम् ॥',
            shlokaTransliteration: 'Apatarpaṇālepa-pariṣeka... ekādaśavidhaṁ karma piḍakāyām apakvayām ||',
            meaning: 'In the unripe Pidaka stage, apply the 11 measures (Apatarpana to Virechana) to prevent fistula formation.',
          },
        ],
        shamana: [
          {
            category: 'Guggulu Yoga',
            medicineName: 'Saptavinshati Guggulu & Navakarshika Guggulu',
            dosage: '2 tablets (500 mg) TDS',
            anupana: 'Khadiradi Kwatha or warm water',
            timing: 'After meals',
            indications: 'Specifically codified for Bhagandara, Nadi Vrana, and sinus tracts',
            reference: 'Sushruta Samhita, Chikitsa Sthana 8 / Bhaishajya Ratnavali 51/16',
          },
          {
            category: 'Vranaropana Taila',
            medicineName: 'Syandana Taila / Jatyadi Taila',
            dosage: 'External tract dressing BD',
            anupana: 'After Panchavalkala Kwatha Sitz bath',
            timing: 'Morning & Evening',
            indications: 'Debrides slough and accelerates healthy granulation of fistulous track',
            reference: 'Sushruta Samhita, Chikitsa Sthana 8/49',
          },
        ],
        shodhana: [
          {
            procedure: 'Apamarga Ksharasutra Therapy (ICMR Validated Sushruta Protocol)',
            indication: 'Definitive surgical cure of low and high anal Bhagandara (Su. Chi. 17/29).',
            details: '21-coating Snuhi-Apamarga-Haridra Ksharasutra cuts and heals at ~1 cm/week with sphincter preservation.',
          },
        ],
        paraSurgical: {
          therapyName: 'Agnikarma',
          procedureNotes: 'Ksharasutra ligation (primary) or Chedana (fistulotomy) followed by Agnikarma / Pratisaraniya Kshara over residual fibrous tract.',
          siteAndInstruments: 'Malleable copper Eshani (probe), Barbour linen thread #20 coated with Snuhi Ksheera, Apamarga Kshara & Haridra.',
        },
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Uttara Sthana 28/1–20 (Bhagandara Pratishedha)',
        cRef: 'Ashtanga Hridaya, Uttara Sthana 28/21–46',
        nidanaSanskrit: 'गुदस्य द्व्यङ्गुलक्षेत्रे पार्श्वतः पिडकातिकृत् । भिन्ना भगन्दरो ज्ञेयः स्रवन्पूयास्रफेनवत् ॥',
        nidanaTranslit: 'Gudasya dvyaṅgula-kṣetre pārśvataḥ piḍakātikṛt | Bhinnā bhagandaro jñeyaḥ sravan pūyāsra-phenavat ||',
        nidanaMeaning: 'A painful Pidaka arising within two Angulas around the anus that bursts and discharges pus, blood, and froth is Bhagandara.',
        sutra: 'पिडकायामपक्वायां शोफवत्समुपाचरेत् । पक्वायां पाटनं क्षारसूत्रं वा योजयेद्भिषक् ॥ (A.H. U. 28/21)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vagbhata Bhagandara Chikitsa',
            reference: 'Ashtanga Hridaya, Uttara Sthana 28/21–30',
            shlokaSanskrit: 'एषयित्वा गतिं सम्यक् पाटयेच्छस्त्रकर्मवित् । अशस्त्रसाध्ये युञ्जीत क्षारसूत्रं विचक्षणः ॥',
            shlokaTransliteration: 'Eṣayitvā gatiṁ samyak pāṭayec chastrakarmavit | Aśastrasādhye yuñjīta kṣārasūtraṁ vicakṣaṇaḥ ||',
            meaning: 'Probe the tract and incise it or apply Ksharasutra along with Guggulu and Vranaropana Tailas.',
          },
        ],
        shamana: [
          {
            category: 'Kashaya & Guggulu',
            medicineName: 'Guggulutiktaka Kashayam (15 mL BD) + Triphala Guggulu (2 tabs TDS)',
            dosage: '15 mL Kashayam + 2 tablets',
            anupana: 'Warm water',
            timing: 'Before & After meals',
            indications: 'Clears deep cryptoglandular Kleda and pus discharge',
            reference: 'Ashtanga Hridaya, Uttara Sthana 28',
          },
        ],
        shodhana: [
          {
            procedure: 'Ksharasutra & Panchavalkala Avagaha Sweda',
            indication: 'Fistulous tract.',
            details: 'Ksharasutra application + warm Sitz bath.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 46/1–12 & Chakradatta Ch. 46 (Bhagandara Chikitsa)',
        cRef: 'Chakradatta, Chapter 46 (Bhagandara Chikitsa)',
        nidanaSanskrit: 'भगन्दरः स विज्ञेयो गुदबस्तिभगोद्भवः... सप्तविंशतिको गुग्गुलुस्तत्र शस्यते ॥',
        nidanaTranslit: 'Bhagandaraḥ sa vijñeyo guda-basti-bhagodbhavaḥ... saptaviṁśatiko guggulus tatra śasyate ||',
        nidanaMeaning: 'Saptavinshati Guggulu and Navakarshika Guggulu are the foremost internal formulations for Bhagandara.',
        sutra: 'त्रिकटु त्रिफला मुस्तं विडङ्गं... सप्तविंशतिको गुग्गुलुर्भगन्दरविनाशनः ॥ (Chakradatta 46/14)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Saptavinshati Guggulu for Bhagandara',
            reference: 'Chakradatta, Bhagandara Chikitsa 46/14–18',
            shlokaSanskrit: 'त्रिकटु त्रिफला मुस्तं विडङ्गामृतचित्रकम्... गुग्गुलुः सप्तविंशतिः भगन्दरनाडीव्रणान् जयेत् ॥',
            shlokaTransliteration: 'Trikaṭu triphalā mustaṁ viḍaṅgāmṛta-citrakam... gugguluḥ saptaviṁśatiḥ bhagandara-nāḍīvraṇān jayet ||',
            meaning: 'Saptavinshati Guggulu containing 27 potent Kledahara-Vranaropana herbs with Guggulu cures Bhagandara and Nadi Vrana.',
          },
        ],
        shamana: [
          {
            category: 'Guggulu Yoga',
            medicineName: 'Saptavinshati Guggulu (2 tabs TDS) & Jatyadi Taila',
            dosage: '2 tablets (500 mg) TDS',
            anupana: 'Warm water',
            timing: 'After meals',
            indications: 'Specifically codified in Chakradatta Ch. 46 for Bhagandara and sinus tracts',
            reference: 'Chakradatta, Bhagandara Chikitsa 46/14–18',
          },
        ],
        shodhana: [
          {
            procedure: 'Ksharasutra & Vrana Shodhana Prakshalana',
            indication: 'Bhagandara.',
            details: 'Tract irrigation with Triphala Kwatha + Ksharasutra.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/61',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 7/68 (Triphala Guggulu) & 9/168 (Jatyadi Taila)',
        nidanaSanskrit: 'गुल्मशोथार्शसां हन्ता भगन्दररुजापहः । त्रिफलागुग्गुलुः श्रेष्ठो जात्यादितैलमेव च ॥',
        nidanaTranslit: 'Gulma-śothārśasāṁ hantā bhagandara-rujāpahaḥ | Triphalā-gugguluḥ śreṣṭho jātyādi-tailam eva ca ||',
        nidanaMeaning: 'Triphala Guggulu internally and Jatyadi Taila locally are the premier Sharangadhara formulations for Bhagandara.',
        sutra: 'जातीनिम्बपटोलपत्रसिक्थैस्तुत्थसमन्वितैः... नाडीव्रणभगन्दरे जात्यादितैलमुत्तमम् ॥ (Sha. Ma. 9/168)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Jatyadi Taila & Triphala Guggulu in Bhagandara',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 9/168–171 & 7/68',
            shlokaSanskrit: 'जातीनिम्बपटोलपत्रकടുकादार्वीनिशासारिवा... नाडीव्रणभगन्दरेषु जात्यादितैलमुत्तमम् ॥',
            shlokaTransliteration: 'Jātī-nimba-paṭola-patra-kaṭukā-dārvī-niśā-sārivā... nāḍīvraṇa-bhagandareṣu jātyādi-tailam uttamam ||',
            meaning: 'Jatyadi Taila and Triphala Guggulu cleanse and heal deep Nadi Vrana and Bhagandara tracts.',
          },
        ],
        shamana: [
          {
            category: 'Guggulu & Taila',
            medicineName: 'Triphala Guggulu (2 tabs TDS) + Jatyadi Taila (Tract Varti)',
            dosage: '2 tablets TDS + Local Varti BD',
            anupana: 'Warm water',
            timing: 'After meals',
            indications: 'Heals fistulous tract and relieves perianal inflammation',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 7/68 & 9/168',
          },
        ],
        shodhana: [
          {
            procedure: 'Ksharasutra & Jatyadi Taila Varti',
            indication: 'Bhagandara.',
            details: 'Ksharasutra + Jatyadi Taila wick dressing.',
          },
        ],
      },
    });
  }

  // 7. PARIKARTIKA (ANAL FISSURE)
  if (q.includes('parikartika') || q.includes('fissure')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Siddhi Sthana 7/54–57 (Basti Vyapad Siddhi)',
        cRef: 'Charaka Samhita, Siddhi Sthana 7/58–63',
        nidanaSanskrit: 'वापित्तोल्बणे दोषे रूक्षस्तीक्ष्णोतिमात्रया... परिकर्तिका भवेत्तत्र त्रिकवङ्क्षणबस्तिषु ॥',
        nidanaTranslit: 'Vāta-pittolbaṇe doṣe rūkṣas tīkṣṇo’timātrayā... parikartikā bhavet tatra trika-vaṅkṣaṇa-bastiṣu ||',
        nidanaMeaning: 'Due to Vata-Pitta aggravation and passage of dry hard stool or sharp instruments, a scissor-like cutting and burning pain (Parikartana-vat vedana) occurs in the anal canal (Guda) — termed Parikartika.',
        sutra: 'परिकर्तिकार्ते सर्पिंषि मधुरौषधसिद्धानि... पिच्छाबस्तिं च योजयेत् ॥ (Ch. Si. 7/58)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Charaka Parikartika Chikitsa (Pichha Basti & Yashtimadhu Ghrita)',
            reference: 'Charaka Samhita, Siddhi Sthana 7/58–62',
            shlokaSanskrit: 'स्वादुशीतौषधैस्तत्र पयसा चानुवासनम् । यष्टीमधुकसिद्धेन सर्पिषा चानुवासयेत् ॥',
            shlokaTransliteration: 'Svādu-śītauṣadhais tatra payasā cānuvāsanam | Yaṣṭīmadhuka-siddhena sarpiṣā cānuvāsayet ||',
            meaning: 'In Parikartika, administer Anuvasana Basti with Yashtimadhu-Siddha Ghrita and cooling Madhura-Sheeta milk enemas (Pichha Basti).',
          },
        ],
        shamana: [
          {
            category: 'Ghrita / Anuvasana',
            medicineName: 'Yashtimadhu Ghrita / Jatyadi Ghrita (Local Application & Matra Basti)',
            dosage: 'Apply locally inside anal margin BD + 15 mL Matra Basti',
            anupana: 'After warm Sitz bath',
            timing: 'Before & after defecation',
            indications: 'Immediately soothes burning/cutting anal pain and heals linear mucosal tear',
            reference: 'Charaka Samhita, Siddhi Sthana 7/58–60',
          },
          {
            category: 'Churna / Vatanulomana',
            medicineName: 'Avipattikar Churna / Gandharvahastadi Eranda Taila',
            dosage: '5 g Churna at bedtime',
            anupana: 'Lukewarm water or warm milk',
            timing: 'Bedtime (Ratri)',
            indications: 'Softens stool (Vata-Pitta Anulomana) to prevent fissure trauma during defecation',
            reference: 'Charaka Samhita, Siddhi Sthana 7',
          },
        ],
        shodhana: [
          {
            procedure: 'Yashtimadhu Ghrita Matra Basti & Pichha Basti',
            indication: 'Acute cutting pain and sphincter spasm in Parikartika (Ch. Si. 7/58).',
            details: '20 mL Yashtimadhu Ghrita per-rectal instillation daily + warm Triphala Sitz bath.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Chikitsa Sthana 34/16 (Virechana-Basti Vyapad)',
        cRef: 'Sushruta Samhita, Chikitsa Sthana 34/17–19',
        nidanaSanskrit: 'गुदे पित्तानिलकൃതो दाहः संपरिकर्तनम् । परिकर्तिकेति तं विद्यात् पिछाबस्तिश्च तद्धितः ॥',
        nidanaTranslit: 'Gude pittānila-kṛto dāhaḥ saṁparikartanam | Parikartiketi taṁ vidyāt picchābastiś ca tad-dhitaḥ ||',
        nidanaMeaning: 'Severe burning (Daha) and scissor-like cutting pain (Parikartana) in the Guda caused by Pitta and Vata is Parikartika; Pichha Basti and Madhura-Ghrita are indicated.',
        sutra: 'यष्टीमधुककृष्णतिलैर्व्रणलेपनम्... घृतमण्डेन वा सेको हितस्तत्रानुवासनम् ॥ (Su. Chi. 34/17)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Parikartika Chikitsa Sutra',
            reference: 'Sushruta Samhita, Chikitsa Sthana 34/16–18',
            shlokaSanskrit: 'गुदे दाहः परिकर्तनं च... पिच्छाबस्तिं सुशीतलं घृतमण्डानुवासनं च कारयेत् ॥',
            shlokaTransliteration: 'Gude dāhaḥ parikartanaṁ ca... picchābastiṁ suśītalaṁ ghṛtamaṇḍānuvāsanaṁ ca kārayet ||',
            meaning: 'In Parikartika, administer cooling Pichha Basti, Ghrita-manda Anuvasana, and local Lepa of Yashtimadhu, Krishna Tila, and Ghrita.',
          },
        ],
        shamana: [
          {
            category: 'Vrana Ropana Ghrita',
            medicineName: 'Jatyadi Ghrita & Yashtimadhu-Tila Kalka Lepa',
            dosage: 'Perianal & intrarectal application TDS',
            anupana: 'After warm Sitz bath',
            timing: 'Before & after defecation and at bedtime',
            indications: 'Heals sentinel fissure ulcer and relaxes anal sphincter spasm',
            reference: 'Sushruta Samhita, Chikitsa Sthana 34/17',
          },
          {
            category: 'Vatanulomana',
            medicineName: 'Abhayarishta (20 mL BD) + Triphala Churna (5 g HS)',
            dosage: '20 mL BD + 5 g HS',
            anupana: 'Warm water',
            timing: 'After meals & Bedtime',
            indications: 'Ensures smooth, effortless stool passage',
            reference: 'Sushruta Samhita, Chikitsa Sthana 34',
          },
        ],
        shodhana: [
          {
            procedure: 'Ushna Jala Avagaha Sweda & Yashtimadhu Taila Matra Basti',
            indication: 'Acute & chronic Parikartika.',
            details: 'Warm Panchavalkala Sitz bath BD + 20 mL Yashtimadhu Taila Matra Basti.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Kalpasiddhi Sthana 3/12–16',
        cRef: 'Ashtanga Hridaya, Kalpasiddhi Sthana 3/17–21',
        nidanaSanskrit: 'तीक्ष्णैर्गुदे परिकर्तनं दाहश्च जायते... परिकर्तिकायां मधुरशीतैर्बस्तिभिराचरेत् ॥',
        nidanaTranslit: 'Tīkṣṇair gude parikartanaṁ dāhaś ca jāyate... parikartikāyāṁ madhura-śītair bastibhir ācaret ||',
        nidanaMeaning: 'Sharp cutting pain and burning in the anal canal is Parikartika, treated with sweet, cooling medicated milk and Ghrita Bastis.',
        sutra: 'परिकर्तिकायां यष्ट्याह्वतिलकल्कैर्घृतान्वितैः... अनुवासनं च शस्यते ॥ (A.H. Ka. 3/17)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vagbhata Parikartika Chikitsa',
            reference: 'Ashtanga Hridaya, Kalpasiddhi Sthana 3/17–20',
            shlokaSanskrit: 'यष्टीमधुकसिद्धेन तैलेन घृतेन वा । अनुवासनं प्रयुञ्जीत परिकर्तिकनाशनम् ॥',
            shlokaTransliteration: 'Yaṣṭīmadhuka-siddhena tailena ghṛtena vā | Anuvāsanaṁ prayuñjīta parikartika-nāśanam ||',
            meaning: 'Anuvasana Basti with Yashtimadhu-Siddha Taila or Ghrita cures Parikartika.',
          },
        ],
        shamana: [
          {
            category: 'Leha & Taila',
            medicineName: 'Sukumara Ghrita / Leha (10 g OD) + Jatyadi Ghrita (Local)',
            dosage: '10 g OD + Local application BD',
            anupana: 'Warm milk',
            timing: 'Morning & Bedtime',
            indications: 'Relieves Vata-Pitta anal spasm and softens stool',
            reference: 'Ashtanga Hridaya, Kalpasiddhi 3/17',
          },
        ],
        shodhana: [
          {
            procedure: 'Yashtimadhu Ksheerapaka Basti & Avagaha Sweda',
            indication: 'Parikartika with severe burning.',
            details: 'Matra Basti with Madhuyashtyadi Taila.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Chakradatta, Chapter 73 (Basti Vyapad / Parikartika Chikitsa)',
        cRef: 'Chakradatta, Chapter 73',
        nidanaSanskrit: 'गुदपरिकर्तने दाहे यष्टीमधुकघृतं हितम् । जात्यादीनां च तैलेन पिचुं दद्याद्विचक्षणः ॥',
        nidanaTranslit: 'Guda-parikartane dāhe yaṣṭīmadhuka-ghṛtaṁ hitam | Jātyādīnāṁ ca tailena picuṁ dadyād vicakṣaṇaḥ ||',
        nidanaMeaning: 'In anal cutting pain and burning, Yashtimadhu Ghrita and Jatyadi Taila Pichu are highly effective.',
        sutra: 'मधुयष्टीतिलैर्युक्तं घृतं गुदरुजापहम् ॥ (Chakradatta)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Yashtimadhu-Tila Ghrita Pichu in Parikartika',
            reference: 'Chakradatta, Niruhadhikara / Vrana Chikitsa',
            shlokaSanskrit: 'समधुयष्टीतिलकल्कं सघृतं व्रणरोपणम् । परिकर्तिकाशमनं गुददाहविनाशनम् ॥',
            shlokaTransliteration: 'Samadhuyaṣṭī-tilakalkaṁ saghṛtaṁ vraṇaropaṇam | Parikartikā-śamanaṁ guda-dāha-vināśanam ||',
            meaning: 'Paste of Yashtimadhu and black sesame with Ghrita heals the anal fissure and eliminates burning pain.',
          },
        ],
        shamana: [
          {
            category: 'Ghrita Pichu & Churna',
            medicineName: 'Jatyadi Ghrita Pichu + Svadishta Virechana Churna (3 g HS)',
            dosage: 'Anal Pichu BD + 3 g Churna HS',
            anupana: 'Warm water',
            timing: 'Twice daily & Bedtime',
            indications: 'Heals anal fissure and prevents hard stool',
            reference: 'Chakradatta, Vrana Chikitsa 44',
          },
        ],
        shodhana: [
          {
            procedure: 'Guda Pichu & Triphala Sitz Bath',
            indication: 'Parikartika.',
            details: 'Jatyadi Ghrita Pichu retention at anal verge.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Uttara Khanda 6 (Basti Kalpana)',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 9/168 (Jatyadi Ghrita/Taila)',
        nidanaSanskrit: 'परिकर्तिकायां पिच्छाबस्तिर्जात्यादिघृतमेव च । त्रिफलागुग्गुलुश्चापि गुदशूलनिवारणः ॥',
        nidanaTranslit: 'Parikartikāyāṁ picchābastir jātyādi-ghṛtam eva ca | Triphalā-gugguluś cāpi gudaśūla-nivāraṇaḥ ||',
        nidanaMeaning: 'Pichha Basti, Jatyadi Ghrita, and Triphala Guggulu relieve anal fissure pain and promote rapid mucosal healing.',
        sutra: 'जात्यादिघृतं सवेदनव्रणरोपणम्... पिच्छाबस्तिश्च परिकर्तिकानाशनः ॥ (Sha. Ma. 9/168 & U. 6)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Jatyadi Ghrita for Savrana-Savedana Guda (Anal Fissure)',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 9/168–171',
            shlokaSanskrit: 'जातीनिम्बपटोलपत्र... सवेदनं व्रणं घोरं शोधयित्वा प्ररोपयेत् ॥',
            shlokaTransliteration: 'Jātī-nimba-paṭola-patra... savedanaṁ vraṇaṁ ghoraṁ śodhayitvā praropayet ||',
            meaning: 'Jatyadi Ghrita/Taila cleanses and heals agonizingly painful ulcers like Parikartika.',
          },
        ],
        shamana: [
          {
            category: 'Ghrita & Guggulu',
            medicineName: 'Jatyadi Ghrita (Local) + Triphala Guggulu (2 tabs BD) + Haritaki Churna (3 g HS)',
            dosage: 'Local BD + 2 tabs BD + 3 g HS',
            anupana: 'Warm water',
            timing: 'After meals & Bedtime',
            indications: 'Analgesic, wound-healing, and stool-softening protocol',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 9/168 & 7/68',
          },
        ],
        shodhana: [
          {
            procedure: 'Matra Basti & Pichha Basti (Uttara Khanda Ch. 6)',
            indication: 'Parikartika.',
            details: '20 mL Yashtimadhu / Jatyadi Taila Matra Basti.',
          },
        ],
      },
    });
  }

  // 8. KAMALA (JAUNDICE / HEPATITIS)
  if (q.includes('kamala') || q.includes('jaundice') || q.includes('hepatitis') || q.includes('liver') || q.includes('bilirubin')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 16/34–38 (Pandu-Kamala Chikitsa)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 16/40–131',
        nidanaSanskrit: 'हारिद्रनेत्रः स भृशं हारिद्रत्वङ्नखाननः । रक्तपीतशकृन्मूत्रो भेकवर्णो हतेन्द्रियः ॥ दाहाविपाकतृष्णावान् कामला बहुपित्तजा ॥',
        nidanaTranslit: 'Hāridra-netraḥ sa bhṛśaṁ hāridra-tvaṅ-nakhānanaḥ | Rakta-pīta-śakṛn-mūtro bhekavarṇo hatendriyaḥ || Dāhāvipāka-tṛṣṇāvān kāmalā bahupittajā ||',
        nidanaMeaning: 'Deep turmeric-yellow discoloration of sclera (Haridra-netra), skin, nails, and face, reddish-yellow urine and stool (Koshthashrita Kamala) or clay-white stool (Tilapishtanibha Varcha in Shakhashrita/Obstructive Kamala) with burning and anorexia.',
        sutra: 'संस्रंश्यो कामली तु स्यान्मृदुभिस्तिक्तकैः॥ (Ch. Chi. 16/40 — Samshodhyo मृदुभिस्तिक्तैः कामली तु विरेचनैः)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Charaka’s Famous Kamala Chikitsa Sutra (Mridu Tikta Virechana)',
            reference: 'Charaka Samhita, Chikitsa Sthana 16/40',
            shlokaSanskrit: 'संशोध्यो मृदुभिस्तिक्तैः कामली तु विरेचनैः । पाण्डुरोगी तु पेयाभिः स्निग्धाभिस्तिक्तकादिभिः ॥',
            shlokaTransliteration: 'Saṁśodhyo mṛdubhis tiktaiḥ kāmalī tu virecanaiḥ | Pāṇḍurogī tu peyābhiḥ snigdhābhis tiktakādibhiḥ ||',
            meaning: 'In Kamala (Jaundice), the patient must be purified with mild, bitter purgatives (Mridu Tikta Virechana) to expel excess Rakta-Pitta through the Koshtha.',
          },
          {
            title: 'Shloka 2: Shakhashrita Kamala (Obstructive Jaundice) Chikitsa',
            reference: 'Charaka Samhita, Chikitsa Sthana 16/124–130',
            shlokaSanskrit: 'तिलपिष्टनिभं यस्तु वर्चः सृजति कामली... कफं जित्वा पित्तं कोष्ठं नयन् भिषक् ॥',
            shlokaTransliteration: 'Tilapiṣṭa-nibhaṁ yas tu varcaḥ sṛjati kāmalī... kaphaṁ jitvā pittaṁ koṣṭhaṁ nayan bhiṣak ||',
            meaning: 'When a Kamala patient passes sesame-paste-like clay-colored stools (Tilapishtanibha — obstructive jaundice), first clear Kapha obstruction with Katu-Amla-Ushna drugs until Pitta returns to Koshtha, then perform Virechana.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha Kalpana',
            medicineName: 'Phalatrikadi Kwatha (Triphala, Amrita, Vasa, Tikta/Katuki, Bhunimba, Nimba)',
            dosage: '40 mL BD',
            anupana: '1 tsp Madhu (Honey) after cooling',
            timing: 'Morning & Evening before meals',
            indications: 'Gold-standard classical formulation for Koshthashrita Kamala, viral hepatitis, and hyperbilirubinemia',
            reference: 'Charaka Samhita, Chikitsa Sthana 16 / Sharangadhara Ma. 2/76',
          },
          {
            category: 'Rasa / Vati',
            medicineName: 'Arogyavardhini Vati (Katuki-pradhana)',
            dosage: '2 tablets (250 mg each) BD',
            anupana: 'Bhumyamalaki Swarasa or Punarnavadi Kwatha',
            timing: 'After meals',
            indications: 'Potent choleretic, hepatoprotective, and Yakrit-Ranjaka Pitta regulator',
            reference: 'Rasaratna Samuchchaya 20/87 & Charaka Chi. 16',
          },
          {
            category: 'Lauha / Mandura',
            medicineName: 'Punarnavadi Mandura / Navayasa Lauha',
            dosage: '250 mg–500 mg BD',
            anupana: 'Takra or warm water',
            timing: 'After meals',
            indications: 'Corrects associated Pandu (anemia) and hepatic congestion',
            reference: 'Charaka Samhita, Chikitsa Sthana 16/70, 93',
          },
        ],
        shodhana: [
          {
            procedure: 'Mridu Tikta Virechana with Katuki / Trivrit & Triphala Kwatha',
            indication: 'Koshthashrita Bahupitta Kamala (Ch. Chi. 16/40).',
            details: 'Snehapana with Tiktaka Ghrita followed by Mridu Virechana with Trivrit Churna (5 g) + Draksha/Triphala Kwatha.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Uttara Tantra 44/10–13 (Pandu-Kamala Pratishedha)',
        cRef: 'Sushruta Samhita, Uttara Tantra 44/14–38',
        nidanaSanskrit: 'पीतनेत्रत्वगास्यत्वं रक्तपीतशकृज्जलम् । कामला नाम सा व्याधिः पाण्डुरोगस्य चोत्तमः ॥',
        nidanaTranslit: 'Pīta-netra-tvag-āsyatvaṁ rakta-pīta-śakṛj-jalam | Kāmalā nāma sā vyādhiḥ pāṇḍurogasya cottamaḥ ||',
        nidanaMeaning: 'Yellowish sclera, skin, and face with dark yellow-reddish urine and feces is Kamala.',
        sutra: 'कल्याणकं पञ्चगव्यं तिक्तकं वा घृतं पिबेत् । त्रिफलायाः कषायेण विरेकं चात्र कारयेत् ॥ (Su. U. 44/22)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Kamala Virechana & Guduchi-Bhumyamalaki Prayoga',
            reference: 'Sushruta Samhita, Uttara Tantra 44/22–28',
            shlokaSanskrit: 'त्रिफलायाः गुडूच्या वा दार्व्या वा निम्बयोस्तथा । प्रातः प्रातः पिबेत्क्वाथं मधुना कामलार्दितः ॥',
            shlokaTransliteration: 'Triphalāyāḥ guḍūcyā vā dārvyā vā nimbayos tathā | Prātaḥ prātaḥ pibet kvāthaṁ madhunā kāmalārditaḥ ||',
            meaning: 'A patient with Kamala should drink the morning decoction of Triphala, Guduchi, Daruharidra, or Nimba mixed with honey.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha',
            medicineName: 'Triphala-Guduchi-Daruharidra-Nimba Kwatha with Madhu',
            dosage: '40 mL every morning',
            anupana: '1 tsp Honey',
            timing: 'Pratah (Empty stomach)',
            indications: 'Direct Sushruta Uttara Tantra 44 yoga for rapid clearance of jaundice',
            reference: 'Sushruta Samhita, Uttara Tantra 44/26',
          },
        ],
        shodhana: [
          {
            procedure: 'Tiktaka Ghrita Snehana & Trivrit Virechana',
            indication: 'Kamala & Halimaka.',
            details: 'Mild purgation with Trivrit + Sharkara.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Nidana Sthana 13/15–20',
        cRef: 'Ashtanga Hridaya, Chikitsa Sthana 16/42–56',
        nidanaSanskrit: 'उपेक्षया च शोफोऽन्ते कामला जायते ततः... कुम्भकामला हलीमकश्च ॥',
        nidanaTranslit: 'Upekṣayā ca śopho’nte kāmalā jāyate tataḥ... kumbhakāmalā halīmakaś ca ||',
        nidanaMeaning: 'Excessive Pitta vitiating Rakta and Mamsa produces Kamala, which if neglected progresses to Kumbhakamala (cirrhosis/ascites).',
        sutra: 'कामलायां तु पित्तघ्नं पाण्डुरोगाविरोधि यत्... विरेचनं तिक्तघृतैर्हितम् ॥ (A.H. Chi. 16/42)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vagbhata Kamala Chikitsa',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 16/42–46',
            shlokaSanskrit: 'कलिङ्गकादिं... फलत्रिकादिक्वाथं च कामलार्तः पिबेन्नरः ॥',
            shlokaTransliteration: 'Kaliṅgakādiṁ... phalatrikādi-kvāthaṁ ca kāmalārtaḥ piben naraḥ ||',
            meaning: 'Administer Pittaghna-Panduhara formulations, Tiktaka Ghrita, and Phalatrikadi Kwatha in Kamala.',
          },
        ],
        shamana: [
          {
            category: 'Kashaya & Arishta',
            medicineName: 'vasaguluchyadi Kashayam (15 mL BD) + Rohitakarishta (20 mL BD)',
            dosage: '15 mL Kashayam + 20 mL Arishta BD',
            anupana: 'Warm water',
            timing: 'Before & After meals',
            indications: 'Clears hepatobiliary Pitta congestion and hepatosplenomegaly',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 16/13',
          },
        ],
        shodhana: [
          {
            procedure: 'Nitya Mridu Virechana with Avipattikar / Katuki',
            indication: 'Kamala.',
            details: 'Daily mild biliary drainage.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 8/16–23 & Chakradatta Ch. 8 (Pandu-Kamala Chikitsa)',
        cRef: 'Chakradatta, Chapter 8/25–45',
        nidanaSanskrit: 'त्रिफलाया गुडूच्या वा दार्व्या वा निम्बयोस्तथा । फलत्रिकादिक्वाथश्च पाण्डुकामलानाशनः ॥',
        nidanaTranslit: 'Triphalāyā guḍūcyā vā dārvyā vā nimbayos tathā | Phalatrikādi-kvāthaś ca pāṇḍu-kāmalā-nāśanaḥ ||',
        nidanaMeaning: 'Phalatrikadi Kwatha and Drona-Pushpi / Anjana Nasya cure Pandu and Kamala.',
        sutra: 'फलत्रिकामृतावासातिक्ताभूनिम्बनिम्बजाः । क्वाथः क्षौद्रयुतः पीतः पाण्डुकामलानाशनः ॥ (Chakradatta 8/28)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Famous Phalatrikadi Kwatha Shloka for Pandu & Kamala',
            reference: 'Chakradatta, Pandu-Kamala Chikitsa 8/28 & Sharangadhara Ma. 2/76',
            shlokaSanskrit: 'फलत्रिकामृतावासातिक्ताभूनिम्बनिम्बजाः । क्वाथः क्षौद्रयुतः पीतः पाण्डुकामलानाशनः ॥',
            shlokaTransliteration: 'Phalatrikāmṛtā-vāsā-tiktā-bhūnimba-nimbajāḥ | Kvāthaḥ kṣaudrayutaḥ pītaḥ pāṇḍu-kāmalā-nāśanaḥ ||',
            meaning: 'Decoction of Triphala, Guduchi, Vasa, Katuki (Tikta), Kiratatikta (Bhunimba), and Nimba taken with honey destroys Pandu and Kamala.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Swarasa',
            medicineName: 'Phalatrikadi Kwatha (40 mL BD) + Bhumyamalaki Swarasa (20 mL BD)',
            dosage: '40 mL Kwatha + 20 mL Swarasa BD',
            anupana: 'Honey',
            timing: 'Before meals',
            indications: 'Antiviral (HBV/HEV/HAV), choleretic, and bilirubin-lowering classical protocol',
            reference: 'Chakradatta, Pandu-Kamala Chikitsa 8/28',
          },
        ],
        shodhana: [
          {
            procedure: 'Katuki-Trivrit Mridu Virechana',
            indication: 'Koshthashrita Kamala.',
            details: '3 g Katuki + Trivrit Churna with warm water.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/24',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 2/76 (Phalatrikadi Kwatha)',
        nidanaSanskrit: 'फलत्रिकामृतावासातिक्ताभूनिम्बनिम्बजाः । क्वाथः क्षौद्रयुतः पीतः पाण्डुकामलानाशनः ॥',
        nidanaTranslit: 'Phalatrikāmṛtā-vāsā-tiktā-bhūnimba-nimbajāḥ | Kvāthaḥ kṣaudrayutaḥ pītaḥ pāṇḍu-kāmalā-nāśanaḥ ||',
        nidanaMeaning: 'Sharangadhara Samhita Madhyama Khanda 2/76 codifies Phalatrikadi Kwatha as the specific authoritative decoction for Pandu and Kamala.',
        sutra: 'फलत्रिकादिक्वाथश्च कुमार्यासव एव च... कामलापाण्डुरोगघ्नः ॥ (Sha. Ma. 2/76 & 10/18)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Phalatrikadi Kwatha & Kumaryasava',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 2/76 & 10/18–27',
            shlokaSanskrit: 'फलत्रिकामृतावासातिक्ताभूनिम्बनिम्बजाः । क्वाथः क्षौद्रयुतः पीतः पाण्डुकामलानाशनः ॥',
            shlokaTransliteration: 'Phalatrikāmṛtā-vāsā-tiktā-bhūnimba-nimbajāḥ | Kvāthaḥ kṣaudrayutaḥ pītaḥ pāṇḍu-kāmalā-nāśanaḥ ||',
            meaning: 'Phalatrikadi Kwatha with honey and Kumaryasava restore Yakrit function and cure Kamala.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Asava',
            medicineName: 'Phalatrikadi Kwatha (40 mL BD) + Kumaryasava (15 mL BD) + Arogyavardhini Vati (2 tabs BD)',
            dosage: '40 mL Kwatha + 15 mL Asava + 2 tabs BD',
            anupana: 'Honey / Warm water',
            timing: 'Before & After meals',
            indications: 'Normalizes serum bilirubin, SGPT/SGOT, and relieves anorexia',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 2/76 & 10/18',
          },
        ],
        shodhana: [
          {
            procedure: 'Mridu Virechana with Aragwadhadi / Triphala Kwatha',
            indication: 'Kamala.',
            details: 'Gentle biliary purgation.',
          },
        ],
      },
    });
  }

  // 9. ATISARA / PRAVAHIKA (DIARRHEA / DYSENTERY)
  if (q.includes('atisara') || q.includes('pravahika') || q.includes('diarrhea') || q.includes('dysentery')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 19/5–11 (Atisara Chikitsa)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 19/14–123',
        nidanaSanskrit: 'अग्निं सन्नाश्य कोष्ठस्थो वायुरम्बुप्रदूषितः... बहुद्रवमंतीसारं तत्प्रकुर्वन्ति देहिनाम् ॥',
        nidanaTranslit: 'Agniṁ sannāśya koṣṭhastho vāyur ambu-pradūṣitaḥ... bahudravam atīsāraṁ tat prakurvanti dehinām ||',
        nidanaMeaning: 'Extinguishing Jatharagni and drawing fluid from Dhatus into the gut, vitiated Doshas cause frequent watery stools (Atisara); when Kapha-Sama mucus is passed repeatedly with tenesmus, it is Pravahika.',
        sutra: 'आमं लङ्घनपाचनैर्जयति... पक्वं तु स्तम्भनैर्जयेत् । न तु संग्रहणं दद्यात् पूर्वमामातिसारिणे ॥ (Ch. Chi. 19/14–19)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Golden Rule of Atisara Chikitsa (Ama vs Pakva Stage)',
            reference: 'Charaka Samhita, Chikitsa Sthana 19/14–19',
            shlokaSanskrit: 'न तु संग्रहणं दद्यात् पूर्वमामातिसारिणे... लङ्घनं तस्य भैषज्यं पाचनं चातिसारिणः ॥',
            shlokaTransliteration: 'Na tu saṁgrahaṇaṁ dadyāt pūrvam āmātisāriṇe... laṅghanaṁ tasya bhaiṣajyaṁ pācanaṁ cātisāriṇaḥ ||',
            meaning: 'Never administer bowel-binding (Sangrahana/Stambhana) drugs initially in Ama-Atisara; first perform Langhana and Ama-Pachana, and only in Pakva-Atisara give Stambhana (Kutaja, Bilva).',
          },
          {
            title: 'Shloka 2: Kutaja — Agrya Aushadha for Atisara & Pravahika',
            reference: 'Charaka Samhita, Sutrasthana 25/40 & Chikitsa 19/51',
            shlokaSanskrit: 'कुटजस्त्वक् सङ्ग्राहिक-श्लेष्मपित्तरक्तोपशोषणोपशमनानाम् ॥',
            shlokaTransliteration: 'Kuṭajas tvak saṅgrāhika-śleṣma-pitta-raktopaśoṣaṇopaśamanānām ||',
            meaning: 'Kutaja bark and Indrayava are the foremost astringent-antidiarrheal herbs for checking Atisara and Raktatisara.',
          },
        ],
        shamana: [
          {
            category: 'Ghana Vati & Arishta',
            medicineName: 'Kutajaghanavati (2 tabs TDS) + Kutajarishta (20 mL BD)',
            dosage: '2 tablets (500 mg) TDS + 20 mL BD',
            anupana: 'Takra (Buttermilk) or Shadanga Paniyam',
            timing: 'After meals',
            indications: 'Checks watery diarrhea, amoebic dysentery (Pravahika), and intestinal hypermotility',
            reference: 'Charaka Samhita, Chikitsa Sthana 19/51–62',
          },
          {
            category: 'Paniya / Churna',
            medicineName: 'Shadanga Paniyam (Musta, Parpataka, Ushira, Chandana, Udichya, Nagara) + Bilwadi Churna',
            dosage: 'Sip Shadanga Paniyam throughout day + 3 g Bilwadi Churna TDS',
            anupana: 'Boiled cooled water',
            timing: 'Throughout day',
            indications: 'Prevents dehydration (Trishna-nigrahana), digests Ama, and binds loose stools',
            reference: 'Charaka Samhita, Chikitsa Sthana 19/22',
          },
        ],
        shodhana: [
          {
            procedure: 'Pichha Basti (Mocharasa-Shalmali Siddha)',
            indication: 'Pravahika (tenesmus with mucus/blood) and Raktatisara (Ch. Chi. 19/93).',
            details: 'Soothing demulcent Pichha Basti with Shalmali Vrinta, Mocharasa, Ghrita, and Ksheera.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Uttara Tantra 40/1–34 (Atisara-Pravahika Pratishedha)',
        cRef: 'Sushruta Samhita, Uttara Tantra 40/35–165',
        nidanaSanskrit: 'संशम्यमानो बहुशो द्रवं प्रच्यावयन् गुदात्... अतिसार इति ज्ञेयः प्रवाहणान्मुहुः प्रवाहिका ॥',
        nidanaTranslit: 'Saṁśamyamāno bahuśo dravaṁ pracyāvayan gudāt... atisāra iti jñeyaḥ pravāhaṇān muhuḥ pravāhikā ||',
        nidanaMeaning: 'Frequent passage of liquid stool is Atisara; repeated straining (Pravahana) with scant mucus/blood is Pravahika.',
        sutra: 'आमातिसारे लङ्घनं पाचनं च... पक्वे कुटजबिल्वादिस्तम्भनं पिच्छबस्तयः ॥ (Su. U. 40/35)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Atisara & Pravahika Chikitsa',
            reference: 'Sushruta Samhita, Uttara Tantra 40/35–68',
            shlokaSanskrit: 'कुटजं दाडिमं बिल्वं बालं मुस्तं सनागरम्... सर्वानतीसारान् जयेच्छीघ्रं सप्रवाहिकान् ॥',
            shlokaTransliteration: 'Kuṭajaṁ dāḍimaṁ bilvaṁ bālaṁ mustaṁ sanāgaram... sarvān atīsārān jayec chīghraṁ sapravāhikān ||',
            meaning: 'Kutaja, Dadima, unripe Bilva fruit, Musta, and Sunthi rapidly cure Atisara and Pravahika.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Vati',
            medicineName: 'Kutajadi Kwatha + Sanjivani Vati (1 tab TDS)',
            dosage: '40 mL Kwatha + 1 tab TDS',
            anupana: 'Warm water',
            timing: 'After meals',
            indications: 'Ama-pachana and Stambhana in acute gastroenteritis and dysentery',
            reference: 'Sushruta Samhita, Uttara Tantra 40/46',
          },
        ],
        shodhana: [
          {
            procedure: 'Pichha Basti',
            indication: 'Pravahika with severe tenesmus and rectal bleeding.',
            details: 'Per-rectal instillation of Mocharasa-Ksheera Pichha Basti.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Nidana Sthana 8/1–14',
        cRef: 'Ashtanga Hridaya, Chikitsa Sthana 9/1–124 (Atisara Chikitsa)',
        nidanaSanskrit: 'अतिसारः स्मृतोऽत्यर्थं सरणाद्द्रववर्चसः... बद्धं सपिच्छं बहुशः प्रवाहणयुतं प्रवाहिका ॥',
        nidanaTranslit: 'Atisāraḥ smṛto’tyarthaṁ saraṇād drava-varcasaḥ... baddhaṁ sapicchaṁ bahuśaḥ pravāhaṇayutaṁ pravāhikā ||',
        nidanaMeaning: 'Excessive flow of liquid stool is Atisara; frequent tenesmus with mucoid stool is Pravahika.',
        sutra: 'दोषाः सन्निचिताः कोष्ठे... लङ्घनमेवादौ शस्तं पाचनमौषधम् ॥ (A.H. Chi. 9/2)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vagbhata Dadimavaleha & Kutajavaleha in Atisara',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 9/18–45',
            shlokaSanskrit: 'मुस्ताखुपर्णीबिल्वानि... कुटजावलेहः सर्वातिसारप्रवाहिकापहः ॥',
            shlokaTransliteration: 'Mustākhuparṇī-bilvāni... kuṭajāvalehaḥ sarvātisāra-pravāhikāpahaḥ ||',
            meaning: 'Musta, Bilva, and Kutajavaleha eliminate all types of Atisara and Pravahika.',
          },
        ],
        shamana: [
          {
            category: 'Avaleha & Kashaya',
            medicineName: 'Kutajavaleha (5 g BD) + Vilwadi Gulika (2 tabs TDS)',
            dosage: '5 g + 2 tablets',
            anupana: 'Takra or Shadanga Paniyam',
            timing: 'After meals',
            indications: 'Stops infective diarrhea, enterocolitis, and abdominal cramps',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 9',
          },
        ],
        shodhana: [
          {
            procedure: 'Pichha Basti',
            indication: 'Raktatisara & Pravahika.',
            details: 'Demulcent enema to soothe inflamed colonic mucosa.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 3/1–24 & Chakradatta Ch. 3 (Atisara Chikitsa)',
        cRef: 'Chakradatta, Chapter 3 (Atisara Chikitsa)',
        nidanaSanskrit: 'धान्यनागरमुस्ताम्बु... कुटजत्वक्कृतः क्वाथो हन्ति सर्वमतीसारम् ॥',
        nidanaTranslit: 'Dhānya-nāgara-mustāmbu... kuṭajatvak-kṛtaḥ kvātho hanti sarvam atīsāram ||',
        nidanaMeaning: 'Dhanyapanchaka Kwatha for Ama-Atisara and Kutaja-Dadima Kwatha for Pakva-Atisara are the classical Chakradatta remedies.',
        sutra: 'धान्यं नागरं मुस्तं बालकं बिल्वमेव च । आमशूलविबन्धघ्नं पाचनं वह्निदीपनम् ॥ (Chakradatta 3/14 — Dhanyapanchaka Kwatha)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Dhanyapanchaka Kwatha for Ama-Atisara & Shoola',
            reference: 'Chakradatta, Atisara Chikitsa 3/14',
            shlokaSanskrit: 'धान्यं नागरं मुस्तं बालकं बिल्वमेव च । आमशूलविबन्धघ्नं पाचनं वह्निदीपनम् ॥',
            shlokaTransliteration: 'Dhānyaṁ nāgaraṁ mustaṁ bālakaṁ bilvam eva ca | Āma-śūla-vibandhaghnaṁ pācanaṁ vahni-dīpanam ||',
            meaning: 'Dhanyapanchaka Kwatha (Dhanyaka, Sunthi, Musta, Hribera/Balaka, and Bilva) digests Ama, relieves abdominal colic, and kindles Agni in Atisara.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Vati',
            medicineName: 'Dhanyapanchaka Kwatha (40 mL BD) + Kutajaghanavati (2 tabs TDS)',
            dosage: '40 mL BD + 2 tablets TDS',
            anupana: 'Tandulodaka or Takra',
            timing: 'Before & After meals',
            indications: 'Digests Ama and stops watery/mucoid diarrhea',
            reference: 'Chakradatta, Atisara Chikitsa 3/14 & 3/52',
          },
        ],
        shodhana: [
          {
            procedure: 'Langhana & Pichha Basti',
            indication: 'Acute Atisara & Pravahika.',
            details: 'Fasting/Peya krama initially; Pichha Basti if tenesmus persists.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/19',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 2/58 (Vatsakadi Kwatha), 6/42 (Gangadhara Churna) & 7/20 (Sanjivani Vati)',
        nidanaSanskrit: 'वत्सकादिकषायश्च चूर्णं गङ्गाधरं तथा । कुटजारिष्टसंयुक्तं सर्वातीसारनाशनम् ॥',
        nidanaTranslit: 'Vatsakādi-kaṣāyaś ca cūrṇaṁ gaṅgādharaṁ tathā | Kuṭajāriṣṭa-saṁyuktaṁ sarvātīsāra-nāśanam ||',
        nidanaMeaning: 'Vatsakadi Kwatha, Gangadhara Churna, Sanjivani Vati, and Kutajarishta cure all types of Atisara and Pravahika.',
        sutra: 'वत्सकं सातिविषं बिल्वं मुस्तं मोचरसं तथा... सामे सशूले सरक्ते वत्सकादिः प्रशस्यते ॥ (Sha. Ma. 2/58)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vatsakadi Kwatha for Sama-Sashoola-Sarakta Atisara',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 2/58',
            shlokaSanskrit: 'वत्सकः सातिविषो बिल्वं मुस्तं मोचरसस्तथा । सामे सशूले सरक्ते चिरप्रवृत्तेऽतिसारे हितः ॥',
            shlokaTransliteration: 'Vatsakaḥ sātiviṣo bilvaṁ mustaṁ mocarasas tathā | Sāme saśūle sarakte cirapravṛtte’tisāre hitaḥ ||',
            meaning: 'Vatsakadi Kwatha (Kutaja/Indrayava, Ativisha, Bilva, Musta, Mocharasa) cures Sama, painful, bloody, and chronic Atisara.',
          },
        ],
        shamana: [
          {
            category: 'Churna, Vati & Arishta',
            medicineName: 'Gangadhara Churna (3 g TDS) + Sanjivani Vati (1 tab TDS) + Kutajarishta (20 mL BD)',
            dosage: '3 g + 1 tab + 20 mL',
            anupana: 'Takra or Tandulodaka',
            timing: 'After meals',
            indications: 'Complete Sharangadhara textbook triad for Atisara and Pravahika',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 2/58, 6/42 & 10/44',
          },
        ],
        shodhana: [
          {
            procedure: 'Pichha Basti (Uttara Khanda Ch. 6)',
            indication: 'Pravahika & Raktatisara.',
            details: 'Mocharasa Siddha Pichha Basti.',
          },
        ],
      },
    });
  }

  // 10. KASA (COUGH / BRONCHITIS)
  if (q.includes('kasa') || q.includes('cough') || q.includes('bronchitis')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 18/6–8 (Kasa Chikitsa)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 18/31–189',
        nidanaSanskrit: 'अधःप्रतिहतो वायुरूर्ध्वं स्रोतः समाश्रितः । उदानभावमापन्नः कण्ठे सक्तस्तथाोरसि ॥ भिन्नकांस्यस्वनेनेव घोषवान् कास उच्यते ॥',
        nidanaTranslit: 'Adhaḥ-pratihato vāyur ūrdhvaṁ srotaḥ samāśritaḥ | Udāna-bhāvam āpannaḥ kaṇṭhe saktas tathorasi || Bhinna-kāṁsya-svaneneva ghoṣavān kāsa ucyate ||',
        nidanaMeaning: 'Prana and Apana Vata obstructed downward move upward into the chest and throat, assuming the character of Udana Vayu and exiting the mouth with a explosive sound like a cracked bronze vessel (Bhinna-kamsya-svana) — this is Kasa (5 types: Vataja, Pittaja, Kaphaja, Kshataja, Kshayaja).',
        sutra: 'रूक्षस्य वातजं कासं आदौ स्नेहैरुपाचरेत्... पैत्तिके स्रंसनं शस्तं कफजे वमनं हितम् ॥ (Ch. Chi. 18/31, 83, 108)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Charaka’s Specific Chikitsa Sutra for Vataja, Pittaja & Kaphaja Kasa',
            reference: 'Charaka Samhita, Chikitsa Sthana 18/31, 83, 108',
            shlokaSanskrit: 'रूक्षस्य वातजं कासमादौ स्नेहैरुपाचरेत्... कफकासी तु बलवान् वमनेनोपपादयेत् ॥',
            shlokaTransliteration: 'Rūkṣasya vātajaṁ kāsam ādau snehair upācaret... kaphakāsī tu balavān vamanenopapādayet ||',
            meaning: 'Treat Vataja (dry) Kasa first with Snehana (Kantakari Ghrita, Bastis); Pittaja Kasa with Madhura-Sheeta Virechana and Lehas; and Kaphaja (productive) Kasa with Vamana, Tikshna-Ushna Katu drugs (Sitopaladi, Talishadi, Agastya Haritaki).',
          },
          {
            title: 'Shloka 2: Sitopaladi Churna — Classical Formulation by Acharya Charaka',
            reference: 'Charaka Samhita, Chikitsa Sthana 8/103–104 & 18',
            shlokaSanskrit: 'सितोपलां तुगाक्षीरीं पिप्पलीं बहुलां त्वचम् । अन्त्यार्धोर्ध्वस्थितान् भागान् दद्यान्मधुघृतप्लुतान् ॥',
            shlokaTransliteration: 'Sitopalāṁ tugākṣīrīṁ pippalīṁ bahulāṁ tvacam | Antyārdhordhvasthitān bhāgān dadyān madhu-ghṛta-plutān ||',
            meaning: 'Sitopaladi Churna (Mishri 16 parts, Vamshalochana 8, Pippali 4, Ela 2, Twak 1) licked with honey and Ghrita in unequal proportion cures Kasa, Shwasa, and Jwara.',
          },
        ],
        shamana: [
          {
            category: 'Churna Kalpana',
            medicineName: 'Sitopaladi Churna (3 g) + Talishadi Churna (2 g)',
            dosage: '3 g–5 g TDS/QID',
            anupana: 'Unequal quantity of Madhu (Honey) & Goghrita',
            timing: 'After meals & SOS during cough paroxysm',
            indications: 'Soothes bronchial mucosa in dry Vataja/Pittaja Kasa and liquefies sputum in Kaphaja Kasa',
            reference: 'Charaka Samhita, Chikitsa Sthana 8/103–104 & 8/145',
          },
          {
            category: 'Avaleha / Rasayana',
            medicineName: 'Agastya Haritaki Rasayana / Chitraka Haritaki',
            dosage: '10 g BD',
            anupana: 'Lukewarm water or warm milk',
            timing: 'Morning & Bedtime',
            indications: 'Strengthens Pranavaha Srotas and cures chronic bronchitis, allergic cough, and Kshayaja Kasa',
            reference: 'Charaka Samhita, Chikitsa Sthana 18/57–62',
          },
          {
            category: 'Vati / Gutika',
            medicineName: 'Lavangadi Vati / Khadiradi Vati (Lozenge)',
            dosage: '1–2 tablets kept in mouth for slow dissolution QID',
            anupana: 'Kanthya lozenge',
            timing: 'Every 4–6 hours',
            indications: 'Relieves pharyngeal irritation and laryngeal cough reflex',
            reference: 'Charaka Samhita, Chikitsa Sthana 18 / Vaidya Jeevanam',
          },
        ],
        shodhana: [
          {
            procedure: 'Vamana Karma (For Kaphaja Kasa) & Kantakari Ghrita Snehapana (For Vataja Kasa)',
            indication: 'Productive Kaphaja Kasa (Ch. Chi. 18/108) and dry Vataja Kasa (Ch. Chi. 18/31).',
            details: 'Uro-abhyanga with Saindhavadi Taila + Nadi Sweda over chest followed by Vamana or Shamananga Snehapana.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Uttara Tantra 52/1–12 (Kasa Pratishedha)',
        cRef: 'Sushruta Samhita, Uttara Tantra 52/13–47',
        nidanaSanskrit: 'प्राणोदानौ समागम्य कण्ठोरःस्रोतसि स्थितौ... भिन्नकांस्यनिभं घोषं जनयन् कास उच्यते ॥',
        nidanaTranslit: 'Prāṇodānau samāgamya kaṇṭhoraḥ-srotasi sthitau... bhinna-kāṁsya-nibhaṁ ghoṣaṁ janayan kāsa ucyate ||',
        nidanaMeaning: 'Prana Vayu colliding with Udana Vayu in the throat and chest produces Kasa.',
        sutra: 'कण्टकारीघृतं वाते पित्ते वासाघृतं हितम् । कफे व्योषत्रिवृत्सिद्धं कुर्याच्च वमनं भिषक् ॥ (Su. U. 52)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Kasa Chikitsa (Kantakari & Vasa Prayoga)',
            reference: 'Sushruta Samhita, Uttara Tantra 52/14–38',
            shlokaSanskrit: 'कण्टकारीरसे सिद्धं सर्पिः कासहरं परम् । वासायाः स्वरसो क्षौद्रयुक्तः पित्तकफापहः ॥',
            shlokaTransliteration: 'Kaṇṭakārī-rase siddhaṁ sarpiḥ kāsaharaṁ param | Vāsāyāḥ svaraso kṣaudra-yuktaḥ pitta-kaphāpahaḥ ||',
            meaning: 'Kantakari Ghrita is supreme for Vata-Kaphaja Kasa, while Vasa Swarasa with honey cures Pittaja and Raktaja/Kshataja Kasa.',
          },
        ],
        shamana: [
          {
            category: 'Avaleha & Ghrita',
            medicineName: 'Vyaghri Haritaki Avaleha (10 g BD) & Kantakari Ghrita (5 mL BD)',
            dosage: '10 g BD + 5 mL BD',
            anupana: 'Warm water',
            timing: 'Morning & Night',
            indications: 'Bronchodilator, mucolytic, and antitussive action',
            reference: 'Sushruta Samhita, Uttara Tantra 52',
          },
        ],
        shodhana: [
          {
            procedure: 'Vamana & Dhumapana (Medicated Herbal Smoking)',
            indication: 'Residual Kapha in Pranavaha Srotas after Kasa (Su. U. 52/30).',
            details: 'Manahshiladi Dhumapana after Vamana.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Nidana Sthana 3/1–16',
        cRef: 'Ashtanga Hridaya, Chikitsa Sthana 3/1–179 (Kasa Chikitsa)',
        nidanaSanskrit: 'पञ्च कासाः स्मृता वातपित्तश्लेष्मक्षतक्षयैः । क्षयाय उपेक्षिताः सर्वे बलिनश्चोत्तरोत्तरम् ॥',
        nidanaTranslit: 'Pañca kāsāḥ smṛtā vāta-pitta-śleṣma-kṣata-kṣayaiḥ | Kṣayāya upekṣitāḥ sarve balinaś cottarottaram ||',
        nidanaMeaning: 'There are 5 types of Kasa (Vataja, Pittaja, Kaphaja, Kshataja, Kshayaja), each progressively more severe; if neglected, they lead to Kshaya.',
        sutra: 'वासां पथ्यां विभीतं च... तालीसपत्रचूर्णं च कासश्वासहरं परम् ॥ (A.H. Chi. 3)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vagbhata Talishadi Churna & Dashamoolakatutraya Kashaya',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 3/50–130',
            shlokaSanskrit: 'तालीसपत्रं मरिचं नागरं पिप्पली शुभा... कासश्वासज्वरच्छर्दिग्रहणीदोषनाशनम् ॥',
            shlokaTransliteration: 'Tālīsapatraṁ maricaṁ nāgaraṁ pippalī śubhā... kāsa-śvāsa-jvara-cchardi-grahaṇī-doṣa-nāśanam ||',
            meaning: 'Talishadi Churna and Dashamoolakatutrayadi Kashaya conquer Kasa, Shwasa, and chest pain.',
          },
        ],
        shamana: [
          {
            category: 'Kashaya & Leha',
            medicineName: 'Dashamoolakatutrayadi Kashayam (15 mL BD) + Agastya Rasayanam (10 g HS)',
            dosage: '15 mL Kashayam + 10 g Leha',
            anupana: 'Warm water & 1 tsp Honey',
            timing: 'Before meals & Bedtime',
            indications: 'Relieves tracheobronchial spasm, chest congestion, and chronic cough',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 3 & Sahasrayogam',
          },
        ],
        shodhana: [
          {
            procedure: 'Uro-Swedana & Vamana / Virechana',
            indication: 'Kaphaja and Pittaja Kasa.',
            details: 'Local chest fomentation and Shodhana.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 11/1–12 & Chakradatta Ch. 11 (Kasa Chikitsa)',
        cRef: 'Chakradatta, Chapter 11 (Kasa Chikitsa)',
        nidanaSanskrit: 'कण्टकारीकृतः क्वाथः सव्योषः सर्वकासजित् । मरिचादिगुटिका चास्ये धार्या कासनिबर्हणी ॥',
        nidanaTranslit: 'Kaṇṭakārī-kṛtaḥ kvāthaḥ savyoṣaḥ sarvakāsajit | Maricādi-guṭikā cāsye dhāryā kāsa-nibarhaṇī ||',
        nidanaMeaning: 'Kantakari Kwatha mixed with Pippali churna and Marichadi Gutika lozenges cure all varieties of Kasa.',
        sutra: 'कण्टकारीकृतः क्वाथः सकृष्णः सर्वकासजित् ॥ (Chakradatta 11/18)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Kantakari Kwatha with Pippali in All Types of Kasa',
            reference: 'Chakradatta, Kasa Chikitsa 11/18',
            shlokaSanskrit: 'कण्टकारीकृतः क्वाथः सकृष्णः सर्वकासजित् । श्वासं हिक्कां च पार्श्वार्तिं कफं चाशु व्यपोहति ॥',
            shlokaTransliteration: 'Kaṇṭakārī-kṛtaḥ kvāthaḥ sakṛṣṇaḥ sarvakāsajit | Śvāsaṁ hikkāṁ ca pārśvārtiṁ kaphaṁ cāśu vyapohati ||',
            meaning: 'Kantakari decoction with Pippali Churna cures all types of Kasa, Shwasa, Hikka, and pleuritic flank pain.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Gutika',
            medicineName: 'Kantakari Kwatha with Pippali Churna (40 mL BD) + Marichadi Gutika (1 tab QID)',
            dosage: '40 mL BD + 1 lozenge QID',
            anupana: 'Honey',
            timing: 'Before meals & Lozenges QID',
            indications: 'Immediate bronchodilation and cough reflex suppression',
            reference: 'Chakradatta, Kasa Chikitsa 11/18 & 11/25',
          },
        ],
        shodhana: [
          {
            procedure: 'Nadi Sweda over Uras & Vamana',
            indication: 'Kaphaja Kasa.',
            details: 'Chest fomentation and Kapha expulsion.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/28',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 6/130 (Sitopaladi), 8/22 (Vasavaleha) & 10/77 (Kanakasava)',
        nidanaSanskrit: 'वासावलेहः कासघ्नः सितोपलादिचूर्णकम् । कनकासवयोगश्च कासश्वासविनाशनः ॥',
        nidanaTranslit: 'Vāsāvalehaḥ kāsaghnaḥ sitopalādi-cūrṇakam | Kanakāsava-yogaś ca kāsa-śvāsa-vināśanaḥ ||',
        nidanaMeaning: 'Vasavaleha, Sitopaladi Churna, and Kanakasava are the premier Sharangadhara formulations for Kasa and Shwasa.',
        sutra: 'वासायाः स्वरसप्रस्थे सितया पिप्पलीयुतः... वासावलेहः कासश्वासोरःक्षतनाशनः ॥ (Sha. Ma. 8/35)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vasavaleha & Sitopaladi Churna in Kasa',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 6/130 & 8/35–37',
            shlokaSanskrit: 'सितोपलां तुगाक्षीरीं पिप्पलीं बहुलां त्वचम्... हस्तपादाङ्गदाहं च कासं श्वासं व्यपोहति ॥',
            shlokaTransliteration: 'Sitopalāṁ tugākṣīrīṁ pippalīṁ bahulāṁ tvacam... hasta-pādāṅga-dāhaṁ ca kāsaṁ śvāsaṁ vyapohati ||',
            meaning: 'Sitopaladi Churna and Vasavaleha with honey and Ghrita cure Kasa, Shwasa, and hemoptysis.',
          },
        ],
        shamana: [
          {
            category: 'Avaleha & Churna',
            medicineName: 'Vasavaleha (10 g BD) + Sitopaladi Churna (3 g TDS) + Laxmivilas Ras (Nardiya 125 mg BD)',
            dosage: '10 g BD + 3 g TDS + 1 tab BD',
            anupana: 'Madhu (Honey) & Goghrita',
            timing: 'After meals',
            indications: 'Authoritative Sharangadhara textbook protocol for acute and chronic Kasa',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 6/130 & 8/35',
          },
        ],
        shodhana: [
          {
            procedure: 'Dhumapana & Vamana (Uttara Khanda Ch. 3 & 9)',
            indication: 'Kaphaja Kasa.',
            details: 'Medicated Vamana and Prayogika Dhumapana.',
          },
        ],
      },
    });
  }

  // 11. TAMAKA SHWASA (BRONCHIAL ASTHMA / DYSPNEA)
  if (q.includes('shwasa') || q.includes('asthma') || q.includes('wheez') || q.includes('dyspnea')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 17/55–64 (Hikka-Shwasa Chikitsa)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 17/70–150',
        nidanaSanskrit: 'प्रतिलोमं यदा वायुः स्रोतांसि प्रतिपद्यते । ग्रीवां शिरश्च सङ्गृह्य श्लेष्मणा समुदीरयेत् ॥ पीनसं घुरघुराकं च तमकं श्वासमीरयेत् ॥',
        nidanaTranslit: 'Pratilomaṁ yadā vāyuḥ srotāṁsi pratipadyate | Grīvāṁ śiraś ca saṅgṛhya śleṣmaṇā samudīrayet || Pīnasaṁ ghuraghurākaṁ ca tamakaṁ śvāsam īrayet ||',
        nidanaMeaning: 'When Prana Vayu obstructed by thick Kapha in the Pranavaha Srotas moves in reverse (Pratiloma), seizing the neck and head, causing wheezing (Ghurghuraka), orthopnea (Asino labhate saukhyam), and relief only after expectorating sputum, it is Tamaka Shwasa.',
        sutra: 'कारणोरसि बद्धस्य श्लेष्मणो मारुतस्य च । स्नेहैलवणतैलेन नाडीप्रस्तरसङ्करैः ॥ तमकं तु विरेकश्च... (Ch. Chi. 17/71, 121 — Tamake tu Virechanam)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Uro-Abhyanga with Lavana-Taila & Swedana (First-Line Acute Relief)',
            reference: 'Charaka Samhita, Chikitsa Sthana 17/71–75',
            shlokaSanskrit: 'आदौ स्नेहैलवणतैलेनोरः सम्यगुपाचरेत् । नाडीप्रस्तरसङ्करैः स्वेदैः कफविलयनैः ॥',
            shlokaTransliteration: 'Ādau snehair lavaṇa-tailenoraḥ samyag upācaret | Nāḍī-prastara-saṅkaraiḥ svedaiḥ kapha-vilayanaiḥ ||',
            meaning: 'In Shwasa, first massage the chest (Uras) with warm Tila Taila mixed with Saindhava Lavana and apply Nadi, Prastara, or Sankara Sweda to melt the impacted Kapha plugs and release obstructed Prana Vayu.',
          },
          {
            title: 'Shloka 2: Tamake Tu Virechanam — Golden Axiom of Acharya Charaka',
            reference: 'Charaka Samhita, Chikitsa Sthana 17/121',
            shlokaSanskrit: 'तमके तु विरेचनं मेदःकफहरैर्युक्तं वातश्लेष्महरैर्हितम् ॥',
            shlokaTransliteration: 'Tamake tu virecanaṁ medaḥ-kaphaharair yuktaṁ vāta-śleṣmaharair hitam ||',
            meaning: 'In Tamaka Shwasa, Virechana (purgation using Vata-Kaphahara drugs) is the specific Shodhana therapy because the root origin (Prabhava-sthana) of Shwasa is Pitta-sthana / Amashaya and Virechana restores Anuloma gati of Vayu.',
          },
        ],
        shamana: [
          {
            category: 'Asava / Kwatha',
            medicineName: 'Kanakasava (15 mL BD) + Bharangyadi Kwatha / Dashamoola Kwatha (40 mL BD)',
            dosage: '15 mL Asava + 40 mL Kwatha BD',
            anupana: 'Equal warm water',
            timing: 'After & Before meals',
            indications: 'Potent bronchodilator, mucolytic, and anti-asthmatic (Vata-Kaphahara)',
            reference: 'Charaka Samhita, Chikitsa Sthana 17 / Bhaishajya Ratnavali',
          },
          {
            category: 'Rasa Aushadhi',
            medicineName: 'Shwasakuthara Ras (125 mg–250 mg BD) + Abhraka Bhasma (125 mg BD)',
            dosage: '1 tablet BD + 125 mg BD',
            anupana: 'Kantakari Swarasa or Ardraka Swarasa with Honey',
            timing: 'After meals',
            indications: 'Breaks acute bronchospasm and strengthens alveolar Pranavaha Srotas',
            reference: 'Charaka Samhita, Chikitsa Sthana 17 / Rasendra Sara Sangraha',
          },
          {
            category: 'Rasayana Avaleha',
            medicineName: 'Agastya Haritaki Rasayana / Chyawanprasha Avaleha',
            dosage: '10 g BD',
            anupana: 'Warm water',
            timing: 'Morning & Bedtime',
            indications: 'Prevents seasonal/nocturnal asthma attacks and builds Vyadhikshamatva',
            reference: 'Charaka Samhita, Chikitsa Sthana 17 & 1/1/62',
          },
        ],
        shodhana: [
          {
            procedure: 'Uro-Abhyanga with Saindhava + Tila Taila & Nadi Sweda',
            indication: 'Acute Tamaka Shwasa wheezing and chest tightness (Ch. Chi. 17/71).',
            details: 'Warm sesame oil + rock salt chest massage followed by steam fomentation liquefies bronchial mucus plugs.',
          },
          {
            procedure: 'Virechana Karma (Tamake Tu Virechanam — Ch. Chi. 17/121)',
            indication: 'Recurrent Tamaka Shwasa to restore Pratiloma Vayu to Anuloma Gati.',
            details: 'Snehapana with Kantakari/Vasa Ghrita followed by Virechana with Trivrit + Triphala Kwatha.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Uttara Tantra 51/1–14 (Shwasa Pratishedha)',
        cRef: 'Sushruta Samhita, Uttara Tantra 51/15–56',
        nidanaSanskrit: 'प्राणोदानात्मको वायुः कफेन सह मूर्च्छितः... तमकः श्वास ईरितः ॥',
        nidanaTranslit: 'Prāṇodānātmako vāyuḥ kaphena saha mūrcchitaḥ... tamakaḥ śvāsa īritaḥ ||',
        nidanaMeaning: 'Prana Vayu obstructed by Kapha causes severe dyspnea, darkness before eyes (Tamas-darshana), and orthopnea.',
        sutra: 'स्निग्धं स्विन्नं वमेदादौ विरेकं वा प्रयोजयेत्... भारङ्ग्यादिलेहश्च श्वासकासविनाशनः ॥ (Su. U. 51/15)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Shwasa Chikitsa (Shringyadi & Bharangi Prayoga)',
            reference: 'Sushruta Samhita, Uttara Tantra 51/16–35',
            shlokaSanskrit: 'शृङ्गीमहौषधकणाभार्गीपुष्करमूलजम् । चूर्णं कोष्णाम्बुना पीतं श्वासहिक्कानिवारणम् ॥',
            shlokaTransliteration: 'Śṛṅgī-mahauṣadha-kaṇā-bhārgī-puṣkaramūlajam | Cūrṇaṁ koṣṇāmbunā pītaṁ śvāsa-hikkā-nivāraṇam ||',
            meaning: 'Powder of Karkatashringi, Sunthi, Pippali, Bharangi, and Pushkaramoola taken with warm water or honey cures Tamaka Shwasa.',
          },
        ],
        shamana: [
          {
            category: 'Churna & Leha',
            medicineName: 'Shringyadi Churna (Karkatashringi, Bharangi, Pushkaramoola, Trikatu) + Bharangi Guda',
            dosage: '3 g Churna + 5 g Guda BD',
            anupana: 'Honey & Warm water',
            timing: 'After meals',
            indications: 'Bronchodilator, mast-cell stabilizer, and pleuritic pain reliever',
            reference: 'Sushruta Samhita, Uttara Tantra 51/25',
          },
        ],
        shodhana: [
          {
            procedure: 'Saindhava-Taila Uro-Abhyanga, Nadi Sweda & Virechana',
            indication: 'Tamaka Shwasa.',
            details: 'Local chest oleation-sudation and Virechana.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Nidana Sthana 4/1–18',
        cRef: 'Ashtanga Hridaya, Chikitsa Sthana 4/1–58 (Shwasa-Hikka Chikitsa)',
        nidanaSanskrit: 'कासाद्वृद्धिं गतः श्वासो जायते... आसीनो लभते सौख्यमुष्णं चैवाभिनन्दति ॥',
        nidanaTranslit: 'Kāsād vṛddhiṁ gataḥ śvāso jāyate... āsīno labhate saukhyam uṣṇaṁ caivābhinandati ||',
        nidanaMeaning: 'In Tamaka Shwasa, the patient obtains comfort only while sitting upright (orthopnea) and craves warm drinks and fomentation.',
        sutra: 'यत्किञ्चित्कफवातघ्नमुष्णं वातानुलोमनम् । भेषजं पानमन्नं वा तद्धितं श्वासकासिनोः ॥ (A.H. Chi. 4/52 & Ch. Chi. 17/147)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Universal Chikitsa Sutra for Shwasa & Kasa',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 4/52 & Charaka Chi. 17/147',
            shlokaSanskrit: 'यत्किञ्चित्कफवातघ्नमुष्णं वातानुलोमनम् । भेषजं पानमन्नं वा तद्धितं श्वासकासिनोः ॥',
            shlokaTransliteration: 'Yat kiñcit kaphavātaghnam uṣṇaṁ vātānulomanam | Bheṣajaṁ pānam annaṁ vā tad dhitaṁ śvāsakāsinoḥ ||',
            meaning: 'Whatever medicine, drink, or diet is Kapha-Vatahara, Ushna (warm), and Vatanulomana (restoring downward movement of Vata) is wholesome and curative for Shwasa and Kasa.',
          },
        ],
        shamana: [
          {
            category: 'Kashaya & Leha',
            medicineName: 'Nayopayam Kashayam (Bala, Jeeraka, Sunthi) + Dashamoolarasayanam',
            dosage: '15 mL Kashayam + 45 mL warm water BD + 5 g Leha',
            anupana: 'Warm water',
            timing: 'Before meals',
            indications: 'Specifically reverses Pratiloma Vayu (Vatanulomana) and relieves bronchial wheezing',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana 4 & Sahasrayogam',
          },
        ],
        shodhana: [
          {
            procedure: 'Virechana & Uro-Swedana',
            indication: 'Tamaka Shwasa.',
            details: 'Vatanulomaka Virechana and chest fomentation.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 12/1–20 & Chakradatta Ch. 12 (Hikka-Shwasa Chikitsa)',
        cRef: 'Chakradatta, Chapter 12 (Hikka-Shwasa Chikitsa)',
        nidanaSanskrit: 'भार्गीनागरकल्कं वा कोष्णाम्बुना पिबेन्नरः । दशमूलकषायश्च पुष्करमूलसंयुतः ॥',
        nidanaTranslit: 'Bhārgī-nāgara-kalkaṁ vā koṣṇāmbunā piben naraḥ | Daśamūla-kaṣāyaś ca puṣkaramūla-saṁyutaḥ ||',
        nidanaMeaning: 'Bharangi and Sunthi with warm water, and Dashamoola Kwatha mixed with Pushkaramoola Churna rapidly relieve Tamaka Shwasa.',
        sutra: 'दशमूलकषायस्तु पुष्करमूलसंयुतः । कासं श्वासं च पार्श्वार्तिं हन्ति हिक्कां च दारुणाम् ॥ (Chakradatta 12/12)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Dashamoola Kwatha with Pushkaramoola for Shwasa',
            reference: 'Chakradatta, Hikka-Shwasa Chikitsa 12/12',
            shlokaSanskrit: 'दशमूलकषायस्तु पौष्करेण समायुतः । कासं श्वासं च पार्श्वार्तिं हन्ति हिक्कां च दारुणाम् ॥',
            shlokaTransliteration: 'Daśamūla-kaṣāyas tu pauṣkareṇa samāyutaḥ | Kāsaṁ śvāsaṁ ca pārśvārtiṁ hanti hikkāṁ ca dāruṇām ||',
            meaning: 'Dashamoola decoction mixed with Pushkaramoola Churna destroys severe Shwasa, Kasa, and chest pain.',
          },
        ],
        shamana: [
          {
            category: 'Kwatha & Rasa',
            medicineName: 'Dashamoola Kwatha with Pushkaramoola Churna (40 mL BD) + Shwasakuthara Ras (1 tab BD)',
            dosage: '40 mL + 2 g Churna + 1 tab BD',
            anupana: 'Ardraka Swarasa & Honey',
            timing: 'Before & After meals',
            indications: 'Rapid bronchodilation in Tamaka Shwasa',
            reference: 'Chakradatta, Hikka-Shwasa Chikitsa 12/12',
          },
        ],
        shodhana: [
          {
            procedure: 'Lavana-Taila Uro-Abhyanga & Virechana',
            indication: 'Tamaka Shwasa.',
            details: 'Chest massage with rock salt + sesame oil and purgation.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/29',
        cRef: 'Sharangadhara Samhita, Madhyama Khanda 10/77 (Kanakasava) & 2/105 (Bharangyadi)',
        nidanaSanskrit: 'कनकासवयोगेन श्वासकुठारकेण च । तमकः शाम्यति क्षिप्रं वासावलेहसेवनात् ॥',
        nidanaTranslit: 'Kanakāsava-yogena śvāsakuṭhārakeṇa ca | Tamakaḥ śāmyati kṣipraṁ vāsāvaleha-sevanāt ||',
        nidanaMeaning: 'Kanakasava, Shwasakuthara Ras, and Vasavaleha rapidly relieve Tamaka Shwasa.',
        sutra: 'कनकासवः कासश्वासबलासजित्... धत्तूरवासामधुकपिप्पलीभिः प्रकल्पितः ॥ (Sha. Ma. 10/77–81)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Kanakasava Classical Formulation for Tamaka Shwasa',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 10/77–81',
            shlokaSanskrit: 'क्षुण्णं धत्तूरपञ्चाङ्गं वासामूलं मधूकजम्... कनकासव इत्येष श्वासकासहरः परः ॥',
            shlokaTransliteration: 'Kṣuṇṇaṁ dhattūra-pañcāṅgaṁ vāsāmūlaṁ madhūkajam... kanakāsava ity eṣa śvāsakāsaharaḥ paraḥ ||',
            meaning: 'Kanakasava prepared with Shuddha Dhattura, Vasa, Yashtimadhu, Pippali, Kantakari, Bharangi, and Talishapatra is the supreme antispasmodic bronchodilator for Shwasa and Kasa.',
          },
        ],
        shamana: [
          {
            category: 'Asava & Rasa',
            medicineName: 'Kanakasava (15 mL BD) + Shwasakuthara Ras (125 mg BD) + Sitopaladi Churna (3 g BD)',
            dosage: '15 mL + 1 tab + 3 g BD',
            anupana: 'Warm water & Honey',
            timing: 'After meals',
            indications: 'Relieves acute bronchial constriction and wheezing',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 10/77–81 & 6/130',
          },
        ],
        shodhana: [
          {
            procedure: 'Virechana & Dhumapana (Uttara Khanda Ch. 4 & 9)',
            indication: 'Tamaka Shwasa.',
            details: 'Vatanulomaka Virechana and medicated smoking.',
          },
        ],
      },
    });
  }

  // 12. PRATISHYAYA / PINASA (ALLERGIC RHINITIS / SINUSITIS)
  if (q.includes('pratishyaya') || q.includes('pinasa') || q.includes('rhinitis') || q.includes('sinusitis') || q.includes('coryza')) {
    return buildCompact({
      charaka: {
        dRef: 'Charaka Samhita, Chikitsa Sthana 26/104–110 (Trimarmiya Chikitsa — Pratishyaya)',
        cRef: 'Charaka Samhita, Chikitsa Sthana 26/134–157',
        nidanaSanskrit: 'सन्धारणादजीर्णाच्च रजोऽतिभाष्यजागरात्... घ्राणमूले स्थितः श्लेष्मा प्रतिश्यायं प्रवर्तयेत् ॥',
        nidanaTranslit: 'Sandhāraṇād ajīrṇāc ca rajo’tibhāṣya-jāgarāt... ghrāṇamūle sthitaḥ śleṣmā pratiśyāyaṁ pravartayet ||',
        nidanaMeaning: 'Due to dust exposure, cold breeze, indigestion, and night awakening, Vata and Kapha lodge at the root of the nose (Ghrana-mula), causing sneezing (Kshavathu), nasal blockage (Nasa-avarodha), and watery rhinorrhea (Pratishyaya).',
        sutra: 'नवे प्रतिश्याये लङ्घनं स्वेदनं हितम्... पक्वे शिरोविरेचनं नस्यं धूमाश्च शस्यते ॥ (Ch. Chi. 26/134–145)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Nava vs Pakva Pratishyaya Chikitsa Sutra (Chitraka Haritaki & Shadbindu Nasya)',
            reference: 'Charaka Samhita, Chikitsa Sthana 26/134–150',
            shlokaSanskrit: 'वातिके सर्पिषः पानं... पक्वे घने च श्लेष्मणि शिरोविरेचनं नस्यं चित्रकहरीतकी च हिता ॥',
            shlokaTransliteration: 'Vātike sarpiṣaḥ pānaṁ... pakve ghane ca śleṣmaṇi śirovirecanaṁ nasyaṁ citraka-harītakī ca hitā ||',
            meaning: 'In acute (Ama/Nava) Pratishyaya, give Langhana, Swedana, and warm Peyas; in chronic/Pakva Pratishyaya (Pinasa/Sinusitis), administer Shirovirechana Nasya and Chitraka Haritaki.',
          },
        ],
        shamana: [
          {
            category: 'Avaleha',
            medicineName: 'Chitraka Haritaki Avaleha / Vyoshadi Vataka',
            dosage: '10 g Avaleha BD (or 2 tabs Vyoshadi Vataka TDS)',
            anupana: 'Warm water or warm milk',
            timing: 'Morning & Night',
            indications: 'Dries chronic nasal/sinus discharge, reduces mucosal hypertrophy, and boosts immunity',
            reference: 'Charaka Samhita, Chikitsa Sthana 26/140 / Bhaishajya Ratnavali',
          },
          {
            category: 'Rasa / Churna',
            medicineName: 'Tribhuvanakirti Ras (125 mg BD) + लक्ष्मीविलास रस (Nardiya 125 mg BD) + Haridra Khanda (5 g BD)',
            dosage: '1 tab BD + 5 g Haridra Khanda BD',
            anupana: 'Warm water or milk',
            timing: 'After meals',
            indications: 'Stops paroxysmal allergic sneezing, watery rhinorrhea, and eosinophilic rhinitis',
            reference: 'Charaka Samhita, Chikitsa Sthana 26 / Bhaishajya Ratnavali',
          },
        ],
        shodhana: [
          {
            procedure: 'Shirovirechana Nasya with Shadbindu Taila / Anu Taila',
            indication: 'Pakva Pratishyaya & Dushta Pratishyaya / Chronic Sinusitis (Ch. Chi. 26/144).',
            details: 'Mukha Abhyanga and Nadi Sweda over maxillary/frontal sinuses followed by 6 drops Shadbindu Taila Nasya per nostril for 7 days.',
          },
        ],
      },
      sushruta: {
        dRef: 'Sushruta Samhita, Uttara Tantra 24/1–17 (Pratishyaya Pratishedha)',
        cRef: 'Sushruta Samhita, Uttara Tantra 24/18–42',
        nidanaSanskrit: 'नारीप्रसङ्गः शिरसोऽभितापो धूमो रजः शीतलतापसेवा... घ्राणप्रवृत्तोऽनिलः प्रतिश्यायमुदीरयेत् ॥',
        nidanaTranslit: 'Nārī-prasaṅgaḥ śiraso’bhitāpo dhūmo rajaḥ śītalatāpa-sevā... ghrāṇa-pravṛtto’nilaḥ pratiśyāyam udīrayet ||',
        nidanaMeaning: 'Smoke, dust, sudden temperature changes, and cold exposure cause Vata and Kapha to flow through the nasal passages as Pratishyaya.',
        sutra: 'निवातशय्यासनं स्वेदः... पञ्चलवणसिद्धं सर्पिर्नस्यं च पीनसजित् ॥ (Su. U. 24/18)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Sushruta Pratishyaya Chikitsa',
            reference: 'Sushruta Samhita, Uttara Tantra 24/18–35',
            shlokaSanskrit: 'त्रिकटुचित्रकचूर्णं... शिरोविरेचनं नस्यं धूमश्च पीनसापहः ॥',
            shlokaTransliteration: 'Trikaṭu-citraka-cūrṇaṁ... śirovirecanaṁ nasyaṁ dhūmaś ca pīnasāpahaḥ ||',
            meaning: 'Protection from draft, facial fomentation, Shirovirechana Nasya, and Dhumapana cure Pratishyaya and Pinasa.',
          },
        ],
        shamana: [
          {
            category: 'Vataka & Taila',
            medicineName: 'Vyoshadi Vataka (5 g BD) + Shadbindu Taila Nasya',
            dosage: '5 g BD + 4 drops Nasya',
            anupana: 'Warm water',
            timing: 'After meals & Morning',
            indications: 'Clears paranasal sinus congestion and allergic coryza',
            reference: 'Sushruta Samhita, Uttara Tantra 24',
          },
        ],
        shodhana: [
          {
            procedure: 'Avapidana / Rechana Nasya & Dhumapana',
            indication: 'Chronic Pinasa / Sinusitis.',
            details: 'Shadbindu Taila Nasya after sinus steam inhalation.',
          },
        ],
      },
      vagbhata: {
        dRef: 'Ashtanga Hridaya, Uttara Sthana 19/1–26 (Pinasa-Pratishyaya Vijñaniya)',
        cRef: 'Ashtanga Hridaya, Uttara Sthana 20/1–25 (Pratishyaya Pratishedha)',
        nidanaSanskrit: 'वातादिभिः प्रतिश्यायः... उपेक्षितः स दुष्टपीनसतां व्रजेत् ॥',
        nidanaTranslit: 'Vātādibhiḥ pratiśyāyaḥ... upekṣitaḥ sa duṣṭa-pīnasatāṁ vrajet ||',
        nidanaMeaning: 'Neglected Pratishyaya turns into chronic Dushta Pinasa (chronic rhinosinusitis).',
        sutra: 'व्योषादिगुटिका सेव्या... नस्यं च षड्बिन्दुतैलेन ॥ (A.H. U. 20/9)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Vyoshadi Vataka for Pratishyaya & Pinasa',
            reference: 'Ashtanga Hridaya, Uttara Sthana 20/9–11',
            shlokaSanskrit: 'व्योषं तालीसपत्रं च चव्यं तिन्तिडिकं तथा... पीनसश्वासकासघ्नं रुचिवह्निप्रदीपनम् ॥',
            shlokaTransliteration: 'Vyoṣaṁ tālīsapatraṁ ca cavyaṁ tintiḍikaṁ tathā... pīnasa-śvāsa-kāsaghnaṁ ruci-vahni-pradīpanam ||',
            meaning: 'Vyoshadi Vataka (Trikatu, Talishapatra, Chavya, Tintidika, Amlavetasa, Chitraka, Jeeraka, Twak, Ela, Patra, Guda) cures Pinasa, Pratishyaya, Shwasa, and Kasa.',
          },
        ],
        shamana: [
          {
            category: 'Vataka & Kashaya',
            medicineName: 'Vyoshadi Vataka (5 g BD) + Dasamoolakatutrayadi Kashayam (15 mL BD)',
            dosage: '5 g + 15 mL BD',
            anupana: 'Warm water',
            timing: 'Before & After meals',
            indications: 'Authoritative Vagbhata yoga for allergic rhinitis and sinusitis',
            reference: 'Ashtanga Hridaya, Uttara Sthana 20/9–11',
          },
        ],
        shodhana: [
          {
            procedure: 'Marsha Nasya with Anu Taila / Shadbindu Taila',
            indication: 'Pratishyaya & Dushta Pinasa.',
            details: '7-day Nasya course.',
          },
        ],
      },
      chakradatta: {
        dRef: 'Madhava Nidana 58/1–20 & Chakradatta Ch. 58 (Nasaroga / Pratishyaya Chikitsa)',
        cRef: 'Chakradatta, Chapter 58',
        nidanaSanskrit: 'चित्रकहरीतकीलेहः पीनसश्वासकासजित् । पाठाद्विरजनीमूर्वा... षड्बिन्दुतैलमग्र्यं च ॥',
        nidanaTranslit: 'Citraka-harītakī-lehaḥ pīnasa-śvāsa-kāsajit | Pāṭhā-dvirajanī-mūrvā... ṣaḍbindu-tailam agryaṁ ca ||',
        nidanaMeaning: 'Chitraka Haritaki Leha internally and Shadbindu Taila Nasya are the supreme remedies for Pratishyaya.',
        sutra: 'चित्रकस्यामलक्याश्च गुडूच्या दशमूलजम्... चित्रकहरीतकी नाम पीनसश्वासकासजित् ॥ (Chakradatta 58/23)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Chitraka Haritaki Classical Formulation for Pinasa & Pratishyaya',
            reference: 'Chakradatta, Nasaroga Chikitsa 58/23–26',
            shlokaSanskrit: 'चित्रकस्यामलक्याश्च गुडूच्या दशमूलजम् । शतप्रस्थे रसे... पीनसं दुस्तरं हन्ति कासं श्वासं च दारुणम् ॥',
            shlokaTransliteration: 'Citrakasyāmalakyāś ca guḍūcyā daśamūlajam | Śataprasthe rase... pīnasaṁ dustaraṁ hanti kāsaṁ śvāsaṁ ca dāruṇam ||',
            meaning: 'Chitraka Haritaki prepared with Chitraka, Amalaki, Guduchi, Dashamoola, Haritaki, Guda, Trikatu, Trijata, and Yavakshara cures intractable Pinasa and Pratishyaya.',
          },
        ],
        shamana: [
          {
            category: 'Avaleha & Khanda',
            medicineName: 'Chitraka Haritaki (10 g BD) + Haridra Khanda (5 g BD)',
            dosage: '10 g + 5 g BD',
            anupana: 'Warm milk or warm water',
            timing: 'After meals',
            indications: 'Eradicates allergic rhinitis, sneezing bouts, and nasal polyps',
            reference: 'Chakradatta, Nasaroga Chikitsa 58/23–26',
          },
        ],
        shodhana: [
          {
            procedure: 'Shadbindu Taila Nasya',
            indication: 'Chronic sinusitis & rhinitis.',
            details: '6 drops in each nostril every morning after facial steam.',
          },
        ],
      },
      sharangadhara: {
        dRef: 'Sharangadhara Samhita, Purva Khanda 7/76',
        cRef: 'Sharangadhara Samhita, Uttara Khanda 8 (Nasya) & Madhyama Khanda 6 (Naradiya Laxmivilas)',
        nidanaSanskrit: 'नस्यं षड्बिन्दुतैलेन महालक्ष्मीविलासवान् । प्रतिश्यायं निहन्त्याशु पीनसं च शिरोरुजम् ॥',
        nidanaTranslit: 'Nasyaṁ ṣaḍbindu-tailena mahālakṣmīvilāsavān | Pratiśyāyaṁ nihanty āśu pīnasaṁ ca śirorujam ||',
        nidanaMeaning: 'Shadbindu Taila Nasya (6 drops per nostril) and Mahalaxmivilas Ras cure Pratishyaya, sinusitis, and frontal headache.',
        sutra: 'षड्बिन्दवः प्रदेयाः स्युर्नस्ये पीनसशान्तये ॥ (Sha. U. 8)',
        chikitsaShlokas: [
          {
            title: 'Shloka 1: Marsha & Pratimarsha Nasya in Pratishyaya',
            reference: 'Sharangadhara Samhita, Uttara Khanda 8/12–30',
            shlokaSanskrit: 'प्रातः श्लेष्मणि मध्याह्ने पित्ते रात्रौ च मारुते । नस्यं दद्यात् प्रतिश्याये शिरोरोगे च दारुणे ॥',
            shlokaTransliteration: 'Prātaḥ śleṣmaṇi madhyāhne pitte rātrau ca mārute | Nasyaṁ dadyāt pratiśyāye śiroroge ca dāruṇe ||',
            meaning: 'Administer Nasya in the morning for Kaphaja Pratishyaya, midday for Pittaja, and evening for Vataja to clear the Shringataka Marma and sinuses.',
          },
        ],
        shamana: [
          {
            category: 'Rasa & Taila',
            medicineName: 'Mahalaxmivilas Ras (125 mg BD) + Sitopaladi Churna (3 g BD) + Shadbindu Taila (Nasya)',
            dosage: '1 tab BD + 3 g BD + 6 drops Nasya',
            anupana: 'Betel leaf juice or Honey',
            timing: 'After meals',
            indications: 'Stops chronic coryza, post-nasal drip, and sinus headache',
            reference: 'Sharangadhara Samhita, Uttara Khanda 8 & Bhaishajya Ratnavali',
          },
        ],
        shodhana: [
          {
            procedure: 'Avapidana & Marsha Nasya (Uttara Khanda Ch. 8)',
            indication: 'Pratishyaya & Pinasa.',
            details: '6–8 drops Shadbindu Taila per nostril.',
          },
        ],
      },
    });
  }

  return null;
}
