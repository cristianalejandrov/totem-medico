import { useEffect, useRef, useState } from 'react';
import { tts } from '../voice/tts';

/**
 * Escenario del avatar Live2D (mitad superior del tótem).
 * Renderiza el modelo con PixiJS y cada frame inyecta la apertura de boca
 * que expone el servicio TTS (lip-sync por amplitud de audio).
 */
export default function AvatarStage({ caption }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('cargando'); // cargando | listo | error

  useEffect(() => {
    let app = null;
    let model = null;
    let disposed = false;

    (async () => {
      try {
        const PIXI = await import('pixi.js');
        // pixi-live2d-display necesita window.PIXI para su Ticker interno
        window.PIXI = PIXI;
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');
        if (disposed) return;

        app = new PIXI.Application({
          view: canvasRef.current,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          resizeTo: hostRef.current,
        });

        model = await Live2DModel.from('/models/haru/haru_greeter_t03.model3.json', {
          motionPreload: 'IDLE',
          autoInteract: false,
        });
        if (disposed) {
          model.destroy();
          return;
        }

        app.stage.addChild(model);

        const fit = () => {
          const w = app.renderer.width / app.renderer.resolution;
          const h = app.renderer.height / app.renderer.resolution;
          const ow = model.internalModel.originalWidth || model.width;
          // Mostramos cabeza y torso: el modelo se escala más grande que el
          // contenedor y se ancla arriba.
          const scale = (w / ow) * 1.55;
          model.scale.set(scale);
          model.anchor.set(0.5, 0.04);
          model.position.set(w / 2, -h * 0.02);
        };
        fit();
        window.addEventListener('resize', fit);
        model.once('destroyed', () => window.removeEventListener('resize', fit));

        // Lip-sync: justo antes de renderizar cada frame (después de motion,
        // física y pose) pisamos el parámetro de boca con el valor del TTS.
        const core = model.internalModel.coreModel;
        model.internalModel.on('beforeModelUpdate', () => {
          core.setParameterValueById('ParamMouthOpenY', tts.mouth);
        });

        setStatus('listo');
      } catch (err) {
        console.error('[Avatar] Error cargando Live2D:', err);
        if (!disposed) setStatus('error');
      }
    })();

    return () => {
      disposed = true;
      try {
        model?.destroy();
        app?.destroy(false, { children: true });
      } catch {
        /* cleanup best-effort */
      }
    };
  }, []);

  return (
    <div className="avatar-stage" ref={hostRef}>
      <div className="avatar-glow" aria-hidden="true" />
      <canvas ref={canvasRef} className="avatar-canvas" />
      {status === 'cargando' && (
        <div className="avatar-loading">
          <span className="spinner" aria-hidden="true" />
          Cargando asistente…
        </div>
      )}
      {status === 'error' && (
        <div className="avatar-loading">No se pudo cargar el avatar</div>
      )}
      {caption && (
        <div className="avatar-caption" role="status">
          {caption}
        </div>
      )}
    </div>
  );
}
