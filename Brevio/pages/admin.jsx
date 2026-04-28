import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Users, TrendingUp, Activity, LogOut, Shield } from "lucide-react";

const C = {
  bg: "#0a0c10", bgAlt: "#0d0f14", panel: "#111318",
  border: "#1e2330", borderLight: "#252a38",
  accent: "#c9a84c", accentDim: "#7a5e2a",
  green: "#3ecf8e", red: "#f87171",
  text: "#e8e6e0", muted: "#6b7280",
};

const ADMIN_EMAIL = "leonardogiardin0@gmail.com";

export default function AdminPage({ session, supabase, loading }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session) { router.push("/dashboard"); return; }
    if (session.user.email !== ADMIN_EMAIL) { router.push("/dashboard"); return; }
    fetchUsers();
  }, [session, loading]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin-users", {
        headers: { "Authorization": "Bearer " + session.access_token }
      });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setStats({
          total: data.users.length,
          today: data.users.filter(u => new Date(u.created_at) > todayStart).length,
          thisWeek: data.users.filter(u => new Date(u.created_at) > weekStart).length,
        });
      }
    } catch (e) { console.error(e); }
    setLoadingUsers(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/dashboard");
  };

  if (loading || loadingUsers) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "24px", height: "24px", border: "2px solid " + C.border, borderTop: "2px solid " + C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session || session.user.email !== ADMIN_EMAIL) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" />

      {/* Header */}
      <div style={{ height: "60px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg, borderBottom: "1px solid " + C.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield style={{ width: "16px", height: "16px", color: C.accent }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", color: C.accent, fontWeight: 600 }}>Brevio</span>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>{session.user.email}</span>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid " + C.border, borderRadius: "5px", padding: "6px 12px", cursor: "pointer", color: C.muted, fontFamily: "DM Sans, sans-serif", fontSize: "12px" }}>
            <LogOut style={{ width: "12px", height: "12px" }} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", fontWeight: 500, color: C.text, marginBottom: "6px" }}>User Overview</h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted }}>All registered Brevio users</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Total Users", value: stats.total, icon: <Users style={{ width: "16px", height: "16px", color: C.accent }} /> },
            { label: "New Today", value: stats.today, icon: <Activity style={{ width: "16px", height: "16px", color: C.green }} /> },
            { label: "This Week", value: stats.thisWeek, icon: <TrendingUp style={{ width: "16px", height: "16px", color: C.accent }} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: "10px", padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                {s.icon}
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "32px", color: C.text, fontWeight: 500 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDim }}>Registered Users</span>
            <button onClick={fetchUsers} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.accent, background: "transparent", border: "none", cursor: "pointer" }}>Refresh</button>
          </div>

          {users.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.muted }}>No users yet</span>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px", padding: "10px 20px", borderBottom: "1px solid " + C.border }}>
                {["Email", "Signed Up", "Provider", "Status"].map((h, i) => (
                  <span key={i} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted }}>{h}</span>
                ))}
              </div>
              {users.map((user, i) => (
                <div key={user.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px", padding: "14px 20px", borderBottom: i < users.length - 1 ? "1px solid " + C.border : "none", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bgAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: C.text }}>{user.email}</span>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: C.muted }}>
                    {new Date(user.created_at).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: C.muted, textTransform: "capitalize" }}>
                    {user.app_metadata?.provider || "email"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: user.email_confirmed_at ? C.green : C.muted }} />
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: user.email_confirmed_at ? C.green : C.muted }}>
                      {user.email_confirmed_at ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
