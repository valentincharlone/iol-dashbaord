const SHIMMER: React.CSSProperties = {
  background: "linear-gradient(90deg, #F0F3F9 25%, #E8ECF4 50%, #F0F3F9 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.4s ease infinite",
  borderRadius: 6,
};

const COL_WIDTHS = ["140px", "80px", "120px", "70px", "90px", "100px", "80px"];
const ROWS = 12;

export default function MovimientosLoading() {
  return (
    <div style={{ padding: "24px", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ ...SHIMMER, height: 26, width: 160, marginBottom: 6 }} />
        <div style={{ ...SHIMMER, height: 14, width: 240 }} />
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
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ ...SHIMMER, height: 18, width: 110 }} />
            <div style={{ ...SHIMMER, height: 14, width: 90 }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[70, 70, 70, 60, 70, 80, 80].map((w, i) => (
              <div key={i} style={{ ...SHIMMER, height: 30, width: w, borderRadius: 6 }} />
            ))}
            <div style={{ ...SHIMMER, height: 30, width: 100, borderRadius: 8 }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr>
                {COL_WIDTHS.map((w, i) => (
                  <th key={i} style={{
                    padding: "10px 12px", borderBottom: "1px solid var(--border)",
                    textAlign: i < 3 ? "left" : "right",
                    paddingLeft: i === 0 ? 20 : 12,
                    paddingRight: i === COL_WIDTHS.length - 1 ? 20 : 12,
                  }}>
                    <div style={{ ...SHIMMER, height: 10, width: w, marginLeft: i < 3 ? 0 : "auto" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROWS }).map((_, i) => (
                <tr key={i}>
                  {/* Fecha */}
                  <td style={{ padding: "12px 12px 12px 20px", borderBottom: "1px solid #F5F7FB" }}>
                    <div style={{ ...SHIMMER, height: 13, width: 120 }} />
                  </td>
                  {/* Tipo badge */}
                  <td style={{ padding: "12px", borderBottom: "1px solid #F5F7FB" }}>
                    <div style={{ ...SHIMMER, height: 20, width: 64, borderRadius: 4 }} />
                  </td>
                  {/* Activo */}
                  <td style={{ padding: "12px", borderBottom: "1px solid #F5F7FB" }}>
                    <div style={{ ...SHIMMER, height: 14, width: 55, marginBottom: 5 }} />
                    <div style={{ ...SHIMMER, height: 11, width: 35 }} />
                  </td>
                  {/* Cantidad, Precio, Total, Estado */}
                  {[50, 80, 90, 60].map((w, j) => (
                    <td key={j} style={{
                      padding: "12px", borderBottom: "1px solid #F5F7FB", textAlign: "right",
                      paddingRight: j === 3 ? 20 : 12,
                    }}>
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
