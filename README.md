# PM Ad Hoc

**PM Ad Hoc** es una aplicación web de gestión de proyectos con enfoque de PMO (oficina de gestión de proyectos), pensada para la consultora ficticia "Adhoc Consulting". Incluye inicio de sesión con roles, un dashboard de proyectos, un catálogo de objetivos estratégicos (OKR), un roadmap de proyecto con checklist de avance de fase, un repositorio de plantillas, informes de estado (Status Report), una base de conocimiento y un chatbot de ejemplo.

Esta es la versión de **frontend**: todo lo que se ve y con lo que se interactúa en el navegador. Los datos (proyectos, OKR, plantillas...) están guardados solo en la memoria del navegador mientras la app está abierta — no hay servidor, base de datos ni inicio de sesión real todavía. Eso llegará en una fase posterior.

## Qué tecnología usa

Está construida con [React](https://react.dev/) (la librería para construir la interfaz) y [Vite](https://vitejs.dev/) (la herramienta que arranca y empaqueta el proyecto). No hace falta entender estas herramientas para usar la app: solo hay que seguir los pasos de abajo.

## Cómo instalar y arrancar la app en tu ordenador

Necesitas tener instalado **Node.js** (el programa que permite ejecutar este tipo de proyectos). Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org/) (elige la versión "LTS") e instálalo como cualquier otro programa.

Una vez instalado Node.js, sigue estos pasos:

1. **Abre una terminal** (en Mac: la aplicación "Terminal", que puedes buscar con Spotlight, la lupa arriba a la derecha).

2. **Ve a la carpeta del proyecto.** Escribe este comando y pulsa Enter (ajusta la ruta si tu carpeta está en otro sitio):

   ```bash
   cd /Users/silviacapra/Documents/PM_App
   ```

3. **Instala las dependencias.** Esto descarga todas las piezas que la app necesita para funcionar. Solo hace falta hacerlo una vez (o cada vez que vuelvas a clonar el proyecto):

   ```bash
   npm install
   ```

   Este paso puede tardar uno o dos minutos.

4. **Arranca la app en modo desarrollo:**

   ```bash
   npm run dev
   ```

5. En la terminal aparecerá una dirección como `http://localhost:5173/`. Ábrela en tu navegador (Chrome, Safari...) y verás la pantalla de inicio de sesión de PM Ad Hoc.

6. Para parar el servidor, vuelve a la terminal y pulsa `Ctrl + C`.

## Cómo probar la app

En la pantalla de inicio, ve a la pestaña **"Registrarse"** y crea una cuenta de ejemplo eligiendo un rol (Sponsor, Project manager, Team o Experto). Según el rol que elijas verás unas secciones u otras en el menú de la izquierda — así está pensado.

Como no hay servidor real, cualquier correo y contraseña funcionan para entrar, y los datos que crees (un proyecto nuevo, un objetivo OKR...) solo se guardan mientras tengas la pestaña del navegador abierta.

## Estructura de carpetas

```
src/
  components/     Las piezas visuales de cada pantalla (Dashboard, Roadmap, Plantillas...)
  data/           Los datos de ejemplo (proyectos, OKR, plantillas, equipo...)
  hooks/          El "cerebro" de la app: dónde vive toda la información mientras la usas
  styles/         Colores, tipografía y estilos generales
  utils/          Pequeñas funciones de apoyo (filtros, formateo de texto...)
```

## Próximas fases (no incluidas todavía)

- Servidor y base de datos reales, para que los datos se guarden de verdad.
- Inicio de sesión real, con contraseñas verificadas.
- El chatbot conectado a una IA real (hoy responde siempre lo mismo, a modo de ejemplo).
