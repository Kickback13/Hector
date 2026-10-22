import { cn } from "@/lib/utils";

/**
 * Town Made Cleaning mark — the "T" whose crossbar becomes a pressure-wand hose,
 * looping down to a nozzle spraying three droplets. Rebuilt as clean vector paths
 * from Hector's original logo so it stays crisp at any size.
 */
export function LogoMark({
  className,
  navy = "currentColor",
  sky = "var(--sky)",
}: {
  className?: string;
  navy?: string;
  sky?: string;
}) {
  return (
    <svg viewBox="0 0 180 200" className={cn("block", className)} aria-hidden="true">
      <g transform="translate(-8 -12)" fill="none">
        <path d="M18 37 H120" stroke={navy} strokeWidth="34" />
        <path d="M69 37 V182" stroke={navy} strokeWidth="34" />
        <path
          d="M120 37 C150 37 158 56 158 82 A18 18 0 1 1 122 82 A18 18 0 1 1 158 82 L158 112"
          stroke={sky}
          strokeWidth="14"
        />
        <path d="M158 112 V126" stroke={navy} strokeWidth="26" />
        <path d="M147 134 L139 148" stroke={sky} strokeWidth="7" strokeLinecap="round" />
        <path d="M158 137 L158 153" stroke={sky} strokeWidth="7" strokeLinecap="round" />
        <path d="M169 134 L177 148" stroke={sky} strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function LogoLockup({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-auto" navy={light ? "#ffffff" : "var(--navy)"} />
      <span className="flex flex-col leading-none">
        <span className={cn("text-[15px] font-bold tracking-[0.18em]", light ? "text-white" : "text-navy")}>
          TOWN MADE
        </span>
        <span className="mt-1 text-[11px] font-semibold tracking-[0.42em] text-sky">CLEANING</span>
      </span>
    </span>
  );
}
