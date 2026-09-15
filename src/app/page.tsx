const opportunities = [
  ["Abyssal whip", "AW", "2,400,000", "2,435,000", "35,000", "1.46%", "1,842"],
  ["Dragon boots", "DB", "182,000", "185,500", "3,500", "1.92%", "6,321"],
  ["Rune platebody", "RP", "38,400", "39,800", "1,400", "3.65%", "9,044"],
  ["Runite bar", "RB", "11,600", "12,100", "500", "4.31%", "12,870"],
];

export default function Home() {
  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">GE</span>GE SCOUT</div><nav><a className="active" href="#opportunities">Opportunities</a><a href="#watchlist">Watchlist</a><a href="#about">About</a></nav><div className="status"><span className="pulse" /> LIVE DATA <span className="divider" /> Sign in</div></header>
    <section className="hero"><div><p className="eyebrow">GRAND EXCHANGE / MARKET INTELLIGENCE</p><h1>Find the spread.<br /><em>Make the flip.</em></h1><p className="intro">A focused market scanner for OSRS traders. Spot healthy margins, check liquidity, and make your next move with confidence.</p></div><div className="hero-note"><span>Last refresh</span><strong>just now</strong><small>Prices update every 5 minutes</small></div></section>
    <section className="metrics"><div><span>TRACKED ITEMS</span><strong>4,812</strong><small>↑ 2.4% this week</small></div><div><span>AVG. MARGIN</span><strong>2.84%</strong><small>Across liquid items</small></div><div><span>FLIP CAPITAL</span><strong>12.6M</strong><small>Recommended bankroll</small></div><div><span>OPPORTUNITIES</span><strong>84</strong><small>Above your threshold</small></div></section>
    <section className="workspace" id="opportunities"><div className="section-heading"><div><p className="eyebrow">SCANNER</p><h2>Top opportunities</h2></div><button className="filter">All items <span>⌄</span></button></div><div className="toolbar"><label className="search"><span>⌕</span><input placeholder="Search items..." /></label><div className="chips"><button className="chip selected">Best margin</button><button className="chip">Highest volume</button><button className="chip">Lowest risk</button></div></div><div className="table-wrap"><table><thead><tr><th>ITEM</th><th>BUY PRICE</th><th>SELL PRICE</th><th>AFTER TAX</th><th>MARGIN</th><th>ROI</th><th>VOLUME / DAY</th><th /></tr></thead><tbody>{opportunities.map(([name, icon, buy, sell, margin, roi, volume]) => <tr key={name}><td><div className="item"><span className="item-icon">{icon}</span><strong>{name}</strong></div></td><td>{buy} gp</td><td>{sell} gp</td><td>{name === "Abyssal whip" ? "2,398,525" : "—"}</td><td className="green">+{margin} gp</td><td><span className="roi">{roi}</span></td><td className="muted">{volume}</td><td><button className="arrow" aria-label={`Open ${name}`}>↗</button></td></tr>)}</tbody></table></div></section>
    <footer><span>GE SCOUT <b>v0.1.0</b></span><span>Built for the flipping community <i>◆</i></span></footer>
  </main>;
}
