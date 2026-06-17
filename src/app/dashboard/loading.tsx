const SHIMMER: React.CSSProperties = {
  background: "linear-gradient(90deg, #F0F3F9 25%, #E8ECF4 50%, #F0F3F9 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.4s ease infinite",
  borderRadius: 6,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 14,
  border: "1px solid var(--border-light)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function SkRow({ w, h = 13, ml }: { w: number | string; h?: number; ml?: "auto" }) {
  return <div style={{ ...SHIMMER, height: h, width: w, marginLeft: ml }} />;
}

export default function DashboardLoading() {
  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <SkRow w={120} h={22} />
          <SkRow w={160} h={13} />
        </div>
        <SkRow w={70} h={14} />
      </div>

      {/* KPI row: 2fr 1fr 1fr 0.7fr */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.7fr", gap: 14 }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
          borderRadius: 14, padding: "24px 28px",
        }}>
          <div style={{ ...SHIMMER, height: 13, width: 140, marginBottom: 10, opacity: 0.4 }} />
          <div style={{ ...SHIMMER, height: 30, width: 200, marginBottom: 12, opacity: 0.4 }} />
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ ...SHIMMER, height: 11, width: 110, opacity: 0.3 }} />
            <div style={{ ...SHIMMER, height: 11, width: 120, opacity: 0.3 }} />
          </div>
        </div>

        {/* Rendimiento */}
        <div style={{ ...card, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <SkRow w={100} h={10} />
          <SkRow w={90} h={28} />
          <SkRow w={80} h={12} />
        </div>

        {/* Variación hoy */}
        <div style={{ ...card, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <SkRow w={90} h={10} />
          <SkRow w={80} h={28} />
          <SkRow w={70} h={12} />
        </div>

        {/* Posiciones */}
        <div style={{ ...card, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <SkRow w={70} h={10} />
          <SkRow w={40} h={28} />
          <SkRow w={50} h={12} />
        </div>
      </div>

      {/* Cash cards */}
      <div style={{ display: "flex", gap: 14 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ ...card, borderRadius: 12, flex: 1, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ ...SHIMMER, width: 16, height: 16, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <SkRow w={90} h={10} />
              <SkRow w={120} h={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Top movers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ ...card, padding: "16px 20px" }}>
            <SkRow w={80} h={10} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
              {[0, 1, 2].map((j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <SkRow w={40} h={13} />
                    <SkRow w={90} h={11} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <SkRow w={55} h={13} />
                    <SkRow w={70} h={10} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Distribution + Holdings */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
        {/* Donut placeholder */}
        <div style={{ ...card, padding: "20px 24px" }}>
          <SkRow w={90} h={14} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <div style={{
              ...SHIMMER,
              width: 180, height: 180, borderRadius: "50%",
            }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            {[100, 80, 110, 70].map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...SHIMMER, width: 10, height: 10, borderRadius: "50%", flexShrink: 0 }} />
                <SkRow w={w} h={12} />
                <SkRow w={50} h={12} ml="auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Holdings table */}
        <div style={{ ...card, overflow: "clip" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <SkRow w={100} h={16} />
              <SkRow w={80} h={12} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[36, 36, 36, 140].map((w, i) => (
                <SkRow key={i} w={w} h={28} />
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[160, 70, 70, 80, 80, 80, 70].map((w, i) => (
                  <th key={i} style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", paddingLeft: i === 0 ? 20 : 12, paddingRight: i === 6 ? 20 : 12 }}>
                    <div style={{ ...SHIMMER, height: 10, width: w, marginLeft: i === 0 ? 0 : "auto" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px 12px 12px 20px", borderBottom: "1px solid #F5F7FB" }}>
                    <div style={{ ...SHIMMER, height: 14, width: 50, marginBottom: 5 }} />
                    <div style={{ ...SHIMMER, height: 11, width: 110 }} />
                  </td>
                  {[50, 60, 70, 65, 65, 55].map((w, j) => (
                    <td key={j} style={{ padding: "12px", borderBottom: "1px solid #F5F7FB", textAlign: "right", paddingRight: j === 5 ? 20 : 12 }}>
                      <div style={{ ...SHIMMER, height: 14, width: w, marginLeft: "auto" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
