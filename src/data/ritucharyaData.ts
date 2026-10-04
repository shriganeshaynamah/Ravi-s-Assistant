import type { RitucharyaSeason } from '../types';

export const RITUCHARYA_SEASONS: RitucharyaSeason[] = [
  {
    id: 'shishira',
    nameSanskrit: 'Shishira Ritu (शिशिर ऋतु)',
    nameEnglish: 'Late Winter',
    indianMonths: 'Magha - Phalguna (माघ - फाल्गुन)',
    englishMonths: 'Mid-January to Mid-March',
    kala: 'Adana Kala (Northern / Sun drawing strength)',
    bodilyStrength: 'High (Uttama Bala)',
    doshaState: {
      vata: 'Normal / Mild accumulation',
      pitta: 'Pacified (Shama)',
      kapha: 'Sanchaya (Accumulating due to cold)',
    },
    dominantRasas: ['Tikta (Bitter dominant)', 'Madhura (Sweet nourishing)'],
    aharaRegimen: [
      'Unctuous (Snigdha), sweet, sour and salty warm meals',
      'Warm milk with saffron, turmeric, and dry fruits',
      'Wheat, new rice, black gram (Urad dal), and hot vegetable soups',
      'Pure cow ghee and sesame oil preparations',
      'Ginger, black pepper and piping hot herbal decoctions (Kashaya)',
    ],
    viharaRegimen: [
      'Regular whole-body warm oil massage (Abhyanga with sesame oil)',
      'Warm water baths and sauna / herbal steam (Swedana)',
      'Sunbathing (Atapa Sevana) during morning hours',
      'Wearing thick warm, protective woollen clothing',
      'Staying in well-insulated, warm, draft-free living quarters',
    ],
    varjyaRegimen: [
      'Cold, dry, stale, light foods and raw chilled salads',
      'Cold water baths or swimming in cold water bodies',
      'Exposure to severe cold winds (Pravata)',
      'Skipping meals or excessive fasting (Langhana) as Agni is strong',
      'Day sleeping (Diva Swapna)',
    ],
    clinicalNotes:
      'In Shishira, external cold constricts body pores; Jatharagni becomes powerful. If adequate unctuous food is not supplied, intense Agni consumes bodily tissues (Dhatus).',
  },
  {
    id: 'vasanta',
    nameSanskrit: 'Vasanta Ritu (वसन्त ऋतु)',
    nameEnglish: 'Spring',
    indianMonths: 'Chaitra - Vaishakha (चैत्र - वैशाख)',
    englishMonths: 'Mid-March to Mid-May',
    kala: 'Adana Kala (Northern solstitial period)',
    bodilyStrength: 'Medium (Madhyama Bala)',
    doshaState: {
      vata: 'Normal (Prakruti)',
      pitta: 'Normal / Gradual warming',
      kapha: 'Prakopa (Severe Aggravation & Liquefaction)',
    },
    dominantRasas: ['Kashaya (Astringent dominant)', 'Katu (Pungent)'],
    aharaRegimen: [
      'Easily digestible, light, dry (Ruksha) and warm meals',
      'Old barley (Yava), wheat, roasted moong dal, and roasted chickpeas',
      'Bitter, pungent and astringent tastes (Tikta, Katu, Kashaya)',
      'Ginger, black pepper, long pepper (Trikatu), and honey (Madhu)',
      'Neem flower decoctions and warm spiced herbal teas',
    ],
    viharaRegimen: [
      'Dry powder massage (Udvartana with triphala/chickpea flour) to scrape fat and kapha',
      'Vigorous physical exercise (Vyayama) and brisk walking',
      'Purifying Panchakarma therapies: Vamana (emesis) and Nasya',
      'Gargling with warm salt-water or Triphala decoction (Kavala)',
      'Enjoying fragrant flower gardens and fresh morning air',
    ],
    varjyaRegimen: [
      'Heavy, cold, excessively oily, sweet and sour foods',
      'Curds / Yogurt (Dahi), buffalo milk, ice creams, chilled beverages',
      'Daytime sleeping (Diva Swapna) — strictly forbidden as it worsens Kapha',
      'Sedentary lifestyle and lack of physical exercise',
    ],
    clinicalNotes:
      'The strong spring sun liquefies the Kapha accumulated during winter, extinguishing the digestive fire (Mandagni) and triggering allergies, coughs, and respiratory disorders.',
  },
  {
    id: 'grishma',
    nameSanskrit: 'Grishma Ritu (ग्रीष्म ऋतु)',
    nameEnglish: 'Summer',
    indianMonths: 'Jyeshtha - Ashadha (ज्येष्ठ - आषाढ)',
    englishMonths: 'Mid-May to Mid-July',
    kala: 'Adana Kala (Peak sun intensity drawing moisture)',
    bodilyStrength: 'Low (Alpa Bala)',
    doshaState: {
      vata: 'Sanchaya (Accumulating due to dryness / Rookshata)',
      pitta: 'Mild increase / heating',
      kapha: 'Prashama (Pacified due to dry heat)',
    },
    dominantRasas: ['Katu (Pungent dominant)', 'Madhura (Sweet soothing)'],
    aharaRegimen: [
      'Cooling, sweet, liquid and easily digestible foods',
      'Barley, old basmati rice, moong dal soup with ghee',
      'Fresh coconut water, sattu drink with cumin, mint syrups',
      'Cold sweetened milk with cardamom, rose water, and sugar candy',
      'Seasonal sweet fruits: watermelon, sweet melons, ripe mangoes',
    ],
    viharaRegimen: [
      'Rest in cool, airy, well-ventilated rooms with water fountains',
      'Applying cooling sandalwood (Chandana) and vetiver (Ushira) paste on skin',
      'Wearing light, thin, clean cotton clothes of white or pastel colors',
      'Pleasant evening strolls under moonlight (Sheetala Kirana)',
      'Short daytime power nap in a cool shaded room (permitted only in Grishma)',
    ],
    varjyaRegimen: [
      'Pungent, sour, salty, deeply fried and ultra-spicy foods',
      'Heavy strenuous physical exertion and extreme workouts',
      'Exposure to scorching direct midday sun (Atapa)',
      'Alcoholic drinks and excessive tea/coffee causing dehydration',
    ],
    clinicalNotes:
      'The scorching sun dries bodily moisture (Snigdhata), weakening physical endurance. Nourishing Rasayana foods and natural hydration prevent dehydration and heat exhaustion.',
  },
  {
    id: 'varsha',
    nameSanskrit: 'Varsha Ritu (वर्षा ऋतु)',
    nameEnglish: 'Monsoon / Rainy Season',
    indianMonths: 'Shravana - Bhadrapada (श्रावण - भाद्रपद)',
    englishMonths: 'Mid-July to Mid-September',
    kala: 'Visarga Kala (Southern / Nourishing period begins)',
    bodilyStrength: 'Low (Alpa Bala transitioning)',
    doshaState: {
      vata: 'Prakopa (Severe Aggravation due to damp cold)',
      pitta: 'Sanchaya (Accumulation due to acidic rainwater)',
      kapha: 'Normal to mild disturbance',
    },
    dominantRasas: ['Amla (Sour dominant)', 'Lavana (Salty)'],
    aharaRegimen: [
      'Fresh, hot, well-cooked, light and easily digestible meals',
      'Aged grains (purana yava, shali rice), moong dal, hot vegetable stews',
      'Soups tempered with a pinch of rock salt (Saindhava), cumin, and dry ginger',
      'Boiled and cooled drinking water (Kwathita Jala)',
      'Small amounts of pure cow ghee to kindle sluggish Agni',
    ],
    viharaRegimen: [
      'Fumigation of dwelling (Dhoopana) with Guggulu, Neem, and mustard seeds',
      'Warm oil massage (Abhyanga) and dry warm baths',
      'Medicated enema therapy (Basti Karma) — prime Ayurvedic therapy for Vata',
      'Keeping feet and body dry; changing damp garments immediately',
      'Footwear at all times; avoiding barefoot contact with muddy grounds',
    ],
    varjyaRegimen: [
      'Drinking raw, unboiled river, well or pond water',
      'Day sleeping (Diva Swapna) and night awakenings (Ratri Jagarana)',
      'Heavy physical exertion, heavy meals, and raw uncooked salads',
      'Walking barefoot in puddles or prolonged exposure to rain drafts',
    ],
    clinicalNotes:
      'Agni is weakened by humidity and water contamination. Atmospheric cold and damp aggravate Vata dosha, while sour rainwater induces Pitta accumulation.',
  },
  {
    id: 'sharad',
    nameSanskrit: 'Sharad Ritu (शरद ऋतु)',
    nameEnglish: 'Autumn',
    indianMonths: 'Ashwina - Kartika (अश्विन - कार्तिक)',
    englishMonths: 'Mid-September to Mid-November',
    kala: 'Visarga Kala (Nourishing period)',
    bodilyStrength: 'Medium (Madhyama Bala)',
    doshaState: {
      vata: 'Prashama (Pacified)',
      pitta: 'Prakopa (Severe Aggravation - "Sharad Pitta")',
      kapha: 'Normal (Prakruti)',
    },
    dominantRasas: ['Lavana (Salty dominant)', 'Madhura & Tikta (Sweet & Bitter soothing)'],
    aharaRegimen: [
      'Sweet, bitter, and astringent tastes (Madhura, Tikta, Kashaya)',
      'Light foods: red shali rice, wheat, green moong, patola (pointed gourd)',
      'Pure medicated bitter ghee (Tikta Ghrita) to cool aggravated Pitta',
      'Amla (Indian gooseberry), raisins, pomegranate, and boiled milk',
      'Hansodaka — pure water naturally energized by day sun and cooled by night moon',
    ],
    viharaRegimen: [
      'Therapeutic purgation (Virechana) and bloodletting (Raktamokshana)',
      'Moonlight exposure (Sheetala Chandrika Sevana) in open terraces',
      'Applying cooling sandalwood paste and wearing pearl garlands',
      'Gentle evening walks in clean, pleasant surroundings',
    ],
    varjyaRegimen: [
      'Hot, sour, salty, spicy foods, mustard oil, and fermented dishes',
      'Curd (Dahi) and alcoholic drinks',
      'Direct daytime sun exposure (Sharad Atapa is fiery and triggers Pitta fevers)',
      'Day sleep and indulgence in excessive anger or stress',
    ],
    clinicalNotes:
      'Sudden intense sun immediately following the damp monsoon causes bodily Pitta to flare up, leading to skin eruptions, acidity, ulcers, and fevers.',
  },
  {
    id: 'hemanta',
    nameSanskrit: 'Hemanta Ritu (हेमन्त ऋतु)',
    nameEnglish: 'Early Winter',
    indianMonths: 'Margashirsha - Pausha (मार्गशीर्ष - पौष)',
    englishMonths: 'Mid-November to Mid-January',
    kala: 'Visarga Kala (Maximum strength / Nourishing phase)',
    bodilyStrength: 'High (Uttama Bala - Peak vitality)',
    doshaState: {
      vata: 'Mild pacification',
      pitta: 'Prashama (Pacified)',
      kapha: 'Sanchaya (Gradual buildup)',
    },
    dominantRasas: ['Madhura (Sweet dominant)', 'Snigdha (Nourishing unctuous)'],
    aharaRegimen: [
      'Rich, nourishing, sweet, sour, and salty preparations',
      'New harvest grains, wheat, black gram, fresh sugarcane juice, jaggery',
      'Milk, ghee, butter, sesame sweets, and energy-dense nuts (badam, walnuts)',
      'Piping hot herbal soups, rasam, and decoctions with ginger and pepper',
      'Ample warm water to maintain digestion without cooling the gut',
    ],
    viharaRegimen: [
      'Daily vigorous full-body Abhyanga with warm sesame or mustard oil',
      'Vigorous physical exercise, wrestling, yoga, and weight training',
      'Warm water bath, herbal steam (Swedana), and warm sun exposure',
      'Wearing warm woollens, socks, and sleeping in cozy warm rooms',
    ],
    varjyaRegimen: [
      'Cold, dry, stale, light foods and cold beverages',
      'Fasting, starvation, or drastically cutting calories (causes tissue depletion)',
      'Exposure to cold drafts and icy winds (Vata Prakopa)',
      'Daytime sleep',
    ],
    clinicalNotes:
      'Digestive fire (Jatharagni) reaches its annual peak due to pore constriction in cold weather. Body can digest heavy, nutrient-dense Rasayana preparations.',
  },
];

/**
 * Returns current season index & object based on today's calendar date
 */
export const getCurrentRitucharya = (): RitucharyaSeason => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Mid-Jan to Mid-Mar: Shishira
  if ((month === 1 && day >= 15) || month === 2 || (month === 3 && day < 15)) {
    return RITUCHARYA_SEASONS[0]; // Shishira
  }
  // Mid-Mar to Mid-May: Vasanta
  if ((month === 3 && day >= 15) || month === 4 || (month === 5 && day < 15)) {
    return RITUCHARYA_SEASONS[1]; // Vasanta
  }
  // Mid-May to Mid-Jul: Grishma
  if ((month === 5 && day >= 15) || month === 6 || (month === 7 && day < 15)) {
    return RITUCHARYA_SEASONS[2]; // Grishma
  }
  // Mid-Jul to Mid-Sep: Varsha
  if ((month === 7 && day >= 15) || month === 8 || (month === 9 && day < 15)) {
    return RITUCHARYA_SEASONS[3]; // Varsha
  }
  // Mid-Sep to Mid-Nov: Sharad
  if ((month === 9 && day >= 15) || month === 10 || (month === 11 && day < 15)) {
    return RITUCHARYA_SEASONS[4]; // Sharad
  }
  // Mid-Nov to Mid-Jan: Hemanta
  return RITUCHARYA_SEASONS[5]; // Hemanta
};
