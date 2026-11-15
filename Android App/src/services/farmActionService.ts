/**
 * KHETISAATHI — EXPO MOBILE APP FARM ACTION SERVICE
 * 
 * Fetches the daily proactive farm action from the KhetiSaathi Web API
 * or generates verified offline fallbacks if the device is disconnected.
 */

export interface MobileFarmAction {
  urgency: "high" | "medium" | "low";
  message: string;
  reason: string;
  crop?: string;
  district?: string;
}

const DEFAULT_API_BASE = "https://kheti-saathi.vercel.app";

export async function fetchMobileFarmAction(
  uid = "user-001",
  lang: "mr" | "hi" | "en" = "mr",
  apiBaseUrl = DEFAULT_API_BASE
): Promise<MobileFarmAction> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${apiBaseUrl}/api/farm-action?uid=${uid}&lang=${lang}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.action) {
        return {
          ...data.action,
          crop: data.metadata?.crop,
          district: data.metadata?.district
        };
      }
    }
  } catch (err) {
    console.warn("[Mobile Farm Action] Network offline, using onboard ICAR fallback:", err);
  }

  // Resilient offline fallback for Android device in low-connectivity rural zones
  if (lang === "hi") {
    return {
      urgency: "medium",
      message: "खेत में उचित नमी बनाए रखें और खरपतवार की निगरानी करें। किसी भी दवा या उर्वरक की मात्रा हेतु स्थानीय कृषि अधिकारी या केवीके से सलाह लें।",
      reason: "ऑफलाइन सुरक्षित मानक कृषि परामर्श।"
    };
  }

  if (lang === "en") {
    return {
      urgency: "medium",
      message: "Maintain balanced soil moisture and inspect fields. For exact pesticide or fertilizer dosages, please consult your local Agriculture Officer or KVK.",
      reason: "Standard verified agricultural advisory."
    };
  }

  return {
    urgency: "medium",
    message: "शेतात योग्य ओलावा ठेवा आणि तणांचे नियंत्रण करा. कोणत्याही औषध किंवा खताच्या अचूक प्रमाणासाठी स्थानिक कृषी सहाय्यक किंवा केव्हीकेशी संपर्क साधा.",
    reason: "ऑफलाइन प्रमाणित सुरक्षित शेती सल्ला."
  };
}
