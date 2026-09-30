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

export function CommPlanDiagram() {
  const rows = [
    { who: "Patrocinador", freq: "Quincenal", canal: "Comité" },
    { who: "Equipo", freq: "Diario", canal: "Tablero" },
    { who: "Cliente", freq: "Mensual", canal: "Informe" },
  ];
  return (
    <svg viewBox="0 0 360 170" className="kb-diagram">
      <rect x="10" y="10" width="340" height="34" fill="var(--blue-primary)" rx="6" />
      {["Contacto clave", "Frecuencia", "Canal"].map((h, i) => (
        <text key={h} x={30 + i * 115} y="32" fontSize="12" fontWeight="700" fill="#FFFFFF">
          {h}
        </text>
      ))}
      {rows.map((r, i) => (
        <g key={r.who} transform={`translate(0, ${52 + i * 38})`}>
          <rect x="10" y="0" width="340" height="30" fill={i % 2 === 0 ? "var(--gray-light)" : "#FFFFFF"} rx="4" />
          <text x="30" y="20" fontSize="11.5" fontWeight="600" fill="var(--gray-dark)">
            {r.who}
          </text>
          <text x="145" y="20" fontSize="11.5" fill="var(--text-muted)">
            {r.freq}
          </text>
          <text x="260" y="20" fontSize="11.5" fill="var(--text-muted)">
            {r.canal}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ScrumWaterfallDiagram() {
  const waterfall = ["Requisitos", "Diseño", "Desarrollo", "Pruebas"];
  return (
    <svg viewBox="0 0 360 190" className="kb-diagram">
      <text x="10" y="18" fontSize="11" fontWeight="700" fill="var(--blue-primary)">
        Waterfall
      </text>
      {waterfall.map((label, i) => (
        <g key={label}>
          <rect x={10 + i * 88} y="26" width="78" height="34" fill="var(--blue-primary)" rx="5" />
          <text x={49 + i * 88} y="47" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
            {label}
          </text>
          {i < waterfall.length - 1 && (
            <text x={92 + i * 88} y="48" fontSize="14" fill="var(--text-faint)">
              →
            </text>
          )}
        </g>
      ))}
      <text x="10" y="100" fontSize="11" fontWeight="700" fill="var(--accent)">
        Scrum
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 110}, 112)`}>
          <circle cx="30" cy="30" r="30" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray="10 6" />
          <text x="30" y="35" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--accent)">
            Sprint {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function WbsDiagram() {
  const fases = [
    { x: 30, label: "Fase 1" },
    { x: 140, label: "Fase 2" },
    { x: 250, label: "Fase 3" },
  ];
  return (
    <svg viewBox="0 0 360 190" className="kb-diagram">
      <rect x="130" y="10" width="100" height="32" fill="var(--blue-primary)" rx="5" />
      <text x="180" y="31" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
        Proyecto
      </text>
      {fases.map((f) => (
        <line key={f.label} x1="180" y1="42" x2={f.x + 40} y2="66" stroke="var(--border-light)" strokeWidth="2" />
      ))}
      {fases.map((f) => (
        <g key={f.label}>
          <rect x={f.x} y="66" width="80" height="30" fill="var(--accent)" rx="5" />
          <text x={f.x + 40} y="86" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
            {f.label}
          </text>
          {[0, 1].map((j) => (
            <line
              key={j}
              x1={f.x + 40}
              y1="96"
              x2={f.x + 20 + j * 40}
              y2="126"
              stroke="var(--border-light)"
              strokeWidth="2"
            />
          ))}
          {[0, 1].map((j) => (
            <rect key={j} x={f.x + j * 40} y="126" width="36" height="26" fill="var(--gray-light)" stroke="var(--border-light)" rx="4" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function GateReviewDiagram() {
  const fases = ["Iniciar", "Planificar", "Ejecutar"];
  return (
    <svg viewBox="0 0 360 120" className="kb-diagram">
      {fases.map((label, i) => (
        <g key={label}>
          <rect x={10 + i * 122} y="30" width="96" height="40" fill="var(--gray-light)" stroke="var(--blue-primary)" strokeWidth="1.5" rx="6" />
          <text x={58 + i * 122} y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--blue-primary)">
            {label}
          </text>
          {i < fases.length - 1 && (
            <g transform={`translate(${106 + i * 122}, 50)`}>
              <polygon points="0,-14 16,0 0,14 -16,0" fill="var(--accent)" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF">
                ✓
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export function LessonsLearnedDiagram() {
  const steps = [
    { lines: ["Proyecto", "en curso"], angle: -90 },
    { lines: ["Se apunta", "la lección"], angle: 0 },
    { lines: ["Se", "comparte"], angle: 90 },
    { lines: ["Próximo", "proyecto"], angle: 180 },
  ];
  const cx = 180;
  const cy = 105;
  const r = 68;
  return (
    <svg viewBox="0 0 360 210" className="kb-diagram">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="6 5" />
      {steps.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={s.lines.join(" ")}>
            <circle cx={x} cy={y} r="32" fill="var(--blue-primary)" />
            <text x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="700" fill="#FFFFFF">
              {s.lines.map((line, i) => (
                <tspan key={i} x={x} dy={i === 0 ? -2 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DocumentPreviewDiagram() {
  return (
    <svg viewBox="0 0 360 220" className="kb-diagram">
      <rect x="60" y="10" width="240" height="200" fill="#FFFFFF" stroke="var(--border-light)" strokeWidth="2" rx="8" />
      <rect x="84" y="34" width="130" height="12" fill="var(--blue-primary)" rx="3" />
      {[70, 96, 122, 148, 174].map((y) => (
        <rect key={y} x="84" y={y} width={y === 174 ? 120 : 192} height="8" fill="var(--gray-light)" rx="3" />
      ))}
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
