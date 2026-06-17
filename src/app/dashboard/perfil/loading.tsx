const SHIMMER: React.CSSProperties = {
  background: "linear-gradient(90deg, #F0F3F9 25%, #E8ECF4 50%, #F0F3F9 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.4s ease infinite",
  borderRadius: 6,
};

export default function PerfilLoading() {
  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ ...SHIMMER, height: 26, width: 140, marginBottom: 6 }} />
        <div style={{ ...SHIMMER, height: 14, width: 260 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ ...SHIMMER, width: 56, height: 56, borderRadius: "50%" }} />
            <div>
              <div style={{ ...SHIMMER, height: 18, width: 160, marginBottom: 8 }} />
              <div style={{ ...SHIMMER, height: 12, width: 200 }} />
            </div>
          </div>
          {[140, 80, 160, 180].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #F5F7FB" }}>
              <div style={{ ...SHIMMER, height: 13, width: 90 }} />
              <div style={{ ...SHIMMER, height: 13, width: w }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#EEF2FF", borderRadius: 14, padding: "24px 28px" }}>
            <div style={{ ...SHIMMER, height: 12, width: 120, marginBottom: 10, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ ...SHIMMER, height: 32, width: 200, background: "rgba(255,255,255,0.3)" }} />
          </div>
          <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border-light)", padding: "20px 24px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ ...SHIMMER, height: 13, width: 60 }} />
                <div style={{ ...SHIMMER, height: 16, width: 120 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
