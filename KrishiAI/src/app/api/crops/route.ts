import { NextRequest, NextResponse } from "next/server";
import { CROP_MASTER_LIST } from "@/lib/agriServicesData";
import { RTDB_BASE_URL } from "@/lib/firebaseAdmin";
import { getUserProfile } from "@/lib/firebaseService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

// In-memory cache for fast response times
const userCropsDb: Record<string, UserCropRecord[]> = {
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
    },
    {
      id: "crop-004",
      cropId: "rice",
      cropName: "Rice (तांदूळ / भात)",
      variety: "PR-126",
      sowingDate: "2025-07-10",
      plotName: "Lowland Field Plot 2",
      gatNumber: "32/5",
      area: 4,
      areaUnit: "acre",
      status: "harvested",
      notes: "Direct Seeded Rice (DSR) trial",
      createdAt: "2025-07-10T08:00:00Z"
    }
  ],
  "user-002": [
    {
      id: "crop-005",
      cropId: "sugarcane",
      cropName: "Sugarcane (ऊस)",
      variety: "Co-0238",
      sowingDate: "2025-10-15",
      plotName: "Meerut Main Canal Plot",
      gatNumber: "56/1",
      area: 4,
      areaUnit: "acre",
      status: "active",
      notes: "Trench planting with drip fertigation",
      createdAt: "2025-10-15T08:00:00Z"
    },
    {
      id: "crop-006",
      cropId: "wheat",
      cropName: "Wheat (गहू)",
      variety: "PBW-343",
      sowingDate: "2025-12-01",
      plotName: "Tube-well Plot 2",
      gatNumber: "56/2",
      area: 3,
      areaUnit: "acre",
      status: "active",
      notes: "Zero tillage rabi wheat",
      createdAt: "2025-12-01T08:00:00Z"
    }
  ]
};

// Helper to generate initial plot records from user's registered crops and acreage
function generateCropsFromUserProfile(uid: string, crops: string[], totalAcres: number): UserCropRecord[] {
  if (!crops || crops.length === 0) {
    crops = ["Cotton", "Soybean"];
  }
  const acres = Math.max(1, totalAcres || 5);
  const perCropAcres = Math.max(1, Math.round((acres / crops.length) * 10) / 10);

  return crops.map((cropName, idx) => {
    const cropLower = cropName.toLowerCase().replace(/[^a-z]/g, "");
    const master = CROP_MASTER_LIST.find((m) =>
      m.id.toLowerCase().includes(cropLower) ||
      cropLower.includes(m.id.toLowerCase()) ||
      m.name.en.toLowerCase().includes(cropLower)
    ) || CROP_MASTER_LIST[idx % CROP_MASTER_LIST.length];

    // Calculate realistic sowing date between 30 and 70 days ago
    const daysAgo = 35 + (idx * 20);
    const sowDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const plotLetters = ["A", "B", "C", "D", "E"];
    const plotLetter = plotLetters[idx % plotLetters.length];

    return {
      id: `crop-${uid}-${idx + 1}`,
      cropId: master.id,
      cropName: `${master.name.en} (${master.name.mr || master.name.hi || ""})`,
      variety: master.varieties[0]?.name || "Certified Hybrid",
      sowingDate: sowDate,
      plotName: `Farm Plot ${plotLetter}`,
      gatNumber: `${100 + (idx * 12)}/${idx + 1}`,
      area: idx === crops.length - 1 ? Math.max(1, Math.round((acres - (perCropAcres * (crops.length - 1))) * 10) / 10) : perCropAcres,
      areaUnit: "acre",
      status: "active",
      notes: `Registered with farm acreage. Soil health monitored.`,
      createdAt: new Date().toISOString()
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uidFromQuery = searchParams.get("uid");
    const uidFromCookie = req.cookies.get("khetisaathi_uid")?.value;
    const uid = uidFromQuery || uidFromCookie || "user-001";

    // 1. In-memory check
    if (userCropsDb[uid] && userCropsDb[uid].length > 0) {
      return NextResponse.json({
        success: true,
        crops: userCropsDb[uid],
        masterList: CROP_MASTER_LIST
      });
    }

    // 2. Realtime Database REST API check
    try {
      const res = await fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const remoteCrops = await res.json();
        if (remoteCrops && Array.isArray(remoteCrops) && remoteCrops.length > 0) {
          userCropsDb[uid] = remoteCrops;
          return NextResponse.json({
            success: true,
            crops: remoteCrops,
            masterList: CROP_MASTER_LIST
          });
        }
      }
    } catch {
      // Continue to profile lookup
    }

    // 3. Generate tailored crops from user profile
    const profile = await getUserProfile(uid);
    const generated = generateCropsFromUserProfile(
      uid,
      profile?.crops || ["Cotton", "Soybean"],
      profile?.acres || 7
    );

    userCropsDb[uid] = generated;

    // Sync to Realtime DB in background
    fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(generated)
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      crops: generated,
      masterList: CROP_MASTER_LIST
    });
  } catch (error) {
    console.error("GET /api/crops error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch crops" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const uidFromCookie = req.cookies.get("khetisaathi_uid")?.value;
    const uid = body.uid || uidFromCookie || "user-001";

    if (!body.cropName || !body.sowingDate || !body.area) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cropName, sowingDate, area" },
        { status: 400 }
      );
    }

    const newRecord: UserCropRecord = {
      id: `crop-${Date.now()}`,
      cropId: body.cropId || body.cropName.toLowerCase().replace(/[^a-z]/g, ""),
      cropName: body.cropName,
      variety: body.variety || "Standard Hybrid",
      sowingDate: body.sowingDate,
      plotName: body.plotName || "Main Plot",
      gatNumber: body.gatNumber || "Gat-1",
      area: Number(body.area) || 1,
      areaUnit: body.areaUnit || "acre",
      status: "active",
      notes: body.notes || "",
      createdAt: new Date().toISOString()
    };

    if (!userCropsDb[uid]) {
      userCropsDb[uid] = [];
    }
    userCropsDb[uid].unshift(newRecord);

    // Sync to Firebase Realtime Database
    fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCropsDb[uid])
    }).catch(() => {});

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
    const uidFromCookie = req.cookies.get("khetisaathi_uid")?.value;
    const uid = searchParams.get("uid") || uidFromCookie || "user-001";

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing crop id" }, { status: 400 });
    }

    if (userCropsDb[uid]) {
      userCropsDb[uid] = userCropsDb[uid].filter((c) => c.id !== id);
    }

    // Sync to Firebase Realtime Database
    fetch(`${RTDB_BASE_URL}/users/${uid}/crops.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCropsDb[uid] || [])
    }).catch(() => {});

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
