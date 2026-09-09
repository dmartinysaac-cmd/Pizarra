/**
 * football-data.org service
 * Docs: https://www.football-data.org/documentation/quickstart
 */

import type { LiveMatch } from "./types";

const BASE = "https://api.football-data.org/v4";

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

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function mapStatus(status: string): LiveMatch["status"] {
  const map: Record<string, LiveMatch["status"]> = {
    SCHEDULED: "SCHEDULED",
    TIMED: "SCHEDULED",
    LIVE: "LIVE",
    IN_PLAY: "IN_PLAY",
    PAUSED: "PAUSED",
    FINISHED: "FINISHED",
    POSTPONED: "POSTPONED",
    CANCELLED: "CANCELLED",
    SUSPENDED: "PAUSED",
  };
  return map[status] || "SCHEDULED";
}

export async function fetchMatchesFromFootballData(token: string): Promise<LiveMatch[]> {
  if (!token) {
    throw new Error("Falta el token de football-data.org");
  }

  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 3); // hoy + 3 días

  const url = `${BASE}/matches?dateFrom=${toYmd(from)}&dateTo=${toYmd(to)}`;

  const res = await fetch(url, {
    headers: { "X-Auth-Token": token },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`football-data.org error ${res.status}: ${text.slice(0, 120)}`);
  }

  const data = await res.json();
  const matches: LiveMatch[] = (data.matches || []).map((m: any): LiveMatch => ({
    id: `fd-${m.id}`,
    competition: m.competition?.name || "Competición",
    compShort: m.competition?.code || "COM",
    round: m.matchday ? `Jornada ${m.matchday}` : m.stage || "",
    dateLabel: formatDateLabel(m.utcDate),
    time: formatTime(m.utcDate),
    venue: m.venue || "n    status: mapStatus(m.status),
    home: {
      name: m.homeTeam?.name || "Local",
      short: m.homeTeam?.shortName || m.homeTeam?.name?.slice(0, 12) || "LOC",
      code: m.homeTeam?.tla || "LOC",
      crest: m.homeTeam?.crest,
    },
    away: {
      name: m.awayTeam?.name || "Visitante",
      short: m.awayTeam?.shortName || m.awayTeam?.name?.slice(0, 12) || "VIS",
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

  // Orden: en vivo primero, luego por fecha/hora
  return matches.sort((a, b) => {
    const liveA = a.status === "LIVE" || a.status === "IN_PLAY" || a.status === "PAUSED" ? 0 : 1;
    const liveB = b.status === "LIVE" || b.status === "IN_PLAY" || b.status === "PAUSED" ? 0 : 1;
    if (liveA !== liveB) return liveA - liveB;
    return a.dateLabel.localeCompare(b.dateLabel) || a.time.localeCompare(b.time);
  });
}
