import "./Logo.css";

const LOGO_SRC = {
  dark: "/img/logo-dark.svg",
  light: "/img/logo-light.svg",
};

export default function Logo({ variant = "dark", size = 34 }) {
  return <img className="logo" src={LOGO_SRC[variant]} alt="PMO Ad Hoc" style={{ height: size, width: "auto" }} />;
}
