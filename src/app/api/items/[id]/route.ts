import { NextResponse } from "next/server";

const PRICES_API = "https://prices.runescape.wiki/api/v2/osrs";
const USER_AGENT = "GE Scout - OSRS flipping dashboard";

type PricePoint = {
  timestamp: number;
  avgHighPrice: number | null;
  avgLowPrice: number | null;
};

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }

  try {
    const response = await fetch(`${PRICES_API}/timeseries?lookback=6h&id=${id}`, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Price history unavailable" }, { status: response.status });
    }

    const result = (await response.json()) as { data: PricePoint[] };
    return NextResponse.json({ points: result.data });
  } catch {
    return NextResponse.json({ error: "Price history unavailable" }, { status: 502 });
  }
};