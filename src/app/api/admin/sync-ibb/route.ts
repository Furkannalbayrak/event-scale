import { NextResponse } from "next/server";
import { scrapeAndSyncIBB } from "@/lib/ibb-scraper";

export async function POST() {
  try {
    const result = await scrapeAndSyncIBB();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}