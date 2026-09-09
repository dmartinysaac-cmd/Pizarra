/* Tipos compartidos para todas las fuentes de datos */

export type DataSource = "mock" | "football-data" | "api-football";

export interface LiveMatch {
  id: string;
  competition: string;
  compShort: string;
  round: string;
  dateLabel: string;
  time: string;
  venue: string;
  status: "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED";
  home: {
    name: string;
    short: string;
    code: string;
    crest?: string;
  };
  away: {
    name: string;
    short: string;
    code: string;
    crest?: string;
  };
  score?: {
    home: number | null;
    away: number | null;
  };
  minute?: number;
  source: DataSource;
}
