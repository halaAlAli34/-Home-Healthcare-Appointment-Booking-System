import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const caregiverId =
    request.nextUrl.searchParams.get("caregiverId");
  const date = request.nextUrl.searchParams.get("date");
  const startTime =
    request.nextUrl.searchParams.get("startTime");

  return NextResponse.json({
    available: true,
    message: "Availability API is working.",
    serviceId,
    caregiverId,
    date,
    startTime,
  });
}