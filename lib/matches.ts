export type Option = {
  id: string
  label: string
  points: number
}

export type Market = {
  id: string
  title: string
  options: Option[]
  /** layout hint: number of columns on mobile */
  cols?: 2 | 3 | 4 | 6
}

export type Match = {
  id: string
  competition: string
  home: { name: string; flag: string }
  away: { name: string; flag: string }
  markets: Market[]
}

const flag = (code: string) => `https://flagcdn.com/w80/${code}.png`

export function commonMarkets(home: string, away: string, doble: Option[]): Market[] {
  return [
    {
      id: "marcador",
      title: "Marcador",
      cols: 3,
      options: [
        { id: "local",     label: "Local",     points: 3 },
        { id: "empate",    label: "Empate",    points: 4 },
        { id: "visitante", label: "Visitante", points: 2 },
      ],
    },
    {
      // Visitante · Total Goles (4 opciones — imagen: 0=8, +0.5=1, +1.5=2, +2.5=3)
      id: "away-goles",
      title: `${away} · Total Goles`,
      cols: 4,
      options: [
        { id: "0",    label: "0",    points: 8 },
        { id: "+0.5", label: "+0.5", points: 1 },
        { id: "+1.5", label: "+1.5", points: 2 },
        { id: "+2.5", label: "+2.5", points: 3 },
      ],
    },
    {
      id: "primer-gol",
      title: "Primer Gol",
      cols: 2,
      options: [
        { id: "local",     label: "Local",     points: 4 },
        { id: "visitante", label: "Visitante", points: 2 },
      ],
    },
    {
      // Local · Total Goles (6 opciones — imagen: 0=5, +0.5=2, +1.5=3, +2.5=4, +3.5=2, -3.5=4)
      id: "home-goles",
      title: `${home} · Total Goles`,
      cols: 6,
      options: [
        { id: "0",    label: "0",    points: 5 },
        { id: "+0.5", label: "+0.5", points: 2 },
        { id: "+1.5", label: "+1.5", points: 3 },
        { id: "+2.5", label: "+2.5", points: 4 },
        { id: "+3.5", label: "+3.5", points: 2 },
        { id: "-3.5", label: "-3.5", points: 4 },
      ],
    },
    {
      // Tiros de Esquina — imagen: Sí=2pts, No=4pts
      id: "tiros-esquina",
      title: "Tiros de Esquina",
      cols: 2,
      options: [
        { id: "si", label: "Sí", points: 2 },
        { id: "no", label: "No", points: 4 },
      ],
    },
    {
      id: "ambos-anotan",
      title: "Ambos Anotan",
      cols: 2,
      options: [
        { id: "si", label: "Sí", points: 2 },
        { id: "no", label: "No", points: 4 },
      ],
    },
    {
      id: "gana-cualquier",
      title: "Gana cualquier tiempo",
      cols: 2,
      options: [
        { id: "local",     label: "Local",     points: 2 },
        { id: "visitante", label: "Visitante", points: 2 },
      ],
    },
    {
      id: "doble-oportunidad",
      title: "Doble Oportunidad",
      cols: 3,
      options: doble,
    },
    {
      // Tarjetas Amarillas — imagen: +3.5=2pts, -3.5=4pts
      id: "tarjetas",
      title: "Tarjetas Amarillas",
      cols: 2,
      options: [
        { id: "+3.5", label: "+3.5", points: 2 },
        { id: "-3.5", label: "-3.5", points: 4 },
      ],
    },
    {
      // Goles Exactos — imagen: 0=20, 1=6, 2=4, 3=5, 4=9, +5=15
      id: "goles-exactos",
      title: "Goles Exactos",
      cols: 6,
      options: [
        { id: "0",  label: "0",  points: 20 },
        { id: "1",  label: "1",  points: 6  },
        { id: "2",  label: "2",  points: 4  }, // corregido: era 5, imagen dice 4
        { id: "3",  label: "3",  points: 5  },
        { id: "4",  label: "4",  points: 9  },
        { id: "+5", label: "+5", points: 15 },
      ],
    },
  ]
}

export const MATCHES: Match[] = [
  {
    id: "partido-1",
    competition: "FIFA · Fecha de Selecciones",
    home: { name: "Costa de Marfil", flag: flag("ci") },
    away: { name: "Ecuador",         flag: flag("ec") },
    markets: commonMarkets("Costa de Marfil", "Ecuador", [
      { id: "civ-empate", label: "Costa de Marfil o Empate", points: 4 },
      { id: "civ-ecu",    label: "Costa de Marfil o Ecuador", points: 3 },
      { id: "ecu-empate", label: "Ecuador o Empate",          points: 2 },
    ]),
  },
  {
    id: "partido-2",
    competition: "FIFA · Fecha de Selecciones",
    home: { name: "Ecuador", flag: flag("ec") },
    away: { name: "Curazao", flag: flag("cw") },
    markets: commonMarkets("Ecuador", "Curazao", [
      { id: "ecu-empate", label: "Ecuador o Empate",  points: 4 },
      { id: "ecu-cur",    label: "Ecuador o Curazao", points: 3 },
      { id: "cur-empate", label: "Curazao o Empate",  points: 2 },
    ]),
  },
  {
    id: "partido-3",
    competition: "FIFA · Fecha de Selecciones",
    home: { name: "Ecuador", flag: flag("ec") },
    away: { name: "Alemania", flag: flag("de") },
    markets: commonMarkets("Ecuador", "Alemania", [
      { id: "ecu-empate", label: "Ecuador o Empate",  points: 4 },
      { id: "ecu-ale",    label: "Ecuador o Curazao", points: 3 }, // label de la cartilla
      { id: "ale-empate", label: "Alemania o Empate", points: 2 },
    ]),
  },
]