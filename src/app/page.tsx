"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  volume: number;
  buyLimit: number;
};

type PricePoint = {
  timestamp: number;
  avgHighPrice: number | null;
  avgLowPrice: number | null;
};

const numberFormat = new Intl.NumberFormat("en-US");

const formatGp = (value: number) => `${numberFormat.format(Math.round(value))} gp`;

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const initials = (name: string) =>
  name.split(" ").map((word) => word[0]).join("").slice(0, 2);

const getAverageMargin = (items: Opportunity[]) => {
  if (!items.length) {
    return 0;
  }

  return items.reduce((total, item) => total + (item.sellPrice - item.buyPrice) / item.buyPrice, 0) / items.length;
};

const PriceChart = ({ points }: { points: PricePoint[] }) => {
  const width = 900;
  const height = 250;
  const padding = 22;
  const values = points
    .flatMap((point) => [point.avgHighPrice, point.avgLowPrice])
    .filter((value): value is number => value !== null);

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;

  const toPoint = (value: number, index: number) => {
    const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - minimum) / range) * (height - padding * 2);

    return {
      x,
      y,
    };
  };

  const chartPoints = points.map((point, index) => ({
    timestamp: point.timestamp,
    high: point.avgHighPrice !== null ? toPoint(point.avgHighPrice, index) : null,
    low: point.avgLowPrice !== null ? toPoint(point.avgLowPrice, index) : null,
    highPrice: point.avgHighPrice,
    lowPrice: point.avgLowPrice,
  }));

  const highPoints = chartPoints
    .map((point) => (point.high ? `${point.high.x},${point.high.y}` : null))
    .filter(Boolean)
    .join(" ");

  const lowPoints = chartPoints
    .map((point) => (point.low ? `${point.low.x},${point.low.y}` : null))
    .filter(Boolean)
    .join(" ");

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hoveredPoint = hoveredIndex === null ? null : chartPoints[hoveredIndex];

  const tooltipStyle = hoveredPoint
    ? {
        left: `${Math.min(Math.max((hoveredPoint.high?.x ?? hoveredPoint.low?.x ?? 0) / width * 100, 10), 90)}%`,
        top: `${Math.max((hoveredPoint.high?.y ?? hoveredPoint.low?.y ?? 0) / height * 100 - 12, 8)}%`,
      }
    : undefined;

  const handleChartHover = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * width;

    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    chartPoints.forEach((point, index) => {
      const x = point.high?.x ?? point.low?.x ?? 0;
      const distance = Math.abs(x - pointerX);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex);
  };

  return (
    <div className="price-chart" aria-label="Six hour buy and sell price graph">
      <div className="price-chart-legend">
        <span><i className="legend-high" /> Instant buy</span>
        <span><i className="legend-low" /> Instant sell</span>
      </div>
      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          style={{ width: "100%", display: "block" }}
          onMouseMove={handleChartHover}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {[0, 1, 2, 3, 4].map((line) => (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={padding + line * ((height - padding * 2) / 4)}
              y2={padding + line * ((height - padding * 2) / 4)}
              className="chart-grid"
            />
          ))}
          <polyline points={highPoints} className="chart-high" />
          <polyline points={lowPoints} className="chart-low" />
          <rect x={padding} y={0} width={width - padding * 2} height={height} fill="transparent" />
          {chartPoints.map((point, index) => (
            <g key={point.timestamp}>
              {point.high && (
                <circle
                  cx={point.high.x}
                  cy={point.high.y}
                  r={hoveredIndex === index ? 5 : 0}
                  fill="#6ae6b8"
                  opacity={hoveredIndex === index ? 1 : 0}
                />
              )}
              {point.low && (
                <circle
                  cx={point.low.x}
                  cy={point.low.y}
                  r={hoveredIndex === index ? 5 : 0}
                  fill="#55d0ff"
                  opacity={hoveredIndex === index ? 1 : 0}
                />
              )}
            </g>
          ))}
        </svg>

        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              transform: "translate(-50%, -100%)",
              background: "rgba(8, 24, 22, 0.94)",
              color: "#e6f3ef",
              border: "1px solid rgba(118, 200, 175, 0.5)",
              borderRadius: 4,
              padding: "6px 8px",
              fontSize: 12,
              lineHeight: 1.4,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
              ...tooltipStyle,
            }}
          >
            <div>{new Date(hoveredPoint.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div>Buy: {hoveredPoint.highPrice !== null ? formatGp(hoveredPoint.highPrice) : "—"}</div>
            <div>Sell: {hoveredPoint.lowPrice !== null ? formatGp(hoveredPoint.lowPrice) : "—"}</div>
          </div>
        )}
      </div>
      <div className="price-chart-axis">
        <span>
          {points.length
            ? new Date(points[0].timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
        <span>6 hours</span>
        <span>
          {points.length
            ? new Date(points[points.length - 1].timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [source, setSource] = useState<"live" | "database">("live");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Opportunity | null>(null);
  const [pricePoints, setPricePoints] = useState<PricePoint[]>([]);

  useEffect(() => {
    let active = true;

    fetch("/api/items")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load prices");
        return response.json();
      })
      .then((result: { items: Opportunity[]; source: "live" | "database" }) => {
        if (!active) return;

        setOpportunities(result.items);
        setSelectedItem(result.items[0] ?? null);
        setSource(result.source);
      })
      .catch(() => {
        if (active) setSource("database");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    fetch(`/api/items/${selectedItem.id}`)
      .then((response) => response.json())
      .then((result: { points?: PricePoint[] }) => setPricePoints(result.points ?? []))
      .catch(() => setPricePoints([]));
  }, [selectedItem]);

  const averageMargin = getAverageMargin(opportunities);

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">GE</span>GE SCOUT
        </div>
        <nav>
          <a className="active" href="#opportunities">Opportunities</a>
          <a href="#watchlist">Watchlist</a>
          <a href="#about">About</a>
        </nav>
        <div className="status">
          <span className="pulse" /> LIVE DATA <span className="divider" /> Sign in
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">GRAND EXCHANGE / MARKET INTELLIGENCE</p>
          <h1>
            Find the spread.<br />
            <em>Make the flip.</em>
          </h1>
          <p className="intro">
            A focused market scanner for OSRS traders. Spot healthy margins, check liquidity,
            and make your next move with confidence.
          </p>
        </div>
        <div className="hero-note">
          <span>Price source</span>
          <strong>{source === "live" ? "RuneScape Wiki" : "Database fallback"}</strong>
          <small>Updated every 5 minutes</small>
        </div>
      </section>

      <section className="metrics">
        <div>
          <span>TRACKED ITEMS</span>
          <strong>{opportunities.length || "—"}</strong>
          <small>From your watchlist</small>
        </div>
        <div>
          <span>AVG. MARGIN</span>
          <strong>{averageMargin ? `${(averageMargin * 100).toFixed(2)}%` : "—"}</strong>
          <small>Across tracked items</small>
        </div>
        <div>
          <span>FLIP CAPITAL</span>
          <strong>
            {opportunities.length
              ? formatCompact(opportunities.reduce((total, item) => total + item.buyPrice, 0))
              : "—"}
          </strong>
          <small>One of each item</small>
        </div>
        <div>
          <span>OPPORTUNITIES</span>
          <strong>{opportunities.filter((item) => item.sellPrice > item.buyPrice).length || "—"}</strong>
          <small>Positive spread</small>
        </div>
      </section>

      <section className="workspace" id="opportunities">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SCANNER</p>
            <h2>Top opportunities</h2>
          </div>
          <button className="filter">
            All items <span>⌄</span>
          </button>
        </div>

        <div className="toolbar">
          <label className="search">
            <span>⌕</span>
            <input placeholder="Search items..." />
          </label>
          <div className="chips">
            <button className="chip selected">Best margin</button>
            <button className="chip">Highest volume</button>
            <button className="chip">Lowest risk</button>
          </div>
        </div>

        {selectedItem && (
          <>
            <div style={{ margin: "0 0 8px", color: "#e7f5ef", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {selectedItem.name} · 6 hour price history
            </div>
            <PriceChart points={pricePoints} />
          </>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>BUY PRICE</th>
                <th>SELL PRICE</th>
                <th>AFTER TAX</th>
                <th>MARGIN</th>
                <th>ROI</th>
                <th>BUY LIMIT</th>
                <th>VOLUME / DAY</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>Loading live prices...</td>
                </tr>
              ) : (
                opportunities.map((item) => {
                  const afterTax = item.sellPrice * 0.98;
                  const margin = afterTax - item.buyPrice;
                  const roi = item.buyPrice ? (margin / item.buyPrice) * 100 : 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="item">
                          <span className="item-icon">{initials(item.name)}</span>
                          <strong>{item.name}</strong>
                        </div>
                      </td>
                      <td>{formatGp(item.buyPrice)}</td>
                      <td>{formatGp(item.sellPrice)}</td>
                      <td>{formatGp(afterTax)}</td>
                      <td className="green">+{formatGp(margin)}</td>
                      <td>
                        <span className="roi">{roi.toFixed(2)}%</span>
                      </td>
                      <td>{numberFormat.format(item.buyLimit || 0)}</td>
                      <td className="muted">{numberFormat.format(Math.round(item.volume))}</td>
                      <td>
                        <button
                          className="arrow"
                          aria-label={`Open ${item.name}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          ↗
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        <span>
          GE SCOUT <b>v0.1.0</b>
        </span>
        <span>
          Built for the flipping community <i>◆</i>
        </span>
      </footer>
    </main>
  );
};

export default Home;
