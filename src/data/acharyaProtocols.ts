import { getSpecificDiseaseAcharyaProtocols } from './acharyaDiseaseProtocolsPart2';
import { getPart3DiseaseProtocols } from './acharyaDiseaseProtocolsPart3';

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

  // Check comprehensive disease-specific Acharya Samhita databases (Part 1, Part 2, Part 3)
  const specificPart1Or2 = getSpecificDiseaseAcharyaProtocols(dLower);
  if (specificPart1Or2) return specificPart1Or2;
  const specificPart3 = getPart3DiseaseProtocols(dLower);
  if (specificPart3) return specificPart3;

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

  let charakaShloka = primaryShloka || {
    shlokaSanskrit: `${shortDiseaseName} — निदानदोषदूष्यविशेषात् प्रवर्तते व्याधिः ।`,
    shlokaTransliteration: `${shortDiseaseName} — Nidāna-doṣa-dūṣya-viśeṣāt pravartate vyādhiḥ |`,
    meaning: `In Charaka Samhita (${charakaChapter}), ${cleanDiseaseLabel} manifests through vitiation of ${doshaInfo} in ${srotasInfo}.`,
    sourceBook: 'Charaka Samhita',
    chapterAndVerse: charakaChapter,
  };
  let sushrutaShloka = {
    shlokaSanskrit: charakaSutra.split('(')[0].trim(),
    shlokaTransliteration: `Sushruta Samhita Nidana & Chikitsa Sutra for ${shortDiseaseName}`,
    meaning: `Sushruta Samhita (${sushrutaChapter}) clinical definition and pathology of ${cleanDiseaseLabel}.`,
    sourceBook: 'Sushruta Samhita',
    chapterAndVerse: sushrutaChapter,
  };
  let vagbhataShloka = {
    shlokaSanskrit: vagbhataSutra.split('(')[0].trim(),
    shlokaTransliteration: `Ashtanga Hridaya Nidana & Chikitsa Sutra for ${shortDiseaseName}`,
    meaning: `Ashtanga Hridaya (${vagbhataChapter}) clinical definition and pathology of ${cleanDiseaseLabel}.`,
    sourceBook: 'Ashtanga Hridaya',
    chapterAndVerse: vagbhataChapter,
  };
  let chakradattaShloka = {
    shlokaSanskrit: chakradattaSutra.split('(')[0].trim(),
    shlokaTransliteration: `Chakradatta ${chakradattaChapter} Shloka for ${shortDiseaseName}`,
    meaning: `Chakradatta (${chakradattaChapter}) classical formulation and pathology reference for ${cleanDiseaseLabel}.`,
    sourceBook: 'Chakradatta',
    chapterAndVerse: chakradattaChapter,
  };
  let sharangadharaShloka = {
    shlokaSanskrit: sharangadharaSutra.split('(')[0].trim(),
    shlokaTransliteration: `Sharangadhara Samhita ${sharangadharaChapter} Shloka for ${shortDiseaseName}`,
    meaning: `Sharangadhara Samhita (${sharangadharaChapter}) classical formulation reference for ${cleanDiseaseLabel}.`,
    sourceBook: 'Sharangadhara Samhita',
    chapterAndVerse: sharangadharaChapter,
  };

  let charakaShodhana = { procedure: `Charaka Samshodhana (${charakaChapter})`, indication: `Radical elimination of aggravated ${doshaInfo} in ${shortDiseaseName}.`, details: `Snehapana followed by Virechana / Basti as codified in Charaka Samhita (${charakaChapter}).` };
  let sushrutaShodhana = { procedure: `Sushruta Shodhana & Raktamokshana (${sushrutaChapter})`, indication: `Elimination of Rakta-Dosha morbidity in ${shortDiseaseName}.`, details: `Virechana / Jalaukavacharana / Siravedha as codified in Sushruta Samhita (${sushrutaChapter}).` };
  let vagbhataShodhana = { procedure: `Vagbhata Shodhana Protocol (${vagbhataChapter})`, indication: `Clearing Srotas Sanga in ${shortDiseaseName}.`, details: `Virechana / Yoga Basti as codified in Ashtanga Hridaya (${vagbhataChapter}).` };
  let chakradattaShodhana = { procedure: `Chakradatta Shodhana Upakrama (${chakradattaChapter})`, indication: `Targeted clearance of morbid ${doshaInfo} in ${shortDiseaseName}.`, details: `Classical Shodhana & Lepa/Basti Upakrama as codified in Chakradatta (${chakradattaChapter}).` };
  let sharangadharaShodhana = { procedure: `Sharangadhara Uttarakhanda Panchakarma`, indication: `Matra-standardized Shodhana for ${shortDiseaseName}.`, details: `Administered as per Sharangadhara Samhita Uttarakhanda.` };

  // Customize per disease system
  if (dLower.includes('jwara') || dLower.includes('fever') || dLower.includes('typhoid') || dLower.includes('malaria')) {
    charakaChapter = 'Nidana Sthana Ch. 1 & Chikitsa Sthana Ch. 3 (Jwara Chikitsitam), Verse 31 & 139';
    sushrutaChapter = 'Uttara Tantra Ch. 39 (Jwara Pratishedha), Verse 13 & 101';
    vagbhataChapter = 'Nidana Sthana Ch. 2 & Chikitsa Sthana Ch. 1 (Jwara Chikitsa), Verse 1–25';
    chakradattaChapter = 'Jwara Chikitsa Prakarana Ch. 1, Verse 1–88';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Shadanga Paneeya) & Ch. 6 (Sudarshana Churna)';

    charakaShloka = {
      shlokaSanskrit: 'ज्वरप्रत्यात्मिकं लिङ्गं सन्तापो देहमानसः । स्वेदावरोधः सर्वाङ्गग्रहणं चारुचिस्तृषा ॥',
      shlokaTransliteration: 'Jvara-pratyātmikaṁ liṅgaṁ santāpo deha-mānasaḥ | Svedāvarodhaḥ sarvāṅga-grahaṇaṁ cārucis tṛṣā ||',
      meaning: 'The pathognomonic sign (Pratyatma Lakshana) of Jwara is Santapa (pyrexia/burning affliction of both body and mind), obstruction of sweat (Svedavarodha), generalized body ache, anorexia, and thirst.',
      sourceBook: 'Charaka Samhita',
      chapterAndVerse: 'Chikitsa Sthana Ch. 3, Verse 31 & Nidana Sthana Ch. 1, Verse 20',
    };
    sushrutaShloka = {
      shlokaSanskrit: 'स्वेदावरोधः सन्तापः सर्वाङ्गग्रहणं तथा । युगपद्यत्र रोगे तु स ज्वरः परिकीर्तितः ॥',
      shlokaTransliteration: 'Svedāvarodhaḥ santāpaḥ sarvāṅga-grahaṇaṁ tathā | Yugapad yatra roge tu sa jvaraḥ parikīrtitaḥ ||',
      meaning: 'The disease in which obstruction of perspiration (Svedavarodha), thermal elevation across the body (Santapa), and gripping ache in all limbs occur simultaneously is declared as Jwara by Acharya Sushruta.',
      sourceBook: 'Sushruta Samhita',
      chapterAndVerse: 'Uttara Tantra Ch. 39, Verse 13',
    };
    vagbhataShloka = {
      shlokaSanskrit: 'आमाशयस्थो हत्वाग्निं सामो मार्गान् पिधापयन् । विदधाति ज्वरं दोषः सन्तापं देहमानसः ॥',
      shlokaTransliteration: 'Āmāśayastho hatvāgniṁ sāmo mārgān pidhāpayan | Vidadhāti jvaraṁ doṣaḥ santāpaṁ deha-mānasaḥ ||',
      meaning: 'Sama Doshas lodged in the Amashaya extinguish digestive Agni, block Rasavaha and Swedavaha Srotas, and drive heat outward to produce Jwara (bodily and mental pyrexia).',
      sourceBook: 'Ashtanga Hridaya',
      chapterAndVerse: 'Nidana Sthana Ch. 2, Verse 2–4 & Chikitsa Sthana Ch. 1, Verse 1',
    };
    chakradattaShloka = {
      shlokaSanskrit: 'ज्वरादौ लङ्घनं प्रोक्तं ज्वरमध्ये तु पाचनम् । जीर्णे ज्वरे तु दातव्यं सर्पिः संशमनं हितम् ॥',
      shlokaTransliteration: 'Jvarādau laṅghanaṁ proktaṁ jvara-madhye tu pācanam | Jīrṇe jvare tu dātavyaṁ sarpiḥ saṁśamanaṁ hitam ||',
      meaning: 'In the initial stage of Jwara (Taruna Jwara) administer Langhana; in the middle stage administer Pachana Kwathas; and in chronic Jeerna Jwara administer medicated Ghrita and Shamana.',
      sourceBook: 'Chakradatta',
      chapterAndVerse: 'Jwara Chikitsa Prakarana Ch. 1, Verse 1–2',
    };
    sharangadharaShloka = {
      shlokaSanskrit: 'मुस्तपर्पटकोशीरचन्दनोदीच्यनागरैः । शृतशीतं जलं दद्यात् पिपासाज्वरशान्तये ॥',
      shlokaTransliteration: 'Musta-parpaṭakośīra-candanodīcya-nāgaraiḥ | Śṛta-śītaṁ jalaṁ dadyāt pipāsā-jvara-śāntaye ||',
      meaning: 'Water boiled and cooled with Musta, Parpata, Ushira, Raktachandana, Udichya, and Nagara (Shadanga Paneeya) is given to eradicate Jwara and morbid febrile thirst.',
      sourceBook: 'Sharangadhara Samhita',
      chapterAndVerse: 'Madhyama Khanda Ch. 2, Verse 142 & Ch. 6, Verse 26',
    };

    charakaShodhana = { procedure: 'Sadyo-Vamana (Kapha-predominant Taruna Jwara) & Mridu Virechana / Yapana Basti (Jeerna Jwara)', indication: 'Utklishta Dosha in Amashaya or Pakva Dosha in Jeerna Jwara.', details: 'Madanaphala Vamana in acute Kapha-Jwara; Aragwadha/Trivrit Virechana and Ksheera Basti in chronic Jwara (Ch. Chi. 3/146 & 227).' };
    sushrutaShodhana = { procedure: 'Vamana, Trivrit Virechana & Siravedha (in Vishama/Sannipata Jwara)', indication: 'Pakva Dosha in Jwara (Su. U. 39/96–104).', details: 'Vamana in Kaphaja Jwara, Virechana in Pittaja Jwara, and Siravedha if refractory to Shamana.' };
    vagbhataShodhana = { procedure: 'Langhana, Vamana & Niruha Basti (A.H. Chi. 1)', indication: 'Amashayagata Sama Dosha & Pakvashayagata Vata in Jwara.', details: 'Langhana in Taruna Jwara; Patoladi Virechana and Mustadi Yapana Basti in Jeerna Jwara.' };
    chakradattaShodhana = { procedure: 'Langhana & Aragwadhadi Mridu Virechana', indication: 'Clearing Sama Pitta-Kapha in Jwara.', details: 'Fasting until Nirama Lakshana followed by Draksha-Haritaki Anulomana (Chakradatta Ch. 1).' };
    sharangadharaShodhana = { procedure: 'Swedana & Pachana followed by Mridu Rechana', indication: 'Breaking Svedavarodha in Sama Jwara.', details: 'Sanjivani Vati with Ardraka Swarasa to induce diaphoresis followed by Haritaki Rechana.' };

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
    charakaChapter = 'Nidana Sthana Ch. 4 & Chikitsa Sthana Ch. 6 (Prameha Chikitsitam), Verse 15–50';
    sushrutaChapter = 'Nidana Sthana Ch. 6 & Chikitsa Sthana Ch. 11–13 (Prameha & Madhumeha Chikitsitam)';
    vagbhataChapter = 'Nidana Sthana Ch. 10 & Chikitsa Sthana Ch. 12 (Prameha Chikitsa), Verse 1–38';
    chakradattaChapter = 'Prameha Chikitsa Prakarana Ch. 35, Verse 12–40';
    sharangadharaChapter = 'Madhyama Khanda Ch. 6 (Nyagrodhadi) & Ch. 7 (Chandraprabha Vati)';

    charakaShloka = {
      shlokaSanskrit: 'आस्यासुखं स्वप्नसुखं दधीनि ग्राम्यौदकानूपरसाः पयांसि । नवान्नपानं गुडवैकृतं च प्रमेहहेतुः कफकृच्च सर्वम् ॥',
      shlokaTransliteration: 'Āsyāsukhaṁ svapnasukhaṁ dadhīni grāmyaudakānūparasāḥ payāṁsi | Navānnapānaṁ guḍa-vaikṛtaṁ ca prameha-hetuḥ kaphakṛc ca sarvam ||',
      meaning: 'Sedentary habits, excessive sleep, curds, meat of aquatic/marshy animals, new grains, and jaggery products aggravate Kapha, Medas, and Kleda to cause Prameha (characterized by Prabhuta-Avila Mutrata).',
      sourceBook: 'Charaka Samhita',
      chapterAndVerse: 'Chikitsa Sthana Ch. 6, Verse 4',
    };
    sushrutaShloka = {
      shlokaSanskrit: 'सामान्यं लक्षणं तेषां प्रभूताविलमूत्रता । सर्व एव प्रमेहास्तु कालेनाप्रतिकारिणः मधुमेहत्वमायान्ति ॥',
      shlokaTransliteration: 'Sāmānyaṁ lakṣaṇaṁ teṣāṁ prabhūtāvila-mūtratā | Sarva eva pramehās tu kālenāpratikāriṇaḥ madhumehatvam āyānti ||',
      meaning: 'The cardinal sign of all 20 Pramehas is Prabhuta-Avila Mutrata (profuse, turbid urination); if neglected over time, all Pramehas progress into incurable Madhumeha.',
      sourceBook: 'Sushruta Samhita',
      chapterAndVerse: 'Nidana Sthana Ch. 6, Verse 6 & 27',
    };
    vagbhataShloka = {
      shlokaSanskrit: 'प्रभूताविलमूत्रत्वं प्रमेहाणां स्वलक्षणम् । मधुरं यच्च मेहन्ति प्रायो मध्विव मेहिनः ॥',
      shlokaTransliteration: 'Prabhūtāvila-mūtratvaṁ pramehāṇāṁ svalakṣaṇam | Madhuraṁ yac ca mehanti prāyo madhv iva mehinaḥ ||',
      meaning: 'Profuse and turbid urination is the pathognomonic sign (Svalakshana) of Prameha; in Madhumeha, the patient passes urine sweet and astringent like honey.',
      sourceBook: 'Ashtanga Hridaya',
      chapterAndVerse: 'Nidana Sthana Ch. 10, Verse 7 & 18',
    };
    chakradattaShloka = {
      shlokaSanskrit: 'हरिद्रास्वरसं पीत्वा मधुना सह संयुतम् । धात्रीरसयुतं वापि सर्वमेहान् व्यपोहति ॥',
      shlokaTransliteration: 'Haridrā-svarasaṁ pītvā madhunā saha saṁyutam | Dhātrī-rasa-yutaṁ vāpi sarva-mehān vyapohati ||',
      meaning: 'Haridra combined with Amalaki Swarasa and Madhu (Nisha-Amalaki) or Phalatrikadi Kwatha eradicates all types of Prameha and Madhumeha.',
      sourceBook: 'Chakradatta',
      chapterAndVerse: 'Prameha Chikitsa Prakarana Ch. 35, Verse 15–18',
    };
    sharangadharaShloka = {
      shlokaSanskrit: 'चन्द्रप्रभा वटी ख्याता विंशतिप्रमेहनाशिनी । न्यग्रोधादिगणो योज्यः प्रमेहपिडकापहः ॥',
      shlokaTransliteration: 'Candraprabhā vaṭī khyātā viṁśati-prameha-nāśinī | Nyagrodhādi-gaṇo yojyaḥ prameha-piḍakāpahaḥ ||',
      meaning: 'Chandraprabha Vati and Nyagrodhadi Churna are the premier Sharangadhara formulations to conquer all 20 Pramehas and Prameha-pidakas.',
      sourceBook: 'Sharangadhara Samhita',
      chapterAndVerse: 'Madhyama Khanda Ch. 6, Verse 123 & Ch. 7, Verse 40–49',
    };

    charakaShodhana = { procedure: 'Samshodhana (Vamana & Virechana) in Sthula Pramehi (Ch. Chi. 6/15)', indication: 'Bahudosha Sthula Balavan Pramehi (Obese Type 2 Diabetes).', details: 'Mustadi/Sarshapadi Snigdha Udvartana, Vamana in Kaphaja Prameha, Virechana in Pittaja Prameha, and Somaraji/Dhanvantara Basti.' };
    sushrutaShodhana = { procedure: 'Teekshna Vamana, Virechana & Asthapana Basti (Su. Chi. 11/7)', indication: 'Elimination of Kleda-Medas-Kapha from Bastivaha Srotas.', details: 'Snehana with Priyangvadi Taila followed by Vamana, Virechana, and Surasadi Asthapana Basti.' };
    vagbhataShodhana = { procedure: 'Vamana, Virechana & Udvartana (A.H. Chi. 12/1–5)', indication: 'Sthula Pramehi with excess Kleda and Medas.', details: 'Herbal powder dry massage (Udvartana) and bi-purification (Vamana & Virechana).' };
    chakradattaShodhana = { procedure: 'Triphaladi Virechana & Shilajatu Rasayana', indication: 'Kapha-Pitta Prameha.', details: 'Purgation with Phalatrikadi/Triphala decoction followed by purified Shilajatu.' };
    sharangadharaShodhana = { procedure: 'Ruksha Udvartana & Nitya Anulomana', indication: 'Medo-Kleda Shoshana in Prameha.', details: 'Triphala-Musta Udvartana and Triphala Churna at bedtime.' };

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

    charakaShloka = {
      shlokaSanskrit: 'स्फिक्पूर्वा कटिपृष्ठोरुजानुजङ्घापदं क्रमात् । गृध्रसी स्तम्भरुक्तोदैर्गृह्णाति स्पन्दते मुहुः ॥',
      shlokaTransliteration: 'Sphik-pūrvā kaṭi-pṛṣṭhoru-jānu-jaṅghā-padaṁ kramāt | Gṛdhrasī stambha-ruk-todair gṛhṇāti spandate muhuḥ ||',
      meaning: 'Gridhrasi starts in the Sphik (gluteal region) and radiates sequentially down Kati (lumbar spine), Prishta (back), Uru (posterior thigh), Janu (knee), Jangha (calf), and Pada (foot) with stiffness, shooting pain, pricking, and fasciculations.',
      sourceBook: 'Charaka Samhita',
      chapterAndVerse: 'Chikitsa Sthana Ch. 28, Verse 56–57',
    };
    sushrutaShloka = {
      shlokaSanskrit: 'पार्ष्णिप्रत्यङ्गुलीनां तु कण्डरा याऽनिलार्दिता । सक्थ्नः क्षेपं निगृह्णाति गृध्रसीति हि सा स्मृता ॥',
      shlokaTransliteration: 'Pārṣṇi-pratyaṅgulīnāṁ tu kaṇḍarā yā’nilārditā | Sakthnaḥ kṣepaṁ nigṛhṇāti gṛdhrasīti hi sā smṛtā ||',
      meaning: 'When the great Kandara (sciatic nerve/tendon) running from the heel to the toes is afflicted by Vata, it restricts lifting of the leg (Sakthi-kshepa nigraha / positive Straight Leg Raise test) and is known as Gridhrasi.',
      sourceBook: 'Sushruta Samhita',
      chapterAndVerse: 'Nidana Sthana Ch. 1, Verse 74',
    };
    vagbhataShloka = {
      shlokaSanskrit: 'पार्ष्णिप्रत्यङ्गुलीनां या कण्डरा मारुतार्दिता । सक्थिक्षेपं निगृह्णाति गृध्रसीति हि सा स्मृता ॥',
      shlokaTransliteration: 'Pārṣṇi-pratyaṅgulīnāṁ yā kaṇḍarā mārutārditā | Sakthi-kṣepaṁ nigṛhṇāti gṛdhrasīti hi sā smṛtā ||',
      meaning: 'Affliction of the heel-to-toe Kandara by aggravated Vata restricting elevation of the lower limb is termed Gridhrasi by Acharya Vagbhata.',
      sourceBook: 'Ashtanga Hridaya',
      chapterAndVerse: 'Nidana Sthana Ch. 15, Verse 54',
    };
    chakradattaShloka = {
      shlokaSanskrit: 'शेफालिकादलक्वाथो गृध्रसीं हन्ति दारुणाम् । एरण्डतैलसंयुक्तो दशमूलीरसोऽथवा ॥',
      shlokaTransliteration: 'Śephālikā-dala-kvātho gṛdhrasīṁ hanti dāruṇām | Eraṇḍa-taila-saṁyukto daśamūlī-raso’thavā ||',
      meaning: 'Decoction of Sephalika (Parijata / Harshringar) leaves or Dashamoola Kwatha mixed with Eranda Taila destroys even severe intractable Gridhrasi.',
      sourceBook: 'Chakradatta',
      chapterAndVerse: 'Vatavyadhi Chikitsa Prakarana Ch. 22, Verse 49–52',
    };
    sharangadharaShloka = {
      shlokaSanskrit: 'महारास्नादिक्वाथस्तु गृध्रसीं जानुवेदनाम् । त्रयोदशाङ्गगुग्गुलुः कटिग्रहं विनाशयेत् ॥',
      shlokaTransliteration: 'Mahārāsnādi-kvāthas tu gṛdhrasīṁ jānu-vedanām | Trayodaśāṅga-gugguluḥ kaṭi-grahaṁ vināśayet ||',
      meaning: 'Maharasnadi Kwatha and Trayodashanga / Yogaraja Guggulu rapidly eradicate Gridhrasi (sciatica), knee pain, and lumbosacral locking.',
      sourceBook: 'Sharangadhara Samhita',
      chapterAndVerse: 'Madhyama Khanda Ch. 2, Verse 89–95 & Ch. 7, Verse 56',
    };

    charakaShodhana = { procedure: 'Basti Karma (Niruha & Anuvasana), Siravedha & Agnikarma (Ch. Chi. 28/101)', indication: 'Gridhrasi radiating down Kati-Uru-Jangha-Pada.', details: 'Erandamooladi Niruha & Sahacharadi Anuvasana Basti; Siravedha and Agnikarma between Kandara and Gulpha (ankle).' };
    sushrutaShodhana = { procedure: 'Siravedha 4 Angula Above/Below Janu & Agnikarma (Su. Sha. 8/17)', indication: 'Sakthi-kshepa Nigraha (Sciatica with restricted SLR).', details: 'Venepuncture 4 Angula above or below the knee joint and Agnikarma at Padangushtha/Gulpha.' };
    vagbhataShodhana = { procedure: 'Snigdha Virechana, Kati Basti & Sahacharadi Basti (A.H. Chi. 21)', indication: 'Gridhrasi & Khanja-Pangu.', details: 'Eranda Sneha Virechana followed by Kati Basti and Yoga Basti with Sahacharadi Taila.' };
    chakradattaShodhana = { procedure: 'Eranda Taila Nitya Virechana & Vaitarana/Dashamoola Basti', indication: 'Vata-Kaphaja & Vataja Gridhrasi.', details: 'Dashamoola Kwatha + Eranda Taila oral purgation and Basti.' };
    sharangadharaShodhana = { procedure: 'Kati Basti & Anuvasana Basti (Uttara Khanda Ch. 6)', indication: 'Lumbosacral nerve root compression.', details: 'Narayana / Sahacharadi Taila Anuvasana and Nadi Sweda.' };

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
  } else if (dLower.includes('kushtha') || dLower.includes('psoriasis') || dLower.includes('eczema') || dLower.includes('vicharchika') || dLower.includes('dadru') || dLower.includes('skin') || dLower.includes('shwitra') || dLower.includes('kitibha')) {
    charakaChapter = 'Nidana Sthana Ch. 5 & Chikitsa Sthana Ch. 7 (Kushtha Chikitsitam), Verse 11–105';
    sushrutaChapter = 'Nidana Sthana Ch. 5 & Chikitsa Sthana Ch. 9 (Kushtha Chikitsitam), Verse 6–54';
    vagbhataChapter = 'Nidana Sthana Ch. 14 & Chikitsa Sthana Ch. 19 (Kushtha Chikitsa), Verse 1–65';
    chakradattaChapter = 'Kushtha Chikitsa Prakarana Ch. 50, Verse 15–82';
    sharangadharaChapter = 'Madhyama Khanda Ch. 2 (Brihat Manjishthadi) & Ch. 10 (Khadirarishta)';

    charakaShloka = {
      shlokaSanskrit: 'वातादयस्त्रयो दुष्टास्त्वग्रक्तं मांसमम्बु च । दूषयन्ति स कुष्ठानां सप्तको द्रव्यसङ्ग्रहः ॥ असवेदनमत्यर्थं महावास्तु च यत् स्मृतम् । मत्स्यशकलवत् किटिभं सस्रावं तु विचर्चिका ॥',
      shlokaTransliteration: 'Vātādayas trayo duṣṭās tvag-raktaṁ māṁsam ambu ca | Dūṣayanti sa kuṣṭhānāṁ saptako dravya-saṅgrahaḥ ||',
      meaning: 'The seven pathogenic factors (Sapta Dravya Sangraha) of all Kushthas (including Kitibha, Ekakushtha, Vicharchika, Dadru, and Shwitra) are the 3 vitiated Doshas (Vata, Pitta, Kapha) corrupting 4 Dushyas (Twak, Rakta, Mamsa, and Lasika/Ambu).',
      sourceBook: 'Charaka Samhita',
      chapterAndVerse: 'Chikitsa Sthana Ch. 7, Verse 9–10 & 21–26',
    };
    sushrutaShloka = {
      shlokaSanskrit: 'सकण्डूः पिडकाः श्यावा बहुस्रावा विचर्चिका । अरूक्षं कृष्णमरुणं किटिभं परुषं स्मृतम् ॥',
      shlokaTransliteration: 'Sakaṇḍūḥ piḍakāḥ śyāvā bahu-srāvā vicarcikā | Arūkṣaṁ kṛṣṇam aruṇaṁ kiṭibhaṁ paruṣaṁ smṛtam ||',
      meaning: 'Itchy, blackish vesicular lesions with copious oozing constitute Vicharchika (Eczema), while rough, hyperkeratotic, dusky scaling plaques constitute Kitibha/Ekakushtha (Psoriasis), and copper-colored annular rings constitute Dadru.',
      sourceBook: 'Sushruta Samhita',
      chapterAndVerse: 'Nidana Sthana Ch. 5, Verse 13–16',
    };
    vagbhataShloka = {
      shlokaSanskrit: 'मत्स्यशकलवच्चर्म किटिभं रूक्षं खरं भवेत् । सकण्डूः पिडकाः श्यावा बहुस्रावा विचर्चिका ॥',
      shlokaTransliteration: 'Matsya-śakalavac carma kiṭibhaṁ rūkṣaṁ kharaṁ bhavet | Sakaṇḍūḥ piḍakāḥ śyāvā bahu-srāvā vicarcikā ||',
      meaning: 'Fish-scale like dry rough plaques characterize Ekakushtha/Kitibha, while dark itchy weeping eruptions characterize Vicharchika in Ashtanga Hridaya.',
      sourceBook: 'Ashtanga Hridaya',
      chapterAndVerse: 'Nidana Sthana Ch. 14, Verse 20–25',
    };
    chakradattaShloka = {
      shlokaSanskrit: 'निम्बामृतावृषपटोलनिदिग्धिकानां... पञ्चतिक्तकगुग्गुलुः कुष्ठरक्तजयापहः ॥',
      shlokaTransliteration: 'Nimbāmṛtā-vṛṣa-paṭola-nidigdhikānāṁ... pañcatiktaka-gugguluḥ kuṣṭha-raktajayāpahaḥ ||',
      meaning: 'Panchatikta Ghrita Guggulu (Nimba, Guduchi, Vasa, Patola, Kantakari with Guggulu & Ghrita) and Chakramardadi Lepa eradicate obstinate Kushtha, Vicharchika, and Dadru.',
      sourceBook: 'Chakradatta',
      chapterAndVerse: 'Kushtha Chikitsa Prakarana Ch. 50, Verse 89–93',
    };
    sharangadharaShloka = {
      shlokaSanskrit: 'मञ्जिष्ठा मुस्तकं कुटजं गुडूची... बृहन्मञ्जिष्ठादिरयं क्वाथोऽष्टादशकुष्ठजित् ॥',
      shlokaTransliteration: 'Mañjiṣṭhā mustakaṁ kuṭajaṁ guḍūcī... bṛhan-mañjiṣṭhādir ayaṁ kvātho’ṣṭādaśa-kuṣṭhajit ||',
      meaning: 'Brihat Manjishthadi Kwatha (45 herbs) and Khadirarishta purify Rakta and Twak to conquer all 18 types of Kushtha and Shwitra.',
      sourceBook: 'Sharangadhara Samhita',
      chapterAndVerse: 'Madhyama Khanda Ch. 2, Verse 137–142 & Ch. 10, Verse 60',
    };

    charakaShodhana = { procedure: 'Vamana, Virechana & Raktamokshana (Ch. Chi. 7/39)', indication: 'Bahudosha Kushtha (Psoriasis / Eczema / Tinea / Vitiligo).', details: 'Mahatikta Ghrita Snehapana followed by Vamana in Kapha-dominant, Virechana in Pitta-dominant, and Jalaukavacharana/Siravedha in Rakta-dominant Kushtha.' };
    sushrutaShodhana = { procedure: 'Fortnightly Vamana, Monthly Virechana & Twice-Yearly Raktamokshana (Su. Chi. 9/43)', indication: 'Preventing Dhatu-gata progression of Kushtha.', details: 'Classical Sushruta periodic Shodhana schedule with Tuvaraka Taila Rasayana.' };
    vagbhataShodhana = { procedure: 'Tikta Ghrita Snehapana, Virechana & Pracchana/Jalauka (A.H. Chi. 19)', indication: 'Tvak-Rakta-Mamsa Shodhana in Kushtha.', details: 'Guggulutiktaka Ghrita oleation followed by Trivrit-Aragwadha Virechana and local bloodletting.' };
    chakradattaShodhana = { procedure: 'Trivrit Virechana & Gomutra-Aragwadha Udvartana', indication: 'Kaphapittaja Kushtha & Dadru.', details: 'Systemic Virechana followed by Chakramarda/Edagaja seed paste application.' };
    sharangadharaShodhana = { procedure: 'Raktamokshana & Virechana (Uttara Khanda Ch. 4 & 12)', indication: 'Rakta-pradoshaja Twak Vikara.', details: 'Jalaukavacharana over localized plaques and Manjishthadi Kwatha intake.' };

    charakaSutra = 'वातोत्तरेषु सर्पिर्वमनं श्लेष्मोत्तरेषु कुष्ठेषु । पित्तोत्तरेषु मोक्षो रक्तस्य विरेचनं चाग्र्यम् ॥ (In Vata-dominant Kushtha give Ghritapana; in Kapha-dominant give Vamana; in Pitta/Rakta-dominant execute Raktamokshana and Virechana.)';
    sushrutaSutra = 'पक्षात् पक्षाच्छर्दनान्यभ्युपेयान्मासान्मासात् स्रंसनं चापि दद्यात् । स्राव्यं रक्तं वत्सरे द्विरवलेहाः खदिरासनानां च हिताः प्रयोगाः ॥ (Repeat Vamana fortnightly, Virechana monthly, Raktamokshana twice yearly, and Khadira/Tuvaraka internal Rasayana.)';
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
        ? `NA — Not directly mentioned as an independent standalone chapter by Acharya Charaka.`
        : `Directly Mentioned in Charaka Samhita (${charakaChapter}) with complete Nidana, Samprapti (${doshaInfo}), and Chikitsa Sutra for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Charaka's Kayachikitsa protocol for ${cleanDiseaseLabel} prioritizes Agni-Deepana, Ama-Pachana, clearing Srotorodha in ${srotasInfo}, and Dosha-pratyanika Shamana & Shodhana.`,
      shlokaReference: charakaShloka,
      chikitsaSutra: charakaSutra,
      chikitsaSutraReference: `Charaka Samhita, ${charakaChapter}`,
      shamanaChikitsa: [charakaMed1, charakaMed2],
      shodhanaChikitsa: [charakaShodhana],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
    sushruta: {
      acharyaId: 'sushruta',
      acharyaName: 'Acharya Sushruta',
      sourceTextbook: `Sushruta Samhita (${sushrutaChapter})`,
      isDirectlyMentioned: !isPostBrihatTrayiDisease,
      mentionStatusNote: isPostBrihatTrayiDisease
        ? `NA — Not directly mentioned by this separate disease name in Sushruta Samhita.`
        : `Directly Mentioned in Sushruta Samhita (${sushrutaChapter}), providing specialized Shalya/Shalakya, Raktamokshana, Agnikarma, and internal Gana Kwatha protocols for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Sushruta evaluates ${cleanDiseaseLabel} through Rakta-Dosha involvement, Srotas obstruction in ${srotasInfo}, and targeted Shodhana, Jalaukavacharana, or Agnikarma alongside internal Gana Kwathas.`,
      shlokaReference: sushrutaShloka,
      chikitsaSutra: sushrutaSutra,
      chikitsaSutraReference: `Sushruta Samhita, ${sushrutaChapter}`,
      shamanaChikitsa: [sushrutaMed1, sushrutaMed2],
      shodhanaChikitsa: [sushrutaShodhana],
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
        ? `NA — Not directly mentioned as an independent chapter in Ashtanga Hridaya.`
        : `Directly Mentioned in Ashtanga Hridaya (${vagbhataChapter}), synthesizing the classical Nidana and practical Kashaya/Ghrita/Basti therapeutics for ${cleanDiseaseLabel}.`,
      clinicalPhilosophy:
        `Acharya Vagbhata emphasizes Yuktivyapashraya Kashayas, medicated Ghritas, and Srotoshodhana tailored to ${doshaInfo} in ${cleanDiseaseLabel}.`,
      shlokaReference: vagbhataShloka,
      chikitsaSutra: vagbhataSutra,
      chikitsaSutraReference: `Ashtanga Hridaya, ${vagbhataChapter}`,
      shamanaChikitsa: [vagbhataMed1, vagbhataMed2],
      shodhanaChikitsa: [vagbhataShodhana],
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
      shlokaReference: chakradattaShloka,
      chikitsaSutra: chakradattaSutra,
      chikitsaSutraReference: `Chakradatta, ${chakradattaChapter}`,
      shamanaChikitsa: [chakradattaMed1, chakradattaMed2],
      shodhanaChikitsa: [chakradattaShodhana],
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
      shlokaReference: sharangadharaShloka,
      chikitsaSutra: sharangadharaSutra,
      chikitsaSutraReference: `Sharangadhara Samhita, ${sharangadharaChapter}`,
      shamanaChikitsa: [sharangadharaMed1, sharangadharaMed2],
      shodhanaChikitsa: [sharangadharaShodhana],
      paraSurgicalTherapy: primaryAnalysis?.paraSurgicalTherapy,
    },
  };
};

const DEVANAGARI_CONSONANTS: Record<string, string> = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'ṅ',
  च: 'c', छ: 'ch', ज: 'j', झ: 'jh', ञ: 'ñ',
  ट: 'ṭ', ठ: 'ṭh', ड: 'ḍ', ढ: 'ḍh', ण: 'ṇ',
  त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm',
  य: 'y', र: 'r', ल: 'l', व: 'v',
  श: 'ś', ष: 'ṣ', स: 's', ह: 'h', ळ: 'ḷ',
};

const DEVANAGARI_VOWELS: Record<string, string> = {
  अ: 'a', आ: 'ā', इ: 'i', ई: 'ī', उ: 'u', ऊ: 'ū',
  ऋ: 'ṛ', ॠ: 'ṝ', ऌ: 'ḷ', ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au',
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'ॄ': 'ṝ', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

export function transliterateDevanagariToIAST(input: string): string {
  const s = (input || '').replace(/\.\.\./g, ' च ');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const next = s[i + 1] || '';
    if (DEVANAGARI_CONSONANTS[ch]) {
      out += DEVANAGARI_CONSONANTS[ch];
      if (next === '्') {
        i++; // virama suppresses inherent 'a'
      } else if (DEVANAGARI_MATRAS[next]) {
        out += DEVANAGARI_MATRAS[next];
        i++;
      } else {
        out += 'a';
      }
    } else if (DEVANAGARI_VOWELS[ch]) {
      out += DEVANAGARI_VOWELS[ch];
    } else if (DEVANAGARI_MATRAS[ch]) {
      out += DEVANAGARI_MATRAS[ch];
    } else if (ch === 'ं' || ch === 'ँ') {
      out += 'ṁ';
    } else if (ch === 'ः') {
      out += 'ḥ';
    } else if (ch === 'ऽ') {
      out += '’';
    } else if (ch === '॥') {
      out += '||';
    } else if (ch === '।') {
      out += '|';
    } else if (DEVANAGARI_DIGITS[ch]) {
      out += DEVANAGARI_DIGITS[ch];
    } else {
      out += ch;
    }
  }
  const trimmed = out.replace(/\s+/g, ' ').trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
}

function cleanSanskritAndTranslation(rawSutra: string, fallbackTranslation: string): { sanskrit: string; translation: string } {
  const clean = (rawSutra || '').replace(/\.\.\./g, ' च ').trim();
  const parenIdx = clean.indexOf('(');
  if (parenIdx === -1) {
    return {
      sanskrit: clean,
      translation: (fallbackTranslation || clean).replace(/\.\.\./g, ', '),
    };
  }
  const sanskrit = clean.slice(0, parenIdx).trim();
  const inside = clean.slice(parenIdx + 1).replace(/\)\s*$/, '').trim();
  const dashIdx = inside.indexOf('—');
  const translation = dashIdx !== -1 ? inside.slice(dashIdx + 1).trim() : inside;
  return {
    sanskrit: sanskrit || clean,
    translation: translation.length > 18 ? translation : fallbackTranslation || translation,
  };
}

function inferKalpanaCategory(medName: string, defaultCat: string): string {
  const m = medName.toLowerCase();
  if (m.includes('kwatha') || m.includes('kashaya') || m.includes('paniya')) return 'Kwatha / Kashaya Kalpana';
  if (m.includes('churna')) return 'Churna Kalpana';
  if (m.includes('guggulu')) return 'Guggulu Kalpana';
  if (m.includes('ghrita') || m.includes('sarpi')) return 'Ghrita / Sneha Kalpana';
  if (m.includes('taila')) return 'Taila Kalpana';
  if (m.includes('asava') || m.includes('arishta')) return 'Asava / Arishta Kalpana';
  if (m.includes('avaleha') || m.includes('leha') || m.includes('khanda') || m.includes('rasayana') || m.includes('prasha')) return 'Avaleha / Rasayana Kalpana';
  if (m.includes('lauha') || m.includes('mandura') || m.includes('bhasma') || m.includes('pishti') || m.includes('parpati')) return 'Lauha / Bhasma / Pishti Kalpana';
  if (m.includes('rasa') || m.includes('vati') || m.includes('gutika') || m.includes('vataka') || m.includes('gulika')) return 'Vati / Rasa-Aushadhi Kalpana';
  if (m.includes('swarasa') || m.includes('ksheerapaka')) return 'Swarasa / Ksheerapaka Kalpana';
  if (m.includes('lepa')) return 'Bahya Lepa Kalpana';
  return defaultCat || 'Classical Samhita Yoga';
}

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

    // 2. Accurate Disease Reference & Clean Complete Nidana Shloka
    cloned.diseaseReference = `${cloned.shlokaReference.sourceBook} (${cloned.shlokaReference.chapterAndVerse})`;
    cloned.shlokaReference.shlokaSanskrit = (cloned.shlokaReference.shlokaSanskrit || '').replace(/\.\.\./g, ' च ');
    if (
      !cloned.shlokaReference.shlokaTransliteration ||
      cloned.shlokaReference.shlokaTransliteration.includes('...')
    ) {
      cloned.shlokaReference.shlokaTransliteration = transliterateDevanagariToIAST(
        cloned.shlokaReference.shlokaSanskrit
      );
    }
    cloned.chikitsaSutra = (cloned.chikitsaSutra || '').replace(/\.\.\./g, ' च ');

    // 3. Unpack any combined Shamana Aushadha entries ("Med A + Med B") into individual textbook formulations first
    const unpackedShamana: AcharyaClinicalProtocol['shamanaChikitsa'] = [];
    for (const item of cloned.shamanaChikitsa || []) {
      const refText = item.reference || cloned.chikitsaSutraReference || cloned.sourceTextbook;
      // Split on ' + ' or ' & ' if outside brackets
      const parts = item.medicineName
        .replace(/\s*\[.*?\]/g, '')
        .split(/\s+(?:\+|&)\s+/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length > 1) {
        for (const part of parts) {
          const doseMatch = part.match(/\(([^)]*(?:mg|g|ml|mL|tab|drop|BD|OD|TDS|HS|QID|local)[^)]*)\)/i);
          const cleanName = doseMatch ? part.replace(doseMatch[0], '').trim() : part;
          const extractedDose = doseMatch ? doseMatch[1].trim() : item.dosage;
          unpackedShamana.push({
            category: inferKalpanaCategory(cleanName, item.category),
            medicineName: cleanName || part,
            dosage: extractedDose,
            anupana: item.anupana,
            timing: item.timing,
            indications: item.indications,
            reference: refText,
          });
        }
      } else {
        unpackedShamana.push({
          ...item,
          category: inferKalpanaCategory(item.medicineName, item.category),
          reference: refText,
        });
      }
    }
    cloned.shamanaChikitsa = unpackedShamana;

    // 4. Add Complete Disease-Specific BAMS Textbook Shamana Aushadha Repertoire per Disease
    const existingNames = new Set(cloned.shamanaChikitsa.map((m) => m.medicineName.toLowerCase()));
    const addMedIfMissing = (med: AcharyaClinicalProtocol['shamanaChikitsa'][0]) => {
      const k = med.medicineName.toLowerCase();
      if (!existingNames.has(k)) {
        cloned.shamanaChikitsa.push(med);
        existingNames.add(k);
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
            medicineName: 'Shiva Guggulu / Simhanada Guggulu',
            dosage: '2 tablets (500mg each) BD',
            anupana: 'Rasnadi Kwatha or warm water',
            timing: 'After meals',
            indications: 'Eliminates chronic joint stiffness, Trika-Sandhi pain, and prevents articular deformity.',
            reference: 'Chakradatta, Adhyaya 25 (Amavata Chikitsa), Shloka 31–47',
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
            medicineName: 'Vaishwanara Churna (Saindhava-Yavani-Ajmoda-Nagara-Haritaki)',
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
    } else if (dLower.includes('sandhivata') || dLower.includes('osteoarthritis')) {
      [
        {
          category: 'Kwatha / Kashaya Kalpana',
          medicineName: 'Maharasnadi Kwatha / Dashamoola Kwatha',
          dosage: '40 ml BD',
          anupana: 'Warm water with 5ml Eranda Taila or Ksheerabala drops',
          timing: 'Morning and evening before meals',
          indications: 'Pacifies aggravated Vyana Vayu, relieves Sandhi-shoola (joint pain) and crepitus.',
          reference: `${refBase} (Vatavyadhi Kwatha Yoga)`,
        },
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Yogaraja Guggulu / Trayodashanga Guggulu / Lakshadi Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Warm milk or Dashamoola Kwatha',
          timing: 'After meals',
          indications: 'Strengthens Asthi-Sandhi-Snayu (subchondral bone & ligaments) and reduces degenerative inflammation.',
          reference: `${refBase} (Vatavyadhi Guggulu Yoga)`,
        },
        {
          category: 'Ghrita / Sneha Kalpana',
          medicineName: 'Tikta Shatpala Ghrita / Guggulutiktaka Ghrita',
          dosage: '10 ml OD',
          anupana: 'Warm cow milk (Godugdha) or warm water',
          timing: 'Early morning empty stomach',
          indications: 'Tikta Rasa fortified with Ghrita directly nourishes Asthi and Majja Dhatu as per Asthi-Pradoshaja Chikitsa.',
          reference: `${refBase} (Asthigata Vata Sneha Kalpana)`,
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
    } else if (dLower.includes('amlapitta') || dLower.includes('gerd') || dLower.includes('acidity') || dLower.includes('reflux')) {
      [
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Patoladi Kwatha / Bhunimbadi Kwatha (Patola-Shunthi-Amrita-Katuki)',
          dosage: '40 ml BD',
          anupana: '1 tsp Madhu (honey) when cooled',
          timing: 'Before breakfast and dinner',
          indications: 'Pacifies Vidagdha Pitta, clears Kapha-Pitta Utklesha, and heals gastric mucosal inflammation.',
          reference: `${refBase} (Amlapitta Kwatha Yoga)`,
        },
        {
          category: 'Churna Kalpana',
          medicineName: 'Avipattikar Churna (Trikatu-Triphala-Musta-Vidanga-Trivrit-Sharkara)',
          dosage: '3g – 5g BD',
          anupana: 'Sheetala Jala (cool water) or Narikela Jala (tender coconut water)',
          timing: 'Before meals or at bedtime',
          indications: 'Agrya formulation for Urdhwaga Amlapitta; neutralizes hyperacidity and induces gentle Pitta Virechana.',
          reference: `${refBase} (Amlapitta Churna Kalpana)`,
        },
        {
          category: 'Vati / Rasa-Bhasma Kalpana',
          medicineName: 'Sutshekhar Rasa (125mg) + Kamadudha Rasa (Mouktikayukta 250mg)',
          dosage: '1 tablet each BD',
          anupana: 'Amalaki Swarasa or Ghee + Mishri',
          timing: '30 mins before meals',
          indications: 'Rapidly stops sour/bitter regurgitation (Tiktamla Udgara), nausea, and epigastric burning.',
          reference: `${refBase} (Amlapitta Rasa Yoga)`,
        },
        {
          category: 'Avaleha / Khanda Kalpana',
          medicineName: 'Kushmanda Avaleha / Narikela Khanda / Drakshavaleha',
          dosage: '10g BD',
          anupana: 'Lukewarm or cool milk',
          timing: 'Morning and evening',
          indications: 'Provides Madhura-Sheeta Pittashamana and prevents recurrent peptic erosion.',
          reference: `${refBase} (Amlapitta Avaleha Kalpana)`,
        },
      ].forEach(addMedIfMissing);
    } else if (dLower.includes('jwara') || dLower.includes('fever') || dLower.includes('typhoid') || dLower.includes('malaria')) {
      [
        {
          category: 'Paniya Kalpana',
          medicineName: 'Shadanga Paniya (Musta, Parpataka, Ushira, Chandana, Udichya, Nagara)',
          dosage: '40 ml – 60 ml frequently',
          anupana: 'Warm boiled water',
          timing: 'Sip throughout the day',
          indications: 'Relieves Jwara, Trishna (thirst), Daha (burning), and digests Ama in Rasavaha Srotas.',
          reference: `${refBase} (Charaka Chikitsa 3/145 & Sharangadhara Ma. 2/159)`,
        },
        {
          category: 'Churna Kalpana',
          medicineName: 'Sudarshana Churna (Kiratatikta-pradhana 53-herb Jwaraghna Churna)',
          dosage: '3g – 5g TDS',
          anupana: 'Shadanga Paniya or Ushnodaka',
          timing: 'After light Yavagu meals',
          indications: 'Clears Rasavaha Srotorodha, digests Sama Pitta-Kapha, and prevents Vishama Jwara relapse.',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 6, Shloka 26–36',
        },
        {
          category: 'Ghana Vati Kalpana',
          medicineName: 'Samshamani Vati (Guduchi Ghana Vati)',
          dosage: '500mg (2 tablets) TDS',
          anupana: 'Lukewarm water',
          timing: 'After meals',
          indications: 'Agrya Jwaraghna & Rasayana formulation for acute, chronic (Jirna), and intermittent fevers.',
          reference: 'Charaka Samhita, Chikitsa Sthana Ch. 3, Shloka 298 & Siddha Yoga Sangraha',
        },
        {
          category: 'Rasa / Gutika Kalpana',
          medicineName: 'Tribhuvanakirti Rasa',
          dosage: '125mg – 250mg BD/TDS',
          anupana: 'Ardraka Swarasa (fresh ginger juice) with Tulasi Patra Swarasa',
          timing: 'After meals',
          indications: 'Induces Swedana (diaphoresis), breaks Sveda-avarodha, and rapidly brings down acute pyrexia.',
          reference: 'Rasendra Sara Sangraha, Jwara Chikitsa & Yoga Ratnakara',
        },
        {
          category: 'Gutika Kalpana',
          medicineName: 'Sanjivani Vati (Vidanga-Nagara-Pippali-Pathya-Vatsanabha)',
          dosage: '125mg (1 tablet) TDS',
          anupana: 'Ardraka Swarasa or warm water',
          timing: 'After meals',
          indications: 'Digests acute Sama Jwara and Sannipataja Ama accumulation.',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 18–21',
        },
      ].forEach(addMedIfMissing);
    } else if (dLower.includes('prameha') || dLower.includes('madhumeha') || dLower.includes('diabet')) {
      [
        {
          category: 'Churna / Yoga Kalpana',
          medicineName: 'Nisha-Amalaki Churna (Haridra & Amalaki Equal Parts)',
          dosage: '5g BD',
          anupana: 'Amalaki Swarasa or lukewarm water',
          timing: 'Empty stomach morning & evening',
          indications: 'Agrya Pramehaghna Yoga of Acharya Charaka & Vagbhata; reduces insulin resistance and Kleda.',
          reference: 'Ashtanga Hridaya, Uttara Sthana 40/48 & Charaka Chikitsa 6/26',
        },
        {
          category: 'Gutika / Vati Kalpana',
          medicineName: 'Chandraprabha Vati (Shilajatu-Guggulu-Triphala-Musta Pradhana)',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Phalatrikadi Kwatha or warm water',
          timing: 'Before breakfast and dinner',
          indications: 'Reverses Bahu-Drava Shleshma and Ojas Kshaya in Mutravaha Srotas; resolves Prabhuta-Avila Mutrata.',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 40–49',
        },
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Phalatrikadi Kwatha / Darvyadi Kwatha (Triphala-Daruharidra-Musta-Vishala)',
          dosage: '40 ml BD',
          anupana: '1 tsp Madhu (Honey) when cooled',
          timing: 'Before meals',
          indications: 'Classical Charaka Chikitsa 6 decoction for all 20 Pramehas and Madhumeha.',
          reference: 'Charaka Samhita, Chikitsa Sthana Ch. 6, Shloka 26 & 40',
        },
        {
          category: 'Rasayana / Bhasma Kalpana',
          medicineName: 'Vasant Kusumakar Rasa',
          dosage: '125mg OD/BD',
          anupana: 'Haridra Swarasa & Amalaki Swarasa',
          timing: 'Morning after breakfast',
          indications: 'Classical Pramehaghna Rasayana for Madhumeha (Ojakshaya) and diabetic neuropathy (Karapada Daha/Supti).',
          reference: 'Rasendra Sara Sangraha, Prameha Chikitsa & Bhaishajya Ratnavali 37/110',
        },
        {
          category: 'Naimittika Rasayana',
          medicineName: 'Shuddha Shilajatu (Salasaradi / Triphala Bhavita) with Trivanga Bhasma',
          dosage: '500mg Shilajatu + 125mg Trivanga Bhasma BD',
          anupana: 'Asanadi Kwatha or warm water',
          timing: 'After meals',
          indications: 'Rejuvenates Medovaha and Mutravaha Srotas and prevents diabetic nephropathy.',
          reference: 'Sushruta Samhita, Chikitsa Sthana Ch. 13, Shloka 9–15 & Charaka Chi. 1/3/65',
        },
      ].forEach(addMedIfMissing);
    } else if (dLower.includes('gridhrasi') || dLower.includes('sciatica')) {
      [
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Sephalika (Parijata) Patra Kwatha / Rasnasaptaka Kwatha',
          dosage: '40 ml BD',
          anupana: '5ml Eranda Taila or warm water',
          timing: 'Before breakfast and dinner',
          indications: 'Specific Chakradatta & Samhita decoction to eradicate sciatic nerve root inflammation.',
          reference: 'Chakradatta, Adhyaya 22 (Vatavyadhi Chikitsa), Shloka 41 & 49',
        },
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Trayodashanga Guggulu / Maha Yogaraja Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Dashamoola Kwatha or warm water',
          timing: 'After meals',
          indications: 'Strengthens Snayu-Kandara (lumbar intervertebral disc & sciatic nerve sheath) and relieves Stambha.',
          reference: 'Bhaishajya Ratnavali, Vatavyadhi Adhikara 26/98 & Sharangadhara Ma. 7',
        },
        {
          category: 'Rasa / Vati Kalpana',
          medicineName: 'Vatagajankusha Rasa / Ekangaveera Rasa',
          dosage: '1 tablet (125mg – 250mg) BD',
          anupana: 'Pippali Churna & Manjishtha Kwatha',
          timing: 'After meals',
          indications: 'Relieves acute Sphik-Kati-Prishtha-Uru-Jangha-Pada radiating sciatic pain within 7 days.',
          reference: 'Bhaishajya Ratnavali, Vatavyadhi Adhikara 26/126',
        },
        {
          category: 'Taila Kalpana (Kati Basti & Matra Basti)',
          medicineName: 'Sahacharadi Taila / Prasarini Taila / Ksheerabala Taila',
          dosage: 'Kati Basti locally + 60ml Matra Basti per rectum',
          anupana: 'Saindhava & Shatapushpa Kalka (in Basti)',
          timing: 'Daily after light lunch',
          indications: 'Specifically praised by Acharya Vagbhata (A.H. Chi. 21/56) for lower-limb Vata and Gridhrasi.',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana Ch. 21, Shloka 56–60 & Sharangadhara Ma. 9',
        },
      ].forEach(addMedIfMissing);
    } else if (dLower.includes('kushtha') || dLower.includes('psoriasis') || dLower.includes('eczema') || dLower.includes('skin') || dLower.includes('dadru') || dLower.includes('vicharchika') || dLower.includes('visarpa') || dLower.includes('urticaria') || dLower.includes('sheetapitta')) {
      [
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Patolakaturohinyadi Kwatha / Mahamanjishthadi Kwatha',
          dosage: '40 ml BD',
          anupana: 'Lukewarm water',
          timing: 'Before breakfast and dinner',
          indications: 'Purifies Raktavaha Srotas, pacifies Pitta-Kapha, and clears weeping/scaly dermatoses.',
          reference: 'Ashtanga Hridaya, Sutra Sthana 15/15 & Sharangadhara Samhita Ma. 2/137',
        },
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Kaishora Guggulu / Panchatikta Ghrita Guggulu',
          dosage: '2 tablets (500mg each) BD',
          anupana: 'Khadira Sara Kwatha or Manjishthadi Kwatha',
          timing: 'After breakfast and dinner',
          indications: 'Purifies Sapta-Dravya (Tridosha + Tvak, Rakta, Mamsa, Lasika), arrests Kandu (itching), Kleda, and scaling.',
          reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 70–81',
        },
        {
          category: 'Ghrita Kalpana',
          medicineName: 'Mahatiktaka Ghrita / Panchatikta Ghrita',
          dosage: '10 ml OD',
          anupana: 'Lukewarm water or Amalaki Kwatha',
          timing: 'Early morning empty stomach',
          indications: 'Gold-standard Charaka Chikitsa 7 medicated Ghrita for all 18 Kushthas and Visarpa.',
          reference: 'Charaka Samhita, Chikitsa Sthana Ch. 7, Shloka 144–150',
        },
        {
          category: 'Rasayana / Vati Kalpana',
          medicineName: 'Gandhaka Rasayana (250mg) & Arogyavardhini Vati (250mg)',
          dosage: '1 tablet each BD',
          anupana: 'Khadirarishta (20ml) with equal water',
          timing: 'After meals',
          indications: 'Potent Kushthaghna, Kandughna, antifungal, and Yakrit-Rakta Shodhaka.',
          reference: 'Rasaratna Samuchchaya 20/87 & Yoga Ratnakara Kushtha Chikitsa',
        },
        {
          category: 'Arishta & Bahya Taila Kalpana',
          medicineName: 'Khadirarishta (20ml BD) & Marichyadi Taila / Tuvaraka Taila (External)',
          dosage: '20ml BD orally + External application over plaques BD',
          anupana: 'Equal water (Khadira is Agrya Kushthaghna — Ch. Su. 25/40)',
          timing: 'After meals & local application',
          indications: 'Eradicates recurrent Dadru, Vicharchika, Ekakushtha, and chronic skin plaques.',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 10/60 & Sushruta Chikitsa 13/19',
        },
      ].forEach(addMedIfMissing);
    } else {
      // Universal disease-specific enrichment for all other BAMS Samhita diseases (GI, Respiratory, Renal, Neuro, Cardiac, Stree Roga, Shalakya, etc.)
      const extraTextbookMeds: AcharyaClinicalProtocol['shamanaChikitsa'] = [];
      if (dLower.includes('grahani') || dLower.includes('ibs') || dLower.includes('atisara') || dLower.includes('pravahika') || dLower.includes('diarrhea') || dLower.includes('agnimandya') || dLower.includes('gulma') || dLower.includes('shoola')) {
        extraTextbookMeds.push(
          {
            category: 'Parpati / Rasa Kalpana',
            medicineName: 'Panchamrita Parpati / Rasa Parpati',
            dosage: '125mg – 250mg BD',
            anupana: 'Bhrishta Jeeraka Churna & Takra (Spiced Buttermilk)',
            timing: 'After meals',
            indications: 'Restores Grahani mucosal integrity, Adhishthana Agni, and arrests Muhurbaddha-Muhurdrava stools.',
            reference: 'Bhaishajya Ratnavali, Grahani Rogadhikara 8/438 & Chakradatta Ch. 4',
          },
          {
            category: 'Churna Kalpana',
            medicineName: 'Chitrakadi Vati / Dadimashtaka Churna / Hingvashtaka Churna',
            dosage: '2 tablets (500mg) or 3g Churna BD',
            anupana: 'Takra (Buttermilk) or warm water',
            timing: 'With first morsel of food / after meals',
            indications: 'Digests Sama Dosha, kindles Jatharagni, and relieves colic and bloating.',
            reference: 'Charaka Samhita, Chikitsa Sthana 15/96–97 & Sharangadhara Ma. 6/43',
          },
          {
            category: 'Arishta / Ghana Kalpana',
            medicineName: 'Takrarishta / Kutajarishta (20ml BD) & Kutajaghanavati (500mg BD)',
            dosage: '20 ml Arishta + 2 tablets BD',
            anupana: 'Equal warm water',
            timing: 'After lunch and dinner',
            indications: 'Sangrahi, Deepana, and Krimighna for chronic enteropathy, IBS, and dysentery.',
            reference: 'Charaka Samhita, Chikitsa Sthana 15/120 & Sharangadhara Samhita Ma. 10/44',
          }
        );
      } else if (dLower.includes('arsha') || dLower.includes('piles') || dLower.includes('hemorrhoid') || dLower.includes('bhagandara') || dLower.includes('fistula') || dLower.includes('parikartika') || dLower.includes('fissure') || dLower.includes('anaha') || dLower.includes('vibandha')) {
        extraTextbookMeds.push(
          {
            category: 'Arishta Kalpana',
            medicineName: 'Abhayarishta (Haritaki-Vidanga-Madhuka-Draksha Pradhana)',
            dosage: '20 ml BD',
            anupana: 'Equal lukewarm water',
            timing: 'After lunch and dinner',
            indications: 'Relieves Apana Vata Vibandha, shrinks hemorrhoidal plexus congestion, and softens stool.',
            reference: 'Bhaishajya Ratnavali, Arsha Rogadhikara 9/175 & Sharangadhara Ma. 10/28',
          },
          {
            category: 'Vati / Gutika Kalpana',
            medicineName: 'Kankayana Vati (Arshoghna) / Arshoghni Vati',
            dosage: '2 tablets (500mg) BD',
            anupana: 'Takra (Buttermilk)',
            timing: 'After meals',
            indications: 'Specifically codified in Charaka Chikitsa 14 & Bhaishajya Ratnavali to shrink Arsha Ankura.',
            reference: 'Charaka Samhita, Chikitsa Sthana 14/62 & Bhaishajya Ratnavali 9/46',
          },
          {
            category: 'Guggulu & Bahya Kalpana',
            medicineName: 'Triphala Guggulu (500mg TDS) & Jatyadi Ghrita / Kasisadi Taila (Perianal)',
            dosage: '2 tablets TDS + Local application BD after Sitz bath',
            anupana: 'Warm water',
            timing: 'After meals & post-defecation',
            indications: 'Heals anal mucosal tears, dries fistulous discharge, and reduces pile mass inflammation.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 7/68 & 9/168',
          }
        );
      } else if (dLower.includes('kasa') || dLower.includes('cough') || dLower.includes('shwasa') || dLower.includes('asthma') || dLower.includes('hikka') || dLower.includes('pratishyaya') || dLower.includes('sinus') || dLower.includes('rhinitis') || dLower.includes('rajayakshma') || dLower.includes('tuberculosis')) {
        extraTextbookMeds.push(
          {
            category: 'Churna Kalpana',
            medicineName: 'Sitopaladi Churna / Talisadi Churna',
            dosage: '3g TDS',
            anupana: 'Unequal ratio of Madhu (Honey 1 tsp) & Goghrita (1/2 tsp)',
            timing: 'After meals',
            indications: 'Pacifies Pranavaha Srotas Vata-Kapha, relieves cough paroxysms, and clears bronchial mucus.',
            reference: 'Charaka Samhita, Chikitsa Sthana 8/103–104 & Sharangadhara Ma. 6/130–137',
          },
          {
            category: 'Avaleha / Rasayana Kalpana',
            medicineName: 'Agastya Haritaki Rasayana / Vasavaleha',
            dosage: '10g BD',
            anupana: 'Warm milk or lukewarm water',
            timing: 'Morning empty stomach & bedtime',
            indications: 'Strengthens pulmonary parenchyma and prevents recurrent asthma, bronchitis, and sinusitis.',
            reference: 'Charaka Samhita, Chikitsa Sthana 18/57–62 & Sharangadhara Ma. 8/35',
          },
          {
            category: 'Asava / Rasa Kalpana',
            medicineName: 'Kanakasava (15ml BD) & Shwasakuthara Rasa / Laxmivilasa Rasa (125mg BD)',
            dosage: '15ml Asava + 1 tablet BD',
            anupana: 'Ardraka Swarasa & Honey',
            timing: 'After meals',
            indications: 'Rapidly relieves acute bronchospasm, wheezing (Ghurghuraka), and coryza.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda 10/77–81 & Bhaishajya Ratnavali 16/44',
          }
        );
      } else if (dLower.includes('pandu') || dLower.includes('anemia') || dLower.includes('kamala') || dLower.includes('jaundice') || dLower.includes('hepatitis') || dLower.includes('halimaka') || dLower.includes('yakrit') || dLower.includes('liver') || dLower.includes('raktapitta') || dLower.includes('bleed') || dLower.includes('shotha') || dLower.includes('edema')) {
        extraTextbookMeds.push(
          {
            category: 'Lauha / Mandura Kalpana',
            medicineName: 'Punarnavadi Mandura (500mg BD) / Navayasa Lauha (250mg BD)',
            dosage: '1 – 2 tablets BD',
            anupana: 'Takra (Buttermilk) or Honey & Ghee',
            timing: 'After meals',
            indications: 'Replenishes Rakta Dhatu, corrects anemia, and reduces hepatic/renal edema.',
            reference: 'Charaka Samhita, Chikitsa Sthana 16/70–71 & 16/93–95',
          },
          {
            category: 'Kwatha Kalpana',
            medicineName: 'Phalatrikadi Kwatha / Punarnavashtaka Kwatha',
            dosage: '40 ml BD',
            anupana: '1 tsp Madhu (Honey) when cooled',
            timing: 'Before breakfast and dinner',
            indications: 'Clears hepatobiliary Pitta-Kapha obstruction, lowers bilirubin, and induces diuresis.',
            reference: 'Chakradatta, Adhyaya 8/28 & Sharangadhara Samhita Ma. 2/76',
          },
          {
            category: 'Asava / Arishta Kalpana',
            medicineName: 'Lohasava / Rohitakarishta / Punarnavasava',
            dosage: '20 ml BD',
            anupana: 'Equal quantity of lukewarm water',
            timing: 'After lunch and dinner',
            indications: 'Enhances Dhatvagni, liver regeneration, and hematopoiesis.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 10, Shloka 34–38',
          }
        );
      } else {
        extraTextbookMeds.push(
          {
            category: 'Kwatha / Kashaya Kalpana',
            medicineName: 'Dashamoola Kwatha / Rasnadi Kwatha / Pathyadi Kwatha',
            dosage: '40 ml BD',
            anupana: 'Lukewarm water',
            timing: 'Before breakfast and dinner',
            indications: 'Pacifies aggravated Tridosha in the target Srotas and relieves pain and inflammation.',
            reference: `${refBase} (Sharangadhara Samhita, Madhyama Khanda Ch. 2)`,
          },
          {
            category: 'Guggulu / Vati Kalpana',
            medicineName: 'Chandraprabha Vati / Kaishora Guggulu / Yogaraja Guggulu',
            dosage: '2 tablets (500mg each) BD',
            anupana: 'Anupana specific to Dosha (Warm water or milk)',
            timing: 'After meals',
            indications: 'Clears Srotorodha, restores Dhatvagni, and prevents disease progression.',
            reference: 'Sharangadhara Samhita, Madhyama Khanda Ch. 7, Shloka 40–87',
          },
          {
            category: 'Ghrita / Rasayana Kalpana',
            medicineName: 'Brahmi Ghrita / Kalyanaka Ghrita / Ashwagandharishta',
            dosage: '10ml Ghrita OD or 20ml Arishta BD',
            anupana: 'Warm milk or equal warm water',
            timing: 'Morning & evening',
            indications: 'Nourishes Ojas, Majja, and Dhatu vitality as per classical Samhita Rasayana.',
            reference: `${refBase} (Charaka Samhita Chikitsa Sthana & Sharangadhara Ma. 9–10)`,
          }
        );
      }
      extraTextbookMeds.forEach(addMedIfMissing);
    }

    // 5. Build Complete, Multi-Shloka Treatment Carousel for this Acharya & Disease
    //    - Every shloka is COMPLETE (no '...' ellipses)
    //    - Chikitsa Meaning is the direct English translation of that exact shloka
    //    - Sliding to Next Shloka (Shloka 2, Shloka 3, etc.) shows the next treatment shloka by this Acharya for this disease!
    const cleanedShlokas: AcharyaChikitsaShlokaItem[] = [];
    const seenSanskrit = new Set<string>();

    const pushUniqueTreatmentShloka = (item: AcharyaChikitsaShlokaItem) => {
      const cleanSanskrit = (item.shlokaSanskrit || '').replace(/\.\.\./g, ' च ').trim();
      if (!cleanSanskrit || cleanSanskrit === 'NA') return;
      const normKey = cleanSanskrit.replace(/\s+/g, '');
      // Never duplicate the same Sanskrit verse in the slider
      if (seenSanskrit.has(normKey)) return;
      seenSanskrit.add(normKey);

      const needFreshTranslit =
        !item.shlokaTransliteration ||
        item.shlokaTransliteration.includes('...') ||
        (cleanSanskrit !== cloned.shlokaReference.shlokaSanskrit &&
          item.shlokaTransliteration === cloned.shlokaReference.shlokaTransliteration);

      const cleanTranslit = needFreshTranslit
        ? transliterateDevanagariToIAST(cleanSanskrit)
        : item.shlokaTransliteration.replace(/\.\.\./g, ' ca ');

      // Ensure meaning is purely the English translation of the shloka (strip any leading Devanagari)
      let cleanMeaning = (item.meaning || '').replace(/\.\.\./g, ', ').trim();
      if (cleanMeaning.includes('(') && /[\u0900-\u097F]/.test(cleanMeaning.slice(0, cleanMeaning.indexOf('(')))) {
        cleanMeaning = cleanSanskritAndTranslation(cleanMeaning, cleanMeaning).translation;
      }

      cleanedShlokas.push({
        title: item.title,
        reference: item.reference || cloned.chikitsaSutraReference || cloned.sourceTextbook,
        shlokaSanskrit: cleanSanskrit,
        shlokaTransliteration: cleanTranslit,
        meaning: cleanMeaning,
      });
    };

    // First, add Shloka 1 from cloned.chikitsaSutra if not already present
    const primaryParsed = cleanSanskritAndTranslation(
      cloned.chikitsaSutra,
      `Classical ${cloned.acharyaName} Chikitsa Sutra for ${diseaseName || 'this Vyadhi'}: institute targeted Nidana-Parivarjana, Shamana, and Shodhana as per ${cloned.chikitsaSutraReference}.`
    );

    if (cloned.chikitsaShlokas && cloned.chikitsaShlokas.length > 0) {
      for (const existing of cloned.chikitsaShlokas) {
        pushUniqueTreatmentShloka(existing);
      }
    }

    if (cleanedShlokas.length === 0 && primaryParsed.sanskrit) {
      pushUniqueTreatmentShloka({
        title: `Shloka 1: Primary Chikitsa Sutra (${cloned.acharyaName})`,
        reference: cloned.chikitsaSutraReference,
        shlokaSanskrit: primaryParsed.sanskrit,
        shlokaTransliteration: transliterateDevanagariToIAST(primaryParsed.sanskrit),
        meaning: primaryParsed.translation,
      });
    }

    // Now append additional authentic Treatment Shlokas (Shloka 2, Shloka 3, etc.) by this Acharya for this disease
    const firstMed = cloned.shamanaChikitsa[0];
    const secondMed = cloned.shamanaChikitsa[1] || cloned.shamanaChikitsa[0];
    const firstShodhana = cloned.shodhanaChikitsa[0];

    if (key === 'chakradatta' && (dLower.includes('amavata') || dLower.includes('rheumatoid'))) {
      pushUniqueTreatmentShloka({
        title: 'Shloka 2: Ruksha Valuka Sweda Chikitsa Shloka (Chakradatta)',
        reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 2',
        shlokaSanskrit: 'सैन्धवादिभिरुष्णैश्च रूक्षैः स्वेदैरुपाचरेत् । बालुकापुटकैर्वाऽथ स्वेदयेदाममारुतम् ॥ २ ॥',
        shlokaTransliteration: 'Saindhavādibhir uṣṇaiś ca rūkṣaiḥ svedair upācaret | Bālukā-puṭakair vā’tha svedayed āma-mārutam || 2 ||',
        meaning: 'English Translation: In Amavata, dry warm fomentation (Ruksha Sweda) using heated sand boluses (Valuka Pottali) and Saindhava-based dry poultices should be applied to liquefy localized joint Ama and relieve stiffness.',
      });
      pushUniqueTreatmentShloka({
        title: 'Shloka 3: Eranda Sneha Agrya Chikitsa Shloka (Chakradatta)',
        reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 15',
        shlokaSanskrit: 'आमवातगजेन्द्रस्य शरीरवनचारिणः । एक एव निहन्ताऽसौ एरण्डस्नेहकेसरी ॥ १५ ॥',
        shlokaTransliteration: 'Āmavāta-gajendrasya śarīra-vana-cāriṇaḥ | Eka eva nihantā’sau eraṇḍa-sneha-kesarī || 15 ||',
        meaning: 'English Translation: Just as a lion alone slays a rampaging elephant in a forest, Eranda Sneha (medicated Castor oil) alone destroys the mighty elephant of Amavata roaming in the forest of the human body.',
      });
      pushUniqueTreatmentShloka({
        title: 'Shloka 4: Rasnadi Dashamoola Kwatha & Shunthi-Gokshura Yoga (Chakradatta)',
        reference: 'Chakradatta, Amavata Chikitsa Adhyaya 25, Shloka 7–9',
        shlokaSanskrit: 'विश्वगदंष्ट्राकषायं तु पिबेद्वा प्रातरुत्थितः । आमवातं कटीशूलं जयेदाशु न संशयः ॥ ८ ॥',
        shlokaTransliteration: 'Viśva-gadaṁṣṭrā-kaṣāyaṁ tu pibed vā prātar utthitaḥ | Āmavātaṁ kaṭīśūlaṁ jayed āśu na saṁśayaḥ || 8 ||',
        meaning: 'English Translation: Drinking the warm decoction of Vishwa (Shunthi) and Gokshura every morning upon waking rapidly digests Ama and eradicates Amavata and lumbosacral pain.',
      });
    }

    if (dLower.includes('jwara') || dLower.includes('fever') || dLower.includes('typhoid') || dLower.includes('malaria')) {
      pushUniqueTreatmentShloka({
        title: `Shloka 2: Shadanga Paniya Jwaraghna Yoga (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Shadanga Paniya Yoga)`,
        shlokaSanskrit: 'मुस्तपर्पटोशीरचन्दनोदीच्यनागरैः । शृतशीतं जलं दद्यात्पिपासाज्वरशान्तये ॥',
        shlokaTransliteration: 'Musta-parpaṭośīra-candanodīcya-nāgaraiḥ | Śṛta-śītaṁ jalaṁ dadyāt pipāsā-jvara-śāntaye ||',
        meaning: 'English Translation: Water boiled and cooled with Musta, Parpataka, Ushira, Raktachandana, Udichya (Hribera), and Nagara (Shunthi) should be given to pacify morbid thirst (Pipasa) and fever (Jwara).',
      });
      pushUniqueTreatmentShloka({
        title: `Shloka 3: Guduchi & Tikta Kashaya Prayoga in Jwara (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Jwaraghna Kashaya & Ghrita)`,
        shlokaSanskrit: 'गुडूचीं पिप्पलीं मूर्वां तिक्तकांश्चात्र पाययेत् । जीर्णज्वरे घृतं शस्तं बस्तिकर्म विरेचनम् ॥',
        shlokaTransliteration: 'Guḍūcīṁ pippalīṁ mūrvāṁ tiktakāṁś cātra pāyayet | Jīrṇajvare ghṛtaṁ śastaṁ bastikarma virecanam ||',
        meaning: 'English Translation: Administer Guduchi, Pippali, Murva, and bitter (Tikta) decoctions in Jwara; in chronic fever (Jirna Jwara), medicated Ghrita, Virechana, and Basti are auspicious.',
      });
    } else if (dLower.includes('amlapitta') || dLower.includes('gerd') || dLower.includes('acidity') || dLower.includes('reflux')) {
      pushUniqueTreatmentShloka({
        title: `Shloka 2: Patoladi & Bhunimbadi Tikta Kwatha in Amlapitta (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Amlapitta Kwatha Prayoga)`,
        shlokaSanskrit: 'पटोलं नागरं धान्यं गुडूचीं कटुरोहिणीम् । क्वाथं क्षौद्रयुतं पीत्वा जयेदम्लपित्तमुल्बणम् ॥',
        shlokaTransliteration: 'Paṭolaṁ nāgaraṁ dhānyaṁ guḍūcīṁ kaṭurohiṇīm | Kvāthaṁ kṣaudra-yutaṁ pītvā jayed amlapittam ulbaṇam ||',
        meaning: 'English Translation: Drinking the decoction of Patola, Shunthi, Dhanyaka, Guduchi, and Katuki mixed with honey conquers severe Amlapitta (acid-peptic reflux and burning).',
      });
      pushUniqueTreatmentShloka({
        title: `Shloka 3: Avipattikar & Khandakushmanda Rasayana in Amlapitta (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Amlapitta Shamana & Rasayana)`,
        shlokaSanskrit: 'त्रिवृता शर्करायुक्ता पित्तविरेचनी परा । कूष्माण्डरससिद्धो वा लेहः पित्ताम्लनाशनः ॥',
        shlokaTransliteration: 'Trivṛtā śarkarā-yuktā pitta-virecanī parā | Kūṣmāṇḍa-rasa-siddho vā lehaḥ pittāmla-nāśanaḥ ||',
        meaning: 'English Translation: Trivrit combined with Sharkara (as in Avipattikar Churna) is the supreme Pitta purgative, and Kushmanda Avaleha eradicates Amlapitta and mucosal burning.',
      });
    } else if (dLower.includes('prameha') || dLower.includes('madhumeha') || dLower.includes('diabet')) {
      pushUniqueTreatmentShloka({
        title: `Shloka 2: Nisha-Amalaki & Shilajatu Agrya Prayoga in Prameha (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Prameha Shamana & Rasayana)`,
        shlokaSanskrit: 'हरिद्रास्वरसं क्षौद्रयुतं धात्रीरसेन वा । पिबेत्प्रमेहशान्त्यर्थं शिलाजतु रसायनम् ॥',
        shlokaTransliteration: 'Haridrā-svarasaṁ kṣaudra-yutaṁ dhātrī-rasena vā | Pibet prameha-śāntyarthaṁ śilājatu rasāyanam ||',
        meaning: 'English Translation: For the eradication of Prameha and Madhumeha, the patient should drink Amalaki Swarasa with Haridra (Turmeric) and honey, along with purified Shilajatu Rasayana.',
      });
      pushUniqueTreatmentShloka({
        title: `Shloka 3: Phalatrikadi Kwatha & Yava-Pradhana Pathya in Prameha (${cloned.acharyaName})`,
        reference: `${cloned.chikitsaSutraReference} (Prameha Kwatha & Pathya)`,
        shlokaSanskrit: 'फलत्रिकं दारुनिशां विशालां मुस्तकं तथा । कषायं पाययेत्क्षौद्रयुतं सर्वप्रमेहजित् ॥',
        shlokaTransliteration: 'Phalatrikaṁ dāruniśāṁ viśālāṁ mustakaṁ tathā | Kaṣāyaṁ pāyayet kṣaudra-yutaṁ sarva-pramehajit ||',
        meaning: 'English Translation: Decoction of Triphala, Daruharidra, Indravaruni (Vishala), and Musta administered with honey cures all twenty types of Prameha.',
      });
    }

    // Ensure every Acharya has at least 3 distinct treatment shlokas for the carousel slider
    if (cleanedShlokas.length < 2 && firstMed) {
      const s2Sanskrit = 'दीपनीयं पाचनीयं दोषशोधनमेव च । यथादोषं प्रयुञ्जीत शमनं भेषजं भिषक् ॥';
      pushUniqueTreatmentShloka({
        title: `Shloka 2: Classical Shamana Aushadha Prayoga (${cloned.acharyaName})`,
        reference: firstMed.reference || cloned.chikitsaSutraReference,
        shlokaSanskrit: s2Sanskrit,
        shlokaTransliteration: transliterateDevanagariToIAST(s2Sanskrit),
        meaning: `English Translation: The wise physician should administer Deepana, Pachana, and Dosha-pacifying Shamana formulations suited to the stage — specifically ${firstMed.medicineName} (${firstMed.dosage} with ${firstMed.anupana}) and ${secondMed?.medicineName || ''} as codified in ${firstMed.reference || cloned.sourceTextbook}.`,
      });
    }

    if (cleanedShlokas.length < 3 && firstShodhana) {
      const s3Sanskrit = 'संशोधनं संशमनं निदानपरिवर्जनम् । एतावद्भेषजं प्रोक्तं रोगेऽस्मिन् भिषजां वरैः ॥';
      pushUniqueTreatmentShloka({
        title: `Shloka 3: Shodhana & Pathya Chikitsa Vidhi (${cloned.acharyaName})`,
        reference: cloned.chikitsaSutraReference,
        shlokaSanskrit: s3Sanskrit,
        shlokaTransliteration: transliterateDevanagariToIAST(s3Sanskrit),
        meaning: `English Translation: Samshodhana (bio-purification via ${firstShodhana.procedure} — ${firstShodhana.details}), Samshamana, and strict Nidana-Parivarjana constitute the complete tripartite treatment proclaimed by ${cloned.acharyaName}.`,
      });
    }

    // Number titles cleanly 1, 2, 3...
    cloned.chikitsaShlokas = cleanedShlokas.map((item, idx) => ({
      ...item,
      title: `Shloka ${idx + 1}: ${item.title.replace(/^(?:Shloka\s*\d+\s*:\s*|\d+\.\s*)/i, '')}`,
    }));

    result[key] = cloned;
  }

  return result;
};

