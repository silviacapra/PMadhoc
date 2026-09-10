export const KB_CATEGORIES = [
  { label: "Fundamentos", emoji: "📘" },
  { label: "Riesgos", emoji: "⚠️" },
  { label: "Comunicación", emoji: "💬" },
  { label: "Agile", emoji: "🔄" },
  { label: "Cronograma", emoji: "🗓️" },
  { label: "Calidad", emoji: "✅" },
];

export const ARTICLES = [
  {
    title: "Qué es la triple restricción y por qué te la piden en cada reunión",
    category: "Fundamentos",
    readTime: "4 min",
    reference: "PMBOK® Guide – 6ª edición · Sección 1.2.6 \"Restricciones del proyecto\"",
    intro:
      "La triple restricción (o \"triángulo de hierro\") dice que todo proyecto se mueve entre tres variables que tiran unas de otras: alcance, tiempo y coste. Si tocas una, las otras dos se resienten.",
    diagram: "triple-restriccion",
    points: [
      {
        term: "Alcance",
        text: "Qué incluye el proyecto y qué queda fuera. Pedir \"más alcance sin más tiempo ni más presupuesto\" no es optimismo, es física del project management.",
      },
      {
        term: "Tiempo",
        text: "La fecha o el plazo disponible. Comprimirlo casi siempre implica gastar más (recursos extra) o recortar alcance.",
      },
      {
        term: "Coste",
        text: "El presupuesto y los recursos asignados. Es la variable que más rápido se puede mover, pero tiene un límite real.",
      },
      {
        term: "Calidad",
        text: "Muchos frameworks modernos la añaden en el centro del triángulo, como resultado de cómo se gestionan las otras tres — no como una cuarta variable independiente.",
        subitems: [
          "Si se recorta tiempo o coste sin tocar el alcance, la calidad suele ser la que paga la diferencia.",
          "Por eso el Status Report de esta app usa siempre estas cuatro categorías en semáforo: alcance, cronograma, presupuesto y calidad.",
        ],
      },
    ],
    closing:
      "El truco para usarla en una reunión real: cuando alguien pida un cambio, dibuja el triángulo en voz alta. \"Vale, añadimos esto: ¿de dónde sacamos el tiempo o el presupuesto?\". Convierte una discusión emocional en una decisión de trade-off explícita.",
  },
  {
    title: "Cómo montar un registro de riesgos que de verdad se usa",
    category: "Riesgos",
    readTime: "6 min",
    reference: "PMBOK® Guide – 6ª edición · Capítulo 11 \"Gestión de los riesgos del proyecto\", sección 11.2",
    intro:
      "Un registro de riesgos que nadie mira es papeleo. Uno que se revisa cada semana es una de las herramientas más rentables de todo el proyecto: cuesta minutos y evita sorpresas que cuestan semanas.",
    diagram: "riesgos-matriz",
    points: [
      {
        term: "Estructura mínima",
        text: "Descripción del riesgo, probabilidad, impacto, propietario (una sola persona, no \"el equipo\") y una acción concreta de mitigación. Si un riesgo no tiene propietario, en la práctica no tiene dueño y no se gestiona.",
      },
      {
        term: "Categorización ROAM",
        text: "Una técnica muy usada para no acumular listas eternas que no distinguen lo urgente de lo archivado:",
        subitems: [
          "Resolved — ya resuelto.",
          "Owned — tiene dueño y un plan en marcha.",
          "Accepted — aceptado conscientemente, sin plan porque el coste de mitigarlo supera al impacto.",
          "Mitigated — ya mitigado, se mantiene en observación.",
        ],
      },
      {
        term: "Matriz probabilidad-impacto",
        text: "Una tabla 3x3 o 5x5 ayuda a priorizar: no todos los riesgos merecen la misma atención en la reunión semanal. Los de probabilidad y impacto altos van primero, siempre (ver diagrama).",
      },
    ],
    closing:
      "Revisa el registro en cada punto de control del roadmap (los \"gate review\"), no solo cuando algo ya ha pasado. Un riesgo bien gestionado es aburrido: se ve venir, se mitiga, y no aparece en ningún informe de estado en rojo.",
  },
  {
    title: "Plan de comunicación: quién necesita saber qué, y cuándo",
    category: "Comunicación",
    readTime: "5 min",
    reference: "PMBOK® Guide – 6ª edición · Capítulo 10 \"Gestión de las comunicaciones del proyecto\", sección 10.1",
    intro:
      "La mayoría de \"problemas de gestión de proyectos\" son en realidad problemas de comunicación disfrazados: alguien no sabía algo que debería haber sabido, o se enteró demasiado tarde.",
    points: [
      {
        term: "Qué necesita saber",
        text: "El contenido relevante para ese stakeholder concreto — no el mismo informe para todos.",
      },
      {
        term: "Con qué frecuencia",
        text: "No es lo mismo el sponsor (informe quincenal + reunión de comité) que el equipo (seguimiento diario en el tablero).",
      },
      {
        term: "Por qué canal",
        text: "Email, reunión, tablero compartido... el canal importa tanto como el contenido.",
      },
      {
        term: "Quién se lo cuenta",
        text: "Una matriz de comunicación sencilla, una fila por stakeholder, evita el error más común: tratar a todo el mundo igual.",
      },
    ],
    closing:
      "Un buen indicador de que el plan de comunicación funciona: nadie se sorprende en una reunión de comité. Si el sponsor se entera en la reunión mensual de un riesgo que el equipo conocía desde hace tres semanas, el plan de comunicación ha fallado, no el proyecto.",
  },
  {
    title: "Scrum vs. Waterfall: cuándo conviene cada uno",
    category: "Agile",
    readTime: "7 min",
    reference: "PMI Agile Practice Guide · Sección 2 \"Ciclos de vida ágiles y ciclos de vida híbridos\"",
    intro:
      "Waterfall (cascada) planifica todo el proyecto por adelantado y avanza fase a fase. Scrum (ágil) divide el trabajo en sprints cortos con entregas incrementales. Ninguno es \"mejor\" en abstracto.",
    points: [
      {
        term: "Cuándo conviene Waterfall",
        text: "El resultado final está claro desde el principio y los cambios son costosos: obra civil, cumplimiento normativo, migraciones de sistemas críticos.",
      },
      {
        term: "Cuándo conviene Scrum",
        text: "El resultado final no está del todo claro, el feedback del usuario es valioso pronto, y el coste de cambiar de dirección es bajo.",
      },
      {
        term: "La pregunta que de verdad importa",
        text: "No es \"¿cuál es mejor?\" sino \"¿cuánto va a cambiar el alcance durante el proyecto, y cuánto cuesta ese cambio si ya hemos avanzado?\". Mucho + caro → cascada. Probablemente + barato → ágil.",
      },
      {
        term: "Proyectos híbridos",
        text: "En la práctica, muchos proyectos trabajan la fase de planificación y arquitectura en cascada, y la construcción del producto en sprints ágiles.",
      },
    ],
    closing:
      "Por eso en la app puedes marcar cada proyecto como Cascada, Ágil o Híbrida, y las plantillas se adaptan a esa elección.",
  },
  {
    title: "La matriz RACI explicada sin jerga",
    category: "Fundamentos",
    readTime: "3 min",
    reference: "PMBOK® Guide – 6ª edición · Capítulo 9 \"Gestión de los recursos del proyecto\", sección 9.1.2.2",
    intro:
      "RACI son las siglas de Responsable, Aprobador (Accountable), Consultado e Informado. Es una tabla con las tareas en filas y las personas en columnas, y en cada celda se marca qué papel tiene cada persona en cada tarea.",
    diagram: "raci",
    points: [
      {
        term: "Responsable (R)",
        text: "Quien hace el trabajo. Puede haber varios responsables ejecutando una misma tarea.",
      },
      {
        term: "Aprobador (A)",
        text: "Quien responde por el resultado ante el sponsor, aunque no lo haya hecho con sus manos. Regla de oro: cada tarea debe tener exactamente UN aprobador — si dos personas lo son, en la práctica nadie lo es.",
      },
      {
        term: "Consultado (C)",
        text: "Da su opinión antes de que se cierre la decisión o la tarea.",
      },
      {
        term: "Informado (I)",
        text: "Se entera del resultado, pero no participa en la decisión.",
      },
    ],
    closing:
      "Rellenar un RACI al principio del proyecto (durante la fase de Planificar) evita después la típica frase: \"pensé que eso lo llevabas tú\".",
  },
  {
    title: "Cómo priorizar el backlog cuando todo es 'urgente'",
    category: "Agile",
    readTime: "5 min",
    reference: "PMI Agile Practice Guide · Sección 5 \"Implementación ágil\"",
    intro:
      "Cuando todo el backlog está marcado como \"alta prioridad\", en la práctica no hay prioridades — hay una lista desordenada con una etiqueta encima. Priorizar de verdad significa decir que algo es más importante que otra cosa, con un criterio explícito.",
    diagram: "moscow",
    points: [
      {
        term: "MoSCoW",
        text: "El método más sencillo para obligar a decidir, no a acumular:",
        subitems: [
          "Must — imprescindible para el lanzamiento.",
          "Should — importante pero no bloqueante.",
          "Could — deseable si sobra tiempo.",
          "Won't — fuera de este alcance, por ahora.",
        ],
      },
      {
        term: "Valor frente a esfuerzo",
        text: "Dibuja cada historia de usuario en una matriz 2x2 (alto/bajo valor, alto/bajo esfuerzo). Las de alto valor y bajo esfuerzo van primero — son las victorias rápidas que generan confianza en el equipo y el sponsor.",
      },
    ],
    closing:
      "Sea cual sea el método, la priorización tiene que revisarse cada sprint, no fijarse una vez y olvidarse. El backlog es un documento vivo, no un contrato.",
  },
  {
    title: "WBS: cómo desglosar un proyecto sin perderte en el intento",
    category: "Cronograma",
    readTime: "6 min",
    reference: "PMBOK® Guide – 6ª edición · Capítulo 5 \"Gestión del alcance del proyecto\", sección 5.4 \"Crear la EDT/WBS\"",
    intro:
      "El WBS (Work Breakdown Structure, o desglose de tareas) es el mapa que convierte \"hay que hacer el proyecto\" en una lista de tareas concretas, asignables y medibles. Sin un buen WBS, el cronograma se construye sobre arena.",
    points: [
      {
        term: "La regla del 8/80",
        text: "Cada tarea del nivel más bajo del WBS debería tener entre 8 y 80 horas de trabajo. Más pequeña: estás micro-gestionando. Más grande: en realidad es una fase disfrazada de tarea.",
      },
      {
        term: "De arriba a abajo",
        text: "Primero las grandes fases o entregables, luego se van desglosando hasta llegar a tareas asignables a una persona o a un equipo pequeño. El resultado no es una lista, es un árbol.",
      },
      {
        term: "El trabajo invisible",
        text: "Un buen WBS hace visible el trabajo que \"no se ve\" (documentación, pruebas, formación al cliente) y que, si no está en el WBS, casi nunca está en el cronograma ni en el presupuesto.",
      },
    ],
  },
  {
    title: "Gate review: qué es y por qué el botón de avanzar de fase está bloqueado",
    category: "Calidad",
    readTime: "4 min",
    reference: "PMBOK® Guide – 6ª edición · Sección 1.2.4.3 \"Fases del proyecto\" (phase gates)",
    intro:
      "Un gate review (revisión de puerta) es un punto de control obligatorio antes de pasar de una fase del proyecto a la siguiente: no avances a Ejecutar si el plan de Planificar todavía tiene huecos, porque cada fallo que se cuela se vuelve más caro de arreglar cuanto más tarde se detecta.",
    points: [
      {
        term: "Por qué el botón está bloqueado",
        text: "En el roadmap de cada proyecto, \"Avanzar a la siguiente fase\" está desactivado hasta marcar todos los requisitos del checklist. No es burocracia: asegura que el acta de constitución está firmada antes de gastar presupuesto en Ejecutar, o que las pruebas de calidad están superadas antes de dar el proyecto por controlado.",
      },
      {
        term: "Cómo diseñar un buen gate",
        text: "Pocos requisitos, pero todos de verdad bloqueantes. Si el checklist tiene 20 casillas y nadie las lee de verdad, deja de proteger el proyecto y se convierte en un trámite que la gente marca sin pensar.",
      },
    ],
  },
  {
    title: "Gestión de stakeholders: mapear antes de comunicar",
    category: "Comunicación",
    readTime: "5 min",
    reference: "PMBOK® Guide – 6ª edición · Capítulo 13 \"Gestión de los interesados del proyecto\", sección 13.1",
    intro:
      "Antes de escribir un solo informe de estado, conviene mapear a los stakeholders del proyecto: quién tiene poder de decisión, quién se ve afectado por el resultado, y quién puede bloquear el proyecto si no está de tu lado.",
    diagram: "stakeholder-matriz",
    points: [
      {
        term: "Matriz poder / interés",
        text: "A quién tiene mucho poder y mucho interés hay que gestionarlo de cerca (reuniones frecuentes, involucrarlo en decisiones); a quién tiene mucho poder pero poco interés, hay que mantenerlo satisfecho con informes puntuales, sin saturarlo (ver diagrama).",
      },
      {
        term: "El sponsor no es un stakeholder cualquiera",
        text: "Es quien firma el caso de negocio y quien responde ante el resto de la organización si el proyecto no entrega valor. Por eso su plan de comunicación normalmente incluye una reunión de comité de dirección, no solo un informe por email.",
      },
    ],
    closing:
      "La sección de Stakeholders de esta app recoge exactamente esto: quién es cada persona, cómo se le localiza, y cuál es su plan de comunicación acordado — para no tener que reconstruirlo de memoria en cada proyecto nuevo.",
  },
  {
    title: "Lecciones aprendidas: por qué conviene registrarlas sobre la marcha",
    category: "Fundamentos",
    readTime: "4 min",
    reference: "PMBOK® Guide – 6ª edición · Sección 4.4 \"Gestionar el conocimiento del proyecto\"",
    intro:
      "La lección aprendida más cara es la que se repite. Y se repite, casi siempre, porque solo se documentó al cerrar el proyecto — cuando ya nadie se acuerda de los detalles importantes ni tiene tiempo de escribirlos con cuidado.",
    points: [
      {
        term: "Apúntalas en caliente",
        text: "Una lección apuntada la semana que ocurrió tiene diez veces más valor que la misma lección reconstruida de memoria tres meses después.",
      },
      {
        term: "Qué hace buena una lección aprendida",
        text: "No es solo \"esto salió mal\": incluye qué se haría diferente la próxima vez, de forma que sea útil para otro proyecto, no solo un desahogo sobre el actual.",
      },
      {
        term: "Compártelas entre proyectos",
        text: "Revisarlas al planificar uno nuevo es una de las prácticas con mejor relación entre esfuerzo y resultado en toda la gestión de proyectos: cuesta poco, y evita errores caros ya conocidos por la organización.",
      },
    ],
  },
];
