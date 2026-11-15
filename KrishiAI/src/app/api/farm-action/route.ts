import { NextRequest, NextResponse } from "next/server";
import { findUserByUid } from "@/lib/serverAuth";
import { RTDB_BASE_URL } from "@/lib/firebaseAdmin";
import { runFarmActionAgent, getDistrictCoordinates } from "@/lib/agent/farmAgent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiting in-memory map: UID -> timestamp of last request
const rateLimitMap: Record<string, number> = {};
const RATE_LIMIT_WINDOW_MS = 3000; // 3 seconds between manual refreshes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uidFromQuery = searchParams.get("uid");
    const uidFromCookie = req.cookies.get("khetisaathi_uid")?.value;
    const uid = uidFromQuery || uidFromCookie || "user-001";

    // 1. Rate limiting check
    const now = Date.now();
    const lastReq = rateLimitMap[uid] || 0;
    if (now - lastReq < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { success: false, error: "Please wait a moment before requesting another action analysis." },
        { status: 429 }
      );
    }
    rateLimitMap[uid] = now;

    // 2. Load farmer profile
    const user = await findUserByUid(uid);
    const farmerName = user?.name || "Farmer Partner";
    const district = user?.district || "Nashik";
    const state = user?.state || "Maharashtra";
    const rawCrops = user?.crops || ["Cotton"];
    const language = (searchParams.get("lang") as "mr" | "hi" | "en") || "mr";

    // 3. Load user's registered crop records with sowing date
    let sowingDate: string | null = null;
    let selectedCrop = rawCrops[0] || "Cotton";

    try {
      const cropsRes = await fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
        signal: AbortSignal.timeout(2000)
      });
      if (cropsRes.ok) {
        const cropsList = await cropsRes.json();
        if (Array.isArray(cropsList) && cropsList.length > 0) {
          const activeCrop = cropsList.find((c: any) => c.status === "active") || cropsList[0];
          selectedCrop = activeCrop.cropName || activeCrop.cropId || selectedCrop;
          sowingDate = activeCrop.sowingDate || null;
        }
      }
    } catch {
      // Fallback: check if sowing date was passed in query
      sowingDate = searchParams.get("sowing_date") || null;
    }

    const coords = getDistrictCoordinates(district);

    // 4. Run the proactive Farm Action Agent with timeout
    const result = await runFarmActionAgent(
      {
        uid,
        name: farmerName,
        phone: user?.phone,
        language,
        crop: selectedCrop,
        sowing_date: sowingDate,
        district,
        state,
        latitude: coords.lat,
        longitude: coords.lon,
        acres: user?.acres || 5
      },
      14000
    );

    // 5. Store the latest action in database so dashboard loads fast
    const actionRecord = {
      ...result.action,
      crop: selectedCrop,
      sowingDate,
      district,
      modelUsed: result.modelUsed,
      promptVersion: result.promptVersion,
      updatedAt: new Date().toISOString()
    };

    fetch(`${RTDB_BASE_URL}/users/${uid}/farmAction.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actionRecord)
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      action: result.action,
      metadata: {
        crop: selectedCrop,
        sowingDate,
        district,
        modelUsed: result.modelUsed,
        promptVersion: result.promptVersion,
        stepsExecuted: result.stepsCount,
        durationMs: result.durationMs,
        fallbackUsed: result.fallbackUsed
      }
    });
  } catch (error: any) {
    console.error("GET /api/farm-action error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Farm action agent encountered an error.",
        fallback: {
          urgency: "medium",
          message: "शेतात योग्य ओलावा ठेवा. कीटकनाशक किंवा खताच्या अचूक प्रमाणासाठी कृषी विज्ञान केंद्राशी संपर्क साधा.",
          reason: "सर्व्हर त्रुटीमुळे प्रमाणित सुरक्षित सल्ला दाखवत आहे."
        }
      },
      { status: 500 }
    );
  }
}
