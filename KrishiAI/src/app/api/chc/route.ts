import { NextRequest, NextResponse } from "next/server";
import { CHC_CENTRES_DB } from "@/lib/mahavistaarData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const district = (searchParams.get("district") || "").toLowerCase().trim();

    let list = [...CHC_CENTRES_DB];

    if (district && district !== "all") {
      list = list.filter((c) => c.district.toLowerCase().includes(district));
    }

    if (query) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.village.toLowerCase().includes(query) ||
          c.taluka.toLowerCase().includes(query) ||
          c.machinery.some((m) => m.type.toLowerCase().includes(query) || m.model.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      centres: list
    });
  } catch (error) {
    console.error("GET /api/chc error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch CHC centres" }, { status: 500 });
  }
}
