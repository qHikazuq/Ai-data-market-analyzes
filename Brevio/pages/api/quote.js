const FINNHUB_KEY = process.env.FINNHUB_KEY || "d7irsq9r01qn2qav5vs0d7irsq9r01qn2qav5vsg";

const FH_SYMBOL = {
  AAPL: "AAPL", NVDA: "NVDA", MSFT: "MSFT", AMZN: "AMZN",
  GOOGL: "GOOGL", META: "META", TSLA: "TSLA", NFLX: "NFLX",
  AMD: "AMD", JPM: "JPM", V: "V", NKE: "NKE", DIS: "DIS",
  NESN: "NESN.SW", NOVN: "NOVN.SW", ROG: "ROG.SW",
  UBS: "UBS.SW", ABBN: "ABBN.SW", ZURN: "ZURN.SW", SREN: "SREN.SW",
  VOO: "VOO", QQQ: "QQQ", SPY: "SPY", GLD: "GLD", VTI: "VTI",
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "No ticker provided" });

  const sym = FH_SYMBOL[ticker.toUpperCase()];
  if (!sym) return res.status(404).json({ error: "Ticker not supported" });

  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_KEY}`
    );
    const d = await r.json();

    if (!d.c || d.c === 0) {
      return res.status(404).json({ error: "No data available" });
    }

    return res.status(200).json({
      ticker: ticker.toUpperCase(),
      price: d.c,
      change: d.d,
      pct: d.dp,
      high: d.h,
      low: d.l,
      open: d.o,
      prevClose: d.pc,
    });
  } catch (err) {
    return res.status(500).json({ error: "Finnhub request failed" });
  }
}
