import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "यशस्वीरित्या बाहेर पडलात (Logged out successfully).",
  });

  response.cookies.delete("khetisaathi_session");
  response.cookies.delete("khetisaathi_uid");

  return response;
}
