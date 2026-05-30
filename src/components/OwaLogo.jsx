export default function OwaLogo({ size = 48, color = '#0066FF' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield shape */}
      <path
        d="M32 4L8 14v18c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V14L32 4z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Fingerprint lines */}
      <path
        d="M32 22c-2.2 0-4 1.8-4 4v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 28c0-4.4 3.6-8 8-8s8 3.6 8 8v4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 30c0-6.6 5.4-12 12-12s12 5.4 12 12v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 36c0 2.2 1.8 4 4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 34v-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

