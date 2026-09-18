import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "../icons/Icons";
import "./FilterDropdown.css";

export default function FilterDropdown({ label, options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const count = selected.length;

  return (
    <div className="filter-dropdown" ref={ref}>
      <button className={`filter-dropdown-btn ${count > 0 ? "filter-dropdown-btn--active" : ""}`} onClick={() => setOpen((v) => !v)}>
        {label}
        {count > 0 && <span className="filter-dropdown-count">{count}</span>}
        <ChevronDownIcon size={14} color="currentColor" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div className="filter-dropdown-panel">
          <div className="filter-dropdown-options">
            {options.map((opt) => (
              <label key={opt.id} className="filter-dropdown-option">
                <input type="checkbox" checked={selected.includes(opt.id)} onChange={() => onToggle(opt.id)} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {count > 0 && (
            <span className="filter-dropdown-clear" onClick={onClear}>
              Limpiar
            </span>
          )}
        </div>
      )}
    </div>
  );
}
