export function HeroIllustration(): JSX.Element {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
      aria-hidden="true"
    >
      {/* Desk */}
      <rect x="80" y="200" width="240" height="12" rx="4" fill="#E5E7EB" />
      <rect x="100" y="212" width="8" height="40" rx="2" fill="#D1D5DB" />
      <rect x="292" y="212" width="8" height="40" rx="2" fill="#D1D5DB" />

      {/* Scattered papers on desk */}
      <rect x="100" y="170" width="60" height="35" rx="2" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" transform="rotate(-8 100 170)" />
      <line x1="108" y1="180" x2="148" y2="178" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="110" y1="187" x2="145" y2="185" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="109" y1="194" x2="135" y2="192" stroke="#E5E7EB" strokeWidth="2" />

      <rect x="150" y="165" width="60" height="38" rx="2" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" transform="rotate(5 150 165)" />
      <line x1="158" y1="176" x2="198" y2="178" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="159" y1="183" x2="195" y2="185" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="160" y1="190" x2="185" y2="191" stroke="#E5E7EB" strokeWidth="2" />

      <rect x="240" y="172" width="55" height="32" rx="2" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" transform="rotate(-3 240 172)" />
      <line x1="248" y1="182" x2="283" y2="181" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="249" y1="189" x2="280" y2="188" stroke="#E5E7EB" strokeWidth="2" />

      {/* Red X marks on papers (frustration!) */}
      <g stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
        <line x1="130" y1="178" x2="140" y2="188" />
        <line x1="140" y1="178" x2="130" y2="188" />
      </g>
      <g stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
        <line x1="182" y1="174" x2="192" y2="184" />
        <line x1="192" y1="174" x2="182" y2="184" />
      </g>

      {/* Person - body */}
      <ellipse cx="200" cy="140" rx="28" ry="32" fill="#4287d8" /> {/* Torso/shirt */}

      {/* Person - head */}
      <circle cx="200" cy="95" r="22" fill="#FBBF6C" /> {/* Face */}

      {/* Hair */}
      <path d="M178 88 C178 72, 222 72, 222 88 C222 80, 178 80, 178 88Z" fill="#374151" />

      {/* Frustrated expression */}
      {/* Eyebrows - angled inward */}
      <line x1="188" y1="87" x2="194" y2="90" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="212" y1="87" x2="206" y2="90" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes - squinting */}
      <circle cx="192" cy="94" r="2" fill="#374151" />
      <circle cx="208" cy="94" r="2" fill="#374151" />

      {/* Mouth - frustrated wavy line */}
      <path d="M193 106 Q197 103, 200 106 Q203 109, 207 106" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Arms - hands on head (frustration pose) */}
      <path d="M172 135 Q155 115, 180 90" stroke="#4287d8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M228 135 Q245 115, 220 90" stroke="#4287d8" strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* Hands */}
      <circle cx="180" cy="88" r="7" fill="#FBBF6C" />
      <circle cx="220" cy="88" r="7" fill="#FBBF6C" />

      {/* Stress lines above head */}
      <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="185" y1="62" x2="182" y2="52" />
        <line x1="200" y1="58" x2="200" y2="48" />
        <line x1="215" y1="62" x2="218" y2="52" />
      </g>

      {/* Swirl stress marks */}
      <path d="M168 55 Q165 48, 170 45 Q175 42, 172 38" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M232 55 Q235 48, 230 45 Q225 42, 228 38" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Question marks floating */}
      <text x="155" y="45" fill="#9CA3AF" fontSize="16" fontFamily="Poppins, sans-serif" fontWeight="700">?</text>
      <text x="238" y="42" fill="#9CA3AF" fontSize="14" fontFamily="Poppins, sans-serif" fontWeight="700">?</text>
      <text x="248" y="60" fill="#9CA3AF" fontSize="11" fontFamily="Poppins, sans-serif" fontWeight="700">?</text>
    </svg>
  );
}
