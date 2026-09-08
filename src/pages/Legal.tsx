import { Link, useParams } from "react-router-dom";
import { Reveal } from "../components/ui";
import { IconShield } from "../components/icons";

interface Section { h: string; p: string[] }
interface LegalDoc { title: string; updated: string; intro: string; sections: Section[] }

const DOCS: Record<string, LegalDoc> = {
  "aviso-legal": {
    title: "Aviso legal",
    updated: "Última revisión: enero 2026",
    intro:
      "Este aviso regula el uso de la plataforma Pizarra Analytics (en adelante, «la Plataforma»), un servicio de análisis estadístico de partidos de fútbol orientado a la información deportiva.",
    sections: [
      {
        h: "1. Titularidad y objeto",
        p: [
          "La Plataforma es operada por Pizarra Analytics SL (demo), con domicilio a efectos de notificaciones en la dirección facilitada durante el registro. Su objeto es la publicación de análisis estadísticos, probabilidades estimadas y contenido editorial sobre competiciones de fútbol.",
          "El acceso a determinadas secciones requiere registro y, en su caso, suscripción al plan Premium. Las condiciones de cada plan se describen en la página de Precios y forman parte de este aviso.",
        ],
      },
      {
        h: "2. Naturaleza del contenido",
        p: [
          "Todo el contenido de la Plataforma —probabilidades, edges, stakes sugeridos, veredictos y conclusiones— tiene carácter exclusivamente informativo y estadístico. No constituye asesoramiento financiero, de inversión ni de juego, ni una recomendación personalizada de apuesta.",
          "Las probabilidades son estimaciones derivadas de modelos estadísticos y datos históricos. Ninguna estimación garantiza resultados futuros: el deporte es, por definición, incierto.",
        ],
      },
      {
        h: "3. Cuenta de usuario",
        p: [
          "El usuario es responsable de la veracidad de sus datos de registro y de la custodia de su contraseña. La cuenta es personal e intransferible.",
          "Podremos suspender cuentas que compartan acceso Premium de forma fraudulenta o que realicen un uso abusivo de la Plataforma.",
        ],
      },
      {
        h: "4. Suscripciones y pagos",
        p: [
          "El plan Premium se factura por periodos mensuales o anuales según la modalidad elegida, y puede cancelarse en cualquier momento desde el panel de usuario, manteniendo el acceso hasta el fin del periodo pagado.",
          "En esta versión de demostración no se procesan pagos reales: la activación del plan Premium es simulada y sin cargo.",
        ],
      },
      {
        h: "5. Propiedad intelectual",
        p: [
          "Los análisis, textos, modelos, gráficos y diseño de la Plataforma son titularidad de Pizarra Analytics o de sus licenciantes. Queda prohibida su reproducción o redistribución sistemática sin autorización expresa.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    updated: "Última revisión: enero 2026",
    intro:
      "Tratamos tus datos con un principio simple: los mínimos imprescindibles para que la Plataforma funcione, y nunca para vendértelos a terceros.",
    sections: [
      {
        h: "1. Responsable del tratamiento",
        p: [
          "Pizarra Analytics SL (demo) es la responsable del tratamiento de los datos personales recabados a través de la Plataforma, en los términos del Reglamento (UE) 2016/679 (RGPD) y la normativa española aplicable.",
        ],
      },
      {
        h: "2. Datos que tratamos y finalidad",
        p: [
          "Datos de registro: nombre, email y contraseña cifrada, para crear y proteger tu cuenta.",
          "Datos de uso: análisis guardados, historial de consultas y plan contratado, para personalizar tu panel de usuario.",
          "Datos de suscripción (solo en versión de producción): los estrictamente necesarios para gestionar el pago a través del proveedor de pagos, que actúa como encargado del tratamiento.",
        ],
      },
      {
        h: "3. Base jurídica y conservación",
        p: [
          "La base jurídica es la ejecución del contrato de servicio (tu cuenta) y tu consentimiento para comunicaciones opcionales. Conservamos los datos mientras la cuenta esté activa y, tras su cierre, durante los plazos legales aplicables.",
          "En esta demo, todos los datos se almacenan localmente en tu navegador (localStorage) y nunca salen de tu dispositivo.",
        ],
      },
      {
        h: "4. Tus derechos",
        p: [
          "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a privacidad@pizarra.app (demo). También puedes reclamar ante la autoridad de control competente (AEPD en España).",
        ],
      },
      {
        h: "5. Cookies",
        p: [
          "La Plataforma no utiliza cookies publicitarias ni de seguimiento de terceros. Solo se emplea almacenamiento local técnico para mantener tu sesión y tus preferencias.",
        ],
      },
    ],
  },
  responsabilidad: {
    title: "Juego responsable",
    updated: "Compromiso permanente",
    intro:
      "El análisis deportivo informa decisiones; no las toma por ti. Este documento resume nuestro compromiso con un uso sano de la información que publicamos.",
    sections: [
      {
        h: "1. Solo para mayores de 18 años",
        p: [
          "El contenido de la Plataforma está dirigido exclusivamente a personas mayores de edad. Si tienes menos de 18 años, no debes registrarte ni utilizar ninguna de nuestras herramientas.",
        ],
      },
      {
        h: "2. Ninguna garantía de ganancias",
        p: [
          "Las probabilidades, edges y stakes que publicamos son estimaciones estadísticas. Incluso una selección con ventaja matemática puede perderse: el valor existe en el largo plazo, no en el partido de esta noche.",
          "Nunca aportes dinero que necesites para vivir, ni persigas pérdidas subiendo stakes. Si una mala racha te empuja a apostar más de lo planeado, es momento de parar.",
        ],
      },
      {
        h: "3. Buenas prácticas que recomendamos",
        p: [
          "Define una banca separada de tus finanzas personales y no la excedas jamás. Respeta los stakes sugeridos: existen para proteger tu banca de la varianza, no para maximizar la adrenalina.",
          "Lleva un registro de tus apuestas (resultado, cuota, stake). Lo que no se mide, no se puede mejorar ni controlar.",
          "Establece límites de depósito en tu operador y utiliza las herramientas de autoexclusión si las necesitas.",
        ],
      },
      {
        h: "4. Señales de alarma y ayuda",
        p: [
          "Apostar más de lo planeado, mentir sobre lo que apuestas, pedir dinero para apostar o dejar de hacer planes por seguir el deporte son señales de riesgo reconocidas.",
          "En España puedes pedir ayuda gratuita y confidencial en la línea 024 de atención a la conducta suicida y malestar emocional, y en los servicios de atención al juego problemático de tu comunidad autónoma. En Latinoamérica, consulta los programas de juego responsable de tu regulador local.",
        ],
      },
      {
        h: "5. Nuestro compromiso",
        p: [
          "No publicamos «apuestas seguras», no celebramos ganancias como si fueran rentas y recordamos en cada ficha que el análisis no garantiza resultados. La mejor lectura de un partido también puede ser no apostar ese partido.",
        ],
      },
    ],
  },
};

const SLUGS: { slug: string; label: string }[] = [
  { slug: "aviso-legal", label: "Aviso legal" },
  { slug: "privacidad", label: "Política de privacidad" },
  { slug: "responsabilidad", label: "Juego responsable" },
];

export default function Legal() {
  const { slug } = useParams();
  const doc = DOCS[slug ?? "aviso-legal"] ?? DOCS["aviso-legal"];

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-[300px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <Reveal>
          <p className="stamp mb-2 flex items-center gap-2 text-pitch-400">
            <span className="inline-block h-px w-8 bg-pitch-500" /> Marco legal
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase tracking-wide text-mist-100 sm:text-6xl">{doc.title}</h1>
          <p className="stamp mt-2 text-mist-500">{doc.updated}</p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav className="flex flex-col gap-1 border border-line bg-ink-850 p-2">
              {SLUGS.map((s) => (
                <Link
                  key={s.slug}
                  to={`/legal/${s.slug}`}
                  className={`px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
                    s.slug === (slug ?? "aviso-legal") ? "bg-pitch-500/15 text-pitch-300" : "text-mist-400 hover:bg-ink-800 hover:text-mist-100"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border border-risk-500/40 bg-risk-500/5 p-4">
              <p className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-risk-300">
                <IconShield size={16} /> +18 · Apuesta con cabeza
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-mist-500">El análisis no garantiza resultados. Si apuestas, que sea con límites.</p>
            </div>
          </aside>

          <div>
            <Reveal>
              <p className="border-l-2 border-pitch-500 pl-5 text-[15px] italic leading-relaxed text-mist-300">{doc.intro}</p>
            </Reveal>
            <div className="mt-10 space-y-10">
              {doc.sections.map((s, i) => (
                <Reveal key={s.h} delay={i * 60}>
                  <section>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-mist-100">{s.h}</h2>
                    <div className="mt-3 space-y-3">
                      {s.p.map((p, j) => (
                        <p key={j} className="max-w-3xl text-[14px] leading-relaxed text-mist-400">{p}</p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-12 border-t border-line pt-6 text-[12px] text-mist-600">
                ¿Dudas sobre este documento? Escríbenos a legal@pizarra.app (dirección de demostración).
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
