import { NextRequest, NextResponse } from "next/server";
import { findUserByUid, sanitizeUser } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uidFromQuery = searchParams.get("uid");
    const uidFromCookie = req.cookies.get("khetisaathi_uid")?.value;
    const uid = uidFromQuery || uidFromCookie;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "कोणतेही लॉगिन सत्र आढळले नाही (No active login session)." },
        { status: 401 }
      );
    }

    const user = await findUserByUid(uid);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "वापरकर्ता डेटाबेसमध्ये सापडला नाही (User not found in database)." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err: unknown) {
    console.error("[API Auth Me Error]", err);
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
