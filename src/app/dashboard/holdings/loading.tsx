const COLS = ["22%", "70px", "70px", "80px", "90px", "80px", "70px", "80px"];

export default function HoldingsLoading() {
  return (
    <div className="p-4 pb-12 md:p-6 md:pb-16 flex flex-col gap-4 md:gap-5">
      <div>
        <div className="shimmer h-6 w-32 mb-1.5" />
        <div className="shimmer h-3.5 w-52 mb-1.5" />
        <div className="shimmer h-3 w-80 mt-1" />
      </div>

      <div className="bg-card rounded-card shadow-sm overflow-clip">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="shimmer h-4 w-24" />
            <div className="shimmer h-3 w-20" />
          </div>
          <div className="flex gap-1.5">
            {[36, 36, 36].map((w, i) => (
              <div
                key={i}
                className="shimmer rounded"
                style={{ height: 26, width: w }}
              />
            ))}
            <div
              className="shimmer rounded"
              style={{ height: 26, width: 100 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                {COLS.map((w, i) => (
                  <th
                    key={i}
                    className={`py-2.5 px-2.5 border-b border-border ${i === 0 ? "pl-5 text-left" : "text-right"} ${i === 7 ? "pr-5" : ""}`}
                  >
                    <div
                      className="shimmer h-2.5"
                      style={{ width: w, marginLeft: i === 0 ? 0 : "auto" }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 15 }).map((_, i) => (
                <tr key={i}>
                  <td className="pl-5 pr-2.5 py-3 border-b border-border-light">
                    <div className="shimmer h-3.5 w-12 mb-1" />
                    <div className="shimmer h-[11px] w-28" />
                  </td>
                  {[48, 56, 64, 72, 64, 64, 52].map((w, j) => (
                    <td
                      key={j}
                      className={`px-2.5 py-3 border-b border-border-light ${j === 6 ? "pr-5" : ""}`}
                    >
                      <div
                        className="shimmer h-3.5 ml-auto"
                        style={{ width: w }}
                      />
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
