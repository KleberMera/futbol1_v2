import {
  Trophy,
  Volleyball,
  CircleDot,
  Target,
  Gamepad2,
  Dumbbell,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  futbol: Volleyball,
  baloncesto: CircleDot,
  tenis: CircleDot,
  beisbol: Target,
  "futbol-americano": Trophy,
  hockey: Target,
  mma: Dumbbell,
  esports: Gamepad2,
}

export function SportIcon({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const Icon = ICONS[slug] ?? Trophy
  return <Icon className={className} aria-hidden="true" />
}
