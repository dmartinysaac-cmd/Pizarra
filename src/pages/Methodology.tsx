import { useState } from "react";
import { Reveal, SectionHead } from "../components/ui";
import { IconChart, IconLayers, IconRadar, IconShield, IconTarget, IconWhistle } from "../components/icons";
import { CONF_META } from "../data/matches";

const SOURCES = [
  { title: "Eventos de juego", body: "Tiros, xG por tiro, presiones, recuperaciones, duelos, conducciones y pases progresivos de 38 ligas, normalizados por nivel competitivo." },
  { title: "Contexto y estados", body: "Marcador en cada fase, minuto, expulsiones, fatiga (días de descanso), viajes y altitud. El contexto ajusta hasta un 12% el xG base." },
  { title: "Bajas y onces", body: "Partes médicos, sanciones y rotaciones previstas. Cada ausencia se valora con su impacto histórico en xG/xGA del equipo." },
  { title: "Mercado y cuotas", body: "Cuotas de apertura y cierre de 40 casas, para detectar eficiencia, movimiento de dinero y calcular el edge de cada selección." },
  { title: "Arbitraje", body: "Histórico del colegiado designado: tarjetas por partido, penaltis señalados y criterio en duelos. Alimenta los mercados disciplinarios." },
  { title: "ABP y remates", body: "Modelos independientes de córners, faltas laterales y volumen de tiros por equipo y por jugador, calibrados por temporada." },
];

const FAQ = [
  {
    q: "¿Qué es exactamente el xG y por qué manda en el modelo?",
    a: "El xG (goles esperados) mide la calidad de cada ocasión según dónde y cómo se remata. Un equipo puede marcar por suerte una semana, pero su xG acumulado predice el futuro mucho mejor que sus goles reales. Por eso el modelo trabaja con xG ajustado, no con resultados.",
  },
  {
    q: "¿Cómo se construyen las probabilidades de cada mercado?",
    a: "Cada partido se simula 20.000 veces con un modelo de Poisson ajustado por xG, forma, bajas y contexto. La frecuencia de cada resultado en esas simulaciones es su probabilidad. Los mercados de córners, tarjetas y remates usan modelos propios alimentados por sus propias series históricas.",
  },
  {
    q: "¿Qué significa que una selección tenga 'valor'?",
    a: "Que nuestra probabilidad es mayor que la probabilidad implícita en la cuota. Si el modelo dice 68% y la cuota 1.62 implica 61,7%, hay un edge de +10%. Repetir apuestas con edge positivo es la única forma matemática de batir al mercado a largo plazo.",
  },
  {
    q: "¿Por qué los niveles de confianza cambian entre partidos?",
    a: "La confianza mide convergencia: acuerdo entre modelo y mercado, estabilidad de onces, varianza del guion y calidad de los datos. Un partido con tres dudas de alineación nunca tendrá confianza alta aunque haya edge, porque el riesgo de que la foto cambie es real.",
  },
  {
    q: "¿El modelo acierta siempre?",
    a: "No, y desconfía de quien diga lo contrario. Un modelo calibrado con Brier 0.19 acierta el resultado exacto en torno al 13-15% de las veces y gana en probabilidades, no en certezas. La ventaja se construye en cientos de selecciones, no en una.",
  },
  {
    q: "¿Qué hago con el stake sugerido?",
    a: "Es una recomendación de gestión de banca en escala 1–5 según la varianza de la selección. La regla de oro: nunca más del 5% de tu banca en una entrada y jamás perseguir pérdidas. El análisis informa; la responsabilidad de apostar es siempre tuya.",
  },
];

const PIPE_NODES = [
  { icon: IconLayers, label: "Eventos crudos", sub: "12k / jornada" },
  { icon: IconChart, label: "xG contextual", sub: "ajuste por rival" },
  { icon: IconRadar, label: "Monte Carlo", sub: "20.000 sims" },
  { icon: IconWhistle, label: "Calibración", sub: "Brier 0.192" },
  { icon: IconTarget, label: "Valor + stake", sub: "edge > 5%" },
];

export default function Methodology() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[460px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHead stamp="Sala de máquinas · Modelo v4.2" title="Metodología del análisis" />
        <Reveal>
          <p className="mb-12 max-w-3xl text-[14.5px] leading-relaxed text-mist-400">
            Nada de corazonadas: cada probabilidad que publicas en tu panel sale de un proceso auditable. Así se lee un partido en Pizarra Analytics, de la base de datos al stake sugerido.
          </p>
        </Reveal>

        {/* pipeline visual */}
        <Reveal>
          <div className="border border-line bg-ink-850 p-6 sm:p-8">
            <p className="stamp mb-6 text-mist-500">Flujo de producción · cada partido, cada día</p>
            <div className="grid gap-4 md:grid-cols-[repeat(5,1fr)]">
              {PIPE_NODES.map((n, i) => (
                <div key={n.label} className="relative">
                  {i < PIPE_NODES.length - 1 && (
                    <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-pitch-500 md:block" aria-hidden>→</span>
                  )}
                  <div className="group border border-line-2 bg-ink-800 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-pitch-500/60">
                    <n.icon size={24} className="mx-auto mb-3 text-pitch-400" />
                    <p className="font-display text-lg font-bold uppercase tracking-wide text-mist-100">{n.label}</p>
                    <p className="stamp mt-1 text-mist-500">{n.sub}</p>
                  </div>
                  <p className="stamp mt-2 text-center text-mist-600">Fase 0{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* la fórmula del valor */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="border border-gold-400/40 bg-ink-850 p-7">
              <p className="stamp mb-4 text-gold-300">La única fórmula que importa</p>
              <p className="border border-line-2 bg-ink-950 p-6 text-center font-mono text-xl text-mist-100 sm:text-2xl">
                Edge = P<sub className="text-pitch-300">modelo</sub> × Cuota − 1
              </p>
              <p className="mt-5 text-[13.5px] leading-relaxed text-mist-400">
                Si el edge es <strong className="text-gold-300">positivo</strong>, la cuota paga más de lo que el riesgo justifica: hay valor. Si es negativo, el mercado ya sabe más que tú. Ejemplo real de hoy:
              </p>
              <p className="mt-3 font-mono text-[13px] text-mist-300">
                Más de 2.5 en RMA–MCI: 0,68 × 1,62 − 1 = <span className="text-gold-300">+10,2%</span> → publicado con stake 2,5/5.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border border-line bg-ink-850 p-7">
              <p className="stamp mb-4 text-pitch-400">Poisson, xG y por qué funciona</p>
              <p className="text-[13.5px] leading-relaxed text-mist-400">
                Los goles de un equipo en un partido se comportan, razonablemente bien, como un <strong className="text-mist-100">proceso de Poisson</strong> cuya intensidad es su xG ajustado. Combinando las intensidades de ambos equipos —y correlacionándolas para no subestimar empates y goleadas— el modelo obtiene la distribución completa de marcadores.
              </p>
              <p className="mt-4 border border-line-2 bg-ink-950 p-5 text-center font-mono text-base text-mist-200">
                P(k goles) = (λ<sup>k</sup> · e<sup>−λ</sup>) / k!
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-mist-400">
                De esa distribución nacen el 1X2, los Over/Under, el BTTS y los marcadores más probables. Los mercados de remates, córners y tarjetas usan series propias con el mismo esqueleto estadístico.
              </p>
            </div>
          </Reveal>
        </div>

        {/* fuentes */}
        <section className="mt-16">
          <SectionHead stamp="Materia prima" title="Qué datos alimentan el modelo" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="h-full border border-line bg-ink-850 p-5 transition-colors hover:border-line-2">
                  <p className="font-display text-xl font-bold uppercase tracking-wide text-mist-100">{s.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist-400">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* escala de confianza */}
        <section className="mt-16">
          <SectionHead stamp="Semáforo del analista" title="Escala de confianza" />
          <div className="border border-line bg-ink-850">
            {(Object.keys(CONF_META) as (keyof typeof CONF_META)[]).map((k) => {
              const m = CONF_META[k];
              return (
                <div key={k} className="grid gap-2 border-b border-line p-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-center">
                  <span className="flex items-center gap-3">
                    <span className={`h-4 w-4 rounded-full ${m.bg}`} />
                    <span className={`font-display text-2xl font-bold uppercase tracking-wide ${m.color}`}>{m.label}</span>
                  </span>
                  <p className="text-[13.5px] text-mist-400">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* staking */}
        <Reveal className="mt-16">
          <div className="grid gap-6 border border-line bg-ink-850 p-7 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="stamp mb-2 flex items-center gap-2 text-pitch-400"><IconShield size={15} /> Gestión de banca</p>
              <h3 className="font-display text-3xl font-bold uppercase tracking-wide text-mist-100">Staking: la parte aburrida que te mantiene vivo</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { s: "1/5", t: "Varianza alta", d: "Mercados secundarios, tarjetas o goles exactos. Tamaño mínimo: el ruido manda." },
                { s: "2–3/5", t: "Lectura estándar", d: "Edge sólido con algún factor abierto (dudas de once, guion sensible al marcador)." },
                { s: "4–5/5", t: "Convergencia total", d: "Modelo, mercado y contexto alineados. Reservado a 2–3 entradas por semana, nunca más." },
              ].map((x) => (
                <div key={x.s} className="border border-line-2 bg-ink-800 p-4">
                  <p className="font-display text-3xl font-extrabold text-pitch-300">{x.s}</p>
                  <p className="stamp mt-1 text-mist-300">{x.t}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-mist-500">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* FAQ */}
        <section className="mt-16">
          <SectionHead stamp="Dudas frecuentes" title="Preguntas sobre el modelo" />
          <div className="divide-y divide-line border border-line bg-ink-850">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-ink-800">
                  <span className="font-display text-lg font-bold uppercase tracking-wide text-mist-100">{f.q}</span>
                  <span className={`font-display text-2xl text-pitch-400 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-3xl px-6 pb-6 text-[13.5px] leading-relaxed text-mist-400">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
