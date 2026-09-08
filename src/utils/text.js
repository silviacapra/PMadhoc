export function getInitials(name) {
  const words = (name || "").trim().split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
}

export function getFirstName(name) {
  return (name || "").trim().split(" ")[0] || "";
}
