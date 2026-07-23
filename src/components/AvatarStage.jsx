import { useEffect, useRef, useState } from 'react'
import { tts } from '../voice/tts'

const EXPRESIONES_FELICES = ['f04', 'f01', 'f00', 'f06']

export default function AvatarStage({ caption, modelUrl = '/models/haru/haru_greeter_t03.model3.json' }) {
  const hostRef = useRef(null)
  const [status, setStatus] = useState('cargando')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let app = null
    let model = null
    let disposed = false
    let resizeObs = null
    let lastTapAt = 0

    const waitForSize = () =>
      new Promise((resolve) => {
        const ready = () => host.clientWidth > 0 && host.clientHeight > 0
        if (ready()) {
          resolve()
          return
        }
        const obs = new ResizeObserver(() => {
          if (ready()) {
            obs.disconnect()
            resolve()
          }
        })
        obs.observe(host)
        setTimeout(() => {
          obs.disconnect()
          resolve()
        }, 2000)
      })

    ;(async () => {
      try {
        setStatus('cargando')
        await waitForSize()
        if (disposed) return

        const PIXI = await import('pixi.js')
        window.PIXI = PIXI
        const { Live2DModel } = await import('pixi-live2d-display/cubism4')
        if (disposed) return

        const width = Math.max(host.clientWidth, 1)
        const height = Math.max(host.clientHeight, 1)

        app = new PIXI.Application({
          width,
          height,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          powerPreference: 'high-performance',
        })

        const view = app.view
        view.className = 'avatar-canvas'
        view.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:manipulation;cursor:pointer;'
        host.appendChild(view)

        model = await Live2DModel.from(modelUrl, {
          motionPreload: 'IDLE',
          autoInteract: false,
        })
        if (disposed) {
          model.destroy()
          return
        }

        app.stage.addChild(model)

        model.interactive = true
        model.buttonMode = true
        model.cursor = 'pointer'

        const reaccionar = () => {
          const now = Date.now()
          if (now - lastTapAt < 700) return
          lastTapAt = now
          model.motion('Tap')
          const expr =
            EXPRESIONES_FELICES[Math.floor(Math.random() * EXPRESIONES_FELICES.length)]
          try {
            model.expression(expr)
          } catch {
            /* ok */
          }
        }

        model.on('hit', reaccionar)
        model.on('pointertap', reaccionar)

        const fit = () => {
          if (!app || !model || disposed) return
          const w = app.renderer.width / app.renderer.resolution
          const h = app.renderer.height / app.renderer.resolution
          const ow = model.internalModel.originalWidth || model.width
          const scale = (w / ow) * 1.55
          model.scale.set(scale)
          model.anchor.set(0.5, 0.04)
          model.position.set(w / 2, -h * 0.02)
        }
        fit()

        resizeObs = new ResizeObserver(() => {
          if (!app || disposed) return
          app.renderer.resize(Math.max(host.clientWidth, 1), Math.max(host.clientHeight, 1))
          fit()
        })
        resizeObs.observe(host)

        const core = model.internalModel.coreModel
        model.internalModel.on('beforeModelUpdate', () => {
          core.setParameterValueById('ParamMouthOpenY', tts.mouth)
        })

        if (!disposed) setStatus('listo')
      } catch (err) {
        console.error('[Avatar] Error cargando Live2D:', err)
        if (!disposed) setStatus('error')
      }
    })()

    return () => {
      disposed = true
      try {
        resizeObs?.disconnect()
        model?.destroy()
        if (app) {
          const view = app.view
          app.destroy(true, { children: true, texture: true, baseTexture: true })
          if (view?.parentNode) view.parentNode.removeChild(view)
        }
      } catch {
        /* ok */
      }
    }
  }, [modelUrl])

  return (
    <div className="avatar-stage" ref={hostRef}>
      <div className="avatar-glow" aria-hidden="true" />
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
  )
}
