import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.item.findMany({ orderBy: { volume: "desc" } });
  return NextResponse.json(items);
}
