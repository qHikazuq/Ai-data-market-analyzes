// pages/api/analyse.js
// This runs on the server — your ANTHROPIC_API_KEY is never exposed to users

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ticker } = req.body;

  if (!ticker) {
    return res.status(400).json({ error: "Ticker is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const prompt = `You are a senior financial analyst at a Swiss private bank. Analyze ${ticker} as of today. Return ONLY raw JSON (no markdown, no backticks, no explanation): {"companyName":"Full name","verdict":"BULLISH","summary":"2-3 sentences covering recent performance and outlook.","opportunities":["specific point 1","specific point 2","specific point 3"],"risks":["specific risk 1","specific risk 2","specific risk 3"],"keyMetrics":"1-2 sentences on valuation and key numbers.","bottomLine":"One sharp, opinionated conclusion sentence."} verdict must be BULLISH, BEARISH, or NEUTRAL. Be specific and current, not generic.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const block = data.content && data.content.find((b) => b.type === "text");

    if (!block) {
      return res.status(500).json({ error: "No response from AI" });
    }

    const raw = block.text;
    const s = raw.indexOf("{");
    const e = raw.lastIndexOf("}");

    if (s === -1 || e === -1) {
      return res.status(500).json({ error: "Could not parse AI response" });
    }

    const parsed = JSON.parse(raw.slice(s, e + 1));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Analyse error:", err);
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}
