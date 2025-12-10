import React, { useRef, useState } from "react";
import Link from "@docusaurus/Link";

export const SpotlightCard = ({ children, to, className = "" }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <Link
      to={to}
      className={`relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-left no-underline transition-colors hover:border-zinc-700 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={divRef}
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(0, 240, 255, 0.2), rgba(100, 100, 255, 0.15) 25%, rgba(189, 0, 255, 0.1) 50%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </Link>
  );
};