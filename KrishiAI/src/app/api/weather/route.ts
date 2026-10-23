import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeather } from "@/lib/weatherService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "19.9975");
    const lon = parseFloat(searchParams.get("lon") || "73.7898");
    const name = searchParams.get("name") || "Nashik, Maharashtra";

    const weather = await fetchLiveWeather(lat, lon, name);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("Weather API route error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
