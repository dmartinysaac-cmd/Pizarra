import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CONF_META, getMatch } from "../data/matches";
import type { Absence, Match } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { ConfidenceBadge, FormDots, Gate, PitchFormation, ProbBar, Reveal, TeamBadge } from "../components/ui";
import { IconAlert, IconArrow, IconBall, IconBookmark, IconCard, IconChart, IconClock, IconEye, IconFlag, IconRadar, IconShield, IconStar, IconTarget, IconWhistle } from "../components/icons";

const MARKET_ICONS = {
  result: IconBall,
  double: IconShield,
  goals: IconTarget,
  btts: IconBall,
  shots: IconRadar,
  corners: IconFlag,
  cards: IconCard,
  other: IconChart,
} as const;

const LOWER_BETTER = ["Goles en contra", "xG en contra (xGA)", "Tarjetas amarillas", "PPDA (intensidad de presión)"];

const SUBNAV = [
  { id: "resumen", label: "Resumen" },
  { id: "local", label: "Local" },
  { id: "visitante", label: "Visitante" },
  { id: "tactico", label: "Táctico" },
  { id: "bajas", label: "Bajas y onces" },
  { id: "metricas", label: "Métricas" },
  { id: "h2h", label: "H2H" },
  { id: "modelo", label: "Modelo" },
  { id: "valor", label: "Valor" },
  { id: "conclusion", label: "Conclusión" },
];

function Section({ id, stamp, title, children }: { id: string; stamp: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <Reveal>
        <p className="stamp mb-1.5 flex items-center gap-2 text-pitch-400">
          <span className="inline-block h-px w-6 bg-pitch-500" /> {stamp}
        </p>
        <h2 className="mb-5 font-display text-3xl font-bold uppercase tracking-wide text-mist-100 sm:text-4xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

function TeamDeep({ match, side, locked }: { match: Match; side: "home" | "away"; locked: boolean }) {
  const team = side === "home" ? match.home : match.away;
  const a = side === "home" ? match.homeAnalysis : match.awayAnalysis;
  const prefix = side === "home" ? "local" : "visitante";
  return (
    <Section
      id={side === "home" ? "local" : "visitante"}
      stamp={`Análisis profundo · ${side === "home" ? "03" : "04"}`}
      title={`${side === "home" ? "Equipo local" : "Equipo visitante"}: ${team.name}`}
    >
      <Gate
        locked={locked}
        kind="premium"
        title={`Análisis del ${team.name}`}
        blurb="Forma, ataque y defensa ajustados por xG, estilo de juego, jugadores clave y contexto completo. Desbloquea todos los análisis profundos con Premium."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="border border-line bg-ink-850 p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <TeamBadge team={team} size={46} />
                <div>
                  <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{team.name}</p>
                  <p className="stamp text-mist-500">{team.manager} · {team.ranking}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="stamp mb-1 text-mist-500">Últimos 5</p>
                <FormDots form={a.form} />
              </div>
            </div>
            <p className="mb-5 text-[13.5px] leading-relaxed text-mist-300">{a.formNote}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-pitch-500 pl-4">
                <p className="stamp mb-1.5 text-pitch-400">Ataque</p>
                <p className="text-[13px] leading-relaxed text-mist-400">{a.attackText}</p>
              </div>
              <div className="border-l-2 border-risk-500 pl-4">
                <p className="stamp mb-1.5 text-risk-300">Defensa</p>
                <p className="text-[13px] leading-relaxed text-mist-400">{a.defenseText}</p>
              </div>
            </div>
            <div className="mt-5 border-l-2 border-gold-400 pl-4">
              <p className="stamp mb-1.5 text-gold-300">Estilo de juego</p>
              <p className="text-[13px] leading-relaxed text-mist-400">{a.style}</p>
            </div>
            <div className="mt-5">
              <p className="stamp mb-2 text-mist-500">Contexto del partido</p>
              <p className="text-[13px] leading-relaxed text-mist-400">{a.context}</p>
            </div>
          </div>
          <div className="grid content-start gap-3">
            <p className="stamp text-mist-500">Jugadores clave</p>
            {a.keyPlayers.map((kp) => (
              <Reveal key={kp.name} className="border border-line bg-ink-850 p-4 transition-colors hover:border-line-2">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-lg font-bold uppercase tracking-wide text-mist-100">{kp.name}</p>
                  <span className="font-mono text-[12px] text-pitch-300">{kp.figure}</span>
                </div>
                <p className="stamp mb-1.5 text-mist-500">{kp.pos}</p>
                <p className="text-[12.5px] leading-relaxed text-mist-400">{kp.note}</p>
              </Reveal>
            ))}
            <p className={`stamp mt-1 text-mist-600`}>Módulo proyectado: {side === "home" ? match.formationHome : match.formationAway}</p>
          </div>
        </div>
      </Gate>
      <span className="sr-only">{prefix}</span>
    </Section>
  );
}

function AbsenceTable({ title, rows }: { title: string; rows: Absence[] }) {
  const chip = (s: Absence["status"]) =>
    s === "Confirmado fuera" || s === "Sancionado"
      ? "border-risk-500/50 bg-risk-500/10 text-risk-300"
      : s === "Duda"
      ? "border-amberx-400/50 bg-amberx-400/10 text-amberx-300"
      : "border-pitch-500/50 bg-pitch-500/10 text-pitch-300";
  return (
    <div className="border border-line bg-ink-850">
      <p className="border-b border-line px-5 py-3 font-display text-lg font-bold uppercase tracking-wide text-mist-100">{title}</p>
      <div className="divide-y divide-line">
        {rows.map((ab) => (
          <div key={ab.player} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
            <div>
              <p className="text-[14px] font-semibold text-mist-100">{ab.player}</p>
              <p className="stamp text-mist-500">{ab.pos} · {ab.reason}</p>
            </div>
            <span className={`border px-2.5 py-1 font-mono text-[11px] ${chip(ab.status)}`}>{ab.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const match = getMatch(id ?? "");
  const navigate = useNavigate();
  const { user, isPremium, isSaved, toggleSave, pushHistory, toast } = useAuth();

  useEffect(() => {
    if (match) pushHistory(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id]);

  const model1x2 = useMemo(() => match?.markets.find((m) => m.icon === "result"), [match]);

  if (!match || !model1x2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-28 text-center">
        <p className="font-display text-5xl font-bold uppercase text-mist-100">Partido no encontrado</p>
        <p className="mt-3 text-mist-400">El análisis que buscas no está en la cartelera de hoy.</p>
        <Link to="/partidos" className="mt-8 inline-block bg-pitch-500 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950">
          Volver a la cartelera
        </Link>
      </div>
    );
  }

  const locked = !(isPremium || match.freeAccess);
  const saved = isSaved(match.id);
  const conf = CONF_META[match.conclusion.confidence];

  const basicGroups = match.markets.filter((g) => g.basic);
  const fullGroups = match.markets;
  const metricsOpen = match.metrics.slice(0, 5);
  const metricsPremium = match.metrics.slice(5);

  return (
    <div>
      {/* ============ CABECERA ============ */}
      <header className="relative overflow-hidden border-b border-line bg-ink-900">
        <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6">
          <Reveal>
            <button onClick={() => navigate(-1)} className="group mb-6 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-mist-400 transition-colors hover:text-pitch-300">
              <IconArrow size={15} className="rotate-180 transition-transform group-hover:-translate-x-1" /> Volver
            </button>
          </Reveal>

          <div className="flex flex-wrap items-center gap-2">
            <span className="stamp border border-line-2 bg-ink-850 px-2.5 py-1 text-mist-300">{match.competition}</span>
            <span className="stamp border border-line-2 bg-ink-850 px-2.5 py-1 text-mist-400">{match.round}</span>
            {match.tags.map((t) => (
              <span key={t} className="stamp hidden border border-line bg-ink-850 px-2.5 py-1 text-mist-500 sm:inline-block">{t}</span>
            ))}
            {match.freeAccess && <span className="stamp border border-pitch-500/50 bg-pitch-500/10 px-2.5 py-1 text-pitch-300">Acceso libre completo</span>}
          </div>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:text-right">
              <TeamBadge team={match.home} size={72} />
              <div>
                <p className="font-display text-4xl font-extrabold uppercase leading-none tracking-wide text-mist-100 sm:text-5xl">{match.home.short}</p>
                <p className="stamp mt-2 text-mist-500">{match.home.manager} · {match.home.ranking}</p>
                <div className="mt-2 lg:justify-end"><FormDots form={match.homeAnalysis.form} size="sm" /></div>
              </div>
            </Reveal>

            <Reveal delay={100} className="text-center">
              {match.live ? (
                <div>
                  <p className="live-dot mx-auto mb-2 h-2.5 w-2.5 rounded-full bg-risk-500" />
                  <p className="font-display text-6xl font-extrabold text-mist-100">
                    {match.live.home}<span className="mx-2 text-mist-500">–</span>{match.live.away}
                  </p>
                  <p className="stamp mt-2 text-risk-300">En juego · minuto {match.live.minute}&#8242;</p>
                </div>
              ) : (
                <div>
                  <p className="font-display text-5xl font-extrabold text-mist-500 sm:text-6xl">VS</p>
                  <p className="stamp mt-2 flex items-center justify-center gap-2 text-mist-400">
                    <IconClock size={13} /> {match.dateLabel} · {match.time} h
                  </p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-center gap-2">
                <ConfidenceBadge level={match.conclusion.confidence} />
              </div>
            </Reveal>

            <Reveal delay={150} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start">
              <TeamBadge team={match.away} size={72} />
              <div>
                <p className="font-display text-4xl font-extrabold uppercase leading-none tracking-wide text-mist-100 sm:text-5xl">{match.away.short}</p>
                <p className="stamp mt-2 text-mist-500">{match.away.manager} · {match.away.ranking}</p>
                <div className="mt-2"><FormDots form={match.awayAnalysis.form} size="sm" /></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-[13px] text-mist-400">
                <span className="text-mist-200">{match.venue}</span> · Árbitro: {match.referee}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!user) {
                      toast("Crea una cuenta gratis para guardar análisis.", "warn");
                      navigate("/auth");
                      return;
                    }
                    toggleSave(match.id);
                  }}
                  className={`flex items-center gap-2 border px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                    saved ? "border-pitch-500 bg-pitch-500/15 text-pitch-300" : "border-line-2 text-mist-300 hover:border-pitch-500/60 hover:text-pitch-300"
                  }`}
                >
                  <IconBookmark size={15} /> {saved ? "Guardado" : "Guardar análisis"}
                </button>
                {locked && (
                  <Link to="/precios" className="flex items-center gap-2 bg-gold-400 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink-950 transition-colors hover:bg-gold-300">
                    <IconStar size={15} /> Desbloquear profundo
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ============ SUB-NAVEGACIÓN ============ */}
      <nav className="sticky top-[65px] z-40 border-b border-line bg-ink-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {SUBNAV.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="whitespace-nowrap px-3 py-1.5 font-display text-[13px] font-bold uppercase tracking-[0.12em] text-mist-400 transition-colors hover:bg-ink-800 hover:text-pitch-300"
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="relative mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:py-16">
        {/* ============ 1 · RESUMEN EJECUTIVO (público) ============ */}
        <Section id="resumen" stamp="01 · Lectura rápida" title="Resumen ejecutivo">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Reveal className="border border-line bg-ink-850 p-6">
              <ul className="space-y-4">
                {match.summary.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-mist-300">
                    <span className="font-display text-lg font-bold text-pitch-400">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-4">
              <div className="border border-line bg-ink-850 p-6">
                <p className="stamp mb-3 text-mist-500">Probabilidades 1X2 del modelo</p>
                {model1x2.outcomes.map((o, i) => (
                  <ProbBar key={o.label} label={o.label} prob={o.prob} odd={o.odd} tone={i === 0 ? "pitch" : i === 1 ? "mist" : "gold"} delay={i * 120} compact />
                ))}
              </div>
              <div className="border border-line bg-ink-850 p-6">
                <p className="stamp mb-2 text-mist-500">Nivel de confianza del análisis</p>
                <div className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-full ${conf.bg}`} />
                  <p className={`font-display text-2xl font-bold uppercase tracking-wide ${conf.color}`}>{conf.label}</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-mist-500">{conf.desc}</p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 2/3 · ANÁLISIS DE EQUIPOS ============ */}
        <TeamDeep match={match} side="home" locked={locked} />
        <TeamDeep match={match} side="away" locked={locked} />

        {/* ============ 4 · TÁCTICO ============ */}
        <Section id="tactico" stamp="05 · Pizarra" title="Análisis táctico del enfrentamiento">
          <Gate locked={locked} kind="premium" title="La pizarra completa" blurb="Guion del partido, las tres claves tácticas que lo decidirán y la proyección de marcador del modelo, con las formaciones previstas sobre el campo.">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <Reveal className="border border-line bg-ink-850 p-6">
                <p className="stamp mb-2 text-pitch-400">Guion proyectado</p>
                <p className="text-[14px] leading-relaxed text-mist-300">{match.tactics.overview}</p>
                <div className="mt-6 grid gap-4">
                  {match.tactics.keys.map((k, i) => (
                    <div key={k.title} className="border-l-2 border-gold-400 pl-4">
                      <p className="font-display text-lg font-bold uppercase tracking-wide text-mist-100">
                        <span className="mr-2 font-mono text-[12px] text-gold-300">CLAVE {i + 1}</span> {k.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-mist-400">{k.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border border-line-2 bg-ink-800 p-4">
                  <p className="stamp mb-1.5 flex items-center gap-2 text-mist-500"><IconWhistle size={14} /> Predicción del modelo</p>
                  <p className="text-[13.5px] italic leading-relaxed text-mist-300">{match.tactics.prediction}</p>
                </div>
              </Reveal>
              <Reveal delay={120} className="grid grid-cols-2 gap-4">
                <PitchFormation formation={match.formationHome} color={match.home.colors[0] === "#f2f2f2" ? "#e9c169" : match.home.colors[0]} label={match.home.code} />
                <PitchFormation formation={match.formationAway} color={match.away.colors[0]} label={match.away.code} mirrored />
              </Reveal>
            </div>
          </Gate>
        </Section>

        {/* ============ 5 · BAJAS Y ONCES ============ */}
        <Section id="bajas" stamp="06 · Partes médicos" title="Bajas y posibles alineaciones">
          <Gate locked={locked} kind="premium" title="Bajas, dudas y onces" blurb="Parte médico completo con estado Confirmado / Probable / Duda / Sanción y las alineaciones proyectadas por el modelo para ambos equipos.">
            <div className="grid gap-4 lg:grid-cols-2">
              <AbsenceTable title={`${match.home.name}`} rows={match.absencesHome} />
              <AbsenceTable title={`${match.away.name}`} rows={match.absencesAway} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {[{ t: match.home, l: match.lineupHome, f: match.formationHome }, { t: match.away, l: match.lineupAway, f: match.formationAway }].map(({ t, l, f }) => (
                <div key={t.code} className="border border-line bg-ink-850 p-6">
                  <p className="stamp mb-3 text-mist-500">Once proyectado · {t.code} ({f})</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                    {l.map((p, i) => (
                      <p key={p} className="flex items-center gap-2 text-[13px] text-mist-300">
                        <span className="font-mono text-[11px] text-mist-600">{String(i + 1).padStart(2, "0")}</span> {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Gate>
        </Section>

        {/* ============ 6 · MÉTRICAS ============ */}
        <Section id="metricas" stamp="07 · Datos duros" title="Métricas avanzadas">
          <div className="border border-line bg-ink-850">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line px-5 py-3">
              <p className="text-right font-display text-lg font-bold uppercase tracking-wide" style={{ color: match.home.colors[0] === "#f2f2f2" ? "#e9c169" : match.home.colors[0] }}>{match.home.code}</p>
              <p className="stamp text-mist-500">Últimos 10 partidos</p>
              <p className="font-display text-lg font-bold uppercase tracking-wide" style={{ color: match.away.colors[0] === "#f2f2f2" ? "#e9c169" : match.away.colors[0] }}>{match.away.code}</p>
            </div>
            <div className="divide-y divide-line">
              {metricsOpen.map((mt) => {
                const max = Math.max(mt.home, mt.away) || 1;
                const lower = LOWER_BETTER.includes(mt.label);
                const homeBetter = lower ? mt.home < mt.away : mt.home > mt.away;
                const awayBetter = lower ? mt.away < mt.home : mt.away > mt.home;
                return (
                  <div key={mt.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <span className={`font-mono text-sm ${homeBetter ? "font-semibold text-pitch-300" : "text-mist-300"}`}>{mt.home}{mt.unit === "%" ? "%" : ""}</span>
                      <span className="hidden h-[6px] w-24 overflow-hidden rounded-[2px] bg-ink-700 sm:block">
                        <span className={`bar-fill block h-full ${homeBetter ? "bg-pitch-500" : "bg-mist-600"}`} style={{ width: `${(mt.home / max) * 100}%`, marginLeft: "auto", transformOrigin: "right center" } as React.CSSProperties} />
                      </span>
                    </div>
                    <p className="min-w-[110px] text-center text-[12px] text-mist-400 sm:min-w-[180px]">
                      {mt.label} {mt.unit && mt.unit !== "%" ? <span className="text-mist-600">{mt.unit}</span> : null}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm ${awayBetter ? "font-semibold text-pitch-300" : "text-mist-300"}`}>{mt.away}{mt.unit === "%" ? "%" : ""}</span>
                      <span className="hidden h-[6px] w-24 overflow-hidden rounded-[2px] bg-ink-700 sm:block">
                        <span className={`bar-fill block h-full ${awayBetter ? "bg-pitch-500" : "bg-mist-600"}`} style={{ width: `${(mt.away / max) * 100}%` } as React.CSSProperties} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Gate locked={locked} kind="premium" title="El resto del panel métrico" blurb="Posesión, pase, PPDA, ABP y más de 6 métricas adicionales por equipo, ajustadas por rival y contexto.">
              <div className="divide-y divide-line">
                {metricsPremium.map((mt) => {
                  const max = Math.max(mt.home, mt.away) || 1;
                  const lower = LOWER_BETTER.includes(mt.label);
                  const homeBetter = lower ? mt.home < mt.away : mt.home > mt.away;
                  const awayBetter = lower ? mt.away < mt.home : mt.away > mt.home;
                  return (
                    <div key={mt.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`font-mono text-sm ${homeBetter ? "font-semibold text-pitch-300" : "text-mist-300"}`}>{mt.home}{mt.unit === "%" ? "%" : ""}</span>
                      </div>
                      <p className="min-w-[110px] text-center text-[12px] text-mist-400 sm:min-w-[180px]">{mt.label} {mt.unit && mt.unit !== "%" ? <span className="text-mist-600">{mt.unit}</span> : null}</p>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-sm ${awayBetter ? "font-semibold text-pitch-300" : "text-mist-300"}`}>{mt.away}{mt.unit === "%" ? "%" : ""}</span>
                      </div>
                      <span className="sr-only">{max}</span>
                    </div>
                  );
                })}
              </div>
            </Gate>
          </div>
        </Section>

        {/* ============ 7 · H2H (público) ============ */}
        <Section id="h2h" stamp="08 · Antecedentes" title="Enfrentamientos directos">
          <div className="border border-line bg-ink-850">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 border-b border-line px-5 py-3">
              <p className="text-right font-display text-base font-bold uppercase tracking-wide text-mist-200">{match.home.short}</p>
              <p className="stamp text-mist-500">Últimos 5</p>
              <p className="font-display text-base font-bold uppercase tracking-wide text-mist-200">{match.away.short}</p>
            </div>
            <div className="divide-y divide-line">
              {match.h2h.map((h) => (
                <Reveal key={h.date} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3.5">
                  <p className="text-right text-[12.5px] text-mist-400">{h.date} · {h.comp}</p>
                  <span
                    className={`min-w-[74px] border px-3 py-1 text-center font-display text-xl font-bold tracking-widest ${
                      h.result === "V" ? "border-pitch-500/50 bg-pitch-500/10 text-pitch-300" : h.result === "D" ? "border-risk-500/50 bg-risk-500/10 text-risk-300" : "border-gold-400/50 bg-gold-400/10 text-gold-300"
                    }`}
                  >
                    {h.score}
                  </span>
                  <p className="stamp text-mist-500">
                    {h.result === "V" ? `Gana ${match.home.code}` : h.result === "D" ? `Gana ${match.away.code}` : "Empate"}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ============ 8 · MODELO DE PROBABILIDADES ============ */}
        <Section id="modelo" stamp="09 · 20.000 simulaciones" title="Modelo de probabilidades">
          <div className="grid gap-4 md:grid-cols-2">
            {basicGroups.map((g) => {
              const Icon = MARKET_ICONS[g.icon];
              return (
                <Reveal key={g.market} className="border border-line bg-ink-850 p-5">
                  <p className="stamp mb-4 flex items-center gap-2 text-mist-300">
                    <Icon size={15} className="text-pitch-400" /> {g.market}
                    <span className="ml-auto border border-pitch-500/40 px-1.5 py-0.5 text-[9px] text-pitch-300">ABIERTO</span>
                  </p>
                  {g.outcomes.map((o, i) => (
                    <ProbBar key={o.label} label={o.label} prob={o.prob} odd={o.odd} tone="pitch" delay={i * 80} compact />
                  ))}
                </Reveal>
              );
            })}
          </div>
          <div className="mt-4">
            <Gate locked={locked} kind="premium" title="El modelo completo" blurb="Remates y tiros a puerta, córners totales y por equipo, tarjetas, dobles oportunidades y mercados especiales: la salida íntegra de las 20.000 simulaciones.">
              <div className="grid gap-4 md:grid-cols-2">
                {fullGroups.filter((g) => !g.basic).map((g) => {
                  const Icon = MARKET_ICONS[g.icon];
                  return (
                    <div key={g.market} className="border border-line bg-ink-850 p-5">
                      <p className="stamp mb-4 flex items-center gap-2 text-mist-300">
                        <Icon size={15} className="text-gold-300" /> {g.market}
                      </p>
                      {g.outcomes.map((o, i) => (
                        <ProbBar key={o.label} label={o.label} prob={o.prob} odd={o.odd} tone="gold" delay={i * 80} compact />
                      ))}
                    </div>
                  );
                })}
              </div>
              {/* marcadores */}
              <div className="mt-4 border border-line bg-ink-850 p-6">
                <p className="stamp mb-4 text-mist-300">Marcadores más probables</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {match.topScores.map((s, i) => (
                    <div key={s.score} className={`border p-4 text-center ${i === 0 ? "border-pitch-500/60 bg-pitch-500/10" : "border-line bg-ink-800"}`}>
                      <p className={`font-display text-3xl font-extrabold tracking-widest ${i === 0 ? "text-pitch-300" : "text-mist-100"}`}>{s.score}</p>
                      <p className="mt-1 font-mono text-[12px] text-mist-400">{s.prob}%</p>
                      {i === 0 && <p className="stamp mt-1 text-pitch-400">Modal</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Gate>
          </div>
        </Section>

        {/* ============ 9 · VALOR ============ */}
        <Section id="valor" stamp="10 · Radar de valor" title="Detección de valor">
          <Gate locked={locked} kind="premium" title="El radar de valor de este partido" blurb="Cada selección con edge positivo frente al mercado: cuota, probabilidad del modelo, ventaja porcentual y stake sugerido según varianza.">
            <div className="grid gap-3">
              {match.valuePicks.map((v, i) => (
                <Reveal key={v.pick} delay={i * 90} className="border border-gold-400/25 bg-ink-850 p-5 transition-colors hover:border-gold-400/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{v.pick}</p>
                      <p className="stamp mt-0.5 text-mist-500">{v.market} · stake sugerido {v.stake}</p>
                    </div>
                    <div className="flex items-center gap-6 font-mono">
                      <div className="text-right">
                        <p className="stamp text-mist-500">Cuota</p>
                        <p className="text-lg text-mist-100">{v.odd.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="stamp text-mist-500">Modelo</p>
                        <p className="text-lg text-mist-100">{v.prob}%</p>
                      </div>
                      <div className="border border-gold-400/50 bg-gold-400/10 px-3 py-1.5 text-right">
                        <p className="stamp text-gold-300">Edge</p>
                        <p className="text-lg font-semibold text-gold-300">+{v.edge.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Gate>
        </Section>

        {/* ============ 10 · RIESGOS ============ */}
        <Section id="riesgos" stamp="11 · Lo que puede romper el guion" title="Riesgos del análisis">
          <Gate locked={locked} kind="premium" title="Mapa de riesgos" blurb="Los escenarios que invalidarían la lectura: bajas de última hora, varianza emocional, arbitraje y factores de guion.">
            <div className="grid gap-3 sm:grid-cols-2">
              {match.risks.map((r, i) => (
                <Reveal key={i} delay={i * 80} className="flex gap-3 border border-line bg-ink-850 p-5">
                  <IconAlert size={18} className="mt-0.5 shrink-0 text-amberx-300" />
                  <p className="text-[13.5px] leading-relaxed text-mist-300">{r}</p>
                </Reveal>
              ))}
            </div>
          </Gate>
        </Section>

        {/* ============ 11 · CONCLUSIÓN ============ */}
        <Section id="conclusion" stamp="12 · Veredicto final" title="Conclusión y nivel de confianza">
          <Gate locked={locked} kind="premium" title="El veredicto del modelo" blurb="Conclusión completa con nivel de confianza, lecturas principales con cuota y gestión de stake recomendada.">
            <Reveal className={`relative overflow-hidden border p-6 sm:p-8 ${match.conclusion.confidence === "alta" ? "border-pitch-500/50" : match.conclusion.confidence === "media" ? "border-gold-400/50" : "border-amberx-400/50"}`}>
              <div className={`absolute inset-0 opacity-[0.06] ${conf.bg}`} aria-hidden />
              <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${conf.bg}`} aria-hidden />
                    <p className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">
                      Confianza <span className={conf.color}>{conf.label}</span>
                    </p>
                  </div>
                  <p className="text-[14.5px] leading-relaxed text-mist-200">{match.conclusion.verdict}</p>
                  <p className="stamp mt-5 flex items-center gap-2 text-mist-500">
                    <IconShield size={14} /> Gestión de banca sugerida: {match.conclusion.stake}
                  </p>
                </div>
                <div className="border border-line-2 bg-ink-900/70 p-5">
                  <p className="stamp mb-3 text-mist-500">Lecturas principales</p>
                  <div className="divide-y divide-line">
                    {match.conclusion.mainPicks.map((p, i) => (
                      <div key={p.label} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="flex items-center gap-3 text-[13.5px] text-mist-200">
                          <span className="font-display text-lg font-bold text-pitch-400">{i + 1}</span> {p.label}
                        </span>
                        <span className="font-mono text-[13px] text-mist-100">@{p.odd.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {match.freeAccess ? (
                    <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[12px] text-pitch-300">
                      <IconEye size={13} /> Este análisis completo es de acceso libre: así es la profundidad Premium.
                    </p>
                  ) : (
                    <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[12px] text-gold-300">
                      <IconStar size={13} /> Análisis profundo Premium · modelo v4.2
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          </Gate>
        </Section>

        {/* volver */}
        <Reveal className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link to="/partidos" className="group flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-mist-300 transition-colors hover:text-pitch-300">
            <IconArrow size={15} className="rotate-180 transition-transform group-hover:-translate-x-1" /> Volver a la cartelera
          </Link>
          <Link to="/valor" className="group flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-gold-300">
            Radar de valor del día <IconArrow size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
