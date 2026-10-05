import type { AcharyaClinicalProtocol } from './acharyaProtocols';

interface QuickAcharyaSpec {
  dRef: string;
  cRef: string;
  nidanaSanskrit: string;
  nidanaTranslit: string;
  nidanaMeaning: string;
  sutra: string;
  sutraTitle: string;
  sutraSanskrit: string;
  sutraTranslit: string;
  sutraMeaning: string;
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

interface QuickDiseaseEntry {
  match: string[];
  charaka: QuickAcharyaSpec;
  sushruta: QuickAcharyaSpec;
  vagbhata: QuickAcharyaSpec;
  chakradatta: QuickAcharyaSpec;
  sharangadhara: QuickAcharyaSpec;
}

function parseSutraParts(rawSutra: string, fallbackMeaning: string): { sanskrit: string; ref: string; meaning: string } {
  const cleanRaw = rawSutra.replace(/\.\.\./g, ' च ');
  const parenIdx = cleanRaw.indexOf('(');
  if (parenIdx === -1) {
    return { sanskrit: cleanRaw.trim(), ref: '', meaning: fallbackMeaning };
  }
  const sanskrit = cleanRaw.slice(0, parenIdx).trim();
  const inside = cleanRaw.slice(parenIdx + 1).replace(/\)\s*$/, '').trim();
  const dashIdx = inside.indexOf('—');
  if (dashIdx !== -1) {
    return {
      sanskrit,
      ref: inside.slice(0, dashIdx).trim(),
      meaning: inside.slice(dashIdx + 1).trim(),
    };
  }
  return { sanskrit, ref: inside, meaning: fallbackMeaning };
}

function makeProtocol(
  id: 'charaka' | 'sushruta' | 'vagbhata' | 'chakradatta' | 'sharangadhara',
  name: string,
  book: string,
  s: QuickAcharyaSpec & { mentioned?: boolean; extraShlokas?: { title: string; reference: string; shlokaSanskrit: string; shlokaTransliteration: string; meaning: string }[] }
): AcharyaClinicalProtocol {
  const m = s.mentioned !== false;
  if (!m) {
    return {
      acharyaId: id,
      acharyaName: name,
      sourceTextbook: book,
      isDirectlyMentioned: false,
      diseaseReference: 'NA',
      chikitsaSutraReference: 'NA',
      mentionStatusNote: `NA — Not codified as a separate Vyadhi in ${book}.`,
      clinicalPhilosophy: `NA — Refer to Acharyas who directly codified this disease.`,
      shlokaReference: {
        shlokaSanskrit: 'NA',
        shlokaTransliteration: 'NA',
        meaning: `NA — Disease not mentioned as a separate chapter in ${book}.`,
        sourceBook: 'NA',
        chapterAndVerse: 'NA',
      },
      chikitsaSutra: 'NA',
      chikitsaShlokas: [],
      shamanaChikitsa: [],
      shodhanaChikitsa: [],
    };
  }

  const parsedSutra = parseSutraParts(s.sutra, s.sutraMeaning);
  const cleanNidanaSanskrit = s.nidanaSanskrit.replace(/\.\.\./g, ' च ');
  const cleanNidanaTranslit = s.nidanaTranslit.replace(/\.\.\./g, ' ca ');
  const cleanSutraSanskrit = s.sutraSanskrit.replace(/\.\.\./g, ' च ');
  const cleanSutraTranslit = s.sutraTranslit.replace(/\.\.\./g, ' ca ');

  const shlokasList: {
    title: string;
    reference: string;
    shlokaSanskrit: string;
    shlokaTransliteration: string;
    meaning: string;
  }[] = [];

  if (parsedSutra.sanskrit && parsedSutra.sanskrit !== cleanSutraSanskrit) {
    shlokasList.push({
      title: `1. Primary Chikitsa Sutra (${name})`,
      reference: parsedSutra.ref ? `${book} (${parsedSutra.ref})` : s.cRef,
      shlokaSanskrit: parsedSutra.sanskrit,
      shlokaTransliteration: cleanSutraTranslit,
      meaning: parsedSutra.meaning,
    });
    shlokasList.push({
      title: `2. ${s.sutraTitle}`,
      reference: s.cRef,
      shlokaSanskrit: cleanSutraSanskrit,
      shlokaTransliteration: cleanSutraTranslit,
      meaning: s.sutraMeaning,
    });
  } else {
    shlokasList.push({
      title: `1. ${s.sutraTitle}`,
      reference: s.cRef,
      shlokaSanskrit: cleanSutraSanskrit || parsedSutra.sanskrit,
      shlokaTransliteration: cleanSutraTranslit,
      meaning: parsedSutra.meaning || s.sutraMeaning,
    });
  }

  if (s.extraShlokas && s.extraShlokas.length > 0) {
    shlokasList.push(...s.extraShlokas);
  }

  return {
    acharyaId: id,
    acharyaName: name,
    sourceTextbook: `${book} (${s.cRef})`,
    isDirectlyMentioned: true,
    diseaseReference: s.dRef,
    chikitsaSutraReference: s.cRef,
    mentionStatusNote: `Directly codified in ${s.dRef} with Chikitsa Sutra in ${s.cRef}.`,
    clinicalPhilosophy: `Classical ${book} protocol as per ${s.cRef}.`,
    shlokaReference: {
      shlokaSanskrit: cleanNidanaSanskrit,
      shlokaTransliteration: cleanNidanaTranslit,
      meaning: s.nidanaMeaning,
      sourceBook: book,
      chapterAndVerse: s.dRef,
    },
    chikitsaSutra: s.sutra.replace(/\.\.\./g, ' च '),
    chikitsaShlokas: shlokasList,
    shamanaChikitsa: s.shamana,
    shodhanaChikitsa: s.shodhana,
    paraSurgicalTherapy: s.paraSurgical,
  };
}

const ENTRIES: QuickDiseaseEntry[] = [
  // PANDU (ANEMIA)
  {
    match: ['pandu', 'anemia', 'iron deficiency', 'hemoglobin'],
    charaka: {
      dRef: 'Charaka Samhita, Chikitsa Sthana 16/4–18',
      cRef: 'Charaka Samhita, Chikitsa Sthana 16/40–115',
      nidanaSanskrit: 'पित्तप्रधानाः कुपिताः धातून् संदूष्य देहिनाम् । पाण्डुहारिद्रहरितान् वर्णान् कुर्वन्ति पाण्डुताम् ॥',
      nidanaTranslit: 'Pitta-pradhānāḥ kupitāḥ dhātūn saṁdūṣya dehinām | Pāṇḍu-hāridra-haritān varṇān kurvanti pāṇḍutām ||',
      nidanaMeaning: 'Pitta-dominant Tridosha vitiates Rakta and Mamsa Dhatus, causing Alparakta (blood depletion), Alpa-medaska, Nisara, and pallor (Pandu-varna).',
      sutra: 'तत्र पाण्ड्वामयी स्निग्धस्तीक्ष्णैरूर्ध्वानुलोमिकैः । विशोध्यो मृदुभिस्तिक्तैः कामली तु विरेचनैः ॥ (Ch. Chi. 16/40)',
      sutraTitle: 'Charaka Pandu Chikitsa Sutra & Navayasa Lauha',
      sutraSanskrit: 'त्र्यूषणं त्रिफला मुस्तं विडङ्गं चित्रकं समम् । नवायलौहमेकैकं पाण्डुरोगविनाशनम् ॥',
      sutraTranslit: 'Tryūṣaṇaṁ triphalā mustaṁ viḍaṅgaṁ citrakaṁ samam | Navāya-lauham ekaikaṁ pāṇḍuroga-vināśanam ||',
      sutraMeaning: 'Snehana with Tiktaka/Dadimadi Ghrita, Tikshna Vamana/Virechana, and Navayasa Lauha / Punarnavadi Mandura cure Pandu Roga.',
      shamana: [
        { category: 'Lauha / Mandura', medicineName: 'Punarnavadi Mandura (500 mg BD) & Navayasa Lauha (250 mg BD)', dosage: '500 mg + 250 mg BD', anupana: 'Takra (Buttermilk) or Honey', timing: 'After meals', indications: 'Replenishes Rakta Dhatu, raises hemoglobin/ferritin, and relieves anemic edema', reference: 'Charaka Samhita, Chikitsa Sthana 16/70–71 & 16/93–95' },
        { category: 'Ghrita / Arishta', medicineName: 'Dadimadi Ghrita (10 mL OD) + Lohasava (15 mL BD)', dosage: '10 mL OD + 15 mL BD', anupana: 'Warm water', timing: 'Morning & After meals', indications: 'Deepana, Hridya, and Raktavardhaka in Pandu and pregnancy anemia', reference: 'Charaka Samhita, Chikitsa Sthana 16/44–46' },
      ],
      shodhana: [{ procedure: 'Dadimadi / Kalyanaka Ghrita Snehapana & Virechana', indication: 'Sadhya Pandu Roga (Ch. Chi. 16/40).', details: 'Internal oleation followed by Virechana with Gomutra-Haritaki or Trivrit.' }],
    },
    sushruta: {
      dRef: 'Sushruta Samhita, Uttara Tantra 44/3–9',
      cRef: 'Sushruta Samhita, Uttara Tantra 44/14–35',
      nidanaSanskrit: 'त्वङ्मांसशोणितं... पाण्डुरोग इति प्रोक्तः स च पञ्चविधः स्मृतः ॥',
      nidanaTranslit: 'Tvaṅ-māṁsa-śoṇitaṁ... pāṇḍuroga iti proktaḥ sa ca pañcavidhaḥ smṛtaḥ ||',
      nidanaMeaning: 'Doshas vitiating Rakta and Twak produce greenish-yellow pallor in 5 types of Pandu.',
      sutra: 'अयःचूर्णं सव्योषं... पाण्डुरोगहरं श्रेष्ठं मण्डूरं च गवाम्बुना ॥ (Su. U. 44/23)',
      sutraTitle: 'Sushruta Loha-Mandura Prayoga in Pandu',
      sutraSanskrit: 'अयश्चूर्णं त्रिकटुकं त्रिफलां च समं लिहेत् । मधुसर्पियुतं नित्यं पाण्डुरोगविनाशनम् ॥',
      sutraTranslit: 'Ayaś-cūrṇaṁ trikaṭukaṁ triphalāṁ ca samaṁ lihet | Madhu-sarpi-yutaṁ nityaṁ pāṇḍuroga-vināśanam ||',
      sutraMeaning: 'Loha Bhasma with Trikatu and Triphala licked with honey and Ghrita cures Pandu.',
      shamana: [{ category: 'Lauha Yoga', medicineName: 'Triphaladi Lauha / Dhatri Lauha (500 mg BD)', dosage: '500 mg BD', anupana: 'Honey & Goghrita', timing: 'After meals', indications: 'Bioavailable hematinic with Amalaki Vitamin C synergy', reference: 'Sushruta Samhita, Uttara Tantra 44/23' }],
      shodhana: [{ procedure: 'Snehana & Mridu Virechana', indication: 'Pandu Roga.', details: 'Haritaki + Gomutra Virechana.' }],
    },
    vagbhata: {
      dRef: 'Ashtanga Hridaya, Nidana Sthana 13/1–14',
      cRef: 'Ashtanga Hridaya, Chikitsa Sthana 16/1–41',
      nidanaSanskrit: 'पित्तं प्रधानं दोषाणां... ओजो गुणाः क्षयं यान्ति पाण्डुरोगस्ततो भवेत् ॥',
      nidanaTranslit: 'Pittaṁ pradhānaṁ doṣāṇāṁ... ojo guṇāḥ kṣayaṁ yānti pāṇḍurogas tato bhavet ||',
      nidanaMeaning: 'Sadhaka/Ranjaka Pitta vitiation depletes Rakta and Ojas qualities, causing Pandu.',
      sutra: 'दाडिमादिघृतं सेव्यं... मण्डूरवटकश्चात्र पाण्डुशोफविनाशनः ॥ (A.H. Chi. 16/2, 16)',
      sutraTitle: 'Vagbhata Dadimadi Ghrita & Mandura Vataka',
      sutraSanskrit: 'दाडिमं चित्रकं धान्यं... दाडिमादिघृतं श्रेष्ठं पाण्डुगुल्मगरापहम् ॥',
      sutraTranslit: 'Dāḍimaṁ citrakaṁ dhānyaṁ... dāḍimādi-ghṛtaṁ śreṣṭhaṁ pāṇḍu-gulma-garāpaham ||',
      sutraMeaning: 'Dadimadi Ghrita and Mandura Vataka with Takra cure Pandu and Shotha.',
      shamana: [{ category: 'Vataka & Kashaya', medicineName: 'Mandura Vataka (500 mg BD) + Drakshadi Kashayam (15 mL BD)', dosage: '500 mg + 15 mL BD', anupana: 'Takra / Warm water', timing: 'After & Before meals', indications: 'Corrects Rakta Kshaya, fatigue, and palpitations', reference: 'Ashtanga Hridaya, Chikitsa Sthana 16/16–18' }],
      shodhana: [{ procedure: 'Dadimadi Ghrita Snehapana & Virechana', indication: 'Pandu.', details: 'Medicated Ghrita followed by Virechana.' }],
    },
    chakradatta: {
      dRef: 'Chakradatta, Chapter 8 (Pandu-Kamala Chikitsa)',
      cRef: 'Chakradatta, Chapter 8/1–27',
      nidanaSanskrit: 'धात्रीलौहं नवायसं मण्डूरं च पुनर्नवादि... पाण्डुरोगं निहन्त्याशु ॥',
      nidanaTranslit: 'Dhātrī-lauhaṁ navāyasaṁ maṇḍūraṁ ca punarnavādi... pāṇḍurogaṁ nihanty āśu ||',
      nidanaMeaning: 'Dhatri Lauha, Navayasa Lauha, and Punarnavadi Mandura rapidly cure Pandu.',
      sutra: 'धात्रीचूर्णाष्टपलिकं लौहचूर्णपलान्वितम्... धात्रीलौहमिदं प्रोक्तं पाण्डुरोगविनाशनम् ॥ (Chakradatta 8)',
      sutraTitle: 'Dhatri Lauha & Navayasa Lauha in Pandu',
      sutraSanskrit: 'धात्रीलौहं समध्वाज्यं सेवेत पाण्डुरोगवान् । पुनर्नवादिमण्डूरं शोथपाण्ड्वामयापहम् ॥',
      sutraTranslit: 'Dhātrī-lauhaṁ samadhvājyaṁ seveta pāṇḍurogavān | Punarnavādi-maṇḍūraṁ śotha-pāṇḍvāmayāpaham ||',
      sutraMeaning: 'Dhatri Lauha and Punarnavadi Mandura eradicate Pandu and anemic edema.',
      shamana: [{ category: 'Lauha Kalpana', medicineName: 'Dhatri Lauha (500 mg BD) + Punarnavadi Mandura (500 mg BD)', dosage: '500 mg BD each', anupana: 'Takra or Honey', timing: 'After meals', indications: 'Increases Hb% without gastric irritation', reference: 'Chakradatta, Pandu Chikitsa 8' }],
      shodhana: [{ procedure: 'Phalatrikadi Virechana', indication: 'Sama Pandu.', details: 'Mild purgation to clear Pitta-Kapha.' }],
    },
    sharangadhara: {
      dRef: 'Sharangadhara Samhita, Purva Khanda 7/23',
      cRef: 'Sharangadhara Samhita, Madhyama Khanda 10/34 (Lohasava) & 2/76',
      nidanaSanskrit: 'लोहासवः पाण्डुरोगं श्वयथुं ग्रहणीं जयेत् । नवायसमिदं चूर्णं पाण्डुहृद्रोगनाशनम् ॥',
      nidanaTranslit: 'Lohāsavaḥ pāṇḍurogaṁ śvayathuṁ grahaṇīṁ jayet | Navāyasam idaṁ cūrṇaṁ pāṇḍu-hṛdroga-nāśanam ||',
      nidanaMeaning: 'Lohasava and Navayasa Lauha are the specific Sharangadhara formulations for Pandu.',
      sutra: 'लोहचूर्णं त्रिकटुकं त्रिफलां च यमानिकाम्... लोहासवमिमं विद्यात् पाण्डुश्वयथुनाशनम् ॥ (Sha. Ma. 10/34–38)',
      sutraTitle: 'Lohasava Classical Formulation for Pandu',
      sutraSanskrit: 'लोहचूर्णं त्रिकटुकं त्रिफलां च यमानिकाम् । विडङ्गं मुस्तकं चित्रं... लोहासवः पाण्डुहरः ॥',
      sutraTranslit: 'Lohacūrṇaṁ trikaṭukaṁ triphalāṁ ca yamānikām | Viḍaṅgaṁ mustakaṁ citraṁ... lohāsavaḥ pāṇḍuharaḥ ||',
      sutraMeaning: 'Lohasava fermented with Loha Churna, Trikatu, Triphala, Yavani, Vidanga, Musta, and Chitraka cures Pandu, Shotha, and Mandagni.',
      shamana: [{ category: 'Asava & Lauha', medicineName: 'Lohasava (20 mL BD) + Navayasa Lauha (250 mg BD)', dosage: '20 mL + 250 mg BD', anupana: 'Equal water', timing: 'After meals', indications: 'Hematinic and Agni-deepana', reference: 'Sharangadhara Samhita, Madhyama Khanda 10/34–38' }],
      shodhana: [{ procedure: 'Mridu Virechana', indication: 'Pandu Roga.', details: 'Triphala-Trivrit Virechana.' }],
    },
  },

  // RAKTAPITTA (BLEEDING DISORDERS / EPISTAXIS)
  {
    match: ['raktapitta', 'epistaxis', 'bleeding', 'hemorrhage'],
    charaka: {
      dRef: 'Charaka Samhita, Nidana Sthana 2/1–28 & Chikitsa 4/1–24',
      cRef: 'Charaka Samhita, Chikitsa Sthana 4/25–110',
      nidanaSanskrit: 'संयोगाद्दूषणात्तत्तु सामान्याद्गन्धवर्णयोः । रक्तस्य पित्तमाख्यातं रक्तपित्तं मनीषिभिः ॥',
      nidanaTranslit: 'Saṁyogād dūṣaṇāt tat tu sāmānyād gandha-varṇayoḥ | Raktasya pittam ākhyātaṁ raktapittaṁ manīṣibhiḥ ||',
      nidanaMeaning: 'Because Pitta and Rakta share similar odor, color, and Ashraya-Ashrayi nature, aggravated Pitta mixes with and increases Rakta, bursting out through Urdhwa (nasal/oral) or Adho (rectal/urinary) orifices.',
      sutra: 'अक्षीणबलमांसस्य रक्तपित्तं यदश्नतः... नादौ स्तम्भनमर्हति । ऊर्ध्वगे तर्पणं पूर्वं पेया पूर्वमधोगते ॥ विरेचनमूर्ध्वभागे अधोभागे तु वमनम् ॥ (Ch. Chi. 4/25–58)',
      sutraTitle: 'Pratimarga-Harana (Contra-Directional Shodhana) & Vasa Agrya in Raktapitta',
      sutraSanskrit: 'ऊर्ध्वगे रक्तपित्ते तु विरेचनं प्रशस्यते । अधोगे वमनं शस्तं वासा तत्राग्र्यमौषधम् ॥',
      sutraTranslit: 'Ūrdhvage raktapitte tu virecanaṁ praśasyate | Adhoge vamanaṁ śastaṁ vāsā tatrāgryam auṣadham ||',
      sutraMeaning: 'In Urdhwaga Raktapitta (epistaxis/hemoptysis), give Tarpana and Virechana; in Adhoga Raktapitta, give Peya and Vamana (Pratimarga Harana); Vasa is the supreme hemostatic herb.',
      shamana: [
        { category: 'Ghrita / Avaleha', medicineName: 'Vasa Ghrita / Vasavaleha (10 g BD) & Ushirasava (20 mL BD)', dosage: '10 g + 20 mL BD', anupana: 'Cool milk or Mishri water', timing: 'After meals', indications: 'Checks epistaxis, hemoptysis, and capillary fragility', reference: 'Charaka Samhita, Chikitsa Sthana 4/88' },
        { category: 'Rasa / Pishti', medicineName: 'Bolbaddha Ras (250 mg BD) + Kaharava Pishti (250 mg BD) + Kamadudha Ras (250 mg BD)', dosage: '250 mg each BD', anupana: 'Durva Swarasa or Tandulodaka', timing: 'After meals', indications: 'Immediate Raktastambhana (hemostasis)', reference: 'Charaka Samhita, Chikitsa Sthana 4 / Rasendra Sara Sangraha' },
      ],
      shodhana: [{ procedure: 'Pratimarga Harana: Virechana in Urdhwaga & Avapidana Nasya with Durva Swarasa', indication: 'Urdhwaga Raktapitta / Epistaxis (Ch. Chi. 4/58, 99).', details: 'Trivrit-Draksha Virechana for Urdhwaga Raktapitta; Durva/Dadima Swarasa Nasya for active epistaxis.' }],
    },
    sushruta: {
      dRef: 'Sushruta Samhita, Uttara Tantra 45/1–11',
      cRef: 'Sushruta Samhita, Uttara Tantra 45/12–44',
      nidanaSanskrit: 'ऊर्ध्वं नासाक्षिकर्णैश्च मुखान्मज्जादिभिस्तथा । अधो मेढ्रगुदयोनिभ्यः प्रवर्तेतासृगुल्बणम् ॥',
      nidanaTranslit: 'Ūrdhvaṁ nāsākṣi-karṇaiś ca mukhān majjādibhis tathā | Adho meḍhra-guda-yonibhyaḥ pravartetāsṛg ulbaṇam ||',
      nidanaMeaning: 'Vitiated blood flows from upper orifices (nose, mouth) or lower orifices (urethra, rectum, vagina).',
      sutra: 'अतिप्रवृत्ते रक्ते तु चतुर्विधो निग्रहोपायः — सन्धानं स्कन्दनं पाचनं दहनं चेति ॥ (Su. Su. 14/39 & Su. U. 45)',
      sutraTitle: 'Sushruta Chaturvidha Raktastambhana Upaya (Sandhana, Skandana, Pachana, Dahana)',
      sutraSanskrit: 'कषायं सन्धत्ते रक्तं हिमं स्कन्दयति... वासायाः स्वरसः श्रेष्ठो रक्तपित्तनिबर्हणः ॥',
      sutraTranslit: 'Kaṣāyaṁ sandhatte raktaṁ himaṁ skandayati... vāsāyāḥ svarasaḥ śreṣṭho raktapitta-nibarhaṇaḥ ||',
      sutraMeaning: 'Kashaya herbs contract vessels (Sandhana), Sheeta drugs coagulate blood (Skandana), Bhasmas clot (Pachana), and Agnikarma seals vessels (Dahana).',
      shamana: [{ category: 'Swarasa & Churna', medicineName: 'Vasa Swarasa (20 mL BD with Honey) + Eladi Gutika (2 tabs TDS)', dosage: '20 mL + 2 tabs', anupana: 'Honey & Sharkara', timing: 'After meals', indications: 'Hemostatic and Pittashamaka', reference: 'Sushruta Samhita, Uttara Tantra 45/20' }],
      shodhana: [{ procedure: 'Durva / Utpaladi Nasya & Virechana', indication: 'Nasal bleeding (Nasa-gata Raktapitta).', details: 'Cold nasal drops of Durva Swarasa or Shatadhauta Ghrita.' }],
    },
    vagbhata: {
      dRef: 'Ashtanga Hridaya, Nidana Sthana 3/1–14',
      cRef: 'Ashtanga Hridaya, Chikitsa Sthana 2/1–49',
      nidanaSanskrit: 'वृद्धं पित्तं रक्तेन... वृषो (वासा) रक्तपित्तिनाम् अग्र्यः ॥',
      nidanaTranslit: 'Vṛddhaṁ pittaṁ raktena... vṛṣo (vāsā) raktapittinām agryaḥ ||',
      nidanaMeaning: 'Vasa (Vrisha) is the foremost drug for Raktapitta (A.H. U. 40/49).',
      sutra: 'वासाघृतं प्रयुञ्जीत... दूर्वास्वरसनस्यं च नासारक्तनिवारणम् ॥ (A.H. Chi. 2/27)',
      sutraTitle: 'Vagbhata Vasa Ghrita & Durva Nasya in Raktapitta',
      sutraSanskrit: 'वासां सशाखां सपलाशमूलां... घृतं पचेत्तत् परमं हि रक्तपित्तं जयेत् ॥',
      sutraTranslit: 'Vāsāṁ saśākhāṁ sapalāśamūlāṁ... ghṛtaṁ pacet tat paramaṁ hi raktapittaṁ jayet ||',
      sutraMeaning: 'Vasa Ghrita prepared with whole Vasa plant and honey conquers severe Raktapitta.',
      shamana: [{ category: 'Kashaya & Ghrita', medicineName: 'Vasaguluchyadi Kashayam (15 mL BD) + Vasa Ghrita (10 mL OD)', dosage: '15 mL + 10 mL', anupana: 'Cool water', timing: 'Before meals', indications: 'Arrests mucosal bleeding and cools Rakta-Pitta', reference: 'Ashtanga Hridaya, Chikitsa Sthana 2/27' }],
      shodhana: [{ procedure: 'Stambhana Nasya & Pratimarga Shodhana', indication: 'Urdhwaga Raktapitta.', details: 'Durva Swarasa Nasya.' }],
    },
    chakradatta: {
      dRef: 'Chakradatta, Chapter 9 (Raktapitta Chikitsa)',
      cRef: 'Chakradatta, Chapter 9/1–60',
      nidanaSanskrit: 'आटरूषकनियूहः ससितामधुयोजितः । रक्तपित्तं निहन्त्याशु खण्डकूष्माण्डकावलेहः ॥',
      nidanaTranslit: 'Āṭarūṣaka-niryūhaḥ sasitā-madhu-yojitaḥ | Raktapittaṁ nihanty āśu khaṇḍakūṣmāṇḍakāvalehaḥ ||',
      nidanaMeaning: 'Vasa (Atarushaka) decoction with sugar and honey, and Khandakushmandaka Avaleha cure Raktapitta.',
      sutra: 'वासायाः स्वरसः क्षौद्रशर्करासंयुतः पिबेत् । रक्तपित्तं जयत्याशु दाडिमकुसुमं तथा ॥ (Chakradatta 9/14)',
      sutraTitle: 'Vasa Swarasa & Dadima Pushpa Nasya in Raktapitta',
      sutraSanskrit: 'नस्यं दाडिमपुष्पोत्थोरसो दूर्वाभवोऽथवा । नासाप्रवृत्तरक्तघ्नम् ॥',
      sutraTranslit: 'Nasyaṁ dāḍima-puṣpottho raso dūrvābhavo’thavā | Nāsā-pravṛtta-raktaghnam ||',
      sutraMeaning: 'Nasal drops of pomegranate flower juice (Dadima Pushpa Swarasa) or Durva grass juice immediately stop epistaxis.',
      shamana: [{ category: 'Avaleha & Asava', medicineName: 'Vasavaleha (10 g BD) + Ushirasava (20 mL BD)', dosage: '10 g + 20 mL BD', anupana: 'Cool water', timing: 'After meals', indications: 'Stops bleeding and cools Pitta', reference: 'Chakradatta, Raktapitta Chikitsa 9/14 & 9/35' }],
      shodhana: [{ procedure: 'Dadima-Durva Swarasa Nasya', indication: 'Epistaxis.', details: '4 drops cold Durva juice in nostrils.' }],
    },
    sharangadhara: {
      dRef: 'Sharangadhara Samhita, Purva Khanda 7/25',
      cRef: 'Sharangadhara Samhita, Madhyama Khanda 10/13 (Ushirasava) & 8/35 (Vasavaleha)',
      nidanaSanskrit: 'उशीरासवयोगश्च वासावलेह उत्तमः । रक्तपित्तं निहन्त्याशु प्रवालपिष्टिसंयुतः ॥',
      nidanaTranslit: 'Uśīrāsava-yogaś ca vāsāvaleha uttamaḥ | Raktapittaṁ nihanty āśu pravālapiṣṭi-saṁyutaḥ ||',
      nidanaMeaning: 'Ushirasava, Vasavaleha, and Pravala Pishti rapidly arrest Raktapitta.',
      sutra: 'उशीरं बालकं पद्मं काश्मर्यं नीलमुत्पलम्... उशीरासव इत्येष रक्तपित्तविनाशनः ॥ (Sha. Ma. 10/13–17)',
      sutraTitle: 'Ushirasava Classical Formulation for Raktapitta',
      sutraSanskrit: 'उशीरं बालकं पद्मं... रक्तपित्तं पाण्डुरोगं कुष्ठं मेहाश्च नाशयेत् ॥',
      sutraTranslit: 'Uśīraṁ bālakaṁ padmaṁ... raktapittaṁ pāṇḍurogaṁ kuṣṭhaṁ mehāś ca nāśayet ||',
      sutraMeaning: 'Ushirasava prepared with Ushira, Balaka, Kamal, Gambhari, Utpala, Priyangu, Padmaka, Lodhra, and Manjishtha cures Raktapitta.',
      shamana: [{ category: 'Asava & Avaleha', medicineName: 'Ushirasava (20 mL BD) + Vasavaleha (10 g BD) + Mukta Pravala Pishti (250 mg BD)', dosage: '20 mL + 10 g + 250 mg BD', anupana: 'Cool water / Butter', timing: 'After meals', indications: 'Complete Sharangadhara hemostatic protocol', reference: 'Sharangadhara Samhita, Madhyama Khanda 10/13–17 & 8/35' }],
      shodhana: [{ procedure: 'Stambhana Nasya (Uttara Khanda Ch. 8)', indication: 'Epistaxis.', details: 'Durva Swarasa Nasya.' }],
    },
  },

  // HRIDROGA & RAKTACHAPA (HEART DISEASE / ANGINA / HYPERTENSION)
  {
    match: ['hridroga', 'angina', 'ischemic heart', 'cardiac', 'coronary', 'raktachapa', 'vyana bala', 'hypertension', 'blood pressure', 'high bp'],
    charaka: {
      dRef: 'Charaka Samhita, Chikitsa Sthana 26/77–80 & Sutrasthana 17/30–40',
      cRef: 'Charaka Samhita, Chikitsa Sthana 26/81–103 (Trimarmiya Chikitsa)',
      nidanaSanskrit: 'वैवर्ण्यमूर्च्छाज्वरकासहिक्काः श्वासोऽरुचिस्तृष्णामोहछर्दिः... हृद्रोगजाः स्युर्विविधास्तथाऽन्ये ॥',
      nidanaTranslit: 'Vaivarṇya-mūrcchā-jvara-kāsa-hikkāḥ śvāso’rucis tṛṣṇā-moha-chardiḥ... hṛdrogajāḥ syur vividhās tathā’nye ||',
      nidanaMeaning: 'Precordial pain (Hrid-shoola / Aayama / Todana), palpitations, dyspnea on exertion, and giddiness arise when Vyana Vayu, Sadhaka Pitta, and Avalambaka Kapha with Rasa Dhatu are vitiated in the Hridaya Marma.',
      sutra: 'हृद्यं यत्स्याद्यदोजस्यं स्रोतसां यत्प्रसादनम् । तच्च सेव्यं प्रयत्नेन... पुष्करमूलमर्जुनश्च हृद्रोगहरः ॥ (Ch. Su. 30/13 & Chi. 26/81)',
      sutraTitle: 'Hridya-Ojasya-Srotoprasadana Chikitsa Sutra & Pushkaramoola',
      sutraSanskrit: 'पुष्करमूलं हिक्काश्वासकासपार्श्वशूलहराणाम्... तैलसर्पिर्गुडैर्युक्तं हृच्छूलं नाशयेत् ॥',
      sutraTranslit: 'Puṣkaramūlaṁ hikkā-śvāsa-kāsa-pārśvaśūla-harāṇām... taila-sarpir-guḍair yuktaṁ hṛcchūlaṁ nāśayet ||',
      sutraMeaning: 'Administer Hridya, Ojasya, and Sroto-prasadana (coronary channel clearing) therapies; Pushkaramoola and Arjuna relieve Hrit-shoola (angina) and regulate Vyana Vayu.',
      shamana: [
        { category: 'Arishta / Ksheerapaka', medicineName: 'Arjunarishta (Parthadyarishta 20 mL BD) & Arjuna Ksheerapaka (40 mL BD)', dosage: '20 mL Arishta + 40 mL Ksheerapaka BD', anupana: 'Equal water', timing: 'After & Before meals', indications: 'Cardiotonic, cardioprotective, anti-anginal, and antihypertensive', reference: 'Charaka Samhita, Chikitsa Sthana 26 / Bhaishajya Ratnavali 33/75' },
        { category: 'Guggulu / Rasa', medicineName: 'Pushkaramooladi Churna / Prabhakara Vati (250 mg BD) + Hridayarnava Ras (125 mg BD)', dosage: '1 tab each BD', anupana: 'Arjuna Kwatha', timing: 'After meals', indications: 'Improves myocardial perfusion and reduces coronary vasospasm', reference: 'Charaka Samhita, Chikitsa Sthana 26/85 & Bhaishajya Ratnavali' },
        { category: 'Medhya / Raktachapa Shamaka', medicineName: 'Sarpagandha Ghanavati (250 mg HS) + Brahmi Vati (250 mg BD)', dosage: '1 tab HS + 1 tab BD', anupana: 'Lukewarm water', timing: 'After meals & Bedtime', indications: 'Pacifies Vyana-Prana Vata hypertonia and normalizes blood pressure (Raktachapa)', reference: 'BAMS Kayachikitsa Textbook / Bhaishajya Ratnavali' },
      ],
      shodhana: [{ procedure: 'Hrid Basti (Uro Basti with Dhanwantharam / Bala Taila) & Shirodhara', indication: 'Hridroga, angina, and stress-induced hypertension (Vyana Bala Vaishamya).', details: 'Retention of warm Bala-Ashwagandha Taila over precordium for 30 mins + Takradhara/Shirodhara to lower sympathetic drive.' }],
    },
    sushruta: {
      dRef: 'Sushruta Samhita, Uttara Tantra 43/1–10 (Hridroga Pratishedha)',
      cRef: 'Sushruta Samhita, Uttara Tantra 43/11–26',
      nidanaSanskrit: 'दूषयित्वा रसं दोषाः विगुणा हृदयंगताः । हृदि बाधां प्रकुर्वन्ति हृद्रोगं तं प्रचक्षते ॥',
      nidanaTranslit: 'Dūṣayitvā rasaṁ doṣāḥ viguṇā hṛdayaṁ gatāḥ | Hṛdi bādhāṁ prakurvanti hṛdrogaṁ taṁ pracakṣate ||',
      nidanaMeaning: 'Vitiated Doshas contaminating Rasa Dhatu and entering the Hridaya cause precordial pain and distress known as Hridroga.',
      sutra: 'वल्लूरं पञ्चमूलीं च... अर्जुनस्य त्वचा सिद्धं क्षीरं हृद्रोगनाशनम् ॥ (Su. U. 43)',
      sutraTitle: 'Sushruta Hridroga Chikitsa',
      sutraSanskrit: 'दशमूलकषायं वा पिबेल्लवणसंयुतम् । घृतं चार्जुनादिसिद्धं हृद्रोगशमनं परम् ॥',
      sutraTranslit: 'Daśamūla-kaṣāyaṁ vā pibel lavaṇa-saṁyutam | Ghṛtaṁ cārjunādi-siddhaṁ hṛdroga-śamanaṁ param ||',
      sutraMeaning: 'Dashamoola Kwatha and Arjuna-Siddha Ksheera/Ghrita relieve Vataja and Pittaja Hridroga.',
      shamana: [{ category: 'Ghrita & Vati', medicineName: 'Arjuna Ghrita (10 mL OD) + Prabhakara Vati (250 mg BD)', dosage: '10 mL + 1 tab BD', anupana: 'Warm milk or water', timing: 'Morning & After meals', indications: 'Strengthens cardiac muscle (Hrid-balya)', reference: 'Sushruta Samhita, Uttara Tantra 43' }],
      shodhana: [{ procedure: 'Hrid Basti & Mridu Anulomana', indication: 'Hridroga (avoid violent Shodhana to protect Hridaya Marma).', details: 'Gentle Hrid Basti with Bala Taila.' }],
    },
    vagbhata: {
      dRef: 'Ashtanga Hridaya, Nidana Sthana 5/38–44',
      cRef: 'Ashtanga Hridaya, Chikitsa Sthana 6/25–58',
      nidanaSanskrit: 'ककुभत्वक्सिद्धं पयः... पञ्चमूलीकषायश्च हृद्रोगश्वासकासजित् ॥',
      nidanaTranslit: 'Kakubhatvak-siddhaṁ payaḥ... pañcamūlī-kaṣāyaś ca hṛdroga-śvāsa-kāsajit ||',
      nidanaMeaning: 'Milk medicated with Kakubha (Arjuna) bark and Dashamoola/Nayopayam Kashaya conquer Hridroga.',
      sutra: 'ककुभत्वचा शृतं क्षीरं शर्करार्चितं पिबेत् । हृद्रोगशान्तये नित्यं पुष्करमूलमेव च ॥ (A.H. Chi. 6/42)',
      sutraTitle: 'Vagbhata Kakubha (Arjuna) Ksheerapaka & Pushkaramoola in Hridroga',
      sutraSanskrit: 'पार्थस्य कल्कस्वरसेन सिद्धं... सर्पिर्हृद्रोगजिच्छ्रेष्ठम् ॥',
      sutraTranslit: 'Pārthasya kalka-svarasena siddhaṁ... sarpir hṛdrogajic chreṣṭham ||',
      sutraMeaning: 'Ghrita and Ksheera prepared with Partha (Arjuna) bark cure all cardiac disorders.',
      shamana: [{ category: 'Ksheerapaka & Kashaya', medicineName: 'Arjuna Ksheerapaka (50 mL BD) + Parthadyarishta (20 mL BD)', dosage: '50 mL + 20 mL BD', anupana: 'Warm water', timing: 'Before & After meals', indications: 'Reduces cardiac preload/afterload and improves ejection fraction', reference: 'Ashtanga Hridaya, Chikitsa Sthana 6/42' }],
      shodhana: [{ procedure: 'Hrid Pichu / Hrid Basti & Shirodhara', indication: 'Hridroga & Raktachapa.', details: 'Ksheerabala Taila Hrid Pichu & Shirodhara.' }],
    },
    chakradatta: {
      dRef: 'Chakradatta, Chapter 31 (Hridroga Chikitsa)',
      cRef: 'Chakradatta, Chapter 31/1–35',
      nidanaSanskrit: 'घृतेन दुग्धेन गुडाभ्भसा वा पिबन्ति चूर्णं ककुभत्वचो ये । हृद्रोगजीर्णज्वररक्तपित्तं हत्वा भवेयुश्चिरजीविनस्ते ॥',
      nidanaTranslit: 'Ghṛtena dugdhena guḍāmbhasā vā pibanti cūrṇaṁ kakubhatvaco ye | Hṛdroga-jīrṇajvara-raktapittaṁ hatvā bhaveyuś cirajīvinas te ||',
      nidanaMeaning: 'Those who take Kakubha (Arjuna) bark powder with Ghrita, milk, or jaggery water conquer Hridroga and Raktapitta and attain long life (Chakradatta 31/17).',
      sutra: 'पुष्करमूलचूर्णं तु मधुना सह लेहयेत् । हृच्छूलश्वासकासघ्नं क्षयहिक्कानिवारणम् ॥ (Chakradatta 31/12)',
      sutraTitle: 'Famous Arjuna Twak & Pushkaramoola Shlokas by Acharya Chakradatta',
      sutraSanskrit: 'घृतेन दुग्धेन गुडाभ्भसा वा पिबन्ति चूर्णं ककुभत्वचो ये । हृद्रोगजीर्णज्वररक्तपित्तं हत्वा भवेयुश्चिरजीविनस्ते ॥',
      sutraTranslit: 'Ghṛtena dugdhena guḍāmbhasā vā pibanti cūrṇaṁ kakubhatvaco ye | Hṛdroga-jīrṇajvara-raktapittaṁ hatvā bhaveyuś cirajīvinas te ||',
      sutraMeaning: 'Arjuna Twak Churna with milk/Ghrita and Pushkaramoola Churna with honey are the supreme remedies for Hridroga.',
      shamana: [{ category: 'Churna & Vati', medicineName: 'Arjuna Twak Churna (3 g) + Pushkaramoola Churna (2 g) BD + Prabhakara Vati (1 tab BD)', dosage: '5 g Churna + 1 tab BD', anupana: 'Warm Milk (Ksheerapaka) or Honey', timing: 'After meals', indications: 'Directly cited in Chakradatta 31/12 & 31/17 for angina and heart disease', reference: 'Chakradatta, Hridroga Chikitsa 31/12, 17' }],
      shodhana: [{ procedure: 'Hrid Basti', indication: 'Hridroga.', details: 'Narayana Taila Hrid Basti.' }],
    },
    sharangadhara: {
      dRef: 'Sharangadhara Samhita, Purva Khanda 7/26',
      cRef: 'Sharangadhara Samhita, Madhyama Khanda 1 (Arjuna Ksheerapaka) & Bhaishajya Ratnavali (Parthadyarishta)',
      nidanaSanskrit: 'अर्जुनक्षीरपाकश्च पार्थद्यारिष्ट एव च । प्रभाकरवटी चैव सर्वहृद्रोगनाशिनी ॥',
      nidanaTranslit: 'Arjuna-kṣīrapākaś ca pārthadyāriṣṭa eva ca | Prabhākaravaṭī caiva sarva-hṛdroga-nāśinī ||',
      nidanaMeaning: 'Arjuna Ksheerapaka (1:8:32 milk decoction ratio of Sharangadhara), Parthadyarishta, and Prabhakara Vati cure all Hridrogas.',
      sutra: 'द्रव्यादष्टगुणं क्षीरं क्षीरात्तोयं चतुर्गुणम् । क्षीरावशेषं तत्पीतं हृद्रोगं नाशयेद्ध्रुवम् ॥ (Sha. Ma. 1/160)',
      sutraTitle: 'Sharangadhara Ksheerapaka Kalpana (Arjuna Ksheerapaka)',
      sutraSanskrit: 'द्रव्यादष्टगुणं क्षीरं क्षीरात्तोयं चतुर्गुणम् । क्षीरावशेषं कर्तव्यं क्षीरपाकविधौ सदा ॥',
      sutraTranslit: 'Dravyād aṣṭaguṇaṁ kṣīraṁ kṣīrāt toyaṁ caturguṇam | Kṣīrāvaśeṣaṁ kartavyaṁ kṣīrapāka-vidhau sadā ||',
      sutraMeaning: 'Boil 1 part coarse Arjuna bark in 8 parts milk and 32 parts water until only milk remains; this Arjuna Ksheerapaka is the supreme Hridya formulation.',
      shamana: [{ category: 'Ksheerapaka & Arishta', medicineName: 'Arjuna Ksheerapaka (50 mL BD) + Parthadyarishta (20 mL BD) + Jawahar Mohra Pishti (125 mg BD)', dosage: '50 mL + 20 mL + 125 mg BD', anupana: 'Warm Milk / Water', timing: 'Morning & Evening', indications: 'Strengthens myocardium and regulates blood pressure', reference: 'Sharangadhara Samhita, Madhyama Khanda 1/160' }],
      shodhana: [{ procedure: 'Hrid Basti & Takradhara', indication: 'Hridroga & Raktachapa.', details: 'Cardioprotective external oleation.' }],
    },
  },

  // MUTRAKRICHRA & MUTRASHMARI (UTI & RENAL CALCULI)
  {
    match: ['mutrakrichra', 'mutrashmari', 'ashmari', 'uti', 'dysuria', 'cystitis', 'calculi', 'kidney stone', 'renal colic'],
    charaka: {
      dRef: 'Charaka Samhita, Chikitsa Sthana 26/32–44 (Trimarmiya — Mutrakrichra & Ashmari)',
      cRef: 'Charaka Samhita, Chikitsa Sthana 26/45–76',
      nidanaSanskrit: 'व्यायामतीक्ष्णौषधमद्ययोगात्... बस्तौ निबद्धो मुष्णाति मूत्रं कृच्छ्रेण मानवः ॥ विशोषयेद्बस्तिगतं सशुक्रं मूत्रं सपित्तं पवनः कफं वा... अश्मरी जायते ॥',
      nidanaTranslit: 'Vyāyāma-tīkṣṇauṣadha-madyayogāt... bastau nibaddho muṣṇāti mūtraṁ kṛcchreṇa mānavaḥ || Viśoṣayed bastigataṁ saśukraṁ mūtraṁ sapittaṁ pavanaḥ kaphaṁ vā... aśmarī jāyate ||',
      nidanaMeaning: 'Vitiated Doshas in the Basti (urinary tract) cause painful, burning micturition (Mutrakrichra); when Vata dries up Kapha-Pitta-Mutra in the urinary tract like gallstones in a cow, Ashmari (calculus) forms.',
      sutra: 'अभ्यङ्गस्नेहनिरूहबस्तयः... पाषाणभेदवृश्चीरश्वदंष्ट्रादिभिः शृतम् । पानं क्षारप्रयोगश्च मूत्रकृच्छ्राश्मरीहरः ॥ (Ch. Chi. 26/45–68)',
      sutraTitle: 'Charaka Mutrakrichra & Ashmari Chikitsa Sutra (Gokshura, Pashanabheda & Kshara)',
      sutraSanskrit: 'गोक्षुरकश्च मूत्रकृच्छ्रानिलहराणाम्... पाषाणभेदकं चूर्णं सक्षारं चाश्मरीं भिन्द्यात् ॥',
      sutraTranslit: 'Gokṣurakaś ca mūtrakṛcchrānilaharāṇām... pāṣāṇabhedakaṁ cūrṇaṁ sakṣāraṁ cāśmarīṁ bhindyāt ||',
      sutraMeaning: 'Gokshura is the foremost herb for Mutrakrichra (Ch. Su. 25/40), while Pashanabheda, Varuna, Kulattha, and Yavakshara disintegrate Ashmari (renal calculi).',
      shamana: [
        { category: 'Vati & Guggulu', medicineName: 'Chandraprabha Vati (2 tabs BD) + Gokshuradi Guggulu (2 tabs BD)', dosage: '2 tablets each BD', anupana: 'Punarnavashtaka Kwatha or Trinpanchamoola Kwatha', timing: 'After meals', indications: 'Relieves burning dysuria (UTI), crystalluria, and ureteric edema', reference: 'Charaka Samhita, Chikitsa Sthana 26/45–65 & Sharangadhara Ma. 7' },
        { category: 'Kwatha & Kshara', medicineName: 'Varunadi Kwatha / Pashanabhedadi Kwatha (40 mL BD) + Shwetaparpati / Yavakshara (500 mg BD)', dosage: '40 mL Kwatha + 500 mg Kshara BD', anupana: 'Narikela Jala (Tender coconut water)', timing: 'Before meals', indications: 'Lithotriptic (Ashmari-bhedana), urinary alkalinizer, and diuretic (Mutrala)', reference: 'Charaka Samhita, Chikitsa Sthana 26/60–68' },
      ],
      shodhana: [{ procedure: 'Avagaha Sweda (Warm Pelvic Sitz Bath) & Uttara Basti / Viratarwadi Niruha Basti', indication: 'Renal colic and Mutrakrichra (Ch. Chi. 26/45).', details: 'Warm pelvic bath relaxes ureteric spasm; Viratarwadi Basti flushes Mutravaha Srotas.' }],
    },
    sushruta: {
      dRef: 'Sushruta Samhita, Nidana Sthana 3/1–28 (Ashmari Nidana) & Uttara 59 (Mutrakrichra)',
      cRef: 'Sushruta Samhita, Chikitsa Sthana 7/1–38 (Ashmari Chikitsa)',
      nidanaSanskrit: 'असंशोधनशीलस्य... श्लेष्मा मूत्रयुतो बस्तौ संविश्य कुरुतेऽश्मरीम् ॥ अश्मरी दारुणो व्याधिरन्तकप्रतिमो मतः । तरुणी भेषजैः साध्या प्रवृद्धा शस्त्रकर्मणा ॥',
      nidanaTranslit: 'Asaṁśodhana-śīlasya... śleṣmā mūtrayuto bastau saṁviśya kurute’śmarīm || Aśmarī dāruṇo vyādhir antaka-pratimo mataḥ | Taruṇī bheṣajaiḥ sādhyā pravṛddhā śastrakarmaṇā ||',
      nidanaMeaning: 'Acharya Sushruta states that Ashmari is a formidable disease; newly formed small calculi (Taruni) are curable by Bheshaja (Ghrita, Kshara, Kwatha), while large obstructing calculi (Pravriddha) require Shastra Karma (lithotomy).',
      sutra: 'वरुणादिगणक्वाथः कदलीक्षारसंयुतः । अश्मरीं भिनत्ति क्षिप्रं वीरतर्वादिरेव च ॥ (Su. Chi. 7/5–24)',
      sutraTitle: 'Sushruta Ashmari Chikitsa Sutra (Varunadi, Viratarwadi & Kshara)',
      sutraSanskrit: 'वरुणादिगणक्वाथः शिलया क्षारसंयुतः । अश्मरीं शर्करां चैव भिनत्ति च निहन्ति च ॥',
      sutraTranslit: 'Varuṇādi-gaṇa-kvāthaḥ śilayā kṣāra-saṁyutaḥ | Aśmarīṁ śarkarāṁ caiva bhinatti ca nihanti ca ||',
      sutraMeaning: 'Varunadi Gana and Viratarwadi Gana decoctions mixed with Yavakshara/Apamarga Kshara and Shilajatu disintegrate Ashmari and Sharkara (gravel).',
      shamana: [{ category: 'Gana Kwatha & Kshara', medicineName: 'Varunadi Kwatha (40 mL BD) + Apamarga Kshara / Yavakshara (500 mg BD) + Chandraprabha Vati (2 tabs BD)', dosage: '40 mL + 500 mg + 2 tabs BD', anupana: 'Warm water or Kulattha Yusha', timing: 'Before & After meals', indications: 'Disintegrates calcium oxalate/uric acid stones and cures dysuria', reference: 'Sushruta Samhita, Chikitsa Sthana 7/9–24' }],
      shodhana: [{ procedure: 'Uttara Basti & Avagaha Sweda', indication: 'Mutrashmari & Mutrakrichra.', details: 'Medicated Kshara/Taila Basti and warm pelvic tub bath.' }],
    },
    vagbhata: {
      dRef: 'Ashtanga Hridaya, Nidana Sthana 9/1–19',
      cRef: 'Ashtanga Hridaya, Chikitsa Sthana 11/1–42 (Mutraghata-Ashmari Chikitsa)',
      nidanaSanskrit: 'यदा वायुर्मुखं बस्तेर्नाभिं मुष्कौ च पीडयेत्... विच्छिन्नधारं मूत्रं च सृजत्यश्मरीमानवः ॥',
      nidanaTranslit: 'Yadā vāyur mukhaṁ baster nābhiṁ muṣkau ca pīḍayet... vicchinna-dhāraṁ mūtraṁ ca sṛjaty aśmarīmānavaḥ ||',
      nidanaMeaning: 'Pain radiating to umbilicus, bladder neck, and groin with interrupted urinary stream (Vicchinna-dhara) and hematuria (Sarudhiram) characterizes Ashmari.',
      sutra: 'बृहत्यादिगणक्वाथः... वीरतर्वादिरश्मरीमूत्रकृच्छ्रहरः परः ॥ (A.H. Chi. 11/18)',
      sutraTitle: 'Vagbhata Brihatyadi & Viratarwadi Kashaya in Mutrakrichra & Ashmari',
      sutraSanskrit: 'बृहतीद्वयगोक्षुरकण्टकारी... मूत्रकृच्छ्राश्मरीहरो बृहत्यादिगणः स्मृतः ॥',
      sutraTranslit: 'Bṛhatīdvaya-gokṣura-kaṇṭakārī... mūtrakṛcchrāśmarīharo bṛhatyādi-gaṇaḥ smṛtaḥ ||',
      sutraMeaning: 'Brihatyadi Kashaya and Viratarwadi Kashaya relieve dysuria, UTI, and renal stones.',
      shamana: [{ category: 'Kashaya', medicineName: 'Brihatyadi Kashayam (15 mL BD) + Varanadi Kashayam (15 mL BD)', dosage: '15 mL each + 45 mL water BD', anupana: 'Shwetaparpati (500 mg)', timing: 'Before meals', indications: 'Clears urinary infection and expels ureteric calculi', reference: 'Ashtanga Hridaya, Chikitsa Sthana 11 & Sutrasthana 15' }],
      shodhana: [{ procedure: 'Avagaha Sweda & Ksheera Basti', indication: 'Pittaja Mutrakrichra & Ashmari.', details: 'Pelvic Sitz bath and cooling Basti.' }],
    },
    chakradatta: {
      dRef: 'Chakradatta, Chapter 32 (Mutrakrichra) & Chapter 34 (Ashmari Chikitsa)',
      cRef: 'Chakradatta, Chapters 32 & 34',
      nidanaSanskrit: 'तृणपञ्चमूलक्वाथः शतावरीसमन्वितः । वरुणत्वक्कषायश्च सगुडः साश्मरीं जयेत् ॥',
      nidanaTranslit: 'Tṛṇapañcamūla-kvāthaḥ śatāvarī-samanvitaḥ | Varuṇatvak-kaṣāyaś ca saguḍaḥ sāśmarīṁ jayet ||',
      nidanaMeaning: 'Trinpanchamoola Kwatha cures Pittaja Mutrakrichra (UTI), while Varuna bark decoction with Guda and Kulattha Kwatha shatter Ashmari.',
      sutra: 'वरुणत्वक्कषायं तु पीत्वा गुडसमन्वितम् । अश्मरीं पातयत्याशु बस्तिशूलं च नाशयेत् ॥ (Chakradatta 34/26)',
      sutraTitle: 'Varuna Twak Kwatha & Trinpanchamoola Kwatha by Acharya Chakradatta',
      sutraSanskrit: 'कुशः काशः शर्रो दर्भ इक्षुश्चेति तृणोद्भवम् । पित्तमूत्रकृच्छ्रहरं तृणपञ्चमूलमुत्तमम् ॥',
      sutraTranslit: 'Kuśaḥ kāśaḥ śaro darbha ikṣuś ceti tṛṇodbhavam | Pitta-mūtrakṛcchraharaṁ tṛṇapañcamūlam uttamam ||',
      sutraMeaning: 'Trinpanchamoola Kwatha cures burning UTI (Pittaja Mutrakrichra) and Varuna Kwatha expels renal calculi.',
      shamana: [{ category: 'Kwatha', medicineName: 'Trinpanchamoola Kwatha / Varunadi Kwatha (40 mL BD) + Eladi Churna (3 g BD)', dosage: '40 mL + 3 g BD', anupana: 'Tandulodaka or Yavakshara', timing: 'Before meals', indications: 'Specific Chakradatta remedies for UTI and renal stones', reference: 'Chakradatta, Chapters 32/14 & 34/26' }],
      shodhana: [{ procedure: 'Avagaha Sweda', indication: 'Ureteric colic.', details: 'Warm Dashamoola tub bath.' }],
    },
    sharangadhara: {
      dRef: 'Sharangadhara Samhita, Purva Khanda 7/31',
      cRef: 'Sharangadhara Samhita, Madhyama Khanda 7/40–49 (Chandraprabha Vati) & 7/84 (Gokshuradi Guggulu)',
      nidanaSanskrit: 'चन्द्रप्रभा वटी सेव्या गोक्षुरादिश्च गुग्गुलुः । मूत्रकृच्छ्रमश्मरीं च प्रमेहान् विंशतिं जयेत् ॥',
      nidanaTranslit: 'Candraprabhā vaṭī sevyā gokṣurādiś ca gugguluḥ | Mūtrakṛcchram aśmarīṁ ca pramehān viṁśatiṁ jayet ||',
      nidanaMeaning: 'Chandraprabha Vati (Sha. Ma. 7/40) and Gokshuradi Guggulu (Sha. Ma. 7/84) are the two authoritative Sharangadhara formulations for Mutrakrichra and Ashmari.',
      sutra: 'अष्टाविंशतिकर्षस्तु गोक्षुरः... प्रमेहान् मूत्रकृच्छ्राणि मूत्राघातं च नाशयेत् ॥ (Sha. Ma. 7/84–87)',
      sutraTitle: 'Gokshuradi Guggulu & Chandraprabha Vati (Sharangadhara Samhita)',
      sutraSanskrit: 'चन्द्रप्रभा वटी ख्याता सर्वरोगप्रणाशिनी । मूत्रकृच्छ्रं मूत्राघातमश्मरीं च विनाशयेत् ॥',
      sutraTranslit: 'Candraprabhā vaṭī khyātā sarvaroga-praṇāśinī | Mūtrakṛcchraṁ mūtrāghātam aśmarīṁ ca vināśayet ||',
      sutraMeaning: 'Chandraprabha Vati and Gokshuradi Guggulu eradicate Mutrakrichra, Mutraghata, and Ashmari.',
      shamana: [{ category: 'Vati & Guggulu', medicineName: 'Chandraprabha Vati (2 tabs BD) + Gokshuradi Guggulu (2 tabs BD) + Punarnavasava (20 mL BD)', dosage: '2 tabs each + 20 mL BD', anupana: 'Warm water', timing: 'After meals', indications: 'Urinary antiseptic, lithotriptic, and nephroprotective', reference: 'Sharangadhara Samhita, Madhyama Khanda 7/40–49 & 7/84–87' }],
      shodhana: [{ procedure: 'Uttara Basti (Uttara Khanda Ch. 7)', indication: 'Chronic Mutrakrichra & Ashmari.', details: 'Sterile medicated Uttara Basti.' }],
    },
  },
];

interface CompactPresetDiseaseSpec {
  keys: string[];
  name: string;
  cRef: string;
  sRef: string;
  vRef: string;
  cdRef: string;
  shRef: string;
  nidanaSanskrit: string;
  nidanaTranslit: string;
  nidanaMeaning: string;
  cSutra: string;
  sSutra: string;
  vSutra: string;
  cdSutra: string;
  shSutra: string;
  cMed: [string, string, string];
  sMed: [string, string, string];
  vMed: [string, string, string];
  cdMed: [string, string, string];
  shMed: [string, string, string];
  shodhana: [string, string];
  charakaMentioned?: boolean;
  sushrutaMentioned?: boolean;
  vagbhataMentioned?: boolean;
}

const COMPACT_SPECS: CompactPresetDiseaseSpec[] = [
  {
    keys: ['apasmara', 'epilepsy', 'seizure'],
    name: 'Apasmara (Epilepsy)',
    cRef: 'Chikitsa Sthana 10/1–66 (Apasmara Chikitsitam)',
    sRef: 'Uttara Tantra 61/1–42 (Apasmara Pratishedha)',
    vRef: 'Chikitsa Sthana 7/1–38 (Apasmara Chikitsa)',
    cdRef: 'Adhyaya 21 (Apasmara Chikitsa)',
    shRef: 'Madhyama Khanda 9 (Panchagavya Ghrita) & 10 (Saraswatarishta)',
    nidanaSanskrit: 'स्मृतेरपगमं प्राहुरपस्मारं भिषग्वराः । तमःप्रवेशं बीभत्सचेष्टं दोषसमुच्छ्रयात् ॥',
    nidanaTranslit: 'Smṛter apagamaṁ prāhur apasmāraṁ bhiṣag-varāḥ | Tamaḥ-praveśaṁ bībhatsa-ceṣṭaṁ doṣa-samucchrayāt ||',
    nidanaMeaning: 'Apasmara is characterized by transient loss of memory and consciousness (Smriti-apagama), entering into darkness (Tamah-pravesha), and convulsive movements due to vitiated Doshas and Rajas-Tamas.',
    cSutra: 'तैर्वृतं हृदयंस्रोतो... तीक्ष्णैः प्रथमं भिषक् । संज्ञां प्रबोधयेदाशु संशोधनैः शमयेत्ततः ॥ (Ch. Chi. 10/14–16 — First awaken consciousness with Tikshna Nasya/Anjana, then purify with Vamana/Virechana/Basti and administer Panchagavya/Mahapanchagavya Ghrita.)',
    sSutra: 'सिद्धार्थकादिगदं सर्पिः पञ्चगव्यं च पाययेत् । शिरोविरेचनं कुर्यादपस्मारप्रशान्तये ॥ (Su. U. 61/22–30 — Administer Siddharthakadi Ghrita, Panchagavya Ghrita, and Shirovirechana Nasya.)',
    vSutra: 'महापञ्चगव्यं घृतं ब्राह्मीघृतं च सेवयेत् । तीक्ष्णैर्नस्याञ्जनैर्बुद्धिं हृदयं च विशोधयेत् ॥ (A.H. Chi. 7/18–26 — Clear Manovaha Srotas with Tikshna Nasya, Brahmi Ghrita, and Mahapanchagavya Ghrita.)',
    cdSutra: 'कल्याणकं पञ्चगव्यं कूष्माण्डस्वरसं तथा । अपस्मारहरं श्रेष्ठं वचाचूर्णं समधुना ॥ (Chakradatta 21/12–28 — Kalyanaka Ghrita, Kushmanda Swarasa with Yashthimadhu, and Vacha Churna with honey.)',
    shSutra: 'सारस्वतारिष्टवरः स्मृतिमेधाबलप्रदः । पञ्चगव्यघृतं चैव अपस्मारविनाशनम् ॥ (Sha. Ma. 9 & 10 — Saraswatarishta and Panchagavya Ghrita restore Smriti and eradicate Apasmara.)',
    cMed: ['Mahapanchagavya Ghrita (10 mL OD) + Brahmi Ghrita (10 mL OD)', 'Warm Milk', 'Clears Manovaha Srotas obstruction and prevents seizure recurrence (Ch. Chi. 10/18–25)'],
    sMed: ['Siddharthakadi Ghrita (10 mL OD) + Kalyanaka Ghrita (10 mL HS)', 'Warm Water', 'Anticonvulsant and Medhya Rasayana (Su. U. 61/24)'],
    vMed: ['Brahmi Ghrita (10 mL BD) + Vacha-Shankhapushpi Churna (2 g BD)', 'Madhu & Ghrita', 'Stabilizes Prana Vayu and Sadhaka Pitta (A.H. Chi. 7/20)'],
    cdMed: ['Smritisagara Rasa (125 mg BD) + Kushmanda Swarasa with Yashthimadhu (20 mL BD)', 'Ghee & Honey', 'Specific Chakradatta Apasmaraghna yoga (Chakradatta 21/18)'],
    shMed: ['Saraswatarishta (15 mL BD) + Chaturbhuja Rasa (125 mg BD)', 'Warm Water', 'Medhya, anticonvulsant, and nerve tonic (Sha. Ma. 10)'],
    shodhana: ['Tikshna Pradhamana Nasya & Virechana Karma', 'Trikatu-Vacha-Shigru Nasya during aura/post-ictal stage followed by Tilvaka Ghrita Virechana (Ch. Chi. 10/14).'],
  },
  {
    keys: ['unmada', 'insanity', 'psychosis', 'anxiety', 'depression', 'manas'],
    name: 'Unmada & Chittodvega (Neuro-Psychiatric Disorder)',
    cRef: 'Chikitsa Sthana 9/1–98 (Unmada Chikitsitam)',
    sRef: 'Uttara Tantra 62/1–35 (Unmada Pratishedha)',
    vRef: 'Chikitsa Sthana 6/1–58 (Unmada Chikitsa)',
    cdRef: 'Adhyaya 20 (Unmada Chikitsa)',
    shRef: 'Madhyama Khanda 9 (Kalyanaka Ghrita) & 10 (Ashwagandharishta)',
    nidanaSanskrit: 'उन्मादं पुनर्मनोबुद्धिसंज्ञाज्ञानस्मृतिभक्तिशीलचेष्टाचारविभ्रमं विद्यात् ॥',
    nidanaTranslit: 'Unmādaṁ punar mano-buddhi-saṁjñā-jñāna-smṛti-bhakti-śīla-ceṣṭācāra-vibhramaṁ vidyāt ||',
    nidanaMeaning: 'Unmada is defined by Acharya Charaka (Ch. Ni. 7/5) as perversion/derangement of Manas (mind), Buddhi (intellect), Samjna (orientation), Smriti (memory), Bhakti (desire), Shila (temperament), Cheshta (psychomotor behavior), and Achara (conduct).',
    cSutra: 'स्नेहस्वेदौ वमनविरेचने आस्थापनमनुवासनमुपसर्गो नस्यं... कल्याणकघृतं पुराणघृतं च सत्वावजयश्च ॥ (Ch. Chi. 9/25–33 — Snehana, Shodhana, Kalyanaka/Mahakalyanaka Ghrita, Purana Ghrita, and Sattvavajaya psychotherapy.)',
    sSutra: 'स्निग्धं स्विन्नं तु वमनाद्यैर्विशोधयेत् । कल्याणकं महातिक्तं घृतं नस्यं च कारयेत् ॥ (Su. U. 62/14–22 — Purify with Vamana/Virechana and administer Kalyanaka Ghrita and Nasya.)',
    vSutra: 'मेध्यानि घृतपानानि नस्यानि विविधानि च । आश्वासनं सुहृद्वाक्यं सत्वावजयमाचरेत् ॥ (A.H. Chi. 6/15–30 — Medhya Ghritas, Shirodhara, Nasya, and reassuring Sattvavajaya counseling.)',
    cdSutra: 'उन्मादगजकेसरी रसो ब्राह्मीघृतं तथा । सारस्वतं च चूर्णं हि मानसव्याधिनाशनम् ॥ (Chakradatta 20/15–32 — Unmadagajakesari Rasa, Brahmi Ghrita, and Saraswata Churna.)',
    shSutra: 'अश्वगन्धारिष्टवरः सारस्वतरसायनम् । उन्मादं चित्तोद्वेगं च नाशयेदविकल्पतः ॥ (Sha. Ma. 10 — Ashwagandharishta and Saraswatarishta cure Unmada and Chittodvega.)',
    cMed: ['Kalyanaka Ghrita / Mahakalyanaka Ghrita (10 mL OD) + Medhya Rasayana Kwatha (Mandukaparni-Yashthimadhu-Guduchi-Shankhapushpi 40 mL BD)', 'Warm Milk', 'Restores Sattva Guna,Buddhi, and Smriti (Ch. Chi. 9/33–42 & Ch. Chi. 1/3/30)'],
    sMed: ['Phala Ghrita / Kalyanaka Ghrita (10 mL OD) + Brahmi Vati (1 tab BD)', 'Warm Milk', 'Pacifies Manovaha Srotas Doshas (Su. U. 62/18)'],
    vMed: ['Saraswata Churna (3 g BD) + Manasamitra Vataka (1 tab BD)', 'Cow Milk & Honey', 'Calms Rajas-Tamas and induces restorative sleep (A.H. Chi. 6)'],
    cdMed: ['Unmadagajakesari Rasa (125 mg BD) + Chaturbhuja Rasa (125 mg OD)', 'Brahmi Swarasa or Honey', 'Potent Chakradatta Manas-rogahara yoga (Chakradatta 20)'],
    shMed: ['Ashwagandharishta (20 mL BD) + Saraswatarishta (15 mL BD)', 'Equal Warm Water', 'Relieves anxiety, insomnia, and psychomotor agitation (Sha. Ma. 10)'],
    shodhana: ['Shirodhara (Takradhara / Ksheeradhara), Nasya & Virechana', 'Continuous stream of medicated buttermilk/milk over forehead + Ksheerabala Nasya + Mridu Virechana (Ch. Chi. 9/25).'],
  },
  {
    keys: ['pakshaghata', 'pakshavadha', 'hemiplegia', 'stroke', 'paralysis', 'ardita', 'bell'],
    name: 'Pakshaghata & Ardita (Stroke / Hemiplegia / Facial Palsy)',
    cRef: 'Chikitsa Sthana 28/53–55 & 28/99–101 (Vatavyadhi — Pakshaghata & Ardita)',
    sRef: 'Nidana Sthana 1/60–72 & Chikitsa Sthana 4 (Vatavyadhi Chikitsa)',
    vRef: 'Nidana Sthana 15/38–42 & Chikitsa Sthana 21/43–55',
    cdRef: 'Adhyaya 22 (Vatavyadhi Chikitsa — Mashadi Kwatha & Ekangaveera Rasa)',
    shRef: 'Madhyama Khanda 2 (Maharasnadi Kwatha) & 9 (Mahanarayana Taila)',
    nidanaSanskrit: 'गृहीत्वार्धं शरीरस्य सिराः स्नायूविशोष्य च । पक्षमन्यतरं हन्ति सन्धिबन्धान् विमोक्षयन् ॥ (Ch. Chi. 28/53)',
    nidanaTranslit: 'Gṛhītvārdhaṁ śarīrasya sirāḥ snāyū viśoṣya ca | Pakṣam anyataraṁ hanti sandhi-bandhān vimokṣayan ||',
    nidanaMeaning: 'Aggravated Vata seizing half the body dries up the Siras (vessels) and Snayus (tendons/nerves) and paralyzes one side (Pakshaghata) with loss of motor function and speech; in Ardita, it causes unilateral facial deviation.',
    cSutra: 'स्वेदनं स्नेहसंयुक्तं पक्षाघाते विरेचनम् । अर्दिते नावनीयं च नस्यं मूर्ध्नि च तैलकम् ॥ (Ch. Chi. 28/99–100 — In Pakshaghata administer Snehana, Swedana, and Snigdha Virechana; in Ardita administer Navana Nasya, Murdhni Taila/Shirobasti, and Tarpana.)',
    sSutra: 'महावातव्याधिषु बलातैलमभ्यङ्गपानबस्तिषुोजयेत् ॥ (Su. Chi. 4/28 — Use Bala Taila for Abhyanga, Pana, Nasya, and Anuvasana Basti in Pakshavadha and Ardita.)',
    vSutra: 'पक्षाघाते विरेकस्तु स्निग्धः कार्यो बस्तिस्तथा । अर्दिते नस्यमूर्ध्वं च नवनीतेन तर्पणम् ॥ (A.H. Chi. 21/43–52 — Snigdha Virechana with Eranda Taila and Matra/Karma Basti in Pakshaghata; Nasya and Shirobasti in Ardita.)',
    cdSutra: 'माषबलाशूकशिम्बीकषायं... एकाङ्गवीररसश्च पक्षाघातार्दितापहः ॥ (Chakradatta 22/28–35 — Mashabaladi Kwatha for Nasya/Pana and Ekangaveera Rasa.)',
    shSutra: 'महारस्नादिक्वाथश्च महानारायणं तथा । पक्षाघातमर्दितं च जयेदाशु न संशयः ॥ (Sha. Ma. 2 & 9 — Maharasnadi Kwatha and Mahanarayana Taila restore neuromuscular function.)',
    cMed: ['Bala Taila / Ksheerabala (101) Avarti (10 drops BD) + Brihat Vata Chintamani Rasa (125 mg BD)', 'Warm Milk or Maharasnadi Kwatha', 'Neuro-regenerative Majja-Dhatu Rasayana for post-stroke recovery (Ch. Chi. 28/100)'],
    sMed: ['Bala Taila Pana & Abhyanga + Trayodashanga Guggulu (2 tabs BD)', 'Warm Milk', 'Nourishes desiccated Sira-Snayu-Kandara (Su. Chi. 4/28)'],
    vMed: ['Dhanadanayanadi Kashayam / Mashabaladi Kashayam (15 mL BD) + Ksheerabala 101 Caps (2 BD)', 'Warm Water', 'Specific Ashtanga Hridaya Kashaya for Ardita and Pakshaghata (A.H. Chi. 21)'],
    cdMed: ['Ekangaveera Rasa (125 mg BD) + Yogendra Rasa (125 mg OD) + Mashabaladi Kwatha (40 mL BD)', 'Ardraka Swarasa / Honey', 'Restores hemiplegic motor power and cranial nerve function (Chakradatta 22)'],
    shMed: ['Maharasnadi Kwatha (40 mL BD) + Ashwagandharishta (20 mL BD) + Mahanarayana Taila Abhyanga', 'Warm Water', 'Rehabilitates spasticity and hemiparesis (Sha. Ma. 2 & 9)'],
    shodhana: ['Snigdha Virechana (Ch. Chi. 28/100), Mustadi Yapana Basti & Shirobasti / Nasya', 'Gandharvahastadi Eranda Taila Snigdha Virechana followed by 16-day Mustadi Yapana Basti & Ksheerabala Nasya.'],
  },
  {
    keys: ['shirah', 'shiroroga', 'ardhavabhedaka', 'suryavarta', 'migraine', 'headache', 'sinusitis'],
    name: 'Shiroroga — Ardhavabhedaka & Suryavarta (Migraine & Headache)',
    cRef: 'Sutra Sthana 17/12–82 (Kiyantah Shirasiya) & Siddhi Sthana 9/74–88',
    sRef: 'Uttara Tantra 25/1–18 & 26/1–46 (Shiroroga Vijñaniya & Pratishedha)',
    vRef: 'Uttara Sthana 23/1–24 & 24/1–58 (Shiroroga Pratishedha)',
    cdRef: 'Adhyaya 60 (Shiroroga Chikitsa — Pathyadi Kwatha)',
    shRef: 'Madhyama Khanda 2/143–145 (Pathyadi Shadanga Kwatha) & 8 (Shadbindu Taila)',
    nidanaSanskrit: 'यस्योत्तमाङ्गार्धमतीव जन्तोः सम्भेदतोदभ्रमशूलजुष्टम् । पक्षाद्दशाहादथवाप्यकस्मात्तस्यार्धभेदं त्रितयाद्व्यवस्येत् ॥ (Su. U. 25/15)',
    nidanaTranslit: 'Yasyottamāṅgārdham atīva jantoḥ sambheda-toda-bhrama-śūla-juṣṭam | Pakṣād daśāhād athavāpy akasmāt tasyārdhabhedaṁ tritayād vyavasyet ||',
    nidanaMeaning: 'Paroxysmal severe splitting, piercing, and throbbing pain affecting exact half of the head (neck, brow, temple, ear, eye, forehead) recurring every 10–15 days is Ardhavabhedaka (Migraine); pain increasing with sunrise and subsiding at sunset is Suryavarta.',
    cSutra: 'अर्द्धावभेदके नस्यं चतुःस्नेहं विरेचनम् । नावनं धूपनं चैव सर्पिषश्चावपीडकम् ॥ (Ch. Si. 9/77–78 — Administer Chatushneha, Virechana, Brihana Navana Nasya, and medicated Ghrita in Ardhavabhedaka.)',
    sSutra: 'सूर्यावर्तार्धभेदाभ्यां नस्यं क्षीरघृतं हितम् । शिरोबस्तिश्च लेपश्च जाङ्गलैश्चोपनाहनम् ॥ (Su. U. 26/31–36 — Ksheera-Ghrita Nasya, Shirobasti, and cooling Lepas cure Suryavarta and Ardhavabhedaka.)',
    vSutra: 'अर्धभेदे जयेत् पूर्वं वातपित्तहरं विधिम् । नस्यं वरादिना क्वाथः शिरोबस्तिश्च पूजितः ॥ (A.H. U. 24/25–34 — Vata-Pittahara Nasya, Varadi/Pathyadi Kwatha, and Shirobasti.)',
    cdSutra: 'पथ्याबिभीतधात्रीणां भूनिम्बनिम्नदारुभिः... पथ्यादिः क्वाथ उच्यते शिरःशूलार्धभेदजित् ॥ (Chakradatta 60/42 — Pathyadi Kwatha with Guda/Ghee cures Ardhavabhedaka and Suryavarta.)',
    shSutra: 'पथ्याक्षधात्रीभूनिम्बनिशा... षडङ्गः क्वाथ उच्यते सूर्यावर्तार्धभेदजित् ॥ (Sha. Ma. 2/143–145 — Pathyadi Shadanga Kwatha and Shadbindu Taila Nasya.)',
    cMed: ['Pathyadi Kwatha (40 mL BD) + Shirashooladi Vajra Rasa (250 mg BD) + Godanti Bhasma (500 mg BD)', 'Ghee & Warm Water', 'Relieves trigeminovascular Vata-Pitta throbbing migraine and photophobia (Ch. Si. 9/77)'],
    sMed: ['Mayuradya Ghrita (10 mL OD) + Sutshekhar Rasa (125 mg BD) + Yashthimadhu Ghrita Nasya', 'Warm Milk', 'Pacifies Rakta-Pitta-Vata in Suryavarta and Ardhavabhedaka (Su. U. 26/32)'],
    vMed: ['Varadi Kashayam / Pathyadi Kashayam (15 mL BD) + Ksheerabala 101 Nasya (4 drops each nostril)', 'Ghee', 'Clears Pranavaha & Raktavaha Srotas in the head (A.H. U. 24/28)'],
    cdMed: ['Pathyadi Kwatha (40 mL BD) + Mahalakshmi Vilasa Rasa (125 mg BD) + Kumkumadi / Shadbindu Taila Nasya', 'Guda (Jaggery) or Ghee', 'Authoritative Chakradatta Ch. 60 formula for migraine, sinus headache, and neuralgia'],
    shMed: ['Pathyadi Shadanga Kwatha (40 mL BD) + Godanti Bhasma (500 mg BD) + Shadbindu Taila Nasya (6 drops)', 'Ghee & Mishri', 'Codified in Sharangadhara Madhyama Khanda 2/143 specifically for Ardhavabhedaka & Suryavarta'],
    shodhana: ['Shadbindu / Anu Taila Marsha Nasya, Shirodhara & Mridu Virechana', '6–8 drops Shadbindu or Ksheerabala Taila Nasya daily for 7 days + Avipattikar Virechana (Su. U. 26/31).'],
  },
  {
    keys: ['medoroga', 'sthaulya', 'obesity', 'dyslipidemia', 'cholesterol', 'metabolic'],
    name: 'Sthaulya & Medoroga (Obesity & Dyslipidemia)',
    cRef: 'Sutra Sthana 21/1–35 (Ashtau Ninditiya Adhyaya)',
    sRef: 'Sutra Sthana 15/32–37 (Doshadhatumalakshayavriddhi — Medovriddhi)',
    vRef: 'Sutra Sthana 14/1–28 (Dvividhopakramaniya — Apatarpana/Langhana)',
    cdRef: 'Adhyaya 36 (Sthaulya Chikitsa — Vidangadi Lauha & Navaka Guggulu)',
    shRef: 'Madhyama Khanda 7/70–75 (Triphala Guggulu & Navaka Guggulu)',
    nidanaSanskrit: 'मेदसाऽवृतमार्गत्वाद्वायुः कोष्ठे विशेषतः । चरन् सन्धुक्षयत्यग्निमाहारं शोषयत्यपि ॥ (Ch. Su. 21/5)',
    nidanaTranslit: 'Medasā’vṛta-mārgatvād vāyuḥ koṣṭhe viśeṣataḥ | Caran sandhukṣayaty agnim āhāraṁ śoṣayaty api ||',
    nidanaMeaning: 'Obstructed by excessive Meda Dhatu, Koshthagata Vayu whips up Jatharagni (causing voracious hunger/Tikshnagni) while Medodhatvagni remains sluggish, accumulating only Meda and starving succeeding Dhatus.',
    cSutra: 'गुरु चातर्पणं चेष्टं स्थूलानां कृशितं प्रति... विडङ्गं नागरं क्षारः काललोहरजो मधु ॥ (Ch. Su. 21/20–23 — Administer Guru-Atarpana diet [heavy to digest but non-nourishing like Yava/barley], Rookshana Udvartana, Vidangadi Churna, Shilajatu, and Takrarishta.)',
    sSutra: 'तत्र शिलाजतुगुग्गुलुगोमूत्रत्रिफलादीनां प्रयोगः... व्यायामश्च मेदोदोषहरः ॥ (Su. Su. 15/32 — Administer Shilajatu, Guggulu, Gomutra, Triphala, Salasaradi Gana, and daily Vyayama.)',
    vSutra: 'मधुना त्रिफलां लिह्याद्गुडूचीमभयां घनम्... वरागुग्गुलुमाक्षिकैः स्थौल्यं जयेत् ॥ (A.H. Su. 14/22–28 — Triphala, Guduchi, Musta with honey, Varanadi Kashaya, andRooksha Udvartana.)',
    cdSutra: 'व्योषचित्रकमुस्तानां त्रिफलाया विडङ्गकम्... नवको गुग्गुलुः ख्यातः स्थौल्यमेदोदरोपहः ॥ (Chakradatta 36/18–24 — Navaka Guggulu, Amritadi Guggulu, and Vidangadi Lauha.)',
    shSutra: 'त्रिफलाव्योषचित्रकैर्नवको गुग्गुलुः स्मृतः । मेदोवृद्धिं कफं स्थौल्यं जयेन्मध्वनुपातः ॥ (Sha. Ma. 7 — Navaka Guggulu and Triphala Guggulu with honey water.)',
    cMed: ['Vidangadi Lauha (250 mg BD) + Mustadi Kwatha (40 mL BD) + Agnimantha Swarasa with Shilajatu (500 mg OD)', 'Madhu-udaka (Warm honey water)', 'Breaks Medovaha Srotas Avarana and scrapes Abaddha Meda (Ch. Su. 21/21–28)'],
    sMed: ['Salasaradi Gana Kwatha / Asana-Eladi Kwatha (40 mL BD) + Shuddha Shilajatu (500 mg OD)', 'Triphala Kwatha', 'Lekhana (lipid-scraping) and Medohara (Su. Su. 15/32)'],
    vMed: ['Varanadi Kashayam (15 mL BD) + Ayaskriti (20 mL BD) + Lodhrasava (20 mL BD)', 'Warm Water', 'Corrects Medodhatvagni Mandya and insulin resistance (A.H. Su. 14 & 15)'],
    cdMed: ['Navaka Guggulu (2 tabs BD) + Medohara Guggulu (2 tabs BD) + Trimad Churna (3 g BD)', 'Warm Water with 1 tsp Honey', 'Authoritative Chakradatta Ch. 36 lipid-lowering formulations'],
    shMed: ['Triphala Guggulu (2 tabs BD) + Navaka Guggulu (2 tabs BD)', 'Ushnodaka', 'Scrapes visceral and subcutaneous adiposity (Sha. Ma. 7)'],
    shodhana: ['Ruksha Udvartana (Dry Herbal Powder Massage) & Lekhana Basti (Ch. Su. 21/21)', 'Vigorous upward dry massage with Kolakulathadi/Triphala Churna + Erandamooladi Lekhana Niruha Basti with Gomutra & Madhu.'],
  },
  {
    keys: ['shotha', 'shopha', 'edema', 'anasarca', 'nephrotic', 'swelling'],
    name: 'Shotha / Shopha (Generalized & Localized Edema)',
    cRef: 'Sutra Sthana 18 & Chikitsa Sthana 12/1–102 (Svayathu Chikitsitam)',
    sRef: 'Chikitsa Sthana 23/1–18 (Shopha Chikitsa)',
    vRef: 'Nidana Sthana 13 & Chikitsa Sthana 17/1–42 (Svayathu Chikitsa)',
    cdRef: 'Adhyaya 39 (Shotha Chikitsa — Punarnavashtaka Kwatha & Punarnavadi Mandura)',
    shRef: 'Madhyama Khanda 2 (Punarnavashtaka Kwatha) & 10 (Punarnavasava)',
    nidanaSanskrit: 'रक्तपित्तकफान् वायुर्दुष्टो दुष्टान् बहिः सिराः । नीत्वा रुद्धगतिस्तैर्हि कुर्यात्त्वङ्मांससंश्रयम् उत्सेधं संहतं शोथम् ॥ (Ch. Chi. 12/8)',
    nidanaTranslit: 'Rakta-pitta-kaphān vāyur duṣṭo duṣṭān bahiḥ sirāḥ | Nītvā ruddha-gatis tair hi kuryāt tvaṅ-māṁsa-saṁśrayam utsedhaṁ saṁhataṁ śotham ||',
    nidanaMeaning: 'Vitiated Vayu propels morbid Rakta, Pitta, and Kapha into peripheral channels (Bahya Siras); obstructed there, they accumulate between Tvak and Mamsa causing elevated swelling (Utsedha) called Shotha.',
    cSutra: 'पुनर्नवामृतादारुपथ्याशुण्ठीकषायकम्... गोमूत्रं वा पयसा वा शोथघ्नं शिलाजतु ॥ (Ch. Chi. 12/21–48 — Administer Punarnavadi Kwatha, Shilajatu, Gomutra Haritaki, Punarnavadi Mandura, and Dashamoola; restrict salt, water, and curd.)',
    sSutra: 'पुनर्नवादिभिः क्वाथैर्मूत्रैश्चापि विशोधयेत् । वर्जयेल्लवणाम्लानि गुर्वभिष्यन्दिभोजनम् ॥ (Su. Chi. 23/10–14 — Punarnavadi Kwatha, Gomutra, Virechana, and strict Lavana-varjana.)',
    vSutra: 'पुनर्नवाभयाशुण्ठीदार्वीक्वाथः सगुग्गुलुः । शोफं सर्वङ्गगं हन्ति तक्रं च सवयस्कम् ॥ (A.H. Chi. 17/14–26 — Punarnavadi Kashaya with Guggulu and Takra diet.)',
    cdSutra: 'पुनर्नवानिम्बपटोलशुण्ठीतिक्तामृतादारुहरीतकीनाम्... सर्वाङ्गशोथोदरपाण्डुरोगान् जयेत्पुनर्नवाष्टकः ॥ (Chakradatta 39/10 — Punarnavashtaka Kwatha cures anasarca, ascites, and Pandu.)',
    shSutra: 'पुनर्नवाष्टकक्वाथः पुनर्नवासवस्तथा । शोथं पाण्डुं जलोदरं जयेदाशु न संशयः ॥ (Sha. Ma. 2 & 10 — Punarnavashtaka Kwatha and Punarnavasava.)',
    cMed: ['Punarnavashtaka Kwatha (40 mL BD) + Punarnavadi Mandura (2 tabs BD) + Gomutra Haritaki (3 g HS)', 'Takra (Buttermilk) or Warm Water', 'Potent Shothahara, Mutrala (diuretic), and Yakrit-Vrikka protective (Ch. Chi. 12/21–38)'],
    sMed: ['Punarnavadi Kwatha (40 mL BD) + Gokshuradi Guggulu (2 tabs BD)', 'Warm Water', ' Mobilizes interstitial Kleda and clears Udakavaha Srotas (Su. Chi. 23/12)'],
    vMed: ['Punarnavadi Kashayam (15 mL BD) + Dashamoola Haritaki Avaleha (10 g BD)', 'Warm Water', 'Reduces renal, cardiac, and hepatic edema (A.H. Chi. 17/14)'],
    cdMed: ['Punarnavashtaka Kwatha (40 mL BD) + Shothari Mandura / Dugdha Vati (1 tab BD)', 'Warm Water / Milk', 'Authoritative Chakradatta Ch. 39 Shothahara regimen'],
    shMed: ['Punarnavasava (20 mL BD) + Chandraprabha Vati (2 tabs BD)', 'Equal Warm Water', 'Enhances GFR and resolves pitting edema (Sha. Ma. 10)'],
    shodhana: ['Nitya Virechana & Dashamoola-Punarnava Lepa (Ch. Chi. 12/16)', 'Gomutra-Haritaki / Eranda Taila Virechana + warm local paste of Punarnava, Shunthi, and Devadaru.'],
  },
  {
    keys: ['gulma', 'parinamashoola', 'annadrava', 'peptic ulcer', 'duodenal ulcer', 'abdominal lump', 'chardi', 'vomiting', 'anaha', 'agnimandya', 'ajirna', 'dyspepsia'],
    name: 'Gulma, Parinamashoola, Chardi & Agnimandya (GI & Peptic Disorders)',
    cRef: 'Chikitsa Sthana 5/1–183 (Gulma), 15 (Grahani/Agnimandya) & 20 (Chardi Chikitsa)',
    sRef: 'Uttara Tantra 42 (Gulma), 49 (Chardi) & 56 (Visuchika/Ajirna)',
    vRef: 'Chikitsa Sthana 14 (Gulma) & 6 (Chardi Chikitsa)',
    cdRef: 'Adhyaya 26 (Shoola/Parinamashoola), 15 (Chardi) & 6 (Ajirna Chikitsa)',
    shRef: 'Madhyama Khanda 6 (Hingvashtaka Churna) & 7 (Shankha Vati)',
    nidanaSanskrit: 'भुक्ते जीर्यति यच्छूलं तदेव परिणामजम्... स्पर्शोपलभ्यः परिपिण्डितत्वाद्गुल्मः स बस्तिहृदयान्tarाले ॥ (Ma. Ni. 26/15 & Ch. Chi. 5/6)',
    nidanaTranslit: 'Bhukte jīryati yac chūlaṁ tad eva pariṇāmajam... sparśopalabhyaḥ paripiṇḍitatvād gulmaḥ sa basti-hṛdayāntarāle ||',
    nidanaMeaning: 'Colicky epigastric pain peaking during digestion of food (2–3 hours post-meal) is Parinamashoola (Duodenal Ulcer); localized rounded neuro-muscular/gaseous mass between Hridaya and Basti is Gulma.',
    cSutra: 'लङ्घनं वमनं स्वेदो... स्नेहः स्वेदः स्रंसनं बस्तिकर्म गुल्मे कार्यं वातहरं यथावत् ॥ (Ch. Chi. 5/20–29 — Snehana, Swedana, Vatanulomana Sransana, Hingvadi Churna, Sukumara Ghrita, and Basti in Gulma; Bilwadi/Eladi in Chardi.)',
    sSutra: 'स्निग्धाय स्विन्नदेहाय दद्यात्स्नेहविरेचनम् । हिङ्ग्वादिचूर्णं गुल्मघ्नं शूलं च शमयेद् ध्रुवम् ॥ (Su. U. 42/22–38 — Snigdha Virechana and Hingvadi Churna with warm water.)',
    vSutra: 'सुकुमारं घृतं सेव्यं हिङ्ग्वष्टकपुरःसरम् । शूलगुल्मानाहहरं दीपनं पाचनं परम् ॥ (A.H. Chi. 14/31–48 — Hingvashtaka Churna with Ghee at first morsel and Sukumara Ghrita.)',
    cdSutra: 'शम्बूकभस्म सघृतं... धात्रीलौहं शतावरीमण्डूरं परिणामशूलजित् ॥ (Chakradatta 26/45–68 — Dhatri Lauha, Shatavari Mandura, and Narikela Khanda for Parinamashoola; Hingvadi for Gulma.)',
    shSutra: 'त्रिकटुगजाजमोदा... हिङ्ग्वष्टकं चूर्णमिदं गुल्मानाहाग्निमान्द्यजित् ॥ (Sha. Ma. 6/43–46 — Hingvashtaka Churna and Shankha Vati.)',
    cMed: ['Hingvashtaka Churna (3 g with 1st morsel + Ghee) + Sukumara Ghrita (10 mL OD) + Chitrakadi Vati (2 tabs BD)', 'Warm Water / Buttermilk', 'Kindles Jatharagni, relieves Anaha/Gulma spasm, and regulates Samana-Apana Vayu (Ch. Chi. 5/79)'],
    sMed: ['Dadhika Ghrita / Hingvadi Churna (3 g BD) + Eladi Churna with Honey (for Chardi)', 'Warm Water', 'Resolves abdominal colic, tympanites, and nausea (Su. U. 42 & 49)'],
    vMed: ['Sukumaram Kashayam (15 mL BD) + Indukanta Ghrita (10 mL OD)', 'Warm Water', 'Heals mucosal ulceration and Vata-Pittaja Gulma (A.H. Chi. 14)'],
    cdMed: ['Dhatri Lauha (500 mg BD) + Shatavari Mandura (500 mg BD) + Shankha Vati (1 tab BD)', 'Ghee & Honey', 'Specific Chakradatta Ch. 26 Parinamashoolahara & Shoolahara formulations'],
    shMed: ['Hingvashtaka Churna (3 g BD) + Shankha Vati (250 mg BD) + Kumaryasava (20 mL BD)', 'Warm Water', 'Digestant, carminative, and antispasmodic (Sha. Ma. 6 & 7)'],
    shodhana: ['Snigdha Virechana & Yapana / Anuvasana Basti (Ch. Chi. 5/27)', 'Sukumara Eranda Taila Virechana + Dashamoola Basti (or Laja-Mandapana & Mridu Vamana in Kaphaja Chardi).'],
  },
  {
    keys: ['krumi', 'krimi', 'worm', 'helminth', 'parasite', 'amoebiasis'],
    name: 'Krumi Roga (Helminthiasis & Parasitic Infection)',
    cRef: 'Vimana Sthana 7/1–30 (Vyadhitarupiya — Krumi Chikitsa)',
    sRef: 'Uttara Tantra 54/1–42 (Krimi Roga Pratishedha)',
    vRef: 'Chikitsa Sthana 20/19–35 (Krimi Chikitsa)',
    cdRef: 'Adhyaya 7 (Krimi Chikitsa — Vidangadi Churna & Krimimudgara Rasa)',
    shRef: 'Madhyama Khanda 10 (Vidangarishta) & 6 (Vidangadi Churna)',
    nidanaSanskrit: 'पुरीषजाः श्लेष्मजाश्च शोणितजाश्च विंशतिः । कृमयो नामतः प्रोक्ता ज्वरातीसारशूलदाः ॥ (Ch. Vi. 7/9)',
    nidanaTranslit: 'Purīṣajāḥ śleṣmajāś ca śoṇitajāś ca viṁśatiḥ | Kṛmayo nāmataḥ proktā jvarātīsāra-śūladāḥ ||',
    nidanaMeaning: 'Acharya Charaka classifies 20 varieties of Krumi (Purishaja, Shleshmaja, Raktaja) causing colic, diarrhea, anal itching (Guda-kandu), pallor, and Udarashoola.',
    cSutra: 'अपकर्षणमेवादौ कार्यं प्रकृतिविघातनम् । निदानं च वर्जनीयं कृमीणां त्रिविधं हितम् ॥ (Ch. Vi. 7/14 — The 3-fold Chikitsa Sutra of Charaka: 1. Apakarshana [expulsion by Virechana/Basti/Shirovirechana], 2. Prakriti-Vighata [destroying favorable gut milieu using Katu-Tikta-Kashaya herbs like Vidanga], 3. Nidana-Parivarjana [avoiding sweets, jaggery, and curd].)',
    sSutra: 'विडङ्गं पिप्पलीं शिग्रुं पलाशबीजमेव च । सुरसादिगणं चैव कृमिघ्नं पाययेद् भिषक् ॥ (Su. U. 54/20–28 — Administer Surasadi Gana, Vidanga, Palasha Bija, and Musta.)',
    vSutra: 'विडङ्गतण्डुलव्योषत्रिफलाभिः सशर्कराः... कृमिघ्नं प्रकृतिविघातं चाचरेत् ॥ (A.H. Chi. 20/22–32 — Vidanga, Palasha Bija, Indrayava, and Prakriti-Vighata.)',
    cdSutra: 'पलाशबीजस्वरसं विडङ्गं मुस्तकं तथा । कृमिमुद्गररसश्चाशु नाशयेत्कृमिसञ्चयम् ॥ (Chakradatta 7/8–18 — Palasha Bija, Vidanga Churna, and Krimimudgara Rasa.)',
    shSutra: 'विडङ्गारिष्टसेवा तु कृमिकुष्ठभगन्दरान् । नाशयेदचिरादेव जाठराग्निं च दीपयेत् ॥ (Sha. Ma. 10/47–52 — Vidangarishta and Krimikuthara Rasa.)',
    cMed: ['Vidanga Churna (3 g BD) + Krimighna Mahakashaya Kwatha (40 mL BD) + Kampillaka Churna (1 g with Takra)', 'Takra (Buttermilk) or Honey', 'Executes Prakriti-Vighata and expels Purishaja & Shleshmaja Krumi (Ch. Vi. 7/15–26)'],
    sMed: ['Surasadi Gana Kwatha (40 mL BD) + Palasha Bija Churna (3 g BD)', 'Honey & Warm Water', 'Vermicidal and Kapha-kleda-shoshaka (Su. U. 54/22)'],
    vMed: ['Asanadi / Mustadi Kashayam (15 mL BD) + Vidangadi Churna (3 g BD)', 'Warm Water', 'Eradicates intestinal parasites and restores Agni (A.H. Chi. 20)'],
    cdMed: ['Krimimudgara Rasa (250 mg BD) + Krimikuthara Rasa (250 mg BD) + Palasha-Vidanga Kwatha', 'Musta Kwatha', 'Fast-acting Chakradatta Ch. 7 anthelmintic protocol'],
    shMed: ['Vidangarishta (20 mL BD) + Vidanga Lauha (250 mg BD)', 'Equal Warm Water', 'Prevents reinfestation and corrects worm-induced Pandu (Sha. Ma. 10/47)'],
    shodhana: ['Apakarshana Virechana & Mustadi Asthapana Basti (Ch. Vi. 7/16)', 'Trivrit-Vidanga Virechana + Musta-akhuparni-Vidanga Niruha Basti.'],
  },
  {
    keys: ['rajayakshma', 'shosha', 'tuberculosis', 'koch', 'wasting'],
    name: 'Rajayakshma & Kshaya (Pulmonary Tuberculosis & Cachexia)',
    cRef: 'Chikitsa Sthana 8/1–190 (Rajayakshma Chikitsitam)',
    sRef: 'Uttara Tantra 41/1–58 (Shosha Pratishedha)',
    vRef: 'Chikitsa Sthana 5/1–84 (Rajayakshma Chikitsa)',
    cdRef: 'Adhyaya 10 (Rajayakshma Chikitsa — Sitopaladi, Eladi & Swarna Malini Vasant)',
    shRef: 'Madhyama Khanda 6 (Sitopaladi & Talisadi Churna) & 8 (Chyawanprasha)',
    nidanaSanskrit: 'साहसं संधारणं क्षयो विषमभोजनम्... एकादशरूपाणि षड्रूपाणि वा राजयक्ष्मणः ॥ (Ch. Chi. 8/13)',
    nidanaTranslit: 'Sāhasaṁ sandhāraṇaṁ kṣayo viṣama-bhojanam... ekādaśa-rūpāṇi ṣaḍ-rūpāṇi vā rājayakṣmaṇaḥ ||',
    nidanaMeaning: 'Arising from 4 Etiological Pillars (Sahasa/overexertion, Vega-sandharana, Dhatu-kshaya, Vishamashana), Rajayakshma manifests with Sadrupa (Kasa, Jwara, Parshvashoola, Swarabheda, Atisara, Aruchi) and Dhatu wasting.',
    cSutra: 'शुष्यतां क्षीणमांसानां कल्पितानि विधानवित् । दद्यान्मांसानि... सितोपलादिचूर्णं च वासाघृतं च्यवनप्राशमेव च ॥ (Ch. Chi. 8/64–149 — Preserve Bala and Purisha! Strictly avoid Shodhana in cachectic patients; administer Sitopaladi Churna, Talisadi Churna, Vasa Ghrita, Chyawanprasha, and Brimhana Mamsarasa.)',
    sSutra: 'अजादीनां घृतं क्षीरं मांसं च शोषनाशनम् । एलादिमन्थं सर्पिंषि रसायनानि च योजयेत् ॥ (Su. U. 41/34–48 — Goat milk/ghee [Ajadugdha/Ajaghrita], Eladi Mantha, and Rasayana.)',
    vSutra: 'बृंहणं दीपनं हृद्यं शोषिणां मलधारकम् । दुरालभादिघृतं सेव्यं जीवन्त्यादिघृतं तथा ॥ (A.H. Chi. 5/24–55 — Brimhana, Deepana, Purisha-rakshana, Jivantyadi Ghrita, and Talisadi Churna.)',
    cdSutra: 'स्वर्णमालिनीवसन्तो रसो राजमृगाङ्ककः । वासावलेहः शोषघ्नः क्षयकासज्वरापहः ॥ (Chakradatta 10/18–45 — Swarna Malini Vasant, Rajamriganka Rasa, and Vasavaleha.)',
    shSutra: 'सितोपला तुगाक्षीरी पिप्पली बहुला त्वचः... राजयक्ष्मापहं श्रेष्ठं तालिसादिं च भक्षयेत् ॥ (Sha. Ma. 6/134–140 — Sitopaladi Churna, Talisadi Churna, and Chyawanprasha.)',
    cMed: ['Sitopaladi Churna (3 g) + Abhraka Bhasma (125 mg) + Swarna Malini Vasant (125 mg BD) + Chyawanprasha (10 g OD)', 'Goat Milk (Ajadugdha) or Ghee & Honey', 'Rebuilds depleted Rasa-Rakta-Mamsa-Ojas and resolves Kasa, Jwara, and hemoptysis (Ch. Chi. 8/103–148)'],
    sMed: ['Eladi Churna (3 g BD) + Panchamrita Loha Guggulu / Vasa Ghrita (10 mL BD)', 'Warm Milk & Honey', 'Brimhana and Pranavaha Srotas restorative (Su. U. 41/40)'],
    vMed: ['Talisadi Churna (3 g BD) + Jivantyadi Ghrita / Kushmanda Rasayana (10 g BD)', 'Warm Milk', 'Protects Agni and checks Dhatu-Kshaya (A.H. Chi. 5/30)'],
    cdMed: ['Mahalakshmi Vilasa Rasa (125 mg BD) + Vasavaleha (10 g BD) + Lokanatha Rasa (125 mg BD)', 'Honey', 'Chakradatta Ch. 10 Kshayahara & Rasayana protocol'],
    shMed: ['Draksharishta (20 mL BD) + Talisadi Churna (3 g BD) + Chyawanprasha Avaleha (10 g OD)', 'Warm Water / Milk', 'Restores appetite, pulmonary vitality, and immunity (Sha. Ma. 6 & 8)'],
    shodhana: ['Brimhana Snehana & Yapana Basti (Strictly NO Tikshna Shodhana in Kshina Rogi — Ch. Chi. 8/87)', 'Gentle Bala-Ashwagandha Taila Abhyanga and Ksheera/Yapana Basti to preserve Purisha and Bala.'],
  },
  {
    keys: ['visarpa', 'herpes', 'cellulitis', 'erysipelas', 'sheetapitta', 'udarda', 'kotha', 'urticaria', 'hives', 'allergy'],
    name: 'Visarpa & Sheetapitta-Udarda-Kotha (Herpes Zoster / Cellulitis & Urticaria)',
    cRef: 'Chikitsa Sthana 21/1–142 (Visarpa Chikitsitam) & Sutra Sthana 18 (Kotha)',
    sRef: 'Nidana Sthana 10 & Chikitsa Sthana 17 (Visarpa Chikitsa)',
    vRef: 'Chikitsa Sthana 18/1–38 (Visarpa Chikitsa)',
    cdRef: 'Adhyaya 51 (Sheetapitta-Udarda-Kotha) & Adhyaya 53 (Visarpa Chikitsa)',
    shRef: 'Madhyama Khanda 6 (Haridra Khanda) & 2 (Amritadi Kwatha)',
    nidanaSanskrit: 'विविधं सर्पतीति विसर्पः... वरटीदष्टसंस्थानः शोथः सञ्जायते बहिः । सकण्डूस्तोदबहुलो छर्दिज्वरविदाहवान् ॥ (Ch. Chi. 21/11 & Ma. Ni. 50/4)',
    nidanaTranslit: 'Vividhaṁ sarpatīti visarpaḥ... varaṭī-daṣṭa-saṁsthānaḥ śothaḥ sañjāyate bahiḥ | Sakaṇḍūs toda-bahulo chardi-jvara-vidāhavān ||',
    nidanaMeaning: 'Rapidly spreading fiery vesicular eruption across skin/blood is Visarpa (Herpes Zoster/Erysipelas); wasp-sting like itchy erythematous wheals triggered by cold wind (Sheeta-maruta) is Sheetapitta (Urticaria).',
    cSutra: 'लङ्घनोल्लेखने शस्ते तिक्तकानां च सेवनम् । रक्तमोक्षणमेवादौ विसर्पे पित्तनाशनम् ॥ (Ch. Chi. 21/43–50 — Langhana, Tikta Dravya, immediate Raktamokshana, Mahatikta Ghrita, and Shatadhauta Ghrita Lepa.)',
    sSutra: 'सिरामोक्षं प्रदेहांश्च घृतपानं विरेचनम् । कुर्याद्विसर्पशान्त्यर्थं शीतपित्तहरं तथा ॥ (Su. Chi. 17/10–18 — Raktamokshana, cooling Pradeha Lepa, and Tikta Ghrita Virechana.)',
    vSutra: 'विसर्पे रक्तमोक्षो हि परं भैषज्यमुच्यते । पटोलकटुरोहिण्यादिकषायं च प्रयोजयेत् ॥ (A.H. Chi. 18/8–20 — Jalaukavacharana, Patolakaturohinyadi Kashaya, and Tikta Ghrita.)',
    cdSutra: 'हरिद्राखण्डकः श्रेष्ठः शीतपित्तोदर्दकोठजित् । अमृतादिकषायश्च दशाङ्गलेप एव च ॥ (Chakradatta 51/8–16 & 53/12 — Haridra Khanda with warm milk for Sheetapitta; Dashanga Lepa & Amritadi Kwatha for Visarpa.)',
    shSutra: 'दशाङ्गलेपः सघृतो विसर्पज्वरशोथजित् । हरिद्राखण्डसेवा च शीतपित्तविनाशिनी ॥ (Sha. Ma. 11/4 — Dashanga Lepa with Ghee externally and Haridra Khanda internally.)',
    cMed: ['Mahatikta Ghrita (10 mL BD) + Bhunimbadi / Patoladi Kwatha (40 mL BD) + Shatadhauta Ghrita (External Lepa)', 'Cool Water or Amalaki Swarasa', 'Pacifies acute Rakta-Pitta-Vata burning vesicles and post-herpetic neuralgia (Ch. Chi. 21/54–70)'],
    sMed: ['Karanja-Utpaladi Lepa + Aragwadhadi Kwatha (40 mL BD) + Kamadudha Rasa (250 mg BD)', 'Mishri Water', 'cools Pitta-Rakta inflammation and pruritus (Su. Chi. 17)'],
    vMed: ['Patolakaturohinyadi Kashayam (15 mL BD) + Guggulutiktaka Ghrita (10 mL OD)', 'Warm Water', 'Clears Raktavaha Srotas toxins (A.H. Chi. 18)'],
    cdMed: ['Haridra Khanda (5 g BD) + Sutshekhar Rasa (125 mg BD) + Dashanga Lepa (External with Ghee)', 'Warm Milk', 'Gold-standard Chakradatta Ch. 51 & 53 therapy for Urticaria (Sheetapitta) and Herpes (Visarpa)'],
    shMed: ['Haridra Khanda (5 g BD) + Brihat Manjishthadi Kwatha (40 mL BD) + Dashanga Lepa', 'Lukewarm Milk / Water', 'Anti-allergic, Raktaprasadana, and vesicle-healing (Sha. Ma. 2 & 11)'],
    shodhana: ['Jalaukavacharana (Leech Therapy — Ch. Chi. 21/115) & Trivrut Virechana', 'Immediate local Jalaukavacharana around Visarpa lesions + Mridu Virechana with Draksha-Trivrut.'],
  },
  {
    keys: ['khalitya', 'palitya', 'indralupta', 'alopecia', 'hair fall', 'mukhadushika', 'yuvana', 'pidaka', 'acne', 'dusta-vrana', 'vrana', 'ulcer', 'wound'],
    name: 'Kshudra Roga & Vrana — Khalitya, Mukhadushika & Dushta Vrana (Alopecia, Acne & Chronic Ulcer)',
    cRef: 'Chikitsa Sthana 25/1–120 (Dvivraniya Chikitsitam) & 26/262–280 (Khalitya-Palitya)',
    sRef: 'Nidana Sthana 13 (Kshudra Roga) & Chikitsa Sthana 1/1–135 (Shashti Upakrama) & Ch. 20',
    vRef: 'Uttara Sthana 24 (Khalitya), 25 (Vrana) & 32 (Kshudra Roga Pratishedha)',
    cdRef: 'Adhyaya 44 (Vrana Shotha) & Adhyaya 55 (Kshudra Roga — Bhringaraj Taila & Lodhradi Lepa)',
    shRef: 'Madhyama Khanda 9 (Jatyadi Taila & Neeli Bhringadi Taila) & 11 (Lodhradi Lepa)',
    nidanaSanskrit: 'शाल्मलीकण्टकप्रख्याः कफमारुतशोणितैः । जायन्ते पिडका यूनां विज्ञेया मुखदूषिकाः ॥ रोमकूपानुगं पित्तं वातेन सह मूर्च्छितम् । प्रच्यावयति रोमाणि ततः श्लेष्मा सशोणितः रुणद्धि रोमकूपांस्तत् खालित्यम् ॥ (Su. Ni. 13/32–38)',
    nidanaTranslit: 'Śālmalī-kaṇṭaka-prakhyāḥ kapha-māruta-śoṇitaiḥ | Jāyante piḍakā yūnāṁ vijñeyā mukhadūṣikāḥ || Romakūpānugaṁ pittaṁ vātena saha mūrcchitam | Pracyāvayati romāṇi tataḥ śleṣmā saśoṇitaḥ ruṇaddhi romakūpāṁs tat khālityam ||',
    nidanaMeaning: 'Shalmali-thorn like facial papules/pustules in youth from Kapha-Vata-Rakta are Mukhadushika (Acne vulgaris); Pitta-Vata scorching hair follicles followed by Kapha-Rakta blocking pores causes Khalitya/Indralupta (Alopecia).',
    cSutra: 'संशोध्य खालित्यजुषो... नस्यमभ्यञ्जनं चैव केश्यं च रसायनम् ॥ षष्टिरुपक्रमाः शोफव्रणयोः शोधनरोपणौ ॥ (Ch. Chi. 26/263 & Ch. Chi. 25/38 — Perform Shodhana, Nasya with Maharishi Taila, Keshya Rasayana; for Dushta Vrana apply Vrana-Shodhana and Ropana.)',
    sSutra: 'षष्ठिरुपक्रमाः प्रदिष्ट्याः... लोध्रधान्यवचालेपस्तारुण्यपिडकापहः । इन्द्रलुप्ते सिरां विद्ध्वा प्रच्छाय लेपयेद् भिषक् ॥ (Su. Chi. 1/8 & 20/24–36 — Sushruta Shashti-Upakrama for Vrana; Lodhra-Dhanyaka-Vacha Lepa for Mukhadushika; Pracchana & Gunja/Bhringaraja Lepa for Indralupta.)',
    vSutra: 'नीलीभृङ्गादितैलं च नस्यमभ्यञ्जनं हितम् । लोध्रादिलेपो वक्त्रस्थपिडकानाशनः परः ॥ (A.H. U. 24 & 32 — Neeli Bhringadi Taila, Shadbindu Nasya, and Lodhradi Mukhalepa.)',
    cdSutra: 'जात्यादिघृततैलाभ्यां दुष्टव्रणविरोपणम् । भृङ्गराजरसः सेव्यः केश्यः खालित्यनाशनः ॥ (Chakradatta 44 & 55 — Jatyadi Taila/Ghrita for Dushta Vrana; Mahabhringaraja Taila & Narasimha Rasayana for Khalitya.)',
    shSutra: 'जातीनिम्बपटोलपत्रसिक्थकैः... जात्यादितैलमुद्दिष्टं दुष्टव्रणविशोधनम् ॥ लोध्रधान्यवचालेपो मुखदूषिकानाशनः ॥ (Sha. Ma. 9/168–171 & 11 — Jatyadi Taila and Lodhradi Lepa.)',
    cMed: ['Narasimha Rasayana (10 g OD) + Bhringarajasava (20 mL BD) + Shadbindu Taila Nasya (for Khalitya) / Triphala Guggulu (2 tabs BD for Vrana)', 'Warm Milk / Water', 'Nourishes Asthi-Majja-Kesha and promotes granulation tissue (Ch. Chi. 25 & 26)'],
    sMed: ['Lodhra-Dhanyaka-Vacha Lepa (for Mukhadushika) + Jatyadi Taila (for Vrana) + Kaishora Guggulu (2 tabs BD)', 'Manjishthadi Kwatha', 'Clears Kapha-Rakta comedones and heals non-healing ulcers (Su. Chi. 1 & 20)'],
    vMed: ['Neeli Bhringadi Taila / Malatyadi Taila (Scalp Abhyanga) + Kumkumadi Taila (Facial Lepa) + Aragwadhadi Kashayam (15 mL BD)', 'Warm Water', 'Follicular regeneration and Raktaprasadana (A.H. U. 24 & 32)'],
    cdMed: ['Mahabhringaraja Taila + Saptamrita Lauha (500 mg BD) + Arogyavardhini Vati (250 mg BD)', 'Honey & Ghee', 'Chakradatta Ch. 55 Keshya & Varnya protocol'],
    shMed: ['Jatyadi Taila (Local Dressings) + Sarivadyasava (20 mL BD) + Gandhaka Rasayana (250 mg BD)', 'Warm Water', 'Antimicrobial Vrana-Shodhana-Ropana and blood purifier (Sha. Ma. 9/168)'],
    shodhana: ['Pracchana / Jalaukavacharana (Su. Chi. 20/24), Nasya & Virechana', 'Local Jalaukavacharana in cystic acne/non-healing ulcer or Pracchana in alopecia + Shadbindu Nasya.'],
  },
  {
    keys: ['asrigdara', 'raktapradara', 'menorrhagia', 'dub', 'pradara', 'shwetapradara', 'leucorrhoea', 'kasartava', 'udavartini', 'dysmenorrhea', 'yonivyapad', 'vaginitis', 'pid'],
    name: 'Stree Roga — Asrigdara, Shwetapradara, Kashtartava & Yonivyapad (Gynecological Disorders)',
    cRef: 'Chikitsa Sthana 30/1–280 (Yonivyapad Chikitsitam — Pushyanuga Churna)',
    sRef: 'Uttara Tantra 38/1–32 (Yonivyapad) & Sha. 2 (Asrigdara)',
    vRef: 'Uttara Sthana 33 & 34/1–68 (Guhyaroga Pratishedha — Phalakalyanaka Ghrita)',
    cdRef: 'Adhyaya 61 (Asrigdara) & Adhyaya 62 (Yonivyapad Chikitsa — Ashokarishta & Pushyanuga)',
    shRef: 'Madhyama Khanda 6 (Pushyanuga Churna) & 10 (Ashokarishta & Patrangasava)',
    nidanaSanskrit: 'असृग्दरं भवेत् सर्वं साङ्गमर्दं सवेदनम्... न हि वातादृते योनिर्नारीणां सम्प्रदुष्यति ॥ (Ch. Chi. 30/208 & 30/115)',
    nidanaTranslit: 'Asṛgdaraṁ bhavet sarvaṁ sāṅgamardaṁ savedanam... na hi vātād ṛte yonir nārīṇāṁ sampraduṣyati ||',
    nidanaMeaning: 'Excessive or prolonged menstrual/intermenstrual bleeding with bodyache is Asrigdara (Menorrhagia/AUB); Acharya Charaka declares "Na hi Vatad rite Yonir" — the female reproductive tract is never afflicted without Vata vitiation (Kashtartava/Yonivyapad).',
    cSutra: 'पाठाजम्वाम्रयोर्मध्यं... चूर्णं तण्डुलतोयेन पुष्यानुगमिदं स्मृतम् । असृग्दरं योनिदोषं श्वेतप्रदरं च नाशयेत् ॥ (Ch. Chi. 30/90–96 & 30/116 — Administer Pushyanuga Churna with Tandulodaka and honey in Asrigdara/Pradara; Snehana, Swedana, Uttara Basti, and Bala/Shatavari Ghrita in Vataja Yonivyapad/Kashtartava.)',
    sSutra: 'असृग्दरे रक्तपित्तविधिं कुर्याद्विचक्षणः । योनिं प्रक्षालयेत्क्वाथैर्न्यग्रोधादिगणोद्भवैः ॥ (Su. U. 38/20–30 — Raktapitta-hara Sheetala Chikitsa in Asrigdara; Nyagrodhadi/Triphala Yoni-Prakshalana and Pichu in Yonivyapad.)',
    vSutra: 'फलघृतं कुमाराणां स्त्रीणां चार्तवशूलजित् । पुष्यानुगं च सेवेत तण्डुलाम्बुसमन्वितम् ॥ (A.H. U. 34/22–63 — Phala Ghrita, Pushyanuga Churna, and Uttara Basti.)',
    cdSutra: 'अशोकवल्कलक्वाथः शृतं क्षीरं सुशीतलम् । प्रदरं नाशयेत्सर्वं राजादनकषायकः ॥ (Chakradatta 61/12–28 — Ashoka Twak Ksheerapaka, Pushyanuga Churna, and Pradarantaka Lauha.)',
    shSutra: 'अशोकारिष्टसेवा तु प्रदरं योनिजरुजम् । पात्राङ्गासवरसश्च श्वेतप्रदरनाशनः ॥ (Sha. Ma. 10/14–18 — Ashokarishta and Patrangasava cure Asrigdara, Kashtartava, and Shwetapradara.)',
    cMed: ['Pushyanuga Churna (3 g BD) + Lodhrasava (20 mL BD) [or Sukumara Ghrita 10 mL OD + Rajahpravartini Vati in Kashtartava]', 'Tandulodaka (Rice-washed water) with 1 tsp Madhu', 'Codified by Acharya Charaka (Ch. Chi. 30/90–96) directly for Asrigdara, Shwetapradara, and Yonivyapad'],
    sMed: ['Ashoka Twak Ksheerapaka (50 mL BD) + Chandrakala Rasa (125 mg BD) + Nyagrodhadi Yoni-Prakshalana', 'Cool Milk / Mishri', 'Stambhana (hemostatic), Pittashamaka, and Yoni-shodhaka (Su. U. 38)'],
    vMed: ['Phalakalyanaka Ghrita / Shatavari Ghrita (10 mL OD) + Musalikhadiradi Kashayam (15 mL BD)', 'Warm Milk / Water', 'Regulates Artavavaha Srotas and HPO axis (A.H. U. 34)'],
    cdMed: ['Pradarantaka Lauha (250 mg BD) + Bolabaddha Rasa (250 mg BD) + Udumbara Phala Swarasa', 'Honey & Sugar', 'Chakradatta Ch. 61 & 62 uterine hemostatic and anti-inflammatory yoga'],
    shMed: ['Ashokarishta (20 mL BD) + Patrangasava (20 mL BD) + Pushyanuga Churna (3 g BD)', 'Equal Water & Tandulodaka', 'Tones endometrium, arrests menorrhagia/leucorrhoea, and relieves dysmenorrhea (Sha. Ma. 10)'],
    shodhana: ['Yoni Prakshalana, Yoni Pichu & Uttara Basti (Ch. Chi. 30/108)', 'Panchavalkala Kwatha Yoni-Prakshalana + Jatyadi/Udumbara Taila Pichu + Bala Taila Uttara Basti post-menses.'],
  },
  {
    keys: ['klaibya', 'erectile', 'impotence', 'oligospermia', 'vajikarana', 'shukra', 'mutraghata', 'bph', 'prostate'],
    name: 'Klaibya (Shukra Kshaya / ED) & Mutraghata (BPH / Urinary Retention)',
    cRef: 'Chikitsa Sthana 2/1–4 (Vajikarana Adhyaya) & Siddhi Sthana 9/25–49 (Mutraghata)',
    sRef: 'Chikitsa Sthana 26 (Kshina-Baliya Vajikarana) & Uttara Tantra 58 (Mutraghata Pratishedha)',
    vRef: 'Uttara Sthana 40 (Vajikarana) & Chikitsa Sthana 11 (Mutraghata Chikitsa)',
    cdRef: 'Adhyaya 33 (Mutraghata) & Adhyaya 67 (Vrishya/Vajikarana Adhikara)',
    shRef: 'Madhyama Khanda 7 (Chandraprabha Vati, Gokshuradi Guggulu & Musali Pak)',
    nidanaSanskrit: 'सङ्कल्पाभ्यासचेष्टानां... क्लैब्यं शुक्रक्षयाच्चापि बस्तिकुण्डलकोऽनिलात् ॥ (Ch. Chi. 30/188 & Su. U. 58)',
    nidanaTranslit: 'Saṅkalpābhyāsa-ceṣṭānāṁ... klaibyaṁ śukrakṣayāc cāpi bastikuṇḍalako’nilāt ||',
    nidanaMeaning: 'Klaibya arises from Shukra-Kshaya, Manobhighata, and Vata; Mutraghata (Vastikundala/Ashtheela/BPH) occurs when Apana Vayu obstructs the bladder neck causing hesitancy and retention.',
    cSutra: 'स्वयङ्गुप्ताफलं माषाः शतावरी गोक्षुरस्तथा... बस्तयश्चोत्तरबस्तयो मूत्राघाते प्रशस्यन्ते ॥ (Ch. Chi. 2/1/42 & Ch. Si. 9 — Administer Kapikacchu, Mashaparni, Shatavari, Gokshura Ksheerapaka in Klaibya; Shilajatu, Varunadi, and Uttara Basti in Mutraghata.)',
    sSutra: 'आत्मगुप्ताफलं क्षीरे पक्त्वा सेवेत मानवः । मूत्राघाते शिलाजतु वीरतर्वादिकस्तथा ॥ (Su. Chi. 26/28 & Su. U. 58/27 — Kapikacchu Bija Ksheerapaka for Vajikarana; Shilajatu and Viratarwadi Gana for Mutraghata.)',
    vSutra: 'अश्वगन्धाविदारीभ्यां शतावर्या च साधितम्... बस्तौ मूत्रग्रहे कार्यो वरुणादिः सगुग्गुलुः ॥ (A.H. U. 40 & Chi. 11 — Ashwagandha-Vidari-Shatavari Ghrita and Varanadi Guggulu.)',
    cdSutra: 'वानरीगुटिका श्रेष्ठा शुक्रवृद्धिकरी परा । काञ्चनादिगुग्गुलुश्च मूत्राघातमष्ठीलकापहः ॥ (Chakradatta 33 & 67 — Vanari Gutika for Klaibya; Kanchanara/Gokshuradi Guggulu for Mutraghata/Ashtheela.)',
    shSutra: 'चन्द्रप्रभा वटी सेव्या गोक्षुरादिश्च गुग्गुलुः । मकरध्वजरसश्चैव क्लैब्यमूत्राघ्नाशनः ॥ (Sha. Ma. 7 — Chandraprabha Vati, Gokshuradi Guggulu, and Makaradhwaja.)',
    cMed: ['Kapikacchu-Shatavari-Gokshura-Ashwagandha Churna (5 g BD) [For Mutraghata: Chandraprabha Vati 2 BD + Varunadi Kwatha 40 mL BD]', 'Warm Cow Milk with Ghee & Mishri', 'Vrishya Shukra-janaka Rasayana & Apana-Vata regulator (Ch. Chi. 2 & Si. 9)'],
    sMed: ['Svayamgupta (Kapikacchu) Ksheerapaka + Shuddha Shilajatu (500 mg BD)', 'Warm Milk', 'Restores Shukra Dhatu and relieves prostatic Vatashtheela (Su. Chi. 26 & U. 58)'],
    vMed: ['Amritaprasha Ghrita (10 g BD) / Brihatyadi & Varanadi Kashayam (15 mL BD)', 'Warm Milk / Water', 'Nourishes Shukravaha & Mutravaha Srotas (A.H. U. 40 & Chi. 11)'],
    cdMed: ['Vanari Gutika (2 tabs BD) + Purnachandra Rasa (125 mg BD) [or Gokshuradi + Kanchanara Guggulu in BPH]', 'Warm Milk', 'Chakradatta Ch. 33 & 67 Vajikarana & Mutraghatahara protocol'],
    shMed: ['Makaradhwaja / Siddha Makaradhwaja (60 mg OD) + Chandraprabha Vati (2 tabs BD) + Ashwagandharishta (20 mL BD)', 'Betel leaf / Honey / Warm Milk', 'Aphrodisiac, neurovascular tonic, and urinary tract rejuvenator (Sha. Ma. 7 & 10)'],
    shodhana: ['Vrishya Yapana Basti & Uttara Basti (Ch. Si. 12 & Su. U. 58)', 'Mustadi Yapana Basti + Ksheerabala / नारायण Taila Uttara Basti.'],
  },
  {
    keys: ['netra', 'abhishyanda', 'timira', 'conjunctivitis', 'cataract', 'glaucoma', 'eye', 'karna', 'karnashoola', 'otitis', 'ear', 'tinnitus'],
    name: 'Shalakya Tantra — Netra Abhishyanda, Timira & Karnashoola (Eye & Ear Disorders)',
    cRef: 'Chikitsa Sthana 26/231–261 (Trimarmiya — Netra & Karna Roga Chikitsa)',
    sRef: 'Uttara Tantra 6 (Abhishyanda), 17 (Drishtigata/Timira) & 20–21 (Karnaroga Pratishedha)',
    vRef: 'Uttara Sthana 13 (Timira), 16 (Abhishyanda) & 18 (Karnaroga Pratishedha)',
    cdRef: 'Adhyaya 57 (Karnaroga — Bilva Taila) & Adhyaya 59 (Netraroga — Triphaladi Ghrita)',
    shRef: 'Uttara Khanda 13 (Netra Kalpa — Aschyotana, Tarpana, Triphala Ghrita & Bilva Taila)',
    nidanaSanskrit: 'प्रायेण सर्वे नयनामयास्तु भवन्त्यभिष्यन्दनिमित्तमूलाः... समീरणात् कर्णगतं च शूलम् ॥ (Su. U. 6/5 & 20/3)',
    nidanaTranslit: 'Prāyeṇa sarve nayanāmayās tu bhavanty abhiṣyanda-nimitta-mūlāḥ... samīraṇāt karṇagataṁ ca śūlam ||',
    nidanaMeaning: 'Acharya Sushruta states that almost all eye diseases originate from untreated Abhishyanda (conjunctivitis/uveal congestion), progressing to Adhimantha and Timira; Vata-Kapha obstructed in Shabdavaha Srotas causes Karnashoola (otalgia) and Karnanada (tinnitus).',
    cSutra: 'तर्पणं पुटपाकश्च सेक आश्च्योतनाञ्जनम्... कर्णशूले तु नस्यं च कर्णपूरणमिष्यते ॥ (Ch. Chi. 26/231–261 — Netra Seka, Aschyotana, Tarpana, and Triphala Ghrita for eye diseases; warm Karna Purana and Nasya for Karnashoola.)',
    sSutra: 'लङ्घनालेपनस्वेदसिराव्यधविरेचनैः... त्रिफलाघृतं तिमिरजित् बिल्वतैलं च कर्णजित् ॥ (Su. U. 9, 17 & 21 — Langhana, Seka, Siravyadha, and Triphala Ghrita Tarpana in Netraroga; Bilva Taila / Lashunadi Taila Karna Purana in Karnashoola.)',
    vSutra: 'जीवन्त्यादिघृतं पानात्तर्पणाच्चाक्षिरोगजित् । क्षारतैलं बिल्वतैलं कर्णशूलप्रणाशनम् ॥ (A.H. U. 13/2 & 18/18 — Jivantyadi Ghrita, Mahatriphala Ghrita, and Kshara/Bilva Taila.)',
    cdSutra: 'सप्तामृतं लौहवरं महात्रिफलं घृतम् । तिमिराभिष्यन्दहरं दीपिकातैलमुत्तमम् ॥ (Chakradatta 57 & 59 — Saptamrita Lauha, Mahatriphala Ghrita, and Bilva/Dipika Taila.)',
    shSutra: 'नेत्रप्रसादनं श्रेष्ठं त्रिफलाक्वाथधावनम् । तर्पणं त्रिफलासर्पिः कर्णपूरणमुत्तमम् ॥ (Sha. U. 13 — Triphala Netra Seka, Triphala Ghrita Tarpana, and Bilva Taila Karna Purana.)',
    cMed: ['Saptamrita Lauha (500 mg BD) + Mahatriphala Ghrita (10 mL HS) [For Karna: Sarivadi Vati 2 tabs BD + Bilva Taila Karna Purana]', 'Ghee (1 tsp) + Honey (1/2 tsp) unequal ratio / Warm Milk', 'Chakshushya Rasayana and Shabdavaha Srotas restorative (Ch. Chi. 26/250)'],
    sMed: ['Triphala Ghrita (10 mL BD) + Daruharidra-Lodhra-Yashthimadhu Netra Seka / Lashunadi Taila Karna Purana', 'Warm Milk', 'Clears Pitta-Rakta ocular hyperemia, lenticular opacity, and otalgia (Su. U. 17 & 21)'],
    vMed: ['Jivantyadi Ghrita / Patoladi Ghrita (10 mL OD) + Pathyakshadhatryadi Kashayam (15 mL BD)', 'Warm Water', 'Preserves Drishti (vision) and relieves cochlear Vata (A.H. U. 13 & 18)'],
    cdMed: ['Saptamrita Lauha (500 mg BD) + Chandrodaya Varti / Elaneer Kuzhambu (Ophthalmic) + Kshara Taila (Aural)', 'Honey & Ghee', 'Chakradatta Ch. 57 & 59 Shalakya formulations'],
    shMed: ['Triphala Kwatha Netra Seka + Mahatriphala Ghrita (10 mL OD) + Sarivadi Vati (2 tabs BD)', 'Warm Milk', 'Authoritative Sharangadhara Uttara Khanda Ch. 13 Kriyakalpa protocol'],
    shodhana: ['Netra Kriyakalpa (Seka, Aschyotana, Akshi-Tarpana), Karna Purana & Nasya (Su. U. 18)', 'Sterile Triphala Seka in acute Abhishyanda; Mahatriphala Ghrita Akshi-Tarpana in Timira; warm Bilva Taila Karna Purana in Karnashoola.'],
  },
  {
    keys: ['yakrit', 'pleeha', 'udararoga', 'cirrhosis', 'fatty liver', 'ascites', 'apachi', 'granthi', 'lymphadenitis', 'shlipada', 'filaria', 'upadansha', 'urustambha', 'kroshtuka', 'asthi-kshaya', 'osteoporosis'],
    name: 'Vishesha Vyadhi — Yakritodara, Apachi, Shlipada, Urustambha & Asthikshaya',
    cRef: 'Chikitsa Sthana 13 (Udara/Yakrit), 27 (Urustambha) & Sutra 17/67 (Asthikshaya)',
    sRef: 'Nidana Sthana 11–12 & Chikitsa Sthana 14 (Udara), 18 (Apachi) & 19 (Shlipada/Upadansha)',
    vRef: 'Chikitsa Sthana 15 (Udara/Yakrit), 21 (Urustambha/Kroshtukashirsha) & Sutra 11 (Asthikshaya)',
    cdRef: 'Adhyaya 24 (Urustambha), 37 (Udara/Yakrit), 41 (Apachi) & 42 (Shlipada)',
    shRef: 'Madhyama Khanda 7 (Kanchanara Guggulu, Lakshadi Guggulu, Rohitakarishta & Kumaryasava)',
    nidanaSanskrit: 'दोषैस्त्रिभिर्यथास्वं च प्लोहोदरं यकृत्तथा... आमेन गुरुणा स्निग्धैरुस्तम्भः प्रजायते ॥ (Ch. Chi. 13 & 27)',
    nidanaTranslit: 'Doṣais tribhir yathāsvaṁ ca plīhodaraṁ yakṛt tathā... āmena guruṇā snigdhair ūrustambhaḥ prajāyate ||',
    nidanaMeaning: 'Vitiated Rakta-Kapha-Pitta cause Yakrit-Pleehodara (hepatosplenomegaly/cirrhosis); Kapha-Meda cause Apachi (cervical lymphadenopathy) and Shlipada (filariasis); Ama-Kapha-Meda blocking Vata in thighs causes Urustambha (Snehana/Basti contraindicated); Vata vriddhi causes Asthikshaya (osteoporosis).',
    cSutra: 'रोहीतकघृतं प्लीहयकृदुदरनाशनम्... रूक्षणादुरुस्तम्भं जयेत् तिक्तक्षीरबस्तिना चास्थिक्षयम् ॥ (Ch. Chi. 13/85, 27/26 & Su. 28/27 — Rohitaka & Pippalivardhamana in Yakritodara; strict Rukshana [NO Snehana] in Urustambha; Tikta-Ksheera Basti in Asthikshaya.)',
    sSutra: 'काञ्चनारत्वचः क्वाथः... अपचीगण्डमालाजित् । श्लीपदे रक्तमोक्षश्च शाखोटकप्रयोगकः ॥ (Su. Chi. 18 & 19 — Kanchanara Guggulu for Apachi/Gandamala; Shakhotaka and Raktamokshana for Shlipada.)',
    vSutra: 'तिक्तक्षीरघृतैर्बस्तिरस्थिमज्जगतेऽनिले । यकृत्प्लीहहरो नित्यं कुमार्यासवरोहितकौ ॥ (A.H. Su. 11 & Chi. 15 — Tikta-Ksheera Basti for Asthikshaya; Rohitaka and Kumaryasava for Yakrit-Pleeha.)',
    cdSutra: 'लक्षादिगुग्गुलुः श्रेष्ठोऽस्थिभग्नक्षयापहः । नित्यानन्दो रसः श्लीपदापचीगण्डमालजित् ॥ (Chakradatta 24, 37, 41 & 42 — Lakshadi Guggulu for Asthikshaya; Nityananda Rasa for Shlipada;Yakritpleehari Lauha for Yakritodara.)',
    shSutra: 'काञ्चनारगुग्गुलुश्च रोहीतकारिष्टस्तथा । अपचीं यकृदुदरं श्लीपदं च विनाशयेत् ॥ (Sha. Ma. 7 & 10 — Kanchanara Guggulu, Lakshadi Guggulu, and Rohitakarishta.)',
    cMed: ['Rohitakarishta (20 mL BD) + Arogyavardhini Vati (2 tabs BD) [Or Lakshadi Guggulu 2 BD + Praval Pishti 250 mg BD in Asthikshaya / Kanchanara Guggulu 2 BD in Apachi / Nityananda Rasa in Shlipada]', 'Warm Water / Milk', 'Targeted Srotas-pratyanika BAMS textbook formulation (Ch. Chi. 13, 27 & 28)'],
    sMed: ['Kanchanara Guggulu (2 tabs BD) + Varunadi Kwatha (40 mL BD) / Shakhotaka Bimbi Kwatha (in Shlipada)', 'Shunthi Water', 'Lekhana, Granthihara, and Medo-Kapha-harana (Su. Chi. 18 & 19)'],
    vMed: ['Guggulutiktaka Ghrita (10 mL OD) + Patolakaturohinyadi Kashayam (15 mL BD) + Kumaryasava (20 mL BD)', 'Warm Milk / Water', 'Nourishes Asthi Dhatu and clears Yakrit-Raktavaha Srotas (A.H. Chi. 15 & 21)'],
    cdMed: ['Yakritpleehari Lauha (250 mg BD) / Lakshadi Guggulu (2 tabs BD) / Nityananda Rasa (250 mg BD) / Ashtakatvara Taila (Urustambha)', 'Honey / Warm Water', 'Authoritative Chakradatta disease-specific Yogas'],
    shMed: ['Kanchanara Guggulu (2 tabs BD) + Rohitakarishta / Kumaryasava (20 mL BD)', 'Equal Warm Water', 'Standardized Sharangadhara Samhita protocol (Sha. Ma. 7 & 10)'],
    shodhana: ['Tikta-Ksheera Basti (Asthikshaya — Ch. Su. 28/27) / Nitya Virechana (Yakritodara) / Ruksha Valuka Sweda (Urustambha)', 'Panchatikta-Ksheera Basti for Osteoporosis; Gomutra-Haritaki Virechana for Liver/Spleen; strict Rukshana for Urustambha.'],
  },
];

export function getPart3DiseaseProtocols(diseaseQuery: string): Record<string, AcharyaClinicalProtocol> | null {
  const q = diseaseQuery.toLowerCase();
  for (const entry of ENTRIES) {
    if (entry.match.some((m) => q.includes(m))) {
      return {
        charaka: makeProtocol('charaka', 'Acharya Charaka', 'Charaka Samhita', entry.charaka),
        sushruta: makeProtocol('sushruta', 'Acharya Sushruta', 'Sushruta Samhita', entry.sushruta),
        vagbhata: makeProtocol('vagbhata', 'Acharya Vagbhata', 'Ashtanga Hridaya', entry.vagbhata),
        chakradatta: makeProtocol('chakradatta', 'Acharya Chakrapani Datta', 'Chakradatta', entry.chakradatta),
        sharangadhara: makeProtocol('sharangadhara', 'Acharya Sharangadhara', 'Sharangadhara Samhita', entry.sharangadhara),
      };
    }
  }

  for (const cs of COMPACT_SPECS) {
    if (cs.keys.some((k) => q.includes(k))) {
      const buildCompact = (
        id: 'charaka' | 'sushruta' | 'vagbhata' | 'chakradatta' | 'sharangadhara',
        name: string,
        book: string,
        ref: string,
        sutra: string,
        med: [string, string, string]
      ): AcharyaClinicalProtocol => {
        const parsed = parseSutraParts(sutra, med[2]);
        return makeProtocol(id, name, book, {
          dRef: `${book}, ${ref}`,
          cRef: `${book}, ${ref}`,
          nidanaSanskrit: cs.nidanaSanskrit,
          nidanaTranslit: cs.nidanaTranslit,
          nidanaMeaning: cs.nidanaMeaning,
          sutra,
          sutraTitle: `${name} Chikitsa Sutra for ${cs.name}`,
          sutraSanskrit: parsed.sanskrit || cs.nidanaSanskrit,
          sutraTranslit: '',
          sutraMeaning: parsed.meaning,
          shamana: [
            {
              category: 'Classical Samhita Yoga',
              medicineName: med[0],
              dosage: 'As per classical Matra (BD after/before meals)',
              anupana: med[1],
              timing: 'Morning & Evening',
              indications: med[2],
              reference: `${book}, ${ref}`,
            },
          ],
          shodhana: [
            {
              procedure: cs.shodhana[0],
              indication: `${cs.name} (${book}, ${ref})`,
              details: cs.shodhana[1],
            },
          ],
        });
      };

      return {
        charaka: buildCompact('charaka', 'Acharya Charaka', 'Charaka Samhita', cs.cRef, cs.cSutra, cs.cMed),
        sushruta: buildCompact('sushruta', 'Acharya Sushruta', 'Sushruta Samhita', cs.sRef, cs.sSutra, cs.sMed),
        vagbhata: buildCompact('vagbhata', 'Acharya Vagbhata', 'Ashtanga Hridaya', cs.vRef, cs.vSutra, cs.vMed),
        chakradatta: buildCompact('chakradatta', 'Acharya Chakrapani Datta', 'Chakradatta', cs.cdRef, cs.cdSutra, cs.cdMed),
        sharangadhara: buildCompact('sharangadhara', 'Acharya Sharangadhara', 'Sharangadhara Samhita', cs.shRef, cs.shSutra, cs.shMed),
      };
    }
  }

  return null;
}
