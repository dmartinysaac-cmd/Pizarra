import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormResult, Match, TeamInfo, Confidence } from "../data/matches";
import { CONF_META } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { IconArrow, IconLock, IconStar } from "./icons";

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={{ "--rd": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* ---------- contador animado ---------- */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
          setDisplay(value);
          return;
        }
        const start = performance.now();
        const dur = 1300;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ---------- cabecera de sección ---------- */
export function SectionHead({
  stamp,
  title,
  right,
  id,
}: {
  stamp: string;
  title: string;
  right?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div id={id}>
        <p className="stamp mb-2 flex items-center gap-2 text-pitch-400">
          <span className="inline-block h-px w-8 bg-pitch-500" aria-hidden />
          {stamp}
        </p>
        <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-wide text-mist-100 sm:text-5xl">{title}</h2>
      </div>
      {right}
    </Reveal>
  );
}

/* ---------- escudo de equipo ---------- */
export function TeamBadge({ team, size = 44 }: { team: TeamInfo; size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold uppercase"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
        color: team.colors[0] === "#f2f2f2" || team.colors[0] === "#d9d9d9" || team.colors[0] === "#fde100" || team.colors[0] === "#f7c600" ? "#0b1118" : "#eaf1f6",
        background: `linear-gradient(135deg, ${team.colors[0]} 0%, ${team.colors[0]} 55%, ${team.colors[1]} 130%)`,
        boxShadow: `0 0 0 2px #0b1118, 0 0 0 3.5px ${team.colors[0]}55`,
      }}
    >
      {team.code}
    </span>
  );
}

/* ---------- racha V/E/D ---------- */
export function FormDots({ form, size = "md" }: { form: FormResult[]; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-[11px]";
  const palette: Record<FormResult, string> = {
    V: "bg-pitch-500/15 text-pitch-300 border-pitch-500/40",
    E: "bg-gold-400/10 text-gold-300 border-gold-400/40",
    D: "bg-risk-500/10 text-risk-300 border-risk-500/40",
  };
  return (
    <span className="inline-flex gap-1">
      {form.map((r, i) => (
        <span key={i} className={`${cls} ${palette[r]} inline-flex items-center justify-center rounded-[4px] border font-mono font-semibold`}>
          {r}
        </span>
      ))}
    </span>
  );
}

/* ---------- barra de probabilidad ---------- */
export function ProbBar({
  label,
  prob,
  odd,
  tone = "pitch",
  delay = 0,
  compact = false,
}: {
  label: string;
  prob: number;
  odd?: number;
  tone?: "pitch" | "gold" | "risk" | "mist";
  delay?: number;
  compact?: boolean;
}) {
  const tones = {
    pitch: "bg-pitch-500",
    gold: "bg-gold-400",
    risk: "bg-risk-500",
    mist: "bg-mist-600",
  };
  return (
    <Reveal className={compact ? "mb-2" : "mb-3"}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className={`text-mist-200 ${compact ? "text-[12px]" : "text-[13px]"}`}>{label}</span>
        <span className="font-mono text-[12px] text-mist-400">
          {odd !== undefined && <span className="mr-2 text-mist-600">@{odd.toFixed(2)}</span>}
          <strong className="text-[13px] text-mist-100">{prob}%</strong>
        </span>
      </div>
      <div className={`w-full overflow-hidden rounded-[3px] bg-ink-700 ${compact ? "h-[5px]" : "h-[7px]"}`}>
        <div className={`bar-fill h-full ${tones[tone]} rounded-[3px]`} style={{ width: `${prob}%`, "--rd": `${delay}ms` } as CSSProperties} />
      </div>
    </Reveal>
  );
}

/* ---------- insignia de confianza ---------- */
export function ConfidenceBadge({ level, full = false }: { level: Confidence; full?: boolean }) {
  const meta = CONF_META[level];
  return (
    <span className={`inline-flex items-center gap-2 rounded-[4px] border border-line bg-ink-800 px-2.5 py-1 ${full ? "text-[13px]" : "text-[12px]"}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${meta.bg}`} aria-hidden />
      <span className="font-mono uppercase tracking-wider text-mist-200">
        Confianza <strong className={meta.color}>{meta.label}</strong>
      </span>
    </span>
  );
}

export function ConfidenceDot({ level }: { level: Confidence }) {
  const meta = CONF_META[level];
  return (
    <span title={`Confianza ${meta.label}`}>
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.bg}`} />
    </span>
  );
}

/* ---------- puerta de acceso (gate) ---------- */
export function Gate({
  locked,
  kind,
  title,
  blurb,
  children,
}: {
  locked: boolean;
  kind: "login" | "premium";
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative">
      <div className="locked-blur pointer-events-none select-none" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <Reveal className="w-full max-w-md border border-line-2 bg-ink-850/95 p-6 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:p-8">
          <span
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${
              kind === "premium" ? "border-gold-400/40 bg-gold-400/10 text-gold-300" : "border-pitch-500/40 bg-pitch-500/10 text-pitch-300"
            }`}
          >
            {kind === "premium" ? <IconStar size={22} /> : <IconLock size={22} />}
          </span>
          <p className="stamp mb-1 text-mist-500">{kind === "premium" ? "Contenido Premium" : "Zona registrada"}</p>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-mist-100">{title}</h3>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-mist-400">{blurb}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {kind === "premium" ? (
              <>
                <Link
                  to="/precios"
                  className="bg-gold-400 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-ink-950 transition-colors hover:bg-gold-300"
                >
                  Desbloquear Premium
                </Link>
                <Link to="/metodologia" className="border border-line-2 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-mist-200 transition-colors hover:border-mist-600">
                  Ver metodología
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-pitch-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-ink-950 transition-colors hover:bg-pitch-400"
              >
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- sparkline ---------- */
export function Sparkline({ points, className = "", stroke = "#2cc873" }: { points: number[]; className?: string; stroke?: string }) {
  const path = useMemo(() => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const step = 100 / (points.length - 1);
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(34 - ((p - min) / range) * 28 - 3).toFixed(1)}`).join(" ");
  }, [points]);
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={`${path} L100,34 L0,34 Z`} fill={stroke} opacity="0.12" stroke="none" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- formación sobre medio campo ---------- */
const FORMATIONS: Record<string, [number, number][]> = {
  "4-3-3": [[5, 50], [18, 14], [17, 38], [17, 62], [18, 86], [35, 24], [33, 50], [35, 76], [54, 16], [57, 50], [54, 84]],
  "4-4-2": [[5, 50], [18, 14], [17, 38], [17, 62], [18, 86], [34, 12], [34, 38], [34, 62], [34, 88], [53, 35], [53, 65]],
  "4-3-1-2": [[5, 50], [18, 14], [17, 38], [17, 62], [18, 86], [34, 25], [32, 50], [34, 75], [46, 50], [56, 34], [56, 66]],
  "4-2-3-1": [[5, 50], [18, 14], [17, 38], [17, 62], [18, 86], [30, 34], [30, 66], [45, 18], [47, 50], [45, 82], [58, 50]],
  "3-5-2": [[5, 50], [17, 25], [15, 50], [17, 75], [35, 8], [33, 30], [31, 50], [33, 70], [35, 92], [54, 37], [54, 63]],
  "5-3-2": [[5, 50], [17, 10], [16, 30], [14, 50], [16, 70], [17, 90], [34, 27], [32, 50], [34, 73], [54, 37], [54, 63]],
};

export function PitchFormation({ formation, color, label, mirrored = false }: { formation: string; color: string; label: string; mirrored?: boolean }) {
  const dots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];
  return (
    <div>
      <p className="stamp mb-2 text-mist-500">
        {label} · <span className="text-mist-200">{formation}</span>
      </p>
      <svg viewBox="0 0 64 100" className="w-full border border-line bg-ink-900">
        <rect x="0" y="0" width="64" height="100" fill="none" />
        <line x1="0" y1="50" x2="64" y2="50" stroke="#1d2a39" strokeWidth="0.6" />
        <circle cx="32" cy="50" r="8" fill="none" stroke="#1d2a39" strokeWidth="0.6" />
        <rect x="18" y="0" width="28" height="10" fill="none" stroke="#1d2a39" strokeWidth="0.6" />
        <rect x="18" y="90" width="28" height="10" fill="none" stroke="#1d2a39" strokeWidth="0.6" />
        {dots.map(([x, y], i) => {
          const px = mirrored ? 100 - y : y;
          const py = mirrored ? x : 100 - x;
          return (
            <g key={i}>
              <circle cx={px * 0.64} cy={py} r="3.4" fill={color} opacity="0.9" />
              <circle cx={px * 0.64} cy={py} r="5.2" fill="none" stroke={color} opacity="0.25" strokeWidth="0.8" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- fila de partido (cartelera) ---------- */
export function MatchRow({ match, index = 0 }: { match: Match; index?: number }) {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const deep = isPremium || match.freeAccess;
  const market1x2 = match.markets.find((m) => m.icon === "result")!;
  const maxEdge = match.valuePicks.length ? Math.max(...match.valuePicks.map((v) => v.edge)) : 0;

  return (
    <Reveal delay={Math.min(index * 70, 350)}>
      <button
        onClick={() => navigate(`/partido/${match.id}`)}
        className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 border border-line bg-ink-850 p-4 text-left transition-all duration-300 hover:border-line-2 hover:bg-ink-800 sm:grid-cols-[86px_1fr_190px_auto] sm:p-5"
      >
        {/* hora / estado */}
        <div className="flex items-center gap-3 sm:block">
          {match.live ? (
            <span className="inline-flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-risk-500" />
              <span className="font-mono text-[12px] font-semibold text-risk-300">{match.live.minute}&#8242;</span>
            </span>
          ) : (
            <span className="font-display text-3xl font-bold text-mist-100">{match.time}</span>
          )}
          <p className="stamp mt-1 text-mist-500">{match.compShort}</p>
        </div>

        {/* equipos */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <TeamBadge team={match.home} size={34} />
            <span className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{match.home.short}</span>
            {match.live && <span className="font-display text-2xl font-bold text-mist-100">{match.live.home}</span>}
            <span className="font-display text-lg text-mist-500">vs</span>
            {match.live && <span className="font-display text-2xl font-bold text-mist-100">{match.live.away}</span>}
            <span className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{match.away.short}</span>
            <TeamBadge team={match.away} size={34} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ConfidenceDot level={match.conclusion.confidence} />
            {match.freeAccess && <span className="stamp border border-pitch-500/40 px-1.5 py-0.5 text-pitch-300">Acceso libre</span>}
            {match.featured && <span className="stamp border border-gold-400/40 px-1.5 py-0.5 text-gold-300">Partido del día</span>}
            {!deep && (
              <span className="stamp inline-flex items-center gap-1 border border-line-2 px-1.5 py-0.5 text-mist-500">
                <IconLock size={10} /> Profundo: Premium
              </span>
            )}
            {match.valuePicks.length > 0 && (
              <span className="stamp border border-gold-400/30 bg-gold-400/5 px-1.5 py-0.5 text-gold-300">Valor +{maxEdge.toFixed(1)}%</span>
            )}
          </div>
        </div>

        {/* 1X2 mini */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex h-[8px] w-full overflow-hidden rounded-[3px] bg-ink-700">
            {market1x2.outcomes.map((o, i) => (
              <div
                key={o.label}
                className={`h-full ${i === 0 ? "bg-pitch-500" : i === 1 ? "bg-mist-600" : "bg-gold-400"}`}
                style={{ width: `${o.prob}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-mist-400">
            {market1x2.outcomes.map((o) => (
              <span key={o.label}>
                {o.label.split("·")[0].trim()} <strong className="text-mist-200">{o.prob}%</strong>
              </span>
            ))}
          </div>
        </div>

        {/* acción */}
        <div className="col-start-2 flex items-center gap-3 justify-self-end sm:col-start-auto">
          <span className="stamp hidden text-mist-500 md:block">{match.venue.split(",")[0]}</span>
          <span className="flex h-9 w-9 items-center justify-center border border-line text-mist-400 transition-all duration-300 group-hover:border-pitch-500 group-hover:text-pitch-300">
            <IconArrow size={16} />
          </span>
        </div>
      </button>
    </Reveal>
  );
}

/* ---------- chip estadístico ---------- */
export function StatChip({ label, value, tone = "mist" }: { label: string; value: ReactNode; tone?: "pitch" | "gold" | "mist" }) {
  const tones = { pitch: "text-pitch-300", gold: "text-gold-300", mist: "text-mist-100" };
  return (
    <div className="border border-line bg-ink-850 px-4 py-3">
      <p className={`font-display text-2xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="stamp mt-0.5 text-mist-500">{label}</p>
    </div>
  );
}
