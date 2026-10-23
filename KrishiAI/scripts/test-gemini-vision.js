const fs = require('fs');
const path = require('path');

const key = process.env.GEMINI_API_KEY || '';
const imgPath = path.join(__dirname, '..', 'public', 'leaf_sample.jpg');
const imgB64 = fs.readFileSync(imgPath).toString('base64');

async function testDiagnosis() {
  const prompt = `You are KhetiSaathi AI, an expert agricultural pathologist and agronomist.
Examine this crop leaf image.
Diagnose the crop and any leaf disease/pest/deficiency or if it is healthy.
Provide step-by-step methods and treatment instructions (chemical, organic, prevention).

Return ONLY valid JSON matching this structure:
{
  "cropName": "Soybean",
  "conditionName": {
    "en": "Soybean Rust / Leaf Spot",
    "hi": "सोयाबीन पत्ती धब्बा रोग",
    "mr": "सोयाबीन तांबेरा व पानावरील ठिपके"
  },
  "confidence": 0.95,
  "severity": "moderate",
  "status": "supported",
  "symptoms": {
    "en": "Brown circular necrotic spots with yellow halos",
    "hi": "पत्तियों पर भूरे गोल धब्बे और पीलापन",
    "mr": "पानांवर तपकिरी गोलाकार ठिपके व पिवळेपणा"
  },
  "methods": {
    "chemical": {
      "en": "Spray Hexaconazole 5% EC @ 2ml/L water immediately.",
      "hi": "हेक्साकोनाजोल 5% EC 2 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।",
      "mr": "हेक्झाकोनॅझोल ५% ईसी २ मि.ली. प्रति लिटर पाण्यात फवारा."
    },
    "organic": {
      "en": "Spray Trichoderma viride or 5% Neem seed kernel extract.",
      "hi": "ट्राइकोडर्मा विरिडी या 5% नीम अर्क का छिड़काव करें।",
      "mr": "ट्रायकोडर्मा व्हिरिडी किंवा ५% निंबोळी अर्क फवारा."
    },
    "prevention": {
      "en": "Ensure proper drainage and maintain spacing to reduce humidity.",
      "hi": "खेत में जल निकासी सुधारें और वायु संचार बनाए रखें।",
      "mr": "शेतात पाण्याचा निचरा योग्य ठेवा आणि हवा खेळती राहू द्या."
    }
  },
  "sources": "ICAR Standard Agronomy Protocol",
  "kvkHelpline": "1800-180-1551"
}`;

  const models = [
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  for (const model of models) {
    try {
      console.log('Testing model:', model);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: imgB64 } },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        console.log(`SUCCESS with model: ${model}!`);
        console.log(data.candidates[0].content.parts[0].text);
        return;
      } else {
        console.log(`Model ${model} response:`, JSON.stringify(data).slice(0, 150));
      }
    } catch (err) {
      console.log(`Model ${model} error:`, err.message);
    }
  }
}

testDiagnosis();
