import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
        return NextResponse.json(
            { error: "Missing coordinates" },
            { status: 400 }
        );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await googleRes.json();

    return NextResponse.json(data);
}
