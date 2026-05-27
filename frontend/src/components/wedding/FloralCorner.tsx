type FloralCornerProps = {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const positionClasses: Record<NonNullable<FloralCornerProps['position']>, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0 scale-x-[-1]',
  'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
  'bottom-right': 'bottom-0 right-0 scale-[-1]',
}

export function FloralCorner({
  className = '',
  position = 'top-left',
}: FloralCornerProps) {
  return (
    <img
      src="/assets/florals/corner-rose.svg"
      alt=""
      aria-hidden
      className={`pointer-events-none absolute h-16 w-16 opacity-50 md:h-20 md:w-20 ${positionClasses[position]} ${className}`}
    />
  )
}
