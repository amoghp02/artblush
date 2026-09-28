export interface DonutSegment {
  label: string;
  valueText: string;
  value: number;
  color: string;
}

export const CHART_COLORS = [
  "#9b6b43",
  "#b8876a",
  "#7a5a45",
  "#c9a47f",
  "#5f4638",
  "#a17f62",
  "#d8b791",
  "#8a6a53",
];

export function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const offsets = segments.map((_, i) =>
    segments
      .slice(0, i)
      .reduce((sum, s) => sum + (total > 0 ? (s.value / total) * 100 : 0), 0),
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <svg viewBox="0 0 120 120" className="h-44 w-44 shrink-0" role="img">
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          strokeWidth="16"
          className="stroke-border"
        />
        {segments.map((s, i) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          return (
            <circle
              key={i}
              cx="60"
              cy="60"
              r="44"
              fill="none"
              strokeWidth="16"
              stroke={s.color}
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offsets[i]}
              transform="rotate(-90 60 60)"
            />
          );
        })}
        {centerValue && (
          <text
            x="60"
            y={centerLabel ? "57" : "62"}
            textAnchor="middle"
            className="fill-foreground text-[15px] font-semibold"
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-muted-foreground text-[7px] uppercase tracking-[0.2em]"
          >
            {centerLabel}
          </text>
        )}
      </svg>

      {segments.length > 0 && (
        <ul className="w-full min-w-0 flex-1 space-y-2.5">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate text-foreground">
                  {s.label}
                  {s.value > 0 ? ` · ${total > 0 ? Math.round((s.value / total) * 100) : 0}%` : ""}
                </span>
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {s.valueText}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}