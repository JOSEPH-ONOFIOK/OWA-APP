const COLORS = ['#0066FF', '#7C3AED', '#DB2777', '#EA580C', '#16A34A', '#0891B2']

const colorFor = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

const initialsFor = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface AvatarProps {
  name?: string
  src?: string | null
  size?: number
  style?: React.CSSProperties
}

export default function Avatar({ name = '', src, size = 46, style }: AvatarProps) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- runtime image source (upload preview or remote URL), not a static import
    return <img src={src} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0, ...style }} />
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: colorFor(name || '?'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: size * 0.4,
        ...style,
      }}
    >
      {initialsFor(name)}
    </div>
  )
}
