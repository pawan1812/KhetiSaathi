export interface GovtScheme {
  id: string;
  name: { mr: string; hi: string; en: string };
  badge: { mr: string; hi: string; en: string };
  benefit: { mr: string; hi: string; en: string };
  summary: { mr: string; hi: string; en: string };
  eligibility: { mr: string[]; hi: string[]; en: string[] };
  documents: { mr: string[]; hi: string[]; en: string[] };
  applyUrl: string;
  category: "subsidy" | "loan" | "insurance" | "grant";
}

export const GOVT_SCHEMES_DATA: GovtScheme[] = [
  {
    id: "kcc_zero_percent",
    name: {
      mr: "KCC ०% व्याज पीक कर्ज योजना (डॉ. पंजाबराव देशमुख व्याज सवलत)",
      hi: "KCC 0% ब्याज फसल ऋण योजना (किसान क्रेडिट कार्ड)",
      en: "Kisan Credit Card (KCC) 0% Effective Interest Crop Loan",
    },
    badge: {
      mr: "०% व्याज दर",
      hi: "0% ब्याज दर",
      en: "0% Interest Rate",
    },
    benefit: {
      mr: "₹३ लाखांपर्यंतच्या पीक कर्जावर वेळेवर परतफेड केल्यास प्रत्यक्ष व्याजदर शून्य टक्के (०%)",
      hi: "समय पर अदायगी करने पर ₹3 लाख तक के फसल ऋण पर 0% ब्याज दर",
      en: "Effective 0% interest rate up to ₹3,00,000 crop loan upon prompt annual repayment",
    },
    summary: {
      mr: "महाराष्ट्र शासनाच्या डॉ. पंजाबराव देशमुख व्याज सवलत योजनेनुसार, केंद्र सरकारची ३% आणि राज्य सरकारची ३% ते ४% व्याज सवलत मिळून ₹३ लाखांपर्यंतचे कर्ज पूर्णपणे बिनव्याजी होते.",
      hi: "केंद्र सरकार की 3% और महाराष्ट्र सरकार की 3% से 4% ब्याज छूट मिलाकर 1 वर्ष के भीतर ऋण चुकाने पर प्रभावी ब्याज 0% हो जाता है।",
      en: "Combines Central 3% Prompt Repayment Incentive with Maharashtra State Subvention to provide completely zero-interest working capital for farmers.",
    },
    eligibility: {
      mr: [
        "जमीनधारक शेतकरी (७/१२ धारक), कुळ किंवा भाडेतत्त्वावर शेती करणारे शेतकरी",
        "कर्जाची रक्कम कमाल ₹३,००,००० पर्यंत असणे आवश्यक",
        "१२ महिन्यांच्या आत नियमित परतफेड करणे बंधनकारक",
      ],
      hi: [
        "भूस्वामी किसान (खतौनी धारक) या पंजीकृत पट्टेदार किसान",
        "ऋण राशि अधिकतम ₹3,00,000 तक होनी चाहिए",
        "12 महीने के अंदर ऋण चुकाना अनिवार्य है",
      ],
      en: [
        "Owner cultivators, tenant farmers, or sharecroppers with valid crop land",
        "Loan amount capped up to ₹3,00,000 for 0% subvention benefit",
        "Strict 12-month prompt repayment cycle required",
      ],
    },
    documents: {
      mr: ["७/१२ व ८-अ उतारा", "आधार कार्ड व पॅन कार्ड", "चालू पीक पेरा नोंद", "इतर बँकेचे थकबाकी नसलेले प्रमाणपत्र"],
      hi: ["खतौनी व भू-अभिलेख 8-ए", "आधार कार्ड व पैन कार्ड", "फसल बुवाई प्रमाण पत्र", "अदेय प्रमाण पत्र (No Dues)"],
      en: ["7/12 & 8-A Land Record Extracts", "Aadhaar Card & PAN Card", "Crop Sowing Declaration", "No Dues Certificate"],
    },
    applyUrl: "https://www.myscheme.gov.in/schemes/kcc",
    category: "loan",
  },
  {
    id: "pm_kisan",
    name: {
      mr: "पीएम-किसान सन्मान निधी योजना",
      hi: "प्रधानमंत्री किसान सम्मान निधि (PM-Kisan)",
      en: "Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)",
    },
    badge: {
      mr: "₹६,००० / वर्ष",
      hi: "₹6,000 / वर्ष",
      en: "₹6,000 / Year",
    },
    benefit: {
      mr: "दर चार महिन्यांनी ₹२,००० चा हप्ता (एकूण ₹६,००० प्रति वर्ष) थेट बँक खात्यात",
      hi: "हर 4 महीने पर ₹2,000 की किस्त (वार्षिक ₹6,000) सीधे DBT बैंक खाते में",
      en: "Direct DBT benefit of ₹6,000 annually paid in 3 equal installments of ₹2,000",
    },
    summary: {
      mr: "अल्प व अत्यल्प भूधारक शेतकरी कुटुंबांना शेतीतील बियाणे, खते व दैनंदिन गरजा भागवण्यासाठी केंद्र सरकारकडून थेट आर्थिक मदत.",
      hi: "छोटे और सीमांत किसान परिवारों को कृषि आदान और घरेलू जरूरतों के लिए केंद्र सरकार द्वारा सीधी वित्तीय सहायता।",
      en: "Direct income support for all landholding farmer families across India to meet agricultural and household input expenses.",
    },
    eligibility: {
      mr: [
        "स्वतःच्या नावावर लागवडीयोग्य शेतजमीन असणारे सर्व शेतकरी कुटुंब",
        "बँक खाते आधार क्रमांकाशी संलग्न (Aadhaar Seeding / e-KYC) असणे अनिवार्य",
        "घटनात्मक पद, सरकारी नोकरदार किंवा आयकर भरणारे कुटुंब वगळून",
      ],
      hi: [
        "कृषि योग्य भूमि का स्वामित्व रखने वाले सभी किसान परिवार",
        "बैंक खाता आधार से लिंक और ई-केवाईसी पूर्ण होना अनिवार्य",
        "संवैधानिक पदधारक, सरकारी कर्मचारी और आयकरदाता अपात्र",
      ],
      en: [
        "Farmer families owning cultivable agricultural land in their name",
        "Aadhaar-seeded bank account and portal e-KYC compliance mandatory",
        "Excludes institutional landholders, government employees, and income taxpayers",
      ],
    },
    documents: {
      mr: ["आधार कार्ड", "७/१२ उतारा", "बँक पासबुक झेरॉक्स", "सक्रिय मोबाईल क्रमांक"],
      hi: ["आधार कार्ड", "खतौनी / जमाबंदी", "बैंक पासबुक", "सक्रिय मोबाइल नंबर"],
      en: ["Aadhaar Card", "Land Title Deeds (7/12 Extract)", "Bank Passbook Copy", "Mobile Number linked with Aadhaar"],
    },
    applyUrl: "https://pmkisan.gov.in/",
    category: "grant",
  },
  {
    id: "namo_shetkari",
    name: {
      mr: "नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र)",
      hi: "नमो शेतकरी महासम्मान निधि योजना (महाराष्ट्र)",
      en: "Namo Shetkari Mahasanman Nidhi (Maharashtra State)",
    },
    badge: {
      mr: "अतिरिक्त ₹६,००० / वर्ष",
      hi: "अतिरिक्त ₹6,000 / वर्ष",
      en: "Extra ₹6,000 / Year",
    },
    benefit: {
      mr: "पीएम-किसानच्या ₹६,००० व्यतिरिक्त महाराष्ट्र शासनाकडून ₹६,००० (एकूण ₹१२,००० प्रति वर्ष)",
      hi: "पीएम-किसान के अलावा महाराष्ट्र सरकार से ₹6,000 (कुल ₹12,000 प्रति वर्ष)",
      en: "Additional ₹6,000/yr from Maharashtra Govt, bringing total annual assistance to ₹12,000",
    },
    summary: {
      mr: "महाराष्ट्र शासनाने राज्यातील शेतकऱ्यांच्या उत्पन्नवाढीसाठी सुरू केलेली विशेष योजना. पीएम-किसान योजनेत पात्र असलेल्या सर्व शेतकऱ्यांना याचा थेट लाभ मिळतो.",
      hi: "महाराष्ट्र सरकार द्वारा राज्य के किसानों को प्रति वर्ष ₹6,000 की अतिरिक्त सहायता देने वाली महत्वाकांक्षी योजना।",
      en: "Flagship Maharashtra state supplemental initiative doubling financial assistance for local registered cultivators.",
    },
    eligibility: {
      mr: [
        "महाराष्ट्रातील रहिवासी शेतकरी असणे आवश्यक",
        "केंद्र शासनाच्या पीएम-किसान सन्मान निधी योजनेत पात्र व सक्रिय लाभार्थी असणे गरजेचे",
      ],
      hi: [
        "महाराष्ट्र राज्य का मूल निवासी किसान होना आवश्यक",
        "केंद्र की पीएम-किसान योजना में सक्रिय लाभार्थी होना अनिवार्य",
      ],
      en: [
        "Resident farmer of Maharashtra state",
        "Must be an active, approved beneficiary under Central PM-Kisan scheme",
      ],
    },
    documents: {
      mr: ["पीएम-किसान लाभार्थी नोंदणी क्रमांक", "आधार कार्ड", "महाराष्ट्र ७/१२ उतारा"],
      hi: ["पीएम-किसान पंजीयन क्रमांक", "आधार कार्ड", "महाराष्ट्र खतौनी"],
      en: ["PM-Kisan Registration ID", "Aadhaar Card", "Maharashtra Land Record"],
    },
    applyUrl: "https://mahadbt.maharashtra.gov.in/",
    category: "grant",
  },
  {
    id: "pmfby_one_rupee",
    name: {
      mr: "प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)",
      hi: "प्रधानमंत्री फसल बीमा योजना (₹1 में संपूर्ण सुरक्षा)",
      en: "PM Fasal Bima Yojana (PMFBY) ₹1 Token Crop Insurance",
    },
    badge: {
      mr: "फक्त ₹१ प्रिमियम",
      hi: "केवल ₹1 प्रीमियम",
      en: "Just ₹1 Premium",
    },
    benefit: {
      mr: "दुष्काळ, अतिवृष्टी, गारपीट व चक्रीवादळामुळे पिकांचे नुकसान झाल्यास थेट १००% भरपाई",
      hi: "बाढ़, सूखा, ओलावृष्टि व बेमौसम बारिश से फसल नष्ट होने पर शत-प्रतिशत क्लेम",
      en: "Comprehensive crop loss compensation for natural calamities, hail, and unseasonal storms",
    },
    summary: {
      mr: "महाराष्ट्र शासनाने शेतकऱ्यांवरील प्रिमियमचा बोजा स्वतः उचलून फक्त ₹१ मध्ये सर्व खरीप व रब्बी पिकांना विमा संरक्षण उपलब्ध करून दिले आहे.",
      hi: "महाराष्ट्र सरकार ने किसानों के हिस्से का प्रीमियम वहन कर केवल ₹1 के सांकेतिक शुल्क पर पूर्ण बीमा सुरक्षा प्रदान की है।",
      en: "Maharashtra state covers the farmer's premium share, offering universal protection for ₹1 token fee across Kharif & Rabi seasons.",
    },
    eligibility: {
      mr: [
        "अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व शेतकरी (कर्जदार व बिगर-कर्जदार)",
        "पीक पेरणीच्या मुदतीपूर्वी विमा नोंदणी करणे आवश्यक",
      ],
      hi: [
        "अधिसूचित क्षेत्र में अधिसूचित फसलें बोने वाले सभी किसान",
        "बुवाई के 1 माह के भीतर पोर्टल पर पंजीकरण अनिवार्य",
      ],
      en: [
        "All cultivators growing notified crops in notified insurance blocks",
        "Registration before season cut-off date via portal or CSC center",
      ],
    },
    documents: {
      mr: ["७/१२ उतारा व पीक पेरा स्वयंघोषणा", "आधार कार्ड", "बँक पासबुक प्रत"],
      hi: ["खतौनी व बुवाई स्व-घोषणा पत्र", "आधार कार्ड", "बैंक खाता विवरण"],
      en: ["7/12 Extract with Sowing Declaration", "Aadhaar Card", "Bank Account Details"],
    },
    applyUrl: "https://pmfby.gov.in/",
    category: "insurance",
  },
  {
    id: "kusum_solar_pump",
    name: {
      mr: "पीएम-कुसुम सौर कृषी पंप योजना (९०% शासकीय अनुदान)",
      hi: "पीएम-कुसुम सोलर पंप योजना (90% सरकारी सब्सिडी)",
      en: "PM-KUSUM Component-B (90% Solar Agricultural Pump Subsidy)",
    },
    badge: {
      mr: "९०% अनुदान",
      hi: "90% सब्सिडी",
      en: "90% Subsidy",
    },
    benefit: {
      mr: "३ HP, ५ HP व ७.५ HP क्षमतेच्या सौर कृषी पंपावर ९०% पर्यंत थेट अनुदान",
      hi: "3 HP, 5 HP एवं 7.5 HP सोलर पंप पर 90% तक सरकारी सब्सिडी",
      en: "90% capital subsidy (30% Central + 60% State) for off-grid 3HP, 5HP, and 7.5HP solar pumps",
    },
    summary: {
      mr: "शेतात विहिरी किंवा बोअरवेल असूनही वीज जोडणी नसलेल्या शेतकऱ्यांना दिवसा शाश्वत सिंचन करण्यासाठी सौर पंप उपलब्ध करून दिले जातात.",
      hi: "जिन किसानों के पास सिंचाई का साधन (कुआं/बोरवेल) है लेकिन बिजली कनेक्शन नहीं है, उन्हें दिन में सिंचाई हेतु सोलर पंप दिए जाते हैं।",
      en: "Provides off-grid solar water pumping systems enabling reliable daytime irrigation without grid electricity dependency.",
    },
    eligibility: {
      mr: [
        "शेतकऱ्याकडे स्वतःची विहीर, बोअरवेल किंवा पाण्याचा शाश्वत स्त्रोत असणे आवश्यक",
        "शेतात पारंपारिक वीज जोडणी नसावी",
      ],
      hi: [
        "किसान के पास जल स्रोत (कुआं/बोरवेल/तालाब) होना आवश्यक",
        "कृषि पंप हेतु पारंपरिक ग्रिड बिजली कनेक्शन न हो",
      ],
      en: [
        "Individual farmer with reliable water source (well, borewell, or canal)",
        "Site must lack conventional grid electrical pump connection",
      ],
    },
    documents: {
      mr: ["७/१२ व ८-अ उतारा", "जलस्त्रोत प्रमाणपत्र (विहीर/बोअरवेल नोंद)", "आधार कार्ड", "विद्युत जोडणी नसलेले हमीपत्र"],
      hi: ["खतौनी 7/12 व 8-ए", "जल स्रोत प्रमाण पत्र", "आधार कार्ड", "बिजली कनेक्शन न होने का शपथ पत्र"],
      en: ["7/12 & 8-A Extracts", "Water Source Certificate", "Aadhaar Card", "No Electricity Connection Affidavit"],
    },
    applyUrl: "https://mahadbt.maharashtra.gov.in/",
    category: "subsidy",
  },
];
