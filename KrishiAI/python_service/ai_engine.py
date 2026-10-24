#!/usr/bin/env python3
"""
KHETISAATHI — Python Agricultural AI & Vision Pathology Engine
Powering real-time multimodal image analysis, leaf pathology diagnosis,
and dynamic trilingual agricultural reasoning via Google Gemini API.
"""

import sys
import os
import json
import base64
import urllib.request
import urllib.error
from pathlib import Path

# Force UTF-8 streams for seamless Marathi/Hindi Devanagari on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
if hasattr(sys.stdin, "reconfigure"):
    sys.stdin.reconfigure(encoding="utf-8")

# Load environment variables from .env or .env.local
def load_env():
    potential_paths = [
        Path(__file__).resolve().parent.parent / ".env.local",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env.local",
        Path(__file__).resolve().parent.parent.parent / ".env",
    ]
    for p in potential_paths:
        if p.exists():
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k not in os.environ:
                            os.environ[k] = v

load_env()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Prioritized Gemini Models for High-Precision Agri Diagnostics
MODELS = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
]

def call_gemini(contents, system_instruction=None, response_mime_type=None, temperature=0.2):
    """Call Google Gemini API with automatic model failover."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in environment or .env.local")

    last_error = None
    for model in MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        
        body = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
            }
        }
        
        if response_mime_type:
            body["generationConfig"]["responseMimeType"] = response_mime_type
            
        if system_instruction:
            body["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        data_bytes = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={"Content-Type": "application/json"}
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                candidates = resp_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8", errors="ignore")
            last_error = f"Model {model} HTTP Error {e.code}: {err_msg}"
            continue
        except Exception as e:
            last_error = f"Model {model} Exception: {str(e)}"
            continue

    raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")


def diagnose_leaf_image(image_base64: str, language: str = "mr"):
    """
    Perform deep real-time plant pathology diagnosis on an actual uploaded leaf picture.
    Examines genuine visual symptoms (lesions, chlorosis, discoloration, spots, pests)
    and returns trilingual scientific solutions with zero pre-made/canned responses.
    """
    # Clean up base64 string
    clean_b64 = image_base64
    mime_type = "image/jpeg"
    if "," in clean_b64:
        header, clean_b64 = clean_b64.split(",", 1)
        if "image/png" in header:
            mime_type = "image/png"
        elif "image/webp" in header:
            mime_type = "image/webp"

    prompt = f"""
You are the KhetiSaathi Chief Agronomist and Senior Plant Pathologist (कृषी विद्यापीठ वनस्पती रोगशास्त्रज्ञ).
Carefully scan and analyze the ACTUAL visual features present in this crop leaf picture.

Examine:
1. Exact visual traits: color distribution, leaf spot patterns, chlorotic yellow halos, concentric rings, pustules, necrotic margins, curling, wilting, powdery mildew, insect punctures, or healthy green tissue.
2. Identify the exact crop shown (Soybean, Cotton, Onion, Wheat, Sugarcane, Tomato, Chili, Citrus/Orange, Maize, Pomegranate, etc.).
3. Accurately diagnose the condition, disease, pest, nutrient deficiency, or confirm if the plant is healthy.
4. Calculate an authentic confidence score (0.0 to 1.0) and determine severity (healthy, low, moderate, severe).
5. Provide verified Indian agricultural university remedies (MPKV / PDKV / ICAR) with EXACT active chemical ingredients (e.g. Pyraclostrobin, Tebuconazole, Emamectin Benzoate, Diafenthiuron) and exact doses (per liter of water or per acre).
6. Provide organic remedies (Cold-pressed Neem Oil 10,000 ppm / NSKE 5%, Trichoderma viride, Dashparni Ark) and cultural farm management.
7. Provide customized fertilizer adjustments based on the diagnosis (e.g., stopping excess nitrogen/urea during fungal/rust outbreak, spraying 00:00:50 or 00:52:34).

Primary User Language: {language} (Provide complete fields in Marathi, Hindi, and English as structured below).

RETURN STRICTLY A VALID JSON OBJECT MATCHING THIS SCHEMA:
{{
  "cropName": "Identified Crop Name",
  "conditionName": {{
    "mr": "रोगाचे / किडीचे अचूक नाव मराठीत",
    "hi": "रोग / कीट का नाम हिन्दी में",
    "en": "Disease / Pest Name in English with Scientific Name"
  }},
  "confidence": 0.94,
  "severity": "low" | "moderate" | "severe" | "healthy",
  "status": "supported",
  "symptoms": {{
    "mr": "या पानावरील प्रत्यक्ष दिसणारी लक्षणे मराठीत सविस्तर",
    "hi": "पत्ती पर दिखाई देने वाले वास्तविक लक्षण हिन्दी में",
    "en": "Detailed visible symptoms observed on this specific leaf image"
  }},
  "methods": {{
    "chemical": {{
      "mr": "रासायनिक उपाय: औषधाचे नाव, घटक आणि प्रति लिटर पाण्यात मिसळण्याचे प्रमाण (उदा. २ मि.ली./लिटर)",
      "hi": "रासायनिक दवा: नाम, सक्रिय घटक एवं प्रति लीटर पानी में मात्रा",
      "en": "Chemical control with active ingredient and exact dilution dosage"
    }},
    "organic": {{
      "mr": "सेंद्रिय व जैविक उपाय (उदा. निंबोळी अर्क, ट्रायकोडर्मा, जीवामृत)",
      "hi": "जैविक एवं प्राकृतिक उपचार विधि",
      "en": "Organic and biological treatment (Neem extract, bio-agents)"
    }},
    "cultural": {{
      "mr": "मशागतीचे उपाय (उदा. पाणी निचरा, तण नियंत्रण, हवा खेळती ठेवणे)",
      "hi": "खेत प्रबंधन एवं स्वच्छता संबंधी उपाय",
      "en": "Cultural and sanitation practices"
    }},
    "prevention": {{
      "mr": "पुढील प्रादुर्भाव रोखण्यासाठी प्रतिबंधात्मक उपाय",
      "hi": "भविष्य में रोकथाम हेतु सावधानियां",
      "en": "Preventative measures for next season"
    }}
  }},
  "fertilizerAdjustment": {{
    "mr": "या रोगाच्या काळात खत व्यवस्थापन (उदा. युरिया कमी करणे, पालाश फवारणे)",
    "hi": "उर्वरक संशोधन सलाह",
    "en": "Fertilizer adjustments required during this pathological condition"
  }},
  "sources": "ICAR-State Agricultural University Diagnostic Protocol",
  "kvkHelpline": "1800-180-1551"
}}
"""

    contents = [{
        "parts": [
            {"text": prompt},
            {"inlineData": {"mimeType": mime_type, "data": clean_b64}}
        ]
    }]

    response_text = call_gemini(contents, response_mime_type="application/json")
    try:
        data = json.loads(response_text)
        return data
    except Exception as e:
        # If markdown wrapped
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())


def chat_with_agri_assistant(messages, farmer_context=None, language="mr", image_base64=None):
    """
    Generate dynamic agricultural answers tailored to farmer queries with reasoning.
    """
    farmer_ctx = farmer_context or {}
    farmer_name = farmer_ctx.get("name", "शेतकरी बंधू" if language == "mr" else "किसान भाई")
    location = farmer_ctx.get("district", "Maharashtra")
    crops = farmer_ctx.get("crops", ["Cotton", "Soybean", "Onion"])
    acres = farmer_ctx.get("acres", 4.0)

    system_instruction = f"""You are KhetiSaathi's AI Agricultural Specialist & University Extension Scientist.
You advise Indian farmers on crop health, soil amendments, scientific NPK fertilization, unseasonal weather mitigation, and government subsidies.

Context:
- Farmer Name: {farmer_name}
- Farm Location: {location}, India
- Holding Area: {acres} acres
- Primary Crops: {crops}
- Selected Language: {language} (Respond directly and naturally in Marathi if 'mr', Hindi if 'hi', or English if 'en').

Guidelines:
1. Deliver practical, step-by-step agricultural guidance with exact scientific measurements (ml/L, kg/acre).
2. Never hallucinate scheme subsidies, application deadlines, or dangerous chemical dosages.
3. Recommend cost-saving innovations like IFFCO Nano Urea & Nano DAP foliar sprays where appropriate.
4. Structure your response with clear headings, bullet points, and encouraging language.
"""

    contents = []
    for msg in messages[-8:]:
        role = "model" if msg.get("role") == "assistant" else "user"
        content_text = msg.get("content", "")
        contents.append({
            "role": role,
            "parts": [{"text": content_text}]
        })

    # If the user included an image in their chat query
    if image_base64:
        clean_b64 = image_base64
        mime_type = "image/jpeg"
        if "," in clean_b64:
            header, clean_b64 = clean_b64.split(",", 1)
            if "png" in header:
                mime_type = "image/png"
        last_user = contents[-1] if contents and contents[-1]["role"] == "user" else None
        if last_user:
            last_user["parts"].append({"inlineData": {"mimeType": mime_type, "data": clean_b64}})

    response_text = call_gemini(contents, system_instruction=system_instruction, temperature=0.3)
    return response_text


def predict_crop_intelligence(data: dict):
    """
    Dynamically predict suitable crop rotations, expected yields, and nutrient schedules.
    """
    prompt = f"""
Given the following farm parameters, predict the top 3 optimal crops, projected yield (quintals/acre), market realization, and fertilizer schedule:
- Land: {data.get('land', 3.0)} Acres
- Soil Type: {data.get('soil', 'Medium Black Soil')}
- Season: {data.get('season', 'Kharif')}
- Location: {data.get('location', 'Maharashtra')}
- Irrigation: {data.get('irrigation', 'Drip / Well')}

Return valid JSON:
{{
  "recommendations": [
    {{
      "crop": "Crop Name",
      "suitability": "96%",
      "projectedYieldQtlPerAcre": 11.5,
      "estimatedCostPerAcre": 18000,
      "projectedRevenuePerAcre": 52000,
      "netProfitPerAcre": 34000,
      "reasoning": "Reasoning in regional context",
      "keyPractices": ["Practice 1", "Practice 2"]
    }}
  ]
}}
"""
    contents = [{"parts": [{"text": prompt}]}]
    response_text = call_gemini(contents, response_mime_type="application/json")
    return json.loads(response_text)


def main():
    """CLI mode for Next.js and external execution."""
    if len(sys.argv) < 2:
        print("Usage: python ai_engine.py --mode [diagnose|chat|predict]", file=sys.stderr)
        sys.exit(1)

    mode = "diagnose"
    for i, arg in enumerate(sys.argv):
        if arg == "--mode" and i + 1 < len(sys.argv):
            mode = sys.argv[i + 1]

    # Read JSON payload from stdin
    input_data = sys.stdin.read()
    if not input_data.strip():
        print(json.dumps({"error": "No input payload provided via stdin"}))
        sys.exit(1)

    try:
        payload = json.loads(input_data)
        if mode == "diagnose":
            image_b64 = payload.get("image", "")
            lang = payload.get("language", "mr")
            result = diagnose_leaf_image(image_b64, lang)
            print(json.dumps(result, ensure_ascii=False))
        elif mode == "chat":
            messages = payload.get("messages", [])
            farmer_context = payload.get("farmerContext", {})
            lang = payload.get("language", "mr")
            image_b64 = payload.get("image")
            reply = chat_with_agri_assistant(messages, farmer_context, lang, image_b64)
            print(json.dumps({"reply": reply}, ensure_ascii=False))
        elif mode == "predict":
            result = predict_crop_intelligence(payload)
            print(json.dumps(result, ensure_ascii=False))
        else:
            print(json.dumps({"error": f"Unknown mode: {mode}"}))
            sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
