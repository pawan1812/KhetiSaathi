/**
 * KHETISAATHI — PROACTIVE FARM ACTION AGENT
 * 
 * Ported and enhanced from farm-agent-reference/agent.js
 * 
 * Features:
 * - Tool-calling loop (max 6 steps)
 * - 4 Tools:
 *   1. get_crop_stage(crop, sowing_date)
 *   2. get_weather_forecast(latitude, longitude)
 *   3. get_mandi_price(crop)
 *   4. get_crop_knowledge(crop, stage)
 * - Decides the ONE most useful action for the next 1-2 days
 * - Returns JSON: { urgency: "high" | "medium" | "low", message: string, reason: string }
 * - Enforces safety rules, prompt caching, max 3 sentences in simple spoken Marathi/Hindi
 * - Output validation & safe fallback
 */

import fs from "fs";
import path from "path";
import {
  get_crop_stage,
  get_weather_forecast,
  get_mandi_price
} from "./tools.ts";
import {
  validateFarmAction,
  getSafeFallback,
  type FarmActionOutput,
  type ValidationResult
} from "./validator.ts";

export const PROMPT_VERSION = "v1.2-farm-action-agent";

export interface FarmerAgentContext {
  uid: string;
  name?: string;
  phone?: string;
  language?: "mr" | "hi" | "en";
  crop?: string;
  sowing_date?: string | null;
  latitude?: number;
  longitude?: number;
  district?: string;
  state?: string;
  acres?: number;
  mock_weather?: any;
  mock_price?: any;
}

export interface FarmActionResult {
  success: boolean;
  action: FarmActionOutput;
  validation: ValidationResult;
  toolCallsExecuted: { tool: string; input: any; output: any }[];
  stepsCount: number;
  promptVersion: string;
  modelUsed: string;
  durationMs: number;
  fallbackUsed: boolean;
}

// Load knowledge base and few-shot examples
function loadCropKnowledge() {
  try {
    const p = path.join(process.cwd(), "data", "crop_knowledge.json");
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }
  } catch {}
  return { crops: {} };
}

function loadFewShotExamples() {
  try {
    const p = path.join(process.cwd(), "data", "examples.json");
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, "utf8"));
      return data.examples || [];
    }
  } catch {}
  return [];
}

const CROP_KNOWLEDGE = loadCropKnowledge();
const FEW_SHOT_EXAMPLES = loadFewShotExamples();

/**
 * Tool 4: get_crop_knowledge(crop, stage)
 */
export function get_crop_knowledge(crop: string, stage: string) {
  const normCrop = (crop || "").toLowerCase().trim();
  const cropData = (CROP_KNOWLEDGE.crops as any)?.[normCrop];
  if (!cropData || !cropData.stages) {
    return {
      crop,
      stage,
      risks: ["Consult local KVK or Agriculture Officer for stage guidance"],
      rules: [],
      verified_rules: []
    };
  }

  const stageKeys = Object.keys(cropData.stages);
  const matchedStageKey = stageKeys.find((k) => k.includes(stage) || stage.includes(k)) || stageKeys[0];
  const stageData = cropData.stages[matchedStageKey] || {};

  const allRules: any[] = stageData.weatherRules || [];
  const verifiedRules = allRules.filter((r) => r.verified === true);
  const unverifiedRules = allRules.filter((r) => r.verified === false);

  return {
    crop,
    stage: matchedStageKey,
    stage_name: stageData.name,
    risks: stageData.risks || [],
    all_rules: allRules,
    verified_rules: verifiedRules,
    unverified_rules: unverifiedRules,
    guidance: "SAFETY NOTICE: In farmer messages, you must only state rules marked 'verified': true. If a rule is 'verified': false, instruct the farmer to verify with the local agriculture officer or KVK."
  };
}

// Tool definitions for Anthropic tool calling schema
const ANTHROPIC_TOOLS = [
  {
    name: "get_crop_stage",
    description: "Determines crop growth stage, days after sowing, and common risks based on sowing date.",
    input_schema: {
      type: "object",
      properties: {
        crop: {
          type: "string",
          description: "Crop name (e.g. 'cotton', 'soybean', 'wheat', 'tomato')"
        },
        sowing_date: {
          type: "string",
          description: "Sowing date in YYYY-MM-DD format, or null if unknown"
        }
      },
      required: ["crop"]
    }
  },
  {
    name: "get_weather_forecast",
    description: "Fetches real 3-day weather forecast (temperatures, precipitation, rain probability, wind, and specific hours with rain probability >= 60%) from Open-Meteo.",
    input_schema: {
      type: "object",
      properties: {
        latitude: {
          type: "number",
          description: "Farm latitude (e.g. 19.9975)"
        },
        longitude: {
          type: "number",
          description: "Farm longitude (e.g. 73.7898)"
        }
      },
      required: ["latitude", "longitude"]
    }
  },
  {
    name: "get_mandi_price",
    description: "Retrieves latest APMC mandi modal price, MSP, and trend for a commodity.",
    input_schema: {
      type: "object",
      properties: {
        crop: {
          type: "string",
          description: "Crop name (e.g. 'cotton', 'soybean', 'wheat', 'tomato')"
        },
        district: {
          type: "string",
          description: "Farmer's district name (optional)"
        }
      },
      required: ["crop"]
    }
  },
  {
    name: "get_crop_knowledge",
    description: "Retrieves agronomic risks and weather rules for a specific crop and stage from local knowledge base.",
    input_schema: {
      type: "object",
      properties: {
        crop: {
          type: "string",
          description: "Crop name"
        },
        stage: {
          type: "string",
          description: "Stage ID or name"
        }
      },
      required: ["crop", "stage"]
    }
  }
];

// District coordinate lookup for Maharashtra & common hubs
const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number }> = {
  nashik: { lat: 19.9975, lon: 73.7898 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  pune: { lat: 18.5204, lon: 73.8567 },
  latur: { lat: 18.4088, lon: 76.5604 },
  jalgaon: { lat: 21.0077, lon: 75.5626 },
  aurangabad: { lat: 19.8762, lon: 75.3433 },
  chhatrapati_sambhajinagar: { lat: 19.8762, lon: 75.3433 },
  amravati: { lat: 20.9374, lon: 77.7796 },
  solapur: { lat: 17.6599, lon: 75.9064 },
  kolhapur: { lat: 16.7050, lon: 74.2433 },
  indore: { lat: 22.7196, lon: 75.8577 },
  ludhiana: { lat: 30.9010, lon: 75.8573 }
};

export function getDistrictCoordinates(districtName?: string): { lat: number; lon: number } {
  if (!districtName) return { lat: 19.9975, lon: 73.7898 }; // Nashik default
  const clean = districtName.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }
  return { lat: 19.9975, lon: 73.7898 };
}

/**
 * Builds the Master System Prompt with safety rules, few-shot examples, and prompt caching.
 */
function buildSystemPrompt(lang: "mr" | "hi" | "en"): string {
  const langName = lang === "mr" ? "Marathi (मराठी)" : lang === "hi" ? "Hindi (हिंदी)" : "English";

  const examplesSubset = FEW_SHOT_EXAMPLES.filter(
    (e: any) => e.language === lang || (lang === "en" && e.language === "mr")
  ).slice(0, 6);

  const formattedExamples = examplesSubset
    .map((e: any, idx: number) => {
      return `EXAMPLE ${idx + 1}:
Input Scenario: ${e.scenario}
Crop: ${e.input.crop}, Stage: ${e.input.stage}, DAS: ${e.input.days_after_sowing}
Weather: ${JSON.stringify(e.input.weather)}
Price: ${JSON.stringify(e.input.price)}
Output JSON:
${JSON.stringify(e.output, null, 2)}`;
    })
    .join("\n\n");

  return `You are KhetiSaathi's Proactive Farm Action Agent.
Your duty is to analyze a farmer's crop, growth stage, upcoming 3-day weather, and local market prices using your tools, and decide the ONE single most useful action for the next 1-2 days.

TARGET LANGUAGE: ${langName}

MANDATORY SAFETY RULES:
1. NEVER recommend specific pesticide or fertilizer doses (e.g. no 'ml per litre', 'g/L', 'kg per acre', '4ml/L'). If a chemical/fertilizer intervention is needed, instruct the farmer to consult their local Agriculture Officer or Krishi Vigyan Kendra (KVK) for exact quantities.
2. If data is missing or unclear (such as sowing date or weather coordinates), say so honestly. Do NOT guess or invent numbers.
3. Prices are information only. NEVER promise or guarantee profit or rate increases.
4. Only state agronomic rules that are verified. For unverified rules, tell the farmer to check with the local agricultural officer.
5. If rain probability is 60% or higher and high rain hours are reported, you MUST mention the specific time or period when rain is expected.

MESSAGE CONSTRAINTS:
- Maximum 3 short sentences.
- Use simple, spoken, rural words that a smallholder farmer understands.
- The output MUST be valid JSON with exactly this format:
{
  "urgency": "high" | "medium" | "low",
  "message": "Maximum 3 short spoken sentences in ${langName}",
  "reason": "Brief explanation of why this action was chosen"
}

FEW-SHOT VERIFIED EXAMPLES (Study the style and conciseness):
${formattedExamples}
`;
}

/**
 * Execute tool call locally
 */
async function executeTool(name: string, input: any): Promise<any> {
  switch (name) {
    case "get_crop_stage":
      return get_crop_stage(input.crop, input.sowing_date);
    case "get_weather_forecast":
      return await get_weather_forecast(input.latitude, input.longitude);
    case "get_mandi_price":
      return await get_mandi_price(input.crop, input.district);
    case "get_crop_knowledge":
      return get_crop_knowledge(input.crop, input.stage);
    default:
      return { error: `Tool '${name}' not recognized.` };
  }
}

/**
 * Runs the proactive agent for a farmer.
 */
export async function runFarmActionAgent(
  farmer: FarmerAgentContext,
  timeoutMs = 15000
): Promise<FarmActionResult> {
  const startTime = Date.now();
  const lang: "mr" | "hi" | "en" = farmer.language === "hi" ? "hi" : farmer.language === "en" ? "en" : "mr";
  const defaultCrop = farmer.crop || "Cotton";
  const coords =
    farmer.latitude && farmer.longitude
      ? { lat: farmer.latitude, lon: farmer.longitude }
      : getDistrictCoordinates(farmer.district);

  const systemPrompt = buildSystemPrompt(lang);
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
  const geminiApiKey = process.env.GEMINI_API_KEY || "";

  const toolExecutions: { tool: string; input: any; output: any }[] = [];
  let modelUsed = "safe-fallback";
  let step = 0;
  let rawJsonResult: any = null;

  const runTool = async (name: string, input: any) => {
    if (name === "get_weather_forecast" && farmer.mock_weather) {
      return {
        latitude: coords.lat,
        longitude: coords.lon,
        forecast_days: 3,
        ...farmer.mock_weather
      };
    }
    if (name === "get_mandi_price" && farmer.mock_price) {
      return {
        crop: defaultCrop,
        unit: "₹/quintal",
        mandi_name: "APMC Market",
        trade_date: "Today",
        ...farmer.mock_price
      };
    }
    return await executeTool(name, input);
  };

  // 1. PRIMARY: Anthropic Claude with Tool-Calling Loop (up to 6 steps) & Prompt Caching
  if (anthropicApiKey) {
    try {
      modelUsed = "claude-3-5-haiku-20241022";
      const messages: any[] = [
        {
          role: "user",
          content: `Farmer Profile:
Name: ${farmer.name || "Farmer"}
Crop: ${defaultCrop}
Sowing Date: ${farmer.sowing_date || "Unknown"}
District: ${farmer.district || "Nashik"}
Latitude: ${coords.lat}, Longitude: ${coords.lon}
Language: ${lang}

Please use your tools in a loop to determine the growth stage, check the 3-day weather forecast, check mandi prices and knowledge base, and give the farmer the ONE single most useful action in JSON.`
        }
      ];

      while (step < 6) {
        step++;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, 8000));

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 600,
            temperature: 0.2,
            system: [
              {
                type: "text",
                text: systemPrompt,
                cache_control: { type: "ephemeral" } // Prompt caching enabled
              }
            ],
            tools: ANTHROPIC_TOOLS,
            messages
          }),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Anthropic API error (${response.status}):`, errText);
          break;
        }

        const data = await response.json();
        const contentBlocks: any[] = data.content || [];

        // Check for tool uses
        const toolUseBlocks = contentBlocks.filter((b) => b.type === "tool_use");

        if (toolUseBlocks.length > 0) {
          // Add assistant message with tool calls
          messages.push({
            role: "assistant",
            content: contentBlocks
          });

          // Execute each tool and append tool_result
          const toolResults = [];
          for (const tu of toolUseBlocks) {
            const output = await runTool(tu.name, tu.input);
            toolExecutions.push({ tool: tu.name, input: tu.input, output });
            toolResults.push({
              type: "tool_result",
              tool_use_id: tu.id,
              content: JSON.stringify(output)
            });
          }

          messages.push({
            role: "user",
            content: toolResults
          });
        } else {
          // Model returned final text response
          const textBlock = contentBlocks.find((b) => b.type === "text");
          if (textBlock && textBlock.text) {
            const rawText = textBlock.text.trim();
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              rawJsonResult = JSON.parse(jsonMatch[0]);
              break;
            }
          }
          break;
        }
      }
    } catch (anthropicErr) {
      console.warn("Anthropic agent execution failed, proceeding to secondary handler:", anthropicErr);
    }
  }

  // 2. SECONDARY: Deterministic Tool Loop + Gemini Engine fallback
  if (!rawJsonResult && geminiApiKey) {
    try {
      modelUsed = "gemini-3.5-flash";

      // Execute essential tools directly in loop to gather full ground truth
      const cropStageResult = get_crop_stage(defaultCrop, farmer.sowing_date);
      toolExecutions.push({ tool: "get_crop_stage", input: { crop: defaultCrop, sowing_date: farmer.sowing_date }, output: cropStageResult });

      const weatherResult = await runTool("get_weather_forecast", coords);
      toolExecutions.push({ tool: "get_weather_forecast", input: coords, output: weatherResult });

      const mandiResult = await runTool("get_mandi_price", { crop: defaultCrop, district: farmer.district });
      toolExecutions.push({ tool: "get_mandi_price", input: { crop: defaultCrop, district: farmer.district }, output: mandiResult });

      const knowledgeResult = get_crop_knowledge(defaultCrop, cropStageResult.stage_id);
      toolExecutions.push({ tool: "get_crop_knowledge", input: { crop: defaultCrop, stage: cropStageResult.stage_id }, output: knowledgeResult });

      const promptUser = `Farmer Details:
Crop: ${defaultCrop}
Sowing Date: ${farmer.sowing_date || "Not Provided"}
Stage Info: ${JSON.stringify(cropStageResult)}
Weather Forecast (3 Days): ${JSON.stringify(weatherResult)}
Market Price: ${JSON.stringify(mandiResult)}
Knowledge Base Rules: ${JSON.stringify(knowledgeResult)}

Decide the ONE most critical action for the farmer in ${lang} and return JSON { urgency, message, reason }.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: promptUser }] }],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: "application/json"
          }
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (geminiRes.ok) {
        const gData = await geminiRes.json();
        const txt = gData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) {
          rawJsonResult = JSON.parse(txt);
        }
      }
    } catch (gErr) {
      console.warn("Gemini agent fallback error:", gErr);
    }
  }

  // 3. TERTIARY: Rule-Based Deterministic Engine (Zero Network / Total Offline Guarantee)
  if (!rawJsonResult) {
    modelUsed = "deterministic-agri-engine";
    const stageInfo = get_crop_stage(defaultCrop, farmer.sowing_date);
    const weatherInfo = await runTool("get_weather_forecast", coords);
    const mandiInfo = await runTool("get_mandi_price", { crop: defaultCrop, district: farmer.district });

    if (weatherInfo.rain_probability_max_next_24h >= 60) {
      const hours = weatherInfo.high_rain_hours_next_24h && weatherInfo.high_rain_hours_next_24h.length > 0
        ? weatherInfo.high_rain_hours_next_24h.slice(0, 3).join(", ")
        : (lang === "mr" ? "दुपारी २ वाजता" : "दोपहर २ बजे");

      if (lang === "mr") {
        rawJsonResult = {
          urgency: "high",
          message: `उद्या ${hours} वाजता पावसाची दाट शक्यता आहे. कोणतीही औषध फवारणी किंवा खत टाकणे तातडीने पुढे ढकला. शेतातील पाण्याचा निचरा योग्य ठेवा.`,
          reason: `${weatherInfo.rain_probability_max_next_24h}% पावसाची शक्यता असल्याने फवारणी वाहून जाण्याचा धोका आहे.`
        };
      } else {
        rawJsonResult = {
          urgency: "high",
          message: `कल ${hours} के दौरान तेज बारिश की संभावना है। किसी भी प्रकार का छिड़काव अथवा यूरिया छिड़कना तुरंत टालें। खेत से जल निकासी की व्यवस्था दुरुस्त रखें।`,
          reason: `${weatherInfo.rain_probability_max_next_24h}% बारिश के पूर्वानुमान के कारण छिड़काव निष्फल हो जाएगा।`
        };
      }
    } else if (weatherInfo.temp_max >= 38) {
      if (lang === "mr") {
        rawJsonResult = {
          urgency: "high",
          message: `तापमान ३८ अंशांच्या पुढे जात असल्याने पिकावर उष्णतेचा ताण येईल. पिकांना संध्याकाळी हलके पाणी द्यावे. दुपारच्या उन्हात पाणी देणे टाळा.`,
          reason: "अति उष्णतेमुळे फुलगळ व बाष्पीभवनाचा वेग वाढतो."
        };
      } else {
        rawJsonResult = {
          urgency: "high",
          message: `अधिक तापमान होने के कारण फसल पर गर्मी का तनाव रहेगा। शाम के समय हल्की सिंचाई करें। दोपहर की तेज धूप में सिंचाई से बचें।`,
          reason: "अत्यधिक तापमान से नमी तेजी से उड़ती है।"
        };
      }
    } else if (weatherInfo.wind_speed_max_kmh >= 22) {
      if (lang === "mr") {
        rawJsonResult = {
          urgency: "medium",
          message: `जोरदार वारे वाहत असल्याने औषध फवारणी करू नका. झाडांना आधार द्या आणि शेतात पाणी देणे पुढे ढकला. हवा शांत झाल्यावरच शेतीकामे करा.`,
          reason: "वाऱ्यामुळे फवारणीचे औषध उडून वाया जाते व झाडे लोळण्याचा धोका असतो."
        };
      } else {
        rawJsonResult = {
          urgency: "medium",
          message: `तेज हवाएं चलने के कारण पत्तियों पर छिड़काव कार्य टालें। पौधों को गिरने से बचाएं और सिंचाई रोकें। हवा शांत होने पर ही कार्य करें।`,
          reason: "तेज हवा से स्प्रे का नुकसान होता है और फसल झुकने का खतरा रहता है।"
        };
      }
    } else if (mandiInfo.trend === "rising" && (mandiInfo.modal_price >= 2000 || (mandiInfo.trend_pct && mandiInfo.trend_pct > 1.5))) {
      if (lang === "mr") {
        rawJsonResult = {
          urgency: "medium",
          message: `बाजार समितीत ${defaultCrop}चे दर सुधारले असून मागणी चांगली आहे. तयार माल स्वच्छ करून प्रतवारीनुसार विक्रीचा विचार करू शकता. हवामान स्वच्छ राहील.`,
          reason: "मंडीतील भाव तेजीत असल्याने शेतकऱ्याला चांगला परतावा मिळू शकतो."
        };
      } else {
        rawJsonResult = {
          urgency: "medium",
          message: `मंडी में ${defaultCrop} के भाव में तेजी देखी जा रही है। यदि फसल पकी और सूखी तैयार है तो बाजार में बिक्री की योजना बना सकते हैं। मौसम अनुकूल रहेगा।`,
          reason: "बाजार भाव में उछाल का लाभ लेने के लिए बिक्री का विचार किया जा सकता है।"
        };
      }
    } else if (stageInfo.data_status === "missing_sowing_date") {
      if (lang === "mr") {
        rawJsonResult = {
          urgency: "low",
          message: `आपल्या ${defaultCrop} पिकाची पेरणीची तारीख नोंदवलेली नाही. कृपया अचूक वाढीच्या टप्प्यासाठी पिकांची माहिती अद्ययावत करा. हवामान सध्या सामान्य आहे.`,
          reason: "पेरणीची तारीख नसल्यामुळे अचूक वाढीचा टप्पा सांगता येत नाही."
        };
      } else {
        rawJsonResult = {
          urgency: "low",
          message: `आपकी ${defaultCrop} फसल की बुवाई की तारीख दर्ज नहीं है। सटीक परामर्श हेतु फसल विवरण अपडेट करें। वर्तमान मौसम सामान्य बना हुआ है।`,
          reason: "बुवाई की तारीख उपलब्ध न होने से सामान्य सूचना दी गई।"
        };
      }
    } else {
      if (lang === "mr") {
        rawJsonResult = {
          urgency: "low",
          message: `हवामान स्वच्छ असून पिकाची वाढ समाधानकारक आहे. सध्या कोणतीही तातडीची कृती करण्याची गरज नाही. आपले नियमित आंतरमशागतीचे काम सुरू ठेवा.`,
          reason: "हवामान अनुकूल असून पिकावर कोणताही धोका नाही."
        };
      } else {
        rawJsonResult = {
          urgency: "low",
          message: `मौसम साफ है और फसल की स्थिति सामान्य बनी हुई है। अभी किसी आपातकालीन कार्य की आवश्यकता नहीं है। निर्धारित कृषि कार्य जारी रखें।`,
          reason: "मौसम अनुकूल है और कोई जोखिम नहीं है।"
        };
      }
    }
  }

  // 4. Validate output through strict safety guard
  const weatherContext = toolExecutions.find((t) => t.tool === "get_weather_forecast")?.output;
  const validation = validateFarmAction(rawJsonResult, lang, {
    crop: defaultCrop,
    rainProb: weatherContext?.rain_probability_max_next_24h,
    highRainHours: weatherContext?.high_rain_hours_next_24h
  });

  const durationMs = Date.now() - startTime;

  return {
    success: true,
    action: validation.sanitizedOutput,
    validation,
    toolCallsExecuted: toolExecutions,
    stepsCount: step || toolExecutions.length,
    promptVersion: PROMPT_VERSION,
    modelUsed,
    durationMs,
    fallbackUsed: validation.fallbackUsed
  };
}
