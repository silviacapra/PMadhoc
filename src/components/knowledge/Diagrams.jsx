export function TripleRestriccionDiagram() {
  return (
    <svg viewBox="0 0 360 260" className="kb-diagram">
      <polygon points="180,20 30,225 330,225" fill="none" stroke="var(--blue-primary)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="180" cy="158" r="34" fill="var(--gray-light)" stroke="var(--accent)" strokeWidth="2" />
      <text x="180" y="154" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--gray-dark)">
        Calidad
      </text>
      <text x="180" y="169" textAnchor="middle" fontSize="9" fill="var(--text-faint)">
        (resultado)
      </text>
      <text x="180" y="14" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--blue-primary)">
        Alcance
      </text>
      <text x="18" y="245" textAnchor="start" fontSize="13" fontWeight="700" fill="var(--blue-primary)">
        Tiempo
      </text>
      <text x="342" y="245" textAnchor="end" fontSize="13" fontWeight="700" fill="var(--blue-primary)">
        Coste
      </text>
    </svg>
  );
}

export function RiesgosMatrixDiagram() {
  const impactos = ["Alto", "Medio", "Bajo"];
  const colors = [
    ["#f6c9c6", "#f9dcb0", "#d9ecd1"],
    ["#f9dcb0", "#f6e6a8", "#d9ecd1"],
    ["#d9ecd1", "#d9ecd1", "#d9ecd1"],
  ];
  return (
    <svg viewBox="0 0 360 240" className="kb-diagram">
      {colors.map((row, r) =>
        row.map((c, cIdx) => <rect key={`${r}-${cIdx}`} x={70 + cIdx * 90} y={20 + r * 60} width="86" height="56" fill={c} rx="4" />)
      )}
      {impactos.map((label, i) => (
        <text key={label} x="60" y={20 + i * 60 + 33} textAnchor="end" fontSize="11" fontWeight="600" fill="var(--gray-dark)">
          {label}
        </text>
      ))}
      {["Baja", "Media", "Alta"].map((label, i) => (
        <text key={label} x={70 + i * 90 + 43} y="210" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--gray-dark)">
          {label}
        </text>
      ))}
      <text x="20" y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--blue-primary)" transform="rotate(-90 20 120)">
        Impacto
      </text>
      <text x="200" y="230" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--blue-primary)">
        Probabilidad
      </text>
    </svg>
  );
}

export function RaciDiagram() {
  const roles = [
    { letter: "R", label: "Responsable", color: "#4caf88" },
    { letter: "A", label: "Aprobador", color: "#002d62" },
    { letter: "C", label: "Consultado", color: "#c08a00" },
    { letter: "I", label: "Informado", color: "#8a8a8a" },
  ];
  return (
    <svg viewBox="0 0 360 130" className="kb-diagram">
      {roles.map((r, i) => (
        <g key={r.letter} transform={`translate(${20 + i * 85}, 10)`}>
          <circle cx="35" cy="35" r="30" fill={r.color} />
          <text x="35" y="45" textAnchor="middle" fontSize="24" fontWeight="700" fill="#FFFFFF">
            {r.letter}
          </text>
          <text x="35" y="88" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--gray-dark)">
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function StakeholderMatrixDiagram() {
  const quadrants = [
    { x: 20, y: 20, label: "Mantener\nsatisfecho", sub: "alto poder · bajo interés" },
    { x: 190, y: 20, label: "Gestionar\nde cerca", sub: "alto poder · alto interés" },
    { x: 20, y: 130, label: "Monitorizar", sub: "bajo poder · bajo interés" },
    { x: 190, y: 130, label: "Mantener\ninformado", sub: "bajo poder · alto interés" },
  ];
  return (
    <svg viewBox="0 0 360 240" className="kb-diagram">
      {quadrants.map((q) => (
        <g key={q.label}>
          <rect x={q.x} y={q.y} width="150" height="95" fill="var(--gray-light)" stroke="var(--border-light)" rx="6" />
          {q.label.split("\n").map((line, i) => (
            <text key={i} x={q.x + 75} y={q.y + 38 + i * 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--blue-primary)">
              {line}
            </text>
          ))}
          <text x={q.x + 75} y={q.y + 75} textAnchor="middle" fontSize="9" fill="var(--text-faint)">
            {q.sub}
          </text>
        </g>
      ))}
      <text x="10" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--gray-dark)" transform="rotate(-90 10 130)">
        Poder
      </text>
      <text x="190" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--gray-dark)">
        Interés
      </text>
    </svg>
  );
}

export function MoscowDiagram() {
  const rows = [
    { label: "Must — imprescindible", width: 300, color: "#b3261e" },
    { label: "Should — importante", width: 230, color: "#c08a00" },
    { label: "Could — deseable", width: 160, color: "var(--accent)" },
    { label: "Won't — fuera de alcance ahora", width: 90, color: "#c7c7c7" },
  ];
  return (
    <svg viewBox="0 0 360 160" className="kb-diagram">
      {rows.map((r, i) => (
        <g key={r.label} transform={`translate(0, ${i * 38})`}>
          <rect x="0" y="0" width={r.width} height="24" fill={r.color} rx="4" />
          <text x="8" y="16" fontSize="11" fontWeight="700" fill="#FFFFFF">
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
