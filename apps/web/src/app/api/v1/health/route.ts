import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "elementation-api",
    timestamp: new Date().toISOString(),
  });
}
