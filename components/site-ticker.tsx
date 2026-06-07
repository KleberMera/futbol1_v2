export function SiteTicker() {
  const tickerItems = [
    { icon: "🥇", text: "1er Premio — Nevera + Cocina + Cilindro de Gas" },
    { icon: "🥈", text: "2do Premio — Smart TV + PS5" },
    { icon: "🥉", text: "3er Premio — iPhone 17 Pro Max" },
    { icon: "🎁", text: "4to Premio Sorpresa — Predice las 4 semifinalistas del Mundial" },
    { icon: "⚽", text: "Cada gol cuenta · Cada córner suma · Cada tarjeta puntúa" },
    { icon: "🇪🇨", text: "Pronostica los 3 partidos de Ecuador en la fase de grupos" },
    { icon: "🔥", text: "#FútbolUno · #FirmesConTamariz · #LaTri · #Mundial2026" },
  ]

  return (
    <div className="border-t border-orange-400/70 bg-[#a84d00]">
      <div className="ticker-wrap overflow-hidden whitespace-nowrap py-2.5">
        <div className="ticker flex w-max min-w-[200%] items-center gap-6 pl-4 pr-4 text-[0.7rem] font-bold uppercase tracking-wide text-white">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item.text}-${index}`} className="inline-flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
              <span className="text-orange-200/90">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
