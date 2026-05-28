import { motion } from 'motion/react'

type FloatingPetalsProps = {
  count?: number
  burst?: boolean
  falling?: boolean
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
  { left: '5%', delay: 0.2 },
  { left: '28%', delay: 0.8 },
  { left: '42%', delay: 0.4 },
  { left: '60%', delay: 0.1 },
  { left: '78%', delay: 0.7 },
  { left: '92%', delay: 0.3 },
  { left: '18%', delay: 0.9 },
  { left: '32%', delay: 0.5 },
  { left: '50%', delay: 0.8 },
  { left: '85%', delay: 0.2 },
]

function petalStyle(index: number) {
  const wiggle = Math.sin(index * 1.3)
  const baseScale = 0.75 + ((index % 5) * 0.12)
  const baseOpacity = 0.32 + ((index % 4) * 0.07)
  const rotation = wiggle * 22
  return { scale: baseScale, opacity: baseOpacity, rotation }
}

export function FloatingPetals({
  count = 8,
  burst = false,
  falling = false,
  className = '',
}: FloatingPetalsProps) {
  const petals = PETAL_POSITIONS.slice(0, count)

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {petals.map((petal, index) => {
        const { scale, opacity, rotation } = petalStyle(index)
        const xDrift = index % 2 === 0 ? 60 + (index % 3) * 20 : -(60 + (index % 3) * 20)

        return (
          <motion.img
            key={`${petal.left}-${index}`}
            src="/assets/florals/petal.svg"
            alt=""
            className="absolute h-6 w-5"
            style={{
              left: petal.left,
              top: burst ? '55%' : falling ? '-10%' : `${10 + (index % 5) * 14}%`,
              scale,
              rotate: rotation,
            }}
            initial={{
              y: 0,
              x: 0,
              opacity: burst ? opacity + 0.3 : falling ? 0 : opacity,
            }}
            animate={
              burst
                ? {
                    y: [-20, -140 - (index % 4) * 25, -240],
                    x: [0, xDrift / 2, xDrift],
                    opacity: [opacity + 0.4, opacity, 0],
                    rotate: [rotation, rotation + 90, rotation + 200],
                  }
                : falling
                ? {
                    top: ['-10%', '110%'],
                    x: [0, xDrift, 0],
                    opacity: [0, opacity + 0.45, 0],
                    rotate: [rotation, rotation + 180, rotation + 360],
                  }
                : {
                    y: [0, -24, 0],
                    opacity: [opacity, opacity + 0.25, opacity],
                    rotate: [rotation, rotation + 18, rotation],
                  }
            }
            transition={
              burst
                ? { duration: 1.8 + (index % 3) * 0.2, delay: petal.delay * 0.4, ease: 'easeOut' }
                : falling
                ? {
                    duration: 15 + index * 2,
                    delay: petal.delay * 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                : {
                    duration: 8 + index * 0.4,
                    delay: petal.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          />
        )
      })}
    </div>
  )
}
