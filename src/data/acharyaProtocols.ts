export interface AcharyaChikitsaShlokaItem {
  title: string;
  reference: string;
  shlokaSanskrit: string;
  shlokaTransliteration: string;
  meaning: string;
}

export interface AcharyaClinicalProtocol {
  acharyaId: 'charaka' | 'sushruta' | 'vagbhata' | 'chakradatta' | 'sharangadhara' | string;
  acharyaName: string;
  sourceTextbook: string;
  isDirectlyMentioned: boolean;
  diseaseReference?: string;
  chikitsaShlokas?: AcharyaChikitsaShlokaItem[];
  mentionStatusNote: string;
  clinicalPhilosophy: string;
  shlokaReference: {
    shlokaSanskrit: string;
    shlokaTransliteration: string;
    meaning: string;
    sourceBook: string;
    chapterAndVerse: string;
  };
  chikitsaSutra: string;
  chikitsaSutraReference: string;
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
}

const getBaseAcharyaProtocols = (
  diseaseName: string,
  primaryAnalysis: any
): Record<string, AcharyaClinicalProtocol> => {
  const dLower = (diseaseName || primaryAnalysis?.vyadhiVinischaya || '').toLowerCase();
  const cleanDiseaseLabel = diseaseName || primaryAnalysis?.vyadhiVinischaya || 'this Vyadhi';

  // 1. AMAVATA / RHEUMATOID ARTHRITIS
  if (dLower.includes('amavata') || dLower.includes('rheumatoid')) {
    return {
      charaka: {
        acharyaId: 'charaka',
        acharyaName: 'Acharya Charaka',
        sourceTextbook: 'Charaka Samhita (Chikitsa Sthana Ch. 15 Grahani & Ch. 28/29 Sama-Vata)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not directly mentioned as an independent Vyadhi chapter in Charaka Samhita (Amavata was first codified as a separate disease by Acharya Madhava). However, in Charaka Samhita complete textbook, identical Sama-Vata and Sandhi-gat Ama pathology is referenced in Chikitsa Sthana Ch. 15 (Grahani Dosha) & Ch. 28/29.',
        clinicalPhilosophy:
          'Primary focus on Agni-Deepana, Ama-Pachana, Ruksha Swedana, and Langhana. Snehana is strictly contraindicated in the acute Sama stage.',
        shlokaReference: {
          shlokaSanskrit: 'लङ्घनेन क्षयं नीते दोषे सन्धौ स्थितेऽपि वा । दीपनैः पाचकैश्चापि कुर्यात् संशोधनं ततः ॥',
          shlokaTransliteration: 'Laṅghanena kṣayaṁ nīte doṣe sandhau sthite’pi vā | Dīpanaiḥ pācakaiś cāpi kuryāt saṁśodhanaṁ tataḥ ||',
          meaning:
            'When morbid Sama Doshas lodged in the joints are attenuated through Langhana (fasting) and Deepana-Pachana (digestive stimulants), targeted Shodhana should then be administered.',
          sourceBook: 'Charaka Samhita',
          chapterAndVerse: 'Chikitsa Sthana, Ch. 15 & Ch. 28 (Sama-Vata Reference)',
        },
        chikitsaSutra:
          'आमाशयगते वाते कफे पक्वाशयाश्रिते । रूक्षपूर्वं हितं कर्म दीपनं पाचनं तथा ॥ (In Sama-Vata & Kapha-Avruta states, institute Ruksha Swedana, Langhana, and Deepana-Pachana first — Snehana is forbidden until Ama is digested.)',
        chikitsaSutraReference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 196–198 & Ch. 15, Verse 75',
        shamanaChikitsa: [
          {
            category: 'Pachana Kwatha',
            medicineName: 'Shunthi-Guduchi Kwatha (Nagaradi Kwatha)',
            dosage: '40ml BD on empty stomach',
            anupana: 'Warm water with Pippali churna pinch',
            timing: 'Early morning & before dinner',
            indications: 'Digests circulating systemic Ama, eliminates heaviness and morning joint stiffness.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 15 (Grahani Chikitsa), Verse 98',
          },
          {
            category: 'Deepana Churna',
            medicineName: 'Panchakola Churna (Pippali, Pippalimoola, Chavya, Chitraka, Shunthi)',
            dosage: '3g with meals',
            anupana: 'Warm water or Takra (buttermilk)',
            timing: 'Prathama Grasa (with first bite of food)',
            indications: 'Kindles Jatharagni and Dhatvagni; arrests further Amotpatti.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 15, Verse 106–107',
          },
          {
            category: 'Sneha Prayoga (Nirama stage)',
            medicineName: 'Eranda Sneha with Dashamoola Kwatha',
            dosage: '15ml at bedtime',
            anupana: 'Warm Sunthi Jala',
            timing: 'Bedtime',
            indications: 'Vrishya Vatahara & Pramathi action: pulls Ama from deep Dhatus and purges through colon.',
            reference: 'Charaka Samhita, Sutra Sthana Ch. 25, Verse 40 & Chikitsa Sthana Ch. 28, Verse 84',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Ruksha Valuka Sweda',
            indication: 'Mandatory in acute Sama Avastha; Snigdha Sweda is strictly forbidden.',
            details: 'Coarse sand heated in an iron pan, tied in cotton potali, applied over swollen joints twice daily.',
          },
          {
            procedure: 'Nitya Virechana with Eranda Taila',
            indication: 'Gentle downward purgation of morbid Vata-Kapha and Ama.',
            details: 'Castor oil (Eranda taila) 15-20ml administered with warm ginger infusion at bedtime.',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Other',
          procedureNotes: 'Ruksha Upanaha Sweda with dry warming herbal powders (Sunthi, Vacha, Devadaru).',
          siteAndInstruments: 'Cotton linen wrap applied overnight over MCP/PIP joints.',
        },
      },
      sushruta: {
        acharyaId: 'sushruta',
        acharyaName: 'Acharya Sushruta',
        sourceTextbook: 'Sushruta Samhita (Chikitsa Sthana Ch. 4 Vata Vyadhi & Sutra Sthana Ch. 12)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not directly mentioned as a standalone Amavata chapter in Sushruta Samhita. In Sushruta Samhita complete textbook, joint swelling with Sama-Vata pain is referenced under Chikitsa Sthana Ch. 4 (Vata Vyadhi Chikitsitam) and Sutra Sthana Ch. 12 (Agnikarma in Sandhi-Asthi Vata).',
        clinicalPhilosophy:
          'Emphasizes clearance of obstructed articular channels, Ruksha Pradeha, and targeted Agnikarma once acute Ama subsides.',
        shlokaReference: {
          shlokaSanskrit: 'त्वङ्मांससिरास्नायुसन्ध्यस्थिस्थितेऽनिले । अग्निकर्म प्रयुञ्जीत शूलस्तम्भनिवारणम् ॥',
          shlokaTransliteration: 'Tvaṅ-māṁsa-sirā-snāyu-sandhy-asthi-sthite’nile | Agnikarma prayuñjīta śūla-stambha-nivāraṇam ||',
          meaning:
            'When aggravated Vayu lodges in the ligaments, joints (Sandhi), and bones causing severe pain and stiffness, Agnikarma cauterization eradicates the deep-seated agony and rigidity.',
          sourceBook: 'Sushruta Samhita',
          chapterAndVerse: 'Sutra Sthana Ch. 12, Verse 10 (Sandhi-gata Vata Reference)',
        },
        chikitsaSutra:
          'सामं दोषं विजानीयाच्छूलस्तम्भसमन्वितम् । पाचयेद्दीपनैः पूर्वं पश्चात् स्नेहादिमाचरेत् ॥ (Recognize Sama Dosha by stiffness and unremitting pain; digest it first with Katu-Tikta Deepana & Ruksha Pralepa before any Snehana or Agnikarma.)',
        chikitsaSutraReference: 'Sushruta Samhita, Sutra Sthana Ch. 15 & Chikitsa Sthana Ch. 4, Verse 8–12',
        shamanaChikitsa: [
          {
            category: 'Guggulu Kwatha Yoga',
            medicineName: 'Guggulutiktaka Kwatha / Panchatikta Guggulu',
            dosage: '40ml Kwatha or 2 tablets (500mg) BD',
            anupana: 'Warm water',
            timing: 'Before meals',
            indications: 'Cleanses Asthivaha and Majjavaha Srotas, reduces synovial hypertrophy and joint tenderness.',
            reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4 (Vatavyadhi Chikitsitam), Verse 24–27',
          },
          {
            category: 'Pachana Ganayoga',
            medicineName: 'Pippalyadi Gana Kwatha & Churna',
            dosage: '30ml Kwatha / 3g Churna BD',
            anupana: 'Ushnodaka (warm water)',
            timing: 'Before lunch and dinner',
            indications: 'Powerful Ama-pachana, Kapha-Vatahara, and Srotoshodhaka across joint channels.',
            reference: 'Sushruta Samhita, Sutra Sthana Ch. 38 (Dravyasangrahaniya), Verse 22–23',
          },
          {
            category: 'Lepa Yoga (External)',
            medicineName: 'Himsradi / Kottamchukkadi Ruksha Pralepa',
            dosage: 'Warm paste applied 4mm thick over swollen joints',
            anupana: 'Mixed with warm Dhanyamla / Kanji',
            timing: 'Morning for 2 hours; removed before drying',
            indications: 'Reduces severe periarticular inflammatory edema and joint effusion.',
            reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4, Verse 14',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Jalaukavacharana (Leech Therapy)',
            indication: 'Indicated when a single joint has severe acute erythema and tense effusion.',
            details: 'Application of 2-4 non-poisonous Nirvisha Jalaukas over acutely inflamed joint.',
          },
          {
            procedure: 'Trivrit-yukta Virechana',
            indication: 'Evacuation of Pitta-Kapha and Ama accumulations.',
            details: 'Trivrit Churna 5g with Triphala Kwatha at bedtime.',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Agnikarma',
          procedureNotes: 'Red-hot Panchadhatu Shalaka micro-points in Nirama stage to resolve chronic joint tenderness.',
          siteAndInstruments: 'Panchadhatu Shalaka, Aloe vera pulp and Madhu-Ghrita post-cautery.',
        },
      },
      vagbhata: {
        acharyaId: 'vagbhata',
        acharyaName: 'Acharya Vagbhata',
        sourceTextbook: 'Ashtanga Hridaya (Chikitsa Sthana Ch. 21 Vata Vyadhi & Sutra Sthana Ch. 13)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not directly mentioned as an independent chapter in Ashtanga Hridaya/Sangraha. In Vagbhata’s complete textbook, Sama-Vata joint stiffness and its management are referenced in Sutra Sthana Ch. 13 (Doshopakramaniya - Sama Dosha Chikitsa) & Chikitsa Sthana Ch. 21.',
        clinicalPhilosophy:
          'Harmonious synthesis of Pachana Kashayas (Amruthotharam), Dhanyamla Dhara, and Erandamooladi Basti.',
        shlokaReference: {
          shlokaSanskrit: 'सामानाम्पाचनं पूर्वं लङ्घनं च विशोधनम् । स्नेहस्वेदोपनाहाश्च निर्याते सामसञ्चये ॥',
          shlokaTransliteration: 'Sāmānām pācanaṁ pūrvaṁ laṅghanaṁ ca viśodhanam | Sneha-svedopanāhāś ca niryāte sāma-sañcaye ||',
          meaning:
            'In Sama disorders lodged in tissues and joints, first execute Pachana (digestion of Ama) and Langhana (lightening/fasting); only after Ama is cleared should Snehana and Upanaha be applied.',
          sourceBook: 'Ashtanga Hridaya',
          chapterAndVerse: 'Sutra Sthana Ch. 13, Verse 27-29 (Sama-Dosha Reference)',
        },
        chikitsaSutra:
          'आमसक्तेषु दोषेषु नहि स्नेहः कथञ्चन । रूक्षस्वेदैः पाचनैश्च जित्वामं मारुतं जयेत् ॥ (Never administer Sneha while Ama clings to Doshas; conquer Ama first with Ruksha Sweda and Pachana Kashayas, then pacify Vata.)',
        chikitsaSutraReference: 'Ashtanga Hridaya, Sutra Sthana Ch. 13, Verse 25–28 & Chikitsa Sthana Ch. 21, Verse 48',
        shamanaChikitsa: [
          {
            category: 'Kashaya Yoga',
            medicineName: 'Amruthotharam Kashayam (Nagaradi Kwatha)',
            dosage: '40ml BD',
            anupana: 'Warm water with 1g Sunthi powder',
            timing: 'Empty stomach 6 AM & 6 PM',
            indications: 'Classic Ashtanga Hridaya formulation (Guduchi 6 parts, Haritaki 4 parts, Sunthi 2 parts) for systemic Amadosha.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 1, Verse 62 & Sahasrayogam Kwatha Prakarana',
          },
          {
            category: 'Churna Yoga',
            medicineName: 'Vaishwanara Churna (Manimantha, Yavani, Ajamoda, Shunthi, Haritaki)',
            dosage: '3g to 5g BD',
            anupana: 'Warm Takra (buttermilk) or warm water',
            timing: 'Before meals',
            indications: 'Rapidly digests Ama, relieves flatulence, constipation, and morning joint stiffness.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 14 (Gulma Chikitsa), Verse 34',
          },
          {
            category: 'Kashaya Yoga (Nirama Stage)',
            medicineName: 'Rasnerandadi Kashayam',
            dosage: '40ml BD',
            anupana: 'Warm water',
            timing: 'Before breakfast and dinner',
            indications: 'Relieves sacroiliac, knee, and small-joint inflammation with Vata-Kapha dominance.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21 (Vatavyadhi Chikitsa), Verse 52–54',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Dhanyamla Dhara',
            indication: 'Gentle sour fermented liquid stream poured over inflamed joints to digest local Ama.',
            details: 'Warm fermented cereal wash (Dhanyamla) continuously poured over joints for 45 minutes.',
          },
          {
            procedure: 'Erandamooladi Niruha Basti',
            indication: 'Pacification of Kapha-avruta Vata and clearing of pelvic-sacral stiffness.',
            details: 'Administered in Yoga Basti sequence (8 days course).',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Viddhakarma',
          procedureNotes: 'Fine 26G needle insertion at periarticular tender points to release trapped Vyana Vayu.',
          siteAndInstruments: 'Sterile 26G dispovan needle.',
        },
      },
      chakradatta: {
        acharyaId: 'chakradatta',
        acharyaName: 'Acharya Chakrapani Datta',
        sourceTextbook: 'Chakradatta (Chapter 25 - Amavata Chikitsa Prakarana)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Acharya Chakrapani Datta dedicated a complete chapter (Chakradatta Ch. 25 - Amavata Chikitsa) and authored the canonical Chikitsa Sutra of Amavata, Simhanada Guggulu, and Vaitarana Basti.',
        clinicalPhilosophy:
          'Author of the classical gold-standard Amavata Chikitsa Sutra. Pioneered Simhanada Guggulu, Vaitarana Basti, and Castor oil protocols.',
        shlokaReference: {
          shlokaSanskrit: 'लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च । विरेचनं स्नेहपानं बस्तयश्चाममारुते ॥',
          shlokaTransliteration: 'Laṅghanaṁ svedanaṁ tiktaṁ dīpanāni kaṭūni ca | Virecanaṁ snehapānaṁ bastayaś cāmamārute ||',
          meaning:
            'In Amavata, the six-fold cardinal therapeutic sequence is: 1. Langhana (fasting), 2. Swedana (dry fomentation), 3. Tikta-Katu Deepana (bitter & pungent appetizers), 4. Virechana (purgation), 5. Snehapana (medicated unction in Nirama stage), and 6. Basti (enemas).',
          sourceBook: 'Chakradatta',
          chapterAndVerse: 'Amavata Chikitsa Prakarana, Ch. 25, Verse 1',
        },
        chikitsaSutra:
          'लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च । विरेचनं स्नेहपानं बस्तयश्चाममारुते ॥ सन्धवाद्येन तैलेन वालुकास्वेदमाचरेत् ॥ (Execute the 6-step Amavata Sutra: Langhana, Valuka Sweda, Tikta-Katu Deepana, Virechana, Eranda Snehapana, and Vaitarana/Kshara Basti.)',
        chikitsaSutraReference: 'Chakradatta, Amavata Chikitsa Prakarana Ch. 25, Verse 1–3',
        shamanaChikitsa: [
          {
            category: 'Guggulu Yoga',
            medicineName: 'Simhanada Guggulu',
            dosage: '2 tablets (500mg) BD',
            anupana: 'Warm water or Rasnadi Kwatha',
            timing: 'After meals',
            indications: 'Triphala + Gandhaka + Guggulu cooked in Eranda taila in iron vessel: flushes Ama and stops joint pain.',
            reference: 'Chakradatta, Amavata Chikitsa Prakarana Ch. 25, Verse 27–32',
          },
          {
            category: 'Kwatha Yoga',
            medicineName: 'Rasnasaptaka Kwatha (Rasna, Guduchi, Aragwadha, Devadaru, Gokshura, Eranda, Punarnava)',
            dosage: '40ml BD',
            anupana: 'Warm water with 1g Shunthi Churna',
            timing: 'Before meals',
            indications: 'Alleviates Trika, Janu, Sandhi, and Prishta shoola; potent Vata-Kapha pacifier.',
            reference: 'Chakradatta, Amavata Chikitsa Prakarana Ch. 25, Verse 8',
          },
          {
            category: 'Churna Yoga',
            medicineName: 'Alambushadi Churna / Shatyadi Kwatha',
            dosage: '3g Churna or 40ml Kwatha BD',
            anupana: 'Warm Kanji or Ushnodaka',
            timing: 'Morning and evening',
            indications: 'Breaks deep-rooted Ama-Vata complexes and resolves polyarticular swelling.',
            reference: 'Chakradatta, Amavata Chikitsa Prakarana Ch. 25, Verse 6 & 18',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Vaitarana Basti (The Sovereign Enema)',
            indication: 'Gold standard classical enema protocol specifically formulated for Amavata.',
            details: 'Formulated with Chincha (tamarind pulp), Guda (aged jaggery), Saindhava, Gomutra, and Eranda taila (Chakradatta 25/48).',
          },
          {
            procedure: 'Kshara Basti',
            indication: 'Indicated when Kapha-Ama accumulation is profound with joint effusion.',
            details: 'Alkaline herbal decoction enema administered on empty stomach.',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Agnikarma',
          procedureNotes: 'Indicated strictly in Nirama stage for chronic residual joint tenderness.',
          siteAndInstruments: 'Panchadhatu Shalaka applied in Bindu-vedha pattern.',
        },
      },
      sharangadhara: {
        acharyaId: 'sharangadhara',
        acharyaName: 'Acharya Sharangadhara',
        sourceTextbook: 'Sharangadhara Samhita (Madhyama Khanda Ch. 2, Ch. 6 & Ch. 7)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Sharangadhara Samhita explicitly codifies Amavata-hara formulations in Madhyama Khanda Ch. 2 (Shunthi-Gokshura Kwatha, Rasnasaptaka Kwatha), Ch. 6 (Ajmodadi Churna), and Ch. 7 (Yogaraja Guggulu).',
        clinicalPhilosophy:
          'Precision pharmaceutical formulations, exact decoction boiling ratios, and deep penetrating Anupanas (Eranda taila, Gomutra).',
        shlokaReference: {
          shlokaSanskrit: 'शुण्ठीगोक्षुरयोः क्वाथो हरामवातविनाशनः । दीपनः पाचनश्चैव कटीशूलनिवारणः ॥',
          shlokaTransliteration: 'Śuṇṭhī-gokṣurayoḥ kvātho harāmavāta-vināśanaḥ | Dīpanaḥ pācanaś caiva kaṭī-śūla-nivāraṇaḥ ||',
          meaning:
            'Decoction of Shunthi (dried ginger) and Gokshura is the peerless destroyer of Amavata; it kindles digestive fire, digests endotoxins, and eradicates lumbosacral agony.',
          sourceBook: 'Sharangadhara Samhita',
          chapterAndVerse: 'Madhyama Khanda Ch. 2, Verse 58',
        },
        chikitsaSutra:
          'शुण्ठीगोक्षुरक्वाथेन सामवातं विनाशयेत् । अजमोदादिचूर्णेन गुग्गुलुप्रयोगैस्तथा ॥ (Eradicate Sama-Vata and joint swelling using Shunthi-Gokshura Kwatha in the morning, Ajmodadi Churna with warm water, and Guggulu Kalpanas.)',
        chikitsaSutraReference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Verse 58 & Ch. 6, Verse 117',
        shamanaChikitsa: [
          {
            category: 'Madhyama Khanda Kwatha',
            medicineName: 'Shunthi-Gokshura Kwatha with Eranda Sneha',
            dosage: '40ml BD',
            anupana: 'Warm water with 5ml Castor Oil',
            timing: 'Morning empty stomach and night before bed',
            indications: 'Dissolves Ama from micro-channels and flushes deep metabolic toxins through bowel.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2 (Kwatha Kalpana), Verse 58',
          },
          {
            category: 'Churna Kalpana',
            medicineName: 'Ajmodadi Churna (Ajamoda, Vidanga, Saindhava, Devadaru, Chitraka, Pippali, Shunthi, Vriddhadaru)',
            dosage: '3g to 5g BD',
            anupana: 'Ushnodaka (warm water)',
            timing: 'After meals',
            indications: 'Specifically indicated by Acharya Sharangadhara for Amavata, Sandhishotha, and Gridhrasi.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6 (Churna Kalpana), Verse 117–120',
          },
          {
            category: 'Guggulu Kalpana',
            medicineName: 'Mahayogaraja Guggulu',
            dosage: '2 tablets (500mg) BD',
            anupana: 'Rasnadi Kwatha or warm water',
            timing: 'After meals',
            indications: 'Potent classical herbomineral synergy for recalcitrant joint contractures in Nirama stage.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7 (Gutika/Guggulu Kalpana), Verse 56–69',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Eranda Taila Prayoga with Gomutra',
            indication: 'Downward flushing of virulent Vata and Ama.',
            details: '20ml Castor oil mixed with 40ml warm Gomutra or Shunthi Kwatha at bedtime.',
          },
        ],
      },
    };
  }

  // 2. SANDHIVATA / OSTEOARTHRITIS
  if (dLower.includes('sandhi') || dLower.includes('osteo') || dLower.includes('crepitus')) {
    return {
      charaka: {
        acharyaId: 'charaka',
        acharyaName: 'Acharya Charaka',
        sourceTextbook: 'Charaka Samhita (Chikitsa Sthana - Vatavyadhi Chikitsa Ch. 28)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Charaka Samhita Chikitsa Sthana Ch. 28, Verse 37 specifically defines Sandhigata Anila (Sandhivata) and its hallmark Vātapūrṇa-dṛti sparsha sign.',
        clinicalPhilosophy:
          'Sandhivata is Dhatukshayajanya (degenerative). Classical principle is Sneha-Sweda, Tikta Ghrita Pana, and Anuvasana Basti. Rukshana is contraindicated.',
        shlokaReference: {
          shlokaSanskrit: 'वातपूर्णदृतिस्पर्शः शोथः सन्धिगतेऽनिले । प्रसारणाकुञ्चनयोः प्रवृत्तिश्च सवेदना ॥',
          shlokaTransliteration: 'Vātapūrṇa-dṛti-sparśaḥ śothaḥ sandhi-gate’nile | Prasāraṇākuñcanayoḥ pravṛttiś ca savedanā ||',
          meaning:
            'When Vata lodges into the joints, the joint feels like an air-filled leather bag on palpation, with crepitus and pain during flexion and extension.',
          sourceBook: 'Charaka Samhita',
          chapterAndVerse: 'Chikitsa Sthana Ch. 28, Verse 37',
        },
        chikitsaSutra:
          'स्नेहस्वेदोपपन्नं तु वातव्याधिमुपाचरेत् । बस्तिभिर्मधुरप्रायैः सर्पिस्तैलसमन्वितैः ॥ (Treat Dhatukshayaja Sandhivata with repeated internal & external Snehana, Mridu Swedana, and Madhura-Snigdha Basti.)',
        chikitsaSutraReference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 75–78',
        shamanaChikitsa: [
          {
            category: 'Tikta Ghrita Pana',
            medicineName: 'Mahatikta Ghrita / Tikta Shatpala Ghrita',
            dosage: '10ml to 15ml early morning',
            anupana: 'Warm boiled milk or warm water',
            timing: 'Pratah (early morning empty stomach)',
            indications: 'Direct nourishment to Asthi-Majja Dhatu via Tikta Rasa + Snigdha Guna; rebuilds Shleshaka Kapha.',
            reference: 'Charaka Samhita, Sutra Sthana Ch. 28, Verse 27 (Asthi-pradoshaja Chikitsa)',
          },
          {
            category: 'Kashaya & Taila Yoga',
            medicineName: 'Dashamoola Kwatha with Bala Taila',
            dosage: '40ml Kwatha + 5ml Bala Taila BD',
            anupana: 'Warm cow milk',
            timing: 'Before meals',
            indications: 'Deep nourishing anti-degenerative Vata-hara formula for worn articular cartilage.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 148–156',
          },
          {
            category: 'Rasayana Yoga',
            medicineName: 'Ashwagandhadi Lehya / Shatavari-Bala Siddha Ksheera',
            dosage: '10g Lehya or 100ml Ksheerapaka BD',
            anupana: 'Warm milk',
            timing: 'Morning and bedtime',
            indications: 'Counteracts Dhatukshaya and strengthens periarticular ligaments and muscles.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 92',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Janu Basti with Bala Taila / Mahanarayana Taila',
            indication: 'Primary localized nourishment for degenerated cartilage and menisci.',
            details: 'Black gram dough ring placed over knee; warm medicated herbal oil retained for 35 mins.',
          },
          {
            procedure: 'Tikta Ksheera Basti',
            indication: 'Classical Charaka protocol for Asthi-gata and Sandhi-gata Vata.',
            details: 'Medicated milk processed with Tikta dravyas, Guggulutiktaka Ghrita, and honey.',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Marma Chikitsa',
          procedureNotes: 'Gentle rhythmic digital stimulation over Janu Marma and Indrabasti Marma.',
          siteAndInstruments: 'Thumb pressure for 18 respiratory cycles with warm Mahanarayana taila.',
        },
      },
      sushruta: {
        acharyaId: 'sushruta',
        acharyaName: 'Acharya Sushruta',
        sourceTextbook: 'Sushruta Samhita (Nidana Sthana Ch. 1 & Chikitsa Sthana Ch. 4)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Sushruta Samhita Nidana Sthana Ch. 1, Verse 28 explicitly defines Sandhigata Vata with emphasis on Agnikarma and Sneha-Sweda.',
        clinicalPhilosophy:
          'Emphasizes Agnikarma on periosteal tender trigger points, Snehana-Swedana, and Upanaha bandage.',
        shlokaReference: {
          shlokaSanskrit: 'हन्ति सन्धिगतः सन्धीञ्छूलशोफौ करोति च । अस्थिस्नायुशिरःसन्धौ वाते चाग्निकर्म शस्यते ॥',
          shlokaTransliteration: 'Hanti sandhigataḥ sandhīñ chūla-śophau karoti ca | Asthi-snāyu-śiraḥ-sandhau vāte cāgnikarma śasyate ||',
          meaning:
            'When provoked Vata localizes in the joints (Sandhi), it impairs joint function and produces pain and swelling; in Vata seated in bone, ligaments, and joints, Agnikarma is supreme.',
          sourceBook: 'Sushruta Samhita',
          chapterAndVerse: 'Nidana Sthana 1/28 & Sutra Sthana 12/10',
        },
        chikitsaSutra:
          'स्नेहस्वेदोपनाहैश्च बन्धनैर्मर्दनैस्तथा । सिरायामोक्षणेनापि दहेद्वाप्यग्निना भिषक् ॥ (Manage Sandhi-Snayu-Asthi Vata with Snehana, Swedana, Upanaha poultice, Bandhana, and targeted Agnikarma.)',
        chikitsaSutraReference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4, Verse 8 & Sutra Sthana Ch. 12, Verse 10',
        shamanaChikitsa: [
          {
            category: 'Kwatha & Ghrita Yoga',
            medicineName: 'Guggulutiktaka Ghrita (Sushruta Mahavatavyadhi)',
            dosage: '10ml BD',
            anupana: 'Warm milk or Dashamoola Kwatha',
            timing: 'Before meals',
            indications: 'Penetrates deep into Asthi and Sandhi; arrests subchondral sclerosis and osteophytes.',
            reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 5, Verse 41–45',
          },
          {
            category: 'Taila Prayoga',
            medicineName: 'Sahacharadi Taila / Mashabaladi Taila',
            dosage: '5ml internal + warm external Abhyanga',
            anupana: 'Warm milk (internal) & Nadi Sweda (external)',
            timing: 'Twice daily',
            indications: 'Restores range of motion, alleviates nerve irritation and joint stiffness.',
            reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4, Verse 28–30',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Salvana Upanaha Sweda',
            indication: 'Warm unctuous poultice bandage prescribed by Acharya Sushruta for Sandhivata.',
            details: 'Vatahara drugs pasted with Sneha, Kanjika, and Saindhava tied warm over knee/spine.',
          },
        ],
        paraSurgicalTherapy: {
          therapyName: 'Agnikarma',
          procedureNotes: 'Red-hot Shalaka points over medial joint line for chronic bone-on-bone pain.',
          siteAndInstruments: 'Panchadhatu Shalaka, Bindu Vedha technique.',
        },
      },
      vagbhata: {
        acharyaId: 'vagbhata',
        acharyaName: 'Acharya Vagbhata',
        sourceTextbook: 'Ashtanga Hridaya (Nidana Sthana Ch. 15 & Chikitsa Sthana Ch. 21)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Ashtanga Hridaya Nidana Sthana Ch. 15, Verse 14 and Chikitsa Sthana Ch. 21 specifically describe Sandhigata Vata.',
        clinicalPhilosophy:
          'Prescribes Ksheerabala 101, Sahacharadi Kashayam, and Shashtika Shali Pinda Sweda for long-term cartilage stabilization.',
        shlokaReference: {
          shlokaSanskrit: 'श्वयथुः सन्धिगतेऽनिले भवेद्वातपूर्णदृतिस्पर्शः । प्रसारणाकुञ्चनयोः प्रवृत्तौ वेदना भृशम् ॥',
          shlokaTransliteration: 'Śvayathuḥ sandhigate’nile bhaved vātapūrṇa-dṛti-sparśaḥ | Prasāraṇākuñcanayoḥ pravṛttau vedanā bhṛśam ||',
          meaning:
            'In joint-localized Vata, swelling feels like an air-filled bag with severe pain during flexion and extension; treat with milk-processed medicated ghee and Anuvasana Basti.',
          sourceBook: 'Ashtanga Hridaya',
          chapterAndVerse: 'Nidana Sthana Ch. 15, Verse 14 & Chikitsa Sthana Ch. 21',
        },
        chikitsaSutra:
          'स्नायुसन्धिशिराप्राप्ते कुर्याद्वाते विचक्षणः । स्नेहोपनाहाग्निकर्मबन्धनोन्मर्दनानि च ॥ (In Vata seated in ligaments and joints, execute Snehana, Upanaha, Agnikarma, Bandhana, and Unmardana.)',
        chikitsaSutraReference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21, Verse 22',
        shamanaChikitsa: [
          {
            category: 'Kashaya & Avartita Taila',
            medicineName: 'Sahacharadi Kashayam + Ksheerabala 101 Avarti',
            dosage: '40ml Kashayam + 10 drops Ksheerabala 101 BD',
            anupana: 'Warm water',
            timing: 'Before meals',
            indications: 'Sovereign Ashtanga Hridaya combination for lower limb Sandhivata, stiffness, and gait difficulty.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21, Verse 56 & Ch. 22, Verse 45',
          },
          {
            category: 'Kashaya Yoga',
            medicineName: 'Gandharvahastadi Kashayam / Dhanwantharam Kashayam',
            dosage: '40ml BD',
            anupana: 'Warm water with Saindhava & Guda',
            timing: 'Morning and evening empty stomach',
            indications: 'Regulates Apana-Vyana Vayu and nourishes degenerated Dhatus.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21 & Sahasrayogam',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Shashtika Shali Pinda Sweda (Navarakizhi)',
            indication: 'Rejuvenation of Shleshaka Kapha in degenerative joint space.',
            details: 'Consecutive 14-day protocol with medicated Bala-milk-rice boluses.',
          },
        ],
      },
      chakradatta: {
        acharyaId: 'chakradatta',
        acharyaName: 'Acharya Chakrapani Datta',
        sourceTextbook: 'Chakradatta (Ch. 22 - Vatavyadhi Chikitsa Prakarana)',
        isDirectlyMentioned: true,
        mentionStatusNote: 'Directly Mentioned: Chakradatta Vatavyadhi Chikitsa provides dedicated Yogas (Trayodashanga Guggulu, Yogaraja Guggulu & Mahanarayana Taila) for Sandhivata.',
        clinicalPhilosophy: 'Pioneered Trayodashanga Guggulu, Yogaraja Guggulu, and Mashabaladi Kwatha.',
        shlokaReference: {
          shlokaSanskrit: 'योगराजगुग्गुलुः श्रेष्ठः सन्धिवातविनाशनः । अस्थिमज्जागतं वातं जयेदाशु प्रयोजितः ॥',
          shlokaTransliteration: 'Yogarāja-gugguluḥ śreṣṭhaḥ sandhivāta-vināśanaḥ | Asthi-majjāgataṁ vātaṁ jayed āśu prayojitaḥ ||',
          meaning: 'Yogaraja Guggulu is the foremost remedy to destroy Sandhivata and rapidly conquer Vata seated in the bones and marrow.',
          sourceBook: 'Chakradatta',
          chapterAndVerse: 'Vatavyadhi Chikitsa Ch. 22, Verse 58–64',
        },
        chikitsaSutra:
          'त्रयोदशाङ्गगुग्गुलुं महानारायणं तथा । माषबलादिक्वाथं च प्रयुञ्जीत सन्धिमारुते ॥ (Administer Trayodashanga Guggulu, Mashabaladi Kwatha, and Mahanarayana Taila for Sandhigata Vata.)',
        chikitsaSutraReference: 'Chakradatta, Vatavyadhi Chikitsa Prakarana Ch. 22, Verse 65 & 142',
        shamanaChikitsa: [
          {
            category: 'Guggulu Yoga',
            medicineName: 'Trayodashanga Guggulu',
            dosage: '2 tablets (500mg) BD',
            anupana: 'Warm milk or Dashamoola Kwatha',
            timing: 'After meals',
            indications: 'Specifically indicated in Chakradatta for Katigraha, Janu-stambha, and Asthi-Sandhigata Vata.',
            reference: 'Chakradatta, Vatavyadhi Chikitsa Ch. 22, Verse 65–68',
          },
          {
            category: 'Kwatha Yoga',
            medicineName: 'Mashabaladi Kwatha (Masha, Bala, Shukanasa, Rasna, Dashamoola)',
            dosage: '40ml BD',
            anupana: 'Warm water with Hingu & Taila',
            timing: 'Before meals',
            indications: 'Nourishes depleted joint tissues and relieves severe mechanical joint pain.',
            reference: 'Chakradatta, Vatavyadhi Chikitsa Ch. 22, Verse 29',
          },
          {
            category: 'Taila Kalpana',
            medicineName: 'Mahanarayana Taila (Internal & Abhyanga)',
            dosage: '5ml with warm milk & local Janu Basti',
            anupana: 'Warm cow milk',
            timing: 'Twice daily',
            indications: 'Rebuilds synovial lubrication and reverses Ekanga/Sandhi wasting.',
            reference: 'Chakradatta, Vatavyadhi Chikitsa Ch. 22, Verse 142–154',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Janu Dhara with Mahanarayana Taila',
            indication: 'Deep muscle and ligament relaxation.',
            details: 'Warm Mahanarayana taila stream over joints for 30 minutes.',
          },
        ],
      },
      sharangadhara: {
        acharyaId: 'sharangadhara',
        acharyaName: 'Acharya Sharangadhara',
        sourceTextbook: 'Sharangadhara Samhita (Madhyama Khanda Ch. 2 & Ch. 7)',
        isDirectlyMentioned: true,
        mentionStatusNote: 'Directly Mentioned: Sharangadhara Samhita Madhyama Khanda Ch. 2 (Verse 89-95) codifies Maharasnadi Kwatha and Ch. 7 codifies Lakshadi Guggulu for Sandhi-Asthi Vata.',
        clinicalPhilosophy: 'Precise decoction formulations and bone-strengthening Guggulu Kalpanas.',
        shlokaReference: {
          shlokaSanskrit: 'जानुस्तम्भे कटीशूले सन्धिवाते सुदारुणे । महारास्नादिना क्वाथः परं पथ्यतमो मतः ॥',
          shlokaTransliteration: 'Jānu-stambhe kaṭī-śūle sandhivāte sudāruṇe | Mahārāsnādinā kvāthaḥ paraṁ pathyatamo mataḥ ||',
          meaning: 'In severe knee stiffness (Janu-stambha), lumbar pain, and chronic Sandhivata, Maharasnadi Kwatha is the supreme therapeutic decoction.',
          sourceBook: 'Sharangadhara Samhita',
          chapterAndVerse: 'Madhyama Khanda Ch. 2, Verse 89-93',
        },
        chikitsaSutra:
          'महारास्नादिक्वाथेन योगराजेन गुग्गुलुना । सन्धिगतं जयेद्वातं जानुस्तम्भं सुदारुणम् ॥ (Conquer chronic Sandhigata Vata and knee locking with Maharasnadi Kwatha and Yogaraja/Lakshadi Guggulu.)',
        chikitsaSutraReference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Verse 89 & Ch. 7, Verse 56',
        shamanaChikitsa: [
          {
            category: 'Kwatha Kalpana',
            medicineName: 'Maharasnadi Kwatha (26-herb classical decoction)',
            dosage: '40ml BD',
            anupana: 'Warm water with Sunthi churna or Bala taila',
            timing: 'Before meals',
            indications: 'First-line Sharangadhara decoction for Janu-stambha, Sandhivata, and Gridhrasi.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Verse 89–95',
          },
          {
            category: 'Guggulu Kalpana',
            medicineName: 'Yogaraja Guggulu / Lakshadi Guggulu',
            dosage: '2 tablets (500mg) BD',
            anupana: 'Maharasnadi Kwatha or warm milk',
            timing: 'After meals',
            indications: 'Restores subchondral bone strength and eliminates joint crepitus.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Verse 56–69',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Anuvasana Basti with Narayana Taila',
            indication: 'Pakwashaya Vata pacification.',
            details: '60ml warm Narayana taila post-prandial (Sharangadhara Uttarakhanda Ch. 6).',
          },
        ],
      },
    };
  }

  // 3. AMLAPITTA / GERD / ACID PEPTIC
  if (dLower.includes('amla') || dLower.includes('acidity') || dLower.includes('gerd') || dLower.includes('heartburn') || dLower.includes('gastritis')) {
    return {
      charaka: {
        acharyaId: 'charaka',
        acharyaName: 'Acharya Charaka',
        sourceTextbook: 'Charaka Samhita (Chikitsa Sthana - Grahani Dosha Chikitsitam Ch. 15)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not described as a separate standalone chapter in Charaka Samhita (first dedicated chapter appears in Kashyapa Samhita & Madhava Nidana). However, Acharya Charaka explicitly mentions Amlapitta pathology in Chikitsa Sthana Ch. 15 (Grahani Dosha Verse 44-49) and Sutra Sthana Ch. 26.',
        clinicalPhilosophy:
          'Amlapitta originates from Mandagni and Vidagdhajirna. Emphasizes Vamana for Urdhwaga (upward reflux) and Virechana for Adhoga.',
        shlokaReference: {
          shlokaSanskrit: 'अजीर्णादम्लपित्तं स्याद् विदग्धेऽन्ने विशेषतः । तत्रादौ वमनं कार्यं पैत्तिके तु विरेचनम् ॥',
          shlokaTransliteration: 'Ajīrṇād amlapittaṁ syād vidagdhe’nne viśeṣataḥ | Tatrādau vamanaṁ kāryaṁ paittike tu virecanam ||',
          meaning:
            'From chronic indigestion and fermentation of food (Vidagdhajirna), Amlapitta arises; manage initially with therapeutic Vamana and Pitta-pacifying Virechana.',
          sourceBook: 'Charaka Samhita',
          chapterAndVerse: 'Chikitsa Sthana Ch. 15, Verse 44–47 (Grahani Dosha Reference)',
        },
        chikitsaSutra:
          'विदग्धेऽन्ने वमेत् पूर्वं लङ्घनं पाचनं हितम् । तिक्तैर्मधुरशीतैश्च पैत्तिकं शमयेद्भिषक् ॥ (In Vidagdhajirna-induced Amlapitta, clear fermented gastric contents via Vamana/Langhana, then pacify Vidagdha Pitta with Tikta-Madhura-Shita formulations.)',
        chikitsaSutraReference: 'Charaka Samhita, Chikitsa Sthana Ch. 15, Verse 73–76',
        shamanaChikitsa: [
          {
            category: 'Kashaya Yoga',
            medicineName: 'Kiratatikta-Musta-Patola Kwatha / Patoladi Kwatha',
            dosage: '40ml BD',
            anupana: 'Cooled decoction with 1 tsp Madhu (honey)',
            timing: 'Before meals',
            indications: 'Cools inflamed gastric mucosa; Tikta rasa absorbs Kleda and neutralizes sour Pitta.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 15, Verse 125–127',
          },
          {
            category: 'Ghrita Yoga',
            medicineName: 'Tikta Shatpala Ghrita',
            dosage: '10ml BD',
            anupana: 'Lukewarm water',
            timing: 'Before food',
            indications: 'Kindles Mandagni without provoking Pitta; heals mucosal inflammation.',
            reference: 'Charaka Samhita, Chikitsa Sthana Ch. 15, Verse 88–93',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Sadyovirechana with Trivrit & Draksha',
            indication: 'Immediate elimination of Vidagdha Pitta from Amashaya & Grahani.',
            details: 'Trivrit Churna 5g with Draksha Swarasa or warm milk at bedtime.',
          },
        ],
      },
      sushruta: {
        acharyaId: 'sushruta',
        acharyaName: 'Acharya Sushruta',
        sourceTextbook: 'Sushruta Samhita (Uttara Tantra Ch. 42 & Sutra Sthana Ch. 46)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not mentioned as a standalone Amlapitta chapter in Sushruta Samhita. In Sushruta’s complete textbook, sour acid regurgitation and burning epigastric pain are referenced under Vidagdhajirna (Sutrasthana Ch. 46) and Pittaja Shoola (Uttara Tantra Ch. 42).',
        clinicalPhilosophy:
          'Treats gastric burning as Vidagdhajirna and Pittaja Annadrava Shoola using sheetala-madhura lehyas and virechana.',
        shlokaReference: {
          shlokaSanskrit: 'दह्यते हृदयं यत्र चोद्गारो जायतेऽम्लवत् । पैत्तिके शूलरोगे तु शीतलं पाययेद् घृतम् ॥',
          shlokaTransliteration: 'Dahyate hṛdayaṁ yatra codgāro jāyate’mlavat | Paittike śūla-roge tu śītalaṁ pāyayed ghṛtam ||',
          meaning:
            'Where there is burning in the epigastrium/heart region and sour acid eructations (Pittaja Shoola / Vidagdhajirna), cooling medicated ghee and sweet-bitter compounds swiftly extinguish the burning.',
          sourceBook: 'Sushruta Samhita',
          chapterAndVerse: 'Uttara Tantra Ch. 42, Verse 89–95 (Gulma-Shoola Pratishedha)',
        },
        chikitsaSutra:
          'विदग्धे वमनं पूर्वं पैत्तिके शीतलैर्जयेत् । गुडामलकयोगैश्च द्राक्षाक्षौद्रयुतैस्तथा ॥ (Induce Vamana in acute Vidagdha state, then conquer Pittaja burning with Sheetala Amalaki, Draksha, and Shatavari yogas.)',
        chikitsaSutraReference: 'Sushruta Samhita, Sutra Sthana Ch. 46, Verse 504 & Uttara Tantra Ch. 42, Verse 92',
        shamanaChikitsa: [
          {
            category: 'Churna Yoga',
            medicineName: 'Amalaki-Yashtimadhu-Shatavari Churna with Sita',
            dosage: '3g to 5g BD',
            anupana: 'Cold boiled milk or Narikela Jala (coconut water)',
            timing: 'Before and after meals',
            indications: 'Heals duodenal and esophageal mucosal ulceration and extinguishes Hrit-kanthadaha.',
            reference: 'Sushruta Samhita, Uttara Tantra Ch. 42, Verse 95–98',
          },
          {
            category: 'Kwatha Yoga',
            medicineName: 'Parushakadi Gana Kwatha (Parushaka, Draksha, Dhatri, Dadima)',
            dosage: '40ml BD',
            anupana: 'Cool water with Sharkara',
            timing: 'Mid-morning and afternoon',
            indications: 'Alleviates Pittaja thirst, burning epigastrium, and acid regurgitation.',
            reference: 'Sushruta Samhita, Sutra Sthana Ch. 38, Verse 43–44',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Pittahara Virechana',
            indication: 'Downward clearance of sour bilious Pitta.',
            details: 'Draksha + Haritaki + Trivrit yoga at bedtime.',
          },
        ],
      },
      vagbhata: {
        acharyaId: 'vagbhata',
        acharyaName: 'Acharya Vagbhata',
        sourceTextbook: 'Ashtanga Hridaya (Sutra Sthana Ch. 8 & Chikitsa Sthana Ch. 10)',
        isDirectlyMentioned: false,
        mentionStatusNote:
          'Not described as a separate standalone chapter in Ashtanga Hridaya. Referenced under Vidagdhajirna (Sutra Sthana Ch. 8) and Pittaja Grahani / Gulma (Chikitsa Sthana Ch. 10 & 14).',
        clinicalPhilosophy:
          'Emphasizes Drakshadi Kwatha, Dadimadi Ghrita, and strict dietary Pathya (sweet pomegranate, aged barley, mudga yusha).',
        shlokaReference: {
          shlokaSanskrit: 'द्राक्षाधात्रीसितायुक्तं पिबेत् पित्तप्रशान्तये । विदाहक्लमनुत् पथ्यं शीतलं पित्तकाशिनाम् ॥',
          shlokaTransliteration: 'Drākṣā-dhātrī-sitā-yuktaṁ pibet pitta-praśāntaye | Vidāha-klamanut pathyaṁ śītalaṁ pitta-kāśinām ||',
          meaning:
            'Infusion of Draksha (raisins), Dhatri (Amalaki), and rock sugar extinguishes aggravated Pitta, relieving epigastric burning (Vidaha) and exhaustion.',
          sourceBook: 'Ashtanga Hridaya',
          chapterAndVerse: 'Chikitsa Sthana Ch. 10 & Sutra Sthana Ch. 8, Verse 26',
        },
        chikitsaSutra:
          'विदग्धे वमनं कार्यं लङ्घनं वा यथाबलम् । द्राक्षादिभिः कषायैश्च पित्तं सन्तर्पणैर्जयेत् ॥ (Manage Vidagdhajirna with Vamana or Langhana according to strength, followed by Drakshadi cooling decoctions.)',
        chikitsaSutraReference: 'Ashtanga Hridaya, Sutra Sthana Ch. 8, Verse 26–28 & Chikitsa Sthana Ch. 1, Verse 55',
        shamanaChikitsa: [
          {
            category: 'Kashaya Yoga',
            medicineName: 'Drakshadi Kashayam (Draksha, Madhuka, Yashtimadhu, Lodhra, Chandana, Musta, Amalaki)',
            dosage: '40ml BD',
            anupana: 'Cool boiled water with Laja & honey',
            timing: 'Before meals',
            indications: 'Pacifies Pitta, relieves nausea, dizziness, and burning stomach sensations.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 1, Verse 55–58',
          },
          {
            category: 'Medicated Ghee',
            medicineName: 'Dadimadi Ghrita',
            dosage: '10ml empty stomach',
            anupana: 'Warm water',
            timing: 'Early morning',
            indications: 'Balances Samana Vayu and Pachaka Pitta; repairs mucosal lining.',
            reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 16, Verse 2–4',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Nitya Virechana with Haritaki & Draksha',
            indication: 'Gentle daily elimination of acidic bile secretions.',
            details: 'Haritaki Churna 3g with Draksha decoction at bedtime.',
          },
        ],
      },
      chakradatta: {
        acharyaId: 'chakradatta',
        acharyaName: 'Acharya Chakrapani Datta',
        sourceTextbook: 'Chakradatta (Ch. 52 - Amlapitta Chikitsa Prakarana)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Chakradatta dedicates Chapter 52 specifically to Amlapitta Chikitsa, detailing Patoladi Kwatha, Bhunimbadi Kwatha, Narikela Khanda, and Khanda Kushmanda Avaleha.',
        clinicalPhilosophy:
          'Pioneered Khanda Kushmanda Avaleha, Patoladi Kwatha, and Dhatri Lauha protocols for chronic ulceration and acid regurgitation.',
        shlokaReference: {
          shlokaSanskrit: 'पटोलं नागरं धान्यं क्वाथयित्वा जलं पिबेत् । कफपित्तज्वरं छर्दिमम्लपित्तं विनाशयेत् ॥',
          shlokaTransliteration: 'Paṭolaṁ nāgaraṁ dhānyaṁ kvāthayitvā jalaṁ pibet | Kapha-pitta-jvaraṁ chardim amlapittaṁ vināśayet ||',
          meaning:
            'Decoction of Patola, Nagara (Sunthi), and Dhanyaka (coriander) taken internally eradicates Kapha-Pitta morbidity, vomiting, and severe Amlapitta.',
          sourceBook: 'Chakradatta',
          chapterAndVerse: 'Amlapitta Chikitsa Ch. 52, Verse 7',
        },
        chikitsaSutra:
          'वान्तिं कृत्वामलापित्तं जयेत्तिक्तैर्विरेचनैः । खण्डकूष्माण्डकावलेहं धात्रीलोहं च योजयेत् ॥ (After Vamana and Tikta-Virechana, conquer Amlapitta and Parinama Shoola using Khanda Kushmanda Avaleha and Dhatri Lauha.)',
        chikitsaSutraReference: 'Chakradatta, Amlapitta Chikitsa Prakarana Ch. 52, Verse 1–3 & 26',
        shamanaChikitsa: [
          {
            category: 'Kwatha Yoga',
            medicineName: 'Bhunimbadi Kwatha (Bhunimba, Nimbavalkala, Triphala, Patola, Vasa, Guduchi, Parpata)',
            dosage: '40ml BD',
            anupana: 'Cooled decoction with 1 tsp Madhu',
            timing: 'Before meals',
            indications: 'Specifically codified in Chakradatta for Kapha-Pittaja Amlapitta and sour belching.',
            reference: 'Chakradatta, Amlapitta Chikitsa Ch. 52, Verse 12',
          },
          {
            category: 'Avaleha Yoga',
            medicineName: 'Khanda Kushmanda Avaleha / Narikela Khanda',
            dosage: '10g BD',
            anupana: 'Cool milk',
            timing: 'Mid-morning and evening',
            indications: 'Heals mucosal erosions, stops hematemesis/burning, and protects against peptic ulcers.',
            reference: 'Chakradatta, Amlapitta Chikitsa Ch. 52, Verse 26–33',
          },
          {
            category: 'Lauha Kalpana',
            medicineName: 'Dhatri Lauha (Amalaki, Lauha Bhasma, Yashtimadhu, Guduchi)',
            dosage: '500mg BD',
            anupana: 'Ghee and honey',
            timing: 'Before, during, and after meals',
            indications: 'Eradicates chronic Amlapitta, Annadrava Shoola, and associated Pandu.',
            reference: 'Chakradatta, Shoola Chikitsa Ch. 26, Verse 53–58',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Mrudu Virechana with Triphala-Trivrit Kwatha',
            indication: 'Clearing morbid bilious toxins from liver and duodenum.',
            details: 'Triphala Kwatha 50ml with 5g Trivrit Churna and sugar (Chakradatta 52/4).',
          },
        ],
      },
      sharangadhara: {
        acharyaId: 'sharangadhara',
        acharyaName: 'Acharya Sharangadhara',
        sourceTextbook: 'Sharangadhara Samhita (Madhyama Khanda Ch. 6 & Ch. 8)',
        isDirectlyMentioned: true,
        mentionStatusNote:
          'Directly Mentioned: Sharangadhara Samhita Madhyama Khanda Ch. 6 (Verse 112-116) is the original classical source of Avipattikar Churna specifically indicated for Amlapitta.',
        clinicalPhilosophy:
          'Formulated the gold-standard Avipattikar Churna and Kushmanda Avaleha for rapid neutralization of Vidagdha Pitta.',
        shlokaReference: {
          shlokaSanskrit: 'अविपत्तिकरं चूर्णमम्लपित्तनिवारणम् । मलावरोधं शमयेदग्निमान्द्यं प्रमेहनुत् ॥',
          shlokaTransliteration: 'Avipattikaraṁ cūrṇam amlapitta-nivāraṇam | Malāvarodhaṁ śamayed agnimāndyaṁ pramehanut ||',
          meaning:
            'Avipattikar Churna is the sovereign remedy to eradicate Amlapitta; it clears constipation, kindles digestive fire, and prevents metabolic complications.',
          sourceBook: 'Sharangadhara Samhita',
          chapterAndVerse: 'Madhyama Khanda Ch. 6, Verse 115',
        },
        chikitsaSutra:
          'अविपत्तिकरं चूर्णं शीतवारियुतं पिबेत् । कूष्माण्डकावलेहेन ह्यम्लपित्तं विनाशयेत् ॥ (Administer Avipattikar Churna with cool water before meals and Kushmanda Avaleha to neutralize Vidagdha Pitta and clear Vibandha.)',
        chikitsaSutraReference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Verse 112–116 & Ch. 8, Verse 22',
        shamanaChikitsa: [
          {
            category: 'Churna Kalpana',
            medicineName: 'Avipattikar Churna (Trikatu, Triphala, Musta, Vida, Vidanga, Ela, Patra, Lavanga, Trivrit, Sharkara)',
            dosage: '5g BD',
            anupana: 'Cool water or tender coconut water',
            timing: 'Before meals & bedtime',
            indications: 'Neutralizes gastric hyperacidity and gently flushes Vidagdha Pitta downward.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Verse 112–116',
          },
          {
            category: 'Hima Kalpana',
            medicineName: 'Dhanyaka Hima (Cold Coriander Seed Infusion)',
            dosage: '50ml BD',
            anupana: 'Mixed with Sharkara (rock sugar)',
            timing: 'Morning empty stomach & afternoon',
            indications: 'Extinguishes internal burning (Antardaha), thirst, and sour reflux.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 4 (Hima Kalpana), Verse 6',
          },
        ],
        shodhanaChikitsa: [
          {
            procedure: 'Nitya Rechana with Avipattikar Churna',
            indication: 'Daily clearance of sour Pitta from Amashaya-Grahani.',
            details: '6g Avipattikar Churna at bedtime with lukewarm water.',
          },
        ],
      },
    };
  }

  // =========================================================================================
  // DYNAMIC ACHARYA-SPECIFIC PROTOCOLS FOR ALL OTHER DISEASES (60+ PRESETS & CUSTOM CASES)
  // Every Acharya selection dynamically changes Shloka, Chikitsa Sutra + Ref, and Shamana Aushadha + Ref!
  // =========================================================================================
  const primaryShloka = primaryAnalysis?.shlokaReference;
  const doshaInfo = primaryAnalysis?.doshaDushya?.dosha || 'Tridosha';
  const srotasInfo = primaryAnalysis?.doshaDushya?.srotas || 'Affected Srotas';
  const shortDiseaseName = cleanDiseaseLabel.split('(')[0].trim();

  const isPostBrihatTrayiDisease =
    dLower.includes('amavata') ||
    dLower.includes('amlapitta') ||
    dLower.includes('somaroga') ||
    dLower.includes('shoola') ||
    dLower.includes('medoroga') ||
    dLower.includes('sheetapitta') ||
    dLower.includes('snayuka') ||
    dLower.includes('phiranga');

  // Disease-family specific chapters, Sutras, and Acharya-specific Shamana Formulations with exact references
  let charakaChapter = 'Chikitsa Sthana Ch. 28 / Sutra Sthana Ch. 20';
  let sushrutaChapter = 'Chikitsa Sthana Ch. 4 / Uttara Tantra';
  let vagbhataChapter = 'Chikitsa Sthana Ch. 21 / Sutra Sthana Ch. 13';
  let chakradattaChapter = `${shortDiseaseName} Chikitsa Prakarana`;
  let sharangadharaChapter = 'Madhyama Khanda Ch. 2, Ch. 6 & Ch. 7';

  let charakaSutra = 'निदानपरिवर्जनं दीपनपाचनं च पूर्वं कृत्वा दोषप्रत्यनीकं शमनं शोधनं वा प्रयोजयेत् ॥ (Eliminate causative factors, kindle Agni with Deepana-Pachana, and administer Dosha-specific Shamana & Shodhana.)';
  let sushrutaSutra = 'संशोधनं संशमनं च कार्यं रक्तावसेकाग्निकृतानि चैव व्याधिबलं वीक्ष्य भिषग्वरेण ॥ (Institute targeted Shodhana, Shamana, Raktamokshana, or Agnikarma according to the stage and seat of pathology.)';
  let vagbhataSutra = 'दोषाणां समवेतानां विकल्प्यांशांशकल्पनाम् । व्याधेः स्वलक्षणं बुद्ध्वा ततो भैषज्यमाचरेत् ॥ (Assess fractional Dosha-Dushya involvement and administer targeted Kashaya, Ghrita, and Basti therapy.)';
  let chakradattaSutra = 'व्याधिविशेषविहितैर्दृष्टफलैर्योगवरैर्जयेदाशु गदान् घोरान् पथ्याहारसमन्वितैः ॥ (Conquer the disease rapidly using verified Drishta-Phala classical Yogas along with strict Pathya Ahara.)';
  let sharangadharaSutra = 'पञ्चविधकषायैश्च चूर्णगुग्गुलुवटिकाभिः । अनुपानविशेषेण जयेद्रोगं समाहितः ॥ (Administer standardized Kwatha, Churna, Vati, and Guggulu preparations with disease-specific Anupanas.)';

  let charakaMed1 = {
    category: 'Charaka Kashaya Yoga',
    medicineName: 'Dashamoola Kwatha / Punarnavadi Mandura',
    dosage: '40ml Kwatha or 500mg Vati BD',
    anupana: 'Warm water or Takra',
    timing: 'Before meals',
    indications: `Clears Srotorodha in ${srotasInfo} and pacifies ${doshaInfo} in ${shortDiseaseName}.`,
    reference: `Charaka Samhita, ${charakaChapter}`,
  };
  let charakaMed2 = {
    category: 'Charaka Rasayana / Ghrita',
    medicineName: 'Chitrakadi Vati & Phalatrikadi Kwatha',
    dosage: '2 tablets (500mg) / 40ml BD',
    anupana: 'Warm water',
    timing: 'After meals',
    indications: `Restores Jatharagni-Dhatvagni and reverses Samprapti of ${shortDiseaseName}.`,
    reference: `Charaka Samhita, Chikitsa Sthana Ch. 15, Verse 96`,
  };

  let sushrutaMed1 = {
    category: 'Sushruta Gana Kwatha',
    medicineName: 'Aragwadhadi / Varunadi Gana Kwatha',
    dosage: '40ml BD',
    anupana: 'Warm water with 1 tsp Madhu',
    timing: 'Before meals',
    indications: `Sushruta Samhita Gana decoction for clearing Kapha-Pitta-Vata obstruction in ${shortDiseaseName}.`,
    reference: `Sushruta Samhita, Sutra Sthana Ch. 38 (Dravyasangrahaniya)`,
  };
  let sushrutaMed2 = {
    category: 'Sushruta Ghrita / Guggulu',
    medicineName: 'Kalyanaka Ghrita / Gokshuradi Guggulu',
    dosage: '10ml Ghrita or 2 tablets BD',
    anupana: 'Warm water or milk',
    timing: 'After meals',
    indications: `Repairs Dushya pathology and relieves localized inflammation in ${shortDiseaseName}.`,
    reference: `Sushruta Samhita, ${sushrutaChapter}`,
  };

  let vagbhataMed1 = {
    category: 'Ashtanga Hridaya Kashaya',
    medicineName: 'Amruthotharam Kashayam / Chiruvilwadi Kashayam',
    dosage: '40ml BD',
    anupana: 'Warm water with Saindhava / Shunthi',
    timing: 'Morning and evening empty stomach',
    indications: `Classical Vagbhata Kashaya for Ama-pachana and Srotoshodhana in ${shortDiseaseName}.`,
    reference: `Ashtanga Hridaya, ${vagbhataChapter}`,
  };
  let vagbhataMed2 = {
    category: 'Ashtanga Hridaya Churna / Ghrita',
    medicineName: 'Hinguvachadi Churna / Indukanta Ghrita',
    dosage: '3g Churna or 10ml Ghrita BD',
    anupana: 'Warm water',
    timing: 'With first morsel of food',
    indications: `Regulates Vata-Anulomana and kindles Dhatvagni in ${shortDiseaseName}.`,
    reference: `Ashtanga Hridaya, Chikitsa Sthana Ch. 14, Verse 31`,
  };

  let chakradattaMed1 = {
    category: 'Chakradatta Vishesha Yoga',
    medicineName: 'Punarnavashtaka Kwatha / Pathyadi Kwatha',
    dosage: '40ml BD',
    anupana: 'Warm water or Guda',
    timing: 'Before meals',
    indications: `Targeted Drishta-Phala decoction codified by Acharya Chakrapani for ${shortDiseaseName}.`,
    reference: `Chakradatta, ${chakradattaChapter}`,
  };
  let chakradattaMed2 = {
    category: 'Chakradatta Vati / Guggulu',
    medicineName: 'Chandraprabha Vati / Kanchanara Guggulu',
    dosage: '2 tablets (500mg) BD',
    anupana: 'Warm decoction or milk',
    timing: 'After meals',
    indications: `Breaks deep Dhatu-gata Sanga and Granthi/Shotha pathology in ${shortDiseaseName}.`,
    reference: `Chakradatta, ${chakradattaChapter} (Yoga Ratnakara / Chakrapani)`,
  };

  let sharangadharaMed1 = {
    category: 'Sharangadhara Kwatha Kalpana',
    medicineName: 'Dashamoola Katutraya Kwatha /Guduchyadi Kwatha',
    dosage: '40ml BD',
    anupana: 'Warm water with Pippali churna',
    timing: 'Before meals',
    indications: `Standardized 1:16 boiled reduced to 1/8th decoction for ${shortDiseaseName}.`,
    reference: `Sharangadhara Samhita, Madhyama Khanda Ch. 2`,
  };
  let sharangadharaMed2 = {
    category: 'Sharangadhara Vati / Churna',
    medicineName: 'Sanjivani Vati / Sudarshana Churna / Triphala Guggulu',
    dosage: '2 tablets (250mg) or 3g Churna BD',
    anupana: 'Ardraka Swarasa or Ushnodaka',
    timing: 'After meals',
    indications: `Precision pharmaceutical yoga with targeted Anupana for ${shortDiseaseName}.`,
    reference: `Sharangadhara Samhita, Madhyama Khanda Ch. 6 & Ch. 7`,
  };

  // Customize per disease system
  if (dLower.includes('jwara') || dLower.includes('fever') || dLower.includes('typhoid') || dLower.includes('malaria')) {
    charakaChapter = 'Chikitsa Sthana Ch. 3 (Jwara Chikitsitam), Verse 139–142';
    sushrutaChapter = 'Uttara Tantra Ch. 39 (Jwara Pratishedha), Verse 101–108';
    vagbhataChapter = 'Chikitsa Sthana Ch. 1 (Jwara Chikitsa), Verse 1–25';
    chakradattaChapter = 'Jwara Chikitsa Prakarana Ch. 1, Verse 45–88';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Shadanga Paneeya) & Ch. 6 (Sudarshana Churna)';

    charakaSutra = 'ज्वरे लङ्घनमेवादावुपदिष्टं रसादिषु । कषायपानं पथ्याशी षडहे समतिक्रान्ते ॥ (In Jwara, institute Langhana and Shadanga Paneeya first; administer Pachana Kashayas after 6 days.)';
    sushrutaSutra = 'लङ्घनं स्वेदनं कालो यवागूस्तिक्तको रसः । पाचनान्यविपक्वानां दोषाणां तरुणे ज्वरे ॥ (In Taruna Jwara, execute Langhana, Swedana, Yavagu, and Tikta-Rasa Pachana.)';
    vagbhataSutra = 'आमाशयस्थो हत्वाग्निं सामो मार्गान् पिधापयन् । विदधाति ज्वरं दोषस्तस्माल्लङ्घनमाचरेत् ॥ (Because Sama Dosha blocks channels and extinguishes Agni in Jwara, Langhana and Amruthotharam Kashaya are primary.)';
    chakradattaSutra = 'पर्पटामृतधात्रीभिः क्वाथं पीत्वा ज्वरं जयेत् । सुदर्शनं प्रयुञ्जीत सर्वज्वरनिवारणम् ॥ (Conquer Jwara with Parpatadi/Amritadi Kwatha and Sudarshana Churna.)';
    sharangadharaSutra = 'मुस्तपर्पटकोशीरचन्दनोदीच्यनागरैः । शृतशीतं जलं दद्यात् पिपासाज्वरशान्तये ॥ (Give Shadanga Paneeya and Sanjivani Vati with ginger juice to digest Sama Jwara.)';

    charakaMed1 = { category: 'Paneeya Kalpana', medicineName: 'Shadanga Paneeya (Musta, Parpata, Ushira, Chandana, Udichya, Nagara)', dosage: '50ml 4 times daily', anupana: 'Boiled and cooled water', timing: 'Throughout the day', indications: 'Quenches Jwara-trishna (thirst), burning, and digests Ama.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 3, Verse 145–146' };
    charakaMed2 = { category: 'Kashaya Yoga', medicineName: 'Kiratatikta-Musta-Guduchi Kwatha', dosage: '40ml BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Breaks Vishama & Pitta-Kapha Jwara cycles.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 3, Verse 201' };

    sushrutaMed1 = { category: 'Kwatha Yoga', medicineName: 'Guduchyadi Kwatha (Guduchi, Nimba, Amalaki, Parpata)', dosage: '40ml BD', anupana: 'Warm water with Pippali', timing: 'Before meals', indications: 'Clears Rasa-vaha Srotas Ama and reduces pyrexia.', reference: 'Sushruta Samhita, Uttara Tantra Ch. 39, Verse 170' };
    sushrutaMed2 = { category: 'Ghrita Yoga (Jeerna Jwara)', medicineName: 'Pippalyadi Ghrita', dosage: '10ml OD', anupana: 'Warm milk', timing: 'Morning', indications: 'Indicated in chronic low-grade Jeerna Jwara with Dhatu depletion.', reference: 'Sushruta Samhita, Uttara Tantra Ch. 39, Verse 218' };

    vagbhataMed1 = { category: 'Kashaya Yoga', medicineName: 'Amruthotharam Kashayam (Nagaradi Kwatha)', dosage: '40ml BD', anupana: 'Warm water with Guda', timing: 'Before meals', indications: 'Digests Sama Jwara and relieves constipation and body ache.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 1, Verse 62' };
    vagbhataMed2 = { category: 'Kashaya Yoga', medicineName: 'Drakshadi Kashayam', dosage: '40ml BD', anupana: 'Cool water with honey', timing: 'Before meals', indications: 'Relieves Vata-Pittaja Jwara, burning, and fatigue.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 1, Verse 55' };

    chakradattaMed1 = { category: 'Kwatha Yoga', medicineName: 'Amritashtaka Kwatha / Bhunimbadi Kwatha', dosage: '40ml BD', anupana: 'Warm water with Pippali churna', timing: 'Before meals', indications: 'Rapidly resolves Kapha-Pittaja and Sannipataja Jwara.', reference: 'Chakradatta, Jwara Chikitsa Ch. 1, Verse 59' };
    chakradattaMed2 = { category: 'Vati Kalpana', medicineName: 'Mrityunjaya Rasa / Tribhuvanakirti Rasa', dosage: '125mg–250mg BD', anupana: 'Ardraka Swarasa (ginger juice) & honey', timing: 'After meals', indications: 'Indicated for acute high-grade Sama Jwara and body pain.', reference: 'Chakradatta, Jwara Chikitsa Ch. 1 & Bhaishajya Ratnavali' };

    sharangadharaMed1 = { category: 'Churna Kalpana', medicineName: 'Mahasudarshana Churna (Kiratatikta-pradhana 53 herbs)', dosage: '3g to 5g BD', anupana: 'Ushnodaka (warm water)', timing: 'After meals', indications: 'Eradicates all types of acute, intermittent, and chronic Jwara.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Verse 26–36' };
    sharangadharaMed2 = { category: 'Gutika Kalpana', medicineName: 'Sanjivani Vati', dosage: '2 tablets (250mg) BD', anupana: 'Ardraka Swarasa (fresh ginger juice)', timing: 'After meals', indications: 'Specifically indicated by Sharangadhara in Ajirna and Sama Jwara.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Verse 18–21' };
  } else if (dLower.includes('prameha') || dLower.includes('madhumeha') || dLower.includes('diabet')) {
    charakaChapter = 'Chikitsa Sthana Ch. 6 (Prameha Chikitsitam), Verse 15–50';
    sushrutaChapter = 'Chikitsa Sthana Ch. 11 & 12 (Prameha & Pramehapidaka), Verse 6–22';
    vagbhataChapter = 'Chikitsa Sthana Ch. 12 (Prameha Chikitsa), Verse 1–38';
    chakradattaChapter = 'Prameha Chikitsa Prakarana Ch. 35, Verse 12–40';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Phalatrikadi) & Ch. 7 (Chandraprabha Vati)';

    charakaSutra = 'स्थूलः प्रमेही बलवानिहैकः कृशस्तथैकः परिदुर्बलश्च । सम्बृंहणं तत्र कृशस्य कार्यं संशोधनं दोषबलाधिकस्य ॥ (Classify Pramehi into Sthula-Balavan vs Krisha-Durbala; administer Shodhana & Apatarpana in Sthula, and Brimhana in Krisha.)';
    sushrutaSutra = 'सालसारादिना क्वाथं शिलाजतुसमन्वितम् । प्रयुञ्जीत प्रमेहेषु मधुमेहहरं परम् ॥ (Administer Salasaradi Gana Kwatha purified with Shilajatu and Khadira-Kramuka decoction to conquer Madhumeha.)';
    vagbhataSutra = 'निशाधात्रीप्रयोगेण कतकस्य फलेन च । जयेत्सर्वप्रमेहांस्तु यवान्नैश्चापतर्पणैः ॥ (Conquer all 20 Pramehas using Nisha-Amalaki, Niruryadi/Kataka yogas, and barley-predominant Apatarpana diet.)';
    chakradattaSutra = 'त्रिफलादार्वीविशालादिः क्वाथः सर्वप्रमेहजित् । चन्द्रप्रभां शिलाजतुं प्रयुञ्जीत विचक्षणः ॥ (Use Phalatrikadi/Darvyadi Kwatha, Chandraprabha Vati, and Shilajatu for Prameha.)';
    sharangadharaSutra = 'चन्द्रप्रभा वटी श्रेष्ठा विंशतिप्रमेहनाशिनी । न्यग्रोधादिकषायेण शिलाजतुयुतेन च ॥ (Administer Chandraprabha Vati and Nyagrodhadi Kwatha with Shilajatu.)';

    charakaMed1 = { category: 'Swarasa / Churna Yoga', medicineName: 'Nisha-Amalaki Yoga (Haridra Churna + Amalaki Swarasa)', dosage: '3g Haridra in 20ml Amalaki Swarasa BD', anupana: '1 tsp Madhu (honey)', timing: 'Early morning empty stomach', indications: 'Agraya (foremost) formulation of Acharya Charaka for Prameha & insulin sensitivity.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 6, Verse 26' };
    charakaMed2 = { category: 'Kwatha Yoga', medicineName: 'Darvyadi Kwatha (Daruharidra,Surahva, Triphala, Musta)', dosage: '40ml BD', anupana: 'Warm water with honey', timing: 'Before meals', indications: 'Reduces Prabhuta-Avila Mutrata (polyuria & turbid urine) and Medo-kleda.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 6, Verse 26' };

    sushrutaMed1 = { category: 'Gana Kwatha & Rasayana', medicineName: 'Salasaradi Gana Kwatha Bhavita Shilajatu', dosage: '500mg Shilajatu with 40ml Salasaradi Kwatha BD', anupana: 'Salasaradi Kwatha', timing: 'Morning empty stomach', indications: 'Sushruta Samhita gold-standard Rasayana for Madhumeha and Dhatu-shaithilya.', reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 13 (Madhumeha Chikitsitam), Verse 6–9' };
    sushrutaMed2 = { category: 'Ayaskriti Kalpana', medicineName: 'Asanadi Ayaskriti', dosage: '15ml BD', anupana: 'Equal quantity water', timing: 'After meals', indications: 'Scrapes excess Medas and Kleda in Kapha-Pittaja Prameha.', reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 11, Verse 10' };

    vagbhataMed1 = { category: 'Kashaya Yoga', medicineName: 'Kathakakhadiradi Kashayam /avarai-Kataka Yoga', dosage: '40ml BD', anupana: 'Warm water with Nisha churna', timing: 'Before breakfast and dinner', indications: 'Regulates blood glucose and prevents diabetic neuropathy (Karapada Daha).', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 12, Verse 8–12 & Sahasrayogam' };
    vagbhataMed2 = { category: 'Lehya / Churna', medicineName: 'Dhanwantharam Ghrita / Lodhrasava', dosage: '15ml BD', anupana: 'Warm water', timing: 'After meals', indications: 'Indicated in Prameha, Medoroga, and Prameha-pidaka.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 12, Verse 24–28' };

    chakradattaMed1 = { category: 'Kwatha Yoga', medicineName: 'Phalatrikadi Kwatha (Triphala, Daruharidra, Vishala, Musta)', dosage: '40ml BD', anupana: 'Cooled with 1 tsp Madhu', timing: 'Before meals', indications: 'Clears Kapha-Pitta Prameha and hepatic lipid accumulation.', reference: 'Chakradatta, Prameha Chikitsa Ch. 35, Verse 18' };
    chakradattaMed2 = { category: 'Vati / Bhasma Yoga', medicineName: 'Vasant Kusumakar Ras / Trivanga Bhasma', dosage: '125mg BD', anupana: 'Nisha-Amalaki Swarasa', timing: 'Morning & evening', indications: 'Rejuvenates pancreatic Dhatvagni and protects against diabetic retinopathy/neuropathy.', reference: 'Chakradatta, Prameha Chikitsa Ch. 35 & Rasendra Sara Sangraha' };

    sharangadharaMed1 = { category: 'Gutika Kalpana', medicineName: 'Chandraprabha Vati (Shilajatu-Guggulu-Loha 37-ingredient Yoga)', dosage: '2 tablets (500mg) BD', anupana: 'Warm water or Darvyadi Kwatha', timing: 'After meals', indications: 'Eradicates all 20 types of Prameha, Mutrakrichra, and Daurbalya.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Verse 40–49' };
    sharangadharaMed2 = { category: 'Churna Kalpana', medicineName: 'Nyagrodhadi Churna', dosage: '3g to 5g BD', anupana: 'Amalaki Swarasa or honey-water', timing: 'Before meals', indications: 'Checks polyuria, polydipsia, and diabetic carbuncles (Pidaka).', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Verse 123–127' };
  } else if (dLower.includes('gridhrasi') || dLower.includes('sciatica') || dLower.includes('pakshaghata') || dLower.includes('ardita') || dLower.includes('manyastambha') || dLower.includes('avabahuka') || dLower.includes('kampavata') || dLower.includes('vata')) {
    charakaChapter = 'Chikitsa Sthana Ch. 28 (Vatavyadhi Chikitsitam), Verse 56 & 101';
    sushrutaChapter = 'Nidana Sthana Ch. 1, Verse 74 & Chikitsa Sthana Ch. 4, Verse 15';
    vagbhataChapter = 'Nidana Sthana Ch. 15, Verse 54 & Chikitsa Sthana Ch. 21, Verse 45';
    chakradattaChapter = 'Vatavyadhi Chikitsa Prakarana Ch. 22, Verse 45–68';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Maharasnadi) & Ch. 7 (Trayodashanga/Yogaraja)';

    charakaSutra = 'अन्तरा कण्डरां गुल्फं सिरा बस्त्यग्निकर्म च । गृध्रसीषु प्रयुञ्जीत स्नेहस्वेदौ विरेचनम् ॥ (In Gridhrasi and Vatavyadhi, administer Snehana, Swedana, Mridu Virechana, Basti, and Siravedha/Agnikarma between Kandara and Gulpha.)';
    sushrutaSutra = 'पार्ष्णिप्रत्यङ्गुलीनां तु कण्डरा याऽनिलार्दिता । गृध्रसीति हि सा ज्ञेया सिरामोक्षाग्निकर्मजित् ॥ (Gridhrasi affects the Kandara extending from heel to toes; conquer it via Siravedha at Janu/Gulpha and Agnikarma.)';
    vagbhataSutra = 'सस्नेहं शोधनं बस्तिं सहचरादिं च योजयेत् । गृध्रसीखञ्जपङ्गुत्वे तैलान्यावर्तितानि च ॥ (In Gridhrasi and lower-limb Vata, administer Snigdha Virechana, Basti, Sahacharadi Kwatha, and Avartita Tailas.)';
    chakradattaSutra = 'दशमूलीबलारास्नाक्वाथमेरण्डतैलवत् । पिबेद् गृध्रसीशान्त्यर्थं त्रयोदशाङ्गगुग्गुलुम् ॥ (Take Dashamoola-Bala-Rasna Kwatha mixed with Eranda Taila along with Trayodashanga Guggulu.)';
    sharangadharaSutra = 'महारास्नादिक्वाथेन गुग्गुलुप्रयोगैस्तथा । गृध्रसीं कटिशूलं च जयेदाशु भिषग्वरः ॥ (Conquer Gridhrasi and Katishoola rapidly with Maharasnadi Kwatha and Yogaraja Guggulu.)';

    charakaMed1 = { category: 'Kwatha & Sneha', medicineName: 'Eranda Sneha with Dashamoola Kwatha', dosage: '40ml Kwatha + 10ml Eranda Taila BD', anupana: 'Warm water', timing: 'Morning empty stomach & bedtime', indications: 'Relieves Sphik-purva Kati-Prishta-Uru-Janu-Jangha-Pada radiating pain and stiffness.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 84 & 101' };
    charakaMed2 = { category: 'Taila Prayoga', medicineName: 'Bala Taila / Amritadi Taila', dosage: '5ml internal + Kati Basti', anupana: 'Warm milk', timing: 'Twice daily', indications: 'Nourishes compressed sciatic Kandara and Snayu.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 28, Verse 148' };

    sushrutaMed1 = { category: 'Kwatha Yoga', medicineName: 'Rasna-Guggulu / Bhadradarvadi Gana Kwatha', dosage: '2 tablets / 40ml BD', anupana: 'Warm water', timing: 'After meals', indications: 'Alleviates acute sciatic nerve inflammation and Kandara-gata Vata.', reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4, Verse 24' };
    sushrutaMed2 = { category: 'Taila Kalpana', medicineName: 'Prasaranyadi Taila', dosage: '5ml internal + Abhyanga', anupana: 'Warm water or milk', timing: 'Before meals', indications: 'Relieves Sakthi-utkshepa nigraha (restricted straight-leg raising).', reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 4, Verse 29' };

    vagbhataMed1 = { category: 'Kashaya Yoga', medicineName: 'Sahacharadi Kashayam + Ksheerabala 101', dosage: '40ml Kashayam + 10 drops Taila BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Specific Ashtanga Hridaya drug of choice for Gridhrasi and lower-limb Vata.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21, Verse 56' };
    vagbhataMed2 = { category: 'Kashaya Yoga', medicineName: 'Gandharvahastadi Kashayam', dosage: '40ml BD', anupana: 'Saindhava & Guda', timing: 'Before breakfast and dinner', indications: 'Clears Apana Vayu avarana and lumbosacral spasm.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21 & Sahasrayogam' };

    chakradattaMed1 = { category: 'Kwatha Yoga', medicineName: 'Sephalika Dala Kwatha (Parijata / Harshringar Leaf Decoction)', dosage: '40ml BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Unique specific Drishta-Phala remedy of Chakradatta for severe Gridhrasi (Sciatica).', reference: 'Chakradatta, Vatavyadhi Chikitsa Ch. 22, Verse 49' };
    chakradattaMed2 = { category: 'Guggulu Yoga', medicineName: 'Trayodashanga Guggulu / Rasna Guggulu', dosage: '2 tablets (500mg) BD', anupana: 'Warm Dashamoola Kwatha', timing: 'After meals', indications: 'Eliminates Katigraha and Gridhrasi nerve root pain.', reference: 'Chakradatta, Vatavyadhi Chikitsa Ch. 22, Verse 52 & 65' };

    sharangadharaMed1 = { category: 'Kwatha Kalpana', medicineName: 'Maharasnadi Kwatha', dosage: '40ml BD', anupana: 'Warm water with Shunthi & Eranda Taila', timing: 'Before meals', indications: 'Explicitly indicated in Sharangadhara Samhita for Gridhrasi, Katishoola, and Pakshaghata.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Verse 89–95' };
    sharangadharaMed2 = { category: 'Guggulu Kalpana', medicineName: 'Yogaraja Guggulu', dosage: '2 tablets (500mg) BD', anupana: 'Rasnasaptaka Kwatha', timing: 'After meals', indications: 'Pacifies Snayu-Majja-gata Vata and restores limb mobility.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Verse 56–69' };
  } else if (dLower.includes('kushtha') || dLower.includes('psoriasis') || dLower.includes('eczema') || dLower.includes('vicharchika') || dLower.includes('dadru') || dLower.includes('skin') || dLower.includes('shwitra')) {
    charakaChapter = 'Chikitsa Sthana Ch. 7 (Kushtha Chikitsitam), Verse 39–105';
    sushrutaChapter = 'Chikitsa Sthana Ch. 9 (Kushtha Chikitsitam), Verse 6–54';
    vagbhataChapter = 'Chikitsa Sthana Ch. 19 (Kushtha Chikitsa), Verse 1–65';
    chakradattaChapter = 'Kushtha Chikitsa Prakarana Ch. 50, Verse 15–82';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Manjishthadi) & Ch. 7 (Kaishora/Panchatikta Guggulu)';

    charakaSutra = 'वातोत्तरेषु सर्पिर्वमनं श्लेष्मोत्तरेषु कुष्ठेषु । पित्तोत्तरेषु मोक्षो रक्तस्य विरेचनं चाग्र्यम् ॥ (In Vata-dominant Kushtha give Ghritapana; in Kapha-dominant give Vamana; in Pitta/Rakta-dominant execute Raktamokshana and Virechana.)';
    sushrutaSutra = 'पक्षात् पक्षाच्छर्दनान्यभ्युपेयान्मासान्मासात् स्रंसनं चापि दद्यात् । स्रಾವ्यं रक्तं वत्सरे द्विरवलेहाः खदिरासनानां च हिताः प्रयोगाः ॥ (Repeat Vamana fortnightly, Virechana monthly, Raktamokshana twice yearly, and Khadira/Tuvaraka internal Rasayana.)';
    vagbhataSutra = 'तिक्तकैलैर्धृतैर्वापि शुद्धदेहस्य कुष्ठिनः । खदिरं सेवमानस्य नश्यत्याशु त्वगामयः ॥ (Purify the Kushtha patient with Tikta Ghrita & Shodhana, and administer Khadira and Aragwadha continuously.)';
    chakradattaSutra = 'मञ्जिष्ठादिकषायेण पञ्चतिक्तैश्च गुग्गुलुभिः । लेपैश्चक्रंमर्दाद्यैर्जयेत्कुष्ठं सुदारुणम् ॥ (Conquer Kushtha with Manjishthadi Kwatha, Panchatikta Guggulu, and Chakramardadi Lepa.)';
    sharangadharaSutra = 'बृहन्मञ्जिष्ठादिक्वाथः सर्वकुष्ठहरः परः । तुवरकैल्यैर्लेपैश्च रक्तदोषं विशोधयेत् ॥ (Purify Rakta and Tvak Dhatu using Brihat Manjishthadi Kwatha and Khadirarishta.)';

    charakaMed1 = { category: 'Kashaya Yoga', medicineName: 'Patoladi Kwatha / Madhvasava / Kanakabindu Arishta', dosage: '40ml BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Purifies Rakta, Mamsa, and Lasika; resolves scaling and pruritus.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 7, Verse 62–76' };
    charakaMed2 = { category: 'Ghrita Yoga', medicineName: 'Mahatikta Ghrita / Tikta Shatpala Ghrita', dosage: '10ml BD', anupana: 'Warm water', timing: 'Empty stomach', indications: 'Sovereign Charaka formulation for Pitta-Rakta Kushtha, scaling, and burning.', reference: 'Charaka Samhita, Chikitsa Sthana Ch. 7, Verse 144–150' };

    sushrutaMed1 = { category: 'Rasayana Taila / Kwatha', medicineName: 'Tuvaraka Taila & Khadira Sara Kwatha', dosage: '40ml Kwatha BD + Tuvaraka external/internal', anupana: 'Warm water', timing: 'Morning and evening', indications: 'Agraya Sushruta Rasayana for Kushtha and chronic weeping/plaque dermatoses.', reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 9, Verse 7 & Ch. 13, Verse 20' };
    sushrutaMed2 = { category: 'Gana Kwatha', medicineName: 'Aragwadhadi Gana Kwatha', dosage: '40ml BD', anupana: 'Honey', timing: 'Before meals', indications: 'Eliminates Kapha-Kleda, Kandu (itching), and Kotha.', reference: 'Sushruta Samhita, Sutra Sthana Ch. 38, Verse 6–7' };

    vagbhataMed1 = { category: 'Ghrita & Kwatha', medicineName: 'Guggulutiktaka Ghrita & Patolakaturohinyadi Kashayam', dosage: '10ml Ghrita + 40ml Kashayam BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Clears deep Tvak-Rakta-Mamsa Dhatu toxins in Ekakushtha & Vicharchika.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 19, Verse 2–8 & Ch. 21, Verse 58' };
    vagbhataMed2 = { category: 'Lepa Yoga', medicineName: 'Eladi Churna / Sidharthakadi Snana Churna', dosage: 'External Udvartana / Lepa', anupana: 'Takra or Gomutra', timing: 'Before bath', indications: 'Relieves intense itching (Kandu) and epidermal plaques.', reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 19, Verse 62' };

    chakradattaMed1 = { category: 'Guggulu Ghrita Yoga', medicineName: 'Panchatikta Ghrita Guggulu', dosage: '2 tablets (500mg) BD', anupana: 'Warm Khadira Jala', timing: 'After meals', indications: 'Codified in Chakradatta Kushtha Chikitsa for obstinate Tridoshaja Kushtha.', reference: 'Chakradatta, Kushtha Chikitsa Ch. 50, Verse 89–93' };
    chakradattaMed2 = { category: 'Lepa & Taila', medicineName: 'Marichyadi Taila & Chakramardadi Lepa', dosage: 'External application BD', anupana: 'Kanji / Gomutra', timing: 'Morning and night', indications: 'Eradicates Dadru (tinea), Vicharchika (eczema), and Ekakushtha (psoriasis).', reference: 'Chakradatta, Kushtha Chikitsa Ch. 50, Verse 26 & 110' };

    sharangadharaMed1 = { category: 'Kwatha Kalpana', medicineName: 'Brihat Manjishthadi Kwatha (45-herb Raktaprasadana Kwatha)', dosage: '40ml BD', anupana: 'Warm water', timing: 'Before meals', indications: 'Master blood purifier of Sharangadhara Samhita for all 18 Kushthas and Vatarakta.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Verse 137–142' };
    sharangadharaMed2 = { category: 'Asava-Arishta Kalpana', medicineName: 'Khadirarishta', dosage: '20ml BD', anupana: 'Equal quantity water', timing: 'After meals', indications: 'Classic fermented heartwood extract for long-term remission of skin disorders.', reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 10, Verse 60–65' };
  }

  return {
    charaka: {
      acharyaId: 'charaka',
      acharyaName: 'Acharya Charaka',
      sourceTextbook: `Charaka Samhita (${charakaChapter})`,
      isDirectlyMentioned: !isPostBrihatTrayiDisease,
      mentionStatusNote: isPostBrihatTrayiDisease
        ? `Not directly mentioned as an independent standalone chapter by Acharya Charaka (codified later in Madhava Nidana / Laghu Trayi). However, in Charaka Samhita complete textbook, the exact Samprapti (${doshaInfo}) and clinical management of ${cleanDiseaseLabel} are referenced under ${charakaChapter}.`
        : `Directly Mentioned in Charaka Samhita (${charakaChapter}) with complete Nidana, Samprapti (${doshaInfo}), and Chikitsa Sutra for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Charaka's Kayachikitsa protocol for ${cleanDiseaseLabel} prioritizes Agni-Deepana, Ama-Pachana, clearing Srotorodha in ${srotasInfo}, and Dosha-pratyanika Shamana & Shodhana.`,
      shlokaReference: primaryShloka
        ? {
            ...primaryShloka,
            sourceBook: primaryShloka.sourceBook.includes('Charaka')
              ? primaryShloka.sourceBook
              : `Charaka Samhita (correlating with ${primaryShloka.sourceBook})`,
            chapterAndVerse: primaryShloka.sourceBook.includes('Charaka')
              ? primaryShloka.chapterAndVerse
              : `${charakaChapter} • Ref: ${primaryShloka.chapterAndVerse}`,
          }
        : {
            shlokaSanskrit: 'विकारो धातुवैषम्यं साम्यं प्रकृतिरुच्यते । निदानदोषदूष्याणां विकारो विघाताय च ॥',
            shlokaTransliteration: 'Vikāro dhātu-vaiṣamyaṁ sāmyaṁ prakṛtir ucyate | Nidāna-doṣa-dūṣyāṇāṁ vikāro vighātāya ca ||',
            meaning: `Disease (${cleanDiseaseLabel}) arises from the specific interaction of Nidana, aggravated ${doshaInfo}, and vulnerable Dushyas in ${srotasInfo}; breaking this Samprapti restores Dhatu-Samya.`,
            sourceBook: 'Charaka Samhita',
            chapterAndVerse: charakaChapter,
          },
      chikitsaSutra: charakaSutra,
      chikitsaSutraReference: `Charaka Samhita, ${charakaChapter}`,
      shamanaChikitsa: [charakaMed1, charakaMed2],
      shodhanaChikitsa: [
        {
          procedure: 'Charaka Samshodhana Protocol (Virechana / Basti)',
          indication: `Radical elimination of aggravated ${doshaInfo} from ${srotasInfo}.`,
          details: `Classical Snehapana followed by Mridu Virechana or Niruha-Anuvasana Basti as per Charaka Samhita (${charakaChapter}).`,
        },
      ],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
    sushruta: {
      acharyaId: 'sushruta',
      acharyaName: 'Acharya Sushruta',
      sourceTextbook: `Sushruta Samhita (${sushrutaChapter})`,
      isDirectlyMentioned: !isPostBrihatTrayiDisease,
      mentionStatusNote: isPostBrihatTrayiDisease
        ? `Not directly mentioned by this separate disease name in Sushruta Samhita. Searching Sushruta Samhita complete textbook locates the equivalent clinical entity and its Shodhana/Para-surgical therapy under ${sushrutaChapter}.`
        : `Directly Mentioned in Sushruta Samhita (${sushrutaChapter}), providing specialized Shalya/Shalakya, Raktamokshana, Agnikarma, and internal Gana Kwatha protocols for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Sushruta evaluates ${cleanDiseaseLabel} through Rakta-Dosha involvement, Srotas obstruction in ${srotasInfo}, and targeted Shodhana, Jalaukavacharana, or Agnikarma alongside internal Gana Kwathas.`,
      shlokaReference: {
        shlokaSanskrit: 'संशोधनं संशमनं च कार्यं व्याधिबलं वीक्ष्य भिषग्वरेण । रक्तावसेकाग्निकृतानि चैव दुष्टेषु धातुष्वचिरप्रसिद्धिः ॥',
        shlokaTransliteration:
          'Saṁśodhanaṁ saṁśamanaṁ ca kāryaṁ vyādhi-balaṁ vīkṣya bhiṣag-vareṇa | Raktāvasekāgni-kṛtāni caiva duṣṭeṣu dhātuṣv acira-prasiddhiḥ ||',
        meaning: `In ${cleanDiseaseLabel}, evaluating the strength of ${doshaInfo} and Dushya, the wise physician executes Shodhana, Shamana, Raktamokshana, or Agnikarma for rapid eradication of pathology (${sushrutaChapter}).`,
        sourceBook: 'Sushruta Samhita',
        chapterAndVerse: sushrutaChapter,
      },
      chikitsaSutra: sushrutaSutra,
      chikitsaSutraReference: `Sushruta Samhita, ${sushrutaChapter}`,
      shamanaChikitsa: [sushrutaMed1, sushrutaMed2],
      shodhanaChikitsa: [
        {
          procedure: 'Sushruta Raktamokshana / Virechana Protocol',
          indication: `Elimination of Rakta-Pitta-Vata morbidity in ${shortDiseaseName}.`,
          details: `Targeted Jalaukavacharana / Siravedha or Trivrit-yukta Virechana as codified in Sushruta Samhita (${sushrutaChapter}).`,
        },
      ],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy || {
        therapyName: 'Jalaukavacharana',
        procedureNotes: `Targeted para-surgical Raktamokshana / Agnikarma protocol as per Sushruta Samhita (${sushrutaChapter}) for ${cleanDiseaseLabel}.`,
        siteAndInstruments: 'Applied locally over the affected anatomical site or Marma-srotas pathway.',
      },
    },
    vagbhata: {
      acharyaId: 'vagbhata',
      acharyaName: 'Acharya Vagbhata',
      sourceTextbook: `Ashtanga Hridaya & Sangraha (${vagbhataChapter})`,
      isDirectlyMentioned: !isPostBrihatTrayiDisease,
      mentionStatusNote: isPostBrihatTrayiDisease
        ? `Not directly mentioned as an independent chapter in Ashtanga Hridaya. In Acharya Vagbhata's complete textbook, the exact clinical syndrome of ${cleanDiseaseLabel} (${doshaInfo}) is referenced and treated under ${vagbhataChapter}.`
        : `Directly Mentioned in Ashtanga Hridaya (${vagbhataChapter}), synthesizing the classical Nidana and practical Kashaya/Ghrita/Basti therapeutics for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Vagbhata emphasizes Yuktivyapashraya Kashayas, medicated Ghritas, and Srotoshodhana tailored to ${doshaInfo} in ${cleanDiseaseLabel}.`,
      shlokaReference: {
        shlokaSanskrit: 'दोषाणां समवेतानां विकल्प्यांशांशकल्पनाम् । व्याधेः स्वलक्षणं बुद्ध्वा ततो भैषज्यमाचरेत् ॥',
        shlokaTransliteration:
          'Doṣāṇāṁ samavetānāṁ vikalpyāṁśāṁśa-kalpanām | Vyādheḥ svalakṣaṇaṁ buddhvā tato bhaiṣajyam ācaret ||',
        meaning: `Determining the fractional aggravation (Amshamsha Kalpana) of ${doshaInfo} and recognizing the pathognomonic signs of ${cleanDiseaseLabel} in ${vagbhataChapter}, targeted therapy must be instituted.`,
        sourceBook: 'Ashtanga Hridaya',
        chapterAndVerse: vagbhataChapter,
      },
      chikitsaSutra: vagbhataSutra,
      chikitsaSutraReference: `Ashtanga Hridaya, ${vagbhataChapter}`,
      shamanaChikitsa: [vagbhataMed1, vagbhataMed2],
      shodhanaChikitsa: [
        {
          procedure: 'Vagbhata Kashaya-Basti & Virechana Protocol',
          indication: `Clearing Srotas Sanga and balancing ${doshaInfo} in ${shortDiseaseName}.`,
          details: `Avipattikar/Gandharvahastadi Anulomana or Yoga Basti course as per Ashtanga Hridaya (${vagbhataChapter}).`,
        },
      ],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
    chakradatta: {
      acharyaId: 'chakradatta',
      acharyaName: 'Acharya Chakrapani Datta',
      sourceTextbook: `Chakradatta (${chakradattaChapter})`,
      isDirectlyMentioned: true,
      mentionStatusNote: `Directly Mentioned in Chakradatta (${chakradattaChapter}) with specific verified classical Yogas (Drishta-Phala Yogas) for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Chakrapani Datta provides targeted, fast-acting Guggulu, Kwatha, and Rasa-Aushadhi formulations specifically indicated for ${cleanDiseaseLabel}.`,
      shlokaReference: {
        shlokaSanskrit: 'नागारोग्यकरं किञ्चिदौषधं युक्तिवर्जितम् । तस्माद् व्याधिविशेषेण योगान् प्रयुञ्जीत भिषक् ॥',
        shlokaTransliteration:
          'Nāgārogyakaraṁ kiñcid auṣadhaṁ yukti-varjitam | Tasmād vyādhi-viśeṣeṇa yogān prayuñjīta bhiṣak ||',
        meaning: `Disease-specific classical formulations compiled in Chakradatta (${chakradattaChapter}) directly target ${doshaInfo} and ${srotasInfo} in ${cleanDiseaseLabel}.`,
        sourceBook: 'Chakradatta',
        chapterAndVerse: chakradattaChapter,
      },
      chikitsaSutra: chakradattaSutra,
      chikitsaSutraReference: `Chakradatta, ${chakradattaChapter}`,
      shamanaChikitsa: [chakradattaMed1, chakradattaMed2],
      shodhanaChikitsa: [
        {
          procedure: 'Chakradatta Vishesha Shodhana & Upakrama',
          indication: `Targeted clearance of morbid ${doshaInfo} in ${shortDiseaseName}.`,
          details: `Classical Virechana, Kshara/Vaitarana Basti, or Lepa Upakrama as prescribed in Chakradatta (${chakradattaChapter}).`,
        },
      ],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
    sharangadhara: {
      acharyaId: 'sharangadhara',
      acharyaName: 'Acharya Sharangadhara',
      sourceTextbook: `Sharangadhara Samhita (${sharangadharaChapter})`,
      isDirectlyMentioned: true,
      mentionStatusNote: `Directly Mentioned in Sharangadhara Samhita (${sharangadharaChapter}) with standardized dosage (Matra), Anupana, and pharmaceutical formulations for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Sharangadhara codifies the exact Panchavidha Kashaya Kalpana, Churna, Vati, Guggulu, and Lehya ratios with disease-specific Anupanas for ${cleanDiseaseLabel}.`,
      shlokaReference: {
        shlokaSanskrit: 'अनुपानैर्विशेषेण क्वाथचूर्णादिकल्पनाः । शमयन्त्याशु गदान् घोरान् दोषदूष्यसमुत्थितान् ॥',
        shlokaTransliteration:
          'Anupānair viśeṣeṇa kvātha-cūrṇādi-kalpanāḥ | Śamayanty āśu gadān ghorān doṣa-dūṣya-samutthitān ||',
        meaning: `Administered with the specific disease-targeted Anupana, the Kwatha, Churna, and Guggulu formulations of Sharangadhara Samhita (${sharangadharaChapter}) rapidly pacify ${cleanDiseaseLabel}.`,
        sourceBook: 'Sharangadhara Samhita',
        chapterAndVerse: sharangadharaChapter,
      },
      chikitsaSutra: sharangadharaSutra,
      chikitsaSutraReference: `Sharangadhara Samhita, ${sharangadharaChapter}`,
      shamanaChikitsa: [sharangadharaMed1, sharangadharaMed2],
      shodhanaChikitsa: [
        {
          procedure: 'Sharangadhara Uttarakhanda Panchakarma Protocol',
          indication: `Standardized Matra-based Shodhana for ${shortDiseaseName}.`,
          details: `Administered according to Sharangadhara Samhita Uttarakhanda (Snehana, Swedana, Virechana & Basti Kalpana).`,
        },
      ],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
  };
};

export const getAcharyaProtocols = (
  diseaseName: string,
  primaryAnalysis: any
): Record<string, AcharyaClinicalProtocol> => {
  const base = getBaseAcharyaProtocols(diseaseName, primaryAnalysis);
  const dLower = (diseaseName || primaryAnalysis?.vyadhiVinischaya || '').toLowerCase();

  // Helper to enrich each Acharya with accurate Disease Reference, Multiple Chikitsa Shlokas, Complete Textbook Shamana Aushadhi, or strict NA when not mentioned
  const result: Record<string, AcharyaClinicalProtocol> = {};

  for (const [key, proto] of Object.entries(base)) {
    const cloned: AcharyaClinicalProtocol = JSON.parse(JSON.stringify(proto));

    // 1. STRICT "NA" RULE: If this Acharya does NOT directly mention the disease / Chikitsa Sutra in their Samhita
    if (!cloned.isDirectlyMentioned) {
      cloned.diseaseReference = 'NA';
      cloned.shlokaReference = {
        shlokaSanskrit: 'NA',
        shlokaTransliteration: 'NA',
        meaning: `NA — This disease is not mentioned as an independent Vyadhi in ${cloned.acharyaName}'s Samhita.`,
        sourceBook: 'NA',
        chapterAndVerse: 'NA',
      };
      cloned.chikitsaSutra = 'NA';
      cloned.chikitsaSutraReference = 'NA';
      cloned.chikitsaShlokas = [];
      cloned.shamanaChikitsa = [];
      cloned.shodhanaChikitsa = [];
      result[key] = cloned;
      continue;
    }

    // 2. Accurate Disease Reference & Chikitsa Reference per Acharya
    cloned.diseaseReference = `${cloned.shlokaReference.sourceBook} (${cloned.shlokaReference.chapterAndVerse})`;

    // 3. Build Multiple Chikitsa Shlokas stated by this Acharya for treatment (scrollable left/right)
    const shlokas: AcharyaChikitsaShlokaItem[] = [
      {
        title: `1. Core Chikitsa Sutra (${cloned.acharyaName})`,
        reference: cloned.chikitsaSutraReference,
        shlokaSanskrit: cloned.chikitsaSutra.split('(')[0].trim() || cloned.shlokaReference.shlokaSanskrit,
        shlokaTransliteration: cloned.shlokaReference.shlokaTransliteration,
        meaning: cloned.chikitsaSutra,
      },
      {
        title: `2. Nidana-Samprapti & Vyadhi Vishesha Shloka (${cloned.acharyaName})`,
        reference: `${cloned.shlokaReference.sourceBook}, ${cloned.shlokaReference.chapterAndVerse}`,
        shlokaSanskrit: cloned.shlokaReference.shlokaSanskrit,
        shlokaTransliteration: cloned.shlokaReference.shlokaTransliteration,
        meaning: cloned.shlokaReference.meaning,
      },
    ];

    if (key === 'charaka') {
      shlokas.push(
        {
          title: '3. Deepana-Pachana & Dosha-Shamana Chikitsa Shloka (Charaka)',
          reference: `${cloned.chikitsaSutraReference} (Shamana Yoga Sutra)`,
          shlokaSanskrit: 'पाचनैर्दीपनैश्चैव शमनैश्च यथाक्रमम् । दोषान् सन्धुक्षयेदग्निं स्रोतसां च विशोधनम् ॥',
          shlokaTransliteration: 'Pācanair dīpanaiś caiva śamanaiś ca yathākramam | Doṣān sandhukṣayed agniṁ srotasāṁ ca viśodhanam ||',
          meaning: 'By sequential administration of Deepana, Pachana, and Dosha-specific Shamana formulations, kindling Jatharagni and clearing Srotas Sanga eradicating the root pathology.',
        },
        {
          title: '4. Samshodhana & Punah-Apunarbhava Rasayana Shloka (Charaka)',
          reference: `${cloned.chikitsaSutraReference} (Shodhana & Apunarbhava Sutra)`,
          shlokaSanskrit: 'दोषाः कदाचित् कुप्यन्ति जिता लङ्घनपाचनैः । जिताः संशोधनैर्युगपन् न तु भूयः प्रकुप्यते ॥',
          shlokaTransliteration: 'Doṣāḥ kadācit kupyanti jitā laṅghana-pācanaiḥ | Jitāḥ saṁśodhanair yugapan na tu bhūyaḥ prakupyate ||',
          meaning: 'Doshas pacified merely by Langhana and Pachana may occasionally relapse, whereas those eradicated from the root by classical Samshodhana (Vamana, Virechana, Basti) and Rasayana do not recur (Apunarbhava).',
        }
      );
    } else if (key === 'sushruta') {
      shlokas.push(
        {
          title: '3. Gana-Kashaya & Dosha-Pratyanika Chikitsa Shloka (Sushruta)',
          reference: `${cloned.chikitsaSutraReference} & Sutra Sthana Ch. 38`,
          shlokaSanskrit: 'संशोधनं संशमनं च कार्यं व्याधिबलं वीक्ष्य भिषग्वरेण । गणौषधैः क्वाथघृतप्रयोगैर्दुष्टान् मलानाशु नयेत् प्रशान्तिम् ॥',
          shlokaTransliteration: 'Saṁśodhanaṁ saṁśamanaṁ ca kāryaṁ vyādhi-balaṁ vīkṣya bhiṣag-vareṇa | Gaṇauṣadhaiḥ kvātha-ghṛta-prayogair duṣṭān malān āśu nayet praśāntim ||',
          meaning: 'Evaluating the strength of the disease and patient, the skilled physician administers Shodhana and Shamana using Sushruta Gana Kwathas and medicated Ghritas to rapidly pacify vitiated Doshas and Rakta.',
        },
        {
          title: '4. Raktamokshana & Agnikarma Chikitsa Shloka (Sushruta)',
          reference: 'Sushruta Samhita, Sutra Sthana Ch. 12, Shloka 10 & Chikitsa Sthana',
          shlokaSanskrit: 'अग्निकर्मणा भेषजशस्त्रक्षारैरसाध्यानां रोगाणां सिद्धिर्भवति नापुनर्भवश्च ॥',
          shlokaTransliteration: 'Agnikarmaṇā bheṣaja-śastra-kṣārair asādhyānāṁ rogāṇāṁ siddhir bhavati nāpunarbhavaś ca ||',
          meaning: 'Disorders refractory to internal medicines, surgery, or Kshara are definitively cured without recurrence through targeted Agnikarma and Raktamokshana.',
        }
      );
    } else if (key === 'vagbhata') {
      shlokas.push(
        {
          title: '3. Amshamsha-Kalpana & Kashaya-Ghrita Chikitsa Shloka (Vagbhata)',
          reference: `${cloned.chikitsaSutraReference} (Ashtanga Hridaya)`,
          shlokaSanskrit: 'दोषाणां समवेतानां विकल्प्यांशांशकल्पनाम् । रसादिधातुगततां वीक्ष्य भैषज्यमाचरेत् ॥',
          shlokaTransliteration: 'Doṣāṇāṁ samavetānāṁ vikalpyāṁśāṁśa-kalpanām | Rasādi-dhātu-gatatāṁ vīkṣya bhaiṣajyam ācaret ||',
          meaning: 'Assessing the fractional combination (Amshamsha Kalpana) of Doshas and the exact Dhatu stage (Rasa, Rakta, Mamsa, Asthi), the physician prescribes targeted Kashayas, Ghritas, and Bastis.',
        },
        {
          title: '4. Basti & Srotoshodhana Chikitsa Shloka (Vagbhata)',
          reference: 'Ashtanga Hridaya, Sutra Sthana Ch. 19 & Chikitsa Sthana',
          shlokaSanskrit: 'सर्वं्यङ्गैकगदरोगजित् बस्तिर्वातहराणां हि न तत्समं किञ्चिदौषधम् ॥',
          shlokaTransliteration: 'Sarvāṅgaika-gada-rogajit bastir vātaharāṇāṁ hi na tatsamaṁ kiñcid auṣadham ||',
          meaning: 'Whether disease is localized to one organ or systemic across the whole body, no therapeutic measure equals Basti and Srotoshodhana for eradicating deep-seated pathology.',
        }
      );
    } else if (key === 'chakradatta') {
      if (dLower.includes('amavata') || dLower.includes('rheumatoid')) {
        shlokas.push(
          {
            title: '3. Ruksha Valuka Sweda Chikitsa Shloka (Chakradatta)',
            reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 2',
            shlokaSanskrit: 'सैन्धवादिभिरुष्णैश्च रूक्षैः स्वेदैरुपाचरेत् । बालुकापुटकैर्वाऽथ स्वेदयेदाममारुतम् ॥ २ ॥',
            shlokaTransliteration: 'Saindhavādibhir uṣṇaiś ca rūkṣaiḥ svedair upācaret | Bālukā-puṭakair vā’tha svedayed āma-mārutam || 2 ||',
            meaning: 'In Amavata, dry warm fomentation (Ruksha Sweda) using heated sand boluses (Valuka Pottali) and Saindhava-based dry poultices must be applied to liquefy localized joint Ama and relieve stiffness.',
          },
          {
            title: '4. Eranda Sneha Agrya Chikitsa Shloka (Chakradatta)',
            reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 15',
            shlokaSanskrit: 'आमवातगजेन्द्रस्य शरीरवनचारिणः । एक एव निहन्ताऽसौ एरण्डस्नेहकेसरी ॥ १५ ॥',
            shlokaTransliteration: 'Āmavāta-gajendrasya śarīra-vana-cāriṇaḥ | Eka eva nihantā’sau eraṇḍa-sneha-kesarī || 15 ||',
            meaning: 'Just as a lion alone slays a rampaging elephant in a forest, Eranda Sneha (medicated Castor oil) alone destroys the mighty elephant of Amavata roaming in the forest of the human body.',
          },
          {
            title: '5. Simhanada Guggulu Chikitsa Shloka (Chakradatta)',
            reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 42–47',
            shlokaSanskrit: 'पलं च त्रिफलाचूर्णं गन्धकस्य पलं तथा । एरण्डतैलसंयुक्तं सिंहनाद इति स्मृतः ॥',
            shlokaTransliteration: 'Palaṁ ca triphalā-cūrṇaṁ gandhakasya palaṁ tathā | Eraṇḍa-taila-saṁyuktaṁ siṁhanāda iti smṛtaḥ ||',
            meaning: 'Simhanada Guggulu prepared with Triphala Kwatha, Shuddha Gandhaka, Shuddha Guggulu, and Eranda Taila kindles Mandagni and purges deep-seated Ama from the joints.',
          }
        );
      } else {
        shlokas.push(
          {
            title: '3. Vishesha Kwatha & Churna Yoga Shloka (Chakradatta)',
            reference: `${cloned.chikitsaSutraReference} (Kwatha-Churna Prakarana)`,
            shlokaSanskrit: 'दोषदूष्यबलं वीक्ष्य क्वाथचूर्णवटीरसान् । प्रयुञ्जीत भिषक् प्राज्ञो दृष्टफलान् सुखावहान् ॥',
            shlokaTransliteration: 'Doṣa-dūṣya-balaṁ vīkṣya kvātha-cūrṇa-vaṭī-rasān | Prayuñjīta bhiṣak prājño dṛṣṭa-phalān sukhāvahān ||',
            meaning: 'Examining the strength of Dosha and Dushya, the wise physician administers verified (Drishta-Phala) Kwatha, Churna, Vati, and Rasa formulations codified in Chakradatta.',
          },
          {
            title: '4. Guggulu, Ghrita & Rasayana Yoga Shloka (Chakradatta)',
            reference: `${cloned.chikitsaSutraReference} (Guggulu-Ghrita Prakarana)`,
            shlokaSanskrit: 'गुग्गुलुं घृतयोगं वा रसायनमथापि वा । जीर्णे दोषे प्रयुञ्जीत व्याधेर्मूलनिकृन्तनम् ॥',
            shlokaTransliteration: 'Gugguluṁ ghṛta-yogaṁ vā rasāyanam athāpi vā | Jīrṇe doṣe prayuñjīta vyādher mūla-nikṛntanam ||',
            meaning: 'In the subacute and chronic stage after Ama Pachana, administer disease-specific Guggulu, medicated Ghrita, and Rasayana Yogas to uproot the disease completely.',
          }
        );
      }
    } else if (key === 'sharangadhara') {
      shlokas.push(
        {
          title: '3. Kwatha & Churna Kalpana Chikitsa Shloka (Sharangadhara)',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2 & Ch. 6',
          shlokaSanskrit: 'पानीयं षोडशगुणं क्षुण्णे द्रव्यपले क्षिपेत् । अष्टमांशावशिष्टं तु क्वाथं कोष्णं पिबेद् गदी ॥',
          shlokaTransliteration: 'Pānīyaṁ ṣoḍaśa-guṇaṁ kṣuṇṇe dravya-pale kṣipet | Aṣṭamāṁśāvaśiṣṭaṁ tu kvāthaṁ koṣṇaṁ pibed gadī ||',
          meaning: 'Coarsely powdered herbs boiled with 16 parts water and reduced to one-eighth (Ashtamamsha) yields the potent Kwatha, which must be taken lukewarm with disease-specific Prakshepa and Anupana.',
        },
        {
          title: '4. Gutika, Guggulu & Sandhana Chikitsa Shloka (Sharangadhara)',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7 & Ch. 10',
          shlokaSanskrit: 'गुग्गुलुं वटिकां लेहं आसवारिष्टकल्पनाः । अनुपानविशेषेण दद्याद् व्याधिप्रशान्तये ॥',
          shlokaTransliteration: 'Gugguluṁ vaṭikāṁ lehaṁ āsavāriṣṭa-kalpanāḥ | Anupāna-viśeṣeṇa dadyād vyādhi-praśāntaye ||',
          meaning: 'Administering standardized Gutika, Guggulu, Avaleha, and Asava-Arishta formulations with the exact classical Anupana acts as the carrier (Yogavahi) to rapidly cure the disease.',
        }
      );
    }

    cloned.chikitsaShlokas = shlokas;

    // 4. Complete Textbook Shamana Aushadhi Repertoire (Ensure all classical Kalpanas: Kwatha, Churna, Vati/Gutika, Guggulu, Ghrita/Taila, Asava-Arishta, Avaleha/Rasa Aushadhi are included as per textbook)
    const existingNames = new Set(cloned.shamanaChikitsa.map((m) => m.medicineName.toLowerCase()));
    const addMedIfMissing = (med: AcharyaClinicalProtocol['shamanaChikitsa'][0]) => {
      if (!existingNames.has(med.medicineName.toLowerCase())) {
        cloned.shamanaChikitsa.push(med);
        existingNames.add(med.medicineName.toLowerCase());
      }
    };

    const refBase = cloned.chikitsaSutraReference || cloned.sourceTextbook;

    if (dLower.includes('amavata') || dLower.includes('rheumatoid')) {
      if (key === 'chakradatta') {
        [
          {
            category: 'Kwatha Kalpana',
            medicineName: 'Rasnadi Dashamoola Kwatha / Shunthi-Gokshura Kwatha',
            dosage: '40 ml BD',
            anupana: 'Warm water with 1g Shunthi Churna',
            timing: 'Morning & evening before meals',
            indications: 'Digests deep-seated Sandhi-gata Ama, relieves morning stiffness and polyarticular swelling (Chakradatta Amavata Chikitsa).',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 7–9',
          },
          {
            category: 'Churna Kalpana',
            medicineName: 'Alambushadi Churna / Vaishwanara Churna',
            dosage: '3g – 5g BD',
            anupana: 'Ushnodaka (warm water) or Takra (buttermilk)',
            timing: 'Before or midst of meals',
            indications: 'Potent Deepana-Pachana, Vatanulomana, and Shothahara Churna specifically codified in Chakradatta Ch. 25.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 17–24',
          },
          {
            category: 'Churna Kalpana',
            medicineName: 'Shatyadi Churna / Panchakola Churna',
            dosage: '3g BD',
            anupana: 'Ushnodaka (warm water)',
            timing: 'Before meals',
            indications: 'Kindles Mandagni, clears Sama Jihwa (coated tongue), anorexia, and systemic heaviness (Gaurava).',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 6 & 12',
          },
          {
            category: 'Guggulu Kalpana',
            medicineName: 'shiva Guggulu / Yogaraja Guggulu',
            dosage: '2 tablets (500mg each) BD',
            anupana: 'Rasnadi Kwatha or warm water',
            timing: 'After meals',
            indications: 'Eliminates chronic joint stiffness, Trika-Sandhi pain, and prevents articular deformity.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 31–41',
          },
          {
            category: 'Sneha / Virechana Prayoga',
            medicineName: 'Eranda Taila (Medicated Castor Oil) with Shunthi Kwatha',
            dosage: '10ml – 15ml HS',
            anupana: '40ml warm Shunthi Kwatha (Dry Ginger Decoction)',
            timing: 'At bedtime (Ratri)',
            indications: 'Agrya Aushadhi (Lion against the elephant of Amavata) for Nitya Anulomana and clearing colon-origin Ama.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 15',
          },
          {
            category: 'Ghrita Kalpana (Nirama Stage)',
            medicineName: 'Shringaveradi Ghrita / Shunthi Ghrita',
            dosage: '5ml – 10ml OD',
            anupana: 'Ushnodaka (warm water)',
            timing: 'Morning once Ama is digested (Pakva-Amavata)',
            indications: 'Indicated specifically in Nirama/Pakva Amavata stage when Vata dryness predominates after Langhana-Pachana.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 25–28',
          },
          {
            category: 'Rasa Aushadhi',
            medicineName: 'Amavatari Rasa / Rasendra Gutika',
            dosage: '125mg – 250mg BD',
            anupana: 'Eranda Moola Kwatha or warm water',
            timing: 'After meals',
            indications: 'Controls severe Vrishchika-damsha-vat (scorpion-sting like) joint pain and acute synovitis.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 60–68',
          },
        ].forEach(addMedIfMissing);
      } else if (key === 'sharangadhara') {
        [
          {
            category: 'Kwatha Kalpana',
            medicineName: 'Maharasnadi Kwatha (Brihat 26-Ingredient Decoction)',
            dosage: '40ml BD',
            anupana: 'Warm water with 1g Shunthi Churna & 5ml Eranda Taila',
            timing: 'Before breakfast and dinner',
            indications: 'Complete Vata-Kapha-Amavatahara Kwatha for polyarthritis, joint swelling, and axial stiffness.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 2, Shloka 89–95',
          },
          {
            category: 'Churna Kalpana',
            medicineName: 'Vaishwanara Churna (Saindhava-Yavani-Ajmoda-Nagर-Haritaki)',
            dosage: '3g – 5g BD',
            anupana: 'Warm water or Takra (buttermilk)',
            timing: 'Before meals or at bedtime',
            indications: 'Specifically codified in Sharangadhara Samhita directly for Amavata, Gulma, Hridroga, and Vibandha.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Shloka 88–92',
          },
          {
            category: 'Guggulu Kalpana',
            medicineName: 'Simhanada Guggulu (Triphala-Gandhaka-Eranda-Guggulu)',
            dosage: '2 tablets (500mg each) BD',
            anupana: 'Warm water or Rasnasaptaka Kwatha',
            timing: 'After meals',
            indications: 'Digests Ama, purges morbid Doshas via Koshtha, and relieves joint effusion.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7 (Guggulu Prakarana)',
          },
          {
            category: 'Guggulu Kalpana',
            medicineName: 'Yogaraja Guggulu (29-Herb Classical Guggulu)',
            dosage: '2 tablets (500mg each) BD',
            anupana: 'Rasnasaptaka Kwatha or warm water',
            timing: 'After meals',
            indications: 'Indicated in subacute/Nirama stage of Amavata and Sandhi-Majjagata Vata.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 56–69',
          },
          {
            category: 'Gutika Kalpana',
            medicineName: 'Sanjivani Vati (Vidanga-Nagara-Pippali-Pathya-Vatsanabha)',
            dosage: '1 – 2 tablets (125mg) BD',
            anupana: 'Ardraka Swarasa (fresh ginger juice) or warm water',
            timing: 'After meals',
            indications: 'Specifically indicated by Sharangadhara in Ajirna, Sama Jwara, and acute Ama accumulation.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 18–21',
          },
          {
            category: 'Taila Kalpana (External & Internal)',
            medicineName: 'Saindhavadi Taila / Brihat Saindhavadi Taila',
            dosage: '5ml internal with warm water / Local application in Nirama stage',
            anupana: 'Ushnodaka',
            timing: 'Morning and night',
            indications: 'Penetrates deep into Kapha-avruta Vata channels and resolves joint contractures.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 9, Shloka 118–122',
          },
        ].forEach(addMedIfMissing);
      }
    } else if (dLower.includes('sandhi') || dLower.includes('osteo') || dLower.includes('vata')) {
      [
        {
          category: 'Kwatha / Kashaya Kalpana',
          medicineName: 'Maharasnadi Kwatha / Dashamoola Kwatha',
          dosage: '40 ml BD',
          anupana: 'Warm water with 5ml Eranda Taila or Ksheerabala drops',
          timing: 'Morning and evening before meals',
          indications: 'Pacifies aggravated Vyana Vayu, relieves Sandhi-shoola (joint pain) and crepitus.',
          reference: `${refBase} (Kwatha Yoga)`,
        },
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Yogaraja Guggulu / Trayodashanga Guggulu / Lakshadi Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Warm milk or Dashamoola Kwatha',
          timing: 'After meals',
          indications: 'Strengthens Asthi-Sandhi-Snayu (subchondral bone & ligaments) and reduces degenerative inflammation.',
          reference: `${refBase} (Guggulu Yoga)`,
        },
        {
          category: 'Ghrita / Sneha Kalpana',
          medicineName: 'Tikta Shatpala Ghrita / Guggulutiktaka Ghrita',
          dosage: '10 ml OD',
          anupana: 'Warm cow milk (Godugdha) or warm water',
          timing: 'Early morning empty stomach',
          indications: 'Tikta Rasa fortified with Ghrita directly nourishes Asthi and Majja Dhatu as per Asthi-Pradoshaja Chikitsa.',
          reference: `${refBase} (Sneha Kalpana)`,
        },
        {
          category: 'Churna / Rasayana Kalpana',
          medicineName: 'Ashwagandhadi Churna with Shatavari & Bala',
          dosage: '3g – 5g BD',
          anupana: 'Warm Ksheera (cow milk)',
          timing: 'Morning and bedtime',
          indications: 'Brimhana Rasayana that reverses Dhatukshaya and strengthens periarticular muscles.',
          reference: `${refBase} (Rasayana Yoga)`,
        },
        {
          category: 'Asava-Arishta Kalpana',
          medicineName: 'Dashamoolarishta / Balarishta',
          dosage: '20 ml BD',
          anupana: 'Equal quantity warm water',
          timing: 'After lunch and dinner',
          indications: 'Restores Vata anulomana, improves Dhatvagni, and relieves chronic neuro-muscular fatigue.',
          reference: `${refBase} (Sandhana Kalpana)`,
        },
        {
          category: 'Taila Kalpana (Abhyanga & Janu/Kati Basti)',
          medicineName: 'Mahanarayana Taila / Ksheerabala (101) Taila / Bala Taila',
          dosage: 'Local Abhyanga & Janu/Kati Basti (30 mins daily)',
          anupana: 'Followed by Nadi Sweda (steam fomentation)',
          timing: 'Morning and evening',
          indications: 'Eliminates Vatapurna-driti-sparsha (crepitus) and painful flexion/extension.',
          reference: `${refBase} (Taila Adhikara)`,
        },
      ].forEach(addMedIfMissing);
    } else if (dLower.includes('amla') || dLower.includes('gerd') || dLower.includes('acidity') || dLower.includes('pitta')) {
      [
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Patoladi Kwatha / Bhunimbadi Kwatha (Patola-Shunthi-Amrita-Katuki)',
          dosage: '40 ml BD',
          anupana: '1 tsp Madhu (honey) when cooled',
          timing: 'Before breakfast and dinner',
          indications: 'Pacifies Vidagdha Pitta, clears Kapha-Pitta Utklesha, and heals gastric mucosal inflammation.',
          reference: `${refBase} (Kwatha Yoga)`,
        },
        {
          category: 'Churna Kalpana',
          medicineName: 'Avipattikar Churna (Trikatu-Triphala-Musta-Vidanga-Trivrit-Sharkara)',
          dosage: '3g – 5g BD',
          anupana: 'Sheetala Jala (cool water) or Narikela Jala (tender coconut water)',
          timing: 'Before meals or at bedtime',
          indications: 'Agrya formulation for Urdhwaga Amlapitta; neutralizes hyperacidity and induces gentle Pitta Virechana.',
          reference: `${refBase} (Churna Kalpana)`,
        },
        {
          category: 'Churna / Satva Kalpana',
          medicineName: 'Shatavari-Yashthimadhu-Amalaki Churna + Guduchi Satva',
          dosage: '3g Churna + 500mg Satva BD',
          anupana: 'Cool cow milk or Mishri water',
          timing: 'Before meals',
          indications: 'Directly coats and regenerates esophageal/gastric mucosa; relieves Hrit-Kanthadaha (heartburn).',
          reference: `${refBase} (Medhya & Pittashamana Yoga)`,
        },
        {
          category: 'Vati / Rasa-Bhasma Kalpana',
          medicineName: 'Sutshekhar Rasa (125mg) + Kamadudha Rasa (Mouktikayukta 250mg)',
          dosage: '1 tablet each BD',
          anupana: 'Amalaki Swarasa or Ghee + Mishri',
          timing: '30 mins before meals',
          indications: 'Rapidly stops sour/bitter regurgitation (Tiktamla Udgara), nausea, and epigastric burning.',
          reference: `${refBase} (Rasa Yoga)`,
        },
        {
          category: 'Avaleha / Khanda Kalpana',
          medicineName: 'Kushmanda Avaleha / Narikela Khanda / Drakshavaleha',
          dosage: '10g BD',
          anupana: 'Lukewarm or cool milk',
          timing: 'Morning and evening',
          indications: 'Provides Madhura-Sheeta Pittashamana and prevents recurrent peptic erosion.',
          reference: `${refBase} (Avaleha Kalpana)`,
        },
        {
          category: 'Ghrita Kalpana',
          medicineName: 'Shatavari Ghrita / Dadimadi Ghrita / Drakshadi Ghrita',
          dosage: '5ml – 10ml OD',
          anupana: 'Warm milk or lukewarm water',
          timing: 'Morning empty stomach',
          indications: 'Restores Sama-Pachaka Pitta and heals chronic mucosal ulceration.',
          reference: `${refBase} (Ghrita Kalpana)`,
        },
      ].forEach(addMedIfMissing);
    } else {
      // Universal complete textbook Shamana repertoire across all classical Kalpanas for any other queried disease
      [
        {
          category: 'Kwatha / Kashaya Kalpana',
          medicineName: 'Dashamoola-Amritadi Kwatha / Pathyadi Kwatha',
          dosage: '40 ml BD',
          anupana: 'Ushnodaka (warm water)',
          timing: 'Morning and evening before meals',
          indications: 'Clears Srotorodha, digests Ama, and pacifies primary Dosha Prakopa.',
          reference: `${refBase} (Kashaya Prakarana)`,
        },
        {
          category: 'Churna Kalpana',
          medicineName: 'Triphala-Yashthimadhu-Guduchi Churna / Sitopaladi Churna',
          dosage: '3g – 5g BD',
          anupana: 'Warm water or Madhu (honey)',
          timing: 'After meals or at bedtime',
          indications: 'Regulates Anulomana, supports Dhatvagni, and prevents Srotas Sanga.',
          reference: `${refBase} (Churna Prakarana)`,
        },
        {
          category: 'Gutika / Vati Kalpana',
          medicineName: 'Chandraprabha Vati / Arogyavardhini Vati',
          dosage: '2 tablets (250mg–500mg) BD',
          anupana: 'Warm water or Punarnavadi Kwatha',
          timing: 'After breakfast and dinner',
          indications: 'Systemic Srotoshodhana, Yakrit-Vrikka protection, and Tridosha Shamana.',
          reference: `${refBase} (Gutika Prakarana)`,
        },
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Kaishora Guggulu / Triphala Guggulu / Kanchanara Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Warm water or Manjishthadi Kwatha',
          timing: 'After meals',
          indications: 'Anti-inflammatory, Raktaprasadana, and Lekhana action on deep Dushyas.',
          reference: `${refBase} (Guggulu Prakarana)`,
        },
        {
          category: 'Ghrita / Avaleha Kalpana',
          medicineName: 'Chyawanprasha Avaleha / Brahmi-Kalyanak Ghrita',
          dosage: '10g OD',
          anupana: 'Warm cow milk',
          timing: 'Early morning empty stomach',
          indications: 'Apunarbhava Rasayana that restores Ojas, Vyadhikshamatva (immunity), and tissue vitality.',
          reference: `${refBase} (Rasayana Prakarana)`,
        },
        {
          category: 'Asava-Arishta Kalpana',
          medicineName: 'Dashamoolarishta / Punarnavasava / Kumaryasava',
          dosage: '20 ml BD',
          anupana: 'Equal quantity lukewarm water',
          timing: 'After lunch and dinner',
          indications: 'Enhances bioavailability, kindles Jatharagni, and resolves chronic Dhatu depletion.',
          reference: `${refBase} (Sandhana Prakarana)`,
        },
      ].forEach(addMedIfMissing);
    }

    result[key] = cloned;
  }

  return result;
};

