import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const SPECIES = [
  {
    key: "dog", name: "강아지", english: "dog", color: "#D89B55", limb: "#F1BC78", foot: "#B7763D",
    body: "M166 124C166 145 158 159 145 169C132 179 119 181 99 181C80 181 65 178 52 168C39 158 32 143 34 122C35 101 43 83 58 72C73 61 85 57 103 58C124 59 140 66 152 79C163 91 166 105 166 124Z",
    earL: "M53 82C35 68 18 78 21 100C24 123 38 136 50 126C63 116 68 91 63 83C61 80 57 80 53 82Z",
    earR: "M150 82C168 68 185 79 182 101C179 124 165 136 153 126C140 116 134 91 139 83C142 80 146 80 150 82Z",
    base: { eyeLX: 70, eyeRX: 127, eyeY: 112, mouthX: 98, mouthY: 119, handLX: 38, handLY: 142, handRX: 164, handRY: 146, legLX: 78, legRX: 107, legY: 168 },
  },
  {
    key: "fox", name: "여우", english: "fox", color: "#E96F3D", limb: "#FF9B65", foot: "#BB482C",
    body: "M165 126C159 146 151 160 138 169C125 178 114 181 98 181C80 181 67 177 56 168C44 158 37 144 34 126C31 105 38 86 51 73C64 60 80 56 101 57C123 58 141 67 153 82C164 96 170 109 165 126Z",
    earL: "M50 66C47 48 52 30 61 25C71 28 83 50 86 70C81 82 61 84 50 66Z",
    earR: "M143 76C147 51 160 28 171 26C180 34 181 54 174 73C165 87 151 86 143 76Z",
    base: { eyeLX: 68, eyeRX: 126, eyeY: 109, mouthX: 97, mouthY: 116, handLX: 38, handLY: 143, handRX: 161, handRY: 145, legLX: 77, legRX: 106, legY: 168 },
  },
  {
    key: "bear", name: "곰", english: "bear", color: "#A77B60", limb: "#C79B7B", foot: "#785441",
    body: "M166 126C166 145 158 160 145 170C132 179 117 181 99 181C80 181 66 178 53 168C40 158 34 143 35 122C36 102 44 84 58 73C72 61 87 57 103 58C124 58 141 66 153 79C164 92 167 108 166 126Z",
    earL: "M55 65C40 58 41 35 58 29C76 23 91 42 85 59C81 72 68 72 55 65Z",
    earR: "M145 64C133 52 143 32 159 29C177 27 187 47 176 61C166 74 154 74 145 64Z",
    base: { eyeLX: 70, eyeRX: 127, eyeY: 112, mouthX: 99, mouthY: 120, handLX: 39, handLY: 144, handRX: 162, handRY: 145, legLX: 78, legRX: 107, legY: 168 },
  },
  {
    key: "rabbit", name: "토끼", english: "rabbit", color: "#F4A7D0", limb: "#FFC7E5", foot: "#D982B1",
    body: "M163 126C157 145 134 147 131 157C129 167 129 180 101 180C73 180 74 164 70 157C66 149 46 152 38 126C29 100 36 83 49 69C63 56 77 50 101 50C124 50 142 60 155 75C168 89 169 107 163 126Z",
    earL: "M94 13C122 14 109 60 106 68C103 76 86 75 81 70C76 64 66 13 94 13Z",
    earR: "M142 21C168 31 139 71 133 75C126 80 109 70 109 64C109 57 116 10 142 21Z",
    base: { eyeLX: 70, eyeRX: 125, eyeY: 106, mouthX: 97, mouthY: 106, handLX: 86, handLY: 147, handRX: 110, handRY: 147, legLX: 81, legRX: 103, legY: 170 },
  },
  {
    key: "cat", name: "고양이", english: "cat", color: "#F1CA44", limb: "#FFD853", foot: "#D5B33F",
    body: "M173 123C173 142 166 156 153 167C140 177 124 180 105 180C88 180 75 176 61 167C47 157 37 144 37 123C37 102 43 88 56 78C69 67 82 60 105 60C129 60 144 69 156 81C168 92 173 104 173 123Z",
    earL: "M58 48C68 46 90 64 89 72C88 80 59 91 52 87C46 84 49 51 58 48Z",
    earR: "M158 52C166 55 167 86 161 91C155 95 128 80 128 73C128 67 150 49 158 52Z",
    base: { eyeLX: 65, eyeRX: 123, eyeY: 115, mouthX: 95, mouthY: 117, handLX: 38, handLY: 141, handRX: 163, handRY: 150, legLX: 80, legRX: 108, legY: 165 },
  },
];

const P = {
  rigX: 0, rigY: 0, rigRot: 0, rigSX: 1, rigSY: 1,
  earLRot: 0, earRRot: 0, earLY: 0, earRY: 0,
  eyeLDX: 0, eyeLDY: 0, eyeLRX: 3, eyeLRY: 3, eyeLRot: 0,
  eyeRDX: 0, eyeRDY: 0, eyeRRX: 3, eyeRRY: 3, eyeRRot: 0,
  mouthDX: 0, mouthY: 0, mouthW: 9, mouthCurve: 1, mouthTilt: 0,
  handLDX: 0, handLDY: 0, handLRot: 0, handLS: 1,
  handRDX: 0, handRDY: 0, handRRot: 0, handRS: 1,
  legLDX: 0, legLDY: 0, legLRot: 0, legRDX: 0, legRDY: 0, legRRot: 0,
};

const state = (key, name, english, description, energy, values) => ({ key, name, english, description, energy, pose: { ...P, ...values } });
const EMOTIONS = [
  state("neutral", "편안", "neutral", "느슨한 눈과 작은 미소", "calm", {}),
  state("happy", "기쁨", "happy", "눈과 입이 함께 웃어요", "calm", { rigY: -1, eyeLRY: 1.8, eyeRRY: 1.8, mouthW: 12.5, mouthCurve: 5.5, handLDY: -3, handRDY: -3 }),
  state("excited", "신남", "excited", "몸 전체가 가볍게 튀어 올라요", "bright", { rigY: -6, rigSX: 1.04, rigSY: .95, earLRot: -10, earRRot: 10, eyeLRX: 3.8, eyeLRY: 4.2, eyeRRX: 3.8, eyeRRY: 4.2, mouthW: 12, mouthCurve: 8.5, handLDX: -7, handLDY: -15, handLRot: -24, handRDX: 7, handRDY: -15, handRRot: 24 }),
  state("love", "사랑", "love", "눈을 포근히 감고 손을 모아요", "calm", { rigRot: -2.5, rigY: 1, eyeLRX: 4.8, eyeLRY: .62, eyeRRX: 4.8, eyeRRY: .62, mouthW: 10, mouthCurve: 5.5, handLDX: 32, handLDY: -9, handLRot: -10, handRDX: -32, handRDY: -9, handRRot: 10 }),
  state("amused", "웃음", "amused", "눈이 접히고 입이 크게 웃어요", "bright", { rigRot: 2, rigY: -2, eyeLRX: 4.4, eyeLRY: .58, eyeRRX: 4.4, eyeRRY: .58, mouthW: 15.5, mouthCurve: 9, handLDY: -6, handRDY: -8 }),
  state("proud", "뿌듯", "proud", "몸을 세우고 여유롭게 바라봐요", "calm", { rigY: -3, rigRot: -1.5, rigSX: 1.02, rigSY: .99, eyeLDY: -2, eyeRDY: -2, eyeLRY: 1.7, eyeRRY: 1.7, mouthDX: 2, mouthW: 8.5, mouthCurve: 3.5, mouthTilt: -5, handLDX: -3, handRDX: 3 }),
  state("curious", "궁금", "curious", "고개와 시선이 같은 방향을 따라가요", "calm", { rigRot: 7, rigX: 3, earLRot: 10, earRRot: -15, eyeLDX: 3.5, eyeRDX: 3.5, eyeLDY: -1, eyeRDY: -1, mouthDX: 2, mouthW: 6, mouthCurve: 1, mouthTilt: 3, handLDY: -2 }),
  state("surprised", "놀람", "surprised", "몸이 늘어나며 눈과 입이 동시에 커져요", "bright", { rigY: -5, rigSX: .96, rigSY: 1.055, earLRot: -12, earRRot: 12, eyeLRX: 4.3, eyeLRY: 4.7, eyeRRX: 4.3, eyeRRY: 4.7, mouthW: 5.3, mouthCurve: 11, handLDX: -6, handLDY: -8, handRDX: 6, handRDY: -8 }),
  state("confused", "혼란", "confused", "비대칭 눈과 입으로 망설이는 표정", "calm", { rigRot: -5, rigX: -1, earLRot: 12, earRRot: -5, eyeLRY: 1.45, eyeRRY: 3.25, eyeLDY: 1, eyeRDY: -1, eyeLRot: 8, eyeRRot: -4, mouthW: 9.5, mouthCurve: -1.5, mouthTilt: 9 }),
  state("shy", "수줍", "shy", "시선을 피하며 두 손을 가까이 모아요", "low", { rigRot: 3, rigY: 3, eyeLDX: -3.5, eyeRDX: -3.5, eyeLDY: 2, eyeRDY: 2, eyeLRY: 1.55, eyeRRY: 1.55, mouthDX: -2, mouthW: 5.5, mouthCurve: 3, handLDX: 30, handLDY: -6, handRDX: -30, handRDY: -6 }),
  state("sad", "슬픔", "sad", "몸과 귀가 내려앉고 시선이 처져요", "low", { rigY: 5, rigSY: .965, earLRot: 14, earRRot: -14, earLY: 4, earRY: 4, eyeLDY: 2.5, eyeRDY: 2.5, eyeLRY: 1.9, eyeRRY: 1.9, mouthW: 12, mouthCurve: -5.5, handLDY: 3, handRDY: 3 }),
  state("worried", "걱정", "worried", "몸이 살짝 움츠러들고 입이 불안하게 기울어요", "low", { rigY: 2, rigSX: .985, rigSY: 1.01, rigRot: -2.5, earLRot: 9, earRRot: -9, eyeLDY: 1, eyeRDY: 1, eyeLRX: 3.25, eyeRRX: 3.25, eyeLRY: 3.5, eyeRRY: 3.5, mouthW: 7.5, mouthCurve: -3.3, mouthTilt: -5, handLDY: -2, handRDY: -2 }),
  state("angry", "화남", "angry", "몸을 낮추고 눈을 날카롭게 좁혀요", "tense", { rigY: 4, rigSX: 1.045, rigSY: .95, earLRot: 15, earRRot: -15, eyeLDY: 1.5, eyeRDY: 1.5, eyeLRX: 4.2, eyeLRY: 1.0, eyeRRX: 4.2, eyeRRY: 1.0, eyeLRot: 20, eyeRRot: -20, mouthW: 12, mouthCurve: -4.5, handLDX: -5, handRDX: 5, handLDY: 1, handRDY: 1 }),
  state("annoyed", "시큰둥", "annoyed", "시선을 옆으로 흘기며 입을 비틀어요", "calm", { rigRot: 2, eyeLDX: 3.5, eyeRDX: 3.5, eyeLRY: .9, eyeRRY: 1.3, eyeLDY: 1, eyeRDY: 2, eyeLRot: 4, mouthDX: 3, mouthW: 9, mouthCurve: -1.5, mouthTilt: 6 }),
  state("sleepy", "졸림", "sleepy", "몸이 가라앉고 눈이 천천히 감겨요", "low", { rigY: 5, rigRot: -4.5, rigSY: .975, earLRot: 8, earRRot: -6, eyeLRX: 4.5, eyeLRY: .48, eyeRRX: 4.5, eyeRRY: .48, eyeLDY: 3.5, eyeRDY: 3.5, mouthW: 7, mouthCurve: .8 }),
  state("crying", "울음", "crying", "두 손을 얼굴 가까이 올리고 몸을 웅크려요", "low", { rigY: 4, rigSX: .985, rigSY: .98, earLRot: 15, earRRot: -15, eyeLRX: 3.9, eyeLRY: 1.2, eyeRRX: 3.9, eyeRRY: 1.2, eyeLDY: 2.5, eyeRDY: 2.5, mouthW: 13, mouthCurve: -7.5, handLDX: 17, handLDY: -24, handLRot: -14, handRDX: -17, handRDY: -24, handRRot: 14 }),
];

const MODES = [
  { key: "idle", name: "평상시", english: "breathe" },
  { key: "listening", name: "듣기", english: "listen" },
  { key: "talking", name: "립싱크", english: "lip sync" },
];

const copyPose = (pose) => Object.fromEntries(Object.entries(pose).map(([key, value]) => [key, value]));
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const smooth = (t) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const easeInOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuint = (t) => 1 - Math.pow(1 - clamp01(t), 5);
const easeOutBack = (t) => {
  const x = clamp01(t);
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easingFor = (key, raw) => {
  if (key.startsWith("eye") || key.startsWith("mouth")) return smooth(raw);
  if (key.startsWith("ear") || key.startsWith("hand")) return easeOutBack(raw);
  if (key.startsWith("leg")) return easeOutQuint(raw);
  return easeInOut(raw);
};

function setAround(el, pivotX, pivotY, dx, dy, rotation, sx = 1, sy = 1) {
  if (!el) return;
  el.setAttribute("transform", `translate(${dx} ${dy}) translate(${pivotX} ${pivotY}) rotate(${rotation}) scale(${sx} ${sy}) translate(${-pivotX} ${-pivotY})`);
}

function applyPose(refs, animal, pose) {
  const b = animal.base;
  setAround(refs.rig, 100, 195, pose.rigX, pose.rigY, pose.rigRot, pose.rigSX, pose.rigSY);
  setAround(refs.earL, 76, 72, 0, pose.earLY, pose.earLRot);
  setAround(refs.earR, 136, 72, 0, pose.earRY, pose.earRRot);
  const setEye = (el, x, y, rx, ry, rotation) => {
    if (!el) return;
    el.setAttribute("cx", x); el.setAttribute("cy", y); el.setAttribute("rx", rx); el.setAttribute("ry", Math.max(.35, ry));
    setAround(el, x, y, 0, 0, rotation);
  };
  setEye(refs.eyeL, b.eyeLX + pose.eyeLDX, b.eyeY + pose.eyeLDY, pose.eyeLRX, pose.eyeLRY, pose.eyeLRot);
  setEye(refs.eyeR, b.eyeRX + pose.eyeRDX, b.eyeY + pose.eyeRDY, pose.eyeRRX, pose.eyeRRY, pose.eyeRRot);
  const mx = b.mouthX + pose.mouthDX;
  const my = b.mouthY + pose.mouthY;
  const mw = pose.mouthW;
  refs.mouth?.setAttribute("d", `M${mx - mw} ${my}C${mx - mw * .45} ${my + pose.mouthCurve} ${mx + mw * .45} ${my + pose.mouthCurve} ${mx + mw} ${my}`);
  setAround(refs.mouth, mx, my, 0, 0, pose.mouthTilt);
  setAround(refs.handL, b.handLX, b.handLY, pose.handLDX, pose.handLDY, pose.handLRot, pose.handLS, pose.handLS);
  setAround(refs.handR, b.handRX, b.handRY, pose.handRDX, pose.handRDY, pose.handRRot, pose.handRS, pose.handRS);
  setAround(refs.legL, b.legLX + 10, b.legY + 13, pose.legLDX, pose.legLDY, pose.legLRot);
  setAround(refs.legR, b.legRX + 10, b.legY + 13, pose.legRDX, pose.legRDY, pose.legRRot);
}

function MorphCritter({ animal, emotion, mode }) {
  const nodes = useRef({});
  const frame = useRef(0);
  const current = useRef(copyPose(emotion.pose));
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      current.current = copyPose(emotion.pose);
      applyPose(nodes.current, animal, current.current);
      first.current = false;
      return undefined;
    }

    cancelAnimationFrame(frame.current);
    const from = copyPose(current.current);
    const to = emotion.pose;
    const start = performance.now();
    const duration = emotion.energy === "bright" ? 600 : emotion.energy === "low" ? 650 : emotion.energy === "tense" ? 540 : 560;
    nodes.current.svg?.classList.add("is-transitioning");

    const tick = (now) => {
      const raw = clamp01((now - start) / duration);
      const next = {};
      for (const key of Object.keys(to)) {
        const t = easingFor(key, raw);
        next[key] = from[key] + (to[key] - from[key]) * t;
      }
      current.current = next;
      applyPose(nodes.current, animal, next);
      if (raw < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        current.current = copyPose(to);
        nodes.current.svg?.classList.remove("is-transitioning");
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      nodes.current.svg?.classList.remove("is-transitioning");
    };
  }, [animal, emotion]);

  const ref = (name) => (node) => { nodes.current[name] = node; };
  const b = animal.base;
  return (
    <svg ref={ref("svg")} className={`critter-svg mode-${mode} energy-${emotion.energy}`} viewBox="0 0 200 200" role="img" aria-label={`${animal.name}의 ${emotion.name} 표정`}>
      <g className="breath-layer"><g className="activity-layer"><g className="morph-rig" ref={ref("rig")}>
        <rect ref={ref("legL")} x={b.legLX} y={b.legY} width="20" height="27" rx="10" fill={animal.foot} />
        <rect ref={ref("legR")} x={b.legRX} y={b.legY} width="21" height="27" rx="10.5" fill={animal.foot} />
        <g ref={ref("earL")}><path className="ear-surface ear-surface-left" d={animal.earL} fill={animal.color} /></g>
        <g ref={ref("earR")}><path className="ear-surface ear-surface-right" d={animal.earR} fill={animal.color} /></g>
        <path d={animal.body} fill={animal.color} />
        <g className="blink-eye blink-left"><ellipse ref={ref("eyeL")} fill="#101113" /></g>
        <g className="blink-eye blink-right"><ellipse ref={ref("eyeR")} fill="#101113" /></g>
        <g className="mouth-motion"><path ref={ref("mouth")} fill="none" stroke="#101113" strokeWidth="3" strokeLinecap="round" /></g>
        <ellipse ref={ref("handL")} cx={b.handLX} cy={b.handLY} rx="10.5" ry="10" fill={animal.limb} />
        <ellipse ref={ref("handR")} cx={b.handRX} cy={b.handRY} rx="10.5" ry="10" fill={animal.limb} />
      </g></g></g>
    </svg>
  );
}

function MiniCritter({ animal }) {
  const b = animal.base;
  return <svg viewBox="0 0 200 200" aria-hidden="true"><path d={animal.earL} fill={animal.color} /><path d={animal.earR} fill={animal.color} /><path d={animal.body} fill={animal.color} /><circle cx={b.eyeLX} cy={b.eyeY} r="4" fill="#101113" /><circle cx={b.eyeRX} cy={b.eyeY} r="4" fill="#101113" /></svg>;
}

function FaceGlyph({ emotion }) {
  const p = emotion.pose;
  return <svg viewBox="0 0 40 40" aria-hidden="true">
    <ellipse cx={13 + p.eyeLDX * .18} cy={15 + p.eyeLDY * .22} rx={Math.max(1.2, p.eyeLRX * .55)} ry={Math.max(.5, p.eyeLRY * .55)} fill="currentColor" transform={`rotate(${p.eyeLRot} 13 15)`} />
    <ellipse cx={27 + p.eyeRDX * .18} cy={15 + p.eyeRDY * .22} rx={Math.max(1.2, p.eyeRRX * .55)} ry={Math.max(.5, p.eyeRRY * .55)} fill="currentColor" transform={`rotate(${p.eyeRRot} 27 15)`} />
    <path d={`M${20 - p.mouthW * .32} 25C18 ${25 + p.mouthCurve * .35} 22 ${25 + p.mouthCurve * .35} ${20 + p.mouthW * .32} 25`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

function App() {
  const [speciesKey, setSpeciesKey] = useState("cat");
  const [emotionKey, setEmotionKey] = useState("neutral");
  const [mode, setMode] = useState("idle");
  const animal = useMemo(() => SPECIES.find((item) => item.key === speciesKey), [speciesKey]);
  const emotion = useMemo(() => EMOTIONS.find((item) => item.key === emotionKey), [emotionKey]);
  return <main className="studio-shell">
    <header className="studio-header">
      <div className="studio-title"><span className="wordmark">Mood Critters</span><p>five characters, sixteen expressions</p></div>
      <dl className="studio-stats"><div><dt>characters</dt><dd>5</dd></div><div><dt>expressions</dt><dd>16</dd></div><div><dt>motion layers</dt><dd>3</dd></div></dl>
    </header>
    <section className="workspace" aria-label="캐릭터 감정 애니메이션 스튜디오">
      <div className="preview-column">
        <div className="preview-toolbar">
          <div><span>{animal.english}</span><strong>{emotion.name}</strong><p>{emotion.description}</p></div>
          <div className="mode-tabs" aria-label="모션 선택">{MODES.map((item) => <button key={item.key} aria-pressed={mode === item.key} onClick={() => setMode(item.key)}><strong>{item.name}</strong><small>{item.english}</small></button>)}</div>
        </div>
        <div className="canvas-frame"><MorphCritter key={animal.key} animal={animal} emotion={emotion} mode={mode} /></div>
        <div className="species-tabs" aria-label="캐릭터 선택">{SPECIES.map((item) => <button key={item.key} aria-pressed={speciesKey === item.key} onClick={() => setSpeciesKey(item.key)}><MiniCritter animal={item} /><span>{item.name}</span></button>)}</div>
      </div>
      <aside className="expression-panel" aria-label="감정 선택">
        <div className="panel-title"><div><h1>Expressions</h1><p>하나의 얼굴, 열여섯 감정</p></div><span>{String(EMOTIONS.findIndex((item) => item.key === emotionKey) + 1).padStart(2, "0")}</span></div>
        <div className="expression-list">{EMOTIONS.map((item) => <button key={item.key} aria-pressed={emotionKey === item.key} onClick={() => setEmotionKey(item.key)}><FaceGlyph emotion={item} /><span><strong>{item.name}</strong><small>{item.english}</small></span></button>)}</div>
        <div className="motion-note"><span>transition</span><p>현재 화면의 포즈에서 이어서, 부위별 easing으로 자연스럽게 전환합니다.</p></div>
      </aside>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
