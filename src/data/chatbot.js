export const INITIAL_MESSAGES = [
  { from: "user", text: "¿Qué tool puedo usar para el análisis de riesgo de mi proyecto?" },
  {
    from: "bot",
    text: "Para un análisis cualitativo, usa una matriz de probabilidad e impacto y regístralo en el registro de riesgos del PMI. Si necesitas algo cuantitativo, una simulación Montecarlo sobre el cronograma te da un rango de fechas más realista. ¿Quieres que te abra la plantilla del registro de riesgos?",
  },
];

export const DEFAULT_BOT_REPLY =
  "Buena pregunta. Revisa la base de conocimiento para el concepto y la sección de plantillas para el artefacto correspondiente del PMI; si quieres, te lo dejo abierto directamente.";
