import { NextResponse } from "next/server";
import { retryPendingDeliveries } from "@/server/webhooks-repo";

export async function POST() {
  const result = await retryPendingDeliveries();
  return NextResponse.json(result);
}
