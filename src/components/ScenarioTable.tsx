interface ScenarioRow {
  label: string;
  vals: [number, number, number];
  fmt: (v: number) => string;
  /** Color positive green / negative red */
  sign?: boolean;
}

const COL_COLORS = ["#b04040", "#907820", "#1a7830"] as const;
const COL_BG     = ["#3a1010", "#302800", "#0a2810"] as const;

export const ScenarioTable = ({ rows, colLabels }: {
  rows: ScenarioRow[];
  colLabels: [string, string, string];
}) => (
  <div className="mb-2 text-[11px]">
    {/* Header */}
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-border mb-px">
      <div />
      {colLabels.map((lbl, ci) => (
        <div
          key={ci}
          className="text-center font-bold py-0.5 px-1 text-[10px]"
          style={{ color: COL_COLORS[ci], background: COL_BG[ci] }}
        >
          {lbl}
        </div>
      ))}
    </div>

    {/* Rows */}
    {rows.map(({ label, vals, fmt, sign = false }, ri) => (
      <div
        key={ri}
        className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-border/50"
        style={{ background: ri % 2 === 0 ? "hsl(var(--muted)/0.5)" : "hsl(var(--accent)/0.5)" }}
      >
        <div className="py-1 px-1.5 text-muted-foreground font-semibold truncate">{label}</div>
        {vals.map((v, ci) => {
          const color = sign
            ? v > 0 ? "var(--ro-profit)" : v < 0 ? "var(--ro-loss)" : undefined
            : COL_COLORS[ci];
          return (
            <div
              key={ci}
              className="py-1 px-1 text-center font-semibold tabular-nums"
              style={{ color }}
            >
              {fmt(v)}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);
