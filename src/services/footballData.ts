/**
 * football-data.org service
 * Docs: https://www.football-data.org/documentation/quickstart
 * Free tier: 10 requests/minute
 * Get your free token at: https://www.football-data.org/client/register
 */

import type { LiveMatch } from "./types";

const BASE = "https://api.football-data.org/v4";

const COMPETITIONS: Record<string, string> = {
  PL: "Premier League",
  PD: "La Liga",
  BL1: "Bundesliga",
  SA: "Serie A",
  FL1: "Ligue 1",
  CL: "Champions League",
};

function formatDateLabel(utcDate: string): string {
  const d = new Date(utcDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === tomorrow.toDateString()) return "Mañana";

  return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function fetchMatchesFromFootballData(
  token: string,
  competitionCodes: string[] = ["PL", "PD", "CL"]
): Promise<LiveMatch[]> {
  if (!token) {
    throw new Error("Falta el token de football-data.org. Añádelo en .env como VITE_FOOTBALL_DATA_TOKEN");
  }

  const all: LiveMatch[] = [];

  for (const code of competitionCodes) {
    try {
      const res = await fetch(
        `${BASE}/competitions/${code}/matches?status=SCHEDULED,LIVE,IN_PLAY,FINISHED&limit=12`,
        {
          headers: { "X-Auth-Token": token },
        }
      );

      if (!res.ok) {
        console.warn(`[football-data] ${code} → ${res.status}`);
        continue;
      }

      const data = await res.json();
      const matches = (data.matches || []).map((m: any): LiveMatch => ({
        id: `fd-${m.id}`,
        competition: COMPETITIONS[code] || m.competition?.name || code,
        compShort: code,
        round: m.matchday ? `Jornada ${m.matchday}` : m.stage || "",
        dateLabel: formatDateLabel(m.utcDate),
        time: formatTime(m.utcDate),
        venue: m.venue || "Por confirmar",
        status: m.status,
        home: {
          name: m.homeTeam?.name || "Local",
          short: m.homeTeam?.shortName || m.homeTeam?.name?.slice(0, 10) || "LOC",
          code: m.homeTeam?.tla || "LOC",
          crest: m.homeTeam?.crest,
        },
        away: {
          name: m.awayTeam?.name || "Visitante",
          short: m.awayTeam?.shortName || m.awayTeam?.name?.slice(0, 10) || "VIS",
          code: m.awayTeam?.tla || "VIS",
          crest: m.awayTeam?.crest,
        },
        score:
          m.score?.fullTime?.home != null
            ? { home: m.score.fullTime.home, away: m.score.fullTime.away }
            : undefined,
        minute: m.minute,
        source: "football-data",
      }));

      all.push(...matches);
    } catch (err) {
      console.error(`[football-data] Error en ${code}:`, err);
    }
  }

  return all.sort((a, b) => {
    const liveA = a.status === "LIVE" || a.status === "IN_PLAY" ? 0 : 1;
    const liveB = b.status === "LIVE" || b.status === "IN_PLAY" ? 0 : 1;
    if (liveA !== liveB) return liveA - liveB;
    return a.dateLabel.localeCompare(b.dateLabel);
  });
}
