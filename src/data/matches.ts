/* ============================================================
   PIZARRA Analytics — Modelo de datos de partidos y análisis
   Datos de demostración generados por el "modelo interno v4.2"
   ============================================================ */

export type Confidence = "alta" | "media" | "baja" | "norec";
export type FormResult = "V" | "E" | "D";

export interface TeamInfo {
  name: string;
  short: string;
  code: string;
  colors: [string, string];
  manager: string;
  ranking: string;
}

export interface KeyPlayer {
  name: string;
  pos: string;
  figure: string;
  note: string;
}

export interface TeamAnalysis {
  form: FormResult[];
  formNote: string;
  attackText: string;
  defenseText: string;
  style: string;
  keyPlayers: KeyPlayer[];
  context: string;
}

export type AbsenceStatus = "Confirmado fuera" | "Duda" | "Probable" | "Sancionado";
export interface Absence {
  player: string;
  pos: string;
  status: AbsenceStatus;
  reason: string;
}

export interface Outcome {
  label: string;
  prob: number; // %
  odd: number;
}

export interface MarketGroup {
  market: string;
  icon: "result" | "double" | "goals" | "btts" | "shots" | "corners" | "cards" | "other";
  basic?: boolean; // visible para usuarios gratuitos
  outcomes: Outcome[];
}

export interface ValuePick {
  market: string;
  pick: string;
  odd: number;
  prob: number;
  edge: number; // %
  stake: string;
}

export interface Match {
  id: string;
  competition: string;
  compShort: string;
  round: string;
  dateLabel: string;
  time: string;
  venue: string;
  referee: string;
  featured?: boolean;
  freeAccess?: boolean;
  live?: { minute: number; home: number; away: number };
  home: TeamInfo;
  away: TeamInfo;
  formationHome: string;
  formationAway: string;
  tags: string[];
  summary: string[];
  homeAnalysis: TeamAnalysis;
  awayAnalysis: TeamAnalysis;
  tactics: {
    overview: string;
    keys: { title: string; body: string }[];
    prediction: string;
  };
  absencesHome: Absence[];
  absencesAway: Absence[];
  lineupHome: string[];
  lineupAway: string[];
  metrics: { label: string; unit?: string; home: number; away: number }[];
  h2h: { date: string; comp: string; score: string; result: FormResult }[];
  markets: MarketGroup[];
  topScores: { score: string; prob: number }[];
  valuePicks: ValuePick[];
  risks: string[];
  conclusion: {
    confidence: Confidence;
    verdict: string;
    mainPicks: { label: string; odd: number }[];
    stake: string;
  };
}

/* ---------- utilidades del modelo ---------- */
export const edgeOf = (prob: number, odd: number) =>
  Math.round(((prob / 100) * odd - 1) * 1000) / 10;

export const CONF_META: Record<Confidence, { label: string; color: string; bg: string; desc: string }> = {
  alta:  { label: "Alta",          color: "text-pitch-300",  bg: "bg-pitch-500",  desc: "Convergencia fuerte entre modelo, mercado y contexto. Entrada principal de la jornada." },
  media: { label: "Media",         color: "text-gold-300",   bg: "bg-gold-400",   desc: "Ventaja razonable con un factor de incertidumbre acotado y asumible." },
  baja:  { label: "Baja",          color: "text-amberx-300", bg: "bg-amberx-400", desc: "Lectura posible pero con ruido alto: rotaciones, bajas o mercado poco eficiente." },
  norec: { label: "No recomendable", color: "text-risk-300", bg: "bg-risk-500",   desc: "Sin ventaja medible o con riesgos dominantes. Pasar de largo también es una decisión." },
};

/* ============================================================
   CARTELERA DEL DÍA
   ============================================================ */

export const matches: Match[] = [
  /* ----------------------------------------------------------
     1 · REAL MADRID — MANCHESTER CITY  (análisis insignia)
     ---------------------------------------------------------- */
  {
    id: "rma-mci",
    competition: "UEFA Champions League",
    compShort: "UCL",
    round: "Cuartos de final · Vuelta",
    dateLabel: "Hoy",
    time: "21:00",
    venue: "Santiago Bernabéu, Madrid",
    referee: "Daniele Orsato (ITA)",
    featured: true,
    home: { name: "Real Madrid", short: "R. Madrid", code: "RMA", colors: ["#f2f2f2", "#ddab45"], manager: "Carlo Ancelotti", ranking: "1º LaLiga · 72 pts" },
    away: { name: "Manchester City", short: "Man. City", code: "MCI", colors: ["#6cabdd", "#1c2c5b"], manager: "Pep Guardiola", ranking: "2º Premier League · 68 pts" },
    formationHome: "4-3-1-2",
    formationAway: "4-2-3-1",
    tags: ["Eliminatoria", "xG alto", "Ida 3-3", "Valor en goles"],
    summary: [
      "La ida del Etihad terminó 3-3: la eliminatoria está abierta y el modelo otorga al Madrid una ligera ventaja de localía (40% vs 36%) muy por debajo de lo que sugiere la narrativa del Bernabéu.",
      "Ambos equipos superan los 2.1 xG por partido en Champions. El 68% de las 20.000 simulaciones termina con más de 2.5 goles: es la zona donde el mercado más se equivoca.",
      "El City recupera a Rodri tras sanción (+4.3% de probabilidad de victoria visitante respecto a la ida), pero sigue sin Ederson: Ortega concede 0.42 xG más por partido en salidas aéreas.",
      "El árbitro Orsato promedia 5.1 tarjetas en eliminatorias UCL: el over 4.5 tarjetas entra en el rango alto del modelo (58%).",
    ],
    homeAnalysis: {
      form: ["V", "V", "E", "V", "V"],
      formNote: "13 de 15 puntos en las últimas cinco jornadas ligueras, con 12 goles a favor y solo 3 en contra. Llegó líder en solitario tras vencer 3-1 al Betis.",
      attackText:
        "Genera 2.31 xG/90 en Champions, el tercer registro del torneo. El ataque es más directo que otros años: 3.2 pases por posesión ofensiva menos que en 2023, con Vinícius como primer receptor entre líneas (9.4 recepciones progresivas/90). La sociedad Vinícius–Rodrygo–Bellingham participa en el 71% de los remates del equipo.",
      defenseText:
        "Encaja 0.94 xGA/90, mejor registro de LaLiga, pero el dato se degrada a 1.62 en Champions contra rivales de posesión alta. La presión tras pérdida es la 4ª más eficaz de Europa (58% de recuperaciones en menos de 6 s), aunque el costado de Mendy queda expuesto cuando Vinícius no repliega.",
      style: "Bloque medio 4-3-1-2 con transiciones verticales de 2-3 toques. Ancelotti renuncia deliberadamente a la posesión (47% medio en UCL) para atacar el espacio a la espalda de los laterales rivales.",
      keyPlayers: [
        { name: "Vinícius Júnior", pos: "Extremo", figure: "6G · 3A en UCL", note: "Regatea 5.8 veces/90 con éxito del 61%. Walker es el único lateral del torneo que le reduce el impacto." },
        { name: "Jude Bellingham", pos: "Mediapunta", figure: "0.78 xG/90", note: "Llega al área 6.1 veces por partido. Su presencia eleva un 9% la probabilidad de +2.5 goles del equipo." },
        { name: "Federico Valverde", pos: "Interior", figure: "11.9 km/90", note: "Cobertura del carril derecho y llegada: 1.4 tiros desde fuera del área por partido." },
      ],
      context: "Semana limpia de calendario, plantilla al completo salvo Courtois y Alaba. El Bernabéu registra 3.1 goles por noche europea este curso y el club no cae en casa en UCL desde abril de 2022.",
    },
    awayAnalysis: {
      form: ["V", "E", "V", "V", "E"],
      formNote: "Invicto en los últimos diez partidos, aunque encadena dos empates ligueros (Arsenal y Chelsea) que aprietan la Premier.",
      attackText:
        "2.48 xG/90 en Champions, el mejor del torneo junto al Bayern. Haaland acumula 0.92 xG/90 y Foden vive el mejor tramo de su carrera (11 participaciones de gol en los últimos 8 partidos). El ataque posicional genera 4.9 remates/90 desde el carril central, cifra récord del modelo desde 2019.",
      defenseText:
        "0.88 xGA/90 global, pero con Ederson fuera el equipo concede 0.31 xG más por partido en segundas jugadas. La salida con Stones como lateral invertido sufre ante presión orientada al hombre, exactamente lo que propone el Madrid en fase defensiva alta.",
      style: "Posesión estructural 4-2-3-1 con laterales invertidos y alturas extremas de los interiores. Promedia 68% de posesión pero en el Etihad solo tradujo en 3 goles un 3.1 xG acumulado ante este rival.",
      keyPlayers: [
        { name: "Erling Haaland", pos: "Delantero", figure: "1.12 remates claros/90", note: "En el Bernabéu nunca ha marcado: 4 remates a puerta en 180' la temporada pasada." },
        { name: "Phil Foden", pos: "Interior", figure: "0.61 xG+xA/90", note: "Arranca en banda derecha para atacar el perfil de Mendy: el duelo individual más desequilibrante del cruce." },
        { name: "Rodri", pos: "Pivote", figure: "93.4% pases", note: "Vuelve tras sanción. Con él en campo, el City reduce su xGA un 27%. Su disponibilidad es la variable más sensible del modelo." },
      ],
      context: "Tres días de descanso, viaje corto y sin bajas nuevas. Guardiola nunca ha eliminado al Madrid en el Bernabéu (1E · 1D) y el equipo llega con la Premier apretada: posible gestión emocional del esfuerzo.",
    },
    tactics: {
      overview:
        "Choque de modelos: el Madrid cederá balón (proyectado 45%) para explotar transiciones sobre el espacio que deja el City con Walker y Gvardiol en campo contrario. El City buscará encerrar la salida blanca con presión sobre Tchouaméni y aislar a Bellingham con doble pivote. La batalla decisiva: segundas jugadas en campo del Madrid, donde Rodri marca la diferencia.",
      keys: [
        { title: "Presión alta del City vs salida del Madrid", body: "Si el Madrid supera la primera línea (lo logra el 41% de las veces), genera 0.38 xG por transición. Con Ortega en portería, los balones largos a la espalda de la zaga cityzen ganan un 12% de valor." },
        { title: "Carril izquierdo del Madrid", body: "Vinícius vs Walker se proyecta como el duelo con más remates generados del partido (2.7/90). Cuando Vinícius recibe abierto, el xG del Madrid sube a 2.6/90." },
        { title: "Balón parado", body: "El City concede 0.31 xG/90 de ABP sin Stones en el once; el Madrid remata 4.2 veces por partido tras córner. Proyección: 0.45 goles de ABP combinados." },
      ],
      prediction: "Partido de alternativas con tramos de dominio visitante y fases de ida-vuelta tras el 60'. El modelo proyecta 2.8 goles totales y un guion de marcador largo: el empate al descanso paga 2.30 y ocurre en el 26% de las simulaciones.",
    },
    absencesHome: [
      { player: "Thibaut Courtois", pos: "Portero", status: "Confirmado fuera", reason: "Rotura de menisco — baja de larga duración" },
      { player: "David Alaba", pos: "Defensa", status: "Confirmado fuera", reason: "Rotura de ligamento cruzado" },
      { player: "Aurélien Tchouaméni", pos: "Pivote", status: "Duda", reason: "Molestias en el sóleo — prueba en el último entrenamiento" },
    ],
    absencesAway: [
      { player: "Ederson", pos: "Portero", status: "Confirmado fuera", reason: "Fractura en un dedo de la mano" },
      { player: "Kyle Walker", pos: "Lateral", status: "Duda", reason: "Sobrecarga en isquiotibiales — decisión el mismo día" },
      { player: "Nathan Aké", pos: "Defensa", status: "Probable", reason: "Golpe en el tobillo, entrena con el grupo" },
    ],
    lineupHome: ["Lunin (POR)", "Carvajal", "Rüdiger", "Nacho", "Mendy", "Valverde", "Tchouaméni", "Kroos", "Bellingham", "Rodrygo", "Vinícius"],
    lineupAway: ["Ortega (POR)", "Walker", "Dias", "Akanji", "Gvardiol", "Rodri", "Kovacic", "Foden", "De Bruyne", "Grealish", "Haaland"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 2.4, away: 2.6 },
      { label: "Goles en contra", unit: "/partido", home: 0.8, away: 0.9 },
      { label: "xG a favor", unit: "/90", home: 2.31, away: 2.48 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.94, away: 0.88 },
      { label: "Remates totales", unit: "/90", home: 15.8, away: 17.2 },
      { label: "Remates a puerta", unit: "/90", home: 6.1, away: 6.8 },
      { label: "Posesión media", unit: "%", home: 54, away: 68 },
      { label: "Pases completados", unit: "%", home: 86.2, away: 91.4 },
      { label: "Córners a favor", unit: "/90", home: 5.4, away: 6.2 },
      { label: "Tarjetas amarillas", unit: "/90", home: 2.1, away: 1.8 },
      { label: "PPDA (intensidad de presión)", unit: "", home: 9.8, away: 8.1 },
      { label: "Ocasiones claras", unit: "/90", home: 3.1, away: 3.6 },
    ],
    h2h: [
      { date: "09/04/2024", comp: "UCL · Cuartos ida", score: "3-3", result: "E" },
      { date: "17/05/2023", comp: "UCL · Semis vuelta", score: "4-0", result: "V" },
      { date: "09/05/2023", comp: "UCL · Semis ida", score: "1-1", result: "E" },
      { date: "04/05/2022", comp: "UCL · Semis vuelta", score: "3-1", result: "V" },
      { date: "26/04/2022", comp: "UCL · Semis ida", score: "4-3", result: "D" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Real Madrid", prob: 40, odd: 2.35 },
        { label: "X · Empate", prob: 24, odd: 3.60 },
        { label: "2 · Man. City", prob: 36, odd: 2.75 },
      ]},
      { market: "Doble oportunidad", icon: "double", outcomes: [
        { label: "1X · Madrid o empate", prob: 64, odd: 1.55 },
        { label: "12 · Sin empate", prob: 76, odd: 1.30 },
        { label: "X2 · City o empate", prob: 60, odd: 1.62 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 84, odd: 1.24 },
        { label: "Menos de 1.5", prob: 16, odd: 4.20 },
        { label: "Más de 2.5", prob: 68, odd: 1.62 },
        { label: "Menos de 2.5", prob: 32, odd: 2.30 },
        { label: "Más de 3.5", prob: 46, odd: 2.05 },
        { label: "Menos de 3.5", prob: 54, odd: 1.78 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 70, odd: 1.55 },
        { label: "No", prob: 30, odd: 2.50 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Madrid · Más de 13.5 remates", prob: 55, odd: 1.85 },
        { label: "City · Más de 15.5 remates", prob: 57, odd: 1.80 },
        { label: "Madrid · Más de 5.5 a puerta", prob: 54, odd: 1.87 },
        { label: "City · Más de 6.5 a puerta", prob: 53, odd: 1.90 },
        { label: "Haaland · Más de 2.5 remates", prob: 61, odd: 1.72 },
        { label: "Vinícius · Más de 2.5 remates", prob: 56, odd: 1.83 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 9.5", prob: 57, odd: 1.90 },
        { label: "Totales · Menos de 9.5", prob: 43, odd: 1.88 },
        { label: "Madrid · Más de 4.5", prob: 55, odd: 1.85 },
        { label: "City · Más de 5.5", prob: 52, odd: 1.95 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 4.5 amarillas", prob: 58, odd: 1.83 },
        { label: "Menos de 4.5 amarillas", prob: 42, odd: 1.95 },
        { label: "Más de 5.5 amarillas", prob: 41, odd: 2.40 },
        { label: "Expulsión · Sí", prob: 14, odd: 6.50 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Madrid gana alguna mitad", prob: 52, odd: 1.95 },
        { label: "Handicap asiático Madrid -0.25", prob: 49, odd: 2.05 },
        { label: "Handicap asiático City +0.25", prob: 51, odd: 1.85 },
        { label: "Empate al descanso", prob: 41, odd: 2.30 },
        { label: "Gol antes del minuto 30", prob: 38, odd: 2.50 },
      ]},
    ],
    topScores: [
      { score: "2-1", prob: 11.8 },
      { score: "1-1", prob: 10.6 },
      { score: "2-2", prob: 9.4 },
      { score: "1-2", prob: 8.7 },
      { score: "3-2", prob: 6.9 },
    ],
    valuePicks: [
      { market: "Goles Over/Under", pick: "Más de 2.5 goles", odd: 1.62, prob: 68, edge: 10.2, stake: "2.5/5" },
      { market: "Ambos marcan", pick: "BTTS · Sí", odd: 1.55, prob: 70, edge: 8.5, stake: "2/5" },
      { market: "Córners", pick: "Más de 9.5 córners", odd: 1.90, prob: 57, edge: 8.3, stake: "1.5/5" },
      { market: "Tarjetas", pick: "Más de 4.5 tarjetas", odd: 1.83, prob: 58, edge: 6.1, stake: "1/5" },
    ],
    risks: [
      "Tchouaméni es duda hasta última hora: sin él, la probabilidad de victoria local cae 6 puntos y el City gana control de segundas jugadas.",
      "Walker duda: si no juega, el duelo Vinícius–suplente dispara el xG local pero también la varianza del partido.",
      "Eliminatoria abierta: a partir del 75' el guion puede romperse hacia un resultado anómalo (prórroga incluida).",
      "Orsato muestra criterio dispar entre mitades: el mercado de tarjetas tiene cola de distribución amplia.",
    ],
    conclusion: {
      confidence: "media",
      verdict:
        "El modelo no encuentra ventaja en el 1X2 (cuotas eficientes ±2%), pero sí en la familia de goles: la combinación de dos ataques de élite, dos porterías mermadas y un guion de eliminatoria abierta sostiene el Más de 2.5 y el BTTS como entradas principales. La confianza es media por la incertidumbre de Tchouaméni y Walker, que obliga a moderar stakes.",
      mainPicks: [
        { label: "Más de 2.5 goles", odd: 1.62 },
        { label: "Ambos equipos marcan · Sí", odd: 1.55 },
        { label: "Más de 9.5 córners", odd: 1.90 },
      ],
      stake: "2/5 global · entradas individuales entre 1 y 2.5/5",
    },
  },

  /* ----------------------------------------------------------
     2 · ATLÉTICO DE MADRID — FC BARCELONA
     ---------------------------------------------------------- */
  {
    id: "atm-fcb",
    competition: "LaLiga EA Sports",
    compShort: "LALIGA",
    round: "Jornada 28",
    dateLabel: "Hoy",
    time: "18:30",
    venue: "Riyadh Air Metropolitano, Madrid",
    referee: "José Luis Munuera Montero",
    home: { name: "Atlético de Madrid", short: "Atlético", code: "ATM", colors: ["#e23b3b", "#26356e"], manager: "Diego Simeone", ranking: "3º · 61 pts" },
    away: { name: "FC Barcelona", short: "Barcelona", code: "BAR", colors: ["#a50044", "#004d98"], manager: "Xavi Hernández", ranking: "2º · 64 pts" },
    formationHome: "3-5-2",
    formationAway: "4-3-3",
    tags: ["Clásico moderno", "Under estructural", "Valor en 1X"],
    summary: [
      "Duelo directo por el subcampeonato. El Atlético lleva 14 partidos sin perder en el Metropolitano (11V · 3E) y allí promedia 0.6 xGA/90: el mejor registro defensivo de las cinco grandes ligas como local.",
      "El Barcelona llega con 7 bajas entre defensa y mediocampo. Su xGA proyectado sube de 1.05 a 1.38 con los suplentes medidos esta temporada.",
      "El modelo otorga 42% al local frente al 40% implícito del mercado: la doble oportunidad 1X a 1.66 concentra la mayor ventaja de la jornada (edge +14.5%).",
      "Munuera Montero promedia 5.6 tarjetas en duelos Atlético–Barça: contexto favorable al over de tarjetas, aunque con varianza alta.",
    ],
    homeAnalysis: {
      form: ["V", "V", "V", "E", "V"],
      formNote: "Cuatro victorias en las últimas cinco jornadas, 9 goles a favor y 2 en contra. Solo el Madrid suma más puntos en 2024.",
      attackText:
        "1.98 xG/90, décima marca de la liga, pero con una eficiencia del 112%: Griezmann (0.71 xG+xA/90) convierte medio gol por encima de lo esperado. El 38% del ataque nace de robo en campo contrario, el registro más alto de LaLiga.",
      defenseText:
        "0.78 xGA/90 global, 0.60 como local. Giménez–Witsel–Hermoso solo han sido regateados 11 veces en 900 minutos. Oblak firma un +4.2 goles evitados, segundo mejor dato de su carrera.",
      style: "5-3-2 en fase defensiva con carrileros profundos; en ataque muta a 3-4-1-2 con Griezmann de enlace. Ritmo deliberadamente bajo (46.8 posesiones rivales/90, mínimo de la liga).",
      keyPlayers: [
        { name: "Antoine Griezmann", pos: "Segundo punta", figure: "15G · 7A", note: "Ha marcado en 6 de sus últimos 7 partidos contra el Barcelona." },
        { name: "Marcos Llorente", pos: "Carrilero", figure: "1.8 conducciones al área/90", note: "Su duelo con el lateral zurdo culé define el flanco fuerte colchonero." },
        { name: "Jan Oblak", pos: "Portero", figure: "78% paradas", note: "Cinco porterías a cero en las últimas ocho jornadas." },
      ],
      context: "Semana completa de descanso, sin competición europea. Simeone recupera a Koke y solo pierde a Lemar (larga duración). Ambiente de noche grande: 68.000 espectadores y pleno histórico reciente como local ante este rival.",
    },
    awayAnalysis: {
      form: ["V", "E", "V", "V", "D"],
      formNote: "La derrota ante el Girona (4-2) cortó una racha de ocho jornadas invicto y dejó tocada la línea defensiva.",
      attackText:
        "2.26 xG/90, segundo de la liga. Lewandowski (0.84 xG/90) y Lamine Yamal (5.1 regates intentados/90) concentran el 64% de las acciones de remate. El equipo remata 16.4 veces/90 pero su conversión fuera de casa cae al 89% de lo esperado.",
      defenseText:
        "1.05 xGA/90 que se dispara sin Araújo o De Jong en el once: 1.38. La salida de balón sufre ante presiones altas (2.1 pérdidas en primer tercio por partido, máximo de la temporada ante rivales top-6).",
      style: "4-3-3 posicional con interiores altos y extremos a pie cambiado. Presión tras pérdida intensa pero corta: si no recupera en 7 segundos, repliega a bloque medio-bajo.",
      keyPlayers: [
        { name: "Robert Lewandowski", pos: "Delantero", figure: "19G en liga", note: "3 goles en sus últimos 2 visitas al Metropolitano." },
        { name: "Lamine Yamal", pos: "Extremo", figure: "0.54 xA/90", note: "El regateador más desequilibrante de la liga; Hermoso le concede 2.3 duelos ganados/90." },
        { name: "Pedri", pos: "Interior", figure: "91% pases", note: "Duda hasta última hora por sobrecarga; con él el xGA baja un 18%." },
      ],
      context: "Eliminado de Champions, con la liga como único objetivo. Xavi afronta el partido con la defensa en cuadros: sin Araújo (sanción), sin Balde ni Gavi (lesión) y con Pedri entre algodones.",
    },
    tactics: {
      overview:
        "El Atlético entregará la iniciativa (proyección 42% de posesión) para presionar la salida culé con Griezmann y Morata orientando hacia los centrales suplentes. El Barcelona necesitará a Pedri para girar la presión; sin él, el modelo proyecta 2.4 pérdidas peligrosas. Clave: duelos de carrilero vs extremo en ambos costados.",
      keys: [
        { title: "La salida del Barça sin Araújo", body: "Con Cubarsi y Iñigo Martínez como pareja, el xGA del Barcelona sube a 1.52/90 ante presiones altas. El Atlético presiona tras saque de puerta en el 61% de las ocasiones." },
        { title: "Carril derecho colchonero", body: "Llorente + Molina vs Yamal + lateral suplente: el flanco con más duelos individuales proyectados (17 por partido). De ahí nace el 31% del xG local." },
        { title: "Gestión del ritmo", body: "Simeone buscará un partido corto (menos de 92 posesiones totales). Si el Barça supera las 105 posesiones, su probabilidad de victoria sube 11 puntos." },
      ],
      prediction: "Guion de partido trabado, marcador corto y ventaja local en duelos y ABP. El modelo proyecta 2.4 goles totales con el Under 2.5 en el 56% de las simulaciones y el 1-0 / 1-1 como marcadores modales.",
    },
    absencesHome: [
      { player: "Thomas Lemar", pos: "Interior", status: "Confirmado fuera", reason: "Rotura del tendón de Aquiles" },
      { player: "Mario Hermoso", pos: "Defensa", status: "Probable", reason: "Contusión en cadera — entrenó con máscara de protección" },
    ],
    absencesAway: [
      { player: "Ronald Araújo", pos: "Defensa", status: "Sancionado", reason: "Ciclo de amarillas" },
      { player: "Alejandro Balde", pos: "Lateral", status: "Confirmado fuera", reason: "Rotura muscular en el isquio" },
      { player: "Gavi", pos: "Interior", status: "Confirmado fuera", reason: "Rotura de ligamento cruzado" },
      { player: "Pedri", pos: "Interior", status: "Duda", reason: "Sobrecarga en el sóleo — prueba pre-partido" },
      { player: "Frenkie de Jong", pos: "Pivote", status: "Confirmado fuera", reason: "Esguince de tobillo grado II" },
    ],
    lineupHome: ["Oblak (POR)", "Witsel", "Giménez", "Hermoso", "Molina", "Llorente", "Koke", "De Paul", "Lino", "Griezmann", "Morata"],
    lineupAway: ["Ter Stegen (POR)", "Koundé", "Cubarsi", "I. Martínez", "Cancelo", "Romeu", "Gündogan", "Pedri", "Yamal", "Lewandowski", "João Félix"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 1.9, away: 2.1 },
      { label: "Goles en contra", unit: "/partido", home: 0.8, away: 1.1 },
      { label: "xG a favor", unit: "/90", home: 1.98, away: 2.26 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.78, away: 1.05 },
      { label: "Remates totales", unit: "/90", home: 13.2, away: 16.4 },
      { label: "Remates a puerta", unit: "/90", home: 5.2, away: 6.0 },
      { label: "Posesión media", unit: "%", home: 51, away: 63 },
      { label: "Pases completados", unit: "%", home: 82.7, away: 89.1 },
      { label: "Córners a favor", unit: "/90", home: 5.1, away: 5.8 },
      { label: "Tarjetas amarillas", unit: "/90", home: 2.6, away: 2.2 },
      { label: "Duelos ganados", unit: "%", home: 53.4, away: 49.8 },
      { label: "Ocasiones claras", unit: "/90", home: 2.4, away: 2.9 },
    ],
    h2h: [
      { date: "03/12/2023", comp: "LaLiga · J15", score: "1-0", result: "V" },
      { date: "23/04/2023", comp: "LaLiga · J30", score: "1-0", result: "V" },
      { date: "08/01/2023", comp: "LaLiga · J16", score: "0-1", result: "D" },
      { date: "06/02/2022", comp: "LaLiga · J23", score: "4-2", result: "V" },
      { date: "02/10/2021", comp: "LaLiga · J8", score: "2-0", result: "V" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Atlético", prob: 42, odd: 2.10 },
        { label: "X · Empate", prob: 27, odd: 3.30 },
        { label: "2 · Barcelona", prob: 31, odd: 2.95 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · Atlético o empate", prob: 69, odd: 1.66 },
        { label: "12 · Sin empate", prob: 73, odd: 1.36 },
        { label: "X2 · Barça o empate", prob: 58, odd: 1.70 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 74, odd: 1.42 },
        { label: "Menos de 1.5", prob: 26, odd: 2.85 },
        { label: "Más de 2.5", prob: 44, odd: 2.05 },
        { label: "Menos de 2.5", prob: 56, odd: 1.72 },
        { label: "Más de 3.5", prob: 24, odd: 3.40 },
        { label: "Menos de 3.5", prob: 76, odd: 1.28 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 55, odd: 1.85 },
        { label: "No", prob: 45, odd: 1.95 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Atlético · Más de 11.5 remates", prob: 58, odd: 1.80 },
        { label: "Barça · Más de 13.5 remates", prob: 60, odd: 1.75 },
        { label: "Atlético · Más de 4.5 a puerta", prob: 55, odd: 1.83 },
        { label: "Griezmann · Más de 1.5 a puerta", prob: 52, odd: 1.90 },
        { label: "Lewandowski · Más de 2.5 remates", prob: 59, odd: 1.72 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 9.5", prob: 52, odd: 1.95 },
        { label: "Totales · Menos de 9.5", prob: 48, odd: 1.85 },
        { label: "Atlético · Más de 4.5", prob: 56, odd: 1.83 },
        { label: "Barça · Más de 5.5", prob: 50, odd: 1.98 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 4.5 amarillas", prob: 63, odd: 1.72 },
        { label: "Menos de 4.5 amarillas", prob: 37, odd: 2.10 },
        { label: "Más de 5.5 amarillas", prob: 47, odd: 2.05 },
        { label: "Expulsión · Sí", prob: 17, odd: 5.50 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Atlético gana alguna mitad", prob: 55, odd: 1.85 },
        { label: "Handicap asiático Atlético -0.25", prob: 51, odd: 1.95 },
        { label: "Empate al descanso", prob: 43, odd: 2.20 },
        { label: "Menos de 10.5 posesiones en área Barça", prob: 46, odd: 2.10 },
      ]},
    ],
    topScores: [
      { score: "1-1", prob: 12.4 },
      { score: "1-0", prob: 11.2 },
      { score: "2-1", prob: 10.1 },
      { score: "0-0", prob: 6.9 },
      { score: "2-0", prob: 6.5 },
    ],
    valuePicks: [
      { market: "Doble oportunidad", pick: "1X · Atlético o empate", odd: 1.66, prob: 69, edge: 14.5, stake: "3/5" },
      { market: "Goles Over/Under", pick: "Menos de 3.5 goles", odd: 1.42, prob: 76, edge: 7.9, stake: "2/5" },
      { market: "Tarjetas", pick: "Más de 4.5 tarjetas", odd: 1.72, prob: 63, edge: 8.4, stake: "1.5/5" },
    ],
    risks: [
      "Si Pedri juega de inicio, el Barça gana una vía para esquivar la presión y el edge del 1X se reduce a la mitad.",
      "El Atlético rota poco pero llega con más carga competitiva acumulada que su rival: riesgo físico en el último tercio.",
      "Árbitro con historial de criterios cambiantes en este cruce: el mercado de tarjetas es el de mayor varianza del panel.",
    ],
    conclusion: {
      confidence: "alta",
      verdict:
        "La combinación de fortaleza local extrema (0.60 xGA/90 en casa), la crisis defensiva visitante por bajas y la ineficiencia del mercado en la doble oportunidad (1X a 1.66 vs 69% real) convierte esta en la entrada más sólida de la jornada. Complemento conservador: Under 3.5, coherente con el guion trabado proyectado.",
      mainPicks: [
        { label: "1X · Atlético o empate", odd: 1.66 },
        { label: "Menos de 3.5 goles", odd: 1.42 },
        { label: "Más de 4.5 tarjetas", odd: 1.72 },
      ],
      stake: "3/5 global · entrada principal 1X con 3/5",
    },
  },

  /* ----------------------------------------------------------
     3 · ARSENAL — LIVERPOOL  (acceso libre completo)
     ---------------------------------------------------------- */
  {
    id: "ars-liv",
    competition: "Premier League",
    compShort: "PL",
    round: "Jornada 30",
    dateLabel: "Hoy",
    time: "17:30",
    venue: "Emirates Stadium, Londres",
    referee: "Michael Oliver",
    freeAccess: true,
    home: { name: "Arsenal", short: "Arsenal", code: "ARS", colors: ["#ef0107", "#ffffff"], manager: "Mikel Arteta", ranking: "1º · 68 pts" },
    away: { name: "Liverpool", short: "Liverpool", code: "LIV", colors: ["#c8102e", "#00b2a9"], manager: "Jürgen Klopp", ranking: "2º · 67 pts" },
    formationHome: "4-3-3",
    formationAway: "4-3-3",
    tags: ["Acceso libre", "Título en juego", "Under táctico"],
    summary: [
      "Final anticipada por el título. En los últimos seis enfrentamientos directos solo se han marcado 9 goles: el modelo proyecta 2.2 y sitúa el Under 2.5 en el 58% (cuota 1.90 → edge +10%).",
      "El Arsenal encadena 8 victorias seguidas en casa con 7 porterías a cero. Su xGA de 0.62/90 en 2024 es el mejor de Europa.",
      "El Liverpool rinde lejos de Anfield (2.3 xG/90 fuera), pero Klopp no ha ganado en el Emirates desde 2020 y llega con la enfermería llena en el mediocampo.",
      "Análisis completo disponible para todos los usuarios registrados como muestra del nivel de profundidad Premium.",
    ],
    homeAnalysis: {
      form: ["V", "V", "V", "V", "V"],
      formNote: "Ocho victorias consecutivas, 26 goles a favor y 3 en contra. Goleada 6-0 al Sheffield en la última jornada.",
      attackText:
        "2.52 xG/90, máximo de la Premier. Saka (0.79 xG+xA/90) y Ødegaard (6.3 pases clave/90) articulan el mejor ataque posicional de la liga. El 29% de sus goles llega tras robo alto, señal de una presión coordinada de élite.",
      defenseText:
        "0.62 xGA/90 en 2024. Saliba–Gabriel gana el 74% de los duelos aéreos y Raya lidera la liga en goles prevenidos (+6.8). Solo conceden 7.9 remates/90, mínimo histórico del club.",
      style: "4-3-3 posicional con laterales invertidos (White/Zinchenko) y Rice como ancla. Posesión media 58%, pero con ataque directo al espacio cuando Saka recibe abierto.",
      keyPlayers: [
        { name: "Bukayo Saka", pos: "Extremo", figure: "16G · 9A", note: "Ha participado en gol en 7 de sus últimos 8 partidos como local." },
        { name: "Declan Rice", pos: "Pivote", figure: "3.1 intercepciones/90", note: "Su duelo con Mac Allister ordena toda la fase defensiva gunner." },
        { name: "William Saliba", pos: "Defensa", figure: "71% duelos ganados", note: "Con él en campo, el Arsenal encaja 0.54 xGA/90; sin él, 1.41." },
      ],
      context: "Una sola baja relevante (Tierney). El Emirates vivirá su primera 'final' de liga desde 2004: factor motivacional alto pero controlado según el historial reciente del grupo en partidos decisivos.",
    },
    awayAnalysis: {
      form: ["V", "E", "V", "V", "V"],
      formNote: "Una derrota en las últimas doce jornadas. Empate 2-2 ante el United en la última fecha.",
      attackText:
        "2.44 xG/90. Salah (0.98 xG+xA/90) firma el 41% de las acciones de remate del equipo. Fuera de casa el registro sube a 2.31 xG/90: es el visitante más prolífico de la liga.",
      defenseText:
        "1.14 xGA/90 que se degrada a 1.36 sin su mediocampo titular. Van Dijk sostiene el área (82% duelos aéreos) pero el equipo concede 3.2 transiciones peligrosas/90, máximo entre los seis primeros.",
      style: "4-3-3 de presión vertical con laterales de recorrido total (Alexander-Arnold como organizador) y transiciones de menos de 10 segundos. El plan exige un mediocampo que ahora está en la enfermería.",
      keyPlayers: [
        { name: "Mohamed Salah", pos: "Extremo", figure: "18G · 10A", note: "4 goles en sus últimas 5 visitas a Londres." },
        { name: "Virgil van Dijk", pos: "Defensa", figure: "82% duelos aéreos", note: "Su ausencia en la ida (3-1 para el Arsenal) disparó el xG rival a 2.9." },
        { name: "Alexis Mac Allister", pos: "Interior", figure: "88% pases bajo presión", note: "Único mediocampista titular disponible: su amarilla temprana cambiaría el plan de Klopp." },
      ],
      context: "Bajas de Gravenberch, Szoboszlai y Thiago en el mediocentro. Klopp juega su última temporada en Anfield; el calendario de Europa League añade fatiga acumulada de jueves.",
    },
    tactics: {
      overview:
        "Arteta preparará un plan de control: posesión 55%, alturas medias y castigo al espacio que deja Alexander-Arnold. Klopp necesita convertir el partido en una sucesión de transiciones; para ello debe robar alto, algo que su mediocentro mermado hace con menos frecuencia (−18% de robos en campo contrario).",
      keys: [
        { title: "El costado Salah–White", body: "Salah genera 0.98 xG+xA/90 atacando el perfil de White. Cuando Ben White recibe ayuda de Rice, su producción cae a 0.41: el ajuste defensivo clave del Arsenal." },
        { title: "Robo alto del Arsenal", body: "Los gunners roban 8.4 veces en campo contrario por partido; el Liverpool con suplentes en el eje pierde 2.1 balones más que su media en salida. Proyección: 0.5 xG local desde robo alto." },
        { title: "ABP como igualador", body: "El Liverpool concede 0.38 xG/90 de ABP fuera de casa y el Arsenal es el mejor rematador de la liga tras córner (5.1 remates/90). El 22% de las simulaciones incluye un gol de ABP del Arsenal." },
      ],
      prediction: "Partido de alta intensidad y pocos goles: el 58% de las simulaciones acaba Under 2.5 y el Arsenal gana el 44%. Guion probable: 1-0 o 2-1 con gol tardío local (el 34% de los goles simulados llega tras el 75').",
    },
    absencesHome: [
      { player: "Kieran Tierney", pos: "Lateral", status: "Confirmado fuera", reason: "Lesión muscular leve" },
      { player: "Takehiro Tomiyasu", pos: "Defensa", status: "Duda", reason: "Molestias en la rodilla" },
    ],
    absencesAway: [
      { player: "Ryan Gravenberch", pos: "Interior", status: "Confirmado fuera", reason: "Lesión de tobillo" },
      { player: "Dominik Szoboszlai", pos: "Interior", status: "Confirmado fuera", reason: "Problema en isquiotibiales" },
      { player: "Thiago Alcántara", pos: "Pivote", status: "Confirmado fuera", reason: "Larga duración — cadera" },
      { player: "Trent Alexander-Arnold", pos: "Lateral", status: "Duda", reason: "Gestión de cargas tras Europa League" },
    ],
    lineupHome: ["Raya (POR)", "White", "Saliba", "Gabriel", "Zinchenko", "Ødegaard", "Rice", "Havertz", "Saka", "Trossard", "Martinelli"],
    lineupAway: ["Kelleher (POR)", "Bradley", "Konaté", "Van Dijk", "Robertson", "Endo", "Mac Allister", "Jones", "Salah", "Núñez", "Díaz"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 2.5, away: 2.4 },
      { label: "Goles en contra", unit: "/partido", home: 0.7, away: 1.0 },
      { label: "xG a favor", unit: "/90", home: 2.52, away: 2.44 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.62, away: 1.14 },
      { label: "Remates totales", unit: "/90", home: 16.1, away: 15.7 },
      { label: "Remates a puerta", unit: "/90", home: 6.4, away: 6.1 },
      { label: "Posesión media", unit: "%", home: 58, away: 61 },
      { label: "Pases completados", unit: "%", home: 87.4, away: 84.9 },
      { label: "Córners a favor", unit: "/90", home: 6.8, away: 5.9 },
      { label: "Tarjetas amarillas", unit: "/90", home: 1.9, away: 2.0 },
      { label: "Presión alta exitosa", unit: "%", home: 41, away: 34 },
      { label: "Ocasiones claras", unit: "/90", home: 3.2, away: 3.0 },
    ],
    h2h: [
      { date: "23/12/2023", comp: "Premier League · J18", score: "1-1", result: "E" },
      { date: "09/04/2023", comp: "Premier League · J30", score: "2-2", result: "E" },
      { date: "09/10/2022", comp: "Premier League · J10", score: "3-2", result: "V" },
      { date: "16/03/2022", comp: "Premier League · J27", score: "0-2", result: "D" },
      { date: "20/11/2021", comp: "Premier League · J12", score: "4-0", result: "V" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Arsenal", prob: 44, odd: 2.05 },
        { label: "X · Empate", prob: 28, odd: 3.40 },
        { label: "2 · Liverpool", prob: 28, odd: 2.90 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · Arsenal o empate", prob: 72, odd: 1.44 },
        { label: "12 · Sin empate", prob: 72, odd: 1.36 },
        { label: "X2 · Liverpool o empate", prob: 56, odd: 1.72 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 78, odd: 1.33 },
        { label: "Menos de 1.5", prob: 22, odd: 3.40 },
        { label: "Más de 2.5", prob: 42, odd: 2.10 },
        { label: "Menos de 2.5", prob: 58, odd: 1.90 },
        { label: "Más de 3.5", prob: 22, odd: 3.60 },
        { label: "Menos de 3.5", prob: 78, odd: 1.25 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 48, odd: 1.72 },
        { label: "No", prob: 52, odd: 2.10 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Arsenal · Más de 13.5 remates", prob: 62, odd: 1.72 },
        { label: "Liverpool · Más de 11.5 remates", prob: 57, odd: 1.80 },
        { label: "Saka · Más de 2.5 remates", prob: 58, odd: 1.75 },
        { label: "Salah · Más de 2.5 remates", prob: 60, odd: 1.70 },
        { label: "Raya · Más de 3.5 paradas", prob: 55, odd: 1.85 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 10.5", prob: 55, odd: 1.90 },
        { label: "Arsenal · Más de 5.5", prob: 58, odd: 1.80 },
        { label: "Liverpool · Más de 4.5", prob: 54, odd: 1.85 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 3.5 amarillas", prob: 61, odd: 1.75 },
        { label: "Más de 4.5 amarillas", prob: 44, odd: 2.20 },
        { label: "Michael Oliver · Más de 3.5", prob: 64, odd: 1.70 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Arsenal gana alguna mitad", prob: 57, odd: 1.78 },
        { label: "Handicap asiático Arsenal -0.25", prob: 53, odd: 1.90 },
        { label: "Gol tras el minuto 75", prob: 46, odd: 2.05 },
        { label: "Empate al descanso", prob: 40, odd: 2.35 },
      ]},
    ],
    topScores: [
      { score: "1-0", prob: 12.9 },
      { score: "1-1", prob: 11.8 },
      { score: "2-1", prob: 10.4 },
      { score: "2-0", prob: 8.9 },
      { score: "0-1", prob: 6.8 },
    ],
    valuePicks: [
      { market: "Goles Over/Under", pick: "Menos de 2.5 goles", odd: 1.90, prob: 58, edge: 10.2, stake: "2.5/5" },
      { market: "Ambos marcan", pick: "BTTS · No", odd: 2.10, prob: 52, edge: 9.2, stake: "1.5/5" },
      { market: "Remates", pick: "Arsenal más de 13.5 remates", odd: 1.72, prob: 62, edge: 6.6, stake: "1/5" },
    ],
    risks: [
      "Partido de título: la carga emocional eleva la varianza de tarjetas y de guion en los últimos 20 minutos.",
      "Si Alexander-Arnold juega de inicio, la salida del Liverpool mejora sensiblemente y el Under pierde 5 puntos de probabilidad.",
      "Oliver es el árbitro con más revisiones VAR de la liga: riesgo de penalti/roja que rompa el modelo de goles.",
    ],
    conclusion: {
      confidence: "media",
      verdict:
        "El mercado sobreestima el espectáculo de dos ataques élite y subestima dos defensas en gran momento y un mediocentro visitante mermado. El Under 2.5 a 1.90 es la lectura con mejor relación ventaja/varianza de la jornada inglesa. El BTTS-No complementa el mismo guion.",
      mainPicks: [
        { label: "Menos de 2.5 goles", odd: 1.90 },
        { label: "BTTS · No", odd: 2.10 },
        { label: "Arsenal más de 13.5 remates", odd: 1.72 },
      ],
      stake: "2.5/5 global · entrada principal Under 2.5 con 2.5/5",
    },
  },

  /* ----------------------------------------------------------
     4 · INTER — JUVENTUS
     ---------------------------------------------------------- */
  {
    id: "int-juv",
    competition: "Serie A",
    compShort: "SERIEA",
    round: "Jornada 29",
    dateLabel: "Hoy",
    time: "20:45",
    venue: "San Siro, Milán",
    referee: "Davide Massa",
    home: { name: "Inter de Milán", short: "Inter", code: "INT", colors: ["#0068c8", "#221f20"], manager: "Simone Inzaghi", ranking: "1º · 75 pts" },
    away: { name: "Juventus", short: "Juventus", code: "JUV", colors: ["#d9d9d9", "#101010"], manager: "Massimiliano Allegri", ranking: "3º · 59 pts" },
    formationHome: "3-5-2",
    formationAway: "3-5-2",
    tags: ["Derbi de Italia", "Bloques bajos", "Under 2.5"],
    summary: [
      "El Inter llega invicto en 2024 (14V · 2E) con 2.35 xG/90; la Juve solo ha encajado 22 goles en 28 jornadas, la mejor defensa de la liga.",
      "En los últimos cinco derbis de Italia: 7 goles totales. El modelo proyecta 2.1 y sitúa el Under 2.5 en el 63%.",
      "El Inter gana la Serie A virtualmente (16 puntos de ventaja): posible gestión de esfuerzos pensando en Champions.",
    ],
    homeAnalysis: {
      form: ["V", "V", "V", "E", "V"],
      formNote: "13 partidos sin perder, con 34 goles a favor en ese tramo. Goleada 4-0 al Empoli en la última jornada.",
      attackText: "2.35 xG/90 con Lautaro (0.89 xG/90) en temporada récord. Los carrileros generan el 31% de las ocasiones: Dumfries y Dimarco suman 19 asistencias conjuntas.",
      defenseText: "0.71 xGA/90. El 3-5-2 de Inzaghi concede solo 7.4 remates/90 y gana el 68% de los duelos aéreos defensivos.",
      style: "3-5-2 de presión media con salida elaborada por Bastoni y ataque directo a los carriles. El mejor ataque posicional de Italia.",
      keyPlayers: [
        { name: "Lautaro Martínez", pos: "Delantero", figure: "23G en liga", note: "5 goles en derbis de Italia; racha de 6 jornadas marcando." },
        { name: "Federico Dimarco", pos: "Carrilero", figure: "0.48 xA/90", note: "Máximo asistente de la liga entre defensas." },
        { name: "Hakan Çalhanoğlu", pos: "Pivote", figure: "91% pases", note: "Ordena la salida y amenaza desde ABP (4 goles de falta)." },
      ],
      context: "Título virtualmente cerrado y Champions en el horizonte: Inzaghi podría rotar a uno de sus interiores. San Siro presentará lleno total.",
    },
    awayAnalysis: {
      form: ["E", "V", "E", "E", "V"],
      formNote: "Solo una derrota en 14 jornadas, pero cinco empates en ese tramo: el equipo que más empata de la zona alta.",
      attackText: "1.68 xG/90, séptimo de la liga. Vlahovic (0.74 xG/90) concentra el 38% de los remates del equipo. Ataque previsible pero eficaz en ABP (11 goles).",
      defenseText: "0.79 xGA/90 con Bremer como mejor central de la Serie A (74% duelos ganados). Szczesny suma 14 porterías a cero.",
      style: "5-3-2 de bloque bajo, transiciones largas hacia Vlahovic–Chiesa y ABP como arma principal. Posesión media 48%, la más baja del top-5 italiano.",
      keyPlayers: [
        { name: "Dusan Vlahovic", pos: "Delantero", figure: "15G en liga", note: "Su único doblete de la temporada fue contra el Inter en la ida." },
        { name: "Gleison Bremer", pos: "Defensa", figure: "74% duelos", note: "Encargado de Lautaro: en la ida perdió el duelo individual (2 goles del argentino)." },
        { name: "Federico Chiesa", pos: "Extremo", figure: "4.2 conducciones/90", note: "La única vía de ruptura en transición de la Juve." },
      ],
      context: "Eliminada de Europa y con el objetivo mínimo de la Champions. Allegri bajo presión mediática tras tres empates seguidos; el vestuario llega necesitado de un resultado de prestigio.",
    },
    tactics: {
      overview: "Duelo espejo 3-5-2. El Inter dominará el balón (58% proyectado) y la Juve buscará el error en salida y el ABP. El duelo Lautaro–Bremer y el control de los carriles definirán el marcador.",
      keys: [
        { title: "Carriles del Inter", body: "Dimarco y Dumfries proyectan 2.1 ocasiones/90 cada uno; la Juve defiende los carriles con interiores, lo que libera pasillos interiores para Barella." },
        { title: "ABP visitante", body: "La Juve genera 0.42 xG/90 de ABP, máximo de la liga. El Inter concede poco en juego pero es el 4º peor en defensa de faltas laterales." },
        { title: "Ritmo bajo", body: "Allegri buscará un partido de menos de 90 posesiones totales. El Inter acepta ritmos bajos mejor que ningún rival de la zona alta." },
      ],
      prediction: "Under estructural con el Inter controlando y la Juve esperando. Proyección 2.1 goles, 1-0 y 1-1 como marcadores modales.",
    },
    absencesHome: [
      { player: "Stefan de Vrij", pos: "Defensa", status: "Duda", reason: "Sobrecarga muscular" },
      { player: "Juan Cuadrado", pos: "Carrilero", status: "Confirmado fuera", reason: "Tendinitis crónica — gestión" },
    ],
    absencesAway: [
      { player: "Arkadiusz Milik", pos: "Delantero", status: "Confirmado fuera", reason: "Lesión muscular" },
      { player: "Mattia De Sciglio", pos: "Defensa", status: "Confirmado fuera", reason: "Rotura de cruzado" },
      { player: "Adrien Rabiot", pos: "Interior", status: "Probable", reason: "Golpe en el gemelo — entrena parcial" },
    ],
    lineupHome: ["Sommer (POR)", "Pavard", "Acerbi", "Bastoni", "Dumfries", "Barella", "Çalhanoğlu", "Mkhitaryan", "Dimarco", "Thuram", "L. Martínez"],
    lineupAway: ["Szczesny (POR)", "Gatti", "Bremer", "Danilo", "Cambiaso", "McKennie", "Locatelli", "Rabiot", "Kostic", "Vlahovic", "Chiesa"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 2.5, away: 1.5 },
      { label: "Goles en contra", unit: "/partido", home: 0.6, away: 0.8 },
      { label: "xG a favor", unit: "/90", home: 2.35, away: 1.68 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.71, away: 0.79 },
      { label: "Remates totales", unit: "/90", home: 15.9, away: 12.1 },
      { label: "Remates a puerta", unit: "/90", home: 6.2, away: 4.8 },
      { label: "Posesión media", unit: "%", home: 57, away: 48 },
      { label: "Pases completados", unit: "%", home: 87.9, away: 83.4 },
      { label: "Córners a favor", unit: "/90", home: 6.1, away: 4.4 },
      { label: "Tarjetas amarillas", unit: "/90", home: 1.7, away: 2.4 },
      { label: "Ocasiones claras", unit: "/90", home: 3.0, away: 1.9 },
    ],
    h2h: [
      { date: "26/11/2023", comp: "Serie A · J13", score: "1-0", result: "D" },
      { date: "26/04/2023", comp: "Coppa Italia · Semis", score: "1-0", result: "D" },
      { date: "19/03/2023", comp: "Serie A · J27", score: "0-1", result: "V" },
      { date: "06/11/2022", comp: "Serie A · J13", score: "2-0", result: "V" },
      { date: "03/04/2022", comp: "Serie A · J31", score: "0-1", result: "V" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Inter", prob: 46, odd: 1.95 },
        { label: "X · Empate", prob: 29, odd: 3.25 },
        { label: "2 · Juventus", prob: 25, odd: 3.40 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · Inter o empate", prob: 75, odd: 1.33 },
        { label: "12 · Sin empate", prob: 71, odd: 1.38 },
        { label: "X2 · Juve o empate", prob: 54, odd: 1.72 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 71, odd: 1.48 },
        { label: "Menos de 1.5", prob: 29, odd: 2.65 },
        { label: "Más de 2.5", prob: 37, odd: 2.20 },
        { label: "Menos de 2.5", prob: 63, odd: 1.72 },
        { label: "Más de 3.5", prob: 18, odd: 4.50 },
        { label: "Menos de 3.5", prob: 82, odd: 1.18 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 47, odd: 1.85 },
        { label: "No", prob: 53, odd: 1.95 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Inter · Más de 14.5 remates", prob: 56, odd: 1.83 },
        { label: "Juve · Menos de 10.5 remates", prob: 58, odd: 1.78 },
        { label: "L. Martínez · Más de 2.5 remates", prob: 57, odd: 1.75 },
        { label: "Vlahovic · Más de 2.5 remates", prob: 52, odd: 1.90 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 8.5", prob: 56, odd: 1.85 },
        { label: "Inter · Más de 5.5", prob: 57, odd: 1.80 },
        { label: "Juve · Menos de 4.5", prob: 55, odd: 1.83 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 4.5 amarillas", prob: 60, odd: 1.75 },
        { label: "Más de 5.5 amarillas", prob: 43, odd: 2.15 },
        { label: "Juve · Más de 2.5 tarjetas", prob: 58, odd: 1.80 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Inter gana alguna mitad", prob: 58, odd: 1.75 },
        { label: "Handicap asiático Inter -0.5", prob: 46, odd: 1.95 },
        { label: "Empate al descanso", prob: 42, odd: 2.25 },
      ]},
    ],
    topScores: [
      { score: "1-0", prob: 13.6 },
      { score: "1-1", prob: 12.1 },
      { score: "2-1", prob: 9.8 },
      { score: "2-0", prob: 9.2 },
      { score: "0-0", prob: 7.4 },
    ],
    valuePicks: [
      { market: "Goles Over/Under", pick: "Menos de 2.5 goles", odd: 1.72, prob: 63, edge: 8.4, stake: "2/5" },
      { market: "Remates", pick: "Juve menos de 10.5 remates", odd: 1.78, prob: 58, edge: 3.2, stake: "1/5" },
    ],
    risks: [
      "Posibles rotaciones del Inter con la Champions a tres días: la alineación definitiva puede mover el modelo hasta 6 puntos.",
      "La Juve de Allegri en partidos grandes rinde por encima de su xG histórico: sesgo de plan conservador eficaz.",
      "Massa promedia 4.8 tarjetas en derbis: el over de tarjetas tiene varianza amplia.",
    ],
    conclusion: {
      confidence: "baja",
      verdict: "La lectura direccional es sólida (Inter mejor, partido corto) pero la incertidumbre de rotaciones locales degrada la confianza. El Under 2.5 es el mercado más robusto porque sobrevive a ambos onces probables; el 1X2 se evita hasta ver alineaciones.",
      mainPicks: [
        { label: "Menos de 2.5 goles", odd: 1.72 },
        { label: "Inter gana alguna mitad", odd: 1.75 },
      ],
      stake: "1.5/5 global · esperar alineaciones confirmadas",
    },
  },

  /* ----------------------------------------------------------
     5 · BAYERN — DORTMUND  (EN VIVO · demo)
     ---------------------------------------------------------- */
  {
    id: "bay-bvb",
    competition: "Bundesliga",
    compShort: "BUNDES",
    round: "Jornada 26 · Der Klassiker",
    dateLabel: "Hoy",
    time: "18:30",
    venue: "Allianz Arena, Múnich",
    referee: "Deniz Aytekin",
    live: { minute: 63, home: 2, away: 1 },
    home: { name: "Bayern de Múnich", short: "Bayern", code: "BAY", colors: ["#dc052d", "#ffffff"], manager: "Thomas Tuchel", ranking: "2º · 57 pts" },
    away: { name: "Borussia Dortmund", short: "Dortmund", code: "BVB", colors: ["#fde100", "#1a1a1a"], manager: "Edin Terzic", ranking: "4º · 50 pts" },
    formationHome: "4-2-3-1",
    formationAway: "4-3-3",
    tags: ["En juego", "Der Klassiker", "Over 2.5 vivo"],
    summary: [
      "Partido en curso (2-1, min 63). El modelo en vivo otorga al Bayern un 71% de victoria tras el segundo gol de Kane.",
      "Pre-partido: la entrada principal era el over de goles, validada en directo con 3 goles y 2.9 xG combinado ya registrados.",
      "El Dortmund gana solo el 31% de las segundas jugadas: con el Bayern volcado en campo contrario, el 3-1 aparece en el 18% de las simulaciones en vivo.",
    ],
    homeAnalysis: {
      form: ["V", "V", "D", "V", "V"],
      formNote: "9 goles en los últimos dos partidos en casa. Kane suma 31 goles en liga, a 10 del récord histórico.",
      attackText: "2.71 xG/90, el mejor ataque de Europa junto al City. Kane (1.05 xG/90) y Musiala (5.4 regates/90) generan el 58% de las acciones de remate. El 34% de los ataques acaba en remate.",
      defenseText: "1.12 xGA/90, cifra alta para su estándar. Sufre en transiciones tras pérdida (3.1 por partido), exactamente el plan del Dortmund en la primera mitad.",
      style: "4-2-3-1 de posesión alta (66%) con presión tras pérdida de 6 segundos y laterales profundísimos. Volumen ofensivo casi sin igual en Europa.",
      keyPlayers: [
        { name: "Harry Kane", pos: "Delantero", figure: "31G en liga", note: "Doblete ya en este Klassiker; 8 goles en 7 derbis." },
        { name: "Jamal Musiala", pos: "Mediapunta", figure: "5.4 regates/90", note: "Su conducción rompió el bloque bajo del BVB en el 2-1." },
        { name: "Leroy Sané", pos: "Extremo", figure: "0.62 xG+xA/90", note: "Máximo regateador de la Bundesliga con éxito del 57%." },
      ],
      context: "Última bala liguera tras la derrota ante el Leverkusen: una derrota dejaría la Bundesliga virtualmente sentenciada. Carga emocional máxima en el Allianz.",
    },
    awayAnalysis: {
      form: ["V", "E", "V", "V", "D"],
      formNote: "Tres victorias seguidas antes de este Klassiker, con 8 goles a favor y pleno de eficacia de Adeyemi (4G en 3 jornadas).",
      attackText: "1.94 xG/90. Adeyemi y Sancho atacan el espacio a la espalda de los laterales del Bayern: 2.4 transiciones peligrosas por partido, la vía del gol del 1-1.",
      defenseText: "1.18 xGA/90 que se degrada fuera de casa (1.34). El bloque bajo concede 17 remates/90 ante rivales top-3: cifra que ya se cumple en este partido.",
      style: "4-3-3 de bloque medio-bajo con transiciones de tres toques hacia Adeyemi. Fuera de casa renuncia al balón (44% de media) y vive del error rival.",
      keyPlayers: [
        { name: "Karim Adeyemi", pos: "Extremo", figure: "0.71 xG/90", note: "Autor del 1-1 con una carrera de 40 metros al espacio." },
        { name: "Julian Brandt", pos: "Interior", figure: "3.2 pases clave/90", note: "Conecta la transición con el último pase: 2 ocasiones ya hoy." },
        { name: "Gregor Kobel", pos: "Portero", figure: "6 paradas hoy", note: "Mantiene vivo al BVB: +1.4 goles evitados en el partido." },
      ],
      context: "Con la Champions asegurada y sin presión de título, juega sin miedo. Pero su banquillo corto limita la reacción física tras el minuto 70.",
    },
    tactics: {
      overview: "El guion pre-partido se cumple: Bayern con el 64% de posesión y el Dortmund golpeando en transición. La clave del último tramo: el banquillo. Tuchel tiene a Coman y Müller para sostener el ataque; Terzic agotó las ventanas de refresco.",
      keys: [
        { title: "Transiciones del BVB agotadas", body: "El Dortmund completa el 28% de sus transiciones en la segunda mitad (41% en la primera). Con el Bayern replegado tras el 2-1, su vía de gol se estrecha." },
        { title: "Musiala entre líneas", body: "Con el BVB estirado buscando el empate, Musiala recibe entre pivote y defensa: 4 conducciones progresivas tras el descanso, origen del 2-1." },
        { title: "ABP como seguro", body: "El Bayern genera 0.51 xG/90 de ABP hoy: un córner cierra el partido en el 21% de las simulaciones en vivo." },
      ],
      prediction: "El modelo en vivo proyecta el 3-1 como resultado más probable del tramo final (18%) y da al over 3.5 un 41% con 27 minutos por jugarse.",
    },
    absencesHome: [
      { player: "Kingsley Coman", pos: "Extremo", status: "Probable", reason: "Suplente por gestión de cargas — disponible" },
      { player: "Manuel Neuer", pos: "Portero", status: "Probable", reason: "Titular tras superar molestias en aductor" },
    ],
    absencesAway: [
      { player: "Sébastien Haller", pos: "Delantero", status: "Confirmado fuera", reason: "Lesión muscular" },
      { player: "Niklas Süle", pos: "Defensa", status: "Confirmado fuera", reason: "Rotura fibrilar" },
    ],
    lineupHome: ["Neuer (POR)", "Kimmich", "Upamecano", "Kim", "Guerreiro", "Goretzka", "Pavlovic", "Sané", "Musiala", "Tel", "Kane"],
    lineupAway: ["Kobel (POR)", "Ryerson", "Hummels", "Schlotterbeck", "Maatsen", "Can", "Özcan", "Brandt", "Sancho", "Füllkrug", "Adeyemi"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 2.7, away: 1.9 },
      { label: "Goles en contra", unit: "/partido", home: 1.1, away: 1.2 },
      { label: "xG a favor", unit: "/90", home: 2.71, away: 1.94 },
      { label: "xG en contra (xGA)", unit: "/90", home: 1.12, away: 1.18 },
      { label: "Remates totales", unit: "/90", home: 18.2, away: 13.5 },
      { label: "Remates a puerta", unit: "/90", home: 7.1, away: 5.2 },
      { label: "Posesión media", unit: "%", home: 66, away: 52 },
      { label: "Pases completados", unit: "%", home: 89.2, away: 85.1 },
      { label: "Córners a favor", unit: "/90", home: 7.2, away: 5.1 },
      { label: "Tarjetas amarillas", unit: "/90", home: 1.6, away: 2.1 },
      { label: "Ocasiones claras", unit: "/90", home: 3.6, away: 2.4 },
    ],
    h2h: [
      { date: "04/11/2023", comp: "Bundesliga · J10", score: "0-4", result: "V" },
      { date: "01/04/2023", comp: "Bundesliga · J26", score: "4-2", result: "V" },
      { date: "08/10/2022", comp: "Bundesliga · J9", score: "2-2", result: "E" },
      { date: "23/04/2022", comp: "Bundesliga · J31", score: "3-1", result: "V" },
      { date: "04/12/2021", comp: "Bundesliga · J14", score: "2-3", result: "D" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Bayern", prob: 58, odd: 1.55 },
        { label: "X · Empate", prob: 22, odd: 4.20 },
        { label: "2 · Dortmund", prob: 20, odd: 5.20 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · Bayern o empate", prob: 80, odd: 1.22 },
        { label: "12 · Sin empate", prob: 78, odd: 1.25 },
        { label: "X2 · BVB o empate", prob: 42, odd: 2.20 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 2.5", prob: 79, odd: 1.30 },
        { label: "Más de 3.5", prob: 55, odd: 1.83 },
        { label: "Menos de 3.5", prob: 45, odd: 1.95 },
        { label: "Más de 4.5", prob: 31, odd: 2.75 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 76, odd: 1.36 },
        { label: "No", prob: 24, odd: 3.10 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Bayern · Más de 18.5 remates", prob: 54, odd: 1.85 },
        { label: "Kane · Más de 3.5 remates", prob: 63, odd: 1.62 },
        { label: "Bayern · Más de 8.5 a puerta", prob: 52, odd: 1.90 },
        { label: "Kobel · Más de 6.5 paradas", prob: 56, odd: 1.80 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 10.5", prob: 61, odd: 1.72 },
        { label: "Bayern · Más de 7.5", prob: 55, odd: 1.83 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 3.5 amarillas", prob: 66, odd: 1.62 },
        { label: "Más de 4.5 amarillas", prob: 48, odd: 2.00 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Kane marca en cualquier momento", prob: 68, odd: 1.50 },
        { label: "Bayern marca en la 2ª mitad", prob: 74, odd: 1.40 },
        { label: "Dortmund marca en la 2ª mitad", prob: 48, odd: 2.00 },
      ]},
    ],
    topScores: [
      { score: "3-1", prob: 14.2 },
      { score: "2-1", prob: 11.5 },
      { score: "3-2", prob: 9.1 },
      { score: "2-2", prob: 8.3 },
      { score: "4-1", prob: 6.4 },
    ],
    valuePicks: [
      { market: "Handicap", pick: "Bayern -1 (hándicap asiático)", odd: 2.05, prob: 55, edge: 12.8, stake: "2.5/5" },
      { market: "Goles", pick: "Más de 3.5 goles", odd: 1.83, prob: 55, edge: 0.7, stake: "1/5" },
      { market: "Jugador", pick: "Kane marca en cualquier momento", odd: 1.50, prob: 68, edge: 2.0, stake: "1/5" },
    ],
    risks: [
      "Con 2-1, un solo gol visitante cambia el modelo en vivo por completo (el Dortmund empata en el 22% de las simulaciones restantes).",
      "Tuchel puede proteger el resultado con doble pivote fresco y reducir el over proyectado.",
      "El Klassiker tiene historial de finales caóticos: 6 de los últimos 10 derbis cambiaron de signo tras el minuto 75.",
    ],
    conclusion: {
      confidence: "alta",
      verdict: "Con el 2-1 en el marcador y el plan del Dortmund degradado físicamente, el Bayern -1 en vivo es la mejor lectura del tramo final. El over 3.5 conserva valor moderado; el resultado en corto (2-1) es el riesgo principal de esa línea.",
      mainPicks: [
        { label: "Bayern -1 (hándicap asiático)", odd: 2.05 },
        { label: "Kane marca en cualquier momento", odd: 1.50 },
      ],
      stake: "2.5/5 global · seguimiento en vivo recomendado",
    },
  },

  /* ----------------------------------------------------------
     6 · PSG — MARSELLA  (Le Classique)
     ---------------------------------------------------------- */
  {
    id: "psg-om",
    competition: "Ligue 1",
    compShort: "L1",
    round: "Jornada 27 · Le Classique",
    dateLabel: "Hoy",
    time: "20:45",
    venue: "Parc des Princes, París",
    referee: "Clément Turpin",
    home: { name: "París Saint-Germain", short: "PSG", code: "PSG", colors: ["#004170", "#da291c"], manager: "Luis Enrique", ranking: "1º · 59 pts" },
    away: { name: "Olympique de Marsella", short: "Marsella", code: "OM", colors: ["#2faee0", "#ffffff"], manager: "Jean-Louis Gasset", ranking: "7º · 39 pts" },
    formationHome: "4-3-3",
    formationAway: "4-2-3-1",
    tags: ["Le Classique", "BTTS con valor", "Posesión PSG"],
    summary: [
      "El PSG es el equipo más dominante de Europa en posesión (71%) y genera 2.42 xG/90; el Marsella encaja 1.35 xGA/90 fuera de casa pero marca en el 84% de sus visitas.",
      "El modelo ve valor en BTTS-Sí (64% vs 1.72): el Marsella de Gasset convierte el 118% de su xG como visitante.",
      "Le Classique promedia 3.2 goles y 5.8 tarjetas en la última década: contexto histórico favorable al over múltiple.",
    ],
    homeAnalysis: {
      form: ["V", "V", "V", "E", "V"],
      formNote: "Invicto en 2024 (16V · 4E). Mbappé suma 24 goles en liga y el equipo encadena 9 porterías a cero en el Parc.",
      attackText: "2.42 xG/90. Mbappé (1.02 xG/90) + Dembélé (4.8 conducciones/90) rompen por fuera; Vitinha (94% pases) controla por dentro. El ataque posicional más paciente y letal de la Ligue 1.",
      defenseText: "0.74 xGA/90 con Donnarumma en +5.1 goles prevenidos. Solo concede 8.1 remates/90. Punto débil: transiciones tras córner propio (0.21 xGA/90 en esa fase).",
      style: "4-3-3 de posesión extrema (71%), con laterales invertidos y presión tras pérdida de 5 segundos. Luis Enrique rota poco en los clásicos: once de gala esperado.",
      keyPlayers: [
        { name: "Kylian Mbappé", pos: "Delantero", figure: "24G · 7A", note: "9 goles en sus últimos 8 clásicos." },
        { name: "Ousmane Dembélé", pos: "Extremo", figure: "4.8 conducciones/90", note: "Su perfil ante el lateral zurdo del OM es el duelo más desequilibrado del partido." },
        { name: "Vitinha", pos: "Interior", figure: "94% pases", note: "Marca el ritmo: con él en campo, el PSG promedia 73% de posesión." },
      ],
      context: "Líder con 10 puntos de ventaja y Champions a la vista: llega relajado pero con el once titular. El Parc agotó entradas en 40 minutos.",
    },
    awayAnalysis: {
      form: ["V", "D", "E", "V", "V"],
      formNote: "Tres victorias en las últimas cinco tras el cambio de entrenador; Aubameyang recuperó el gol (5 en 6 jornadas).",
      attackText: "1.72 xG/90. Aubameyang (0.78 xG/90) vive de centros laterales: 11 goles, 7 de cabeza o en área pequeña. Harit conecta el último pase (2.9 pases clave/90).",
      defenseText: "1.35 xGA/90 fuera de casa. Sufre contra extremos puros (2.2 regates concedidos/90 por lateral) y concede 6.4 córners por visita: combustible para el PSG.",
      style: "4-2-3-1 de bloque medio con salida rápida hacia Aubameyang. Gasset asume el 35% de posesión y apuesta por centros (24 por partido, máximo de la liga).",
      keyPlayers: [
        { name: "Pierre-Emerick Aubameyang", pos: "Delantero", figure: "17G en liga", note: "3 goles en 4 clásicos; amenaza aérea constante." },
        { name: "Amine Harit", pos: "Mediapunta", figure: "2.9 pases clave/90", note: "Único capaz de girar la presión del PSG por dentro." },
        { name: "Pau López", pos: "Portero", figure: "71% paradas", note: "Sostuvo el 0-0 parcial de la ida con 7 paradas." },
      ],
      context: "A 8 puntos de Europa: el clásico es su partido de la temporada. Llega sin bajas relevantes y con la moral alta tras dos victorias seguidas.",
    },
    tactics: {
      overview: "Monólogo de posesión del PSG (68% proyectado) con el Marsella defendiendo en 4-4-2 medio y buscando a Aubameyang en transición y ABP. La capacidad del OM para sostener el 0-0 hasta el minuto 60 define el guion.",
      keys: [
        { title: "Dembélé vs lateral zurdo", body: "El perfil derecho del OM concede 2.2 regates/90. Dembélé intenta 6.1: si gana la línea de fondo, el xG del PSG por centros sube a 1.1 por partido." },
        { title: "Aubameyang al espacio", body: "El Marsella completa 2.1 transiciones/90 contra rivales de posesión alta. Donnarumma concede en salidas: 0.3 xG/90 en balones a la espalda de la defensa." },
        { title: "El muro del 0-0", body: "Si el PSG no marca antes del 60', su tasa de conversión cae un 12% por ansiedad de grada. La ida (0-2 para el OM en el Vélodrome) es el antecedente que el mercado recuerda." },
      ],
      prediction: "Victoria local con gol visitante: el 2-1 y el 3-1 suman el 21% de las simulaciones. Proyección de 2.9 goles totales.",
    },
    absencesHome: [
      { player: "Presnel Kimpembe", pos: "Defensa", status: "Confirmado fuera", reason: "Rotura de Aquiles — larga duración" },
      { player: "Marco Asensio", pos: "Extremo", status: "Duda", reason: "Molestias en el tobillo" },
    ],
    absencesAway: [
      { player: "Valentin Rongier", pos: "Pivote", status: "Confirmado fuera", reason: "Rotura de cruzado" },
      { player: "Chancel Mbemba", pos: "Defensa", status: "Duda", reason: "Sobrecarga — decisión en caliente" },
    ],
    lineupHome: ["Donnarumma (POR)", "Hakimi", "Marquinhos", "Beraldo", "Nuno Mendes", "Zaïre-Emery", "Vitinha", "Fabian Ruiz", "Dembélé", "Mbappé", "Barcola"],
    lineupAway: ["Pau López (POR)", "Clauss", "Gigot", "Balerdi", "Merlin", "Kondogbia", "Veretout", "Ndiaye", "Harit", "Luis Henrique", "Aubameyang"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 2.4, away: 1.6 },
      { label: "Goles en contra", unit: "/partido", home: 0.7, away: 1.2 },
      { label: "xG a favor", unit: "/90", home: 2.42, away: 1.72 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.74, away: 1.21 },
      { label: "Remates totales", unit: "/90", home: 16.8, away: 13.1 },
      { label: "Remates a puerta", unit: "/90", home: 6.6, away: 5.0 },
      { label: "Posesión media", unit: "%", home: 71, away: 51 },
      { label: "Pases completados", unit: "%", home: 90.1, away: 84.2 },
      { label: "Córners a favor", unit: "/90", home: 6.4, away: 4.6 },
      { label: "Tarjetas amarillas", unit: "/90", home: 1.8, away: 2.5 },
      { label: "Ocasiones claras", unit: "/90", home: 3.1, away: 2.2 },
    ],
    h2h: [
      { date: "22/10/2023", comp: "Ligue 1 · J9", score: "2-0", result: "D" },
      { date: "26/02/2023", comp: "Ligue 1 · J25", score: "0-3", result: "V" },
      { date: "16/10/2022", comp: "Ligue 1 · J11", score: "1-0", result: "V" },
      { date: "17/04/2022", comp: "Ligue 1 · J32", score: "2-1", result: "V" },
      { date: "24/10/2021", comp: "Ligue 1 · J11", score: "0-0", result: "E" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · PSG", prob: 55, odd: 1.62 },
        { label: "X · Empate", prob: 24, odd: 4.00 },
        { label: "2 · Marsella", prob: 21, odd: 5.00 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · PSG o empate", prob: 79, odd: 1.25 },
        { label: "12 · Sin empate", prob: 76, odd: 1.30 },
        { label: "X2 · OM o empate", prob: 45, odd: 2.10 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 82, odd: 1.26 },
        { label: "Más de 2.5", prob: 60, odd: 1.70 },
        { label: "Menos de 2.5", prob: 40, odd: 2.15 },
        { label: "Más de 3.5", prob: 37, odd: 2.45 },
        { label: "Menos de 3.5", prob: 63, odd: 1.52 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 64, odd: 1.72 },
        { label: "No", prob: 36, odd: 2.20 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "PSG · Más de 16.5 remates", prob: 53, odd: 1.87 },
        { label: "Mbappé · Más de 3.5 remates", prob: 58, odd: 1.75 },
        { label: "PSG · Más de 6.5 a puerta", prob: 56, odd: 1.80 },
        { label: "Pau López · Más de 4.5 paradas", prob: 54, odd: 1.85 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 9.5", prob: 59, odd: 1.80 },
        { label: "PSG · Más de 6.5", prob: 51, odd: 1.95 },
        { label: "OM · Menos de 4.5", prob: 57, odd: 1.78 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 4.5 amarillas", prob: 62, odd: 1.70 },
        { label: "Más de 5.5 amarillas", prob: 46, odd: 2.05 },
        { label: "Expulsión · Sí", prob: 19, odd: 4.80 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "PSG gana alguna mitad", prob: 66, odd: 1.50 },
        { label: "Mbappé marca en cualquier momento", prob: 57, odd: 1.72 },
        { label: "Handicap asiático PSG -1", prob: 41, odd: 2.20 },
      ]},
    ],
    topScores: [
      { score: "2-1", prob: 12.2 },
      { score: "1-1", prob: 10.4 },
      { score: "2-0", prob: 9.8 },
      { score: "3-1", prob: 8.6 },
      { score: "1-0", prob: 8.1 },
    ],
    valuePicks: [
      { market: "Ambos marcan", pick: "BTTS · Sí", odd: 1.72, prob: 64, edge: 10.1, stake: "2/5" },
      { market: "Córners", pick: "Más de 9.5 córners", odd: 1.80, prob: 59, edge: 6.2, stake: "1.5/5" },
      { market: "Tarjetas", pick: "Más de 4.5 tarjetas", odd: 1.70, prob: 62, edge: 5.4, stake: "1/5" },
    ],
    risks: [
      "Le Classique nivela emocionalmente: el OM gana el 40% de los duelos de la última década siendo peor equipo en xG.",
      "Si el PSG sentencia antes del descanso, el over y el BTTS dependen de la relajación local (histórico de segundas partes flojas con ventaja amplia).",
      "Turpin es riguroso pero variable: el mercado de tarjetas puede inflarse con un inicio caliente.",
    ],
    conclusion: {
      confidence: "media",
      verdict: "La victoria del PSG está bien pagada por el mercado (cuota eficiente), pero el BTTS-Sí captura el patrón visitante del OM (marca en el 84% de salidas) frente a una defensa parisina que concede en transición. Complemento en córners, coherente con el monólogo ofensivo proyectado.",
      mainPicks: [
        { label: "BTTS · Sí", odd: 1.72 },
        { label: "Más de 9.5 córners", odd: 1.80 },
        { label: "Más de 4.5 tarjetas", odd: 1.70 },
      ],
      stake: "2/5 global · entrada principal BTTS con 2/5",
    },
  },

  /* ----------------------------------------------------------
     7 · BOCA JUNIORS — RIVER PLATE  (Superclásico)
     ---------------------------------------------------------- */
  {
    id: "boc-riv",
    competition: "Copa Libertadores",
    compShort: "LIBERT",
    round: "Fase de grupos · J3",
    dateLabel: "Hoy",
    time: "21:30",
    venue: "La Bombonera, Buenos Aires",
    referee: "Wilton Sampaio (BRA)",
    home: { name: "Boca Juniors", short: "Boca", code: "BOC", colors: ["#f7c600", "#003da5"], manager: "Diego Martínez", ranking: "Grupo C · 4 pts" },
    away: { name: "River Plate", short: "River", code: "RIV", colors: ["#e03a3e", "#ffffff"], manager: "Martín Demichelis", ranking: "Grupo C · 6 pts" },
    formationHome: "4-3-1-2",
    formationAway: "4-3-3",
    tags: ["Superclásico", "Under clásico", "Alta varianza"],
    summary: [
      "Superclásico de Libertadores en La Bombonera: en los últimos 8 cruces solo se marcaron 11 goles. El modelo proyecta 1.9 y sitúa el Under 2.5 en el 62%.",
      "Boca no pierde en la Bombonera por competición internacional desde 2021 (18V · 6E), aunque su xG local (1.55) es el más bajo del ciclo Martínez.",
      "River llega invicto en el grupo pero con 3 empates seguidos fuera de casa y un xGA visitante que duplica al del Monumental.",
    ],
    homeAnalysis: {
      form: ["V", "E", "V", "E", "V"],
      formNote: "Invicto en 10 partidos, con 6 porterías a cero en ese tramo. Líder de su zona en la Copa de la Liga.",
      attackText: "1.55 xG/90 en casa. Cavani (0.72 xG/90) es el 44% del ataque: sin él en campo, el xG cae a 1.1. El equipo abusa del centro (27 por partido) con eficacia media.",
      defenseText: "0.68 xGA/90 en la Bombonera, con Romero en +3.9 goles prevenidos. El mejor registro defensivo del continente como local junto a Fluminense.",
      style: "4-3-1-2 de intensidad alta, duelos individuales y balón directo a Cavani–Merentiel. Posesión 47%: el plan asume ceder el balón y ganar los segundos balones.",
      keyPlayers: [
        { name: "Edinson Cavani", pos: "Delantero", figure: "9G en 14", note: "Su primer Superclásico oficial: racha de 5 goles en los últimos 6 partidos." },
        { name: "Sergio Romero", pos: "Portero", figure: "81% paradas", note: "Invicto en 6 de sus últimas 7 noches coperas en la Bombonera." },
        { name: "Guillermo Fernández", pos: "Interior", figure: "2.4 duelos ganados/90", note: "El termómetro del mediocampo xeneize; su amarilla temprana cambia el plan." },
      ],
      context: "La Bombonera presenta 54.000 almas y mosaico completo. Boca se juega el liderato del grupo y llega sin bajas de peso: semana larga de preparación.",
    },
    awayAnalysis: {
      form: ["E", "V", "E", "V", "E"],
      formNote: "Tres empates consecutivos fuera de casa, todos 1-1. Invicto en Libertadores pero sin ganar como visitante en 2024.",
      attackText: "1.88 xG/90 global que cae a 1.42 como visitante. Borja (0.81 xG/90) depende del suministro de Echeverri (3.1 pases clave/90): si el juvenil no gira, River no genera.",
      defenseText: "1.24 xGA/90 fuera del Monumental, el doble que en casa. Sufre los centros laterales (6.8 concedidos por visita) justo el arma principal de Boca.",
      style: "4-3-3 de posesión (58%) con laterales altos y presión coordinada. Fuera de casa el plan se vuelve más conservador: Demichelis cambia el sistema en el 70% de sus visitas.",
      keyPlayers: [
        { name: "Miguel Borja", pos: "Delantero", figure: "12G en 15", note: "4 goles en sus últimos 3 partidos; nulo en clásicos (0 en 5)." },
        { name: "Claudio Echeverri", pos: "Mediapunta", figure: "3.1 pases clave/90", note: "El talento diferencial del grupo; su duelo con el doble pivote de Boca define el partido." },
        { name: "Franco Armani", pos: "Portero", figure: "77% paradas", note: "6 Superclásicos sin perder: el factor psicológico visitante." },
      ],
      context: "Líder del grupo, con margen. Demichelis recupera a Enzo Pérez para el eje pero pierde a un lateral por sanción: ajuste defensivo relevante ante los centros de Boca.",
    },
    tactics: {
      overview: "Boca presionará alto los primeros 20 minutos (robo alto en el 38% de las salidas visitantes) y luego replegará a bloque medio esperando centros. River necesita que Echeverri reciba entre líneas; si Pol Fernández y Medina lo tapan, el partido se vuelve de duelos y ABP.",
      keys: [
        { title: "Centros de Boca", body: "27 centros por partido frente a un River que concede 6.8 por visita: el cruce de estilos favorece el 1-0 por ABP o centro lateral (26% de las simulaciones)." },
        { title: "El factor Echeverri", body: "Con Echeverri bien marcado, el xG de River cae a 1.05/90. Boca asignará doble vigilancia: el clásico se decide en ese ajuste." },
        { title: "Ritmo de fricción", body: "Sampaio permite contacto: 4.2 tarjetas de media en clásicos sudamericanos. El over 4.5 tarjetas ocurre en el 57% de las simulaciones." },
      ],
      prediction: "Partido corto, friccionado y de marcador mínimo. El 1-0 local y el 1-1 suman el 25% de las simulaciones; el Under 2.5 domina con el 62%.",
    },
    absencesHome: [
      { player: "Nicolás Valentini", pos: "Defensa", status: "Duda", reason: "Contractura — prueba matinal" },
    ],
    absencesAway: [
      { player: "Enzo Díaz", pos: "Lateral", status: "Sancionado", reason: "Expulsión en la jornada 2" },
      { player: "Enzo Pérez", pos: "Pivote", status: "Probable", reason: "Regresa tras molestias — suma minutos limitados" },
    ],
    lineupHome: ["Romero (POR)", "Advíncula", "Figal", "Rojo", "Blanco", "Medina", "Pol Fernández", "Zenón", "Zeballos", "Merentiel", "Cavani"],
    lineupAway: ["Armani (POR)", "Casco", "Pezzella", "Maidana", "Gómez", "Kranevitter", "Aliendro", "Echeverri", "Colidio", "Borja", "Barco"],
    metrics: [
      { label: "Goles a favor", unit: "/partido", home: 1.6, away: 1.8 },
      { label: "Goles en contra", unit: "/partido", home: 0.6, away: 0.9 },
      { label: "xG a favor", unit: "/90", home: 1.55, away: 1.88 },
      { label: "xG en contra (xGA)", unit: "/90", home: 0.68, away: 1.02 },
      { label: "Remates totales", unit: "/90", home: 12.4, away: 14.2 },
      { label: "Remates a puerta", unit: "/90", home: 4.6, away: 5.1 },
      { label: "Posesión media", unit: "%", home: 47, away: 58 },
      { label: "Pases completados", unit: "%", home: 79.8, away: 86.3 },
      { label: "Córners a favor", unit: "/90", home: 5.6, away: 4.9 },
      { label: "Tarjetas amarillas", unit: "/90", home: 2.8, away: 2.4 },
      { label: "Duelos ganados", unit: "%", home: 54.1, away: 50.6 },
    ],
    h2h: [
      { date: "25/02/2024", comp: "Copa de la Liga", score: "1-1", result: "E" },
      { date: "01/10/2023", comp: "Copa de la Liga", score: "0-2", result: "D" },
      { date: "07/05/2023", comp: "Liga Profesional", score: "1-0", result: "V" },
      { date: "11/09/2022", comp: "Liga Profesional", score: "1-0", result: "V" },
      { date: "20/03/2022", comp: "Copa de la Liga", score: "0-1", result: "D" },
    ],
    markets: [
      { market: "1X2 (Resultado final)", icon: "result", basic: true, outcomes: [
        { label: "1 · Boca", prob: 38, odd: 2.45 },
        { label: "X · Empate", prob: 30, odd: 3.10 },
        { label: "2 · River", prob: 32, odd: 2.90 },
      ]},
      { market: "Doble oportunidad", icon: "double", basic: true, outcomes: [
        { label: "1X · Boca o empate", prob: 68, odd: 1.50 },
        { label: "12 · Sin empate", prob: 70, odd: 1.40 },
        { label: "X2 · River o empate", prob: 62, odd: 1.55 },
      ]},
      { market: "Goles Over/Under", icon: "goals", basic: true, outcomes: [
        { label: "Más de 1.5", prob: 66, odd: 1.55 },
        { label: "Menos de 1.5", prob: 34, odd: 2.45 },
        { label: "Más de 2.5", prob: 38, odd: 2.25 },
        { label: "Menos de 2.5", prob: 62, odd: 1.80 },
        { label: "Más de 3.5", prob: 18, odd: 4.20 },
        { label: "Menos de 3.5", prob: 82, odd: 1.22 },
      ]},
      { market: "Ambos equipos marcan (BTTS)", icon: "btts", basic: true, outcomes: [
        { label: "Sí", prob: 49, odd: 1.85 },
        { label: "No", prob: 51, odd: 1.90 },
      ]},
      { market: "Remates y tiros a puerta", icon: "shots", outcomes: [
        { label: "Boca · Más de 10.5 remates", prob: 57, odd: 1.80 },
        { label: "Cavani · Más de 2.5 remates", prob: 54, odd: 1.85 },
        { label: "Borja · Más de 2.5 remates", prob: 52, odd: 1.90 },
        { label: "River · Menos de 12.5 remates", prob: 55, odd: 1.83 },
      ]},
      { market: "Córners", icon: "corners", outcomes: [
        { label: "Totales · Más de 8.5", prob: 58, odd: 1.80 },
        { label: "Boca · Más de 4.5", prob: 56, odd: 1.83 },
        { label: "River · Menos de 4.5", prob: 54, odd: 1.85 },
      ]},
      { market: "Tarjetas", icon: "cards", outcomes: [
        { label: "Más de 4.5 amarillas", prob: 57, odd: 1.85 },
        { label: "Más de 5.5 amarillas", prob: 42, odd: 2.20 },
        { label: "Expulsión · Sí", prob: 22, odd: 4.00 },
      ]},
      { market: "Otros mercados del modelo", icon: "other", outcomes: [
        { label: "Boca gana alguna mitad", prob: 51, odd: 1.95 },
        { label: "Empate al descanso", prob: 45, odd: 2.05 },
        { label: "Menos de 5.5 córners en la 2ª mitad", prob: 53, odd: 1.90 },
      ]},
    ],
    topScores: [
      { score: "1-1", prob: 13.8 },
      { score: "1-0", prob: 12.9 },
      { score: "0-1", prob: 9.4 },
      { score: "2-1", prob: 8.8 },
      { score: "0-0", prob: 8.6 },
    ],
    valuePicks: [
      { market: "Goles Over/Under", pick: "Menos de 2.5 goles", odd: 1.80, prob: 62, edge: 11.6, stake: "2/5" },
      { market: "Doble oportunidad", pick: "1X · Boca o empate", odd: 1.50, prob: 68, edge: 2.0, stake: "1/5" },
      { market: "Tarjetas", pick: "Más de 4.5 tarjetas", odd: 1.85, prob: 57, edge: 5.5, stake: "1/5" },
    ],
    risks: [
      "Superclásico: la varianza emocional es la más alta del panel. Una expulsión temprana (22% de probabilidad) reescribe todos los mercados.",
      "Valentini es duda: sin él, la defensa aérea de Boca (clave ante los centros) pierde su mejor porcentaje de duelos.",
      "River de Demichelis en clásicos rinde por encima de métricas: 3 victorias en 5 con xG inferior al rival.",
    ],
    conclusion: {
      confidence: "media",
      verdict: "El patrón under de los últimos 8 clásicos (1.4 goles/partido) se refuerza con dos defensas en buen momento y un River que no gana fuera en 2024. El Under 2.5 a 1.80 es la lectura principal; el 1X2 se descarta por varianza emocional. Tarjetas como complemento de fricción.",
      mainPicks: [
        { label: "Menos de 2.5 goles", odd: 1.80 },
        { label: "Más de 4.5 tarjetas", odd: 1.85 },
        { label: "1X · Boca o empate", odd: 1.50 },
      ],
      stake: "2/5 global · entrada principal Under 2.5 con 2/5",
    },
  },
];

export const getMatch = (id: string) => matches.find((m) => m.id === id);

export interface Computation {
  label: string;
  value: number;
  suffix?: string;
}

export const MODEL_STATS: Computation[] = [
  { label: "Simulaciones Monte Carlo por partido", value: 20000 },
  { label: "Eventos procesados por jornada", value: 12400 },
  { label: "Ligas cubiertas por el modelo", value: 38 },
  { label: "Brier score (calibración 12 meses)", value: 0.192 },
];
