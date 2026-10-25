import { NextRequest, NextResponse } from "next/server";
import { authenticateFarmer } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "कृपया मोबाईल नंबर आणि पासवर्ड दोन्ही प्रविष्ट करा (Please provide both phone number and password).",
        },
        { status: 400 }
      );
    }

    const result = await authenticateFarmer(phone, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "लॉगिन अयशस्वी झाले (Login failed).",
        },
        { status: 401 }
      );
    }

    // Set secure cookie for gatekeeper middleware
    const response = NextResponse.json({
      success: true,
      user: result.user,
      sessionToken: result.sessionToken,
      message: "डेटाबेस पडताळणी यशस्वी! स्वागत आहे (Database verification successful! Welcome).",
    });

    response.cookies.set("khetisaathi_session", result.sessionToken || "", {
      httpOnly: false, // Accessible to JS so client store can verify
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
    console.error("[API Auth Login Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: (err as Error)?.message || "Internal server error during login.",
      },
      { status: 500 }
    );
  }
}
