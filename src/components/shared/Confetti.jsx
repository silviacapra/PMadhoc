import { useEffect, useState } from "react";
import "./Confetti.css";

const COLORS = ["#4CAF88", "#002D62", "#FFC107", "#FF6B6B", "#8E7CFF", "#FFFFFF"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Confetti({ fire }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!fire) return;
    const newPieces = Array.from({ length: 70 }).map((_, i) => ({
      id: `${fire}-${i}`,
      left: randomBetween(5, 95),
      delay: randomBetween(0, 0.25),
      duration: randomBetween(1.1, 1.9),
      drift: randomBetween(-120, 120),
      rotate: randomBetween(180, 720),
      size: randomBetween(6, 11),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));
    setPieces(newPieces);
    const timeout = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(timeout);
  }, [fire]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-layer">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece confetti-piece--${p.shape}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift": `${p.drift}px`,
            "--rotate": `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
