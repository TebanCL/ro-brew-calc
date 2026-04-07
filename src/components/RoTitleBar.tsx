import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RoTitleBarProps {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function RoTitleBar({ children, right, className }: RoTitleBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 border-b-2 border-b-[var(--ro-shadow)]",
        className
      )}
    >
      <span>{children}</span>
      {right && <span className="font-normal opacity-80 text-[10px]">{right}</span>}
    </div>
  );
}
