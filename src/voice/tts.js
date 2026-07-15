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
// Neural2-A = femenina latina (Neural2-C a veces suena más grave/masculina)
const GOOGLE_VOICE = {
  languageCode: 'es-US',
  name: 'es-US-Neural2-A',
  ssmlGender: 'FEMALE',
};

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
   * Evita deletreo ("erre u te") y lectura en inglés ("rat").
   * En voz preferimos "número de cédula" / frase natural.
   */
  _prepareSpeech(text) {
    return String(text)
      .replace(/\bRUT\b/gi, 'número de cédula')
      .replace(/\brut\b/g, 'número de cédula');
  }

  /**
   * Habla el texto. Cancela cualquier locución anterior.
   * Resuelve cuando termina (o cuando fue interrumpida).
   */
  async speak(text) {
    this.cancel();
    const gen = this.generation;
    const spoken = this._prepareSpeech(text);
    this.onCaption?.(text);
    this._setSpeaking(true);

    try {
      if (API_KEY) {
        await this._speakGoogle(spoken, gen);
      } else {
        await this._speakBrowser(spoken, gen);
      }
    } catch (err) {
      console.warn('[TTS] Google TTS falló, usando voz del navegador:', err);
      if (gen === this.generation) {
        await this._speakBrowser(spoken, gen);
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
    const cacheKey = `${GOOGLE_VOICE.name}|${text}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: GOOGLE_VOICE,
          // pitch 3 = voz más tierna/juvenil (-20..20)
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 3.0 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Google TTS HTTP ${res.status}`);
    const { audioContent } = await res.json();
    const bytes = Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0));
    const buffer = await this._ctx().decodeAudioData(bytes.buffer);
    this.cache.set(cacheKey, buffer);
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

  /**
   * Elige una voz femenina en español del navegador.
   * En Windows típico: "Microsoft Sabina Desktop" (es-MX) o "Helena" (es-ES).
   */
  _pickCuteEsVoice(voices) {
    if (!voices?.length) return null;
    const es = voices.filter((v) => v.lang?.toLowerCase().startsWith('es'));
    if (!es.length) return null;

    const name = (v) => (v.name || '').toLowerCase();
    const prefer = [
      (v) => name(v).includes('sabina'), // latina, femenina (Windows)
      (v) => name(v).includes('helena'),
      (v) => name(v).includes('elvira'),
      (v) => name(v).includes('lucia') || name(v).includes('lucía'),
      (v) => name(v).includes('paulina'),
      (v) => name(v).includes('google') && name(v).includes('español') && !name(v).includes('españa'),
      (v) => /female|femenin|mujer|woman/i.test(v.name || ''),
    ];
    for (const test of prefer) {
      const hit = es.find(test);
      if (hit) return hit;
    }
    // Evitar voces claramente masculinas
    const male = /pablo|jorge|raul|raúl|carlos|diego|juan|male|hombre/i;
    return es.find((v) => !male.test(v.name || '')) || es[0];
  }

  _speakBrowser(text, gen) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();

      const speakNow = () => {
        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        const esVoice = this._pickCuteEsVoice(voices);
        if (esVoice) {
          utter.voice = esVoice;
          utter.lang = esVoice.lang || 'es-MX';
        } else {
          utter.lang = 'es-MX';
        }
        // Un poco más "cute": rate suave + pitch alto (rango Web Speech: 0–2)
        utter.rate = 0.92;
        utter.pitch = 1.6;
        this.utterance = utter;

        console.info('[TTS] Voz del navegador:', esVoice?.name || '(default)', esVoice?.lang || '');

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
      };

      // Chrome a veces carga las voces async
      const voices = synth.getVoices();
      if (voices.length) {
        speakNow();
      } else {
        const onVoices = () => {
          synth.removeEventListener('voiceschanged', onVoices);
          speakNow();
        };
        synth.addEventListener('voiceschanged', onVoices);
        // fallback si el evento no llega
        setTimeout(() => {
          synth.removeEventListener('voiceschanged', onVoices);
          speakNow();
        }, 300);
      }
    });
  }
}

export const tts = new TTSService();
export const hasGoogleTTS = Boolean(API_KEY);
