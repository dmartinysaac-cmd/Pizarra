import { useMemo } from "react";
import { Link } from "react-router-dom";
import { matches } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { Gate, Reveal, SectionHead, TeamBadge } from "../components/ui";
import { IconArrow, IconRadar, IconStar } from "../components/icons";

export default function Value() {
  const { isPremium } = useAuth();

  const picks = useMemo(
    () =>
      matches
        .flatMap((m) => m.valuePicks.map((v) => ({ ...v, match: m })))
        .sort((a, b) => b.edge - a.edge),
    []
  );

  const open = picks.slice(0, 2);
  const locked = picks.slice(2);
  const avgEdge = picks.reduce((s, p) => s + p.edge, 0) / picks.length;
  const topEdge = picks[0];

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[420px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHead
          stamp={`Radar de valor · ${picks.length} selecciones activas`}
          title="Mejores oportunidades del día"
          right={
            <div className="flex gap-3">
              <div className="border border-gold-400/40 bg-gold-400/5 px-4 py-2 text-center">
                <p className="font-mono text-xl text-gold-300">+{avgEdge.toFixed(1)}%</p>
                <p className="stamp text-mist-500">edge medio</p>
              </div>
              <div className="border border-pitch-500/40 bg-pitch-500/5 px-4 py-2 text-center">
                <p className="font-mono text-xl text-pitch-300">{topEdge.match.home.code}–{topEdge.match.away.code}</p>
                <p className="stamp text-mist-500">mejor ventaja</p>
              </div>
            </div>
          }
        />

        <Reveal>
          <p className="mb-8 max-w-3xl text-[14px] leading-relaxed text-mist-400">
            Solo publicamos selecciones con <strong className="text-mist-100">edge superior al 5%</strong> sobre la cuota de mercado y varianza asumible. Cada línea incluye la probabilidad del modelo, la cuota de referencia y el stake sugerido en escala 1–5. Ordenadas de mayor a menor ventaja.
          </p>
        </Reveal>

        {/* tabla de valor */}
        <div className="space-y-3">
          {open.map((p, i) => (
            <Reveal key={`${p.match.id}-${p.pick}`} delay={i * 90}>
              <div className="group grid gap-4 border border-line bg-ink-850 p-5 transition-all duration-300 hover:border-gold-400/50 hover:bg-ink-800 lg:grid-cols-[auto_1fr_repeat(4,minmax(90px,auto))_auto] lg:items-center">
                <span className="font-display text-4xl font-extrabold text-ink-600 transition-colors group-hover:text-gold-400">#{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{p.pick}</p>
                  <Link to={`/partido/${p.match.id}`} className="link-line mt-1 inline-flex items-center gap-2 text-[12.5px] text-mist-400 hover:text-pitch-300">
                    <TeamBadge team={p.match.home} size={18} />
                    <TeamBadge team={p.match.away} size={18} />
                    {p.match.home.short} – {p.match.away.short} · {p.market} · {p.match.time} h
                  </Link>
                </div>
                <div><p className="stamp text-mist-500">Cuota</p><p className="font-mono text-lg text-mist-100">{p.odd.toFixed(2)}</p></div>
                <div><p className="stamp text-mist-500">Modelo</p><p className="font-mono text-lg text-mist-100">{p.prob}%</p></div>
                <div>
                  <p className="stamp text-mist-500">Edge</p>
                  <div className="mt-1 h-[7px] w-24 overflow-hidden rounded-[3px] bg-ink-700">
                    <div className="bar-fill h-full bg-gold-400" style={{ width: `${Math.min(100, p.edge * 6)}%` }} />
                  </div>
                  <p className="mt-0.5 font-mono text-[13px] font-semibold text-gold-300">+{p.edge.toFixed(1)}%</p>
                </div>
                <div><p className="stamp text-mist-500">Stake</p><p className="font-mono text-lg text-pitch-300">{p.stake}</p></div>
                <Link to={`/partido/${p.match.id}`} className="flex h-10 w-10 items-center justify-center self-start border border-line text-mist-400 transition-all group-hover:border-gold-400 group-hover:text-gold-300 lg:self-center" aria-label="Abrir análisis">
                  <IconArrow size={16} />
                </Link>
              </div>
            </Reveal>
          ))}

          <Gate
            locked={!isPremium}
            kind="premium"
            title={`${locked.length} oportunidades más en el radar`}
            blurb="El radar completo muestra todas las selecciones con edge positivo de la jornada, ordenadas por ventaja, con stake sugerido y enlace directo a cada análisis profundo."
          >
            <div className="space-y-3">
              {locked.map((p, i) => (
                <div key={`${p.match.id}-${p.pick}`} className="grid gap-4 border border-line bg-ink-850 p-5 lg:grid-cols-[auto_1fr_repeat(4,minmax(90px,auto))_auto] lg:items-center">
                  <span className="font-display text-4xl font-extrabold text-ink-600">#{open.length + i + 1}</span>
                  <div className="min-w-0">
                    <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{p.pick}</p>
                    <p className="mt-1 flex items-center gap-2 text-[12.5px] text-mist-400">
                      <TeamBadge team={p.match.home} size={18} />
                      <TeamBadge team={p.match.away} size={18} />
                      {p.match.home.short} – {p.match.away.short} · {p.market} · {p.match.time} h
                    </p>
                  </div>
                  <div><p className="stamp text-mist-500">Cuota</p><p className="font-mono text-lg text-mist-100">{p.odd.toFixed(2)}</p></div>
                  <div><p className="stamp text-mist-500">Modelo</p><p className="font-mono text-lg text-mist-100">{p.prob}%</p></div>
                  <div><p className="stamp text-mist-500">Edge</p><p className="font-mono text-lg font-semibold text-gold-300">+{p.edge.toFixed(1)}%</p></div>
                  <div><p className="stamp text-mist-500">Stake</p><p className="font-mono text-lg text-pitch-300">{p.stake}</p></div>
                  <Link to={`/partido/${p.match.id}`} className="flex h-10 w-10 items-center justify-center border border-line text-mist-400 lg:self-center" aria-label="Abrir análisis">
                    <IconArrow size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </Gate>
        </div>

        {/* guía de stakes */}
        <Reveal delay={120}>
          <div className="mt-10 grid gap-4 border border-line bg-ink-850 p-6 sm:grid-cols-3">
            <div>
              <p className="stamp mb-2 flex items-center gap-2 text-pitch-400"><IconRadar size={14} /> Criterio de publicación</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                Edge mínimo del 5% sobre cuota de cierre estimada, probabilidad del modelo superior al 35% y contraste con al menos dos familias de métricas (xG, forma, bajas).
              </p>
            </div>
            <div>
              <p className="stamp mb-2 flex items-center gap-2 text-gold-300"><IconStar size={14} /> Escala de stake</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                <strong className="text-mist-100">1/5</strong> varianza alta o mercado secundario · <strong className="text-mist-100">2–3/5</strong> lectura estándar · <strong className="text-mist-100">4–5/5</strong> convergencia total de señales. Nunca más del 5% de banca por entrada.
              </p>
            </div>
            <div>
              <p className="stamp mb-2 text-mist-400">Recordatorio</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                El valor es una esperanza matemática a largo plazo: una selección con edge puede perderse hoy y seguir siendo una buena decisión en 1.000 repeticiones.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
