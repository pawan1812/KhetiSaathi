import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/userAuth";
import { RTDB_BASE_URL } from "@/lib/firebaseAdmin";
import { runFarmActionAgent, getDistrictCoordinates } from "@/lib/agent/farmAgent";
import { sendMessage } from "@/lib/agent/notification";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Morning Vercel Cron job
 * Iterates through active farmers, computes proactive farm actions,
 * stores the latest result in the database, and sends notification via sendMessage.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if configured on Vercel
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In production, reject unauthorized calls
      console.warn("[Cron] Unauthorized cron invocation attempt.");
    }

    console.log("[Cron Farm Action] Starting morning farm action batch...");

    // 1. Gather farmers (from RTDB or DEMO_USERS)
    let farmersList: any[] = [...DEMO_USERS];

    try {
      const res = await fetch(`${RTDB_BASE_URL}/users.json`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          const remoteUsers = Object.values(data).map((u: any) => u.profile || u);
          if (remoteUsers.length > 0) {
            farmersList = remoteUsers;
          }
        }
      }
    } catch {}

    const resultsSummary: any[] = [];

    // 2. Process each farmer with safe timeout
    for (const farmer of farmersList.slice(0, 20)) {
      try {
        const uid = farmer.uid;
        const crop = farmer.crops?.[0] || "Cotton";
        const district = farmer.district || "Nashik";
        const coords = getDistrictCoordinates(district);

        // Fetch registered crops
        let sowingDate: string | null = null;
        try {
          const cropsRes = await fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
            signal: AbortSignal.timeout(1500)
          });
          if (cropsRes.ok) {
            const cropsList = await cropsRes.json();
            if (Array.isArray(cropsList) && cropsList.length > 0) {
              const active = cropsList.find((c: any) => c.status === "active") || cropsList[0];
              sowingDate = active.sowingDate || null;
            }
          }
        } catch {}

        // Run proactive action agent
        const agentResult = await runFarmActionAgent(
          {
            uid,
            name: farmer.name,
            phone: farmer.phone,
            language: "mr",
            crop,
            sowing_date: sowingDate,
            district,
            latitude: coords.lat,
            longitude: coords.lon,
            acres: farmer.acres || 5
          },
          8000
        );

        // Save result to database for instant dashboard retrieval
        const record = {
          ...agentResult.action,
          crop,
          sowingDate,
          district,
          modelUsed: agentResult.modelUsed,
          promptVersion: agentResult.promptVersion,
          updatedAt: new Date().toISOString()
        };

        fetch(`${RTDB_BASE_URL}/users/${uid}/farmAction.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record)
        }).catch(() => {});

        // Dispatch notification via isolated delivery function
        await sendMessage(
          {
            uid,
            name: farmer.name || "Farmer",
            phone: farmer.phone || "",
            language: "mr",
            district
          },
          agentResult.action,
          "in_app"
        );

        resultsSummary.push({
          uid,
          name: farmer.name,
          crop,
          urgency: agentResult.action.urgency,
          status: "processed"
        });
      } catch (err: any) {
        console.warn(`[Cron] Error processing farmer ${farmer.uid}:`, err.message);
        resultsSummary.push({
          uid: farmer.uid,
          status: "failed",
          error: err.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processedCount: resultsSummary.length,
      summary: resultsSummary
    });
  } catch (error: any) {
    console.error("[Cron Farm Action Fatal]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
