import { Question, ZoneDef, ZoneId } from '../types';

export const ZONE_DEFINITIONS: Record<ZoneId, ZoneDef> = {
  "house": {
    "id": "house",
    "name": "Village House Lab",
    "x": 160,
    "y": 128,
    "w": 160,
    "h": 128,
    "icon": "🏠",
    "intro": {
      "en": "Welcome to the Village House Lab! Explore how vernacular architecture uses passive cooling, load-bearing walls, and rooftop rainwater harvesting.",
      "hi": "गाँव आवास लैब में आपका स्वागत है! जानें कि पारंपरिक निर्माण कैसे प्राकृतिक ठंडक और छत से वर्षा जल संचयन करता है।",
      "kn": "ಗ್ರಾಮೀಣ ಮನೆ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ಸಾಂಪ್ರದಾಯಿಕ ಕಟ್ಟಡಗಳು ನೈಸರ್ಗಿಕ ತಂಪಾಗಿಸುವಿಕೆ ಮತ್ತು ಮಳೆನೀರು ಕೊಯ್ಲನ್ನು ಹೇಗೆ ಬಳಸುತ್ತವೆ ಎಂದು ತಿಳಿಯಿರಿ."
    }
  },
  "well": {
    "id": "well",
    "name": "Community Well Lab",
    "x": 512,
    "y": 224,
    "w": 128,
    "h": 128,
    "icon": "🪣",
    "intro": {
      "en": "Step into the Community Well Lab! Discover simple machines (pulleys), groundwater hydrology, and the cylinder geometry used to measure water reserve volumes.",
      "hi": "सामुदायिक कुआँ लैब में प्रवेश करें! सरल मशीनों (घिरनी), भूजल स्तर और पानी के आयतन की गणना को समझें।",
      "kn": "ಸಮುದಾಯ ಬಾವಿ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ತಿರುಗುಚಕ್ರಗಳು (ಕප්ಪಿ), ಅಂತರ್ಜಲ ಮಟ್ಟ ಮತ್ತು ಸಿಲಿಂಡರಾಕಾರದ ನೀರಿನ ಪ್ರಮಾಣವನ್ನು ಅನ್ವೇಷಿಸಿ."
    }
  },
  "farm": {
    "id": "farm",
    "name": "Agricultural Farm Lab",
    "x": 800,
    "y": 96,
    "w": 320,
    "h": 256,
    "icon": "🌾",
    "intro": {
      "en": "Enter the Agricultural Farm Lab! Calculate farm areas, crop water requirements, irrigation efficiency, and practical farm economics.",
      "hi": "कृषि फार्म लैब में आपका स्वागत है! खेत का क्षेत्रफल, फसल जल आवश्यकता और सिंचाई दक्षता की गणना करें।",
      "kn": "ಕೃಷಿ ಫಾರ್ಮ್ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ, ಬೆಳೆಗಳಿಗೆ ನೀರಿನ ಅಗತ್ಯ ಮತ್ತು ನೀರಾವರಿ ದಕ್ಷತೆಯನ್ನು ಕಲಿಯಿರಿ."
    }
  },
  "tank": {
    "id": "tank",
    "name": "Overhead Water Tank Lab",
    "x": 160,
    "y": 608,
    "w": 128,
    "h": 128,
    "icon": "🗼",
    "intro": {
      "en": "Explore the Overhead Water Tank Lab! Learn why water tanks are elevated to generate hydrostatic pressure (P = ρgh) without requiring continuous electricity.",
      "hi": "ओवरहेड पानी टंकी लैब में आपका स्वागत है! जानें कि बिना बिजली के पानी पहुंचाने के लिए टंकी को ऊंचाई पर क्यों बनाया जाता है (P = ρgh)।",
      "kn": "ಮೇಲ್ಮಟ್ಟದ ನೀರಿನ ಟ್ಯಾಂಕ್ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ಎತ್ತರದ ಟ್ಯಾಂಕ್‌ಗಳು ನೈಸರ್ಗಿಕ ಜಲಸ್ಥಿತಿ ಒತ್ತಡವನ್ನು (P = ρgh) ಹೇಗೆ ಉತ್ಪಾದಿಸುತ್ತವೆ ಎಂದು ತಿಳಿಯಿರಿ."
    }
  },
  "solar": {
    "id": "solar",
    "name": "Solar Energy Lab",
    "x": 480,
    "y": 704,
    "w": 224,
    "h": 128,
    "icon": "☀️",
    "intro": {
      "en": "Welcome to the Solar Energy Lab! Understand the photovoltaic effect, optimal panel tilt angles, and electrical power generation (P = V × I).",
      "hi": "सौर ऊर्जा लैब में आपका स्वागत है! फोटोवोल्टाइक प्रभाव, पैनल का सही झुकाव कोण और सौर ऊर्जा उत्पादन (P = V × I) को समझें।",
      "kn": "ಸೌರಶಕ್ತಿ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ದ್ಯುತಿವಿದ್ಯುತ್ ಪರಿಣಾಮ, ಪ್ಯಾನಲ್‌ಗಳ ಕೋನ ಮತ್ತು ವಿದ್ಯುತ್ ಶಕ್ತಿ ಉತ್ಪಾದನೆಯನ್ನು (P = V × I) ಕಲಿಯಿರಿ."
    }
  },
  "soil": {
    "id": "soil",
    "name": "Soil Chemistry Lab",
    "x": 864,
    "y": 608,
    "w": 192,
    "h": 160,
    "icon": "🧪",
    "intro": {
      "en": "Welcome to the Soil Chemistry Lab! Test soil pH, classify acidic vs alkaline soil, and discover how agricultural lime or gypsum restores fertility.",
      "hi": "मृदा रसायन लैब में आपका स्वागत है! मिट्टी का pH मापें, अम्लीय और क्षारीय मिट्टी का विश्लेषण करें और चूने या जिप्सम के उपयोग को समझें।",
      "kn": "ಮಣ್ಣಿನ ರಸಾಯನಶಾಸ್ತ್ರ ಲ್ಯಾಬ್‌ಗೆ ಸುಸ್ವಾಗತ! ಮಣ್ಣಿನ pH ಪರೀಕ್ಷಿಸಿ, ಆಮ್ಲೀಯ ಮತ್ತು ಕ್ಷಾರೀಯ ಮಣ್ಣಿನ ವ್ಯತ್ಯಾಸ ಮತ್ತು ಸುಣ್ಣ/ಜಿಪ್ಸಮ್ ಬಳಕೆಯನ್ನು ಕಲಿಯಿರಿ."
    }
  }
};

export const QUESTION_BANK: Question[] = [
  {
    "id": "house.g6.001",
    "zone": "house",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "thermal_reflection",
    "text": {
      "en": "Why are village houses in hot climates frequently painted white with lime whitewash?",
      "hi": "गर्म मौसम में गाँव के घरों की बाहरी दीवारों पर चूने की सफेद पुताई क्यों की जाती है?",
      "kn": "ಬಿಸಿಲು ಹೆಚ್ಚಿರುವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹಳ್ಳಿಯ ಮನೆಗಳಿಗೆ ಸುಣ್ಣದ ಬಿಳಿ ಬಣ್ಣವನ್ನು ಏಕೆ ಹಚ್ಚುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "White surfaces reflect sunlight and keep interiors cooler",
        "White paint attracts rain clouds",
        "White paint makes walls thicker",
        "White paint prevents wind from blowing"
      ],
      "hi": [
        "सफेद रंग धूप को परावर्तित करता है और अंदर ठंडक बनाए रखता है",
        "सफेद रंग बारिश के बादलों को आकर्षित करता है",
        "सफेद रंग दीवारों को मोटा बनाता है",
        "सफेद रंग हवा को चलने से रोकता है"
      ],
      "kn": [
        "ಬಿಳಿ ಬಣ್ಣವು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ ಮತ್ತು ಮನೆಯನ್ನು ತಂಪಾಗಿರಿಸುತ್ತದೆ",
        "ಬಿಳಿ ಬಣ್ಣವು ಮಳೆಯ ಮೋಡಗಳನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ",
        "ಬಿಳಿ ಬಣ್ಣವು ಗೋಡೆಗಳನ್ನು ದಪ್ಪವಾಗಿಸುತ್ತದೆ",
        "ಬಿಳಿ ಬಣ್ಣವು ಗಾಳಿಯನ್ನು ತಡೆಯುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about light colors vs dark colors in the hot sun.",
        "Dark surfaces absorb heat; what do light, reflective surfaces do?"
      ],
      "hi": [
        "धूप में हल्के और गहरे रंगों के अंतर पर विचार करें।",
        "गहरे रंग गर्मी सोखते हैं, तो सफेद रंग क्या करता है?"
      ],
      "kn": [
        "ಬಿಸಿಲಿನಲ್ಲಿ ಬಿಳಿ ಮತ್ತು ಕಪ್ಪು ಬಣ್ಣಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ಯೋಚಿಸಿ.",
        "ಬಿಳಿ ಮೇಲ್ಮೈಯು ಶಾಖವನ್ನು ಹೀರಿಕೊಳ್ಳುವುದಿಲ್ಲ, ಬದಲಾಗಿ..."
      ]
    },
    "explanation": {
      "en": "White surfaces have high albedo (reflectivity), bouncing away solar radiant heat and keeping indoor temperatures 3°C to 5°C lower naturally.",
      "hi": "सफेद सतहें सौर विकिरण को परावर्तित करती हैं, जिससे अंदर का तापमान प्राकृतिक रूप से 3°C से 5°C तक कम रहता है।",
      "kn": "ಬಿಳಿ ಮೇಲ್ಮೈಯು ಸೂರ್ಯನ ವಿಕಿರಣವನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ, ಇದರಿಂದ ಮನೆಯೊಳಗಿನ ಉಷ್ಣತೆಯು 3°C ನಿಂದ 5°C ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "house.g7.002",
    "zone": "house",
    "grade": 7,
    "difficulty": 2,
    "type": "numeric",
    "concept": "rainwater_harvest_volume",
    "text": {
      "en": "A village house has a flat roof measuring 6 metres in length and 5 metres in width. During a heavy monsoon shower, 20 mm of rain falls. Assuming 100% catchment efficiency, how many litres of rainwater can be collected? (Formula: Litres = Area in m² × Rainfall in mm)",
      "hi": "एक घर की छत की लंबाई 6 मीटर और चौड़ाई 5 मीटर है। मानसून की बारिश में 20 मिमी बारिश दर्ज की गई। छत से कितने लीटर पानी संचित किया जा सकता है? (सूत्र: लीटर = क्षेत्रफल वर्ग मीटर में × वर्षा मिमी में)",
      "kn": "ಒಂದು ಮನೆಯ ಛಾವಣಿಯು 6 ಮೀಟರ್ ಉದ್ದ ಮತ್ತು 5 ಮೀಟರ್ ಅಗಲವಿದೆ. 20 ಮಿಮೀ ಮಳೆಯಾದರೆ, ಒಟ್ಟು ಎಷ್ಟು ಲೀಟರ್ ನೀರನ್ನು ಸಂಗ್ರಹಿಸಬಹುದು? (ಸೂತ್ರ: ಲೀಟರ್ = ವಿಸ್ತೀರ್ಣ ಚ.ಮೀ × ಮಳೆ ಮಿಮೀ)"
    },
    "numeric": {
      "answer": 600,
      "tolerance": 5,
      "unit": "litres"
    },
    "hints": {
      "en": [
        "First find the roof area: Area = Length × Width = 6 × 5 = 30 m².",
        "Now multiply Area (30 m²) by rainfall depth (20 mm)."
      ],
      "hi": [
        "पहले छत का क्षेत्रफल निकालें: 6 × 5 = 30 वर्ग मीटर।",
        "अब क्षेत्रफल (30) को वर्षा (20 मिमी) से गुणा करें।"
      ],
      "kn": [
        "ಮೊದಲು ಛಾವಣಿಯ ವಿಸ್ತೀರ್ಣವನ್ನು ಲೆಕ್ಕ ಹಾಕಿ: 6 × 5 = 30 ಚ.ಮೀ.",
        "ನಂತರ ವಿಸ್ತೀರ್ಣವನ್ನು ಮಳೆಯ ಪ್ರಮಾಣದಿಂದ ಗುಣಿಸಿ: 30 × 20 = ?"
      ]
    },
    "explanation": {
      "en": "Roof Area = 6m × 5m = 30 m². Volume = 30 m² × 0.02 m = 0.6 m³ = 600 Litres (since 1 m³ = 1000 Litres, 1 mm rain on 1 m² = 1 Litre).",
      "hi": "छत का क्षेत्रफल = 6 × 5 = 30 वर्ग मीटर। वर्षा जल = 30 × 20 = 600 लीटर (1 वर्ग मीटर पर 1 मिमी वर्षा = 1 लीटर)।",
      "kn": "ಛಾವಣಿಯ ವಿಸ್ತೀರ್ಣ = 30 ಚ.ಮೀ. 1 ಚ.ಮೀ ಜಾಗದಲ್ಲಿ 1 ಮಿಮೀ ಮಳೆಯಾದರೆ 1 ಲೀಟರ್ ನೀರು ದೊರೆಯುತ್ತದೆ. ಆದ್ದರಿಂದ 30 × 20 = 600 ಲೀಟರ್."
    }
  },
  {
    "id": "house.g6.003",
    "zone": "house",
    "grade": 6,
    "difficulty": 1,
    "type": "fill_blank",
    "concept": "ventilation_convection",
    "text": {
      "en": "Warm air is lighter than cold air and rises upward towards high ceiling vents by the process of _______ currents.",
      "hi": "गर्म हवा ठंडी हवा की तुलना में हल्की होकर ऊपर उठती है, इस प्रक्रिया को _______ धाराएं कहते हैं।",
      "kn": "ಬಿಸಿ ಗಾಳಿಯು ತಂಪಾದ ಗಾಳಿಗಿಂತ ಹಗುರವಾಗಿದ್ದು ಮೇಲಕ್ಕೆ ಏರುತ್ತದೆ. ಈ ಪ್ರಕ್ರಿಯೆಯನ್ನು _______ ಎನ್ನಲಾಗುತ್ತದೆ."
    },
    "blanks": [
      {
        "answer": [
          "convection",
          "संवहन",
          "ಸಂವಹನ"
        ]
      }
    ],
    "hints": {
      "en": [
        "It starts with the letter C (Heat transfer in fluids and gases).",
        "Convection currents allow cross-ventilation."
      ],
      "hi": [
        "यह \"संवहन\" (Convection) कहलाता है।",
        "तरल और गैसों में ऊष्मा संचरण।"
      ],
      "kn": [
        "ಇದನ್ನು \"ಸಂವಹನ\" (Convection) ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಸಂವಹನ ಪ್ರಕ್ರಿಯೆಯಿಂದ ಬಿಸಿ ಗಾಳಿಯು ಮೇಲಿನ ಕಿಂಡಿಗಳ ಮೂಲಕ ಹೊರಹೋಗಿ, ಕೆಳಗಿನ ಕಿಟಕಿಗಳಿಂದ ತಂಪಾದ ಗಾಳಿ ಒಳಬರುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Convection currents cause warm indoor air to rise and exit through roof ventilators, drawing cool outdoor air through lower windows.",
      "hi": "संवहन धाराओं के कारण गर्म हवा ऊपर उठकर वेंटिलेटर से बाहर निकल जाती है और खिड़कियों से ताज़ी हवा अंदर आती है।",
      "kn": "ಸಂವಹನ ಪ್ರಕ್ರಿಯೆಯಿಂದ ಬಿಸಿ ಗಾಳಿಯು ಮೇಲಿನ ಕಿಂಡಿಗಳ ಮೂಲಕ ಹೊರಹೋಗಿ, ಕೆಳಗಿನ ಕಿಟಕಿಗಳಿಂದ ತಂಪಾದ ಗಾಳಿ ಒಳಬರುತ್ತದೆ."
    }
  },
  {
    "id": "house.g7.004",
    "zone": "house",
    "grade": 7,
    "difficulty": 2,
    "type": "scenario",
    "concept": "building_materials_thermal_mass",
    "text": {
      "en": "A village panchayat must choose between unburnt mud-adobe bricks and thin corrugated tin sheets for a community shelter. Why are mud-adobe walls superior for indoor temperature comfort?",
      "hi": "पंचायत को सामुदायिक शेड के लिए मिट्टी की ईंटों और लोहे की पतली टिन शीट में से चुनना है। मिट्टी की दीवारें अंदरूनी तापमान के लिए बेहतर क्यों हैं?",
      "kn": "ಪಂಚಾಯತಿಯು ಮಣ್ಣಿನ ಇಟ್ಟಿಗೆಗಳು ಮತ್ತು ತೆಳುವಾದ ತಗಡಿನ ಶೀಟುಗಳ ನಡುವೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು. ತಾಪಮಾನ ನಿಯಂತ್ರಣಕ್ಕೆ ಮಣ್ಣಿನ ಗೋಡೆಗಳು ಏಕೆ ಉತ್ತಮ?"
    },
    "options": {
      "en": [
        "Mud has high thermal mass and low thermal conductivity, delaying heat transfer",
        "Mud produces heat during the daytime",
        "Tin sheets block 100% of cosmic rays",
        "Mud dissolves in heat"
      ],
      "hi": [
        "मिट्टी की तापीय धारिता अधिक होती है, जो दिन की गर्मी को अंदर आने से रोकती है",
        "मिट्टी दिन में गर्मी उत्पन्न करती है",
        "टिन शीट धूप को पूरी तरह रोकती है",
        "मिट्टी गर्मी में पिघल जाती है"
      ],
      "kn": [
        "ಮಣ್ಣು ಹೆಚ್ಚಿನ ಉಷ್ಣ ಸಾಮರ್ಥ್ಯವನ್ನು ಹೊಂದಿದ್ದು, ಶಾಖವನ್ನು ನಿಧಾನವಾಗಿ ವರ್ಗಾಯಿಸುತ್ತದೆ",
        "ಮಣ್ಣು ಹಗಲಿನಲ್ಲಿ ಶಾಖವನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ",
        "ತಗಡಿನ ಶೀಟುಗಳು ತಂಪನ್ನು ಒಳಗೆ ತರುತ್ತವೆ",
        "ಮಣ್ಣು ಶಾಖದಲ್ಲಿ ಕರಗುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about why mud pots keep water cool and mud walls feel pleasant at noon.",
        "Step 2: Consider how building materials thermal mass works: Mud-adobe has high thermal mass; it absorbs ambient heat slowly during scorching days and radiates it back during cooler nights."
      ],
      "hi": [
        "सोचें कि मटके का पानी ठंडा क्यों रहता है और मिट्टी के घर में दोपहर में ठंडक क्यों होती है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: मिट्टी की दीवारें दिन की गर्मी को धीरे-धीरे सोखती हैं और रात के ठंडे समय में मुक्त करती हैं, जिससे अंदर का तापमान स्थिर रहता है।"
      ],
      "kn": [
        "ಮಣ್ಣಿನ ಮಡಕೆಯ ನೀರು ಏಕೆ ತಂಪಾಗಿರುತ್ತದೆ ಎಂದು ಯೋಚಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಮಣ್ಣಿನ ಗೋಡೆಗಳು ಹಗಲಿನ ಶಾಖವನ್ನು ನಿಧಾನವಾಗಿ ಹೀರಿಕೊಂಡು, ರಾತ್ರಿ ಬಿಡುಗಡೆ ಮಾಡುತ್ತವೆ, ಇದರಿಂದ ಮನೆಯೊಳಗೆ ಸಮತೋಲನವಿರುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Mud-adobe has high thermal mass; it absorbs ambient heat slowly during scorching days and radiates it back during cooler nights.",
      "hi": "मिट्टी की दीवारें दिन की गर्मी को धीरे-धीरे सोखती हैं और रात के ठंडे समय में मुक्त करती हैं, जिससे अंदर का तापमान स्थिर रहता है।",
      "kn": "ಮಣ್ಣಿನ ಗೋಡೆಗಳು ಹಗಲಿನ ಶಾಖವನ್ನು ನಿಧಾನವಾಗಿ ಹೀರಿಕೊಂಡು, ರಾತ್ರಿ ಬಿಡುಗಡೆ ಮಾಡುತ್ತವೆ, ಇದರಿಂದ ಮನೆಯೊಳಗೆ ಸಮತೋಲನವಿರುತ್ತದೆ."
    }
  },
  {
    "id": "house.g8.005",
    "zone": "house",
    "grade": 8,
    "difficulty": 2,
    "type": "numeric",
    "concept": "perimeter_fencing",
    "text": {
      "en": "The rectangular compound around the house is 20 metres long and 15 metres wide. How many metres of bamboo fencing wire are needed to enclose all 4 sides once? (Formula: Perimeter = 2 × (Length + Width))",
      "hi": "घर के चारों ओर का आयताकार आंगन 20 मीटर लंबा और 15 मीटर चौड़ा है। चारों ओर एक बार बाड़ लगाने के लिए कितने मीटर तार चाहिए? (परिमाप = 2 × (लंबाई + चौड़ाई))",
      "kn": "ಮನೆಯ ಸುತ್ತಲಿನ ಆಯತಾಕಾರದ ಅಂಗಳವು 20 ಮೀಟರ್ ಉದ್ದ ಮತ್ತು 15 ಮೀಟರ್ ಅಗಲವಿದೆ. ಒಮ್ಮೆ ಬೇಲಿ ಹಾಕಲು ಎಷ್ಟು ಮೀಟರ್ ತಂತಿ ಬೇಕು? (ಸುತ್ತಳತೆ = 2 × (ಉದ್ದ + ಅಗಲ))"
    },
    "numeric": {
      "answer": 70,
      "tolerance": 0.5,
      "unit": "metres"
    },
    "hints": {
      "en": [
        "Add length and width: 20 + 15 = 35 m.",
        "Multiply by 2 for both sides: 35 × 2 = ?"
      ],
      "hi": [
        "लंबाई और चौड़ाई को जोड़ें: 20 + 15 = 35 मीटर।",
        "इसे 2 से गुणा करें।"
      ],
      "kn": [
        "ಉದ್ದ ಮತ್ತು ಅಗಲವನ್ನು ಕೂಡಿ: 20 + 15 = 35 ಮೀ.",
        "ನಂತರ 2 ರಿಂದ ಗುಣಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Perimeter = 2 × (20 + 15) = 2 × 35 = 70 metres of fencing required.",
      "hi": "परिमाप = 2 × (20 + 15) = 70 मीटर तार की आवश्यकता होगी।",
      "kn": "ಸುತ್ತಳತೆ = 2 × (20 + 15) = 70 ಮೀಟರ್ ತಂತಿಯ ಅಗತ್ಯವಿದೆ."
    }
  },
  {
    "id": "house.g8.006",
    "zone": "house",
    "grade": 8,
    "difficulty": 3,
    "type": "mcq",
    "concept": "roof_slope_drainage",
    "text": {
      "en": "Why do traditional houses in heavy rainfall regions (like coastal Karnataka or Western Ghats) feature steeply pitched sloping roofs rather than flat roofs?",
      "hi": "अधिक वर्षा वाले क्षेत्रों में घरों की छतें समतल के बजाय अधिक ढलान वाली क्यों बनाई जाती हैं?",
      "kn": "ಹೆಚ್ಚು ಮಳೆಯಾಗುವ ಕರಾವಳಿ ಮತ್ತು ಮಲೆನಾಡು ಭಾಗಗಳಲ್ಲಿ ಮನೆಗಳಿಗೆ ಇಳಿಜಾರಾದ ಛಾವಣಿಗಳನ್ನು ಏಕೆ ನಿರ್ಮಿಸುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "Steep slopes shed water rapidly, preventing pooling and roof leakage",
        "Steep roofs make houses heavier to withstand wind",
        "Sloping roofs catch birds easily",
        "Flat roofs attract lightning strikes"
      ],
      "hi": [
        "ढलानदार छत पानी को तेजी से बहा देती है, जिससे रिसाव और पानी जमा नहीं होता",
        "ढलानदार छतें घर को भारी बनाती हैं",
        "ढलानदार छत से पक्षी आसानी से पकड़े जाते हैं",
        "समतल छतें बिजली को आकर्षित करती हैं"
      ],
      "kn": [
        "ತೀವ್ರ ಇಳಿಜಾರು ಮಳೆನೀರನ್ನು ವೇಗವಾಗಿ ಹರಿಸಿ, ನೀರು ನಿಲ್ಲದಂತೆ ಮತ್ತು ಸೋರದಂತೆ ತಡೆಯುತ್ತದೆ",
        "ಇಳಿಜಾರು ಛಾವಣಿಗಳು ಮನೆಯನ್ನು ಭಾರವಾಗಿಸುತ್ತವೆ",
        "ಇಳಿಜಾರು ಛಾವಣಿಗಳು ಪಕ್ಷಿಗಳನ್ನು ಹಿಡಿಯಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ",
        "ಸಮತಟ್ಟಾದ ಛಾವಣಿಗಳಿಗೆ ಸಿಡಿಲು ಬಡಿಯುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "What happens when heavy water stands still on a flat surface over days?",
        "Step 2: Consider how roof slope drainage works: A sloping pitch uses gravity to channel water runoff swiftly into drains before water can penetrate roof seams or degrade masonry."
      ],
      "hi": [
        "सोचें कि अगर छत पर भारी मात्रा में पानी कई दिनों तक खड़ा रहे तो क्या होगा।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: ढलानदार छत गुरुत्वाकर्षण के कारण पानी को तुरंत नीचे बहा देती है, जिससे सीलन और लीकेज नहीं होती।"
      ],
      "kn": [
        "ಸಮತಟ್ಟಾದ ಮೇಲ್ಮೈಯಲ್ಲಿ ನೀರು ನಿಂತರೆ ಏನಾಗುತ್ತದೆ ಎಂದು ಯೋಚಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಇಳಿಜಾರಾದ ಛಾವಣಿಯು ಗುರುತ್ವಾಕರ್ಷಣೆಯ ಬಲದಿಂದ ನೀರನ್ನು ತ್ವರಿತವಾಗಿ ಕೆಳಮುಖವಾಗಿ ಹರಿಸಿ, ಸೋರಿಕೆಯನ್ನು ತಪ್ಪಿಸುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "A sloping pitch uses gravity to channel water runoff swiftly into drains before water can penetrate roof seams or degrade masonry.",
      "hi": "ढलानदार छत गुरुत्वाकर्षण के कारण पानी को तुरंत नीचे बहा देती है, जिससे सीलन और लीकेज नहीं होती।",
      "kn": "ಇಳಿಜಾರಾದ ಛಾವಣಿಯು ಗುರುತ್ವಾಕರ್ಷಣೆಯ ಬಲದಿಂದ ನೀರನ್ನು ತ್ವರಿತವಾಗಿ ಕೆಳಮುಖವಾಗಿ ಹರಿಸಿ, ಸೋರಿಕೆಯನ್ನು ತಪ್ಪಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "well.g6.001",
    "zone": "well",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "pulley_mechanical_advantage",
    "text": {
      "en": "How does a single fixed pulley over a village well make it easier to lift a heavy bucket of water?",
      "hi": "कुएं पर लगी एकल स्थिर घिरनी (Pulley) से भारी बाल्टी खींचना आसान क्यों हो जाता है?",
      "kn": "ಬಾವಿಯ ಮೇಲಿರುವ ಒಂದು ಕಪ್ಪಿಯು (ತಿರುಗುಚಕ್ರ) ನೀರಿನ ಬಕೆಟನ್ನು ಸುಲಭವಾಗಿ ಎತ್ತಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?"
    },
    "options": {
      "en": [
        "It changes the direction of the applied force to pull downward with body weight",
        "It reduces the weight of the water to zero",
        "It increases the amount of water in the bucket",
        "It turns water into steam"
      ],
      "hi": [
        "यह बल की दिशा बदल देती है, जिससे अपने शरीर के वजन के साथ नीचे खींचना आसान होता है",
        "यह पानी का वजन शून्य कर देती है",
        "यह बाल्टी में पानी बढ़ा देती है",
        "यह पानी को भाप में बदल देती है"
      ],
      "kn": [
        "ಇದು ಬಲದ ದಿಕ್ಕನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ, ಇದರಿಂದ ದೇಹದ ತೂಕವನ್ನು ಬಳಸಿ ಕೆಳಮುಖವಾಗಿ ಎಳೆಯಬಹುದು",
        "ಇದು ನೀರಿನ ತೂಕವನ್ನು ಶೂನ್ಯವಾಗಿಸುತ್ತದೆ",
        "ಇದು ಬಕೆಟ್‌ನಲ್ಲಿ ನೀರನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ",
        "ಇದು ನೀರನ್ನು ಹಬೆಯಾಗಿಸುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about whether it is easier to lift straight up or pull down using your own body weight.",
        "Step 2: Consider how pulley mechanical advantage works: A single fixed pulley has a mechanical advantage of 1; it does not reduce total work, but changing the pulling direction downward allows our body weight and gravity to assist the effort."
      ],
      "hi": [
        "सोचें कि सीधा ऊपर उठाना आसान है या शरीर के वजन का उपयोग करके नीचे की ओर खींचना।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: स्थिर घिरनी बल की दिशा बदल देती है, जिससे गुरुत्वाकर्षण और शरीर के भार की मदद से काम बहुत सहज हो जाता है।"
      ],
      "kn": [
        "ನೇರವಾಗಿ ಮೇಲಕ್ಕೆತ್ತುವುದಕ್ಕಿಂತ ಕೆಳಮುಖವಾಗಿ ಎಳೆಯುವುದು ಏಕೆ ಸುಲಭ?",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಒಂದೇ ಸ್ಥಿರ ಕಪ್ಪಿಯು ಎಳೆಯುವ ದಿಕ್ಕನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ, ಇದರಿಂದ ನಮ್ಮ ದೇಹದ ತೂಕವು ನೀರನ್ನು ಸುಲಭವಾಗಿ ಎತ್ತಲು ನೆರವಾಗುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "A single fixed pulley has a mechanical advantage of 1; it does not reduce total work, but changing the pulling direction downward allows our body weight and gravity to assist the effort.",
      "hi": "स्थिर घिरनी बल की दिशा बदल देती है, जिससे गुरुत्वाकर्षण और शरीर के भार की मदद से काम बहुत सहज हो जाता है।",
      "kn": "ಒಂದೇ ಸ್ಥಿರ ಕಪ್ಪಿಯು ಎಳೆಯುವ ದಿಕ್ಕನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ, ಇದರಿಂದ ನಮ್ಮ ದೇಹದ ತೂಕವು ನೀರನ್ನು ಸುಲಭವಾಗಿ ಎತ್ತಲು ನೆರವಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "well.g7.002",
    "zone": "well",
    "grade": 7,
    "difficulty": 2,
    "type": "numeric",
    "concept": "well_cylinder_volume",
    "text": {
      "en": "A circular village well has a radius of 1 metre and a water column depth of 7 metres. Using π ≈ 22/7, what is the volume of water stored in the well in cubic metres (m³)? (Formula: Volume = π × r² × h)",
      "hi": "एक गोल कुएं की त्रिज्या (r) 1 मीटर है और पानी की गहराई (h) 7 मीटर है। π = 22/7 मानते हुए कुएं में पानी का आयतन (m³) ज्ञात करें। (सूत्र: आयतन = π × r² × h)",
      "kn": "ಒಂದು ಬಾವಿಯ ತ್ರಿಜ್ಯ 1 ಮೀಟರ್ ಮತ್ತು ನೀರಿನ ಆಳ 7 ಮೀಟರ್ ಇದೆ. π = 22/7 ಬಳಸಿ, ಬಾವಿಯಲ್ಲಿರುವ ನೀರಿನ ಘನಗಾತ್ರವನ್ನು (ಘನ ಮೀಟರ್) ಕಂಡುಹಿಡಿಯಿರಿ. (ಸೂತ್ರ: V = π × r² × h)"
    },
    "numeric": {
      "answer": 22,
      "tolerance": 0.5,
      "unit": "m³"
    },
    "hints": {
      "en": [
        "Volume = (22/7) × (1)² × 7.",
        "Notice that the 7 in the denominator cancels with the height 7!"
      ],
      "hi": [
        "आयतन = (22/7) × (1)² × 7।",
        "हर का 7 ऊंचाई 7 से कट जाएगा!"
      ],
      "kn": [
        "ಘನಗಾತ್ರ = (22/7) × (1)² × 7. ಛೇದದಲ್ಲಿರುವ 7 ಮತ್ತು ಎತ್ತರ 7 ರದ್ದಾಗುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಘನಗಾತ್ರ = (22/7) × 1 × 7 = 22 ಘನ ಮೀಟರ್ (ಅಂದರೆ 22,000 ಲೀಟರ್ ನೀರು)."
      ]
    },
    "explanation": {
      "en": "Volume = (22/7) × 1² × 7 = 22 m³. Since 1 m³ = 1,000 Litres, this well holds 22,000 Litres of water!",
      "hi": "आयतन = (22/7) × 1 × 7 = 22 घन मीटर। इसका मतलब कुएं में 22,000 लीटर पानी है!",
      "kn": "ಘನಗಾತ್ರ = (22/7) × 1 × 7 = 22 ಘನ ಮೀಟರ್ (ಅಂದರೆ 22,000 ಲೀಟರ್ ನೀರು)."
    }
  },
  {
    "id": "well.g7.003",
    "zone": "well",
    "grade": 7,
    "difficulty": 2,
    "type": "fill_blank",
    "concept": "water_table",
    "text": {
      "en": "The upper level below which the ground and rock spaces are completely saturated with water is called the _______ table.",
      "hi": "जमीन के नीचे की वह ऊपरी सीमा जहाँ चट्टानों के बीच पानी पूरी तरह भरा होता है, उसे _______ स्तर (Water table) कहते हैं।",
      "kn": "ಭೂಮಿಯ ಕೆಳಗೆ ಶಿಲೆ ಮತ್ತು ಮಣ್ಣಿನ ಕಣಗಳು ಸಂಪೂರ್ಣವಾಗಿ ನೀರಿನಿಂದ ತುಂಬಿರುವ ಮೇಲ್ಮೈ ಹಂತವನ್ನು _______ ಮಟ್ಟ (Water table) ಎನ್ನುತ್ತಾರೆ."
    },
    "blanks": [
      {
        "answer": [
          "water",
          "जल",
          "ಅಂತರ್ಜಲ"
        ]
      }
    ],
    "hints": {
      "en": [
        "It refers to \"water table\".",
        "The answer is \"water\"."
      ],
      "hi": [
        "इसे \"जल स्तर\" (Water table) कहा जाता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: वर्षा ऋतु में जलस्तर (Water table) ऊपर आ जाता है और गर्मियों में अत्यधिक दोहन से नीचे चला जाता है।"
      ],
      "kn": [
        "ಇದನ್ನು \"ಅಂತರ್ಜಲ\" ಮಟ್ಟ ಅಥವಾ \"ವಾಟರ್\" ಟೇಬಲ್ ಎನ್ನಲಾಗುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಮಳೆಗಾಲದಲ್ಲಿ ಮಳೆನೀರು ಇಂಗುವುದರಿಂದ ಅಂತರ್ಜಲ ಮಟ್ಟ ಏರುತ್ತದೆ, ಬೇಸಿಗೆಯಲ್ಲಿ ಕೆಳಗೆ ಇಳಿಯುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "The water table rises during monsoons due to percolation and recedes during summer due to evaporation and tube-well extraction.",
      "hi": "वर्षा ऋतु में जलस्तर (Water table) ऊपर आ जाता है और गर्मियों में अत्यधिक दोहन से नीचे चला जाता है।",
      "kn": "ಮಳೆಗಾಲದಲ್ಲಿ ಮಳೆನೀರು ಇಂಗುವುದರಿಂದ ಅಂತರ್ಜಲ ಮಟ್ಟ ಏರುತ್ತದೆ, ಬೇಸಿಗೆಯಲ್ಲಿ ಕೆಳಗೆ ಇಳಿಯುತ್ತದೆ."
    }
  },
  {
    "id": "well.g8.004",
    "zone": "well",
    "grade": 8,
    "difficulty": 2,
    "type": "mcq",
    "concept": "groundwater_contamination_filtration",
    "text": {
      "en": "Why is open well water naturally cleaner than pond water, even before boiling or filtration?",
      "hi": "तालाब के पानी की तुलना में खुले कुएं का पानी प्राकृतिक रूप से अधिक स्वच्छ क्यों होता है?",
      "kn": "ಕೆರೆಯ ನೀರಿಗಿಂತ ಬಾವಿಯ ನೀರು ನೈಸರ್ಗಿಕವಾಗಿ ಹೆಚ್ಚು ಸ್ವಚ್ಛವಾಗಿರಲು ಕಾರಣವೇನು?"
    },
    "options": {
      "en": [
        "Rainwater undergoes natural percolation through sand and soil layers that filter suspended dirt",
        "Well water contains natural chlorine gas",
        "Sunlight boils the bottom of the well",
        "Fish inside the well purify all germs"
      ],
      "hi": [
        "मिट्टी और रेत की परतों से रिसकर आने के कारण धूल-कण प्राकृतिक रूप से छन जाते हैं",
        "कुएं में क्लोरीन गैस अपने आप बनती है",
        "धूप कुएं के पानी को उबाल देती है",
        "कुएं की मछलियां सारे कीटाणु खा जाती हैं"
      ],
      "kn": [
        "ಮರಳು ಮತ್ತು ಮಣ್ಣಿನ ಪದರಗಳ ಮೂಲಕ ನೀರು ಇಂಗಿ ಬರುವುದರಿಂದ ಕಲ್ಮಶಗಳು ಸ್ವಾಭಾವಿಕವಾಗಿ ಶೋಧಿಸಲ್ಪಡುತ್ತವೆ",
        "ಬಾವಿಯ ನೀರಿನಲ್ಲಿ ನೈಸರ್ಗಿಕ ಕ್ಲೋರಿನ್ ಇರುತ್ತದೆ",
        "ಬಿಸಿಲು ಬಾವಿಯ ನೀರನ್ನು ಕುದಿಸುತ್ತದೆ",
        "ಬಾವಿಯ ಮೀನುಗಳು ಕ್ರಿಮಿಗಳನ್ನು ನಾಶಮಾಡುತ್ತವೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about water trickling through fine layers of sand and porous stone.",
        "Step 2: Consider how groundwater contamination filtration works: Soil percolation acts as an extensive sand-gravel mechanical filter, trapping suspended sediment before water reaches aquifer cracks."
      ],
      "hi": [
        "सोचें कि जब पानी रेत और मिट्टी की बारीक परतों से छनकर नीचे जाता है तो क्या होता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: मिट्टी और रेत की परतें एक प्राकृतिक फिल्टर का काम करती हैं, जो गंदगी और निलंबित कणों को रोक लेती हैं।"
      ],
      "kn": [
        "ಮರಳು ಮತ್ತು ಮಣ್ಣಿನ ಮೂಲಕ ನೀರು ಹರಿದುಹೋಗುವಾಗ ಏನಾಗುತ್ತದೆ ಎಂದು ಯೋಚಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಮಣ್ಣು ಮತ್ತು ಮರಳಿನ ಪದರಗಳು ನೈಸರ್ಗಿಕ ಫಿಲ್ಟರ್‌ನಂತೆ ವರ್ತಿಸಿ ಕಲ್ಮಶಗಳನ್ನು ತಡೆಯುತ್ತವೆ."
      ]
    },
    "explanation": {
      "en": "Soil percolation acts as an extensive sand-gravel mechanical filter, trapping suspended sediment before water reaches aquifer cracks.",
      "hi": "मिट्टी और रेत की परतें एक प्राकृतिक फिल्टर का काम करती हैं, जो गंदगी और निलंबित कणों को रोक लेती हैं।",
      "kn": "ಮಣ್ಣು ಮತ್ತು ಮರಳಿನ ಪದರಗಳು ನೈಸರ್ಗಿಕ ಫಿಲ್ಟರ್‌ನಂತೆ ವರ್ತಿಸಿ ಕಲ್ಮಶಗಳನ್ನು ತಡೆಯುತ್ತವೆ."
    }
  },
  {
    "id": "well.g8.005",
    "zone": "well",
    "grade": 8,
    "difficulty": 3,
    "type": "numeric",
    "concept": "water_pressure_depth",
    "text": {
      "en": "At the bottom of an 8-metre deep well, what is the gauge water pressure in Kilopascals (kPa)? (Formula: P = ρ × g × h. Take density ρ = 1000 kg/m³, g ≈ 10 m/s², and 1 kPa = 1000 Pa).",
      "hi": "8 मीटर गहरे कुएं की तली पर पानी का दबाव कितने किलोपास्कल (kPa) होगा? (P = ρ × g × h, जहाँ ρ = 1000, g = 10, और 1 kPa = 1000 Pa)",
      "kn": "8 ಮೀಟರ್ ಆಳದ ಬಾವಿಯ ತಳಭಾಗದಲ್ಲಿ ನೀರಿನ ಒತ್ತಡ ಎಷ್ಟು ಕಿಲೋಪ್ಯಾಸ್ಕಲ್ (kPa)? (ಸೂತ್ರ: P = ρ × g × h, ρ = 1000, g = 10, 1 kPa = 1000 Pa)"
    },
    "numeric": {
      "answer": 80,
      "tolerance": 1,
      "unit": "kPa"
    },
    "hints": {
      "en": [
        "P = 1000 × 10 × 8 = 80,000 Pascals.",
        "Convert 80,000 Pa to kPa by dividing by 1,000."
      ],
      "hi": [
        "दबाव = 1000 × 10 × 8 = 80,000 पास्कल।",
        "1000 से भाग देकर kPa में बदलें: 80 kPa।"
      ],
      "kn": [
        "ಒತ್ತಡ = 1000 × 10 × 8 = 80,000 ಪ್ಯಾಸ್ಕಲ್. 1000 ರಿಂದ ಭಾಗಿಸಿದರೆ 80 kPa.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಒತ್ತಡ P = 1000 × 10 × 8 = 80,000 Pa = 80 kPa."
      ]
    },
    "explanation": {
      "en": "Hydrostatic pressure P = 1000 × 10 × 8 = 80,000 Pa = 80 kPa. Liquid pressure increases directly proportional to water depth.",
      "hi": "जलस्थैतिक दबाव P = 1000 × 10 × 8 = 80,000 Pa = 80 kPa। गहराई के साथ दबाव बढ़ता है।",
      "kn": "ಒತ್ತಡ P = 1000 × 10 × 8 = 80,000 Pa = 80 kPa. ಆಳ ಹೆಚ್ಚಾದಂತೆ ನೀರಿನ ಒತ್ತಡವು ಹೆಚ್ಚಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "well.g6.006",
    "zone": "well",
    "grade": 6,
    "difficulty": 1,
    "type": "scenario",
    "concept": "rainwater_recharging",
    "text": {
      "en": "During the summer dry season, a village well runs dry. Which community intervention is most effective to recharge the aquifer for next season?",
      "hi": "गर्मियों में कुआँ सूख जाता है। अगले मौसम के लिए भूजल को पुनः भरने का सबसे प्रभावी तरीका क्या है?",
      "kn": "ಬೇಸಿಗೆಯಲ್ಲಿ ಬಾವಿಯು ಬತ್ತಿಹೋಗುತ್ತದೆ. ಮುಂದಿನ ಋತುವಿಗಾಗಿ ಅಂತರ್ಜಲವನ್ನು ಮರುಪೂರಣ ಮಾಡಲು ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ ಕ್ರಮ ಯಾವುದು?"
    },
    "options": {
      "en": [
        "Digging contour recharge trenches and check-dams in the catchment area",
        "Pumping tap water from another village into the well",
        "Covering the well with a plastic sheet",
        "Removing all trees near the well"
      ],
      "hi": [
        "जलग್ರहण क्षेत्र में कंटूर खाइयां और चेक-डैम (रोक बांध) बनाना ताकि बारिश का पानी जमीन में रिसे",
        "दूसरे गांव से पाइप द्वारा पानी लाकर कुएं में डालना",
        "कुएं को प्लास्टिक की पन्नी से ढकना",
        "कुएं के आसपास के पेड़ काट देना"
      ],
      "kn": [
        "ಮಳೆನೀರನ್ನು ಭೂಮಿಗೆ ಇಂಗಿಸಲು ಚೆಕ್ ಡ್ಯಾಮ್‌ಗಳು ಮತ್ತು ಮಳೆನೀರು ಕೊಯ್ಲು ಕಂದಕಗಳನ್ನು ನಿರ್ಮಿಸುವುದು",
        "ಬೇರೆ ಹಳ್ಳಿಯಿಂದ ನೀರು ತಂದು ಬಾವಿಗೆ ಸುರಿಯುವುದು",
        "ಬಾವಿಗೆ ಪ್ಲಾಸ್ಟಿಕ್ ಹಾಕುವುದು",
        "ಬಾವಿಯ ಸುತ್ತಲಿನ ಮರಗಳನ್ನು ಕಡಿಯುವುದು"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about how slow, spreading runoff recharges the underground water table.",
        "Step 2: Consider how rainwater recharging works: Check-dams and percolation pits decelerate monsoon runoff, allowing millions of litres to seep deep underground and replenish the local water table."
      ],
      "hi": [
        "सोचें कि बारिश के पानी की गति धीमी करने पर वह जमीन में कैसे रिसता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: चेक-डैम बहते पानी की रफ्तार धीमी करते हैं, जिससे पानी भूजल में रिसकर कुओं को दोबारा जीवंत कर देता है।"
      ],
      "kn": [
        "ಹರಿದುಹೋಗುವ ಮಳೆನೀರನ್ನು ತಡೆದು ನಿಧಾನವಾಗಿ ಇಂಗಿಸಿದರೆ ಏನಾಗುತ್ತದೆ?",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಚೆಕ್ ಡ್ಯಾಮ್‌ಗಳು ಹರಿಯುವ ನೀರನ್ನು ತಡೆದು ಭೂಮಿಯೊಳಗೆ ಇಂಗಿಸುತ್ತವೆ, ಇದರಿಂದ ಅಂತರ್ಜಲವು ಮರುಪೂರಣಗೊಳ್ಳುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Check-dams and percolation pits decelerate monsoon runoff, allowing millions of litres to seep deep underground and replenish the local water table.",
      "hi": "चेक-डैम बहते पानी की रफ्तार धीमी करते हैं, जिससे पानी भूजल में रिसकर कुओं को दोबारा जीवंत कर देता है।",
      "kn": "ಚೆಕ್ ಡ್ಯಾಮ್‌ಗಳು ಹರಿಯುವ ನೀರನ್ನು ತಡೆದು ಭೂಮಿಯೊಳಗೆ ಇಂಗಿಸುತ್ತವೆ, ಇದರಿಂದ ಅಂತರ್ಜಲವು ಮರುಪೂರಣಗೊಳ್ಳುತ್ತದೆ."
    }
  },
  {
    "id": "farm.g6.001",
    "zone": "farm",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "crop_water_needs",
    "text": {
      "en": "Which of the following crops requires significantly LESS water and is best suited for drought-prone drylands?",
      "hi": "निम्नलिखित में से किस फसल को बहुत कम पानी की आवश्यकता होती है और वह सूखे क्षेत्रों के लिए सबसे उपयुक्त है?",
      "kn": "ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವ ಬೆಳೆಗೆ ಅತಿ ಕಡಿಮೆ ನೀರಿನ ಅಗತ್ಯವಿದ್ದು, ಬರಪೀಡಿತ ಒಣಭೂಮಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ?"
    },
    "options": {
      "en": [
        "Finger Millet (Ragi)",
        "Paddy Rice",
        "Sugarcane",
        "Banana"
      ],
      "hi": [
        "रागी (मडुआ/Finger Millet)",
        "धान (चावल)",
        "गन्ना",
        "केला"
      ],
      "kn": [
        "ರಾಗಿ (Finger Millet)",
        "ಭತ್ತ (ಅಕ್ಕಿ)",
        "ಕಬ್ಬು",
        "ಬಾಳೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "It is a traditional resilient super-grain celebrated for drought-hardiness in Karnataka and dry zones.",
        "Step 2: Consider how crop water needs works: Ragi (Finger Millet) needs only ~350 mm of water per crop season, compared to ~1200 mm for rice and ~2000 mm for sugarcane."
      ],
      "hi": [
        "यह कर्नाटक और शुष्क क्षेत्रों में उगाया जाने वाला पोषक मोटा अनाज (Millets) है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: रागी को केवल 350 मिमी पानी की आवश्यकता होती है, जबकि धान को 1200 मिमी और गन्ने को 2000 मिमी पानी चाहिए।"
      ],
      "kn": [
        "ಇದು ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ಪೌಷ್ಟಿಕ ಸಿರಿಧಾನ್ಯ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ರಾಗಿಗೆ ಕೇವಲ ~350 ಮಿಮೀ ನೀರು ಸಾಕು, ಆದರೆ ಭತ್ತಕ್ಕೆ ~1200 ಮಿಮೀ ಮತ್ತು ಕಬ್ಬಿಗೆ ~2000 ಮಿಮೀ ನೀರು ಬೇಕಾಗುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Ragi (Finger Millet) needs only ~350 mm of water per crop season, compared to ~1200 mm for rice and ~2000 mm for sugarcane.",
      "hi": "रागी को केवल 350 मिमी पानी की आवश्यकता होती है, जबकि धान को 1200 मिमी और गन्ने को 2000 मिमी पानी चाहिए।",
      "kn": "ರಾಗಿಗೆ ಕೇವಲ ~350 ಮಿಮೀ ನೀರು ಸಾಕು, ಆದರೆ ಭತ್ತಕ್ಕೆ ~1200 ಮಿಮೀ ಮತ್ತು ಕಬ್ಬಿಗೆ ~2000 ಮಿಮೀ ನೀರು ಬೇಕಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "farm.g6.002",
    "zone": "farm",
    "grade": 6,
    "difficulty": 1,
    "type": "numeric",
    "concept": "farm_area",
    "text": {
      "en": "A farmer prepares a vegetable field measuring 30 metres in length and 20 metres in width. What is the total area of the field in square metres (m²)? (Formula: Area = Length × Width)",
      "hi": "एक किसान 30 मीटर लंबे और 20 मीटर चौड़े खेत में सब्जी बोता है। खेत का कुल क्षेत्रफल वर्ग मीटर (m²) में कितना है? (क्षेत्रफल = लंबाई × चौड़ाई)",
      "kn": "ಒಬ್ಬ ರೈತನು 30 ಮೀಟರ್ ಉದ್ದ ಮತ್ತು 20 ಮೀಟರ್ ಅಗಲವಿರುವ ಜಮೀನಿನಲ್ಲಿ ತರಕಾರಿ ಬೆಳೆಯುತ್ತಾನೆ. ಆ ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ ಎಷ್ಟು ಚದರ ಮೀಟರ್? (ವಿಸ್ತೀರ್ಣ = ಉದ್ದ × ಅಗಲ)"
    },
    "numeric": {
      "answer": 600,
      "tolerance": 1,
      "unit": "m²"
    },
    "hints": {
      "en": [
        "Multiply 30 by 20.",
        "30 × 20 = ?"
      ],
      "hi": [
        "30 को 20 से गुणा करें।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: क्षेत्रफल = 30 × 20 = 600 वर्ग मीटर।"
      ],
      "kn": [
        "30 ನ್ನು 20 ರಿಂದ ಗುಣಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ವಿಸ್ತೀರ್ಣ = 30 × 20 = 600 ಚ."
      ]
    },
    "explanation": {
      "en": "Area = 30 m × 20 m = 600 m². Understanding area is foundational for calculating seed, fertilizer, and water budgets.",
      "hi": "क्षेत्रफल = 30 × 20 = 600 वर्ग मीटर। बीज और खाद की मात्रा तय करने के लिए क्षेत्रफल जानना आवश्यक है।",
      "kn": "ವಿಸ್ತೀರ್ಣ = 30 × 20 = 600 ಚ.ಮೀ. ಬೀಜ, ಗೊಬ್ಬರ ಮತ್ತು ನೀರಿನ ಲೆಕ್ಕಾಚಾರಕ್ಕೆ ವಿಸ್ತೀರ್ಣ ಅತಿ ಮುಖ್ಯ."
    }
  },
  {
    "id": "farm.g7.003",
    "zone": "farm",
    "grade": 7,
    "difficulty": 2,
    "type": "mcq",
    "concept": "irrigation_efficiency",
    "text": {
      "en": "Why is Drip Irrigation considered much more water-efficient than traditional Flood Irrigation?",
      "hi": "ड्रिप (टपक) सिंचाई पारंपरिक बाढ़ (Flood) सिंचाई की तुलना में अधिक पानी बचाने वाली क्यों मानी जाती है?",
      "kn": "ಸಾಂಪ್ರದಾಯಿಕ ಹರಿವು ನೀರಾವರಿಗಿಂತ ಹನಿ ನೀರಾವರಿ (Drip Irrigation) ಹೆಚ್ಚು ನೀರನ್ನು ಏಕೆ ಉಳಿಸುತ್ತದೆ?"
    },
    "options": {
      "en": [
        "It delivers water drop-by-drop directly to plant roots, minimizing evaporation and weed growth",
        "It turns soil into sand",
        "It eliminates the need for sunlight",
        "It cools the sky above the farm"
      ],
      "hi": [
        "यह पौधों की जड़ों तक बूंद-बूंद पानी पहुंचाती है, जिससे वाष्पीकरण और खरपतवार कम होते हैं",
        "यह मिट्टी को रेत में बदल देती है",
        "यह धूप की आवश्यकता को समाप्त करती है",
        "यह आसमान को ठंडा करती है"
      ],
      "kn": [
        "ಇದು ನೇರವಾಗಿ ಸಸ್ಯಗಳ ಬೇರುಗಳಿಗೆ ಹನಿ ಹನಿಯಾಗಿ ನೀರನ್ನು ಪೂರೈಸಿ, ಆವಿಯಾಗುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ",
        "ಇದು ಮಣ್ಣನ್ನು ಮರಳಾಗಿಸುತ್ತದೆ",
        "ಇದು ಸೂರ್ಯನ ಬೆಳಕಿನ ಅಗತ್ಯವನ್ನು ತಪ್ಪಿಸುತ್ತದೆ",
        "ಇದು ಆಕಾಶವನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about where plants drink water: through leaves, or directly at the root zone?",
        "Step 2: Consider how irrigation efficiency works: Drip systems achieve over 90% water efficiency by targeting the root zone directly and preventing evaporation loss from open puddles."
      ],
      "hi": [
        "सोचें कि पौधे पानी कहाँ से लेते हैं: पत्तियों से या जड़ों से?",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: ड्रिप सिंचाई में 90% से अधिक जल दक्षता मिलती है क्योंकि पानी सीधे जड़ों में जाता है और बेकार नहीं बहता।"
      ],
      "kn": [
        "ಸಸ್ಯಗಳು ನೀರನ್ನು ಎಲ್ಲಿಂದ ಹೀರಿಕೊಳ್ಳುತ್ತವೆ? ಬೇರುಗಳಿಂದ ತಾನೇ?",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಹನಿ ನೀರಾವರಿಯು 90% ಕ್ಕಿಂತ ಹೆಚ್ಚು ನೀರಿನ ದಕ್ಷತೆಯನ್ನು ನೀಡುತ್ತದೆ, ಏಕೆಂದರೆ ನೀರು ನೇರವಾಗಿ ಬೇರುಗಳಿಗೆ ತಲುಪುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Drip systems achieve over 90% water efficiency by targeting the root zone directly and preventing evaporation loss from open puddles.",
      "hi": "ड्रिप सिंचाई में 90% से अधिक जल दक्षता मिलती है क्योंकि पानी सीधे जड़ों में जाता है और बेकार नहीं बहता।",
      "kn": "ಹನಿ ನೀರಾವರಿಯು 90% ಕ್ಕಿಂತ ಹೆಚ್ಚು ನೀರಿನ ದಕ್ಷತೆಯನ್ನು ನೀಡುತ್ತದೆ, ಏಕೆಂದರೆ ನೀರು ನೇರವಾಗಿ ಬೇರುಗಳಿಗೆ ತಲುಪುತ್ತದೆ."
    }
  },
  {
    "id": "farm.g7.004",
    "zone": "farm",
    "grade": 7,
    "difficulty": 2,
    "type": "fill_blank",
    "concept": "photosynthesis",
    "text": {
      "en": "Plants synthesize glucose food using sunlight, water, and _______ dioxide gas from the atmosphere.",
      "hi": "पौधे सूर्य के प्रकाश, पानी और वायुमंडल से _______ डाइऑक्साइड गैस का उपयोग करके अपना भोजन बनाते हैं।",
      "kn": "ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ವಾತಾವರಣದಿಂದ _______ ಡೈಆಕ್ಸೈಡ್ ಅನಿಲವನ್ನು ಬಳಸಿ ಆಹಾರವನ್ನು ತಯಾರಿಸುತ್ತವೆ."
    },
    "blanks": [
      {
        "answer": [
          "carbon",
          "कार्बन",
          "ಕಾರ್ಬನ್"
        ]
      }
    ],
    "hints": {
      "en": [
        "CO2: Carbon Dioxide.",
        "Step 2: Consider how photosynthesis works: During photosynthesis, chlorophyll traps solar energy to combine Carbon Dioxide and water into glucose and oxygen (6CO2 + 6H2O → C6H12O6 + 6O2)."
      ],
      "hi": [
        "गैस का नाम: कार्बन डाइऑक्साइड (CO2)।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: प्रकाश संश्लेषण में पौधे कार्बन डाइऑक्साइड और जल से ग्लूकोज और ऑक्सीजन का निर्माण करते हैं।"
      ],
      "kn": [
        "CO2 ಅನಿಲ - ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಲ್ಲಿ ಸಸ್ಯಗಳು ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು ನೀರನ್ನು ಬಳಸಿ ಗ್ಲೂಕೋಸ್ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ."
      ]
    },
    "explanation": {
      "en": "During photosynthesis, chlorophyll traps solar energy to combine Carbon Dioxide and water into glucose and oxygen (6CO2 + 6H2O → C6H12O6 + 6O2).",
      "hi": "प्रकाश संश्लेषण में पौधे कार्बन डाइऑक्साइड और जल से ग्लूकोज और ऑक्सीजन का निर्माण करते हैं।",
      "kn": "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಲ್ಲಿ ಸಸ್ಯಗಳು ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು ನೀರನ್ನು ಬಳಸಿ ಗ್ಲೂಕೋಸ್ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ."
    }
  },
  {
    "id": "farm.g8.005",
    "zone": "farm",
    "grade": 8,
    "difficulty": 2,
    "type": "numeric",
    "concept": "farm_profit_loss",
    "text": {
      "en": "A farmer spends ₹12,000 on seeds, ₹8,000 on compost, and ₹5,000 on harvesting. The harvest is sold at the mandi for ₹38,000. What is the net profit in Rupees (₹)? (Formula: Profit = Revenue - Total Expenses)",
      "hi": "एक किसान बीज पर ₹12,000, खाद पर ₹8,000 और कटाई पर ₹5,000 खर्च करता है। वह मंडी में फसल ₹38,000 में बेचता है। किसान का शुद्ध लाभ (₹) कितना है? (लाभ = कुल बिक्री - कुल खर्च)",
      "kn": "ಒಬ್ಬ ರೈತನು ಬೀಜಕ್ಕೆ ₹12,000, ಗೊಬ್ಬರಕ್ಕೆ ₹8,000 ಮತ್ತು ಕಟಾವಿಗೆ ₹5,000 ಖರ್ಚು ಮಾಡುತ್ತಾನೆ. ಮಂಡಿಯಲ್ಲಿ ಬೆಳೆಯನ್ನು ₹38,000 ಕ್ಕೆ ಮಾರಾಟ ಮಾಡಿದರೆ, ಆತನಿಗೆ ದೊರೆತ ಲಾಭ ಎಷ್ಟು (₹)? (ಲಾಭ = ಒಟ್ಟು ಆದಾಯ - ಒಟ್ಟು ಖರ್ಚು)"
    },
    "numeric": {
      "answer": 13000,
      "tolerance": 10,
      "unit": "₹"
    },
    "hints": {
      "en": [
        "Calculate total expense: 12,000 + 8,000 + 5,000 = 25,000.",
        "Subtract expense from revenue: 38,000 - 25,000 = ?"
      ],
      "hi": [
        "कुल खर्च जोड़ें: 12,000 + 8,000 + 5,000 = 25,000 रुपये।",
        "बिक्री (38,000) में से खर्च घटाएं।"
      ],
      "kn": [
        "ಒಟ್ಟು ಖರ್ಚು ಕೂಡಿ: 12,000 + 8,000 + 5,000 = 25,000 ರೂ.",
        "ಆದಾಯದಿಂದ ಖರ್ಚನ್ನು ಕಳೆಯಿರಿ: 38,000 - 25,000 = ?"
      ]
    },
    "explanation": {
      "en": "Total Cost = ₹12,000 + ₹8,000 + ₹5,000 = ₹25,000. Profit = ₹38,000 - ₹25,000 = ₹13,000.",
      "hi": "कुल खर्च = ₹25,000। शुद्ध लाभ = ₹38,000 - ₹25,000 = ₹13,000 रुपये।",
      "kn": "ಒಟ್ಟು ವೆಚ್ಚ = ₹25,000. ಲಾಭ = ₹38,000 - ₹25,000 = ₹13,000 ರೂಪಾಯಿ."
    }
  },
  {
    "id": "farm.g8.006",
    "zone": "farm",
    "grade": 8,
    "difficulty": 3,
    "type": "scenario",
    "concept": "crop_rotation_nitrogen",
    "text": {
      "en": "After harvesting wheat, why do wise farmers plant leguminous pulses (such as chickpea, moong, or groundnut) before the next cereal crop?",
      "hi": "गेहूं की कटाई के बाद समझदार किसान अगली अनाज की फसल से पहले दालें या दलहनी फसलें (जैसे चना या मूंग) क्यों उगाते हैं?",
      "kn": "ಗೋಧಿ ಕೊಯ್ಲಿನ ನಂತರ ರೈತರು ಮುಂದಿನ ಧಾನ್ಯದ ಬೆಳೆಗೆ ಮುಂಚಿತವಾಗಿ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು (ಕಡಲೆ ಅಥವಾ ಹೆಸರುಕಾಳು) ಏಕೆ ಬೆಳೆಯುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "Rhizobium bacteria in pulse root nodules fix atmospheric nitrogen naturally into the soil",
        "Pulses turn clay soil into pure water",
        "Pulses attract monsoon rain clouds",
        "Cereals refuse to grow without chocolate"
      ],
      "hi": [
        "दलहनी फसलों की जड़ों में राइजोबियम जीवाणु हवा की नाइट्रोजन को मिट्टी में प्राकृतिक खाद के रूप में स्थिर करते हैं",
        "दालें मिट्टी को पानी बना देती हैं",
        "दालें बादलों को बुलाती हैं",
        "मिट्टी की महक बदल जाती है"
      ],
      "kn": [
        "ದ್ವಿದಳ ಧಾನ್ಯಗಳ ಬೇರುಗಳಲ್ಲಿರುವ ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳು ವಾತಾವರಣದ ಸಾರಜನಕವನ್ನು ಮಣ್ಣಿನಲ್ಲಿ ಸ್ಥಿರೀಕರಿಸಿ ಫಲವತ್ತತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ",
        "ದ್ವಿದಳ ಧಾನ್ಯಗಳು ಮಣ್ಣನ್ನು ಕರಗಿಸುತ್ತವೆ",
        "ದ್ವಿದಳ ಧಾನ್ಯಗಳು ಮಳೆಯನ್ನು ಆಕರ್ಷಿಸುತ್ತವೆ",
        "ಧಾನ್ಯಗಳು ಸಕ್ಕರೆಯನ್ನು ಬಯಸುತ್ತವೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about Rhizobium nodules and the vital plant nutrient Nitrogen (N).",
        "Step 2: Consider how crop rotation nitrogen works: Symbiotic Rhizobium bacteria living in legume nodules convert atmospheric N2 into bio-available nitrates, replenishing soil nitrogen without expensive chemical fertilizers."
      ],
      "hi": [
        "राइजोबियम जीवाणु और मिट्टी के आवश्यक पोषक तत्व नाइट्रोजन (N) के बारे में सोचें।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: दलहनी फसलों की जड़ों में मौजूद राइजोबियम बैक्टीरिया हवा से नाइट्रोजन लेकर मिट्टी को उपजाऊ बनाते हैं।"
      ],
      "kn": [
        "ರೈಜೋಬಿಯಂ ಮತ್ತು ಮಣ್ಣಿಗೆ ಅಗತ್ಯವಾದ ಸಾರಜನಕ (Nitrogen) ಪೋಷಕಾಂಶವನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ದ್ವಿದಳ ಧಾನ್ಯಗಳ ಬೇರಿನ ಗಂಟುಗಳಲ್ಲಿರುವ ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳು ನೈಸರ್ಗಿಕವಾಗಿ ಸಾರಜನಕವನ್ನು ಮಣ್ಣಿಗೆ ಒದಗಿಸುತ್ತವೆ."
      ]
    },
    "explanation": {
      "en": "Symbiotic Rhizobium bacteria living in legume nodules convert atmospheric N2 into bio-available nitrates, replenishing soil nitrogen without expensive chemical fertilizers.",
      "hi": "दलहनी फसलों की जड़ों में मौजूद राइजोबियम बैक्टीरिया हवा से नाइट्रोजन लेकर मिट्टी को उपजाऊ बनाते हैं।",
      "kn": "ದ್ವಿದಳ ಧಾನ್ಯಗಳ ಬೇರಿನ ಗಂಟುಗಳಲ್ಲಿರುವ ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳು ನೈಸರ್ಗಿಕವಾಗಿ ಸಾರಜನಕವನ್ನು ಮಣ್ಣಿಗೆ ಒದಗಿಸುತ್ತವೆ."
    }
  },
  {
    "id": "tank.g6.001",
    "zone": "tank",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "hydrostatic_head_elevation",
    "text": {
      "en": "Why are overhead village water tanks constructed on high towers rather than sitting at ground level?",
      "hi": "गाँव की पानी की टंकियों को जमीन पर रखने के बजाय ऊंचे खंभों या टावर पर क्यों बनाया जाता है?",
      "kn": "ಹಳ್ಳಿಯ ನೀರಿನ ಟ್ಯಾಂಕ್‌ಗಳನ್ನು ನೆಲದ ಮೇಲೆ ನಿರ್ಮಿಸದೆ ಎತ್ತರದ ಗೋಪುರದ ಮೇಲೆ ಏಕೆ ನಿರ್ಮಿಸುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "Height creates gravitational potential energy, producing pressure to push water to all village taps without individual pumps",
        "To prevent birds from drinking the water",
        "To keep the water closer to the sun",
        "To make the village visible from airplanes"
      ],
      "hi": [
        "ऊंचाई से गुरुत्वाकर्षण स्थितिज ऊर्जा मिलती है, जिससे बिना बिजली के सभी नलों में पानी का दबाव पहुंचता है",
        "पक्षियों को पानी पीने से रोकने के लिए",
        "पानी को सूरज के करीब रखने के लिए",
        "हवाई जहाज को गांव दिखाने के लिए"
      ],
      "kn": [
        "ಎತ್ತರದಿಂದಾಗಿ ಗುರುತ್ವಾಕರ್ಷಣೆಯ ಸ್ಥಿತಿಜ ಶಕ್ತಿಯು ಉತ್ಪತ್ತಿಯಾಗಿ, ಪಂಪ್ ಇಲ್ಲದೆಯೇ ಹಳ್ಳಿಯ ಎಲ್ಲಾ ನಲ್ಲಿಗಳಿಗೆ ನೀರು ಸರಬರಾಜಾಗುತ್ತದೆ",
        "ಪಕ್ಷಿಗಳು ನೀರು ಕುಡಿಯದಂತೆ ತಡೆಯಲು",
        "ನೀರನ್ನು ಸೂರ್ಯನಿಗೆ ಹತ್ತಿರವಾಗಿಸಲು",
        "ವಿಮಾನಗಳಿಗೆ ಊರು ಕಾಣಿಸಲು"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Water naturally flows downhill. What happens when the source is higher than the tap?",
        "Step 2: Consider how hydrostatic head elevation works: Elevating water stores gravitational potential energy (mgh)."
      ],
      "hi": [
        "पानी स्वाभाविक रूप से ढलान की ओर बहता है। जब स्रोत नल से ऊंचा होगा तो क्या होगा?",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: ऊंचाई पर पानी स्थितिज ऊर्जा संचित करता है।"
      ],
      "kn": [
        "ನೀರು ಸಹಜವಾಗಿ ಮೇಲಿನಿಂದ ಕೆಳಕ್ಕೆ ಹರಿಯುತ್ತದೆ. ಟ್ಯಾಂಕ್ ಎತ್ತರದಲ್ಲಿದ್ದರೆ ನಲ್ಲಿಗಳಲ್ಲಿ ಒತ್ತಡ ಹೆಚ್ಚಿರುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಎತ್ತರದಲ್ಲಿ ಸಂಗ್ರಹವಾದ ನೀರು ಗುರುತ್ವ ಸ್ಥಿತಿಜ ಶಕ್ತಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Elevating water stores gravitational potential energy (mgh). When the outlet valve opens, this head height translates directly into hydrostatic pressure (P = ρgh).",
      "hi": "ऊंचाई पर पानी स्थितिज ऊर्जा संचित करता है। गुरुत्वाकर्षण दबाव के कारण पानी बिना पंप के दूर-दराज के घरों तक पहुंचता है।",
      "kn": "ಎತ್ತರದಲ್ಲಿ ಸಂಗ್ರಹವಾದ ನೀರು ಗುರುತ್ವ ಸ್ಥಿತಿಜ ಶಕ್ತಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಇದು ನೈಸರ್ಗಿಕ ಒತ್ತಡವನ್ನು (P = ρgh) ನೀಡಿ ನೀರನ್ನು ಹರಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "tank.g7.002",
    "zone": "tank",
    "grade": 7,
    "difficulty": 2,
    "type": "numeric",
    "concept": "tank_capacity_litres",
    "text": {
      "en": "A cylindrical water tank has an internal volume of 15 cubic metres (m³). How many litres of water does it hold when completely full? (1 m³ = 1000 Litres)",
      "hi": "एक पानी की टंकी की धारिता 15 घन मीटर (m³) है। पूरी तरह भरने पर इसमें कितने लीटर पानी आएगा? (1 घन मीटर = 1000 लीटर)",
      "kn": "ಒಂದು ನೀರಿನ ಟ್ಯಾಂಕ್‌ನ ಘನಗಾತ್ರ 15 ಘನ ಮೀಟರ್ (m³) ಇದೆ. ಅದು ಸಂಪೂರ್ಣ ತುಂಬಿದಾಗ ಎಷ್ಟು ಲೀಟರ್ ನೀರು ಹಿಡಿಯುತ್ತದೆ? (1 m³ = 1000 ಲೀಟರ್)"
    },
    "numeric": {
      "answer": 15000,
      "tolerance": 10,
      "unit": "litres"
    },
    "hints": {
      "en": [
        "Multiply 15 by 1000.",
        "15 × 1000 = ?"
      ],
      "hi": [
        "15 को 1000 से गुणा करें।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: 15 × 1000 = 15,000 लीटर पानी।"
      ],
      "kn": [
        "15 ನ್ನು 1000 ರಿಂದ ಗುಣಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: 15 × 1000 = 15,000 ಲೀಟರ್ ನೀರು."
      ]
    },
    "explanation": {
      "en": "15 m³ × 1000 L/m³ = 15,000 Litres. This provides enough daily water for approximately 100 village residents.",
      "hi": "15 × 1000 = 15,000 लीटर पानी।",
      "kn": "15 × 1000 = 15,000 ಲೀಟರ್ ನೀರು."
    }
  },
  {
    "id": "tank.g7.003",
    "zone": "tank",
    "grade": 7,
    "difficulty": 2,
    "type": "fill_blank",
    "concept": "potential_energy",
    "text": {
      "en": "Water stored high up in an elevated overhead tank possesses gravitational _______ energy.",
      "hi": "ऊंचे ओवरहेड टैंक में जमा पानी में गुरुत्वाकर्षण _______ ऊर्जा (Energy) होती है।",
      "kn": "ಎತ್ತರದ ಟ್ಯಾಂಕ್‌ನಲ್ಲಿ ಶೇಖರಿಸಲ್ಪಟ್ಟ ನೀರು ಗುರುತ್ವಾಕರ್ಷಣೆಯ _______ ಶಕ್ತಿಯನ್ನು (Potential Energy) ಹೊಂದಿರುತ್ತದೆ."
    },
    "blanks": [
      {
        "answer": [
          "potential",
          "स्थितिज",
          "ಸ್ಥಿತಿಜ"
        ]
      }
    ],
    "hints": {
      "en": [
        "Energy of position or height: \"Potential\" energy.",
        "Step 2: Consider how potential energy works: Gravitational potential energy PE = mgh."
      ],
      "hi": [
        "ऊंचाई के कारण संचित ऊर्जा: \"स्थितिज\" ऊर्जा (Potential energy)।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: ऊंचाई पर स्थित पानी में स्थितिज ऊर्जा (PE = mgh) होती है, जो बहते समय गतिज ऊर्जा में बदल जाती है।"
      ],
      "kn": [
        "ಎತ್ತರದಿಂದ ಉಂಟಾಗುವ ಶಕ್ತಿ: \"ಸ್ಥಿತಿಜ\" ಶಕ್ತಿ (Potential Energy).",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಎತ್ತರದಲ್ಲಿರುವ ನೀರಿನಲ್ಲಿ ಸ್ಥಿತಿಜ ಶಕ್ತಿ (PE = mgh) ಇರುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Gravitational potential energy PE = mgh. As water flows downward through pipes, this potential energy converts into kinetic energy and hydraulic pressure.",
      "hi": "ऊंचाई पर स्थित पानी में स्थितिज ऊर्जा (PE = mgh) होती है, जो बहते समय गतिज ऊर्जा में बदल जाती है।",
      "kn": "ಎತ್ತರದಲ್ಲಿರುವ ನೀರಿನಲ್ಲಿ ಸ್ಥಿತಿಜ ಶಕ್ತಿ (PE = mgh) ಇರುತ್ತದೆ. ಅದು ಕೊಳವೆಗಳಲ್ಲಿ ಹರಿಯುವಾಗ ಚಲನ ಶಕ್ತಿಯಾಗಿ ಬದಲಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "tank.g8.004",
    "zone": "tank",
    "grade": 8,
    "difficulty": 2,
    "type": "mcq",
    "concept": "communicating_vessels_level",
    "text": {
      "en": "Under the principle of communicating vessels, what happens to water levels in interconnected vertical pipes of different widths?",
      "hi": "आपस में जुड़े विभिन्न मोटाई के पाइपों में पानी का स्तर कैसा रहता है (Communicating vessels)?",
      "kn": "ಪರಸ್ಪರ ಸಂಪರ್ಕ ಹೊಂದಿರುವ ವಿಭಿನ್ನ ದಪ್ಪದ ಲಂಬ ಕೊಳವೆಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ಹೇಗಿರುತ್ತದೆ?"
    },
    "options": {
      "en": [
        "Water rises to the exact same horizontal height in all connected pipes regardless of their diameter",
        "Water rises twice as high in the widest pipe",
        "Water disappears in narrow pipes",
        "Water boils in curved pipes"
      ],
      "hi": [
        "पाइप की मोटाई चाहे जो हो, सभी जुड़े पाइपों में पानी का स्तर समान ऊंचाई तक रहता है",
        "चौड़े पाइप में पानी दोगुना ऊंचा चढ़ता है",
        "पतले पाइप से पानी गायब हो जाता है",
        "घुमावदार पाइप में पानी उबलने लगता है"
      ],
      "kn": [
        "ಕೊಳವೆಗಳ ದಪ್ಪ ಎಷ್ಟೇ ಇದ್ದರೂ, ಸಂಪರ್ಕಿತ ಎಲ್ಲಾ ಕೊಳವೆಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟವು ಒಂದೇ ಸಮಾನ ಎತ್ತರದಲ್ಲಿರುತ್ತದೆ",
        "ದಪ್ಪ ಕೊಳವೆಯಲ್ಲಿ ನೀರು ದುಪ್ಪಟ್ಟು ಎತ್ತರಕ್ಕೆ ಏರುತ್ತದೆ",
        "ತೆಳುವಾದ ಕೊಳವೆಯಲ್ಲಿ ನೀರು ಇರುವುದಿಲ್ಲ",
        "ಕೊಳವೆ ಬಿಸಿಯಾಗುತ್ತದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Liquid seeks its own level under uniform atmospheric pressure.",
        "Step 2: Consider how communicating vessels level works: Because atmospheric pressure is equal and fluid pressure depends solely on depth (P = ρgh), interconnected open vessels always equalize to the same horizontal surface level."
      ],
      "hi": [
        "वायुमंडलीय दबाव समान होने पर तरल पदार्थ हमेशा अपना समान स्तर बनाए रखते हैं।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: द्रव का दबाव केवल गहराई पर निर्भर करता है, इसलिए जुड़े हुए सभी पाइपों में पानी एक समान स्तर पर आ जाता है।"
      ],
      "kn": [
        "ವಾತಾವರಣದ ಒತ್ತಡ ಒಂದೇ ಆಗಿರುವಾಗ ದ್ರವಗಳು ಸಮತಲ ಮಟ್ಟವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳುತ್ತವೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ದ್ರವದ ಒತ್ತಡವು ಆಳದ ಮೇಲೆ ಮಾತ್ರ ಅವಲಂಬಿತವಾಗಿರುವುದರಿಂದ, ಎಲ್ಲಾ ಸಂಪರ್ಕಿತ ಕೊಳವೆಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ಸಮಾನವಾಗಿರುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Because atmospheric pressure is equal and fluid pressure depends solely on depth (P = ρgh), interconnected open vessels always equalize to the same horizontal surface level.",
      "hi": "द्रव का दबाव केवल गहराई पर निर्भर करता है, इसलिए जुड़े हुए सभी पाइपों में पानी एक समान स्तर पर आ जाता है।",
      "kn": "ದ್ರವದ ಒತ್ತಡವು ಆಳದ ಮೇಲೆ ಮಾತ್ರ ಅವಲಂಬಿತವಾಗಿರುವುದರಿಂದ, ಎಲ್ಲಾ ಸಂಪರ್ಕಿತ ಕೊಳವೆಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ಸಮಾನವಾಗಿರುತ್ತದೆ."
    }
  },
  {
    "id": "tank.g8.005",
    "zone": "tank",
    "grade": 8,
    "difficulty": 3,
    "type": "numeric",
    "concept": "hydrostatic_pressure_formula",
    "text": {
      "en": "The water surface in an overhead tank is 12 metres above a kitchen tap. What is the pressure at the tap in kPa? (P = ρ × g × h, ρ = 1000 kg/m³, g ≈ 10 m/s², 1 kPa = 1000 Pa).",
      "hi": "टंकी में पानी की सतह रसोई के नल से 12 मीटर ऊंची है। नल पर पानी का दबाव कितने kPa होगा? (P = ρ × g × h, ρ=1000, g=10, 1 kPa = 1000 Pa)",
      "kn": "ಟ್ಯಾಂಕ್‌ನಲ್ಲಿರುವ ನೀರಿನ ಮೇಲ್ಮೈಯು ಅಡುಗೆಮನೆಯ ನಲ್ಲಿಗಿಂತ 12 ಮೀಟರ್ ಎತ್ತರದಲ್ಲಿದೆ. ನಲ್ಲಿಯ ಬಳಿ ನೀರಿನ ಒತ್ತಡ ಎಷ್ಟು kPa? (P = ρ × g × h, ρ=1000, g=10, 1 kPa = 1000 Pa)"
    },
    "numeric": {
      "answer": 120,
      "tolerance": 1,
      "unit": "kPa"
    },
    "hints": {
      "en": [
        "P = 1000 × 10 × 12 = 120,000 Pa.",
        "Divide by 1000 to get 120 kPa."
      ],
      "hi": [
        "P = 1000 × 10 × 12 = 120,000 पास्कल = 120 kPa।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: 12 मीटर की ऊंचाई से 120 kPa का दबाव पैदा होता है।"
      ],
      "kn": [
        "P = 1000 × 10 × 12 = 120,000 Pa = 120 kPa.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: 12 ಮೀಟರ್ ಎತ್ತರದಿಂದ 120 kPa ಒತ್ತಡ ಉಂಟಾಗುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Hydrostatic pressure P = 1000 × 10 × 12 = 120 kPa. Every 10 metres of vertical head adds approximately 100 kPa (1 bar) of line pressure.",
      "hi": "12 मीटर की ऊंचाई से 120 kPa का दबाव पैदा होता है। हर 10 मीटर ऊंचाई लगभग 100 kPa दबाव जोड़ती है।",
      "kn": "12 ಮೀಟರ್ ಎತ್ತರದಿಂದ 120 kPa ಒತ್ತಡ ಉಂಟಾಗುತ್ತದೆ. ಪ್ರತಿ 10 ಮೀಟರ್ ಎತ್ತರವು ಸರಿಸುಮಾರು 100 kPa ಒತ್ತಡವನ್ನು ನೀಡುತ್ತದೆ."
    }
  },
  {
    "id": "tank.g6.006",
    "zone": "tank",
    "grade": 6,
    "difficulty": 1,
    "type": "scenario",
    "concept": "tank_overflow_waste",
    "text": {
      "en": "A village water tank overflows and floods the path every morning when the pump is left running unattended. What low-cost mechanical device solves this automatically without electricity?",
      "hi": "हर सुबह जब पंप चलता रहता है तो टंकी से पानी बहकर रास्ते पर भर जाता है। बिना बिजली के इसे रोकने वाला सबसे सरल यांत्रिक उपकरण कौन सा है?",
      "kn": "ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ಟ್ಯಾಂಕ್ ತುಂಬಿ ನೀರು ವ್ಯರ್ಥವಾಗಿ ಹರಿಯುತ್ತದೆ. ವಿದ್ಯುತ್ ಇಲ್ಲದೆಯೇ ಇದನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತಡೆಯುವ ಸರಳ ಸಾಧನ ಯಾವುದು?"
    },
    "options": {
      "en": [
        "A mechanical ball-float valve that rises with water to shut off the inlet pipe",
        "Painting the tank orange",
        "Shouting loudly at the pump",
        "Throwing stones into the tank"
      ],
      "hi": [
        "एक फ्लोट वाल्व (Ball-float valve) जो पानी भरने पर ऊपर उठकर इनलेट पाइप को स्वतः बंद कर देता है",
        "टंकी को नारंगी रंग से रंगना",
        "पंप पर जोर से चिल्लाना",
        "टंकी में पत्थर फेंकना"
      ],
      "kn": [
        "ಫ್ಲೋಟ್ ವಾಲ್ವ್ (ತೇಲುವ ಚೆಂಡಿನ ಕವಾಟ) - ನೀರು ತುಂಬಿದಂತೆ ಮೇಲಕ್ಕೆದ್ದು ಪೈಪನ್ನು ಮುಚ್ಚುತ್ತದೆ",
        "ಟ್ಯಾಂಕ್‌ಗೆ ಕೇಸರಿ ಬಣ್ಣ ಬಳಿಯುವುದು",
        "ಪಂಪ್ ಮೇಲೆ ಕೂಗಾಡುವುದು",
        "ಟ್ಯಾಂಕ್‌ಗೆ ಕಲ್ಲು ಹಾಕುವುದು"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think of the buoyant plastic ball inside a water tank or cistern.",
        "Step 2: Consider how tank overflow waste works: A ball-float valve operates via buoyancy: as liquid reaches the brim, the floating ball pivots a lever arm that plugs the inlet mechanically."
      ],
      "hi": [
        "टंकी के अंदर तैरने वाली गेंद (Float ball) के बारे में सोचें जो पानी का स्तर बढ़ने पर वाल्व बंद कर देती है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: फ्लोट वाल्व उत्प्लावन बल (Buoyancy) पर काम करता है।"
      ],
      "kn": [
        "ನೀರಿನ ಮಟ್ಟ ಹೆಚ್ಚಾದಂತೆ ತೇಲಿ ಬಂದು ನಲ್ಲಿಯನ್ನು ಮುಚ್ಚುವ ಪ್ಲಾಸ್ಟಿಕ್ ಚೆಂಡನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಫ್ಲೋಟ್ ವಾಲ್ವ್ ತೇಲುವ ನಿಯಮದ ಮೇಲೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "A ball-float valve operates via buoyancy: as liquid reaches the brim, the floating ball pivots a lever arm that plugs the inlet mechanically.",
      "hi": "फ्लोट वाल्व उत्प्लावन बल (Buoyancy) पर काम करता है। पानी भरने पर तैरती गेंद लीवर को दबाकर पाइप को बंद कर देती है।",
      "kn": "ಫ್ಲೋಟ್ ವಾಲ್ವ್ ತೇಲುವ ನಿಯಮದ ಮೇಲೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ನೀರು ತುಂಬಿದ ತಕ್ಷಣ ಅದು ಕವಾಟವನ್ನು ಮುಚ್ಚಿ ನೀರು ಪೋಲಾಗುವುದನ್ನು ತಡೆಯುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g6.001",
    "zone": "solar",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "south_facing_orientation",
    "text": {
      "en": "Why are stationary solar panels in India always tilted to face towards the SOUTH?",
      "hi": "भारत में सौर पैनलों को हमेशा दक्षिण (South) दिशा की ओर झुकाकर क्यों लगाया जाता है?",
      "kn": "ಭಾರತದಲ್ಲಿ ಸೌರ ಫಲಕಗಳನ್ನು (ಸೋಲಾರ್ ಪ್ಯಾನಲ್) ಯಾವಾಗಲೂ ದಕ್ಷಿಣ ದಿಕ್ಕಿಗೆ ಮುಖಮಾಡಿ ಏಕೆ ಜೋಡಿಸುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "Because India is in the Northern Hemisphere, the sun traverses across the southern half of the sky throughout the year",
        "Because the south direction is auspicious",
        "Because south winds are warmer",
        "Because solar panels can only produce power in the afternoon"
      ],
      "hi": [
        "क्योंकि भारत उत्तरी गोलार्ध में है, और सूरज पूरे साल दक्षिणी आकाश से होकर गुजरता है",
        "क्योंकि दक्षिण दिशा शुभ मानी जाती है",
        "क्योंकि दक्षिणी हवाएं अधिक गर्म होती हैं",
        "क्योंकि सौर पैनल केवल दोपहर में काम करते हैं"
      ],
      "kn": [
        "ಭಾರತವು ಉತ್ತರ ಗೋಳಾರ್ಧದಲ್ಲಿದೆ, ಆದ್ದರಿಂದ ಸೂರ್ಯನು ವರ್ಷವಿಡೀ ದಕ್ಷಿಣ ಆಕಾಶದ ಮಾರ್ಗದಲ್ಲಿ ಸಂಚರಿಸುತ್ತಾನೆ",
        "ದಕ್ಷಿಣ ದಿಕ್ಕು ಮಂಗಳಕರವಾದ್ದರಿಂದ",
        "ದಕ್ಷಿಣದ ಗಾಳಿ ಬೆಚ್ಚಗಿರುವುದರಿಂದ",
        "ಸೋಲಾರ್ ಪ್ಯಾನಲ್ ಮಧ್ಯಾಹ್ನ ಮಾತ್ರ ಕೆಲಸ ಮಾಡುವುದರಿಂದ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "India lies north of the equator (Northern Hemisphere). Where is the sun relative to the equator?",
        "Step 2: Consider how south facing orientation works: Since India is located entirely in the Northern Hemisphere (above the equator), the sun arcs across the southern sky."
      ],
      "hi": [
        "भारत भूमध्य रेखा के उत्तर में है। पूरे साल सूरज की किरणें किस दिशा से सर्वाधिक मिलती हैं?",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: उत्तरी गोलार्ध में स्थित होने के कारण भारत में सूरज दक्षिण दिशा से अधिकतम धूप देता है, इसलिए दक्षिण मुखी पैनल सबसे ज्यादा बिजली बनाते हैं।"
      ],
      "kn": [
        "ಭಾರತವು ಸಮಭಾಜಕ ವೃತ್ತದ ಉತ್ತರಕ್ಕಿದೆ. ಗರಿಷ್ಠ ಬಿಸಿಲು ಯಾವ ದಿಕ್ಕಿನಿಂದ ಬೀಳುತ್ತದೆ?",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಭಾರತವು ಉತ್ತರ ಗೋಳಾರ್ಧದಲ್ಲಿರುವುದರಿಂದ ಸೂರ್ಯನ ಕಿರಣಗಳು ದಕ್ಷಿಣ ಭಾಗದಿಂದ ಹೆಚ್ಚು ಬೀಳುತ್ತವೆ."
      ]
    },
    "explanation": {
      "en": "Since India is located entirely in the Northern Hemisphere (above the equator), the sun arcs across the southern sky. Facing south guarantees maximum annual irradiation.",
      "hi": "उत्तरी गोलार्ध में स्थित होने के कारण भारत में सूरज दक्षिण दिशा से अधिकतम धूप देता है, इसलिए दक्षिण मुखी पैनल सबसे ज्यादा बिजली बनाते हैं।",
      "kn": "ಭಾರತವು ಉತ್ತರ ಗೋಳಾರ್ಧದಲ್ಲಿರುವುದರಿಂದ ಸೂರ್ಯನ ಕಿರಣಗಳು ದಕ್ಷಿಣ ಭಾಗದಿಂದ ಹೆಚ್ಚು ಬೀಳುತ್ತವೆ. ದಕ್ಷಿಣಕ್ಕೆ ಮುಖಮಾಡಿದರೆ ಗರಿಷ್ಠ ಸೌರಶಕ್ತಿ ದೊರೆಯುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g7.002",
    "zone": "solar",
    "grade": 7,
    "difficulty": 2,
    "type": "numeric",
    "concept": "electrical_power_formula",
    "text": {
      "en": "A village solar pump panel generates an electric current of 8 Amperes at a voltage of 25 Volts. What is the generated electrical power in Watts (W)? (Formula: Power = Voltage × Current)",
      "hi": "एक सौर पंप पैनल 25 वोल्ट के वोल्टेज पर 8 एम्पीयर का करंट पैदा करता है। पैनल द्वारा उत्पादित कुल विद्युत शक्ति (Watts) कितनी है? (शक्ति = वोल्टेज × करंट)",
      "kn": "ಒಂದು ಸೌರ ಪಂಪ್ ಪ್ಯಾನಲ್ 25 ವೋಲ್ಟ್‌ನಲ್ಲಿ 8 ಆಂಪಿಯರ್ ವಿದ್ಯುತ್ ಪ್ರವಾಹವನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ. ಉತ್ಪತ್ತಿಯಾದ ಒಟ್ಟು ಶಕ್ತಿ ಎಷ್ಟು ವ್ಯಾಟ್‌ಗಳು (W)? (ಶಕ್ತಿ P = V × I)"
    },
    "numeric": {
      "answer": 200,
      "tolerance": 1,
      "unit": "Watts"
    },
    "hints": {
      "en": [
        "Power = 25 × 8.",
        "25 × 8 = ?"
      ],
      "hi": [
        "25 को 8 से गुणा करें।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: विद्युत शक्ति P = 25 × 8 = 200 वाट (Watts)।"
      ],
      "kn": [
        "25 ನ್ನು 8 ರಿಂದ ಗುಣಿಸಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ವಿದ್ಯುತ್ ಶಕ್ತಿ P = 25 × 8 = 200 ವ್ಯಾಟ್ (Watts)."
      ]
    },
    "explanation": {
      "en": "Power P = V × I = 25 V × 8 A = 200 Watts. Electrical power is the rate at which radiant solar photons are converted to electrical energy.",
      "hi": "विद्युत शक्ति P = 25 × 8 = 200 वाट (Watts)।",
      "kn": "ವಿದ್ಯುತ್ ಶಕ್ತಿ P = 25 × 8 = 200 ವ್ಯಾಟ್ (Watts)."
    }
  },
  {
    "id": "solar.g7.003",
    "zone": "solar",
    "grade": 7,
    "difficulty": 2,
    "type": "fill_blank",
    "concept": "photovoltaic_effect",
    "text": {
      "en": "Solar panels directly convert light photons into electric current using the _______ effect.",
      "hi": "सौर पैनल प्रकाश ऊर्जा को _______ प्रभाव (Photovoltaic effect) के माध्यम से सीधे विद्युत प्रवाह में बदलते हैं।",
      "kn": "ಸೌರ ಫಲಕಗಳು ಬೆಳಕಿನ ಶಕ್ತಿಯನ್ನು ನೇರವಾಗಿ ವಿದ್ಯುತ್ ಆಗಿ ಪರಿವರ್ತಿಸುವ ಪ್ರಕ್ರಿಯೆಯನ್ನು _______ ಪರಿಣಾಮ (Photovoltaic effect) ಎನ್ನುತ್ತಾರೆ."
    },
    "blanks": [
      {
        "answer": [
          "photovoltaic",
          "फोटोवोल्टाइक",
          "ದ್ಯುತಿವಿದ್ಯುತ್"
        ]
      }
    ],
    "hints": {
      "en": [
        "Photo + Voltaic: \"Photovoltaic\" effect.",
        "Step 2: Consider how photovoltaic effect works: The photovoltaic effect occurs when incoming light photons dislodge electrons in silicon semiconductors, creating an electron flow (DC current)."
      ],
      "hi": [
        "इसे \"फोटोवोल्टाइक\" (Photovoltaic) प्रभाव कहते हैं।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: फोटोवोल्टाइक प्रभाव में सूर्य का प्रकाश सिलिकॉन सेमीकंडक्टर से इलेक्ट्रॉनों को मुक्त कराकर बिजली पैदा करता है।"
      ],
      "kn": [
        "ಇದನ್ನು \"ದ್ಯುತಿವಿದ್ಯುತ್\" ಅಥವಾ \"ಫೋಟೋವೋಲ್ಟಾಯಿಕ್\" ಪರಿಣಾಮ ಎನ್ನಲಾಗುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಫೋಟೋವೋಲ್ಟಾಯಿಕ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಸೂರ್ಯನ ಬೆಳಕು ಸಿಲಿಕಾನ್ ಕಣಗಳಿಂದ ಎಲೆಕ್ಟ್ರಾನ್‌ಗಳನ್ನು ಚಲಿಸುವಂತೆ ಮಾಡಿ ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "The photovoltaic effect occurs when incoming light photons dislodge electrons in silicon semiconductors, creating an electron flow (DC current).",
      "hi": "फोटोवोल्टाइक प्रभाव में सूर्य का प्रकाश सिलिकॉन सेमीकंडक्टर से इलेक्ट्रॉनों को मुक्त कराकर बिजली पैदा करता है।",
      "kn": "ಫೋಟೋವೋಲ್ಟಾಯಿಕ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಸೂರ್ಯನ ಬೆಳಕು ಸಿಲಿಕಾನ್ ಕಣಗಳಿಂದ ಎಲೆಕ್ಟ್ರಾನ್‌ಗಳನ್ನು ಚಲಿಸುವಂತೆ ಮಾಡಿ ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g8.004",
    "zone": "solar",
    "grade": 8,
    "difficulty": 2,
    "type": "mcq",
    "concept": "inverter_dc_to_ac",
    "text": {
      "en": "Solar panels produce Direct Current (DC). What electronic device is required to convert DC into Alternating Current (AC) to operate standard home appliances?",
      "hi": "सौर पैनल दिष्ट धारा (DC) बनाते हैं। घरेलू उपकरणों को चलाने के लिए DC को प्रत्यावर्ती धारा (AC) में बदलने वाले उपकरण को क्या कहते हैं?",
      "kn": "ಸೋಲಾರ್ ಪ್ಯಾನಲ್‌ಗಳು ನೇರ ವಿದ್ಯುತ್ ಪ್ರವಾಹವನ್ನು (DC) ಉತ್ಪಾದಿಸುತ್ತವೆ. ಮನೆಯ ಉಪಕರಣಗಳಿಗೆ ಬೇಕಾದ ಆಲ್ಟರ್ನೇಟಿಂಗ್ ಕರೆಂಟ್ (AC) ಆಗಿ ಪರಿವರ್ತಿಸಲು ಯಾವ ಸಾಧನ ಬೇಕು?"
    },
    "options": {
      "en": [
        "An Inverter",
        "A Thermometer",
        "A Water Filter",
        "A Barometer"
      ],
      "hi": [
        "इन्वर्टर (Inverter)",
        "थर्मामीटर",
        "वाटर फिल्टर",
        "बैरोमीटर"
      ],
      "kn": [
        "ಇನ್ವರ್ಟರ್ (Inverter)",
        "ಥರ್ಮಾಮೀಟರ್",
        "ವಾಟರ್ ಫಿಲ್ಟರ್",
        "ಬಾರೋಮೀಟರ್"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "It inverts DC to AC: Inverter.",
        "Step 2: Consider how inverter dc to ac works: An inverter uses solid-state switches and pulse-width modulation to transform raw 12V/24V DC into 230V 50Hz AC electricity."
      ],
      "hi": [
        "यह उपकरण घरों में बिजली जाने पर बैटरी से पंखा चलाने के लिए भी काम आता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: इन्वर्टर डीसी (DC) बिजली को 230V एसी (AC) में बदलता है ताकि पंखे, टीवी और मोटर चल सकें।"
      ],
      "kn": [
        "ಇದು DC ಯನ್ನು AC ಯಾಗಿ ಪರಿವರ್ತಿಸುವ ಇನ್ವರ್ಟರ್.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಇನ್ವರ್ಟರ್ DC ವಿದ್ಯುತ್ತನ್ನು 230V AC ವಿದ್ಯುತ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ ಗೃಹೋಪಯೋಗಿ ಉಪಕರಣಗಳನ್ನು ಚಲಾಯಿಸಲು ನೆರವಾಗುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "An inverter uses solid-state switches and pulse-width modulation to transform raw 12V/24V DC into 230V 50Hz AC electricity.",
      "hi": "इन्वर्टर डीसी (DC) बिजली को 230V एसी (AC) में बदलता है ताकि पंखे, टीवी और मोटर चल सकें।",
      "kn": "ಇನ್ವರ್ಟರ್ DC ವಿದ್ಯುತ್ತನ್ನು 230V AC ವಿದ್ಯುತ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ ಗೃಹೋಪಯೋಗಿ ಉಪಕರಣಗಳನ್ನು ಚಲಾಯಿಸಲು ನೆರವಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g8.005",
    "zone": "solar",
    "grade": 8,
    "difficulty": 2,
    "type": "numeric",
    "concept": "solar_energy_daily_yield",
    "text": {
      "en": "A 1 kW (1000 Watt) solar array in Karnataka receives 5 peak sun hours per day. How many kilowatt-hours (kWh or Units) of electricity does it generate in one sunny day? (Formula: Units = kW × Peak Sun Hours)",
      "hi": "कर्नाटक में 1 kW का सोलर सिस्टम प्रतिदिन 5 घंटे की तेज धूप प्राप्त करता है। यह एक दिन में कितनी यूनिट (kWh) बिजली बनाएगा? (यूनिट = kW × घंटे)",
      "kn": "ಕರ್ನಾಟಕದಲ್ಲಿ 1 kW ಸಾಮರ್ಥ್ಯದ ಸೋಲಾರ್ ವ್ಯವಸ್ಥೆಯು ದಿನಕ್ಕೆ 5 ಗಂಟೆಗಳ ಗರಿಷ್ಠ ಬಿಸಿಲನ್ನು ಪಡೆಯುತ್ತದೆ. ಒಂದು ದಿನದಲ್ಲಿ ಅದು ಎಷ್ಟು ಯೂನಿಟ್ (kWh) ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸುತ್ತದೆ?"
    },
    "numeric": {
      "answer": 5,
      "tolerance": 0.1,
      "unit": "Units (kWh)"
    },
    "hints": {
      "en": [
        "1 kW × 5 hours = ?",
        "Step 2: Consider how solar energy daily yield works: Energy = 1 kW × 5 hours = 5 kWh (Units) per day."
      ],
      "hi": [
        "1 को 5 से गुणा करें: 1 × 5 = 5 यूनिट।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: ऊर्जा = 1 kW × 5 घंटे = 5 kWh (यूनिट) प्रतिदिन।"
      ],
      "kn": [
        "1 kW × 5 ಗಂಟೆಗಳು = 5 ಯೂನಿಟ್.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಶಕ್ತಿ = 1 kW × 5 ಗಂಟೆ = 5 kWh (ಯೂನಿಟ್)."
      ]
    },
    "explanation": {
      "en": "Energy = 1 kW × 5 hours = 5 kWh (Units) per day. Over a month, this array produces ~150 units of green electricity.",
      "hi": "ऊर्जा = 1 kW × 5 घंटे = 5 kWh (यूनिट) प्रतिदिन। एक महीने में लगभग 150 यूनिट बिजली मिलती है।",
      "kn": "ಶಕ್ತಿ = 1 kW × 5 ಗಂಟೆ = 5 kWh (ಯೂನಿಟ್). ಒಂದು ತಿಂಗಳಿಗೆ ಸರಿಸುಮಾರು 150 ಯೂನಿಟ್ ಶುದ್ಧ ವಿದ್ಯುತ್ ದೊರೆಯುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g6.006",
    "zone": "solar",
    "grade": 6,
    "difficulty": 1,
    "type": "scenario",
    "concept": "dust_deposition_cleaning",
    "text": {
      "en": "After a dusty harvest week, a solar pump’s water output drops by 35% despite bright sunlight. What simple maintenance task should the farmer perform first?",
      "hi": "कटाई के बाद धूल उड़ने से तेज धूप के बावजूद सोलर पंप 35% कम पानी दे रहा है। किसान को सबसे पहले क्या करना चाहिए?",
      "kn": "ಧೂಳಿನ ವಾತಾವರಣದ ನಂತರ, ಬಿಸಿಲಿದ್ದರೂ ಸೋಲಾರ್ ಪಂಪ್‌ನ ನೀರಿನ ಹರಿವು 35% ಕಡಿಮೆಯಾಗುತ್ತದೆ. ರೈತನು ಮೊದಲು ಮಾಡಬೇಕಾದ ಸರಳ ಕೆಲಸವೇನು?"
    },
    "options": {
      "en": [
        "Gently clean the accumulated dust and dirt off the glass panel surface with clean water and a soft cloth",
        "Paint the solar panels black",
        "Add fertilizer into the water pump",
        "Replace all the copper wiring immediately"
      ],
      "hi": [
        "नरम कपड़े और साफ पानी से पैनल के शीशे पर जमी धूल को पोंछकर साफ करना चाहिए",
        "सौर पैनलों को काले रंग से रंगना चाहिए",
        "पंप में रासायनिक खाद डालनी चाहिए",
        "सारे तार बदल देने चाहिए"
      ],
      "kn": [
        "ಮೃದುವಾದ ಬಟ್ಟೆ ಮತ್ತು ಸ್ವಚ್ಛ ನೀರಿನಿಂದ ಪ್ಯಾನಲ್ ಮೇಲಿನ ಧೂಳನ್ನು ಒರೆಸಿ ಸ್ವಚ್ಛಗೊಳಿಸಬೇಕು",
        "ಪ್ಯಾನಲ್‌ಗಳಿಗೆ ಕಪ್ಪು ಬಣ್ಣ ಬಳಿಯಬೇಕು",
        "ಪಂಪ್‌ಗೆ ಗೊಬ್ಬರ ಹಾಕಬೇಕು",
        "ತಂತಿಗಳನ್ನು ಬದಲಾಯಿಸಬೇಕು"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Dust blocks sunlight from reaching the silicon cells beneath the glass.",
        "Step 2: Consider how dust deposition cleaning works: Soiling (dust buildup) reflects and absorbs incident photons before they can strike the silicon layer."
      ],
      "hi": [
        "शीशे पर जमी धूल धूप को सिलिकॉन सेल तक पहुंचने से रोकती है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: पैनल पर जमी धूल सूरज की किरणों को रोक लेती है।"
      ],
      "kn": [
        "ಧೂಳು ಗಾಜಿನ ಮೇಲ್ಮೈಯನ್ನು ಮುಚ್ಚಿ ಸೂರ್ಯನ ಬೆಳಕನ್ನು ತಡೆಯುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಧೂಳು ಸೂರ್ಯನ ಕಿರಣಗಳನ್ನು ತಡೆಯುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Soiling (dust buildup) reflects and absorbs incident photons before they can strike the silicon layer. Washing panels regularly restores rated output.",
      "hi": "पैनल पर जमी धूल सूरज की किरणों को रोक लेती है। नियमित सफाई से सौर पैनल पूरी क्षमता से बिजली बनाने लगते हैं।",
      "kn": "ಧೂಳು ಸೂರ್ಯನ ಕಿರಣಗಳನ್ನು ತಡೆಯುತ್ತದೆ. ನಿಯಮಿತವಾಗಿ ನೀರಿನಿಂದ ಸ್ವಚ್ಛಗೊಳಿಸಿದರೆ ಪ್ಯಾನಲ್ ಪೂರ್ಣ ಸಾಮರ್ಥ್ಯದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ."
    }
  },
  {
    "id": "soil.g7.001",
    "zone": "soil",
    "grade": 7,
    "difficulty": 1,
    "type": "mcq",
    "concept": "ph_scale_neutral",
    "text": {
      "en": "On the standard pH scale from 0 to 14, what pH value represents a perfectly NEUTRAL soil condition?",
      "hi": "0 से 14 के मानक pH पैमाने पर कौन सा मान पूरी तरह से तटस्थ (Neutral) मिट्टी को दर्शाता है?",
      "kn": "0 ರಿಂದ 14 ರವರೆಗಿನ ಪ್ರಮಾಣಿತ pH ಮಾನದಂಡದಲ್ಲಿ ಯಾವ ಮೌಲ್ಯವು ತಟಸ್ಥ (Neutral) ಮಣ್ಣಿನ ಸ್ಥಿತಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ?"
    },
    "options": {
      "en": [
        "pH 7.0",
        "pH 1.0",
        "pH 14.0",
        "pH 0.0"
      ],
      "hi": [
        "pH 7.0",
        "pH 1.0",
        "pH 14.0",
        "pH 0.0"
      ],
      "kn": [
        "pH 7.0",
        "pH 1.0",
        "pH 14.0",
        "pH 0.0"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "It is right in the middle between acidic (below 7) and alkaline (above 7).",
        "Step 2: Consider how ph scale neutral works: A pH of 7."
      ],
      "hi": [
        "यह अम्ल (7 से कम) और क्षार (7 से अधिक) के ठीक बीच में आता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: pH 7.0 तटस्थ (Neutral) होता है।"
      ],
      "kn": [
        "ಇದು ಆಮ್ಲ (7 ಕ್ಕಿಂತ ಕಡಿಮೆ) ಮತ್ತು ಕ್ಷಾರ (7 ಕ್ಕಿಂತ ಹೆಚ್ಚು) ನಡುವಿನ ಮಧ್ಯದ ಸಂಖ್ಯೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: pH 7."
      ]
    },
    "explanation": {
      "en": "A pH of 7.0 is neutral (equal concentration of H+ and OH- ions). Most agricultural crops thrive best in near-neutral soil between 6.0 and 7.5.",
      "hi": "pH 7.0 तटस्थ (Neutral) होता है। अधिकांश फसलें 6.0 से 7.5 के बीच सबसे अच्छी पैदावार देती हैं।",
      "kn": "pH 7.0 ತಟಸ್ಥವಾಗಿರುತ್ತದೆ. ಹೆಚ್ಚಿನ ಬೆಳೆಗಳು 6.0 ರಿಂದ 7.5 pH ಇರುವ ಮಣ್ಣಿನಲ್ಲಿ ಸಮೃದ್ಧವಾಗಿ ಬೆಳೆಯುತ್ತವೆ."
    }
  },
  {
    "id": "soil.g7.002",
    "zone": "soil",
    "grade": 7,
    "difficulty": 2,
    "type": "mcq",
    "concept": "acidic_soil_liming",
    "text": {
      "en": "A farmer tests their soil sample and finds an acidic pH of 5.2. Which common substance should be added to raise the pH towards neutral?",
      "hi": "एक किसान की मिट्टी की जांच में उसका pH 5.2 (अम्लीय) निकला। मिट्टी के pH को बढ़ाकर सामान्य करने के लिए क्या मिलाना चाहिए?",
      "kn": "ಒಬ್ಬ ರೈತನ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯಲ್ಲಿ pH 5.2 (ಆಮ್ಲೀಯ) ಕಂಡುಬಂದಿದೆ. ಮಣ್ಣಿನ pH ಅನ್ನು ತಟಸ್ಥ ಮಟ್ಟಕ್ಕೆ ಹೆಚ್ಚಿಸಲು ಏನನ್ನು ಸೇರಿಸಬೇಕು?"
    },
    "options": {
      "en": [
        "Agricultural Lime (Calcium Carbonate / Slaked lime)",
        "Battery Acid (Sulfuric acid)",
        "Common Table Salt",
        "Lemon Juice"
      ],
      "hi": [
        "कृषि चूना (कैल्शियम कार्बोनेट / बुझा हुआ चूना)",
        "बैटरी का तेजाब (सल्फ्यूरिक एसिड)",
        "साधारण नमक",
        "नींबू का रस"
      ],
      "kn": [
        "ಕೃಷಿ ಸುಣ್ಣ (ಕ್ಯಾಲ್ಸಿಯಂ ಕಾರ್ಬೋನೇಟ್)",
        "ಬ್ಯಾಟರಿ ಆಸಿಡ್",
        "ಉಪ್ಪು",
        "ನಿಂಬೆ ರಸ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "To neutralize an acid, you add a base. Lime is an alkaline calcium compound.",
        "Step 2: Consider how acidic soil liming works: Agricultural Lime (CaCO3 / Ca(OH)2) reacts with excess hydrogen ions (H+): CaCO3 + 2H+ → Ca2+ + H2O + CO2, safely neutralizing acidic soils."
      ],
      "hi": [
        "अम्ल को बेअसर करने के लिए क्षार (Base) मिलाते हैं। चूना एक क्षारीय पदार्थ है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: चूना (Lime) क्षारीय होता है।"
      ],
      "kn": [
        "ಆಮ್ಲವನ್ನು ಸರಿಪಡಿಸಲು ಕ್ಷಾರೀಯ ವಸ್ತುವನ್ನು ಸೇರಿಸಬೇಕು. ಸುಣ್ಣವು ಕ್ಷಾರೀಯವಾಗಿದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಕೃಷಿ ಸುಣ್ಣವು ಕ್ಷಾರೀಯವಾಗಿದ್ದು, ಮಣ್ಣಿನ ಆಮ್ಲೀಯತೆಯನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ ಫಲವತ್ತತೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Agricultural Lime (CaCO3 / Ca(OH)2) reacts with excess hydrogen ions (H+): CaCO3 + 2H+ → Ca2+ + H2O + CO2, safely neutralizing acidic soils.",
      "hi": "चूना (Lime) क्षारीय होता है। यह मिट्टी के अतिरिक्त अम्ल को उदासीन (Neutralize) करके उपजाऊ बनाता है।",
      "kn": "ಕೃಷಿ ಸುಣ್ಣವು ಕ್ಷಾರೀಯವಾಗಿದ್ದು, ಮಣ್ಣಿನ ಆಮ್ಲೀಯತೆಯನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ ಫಲವತ್ತತೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "soil.g8.003",
    "zone": "soil",
    "grade": 8,
    "difficulty": 2,
    "type": "fill_blank",
    "concept": "alkaline_soil_gypsum",
    "text": {
      "en": "To reclaim hard, sodic alkaline soil with high sodium content, farmers apply agricultural _______ (Calcium Sulfate).",
      "hi": "अधिक सोडियम वाली कठोर क्षारीय मिट्टी को सुधारने के लिए किसान खेत में _______ (कैल्शियम सल्फेट) डालते हैं।",
      "kn": "ಸೋಡಿಯಂ ಹೆಚ್ಚಿರುವ ಗಡುಸು ಕ್ಷಾರೀಯ ಮಣ್ಣನ್ನು ಸರಿಪಡಿಸಲು ರೈತರು _______ (ಕ್ಯಾಲ್ಸಿಯಂ ಸಲ್ಫೇಟ್) ಅನ್ನು ಬಳಸುತ್ತಾರೆ."
    },
    "blanks": [
      {
        "answer": [
          "gypsum",
          "जिप्सम",
          "ಜಿಪ್ಸಮ್"
        ]
      }
    ],
    "hints": {
      "en": [
        "It is Calcium Sulfate dihydrate (CaSO4·2H2O): Gypsum.",
        "Step 2: Consider how alkaline soil gypsum works: Gypsum (CaSO4·2H2O) supplies soluble Calcium (Ca2+) which replaces harmful Sodium (Na+) adsorbed on soil clay particles, restoring soil porosity and drainage."
      ],
      "hi": [
        "इसे \"जिप्सम\" (Gypsum) कहा जाता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: जिप्सम (Gypsum) क्षारीय मिट्टी से हानिकारक सोडियम को हटाकर मिट्टी की संरचना और जल निकासी में सुधार करता है।"
      ],
      "kn": [
        "ಇದನ್ನು \"ಜಿಪ್ಸಮ್\" (Gypsum) ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಜಿಪ್ಸಮ್ ಕ್ಷಾರೀಯ ಮಣ್ಣಿನಿಂದ ಹಾನಿಕಾರಕ ಸೋಡಿಯಂ ಅನ್ನು ತೆಗೆದುಹಾಕಿ ಮಣ್ಣಿನ ರಚನೆಯನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Gypsum (CaSO4·2H2O) supplies soluble Calcium (Ca2+) which replaces harmful Sodium (Na+) adsorbed on soil clay particles, restoring soil porosity and drainage.",
      "hi": "जिप्सम (Gypsum) क्षारीय मिट्टी से हानिकारक सोडियम को हटाकर मिट्टी की संरचना और जल निकासी में सुधार करता है।",
      "kn": "ಜಿಪ್ಸಮ್ ಕ್ಷಾರೀಯ ಮಣ್ಣಿನಿಂದ ಹಾನಿಕಾರಕ ಸೋಡಿಯಂ ಅನ್ನು ತೆಗೆದುಹಾಕಿ ಮಣ್ಣಿನ ರಚನೆಯನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "soil.g7.004",
    "zone": "soil",
    "grade": 7,
    "difficulty": 2,
    "type": "scenario",
    "concept": "litmus_indicator_color",
    "text": {
      "en": "A student dips blue litmus paper into a wet soil solution. The blue litmus paper instantly turns RED. What does this color change indicate?",
      "hi": "एक छात्र गीली मिट्टी के घोल में नीला लिटमस पेपर डुबोता है। नीला लिटमस तुरंत लाल हो जाता है। यह रंग परिवर्तन क्या दर्शाता है?",
      "kn": "ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯು ತೇವವಾದ ಮಣ್ಣಿನ ದ್ರಾವಣದಲ್ಲಿ ನೀಲಿ ಲಿಟ್ಮಸ್ ಕಾಗದವನ್ನು ಅದ್ದಿದಾಗ, ಅದು ತಕ್ಷಣ ಕೆಂಪಾಗುತ್ತದೆ. ಇದು ಏನನ್ನು ಸೂಚಿಸುತ್ತದೆ?"
    },
    "options": {
      "en": [
        "The soil is Acidic (Blue turns red in acid)",
        "The soil is Basic / Alkaline",
        "The soil is 100% pure gold",
        "The litmus paper is wet with milk"
      ],
      "hi": [
        "मिट्टी अम्लीय (Acidic) है (अम्ल में नीला लिटमस लाल हो जाता है)",
        "मिट्टी क्षारीय (Alkaline) है",
        "मिट्टी में सोना है",
        "लिटमस पेपर खराब है"
      ],
      "kn": [
        "ಮಣ್ಣು ಆಮ್ಲೀಯವಾಗಿದೆ (ಆಮ್ಲದಲ್ಲಿ ನೀಲಿ ಲಿಟ್ಮಸ್ ಕೆಂಪಾಗುತ್ತದೆ)",
        "ಮಣ್ಣು ಕ್ಷಾರೀಯವಾಗಿದೆ",
        "ಮಣ್ಣಿನಲ್ಲಿ ಚಿನ್ನವಿದೆ",
        "ಕಾಗದ ಹಾಳಾಗಿದೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Remember: Acid turns blue litmus Red (ABR).",
        "Step 2: Consider how litmus indicator color works: Acids donate hydrogen ions (H+) which alter the molecular dye structure of blue litmus, turning it red."
      ],
      "hi": [
        "याद रखें: अम्ल (Acid) नीले लिटमस को लाल कर देता है।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: अम्ल नीले लिटमस को लाल कर देता है, जबकि क्षार लाल लिटमस को नीला करता है।"
      ],
      "kn": [
        "ನೆನಪಿಡಿ: ಆಮ್ಲವು ನೀಲಿ ಲಿಟ್ಮಸ್ ಅನ್ನು ಕೆಂಪಾಗಿಸುತ್ತದೆ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಆಮ್ಲವು ನೀಲಿ ಲಿಟ್ಮಸ್ ಅನ್ನು ಕೆಂಪಾಗಿಸುತ್ತದೆ, ಕ್ಷಾರವು ಕೆಂಪು ಲಿಟ್ಮಸ್ ಅನ್ನು ನೀಲಿಯಾಗಿಸುತ್ತದೆ."
      ]
    },
    "explanation": {
      "en": "Acids donate hydrogen ions (H+) which alter the molecular dye structure of blue litmus, turning it red. Base turns red litmus blue.",
      "hi": "अम्ल नीले लिटमस को लाल कर देता है, जबकि क्षार लाल लिटमस को नीला करता है।",
      "kn": "ಆಮ್ಲವು ನೀಲಿ ಲಿಟ್ಮಸ್ ಅನ್ನು ಕೆಂಪಾಗಿಸುತ್ತದೆ, ಕ್ಷಾರವು ಕೆಂಪು ಲಿಟ್ಮಸ್ ಅನ್ನು ನೀಲಿಯಾಗಿಸುತ್ತದೆ."
    }
  },
  {
    "id": "soil.g8.005",
    "zone": "soil",
    "grade": 8,
    "difficulty": 2,
    "type": "numeric",
    "concept": "soil_moisture_percentage",
    "text": {
      "en": "A soil sample weighs 200 grams when freshly dug. After drying in an oven, it weighs 160 grams. What was the percentage moisture content of the soil? (Formula: Moisture % = (Water Weight ÷ Fresh Weight) × 100)",
      "hi": "खेत से ली गई ताजी मिट्टी का वजन 200 ग्राम था। सुखाने के बाद उसका वजन 160 ग्राम रह गया। मिट्टी में नमी का प्रतिशत कितना था? (नमी % = (पानी का वजन ÷ ताजा वजन) × 100)",
      "kn": "ತಾಜಾ ಮಣ್ಣಿನ ತೂಕ 200 ಗ್ರಾಂ ಇತ್ತು. ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿದ ನಂತರ ಅದರ ತೂಕ 160 ಗ್ರಾಂ ಆಯಿತು. ಮಣ್ಣಿನ ತೇವಾಂಶದ ಶೇಕಡಾವಾರು ಎಷ್ಟು? (ತೇವಾಂಶ % = (ನೀರಿನ ತೂಕ ÷ ತಾಜಾ ತೂಕ) × 100)"
    },
    "numeric": {
      "answer": 20,
      "tolerance": 0.5,
      "unit": "%"
    },
    "hints": {
      "en": [
        "Water evaporated = 200 - 160 = 40 grams.",
        "Moisture % = (40 / 200) × 100 = ?"
      ],
      "hi": [
        "भाप बनकर उड़े पानी का वजन = 200 - 160 = 40 ग्राम।",
        "(40 ÷ 200) × 100 = 20%"
      ],
      "kn": [
        "ಆವಿಯಾದ ನೀರಿನ ತೂಕ = 200 - 160 = 40 ಗ್ರಾಂ.",
        "(40 ÷ 200) × 100 = 20%."
      ]
    },
    "explanation": {
      "en": "Water weight = 200 - 160 = 40g. Moisture % = (40 / 200) × 100 = 20%. Knowing soil moisture helps prevent both crop wilting and waterlogging.",
      "hi": "पानी का भार = 40 ग्राम। नमी का प्रतिशत = (40 / 200) × 100 = 20%।",
      "kn": "ನೀರಿನ ತೂಕ = 40 ಗ್ರಾಂ. ತೇವಾಂಶ % = (40 / 200) × 100 = 20%."
    }
  },
  {
    "id": "soil.g6.006",
    "zone": "soil",
    "grade": 6,
    "difficulty": 1,
    "type": "mcq",
    "concept": "earthworm_soil_aeration",
    "text": {
      "en": "Why are earthworms famously hailed as the \"Farmer’s Best Friend\"?",
      "hi": "केंचुओं को \"किसान का सबसे अच्छा मित्र\" क्यों कहा जाता है?",
      "kn": "ಎರೆಹುಳುಗಳನ್ನು \"ರೈತನ ಮಿತ್ರ\" ಎಂದು ಏಕೆ ಕರೆಯುತ್ತಾರೆ?"
    },
    "options": {
      "en": [
        "Their burrowing aerates the soil and their castings create nutrient-rich humus",
        "They eat all the crop leaves",
        "They spray water on plants at night",
        "They dig wells for the village"
      ],
      "hi": [
        "वे मिट्टी में सुरंग बनाकर हवा का संचार करते हैं और उनके मल (वर्मीकम्पोस्ट) से मिट्टी उपजाऊ बनती है",
        "वे फसल की सारी पत्तियां खा जाते हैं",
        "वे रात को पौधों पर पानी छिड़कते हैं",
        "वे गांव के लिए कुएं खोदते हैं"
      ],
      "kn": [
        "ಅವು ಮಣ್ಣಿನಲ್ಲಿ ಸಂಚರಿಸಿ ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡುತ್ತವೆ ಮತ್ತು ಅವುಗಳ ಹಿಕ್ಕೆಗಳು (ವರ್ಮಿಕಂಪೋಸ್ಟ್) ಮಣ್ಣನ್ನು ಫಲವತ್ತಾಗಿಸುತ್ತವೆ",
        "ಅವು ಬೆಳೆಯ ಎಲೆಗಳನ್ನು ತಿನ್ನುತ್ತವೆ",
        "ಅವು ಗಿಡಗಳಿಗೆ ನೀರು ಸಿಂಪಡಿಸುತ್ತವೆ",
        "ಅವು ಬಾವಿಗಳನ್ನು ತೋಡುತ್ತವೆ"
      ]
    },
    "correctIndex": 0,
    "hints": {
      "en": [
        "Think about vermicompost and burrowing tunnels in soil.",
        "Step 2: Consider how earthworm soil aeration works: Earthworms tunnel through dense soil, creating pores for air and roots while converting decaying organic matter into vermicompost rich in nitrogen, phosphorus, and potassium."
      ],
      "hi": [
        "केंचुए की खाद (Vermicompost) और मिट्टी को भुरभुरा बनाने के बारे में सोचें।",
        "चरण 2: मुख्य वैज्ञानिक नियम याद करें: केंचुए मिट्टी को भुरभुरा बनाकर हवा और पानी का रास्ता खोलते हैं और वर्मीकम्पोस्ट खाद बनाकर मिट्टी को उपजाऊ बनाते हैं।"
      ],
      "kn": [
        "ಎರೆಹುಳು ಗೊಬ್ಬರ ಮತ್ತು ಮಣ್ಣು ಸಡಿಲವಾಗುವುದನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ.",
        "ಹಂತ 2: ಮುಖ್ಯ ವೈಜ್ಞಾನಿಕ ನಿಯಮವನ್ನು ಗಮನಿಸಿ: ಎರೆಹುಳುಗಳು ಮಣ್ಣನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡುತ್ತವೆ ಮತ್ತು ಎರೆಹುಳು ಗೊಬ್ಬರವನ್ನು ನೀಡಿ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುತ್ತವೆ."
      ]
    },
    "explanation": {
      "en": "Earthworms tunnel through dense soil, creating pores for air and roots while converting decaying organic matter into vermicompost rich in nitrogen, phosphorus, and potassium.",
      "hi": "केंचुए मिट्टी को भुरभुरा बनाकर हवा और पानी का रास्ता खोलते हैं और वर्मीकम्पोस्ट खाद बनाकर मिट्टी को उपजाऊ बनाते हैं।",
      "kn": "ಎರೆಹುಳುಗಳು ಮಣ್ಣನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡುತ್ತವೆ ಮತ್ತು ಎರೆಹುಳು ಗೊಬ್ಬರವನ್ನು ನೀಡಿ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುತ್ತವೆ."
    }
  },
  {
    "id": "house.g8.007",
    "zone": "house",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "passive_thermal_cooling",
    "text": {
      "en": "Explain how passive ventilation and lime whitewash work together in a traditional village house to keep rooms cool during scorching summer months.",
      "hi": "व्याख्या करें कि गाँव के पारंपरिक घर में चूने की पुताई और वेंटिलेशन मिलकर गर्मियों में कमरों को कैसे ठंडा रखते हैं।",
      "kn": "ಸಾಂಪ್ರದಾಯಿಕ ಹಳ್ಳಿಯ ಮನೆಯಲ್ಲಿ ಸುಣ್ಣದ ಬಿಳಿ ಬಣ್ಣ ಮತ್ತು ನೈಸರ್ಗಿಕ ಗಾಳಿ ಸಂಚಾರವು ಬೇಸಿಗೆಯಲ್ಲಿ ಕೊಠಡಿಗಳನ್ನು ಹೇಗೆ ತಂಪಾಗಿರಿಸುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ."
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "White lime paint reflects solar radiant heat due to high albedo",
          "Hot air rises by convection toward high ceiling vents or jalis",
          "Cooler replacement air enters through lower openings to maintain natural airflow"
        ],
        "hi": [
          "सफेद चूना उच्च परावर्तन के कारण धूप और सौर विकिरण को लौटा देता है",
          "संवहन के कारण गर्म हवा ऊपर उठकर वेंटिलेटर से बाहर निकलती है",
          "निचली खिड़कियों से ठंडी ताजी हवा अंदर आती है"
        ],
        "kn": [
          "ಬಿಳಿ ಸುಣ್ಣದ ಬಣ್ಣವು ಸೂರ್ಯನ ವಿಕಿರಣ ಶಾಖವನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ",
          "ಬಿಸಿ ಗಾಳಿಯು ಸಂವಹನದ ಮೂಲಕ ಮೇಲಕ್ಕೆ ಏರಿ ಕಿಂಡಿಗಳಿಂದ ಹೊರಹೋಗುತ್ತದೆ",
          "ಕೆಳಗಿನ ಕಿಟಕಿಗಳಿಂದ ತಂಪಾದ ಗಾಳಿ ಒಳಬರುತ್ತದೆ"
        ]
      },
      "modelAnswer": {
        "en": "Lime whitewash reflects radiant sunlight away from the walls due to its high reflectivity. Simultaneously, warm indoor air rises by convection and escapes through high ceiling ventilators, drawing cooler ambient air through lower windows to maintain a comfortable indoor temperature without electric fans.",
        "hi": "सफेद चूना धूप को परावर्तित करके दीवारों को गर्म होने से बचाता है। साथ ही, संवहन धाराओं के कारण गर्म हवा ऊपर उठकर छत के रोशनदानों से बाहर निकल जाती है और खिड़कियों से ठंडी हवा अंदर आकर कमरे को प्राकृतिक रूप से ठंडा रखती है।",
        "kn": "ಬಿಳಿ ಸುಣ್ಣವು ಸೂರ್ಯನ ಕಿರಣಗಳನ್ನು ಪ್ರತಿಫಲಿಸಿ ಗೋಡೆಗಳು ಬಿಸಿಯಾಗದಂತೆ ತಡೆಯುತ್ತದೆ. ಅದೇ ಸಮಯದಲ್ಲಿ, ಸಂವಹನ ಪ್ರಕ್ರಿಯೆಯಿಂದ ಬಿಸಿ ಗಾಳಿಯು ಮೇಲಿನ ಕಿಂಡಿಗಳ ಮೂಲಕ ಹೊರಹೋಗಿ, ಕಿಟಕಿಗಳಿಂದ ತಂಪಾದ ಗಾಳಿ ಒಳಬಂದು ನೈಸರ್ಗಿಕ ತಂಪು ನೀಡುತ್ತದೆ."
      }
    },
    "hints": {
      "en": [
        "Mention reflection of heat by white walls.",
        "Mention warm air rising upward by convection."
      ],
      "hi": [
        "सफेद रंग द्वारा धूप के परावर्तन का उल्लेख करें।",
        "संवहन द्वारा गर्म हवा के ऊपर उठने की प्रक्रिया बताएं।"
      ],
      "kn": [
        "ಬಿಳಿ ಬಣ್ಣವು ಸೂರ್ಯನ ಶಾಖವನ್ನು ಪ್ರತಿಫಲಿಸುವುದನ್ನು ಉಲ್ಲೇಖಿಸಿ.",
        "ಬಿಸಿ ಗಾಳಿ ಸಂವಹನದಿಂದ ಮೇಲಕ್ಕೆ ಏರುವುದನ್ನು ವಿವರಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Passive architecture uses optical reflection and buoyant convection currents to continuously exchange warm indoor air with cooler ambient air naturally.",
      "hi": "पारंपरिक वास्तुकला प्रकाश परावर्तन और संवहन धाराओं का उपयोग करके कमरे को बिना बिजली के ठंडा रखती है।",
      "kn": "ನೈಸರ್ಗಿಕ ಕಟ್ಟಡ ವಿನ್ಯಾಸವು ಪ್ರತಿಫಲನ ಮತ್ತು ಸಂವಹನ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಬಳಸಿ ತಂಪಾಗಿರುತ್ತದೆ."
    }
  },
  {
    "id": "well.g8.007",
    "zone": "well",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "groundwater_sanitation_buffer",
    "text": {
      "en": "Explain why it is dangerous to construct a pit latrine or cattle shed right next to a drinking water well, and what safe distance should be maintained.",
      "hi": "पीने के पानी के कुएं के ठीक पास गड्ढे वाला शौचालय या पशुशाला बनाना खतरनाक क्यों है, और कितनी सुरक्षित दूरी रखनी चाहिए?",
      "kn": "ಕುಡಿಯುವ ನೀರಿನ ಬಾವಿಯ ಪಕ್ಕದಲ್ಲೇ ಶೌಚಾಲಯದ ಗುಂಡಿ ಅಥವಾ ಕೊಟ್ಟಿಗೆಯನ್ನು ನಿರ್ಮಿಸುವುದು ಏಕೆ ಅಪಾಯಕಾರಿ? ಎಷ್ಟು ಸುರಕ್ಷಿತ ಅಂತರವಿರಬೇಕು?"
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "Pathogens and wastewater leach downward through porous soil into the aquifer",
          "Bacteria cause waterborne diseases like cholera, typhoid, or diarrhea",
          "A safe buffer distance of at least 15 to 30 metres must be maintained"
        ],
        "hi": [
          "अपशिष्ट और रोगाणु मिट्टी के छिद्रों से रिसकर भूजल में मिल जाते हैं",
          "हैजा, टाइफाइड जैसी जलजनित बीमारियाँ फैलती हैं",
          "कम से कम 15 से 30 मीटर की सुरक्षित दूरी रखी जानी चाहिए"
        ],
        "kn": [
          "ತ್ಯಾಜ್ಯ ಮತ್ತು ರೋಗಾಣುಗಳು ಮಣ್ಣಿನ ಮೂಲಕ ಅಂತರ್ಜಲಕ್ಕೆ ಇಂಗಿ ಸೇರುತ್ತವೆ",
          "ಕಾಲರಾ, ಟೈಫಾಯಿಡ್ ನಂತಹ ರೋಗಗಳು ಹರಡುತ್ತವೆ",
          "ಕನಿಷ್ಠ 15 ರಿಂದ 30 ಮೀಟರ್ ಸುರಕ್ಷಿತ ಅಂತರವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಬೇಕು"
        ]
      },
      "modelAnswer": {
        "en": "Sewage and biological waste from pit latrines or animal manure leach through porous underground soil and contaminate the shallow water table with coliform bacteria and nitrates. This causes severe waterborne diseases. Therefore, sanitation standards mandate maintaining a safe buffer distance of at least 15 to 30 metres downhill from any drinking water well.",
        "hi": "शौचालय के गड्ढों से हानिकारक जीवाणु और अपशिष्ट मिट्टी से रिसकर भूजल स्तर में मिल जाते हैं, जिससे पानी दूषित होकर टाइफाइड और हैजा जैसी बीमारियाँ फैलाता है। इसलिए कुएं से कम से कम 15 से 30 मीटर की दूरी पर ही शौचालय बनाना चाहिए।",
        "kn": "ಶೌಚಾಲಯದ ತ್ಯಾಜ್ಯವು ಮಣ್ಣಿನ ಮೂಲಕ ಅಂತರ್ಜಲಕ್ಕೆ ಇಂಗಿ ರೋಗಾಣುಗಳನ್ನು ಹರಡುತ್ತದೆ. ಇದರಿಂದ ಸಾಂಕ್ರಾಮಿಕ ರೋಗಗಳು ಉಂಟಾಗುತ್ತವೆ. ಆದ್ದರಿಂದ ಕುಡಿಯುವ ನೀರಿನ ಬಾವಿಯಿಂದ ಕನಿಷ್ಠ 15 ರಿಂದ 30 ಮೀಟರ್ ಸುರಕ್ಷಿತ ಅಂತರವಿರಬೇಕು."
      }
    },
    "hints": {
      "en": [
        "Think about how liquids seep downward through soil and reach the underground water table.",
        "Mention the recommended safety distance (15-30 metres)."
      ],
      "hi": [
        "सोचें कि जमीन में रिसकर गंदा पानी भूजल तक कैसे पहुंचता है।",
        "सुरक्षित दूरी (15-30 मीटर) का उल्लेख करें।"
      ],
      "kn": [
        "ಕಲ್ಮಶಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಇಂಗಿ ಅಂತರ್ಜಲ ಸೇರುವುದನ್ನು ಯೋಚಿಸಿ.",
        "15 ರಿಂದ 30 ಮೀಟರ್ ಅಂತರದ ಬಗ್ಗೆ ತಿಳಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Sanitation buffer zones prevent microbial percolation from reaching unconfined aquifers used for community drinking water.",
      "hi": "सुरक्षित दूरी रखने से रोगाणु भूजल तक नहीं पहुंच पाते और पीने का पानी सुरक्षित रहता है।",
      "kn": "ಸುರಕ್ಷಿತ ಅಂತರವು ರೋಗಾಣುಗಳು ಕುಡಿಯುವ ನೀರಿಗೆ ಸೇರದಂತೆ ತಡೆಯುತ್ತದೆ."
    }
  },
  {
    "id": "farm.g8.007",
    "zone": "farm",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "biological_nitrogen_fixation",
    "text": {
      "en": "Explain how growing pulses like chickpea or moong after harvesting wheat restores soil fertility without needing synthetic nitrogen fertilizers.",
      "hi": "गेहूं की कटाई के बाद चना या मूंग जैसी दलहनी फसलें उगाने से बिना रासायनिक खाद के मिट्टी की उर्वरता कैसे वापस आ जाती है?",
      "kn": "ಗೋಧಿ ಕೊಯ್ಲಿನ ನಂತರ ಕಡಲೆ ಅಥವಾ ಹೆಸರುಕಾಳು ಬೆಳೆಯುವುದರಿಂದ ರಾಸಾಯನಿಕ ಗೊಬ್ಬರವಿಲ್ಲದೆ ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೇಗೆ ಹೆಚ್ಚುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ."
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "Symbiotic Rhizobium bacteria live in the root nodules of pulses",
          "They convert atmospheric nitrogen gas into plant-absorbable nitrates",
          "Decaying roots and plant biomass add natural organic nitrogen to the soil"
        ],
        "hi": [
          "दलहनी फसलों की जड़ों की गांठों में राइजोबियम बैक्टीरिया रहते हैं",
          "वे हवा की नाइट्रोजन को घुलनशील नाइट्रेट्स में बदलते हैं",
          "जड़ों और पत्तियों के अपघटन से मिट्टी को प्राकृतिक नाइट्रोजन मिलती है"
        ],
        "kn": [
          "ದ್ವಿದಳ ಧಾನ್ಯಗಳ ಬೇರಿನ ಗಂಟುಗಳಲ್ಲಿ ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳಿರುತ್ತವೆ",
          "ಅವು ವಾತಾವರಣದ ಸಾರಜನಕವನ್ನು ನೈಟ್ರೇಟ್ ಆಗಿ ಪರಿವರ್ತಿಸುತ್ತವೆ",
          "ಸಸ್ಯದ ಅವಶೇಷಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಕರಗಿ ನೈಸರ್ಗಿಕ ಸಾರಜನಕವನ್ನು ನೀಡುತ್ತವೆ"
        ]
      },
      "modelAnswer": {
        "en": "Pulses form a symbiotic relationship with Rhizobium bacteria residing in their root nodules. These bacteria capture inert atmospheric nitrogen (N2) and fix it into bio-available nitrates (NO3-) in the soil. When the crop is harvested, the remaining root systems decompose, leaving the soil enriched with natural nitrogen for the next cereal crop.",
        "hi": "दलहनी फसलों की जड़ों की गांठों में राइजोबियम जीवाणु सहजीवी के रूप में रहते हैं। वे वायुमंडल की नाइट्रोजन को पौधों द्वारा अवशोषित करने योग्य नाइट्रेट में बदल देते हैं। इससे मिट्टी में प्राकृतिक नाइट्रोजन बढ़ जाती है और यूरिया खाद की जरूरत नहीं पड़ती।",
        "kn": "ದ್ವಿದಳ ಧಾನ್ಯಗಳ ಬೇರುಗಳಲ್ಲಿರುವ ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳು ವಾತಾವರಣದ ಸಾರಜನಕವನ್ನು ನೈಟ್ರೇಟ್ ರೂಪದಲ್ಲಿ ಮಣ್ಣಿನಲ್ಲಿ ಸ್ಥಿರೀಕರಿಸುತ್ತವೆ. ಇದರಿಂದ ಮಣ್ಣು ನೈಸರ್ಗಿಕವಾಗಿ ಫಲವತ್ತಾಗುತ್ತದೆ."
      }
    },
    "hints": {
      "en": [
        "Mention the bacteria name: Rhizobium.",
        "Explain how nitrogen gas from the air is turned into soil nitrates."
      ],
      "hi": [
        "राइजोबियम जीवाणु का नाम लिखें।",
        "बताएं कि हवा की नाइट्रोजन मिट्टी के पोषण में कैसे बदलती है।"
      ],
      "kn": [
        "ರೈಜೋಬಿಯಂ ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಹೆಸರನ್ನು ಉಲ್ಲೇಖಿಸಿ.",
        "ವಾತಾವರಣದ ಸಾರಜನಕವು ಮಣ್ಣಿಗೆ ಹೇಗೆ ಸೇರುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Biological Nitrogen Fixation by legumes reduces agricultural dependency on synthetic fertilizers while revitalizing soil micro-ecology.",
      "hi": "जैविक नाइट्रोजन स्थिरीकरण मिट्टी की प्राकृतिक उर्वरता को पुनर्जीवित करता है।",
      "kn": "ಜೈವಿಕ ಸಾರಜನಕ ಸ್ಥಿರೀಕರಣವು ರಾಸಾಯನಿಕ ಗೊಬ್ಬರಗಳ ಮೇಲಿನ ಅವಲಂಬನೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ."
    }
  },
  {
    "id": "tank.g8.007",
    "zone": "tank",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "hydrostatic_head_work",
    "text": {
      "en": "Explain why a water tank placed on the ground cannot deliver water to the upper floor of a village school building without an electric pump.",
      "hi": "व्याख्या करें कि जमीन पर रखी पानी की टंकी बिना बिजली के पंप के स्कूल की ऊपरी मंजिल तक पानी क्यों नहीं पहुंचा सकती।",
      "kn": "ನೆಲದ ಮೇಲಿರುವ ನೀರಿನ ಟ್ಯಾಂಕ್ ವಿದ್ಯುತ್ ಪಂಪ್ ಇಲ್ಲದೆ ಶಾಲೆಯ ಮೇಲಿನ ಮಹಡಿಗೆ ನೀರನ್ನು ಏಕೆ ಪೂರೈಸಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂದು ವಿವರಿಸಿ."
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "Fluids naturally flow from high to low gravitational potential energy",
          "A ground tank lacks the elevation head (h) needed to produce hydrostatic pressure above itself",
          "Pumping work is required to overcome gravity and lift water upward"
        ],
        "hi": [
          "पानी स्वाभाविक रूप से अधिक स्थितिज ऊर्जा (ऊंचाई) से कम स्थितिज ऊर्जा की ओर बहता है",
          "जमीन पर रखी टंकी में ऊंचाई (Head height) का अभाव होता है",
          "गुरुत्वाकर्षण के विपरीत पानी ऊपर चढ़ाने के लिए यांत्रिक ऊर्जा (पंप) आवश्यक है"
        ],
        "kn": [
          "ದ್ರವಗಳು ನೈಸರ್ಗಿಕವಾಗಿ ಹೆಚ್ಚಿನ ಸ್ಥಿತಿಜ ಶಕ್ತಿಯಿಂದ ಕಡಿಮೆ ಶಕ್ತಿಗೆ ಹರಿಯುತ್ತವೆ",
          "ನೆಲದ ಮೇಲಿನ ಟ್ಯಾಂಕ್‌ಗೆ ಎತ್ತರದ ಕೊರತೆಯಿರುವುದರಿಂದ ನೀರಿನ ಒತ್ತಡವಿರುವುದಿಲ್ಲ",
          "ಗುರುತ್ವಾಕರ್ಷಣೆಯ ವಿರುದ್ಧ ನೀರನ್ನು ಮೇಲಕ್ಕೆತ್ತಲು ಪಂಪ್‌ನ ಶಕ್ತಿ ಬೇಕು"
        ]
      },
      "modelAnswer": {
        "en": "Water naturally flows down a gravitational gradient from higher to lower potential energy. A ground-level tank lacks the elevation head required to generate hydrostatic pressure (P = ρgh) at height. Therefore, water cannot spontaneously flow upward against gravity without external mechanical work provided by an electric pump.",
        "hi": "पानी हमेशा ऊंचाई से नीचे की ओर बहता है। जमीन पर रखी टंकी में ऊंचाई का अभाव होने के कारण गुरुत्वाकर्षण दबाव उत्पन्न नहीं होता। गुरुत्वाकर्षण बल के विरुद्ध पानी को ऊपर चढ़ाने के लिए पंप द्वारा यांत्रिक ऊर्जा देना अनिवार्य है।",
        "kn": "ನೀರು ಯಾವಾಗಲೂ ಮೇಲಿನಿಂದ ಕೆಳಕ್ಕೆ ಹರಿಯುತ್ತದೆ. ನೆಲದ ಮೇಲಿನ ಟ್ಯಾಂಕ್‌ನಲ್ಲಿ ಎತ್ತರ ಇಲ್ಲದಿರುವುದರಿಂದ ನೈಸರ್ಗಿಕ ಒತ್ತಡ ಉಂಟಾಗುವುದಿಲ್ಲ. ಗುರುತ್ವಾಕರ್ಷಣೆಯನ್ನು ಮೀರಿ ನೀರನ್ನು ಮೇಲಕ್ಕೆತ್ತಲು ಪಂಪ್ ಅಗತ್ಯ."
      }
    },
    "hints": {
      "en": [
        "Think about gravitational potential energy and height difference.",
        "Can water flow upward on its own without energy?"
      ],
      "hi": [
        "स्थितिज ऊर्जा और ऊंचाई के अंतर पर विचार करें।",
        "क्या पानी बिना किसी ऊर्जा के अपने आप ऊपर चढ़ सकता है?"
      ],
      "kn": [
        "ಸ್ಥಿತಿಜ ಶಕ್ತಿ ಮತ್ತು ಎತ್ತರದ ವ್ಯತ್ಯಾಸವನ್ನು ಯೋಚಿಸಿ.",
        "ಯಾವುದೇ ಶಕ್ತಿಯಿಲ್ಲದೆ ನೀರು ತಾನಾಗಿಯೇ ಮೇಲಕ್ಕೆ ಹರಿಯಲು ಸಾಧ್ಯವೇ?"
      ]
    },
    "explanation": {
      "en": "Hydrostatic pressure requires vertical height difference; lifting water upward against gravity demands mechanical work input.",
      "hi": "गुरुत्वाकर्षण के विपरीत पानी चढ़ाने के लिए बाह्य यांत्रिक कार्य (पंप) की आवश्यकता होती है।",
      "kn": "ಗುರುತ್ವಾಕರ್ಷಣೆಯ ವಿರುದ್ಧ ನೀರನ್ನು ಹರಿಸಲು ಬಾಹ್ಯ ಶಕ್ತಿಯ ಅಗತ್ಯವಿರುತ್ತದೆ."
    }
  },
  {
    "id": "solar.g8.007",
    "zone": "solar",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "solar_zenith_angle",
    "text": {
      "en": "Explain why solar panels produce noticeably less electrical power in the early morning and late afternoon compared to midday solar noon.",
      "hi": "व्याख्या करें कि सुबह और शाम के समय सौर पैनल दोपहर की तुलना में काफी कम बिजली क्यों बनाते हैं।",
      "kn": "ಮಧ್ಯಾಹ್ನದ ಸಮಯಕ್ಕೆ ಹೋಲಿಸಿದರೆ ಮುಂಜಾನೆ ಮತ್ತು ಸಂಜೆ ಸೋಲಾರ್ ಪ್ಯಾನಲ್‌ಗಳು ಕಡಿಮೆ ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸಲು ಕಾರಣವೇನು ಎಂದು ವಿವರಿಸಿ."
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "Sunlight hits at a shallow, oblique angle rather than perpendicular",
          "Photons spread out over a larger geometric area, reducing irradiance per square metre",
          "Light travels through a thicker atmospheric layer where more photons scatter"
        ],
        "hi": [
          "सुबह-शाम सूरज की किरणें लंबवत के बजाय तिरछी (Oblique angle) पड़ती हैं",
          "सौर ऊर्जा बड़े क्षेत्र में फैल जाती है, जिससे प्रति वर्ग मीटर तीव्रता घट जाती है",
          "किरणों को वायुमंडल की मोटी परत से गुजरना पड़ता है जिससे प्रकाश बिखर जाता है"
        ],
        "kn": [
          "ಮುಂಜಾನೆ ಮತ್ತು ಸಂಜೆ ಸೂರ್ಯನ ಕಿರಣಗಳು ಓರೆಯಾಗಿ ಬೀಳುತ್ತವೆ",
          "ಬೆಳಕಿನ ಕಣಗಳು ವಿಶಾಲ ಪ್ರದೇಶದಲ್ಲಿ ಹರಡಿ ಸಾಂದ್ರತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ",
          "ಬೆಳಕು ದಪ್ಪವಾದ ವಾತಾವರಣದ ಮೂಲಕ ಹಾದುಹೋಗಬೇಕಾಗುತ್ತದೆ"
        ]
      },
      "modelAnswer": {
        "en": "At morning and evening, the sun is low on the horizon, causing sunlight to strike solar panels at a shallow oblique angle. This spreads the photon flux over a larger area, reducing incident power per square metre. Furthermore, the sunlight must travel through a much thicker path through Earth’s atmosphere, scattering more light before reaching the silicon cells.",
        "hi": "सुबह और शाम के समय सूरज क्षितिज के पास होता है, जिससे किरणें पैनल पर तिरछी पड़ती हैं और रोशनी बड़े क्षेत्र में बिखर जाती है। इसके अलावा किरणों को वायुमंडल की अधिक दूरी तय करनी पड़ती है, जिससे सिलिकॉन सेल तक कम प्रकाश पहुंचता है।",
        "kn": "ಮುಂಜಾನೆ ಮತ್ತು ಸಂಜೆ ಸೂರ್ಯನ ಕಿರಣಗಳು ಓರೆಯಾಗಿ ಬೀಳುವುದರಿಂದ ಪ್ರತಿ ಚದರ ಮೀಟರ್‌ಗೆ ತಲುಪುವ ಸೌರಶಕ್ತಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಅಲ್ಲದೆ ವಾತಾವರಣದ ಮೂಲಕ ಹೆಚ್ಚಿನ ದೂರ ಸಂಚರಿಸಬೇಕಾದ್ದರಿಂದ ಬೆಳಕು ಚದುರಿಹೋಗುತ್ತದೆ."
      }
    },
    "hints": {
      "en": [
        "Mention the angle of the sun: oblique / slanted vs perpendicular.",
        "Mention light spreading over a larger area and traveling through more atmosphere."
      ],
      "hi": [
        "किरणों के तिरछे कोण (Oblique angle) का उल्लेख करें।",
        "धूप के बड़े क्षेत्रफल में फैलने की बात बताएं।"
      ],
      "kn": [
        "ಕಿರಣಗಳು ಓರೆಯಾಗಿ ಬೀಳುವುದನ್ನು ಉಲ್ಲೇಖಿಸಿ.",
        "ಬೆಳಕು ಹರಡಿ ಸಾಂದ್ರತೆ ಕಡಿಮೆಯಾಗುವುದನ್ನು ತಿಳಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Cosine law of irradiance: power density is maximized when incident rays strike perpendicular (90°) to the solar panel surface at solar noon.",
      "hi": "जब सूर्य की किरणें पैनल पर लंबवत (90 डिग्री) पड़ती हैं, तब अधिकतम बिजली बनती है।",
      "kn": "ಸೂರ್ಯನ ಕಿರಣಗಳು ಲಂಬವಾಗಿ (90 ಡಿಗ್ರಿ) ಬಿದ್ದಾಗ ಮಾತ್ರ ಗರಿಷ್ಠ ಸೌರ ವಿದ್ಯುತ್ ಉತ್ಪತ್ತಿಯಾಗುತ್ತದೆ."
    }
  },
  {
    "id": "soil.g8.007",
    "zone": "soil",
    "grade": 8,
    "difficulty": 3,
    "type": "open",
    "concept": "chemical_liming_reaction",
    "text": {
      "en": "Explain how adding agricultural lime (calcium carbonate) neutralizes acidic soil and why plant roots benefit from near-neutral pH.",
      "hi": "व्याख्या करें कि कृषि चूना (कैल्शियम कार्बोनेट) अम्लीय मिट्टी को कैसे सुधारता है और पौधों की जड़ों को सामान्य pH से क्या लाभ होता है।",
      "kn": "ಕೃಷಿ ಸುಣ್ಣವು (ಕ್ಯಾಲ್ಸಿಯಂ ಕಾರ್ಬೋನೇಟ್) ಆಮ್ಲೀಯ ಮಣ್ಣನ್ನು ಹೇಗೆ ಸರಿಪಡಿಸುತ್ತದೆ ಮತ್ತು ತಟಸ್ಥ pH ನಿಂದ ಸಸ್ಯಗಳ ಬೇರುಗಳಿಗೆ ಆಗುವ ಪ್ರಯೋಜನವೇನು ಎಂದು ವಿವರಿಸಿ."
    },
    "rubric": {
      "keyPoints": {
        "en": [
          "Carbonate ions react with excess hydrogen ions (H+) to form water and CO2",
          "Raises soil pH toward the neutral range (6.0 to 7.5)",
          "Neutral pH unlocks essential nutrients like Phosphorus and prevents toxic Aluminum solubility"
        ],
        "hi": [
          "कार्बोनेट आयन मिट्टी के अतिरिक्त हाइड्रोजन आयनों (H+) को बेअसर करके पानी बनाते हैं",
          "मिट्टी का pH बढ़कर सामान्य (6.0 से 7.5) हो जाता है",
          "सामान्य pH में फास्फोरस जैसे पोषक तत्व जड़ों को आसानी से मिलते हैं और जहरीला एल्युमिनियम खत्म होता है"
        ],
        "kn": [
          "ಕಾರ್ಬೋನೇಟ್ ಅಯಾನುಗಳು ಹೆಚ್ಚುವರಿ ಹೈಡ್ರೋಜನ್ ಅಯಾನುಗಳನ್ನು (H+) ನಿಷ್ಕ್ರಿಯಗೊಳಿಸುತ್ತವೆ",
          "ಮಣ್ಣಿನ pH ತಟಸ್ಥ ಮಟ್ಟಕ್ಕೆ (6.0 ರಿಂದ 7.5) ಏರುತ್ತದೆ",
          "ರಂಜಕದಂತಹ ಪೋಷಕಾಂಶಗಳು ಬೇರುಗಳಿಗೆ ಸುಲಭವಾಗಿ ಸಿಗುತ್ತವೆ"
        ]
      },
      "modelAnswer": {
        "en": "Agricultural lime (CaCO3) dissolves in soil water, releasing carbonate ions that react with acidic hydrogen ions: CaCO3 + 2H+ → Ca2+ + H2O + CO2. This neutralizes acidity and raises the pH to 6.5-7.5. In this optimal range, essential minerals like phosphorus become chemically soluble for root absorption, while toxic aluminum and manganese ions precipitate out of solution.",
        "hi": "कृषि चूना मिट्टी में घुलकर अतिरिक्त अम्ल (H+ आयन) को उदासीन कर देता है (CaCO3 + 2H+ → Ca2+ + H2O + CO2)। इससे pH सामान्य हो जाता है, जिससे फास्फोरस जैसे मुख्य पोषक तत्व घुलनशील होकर जड़ों को मिलते हैं और विषैले तत्व दूर रहते हैं।",
        "kn": "ಕೃಷಿ ಸುಣ್ಣವು ಹೆಚ್ಚುವರಿ ಹೈಡ್ರೋಜನ್ ಅಯಾನುಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ (CaCO3 + 2H+ → Ca2+ + H2O + CO2) ಮಣ್ಣಿನ pH ಅನ್ನು 6.5 ರಿಂದ 7.5 ಕ್ಕೆ ಏರಿಸುತ್ತದೆ. ಈ ಹಂತದಲ್ಲಿ ರಂಜಕ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ಸಸ್ಯಗಳಿಗೆ ಸುಲಭವಾಗಿ ದೊರೆಯುತ್ತವೆ."
      }
    },
    "hints": {
      "en": [
        "Mention the chemical neutralization of hydrogen ions (H+).",
        "Explain how nutrient availability (like Phosphorus) improves near neutral pH."
      ],
      "hi": [
        "अम्ल (H+ आयनों) के निष्प्रभावीकरण का उल्लेख करें।",
        "पौधों के लिए पोषक तत्वों (जैसे फास्फोरस) के घुलने का कारण बताएं।"
      ],
      "kn": [
        "ಹೈಡ್ರೋಜನ್ ಅಯಾನುಗಳ ತಟಸ್ಥೀಕರಣವನ್ನು ತಿಳಿಸಿ.",
        "ರಂಜಕದಂತಹ ಪೋಷಕಾಂಶಗಳು ಸಸ್ಯಗಳಿಗೆ ದೊರೆಯುವುದನ್ನು ವಿವರಿಸಿ."
      ]
    },
    "explanation": {
      "en": "Liming neutralizes soil acidity through chemical acid-base neutralization, optimizing nutrient solubility and microbial activity.",
      "hi": "चूना मिलाने से रासायनिक उदासीनीकरण होता है और मिट्टी में पोषक तत्वों की उपलब्धता बढ़ जाती है।",
      "kn": "ಸುಣ್ಣದ ಬಳಕೆಯು ಆಮ್ಲ-ಕ್ಷಾರ ತಟಸ್ಥೀಕರಣದ ಮೂಲಕ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಲಭ್ಯತೆಯನ್ನು ಗರಿಷ್ಠಗೊಳಿಸುತ್ತದೆ."
    }
  }
];
