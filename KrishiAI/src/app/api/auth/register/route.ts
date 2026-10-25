import { NextRequest, NextResponse } from "next/server";
import { registerFarmer } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, phone, password, acres, crops, state, district, village } = body;

    const result = await registerFarmer({
      name,
      phone,
      password,
      acres,
      crops,
      state,
      district,
      village,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "नोंदणी अयशस्वी झाली (Registration failed).",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      sessionToken: result.sessionToken,
      message: "शेतकरी खात्याची डेटाबेसमध्ये सुरक्षित नोंदणी झाली (Farmer account successfully registered in database with encrypted password).",
    });

    response.cookies.set("khetisaathi_session", result.sessionToken || "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set("khetisaathi_uid", result.user.uid, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: unknown) {
    console.error("[API Auth Register Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: (err as Error)?.message || "Internal server error during registration.",
      },
      { status: 500 }
    );
  }
}
