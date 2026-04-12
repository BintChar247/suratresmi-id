export function SolvedIllustration(): JSX.Element {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto"
      aria-hidden="true"
    >
      {/* Phone frame */}
      <rect x="130" y="30" width="140" height="240" rx="18" fill="#1F2937" />
      <rect x="136" y="42" width="128" height="216" rx="12" fill="#FFFFFF" />

      {/* Screen content - SuratResmi app */}
      <rect x="148" y="56" width="104" height="10" rx="3" fill="#4287d8" />
      <rect x="148" y="74" width="80" height="6" rx="2" fill="#E5E7EB" />
      <rect x="148" y="86" width="104" height="6" rx="2" fill="#E5E7EB" />
      <rect x="148" y="98" width="60" height="6" rx="2" fill="#E5E7EB" />

      {/* Document lines */}
      <rect x="148" y="116" width="104" height="4" rx="1" fill="#F3F4F6" />
      <rect x="148" y="126" width="104" height="4" rx="1" fill="#F3F4F6" />
      <rect x="148" y="136" width="90" height="4" rx="1" fill="#F3F4F6" />
      <rect x="148" y="146" width="104" height="4" rx="1" fill="#F3F4F6" />
      <rect x="148" y="156" width="70" height="4" rx="1" fill="#F3F4F6" />

      {/* Download button on screen */}
      <rect x="148" y="178" width="104" height="28" rx="8" fill="#4287d8" />
      <text x="175" y="196" fill="white" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600">Unduh PDF</text>

      {/* Green checkmark badge */}
      <circle cx="270" cy="60" r="28" fill="#22C55E" />
      <path d="M256 60 L265 69 L284 50" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Sparkles around phone */}
      <g fill="#F59E0B">
        <path d="M118 80 L122 72 L126 80 L122 76Z" />
        <path d="M282 120 L286 112 L290 120 L286 116Z" />
        <path d="M112 180 L116 172 L120 180 L116 176Z" />
        <path d="M290 200 L294 192 L298 200 L294 196Z" />
      </g>

      {/* Happy person peeking from side */}
      <circle cx="90" cy="190" r="20" fill="#FBBF6C" />
      {/* Hair */}
      <path d="M70 182 C70 168, 110 168, 110 182 C110 175, 70 175, 70 182Z" fill="#374151" />
      {/* Happy eyes */}
      <path d="M82 188 Q85 185, 88 188" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M93 188 Q96 185, 99 188" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Big smile */}
      <path d="M82 197 Q90 206, 98 197" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Thumbs up arm */}
      <path d="M110 195 L122 178" stroke="#FBBF6C" strokeWidth="8" strokeLinecap="round" />
      {/* Thumb */}
      <circle cx="122" cy="174" r="6" fill="#FBBF6C" />
      <path d="M119 168 L122 160" stroke="#FBBF6C" strokeWidth="5" strokeLinecap="round" />

      {/* Flying paper (completed document) */}
      <g transform="rotate(-12 320 160)">
        <rect x="300" y="140" width="45" height="55" rx="3" fill="white" stroke="#22C55E" strokeWidth="1.5" />
        <line x1="308" y1="152" x2="337" y2="152" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="308" y1="160" x2="335" y2="160" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="308" y1="168" x2="325" y2="168" stroke="#E5E7EB" strokeWidth="2" />
        {/* Green stamp */}
        <circle cx="330" cy="182" r="8" stroke="#22C55E" strokeWidth="1.5" fill="#F0FDF4" />
        <path d="M326 182 L329 185 L335 179" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
