/**
 * API-Football (api-sports / RapidAPI)
 * Free tier: 100 requests/day
 */

import type { LiveMatch } from "./types";

const BASE = "https://v3.football.api-sports.io";

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === tomorrow.toDateString()) return "Mañana";

  return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function fetchMatchesFromApiFootball(
  apiKey: string,
  leagueIds: number[] = [140, 39, 2, 78, 135] // LaLiga, Premier, UCL, Bundesliga, Serie A
): Promise<LiveMatch[]> {
  if (!apiKey) {
    throw new Error("Falta la API key de API-Football");
  }

  const today = new Date().toISOString().slice(0, 10);
  const all: LiveMatch[] = [];

  for (const leagueId of leagueIds) {
    try {
      const url = `${BASE}/fixtures?league=${leagueId}&season=2025&date=${today}&timezone=Europe/Madrid`;

      const res = await fetch(url, {
        headers: {
          "x-apisports-key": apiKey,
        },
      });

      if (!res.ok) {
        console.warn(`[api-football] league ${leagueId} → ${res.status}`);
        continue;
      }

      const json = await res.json();
      const fixtures = json.response || [];

      const mapped: LiveMatch[] = fixtures.map((f: any): LiveMatch => {
        const statusMap: Record<string, LiveMatch["status"]> = {
          NS: "SCHEDULED",
          TBD: "SCHEDULED",
          "1H": "LIVE",
          HT: "PAUSED",
          "2H": "LIVE",
          ET: "LIVE",
          BT: "PAUSED",
          P: "LIVE",
          FT: "FINISHED",
          AET: "FINISHED",
          PEN: "FINISHED",
          PST: "POSTPONED",
          CANC: "CANCELLED",
        };

        return {
          id: `af-${f.fixture.id}`,
          competition: f.league?.name || "Liga",
          compShort: f.league?.name?.slice(0, 3).toUpperCase() || "LIG",
          round: f.league?.round || "",
          dateLabel: formatDateLabel(f.fixture.date),
          time: formatTime(f.fixture.date),
          venue: f.fixture.venue?.name || "Por confirmar",
          status: statusMap[f.fixture.status?.short] || "SCHEDULED",
          home: {
            name: f.teams.home.name,
            short: f.teams.home.name.slice(0, 12),
            code: f.teams.home.name.slice(0, 3).toUpperCase(),
            crest: f.teams.home.logo,
          },
          away: {
            name: f.teams.away.name,
            short: f.teams.away.name.slice(0, 12),
            code: f.teams.away.name.slice(0, 3).toUpperCase(),
            crest: f.teams.away.logo,
          },
          score:
            f.goals.home != null
              ? { home: f.goals.home, away: f.goals.away }
              : undefined,
          minute: f.fixture.status?.elapsed ?? undefined,
          source: "api-football",
        };
      });

      all.push(...mapped);
    } catch (err) {
      console.error(`[api-football] Error league ${leagueId}:`, err);
    }
  }

  return all;
}
