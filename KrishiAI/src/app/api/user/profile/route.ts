import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, saveUserProfile } from "@/lib/firebaseService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";

    const profile = await getUserProfile(uid);
    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    console.error("[API Profile GET]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = body.uid || "user-001";

    const updated = await saveUserProfile(uid, body);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    console.error("[API Profile POST]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}
