import { NextRequest, NextResponse } from "next/server";
import { LIVE_AGRI_NOTIFICATIONS, AgriNotification } from "@/lib/agriServicesData";

let notifDb: AgriNotification[] = [...LIVE_AGRI_NOTIFICATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let list = [...notifDb];
    if (type && type !== "all") {
      list = list.filter((n) => n.type === type);
    }

    const unreadCount = notifDb.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: list
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Mark all as read
    notifDb = notifDb.map((n) => ({ ...n, isRead: true }));
    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to mark notifications read" }, { status: 500 });
  }
}
