import { sunken, RO } from "../lib/theme";

export const MiniBar = ({ pess, avg, opt, label, unit = "", rowLabels }: {
  pess: number; avg: number; opt: number; label: string; unit?: string;
  rowLabels: [string, string, string];
}) => {
  const mx = Math.max(Math.abs(pess), Math.abs(avg), Math.abs(opt), 1);
  const colors = [RO.barPess, RO.barAvg, RO.barOpt];
  const vals = [pess, avg, opt];
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 11, color: RO.textMid, marginBottom: 2, fontWeight: 700 }}>{label}</div>
      {vals.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ width: 72, fontSize: 11, color: RO.textMuted, textAlign: "right" }}>{rowLabels[i]}</span>
          <div style={{ flex: 1, ...sunken, background: RO.barTrack, height: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(2, (Math.abs(v) / mx) * 100)}%`, background: colors[i], height: "100%", transition: "width .3s" }} />
            <span style={{ position: "absolute", right: 4, top: 1, fontSize: 11, color: "#e0f0ff", fontWeight: 600 }}>
              {v.toLocaleString("en-US")}{unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
