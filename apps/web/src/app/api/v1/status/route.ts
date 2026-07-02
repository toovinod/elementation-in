import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [sessions, annotations, pending, webhooks] = await Promise.all([
    prisma.session.count(),
    prisma.annotation.count(),
    prisma.annotation.count({ where: { status: { in: ["pending", "acknowledged"] } } }),
    prisma.webhookEndpoint.count({ where: { enabled: true } }),
  ]);

  return NextResponse.json({
    ok: true,
    service: "elementation-api",
    storage: "prisma",
    counts: { sessions, annotations, pending, webhooks },
    timestamp: new Date().toISOString(),
  });
}
