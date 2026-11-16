/**
 * STUDYPET — Advanced Procedural Audio Engine
 * Dual-Layer Sound Mixing:
 * - Weather Layer: Ambient Rain, Campfire, or Silence
 * - Music/Noise Layer: Lo-Fi Chill Beats, Contemporary Piano, Brown Noise, Pink Noise, Video Game OST, Mute
 * - Mechanical Keyboard Click Synthesis
 * - Audio Visualizer / Spectrum Analyzer
 * - Auto-sync with Focus Timer
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.ambientGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Dual-Layer State
    this.weatherLayer = 'rain'; // 'rain', 'fire', 'none'
    this.musicLayer = 'lofi';   // 'lofi', 'piano', 'brown', 'pink', 'videogame', 'none'
    this.autoSyncTimer = true;  // Auto-play when timer starts

    this.weatherNodes = [];
    this.musicNodes = [];
    this.musicInterval = null;

    this.volume = 0.5;
    this.weatherVolume = 0.45;
    this.musicVolume = 0.55;

    // Analyser node for Visual Spectrum
    this.analyser = null;
    this.dataArray = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume;

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.value = this.weatherVolume;

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.35;

        // Route: layers -> analyser -> masterGain -> destination
        this.ambientGain.connect(this.analyser);
        this.musicGain.connect(this.analyser);
        this.sfxGain.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    if (this.masterGain && !this.isMuted && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  // Dual Layer Control
  setWeatherLayer(type) {
    this.init();
    this.stopWeatherNodes();
    this.weatherLayer = type;

    if (!this.ctx || type === 'none' || this.isMuted) return;

    if (type === 'rain') {
      this.startRainSound();
    } else if (type === 'fire') {
      this.startCampfireSound();
    }
  }

  setMusicLayer(track) {
    this.init();
    this.stopMusicNodes();
    this.musicLayer = track;

    if (!this.ctx || track === 'none' || this.isMuted) return;

    switch (track) {
      case 'lofi':
        this.startLofiBeats();
        break;
      case 'piano':
        this.startContemporaryPiano();
        break;
      case 'brown':
        this.startBrownNoise();
        break;
      case 'pink':
        this.startPinkNoise();
        break;
      case 'videogame':
        this.startVideoGameSoundtrack();
        break;
    }
  }

  stopWeatherNodes() {
    this.weatherNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.weatherNodes = [];
  }

  stopMusicNodes() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.musicNodes = [];
  }

  stopAll() {
    this.stopWeatherNodes();
    this.stopMusicNodes();
  }

  // Get current spectrum frequency data for visualizer
  getSpectrumData() {
    if (!this.analyser || !this.dataArray) {
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    const bands = [];
    const step = Math.floor(this.dataArray.length / 8);
    for (let i = 0; i < 8; i++) {
      bands.push(this.dataArray[i * step] / 255);
    }
    return bands;
  }

  // --------------------------------------------------------------------------
  // 1. WEATHER: RAIN ON WINDOW
  // --------------------------------------------------------------------------
  startRainSound() {
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const droplet = Math.random() > 0.994 ? (Math.random() * 2 - 1) * 0.45 : 0;
      output[i] = ((Math.random() * 2 - 1) * 0.16) + droplet;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1100;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 180;

    whiteNoise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(this.ambientGain);

    whiteNoise.start();
    this.weatherNodes.push(whiteNoise, lowpass, highpass);
  }

  // --------------------------------------------------------------------------
  // 2. WEATHER: COZY CAMPFIRE / HEARTH
  // --------------------------------------------------------------------------
  startCampfireSound() {
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const pop = Math.random() > 0.996 ? (Math.random() * 2 - 1) * 0.5 : 0;
      output[i] = ((Math.random() * 2 - 1) * 0.08) + pop;
    }

    const fireSource = this.ctx.createBufferSource();
    fireSource.buffer = noiseBuffer;
    fireSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 650;

    fireSource.connect(filter);
    filter.connect(this.ambientGain);

    fireSource.start();
    this.weatherNodes.push(fireSource, filter);
  }

  // --------------------------------------------------------------------------
  // 3. MUSIC: LO-FI CHILL BEATS (Vinyl + Rhodes Chords + Sub-Bass)
  // --------------------------------------------------------------------------
  startLofiBeats() {
    // 1. Subtle Vinyl Crackle loop
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const pop = Math.random() > 0.998 ? (Math.random() * 2 - 1) * 0.35 : 0;
      output[i] = ((Math.random() * 2 - 1) * 0.02) + pop;
    }
    const vinyl = this.ctx.createBufferSource();
    vinyl.buffer = noiseBuffer;
    vinyl.loop = true;
    vinyl.connect(this.musicGain);
    vinyl.start();
    this.musicNodes.push(vinyl);

    // 2. Chill Lo-fi Chord Progressions
    const chordProgression = [
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
      [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
      [196.00, 246.94, 293.66, 349.23, 440.00]  // G13
    ];

    let chordIndex = 0;
    const playChordStep = () => {
      if (this.musicLayer !== 'lofi' || this.isMuted) return;

      const chord = chordProgression[chordIndex];
      chordIndex = (chordIndex + 1) % chordProgression.length;

      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 3.3);
      });

      // Warm Lo-Fi Sub-Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
      bassGain.gain.setValueAtTime(0.09, now);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + 3.0);
    };

    playChordStep();
    this.musicInterval = setInterval(playChordStep, 3400);
  }

  // --------------------------------------------------------------------------
  // 4. MUSIC: CONTEMPORARY PIANO ARPEGGIOS
  // --------------------------------------------------------------------------
  startContemporaryPiano() {
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const patterns = [[0, 2, 4, 7, 4, 2], [1, 3, 5, 8, 5, 3], [0, 4, 7, 9, 7, 4]];

    let patternIdx = 0;
    let stepIdx = 0;

    const playPianoNote = () => {
      if (this.musicLayer !== 'piano' || this.isMuted) return;

      const pattern = patterns[patternIdx];
      const noteIdx = pattern[stepIdx];
      const freq = scale[noteIdx % scale.length];

      stepIdx++;
      if (stepIdx >= pattern.length) {
        stepIdx = 0;
        patternIdx = (patternIdx + 1) % patterns.length;
      }

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.musicGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.3);
      osc2.stop(now + 2.3);
    };

    playPianoNote();
    this.musicInterval = setInterval(playPianoNote, 620);
  }

  // --------------------------------------------------------------------------
  // 5. NOISE: BROWN NOISE
  // --------------------------------------------------------------------------
  startBrownNoise() {
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownSource = this.ctx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 420;

    brownSource.connect(lowpass);
    lowpass.connect(this.musicGain);

    brownSource.start();
    this.musicNodes.push(brownSource, lowpass);
  }

  // --------------------------------------------------------------------------
  // 6. NOISE: PINK NOISE
  // --------------------------------------------------------------------------
  startPinkNoise() {
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const pinkSource = this.ctx.createBufferSource();
    pinkSource.buffer = noiseBuffer;
    pinkSource.loop = true;
    pinkSource.connect(this.musicGain);
    pinkSource.start();
    this.musicNodes.push(pinkSource);
  }

  // --------------------------------------------------------------------------
  // 7. MUSIC: RETRO VIDEO GAMES CHIPTUNE SOUNDTRACK
  // --------------------------------------------------------------------------
  startVideoGameSoundtrack() {
    const melody = [
      { f: 523.25, d: 0.25 }, { f: 587.33, d: 0.25 }, { f: 659.25, d: 0.35 },
      { f: 783.99, d: 0.25 }, { f: 659.25, d: 0.35 }, { f: 523.25, d: 0.50 },
      { f: 440.00, d: 0.25 }, { f: 523.25, d: 0.45 }, { f: 392.00, d: 0.60 }
    ];

    let noteIdx = 0;
    const playChiptune = () => {
      if (this.musicLayer !== 'videogame' || this.isMuted) return;

      const note = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;

      const now = this.ctx.currentTime;
      const lead = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      lead.type = 'square';
      lead.frequency.setValueAtTime(note.f, now);

      leadGain.gain.setValueAtTime(0.035, now);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, now + note.d);

      lead.connect(leadGain);
      leadGain.connect(this.musicGain);
      lead.start(now);
      lead.stop(now + note.d);

      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'triangle';
      bass.frequency.setValueAtTime(note.f / 4, now);
      bassGain.gain.setValueAtTime(0.05, now);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + note.d * 1.2);
      bass.connect(bassGain);
      bassGain.connect(this.musicGain);
      bass.start(now);
      bass.stop(now + note.d * 1.2);
    };

    playChiptune();
    this.musicInterval = setInterval(playChiptune, 450);
  }

  // --------------------------------------------------------------------------
  // MECHANICAL KEYBOARD CLICK (Tactile Switches clack)
  // --------------------------------------------------------------------------
  playMechanicalKey() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.035);

    const thock = this.ctx.createOscillator();
    const thockGain = this.ctx.createGain();
    thock.type = 'sine';
    thock.frequency.setValueAtTime(180 + Math.random() * 60, now);
    thockGain.gain.setValueAtTime(0.15, now);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    thock.connect(thockGain);
    thockGain.connect(this.sfxGain);
    thock.start(now);
    thock.stop(now + 0.05);
  }

  playCoffeePour() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playSparkle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.05);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  playPetChirp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playLevelUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.50];
    let t = this.ctx.currentTime;
    melody.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.15);
      t += 0.12;
    });
  }

  playGong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [220, 440, 660].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  }
}

// Global Sound Instance
const soundEngine = new SoundEngine();
window.soundEngine = soundEngine;
