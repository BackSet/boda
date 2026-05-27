import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type WeddingSectionProps = {
  children: ReactNode
  className?: string
  id?: string
}

export function WeddingSection({ children, className = '', id }: WeddingSectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
