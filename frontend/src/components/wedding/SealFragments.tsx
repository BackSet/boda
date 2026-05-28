import { motion } from 'motion/react'

type SealFragmentsProps = {
  className?: string
  count?: number
  active: boolean
}

const FRAGMENTS = [
  { angle: 0 },
  { angle: 36 },
  { angle: 72 },
  { angle: 108 },
  { angle: 144 },
  { angle: 180 },
  { angle: 216 },
  { angle: 252 },
  { angle: 288 },
  { angle: 324 },
]

export function SealFragments({ className = '', count = 10, active }: SealFragmentsProps) {
  const fragments = FRAGMENTS.slice(0, count)

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {fragments.map((fragment, index) => {
        const rad = (fragment.angle * Math.PI) / 180
        const distance = 90 + (index % 3) * 30
        const targetX = Math.cos(rad) * distance
        const targetY = Math.sin(rad) * distance
        const size = 6 + (index % 4) * 2

        return (
          <motion.span
            key={`frag-${index}`}
            className="absolute left-1/2 top-1/2"
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
            animate={
              active
                ? {
                    x: targetX,
                    y: targetY,
                    opacity: [0, 1, 0],
                    rotate: 180 + index * 20,
                    scale: [0.4, 1, 0.6],
                  }
                : { x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }
            }
            transition={{
              duration: 1.2 + (index % 3) * 0.15,
              delay: 0.05 * index,
              ease: 'easeOut',
            }}
            style={{
              width: size,
              height: size,
              borderRadius: 2,
              background:
                'linear-gradient(135deg, #f4a4b8 0%, #a83d68 60%, #6c1f3a 100%)',
              boxShadow: '0 2px 6px rgba(108,31,58,0.45)',
            }}
          />
        )
      })}
    </div>
  )
}
