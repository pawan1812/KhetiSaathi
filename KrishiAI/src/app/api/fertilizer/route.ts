import { NextRequest, NextResponse } from "next/server";
import { calculateFertilizerRequirements, FertilizerCalculationInput } from "@/lib/fertilizerEngine";

export async function POST(req: NextRequest) {
  try {
    const input: FertilizerCalculationInput = await req.json();

    if (!input.cropId || !input.area) {
      return NextResponse.json(
        { success: false, error: "Missing required inputs: cropId and area" },
        { status: 400 }
      );
    }

    const result = calculateFertilizerRequirements(input);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error("POST /api/fertilizer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate fertilizer recommendation" },
      { status: 500 }
    );
  }
}
