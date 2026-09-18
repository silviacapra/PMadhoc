import { TriDotIcon } from "../icons/Icons";
import "./Logo.css";

export default function Logo({ variant = "dark", size = 34, textSize }) {
  return (
    <div className={`logo logo--${variant}`}>
      <TriDotIcon size={size} />
      <div className="logo-text" style={{ fontSize: textSize ?? size * 0.34 }}>
        <span>PMO</span>
        <span>Ad</span>
        <span>Hoc</span>
      </div>
    </div>
  );
}
