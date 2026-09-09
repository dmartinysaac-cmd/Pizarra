import { useEffect, useState } from "react";
import { fetchMatchesFromFootballData } from "../services/footballData";
import { fetchMatchesFromApiFootball } from "../services/apiFootball";
import type { LiveMatch, DataSource } from "../services/types";
import { Reveal, SectionHead } from "../components/ui";

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Programado",
  LIVE: "EN VIVO",
  IN_PLAY: "EN VIVO",
  PAUSED: "Descanso",
  FINISHED: "Finalizado",
  POSTPONED: "Aplazado",
  CANCELLED: "Cancelado",
};

export default function Live() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>("football-data");

  async function load(src: DataSource) {
    setLoading(true);
    setError(null);
    setSource(src);

    try {
      let data: LiveMatch[] = [];

      if (src === "football-data") {
        const token = import.meta.env.VITE_FOOTBALL_DATA_TOKEN as string;
        if (!token) {
          setError("Falta VITE_FOOTBALL_DATA_TOKEN en el archivo .env");
          setLoading(false);
          return;
        }
        data = await fetchMatchesFromFootballData(token);
      } else if (src === "api-football") {
        const key = import.meta.env.VITE_API_FOOTBALL_KEY as string;
        if (!key) {
          setError("Falta VITE_API_FOOTBALL_KEY en el archivo .env");
          setLoading(false);
          return;
        }
        data = await fetchMatchesFromApiFootball(key);
      }

      setMatches(data);
      if (data.length === 0) {
        setError("No se encontraron partidos para hoy. Prueba otra fuente o revisa las claves.");
      }
    } catch (err: any) {
      setError(err?.message || "Error al cargar partidos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("football-data");
  }, []);

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[420px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHead
          stamp="Partidos reales · En vivo y programados"
          title="Cartelera en vivo"
          right={
            <p className="max-w-xs text-[13px] leading-relaxed text-mist-500">
              Datos reales desde football-data.org y API-Football. Actualiza para ver el estado más reciente.
            </p>
          }
        />

        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => load("football-data")}
              className={`border px-4 py-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] transition-all ${
                source === "football-data"
                  ? "border-pitch-500 bg-pitch-500/15 text-pitch-300"
                  : "border-line bg-ink-850 text-mist-400 hover:border-line-2"
              }`}
            >
              football-data.org
            </button>
            <button
              onClick={() => load("api-football")}
              className={`border px-4 py-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] transition-all ${
                source === "api-football"
                  ? "border-pitch-500 bg-pitch-500/15 text-pitch-300"
                  : "border-line bg-ink-850 text-mist-400 hover:border-line-2"
              }`}
            >
              API-Football
            </button>
            <button
              onClick={() => load(source)}
              className="border border-line bg-ink-850 px-4 py-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-mist-400 hover:border-pitch-500/50 hover:text-pitch-300"
            >
              Actualizar
            </button>
          </div>
        </Reveal>

        {loading && (
          <p className="py-20 text-center font-display text-xl text-mist-400">Cargando partidos reales…</p>
        )}

        {error && !loading && (
          <div className="border border-risk-500/40 bg-risk-500/10 p-6 text-center">
            <p className="font-display text-lg text-risk-300">{error}</p>
            <p className="mt-2 text-[13px] text-mist-500">
              Asegúrate de tener el archivo <code className="text-mist-300">.env</code> en la raíz del proyecto con tus claves.
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid gap-3">
            {matches.map((m, i) => {
              const isLive = m.status === "LIVE" || m.status === "IN_PLAY" || m.status === "PAUSED";
              return (
                <Reveal key={m.id} delay={i * 40}>
                  <div className="border border-line bg-ink-850 p-4 transition-colors hover:border-line-2 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="stamp border border-line-2 bg-ink-900 px-2 py-0.5 text-mist-400">{m.competition}</span>
                        <span className="stamp text-mist-500">{m.round}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLive && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-risk-300">
                            <span className="live-dot h-1.5 w-1.5 rounded-full bg-risk-500" />
                            {STATUS_LABEL[m.status]}
                            {m.minute != null && ` ${m.minute}'`}
                          </span>
                        )}
                        {!isLive && (
                          <span className="stamp text-mist-500">
                            {m.dateLabel} · {m.time}h · {STATUS_LABEL[m.status] || m.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                      <div className="flex items-center gap-3 justify-self-end text-right">
                        <div>
                          <p className="font-display text-lg font-bold uppercase tracking-wide text-mist-100 sm:text-xl">{m.home.short}</p>
                          <p className="stamp text-mist-500">{m.home.code}</p>
                        </div>
                        {m.home.crest && (
                          <img src={m.home.crest} alt="" className="h-9 w-9 object-contain" />
                        )}
                      </div>

                      <div className="text-center">
                        {m.score ? (
                          <p className="font-display text-3xl font-extrabold text-mist-100">
                            {m.score.home} <span className="text-mist-500">–</span> {m.score.away}
                          </p>
                        ) : (
                          <p className="font-display text-2xl font-bold text-mist-500">VS</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {m.away.crest && (
                          <img src={m.away.crest} alt="" className="h-9 w-9 object-contain" />
                        )}
                        <div>
                          <p className="font-display text-lg font-bold uppercase tracking-wide text-mist-100 sm:text-xl">{m.away.short}</p>
                          <p className="stamp text-mist-500">{m.away.code}</p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 stamp text-mist-600">{m.venue}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
