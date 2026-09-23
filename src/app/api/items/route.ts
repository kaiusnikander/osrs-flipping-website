import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PRICES_API = "https://prices.runescape.wiki/api/v2/osrs";
const USER_AGENT = "GE Scout - OSRS flipping dashboard";

type LatestPrice = {
  high: number | null;
  highTime: number | null;
  low: number | null;
  lowTime: number | null;
};

type FiveMinutePrice = {
  highPriceVolume: number | null;
  lowPriceVolume: number | null;
};

type DatabaseItem = {
  id: number;
  buyPrice: number;
  sellPrice: number;
  volume: number;
  updatedAt: Date;
};

export const GET = async () => {
  const items = await db.item.findMany({ orderBy: { volume: "desc" } });

  try {
    const [latestResponse, fiveMinuteResponse, mappingResponse] = await Promise.all([
      fetch(`${PRICES_API}/latest`, {
        headers: { "User-Agent": USER_AGENT },
        next: { revalidate: 300 },
      }),
      fetch(`${PRICES_API}/5m`, {
        headers: { "User-Agent": USER_AGENT },
        next: { revalidate: 300 },
      }),
      fetch(`${PRICES_API}/mapping`, {
        headers: { "User-Agent": USER_AGENT },
        next: { revalidate: 300 },
      }),
    ]);

    if (!latestResponse.ok || !fiveMinuteResponse.ok || !mappingResponse.ok) {
      throw new Error("RuneScape price API returned an error");
    }

    const latest = (await latestResponse.json()) as {
      data: Record<string, LatestPrice>;
    };
    const fiveMinute = (await fiveMinuteResponse.json()) as {
      data: Record<string, FiveMinutePrice>;
    };
    const mapping = (await mappingResponse.json()) as Array<{ id: number; limit?: number }>;
    const limits = Object.fromEntries(mapping.map((entry) => [String(entry.id), entry.limit ?? 0]));

    const liveItems = items.map((item: DatabaseItem) => {
      const current = latest.data[String(item.id)];
      const recent = fiveMinute.data[String(item.id)];
      const buyPrice = current?.low ?? item.buyPrice;
      const sellPrice = current?.high ?? item.sellPrice;
      const volume = recent
        ? ((recent.highPriceVolume ?? 0) + (recent.lowPriceVolume ?? 0)) * 288
        : item.volume;
      const buyLimit = Number(limits[String(item.id)] ?? 0);

      return {
        ...item,
        buyPrice,
        sellPrice,
        volume,
        buyLimit,
        updatedAt: current?.highTime || current?.lowTime
          ? new Date(Math.max(current.highTime ?? 0, current.lowTime ?? 0) * 1000)
          : item.updatedAt,
      };
    });

    return NextResponse.json({ items: liveItems, source: "live" });
  } catch {
    return NextResponse.json({ items, source: "database" });
  }
};
