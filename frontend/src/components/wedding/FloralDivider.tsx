type FloralDividerProps = {
  label?: string
  className?: string
}

export function FloralDivider({ label, className = '' }: FloralDividerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      aria-hidden={!label}
    >
      <img
        src="/assets/florals/divider-garland.svg"
        alt=""
        className="h-6 w-48 max-w-full opacity-80 md:w-60"
      />
      {label && (
        <span className="text-xs tracking-[0.28em] text-amber-600/90 uppercase dark:text-amber-300/80">
          {label}
        </span>
      )}
    </div>
  )
}
