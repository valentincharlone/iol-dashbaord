export default function TickerLoading() {
  return (
    <div className="p-4 pb-12 md:p-6 md:pb-16 flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="shimmer h-3 w-16 mb-3" />
        <div className="flex items-center gap-2.5 mb-1">
          <div className="shimmer h-6 w-24" />
          <div className="shimmer h-4 w-14 rounded-sm" />
        </div>
        <div className="shimmer h-3.5 w-48" />
      </div>

      {/* Gráfico */}
      <div className="bg-card rounded-card shadow-sm p-5 md:p-6">
        <div className="flex items-baseline gap-3 mb-4">
          <div className="shimmer h-7 w-36" />
          <div className="shimmer h-4 w-20" />
        </div>
        <div className="flex gap-1 mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer rounded-md h-7 w-10" />
          ))}
        </div>
        <div className="shimmer h-[220px] rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-card rounded-card shadow-sm p-5 md:p-6">
            <div className="shimmer h-3 w-24 mb-4" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {[80, 100, 90, 110].map((w, j) => (
                <div key={j}>
                  <div className="shimmer h-2.5 w-16 mb-1.5" />
                  <div className="shimmer h-4" style={{ width: w }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
