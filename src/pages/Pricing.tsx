import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { Reveal, SectionHead } from "../components/ui";
import { IconCheck, IconClose, IconStar } from "../components/icons";

const COMPARE: { feature: string; free: string | boolean; premium: string | boolean }[] = [
  { feature: "Cartelera y resúmenes ejecutivos", free: true, premium: true },
  { feature: "Probabilidades 1X2, Over/Under y BTTS", free: true, premium: true },
  { feature: "Enfrentamientos directos y métricas básicas", free: true, premium: true },
  { feature: "Análisis de acceso libre semanal", free: true, premium: true },
  { feature: "Panel con guardados e historial", free: true, premium: true },
  { feature: "Análisis profundo de TODOS los partidos", free: false, premium: true },
  { feature: "Análisis táctico con formaciones proyectadas", free: false, premium: true },
  { feature: "Bajas y onces probables al minuto", free: false, premium: true },
  { feature: "Modelo de remates, córners y tarjetas", free: false, premium: true },
  { feature: "Marcadores más probables", free: false, premium: true },
  { feature: "Radar de valor completo con stakes", free: "Top 2", premium: "Completo" },
  { feature: "Riesgos del análisis y veredicto de confianza", free: false, premium: true },
  { feature: "Soporte prioritario del equipo de análisis", free: false, premium: true },
];

const FAQ = [
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí. La suscripción es mensual y se cancela en un clic desde tu panel, sin permanencias ni preguntas. Conservas el acceso hasta el final del periodo pagado." },
  { q: "¿Qué recibo exactamente al activar Premium?", a: "Acceso inmediato a los 7 análisis profundos de hoy, al radar de valor completo y a todos los mercados del modelo (remates, córners, tarjetas, marcadores). Todo dentro de la plataforma, sin descargas ni terceros." },
  { q: "¿El análisis de acceso libre cambia cada día?", a: "Sí. Cada jornada abrimos un partido completo al plan Gratuito para que compruebes la profundidad real antes de decidir. Hoy es Arsenal–Liverpool." },
  { q: "¿Premium garantiza ganancias?", a: "No, y nadie honesto puede prometerlo. Premium te da mejores herramientas y más información con ventaja estadística; el resultado de cada apuesta sigue siendo incierto. Apuesta solo lo que puedas permitirte perder." },
];

export default function Pricing() {
  const { user, isPremium, upgrade } = useAuth();
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const price = yearly ? "99 €" : "9,99 €";
  const per = yearly ? "/ año · 2 meses gratis" : "/ mes · cancela cuando quieras";

  const mainCta = () => {
    if (!user) {
      navigate("/auth", { state: { from: "/precios" } });
      return;
    }
    if (!isPremium) setConfirming(true);
  };

  return (
    <div className="relative">
      <div className="bg-chalk absolute inset-x-0 top-0 h-[420px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHead stamp="Planes y acceso" title="Elige tu nivel de lectura" />

        <Reveal className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-2xl text-[14px] leading-relaxed text-mist-400">
            Todo el análisis vive dentro de la plataforma: no hay PDFs, ni Telegram, ni terceros. Creas tu cuenta, eliges tu nivel y lees el partido.
          </p>
          <div className="flex items-center gap-3 border border-line bg-ink-850 p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors ${!yearly ? "bg-pitch-500 text-ink-950" : "text-mist-400 hover:text-mist-100"}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors ${yearly ? "bg-pitch-500 text-ink-950" : "text-mist-400 hover:text-mist-100"}`}
            >
              Anual <span className={yearly ? "text-ink-800" : "text-pitch-300"}>−17%</span>
            </button>
          </div>
        </Reveal>

        {/* planes */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <div className="flex h-full flex-col border border-line bg-ink-850 p-8">
              <p className="stamp text-mist-500">Para empezar</p>
              <h3 className="mt-1 font-display text-5xl font-extrabold uppercase tracking-wide text-mist-100">Gratuito</h3>
              <p className="mt-4 font-mono text-3xl text-mist-200">0 € <span className="text-[13px] text-mist-500">/ para siempre</span></p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {COMPARE.filter((c) => c.free === true || typeof c.free === "string").map((c) => (
                  <li key={c.feature} className="flex items-start gap-2.5 text-[13.5px] text-mist-300">
                    <IconCheck size={15} className="mt-0.5 shrink-0 text-pitch-400" /> {c.feature}{typeof c.free === "string" && <span className="stamp ml-1 border border-line-2 px-1.5 text-mist-400">{c.free}</span>}
                  </li>
                ))}
              </ul>
              {user ? (
                <p className="mt-7 border border-line-2 px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-mist-400">
                  {isPremium ? "Tu plan base está incluido en Premium" : "Este es tu plan actual"}
                </p>
              ) : (
                <Link to="/auth?modo=registro" className="mt-7 border border-line-2 px-5 py-3.5 text-center font-display text-base font-bold uppercase tracking-[0.14em] text-mist-100 transition-colors hover:border-pitch-500 hover:text-pitch-300">
                  Crear cuenta gratis
                </Link>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative flex h-full flex-col border border-gold-400/60 bg-ink-850 p-8 shadow-[0_0_80px_-24px_rgba(233,193,105,0.35)]">
              <span className="absolute -top-3.5 left-7 flex items-center gap-1.5 bg-gold-400 px-3.5 py-1 font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-950">
                <IconStar size={12} /> Nivel completo
              </span>
              <p className="stamp text-gold-300">Lectura total del juego</p>
              <h3 className="mt-1 font-display text-5xl font-extrabold uppercase tracking-wide text-mist-100">Premium</h3>
              <p className="mt-4 font-mono text-3xl text-mist-100">{price} <span className="text-[13px] text-mist-500">{per}</span></p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {COMPARE.filter((c) => c.premium !== false).map((c) => (
                  <li key={c.feature} className="flex items-start gap-2.5 text-[13.5px] text-mist-200">
                    <IconStar size={14} className="mt-0.5 shrink-0 text-gold-300" /> {c.feature}{typeof c.premium === "string" && <span className="stamp ml-1 border border-gold-400/40 px-1.5 text-gold-300">{c.premium}</span>}
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <p className="mt-7 flex items-center justify-center gap-2 bg-pitch-500/15 px-5 py-3.5 text-center font-display text-base font-bold uppercase tracking-[0.14em] text-pitch-300">
                  <IconCheck size={16} /> Premium activo en tu cuenta
                </p>
              ) : (
                <button onClick={mainCta} className="mt-7 bg-gold-400 px-5 py-3.5 font-display text-base font-bold uppercase tracking-[0.14em] text-ink-950 transition-all duration-200 hover:bg-gold-300 hover:shadow-[0_0_40px_-10px_rgba(233,193,105,0.6)]">
                  {user ? `Activar Premium · ${price}${yearly ? "/año" : "/mes"}` : "Crear cuenta y activar Premium"}
                </button>
              )}
              <p className="mt-3 text-center text-[12px] text-mist-500">Pago simulado en esta demo · sin tarjeta ni compromiso real</p>
            </div>
          </Reveal>
        </div>

        {/* comparativa */}
        <section className="mt-16">
          <Reveal>
            <h3 className="mb-6 font-display text-3xl font-bold uppercase tracking-wide text-mist-100">Comparativa completa</h3>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-x-auto border border-line bg-ink-850">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-line-2">
                    <th className="px-6 py-4 font-display text-base font-bold uppercase tracking-[0.12em] text-mist-400">Funcionalidad</th>
                    <th className="px-6 py-4 text-center font-display text-base font-bold uppercase tracking-[0.12em] text-mist-200">Gratuito</th>
                    <th className="px-6 py-4 text-center font-display text-base font-bold uppercase tracking-[0.12em] text-gold-300">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {COMPARE.map((row) => (
                    <tr key={row.feature} className="transition-colors hover:bg-ink-800">
                      <td className="px-6 py-3.5 text-[13.5px] text-mist-300">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center">
                        {row.free === true ? <IconCheck size={16} className="mx-auto text-pitch-400" /> : row.free === false ? <IconClose size={15} className="mx-auto text-mist-600" /> : <span className="font-mono text-[12px] text-mist-300">{row.free}</span>}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {row.premium === true ? <IconCheck size={16} className="mx-auto text-gold-300" /> : row.premium === false ? <IconClose size={15} className="mx-auto text-mist-600" /> : <span className="font-mono text-[12px] text-gold-300">{row.premium}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <div className="h-full border border-line bg-ink-850 p-6">
                <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{f.q}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-mist-400">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </section>
      </div>

      {/* confirmación */}
      {confirming && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-gold-400/40 bg-ink-850 p-7">
            <p className="stamp mb-2 text-gold-300">Confirmar suscripción</p>
            <h3 className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">Activar Premium {yearly ? "anual" : "mensual"}</h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-mist-400">
              Vas a activar el plan Premium por <strong className="text-mist-100">{price} {yearly ? "al año" : "al mes"}</strong>. Desbloqueo inmediato de análisis profundos y radar de valor. En esta demo no se procesa ningún pago real.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  upgrade();
                  setConfirming(false);
                  navigate("/partidos");
                }}
                className="flex-1 bg-gold-400 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink-950 transition-colors hover:bg-gold-300"
              >
                Confirmar y desbloquear
              </button>
              <button onClick={() => setConfirming(false)} className="border border-line-2 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-mist-300">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
