export default function CircleLoader({ size = 44 ,circleStyle=''}) {
  const bars = 12;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative"
      style={{ width: size, height: size }}
    >
      {[...Array(bars)].map((_, i) => (
        <span
          key={i}
          className={`absolute left-1/2 top-1/2 block bg-blue-700 rounded-full ${circleStyle}`}
          style={{
            width: size * 0.08,
            height: size * 0.22,
            transform: `
              rotate(${(360 / bars) * i}deg)
              translateY(-${size / 2.2}px)
            `,
            opacity: (i + 1) / bars,
            animation: `fade 1s linear infinite`,
            animationDelay: `${(i * 1) / bars}s`,
          }}
        />
      ))}

      {/* Inline animation – no config needed */}
      <style>
        {`
          @keyframes fade {
            0% { opacity: 1; }
            100% { opacity: 0.25; }
          }
        `}
      </style>
    </div>
  );
}
