import { useState, useEffect, useRef } from "react";
import { Zap, Target, Shield, BarChart2, Search, BookOpen } from "lucide-react";

const C = {
  bg: "#0a0c10",
  bgAlt: "#0d0f14",
  panel: "#111318",
  border: "#1e2330",
  borderLight: "#252a38",
  accent: "#c9a84c",
  accentDim: "#7a5e2a",
  accentGlow: "#c9a84c18",
  green: "#3ecf8e",
  red: "#f87171",
  text: "#e8e6e0",
  muted: "#6b7280",
  dim: "#9ca3af",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');`;

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style
    }}>{children}</div>
  );
}

const TICKER_ITEMS = [
  { t: "AAPL", v: "BULLISH", p: "+2.4%" },
  { t: "NVDA", v: "BULLISH", p: "+5.1%" },
  { t: "TSLA", v: "NEUTRAL", p: "-0.8%" },
  { t: "NESN", v: "BULLISH", p: "+1.1%" },
  { t: "MSFT", v: "BULLISH", p: "+1.2%" },
  { t: "ROG", v: "NEUTRAL", p: "+0.4%" },
  { t: "NKE", v: "BEARISH", p: "-3.1%" },
  { t: "META", v: "BULLISH", p: "+3.7%" },
  { t: "NOVN", v: "BULLISH", p: "+0.9%" },
  { t: "AMZN", v: "BULLISH", p: "+1.9%" },
  { t: "ABBN", v: "NEUTRAL", p: "-0.2%" },
  { t: "VOO", v: "BULLISH", p: "+0.9%" },
  { t: "QQQ", v: "BULLISH", p: "+1.4%" },
  { t: "GOOGL", v: "NEUTRAL", p: "+0.3%" },
];

function TickerBar() {
  const vc = (v) => v === "BULLISH" ? C.green : v === "BEARISH" ? C.red : C.muted;
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
      overflow: "hidden",
      borderBottom: `1px solid ${C.border}`,
      background: `${C.bgAlt}f5`,
      backdropFilter: "blur(10px)",
      padding: "9px 0"
    }}>
      <div style={{ display: "flex", gap: "48px", animation: "ticker 35s linear infinite", width: "max-content" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: C.text, fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>{item.t}</span>
            <span style={{ fontSize: "11px", color: vc(item.v), fontFamily: "DM Sans, sans-serif" }}>{item.v}</span>
            <span style={{ fontSize: "11px", color: item.p.startsWith("+") ? C.green : C.red, fontFamily: "DM Sans, sans-serif" }}>{item.p}</span>
            <span style={{ color: C.border, fontSize: "9px" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "22px", color: C.accent, fontWeight: 600, letterSpacing: "0.01em", lineHeight: 1 }}>B</span>
      <div style={{ width: "1px", height: "18px", background: C.border }} />
      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "17px", color: C.text, letterSpacing: "0.06em", fontWeight: 400 }}>Brevio</span>
    </div>
  );

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: (scrolled || open) ? `${C.bg}f8` : "transparent",
        backdropFilter: (scrolled || open) ? "blur(16px)" : "none",
        borderBottom: (scrolled || open) ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <Logo />

        {/* Desktop: full nav links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {["Features", "How it Works", "Pricing"].map(l => (
              <a key={l} href="#" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.target.style.color = C.text}
                onMouseLeave={e => e.target.style.color = C.muted}>{l}</a>
            ))}
            <button style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "4px", padding: "8px 22px", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>
              Start Free
            </button>
          </div>
        )}

        {/* Mobile: hamburger button */}
        {isMobile && (
          <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: `1px solid ${open ? C.accent : C.border}`, borderRadius: "6px", padding: "9px 11px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px", transition: "border-color 0.2s" }}>
            <div style={{ width: "18px", height: "1.5px", background: open ? C.accent : C.text, transition: "all 0.25s", transform: open ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <div style={{ width: "18px", height: "1.5px", background: open ? C.accent : C.text, transition: "all 0.25s", opacity: open ? 0 : 1 }} />
            <div style={{ width: "18px", height: "1.5px", background: open ? C.accent : C.text, transition: "all 0.25s", transform: open ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown — floating card top right */}
      {isMobile && (
        <div style={{
          position: "fixed", top: "56px", right: "16px", zIndex: 200,
          background: C.panel,
          border: `1px solid ${C.borderLight}`,
          borderRadius: "12px",
          boxShadow: "0 20px 60px #000000aa",
          width: "200px",
          maxHeight: open ? "280px" : "0",
          overflow: "hidden",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          transition: "all 0.22s ease",
          pointerEvents: open ? "auto" : "none",
          transformOrigin: "top right",
        }}>
          <div style={{ padding: "6px 0 10px" }}>
            {["Features", "How it Works", "Pricing"].map((l, i) => (
              <a key={l} href="#" onClick={() => setOpen(false)} style={{
                display: "block",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                color: C.text,
                textDecoration: "none",
                padding: "13px 20px",
                borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                letterSpacing: "0.02em",
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.bgAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{l}</a>
            ))}
            <div style={{ padding: "10px 12px 4px" }}>
              <button onClick={() => setOpen(false)} style={{ width: "100%", background: C.accent, color: "#0a0c10", border: "none", borderRadius: "6px", padding: "11px", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                Start Free
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeroSection() {
  const [typed, setTyped] = useState("");
  const full = "NVDA";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setTyped(full.slice(0, i + 1)); i++; if (i >= full.length) clearInterval(t); }, 130);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ minHeight: "calc(100vh - 104px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border}14 1px, transparent 1px), linear-gradient(90deg, ${C.border}14 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ position: "relative", textAlign: "center", maxWidth: "800px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: `1px solid ${C.border}`, borderRadius: "100px", padding: "6px 16px", marginBottom: "32px", background: C.panel }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.dim, letterSpacing: "0.08em" }}>AI-Powered · Switzerland · Global Markets</span>
        </div>

        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(40px, 7vw, 78px)", fontWeight: 500, color: C.text, margin: "0 0 8px", lineHeight: 1.06, letterSpacing: "-0.02em" }}>
          Research any asset
        </h1>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(40px, 7vw, 78px)", fontWeight: 500, color: C.text, margin: "0 0 28px", lineHeight: 1.06, letterSpacing: "-0.02em", fontStyle: "italic" }}>
          in <span style={{ color: C.accent }}>seconds.</span>
        </h1>

        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(15px, 2vw, 18px)", color: C.muted, lineHeight: 1.75, margin: "0 auto 48px", maxWidth: "520px" }}>
          <span style={{ color: C.text, fontWeight: 500 }}>Professional research in seconds, not hours.</span> Brevio gives retail investors AI-powered analysis on stocks, crypto, ETFs and commodities — opportunities, risks, and a clear verdict — without the Bloomberg terminal price tag.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "72px" }}>
          <button style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "5px", padding: "14px 32px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
            Start for Free
          </button>
          <button style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, borderRadius: "5px", padding: "14px 28px", fontSize: "13px", letterSpacing: "0.06em", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            See how it works →
          </button>
        </div>

        {/* Demo card */}
        <div style={{ background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: "12px", padding: "22px 26px", maxWidth: "420px", margin: "0 auto", textAlign: "left", boxShadow: `0 40px 80px #00000055` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", color: C.accent, letterSpacing: "0.08em" }}>{typed}<span style={{ animation: "blink 1s infinite" }}>|</span></div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, marginTop: "2px" }}>NVIDIA Corporation</div>
            </div>
            <div style={{ background: "#0f2e1e", color: C.green, border: `1px solid ${C.green}44`, borderRadius: "4px", padding: "5px 12px", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>BULLISH</div>
          </div>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.dim, lineHeight: 1.7, marginBottom: "14px" }}>
            NVIDIA leads the AI chip market with dominant GPU share. Data center revenue continues to surge driven by hyperscaler demand and the upcoming Blackwell architecture rollout.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
            {["AI infrastructure demand", "Strong pricing power"].map((o, i) => (
              <div key={i} style={{ background: "#0f2e1e44", border: `1px solid ${C.green}22`, borderRadius: "4px", padding: "6px 10px", fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.green }}>↑ {o}</div>
            ))}
            {["High valuation multiple", "Export restrictions risk"].map((r, i) => (
              <div key={i} style={{ background: "#2a101044", border: `1px solid ${C.red}22`, borderRadius: "4px", padding: "6px 10px", fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.red }}>↓ {r}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "10,000+", label: "Analyses run" },
    { value: "50+", label: "Markets covered" },
    { value: "12", label: "Countries" },
    { value: "CHF 15", label: "Per month Pro" },
  ];
  return (
    <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgAlt, padding: "40px 24px" }}>
      <FadeIn>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "36px", color: C.accent, fontWeight: 500, marginBottom: "6px" }}>{s.value}</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Enter a ticker", desc: "Type any stock, crypto, ETF or commodity symbol — US, Swiss, European markets and beyond. Brevio supports thousands of instruments across global markets." },
    { num: "02", title: "AI analyses it", desc: "Our AI scans fundamentals, recent news, analyst sentiment, and market context — all in under 10 seconds." },
    { num: "03", title: "Get your brief", desc: "Receive a clear, structured report: overview, opportunities, risks, key metrics, and a plain-language verdict." },
  ];
  return (
    <section style={{ padding: "100px 24px", maxWidth: "1000px", margin: "0 auto" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: C.accentDim, textTransform: "uppercase", marginBottom: "16px" }}>How it Works</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: C.text, lineHeight: 1.2 }}>
            Three steps to clarity
          </h2>
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px", background: C.border, borderRadius: "10px", overflow: "hidden" }}>
        {steps.map((s, i) => (
          <FadeIn key={i} delay={i * 0.12}>
            <div style={{ background: C.panel, padding: "40px 32px", position: "relative", height: "100%" }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgAlt}
              onMouseLeave={e => e.currentTarget.style.background = C.panel}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "56px", color: `${C.accent}18`, fontWeight: 700, position: "absolute", top: "20px", right: "24px", lineHeight: 1 }}>{s.num}</div>
              <div style={{ width: "36px", height: "36px", border: `1px solid ${C.accent}55`, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.accent, fontWeight: 500 }}>{s.num}</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", color: C.text, marginBottom: "12px", fontWeight: 500 }}>{s.title}</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: C.muted, lineHeight: 1.75 }}>{s.desc}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const iconStyle = { width: "20px", height: "20px", color: C.accent, strokeWidth: 1.5 };
  const features = [
    { icon: <Zap style={iconStyle} />, title: "Instant Analysis", desc: "Enter any ticker and get a full AI-generated research brief. No waiting, no manually digging through earnings reports and analyst PDFs." },
    { icon: <Target style={iconStyle} />, title: "Clear Verdict", desc: "Every analysis ends with a clear Bullish, Bearish, or Neutral verdict with reasoning — not vague language designed to cover all bases." },
    { icon: <Shield style={iconStyle} />, title: "Swiss Standards", desc: "Built and operated in Switzerland. Your data is handled under Swiss nDSG law and GDPR, and never sold to third parties." },
    { icon: <BarChart2 style={iconStyle} />, title: "Opportunities & Risks", desc: "Every brief surfaces the top opportunities and risks in plain language — the kind of analysis you'd normally pay a consultant for." },
    { icon: <Search style={iconStyle} />, title: "Stocks, Crypto & More", desc: "US, Swiss & European stocks, cryptocurrencies, ETFs, commodities and indices — all in one place. If it has a ticker, Brevio can analyse it." },
    { icon: <BookOpen style={iconStyle} />, title: "Built for Retail", desc: "No finance degree required. We cut through the jargon so you understand exactly what's happening with your investments." },
  ];
  return (
    <section style={{ padding: "100px 24px", background: C.bgAlt }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: C.accentDim, textTransform: "uppercase", marginBottom: "16px" }}>Why Brevio</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: C.text, margin: "0 0 16px", lineHeight: 1.2 }}>
              Everything you need.<br /><span style={{ fontStyle: "italic", color: C.accent }}>Nothing you don't.</span>
            </h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: C.muted, maxWidth: "460px", margin: "0 auto", lineHeight: 1.75 }}>
              Professional research tools cost thousands per year. Brevio gives you the insight that matters at a fraction of the price.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: C.border, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <div style={{ background: C.panel, padding: "32px 28px", height: "100%", transition: "background 0.2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = C.panel}>
                <div style={{ width: "36px", height: "36px", border: `1px solid ${C.accent}44`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", background: `${C.accent}0a` }}>{f.icon}</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", color: C.text, marginBottom: "10px", fontWeight: 500 }}>{f.title}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: C.muted, lineHeight: 1.75 }}>{f.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Marc Steiner", role: "Retail Investor, Zürich", text: "I used to spend 45 minutes reading analyst reports before any trade. With Brevio I get the same quality summary in seconds. It's changed how I research completely." },
    { name: "Laura Fontana", role: "Portfolio Hobbyist, Geneva", text: "Finally a tool that speaks plain language. No jargon, no fluff — just a clear verdict and the reasoning behind it. Exactly what I needed as someone not from a finance background." },
    { name: "Daniel Kopp", role: "Independent Advisor, Basel", text: "I use Brevio as a first-pass filter before diving deeper into any position. It saves me hours every week and the Swiss data compliance gives me peace of mind with clients." },
  ];
  return (
    <section style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: C.accentDim, textTransform: "uppercase", marginBottom: "16px" }}>Testimonials</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: C.text, lineHeight: 1.2 }}>
            Trusted by investors<br /><span style={{ fontStyle: "italic", color: C.accent }}>across Switzerland.</span>
          </h2>
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        {testimonials.map((t, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "32px 28px", height: "100%" }}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "32px", color: C.accent, lineHeight: 1, marginBottom: "16px", opacity: 0.6 }}>"</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: C.dim, lineHeight: 1.8, marginBottom: "24px", fontStyle: "italic" }}>{t.text}</div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "18px" }}>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text, fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, marginTop: "3px" }}>{t.role}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name: "Free", price: 0, desc: "Get started with no commitment", features: ["5 analyses per month", "Basic verdict & summary", "Stocks, ETFs & crypto", "Email support"], cta: "Start Free", highlight: false },
    { name: "Pro", price: annual ? 10 : 15, desc: "For serious retail investors", features: ["300 analyses per month", "Full report with metrics", "Stocks, crypto, ETFs & commodities", "Portfolio watchlist", "Priority support"], cta: "Start Pro", highlight: true, annualNote: annual ? "CHF 120 billed annually" : null },
  ];
  return (
    <section style={{ padding: "100px 24px", background: C.bgAlt }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: C.accentDim, textTransform: "uppercase", marginBottom: "16px" }}>Pricing</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: C.text, margin: "0 0 28px", lineHeight: 1.2 }}>Simple, transparent pricing</h2>
            <div style={{ display: "inline-flex", alignItems: "center", background: C.panel, border: `1px solid ${C.border}`, borderRadius: "100px", padding: "4px" }}>
              <button onClick={() => setAnnual(false)} style={{ background: !annual ? C.accent : "transparent", color: !annual ? "#0a0c10" : C.muted, border: "none", borderRadius: "100px", padding: "7px 20px", fontSize: "12px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: !annual ? 500 : 400, transition: "all 0.2s" }}>Monthly</button>
              <button onClick={() => setAnnual(true)} style={{ background: annual ? C.accent : "transparent", color: annual ? "#0a0c10" : C.muted, border: "none", borderRadius: "100px", padding: "7px 20px", fontSize: "12px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: annual ? 500 : 400, transition: "all 0.2s" }}>
                Annual <span style={{ fontSize: "10px" }}>–33%</span>
              </button>
            </div>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                background: plan.highlight ? `linear-gradient(160deg, #161a24, ${C.panel})` : C.panel,
                border: plan.highlight ? `1px solid ${C.accent}66` : `1px solid ${C.border}`,
                borderRadius: "10px", padding: "32px 28px", position: "relative",
                boxShadow: plan.highlight ? `0 0 48px ${C.accentGlow}` : "none",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#0a0c10", fontSize: "10px", letterSpacing: "0.15em", padding: "4px 14px", borderRadius: "100px", fontFamily: "DM Sans, sans-serif", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDim, marginBottom: "8px" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "38px", color: C.text, fontWeight: 500 }}>{plan.price === 0 ? "Free" : `CHF ${plan.price}`}</span>
                  {plan.price > 0 && <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted }}>/mo</span>}
                </div>
                {plan.annualNote && (
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.accent, marginBottom: "6px", letterSpacing: "0.03em" }}>{plan.annualNote}</div>
                )}
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted, marginBottom: "24px" }}>{plan.desc}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: plan.highlight ? `${C.accent}22` : `${C.border}55`, border: `1px solid ${plan.highlight ? C.accent : C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", color: plan.highlight ? C.accent : C.muted }}>✓</span>
                      </div>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.dim }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "12px", border: plan.highlight ? "none" : `1px solid ${C.border}`, background: plan.highlight ? C.accent : "transparent", color: plan.highlight ? "#0a0c10" : C.text, borderRadius: "5px", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: plan.highlight ? 600 : 400 }}>
                  {plan.cta}
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <FadeIn>
        <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: C.accentDim, textTransform: "uppercase", marginBottom: "20px" }}>Get Started Today</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, color: C.text, margin: "0 0 20px", lineHeight: 1.15 }}>
            Your first 5 analyses<br /><span style={{ fontStyle: "italic", color: C.accent }}>are completely free.</span>
          </h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: C.muted, lineHeight: 1.75, margin: "0 0 36px" }}>
            No credit card required. No commitment. Just enter a ticker and see Brevio work for yourself.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: C.accent, color: "#0a0c10", border: "none", borderRadius: "5px", padding: "14px 36px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
              Start for Free
            </button>
            <button style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, borderRadius: "5px", padding: "14px 28px", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
              View Pricing
            </button>
          </div>
          <div style={{ marginTop: "24px", display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            {["No credit card required", "Cancel anytime", "Swiss data protection"].map((t, i) => (
              <span key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: C.green, fontSize: "10px" }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function DisclaimerBar() {
  return (
    <div style={{ padding: "28px 24px", borderTop: `1px solid ${C.border}`, background: C.bgAlt }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: C.accentDim, textTransform: "uppercase" }}>Important Disclaimer · </span>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, lineHeight: 1.8 }}>
          Brevio provides financial information for educational and research purposes only. Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, cryptocurrency, commodity, ETF, or any other financial instrument, nor a solicitation of any investment. Cryptocurrency and commodity analysis is highly speculative — prices can be extremely volatile and you may lose your entire investment. Always consult a FINMA-regulated financial advisor before making any investment decisions. Past performance is not indicative of future results. Brevio is not licensed by FINMA or any other financial regulatory authority.
        </span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "56px 32px 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", color: C.accent, fontWeight: 600, letterSpacing: "0.01em" }}>B</span>
              <div style={{ width: "1px", height: "16px", background: C.border }} />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "15px", color: C.text, letterSpacing: "0.06em" }}>Brevio</span>
            </div>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted, lineHeight: 1.75, maxWidth: "240px" }}>
              AI-powered financial research for stocks, crypto, ETFs and commodities. Built in Switzerland. 🇨🇭
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Disclaimer", "Impressum"] },
            { title: "Company", links: ["About", "Blog", "Contact", "Support"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDim, marginBottom: "16px" }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: "block", fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted, textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.text}
                  onMouseLeave={e => e.target.style.color = C.muted}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>© 2025 Brevio. All rights reserved. Switzerland 🇨🇭</span>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>Not financial advice · For informational purposes only</span>
        </div>
      </div>
    </footer>
  );
}

export default function BrevioLanding() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Nav />
      <TickerBar />
      <div style={{ height: "104px" }} />
      <HeroSection />
      <StatsBar />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <DisclaimerBar />
      <Footer />
    </div>
  );
}
