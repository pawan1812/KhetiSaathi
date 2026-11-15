import { NextRequest, NextResponse } from "next/server";
import { RTDB_BASE_URL } from "@/lib/firebaseAdmin";
import { PROMPT_VERSION } from "@/lib/agent/farmAgent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-memory record of feedbacks for instant admin review
const inMemoryFeedbacks: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uid = "user-001",
      helpful, // boolean: true = yes, false = no
      acted,   // boolean: true = yes, false = no
      crop,
      sowingDate,
      actionMessage,
      actionReason,
      urgency,
      district,
      comment
    } = body;

    const feedbackId = `fb-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      id: feedbackId,
      uid,
      helpful: Boolean(helpful),
      acted: Boolean(acted),
      crop: crop || "General",
      sowingDate: sowingDate || null,
      district: district || "Nashik",
      action: {
        urgency: urgency || "medium",
        message: actionMessage || "",
        reason: actionReason || ""
      },
      promptVersion: PROMPT_VERSION,
      comment: comment || "",
      createdAt: new Date().toISOString()
    };

    inMemoryFeedbacks.unshift(record);
    if (inMemoryFeedbacks.length > 200) {
      inMemoryFeedbacks.pop();
    }

    // Persist to Firebase Realtime Database
    try {
      await fetch(`${RTDB_BASE_URL}/farm_action_feedback/${feedbackId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
    } catch (fbErr) {
      console.warn("Feedback DB sync notice:", fbErr);
    }

    return NextResponse.json({
      success: true,
      feedbackId,
      message: "Feedback recorded successfully."
    });
  } catch (error: any) {
    console.error("POST /api/farm-action/feedback error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // e.g. "not_helpful"

    // Fetch from Realtime DB or fallback to memory
    let allFeedbacks = [...inMemoryFeedbacks];

    try {
      const res = await fetch(`${RTDB_BASE_URL}/farm_action_feedback.json`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          const list = Object.values(data);
          if (list.length > 0) {
            allFeedbacks = list as any[];
          }
        }
      }
    } catch {}

    if (filter === "not_helpful") {
      allFeedbacks = allFeedbacks.filter((f) => f.helpful === false);
    }

    // Sort newest first
    allFeedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      totalCount: allFeedbacks.length,
      feedbacks: allFeedbacks
    });
  } catch (error: any) {
    console.error("GET /api/farm-action/feedback error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
