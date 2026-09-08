import { PROJECT_STATUS_STYLES } from "../../data/statusStyles";
import "./StatusBadge.css";

export default function StatusBadge({ status, style }) {
  const def = PROJECT_STATUS_STYLES[status];
  if (!def) return null;
  return (
    <span
      className="status-badge"
      style={{ background: def.bg, color: def.color, ...style }}
    >
      {def.label}
    </span>
  );
}
