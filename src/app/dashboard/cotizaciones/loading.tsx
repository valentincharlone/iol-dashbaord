const SHIMMER: React.CSSProperties = {
  background: "linear-gradient(90deg, #F0F3F9 25%, #E8ECF4 50%, #F0F3F9 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.4s ease infinite",
  borderRadius: 6,
};

const COL_WIDTHS = ["180px", "90px", "80px", "80px", "80px", "80px", "80px", "100px"];
const ROWS = 12;

export default function CotizacionesLoading() {
  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ ...SHIMMER, height: 26, width: 160, marginBottom: 6 }} />
        <div style={{ ...SHIMMER, height: 14, width: 220 }} />
      </div>

      {/* Table card */}
      <div style={{
        background: "white", borderRadius: 14,
        border: "1px solid var(--border-light)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "clip",
      }}>
        {/* Toolbar */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ ...SHIMMER, height: 18, width: 120 }} />
            <div style={{ ...SHIMMER, height: 14, width: 80 }} />
          </div>
          <div style={{ ...SHIMMER, height: 32, width: 220, borderRadius: 8 }} />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead>
              <tr>
                {COL_WIDTHS.map((w, i) => (
                  <th key={i} style={{
                    padding: "10px 12px", borderBottom: "1px solid var(--border)",
                    textAlign: i === 0 ? "left" : "right",
                    paddingLeft: i === 0 ? 20 : 12,
                  }}>
                    <div style={{ ...SHIMMER, height: 10, width: w, marginLeft: i === 0 ? 0 : "auto" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROWS }).map((_, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px 12px 12px 20px", borderBottom: "1px solid #F5F7FB" }}>
                    <div style={{ ...SHIMMER, height: 14, width: 60, marginBottom: 5 }} />
                    <div style={{ ...SHIMMER, height: 11, width: 120 }} />
                  </td>
                  {COL_WIDTHS.slice(1).map((w, j) => (
                    <td key={j} style={{ padding: "12px", borderBottom: "1px solid #F5F7FB", textAlign: "right" }}>
                      <div style={{ ...SHIMMER, height: 14, width: parseInt(w) * 0.6, marginLeft: "auto" }} />
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
