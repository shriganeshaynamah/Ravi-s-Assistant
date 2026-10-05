import type { AcharyaClinicalProtocol } from './acharyaProtocols';

export interface DiseaseClassicalConfig {
  diseaseName: string;
  charaka: {
    mentioned?: boolean;
    diseaseRef: string;
    chikitsaRef: string;
    nidanaSanskrit: string;
    nidanaTranslit: string;
    nidanaMeaning: string;
    sutraText: string;
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
  };
  sushruta: {
    mentioned?: boolean;
    diseaseRef: string;
    chikitsaRef: string;
    nidanaSanskrit: string;
    nidanaTranslit: string;
    nidanaMeaning: string;
    sutraText: string;
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
  };
  vagbhata: {
    mentioned?: boolean;
    diseaseRef: string;
    chikitsaRef: string;
    nidanaSanskrit: string;
    nidanaTranslit: string;
    nidanaMeaning: string;
    sutraText: string;
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
  };
  chakradatta: {
    diseaseRef: string;
    chikitsaRef: string;
    nidanaSanskrit: string;
    nidanaTranslit: string;
    nidanaMeaning: string;
    sutraText: string;
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
  };
  sharangadhara: {
    diseaseRef: string;
    chikitsaRef: string;
    nidanaSanskrit: string;
    nidanaTranslit: string;
    nidanaMeaning: string;
    sutraText: string;
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
  };
}

export function buildProtocolsFromConfig(cfg: DiseaseClassicalConfig): Record<string, AcharyaClinicalProtocol> {
  const cMentioned = cfg.charaka.mentioned !== false;
  const sMentioned = cfg.sushruta.mentioned !== false;
  const vMentioned = cfg.vagbhata.mentioned !== false;

  const ensureMultipleShlokas = (
    _acharyaName: string,
    _sutraText: string,
    _chikitsaRef: string,
    _nidanaTranslit: string,
    shlokas: DiseaseClassicalConfig['charaka']['chikitsaShlokas']
  ) => {
    return shlokas;
  };

  return {
    charaka: {
      acharyaId: 'charaka',
      acharyaName: 'Acharya Charaka',
      sourceTextbook: 'Charaka Samhita',
      isDirectlyMentioned: cMentioned,
      diseaseReference: cMentioned ? cfg.charaka.diseaseRef : 'NA',
      chikitsaSutraReference: cMentioned ? cfg.charaka.chikitsaRef : 'NA',
      mentionStatusNote: cMentioned
        ? `Directly codified in ${cfg.charaka.diseaseRef} with Chikitsa Sutra in ${cfg.charaka.chikitsaRef}.`
        : 'NA — Not codified as a separate Vyadhi in Charaka Samhita.',
      clinicalPhilosophy: cMentioned ? `Classical Charaka Samhita protocol (${cfg.charaka.chikitsaRef}).` : 'NA',
      shlokaReference: cMentioned
        ? {
            shlokaSanskrit: cfg.charaka.nidanaSanskrit,
            shlokaTransliteration: cfg.charaka.nidanaTranslit,
            meaning: cfg.charaka.nidanaMeaning,
            sourceBook: 'Charaka Samhita',
            chapterAndVerse: cfg.charaka.diseaseRef,
          }
        : {
            shlokaSanskrit: 'NA',
            shlokaTransliteration: 'NA',
            meaning: 'NA — Not mentioned in Charaka Samhita.',
            sourceBook: 'NA',
            chapterAndVerse: 'NA',
          },
      chikitsaSutra: cMentioned ? cfg.charaka.sutraText : 'NA',
      chikitsaShlokas: cMentioned
        ? ensureMultipleShlokas('Acharya Charaka', cfg.charaka.sutraText, cfg.charaka.chikitsaRef, cfg.charaka.nidanaTranslit, cfg.charaka.chikitsaShlokas)
        : [],
      shamanaChikitsa: cMentioned ? cfg.charaka.shamana : [],
      shodhanaChikitsa: cMentioned ? cfg.charaka.shodhana : [],
    },
    sushruta: {
      acharyaId: 'sushruta',
      acharyaName: 'Acharya Sushruta',
      sourceTextbook: 'Sushruta Samhita',
      isDirectlyMentioned: sMentioned,
      diseaseReference: sMentioned ? cfg.sushruta.diseaseRef : 'NA',
      chikitsaSutraReference: sMentioned ? cfg.sushruta.chikitsaRef : 'NA',
      mentionStatusNote: sMentioned
        ? `Directly codified in ${cfg.sushruta.diseaseRef} with Chikitsa in ${cfg.sushruta.chikitsaRef}.`
        : 'NA — Not codified as a separate Vyadhi in Sushruta Samhita.',
      clinicalPhilosophy: sMentioned ? `Classical Sushruta Samhita protocol (${cfg.sushruta.chikitsaRef}).` : 'NA',
      shlokaReference: sMentioned
        ? {
            shlokaSanskrit: cfg.sushruta.nidanaSanskrit,
            shlokaTransliteration: cfg.sushruta.nidanaTranslit,
            meaning: cfg.sushruta.nidanaMeaning,
            sourceBook: 'Sushruta Samhita',
            chapterAndVerse: cfg.sushruta.diseaseRef,
          }
        : {
            shlokaSanskrit: 'NA',
            shlokaTransliteration: 'NA',
            meaning: 'NA — Not mentioned in Sushruta Samhita.',
            sourceBook: 'NA',
            chapterAndVerse: 'NA',
          },
      chikitsaSutra: sMentioned ? cfg.sushruta.sutraText : 'NA',
      chikitsaShlokas: sMentioned
        ? ensureMultipleShlokas('Acharya Sushruta', cfg.sushruta.sutraText, cfg.sushruta.chikitsaRef, cfg.sushruta.nidanaTranslit, cfg.sushruta.chikitsaShlokas)
        : [],
      shamanaChikitsa: sMentioned ? cfg.sushruta.shamana : [],
      shodhanaChikitsa: sMentioned ? cfg.sushruta.shodhana : [],
      paraSurgicalTherapy: sMentioned ? cfg.sushruta.paraSurgical : undefined,
    },
    vagbhata: {
      acharyaId: 'vagbhata',
      acharyaName: 'Acharya Vagbhata',
      sourceTextbook: 'Ashtanga Hridaya',
      isDirectlyMentioned: vMentioned,
      diseaseReference: vMentioned ? cfg.vagbhata.diseaseRef : 'NA',
      chikitsaSutraReference: vMentioned ? cfg.vagbhata.chikitsaRef : 'NA',
      mentionStatusNote: vMentioned
        ? `Directly codified in ${cfg.vagbhata.diseaseRef} with Chikitsa in ${cfg.vagbhata.chikitsaRef}.`
        : 'NA — Not codified as a separate Vyadhi in Ashtanga Hridaya.',
      clinicalPhilosophy: vMentioned ? `Classical Ashtanga Hridaya protocol (${cfg.vagbhata.chikitsaRef}).` : 'NA',
      shlokaReference: vMentioned
        ? {
            shlokaSanskrit: cfg.vagbhata.nidanaSanskrit,
            shlokaTransliteration: cfg.vagbhata.nidanaTranslit,
            meaning: cfg.vagbhata.nidanaMeaning,
            sourceBook: 'Ashtanga Hridaya',
            chapterAndVerse: cfg.vagbhata.diseaseRef,
          }
        : {
            shlokaSanskrit: 'NA',
            shlokaTransliteration: 'NA',
            meaning: 'NA — Not mentioned in Ashtanga Hridaya.',
            sourceBook: 'NA',
            chapterAndVerse: 'NA',
          },
      chikitsaSutra: vMentioned ? cfg.vagbhata.sutraText : 'NA',
      chikitsaShlokas: vMentioned
        ? ensureMultipleShlokas('Acharya Vagbhata', cfg.vagbhata.sutraText, cfg.vagbhata.chikitsaRef, cfg.vagbhata.nidanaTranslit, cfg.vagbhata.chikitsaShlokas)
        : [],
      shamanaChikitsa: vMentioned ? cfg.vagbhata.shamana : [],
      shodhanaChikitsa: vMentioned ? cfg.vagbhata.shodhana : [],
    },
    chakradatta: {
      acharyaId: 'chakradatta',
      acharyaName: 'Acharya Chakrapani Datta',
      sourceTextbook: 'Chakradatta',
      isDirectlyMentioned: true,
      diseaseReference: cfg.chakradatta.diseaseRef,
      chikitsaSutraReference: cfg.chakradatta.chikitsaRef,
      mentionStatusNote: `Codified in ${cfg.chakradatta.chikitsaRef} with classical BAMS textbook Yogas.`,
      clinicalPhilosophy: `Classical Chakradatta protocol (${cfg.chakradatta.chikitsaRef}).`,
      shlokaReference: {
        shlokaSanskrit: cfg.chakradatta.nidanaSanskrit,
        shlokaTransliteration: cfg.chakradatta.nidanaTranslit,
        meaning: cfg.chakradatta.nidanaMeaning,
        sourceBook: 'Chakradatta / Madhava Nidana',
        chapterAndVerse: cfg.chakradatta.diseaseRef,
      },
      chikitsaSutra: cfg.chakradatta.sutraText,
      chikitsaShlokas: ensureMultipleShlokas('Acharya Chakradatta', cfg.chakradatta.sutraText, cfg.chakradatta.chikitsaRef, cfg.chakradatta.nidanaTranslit, cfg.chakradatta.chikitsaShlokas),
      shamanaChikitsa: cfg.chakradatta.shamana,
      shodhanaChikitsa: cfg.chakradatta.shodhana,
    },
    sharangadhara: {
      acharyaId: 'sharangadhara',
      acharyaName: 'Acharya Sharangadhara',
      sourceTextbook: 'Sharangadhara Samhita',
      isDirectlyMentioned: true,
      diseaseReference: cfg.sharangadhara.diseaseRef,
      chikitsaSutraReference: cfg.sharangadhara.chikitsaRef,
      mentionStatusNote: `Codified in ${cfg.sharangadhara.chikitsaRef} with Bhaishajya Kalpana formulations.`,
      clinicalPhilosophy: `Classical Sharangadhara Samhita protocol (${cfg.sharangadhara.chikitsaRef}).`,
      shlokaReference: {
        shlokaSanskrit: cfg.sharangadhara.nidanaSanskrit,
        shlokaTransliteration: cfg.sharangadhara.nidanaTranslit,
        meaning: cfg.sharangadhara.nidanaMeaning,
        sourceBook: 'Sharangadhara Samhita',
        chapterAndVerse: cfg.sharangadhara.diseaseRef,
      },
      chikitsaSutra: cfg.sharangadhara.sutraText,
      chikitsaShlokas: ensureMultipleShlokas('Acharya Sharangadhara', cfg.sharangadhara.sutraText, cfg.sharangadhara.chikitsaRef, cfg.sharangadhara.nidanaTranslit, cfg.sharangadhara.chikitsaShlokas),
      shamanaChikitsa: cfg.sharangadhara.shamana,
      shodhanaChikitsa: cfg.sharangadhara.shodhana,
    },
  };
}

export const DISEASE_PROTOCOLS_PART1: Record<string, DiseaseClassicalConfig> = {
  // 1. VATARAKTA (GOUT)
  vatarakta: {
    diseaseName: 'Vatarakta (Gout / Crystal Arthropathy)',
    charaka: {
      diseaseRef: 'Charaka Samhita, Chikitsa Sthana 29/11–19 (Vatarakta Chikitsa)',
      chikitsaRef: 'Charaka Samhita, Chikitsa Sthana 29/41–125',
      nidanaSanskrit: 'खुडं वातबलासञ्च वातशोणितमादिशेत् । पादयोर्मूलमास्थाय कदाचिद्धस्तयोरपि ॥ आखोविषमिव क्रुद्धं तद्देहं अनुसर्पति ॥',
      nidanaTranslit: 'Khuḍaṁ vātabalāsañca vātaśoṇitam ādiśet | Pādayor mūlam āsthāya kadācid hastayor api || Ākhor viṣam iva kruddhaṁ tad dehaṁ anusarpati ||',
      nidanaMeaning: 'Vatarakta (also called Khuda or Vatabalasa) first strikes the root of the feet (1st MTP joint / great toe) or sometimes the hands, and then spreads throughout the body like virulent rat poison (Akhu-visha).',
      sutraText: 'रक्तमार्गनिहन्तृत्वाद्वायुः शोणितदूषणात् । मोक्षयेद्रक्तमादौ तु... विरेच्यः स्नेहयित्वा च बस्तिकर्म च कारयेत् ॥ (Ch. Chi. 29/41, 82)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Raktamokshana & Primary Vatarakta Chikitsa Sutra',
          reference: 'Charaka Samhita, Chikitsa Sthana 29/41–42',
          shlokaSanskrit: 'उत्थाने रक्तमोक्षं तु कुर्याच्छृङ्गजलौकसा । सूचीभिरलाबुभिर्वा प्रच्छनेन सिराव्यधैः ॥',
          shlokaTransliteration: 'Utthāne raktamokṣaṁ tu kuryāc chṛṅga-jalaukasā | Sūcībhir alābubhir vā pracchanena sirāvyadhaiḥ ||',
          meaning: 'In Vatarakta, Raktamokshana (bloodletting) is the foremost treatment using Jalauka (leeches — in burning pain), Shringa, Suchi, Alabu, Pracchana, or Siravyadha according to Dosha dominance.',
        },
        {
          title: 'Shloka 2: Basti Karma — Supreme Therapy for Vatarakta',
          reference: 'Charaka Samhita, Chikitsa Sthana 29/88',
          shlokaSanskrit: 'न हि बस्तिसमं किञ्चिद्वातरक्तचिकित्सितम् । तस्मान्निरूहान्सस्नेहान् कारयेद्वातरोगिणाम् ॥',
          shlokaTransliteration: 'Na hi basti-samaṁ kiñcid vātarakta-cikitsitam | Tasmān nirūhān sasnehān kārayed vātarogiṇām ||',
          meaning: 'There is no treatment equal to Basti Karma in the management of Vatarakta; therefore Ksheera Basti, Snehana Basti, and Niruha Basti must be administered.',
        },
        {
          title: 'Shloka 3: Guduchi — Agrya Aushadha for Vatarakta',
          reference: 'Charaka Samhita, Sutrasthana 25/40 & Chikitsa 29/35',
          shlokaSanskrit: 'अमृता साङ्ग्राहिक-वातहर-दीपनीय-श्लेष्मशोणितविबन्धप्रशमनानाम् ॥',
          shlokaTransliteration: 'Amṛtā sāṅgrāhika-vātahara-dīpanīya-śleṣmaśoṇita-vibandha-praśamanānām ||',
          meaning: 'Guduchi (Amrita) is the foremost drug for relieving Vata-Shonita (Vatarakta) obstruction and inflammation.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Kaishora Guggulu',
          dosage: '2 tablets (500 mg each) BD/TDS',
          anupana: 'Kokilaksha Kwatha or Guduchi Kwatha',
          timing: 'After meals',
          indications: 'Specifically indicated for Uttana & Gambhira Vatarakta with burning sensation, redness, and uric acid deposition',
          reference: 'Charaka Samhita, Chikitsa Sthana 29 (Guduchi-Triphala Yoga) / Bhaishajya Ratnavali 27/98',
        },
        {
          category: 'Kwatha / Kashaya',
          medicineName: 'Kokilaksha Kashayam / Guduchyadi Kwatha',
          dosage: '40 mL BD',
          anupana: '1 pinch Pippali churna & lukewarm water',
          timing: 'Before meals (Pragbhakta)',
          indications: 'Enhances renal urate clearance and pacifies Rakta-Pitta-Vata inflammation in joints',
          reference: 'Charaka Samhita, Chikitsa Sthana 29/55',
        },
        {
          category: 'Ghrita Kalpana',
          medicineName: 'Amritadi Ghrita / Sukumaraka Taila',
          dosage: '10 mL OD in morning',
          anupana: 'Warm milk or warm water',
          timing: 'Morning on empty stomach',
          indications: 'Nourishes Asthi-Sandhi and relieves Gambhira Vatarakta stiffness and burning',
          reference: 'Charaka Samhita, Chikitsa Sthana 29/61–70',
        },
        {
          category: 'Bahya Lepa / Taila',
          medicineName: 'Pinda Taila (External Application without Vigorous Rubbing)',
          dosage: 'Gentle Pichu / Lepa over inflamed 1st MTP & ankle joint',
          anupana: 'External use',
          timing: 'Twice daily',
          indications: 'Prepared with Manjishtha, Sariva, Siktha, and Sarjarasa; relieves acute burning and throbbing pain',
          reference: 'Charaka Samhita, Chikitsa Sthana 29/123',
        },
      ],
      shodhana: [
        {
          procedure: 'Jalaukavacharana (Medicinal Leech Therapy) / Siravyadha',
          indication: 'First-line Shodhana in Uttana & Sashoola-Sadaha Vatarakta (Ch. Chi. 29/41).',
          details: 'Application of 2–4 Nirvisha Jalaukas around inflamed great toe/ankle joint draws out vitiated Rakta and urate cytokines, giving rapid pain relief.',
        },
        {
          procedure: 'Ksheerabasti (Guduchi-Yashtimadhu Siddha Ksheera Basti) & Mridu Virechana',
          indication: 'Best systemic Shodhana for Vatarakta (Ch. Chi. 29/88 — Na hi basti-samam kinchid vatarakta-chikitsitam).',
          details: '8-day Yoga Basti with Guduchi-Siddha Ksheera Basti and Pinda Taila / Madhuyashtyadi Taila Anuvasana.',
        },
      ],
    },
    sushruta: {
      diseaseRef: 'Sushruta Samhita, Nidana Sthana 1/40–49 (Vatavyadhi Nidana)',
      chikitsaRef: 'Sushruta Samhita, Chikitsa Sthana 5/1–18 (Mahavatavyadhi Chikitsa)',
      nidanaSanskrit: 'क्रुद्धोद्धतगतिर्वायुः प्रदुष्टेनासृजावृतः । पादयोर्मूलमास्थाय कुरुते वातशोणितम् ॥',
      nidanaTranslit: 'Kruddhoddhata-gatir vāyuḥ praduṣṭenāsṛjāvṛtaḥ | Pādayor mūlam āsthāya kurute vātaśoṇitam ||',
      nidanaMeaning: 'Aggravated Vata obstructed by vitiated Rakta lodges in the feet and spreads upward to produce Vata-Shonita (Vatarakta).',
      sutraText: 'भीक्ष्णशोणितमोक्षेण विरेकैः सानुवासनैः । प्रायशः प्रशमं याति वातशोणितमुद्धतम् ॥ (Su. Chi. 5/7)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Sushruta Vata-Shonita Chikitsa Sutra',
          reference: 'Sushruta Samhita, Chikitsa Sthana 5/7',
          shlokaSanskrit: 'भीक्ष्णशोणितमोक्षेण विरेकैः सानुवासनैः । प्रायशः प्रशमं याति वातशोणितमुद्धतम् ॥',
          shlokaTransliteration: 'Bhīkṣṇa-śoṇita-mokṣeṇa virekaiḥ sānuvāsanaiḥ | Prāyaśaḥ praśamaṁ yāti vātaśoṇitam uddhatam ||',
          meaning: 'Repeated small-volume bloodletting (Raktamokshana), purgation (Virechana), and unctuous enemas (Anuvasana Basti) pacify severe Vata-Shonita.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu / Kwatha',
          medicineName: 'Amritadi Guggulu & Guduchi Kwatha',
          dosage: '2 tablets (500 mg) BD with 40 mL Guduchi Kwatha',
          anupana: 'Guduchi Kwatha',
          timing: 'After meals',
          indications: 'Digests Rakta-gata Ama and reduces joint tophi and swelling',
          reference: 'Sushruta Samhita, Chikitsa Sthana 5/10',
        },
        {
          category: 'Taila',
          medicineName: 'Pinda Taila / Madhuyashtyadi Taila',
          dosage: 'External Pichu over inflamed joint',
          anupana: 'External use',
          timing: 'Twice daily',
          indications: 'Soothes Daha (burning) and Raga (redness)',
          reference: 'Sushruta Samhita, Chikitsa Sthana 5/12',
        },
      ],
      shodhana: [
        {
          procedure: 'Jalaukavacharana & Siravyadha',
          indication: 'Primary surgical/para-surgical Raktamokshana in Vata-Shonita.',
          details: 'Leech application in Pittanubandha (burning/redness) or Siravyadha in Kapha-Vata dominance.',
        },
      ],
      paraSurgical: {
        therapyName: 'Jalaukavacharana',
        procedureNotes: 'Application of Nirvisha Jalauka over acute gouty arthritis (1st MTP / ankle) followed by Shatadhauta Ghrita dressing.',
        siteAndInstruments: '2–3 medicinal leeches, Haridra churna for induction/hemostasis, sterile gauze.',
      },
    },
    vagbhata: {
      diseaseRef: 'Ashtanga Hridaya, Nidana Sthana 16/1–15 (Vatarakta Nidana)',
      chikitsaRef: 'Ashtanga Hridaya, Chikitsa Sthana 22/1–48 (Vatarakta Chikitsa)',
      nidanaSanskrit: 'विदाह्यन्नं विरुद्धं च भजतां... भृशं वातशोणितं पादयोर्मूलात् प्रवर्तते ॥',
      nidanaTranslit: 'Vidāhyannaṁ viruddhaṁ ca bhajatāṁ... bhṛśaṁ vātaśoṇitaṁ pādayor mūlāt pravartate ||',
      nidanaMeaning: 'Consumption of Vidahi (acidic/burning) and incompatible foods with sedentary habits vitiates Rakta and Vata simultaneously, starting from the roots of the feet.',
      sutraText: 'स्निग्धस्यूध्वंमश्चाधश्च शोधितस्य... बस्तयः क्षीरसर्पिंषि सेकाभ्यङ्गप्रदेहनाः ॥ (A.H. Chi. 22/7)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Vagbhata Vatarakta Chikitsa Sutra',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 22/1–7',
          shlokaSanskrit: 'वातरक्तेऽसृजं मोक्षयेत् शृङ्गजलौकसा... बस्तयः क्षीरसर्पिंषि सेकाभ्यङ्गप्रदेहनाः ॥',
          shlokaTransliteration: 'Vātarakte’sṛjaṁ mokṣayet śṛṅga-jalaukasā... bastayaḥ kṣīra-sarpiṁṣi sekābhyaṅga-pradehanāḥ ||',
          meaning: 'In Vatarakta, perform Raktamokshana first, followed by Virechana, Ksheera Basti, medicated Ghritas, Seka, and cooling Pradeha.',
        },
      ],
      shamana: [
        {
          category: 'Kashaya',
          medicineName: 'Manjishthadi Kashayam (Brihat) & Kokilaksha Kwatha',
          dosage: '15 mL Kashayam + 45 mL lukewarm water BD',
          anupana: 'Warm water',
          timing: 'Before meals',
          indications: 'Raktaprasadana, lowers serum uric acid, and resolves periarticular erythema',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 22/18',
        },
        {
          category: 'Taila',
          medicineName: 'Madhuyashtyadi Taila & Pinda Taila',
          dosage: 'External Seka / Pichu & Anuvasana Basti',
          anupana: 'External & Basti',
          timing: 'Daily',
          indications: 'Relieves burning pain (Daha), throbbing, and joint tenderness',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 22/41',
        },
      ],
      shodhana: [
        {
          procedure: 'Ksheera Dhara / Seka & Ksheera Basti',
          indication: 'Uttana Vatarakta with severe burning (Daha) and redness.',
          details: 'Dashamoola-Guduchi Ksheera Seka over inflamed joints and Yapana/Ksheera Basti.',
        },
      ],
    },
    chakradatta: {
      diseaseRef: 'Madhava Nidana 23/1–12 & Chakradatta Ch. 23 (Vatarakta Chikitsa)',
      chikitsaRef: 'Chakradatta, Chapter 23 (Vatarakta Chikitsa)',
      nidanaSanskrit: 'वायुर्विवृद्धो वृद्धेन रक्तेनावारितः पथि । कृत्स्नं संदूषयेद्रक्तं तज्ज्ञेयं वातशोणितम् ॥',
      nidanaTranslit: 'Vāyur vivṛddho vṛddhena raktenāvāritaḥ pathi | Kṛtsnaṁ saṁdūṣayed raktaṁ taj jñeyaṁ vātaśoṇitam ||',
      nidanaMeaning: 'When aggravated Vata is obstructed in its pathway by vitiated Rakta, it further contaminates the entire blood tissue; this disease is known as Vata-Shonita (Vatarakta).',
      sutraText: 'अमृतायाः कषायं तु पिबेद्वा वातशोणिती... कैशोरं गुग्गुलुं चापि सेवेत वातशोणिते ॥ (Chakradatta 23/6)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Guduchi Prayoga in Vatarakta',
          reference: 'Chakradatta, Vatarakta Chikitsa 23/6',
          shlokaSanskrit: 'अमृतायाः कषायं तुकल्कं चूर्णं रसं तथा । भक्षयेन्मधुना नित्यं वातरक्तप्रशान्तये ॥',
          shlokaTransliteration: 'Amṛtāyāḥ kaṣāyaṁ tu kalkaṁ cūrṇaṁ rasaṁ tathā | Bhakṣayen madhunā nityaṁ vātarakta-praśāntaye ||',
          meaning: 'Regularly consuming Guduchi (Amrita) in the form of Kwatha, Kalka, Churna, or Swarasa cures even chronic Vatarakta.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Kalpana',
          medicineName: 'Kaishora Guggulu & Amritadi Guggulu',
          dosage: '2 tablets (500 mg) TDS',
          anupana: 'Guduchi Kwatha or Manjishthadi Kwatha',
          timing: 'After meals',
          indications: 'Specific textbook formulation for Vatarakta, Raktadushti, and gouty tophi',
          reference: 'Chakradatta, Vatarakta Chikitsa 23/35–45',
        },
        {
          category: 'Kwatha',
          medicineName: 'Navakarshika Guggulu / Kwatha (Triphala, Nimba, Manjishtha, Vacha, Katuki, Guduchi, Daruharidra)',
          dosage: '40 mL BD',
          anupana: 'Lukewarm water',
          timing: 'Before meals',
          indications: 'Clears deep-seated Rakta-avarana and chronic gouty arthropathy',
          reference: 'Chakradatta, Vatarakta Chikitsa 23/48',
        },
      ],
      shodhana: [
        {
          procedure: 'Jalaukavacharana & Eranda Sneha Virechana',
          indication: 'Acute Vatarakta flare with redness and swelling.',
          details: 'Local leech therapy followed by Haritaki + Eranda Taila Virechana.',
        },
      ],
    },
    sharangadhara: {
      diseaseRef: 'Sharangadhara Samhita, Purva Khanda 7/26',
      chikitsaRef: 'Sharangadhara Samhita, Madhyama Khanda 2 & 7 (Kaishora Guggulu)',
      nidanaSanskrit: 'वातरक्तं तु विज्ञेयं रक्तमाश्रित्य मारुतात् । कैशोरगुग्गुलुस्तत्र परं भैषज्यमुच्यते ॥',
      nidanaTranslit: 'Vātaraktaṁ tu vijñeyaṁ raktam āśritya mārutāt | Kaiśora-guggulus tatra paraṁ bhaiṣajyam ucyate ||',
      nidanaMeaning: 'Vatarakta arises from mutual vitiation of Vata and Rakta; Kaishora Guggulu is the supreme formulation codified for its cure.',
      sutraText: 'कैशोरगुग्गुलुः प्रोक्तो वातरक्तविनाशनः... मञ्जिष्ठादिकषायेण पाययेद्वातरोगिणम् ॥ (Sha. Ma. 7/70–81)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Kaishora Guggulu Classical Formulation',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/70–81',
          shlokaSanskrit: 'त्रिफलायास्त्रयः प्रस्थाः प्रस्थैका चामृता भवेत्... वातरक्तं जयत्युग्रं कैशोराख्योऽयमुत्तमः ॥',
          shlokaTransliteration: 'Triphalāyās trayaḥ prasthāḥ prasthaikā cāmṛtā bhavet... vātaraktaṁ jayaty ugraṁ kaiśorākhyo’yam uttamaḥ ||',
          meaning: 'Kaishora Guggulu prepared with Triphala, Guduchi, Trikatu, Vidanga, Danti, Trivrit, and Guggulu conquers severe Vatarakta and restores youthfulness.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Vati',
          medicineName: 'Kaishora Guggulu',
          dosage: '2 tablets (500 mg) TDS',
          anupana: 'Brihat Manjishthadi Kwatha (40 mL)',
          timing: 'After meals',
          indications: 'Authoritative Sharangadhara yoga for Vatarakta, Vrana, and Kushtha',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/70–81',
        },
        {
          category: 'Kwatha Kalpana',
          medicineName: 'Brihat Manjishthadi Kwatha & Guduchi Satva (500 mg BD)',
          dosage: '40 mL Kwatha BD + 500 mg Guduchi Satva',
          anupana: 'Warm water',
          timing: 'Before meals',
          indications: 'Purifies Rakta Dhatu and eliminates burning sensation in joints',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 2/137',
        },
      ],
      shodhana: [
        {
          procedure: 'Raktamokshana & Manjishthadi Ksheera Basti',
          indication: 'Chronic relapsing Vatarakta.',
          details: 'Leech therapy at affected joint + Ksheera Basti.',
        },
      ],
    },
  },

  // 2. MANYASTAMBHA (CERVICAL SPONDYLOSIS)
  manyastambha: {
    diseaseName: 'Manyastambha (Cervical Spondylosis)',
    charaka: {
      diseaseRef: 'Charaka Samhita, Chikitsa Sthana 28/43 (Vatavyadhi Chikitsa) & Sutrasthana 20/11',
      chikitsaRef: 'Charaka Samhita, Chikitsa Sthana 28/75–98',
      nidanaSanskrit: 'दिवास्वप्नासनस्थानैर्विवृताध्वनिरीक्षणैः । मन्यास्तम्भं प्रकुरुते स एव श्लेष्मणावृतः ॥',
      nidanaTranslit: 'Divāsvapnāsana-sthānair vivṛtādhva-nirīkṣaṇaiḥ | Manyāstambhaṁ prakurute sa eva śleṣmaṇāvṛtaḥ ||',
      nidanaMeaning: 'Daytime sleeping, improper neck posture/pillow, and constantly gazing upward or sideways cause Vata enveloped by Kapha to localize in the Manya (nape of the neck), producing Manyastambha (cervical stiffness and pain).',
      sutraText: 'मन्यास्तम्भे नस्यकर्म रूक्षस्वेदश्च लङ्घनम्... दशमूलकषायञ्च कोष्णं स्नेहसमन्वितम् ॥ (Ch. Chi. 28)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Manyastambha Nidana & Kapha-Avrita Vata Samprapti',
          reference: 'Charaka Samhita, Chikitsa Sthana 28/43 & Siddhi Sthana 9',
          shlokaSanskrit: 'मन्यास्तम्भे तु कर्तव्यं नस्यं मूर्धविरेचनम् । रूक्षस्वेदाश्च योग्याः स्युः कफवातहरो विधिः ॥',
          shlokaTransliteration: 'Manyāstambhe tu kartavyaṁ nasyaṁ mūrdhavirecanam | Rūkṣasvedāś ca yogyāḥ syuḥ kaphavātaharo vidhiḥ ||',
          meaning: 'In Manyastambha, Nasya Karma (errhine therapy), Ruksha Swedana (initially when Kapha-avarana is present), and Vata-Kaphahara measures are indicated.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Yoga',
          medicineName: 'Trayodashanga Guggulu / Yogaraja Guggulu',
          dosage: '2 tablets (500 mg) BD',
          anupana: 'Maharasnadi Kwatha or Dashamoola Kwatha',
          timing: 'After meals',
          indications: 'Relieves cervical Snayu-Asthi-Sandhi stiffness and brachial nerve root pain',
          reference: 'Charaka Samhita, Chikitsa Sthana 28 / Bhaishajya Ratnavali',
        },
        {
          category: 'Kashaya',
          medicineName: 'Prasarinyadi Kashayam / Maharasnadi Kwatha',
          dosage: '15 mL Kashayam + 45 mL warm water BD',
          anupana: 'Warm water with 5 drops Ksheerabala 101 Avarti',
          timing: 'Before meals',
          indications: 'Specific classical Kashaya for cervical spondylosis, shoulder stiffness (Apabahuka), and neck radiculopathy',
          reference: 'Charaka Samhita, Chikitsa Sthana 28 / Sahasrayogam',
        },
        {
          category: 'Nasya Taila',
          medicineName: 'Anu Taila / Ksheerabala (101) Taila Nasya',
          dosage: '4–6 drops in each nostril',
          anupana: 'After gentle facial and cervical Abhyanga-Swedana',
          timing: 'Morning on empty stomach',
          indications: 'Strengthens Urdhwajatrugata cervical nerves, intervertebral discs, and shoulder girdle',
          reference: 'Charaka Samhita, Sutrasthana 5/63–70',
        },
      ],
      shodhana: [
        {
          procedure: 'Greeva Basti (Cervical Oil Pooling) & Patra Pinda Sweda',
          indication: 'Cervical disc degeneration, paraspinal spasm, and C5–C7 radiculopathy.',
          details: 'Retention of warm Mahanarayana Taila + Kottamchukkadi Taila over C3–T2 spine for 35 minutes daily for 7–14 days.',
        },
        {
          procedure: 'Brumhana Nasya with Ksheerabala (101) Avarti Taila',
          indication: 'Urdhwajatrugata Vata Vyadhi affecting Manya and Bahu.',
          details: '8 drops per nostril for 7 days after Mukha-Greeva Abhyanga and Nadi Sweda.',
        },
      ],
    },
    sushruta: {
      diseaseRef: 'Sushruta Samhita, Nidana Sthana 1/67 (Vatavyadhi Nidana)',
      chikitsaRef: 'Sushruta Samhita, Chikitsa Sthana 4/18 (Vatavyadhi Chikitsa)',
      nidanaSanskrit: 'दिवास्वप्नासनस्थानैर्विवृताध्वनिरीक्षणैः । मन्यास्तम्भं प्रकुरुते स एव श्लेष्मणावृतः ॥',
      nidanaTranslit: 'Divāsvapnāsana-sthānair vivṛtādhva-nirīkṣaṇaiḥ | Manyāstambhaṁ prakurute sa eva śleṣmaṇāvṛtaḥ ||',
      nidanaMeaning: 'By sleeping during the day, leaning on uneven cushions, and gazing fixedly upward, Vata covered by Kapha stiffens the neck muscles (Manyastambha).',
      sutraText: 'मन्यास्तम्भेऽपि चैवंस्याद्विधिः... नस्यं स्वेदं च कारयेत् ॥ (Su. Chi. 4)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Sushruta Manyastambha Nidana & Chikitsa',
          reference: 'Sushruta Samhita, Nidana Sthana 1/67 & Chikitsa 4',
          shlokaSanskrit: 'मन्यास्तम्भे नस्यमभ्यङ्गं स्वेदं चाग्निं प्रयोजयेत् । पञ्चमूलकषायं च पिबेत्सैन्धवसंयुतम् ॥',
          shlokaTransliteration: 'Manyāstambhe nasyam abhyaṅgaṁ svedaṁ cāgniṁ prayojayet | Pañcamūla-kaṣāyaṁ ca pibet saindhava-saṁyutam ||',
          meaning: 'In Manyastambha, administer Nasya, Abhyanga, Swedana, Panchamoola Kwatha, and Agnikarma over tender cervical spinous/paraspinal points.',
        },
      ],
      shamana: [
        {
          category: 'Kwatha & Guggulu',
          medicineName: 'Dashamoola Kwatha + Trayodashanga Guggulu',
          dosage: '40 mL Kwatha + 2 tablets BD',
          anupana: 'Warm water',
          timing: 'After meals',
          indications: 'Relieves cervical nerve root entrapment and neck rigidity',
          reference: 'Sushruta Samhita, Chikitsa Sthana 4',
        },
        {
          category: 'Taila',
          medicineName: 'Mahanarayana Taila / Karpasasthyadi Taila',
          dosage: 'External Greeva Abhyanga & Nasya',
          anupana: 'External use',
          timing: 'Twice daily',
          indications: 'Pacifies cervical Vata-Kapha stiffness and brachial neuralgia',
          reference: 'Sushruta Samhita, Chikitsa Sthana 4',
        },
      ],
      shodhana: [
        {
          procedure: 'Greeva Basti & Shirovirechana Nasya',
          indication: 'Cervical spondylosis with restricted neck rotation.',
          details: 'Greeva Basti with Karpasasthyadi Taila followed by Nasya.',
        },
      ],
      paraSurgical: {
        therapyName: 'Agnikarma',
        procedureNotes: 'Bindu-dahana Agnikarma with Panchadhatu Shalaka over tender cervical paraspinal trigger points (C5–C7) and Viddhakarma for immediate relief of neck stiffness.',
        siteAndInstruments: 'Panchadhatu Shalaka, Aloe vera pulp, Haridra-Yashtimadhu dusting powder.',
      },
    },
    vagbhata: {
      diseaseRef: 'Ashtanga Hridaya, Nidana Sthana 15/22 (Vatavyadhi Nidana)',
      chikitsaRef: 'Ashtanga Hridaya, Chikitsa Sthana 21/43–44 (Vatavyadhi Chikitsa)',
      nidanaSanskrit: 'जिह्मं स्तब्धन्धरं मन्यास्तम्भोऽन्तरायामं च... ऊर्ध्वजत्रुविकारेषु नस्यं श्रेष्ठतमं मतम् ॥',
      nidanaTranslit: 'Jihmaṁ stabdhan-dharaṁ manyāstambho’ntarāyāmaṁ ca... ūrdhvajatru-vikāreṣu nasyaṁ śreṣṭhatamaṁ matam ||',
      nidanaMeaning: 'Manyastambha causes torticollis-like neck rigidity and inability to turn the neck; Nasya and Ruksha/Snigdha Swedana are supreme.',
      sutraText: 'मन्यास्तम्भे नस्यं रूक्षस्वेदश्च... प्रसारिण्यादिकषायं च प्रयोजयेत् ॥ (A.H. Chi. 21/43)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Vagbhata Manyastambha Chikitsa',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 21/43–44',
          shlokaSanskrit: 'मन्यास्तम्भेऽपि तद्वच्च पञ्चमूलकषायवान् । नस्यं कुर्यात्प्रसारिण्याः तैलैश्चाभ्यञ्जनादिकम् ॥',
          shlokaTransliteration: 'Manyāstambhe’pi tadvac ca pañcamūla-kaṣāyavān | Nasyaṁ kuryāt prasāriṇyāḥ tailaiś cābhyañjanādikam ||',
          meaning: 'In Manyastambha, administer Panchamoola Kwatha, Nasya, and Abhyanga with Prasarini Taila and Karpasasthyadi Taila.',
        },
      ],
      shamana: [
        {
          category: 'Kashaya',
          medicineName: 'Prasarinyadi Kashayam & Dhanwantharam Kashayam',
          dosage: '15 mL + 45 mL warm water BD',
          anupana: 'Dhanwantharam 101 Avarti (5 drops)',
          timing: 'Before meals',
          indications: 'Specifically indicated by Kerala/Vagbhata tradition for cervical spondylosis and frozen shoulder',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 21 / Sahasrayogam',
        },
        {
          category: 'Taila',
          medicineName: 'Karpasasthyadi Taila & Ksheerabala 101 Avarti',
          dosage: '6 drops Nasya + External Greeva Pichu',
          anupana: 'Warm water',
          timing: 'Morning & Bedtime',
          indications: 'Relieves cervical radiculopathy, numbness in fingers, and neck spasm',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 21',
        },
      ],
      shodhana: [
        {
          procedure: 'Greeva Pichu / Greeva Basti & Navarakizhi',
          indication: 'Degenerative cervical disc disease (Dhatukshayaja Manyastambha).',
          details: 'Greeva Basti with Karpasasthyadi Taila + Nasya with Ksheerabala 101.',
        },
      ],
    },
    chakradatta: {
      diseaseRef: 'Madhava Nidana 22/23 & Chakradatta Ch. 22 (Vatavyadhi Chikitsa)',
      chikitsaRef: 'Chakradatta, Chapter 22/40–45',
      nidanaSanskrit: 'दिवास्वप्नासनस्थानैर्विवृताध्वनिरीक्षणैः । मन्यास्तम्भं प्रकुरुते स एव श्लेष्मणावृतः ॥',
      nidanaTranslit: 'Divāsvapnāsana-sthānair vivṛtādhva-nirīkṣaṇaiḥ | Manyāstambhaṁ prakurute sa eva śleṣmaṇāvṛtaḥ ||',
      nidanaMeaning: 'Vata occluded by Kapha in the cervical region produces stiffness and pain of the neck (Manyastambha).',
      sutraText: 'दशमूलीबलैरण्डक्वाथः पीतश्च हिङ्गुना । मन्यास्तम्भं निहन्त्याशु रूक्षस्वेदश्च नावनम् ॥ (Chakradatta 22/41)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Chakradatta Dashamooli-Bala-Eranda Kwatha for Manyastambha',
          reference: 'Chakradatta, Vatavyadhi Chikitsa 22/41',
          shlokaSanskrit: 'दशमूलीबलैरण्डक्वाथः पीतश्च हिङ्गुना । मन्यास्तम्भं निहन्त्याशु रूक्षस्वेदश्च नावनम् ॥',
          shlokaTransliteration: 'Daśamūlī-balairaṇḍa-kvāthaḥ pītaś ca hiṅgunā | Manyāstambhaṁ nihanty āśu rūkṣasvedaś ca nāvanam ||',
          meaning: 'Decoction of Dashamoola, Bala, and Eranda root taken with fried Hingu and Saindhava, combined with Ruksha Sweda and Nasya, rapidly cures Manyastambha.',
        },
      ],
      shamana: [
        {
          category: 'Kwatha',
          medicineName: 'Dashamooli-Bala-Eranda Kwatha with Hingu & Saindhava',
          dosage: '40 mL BD',
          anupana: '125 mg Shuddha Hingu + Saindhava',
          timing: 'Before meals',
          indications: 'Directly cited by Chakradatta for rapid relief of Manyastambha neck lock',
          reference: 'Chakradatta, Vatavyadhi Chikitsa 22/41',
        },
        {
          category: 'Guggulu & Taila',
          medicineName: 'Trayodashanga Guggulu & Kubjaprasarini Taila',
          dosage: '2 tablets BD + External Abhyanga',
          anupana: 'Warm water',
          timing: 'After meals',
          indications: 'Relieves cervical stiffness and radiating arm pain',
          reference: 'Chakradatta, Vatavyadhi Chikitsa 22/85',
        },
      ],
      shodhana: [
        {
          procedure: 'Ruksha Valuka Sweda followed by Greeva Basti & Nasya',
          indication: 'Initial Kapha-avarana neck stiffness followed by Vata pacification.',
          details: '3 days Ruksha Sweda then 7 days Greeva Basti and Mashadi Nasya.',
        },
      ],
    },
    sharangadhara: {
      diseaseRef: 'Sharangadhara Samhita, Purva Khanda 7/105 (80 Nanatmaja Vata)',
      chikitsaRef: 'Sharangadhara Samhita, Madhyama Khanda 2 & 7 & Uttara Khanda 8 (Nasya)',
      nidanaSanskrit: 'मन्यास्तम्भः शिरोग्रहश्चापबाहुक एव च... गुग्गुलुस्त्रयोदशाङ्गश्च महावातामयापहः ॥',
      nidanaTranslit: 'Manyāstambhaḥ śirograhaś cāpabāhuka eva ca... guggulus trayodaśāṅgaś ca mahāvātāmayāpahaḥ ||',
      nidanaMeaning: 'Manyastambha is an Urdhwajatrugata Vata disorder conquered by Trayodashanga Guggulu, Maharasnadi Kwatha, and Nasya.',
      sutraText: 'त्रयोदशाङ्गगुग्गुलुः... मन्यास्तम्भे कटिग्रहे गृध्रस्यां च प्रशस्यते ॥ (Sha. Ma. 7/88)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Trayodashanga Guggulu & Maharasnadi Kwatha',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/88–95 & 2/89',
          shlokaSanskrit: 'आभाश्वगन्धाहपुषागुडूची... कटिग्रहं गृध्रसीं च मन्यास्तम्भं व्यपोहति ॥',
          shlokaTransliteration: 'Ābhāśvagandhā-hapuṣā-guḍūcī... kaṭigrahaṁ gṛdhrasīṁ ca manyāstambhaṁ vyapohati ||',
          meaning: 'Trayodashanga Guggulu prepared with Babbul, Ashwagandha, Hapusha, Guduchi, Shatavari, Gokshura, and Rasna cures Manyastambha, Katigraha, and Gridhrasi.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Vati',
          medicineName: 'Trayodashanga Guggulu',
          dosage: '2 tablets (500 mg) BD',
          anupana: 'Maharasnadi Kwatha (40 mL)',
          timing: 'After meals',
          indications: 'Strengthens cervical vertebrae, ligaments, and intervertebral discs',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/88–95',
        },
        {
          category: 'Rasa Aushadhi',
          medicineName: 'Ekangaveera Ras / Brihat Vata Chintamani Ras',
          dosage: '1 tablet (125 mg) BD',
          anupana: 'Honey or Maharasnadi Kwatha',
          timing: 'After meals',
          indications: 'Indicated when cervical spondylosis causes C6–C7 brachial radiculopathy and arm numbness',
          reference: 'Sharangadhara Samhita / Bhaishajya Ratnavali',
        },
      ],
      shodhana: [
        {
          procedure: 'Marsha / Pratimarsha Nasya (Uttara Khanda Ch. 8) & Greeva Basti',
          indication: 'Manyastambha & Apabahuka.',
          details: 'Instillation of 6–8 drops of Shadbindu / Anu Taila in each nostril + Greeva Basti.',
        },
      ],
    },
  },

  // 3. KATIGRAHA / LOW BACK PAIN
  katigraha: {
    diseaseName: 'Katigraha / Trikagraha (Low Back Pain / Lumbar Spondylosis)',
    charaka: {
      diseaseRef: 'Charaka Samhita, Chikitsa Sthana 28/20–24 (Asthi-Majjagata Vata & Katishoola)',
      chikitsaRef: 'Charaka Samhita, Chikitsa Sthana 28/75–105',
      nidanaSanskrit: 'श्रोणीकटीपृष्ठमनस्थिशूलं... स्नेहाश्च बस्तयश्चैव वातव्याधिहरो विधिः ॥',
      nidanaTranslit: 'Śroṇī-kaṭī-pṛṣṭham anasthi-śūlaṁ... snehāś ca bastayaś caiva vātavyādhi-haro vidhiḥ ||',
      nidanaMeaning: 'Vitiated Apana and Vyana Vata lodging in the Kati (lumbosacral spine) and Shroni (pelvis) cause severe lower back stiffness and aching pain; Snehana, Swedana, and Basti are the supreme remedies.',
      sutraText: 'स्वेदनं स्नेहसंयुक्तं कटिशूले प्रयोजयेत् । बस्तिकर्म परं विद्यात् कटिग्रहनिबर्हणम् ॥ (Ch. Chi. 28)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Snehana, Swedana & Basti in Katigraha',
          reference: 'Charaka Samhita, Chikitsa Sthana 28/75–83',
          shlokaSanskrit: 'स्विन्नस्य स्नेहसंयुक्तैर्बस्तिभिः समुपाचरेत् । कटीपृष्ठग्रहार्तानां बस्तिर्हि परमोऽौषधम् ॥',
          shlokaTransliteration: 'Svinnasya sneha-saṁyuktair bastibhiḥ samupācaret | Kaṭī-pṛṣṭha-grahārtānāṁ bastir hi paramauṣadham ||',
          meaning: 'Patients suffering from stiffness and pain of the Kati (lower back) and Prishtha (spine) should be treated with Snehana, Swedana, and Basti, as Basti is the supreme medicine for the lumbar region (Vatasthana).',
        },
      ],
      shamana: [
        {
          category: 'Guggulu Yoga',
          medicineName: 'Trayodashanga Guggulu / Lakshadi Guggulu',
          dosage: '2 tablets (500 mg) BD',
          anupana: 'Dashamoola Kwatha or Rasnasaptaka Kwatha',
          timing: 'After meals',
          indications: 'Strengthens lumbar vertebrae (Asthidhatu), relieves paraspinal spasm and disc desiccation',
          reference: 'Charaka Samhita, Chikitsa Sthana 28 / Bhaishajya Ratnavali',
        },
        {
          category: 'Kashaya',
          medicineName: 'Sahacharadi Kashayam / Rasnasaptaka Kwatha',
          dosage: '40 mL BD',
          anupana: '1 tsp Eranda Taila or 5 drops Ksheerabala Taila',
          timing: 'Before meals',
          indications: 'Pacifies Apana Vata in Kati-Pradesha and relieves lumbosacral stiffness',
          reference: 'Charaka Samhita, Chikitsa Sthana 28',
        },
      ],
      shodhana: [
        {
          procedure: 'Kati Basti & Patra Pinda Sweda',
          indication: 'Localized lumbosacral disc degeneration and paraspinal muscle spasm.',
          details: 'Pooling warm Sahacharadi Taila + Mahanarayana Taila over L3–S1 spine for 40 minutes daily.',
        },
        {
          procedure: 'Erandamooladi Niruha Basti & Sahacharadi Taila Anuvasana (Kala Basti)',
          indication: 'Kati is the primary seat of Vata (Pakvashaya-Kati-Sakthi); Basti directly targets lumbar pathology.',
          details: '8-day Yoga Basti or 16-day Kala Basti schedule.',
        },
      ],
    },
    sushruta: {
      diseaseRef: 'Sushruta Samhita, Nidana Sthana 1 & Chikitsa Sthana 4',
      chikitsaRef: 'Sushruta Samhita, Chikitsa Sthana 4 & Sutrasthana 12 (Agnikarma)',
      nidanaSanskrit: 'कट्याः संश्रयते वायुः शूलं स्तम्भं करोति च । स्नेहस्वेदौ तथा बस्तिरग्निकर्म च शस्यते ॥',
      nidanaTranslit: 'Kaṭyāḥ saṁśrayate vāyuḥ śūlaṁ stambhaṁ karoti ca | Sneha-svedau tathā bastir agnikarma ca śasyate ||',
      nidanaMeaning: 'Vata localized in the lumbosacral joints and ligaments produces Katishoola and Stambha; Snehana, Swedana, Basti, and Agnikarma are indicated.',
      sutraText: 'सिरासन्ध्यस्थिमर्माणां... अत्युग्ररुजि चाग्निकर्म कारयेत् ॥ (Su. Su. 12/10)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Agnikarma & Sneha-Sweda in Katishoola',
          reference: 'Sushruta Samhita, Sutrasthana 12/10 & Chikitsa 4',
          shlokaSanskrit: 'त्वङ्मांससिरास्नायुसन्ध्यस्थिस्थिते अतिउग्ररुजि... दहेच्चाग्निना सम्यक् ॥',
          shlokaTransliteration: 'Tvaṅ-māṁsa-sirā-snāyu-sandhy-asthi-sthite ati-ugraruji... dahec cāgninā samyak ||',
          meaning: 'In severe Vata pain localized in lumbar ligaments (Snayu), joints (Sandhi), and bones (Asthi), perform Snehana-Swedana and Agnikarma.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu & Kwatha',
          medicineName: 'Yogaraja Guggulu + Dashamoola Kwatha',
          dosage: '2 tablets BD with 40 mL Dashamoola Kwatha',
          anupana: 'Dashamoola Kwatha',
          timing: 'After meals',
          indications: 'Relieves lumbosacral ligamentous strain and facet joint arthropathy',
          reference: 'Sushruta Samhita, Chikitsa Sthana 4',
        },
      ],
      shodhana: [
        {
          procedure: 'Kati Basti & Nadi Sweda',
          indication: 'Lumbosacral spondylosis and Katigraha.',
          details: 'Local oleation and sudation over L4–S1 spine.',
        },
      ],
      paraSurgical: {
        therapyName: 'Agnikarma',
        procedureNotes: 'Bindu-dahana Agnikarma with Panchadhatu Shalaka over L4–L5–S1 paraspinal tender points and sacroiliac joint landmarks.',
        siteAndInstruments: 'Panchadhatu Shalaka, Kumari Swarasa, Yashtimadhu Churna.',
      },
    },
    vagbhata: {
      diseaseRef: 'Ashtanga Hridaya, Nidana Sthana 15 & Chikitsa Sthana 21',
      chikitsaRef: 'Ashtanga Hridaya, Chikitsa Sthana 21/18–28',
      nidanaSanskrit: 'कटिपृष्ठोरुजङ्घासु शूलं स्तम्भं च मारुतः... सहचरादिकषायेण बस्तिभिश्च जयेद्भिषक् ॥',
      nidanaTranslit: 'Kaṭi-pṛṣṭhoru-jaṅghāsu śūlaṁ stambhaṁ ca mārutaḥ... sahacarādi-kaṣāyeṇa bastibhiś ca jayed bhiṣak ||',
      nidanaMeaning: 'Vata producing stiffness and pain in the waist, back, and thighs is conquered by Sahacharadi Kashaya, Kati Basti, and Basti Karma.',
      sutraText: 'सहचरामरदारुनागरैः क्वथितमम्भः... कटिपृष्ठग्रहं जयेत् ॥ (A.H. Chi. 21/56)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Sahacharadi Yoga for Kati-Adhahkaya Vata',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 21/56',
          shlokaSanskrit: 'सहचरामरदारुनागरैः क्वथितमम्भः तैलविमिश्रितम् । पवनपीडितदेहगतिः पिबेत् ॥',
          shlokaTransliteration: 'Sahacarāmaradāru-nāgaraiḥ kvathitam ambhaḥ taila-vimiśritam | Pavana-pīḍita-deha-gatiḥ pibet ||',
          meaning: 'Decoction of Sahachara, Devadaru, and Sunthi mixed with medicated Taila cures lower back stiffness and impaired gait.',
        },
      ],
      shamana: [
        {
          category: 'Kashaya',
          medicineName: 'Sahacharadi Kashayam & Gandharvahastadi Kashayam',
          dosage: '15 mL + 45 mL warm water BD',
          anupana: 'Ksheerabala Taila (10 drops)',
          timing: 'Before meals',
          indications: 'Clears Apana Vata obstruction and strengthens lumbar spine',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 21/56',
        },
      ],
      shodhana: [
        {
          procedure: 'Kati Basti & Patra Pinda Sweda (Elakizhi)',
          indication: 'Lumbar spondylosis and mechanical low back ache.',
          details: 'Kati Basti with Dhanwantharam Taila + Kottamchukkadi Taila.',
        },
      ],
    },
    chakradatta: {
      diseaseRef: 'Chakradatta, Vatavyadhi Chikitsa 22 & Gada Nigraha (Katigraha)',
      chikitsaRef: 'Chakradatta, Chapter 22 (Vatavyadhi Chikitsa)',
      nidanaSanskrit: 'वायुः कट्यां स्थितः शुद्धः सामो वा जनयेद्रुजम् । कटिग्रहः स विज्ञेयः स्तम्भशूलसमन्वितः ॥',
      nidanaTranslit: 'Vāyuḥ kaṭyāṁ sthitaḥ śuddhaḥ sāmo vā janayed rujam | Kaṭigrahaḥ sa vijñeyaḥ stambha-śūla-samanvitaḥ ||',
      nidanaMeaning: 'When Sama or Nirama Vata settles in the Kati (lumbosacral region) and produces stiffness (Stambha) and pain (Shoola), it is called Katigraha.',
      sutraText: 'दशमूलकषायेण त्रयोदशाङ्गगुग्गुलुम् । एरण्डतैलसंयुक्तं पिबेत् कटिग्रहापहम् ॥ (Chakradatta 22)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Katigraha Shamana Yoga',
          reference: 'Chakradatta, Vatavyadhi Chikitsa 22 & Gada Nigraha',
          shlokaSanskrit: 'रास्नासप्तकनिर्गुण्डीदशमूलकषायकम् । एरण्डतैलसंयुक्तं कटिशूलविनाशनम् ॥',
          shlokaTransliteration: 'Rāsnāsaptaka-nirguṇḍī-daśamūla-kaṣāyakam | Eraṇḍa-taila-saṁyuktaṁ kaṭiśūla-vināśanam ||',
          meaning: 'Rasnasaptaka Kwatha mixed with Eranda Taila destroys severe Katishoola and Katigraha.',
        },
      ],
      shamana: [
        {
          category: 'Kwatha & Guggulu',
          medicineName: 'Rasnasaptaka Kwatha (40 mL BD) + Trayodashanga Guggulu (2 tabs BD)',
          dosage: '40 mL Kwatha + 2 tablets BD',
          anupana: '10 mL Eranda Taila at night',
          timing: 'Before & After meals',
          indications: 'Specific textbook combination for Katishoola, Trikashoola, and Prishthashoola',
          reference: 'Chakradatta, Vatavyadhi Chikitsa 22 / Amavata 25/8',
        },
      ],
      shodhana: [
        {
          procedure: 'Kati Basti & Vaitarana / Erandamooladi Basti',
          indication: 'Sama and Nirama Katigraha.',
          details: 'Kati Basti + 8-day Yoga Basti.',
        },
      ],
    },
    sharangadhara: {
      diseaseRef: 'Sharangadhara Samhita, Purva Khanda 7/105',
      chikitsaRef: 'Sharangadhara Samhita, Madhyama Khanda 2/86 & 7/88',
      nidanaSanskrit: 'कटीग्रहे त्रिकग्रहे पृष्ठग्रहे च दारुणे । रास्नासप्तकक्वाथश्च त्रयोदशाङ्गगुग्गुलुः ॥',
      nidanaTranslit: 'Kaṭīgrahe trikagrahe pṛṣṭhagrahe ca dāruṇe | Rāsnāsaptaka-kvāthaś ca trayodaśāṅga-gugguluḥ ||',
      nidanaMeaning: 'In severe Katigraha, Trikagraha, and Prishtha-graha, Rasnasaptaka Kwatha and Trayodashanga Guggulu are the specific textbook formulations.',
      sutraText: 'गोक्षुरैरण्डवर्षाभूरास्नाग्वधदेवदारुभिः... जङ्घाऊरुपृष्ठत्रिकपार्श्वशूलं निहन्ति ॥ (Sha. Ma. 2/86)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Rasnasaptaka Kwatha for Kati-Trika-Prishtha Shoola',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 2/86–87',
          shlokaSanskrit: 'रास्नासप्तकमित्येतत्... जङ्घाऊरुपृष्ठत्रिकपार्श्वशूलं निहन्ति शुण्ठीचूर्णसमन्वितम् ॥',
          shlokaTransliteration: 'Rāsnāsaptakam ity etat... jaṅghā-ūru-pṛṣṭha-trika-pārśva-śūlaṁ nihanti śuṇṭhī-cūrṇa-samanvitam ||',
          meaning: 'Rasnasaptaka Kwatha taken with Sunthi Churna destroys pain in the calves, thighs, back (Prishtha), lumbosacral region (Trika), and flanks.',
        },
      ],
      shamana: [
        {
          category: 'Kwatha & Guggulu',
          medicineName: 'Rasnasaptaka Kwatha (Sha. Ma. 2/86) & Trayodashanga Guggulu (Sha. Ma. 7/88)',
          dosage: '40 mL Kwatha BD + 2 tablets Guggulu BD',
          anupana: 'Warm water with 1 pinch Sunthi churna',
          timing: 'Before & After meals',
          indications: 'Authoritative Sharangadhara protocol for Katigraha and Trikagraha',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 2/86 & 7/88',
        },
      ],
      shodhana: [
        {
          procedure: 'Kati Basti & Dashamoola Niruha Basti',
          indication: 'Chronic Katigraha.',
          details: 'Local Kati Basti with Vishagarbha / Mahanarayana Taila + Basti.',
        },
      ],
    },
  },

  // 4. GRAHANI ROGA (IBS / MALABSORPTION)
  grahani: {
    diseaseName: 'Grahani Roga (Irritable Bowel Syndrome / Malabsorption)',
    charaka: {
      diseaseRef: 'Charaka Samhita, Chikitsa Sthana 15/51–57 (Grahani Dosha Chikitsa)',
      chikitsaRef: 'Charaka Samhita, Chikitsa Sthana 15/73–195',
      nidanaSanskrit: 'अग्न्यधिष्ठानमन्नस्य ग्रहणाद्ग्रहणी मता... मुहुर्बद्धं मुहुर्द्रवं सृजत्येतद्ग्रहणीगदः ॥',
      nidanaTranslit: 'Agny-adhiṣṭhānam annasya grahaṇād grahaṇī matā... muhur baddhaṁ muhur dravaṁ sṛjaty etad grahaṇī-gadaḥ ||',
      nidanaMeaning: 'Grahani is the seat of Jatharagni because it holds food for digestion; when vitiated by Mandagni, the patient passes stool alternately constipated/formed and loose/liquid (Muhur-baddham Muhur-dravam) with mucus and undigested food.',
      sutraText: 'लीनं पक्वाशयात्स्थं वा्यामं स्राव्यं सदीपनैः । तक्रं तु ग्रहणीदोषे सोदावर्ते प्रशस्यते ॥ (Ch. Chi. 15/73, 117)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Takra (Medicated Buttermilk) — Supreme Nectar for Grahani Roga',
          reference: 'Charaka Samhita, Chikitsa Sthana 15/117–120',
          shlokaSanskrit: 'यथाऽमृतममानानां तक्रं भूमौ तथा नृणाम् । ग्रहणीदोषशोफार्शःपाण्डुरोगविनाशनम् ॥',
          shlokaTransliteration: 'Yathā’mṛtam amānānāṁ takraṁ bhūmau tathā nṛṇām | Grahaṇī-doṣa-śophārśaḥ-pāṇḍuroga-vināśanam ||',
          meaning: 'Just as Amrita (nectar) is to the gods in heaven, so is Takra (buttermilk) to humans on earth for curing Grahani Roga; it is Laghu, Deepana, Grahi, and Tridoshahara.',
        },
        {
          title: 'Shloka 2: Chitrakadi Gutika for Ama-Pachana in Grahani',
          reference: 'Charaka Samhita, Chikitsa Sthana 15/96–97',
          shlokaSanskrit: 'चित्रकं पिप्पलीमूलं द्वौ क्षारौ लवणानि च... गुटिकाः कारयेद्विद्वान् ग्रहणीदोषनाशिनीः ॥',
          shlokaTransliteration: 'Citrakaṁ pippalīmūlaṁ dvau kṣārau lavaṇāni ca... guṭikāḥ kārayed vidvān grahaṇī-doṣa-nāśinīḥ ||',
          meaning: 'Chitrakadi Gutika digests Ama, kindles Jatharagni, and cures Grahani Dosha.',
        },
      ],
      shamana: [
        {
          category: 'Vati / Gutika',
          medicineName: 'Chitrakadi Vati',
          dosage: '2 tablets (250 mg each) BD/TDS (chewed)',
          anupana: 'Takra (buttermilk roasted with Jeeraka & Saindhava)',
          timing: 'Immediately before or after meals',
          indications: 'Digests Sama-mala, kindles Jatharagni, and relieves post-meal urgency',
          reference: 'Charaka Samhita, Chikitsa Sthana 15/96–97',
        },
        {
          category: 'Arishta / Parpati',
          medicineName: 'Kutajarishta (20 mL BD) & Panchamrita Parpati (125 mg BD)',
          dosage: '20 mL Kutajarishta + 125 mg Panchamrita Parpati BD',
          anupana: 'Equal water & roasted Bhrishta Jeeraka + Takra',
          timing: 'After meals',
          indications: 'Stambhana, Sangrahi, and mucosal healing in IBS-D (Sangrahani)',
          reference: 'Charaka Samhita, Chikitsa Sthana 15 & Bhaishajya Ratnavali (Grahani 4/514)',
        },
        {
          category: 'Avaleha / Churna',
          medicineName: 'Bilwadi Leha / Dadimashtaka Churna',
          dosage: '5 g BD',
          anupana: 'Takra (Buttermilk)',
          timing: 'After meals',
          indications: 'Checks frequent mucus stools, bloating, and tenesmus',
          reference: 'Charaka Samhita, Chikitsa Sthana 15 / Sahasrayogam',
        },
      ],
      shodhana: [
        {
          procedure: 'Takra Basti & Pichha Basti',
          indication: 'Chronic Grahani with frequent mucus stools and gut hypermotility.',
          details: 'Medicated Takra Basti or Mocharasa-Siddha Pichha Basti to restore Grahani mucosal tone.',
        },
      ],
    },
    sushruta: {
      diseaseRef: 'Sushruta Samhita, Uttara Tantra 40/166–178 (Atisara-Grahani Pratishedha)',
      chikitsaRef: 'Sushruta Samhita, Uttara Tantra 40/175–185',
      nidanaSanskrit: 'षष्ठी पित्तधरा नाम या कला परिकीर्तिता । पक्वामाशयमध्यस्था ग्रहणी सा प्रकीर्तिता ॥',
      nidanaTranslit: 'Ṣaṣṭhī pittadharā nāma yā kalā parikīrtitā | Pakvāmāśaya-madhyasthā grahaṇī sā prakīrtitā ||',
      nidanaMeaning: 'The sixth Kala known as Pittadhara Kala situated between Amashaya and Pakvashaya is Grahani; its strength depends entirely on Agni.',
      sutraText: 'ग्रहण्यां दीपनं ग्राहि भेषजं सानुवासनम् । तक्रारिष्टप्रयोगश्च हितः स्नेहश्च पाचनः ॥ (Su. U. 40)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Pittadhara Kala & Grahani Chikitsa',
          reference: 'Sushruta Samhita, Uttara Tantra 40/169–177',
          shlokaSanskrit: 'अग्निर्यदन्नं पचति... ग्रहणीमाश्रितो दोषो दीपनीयैर्विशोधयेत् ॥',
          shlokaTransliteration: 'Agnir yad annaṁ pacati... grahaṇīm āśrito doṣo dīpanīyair viśodhayet ||',
          meaning: 'Doshas vitiating the Pittadhara Kala (Grahani) must be treated with Deepana, Pachana, Grahi formulations, and Takrarishta.',
        },
      ],
      shamana: [
        {
          category: 'Kwatha / Churna',
          medicineName: 'Mustadi Kwatha & Kapitthashtaka Churna',
          dosage: '40 mL Kwatha + 3 g Churna BD',
          anupana: 'Takra (Buttermilk)',
          timing: 'After meals',
          indications: 'Sangrahi, Deepana-Pachana on Pittadhara Kala',
          reference: 'Sushruta Samhita, Uttara Tantra 40',
        },
      ],
      shodhana: [
        {
          procedure: 'Deepana-Pachana & Changeryadi Ghrita Snehapana',
          indication: 'Chronic Grahani with Vata-Kapha dominance.',
          details: 'Medicated Deepana Ghrita administration after Ama digestion.',
        },
      ],
    },
    vagbhata: {
      diseaseRef: 'Ashtanga Hridaya, Nidana Sthana 8/15–30 (Atisara-Grahani Nidana)',
      chikitsaRef: 'Ashtanga Hridaya, Chikitsa Sthana 10/1–92 (Grahani Dosha Chikitsa)',
      nidanaSanskrit: 'अतिसारनिदानैस्तु पुनश्चाग्निं प्रदूषयन्... बद्धं द्रवं वा वर्चश्च सृजति ग्रहणीगदः ॥',
      nidanaTranslit: 'Atisāra-nidānais tu punaś cāgniṁ pradūṣayan... baddhaṁ dravaṁ vā varcaś ca sṛjati grahaṇī-gadaḥ ||',
      nidanaMeaning: 'Indulging in improper diet while Agni is still weak impairs the Grahani, causing alternating constipation and loose unformed stools.',
      sutraText: 'पेयादिरेव ग्रहणीगदेषु... तक्रं तु सेव्यं ग्रहणीविकारे ॥ (A.H. Chi. 10/2, 34)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Vagbhata Dadimashtaka & Takrarishta in Grahani',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 10/32–45',
          shlokaSanskrit: 'तक्रं ग्राहि कषायोष्णं लघु दीपनपाचनम्... दाडिमाष्टकचूर्णं च ग्रहणीदोषनाशनम् ॥',
          shlokaTransliteration: 'Takraṁ grāhi kaṣāyoṣṇaṁ laghu dīpana-pācanam... dāḍimāṣṭaka-cūrṇaṁ ca grahaṇī-doṣa-nāśanam ||',
          meaning: 'Takra (buttermilk) and Dadimashtaka Churna are Deepana, Pachana, and Grahi, curing Grahani Dosha.',
        },
      ],
      shamana: [
        {
          category: 'Churna & Arishta',
          medicineName: 'Dadimashtaka Churna (3 g BD) & Takrarishta (20 mL BD)',
          dosage: '3 g Churna + 20 mL Takrarishta BD',
          anupana: 'Warm water or buttermilk',
          timing: 'After meals',
          indications: 'Restores Jatharagni and checks post-prandial gastrocolic reflex',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 10/32–52',
        },
      ],
      shodhana: [
        {
          procedure: 'Takra Prayoga & Deepana Basti',
          indication: 'Vataja & Kaphaja Grahani.',
          details: '14-day Takra Kalpana regimen with Chitrakadi Vati.',
        },
      ],
    },
    chakradatta: {
      diseaseRef: 'Madhava Nidana 4/1–22 & Chakradatta Ch. 4 (Grahani Chikitsa)',
      chikitsaRef: 'Chakradatta, Chapter 4 (Grahani Chikitsa)',
      nidanaSanskrit: 'मुहुर्बद्धं मुहुर्द्रवं पक्वमामं सवेदनम्... संग्रहग्रहणीरोगं तं विद्यात्कफवातजम् ॥',
      nidanaTranslit: 'Muhur baddhaṁ muhur dravaṁ pakvam āmaṁ savedanam... saṁgraha-grahaṇī-rogaṁ taṁ vidyāt kaphavātajam ||',
      nidanaMeaning: 'Alternating bound and loose stools mixed with mucus and abdominal borborygmi (Antrakujana) characterizes Sangraha Grahani (IBS).',
      sutraText: 'रसपर्पटिका सेव्या... नागरातिविषा मुस्ता क्वाथश्चात्र प्रशस्यते ॥ (Chakradatta 4)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Nagaradi Kwatha & Parpati Kalpana in Grahani',
          reference: 'Chakradatta, Grahani Chikitsa 4/10 & 4/85',
          shlokaSanskrit: 'नागरातिविषामुस्ताक्वाथः स्यादामपाचनः । पर्पटीरसयोगश्च ग्रहणीगदनाशनः ॥',
          shlokaTransliteration: 'Nāgarātiviṣā-mustā-kvāthaḥ syād āmapācanaḥ | Parpaṭī-rasa-yogaś ca grahaṇī-gada-nāśanaḥ ||',
          meaning: 'Decoction of Sunthi, Ativisha, and Musta digests Ama, while Rasa Parpati with Takra cures severe Grahani Roga.',
        },
      ],
      shamana: [
        {
          category: 'Parpati Kalpana',
          medicineName: 'Panchamrita Parpati / Rasa Parpati + Sanjivani Vati',
          dosage: '125 mg–250 mg Parpati BD + 1 tab Sanjivani Vati BD',
          anupana: 'Roasted Jeeraka Churna + Takra (Buttermilk)',
          timing: 'After meals',
          indications: 'Gold-standard Chakradatta & Rasa Shastra therapy for Sangrahani / IBS / Ulcerative Colitis',
          reference: 'Chakradatta, Grahani Chikitsa 4/85',
        },
        {
          category: 'Avaleha',
          medicineName: 'Kalyanakesara / Bilwadi Avaleha',
          dosage: '5 g BD',
          anupana: 'Takra',
          timing: 'After meals',
          indications: 'Binds loose mucus stools and heals colonic mucosa',
          reference: 'Chakradatta, Grahani Chikitsa 4',
        },
      ],
      shodhana: [
        {
          procedure: 'Takra-Parpati Kalpa',
          indication: 'Chronic Sangraha Grahani.',
          details: 'Graduated Parpati regimen with exclusively Takra-based Pathya diet.',
        },
      ],
    },
    sharangadhara: {
      diseaseRef: 'Sharangadhara Samhita, Purva Khanda 7/20',
      chikitsaRef: 'Sharangadhara Samhita, Madhyama Khanda 6/42 (Gangadhara Churna) & 10 (Kutajarishta)',
      nidanaSanskrit: 'ग्रहणीदोषनाशाय चूर्णं गङ्गाधरं परम् । कुटजारिष्टयोगश्च सर्वसंग्रहणीहरः ॥',
      nidanaTranslit: 'Grahaṇī-doṣa-nāśāya cūrṇaṁ gaṅgādharaṁ param | Kuṭajāriṣṭa-yogaś ca sarva-saṁgrahaṇī-haraḥ ||',
      nidanaMeaning: 'Vriddha Gangadhara Churna and Kutajarishta are the premier Bhaishajya formulations for curing Grahani and chronic diarrhea.',
      sutraText: 'मुस्तमिन्द्रयवं बिल्वं लोध्रं मोचरसं तथा... चूर्णं गङ्गाधरं नाम ग्रहणीदोषनाशनम् ॥ (Sha. Ma. 6/42)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Gangadhara Churna for Grahani & Atisara',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 6/42–43',
          shlokaSanskrit: 'मुस्तमिन्द्रयवं बिल्वं लोध्रं मोचरसं तथा । धातकीं च समं कुर्याच्चूर्णं तण्डुलवारिणा... गङ्गाधरमिति ख्यातम् ॥',
          shlokaTransliteration: 'Mustam indrayavaṁ bilvaṁ lodhraṁ mocarasaṁ tathā | Dhātakīṁ ca samaṁ kuryāc cūrṇaṁ taṇḍulavāriṇā... gaṅgādharam iti khyātam ||',
          meaning: 'Gangadhara Churna prepared with equal parts Musta, Indrayava, Bilva, Lodhra, Mocharasa, and Dhataki taken with Tandulodaka or Takra arrests all types of Grahani and Atisara.',
        },
      ],
      shamana: [
        {
          category: 'Churna Kalpana',
          medicineName: 'Vriddha Gangadhara Churna (Sha. Ma. 6/42)',
          dosage: '3 g–5 g BD',
          anupana: 'Takra (Buttermilk) or Tandulodaka',
          timing: 'After meals',
          indications: 'Checks frequent bowel movements, mucus, and tenesmus in IBS-D',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 6/42–45',
        },
        {
          category: 'Sandhana Kalpana',
          medicineName: 'Kutajarishta (Sha. Ma. 10/44) &Jatiphaladi Churna',
          dosage: '20 mL Kutajarishta BD',
          anupana: 'Equal warm water',
          timing: 'After meals',
          indications: 'Potent Sangrahi, Deepana, and antiprotozoal action',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 10/44',
        },
      ],
      shodhana: [
        {
          procedure: 'Pichha Basti (Uttara Khanda Ch. 6)',
          indication: 'Chronic Grahani with mucosal irritation.',
          details: 'Mocharasa-Bilva Siddha Pichha Basti.',
        },
      ],
    },
  },

  // 5. ARSHA (HEMORRHOIDS / PILES)
  arsha: {
    diseaseName: 'Arsha (Hemorrhoids / Piles)',
    charaka: {
      diseaseRef: 'Charaka Samhita, Chikitsa Sthana 14/5–32 (Arsha Chikitsa)',
      chikitsaRef: 'Charaka Samhita, Chikitsa Sthana 14/33–254',
      nidanaSanskrit: 'गूढोच्छ्रिताः संवलिताः गुदवल्लीषु कीलकाः । मन्दाग्नेरुपजायन्ते तान्यर्शांसीति निर्दिशेत् ॥',
      nidanaTranslit: 'Gūḍhocchritāḥ saṁvalitāḥ gudavallīṣu kīlakāḥ | Mandāgner upajāyante tāny arśāṁsīti nirdiśet ||',
      nidanaMeaning: 'Fleshy polypoid projections (Mamsa-ankura / Kilaka) arising in the three Gudavalis (anal folds) due to Mandagni and Apana Vata-vitiation are called Arsha (hemorrhoids).',
      sutraText: 'शुष्काणां तक्रकल्पस्तु रक्तार्शसां च शोणितस्थापनम्... अग्निदीपनमनुलोमनं च परं हितम् ॥ (Ch. Chi. 14/38, 182)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Abhayarishta & Takra Prayoga in Shushka Arsha',
          reference: 'Charaka Samhita, Chikitsa Sthana 14/64 & 14/138',
          shlokaSanskrit: 'नरो हिताशी सप्ताहं दशाहं पक्षमेव वा । तक्रं सेवेत... अभयारिष्टयोगश्च सर्वार्शोनाशनः परः ॥',
          shlokaTransliteration: 'Naro hitāśī saptāhaṁ daśāhaṁ pakṣam eva vā | Takraṁ seveta... abhayāriṣṭa-yogaś ca sarvārśo-nāśanaḥ paraḥ ||',
          meaning: 'Takra (buttermilk) and Abhayarishta are the supreme remedies for eradicating Arsha and preventing recurrence by correcting Mandagni and Apana-Vaigunya.',
        },
        {
          title: 'Shloka 2: Kutajadi Rasakriya & Raktastambhana in Sravi (Bleeding) Arsha',
          reference: 'Charaka Samhita, Chikitsa Sthana 14/188–195',
          shlokaSanskrit: 'कुटजत्वङ्निर्यूहः सनागरः शोणितं जयत्यतिप्रवृत्तम्... समङ्गादिचूर्णं च रक्तार्शोघ्नम् ॥',
          shlokaTransliteration: 'Kuṭajatvaṅ-niryūhaḥ sanāgaraḥ śoṇitaṁ jayaty atipravṛttam... samaṅgādi-cūrṇaṁ ca raktārśoghnam ||',
          meaning: 'Kutaja bark decoction with Sunthi and Nagakesara-Samangadi Churna rapidly arrests bleeding from Raktarsha (bleeding piles).',
        },
      ],
      shamana: [
        {
          category: 'Arishta',
          medicineName: 'Abhayarishta',
          dosage: '20 mL BD',
          anupana: 'Equal quantity of lukewarm water',
          timing: 'After meals',
          indications: 'Kindles Jatharagni, softens stools (Vatanulomana), and shrinks hemorrhoidal cushions',
          reference: 'Charaka Samhita, Chikitsa Sthana 14/138–143',
        },
        {
          category: 'Vati / Gutika',
          medicineName: 'Kankayana Vati (Arshas) / Arshoghni Vati',
          dosage: '2 tablets (250 mg) BD',
          anupana: 'Takra (Buttermilk)',
          timing: 'After meals',
          indications: 'Specifically indicated for Shushka (non-bleeding/thrombosed) Arsha',
          reference: 'Charaka Samhita, Chikitsa Sthana 14 / Bhaishajya Ratnavali',
        },
        {
          category: 'Raktastambhaka Churna (For Bleeding Piles)',
          medicineName: 'Bolbaddha Ras (250 mg BD) + Nagakesara Churna (2 g BD)',
          dosage: '1 tablet + 2 g Churna BD',
          anupana: 'Navaneeta (fresh butter) or Tandulodaka',
          timing: 'After meals',
          indications: 'Rapidly stops bright red rectal bleeding in Raktarsha',
          reference: 'Charaka Samhita, Chikitsa Sthana 14/213',
        },
      ],
      shodhana: [
        {
          procedure: 'ushna Jala Avagaha Sweda (Warm Sitz Bath with Triphala Kwatha) & Pichha Basti',
          indication: 'Painful thrombosed piles (Avagaha) and bleeding Raktarsha (Pichha Basti — Ch. Chi. 14/224).',
          details: 'Warm Triphala-Panchavalkala Kwatha Sitz bath twice daily + Jatyadi/Kasisadi Taila Matra Basti (20 mL).',
        },
      ],
    },
    sushruta: {
      diseaseRef: 'Sushruta Samhita, Nidana Sthana 2/1–17 (Arsha Nidana)',
      chikitsaRef: 'Sushruta Samhita, Chikitsa Sthana 6/1–20 (Arsha Chikitsa — Chaturvidha Upaya)',
      nidanaSanskrit: 'चतुर्विधोऽर्शसां साधनोपायः — भेषजं क्षारोऽग्निः शस्त्रमिति ॥',
      nidanaTranslit: 'Caturvidho’rśasāṁ sādhanopāyaḥ — bheṣajaṁ kṣāro’gniḥ śastram iti ||',
      nidanaMeaning: 'Acharya Sushruta codifies the famous Fourfold Therapeutic Protocol for Arsha: 1. Bheshaja (Medicine — for recent Grade I piles), 2. Kshara Karma (Alkali cauterization — for soft, vascular Grade II–III piles), 3. Agnikarma (Thermal cautery — for rough, fibrous piles), and 4. Shastra Karma (Excision — for large pedunculated Grade IV piles).',
      sutraText: 'तत्राचिरकालजातान्यल्पदोषलिङ्गोपद्रवाणि भेषजसाध्यानि; मृदुप्रसृतानि क्षारेण; कर्कशस्थिराण्यग्निना; तनुमूलान्युच्छ्रितानि शस्त्रेण ॥ (Su. Chi. 6/3)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Sushruta’s Famous Chaturvidha Arsha Chikitsa Sutra',
          reference: 'Sushruta Samhita, Chikitsa Sthana 6/3',
          shlokaSanskrit: 'चतुर्विधोऽर्शसां साधनोपायः — भेषजं क्षारोऽग्निः शस्त्रमिति । तत्राचिरकालजातानि भेषजसाध्यानि, मृदुप्रसृतानि क्षारेण, कर्कशस्थिराण्यग्निना, तनुमूलान्युच्छ्रितानि शस्त्रेण ॥',
          shlokaTransliteration: 'Caturvidho’rśasāṁ sādhanopāyaḥ — bheṣajaṁ kṣāro’gniḥ śastram iti | Tatrācirakālajātāni bheṣajasādhyāni, mṛdu-prasṛtāni kṣāreṇa, karkaśa-sthirāṇy agninā, tanumūlāny ucchritāni śastreṇa ||',
          meaning: 'Recent mild piles are cured by Bheshaja; soft spreading vascular internal piles by Pratisaraniya Kshara; rough hard piles by Agnikarma; and narrow-pedicle protruding piles by Shastra Karma (excision/Ksharasutra ligation).',
        },
      ],
      shamana: [
        {
          category: 'Leha &Guggulu',
          medicineName: 'Suranavaleha / Bahushala Guda & Triphala Guggulu',
          dosage: '5 g Leha BD + 2 tablets Triphala Guggulu BD',
          anupana: 'Warm water or Takra',
          timing: 'After meals',
          indications: 'Shrinks Mamsa-ankura (pile mass) and relieves perianal inflammation',
          reference: 'Sushruta Samhita, Chikitsa Sthana 6/13–16',
        },
        {
          category: 'Bahya Taila',
          medicineName: 'Kasisadi Taila (Intrarectal Application)',
          dosage: '3–5 mL per-rectal application BD',
          anupana: 'After Triphala Sitz bath',
          timing: 'Morning after defecation & Bedtime',
          indications: 'Scleroses and shrinks Grade I–II internal hemorrhoids',
          reference: 'Sushruta Samhita, Chikitsa Sthana 6 / Bhaishajya Ratnavali',
        },
      ],
      shodhana: [
        {
          procedure: 'Pratisaraniya Kshara Karma / Ksharasutra Ligation',
          indication: 'Grade II & III internal bleeding/prolapsing hemorrhoids (Su. Chi. 6/3).',
          details: 'Application of Apamarga Pratisaraniya Teekshna Kshara via slit proctoscope for 100 Matra-kala (~1 min) until Pakva-Jambu-phala varna (blackberry color) is achieved, then neutralized with Nimbu Swarasa.',
        },
      ],
      paraSurgical: {
        therapyName: 'Agnikarma',
        procedureNotes: 'Pratisaraniya Kshara Karma for soft vascular internal piles, and Agnikarma / Ksharasutra transfixation for fibrous external/intero-external pile masses.',
        siteAndInstruments: 'Arsho-yantra (Slit Proctoscope), Apamarga Kshara, Nimbu Swarasa, Jatyadi Ghrita.',
      },
    },
    vagbhata: {
      diseaseRef: 'Ashtanga Hridaya, Nidana Sthana 7/1–59 (Arsha Nidana)',
      chikitsaRef: 'Ashtanga Hridaya, Chikitsa Sthana 8/1–164 (Arsha Chikitsa)',
      nidanaSanskrit: 'अर्शांसि दुरधिष्ठानं... सूरणः सर्वशः श्रेष्ठो गुदजानां निवृत्तये ॥',
      nidanaTranslit: 'Arśāṁsi duradhiṣṭhānaṁ... sūraṇaḥ sarvaśaḥ śreṣṭho gudajānāṁ nivṛttaye ||',
      nidanaMeaning: 'Surana (elephant foot yam) and Takra are the foremost Pathya and medicine for eradicating Gudaja (Arsha).',
      sutraText: 'अग्निबलवृद्धिरदौ कार्या... सूरणो गुदजानां हि परं भैषज्यमुच्यते ॥ (A.H. Chi. 8/62)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Surana & Chiruvilwadi Kashaya in Arsha',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 8/32–62',
          shlokaSanskrit: 'चिरबिल्वोऽग्निकः पथ्या... कषायोऽर्शोविनाशनः । सूरणः सर्वशः श्रेष्ठो गुदजानां निवृत्तये ॥',
          shlokaTransliteration: 'Cirabilvo’gnikaḥ pathyā... kaṣāyo’rśo-vināśanaḥ | Sūraṇaḥ sarvaśaḥ śreṣṭho gudajānāṁ nivṛttaye ||',
          meaning: 'Chiruvilwadi Kashaya (Chirabilva, Chitraka, Haritaki, Punarnava, Sunthi, Saindhava) and Surana are supreme for curing Arsha.',
        },
      ],
      shamana: [
        {
          category: 'Kashaya',
          medicineName: 'Chiruvilwadi Kashayam',
          dosage: '15 mL Kashayam + 45 mL lukewarm water BD',
          anupana: '1 pinch Saindhava Lavana',
          timing: 'Before meals',
          indications: 'Specific Ashtanga Hridaya formulation for internal & external hemorrhoids, fistula, and constipation',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 8 / Sahasrayogam',
        },
        {
          category: 'Gutika / Leha',
          medicineName: 'Suranavaleha & Kankayana Gutika',
          dosage: '5 g Leha + 2 tablets BD',
          anupana: 'Takra',
          timing: 'After meals',
          indications: 'Shrinks pile masses and restores Agni',
          reference: 'Ashtanga Hridaya, Chikitsa Sthana 8/55–63',
        },
      ],
      shodhana: [
        {
          procedure: 'Avagaha Sweda & Kasisadi Taila Matra Basti',
          indication: 'Congested painful hemorrhoids.',
          details: 'Warm Sitz bath and 20 mL Kasisadi/Pippalyadi Taila Anuvasana.',
        },
      ],
    },
    chakradatta: {
      diseaseRef: 'Madhava Nidana 5/1–44 & Chakradatta Ch. 5 (Arsha Chikitsa)',
      chikitsaRef: 'Chakradatta, Chapter 5 (Arsha Chikitsa)',
      nidanaSanskrit: 'अर्शोघ्नी वटिका सेव्या सूरणः पुटपाचितः । समङ्गानागकेशरचूर्णं रक्तार्शसां हितम् ॥',
      nidanaTranslit: 'Arśoghnī vaṭikā sevyā sūraṇaḥ puṭapācitaḥ | Samaṅgā-nāgakeśara-cūrṇaṁ raktārśasāṁ hitam ||',
      nidanaMeaning: 'Putapaka-steamed Surana, Kankayana Gutika, and Nagakesara-Lajjalu Churna with butter cure Shushka and Sravi Arsha.',
      sutraText: 'नवनीततिलैः सार्धं नागकेशरचूर्णकम् । भक्षितं नियतं हन्ति रक्तार्शांसि न संशयः ॥ (Chakradatta 5/112)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Nagakesara Churna for Bleeding Piles (Raktarsha)',
          reference: 'Chakradatta, Arsha Chikitsa 5/112',
          shlokaSanskrit: 'नवनीतशर्कराभ्यां नागकेशरचूर्णकम् । भक्षितं नियतं हन्ति रक्तार्शांसि न संशयः ॥',
          shlokaTransliteration: 'Navanīta-śarkarābhyāṁ nāgakeśara-cūrṇakam | Bhakṣitaṁ niyataṁ hanti raktārśāṁsi na saṁśayaḥ ||',
          meaning: 'Nagakesara Churna taken with fresh butter (Navaneeta) and Mishri unfailingly stops bleeding in Raktarsha.',
        },
      ],
      shamana: [
        {
          category: 'Churna & Vati',
          medicineName: 'Nagakesara Churna (3 g BD with Butter) + Arshoghni Vati (2 tabs BD)',
          dosage: '3 g Churna + 2 tablets BD',
          anupana: 'Fresh Navaneeta (for bleeding) or Takra',
          timing: 'After meals',
          indications: 'Immediate hemostasis in bleeding piles and shrinkage of pile mass',
          reference: 'Chakradatta, Arsha Chikitsa 5/112',
        },
      ],
      shodhana: [
        {
          procedure: 'Kshara Lepa & Triphala Avagaha Sweda',
          indication: 'Prolapsing hemorrhoidal masses.',
          details: 'Haridra-Snuhi Kshara Lepa or Ksharasutra.',
        },
      ],
    },
    sharangadhara: {
      diseaseRef: 'Sharangadhara Samhita, Purva Khanda 7/21',
      chikitsaRef: 'Sharangadhara Samhita, Madhyama Khanda 7/68 (Triphala Guggulu) & 10/19 (Abhayarishta)',
      nidanaSanskrit: 'अभयारिष्टयोगेन त्रिफलागुग्गुलुस्तथा । गुदजानि निहन्त्याशु कासीसादिकतैलतः ॥',
      nidanaTranslit: 'Abhayāriṣṭa-yogena triphalā-guggulus tathā | Gudajāni nihanty āśu kāsīsādika-tailataḥ ||',
      nidanaMeaning: 'Abhayarishta, Triphala Guggulu, and Kasisadi Taila rapidly cure Gudaja (Arsha/piles) and perianal pain.',
      sutraText: 'गुदजानां च शूलेषु भगन्दररुजासु च । त्रिफलागुग्गुलुः श्रेष्ठः सहैवाभयारिष्टकः ॥ (Sha. Ma. 7/68 & 10/19)',
      chikitsaShlokas: [
        {
          title: 'Shloka 1: Triphala Guggulu & Abhayarishta for Gudaja (Arsha)',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/68 & 10/19–22',
          shlokaSanskrit: 'त्रिफलायास्त्रयो भागाः कृष्णायाश्चैकभागिकः... गुल्मशोथार्शसां हन्ता त्रिफलागुग्गुलुः स्मृतः ॥',
          shlokaTransliteration: 'Triphalāyās trayo bhāgāḥ kṛṣṇāyāś caika-bhāgikaḥ... gulma-śothārśasāṁ hantā triphalā-gugguluḥ smṛtaḥ ||',
          meaning: 'Triphala Guggulu (3 parts Triphala, 1 part Pippali, 5 parts Guggulu) combined with Abhayarishta destroys Arsha, Shotha, and Bhagandara.',
        },
      ],
      shamana: [
        {
          category: 'Guggulu & Arishta',
          medicineName: 'Triphala Guggulu (2 tabs BD) + Abhayarishta (20 mL BD)',
          dosage: '2 tablets + 20 mL BD',
          anupana: 'Warm water',
          timing: 'After meals',
          indications: 'Relieves hemorrhoidal venous congestion, pain, and constipation',
          reference: 'Sharangadhara Samhita, Madhyama Khanda 7/68 & 10/19',
        },
      ],
      shodhana: [
        {
          procedure: 'Kasisadi Taila Pichu / Basti & Avagaha Sweda',
          indication: 'Internal and external hemorrhoids.',
          details: 'Intrarectal Kasisadi Taila application twice daily.',
        },
      ],
    },
  },
};
