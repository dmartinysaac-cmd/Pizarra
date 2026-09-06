import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMatch } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { ConfidenceDot, Reveal, Sparkline, StatChip, TeamBadge } from "../components/ui";
import { IconArrow, IconBookmark, IconChart, IconClock, IconClose, IconStar, IconTrend, IconUser } from "../components/icons";

const ROI_MONTHLY = [1.2, -0.8, 2.4, 1.1, -1.6, 3.2, 0.9, 2.2, -0.4, 2.8, 1.7, 3.4];
const ROI_LABELS = ["Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb"];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora mismo";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

export default function Dashboard() {
  const { user, isPremium, upgrade, cancelPremium, saved, toggleSave, history, visits } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = React.useState<null | "upgrade" | "cancel">(null);

  useEffect(() => {
    if (!user) navigate("/auth", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const savedMatches = saved.map(getMatch).filter(Boolean);
  const historyItems = history.map((h) => ({ ...h, match: getMatch(h.id) })).filter((h) => h.match);

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[380px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* cabecera */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="stamp mb-2 flex items-center gap-2 text-pitch-400">
                <span className="inline-block h-px w-8 bg-pitch-500" /> Zona privada
              </p>
              <h1 className="font-display text-5xl font-extrabold uppercase leading-none tracking-wide text-mist-100 sm:text-6xl">
                Hola, <span className="text-pitch-300">{user.name.split(" ")[0]}</span>
              </h1>
              <p className="mt-2 text-[13.5px] text-mist-400">Socio desde el {new Date(user.since + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} · {user.email}</p>
            </div>
            <div className={`flex items-center gap-3 border px-5 py-3.5 ${isPremium ? "border-gold-400/60 bg-gold-400/10" : "border-line bg-ink-850"}`}>
              {isPremium ? <IconStar size={22} className="text-gold-300" /> : <IconUser size={22} className="text-mist-400" />}
              <div>
                <p className={`font-display text-xl font-bold uppercase tracking-wide ${isPremium ? "text-gold-300" : "text-mist-100"}`}>Plan {isPremium ? "Premium" : "Gratuito"}</p>
                <p className="stamp text-mist-500">{isPremium ? "Análisis profundos desbloqueados" : "Acceso básico activo"}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* métricas rápidas */}
        <Reveal delay={100}>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatChip label="Análisis guardados" value={saved.length} tone="pitch" />
            <StatChip label="Fichas consultadas" value={history.length} />
            <StatChip label="Consultas totales" value={visits} />
            <StatChip label="Yield del modelo · 12 m" value={<span>+11,4%</span>} tone="gold" />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            {/* guardados */}
            <section>
              <Reveal className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">Análisis guardados</h2>
                <Link to="/partidos" className="link-line font-display text-sm font-bold uppercase tracking-[0.14em] text-pitch-300">Cartelera</Link>
              </Reveal>
              {savedMatches.length === 0 ? (
                <Reveal>
                  <div className="border border-dashed border-line-2 bg-ink-850 p-10 text-center">
                    <IconBookmark size={28} className="mx-auto mb-3 text-mist-600" />
                    <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-200">Aún no has guardado análisis</p>
                    <p className="mx-auto mt-2 max-w-md text-[13px] text-mist-500">
                      Abre cualquier ficha de la cartelera y pulsa «Guardar análisis» para tenerla siempre a mano en tu panel.
                    </p>
                    <Link to="/partidos" className="mt-5 inline-block bg-pitch-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950">
                      Explorar partidos
                    </Link>
                  </div>
                </Reveal>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {savedMatches.map((m) => (
                    <Reveal key={m!.id} className="group relative border border-line bg-ink-850 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pitch-500/50">
                      <button
                        onClick={() => toggleSave(m!.id)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-line text-mist-500 transition-colors hover:border-risk-500/60 hover:text-risk-300"
                        aria-label="Quitar de guardados"
                      >
                        <IconClose size={14} />
                      </button>
                      <div className="flex items-center gap-2.5">
                        <TeamBadge team={m!.home} size={30} />
                        <TeamBadge team={m!.away} size={30} />
                        <ConfidenceDot level={m!.conclusion.confidence} />
                      </div>
                      <p className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-mist-100">
                        {m!.home.short} <span className="text-mist-500">vs</span> {m!.away.short}
                      </p>
                      <p className="stamp mt-1 text-mist-500">{m!.competition} · {m!.time} h</p>
                      <Link to={`/partido/${m!.id}`} className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-pitch-300">
                        Abrir ficha <IconArrow size={14} />
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </section>

            {/* historial */}
            <section>
              <Reveal className="mb-4">
                <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">Historial de consultas</h2>
              </Reveal>
              {historyItems.length === 0 ? (
                <Reveal>
                  <p className="border border-dashed border-line-2 bg-ink-850 p-6 text-[13px] text-mist-500">
                    Todavía no has abierto ninguna ficha. Tu actividad aparecerá aquí.
                  </p>
                </Reveal>
              ) : (
                <div className="divide-y divide-line border border-line bg-ink-850">
                  {historyItems.map((h) => (
                    <Link key={h.id + h.at} to={`/partido/${h.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-ink-800">
                      <span className="flex items-center gap-3">
                        <TeamBadge team={h.match!.home} size={26} />
                        <TeamBadge team={h.match!.away} size={26} />
                        <span className="text-[13.5px] text-mist-200">
                          {h.match!.home.short} vs {h.match!.away.short}
                          <span className="stamp ml-2 text-mist-500">{h.match!.compShort}</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[12px] text-mist-500">
                        <IconClock size={13} /> {timeAgo(h.at)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* columna derecha */}
          <div className="space-y-6">
            {/* plan */}
            <Reveal>
              <div className={`border p-6 ${isPremium ? "border-gold-400/50 bg-gold-400/5" : "border-line bg-ink-850"}`}>
                <p className="stamp mb-2 text-mist-500">Tu suscripción</p>
                {isPremium ? (
                  <>
                    <p className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide text-gold-300">
                      <IconStar size={18} /> Premium activo
                    </p>
                    <ul className="mt-4 space-y-1.5 text-[13px] text-mist-300">
                      <li>· Análisis profundos de todos los partidos</li>
                      <li>· Radar de valor completo con stakes</li>
                      <li>· Modelo de córners, tarjetas y remates</li>
                      <li>· Bajas y onces al minuto</li>
                    </ul>
                    <button
                      onClick={() => setConfirming("cancel")}
                      className="mt-5 w-full border border-line-2 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-mist-400 transition-colors hover:border-risk-500/60 hover:text-risk-300"
                    >
                      Cancelar Premium
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl font-bold uppercase tracking-wide text-mist-100">Plan Gratuito</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-mist-400">
                      Estás viendo resúmenes y mercados básicos. Hay <strong className="text-gold-300">6 análisis profundos</strong> y el radar de valor completo esperándote en Premium.
                    </p>
                    <button
                      onClick={() => setConfirming("upgrade")}
                      className="mt-5 w-full bg-gold-400 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-gold-300"
                    >
                      Activar Premium · 9,99 €/mes
                    </button>
                  </>
                )}
              </div>
            </Reveal>

            {/* rendimiento del modelo */}
            <Reveal delay={100}>
              <div className="border border-line bg-ink-850 p-6">
                <p className="stamp mb-1 flex items-center gap-2 text-mist-500"><IconTrend size={14} /> Rendimiento del modelo · yield mensual (%)</p>
                <p className="font-display text-4xl font-extrabold text-pitch-300">+11,4%</p>
                <Sparkline points={ROI_MONTHLY} className="mt-3 h-20 w-full" />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-mist-600">
                  {ROI_LABELS.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
                <p className="mt-4 border-t border-line pt-3 text-[12px] leading-relaxed text-mist-500">
                  Yield calculado sobre stakes planos del modelo en los últimos 12 meses. Rentabilidades pasadas no garantizan rentabilidades futuras.
                </p>
              </div>
            </Reveal>

            {/* cuenta */}
            <Reveal delay={160}>
              <div className="border border-line bg-ink-850 p-6">
                <p className="stamp mb-3 flex items-center gap-2 text-mist-500"><IconUser size={14} /> Cuenta</p>
                <div className="space-y-2 text-[13px]">
                  <p className="flex justify-between gap-3"><span className="text-mist-500">Nombre</span><span className="text-mist-200">{user.name}</span></p>
                  <p className="flex justify-between gap-3"><span className="text-mist-500">Email</span><span className="text-mist-200">{user.email}</span></p>
                  <p className="flex justify-between gap-3"><span className="text-mist-500">Plan</span><span className={isPremium ? "text-gold-300" : "text-mist-200"}>{isPremium ? "Premium" : "Gratuito"}</span></p>
                </div>
                <LogoutBtn />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* modal de confirmación */}
      {confirming && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-line-2 bg-ink-850 p-7">
            <p className="stamp mb-2 text-mist-500">{confirming === "upgrade" ? "Confirmar suscripción" : "Cancelar suscripción"}</p>
            <h3 className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">
              {confirming === "upgrade" ? "Activar Premium" : "¿Seguro que quieres volver al plan Gratuito?"}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-mist-400">
              {confirming === "upgrade"
                ? "Desbloquearás al instante los 7 análisis profundos de hoy, el radar de valor completo y todos los mercados del modelo. Demo sin cargo: 9,99 €/mes simulados."
                : "Perderás el acceso a los análisis profundos y al radar de valor completo. Tus guardados e historial se conservan."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  if (confirming === "upgrade") upgrade();
                  else cancelPremium();
                  setConfirming(null);
                }}
                className={`flex-1 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
                  confirming === "upgrade" ? "bg-gold-400 text-ink-950 hover:bg-gold-300" : "bg-risk-500 text-ink-950 hover:bg-risk-400"
                }`}
              >
                {confirming === "upgrade" ? "Confirmar · 9,99 €/mes" : "Sí, cancelar Premium"}
              </button>
              <button onClick={() => setConfirming(null)} className="border border-line-2 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-mist-300">
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoutBtn() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      className="mt-5 w-full border border-line-2 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-mist-300 transition-colors hover:border-risk-500/60 hover:text-risk-300"
    >
      Cerrar sesión
    </button>
  );
}
