import { Injectable, signal } from '@angular/core';

const FEMALE_VOICE_HINTS = [
  'female', 'samantha', 'victoria', 'zira', 'susan', 'karen', 'moira', 'tessa',
  'fiona', 'kate', 'serena', 'allison', 'ava', 'salli', 'joanna', 'kendra',
  'kimberly', 'amy', 'emma', 'libby', 'olivia', 'aria', 'jenny', 'google us english'
];

@Injectable({ providedIn: 'root' })
export class TextToSpeechService {
  private synth: SpeechSynthesis | null =
    (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private pendingChunks = 0;
  private onEndCallback: (() => void) | null = null;

  isSpeaking = signal(false);
  isPaused = signal(false);
  isSupported = !!this.synth;

  constructor() {
    if (!this.synth) return;
    this.loadVoices();
    this.synth.onvoiceschanged = () => this.loadVoices();
  }

  private loadVoices(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices.length) return;

    const matchesHint = (v: SpeechSynthesisVoice) =>
      FEMALE_VOICE_HINTS.some(hint => v.name.toLowerCase().includes(hint));

    this.femaleVoice =
      voices.find(v => matchesHint(v) && v.lang.toLowerCase().startsWith('en')) ||
      voices.find(matchesHint) ||
      voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
      voices[0];
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.synth) return;
    this.stop();

    const clean = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return;

    const chunks = this.chunkText(clean, 220);
    this.pendingChunks = chunks.length;
    this.onEndCallback = onEnd ?? null;

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      if (this.femaleVoice) utterance.voice = this.femaleVoice;
      utterance.rate = 1;
      utterance.pitch = 1.05;

      if (i === 0) {
        utterance.onstart = () => {
          this.isSpeaking.set(true);
          this.isPaused.set(false);
        };
      }
      utterance.onend = () => {
        this.pendingChunks--;
        if (this.pendingChunks <= 0) {
          this.isSpeaking.set(false);
          this.isPaused.set(false);
          this.onEndCallback?.();
          this.onEndCallback = null;
        }
      };
      this.synth!.speak(utterance);
    });
  }

  pause(): void {
    if (this.synth?.speaking) {
      this.synth.pause();
      this.isPaused.set(true);
    }
  }

  resume(): void {
    if (this.synth?.paused) {
      this.synth.resume();
      this.isPaused.set(false);
    }
  }

  stop(): void {
    this.onEndCallback = null;
    this.pendingChunks = 0;
    this.synth?.cancel();
    this.isSpeaking.set(false);
    this.isPaused.set(false);
  }

  private chunkText(text: string, maxLen: number): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let current = '';
    for (const sentence of sentences) {
      if (current && (current + ' ' + sentence).length > maxLen) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current = current ? current + ' ' + sentence : sentence;
      }
    }
    if (current) chunks.push(current.trim());
    return chunks.length ? chunks : [text];
  }
}
