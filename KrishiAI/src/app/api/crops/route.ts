import { NextRequest, NextResponse } from "next/server";
import { CROP_MASTER_LIST } from "@/lib/mahavistaarData";

export interface UserCropRecord {
  id: string;
  cropId: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  plotName: string;
  gatNumber: string;
  area: number;
  areaUnit: "acre" | "hectare" | "guntha";
  status: "active" | "harvested";
  notes?: string;
  createdAt: string;
}

// In-memory cache backed by demo defaults
let userCropsDb: Record<string, UserCropRecord[]> = {
  "user-003": [
    {
      id: "crop-001",
      cropId: "onion",
      cropName: "Onion (कांदा)",
      variety: "Bhima Kiran",
      sowingDate: "2026-01-15",
      plotName: "Niphad Farm Plot A",
      gatNumber: "142/2",
      area: 5,
      areaUnit: "acre",
      status: "active",
      notes: "Drip irrigated, target yield 140 qtl/acre",
      createdAt: "2026-01-15T08:00:00Z"
    },
    {
      id: "crop-002",
      cropId: "cotton",
      cropName: "Cotton (कापूस)",
      variety: "Bt Cotton BG-II",
      sowingDate: "2025-11-20",
      plotName: "Bori River Plot B",
      gatNumber: "89/1",
      area: 8,
      areaUnit: "acre",
      status: "active",
      notes: "Pheromone traps installed at 45 DAS",
      createdAt: "2025-11-20T08:00:00Z"
    }
  ],
  "user-001": [
    {
      id: "crop-003",
      cropId: "wheat",
      cropName: "Wheat (गहू)",
      variety: "HD-2967",
      sowingDate: "2025-12-05",
      plotName: "Canal Field Plot 1",
      gatNumber: "32/4",
      area: 6,
      areaUnit: "acre",
      status: "active",
      notes: "CRI irrigation applied at 21 DAS",
      createdAt: "2025-12-05T08:00:00Z"
    }
  ]
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-003";

    const crops = userCropsDb[uid] || userCropsDb["user-003"] || [];
    return NextResponse.json({
      success: true,
      crops,
      masterList: CROP_MASTER_LIST
    });
  } catch (error) {
    console.error("GET /api/crops error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch crops" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = body.uid || "user-003";

    if (!body.cropName || !body.sowingDate || !body.area) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cropName, sowingDate, area" },
        { status: 400 }
      );
    }

    const newRecord: UserCropRecord = {
      id: `crop-${Date.now()}`,
      cropId: body.cropId || body.cropName.toLowerCase(),
      cropName: body.cropName,
      variety: body.variety || "Standard Hybrid",
      sowingDate: body.sowingDate,
      plotName: body.plotName || "Main Plot",
      gatNumber: body.gatNumber || "Gat-1",
      area: Number(body.area),
      areaUnit: body.areaUnit || "acre",
      status: "active",
      notes: body.notes || "",
      createdAt: new Date().toISOString()
    };

    if (!userCropsDb[uid]) {
      userCropsDb[uid] = [];
    }
    userCropsDb[uid].unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: "Crop added successfully",
      crop: newRecord,
      crops: userCropsDb[uid]
    });
  } catch (error) {
    console.error("POST /api/crops error:", error);
    return NextResponse.json({ success: false, error: "Failed to create crop record" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const uid = searchParams.get("uid") || "user-003";

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing crop id" }, { status: 400 });
    }

    if (userCropsDb[uid]) {
      userCropsDb[uid] = userCropsDb[uid].filter((c) => c.id !== id);
    }

    return NextResponse.json({
      success: true,
      message: "Crop record deleted",
      crops: userCropsDb[uid] || []
    });
  } catch (error) {
    console.error("DELETE /api/crops error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete crop record" }, { status: 500 });
  }
}
