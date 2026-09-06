import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./state/AuthContext";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Dashboard from "./pages/Dashboard";
import Value from "./pages/Value";
import Methodology from "./pages/Methodology";
import Pricing from "./pages/Pricing";
import AuthPage from "./pages/AuthPage";
import Legal from "./pages/Legal";

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-center">
      <p className="font-display text-[110px] font-extrabold leading-none text-ink-700">404</p>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-mist-100">Fuera de juego</h1>
      <p className="mt-3 text-mist-400">La página que buscas no existe en esta pizarra.</p>
      <Link to="/" className="mt-8 inline-block bg-pitch-500 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-950">
        Volver al inicio
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/partidos" element={<Matches />} />
            <Route path="/partido/:id" element={<MatchDetail />} />
            <Route path="/panel" element={<Dashboard />} />
            <Route path="/valor" element={<Value />} />
            <Route path="/metodologia" element={<Methodology />} />
            <Route path="/precios" element={<Pricing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/legal/:slug" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
