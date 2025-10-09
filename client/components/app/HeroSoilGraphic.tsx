export default function HeroSoilGraphic() {
  return (
    <div className="relative aspect-[4/3] w-full rounded-xl border bg-gradient-to-b from-emerald-50/60 to-emerald-100/20 dark:from-emerald-900/10 dark:to-emerald-800/5 overflow-hidden">
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Soil cross-section with sprouting crop"
      >
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e6fff4" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="soil" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8B5E3C" />
            <stop offset="100%" stopColor="#5A3D2B" />
          </linearGradient>
          <radialGradient id="sun" cx="85%" cy="15%" r="20%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {/* sky */}
        <rect x="0" y="0" width="800" height="340" fill="url(#sky)" />
        <circle cx="680" cy="80" r="90" fill="url(#sun)" />
        {/* hills */}
        <path
          d="M0 330 C150 260 300 300 400 280 C520 260 650 310 800 270 L800 360 L0 360 Z"
          fill="#dcfce7"
        />
        {/* soil */}
        <rect x="0" y="360" width="800" height="240" fill="url(#soil)" />
        {/* soil dots */}
        {Array.from({ length: 120 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 63) % 820}
            cy={380 + ((i * 47) % 200)}
            r={(i % 3) + 1}
            fill="#3b2a20"
            opacity="0.4"
          />
        ))}
        {/* sprout */}
        <g transform="translate(400 330)">
          <path
            d="M0 0 C-40 -30 -80 -40 -120 -10 C-65 10 -25 10 0 0"
            fill="#34d399"
            opacity="0.8"
          />
          <path
            d="M0 0 C40 -30 80 -40 120 -10 C65 10 25 10 0 0"
            fill="#10b981"
            opacity="0.85"
          />
          <rect x="-4" y="0" width="8" height="120" rx="4" fill="#065f46" />
          {/* roots */}
          <path
            d="M0 120 C -10 140 -20 160 -30 180"
            stroke="#eab308"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 130 C 12 150 18 170 25 185"
            stroke="#d97706"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
