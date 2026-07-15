/**
 * Servicio de voz del tótem.
 *
 * Modo principal: Google Cloud Text-to-Speech (REST). Devuelve el audio real,
 * lo que permite lip-sync verdadero midiendo la amplitud con Web Audio.
 *
 * Respaldo automático: speechSynthesis del navegador (sin acceso al audio,
 * la boca se anima de forma procedural mientras habla).
 *
 * Config: define VITE_GOOGLE_TTS_API_KEY en un archivo .env.local
 */

const API_KEY = import.meta.env.VITE_GOOGLE_TTS_API_KEY || '';
const GOOGLE_VOICE = { languageCode: 'es-US', name: 'es-US-Neural2-A' };

class TTSService {
  constructor() {
    this.mouth = 0; // 0..1 apertura de boca, leída por el avatar cada frame
    this.speaking = false;
    this.audioCtx = null;
    this.currentSource = null;
    this.rafId = null;
    this.fallbackTimer = null;
    this.utterance = null;
    this.onCaption = null; // (texto|null) => void
    this.onSpeakingChange = null; // (bool) => void
    this.cache = new Map(); // texto -> AudioBuffer
    this.generation = 0;
  }

  _ctx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    return this.audioCtx;
  }

  _setSpeaking(v) {
    this.speaking = v;
    this.onSpeakingChange?.(v);
  }

  cancel() {
    this.generation++;
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
      } catch {
        /* ya detenido */
      }
      this.currentSource = null;
    }
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
    this.rafId = null;
    this.fallbackTimer = null;
    window.speechSynthesis?.cancel();
    this.mouth = 0;
    this._setSpeaking(false);
    this.onCaption?.(null);
  }

  /**
   * Habla el texto. Cancela cualquier locución anterior.
   * Resuelve cuando termina (o cuando fue interrumpida).
   */
  async speak(text) {
    this.cancel();
    const gen = this.generation;
    this.onCaption?.(text);
    this._setSpeaking(true);

    try {
      if (API_KEY) {
        await this._speakGoogle(text, gen);
      } else {
        await this._speakBrowser(text, gen);
      }
    } catch (err) {
      console.warn('[TTS] Google TTS falló, usando voz del navegador:', err);
      if (gen === this.generation) {
        await this._speakBrowser(text, gen);
      }
    } finally {
      if (gen === this.generation) {
        this.mouth = 0;
        this._setSpeaking(false);
        this.onCaption?.(null);
      }
    }
  }

  async _fetchGoogleAudio(text) {
    if (this.cache.has(text)) return this.cache.get(text);
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: GOOGLE_VOICE,
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.98, pitch: 1.0 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Google TTS HTTP ${res.status}`);
    const { audioContent } = await res.json();
    const bytes = Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0));
    const buffer = await this._ctx().decodeAudioData(bytes.buffer);
    this.cache.set(text, buffer);
    return buffer;
  }

  _speakGoogle(text, gen) {
    return this._fetchGoogleAudio(text).then((buffer) => {
      if (gen !== this.generation) return;
      return new Promise((resolve) => {
        const ctx = this._ctx();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        this.currentSource = source;

        const data = new Uint8Array(analyser.fftSize);
        let smooth = 0;
        const tick = () => {
          if (gen !== this.generation) return;
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          const target = Math.min(1, rms * 6.5);
          // ataque rápido, caída suave: se ve natural en la boca
          smooth = target > smooth ? target : smooth * 0.75;
          this.mouth = smooth;
          this.rafId = requestAnimationFrame(tick);
        };
        tick();

        source.onended = () => {
          if (this.rafId) cancelAnimationFrame(this.rafId);
          if (gen === this.generation) this.mouth = 0;
          resolve();
        };
        source.start();
      });
    });
  }

  _speakBrowser(text, gen) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-CL';
      utter.rate = 0.95;
      const voices = synth.getVoices();
      const esVoice =
        voices.find((v) => v.lang.startsWith('es-CL')) ||
        voices.find((v) => v.lang.startsWith('es-419')) ||
        voices.find((v) => v.lang.startsWith('es'));
      if (esVoice) utter.voice = esVoice;
      this.utterance = utter;

      // Sin acceso al audio: animación procedural de boca mientras habla
      utter.onstart = () => {
        if (gen !== this.generation) return;
        let t = 0;
        this.fallbackTimer = setInterval(() => {
          t += 0.35;
          const base = (Math.sin(t * 3.1) + Math.sin(t * 5.7)) * 0.25 + 0.45;
          this.mouth = Math.max(0.05, Math.min(1, base + Math.random() * 0.2));
        }, 55);
      };
      const finish = () => {
        if (this.fallbackTimer) clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
        if (gen === this.generation) this.mouth = 0;
        resolve();
      };
      utter.onend = finish;
      utter.onerror = finish;
      synth.speak(utter);
    });
  }
}

export const tts = new TTSService();
export const hasGoogleTTS = Boolean(API_KEY);
