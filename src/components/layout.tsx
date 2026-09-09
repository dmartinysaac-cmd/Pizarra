import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { matches } from "../data/matches";
import { useAuth } from "../state/AuthContext";
import { IconArrow, IconClose, IconMenu, IconPitch, IconStar, IconUser } from "./icons";

/* ---------- ticker de modelo ---------- */
function Ticker() {
  const items = matches.flatMap((m) => {
    const r = m.markets.find((x) => x.icon === "result")!;
    const head = m.live
      ? { text: `${m.home.code} ${m.live.home}-${m.live.away} ${m.away.code} · MIN ${m.live.minute}`, hot: true }
      : { text: `${m.home.code} ${r.outcomes[0].prob}% · X ${r.outcomes[1].prob}% · ${m.away.code} ${r.outcomes[2].prob}%`, hot: false };
    const pick = m.valuePicks[0];
    return [head, pick ? { text: `VALOR ${m.home.code}-${m.away.code}: ${pick.pick.toUpperCase()} @${pick.odd.toFixed(2)} (+${pick.edge.toFixed(1)}%)`, hot: false } : null].filter(
      Boolean
    ) as { text: string; hot: boolean }[];
  });

  return (
    <div className="relative z-40 overflow-hidden border-b border-line bg-ink-900">
      <div className="ticker-track items-center py-1.5">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((it, i) => (
              <span key={`${dup}-${i}`} className="flex items-center whitespace-nowrap font-mono text-[11px] tracking-wide">
                <span className={`px-4 ${it.hot ? "font-semibold text-risk-300" : "text-mist-400"}`}>{it.text}</span>
                <span className="text-pitch-600">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- navegación ---------- */
const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/en-vivo", label: "En vivo" },
  { to: "/partidos", label: "Partidos del día" },
  { to: "/valor", label: "Valor" },
  { to: "/metodologia", label: "Metodología" },
  { to: "/precios", label: "Precios" },
];

function Nav() {
  const { user, isPremium, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => setMenu(false), [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-950/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center border border-pitch-500/50 bg-pitch-500/10 text-pitch-400 transition-colors group-hover:bg-pitch-500/20">
            <IconPitch size={20} />
          </span>
          <span className="leading-none">
            <span className="font-display text-xl font-bold uppercase tracking-[0.14em] text-mist-100">
              Pizarra<span className="text-pitch-400">·</span>Analytics
            </span>
            <span className="stamp block pt-0.5 text-mist-500">El partido, leído antes del pitido</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `link-line font-display text-[15px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "active text-pitch-300" : "text-mist-400 hover:text-mist-100"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2.5 border border-line bg-ink-850 py-1.5 pl-2 pr-3 transition-colors hover:border-line-2"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${isPremium ? "bg-gold-400 text-ink-950" : "bg-ink-600 text-mist-100"}`}>
                  {isPremium ? <IconStar size={14} /> : <IconUser size={14} />}
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[13px] font-semibold text-mist-100">{user.name.split(" ")[0]}</span>
                  <span className={`stamp block ${isPremium ? "text-gold-300" : "text-mist-500"}`}>{isPremium ? "Premium" : "Gratuito"}</span>
                </span>
              </button>
              {menu && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 border border-line-2 bg-ink-850 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.8)]">
                  <Link to="/panel" className="flex items-center justify-between px-4 py-3 text-[13px] text-mist-200 transition-colors hover:bg-ink-750">
                    Mi panel <IconArrow size={14} />
                  </Link>
                  {!isPremium && (
                    <Link to="/precios" className="flex items-center justify-between border-t border-line px-4 py-3 text-[13px] text-gold-300 transition-colors hover:bg-ink-750">
                      <span className="flex items-center gap-2">
                        <IconStar size={14} /> Mejorar a Premium
                      </span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-left text-[13px] text-mist-400 transition-colors hover:bg-ink-750"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-mist-200 transition-colors hover:text-pitch-300">
                Entrar
              </Link>
              <Link
                to="/precios"
                className="flex items-center gap-2 bg-pitch-500 px-4 py-2 font-display text-[15px] font-bold uppercase tracking-[0.12em] text-ink-950 transition-colors hover:bg-pitch-400"
              >
                <IconStar size={14} /> Hazte Premium
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className="flex h-10 w-10 items-center justify-center border border-line text-mist-200 lg:hidden" aria-label="Menú">
          {open ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink-900 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2.5 font-display text-lg font-bold uppercase tracking-[0.1em] ${isActive ? "bg-ink-750 text-pitch-300" : "text-mist-200"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 grid gap-2 border-t border-line pt-4">
              {user ? (
                <>
                  <Link to="/panel" className="bg-ink-750 px-3 py-2.5 text-center font-display text-lg font-bold uppercase tracking-[0.1em] text-mist-100">
                    Mi panel
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="border border-line px-3 py-2.5 font-display text-lg font-bold uppercase tracking-[0.1em] text-mist-400"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="border border-line px-3 py-2.5 text-center font-display text-lg font-bold uppercase tracking-[0.1em] text-mist-100">
                    Iniciar sesión
                  </Link>
                  <Link to="/precios" className="bg-pitch-500 px-3 py-2.5 text-center font-display text-lg font-bold uppercase tracking-[0.1em] text-ink-950">
                    Hazte Premium
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- pie ---------- */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center border border-pitch-500/50 bg-pitch-500/10 text-pitch-400">
              <IconPitch size={20} />
            </span>
            <span className="font-display text-xl font-bold uppercase tracking-[0.14em] text-mist-100">
              Pizarra<span className="text-pitch-400">·</span>Analytics
            </span>
          </div>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-mist-500">
            Plataforma de inteligencia de partido: modelo probabilístico propio, detección de valor y análisis profundos de las principales competiciones del mundo.
          </p>
          <p className="stamp mt-5 text-mist-600">Modelo v4.2 · Calibrado cada 24 h</p>
        </div>
        <div>
          <p className="stamp mb-4 text-pitch-400">Plataforma</p>
          <ul className="space-y-2.5 text-[13px] text-mist-400">
            <li><Link className="transition-colors hover:text-pitch-300" to="/en-vivo">En vivo</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/partidos">Partidos del día</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/valor">Mejores oportunidades</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/metodologia">Metodología del modelo</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/precios">Planes y precios</Link></li>
          </ul>
        </div>
        <div>
          <p className="stamp mb-4 text-pitch-400">Cuenta</p>
          <ul className="space-y-2.5 text-[13px] text-mist-400">
            <li><Link className="transition-colors hover:text-pitch-300" to="/auth">Iniciar sesión</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/auth?modo=registro">Crear cuenta gratis</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/panel">Panel de usuario</Link></li>
          </ul>
        </div>
        <div>
          <p className="stamp mb-4 text-pitch-400">Legal</p>
          <ul className="space-y-2.5 text-[13px] text-mist-400">
            <li><Link className="transition-colors hover:text-pitch-300" to="/legal/aviso-legal">Aviso legal</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/legal/privacidad">Política de privacidad</Link></li>
            <li><Link className="transition-colors hover:text-pitch-300" to="/legal/responsabilidad">Juego responsable</Link></li>
          </ul>
          <span className="mt-5 inline-flex h-9 w-9 items-center justify-center border border-risk-500/50 font-display text-sm font-bold text-risk-300">+18</span>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] text-mist-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Pizarra Analytics. Las probabilidades son estimaciones estadísticas y no garantizan resultados.</p>
          <p className="stamp">Contenido informativo · No es asesoramiento financiero</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- avisos ---------- */
function Toasts() {
  const { toasts } = useAuth();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto border px-4 py-3 text-[13px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] ${
            t.kind === "ok" ? "border-pitch-500/50 bg-ink-800 text-pitch-300" : t.kind === "warn" ? "border-amberx-400/50 bg-ink-800 text-amberx-300" : "border-line-2 bg-ink-800 text-mist-200"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- estructura ---------- */
export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" aria-hidden />
      <Ticker />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}
