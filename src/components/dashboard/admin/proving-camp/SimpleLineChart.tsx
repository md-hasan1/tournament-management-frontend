type ChartPoint = {
  week: string;
  value: number;
};

type SimpleLineChartProps = {
  data: ChartPoint[];
};

export default function SimpleLineChart({ data }: SimpleLineChartProps) {
  const width = 640;
  const height = 300;
  const padding = 26;

  // Guard: if no data or only one point, render a fallback
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-[#7E869C]">
        No data available
      </div>
    );
  }

  // If only one point, plot it in the center
  const min = Math.min(...data.map((item) => item.value));
  const max = Math.max(...data.map((item) => item.value));
  const span = Math.max(max - min, 1);

  const points = data.map((item, index) => {
    let x;
    if (data.length === 1) {
      x = width / 2;
    } else {
      x = padding + (index / (data.length - 1)) * (width - padding * 2);
    }
    const y =
      height - padding - ((item.value - min) / span) * (height - padding * 2);
    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const yAxisTicks = [0, 1, 2, 3, 4].map((tick) => {
    const y = padding + (tick / 4) * (height - padding * 2);
    const value = Math.round(max - (tick / 4) * span);
    return { y, value };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-140"
        role="img"
        aria-label="Revenue by week line chart"
      >
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {yAxisTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={padding}
              y1={tick.y}
              x2={width - padding}
              y2={tick.y}
              stroke="#2A3040"
              strokeDasharray="3 3"
            />
            <text
              x={padding - 8}
              y={tick.y + 4}
              textAnchor="end"
              fill="#7E869C"
              fontSize="11"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {points.length > 1 &&
          points.map((point, index) => (
            <line
              key={point.x}
              x1={point.x}
              y1={padding}
              x2={point.x}
              y2={height - padding}
              stroke={index % 2 === 0 ? "#242A38" : "transparent"}
              strokeDasharray="2 3"
            />
          ))}

        {points.length > 1 && (
          <path d={path} fill="none" stroke="#35BACB" strokeWidth="3" />
        )}

        {points.map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="#35BACB"
          />
        ))}

        {data.map((item, index) => {
          if (index % 2 !== 0 && index !== data.length - 1) {
            return null;
          }

          return (
            <text
              key={`${item.week}-${index}`}
              x={points[index].x}
              y={height - 8}
              textAnchor="middle"
              fill="#7E869C"
              fontSize="11"
            >
              {item.week}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
