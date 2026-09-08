import { useMemo, useState } from "react";
import { matches } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { MatchRow, Reveal, SectionHead } from "../components/ui";
import { IconEye, IconLock, IconStar } from "../components/icons";

type Filter = "todos" | "valor" | "libres";

export default function Matches() {
  const { isPremium } = useAuth();
  const [comp, setComp] = useState<string>("Todas");
  const [filter, setFilter] = useState<Filter>("todos");

  const competitions = useMemo(() => ["Todas", ...Array.from(new Set(matches.map((m) => m.competition)))], []);

  const list = useMemo(() => {
    return matches.filter((m) => {
      if (comp !== "Todas" && m.competition !== comp) return false;
      if (filter === "valor" && m.valuePicks.length === 0) return false;
      if (filter === "libres" && !(m.freeAccess || isPremium)) return false;
      return true;
    });
  }, [comp, filter, isPremium]);

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[420px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHead
          stamp={`Análisis del día · ${matches.length} partidos`}
          title="Cartelera y análisis"
          right={
            <p className="max-w-xs text-[13px] leading-relaxed text-mist-500">
              Resúmenes y probabilidades básicas abiertos a todo el mundo. El análisis profundo se desbloquea según tu plan.
            </p>
          }
        />

        {/* filtros */}
        <Reveal>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {competitions.map((c) => (
                <button
                  key={c}
                  onClick={() => setComp(c)}
                  className={`border px-3.5 py-1.5 font-display text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                    comp === c ? "border-pitch-500 bg-pitch-500/15 text-pitch-300" : "border-line bg-ink-850 text-mist-400 hover:border-line-2 hover:text-mist-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(filter === "valor" ? "todos" : "valor")}
                className={`flex items-center gap-2 border px-3.5 py-1.5 font-display text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                  filter === "valor" ? "border-gold-400 bg-gold-400/15 text-gold-300" : "border-line bg-ink-850 text-mist-400 hover:border-line-2 hover:text-mist-200"
                }`}
              >
                <IconStar size={13} /> Solo con valor
              </button>
              <button
                onClick={() => setFilter(filter === "libres" ? "todos" : "libres")}
                className={`flex items-center gap-2 border px-3.5 py-1.5 font-display text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                  filter === "libres" ? "border-pitch-500 bg-pitch-500/15 text-pitch-300" : "border-line bg-ink-850 text-mist-400 hover:border-line-2 hover:text-mist-200"
                }`}
              >
                <IconEye size={13} /> Acceso completo para mí
              </button>
            </div>
          </div>
        </Reveal>

        {/* resultados */}
        <div className="grid gap-3">
          {list.map((m, i) => (
            <MatchRow key={m.id} match={m} index={i} />
          ))}
          {list.length === 0 && (
            <Reveal>
              <div className="border border-dashed border-line-2 bg-ink-850 p-10 text-center">
                <p className="font-display text-2xl font-bold uppercase tracking-wide text-mist-200">Sin resultados con estos filtros</p>
                <p className="mt-2 text-[13px] text-mist-500">Prueba otra competición o desactiva los filtros especiales.</p>
              </div>
            </Reveal>
          )}
        </div>

        {/* leyenda */}
        <Reveal delay={100}>
          <div className="mt-10 grid gap-4 border border-line bg-ink-850 p-6 sm:grid-cols-3">
            <div>
              <p className="stamp mb-2 text-pitch-400">Qué ves según tu plan</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                <strong className="text-mist-100">Invitados y plan Gratuito:</strong> cabecera, resumen ejecutivo, 1X2, goles y BTTS, H2H y métricas básicas.
              </p>
            </div>
            <div>
              <p className="stamp mb-2 text-gold-300">Capa Premium</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                <strong className="text-mist-100">Plan Premium:</strong> análisis de equipos, táctico, bajas y onces, modelo completo de mercados, valor, riesgos y conclusión.
              </p>
            </div>
            <div>
              <p className="stamp mb-2 text-mist-400">Acceso libre</p>
              <p className="text-[13px] leading-relaxed text-mist-400">
                Cada jornada abrimos <strong className="text-mist-100">un análisis completo</strong> a todos los usuarios registrados para que pruebes la profundidad Premium.
              </p>
            </div>
          </div>
        </Reveal>

        {!isPremium && (
          <Reveal delay={160}>
            <div className="mt-6 flex flex-col items-start justify-between gap-4 border border-gold-400/40 bg-gold-400/5 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <IconLock size={26} className="text-gold-300" />
                <div>
                  <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">Hay {matches.filter((m) => !m.freeAccess).length} análisis profundos cerrados para tu plan</p>
                  <p className="text-[13px] text-mist-400">Desbloquéalos todos con Premium: 9,99 €/mes, cancelable al instante.</p>
                </div>
              </div>
              <a href="#/precios" className="shrink-0 bg-gold-400 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-gold-300">
                Ver planes
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
