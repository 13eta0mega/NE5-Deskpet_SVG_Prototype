import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { COLORS, EMOTIONS, PART_IDS, STATES, numberCount } from "./v5-model.js";
import "./v5.css";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const parseNumbers = value => (String(value).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);

function interpolateString(a, b, t) {
  if (numberCount(a) !== numberCount(b)) return t < 1 ? a : b;
  const from = parseNumbers(a), to = parseNumbers(b);
  let i = 0;
  return String(b).replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, () => String(lerp(from[i], to[i++], t).toFixed(3)));
}

const hex = value => /^#[0-9a-f]{6}$/i.test(String(value || ""));
function mixHex(a, b, t) {
  if (!hex(a) || !hex(b)) return t < 1 ? (a ?? b) : b;
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(lerp(v, pb[i], t)).toString(16).padStart(2, "0")).join("")}`;
}

const numericAttrs = tag => tag === "rect" ? ["x", "y", "width", "height", "rx"] : tag === "circle" ? ["cx", "cy", "r"] : tag === "ellipse" ? ["cx", "cy", "rx", "ry"] : [];

function snapshot(el, def) {
  const snap = { tag: def.tag, fill: el.getAttribute("fill") ?? def.fill };
  if (def.tag === "path") snap.d = el.getAttribute("d") || def.d;
  for (const key of numericAttrs(def.tag)) snap[key] = Number(el.getAttribute(key));
  return snap;
}

function partElement(id, def, ref) {
  const { tag, ...props } = def;
  return React.createElement(tag, { ...props, key: id, ref });
}

function StaticCritter({ state, className = "mori-svg" }) {
  return <svg className={className} viewBox="0 0 200 200" role="img" aria-label={`${state} expression`}>
    <g className="mori-rig static-rig">{PART_IDS.map(id => partElement(id, STATES[state][id], null))}</g>
  </svg>;
}

function liveBlink(sec) {
  const period = 4.35;
  const phase = sec % period;
  if (phase < period - .18) return 1;
  const p = (phase - (period - .18)) / .18;
  return .14 + .86 * Math.abs(2 * p - 1);
}

function Critter({ state, mode }) {
  const refs = useRef({});
  const root = useRef(null);
  const currentState = useRef(state);
  const transition = useRef(null);
  const idleAmp = useRef(1);
  const modeRef = useRef(mode);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    if (state === currentState.current && !transition.current) return;
    const from = {};
    for (const id of PART_IDS) {
      const el = refs.current[id];
      if (el) from[id] = snapshot(el, STATES[currentState.current][id]);
    }
    transition.current = { from, to: STATES[state], start: performance.now(), duration: 760 };
    currentState.current = state;
  }, [state]);

  useEffect(() => {
    let raf = 0;
    const tick = now => {
      const tr = transition.current;
      let morphing = false;
      if (tr) {
        const raw = clamp((now - tr.start) / tr.duration, 0, 1);
        const t = ease(raw);
        morphing = raw < 1;
        for (const id of PART_IDS) {
          const el = refs.current[id], a = tr.from[id], b = tr.to[id];
          if (!el || !a || !b) continue;
          if (b.tag === "path") el.setAttribute("d", interpolateString(a.d, b.d, t));
          for (const key of numericAttrs(b.tag)) el.setAttribute(key, String(lerp(Number(a[key]), Number(b[key]), t)));
          if (b.fill != null) el.setAttribute("fill", mixHex(a.fill, b.fill, t));
        }
        idleAmp.current = lerp(idleAmp.current, morphing ? .1 : 1, .08);
        if (!morphing) transition.current = null;
      } else {
        idleAmp.current = lerp(idleAmp.current, 1, .045);
      }

      const sec = now / 1000;
      const amp = idleAmp.current;
      const listening = modeRef.current === "listening";
      const talking = modeRef.current === "talking";
      const breathe = .0065 * (1 + Math.sin(sec * Math.PI)) * amp;
      const sway = (listening ? 1.35 * Math.sin(sec * 2.8) : .42 * Math.sin(sec * 1.85)) * amp;
      const bob = talking ? .55 * Math.sin(sec * 7.5) * amp : 0;
      if (root.current) {
        root.current.style.transformOrigin = "100px 194px";
        root.current.style.transform = `translateY(${bob}px) rotate(${sway}deg) scale(${1 + breathe})`;
      }

      const blink = liveBlink(sec);
      for (const [id, origin] of [["eyeL", "69px 108px"], ["eyeR", "131px 108px"]]) {
        const eye = refs.current[id];
        if (eye) {
          eye.style.transformOrigin = origin;
          eye.style.transform = `scaleY(${blink})`;
        }
      }

      const earPulse = listening ? Math.sin(sec * 5.8) : 0;
      const earL = refs.current.earL, earR = refs.current.earR;
      if (earL && earR) {
        earL.style.transformOrigin = "69px 74px";
        earR.style.transformOrigin = "131px 74px";
        earL.style.transform = `rotate(${(-3.2 * earPulse - .7 * Math.sin(sec * 2.8)) * amp}deg)`;
        earR.style.transform = `rotate(${(4.1 * earPulse + .55 * Math.sin(sec * 2.8)) * amp}deg)`;
      }

      const mouth = refs.current.mouth;
      if (mouth && !transition.current) {
        const stable = STATES[currentState.current].mouth.d;
        if (talking) {
          const speech = clamp(.52 + .3 * Math.sin(sec * 16.5) + .18 * Math.sin(sec * 27.5), 0, 1);
          const talk = `M95.5 118.5C96.8 ${121 + speech * 5.5} 98.4 ${122 + speech * 7} 100 ${122 + speech * 7}C101.6 ${122 + speech * 7} 103.2 ${121 + speech * 5.5} 104.5 118.5`;
          mouth.setAttribute("d", interpolateString(stable, talk, .28 + speech * .58));
        } else {
          mouth.setAttribute("d", stable);
        }
        mouth.setAttribute("fill", "none");
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const refFor = id => el => { refs.current[id] = el; };
  return <svg className="mori-svg" viewBox="0 0 200 200" role="img" aria-label="Mori animated critter">
    <g ref={root} className="mori-rig">{PART_IDS.map(id => partElement(id, STATES.neutral[id], refFor(id)))}</g>
  </svg>;
}

const MODES = [["idle", "평상시"], ["listening", "듣기"], ["talking", "말하기"]];

function QAView() {
  return <main className="qa-page">
    <header className="qa-header">
      <div><span className="eyebrow">V5 / VISUAL QA</span><h1>16-expression contact sheet</h1><p>실제 런타임과 동일한 SVG 상태 데이터를 한 화면에서 비교합니다.</p></div>
      <a href="?" className="qa-link">interactive preview</a>
    </header>
    <section className="qa-grid">{EMOTIONS.map(e => <article className="qa-card" key={e.key}>
      <StaticCritter state={e.key} className="qa-svg" />
      <div><strong>{e.name}</strong><span>{e.english}</span></div>
    </article>)}</section>
  </main>;
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("emotion");
  const initial = requested && STATES[requested] ? requested : "neutral";
  const [emotion, setEmotion] = useState(initial);
  const [mode, setMode] = useState("idle");
  const meta = useMemo(() => EMOTIONS.find(e => e.key === emotion), [emotion]);

  if (params.get("qa") === "1") return <QAView />;

  return <main className="v5-page">
    <header className="v5-header">
      <div><span className="eyebrow">MOOD CRITTERS / V5.1</span><h1>Mori</h1><p>작은 눈, 단선 입, 둥근 실루엣으로 다시 그린 14-part SVG critter</p></div>
      <a className="qa-link" href="?qa=1">16-state QA</a>
    </header>
    <section className="v5-layout">
      <div className="preview-card">
        <div className="preview-top">
          <div><small>current emotion</small><strong>{meta.name}</strong><span>{meta.english}</span></div>
          <div className="mode-row">{MODES.map(([key, label]) => <button key={key} aria-pressed={mode === key} onClick={() => setMode(key)}>{label}</button>)}</div>
        </div>
        <div className="stage"><Critter state={emotion} mode={mode} /></div>
        <div className="design-note">flat fill · bare-stroke mouth · shared topology · visual QA contact sheet · no expression crossfade</div>
      </div>
      <aside className="emotion-panel">
        <div><h2>16 Expressions</h2><p>표정 이름이 없어도 눈·입·귀·손·몸 자세로 감정이 읽히도록 다시 분리했습니다.</p></div>
        <div className="emotion-grid">{EMOTIONS.map(e => <button key={e.key} aria-pressed={emotion === e.key} onClick={() => setEmotion(e.key)}>
          <StaticCritter state={e.key} className="mini-critter" />
          <span><strong>{e.name}</strong><small>{e.english}</small></span>
        </button>)}</div>
      </aside>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
