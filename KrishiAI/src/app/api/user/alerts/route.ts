import { NextRequest, NextResponse } from "next/server";
import { getMandiAlerts, addMandiAlert, deleteMandiAlert } from "@/lib/firebaseService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";

    const alerts = await getMandiAlerts(uid);
    return NextResponse.json({ success: true, alerts });
  } catch (err: unknown) {
    console.error("[API Alerts GET]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = body.uid || "user-001";
    const { crop, targetPrice, currentPrice, mandi } = body;

    if (!crop || !targetPrice) {
      return NextResponse.json({ success: false, error: "Crop and target price are required" }, { status: 400 });
    }

    const alert = await addMandiAlert(uid, {
      crop,
      targetPrice: Number(targetPrice),
      currentPrice: Number(currentPrice || 0),
      mandi: mandi || "Nearby APMC",
      active: true,
    });

    return NextResponse.json({ success: true, alert });
  } catch (err: unknown) {
    console.error("[API Alerts POST]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Alert ID is required" }, { status: 400 });
    }

    await deleteMandiAlert(uid, id);
    return NextResponse.json({ success: true, message: "Alert deleted" });
  } catch (err: unknown) {
    console.error("[API Alerts DELETE]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}
