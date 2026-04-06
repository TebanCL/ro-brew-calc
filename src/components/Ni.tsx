import { sunken, RO } from "../lib/theme";

export const Ni = ({ val, onChange, w = "68px", min, max }: { val: number; onChange: (v: number) => void; w?: string; min?: number; max?: number }) => (
  <input type="number" value={val} min={min} max={max}
    onChange={e => {
      let v = Number(e.target.value) || 0;
      if (min !== undefined) v = Math.max(min, v);
      if (max !== undefined) v = Math.min(max, v);
      onChange(v);
    }}
    style={{ width: w, padding: "2px 5px", ...sunken, background: RO.inputBg, color: RO.inputText, textAlign: "right", fontSize: 12, outline: "none", fontFamily: "Tahoma, Verdana, sans-serif", fontWeight: 700 }} />
);
