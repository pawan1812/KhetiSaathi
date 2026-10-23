import { NextRequest, NextResponse } from "next/server";
import { getPredictionHistory, savePredictionHistory } from "@/lib/firebaseService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";

    const history = await getPredictionHistory(uid);
    return NextResponse.json({ success: true, history });
  } catch (err: unknown) {
    console.error("[API Predictions GET]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = body.uid || "user-001";

    const prediction = await savePredictionHistory(uid, body);
    return NextResponse.json({ success: true, prediction });
  } catch (err: unknown) {
    console.error("[API Predictions POST]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}
