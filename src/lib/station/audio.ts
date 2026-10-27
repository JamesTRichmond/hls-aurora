import { liveWatch, type Layer } from "@/lib/station/sim";
import type { RoomId } from "@/lib/station/world";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let oscA: OscillatorNode | null = null;
let oscB: OscillatorNode | null = null;
let filter: BiquadFilterNode | null = null;
let noise: AudioBufferSourceNode | null = null;
let noiseGain: GainNode | null = null;
let started = false;
let stepAcc = 0;
let lastRoom: string | null = null;
let lastPhase: string | null = null;
let lastSeam = false;

function ensure() {
  if (ctx || typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
}

function noiseBuffer(ac: AudioContext) {
  const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function unlockAmbience() {
  ensure();
  if (!ctx) return;
  void ctx.resume();
}

export function setAmbience(layer: Layer, room?: RoomId | null) {
  ensure();
  if (!ctx || !master) return;
  void ctx.resume();
  if (!started) {
    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.connect(master);

    oscA = ctx.createOscillator();
    oscB = ctx.createOscillator();
    const gA = ctx.createGain();
    const gB = ctx.createGain();
    oscA.type = "sine";
    oscB.type = "triangle";
    gA.gain.value = 0.55;
    gB.gain.value = 0.16;
    oscA.connect(gA).connect(filter);
    oscB.connect(gB).connect(filter);
    oscA.start();
    oscB.start();

    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = "bandpass";
    nFilter.frequency.value = 1800;
    nFilter.Q.value = 0.7;
    noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx);
    noise.loop = true;
    noise.connect(nFilter).connect(noiseGain).connect(master);
    noise.start();

    started = true;
  }
  const now = ctx.currentTime;
  const freq = layer === "crew" ? 55 : 46.5;
  oscA?.frequency.setTargetAtTime(freq, now, 0.18);
  oscB?.frequency.setTargetAtTime(freq * 2.02, now, 0.18);
  let cut = layer === "crew" ? 240 : 160;
  let hiss = layer === "crew" ? 0.004 : 0.006;
  let drone = layer === "crew" ? 0.026 : 0.018;
  if (room === "cryo") {
    cut = 140;
    hiss = 0.012;
    drone = 0.022;
  } else if (room === "gallery") {
    cut = 320;
    hiss = 0.003;
  } else if (room === "systems") {
    cut = 90;
    hiss = 0.008;
  } else if (room === "greenhouse") {
    cut = 280;
    hiss = 0.005;
  } else if (room === "command") {
    cut = 110;
    drone = 0.02;
  }
  const phase = liveWatch().phase.id;
  const open = liveWatch().seamOpen;
  const phaseCut = phase === "wake" ? 1.18 : phase === "quiet" ? 0.68 : phase === "midwatch" ? 0.88 : 1;
  const phaseDrone = phase === "quiet" ? 0.6 : phase === "wake" ? 1.12 : phase === "walkdown" ? 1 : 0.86;
  const seamCut = open ? 0.55 : 1;
  const seamDrone = open ? 0.7 : 1;
  filter?.frequency.setTargetAtTime(cut * phaseCut * seamCut, now, 0.2);
  noiseGain?.gain.setTargetAtTime(hiss, now, 0.35);
  master.gain.setTargetAtTime(drone * phaseDrone * seamDrone, now, 0.2);
  lastRoom = room ?? null;
  lastPhase = phase;
  lastSeam = open;
}

export function tickWorldAudio(layer: Layer, speed: number, dt: number, room?: RoomId | null) {
  const phase = liveWatch().phase.id;
  const open = liveWatch().seamOpen;
  if (room !== lastRoom || phase !== lastPhase || open !== lastSeam) setAmbience(layer, room);
  if (!ctx || !master || speed < 0.18) {
    stepAcc = 0;
    return;
  }
  stepAcc += dt * speed;
  if (stepAcc < 0.36) return;
  stepAcc = 0;
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const f = ctx.createBiquadFilter();
  o.type = "sine";
  o.frequency.value = layer === "crew" ? 92 + Math.random() * 18 : 70 + Math.random() * 12;
  f.type = "lowpass";
  f.frequency.value = 420;
  g.gain.value = 0.03;
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  o.connect(f).connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.1);
}

export function playInteract() {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = 520;
  o.frequency.exponentialRampToValueAtTime(180, now + 0.08);
  g.gain.value = 0.04;
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  o.connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.12);
}

export function playCurtain() {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const f = ctx.createBiquadFilter();
  o.type = "sawtooth";
  o.frequency.value = 90;
  o.frequency.linearRampToValueAtTime(40, now + 0.55);
  f.type = "lowpass";
  f.frequency.value = 300;
  g.gain.value = 0.035;
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  o.connect(f).connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.62);
}
