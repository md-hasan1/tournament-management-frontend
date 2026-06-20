type ChartPoint = {
  week: string;
  value: number;
};

type SimpleBarChartProps = {
  data: ChartPoint[];
};

export default function SimpleBarChart({ data }: SimpleBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="grid h-75 grid-rows-[1fr_auto]">
      <div className="relative rounded-md border border-[#2A3040] px-3 py-4">
        <div className="pointer-events-none absolute inset-0 grid grid-rows-4 px-3 py-4">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="border-b border-dashed border-[#2A3040] last:border-none"
            />
          ))}
        </div>

        <div className="relative z-10 flex h-full items-end justify-between gap-3">
          {data.map((item, index) => (
            <div
              key={`${item.week}-${index}`}
              className="flex h-full flex-1 items-end justify-center"
            >
              <div
                className="w-full max-w-7 rounded-sm bg-[#35BACB]"
                style={{ height: `${(item.value / max) * 100}%` }}
                title={`${item.week}: ${item.value}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between px-1 text-xs text-[#7E869C]">
        {data.map((item, index) => {
          if (index % 2 !== 0 && index !== data.length - 1) {
            return <span key={`${item.week}-${index}`} className="w-full" />;
          }

          return (
            <span key={`${item.week}-${index}`} className="w-full text-center">
              {item.week}
            </span>
          );
        })}
      </div>
    </div>
  );
}
