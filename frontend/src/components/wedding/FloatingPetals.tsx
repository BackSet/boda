import { motion } from 'motion/react'

type FloatingPetalsProps = {
  count?: number
  burst?: boolean
  className?: string
}

const PETAL_POSITIONS = [
  { left: '8%', delay: 0 },
  { left: '22%', delay: 0.3 },
  { left: '38%', delay: 0.6 },
  { left: '55%', delay: 0.2 },
  { left: '72%', delay: 0.5 },
  { left: '88%', delay: 0.8 },
  { left: '15%', delay: 0.4 },
  { left: '65%', delay: 0.7 },
  { left: '45%', delay: 0.1 },
  { left: '80%', delay: 0.9 },
]

export function FloatingPetals({
  count = 8,
  burst = false,
  className = '',
}: FloatingPetalsProps) {
  const petals = PETAL_POSITIONS.slice(0, count)

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {petals.map((petal, index) => (
        <motion.img
          key={`${petal.left}-${index}`}
          src="/assets/florals/petal.svg"
          alt=""
          className="absolute h-6 w-5 opacity-40"
          style={{ left: petal.left, top: burst ? '55%' : `${10 + (index % 5) * 14}%` }}
          initial={{ y: 0, opacity: burst ? 0.7 : 0.3, rotate: 0 }}
          animate={
            burst
              ? {
                  y: [-20, -120, -200],
                  opacity: [0.7, 0.5, 0],
                  rotate: [0, 45, 90],
                }
              : {
                  y: [0, -24, 0],
                  opacity: [0.3, 0.55, 0.3],
                  rotate: [0, 18, 0],
                }
          }
          transition={
            burst
              ? { duration: 1.6, delay: petal.delay, ease: 'easeOut' }
              : {
                  duration: 8 + index * 0.4,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  )
}
