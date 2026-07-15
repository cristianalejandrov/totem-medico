# Tótem Médico — Clínica Vida

Tótem táctil vertical con asistente avatar 2D (Live2D) que guía al paciente por voz:
ingreso de RUT → pedir hora / consultar reservas → especialidad → doctor → horario → pago según previsión.

## Stack

- **React + Vite**
- **pixi-live2d-display** + PixiJS 6 (avatar 2D con lip-sync) — repo clonado en `vendor/` como referencia; el modelo de ejemplo (Haru) se sirve local desde `public/models/haru`
- **Google Cloud Text-to-Speech** (voz principal) con **respaldo automático** en `speechSynthesis` del navegador
- Reservas simuladas en `localStorage` (llave = RUT)

## Cómo correr

```bash
npm install
npm run dev
```

Abrir http://localhost:5173 (idealmente en ventana vertical o F12 → modo dispositivo).

## Google Cloud TTS — qué necesitas

1. Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilitar la API **Cloud Text-to-Speech**.
3. Crear una **API key** (APIs y servicios → Credenciales → Crear credenciales → Clave de API).
   - Recomendado: restringirla a la API de Text-to-Speech y al dominio/IP del tótem.
4. Crear un archivo `.env.local` en la raíz:

```
VITE_GOOGLE_TTS_API_KEY=TU_API_KEY
```

5. Reiniciar `npm run dev`.

Con la key configurada, el audio real de Google permite **lip-sync verdadero** (la boca sigue la amplitud del audio vía Web Audio). Sin key, el tótem funciona igual con la voz del navegador y una animación de boca procedural.

> Nota de producción: exponer la API key en el navegador es aceptable solo para pruebas. En producción, crea un endpoint propio (`/api/tts`) que llame a Google con credenciales de servidor y devuelva el MP3.

## Voz utilizada

`es-US-Neural2-A` (español latino, femenina). Se puede cambiar en `src/voice/tts.js` (`GOOGLE_VOICE`). Google no ofrece `es-CL`; alternativas: `es-US-Neural2-B/C`, `es-ES-Neural2-*`.

## Estructura

```
public/
  live2dcubismcore.min.js   # runtime Cubism 4 (local)
  models/haru/              # modelo Live2D de ejemplo
src/
  voice/tts.js              # Google TTS + fallback navegador + lip-sync
  components/AvatarStage.jsx# escenario Live2D (mitad superior)
  screens/                  # RUT, menú, especialidades, doctores, horarios, pago, confirmación, reservas
  utils/rut.js              # formateo con puntos/guion y validación DV
  data/                     # catálogo simulado y reservas en localStorage
vendor/pixi-live2d-display/ # clon del repo (referencia y origen de assets)
```

## Comportamientos de tótem

- RUT: teclado táctil en pantalla, puntos y guion automáticos, validación de dígito verificador. Si es inválido el avatar dice "RUT incorrecto" y a los 3 segundos entrega indicaciones.
- Consultar horas: muestra las reservas guardadas para el mismo RUT ingresado.
- Pago: selección de previsión (Fonasa / Isapre / Particular) con cobertura estimada y pasarela simulada.
- Inactividad: vuelve al inicio tras 2 minutos sin toques.

## Reemplazar el avatar

Cualquier modelo **Live2D Cubism 3/4** (`.model3.json`) sirve: cópialo a `public/models/<nombre>/` y cambia la ruta en `AvatarStage.jsx`. Para un avatar propio (ej. enfermera corporativa) se puede encargar un modelo Live2D (Booth.pm, nizima o comisión a un rigger).
