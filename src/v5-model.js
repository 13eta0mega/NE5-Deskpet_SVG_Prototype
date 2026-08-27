export const COLORS = {
  body: "#9DB6E5",
  paw: "#CAD7F3",
  feet: "#7F97CB",
  face: "#232733",
  blush: "#F3A7B8",
  tear: "#78BDE1",
};

export const PART_IDS = [
  "legL", "legR", "earL", "earR", "body",
  "blushL", "blushR", "eyeL", "eyeR",
  "tearL", "tearR", "mouth", "handL", "handR",
];

const defs = [
  ["neutral", "편안", "neutral", {}],
  ["happy", "기쁨", "happy", { eyeRy: .95, eyeY: 109, eyeLTilt: -8, eyeRTilt: 8, mouthW: 10, mouthC: 123.8, handIn: 3, bodyY: -1 }],
  ["excited", "신남", "excited", { eyeRx: 4.2, eyeRy: 5, eyeY: 106.5, mouthW: 7, mouthY: 116, mouthC: 128, handY: -17, handOut: 6, bodyY: -5, bodySy: 1.025, earL: -8, earR: 8 }],
  ["love", "사랑", "love", { eyeRy: .72, eyeY: 109, eyeLTilt: -10, eyeRTilt: 10, mouthW: 7.5, mouthC: 123.2, handIn: 20, handY: -8, blush: true, bodyTilt: -2, earL: -3, earR: 3 }],
  ["amused", "웃음", "amused", { eyeRy: .62, eyeY: 109, eyeLTilt: 7, eyeRTilt: -7, mouthW: 13, mouthC: 125.2, handY: -6, handOut: 2, bodyY: -2 }],
  ["proud", "뿌듯", "proud", { eyeLRy: 1.45, eyeRRy: 2.15, eyeY: 107.5, mouthW: 7, mouthL: 120.2, mouthC: 122, mouthR: 119.2, bodyY: -2, bodyTilt: 4, handOut: 3, handY: 2 }],
  ["curious", "궁금", "curious", { eyeLRx: 4.2, eyeLRy: 4.8, eyeRRx: 3, eyeRRy: 3.3, eyeX: 2, mouthW: 5.5, mouthC: 120.8, bodyTilt: 6, earL: -2, earR: -12 }],
  ["surprised", "놀람", "surprised", { eyeRx: 4.5, eyeRy: 5.5, eyeY: 105.5, mouthW: 4.2, mouthY: 115.5, mouthC: 129, handOut: 10, handY: -6, bodyY: -4, bodySy: 1.02, earL: -10, earR: 10 }],
  ["confused", "혼란", "confused", { eyeLRx: 2.6, eyeLRy: 2.1, eyeRRx: 4, eyeRRy: 4.5, eyeY: 108.5, mouthW: 7, mouthL: 118, mouthC: 120.5, mouthR: 121.8, bodyTilt: -6, earL: -10, earR: 2 }],
  ["shy", "수줍", "shy", { eyeRy: 1.2, eyeY: 111, mouthW: 5, mouthC: 121.8, handIn: 23, handY: -11, blush: true, bodyTilt: 2, bodyY: 2 }],
  ["sad", "슬픔", "sad", { eyeRx: 3, eyeRy: 2.3, eyeY: 111.5, eyeLTilt: -9, eyeRTilt: 9, mouthW: 8.5, mouthY: 121, mouthC: 116, bodyY: 6, bodySy: .965, earL: 13, earR: -13 }],
  ["worried", "걱정", "worried", { eyeRx: 3.5, eyeRy: 4.8, eyeY: 108.5, eyeLTilt: -5, eyeRTilt: 5, mouthW: 6.5, mouthL: 119.3, mouthC: 116.2, mouthR: 120.3, handIn: 10, handY: -5, bodyY: 2, earL: 7, earR: -7 }],
  ["angry", "화남", "angry", { eyeRx: 4.5, eyeRy: 1.15, eyeY: 108, eyeLTilt: 13, eyeRTilt: -13, mouthW: 7.5, mouthY: 121, mouthC: 116.5, handOut: 7, handY: 2, bodyY: 3, bodySx: 1.025, earL: 9, earR: -9 }],
  ["annoyed", "시큰둥", "annoyed", { eyeLRx: 4.2, eyeLRy: .7, eyeRRx: 3.6, eyeRRy: 1.15, eyeY: 110, eyeLTilt: 2, eyeRTilt: -2, mouthW: 6.5, mouthL: 120.4, mouthC: 119.5, mouthR: 118.8, bodyTilt: 3, eyeX: 2 }],
  ["sleepy", "졸림", "sleepy", { eyeRx: 4.4, eyeRy: .45, eyeY: 112.5, mouthW: 3.8, mouthY: 121, mouthC: 121, bodyY: 7, bodySy: .95, bodyTilt: -3, earL: 9, earR: -9, handY: 3 }],
  ["crying", "울음", "crying", { eyeRx: 4.1, eyeRy: .72, eyeY: 107, eyeLTilt: -8, eyeRTilt: 8, mouthW: 8.5, mouthY: 122, mouthC: 114.5, handIn: 13, handY: -10, bodyY: 5, bodySy: .97, earL: 13, earR: -13, tears: true }],
];

export const EMOTIONS = defs.map(([key, name, english, mods]) => ({ key, name, english, mods }));

const defaults = {
  eyeRx: 3.4, eyeRy: 3.8, eyeLRx: null, eyeLRy: null, eyeRRx: null, eyeRRy: null,
  eyeY: 108, eyeX: 0, eyeLTilt: 0, eyeRTilt: 0,
  mouthW: 6, mouthY: 120, mouthC: 121.3, mouthL: null, mouthR: null,
  handIn: 0, handOut: 0, handY: 0,
  bodyY: 0, bodySx: 1, bodySy: 1, bodyTilt: 0,
  earL: 0, earR: 0, blush: false, tears: false,
};

const rad = deg => deg * Math.PI / 180;
const rotate = (x, y, cx, cy, deg) => {
  const a = rad(deg), dx = x - cx, dy = y - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
};
const f = n => Number(n.toFixed(3));
const pair = p => `${f(p[0])} ${f(p[1])}`;

function earPath(side, deg) {
  const left = [[70,70],[61,51],[47,39],[38,48],[28,59],[33,81],[50,88],[60,90],[75,78],[75,70]];
  const right = [[130,70],[139,51],[153,39],[162,48],[172,59],[167,81],[150,88],[140,90],[125,78],[125,70]];
  const anchor = side === "L" ? [69,74] : [131,74];
  const p = (side === "L" ? left : right).map(([x,y]) => rotate(x, y, anchor[0], anchor[1], deg));
  return `M${pair(p[0])}C${pair(p[1])} ${pair(p[2])} ${pair(p[3])}C${pair(p[4])} ${pair(p[5])} ${pair(p[6])}C${pair(p[7])} ${pair(p[8])} ${pair(p[9])}Z`;
}

function bodyPath({ bodyY, bodySx, bodySy, bodyTilt }) {
  const base = [[100,54],[132,52],[156,68],[164,94],[171,123],[161,153],[141,169],[129,179],[115,183],[100,183],[84,183],[70,179],[58,169],[38,152],[29,123],[36,94],[42,68],[68,52],[100,54]];
  const p = base.map(([x,y]) => {
    const sx = 100 + (x - 100) * bodySx;
    const sy = 183 + (y - 183) * bodySy + bodyY;
    return rotate(sx, sy, 100, 183, bodyTilt);
  });
  return `M${pair(p[0])}C${pair(p[1])} ${pair(p[2])} ${pair(p[3])}C${pair(p[4])} ${pair(p[5])} ${pair(p[6])}C${pair(p[7])} ${pair(p[8])} ${pair(p[9])}C${pair(p[10])} ${pair(p[11])} ${pair(p[12])}C${pair(p[13])} ${pair(p[14])} ${pair(p[15])}C${pair(p[16])} ${pair(p[17])} ${pair(p[18])}Z`;
}

function eyePath(cx, cy, rx, ry, tilt) {
  const k = .55228475;
  const raw = [
    [cx+rx,cy],[cx+rx,cy+k*ry],[cx+k*rx,cy+ry],[cx,cy+ry],
    [cx-k*rx,cy+ry],[cx-rx,cy+k*ry],[cx-rx,cy],
    [cx-rx,cy-k*ry],[cx-k*rx,cy-ry],[cx,cy-ry],
    [cx+k*rx,cy-ry],[cx+rx,cy-k*ry],[cx+rx,cy],
  ];
  const p = raw.map(([x,y]) => rotate(x,y,cx,cy,tilt));
  return `M${pair(p[0])}C${pair(p[1])} ${pair(p[2])} ${pair(p[3])}C${pair(p[4])} ${pair(p[5])} ${pair(p[6])}C${pair(p[7])} ${pair(p[8])} ${pair(p[9])}C${pair(p[10])} ${pair(p[11])} ${pair(p[12])}Z`;
}

function mouthPath({ mouthW, mouthY, mouthC, mouthL, mouthR }) {
  const cx = 100, w = mouthW, leftY = mouthL ?? mouthY, rightY = mouthR ?? mouthY, centerY = mouthC;
  return `M${f(cx-w)} ${f(leftY)}C${f(cx-w*.62)} ${f(centerY)} ${f(cx-w*.28)} ${f(centerY)} ${cx} ${f(centerY)}C${f(cx+w*.28)} ${f(centerY)} ${f(cx+w*.62)} ${f(centerY)} ${f(cx+w)} ${f(rightY)}`;
}

function tearPath(cx, cy, scale) {
  const s = scale;
  const p = [[cx,cy],[cx+2.2*s,cy+3*s],[cx+3.2*s,cy+5.2*s],[cx+2.2*s,cy+7*s],[cx+1.3*s,cy+9*s],[cx-1.3*s,cy+9*s],[cx-2.2*s,cy+7*s],[cx-3.2*s,cy+5.2*s],[cx-2.2*s,cy+3*s],[cx,cy],[cx-.8*s,cy+1.2*s],[cx-.3*s,cy+.4*s],[cx,cy]];
  return `M${pair(p[0])}C${pair(p[1])} ${pair(p[2])} ${pair(p[3])}C${pair(p[4])} ${pair(p[5])} ${pair(p[6])}C${pair(p[7])} ${pair(p[8])} ${pair(p[9])}C${pair(p[10])} ${pair(p[11])} ${pair(p[12])}Z`;
}

export function makeState(mods = {}) {
  const m = { ...defaults, ...mods };
  const eyeLRx = m.eyeLRx ?? m.eyeRx, eyeLRy = m.eyeLRy ?? m.eyeRy;
  const eyeRRx = m.eyeRRx ?? m.eyeRx, eyeRRy = m.eyeRRy ?? m.eyeRy;
  const eyeLX = 69 + m.eyeX, eyeRX = 131 + m.eyeX;
  const handLX = 43 + m.handIn - m.handOut, handRX = 157 - m.handIn + m.handOut, handY = 146 + m.handY;
  const tearScale = m.tears ? 1.45 : .01;
  return {
    legL: { tag: "rect", x: 78, y: 166, width: 20, height: 28, rx: 10, fill: COLORS.feet },
    legR: { tag: "rect", x: 103, y: 166, width: 20, height: 28, rx: 10, fill: COLORS.feet },
    earL: { tag: "path", d: earPath("L", m.earL), fill: COLORS.body },
    earR: { tag: "path", d: earPath("R", m.earR), fill: COLORS.body },
    body: { tag: "path", d: bodyPath(m), fill: COLORS.body },
    blushL: { tag: "circle", cx: 55, cy: 126, r: 5.2, fill: m.blush ? COLORS.blush : COLORS.body },
    blushR: { tag: "circle", cx: 145, cy: 126, r: 5.2, fill: m.blush ? COLORS.blush : COLORS.body },
    eyeL: { tag: "path", d: eyePath(eyeLX, m.eyeY, eyeLRx, eyeLRy, m.eyeLTilt), fill: COLORS.face },
    eyeR: { tag: "path", d: eyePath(eyeRX, m.eyeY, eyeRRx, eyeRRy, m.eyeRTilt), fill: COLORS.face },
    tearL: { tag: "path", d: tearPath(eyeLX, m.eyeY + 4, tearScale), fill: m.tears ? COLORS.tear : COLORS.body },
    tearR: { tag: "path", d: tearPath(eyeRX, m.eyeY + 4, tearScale), fill: m.tears ? COLORS.tear : COLORS.body },
    mouth: { tag: "path", d: mouthPath(m), fill: "none", stroke: COLORS.face, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" },
    handL: { tag: "ellipse", cx: handLX, cy: handY, rx: 11, ry: 10.5, fill: COLORS.paw },
    handR: { tag: "ellipse", cx: handRX, cy: handY, rx: 11, ry: 10.5, fill: COLORS.paw },
  };
}

export const STATES = Object.fromEntries(EMOTIONS.map(e => [e.key, makeState(e.mods)]));

export function numberCount(value) {
  return (String(value).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).length;
}
