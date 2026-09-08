import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { matches, MODEL_STATS } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { ConfidenceBadge, CountUp, MatchRow, ProbBar, Reveal, SectionHead, StatChip, TeamBadge } from "../components/ui";
import { IconArrow, IconChart, IconLayers, IconLock, IconRadar, IconShield, IconStar, IconTarget, IconWhistle } from "../components/icons";

function useCountdown(targetHour: number) {
  const target = useMemo(() => {
    const d = new Date();
    d.setHours(targetHour, 0, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return d.getTime();
  }, [targetHour]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

const PIPELINE = [
  { n: "01", icon: IconLayers, title: "Recolección de eventos", body: "Más de 12.000 eventos por jornada: tiros, presiones, duelos, ABP, sanciones y onces. Cada dato se normaliza contra el nivel de su liga durante 10 temporadas." },
  { n: "02", icon: IconChart, title: "xG contextual y estados de forma", body: "El xG se ajusta por rival, contexto (marcador, minuto, expulsiones) y bajas confirmadas. La forma reciente pesa con decaimiento exponencial de 10 partidos." },
  { n: "03", icon: IconRadar, title: "20.000 simulaciones Monte Carlo", body: "Cada partido se simula 20.000 veces con distribuciones Poisson–binomial acotadas por las métricas ajustadas. De ahí nacen todas las probabilidades del panel." },
  { n: "04", icon: IconTarget, title: "Calibración contra el mercado", body: "Comparamos nuestras probabilidades con las cuotas implícitas de 40 casas. La calibración se audita con Brier score y fiabilidad por mercado cada 24 horas." },
  { n: "05", icon: IconWhistle, title: "Valor, riesgo y staking", body: "Edge = probabilidad × cuota − 1. Solo publicamos selecciones con edge > 5% y varianza asumible, con stake 1–5 según el nivel de confianza del análisis." },
];

export default function Home() {
  const { isPremium, user } = useAuth();
  const featured = matches.find((m) => m.featured)!;
  const market1x2 = featured.markets.find((m) => m.icon === "result")!;
  const { h, m, s } = useCountdown(21);
  const topValue = useMemo(
    () =>
      matches
        .flatMap((mt) => mt.valuePicks.map((v) => ({ ...v, match: mt })))
        .sort((a, b) => b.edge - a.edge)
        .slice(0, 3),
    []
  );
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* ============ APERTURA: PARTIDO DEL DÍA ============ */}
      <section className="relative overflow-hidden border-b border-line">
        <img
          src="https://image.qwenlm.ai/generated-images/0a7d0d9e-30ec-425a-8695-f79131d90d07/_result.png"
          alt="Vista aérea de un estadio de fútbol iluminado de noche"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/88 to-ink-950/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" aria-hidden />
        <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />

        {/* radar decorativo */}
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-pitch-500/25" aria-hidden>
          <g className="radar-spin">
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
            <circle cx="100" cy="100" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <path d="M100 100 L100 4 A96 96 0 0 1 158 22 Z" fill="currentColor" opacity="0.35" />
          </g>
        </svg>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pb-24 lg:pt-16">
          <div>
            <Reveal>
              <p className="stamp mb-5 flex flex-wrap items-center gap-3 text-pitch-400">
                <span className="inline-flex items-center gap-2 border border-pitch-500/40 bg-pitch-500/10 px-2 py-1">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-pitch-400" /> Panel del día
                </span>
                <span className="text-mist-500">{today}</span>
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="stamp mb-3 text-mist-400">{featured.competition} — {featured.round}</p>
            </Reveal>

            <h1 className="font-display font-extrabold uppercase leading-[0.88] tracking-wide">
              <Reveal delay={120} className="mask-line text-[15vw] text-mist-100 sm:text-7xl lg:text-[84px]">
                <span>{featured.home.name}</span>
              </Reveal>
              <Reveal delay={220} className="mask-line text-[9vw] text-pitch-400 sm:text-5xl lg:text-6xl">
                <span>— contra —</span>
              </Reveal>
              <Reveal delay={320} className="mask-line text-[15vw] text-mist-100 sm:text-7xl lg:text-[84px]">
                <span>{featured.away.name}</span>
              </Reveal>
            </h1>

            <Reveal delay={380}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-mist-400">
                <span className="flex items-center gap-2"><TeamBadge team={featured.home} size={22} /> {featured.home.manager}</span>
                <span className="flex items-center gap-2"><TeamBadge team={featured.away} size={22} /> {featured.away.manager}</span>
                <span>{featured.venue}</span>
              </div>
            </Reveal>

            <Reveal delay={440}>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <div>
                  <p className="stamp mb-2 text-mist-500">Cuenta atrás · {featured.time} h</p>
                  <div className="flex items-center gap-2 font-mono">
                    {[
                      { v: h, l: "h" },
                      { v: m, l: "min" },
                      { v: s, l: "s" },
                    ].map((t, i) => (
                      <span key={t.l} className="flex items-center gap-2">
                        {i > 0 && <span className="text-2xl text-mist-600">:</span>}
                        <span className="flex h-16 w-16 flex-col items-center justify-center border border-line-2 bg-ink-900/80">
                          <span className="font-display text-3xl font-bold text-mist-100">{String(t.v).padStart(2, "0")}</span>
                          <span className="text-[10px] text-mist-500">{t.l}</span>
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/partido/${featured.id}`}
                    className="group flex items-center justify-between gap-6 bg-pitch-500 px-6 py-3.5 font-display text-base font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-pitch-400"
                  >
                    Abrir análisis completo
                    <IconArrow size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/partidos" className="group flex items-center justify-between gap-6 border border-line-2 px-6 py-3 font-display text-base font-bold uppercase tracking-[0.14em] text-mist-200 transition-colors hover:border-pitch-500/60 hover:text-pitch-300">
                    Ver cartelera completa <IconArrow size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* panel del modelo */}
          <Reveal delay={300}>
            <div className="float-slow border border-line-2 bg-ink-900/85 p-6 shadow-[0_36px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="stamp text-mist-400">Lectura del modelo v4.2</p>
                <ConfidenceBadge level={featured.conclusion.confidence} />
              </div>
              {market1x2.outcomes.map((o, i) => (
                <ProbBar key={o.label} label={o.label} prob={o.prob} odd={o.odd} tone={i === 0 ? "pitch" : i === 1 ? "mist" : "gold"} delay={i * 140} />
              ))}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
                <div>
                  <p className="stamp mb-1 text-mist-500">Más de 2.5 goles</p>
                  <p className="font-mono text-xl text-mist-100">68% <span className="text-[13px] text-mist-500">@1.62</span></p>
                </div>
                <div>
                  <p className="stamp mb-1 text-mist-500">Edge detectado</p>
                  <p className="font-mono text-xl text-gold-300">+10.2%</p>
                </div>
              </div>
              <p className="mt-5 border-l-2 border-pitch-500 pl-3 text-[13px] italic leading-relaxed text-mist-400">
                «Eliminatoria abierta, dos ataques de élite y dos porterías mermadas: la ventaja está en los goles, no en el signo.»
              </p>
              {!user && (
                <p className="mt-4 flex items-center gap-2 text-[12px] text-mist-500">
                  <IconLock size={13} /> El análisis profundo requiere cuenta · el resumen es público
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CARTELERA DEL DÍA ============ */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHead
          stamp="Cartelera · 7 partidos analizados"
          title="La pizarra de hoy"
          right={
            <Link to="/partidos" className="link-line hidden items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-pitch-300 sm:flex">
              Todos los filtros <IconArrow size={15} />
            </Link>
          }
        />
        <div className="grid gap-3">
          {matches.map((m, i) => (
            <MatchRow key={m.id} match={m} index={i} />
          ))}
        </div>
        <Reveal delay={120}>
          <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-mist-500">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-pitch-500" /> Confianza alta</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /> Media</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amberx-400" /> Baja</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-risk-500" /> No recomendable</span>
            <span className="flex items-center gap-2"><IconLock size={12} /> Análisis profundo reservado a Premium</span>
          </p>
        </Reveal>
      </section>

      {/* ============ PIPELINE DEL MODELO ============ */}
      <section className="border-y border-line bg-ink-900">
        <div className="bg-chalk relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionHead stamp="Metodología en 5 pasos" title="Cómo lee el modelo un partido" />
          <div className="grid gap-0">
            {PIPELINE.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="group grid gap-4 border-t border-line py-6 transition-colors last:border-b hover:bg-ink-850/60 md:grid-cols-[90px_56px_1fr] md:items-start md:gap-8 md:px-4">
                  <span className="font-display text-5xl font-extrabold text-ink-600 transition-colors duration-300 group-hover:text-pitch-500">{step.n}</span>
                  <span className="hidden h-11 w-11 items-center justify-center border border-line-2 text-mist-400 transition-colors duration-300 group-hover:border-pitch-500/60 group-hover:text-pitch-300 md:flex">
                    <step.icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-mist-100">{step.title}</h3>
                    <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-mist-400">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MODEL_STATS.map((st) => (
                <StatChip
                  key={st.label}
                  label={st.label}
                  value={<CountUp value={st.value} decimals={st.value < 1 ? 3 : 0} />}
                  tone="pitch"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ VALOR DEL DÍA ============ */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead stamp="Radar de valor" title="Las tres mejores ventajas de la jornada" />
            <Reveal>
              <p className="max-w-md text-[14px] leading-relaxed text-mist-400">
                Cada noche el modelo compara sus probabilidades con las cuotas del mercado y publica solo las selecciones con <strong className="text-mist-100">edge superior al 5%</strong> y varianza asumible. Esta es la cima del radar de hoy.
              </p>
              <p className="mt-4 font-mono text-[13px] text-pitch-300">Edge = Probabilidad × Cuota − 1</p>
              <Link to="/valor" className="group mt-7 inline-flex items-center gap-3 bg-gold-400 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-gold-300">
                Abrir radar completo <IconArrow size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-3">
            {topValue.map((v, i) => {
              const locked = !isPremium && i > 0;
              return (
                <Reveal key={`${v.match.id}-${v.pick}`} delay={i * 100}>
                  <div className={`relative border border-line bg-ink-850 p-5 transition-colors hover:border-gold-400/40 ${locked ? "" : "lift"}`}>
                    <div className={locked ? "locked-blur" : ""} aria-hidden={locked}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{v.pick}</p>
                        <span className="font-mono text-lg text-gold-300">+{v.edge.toFixed(1)}% edge</span>
                      </div>
                      <p className="stamp mt-1 text-mist-500">
                        {v.match.home.code}–{v.match.away.code} · {v.market} · cuota {v.odd.toFixed(2)} · prob. modelo {v.prob}% · stake {v.stake}
                      </p>
                    </div>
                    {locked && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <span className="flex items-center gap-2 border border-gold-400/40 bg-ink-900/95 px-4 py-2 text-[13px] text-gold-300">
                          <IconLock size={14} /> Exclusivo Premium
                        </span>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PLANES ============ */}
      <section className="border-t border-line bg-ink-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <div className="flex h-full flex-col border border-line bg-ink-850 p-7">
              <p className="stamp text-mist-500">Plan</p>
              <h3 className="mt-1 font-display text-4xl font-bold uppercase tracking-wide text-mist-100">Gratuito</h3>
              <p className="mt-3 font-mono text-2xl text-mist-200">0 € <span className="text-[13px] text-mist-500">/ para siempre</span></p>
              <ul className="mt-5 space-y-2 text-[13.5px] text-mist-400">
                {["Cartelera y resúmenes ejecutivos", "Probabilidades 1X2, Over/Under y BTTS", "Análisis completos de acceso libre", "Panel personal con guardados e historial"].map((f) => (
                  <li key={f} className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" /> {f}</li>
                ))}
              </ul>
              <Link to="/auth?modo=registro" className="mt-auto border border-line-2 px-5 py-3 pt-3 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-mist-200 transition-colors hover:border-pitch-500 hover:text-pitch-300">
                Crear cuenta gratis
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative flex h-full flex-col border border-gold-400/50 bg-ink-850 p-7 shadow-[0_0_60px_-20px_rgba(233,193,105,0.25)]">
              <span className="absolute -top-3 left-6 bg-gold-400 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-950">Recomendado</span>
              <p className="stamp text-gold-300">Plan</p>
              <h3 className="mt-1 flex items-center gap-2 font-display text-4xl font-bold uppercase tracking-wide text-mist-100">
                Premium <IconStar size={20} className="text-gold-300" />
              </h3>
              <p className="mt-3 font-mono text-2xl text-mist-200">9,99 € <span className="text-[13px] text-mist-500">/ mes · cancela cuando quieras</span></p>
              <ul className="mt-5 space-y-2 text-[13.5px] text-mist-300">
                {["Todo lo del plan Gratuito", "Análisis profundos de TODOS los partidos", "Radar de valor completo con stakes", "Modelo de córners, tarjetas y remates", "Alineaciones probables y bajas al minuto", "Soporte prioritario del equipo de análisis"].map((f) => (
                  <li key={f} className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" /> {f}</li>
                ))}
              </ul>
              <Link to="/precios" className="mt-auto bg-gold-400 px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-gold-300">
                Ver planes y comparar
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BANDA RESPONSABLE ============ */}
      <section className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Reveal className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-risk-500/50 font-display text-lg font-bold text-risk-300">+18</span>
            <p className="max-w-2xl text-[13px] leading-relaxed text-mist-500">
              <strong className="text-mist-200">El análisis deportivo no garantiza ganancias.</strong> Pizarra Analytics publica estimaciones estadísticas con fines informativos. Si apuestas, hazlo con responsabilidad: define un bankroll, respeta los stakes y nunca persigas pérdidas.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Link to="/legal/responsabilidad" className="link-line flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-mist-300">
              <IconShield size={16} /> Juego responsable
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
