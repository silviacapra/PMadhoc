export function riskLevel(risks) {
  if (risks >= 4) return "alto";
  if (risks >= 2) return "medio";
  return "bajo";
}

const ACCENTS = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

export function slugify(name) {
  const noAccents = name
    .toLowerCase()
    .split("")
    .map((ch) => ACCENTS[ch] || ch)
    .join("");
  const base = noAccents.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base || "proyecto";
}
