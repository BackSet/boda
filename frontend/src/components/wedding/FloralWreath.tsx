type FloralWreathProps = {
  className?: string
}

export function FloralWreath({ className = '' }: FloralWreathProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <radialGradient id="wreath-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd3df" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#f3e1c7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#wreath-glow)" />
      <g stroke="#8fad7f" strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
        <path d="M200 32 C 140 48 92 92 70 158" />
        <path d="M200 32 C 260 48 308 92 330 158" />
        <path d="M70 158 C 50 210 56 264 92 312" />
        <path d="M330 158 C 350 210 344 264 308 312" />
        <path d="M92 312 C 132 354 184 372 200 372" />
        <path d="M308 312 C 268 354 216 372 200 372" />
      </g>
      <g fill="#f3d4e0" stroke="#a83d68" strokeWidth="0.8">
        <circle cx="120" cy="74" r="11" />
        <circle cx="280" cy="74" r="11" />
        <circle cx="76" cy="200" r="13" />
        <circle cx="324" cy="200" r="13" />
        <circle cx="120" cy="326" r="11" />
        <circle cx="280" cy="326" r="11" />
        <circle cx="200" cy="64" r="9" />
        <circle cx="200" cy="336" r="9" />
      </g>
      <g fill="#eef4e8" stroke="#6d8f5c" strokeWidth="0.8">
        <circle cx="92" cy="124" r="8" />
        <circle cx="308" cy="124" r="8" />
        <circle cx="64" cy="262" r="9" />
        <circle cx="336" cy="262" r="9" />
        <circle cx="150" cy="356" r="7" />
        <circle cx="250" cy="356" r="7" />
      </g>
      <g fill="#faf0e4" stroke="#b58a4b" strokeWidth="0.8">
        <circle cx="160" cy="60" r="6" />
        <circle cx="240" cy="60" r="6" />
        <circle cx="58" cy="160" r="6" />
        <circle cx="342" cy="160" r="6" />
        <circle cx="90" cy="296" r="6" />
        <circle cx="310" cy="296" r="6" />
      </g>
      <g stroke="#c97a9a" strokeWidth="0.7" opacity="0.7">
        <path d="M200 64 v18" />
        <path d="M120 74 l 6 14" />
        <path d="M280 74 l -6 14" />
        <path d="M76 200 l 14 0" />
        <path d="M324 200 l -14 0" />
      </g>
    </svg>
  )
}
