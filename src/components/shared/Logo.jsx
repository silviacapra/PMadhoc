import { TriDotIcon } from "../icons/Icons";
import "./Logo.css";

export default function Logo({ variant = "dark", size = 34 }) {
  return (
    <div className={`logo logo--${variant}`}>
      <TriDotIcon size={size} />
      <div className="logo-text" style={{ fontSize: size * 0.34 }}>
        <span>PMO</span>
        <span>Ad</span>
        <span>Hoc</span>
      </div>
    </div>
  );
}
