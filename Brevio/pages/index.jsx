import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, TrendingDown, Minus, Bell, Settings, Plus, X, RefreshCw, Lock, ArrowRight, Eye, ArrowLeft, Star, Share2 } from "lucide-react";

const C = {
  bg: "#0a0c10", bgAlt: "#0d0f14", panel: "#111318",
  border: "#1e2330", borderLight: "#252a38",
  accent: "#c9a84c", accentDim: "#7a5e2a",
  green: "#3ecf8e", red: "#f87171",
  text: "#e8e6e0", muted: "#6b7280",
};

const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";

const TICKER_DB = [
  { ticker: "AAPL", name: "Apple Inc.", type: "Stock" },
  { ticker: "AMZN", name: "Amazon.com Inc.", type: "Stock" },
  { ticker: "AMD", name: "Advanced Micro Devices", type: "Stock" },
  { ticker: "GOOGL", name: "Alphabet Inc.", type: "Stock" },
  { ticker: "META", name: "Meta Platforms", type: "Stock" },
  { ticker: "MSFT", name: "Microsoft Corporation", type: "Stock" },
  { ticker: "NFLX", name: "Netflix Inc.", type: "Stock" },
  { ticker: "NVDA", name: "NVIDIA Corporation", type: "Stock" },
  { ticker: "TSLA", name: "Tesla Inc.", type: "Stock" },
  { ticker: "NESN", name: "Nestlé S.A.", type: "Stock" },
  { ticker: "NOVN", name: "Novartis AG", type: "Stock" },
  { ticker: "ROG", name: "Roche Holding AG", type: "Stock" },
  { ticker: "UBS", name: "UBS Group AG", type: "Stock" },
  { ticker: "ABBN", name: "ABB Ltd.", type: "Stock" },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", type: "ETF" },
  { ticker: "QQQ", name: "Invesco Nasdaq 100 ETF", type: "ETF" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", type: "ETF" },
  { ticker: "GLD", name: "SPDR Gold ETF", type: "ETF" },
  { ticker: "BTC", name: "Bitcoin", type: "Crypto" },
  { ticker: "ETH", name: "Ethereum", type: "Crypto" },
  { ticker: "SOL", name: "Solana", type: "Crypto" },
  { ticker: "GOLD", name: "Gold Spot", type: "Commodity" },
  { ticker: "OIL", name: "Crude Oil (WTI)", type: "Commodity" },
];

function genCandles(base, count, vol, trend) {
  const out = [];
  let p = base;
  for (let i = 0; i < count; i++) {
    const d = (Math.random() - 0.48 + trend) * vol * p;
    const o = p, c = p + d;
    const h = Math.max(o, c) + Math.random() * vol * p * 0.5;
    const l = Math.min(o, c) - Math.random() * vol * p * 0.5;
    out.push({ open: o, high: h, low: l, close: c });
    p = c;
  }
  return out;
}

const PD = {
  AAPL: { price: 213.45, change: 2.34, pct: 1.11, h52: 237.23, l52: 164.08, cap: "3.7T", vol: "58.2M", pe: "28.4", div: "0.96%", c1D: genCandles(211,78,0.003,0.02), c30D: genCandles(195,30,0.015,0.04), c1Y: genCandles(165,52,0.025,0.06) },
  NVDA: { price: 875.20, change: 18.50, pct: 2.16, h52: 974.00, l52: 410.50, cap: "2.1T", vol: "42.1M", pe: "72.3", div: "0.03%", c1D: genCandles(856,78,0.005,0.03), c30D: genCandles(780,30,0.025,0.06), c1Y: genCandles(450,52,0.04,0.1) },
  NESN: { price: 94.82, change: -0.34, pct: -0.36, h52: 108.40, l52: 88.10, cap: "89B", vol: "2.8M", pe: "20.1", div: "3.40%", c1D: genCandles(95.2,78,0.002,-0.005), c30D: genCandles(96.5,30,0.01,-0.02), c1Y: genCandles(105,52,0.015,-0.04) },
  MSFT: { price: 415.80, change: 5.20, pct: 1.27, h52: 468.35, l52: 309.45, cap: "3.1T", vol: "21.4M", pe: "32.1", div: "0.74%", c1D: genCandles(410,78,0.003,0.02), c30D: genCandles(390,30,0.018,0.05), c1Y: genCandles(310,52,0.028,0.08) },
};

const ANALYSIS = {
  AAPL: { verdict: "BULLISH", company: "Apple Inc.", summary: "Apple continues to dominate premium consumer electronics with a deeply loyal ecosystem. Services revenue now represents over 25% of total revenue providing high-margin recurring income.", opps: ["Services growing 15% annually","Vision Pro opens new category","Emerging market expansion"], risks: ["iPhone plateau in mature markets","China geopolitical risk","App Store regulatory pressure"], metrics: "P/E ~28x, $3.7T market cap. Services margins at 74% vs hardware 36%.", bottom: "Apple's services flywheel and brand loyalty make it a core long-term holding." },
  NVDA: { verdict: "BULLISH", company: "NVIDIA Corporation", summary: "NVIDIA dominates AI training infrastructure with data center revenue up 200% year-over-year. The Blackwell GPU architecture is ramping faster than expected.", opps: ["AI infrastructure spending accelerating","Blackwell ahead of schedule","CUDA ecosystem moat"], risks: ["Extreme valuation multiple","US export restrictions on China","AMD competition growing"], metrics: "~35x forward revenue. Data center now 87% of revenue at $47B annually.", bottom: "NVIDIA's AI monopoly is real but valuation leaves little room for error — buy on dips." },
  NESN: { verdict: "NEUTRAL", company: "Nestlé S.A.", summary: "Nestlé remains one of the world's most defensive consumer staples with 2,000 brands across 186 countries. Organic growth has slowed to 2% as pricing normalization continues.", opps: ["Premium mix driving margins","Emerging market growth","Health and wellness momentum"], risks: ["Volume under price fatigue pressure","Private label competition","Restructuring costs"], metrics: "Dividend yield 3.4%, P/E 20x. CHF 89B market cap on SIX.", bottom: "Reliable defensive holding with steady dividends but limited near-term upside." },
  MSFT: { verdict: "BULLISH", company: "Microsoft Corporation", summary: "Microsoft is executing strongly on AI integration across Azure, Office 365 and Copilot. Azure cloud growth reaccelerated to 31% driven by AI workloads.", opps: ["Azure AI growing faster than AWS","Copilot across 400M Office users","Enterprise AI in early innings"], risks: ["Antitrust scrutiny on AI","Ballooning capex requirements","Azure tied to AI spending cycles"], metrics: "P/E 32x forward. Cloud 54% of revenue. $3.1T market cap.", bottom: "Microsoft's enterprise AI positioning is unmatched — highest conviction large-cap tech holding." },
};

const DEFAULT_WL = ["AAPL", "NVDA", "NESN", "MSFT"];
const TFS = ["1D", "30D", "1Y"];

// Finnhub config
const FINNHUB_KEY = "d7irsq9r01qn2qav5vs0d7irsq9r01qn2qav5vsg";
const LIVE_TICKERS = ["AAPL", "NESN"];
const FH_SYMBOL = { AAPL: "AAPL", NESN: "NESN.SW" };

async function fetchFHQuote(ticker) {
  try {
    const sym = FH_SYMBOL[ticker] || ticker;
    const r = await fetch("https://finnhub.io/api/v1/quote?symbol=" + sym + "&token=" + FINNHUB_KEY);
    const d = await r.json();
    if (!d.c || d.c === 0) return null;
    return { price: d.c, change: d.d, pct: d.dp };
  } catch { return null; }
}

async function fetchFHCandles(ticker, resolution, from, to) {
  try {
    const sym = FH_SYMBOL[ticker] || ticker;
    const r = await fetch("https://finnhub.io/api/v1/stock/candle?symbol=" + sym + "&resolution=" + resolution + "&from=" + from + "&to=" + to + "&token=" + FINNHUB_KEY);
    const d = await r.json();
    if (d.s !== "ok" || !d.c) return null;
    return d.t.map((t, i) => ({ open: d.o[i], high: d.h[i], low: d.l[i], close: d.c[i], time: t }));
  } catch { return null; }
}

function useLiveData(ticker) {
  const [quote, setQuote] = useState(null);
  const [liveCandles, setLiveCandles] = useState({ c1D: null, c30D: null, c1Y: null });
  const [loading, setLoading] = useState(false);
  const isLive = LIVE_TICKERS.includes(ticker) && FINNHUB_KEY !== "";

  useEffect(() => {
    if (!isLive) return;
    setLoading(true);
    const now = Math.floor(Date.now() / 1000);
    const day = 86400;
    Promise.all([
      fetchFHQuote(ticker),
      fetchFHCandles(ticker, "5", now - day, now),
      fetchFHCandles(ticker, "D", now - 30 * day, now),
      fetchFHCandles(ticker, "D", now - 365 * day, now),
    ]).then(([q, c1D, c30D, c1Y]) => {
      if (q) setQuote(q);
      setLiveCandles({ c1D, c30D, c1Y });
    }).finally(() => setLoading(false));
  }, [ticker]);

  return { quote, liveCandles, loading, isLive };
}

// ─── SMALL CHART (watchlist cards) ───────────────────────────────────────────
function MiniChart({ candles, height = 65 }) {
  const ref = useRef(null);
  const [w, setW] = useState(300);
  useEffect(() => {
    if (!ref.current) return;
    setW(ref.current.offsetWidth);
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  if (!candles || !candles.length) return <div ref={ref} style={{ width: "100%", height }} />;
  const pad = { t: 4, b: 4, l: 2, r: 36 };
  const cw = w - pad.l - pad.r, ch = height - pad.t - pad.b;
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...prices), maxP = Math.max(...prices), range = maxP - minP || 1;
  const bw = Math.max(1.5, (cw / candles.length) * 0.6);
  const gap = cw / candles.length;
  const toY = p => pad.t + ((maxP - p) / range) * ch;
  const toX = i => pad.l + i * gap + gap / 2;
  const mids = [minP, (minP + maxP) / 2, maxP];
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={height} style={{ display: "block" }}>
        {mids.map((p, i) => (
          <g key={i}>
            <line x1={pad.l} y1={toY(p)} x2={w - pad.r} y2={toY(p)} stroke={C.border} strokeWidth="0.5" strokeDasharray="3,4" />
            <text x={w - 2} y={toY(p) - 2} textAnchor="end" fill={C.muted} fontSize="8" fontFamily="DM Sans, sans-serif">{p > 100 ? p.toFixed(0) : p.toFixed(2)}</text>
          </g>
        ))}
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const col = up ? C.green : C.red;
          const bt = toY(Math.max(c.open, c.close));
          const bb = toY(Math.min(c.open, c.close));
          const bh = Math.max(1, bb - bt);
          const x = toX(i);
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={col} strokeWidth="0.7" strokeOpacity="0.6" />
              <rect x={x - bw / 2} y={bt} width={bw} height={bh} fill={col} fillOpacity={up ? 0.85 : 0.75} rx="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── INTERACTIVE CHART (detail page) ─────────────────────────────────────────
function BigChart({ candles, height, alertLines, trendLines, notes, activeTool, onAddAlert, onAddTrendPoint, onAddNote, onUpdateAlert, onUpdateTrend, onUpdateNote, onDeleteAlert, onDeleteTrend, onDeleteNote }) {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const [w, setW] = useState(300);
  const [hY, setHY] = useState(null);
  const [hX, setHX] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [pendingNote, setPendingNote] = useState(null);
  const drag = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    setW(ref.current.offsetWidth);
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const block = (e) => { if (drag.current) e.preventDefault(); };
    svg.addEventListener("touchmove", block, { passive: false });
    return () => svg.removeEventListener("touchmove", block);
  }, []);

  if (!candles || !candles.length) return <div ref={ref} style={{ width: "100%", height }} />;

  const pad = { t: 10, b: 10, l: 18, r: 44 };
  const cw = w - pad.l - pad.r, ch = height - pad.t - pad.b;
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...prices), maxP = Math.max(...prices), range = maxP - minP || 1;
  const bw = Math.max(1.5, (cw / candles.length) * 0.6);
  const gap = cw / candles.length;
  const toY = p => pad.t + ((maxP - p) / range) * ch;
  const toX = i => pad.l + i * gap + gap / 2;
  const toPrice = y => maxP - ((y - pad.t) / ch) * range;
  const mids = [minP, (minP + maxP) / 2, maxP];

  const coords = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onDragStart = (e, type, id) => {
    e.stopPropagation();
    const c = coords(e);
    drag.current = { type, id, lastY: c.y, lastX: c.x };
  };

  const onMove = (e) => {
    const { x, y } = coords(e);
    if (drag.current) {
      const dy = y - drag.current.lastY;
      const dx = x - drag.current.lastX;
      const { type, id } = drag.current;
      if (type === "alert") { const al = alertLines.find(a => a.id === id); if (al) onUpdateAlert(id, toPrice(toY(al.price) + dy)); }
      else if (type === "trend") { const tl = trendLines.find(t => t.id === id); if (tl) onUpdateTrend(id, { x1: tl.x1+dx, y1: tl.y1+dy, x2: tl.x2+dx, y2: tl.y2+dy }); }
      else if (type === "note") { const n = notes.find(n => n.id === id); if (n) onUpdateNote(id, { x: n.x+dx, price: toPrice(toY(n.price)+dy) }); }
      drag.current.lastY = y; drag.current.lastX = x;
      return;
    }
    if (activeTool !== "none") { setHY(y); setHX(x); }
  };

  const onUp = () => { drag.current = null; };

  const onClick = (e) => {
    if (drag.current) return;
    if (activeTool === "none") return;
    const { x, y } = coords(e);
    const price = toPrice(y);
    if (activeTool === "alert") onAddAlert(price);
    else if (activeTool === "trend") onAddTrendPoint({ x, y, price });
    else if (activeTool === "note") setPendingNote({ x, y, price });
  };

  const DelBtn = ({ cx, cy, color, onDel }) => (
    <foreignObject x={cx - 9} y={cy - 9} width={18} height={18}>
      <div onClick={e => { e.stopPropagation(); onDel(); }}
        style={{ width: "18px", height: "18px", borderRadius: "50%", background: C.bg, border: "1.5px solid " + color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: color, fontSize: "13px", fontWeight: 700, lineHeight: "18px", textAlign: "center" }}>
        ×
      </div>
    </foreignObject>
  );

  return (
    <div ref={ref} style={{ width: "100%", position: "relative", userSelect: "none" }}>
      <svg ref={svgRef} width={w} height={height}
        style={{ display: "block", touchAction: "none" }}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={() => { setHY(null); setHX(null); onUp(); }}
        onTouchMove={onMove}
        onTouchEnd={onUp}>

        {mids.map((p, i) => (
          <g key={i}>
            <line x1={pad.l} y1={toY(p)} x2={w-pad.r} y2={toY(p)} stroke={C.border} strokeWidth="0.5" strokeDasharray="3,4" />
            <text x={w-2} y={toY(p)-2} textAnchor="end" fill={C.muted} fontSize="8" fontFamily="DM Sans, sans-serif">{p > 100 ? p.toFixed(0) : p.toFixed(2)}</text>
          </g>
        ))}

        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const col = up ? C.green : C.red;
          const bt = toY(Math.max(c.open, c.close));
          const bb = toY(Math.min(c.open, c.close));
          const bh = Math.max(1, bb - bt);
          const x = toX(i);
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={col} strokeWidth="0.7" strokeOpacity="0.6" />
              <rect x={x-bw/2} y={bt} width={bw} height={bh} fill={col} fillOpacity={up ? 0.85 : 0.75} rx="0.5" />
            </g>
          );
        })}

        {alertLines.map((al) => {
          const y = toY(al.price);
          if (y < pad.t - 5 || y > height - pad.b + 5) return null;
          return (
            <g key={al.id}>
              <line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke="transparent" strokeWidth="18" style={{ cursor: "ns-resize" }}
                onMouseDown={e => onDragStart(e, "alert", al.id)} onTouchStart={e => onDragStart(e, "alert", al.id)} />
              <line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke={C.accent} strokeWidth="1.2" strokeDasharray="5,4" style={{ pointerEvents: "none" }} />
              <rect x={w-pad.r} y={y-9} width={pad.r-2} height={16} fill={C.accent} rx="2" style={{ pointerEvents: "none" }} />
              <text x={w-pad.r+3} y={y+4} fill="#0a0c10" fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="600" style={{ pointerEvents: "none" }}>{al.price > 100 ? al.price.toFixed(0) : al.price.toFixed(2)}</text>
              <DelBtn cx={pad.l+9} cy={y} color={C.accent} onDel={() => onDeleteAlert(al.id)} />
            </g>
          );
        })}

        {trendLines.map((tl) => {
          const mx = (tl.x1+tl.x2)/2, my = (tl.y1+tl.y2)/2;
          return (
            <g key={tl.id}>
              <line x1={tl.x1} y1={tl.y1} x2={tl.x2} y2={tl.y2} stroke="transparent" strokeWidth="18" style={{ cursor: "move" }}
                onMouseDown={e => onDragStart(e, "trend", tl.id)} onTouchStart={e => onDragStart(e, "trend", tl.id)} />
              <line x1={tl.x1} y1={tl.y1} x2={tl.x2} y2={tl.y2} stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.85" style={{ pointerEvents: "none" }} />
              <DelBtn cx={mx} cy={my} color="#a78bfa" onDel={() => onDeleteTrend(tl.id)} />
            </g>
          );
        })}

        {notes.map((n) => {
          const y = toY(n.price);
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={y} r="14" fill="transparent" style={{ cursor: "move" }}
                onMouseDown={e => onDragStart(e, "note", n.id)} onTouchStart={e => onDragStart(e, "note", n.id)} />
              <circle cx={n.x} cy={y} r="7" fill="#f59e0b" fillOpacity="0.9" style={{ pointerEvents: "none" }} />
              <text x={n.x} y={y+4} textAnchor="middle" fill="#0a0c10" fontSize="9" fontWeight="700" style={{ pointerEvents: "none" }}>N</text>
              <DelBtn cx={n.x+12} cy={y-10} color="#f59e0b" onDel={() => onDeleteNote(n.id)} />
            </g>
          );
        })}

        {hY !== null && activeTool !== "none" && !drag.current && (
          <g style={{ pointerEvents: "none" }}>
            <line x1={pad.l} y1={hY} x2={w-pad.r} y2={hY} stroke={C.accent} strokeWidth="0.6" strokeDasharray="3,3" strokeOpacity="0.6" />
            {hX !== null && <line x1={hX} y1={pad.t} x2={hX} y2={height-pad.b} stroke={C.accent} strokeWidth="0.6" strokeDasharray="3,3" strokeOpacity="0.4" />}
            <rect x={w-pad.r} y={hY-9} width={pad.r-2} height={16} fill={C.accent + "33"} stroke={C.accent} strokeWidth="0.5" rx="2" />
            <text x={w-pad.r+3} y={hY+4} fill={C.accent} fontSize="8" fontFamily="DM Sans, sans-serif">{toPrice(hY) > 100 ? toPrice(hY).toFixed(0) : toPrice(hY).toFixed(2)}</text>
          </g>
        )}
      </svg>

      {pendingNote && (
        <div style={{ position: "absolute", top: Math.max(0, pendingNote.y-60), left: Math.min(pendingNote.x, w-210), background: C.panel, border: "1px solid " + C.accent + "66", borderRadius: "7px", padding: "10px 12px", zIndex: 10, boxShadow: "0 4px 20px #00000088", display: "flex", gap: "6px" }}>
          <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add note..." autoFocus
            onKeyDown={e => {
              if (e.key === "Enter" && noteText.trim()) { onAddNote({ x: pendingNote.x, price: pendingNote.price, text: noteText.trim() }); setNoteText(""); setPendingNote(null); }
              if (e.key === "Escape") { setNoteText(""); setPendingNote(null); }
            }}
            style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: "4px", padding: "5px 8px", color: C.text, fontSize: "12px", fontFamily: "DM Sans, sans-serif", outline: "none", width: "150px" }} />
          <button onClick={() => { setPendingNote(null); setNoteText(""); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X style={{ width: "12px", height: "12px" }} /></button>
        </div>
      )}
    </div>
  );
}

// ─── VERDICT BADGE ────────────────────────────────────────────────────────────
function VerdictBadge({ verdict, large }) {
  const color = verdict === "BULLISH" ? C.green : verdict === "BEARISH" ? C.red : C.muted;
  const bg = verdict === "BULLISH" ? "#0f2e1e" : verdict === "BEARISH" ? "#2a1010" : "#1a1c24";
  const Icon = verdict === "BULLISH" ? TrendingUp : verdict === "BEARISH" ? TrendingDown : Minus;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: bg, border: "1px solid " + color + "33", borderRadius: "5px", padding: large ? "7px 14px" : "4px 9px" }}>
      <Icon style={{ width: large ? "14px" : "10px", height: large ? "14px" : "10px", color }} />
      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: large ? "13px" : "10px", color, letterSpacing: "0.14em", fontWeight: 600 }}>{verdict}</span>
    </div>
  );
}

// ─── ANALYSIS RESULT CARD ─────────────────────────────────────────────────────
function AnalysisCard({ result, watchlist, onClose, onAdd }) {
  const v = result.verdict;
  const vc = v === "BULLISH" ? C.green : v === "BEARISH" ? C.red : C.muted;
  const vb = v === "BULLISH" ? "#0f2e1e" : v === "BEARISH" ? "#2a1010" : "#1a1c24";
  const VI = v === "BULLISH" ? TrendingUp : v === "BEARISH" ? TrendingDown : Minus;
  return (
    <div style={{ marginBottom: "16px", background: C.panel, border: "1px solid " + C.borderLight, borderRadius: "10px", overflow: "hidden", animation: "fadeUp 0.35s ease" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", color: C.accent, letterSpacing: "0.06em" }}>{result.ticker}</div>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, fontStyle: "italic", marginTop: "2px" }}>{result.companyName}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: vb, border: "1px solid " + vc + "33", borderRadius: "5px", padding: "5px 10px" }}>
            <VI style={{ width: "11px", height: "11px", color: vc }} />
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", color: vc, letterSpacing: "0.14em", fontWeight: 600 }}>{v}</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}>
            <X style={{ width: "13px", height: "13px" }} />
          </button>
        </div>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text, lineHeight: "1.75" }}>{result.summary}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#3ecf8e88", marginBottom: "7px" }}>Opportunities</div>
            <ul style={{ margin: 0, padding: "0 0 0 13px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {(result.opportunities || []).map((o, i) => <li key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", lineHeight: "1.55", color: C.text }}>{o}</li>)}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f8717188", marginBottom: "7px" }}>Risks</div>
            <ul style={{ margin: 0, padding: "0 0 0 13px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {(result.risks || []).map((r, i) => <li key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", lineHeight: "1.55", color: C.text }}>{r}</li>)}
            </ul>
          </div>
        </div>
        <div style={{ background: C.bgAlt, border: "1px solid " + C.accent + "22", borderRadius: "6px", padding: "11px 14px" }}>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDim, marginBottom: "4px" }}>Bottom Line</div>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.accent, fontStyle: "italic", lineHeight: "1.65" }}>{result.bottomLine}</div>
        </div>
        {!watchlist.includes(result.ticker) && (
          <button onClick={onAdd} style={{ background: "transparent", border: "1px solid " + C.accent + "44", color: C.accent, borderRadius: "5px", padding: "8px 14px", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: "6px", width: "fit-content" }}>
            <Plus style={{ width: "11px", height: "11px" }} /> Add to Watchlist
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SIGNUP MODAL ─────────────────────────────────────────────────────────────
function SignupModal({ onClose, onSignup, trigger }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const msgs = { analyse: "Sign up free to run live AI analyses on any asset.", add: "Create a free account to build your personal watchlist.", alert: "Sign up to enable price alerts.", default: "Sign up free to unlock the full Brevio experience." };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#00000088", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: C.panel, border: "1px solid " + C.borderLight, borderRadius: "14px", padding: "32px 28px", width: "100%", maxWidth: "380px", boxShadow: "0 32px 80px #000000aa", animation: "fadeUp 0.25s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X style={{ width: "16px", height: "16px" }} /></button>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: 500, color: C.text, marginBottom: "8px" }}>{mode === "signup" ? "Create your free account" : "Welcome back"}</h2>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted, lineHeight: "1.6", marginBottom: "24px" }}>{msgs[trigger] || msgs.default}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: "6px", padding: "11px 14px", color: C.text, fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none" }} />
          <input value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" type="password" style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: "6px", padding: "11px 14px", color: C.text, fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none" }} />
        </div>
        <button onClick={onSignup} style={{ width: "100%", background: C.accent, color: "#0a0c10", border: "none", borderRadius: "6px", padding: "12px", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
          {mode === "signup" ? "Create Free Account" : "Log In"} <ArrowRight style={{ width: "14px", height: "14px" }} />
        </button>
        {mode === "signup" && (
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            {["No credit card", "5 free analyses", "Cancel anytime"].map((t, i) => (
              <span key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", color: C.muted, display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: C.green, fontSize: "9px" }}>✓</span> {t}
              </span>
            ))}
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>{mode === "signup" ? "Already have an account? " : "Don't have an account? "}</span>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.accent, textDecoration: "underline" }}>{mode === "signup" ? "Log in" : "Sign up free"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── WATCHLIST CARD ───────────────────────────────────────────────────────────
function WatchCard({ ticker, onOpen, alertOn, onToggleAlert, onRemove, isDemo, onAuth }) {
  const [tf, setTf] = useState("30D");
  const p = PD[ticker];
  const a = ANALYSIS[ticker];
  const { quote, liveCandles, loading, isLive } = useLiveData(ticker);
  if (!p || !a) return null;
  const displayPrice = quote ? quote.price : p.price;
  const displayPct = quote ? quote.pct : p.pct;
  const up = displayPct >= 0;
  const pc = up ? C.green : C.red;
  const candles = tf === "1D" ? (isLive && liveCandles.c1D ? liveCandles.c1D : p.c1D) : tf === "1Y" ? (isLive && liveCandles.c1Y ? liveCandles.c1Y : p.c1Y) : (isLive && liveCandles.c30D ? liveCandles.c30D : p.c30D);

  return (
    <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: "10px", overflow: "hidden", animation: "fadeUp 0.35s ease", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.accent + "44"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <div style={{ padding: "13px 13px 0", cursor: "pointer" }} onClick={() => onOpen(ticker)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
          <div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", color: C.accent, letterSpacing: "0.06em", lineHeight: 1 }}>{ticker}</div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", color: C.muted, marginTop: "2px", fontStyle: "italic" }}>{a.company}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <VerdictBadge verdict={a.verdict} />
            <button onClick={e => { e.stopPropagation(); isDemo ? onAuth("alert") : onToggleAlert(ticker); }}
              style={{ background: alertOn ? C.accent + "15" : "transparent", border: "1px solid " + (alertOn ? C.accent + "55" : C.border), borderRadius: "4px", padding: "3px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
              {isDemo && <Lock style={{ width: "7px", height: "7px", color: C.muted }} />}
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: alertOn ? C.accent : C.border }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "8px", color: alertOn ? C.accent : C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Alert</span>
            </button>
            <button onClick={e => { e.stopPropagation(); isDemo ? onAuth("remove") : onRemove(ticker); }}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", color: C.border }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = C.border}>
              <X style={{ width: "11px", height: "11px" }} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", color: C.text, fontWeight: 500 }}>${displayPrice.toFixed(2)}</span>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: pc, fontWeight: 500 }}>{up ? "+" : ""}{displayPct.toFixed(2)}%</span>
          {isLive && (
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: loading ? C.muted : C.green, boxShadow: loading ? "none" : "0 0 4px " + C.green }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "8px", color: loading ? C.muted : C.green, letterSpacing: "0.08em" }}>{loading ? "..." : "LIVE"}</span>
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: "2px", zIndex: 2 }}>
            {TFS.map(t => (
              <button key={t} onClick={e => { e.stopPropagation(); setTf(t); }}
                style={{ background: tf === t ? C.accent + "22" : "transparent", border: "1px solid " + (tf === t ? C.accent + "55" : C.border), borderRadius: "3px", padding: "2px 6px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "8px", color: tf === t ? C.accent : C.muted, letterSpacing: "0.06em", transition: "all 0.15s" }}>
                {t}
              </button>
            ))}
          </div>
          <MiniChart candles={candles} height={65} />
        </div>
      </div>
      <div onClick={() => onOpen(ticker)} style={{ padding: "8px 13px 12px", cursor: "pointer" }}>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", color: C.accentDim, letterSpacing: "0.1em" }}>FULL ANALYSIS →</span>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({ ticker, onBack, isDemo, onAuth }) {
  const [tf, setTf] = useState("30D");
  const [saved, setSaved] = useState(false);
  const [activeTool, setActiveTool] = useState("none");
  const [alertLines, setAlertLines] = useState([]);
  const [trendLines, setTrendLines] = useState([]);
  const [trendStart, setTrendStart] = useState(null);
  const [notes, setNotes] = useState([]);
  const [manualPrice, setManualPrice] = useState("");
  const [toast, setToast] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fallback = ANALYSIS[ticker] || ANALYSIS.AAPL;
  const p = PD[ticker] || PD.AAPL;
  const { quote, liveCandles, loading: priceLoading, isLive } = useLiveData(ticker);
  const displayPrice = quote ? quote.price : p.price;
  const displayChange = quote ? quote.change : p.change;
  const displayPct = quote ? quote.pct : p.pct;
  const up = displayPct >= 0;
  const pc = up ? C.green : C.red;
  const candles = tf === "1D" ? (isLive && liveCandles.c1D ? liveCandles.c1D : p.c1D) : tf === "1Y" ? (isLive && liveCandles.c1Y ? liveCandles.c1Y : p.c1Y) : (isLive && liveCandles.c30D ? liveCandles.c30D : p.c30D);

  // Fetch live AI analysis on mount
  useEffect(() => {
    if (isDemo) return;
    setAiLoading(true);
    const prompt = "You are a senior financial analyst at a Swiss private bank. Analyze " + ticker + " as of today. Return ONLY raw JSON (no markdown, no backticks, no explanation): {\"companyName\":\"Full name\",\"verdict\":\"BULLISH\",\"summary\":\"2-3 sentences covering recent performance and outlook.\",\"opportunities\":[\"specific point 1\",\"specific point 2\",\"specific point 3\"],\"risks\":[\"specific risk 1\",\"specific risk 2\",\"specific risk 3\"],\"keyMetrics\":\"1-2 sentences on valuation and key numbers.\",\"bottomLine\":\"One sharp, opinionated conclusion sentence.\"} verdict must be BULLISH, BEARISH, or NEUTRAL. Be specific and current, not generic.";
    fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.verdict) setAiAnalysis(data);
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [ticker]);

  // Use live AI result if available, fallback to mock
  const a = aiAnalysis || fallback;

  const metrics = [
    { label: "Market Cap", value: p.cap }, { label: "Volume", value: p.vol },
    { label: "P/E Ratio", value: p.pe }, { label: "Dividend", value: p.div },
    { label: "52W High", value: "$" + p.h52 }, { label: "52W Low", value: "$" + p.l52 },
  ];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const tools = [
    { id: "alert", label: "Alert", color: C.accent, desc: "Tap chart to set price alert" },
    { id: "trend", label: "Trend", color: "#a78bfa", desc: trendStart ? "Tap second point..." : "Tap two points on chart" },
    { id: "note", label: "Note", color: "#f59e0b", desc: "Tap chart to add note" },
  ];

  const handleAddAlert = (price) => { if (isDemo) { onAuth("alert"); return; } setAlertLines(prev => [...prev, { price, id: Date.now() }]); setActiveTool("none"); showToast("Alert set at $" + (price > 100 ? price.toFixed(0) : price.toFixed(2))); };
  const handleManualAlert = () => { const val = parseFloat(manualPrice); if (!val || isNaN(val)) return; if (isDemo) { onAuth("alert"); return; } setAlertLines(prev => [...prev, { price: val, id: Date.now() }]); setManualPrice(""); showToast("Alert set at $" + val.toFixed(2)); };
  const handleTrendPoint = (pt) => { if (!trendStart) { setTrendStart(pt); showToast("Tap second point to complete trend line"); } else { setTrendLines(prev => [...prev, { x1: trendStart.x, y1: trendStart.y, x2: pt.x, y2: pt.y, id: Date.now() }]); setTrendStart(null); setActiveTool("none"); showToast("Trend line added"); } };
  const handleAddNote = (n) => { setNotes(prev => [...prev, { ...n, id: Date.now() }]); setActiveTool("none"); showToast("Note added"); };
  const handleUpdateAlert = (id, price) => setAlertLines(prev => prev.map(a => a.id === id ? { ...a, price } : a));
  const handleUpdateTrend = (id, coords) => setTrendLines(prev => prev.map(t => t.id === id ? { ...t, ...coords } : t));
  const handleUpdateNote = (id, update) => setNotes(prev => prev.map(n => n.id === id ? { ...n, ...update } : n));
  const handleDeleteAlert = (id) => { setAlertLines(prev => prev.filter(a => a.id !== id)); showToast("Alert removed"); };
  const handleDeleteTrend = (id) => { setTrendLines(prev => prev.filter(t => t.id !== id)); showToast("Trend line removed"); };
  const handleDeleteNote = (id) => { setNotes(prev => prev.filter(n => n.id !== id)); showToast("Note removed"); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, animation: "slideIn 0.22s ease" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, height: "56px", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg + "f8", backdropFilter: "blur(16px)", borderBottom: "1px solid " + C.border }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: C.muted }}
          onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.muted}>
          <ArrowLeft style={{ width: "15px", height: "15px" }} />
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px" }}>Watchlist</span>
        </button>
        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", color: C.text, letterSpacing: "0.04em" }}>{ticker}</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => isDemo ? onAuth("add") : setSaved(s => !s)} style={{ background: saved ? C.accent + "18" : "transparent", border: "1px solid " + (saved ? C.accent + "44" : C.border), borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}>
            <Star style={{ width: "13px", height: "13px", color: saved ? C.accent : C.muted, fill: saved ? C.accent : "none" }} />
          </button>
          <button style={{ background: "transparent", border: "1px solid " + C.border, borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}>
            <Share2 style={{ width: "13px", height: "13px", color: C.muted }} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 16px 48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, fontStyle: "italic" }}>{a.company}</div>
            {isLive && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: priceLoading ? C.muted + "18" : C.green + "18", border: "1px solid " + (priceLoading ? C.muted : C.green) + "44", borderRadius: "4px", padding: "2px 7px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: priceLoading ? C.muted : C.green, boxShadow: priceLoading ? "none" : "0 0 5px " + C.green, animation: priceLoading ? "pulse 1s infinite" : "none" }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", color: priceLoading ? C.muted : C.green, letterSpacing: "0.1em", textTransform: "uppercase" }}>{priceLoading ? "Loading..." : "Live"}</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(30px, 6vw, 44px)", color: C.text, fontWeight: 500, letterSpacing: "-0.02em" }}>${displayPrice.toFixed(2)}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: pc, fontWeight: 500 }}>{up ? "+" : ""}{displayChange.toFixed(2)}</span>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: pc, background: pc + "15", border: "1px solid " + pc + "33", borderRadius: "4px", padding: "2px 8px" }}>{up ? "+" : ""}{displayPct.toFixed(2)}%</span>
            </div>
          </div>
          {!isLive && <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", color: C.muted, marginTop: "3px" }}>Demo data · Connect live API for real prices</div>}
        </div>

        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: "10px", padding: "14px 16px 12px", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.accentDim }}>Price Chart</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {TFS.map(t => (
                <button key={t} onClick={() => { setTf(t); setAlertLines([]); setTrendLines([]); setNotes([]); setTrendStart(null); setActiveTool("none"); }}
                  style={{ background: tf === t ? C.accent + "22" : "transparent", border: "1px solid " + (tf === t ? C.accent + "66" : C.border), borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: tf === t ? C.accent : C.muted, letterSpacing: "0.08em", fontWeight: tf === t ? 600 : 400, transition: "all 0.15s" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <BigChart candles={candles} height={210} alertLines={alertLines} trendLines={trendLines} notes={notes} activeTool={activeTool}
            onAddAlert={handleAddAlert} onAddTrendPoint={handleTrendPoint} onAddNote={handleAddNote}
            onUpdateAlert={handleUpdateAlert} onUpdateTrend={handleUpdateTrend} onUpdateNote={handleUpdateNote}
            onDeleteAlert={handleDeleteAlert} onDeleteTrend={handleDeleteTrend} onDeleteNote={handleDeleteNote} />
          {activeTool !== "none" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", padding: "7px 10px", background: C.bgAlt, borderRadius: "5px", border: "1px solid " + C.border }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.accent }}>{tools.find(t => t.id === activeTool)?.desc}</span>
              <button onClick={() => { setActiveTool("none"); setTrendStart(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X style={{ width: "12px", height: "12px" }} /></button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          {tools.map(tool => (
            <button key={tool.id} onClick={() => { if (isDemo && tool.id === "alert") { onAuth("alert"); return; } setActiveTool(activeTool === tool.id ? "none" : tool.id); setTrendStart(null); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: activeTool === tool.id ? tool.color + "22" : "transparent", border: "1px solid " + (activeTool === tool.id ? tool.color + "66" : C.border), borderRadius: "5px", padding: "7px 14px", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: tool.color }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: activeTool === tool.id ? tool.color : C.muted, letterSpacing: "0.06em" }}>{tool.label}</span>
              {isDemo && tool.id === "alert" && <Lock style={{ width: "9px", height: "9px", color: C.muted }} />}
            </button>
          ))}
          {(alertLines.length > 0 || trendLines.length > 0 || notes.length > 0) && (
            <button onClick={() => { setAlertLines([]); setTrendLines([]); setNotes([]); }} style={{ background: "transparent", border: "1px solid " + C.border, borderRadius: "5px", padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
              <X style={{ width: "10px", height: "10px", color: C.muted }} />
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted }}>Clear all</span>
            </button>
          )}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "6px", flex: 1, background: C.panel, border: "1px solid " + C.border, borderRadius: "7px", padding: "8px 12px", alignItems: "center" }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.accentDim }}>$</span>
              <input value={manualPrice} onChange={e => setManualPrice(e.target.value)} onKeyDown={e => e.key === "Enter" && handleManualAlert()} placeholder="Set alert at exact price..." type="number"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: "13px", fontFamily: "DM Sans, sans-serif" }} />
            </div>
            <button onClick={handleManualAlert} style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "6px", padding: "9px 16px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }}>
              {isDemo && <Lock style={{ width: "9px", height: "9px" }} />} Set Alert
            </button>
          </div>
          {alertLines.length > 0 && (
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {alertLines.map(al => (
                <div key={al.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", background: C.accent + "0f", border: "1px solid " + C.accent + "22", borderRadius: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "14px", height: "1.5px", background: C.accent }} />
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.accent }}>Alert at ${al.price > 100 ? al.price.toFixed(0) : al.price.toFixed(2)}</span>
                  </div>
                  <button onClick={() => handleDeleteAlert(al.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }} onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    <X style={{ width: "11px", height: "11px" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.border, borderRadius: "10px", overflow: "hidden", marginBottom: "14px" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: C.panel, padding: "11px 13px" }}>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "4px" }}>{m.label}</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "14px", color: C.text, fontWeight: 500 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: "10px", overflow: "hidden", marginBottom: "14px" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.accentDim, marginBottom: "6px" }}>AI Analysis</div>
              {aiLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "14px", height: "14px", border: "2px solid " + C.border, borderTop: "2px solid " + C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, fontStyle: "italic" }}>Brevio AI is researching {ticker}...</span>
                </div>
              ) : (
                <VerdictBadge verdict={a.verdict} large />
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", color: C.muted, marginBottom: "3px" }}>Powered by</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "13px", color: C.accent, letterSpacing: "0.06em" }}>Brevio AI</div>
              {aiAnalysis && <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "8px", color: C.green, marginTop: "3px", display: "flex", alignItems: "center", gap: "3px", justifyContent: "flex-end" }}><div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.green }} />Live</div>}
            </div>
          </div>

          {aiLoading ? (
            <div style={{ padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, opacity: 0.4, animation: "pulse 1.2s ease-in-out " + (i * 0.2) + "s infinite" }} />
                ))}
              </div>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, textAlign: "center" }}>Analysing market conditions, recent news, and financial data...</span>
            </div>
          ) : (
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDim, marginBottom: "6px" }}>Overview</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text, lineHeight: "1.75" }}>{a.summary}</div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid " + C.border }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#3ecf8e88", marginBottom: "8px" }}>Opportunities</div>
                  <ul style={{ margin: 0, padding: "0 0 0 13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {(a.opps || a.opportunities || []).map((o, i) => <li key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", lineHeight: "1.6", color: C.text }}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f8717188", marginBottom: "8px" }}>Risks</div>
                  <ul style={{ margin: 0, padding: "0 0 0 13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {(a.risks || []).map((r, i) => <li key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", lineHeight: "1.6", color: C.text }}>{r}</li>)}
                  </ul>
                </div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid " + C.border }} />
              <div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDim, marginBottom: "6px" }}>Key Metrics</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text, lineHeight: "1.75" }}>{a.metrics || a.keyMetrics}</div>
              </div>
              <div style={{ background: C.bgAlt, border: "1px solid " + C.accent + "22", borderRadius: "7px", padding: "13px 15px" }}>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDim, marginBottom: "5px" }}>Bottom Line</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.accent, fontStyle: "italic", lineHeight: "1.7" }}>{a.bottom || a.bottomLine}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "11px 14px", background: C.bgAlt, border: "1px solid " + C.border, borderRadius: "7px" }}>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", color: C.muted, lineHeight: "1.7" }}>
            <span style={{ color: C.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px" }}>Disclaimer · </span>
            For informational purposes only. Not investment advice. Consult a FINMA-regulated advisor before investing.
          </span>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: C.panel, border: "1px solid " + C.accent + "44", borderRadius: "8px", padding: "10px 18px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 32px #00000066", animation: "fadeUp 0.2s ease", zIndex: 999, whiteSpace: "nowrap" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.accent, boxShadow: "0 0 6px " + C.accent }} />
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.text }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [isDemo, setIsDemo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTrigger, setModalTrigger] = useState("default");
  const [watchlist, setWatchlist] = useState(DEFAULT_WL);
  const [alerts, setAlerts] = useState({});
  const [toast, setToast] = useState(null);
  const [addInput, setAddInput] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysedTicker, setAnalysedTicker] = useState(null);
  const [usedCount, setUsedCount] = useState(4);
  const wRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (wRef.current && !wRef.current.contains(e.target)) setShowSug(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const auth = t => { setModalTrigger(t); setShowModal(true); };
  const signup = () => { setIsDemo(false); setShowModal(false); setToast("Welcome to Brevio!"); setTimeout(() => setToast(null), 3000); };
  const openDetail = t => { setSelected(t); setPage("detail"); };
  const goBack = () => { setPage("dashboard"); setSelected(null); };

  const toggleAlert = t => {
    const n = !alerts[t];
    setAlerts(p => ({ ...p, [t]: n }));
    setToast(n ? "Alert enabled for " + t : "Alert disabled for " + t);
    setTimeout(() => setToast(null), 2500);
  };

  const addStock = () => {
    if (isDemo) { auth("add"); return; }
    const t = addInput.trim().toUpperCase();
    if (!t || watchlist.includes(t)) { setAddInput(""); return; }
    setWatchlist(p => [...p, t]); setAddInput("");
  };

  const handleQ = val => {
    setQuery(val.toUpperCase());
    if (!val) { setSuggestions([]); setShowSug(false); return; }
    const f = TICKER_DB.filter(t => t.ticker.startsWith(val.toUpperCase()) || t.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
    setSuggestions(f); setShowSug(f.length > 0);
  };

  const runAnalysis = async () => {
    const t = query.trim().toUpperCase();
    if (!t) return;
    if (isDemo) { auth("analyse"); return; }
    setAnalysisLoading(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    setAnalysedTicker(t);
    setShowSug(false);
    try {
  
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: t }),
      });
      const data = await res.json();
      if (data && data.verdict) {
        setAnalysisResult(data);
        setUsedCount(u => u + 1);
      } else {
        setAnalysisError(data.error || "Analysis failed. Try again.");
      }
    } catch { setAnalysisError("Network error. Try again."); }
    setAnalysisLoading(false);
  };

  const typeColor = t => t === "Crypto" ? C.accent : t === "ETF" ? C.green : t === "Commodity" ? "#e8a04a" : C.muted;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const STYLES = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    input::placeholder { color: #2e3340; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }
  `;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"} />
      <style>{STYLES}</style>

      {page === "detail" && selected && <DetailPage ticker={selected} onBack={goBack} isDemo={isDemo} onAuth={auth} />}

      {page === "dashboard" && (
        <>
          {isDemo && (
            <div style={{ background: "linear-gradient(90deg, " + C.accent + "22, " + C.accent + "11)", borderBottom: "1px solid " + C.accent + "33", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Eye style={{ width: "13px", height: "13px", color: C.accent }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.accent }}>You're viewing a demo — sign up free to analyse your own assets</span>
              </div>
              <button onClick={() => auth("default")} style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "4px", padding: "6px 16px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>Sign Up Free →</button>
            </div>
          )}

          <div style={{ position: "sticky", top: 0, zIndex: 100, height: "60px", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg + "f8", backdropFilter: "blur(16px)", borderBottom: "1px solid " + C.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", color: C.accent, fontWeight: 600 }}>B</span>
              <div style={{ width: "1px", height: "16px", background: C.border }} />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", color: C.text, letterSpacing: "0.06em" }}>Brevio</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!isDemo && (
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "60px", height: "3px", background: C.border, borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: Math.min((usedCount/300)*100, 100) + "%", height: "100%", background: C.green, borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted }}>
                    <span style={{ color: C.green, fontWeight: 500 }}>{usedCount}</span>/300
                  </span>
                </div>
              )}
              {isDemo ? (
                <button onClick={() => auth("default")} style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "4px", padding: "7px 16px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>Sign Up Free</button>
              ) : (
                <>
                  <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: "5px", display: "flex" }}><Bell style={{ width: "15px", height: "15px", color: C.muted }} /></button>
                  <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: "5px", display: "flex" }}><Settings style={{ width: "15px", height: "15px", color: C.muted }} /></button>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.accent + "22", border: "1px solid " + C.accent + "44", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "12px", color: C.accent, fontWeight: 600 }}>L</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 16px 48px" }}>
            <div style={{ marginBottom: "22px" }}>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 500, color: C.text, marginBottom: "4px" }}>{isDemo ? "Welcome to Brevio." : greet + ", Leonardo."}</h1>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted }}>{isDemo ? "Explore a live preview. Tap any card to open the full analysis." : "Your watchlist is up to date. Tap any card for the full analysis."}</p>
            </div>

            <div style={{ marginBottom: "12px" }} ref={wRef}>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: "8px", background: C.panel, border: "1px solid " + (showSug ? C.accent + "44" : C.borderLight), borderRadius: showSug ? "8px 8px 0 0" : "8px", padding: "9px 12px", transition: "border-color 0.2s" }}>
                  <Search style={{ width: "15px", height: "15px", color: C.muted, flexShrink: 0, marginTop: "1px" }} />
                  <input value={query} onChange={e => handleQ(e.target.value)} onKeyDown={e => e.key === "Enter" && runAnalysis()} onFocus={() => suggestions.length > 0 && setShowSug(true)}
                    placeholder="Search stocks, crypto, ETFs, commodities..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: "14px", fontFamily: "DM Sans, sans-serif", letterSpacing: "0.04em" }} />
                  <button onClick={runAnalysis} style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "5px", padding: "7px 14px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "center", gap: "4px", opacity: analysisLoading ? 0.7 : 1 }}>
                    {isDemo && <Lock style={{ width: "9px", height: "9px" }} />}
                    {analysisLoading ? "..." : "Analyse"}
                  </button>
                </div>
                {showSug && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.panel, border: "1px solid " + C.accent + "44", borderTop: "1px solid " + C.border, borderRadius: "0 0 8px 8px", overflow: "hidden", zIndex: 50, boxShadow: "0 8px 24px #00000066" }}>
                    {suggestions.map((item, i) => (
                      <div key={i} onClick={() => { setQuery(item.ticker); setShowSug(false); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid " + C.border : "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bgAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontFamily: "Playfair Display, serif", fontSize: "13px", color: C.accent, letterSpacing: "0.06em", minWidth: "48px" }}>{item.ticker}</span>
                          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>{item.name}</span>
                        </div>
                        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: typeColor(item.type), background: typeColor(item.type) + "18", padding: "2px 7px", borderRadius: "3px" }}>{item.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {analysisLoading && (
                <div style={{ marginTop: "10px", background: C.panel, border: "1px solid " + C.border, borderRadius: "8px", padding: "20px", display: "flex", alignItems: "center", gap: "12px", animation: "fadeUp 0.3s ease" }}>
                  <div style={{ width: "18px", height: "18px", border: "2px solid " + C.border, borderTop: "2px solid " + C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted }}>Analysing {analysedTicker}...</span>
                </div>
              )}

              {analysisError && !analysisLoading && (
                <div style={{ marginTop: "10px", padding: "10px 14px", background: "#1a0a0a", border: "1px solid " + C.red + "33", borderRadius: "6px" }}>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.red }}>{analysisError}</span>
                </div>
              )}

              {analysisResult && !analysisLoading && (
                <div style={{ marginTop: "10px" }}>
                  <AnalysisCard result={analysisResult} watchlist={watchlist} onClose={() => setAnalysisResult(null)} onAdd={() => { setWatchlist(p => [...p, analysisResult.ticker]); setAnalysisResult(null); }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDim }}>{isDemo ? "Demo Watchlist" : "Your Watchlist"}</span>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.border }}>({watchlist.length})</span>
              </div>
              <button onClick={() => isDemo ? auth("refresh") : null} style={{ display: "flex", alignItems: "center", gap: "5px", background: "transparent", border: "1px solid " + C.border, borderRadius: "4px", padding: "5px 10px", cursor: "pointer" }}>
                {isDemo && <Lock style={{ width: "8px", height: "8px", color: C.muted }} />}
                <RefreshCw style={{ width: "10px", height: "10px", color: C.muted }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted }}>Refresh all</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {watchlist.map(t => <WatchCard key={t} ticker={t} onOpen={openDetail} alertOn={!!alerts[t]} onToggleAlert={toggleAlert} onRemove={tick => setWatchlist(p => p.filter(x => x !== tick))} isDemo={isDemo} onAuth={auth} />)}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input value={addInput} onChange={e => setAddInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && addStock()} placeholder="Add to watchlist..."
                style={{ flex: 1, background: C.panel, border: "1px solid " + C.border, borderRadius: "6px", padding: "9px 14px", color: C.text, fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none", letterSpacing: "0.05em" }} />
              <button onClick={addStock} style={{ background: "transparent", border: "1px solid " + C.accent + "44", color: C.accent, borderRadius: "6px", padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontFamily: "DM Sans, sans-serif", fontSize: "12px", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                {isDemo && <Lock style={{ width: "10px", height: "10px" }} />}
                <Plus style={{ width: "12px", height: "12px" }} /> Add
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && <SignupModal trigger={modalTrigger} onClose={() => setShowModal(false)} onSignup={signup} />}

      {toast && (
        <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: C.panel, border: "1px solid " + C.accent + "44", borderRadius: "8px", padding: "11px 20px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 32px #00000066", animation: "fadeUp 0.25s ease", zIndex: 999, whiteSpace: "nowrap" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.accent, boxShadow: "0 0 6px " + C.accent }} />
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
