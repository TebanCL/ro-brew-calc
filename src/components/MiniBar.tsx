export const MiniBar = ({ pess, avg, opt, label, unit = "", rowLabels }: {
  pess: number; avg: number; opt: number; label: string; unit?: string;
  rowLabels: [string, string, string];
}) => {
  const mx = Math.max(Math.abs(pess), Math.abs(avg), Math.abs(opt), 1);
  const colors = ["var(--ro-bar-pess)", "var(--ro-bar-avg)", "var(--ro-bar-opt)"];
  const vals = [pess, avg, opt];
  return (
    <div className="mb-1.5">
      <div className="text-[11px] text-secondary-foreground mb-0.5 font-bold">{label}</div>
      {vals.map((v, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-[72px] text-[11px] text-muted-foreground text-right">{rowLabels[i]}</span>
          <div className="flex-1 ro-sunken bg-[var(--ro-bar-track)] h-[18px] relative overflow-hidden">
            <div style={{ width: `${Math.max(2, (Math.abs(v) / mx) * 100)}%`, background: colors[i], height: "100%", transition: "width .3s" }} />
            <span className="absolute right-1 top-px text-[11px] text-[#e0f0ff] font-semibold">
              {v.toLocaleString("en-US")}{unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
