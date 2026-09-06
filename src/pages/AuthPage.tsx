import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { Reveal } from "../components/ui";
import { IconArrow, IconCheck, IconLock, IconPitch, IconStar, IconUser } from "../components/icons";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(params.get("modo") === "registro" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (user) navigate(from ?? "/panel", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register" && name.trim().length < 2) return setError("Escribe tu nombre (mínimo 2 caracteres).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Introduce un email válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    const res = mode === "login" ? login(email, password) : register(name, email, password);
    if (!res.ok) setError(res.error ?? "No se pudo completar la acción.");
    else navigate(from ?? "/panel", { replace: true });
  };

  const demo = (kind: "free" | "premium") => {
    login(kind === "free" ? "demo@pizarra.app" : "pro@pizarra.app", kind === "free" ? "demo1234" : "pro1234");
    navigate("/panel", { replace: true });
  };

  return (
    <div className="relative">
      <div className="bg-blueprint absolute inset-x-0 top-0 h-full opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        {/* lado editorial */}
        <div>
          <Reveal>
            <p className="stamp mb-3 flex items-center gap-2 text-pitch-400">
              <span className="inline-block h-px w-8 bg-pitch-500" /> Acceso a la plataforma
            </p>
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-wide text-mist-100 sm:text-7xl">
              Lee el partido <span className="text-pitch-300">antes</span> del pitido
            </h1>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-mist-400">
              Tu cuenta guarda análisis, historial y preferencias, y decide qué capa de la pizarra puedes abrir. El registro es gratuito y lleva 20 segundos.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-8 space-y-3">
              {[
                { icon: IconCheck, text: "Plan Gratuito: resúmenes, probabilidades básicas y un análisis completo de acceso libre cada jornada." },
                { icon: IconStar, text: "Plan Premium: los 7 análisis profundos de hoy, radar de valor completo y todos los mercados del modelo." },
                { icon: IconLock, text: "Todo dentro de la plataforma: sin grupos, sin PDFs, sin terceros." },
              ].map((x) => (
                <li key={x.text} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-mist-300">
                  <x.icon size={17} className="mt-0.5 shrink-0 text-pitch-400" /> {x.text}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 border border-line bg-ink-850 p-5">
              <p className="stamp mb-3 text-mist-500">Explora sin registrarte</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => demo("free")} className="flex items-center gap-2 border border-line-2 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-mist-200 transition-colors hover:border-pitch-500 hover:text-pitch-300">
                  <IconUser size={15} /> Demo plan Gratuito
                </button>
                <button onClick={() => demo("premium")} className="flex items-center gap-2 border border-gold-400/50 bg-gold-400/10 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-gold-300 transition-colors hover:bg-gold-400/20">
                  <IconStar size={15} /> Demo plan Premium
                </button>
              </div>
              <p className="mt-3 font-mono text-[11px] text-mist-600">demo@pizarra.app / demo1234 · pro@pizarra.app / pro1234</p>
            </div>
          </Reveal>
        </div>

        {/* formulario */}
        <Reveal delay={100}>
          <div className="border border-line-2 bg-ink-900/90 p-7 shadow-[0_36px_80px_-24px_rgba(0,0,0,0.85)] sm:p-9">
            <div className="mb-7 flex border border-line">
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className={`flex-1 py-3 font-display text-base font-bold uppercase tracking-[0.14em] transition-colors ${mode === "login" ? "bg-pitch-500 text-ink-950" : "text-mist-400 hover:text-mist-100"}`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { setMode("register"); setError(null); }}
                className={`flex-1 py-3 font-display text-base font-bold uppercase tracking-[0.14em] transition-colors ${mode === "register" ? "bg-pitch-500 text-ink-950" : "text-mist-400 hover:text-mist-100"}`}
              >
                Crear cuenta
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {mode === "register" && (
                <div>
                  <label htmlFor="name" className="stamp mb-1.5 block text-mist-400">Nombre</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ana García"
                    className="w-full border border-line bg-ink-850 px-4 py-3 text-[14px] text-mist-100 placeholder-mist-600 outline-none transition-colors focus:border-pitch-500"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="stamp mb-1.5 block text-mist-400">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full border border-line bg-ink-850 px-4 py-3 text-[14px] text-mist-100 placeholder-mist-600 outline-none transition-colors focus:border-pitch-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="stamp mb-1.5 block text-mist-400">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-line bg-ink-850 px-4 py-3 text-[14px] text-mist-100 placeholder-mist-600 outline-none transition-colors focus:border-pitch-500"
                />
              </div>

              {error && (
                <p className="border border-risk-500/50 bg-risk-500/10 px-4 py-3 text-[13px] text-risk-300">{error}</p>
              )}

              <button type="submit" className="group flex w-full items-center justify-between bg-pitch-500 px-5 py-3.5 font-display text-base font-bold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-pitch-400">
                {mode === "login" ? "Entrar a mi pizarra" : "Crear cuenta gratuita"}
                <IconArrow size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            {mode === "register" && (
              <p className="mt-5 text-[12px] leading-relaxed text-mist-500">
                Al registrarte aceptas el <Link to="/legal/aviso-legal" className="text-pitch-300 underline-offset-2 hover:underline">aviso legal</Link> y la{" "}
                <Link to="/legal/privacidad" className="text-pitch-300 underline-offset-2 hover:underline">política de privacidad</Link>. Solo mayores de 18 años.
              </p>
            )}

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <IconPitch size={18} className="text-pitch-400" />
              <p className="text-[12px] text-mist-500">Demo local: tus datos se guardan solo en este navegador.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
