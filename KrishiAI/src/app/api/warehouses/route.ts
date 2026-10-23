import { NextRequest, NextResponse } from "next/server";
import { WAREHOUSE_DIRECTORY } from "@/lib/mahavistaarData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const district = (searchParams.get("district") || "").toLowerCase().trim();
    const type = (searchParams.get("type") || "").toLowerCase().trim();

    let list = [...WAREHOUSE_DIRECTORY];

    if (district && district !== "all") {
      list = list.filter((w) => w.district.toLowerCase().includes(district));
    }

    if (type && type !== "all") {
      list = list.filter((w) => w.type.toLowerCase().includes(type));
    }

    if (query) {
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.address.toLowerCase().includes(query) ||
          w.taluka.toLowerCase().includes(query) ||
          w.district.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      warehouses: list
    });
  } catch (error) {
    console.error("GET /api/warehouses error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch warehouses" }, { status: 500 });
  }
}
