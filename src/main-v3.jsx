import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./v3.css";

const SPECIES = [
  {
    key: "dog", name: "강아지", english: "dog",
    color: "#D88D54", limb: "#EAAF72", foot: "#A86637", inner: "#F2B987", patch: "#F7D5AB", tailTip: "#F7D5AB",
    body: "M164 124C164 148 151 166 132 176C114 186 86 185 65 176C44 167 33 151 32 130C30 109 37 91 51 79C66 65 82 60 101 60C121 60 140 67 152 82C163 95 168 109 164 124Z",
    earL: "M63 79C51 66 34 66 27 79C18 95 23 119 35 134C43 144 54 145 60 132C67 117 72 91 63 79Z",
    earR: "M138 79C150 66 167 67 174 80C183 96 177 120 165 135C157 145 146 145 140 132C133 117 129 91 138 79Z",
    innerEarL: "M55 82C47 75 38 76 34 85C29 96 33 114 40 124C45 131 51 130 54 121C58 109 61 90 55 82Z",
    innerEarR: "M146 82C154 75 163 76 167 86C172 97 168 114 161 124C156 131 150 130 147 121C143 109 140 90 146 82Z",
    facePatch: "M74 124C78 113 88 108 101 108C114 108 124 114 128 125C132 137 120 150 101 151C82 150 70 137 74 124Z",
    tail: "M149 140C169 130 184 138 182 151C180 164 163 171 146 164C150 157 152 148 149 140Z",
    tailTip: "M174 141C182 145 184 152 179 158C174 164 167 166 160 165C168 158 173 150 174 141Z",
    base: { eyeLX: 72, eyeRX: 130, eyeY: 107, mouthX: 101, mouthY: 132, noseX: 101, noseY: 120, noseRX: 4.7, noseRY: 3.7, handLX: 40, handLY: 145, handRX: 162, handRY: 145, legLX: 76, legRX: 108, legY: 168, earLPivotX: 61, earLPivotY: 82, earRPivotX: 141, earRPivotY: 82 },
  },
  {
    key: "fox", name: "여우", english: "fox",
    color: "#E87543", limb: "#F29A60", foot: "#B95734", inner: "#CC4F3A", patch: "#F6D6B3", tailTip: "#F8E3CB",
    body: "M166 123C164 145 152 163 133 174C116 184 91 184 70 176C48 168 36 151 35 130C33 109 39 91 53 77C67 63 85 57 103 58C124 59 142 68 155 83C165 95 169 109 166 123Z",
    earL: "M76 74C66 65 58 49 57 33C56 21 61 15 67 18C80 24 91 48 92 70C88 77 82 79 76 74Z",
    earR: "M127 71C130 49 142 24 155 18C161 15 166 21 165 34C164 51 157 68 148 76C140 81 131 78 127 71Z",
    innerEarL: "M71 64C65 55 62 43 63 32C64 27 66 25 69 27C76 34 82 49 84 63C81 67 76 68 71 64Z",
    innerEarR: "M136 64C139 49 147 34 154 27C157 25 159 28 159 34C158 46 153 58 147 66C143 69 139 68 136 64Z",
    facePatch: "M62 110C73 106 83 110 101 121C119 109 131 106 142 111C139 129 128 143 113 149C106 152 97 152 89 149C74 143 65 129 62 110Z",
    tail: "M149 132C169 122 187 129 190 145C194 163 178 177 156 174C145 173 138 169 133 164C145 156 153 145 149 132Z",
    tailTip: "M181 137C190 143 192 153 187 161C181 170 171 174 160 173C169 164 177 152 181 137Z",
    base: { eyeLX: 72, eyeRX: 130, eyeY: 108, mouthX: 101, mouthY: 130, noseX: 101, noseY: 119, noseRX: 4.2, noseRY: 3.3, handLX: 41, handLY: 144, handRX: 162, handRY: 145, legLX: 77, legRX: 108, legY: 168, earLPivotX: 80, earLPivotY: 74, earRPivotX: 137, earRPivotY: 74 },
  },
  {
    key: "bear", name: "곰", english: "bear",
    color: "#A6795E", limb: "#B98C6F", foot: "#75513F", inner: "#805A48", patch: "#D8B89E", tailTip: "#D8B89E",
    body: "M166 125C166 149 153 168 133 177C114 186 87 185 66 177C45 168 34 151 34 129C34 107 42 88 58 76C72 64 87 60 101 60C118 60 137 66 151 79C162 90 167 107 166 125Z",
    earL: "M78 70C75 58 65 50 54 52C42 54 37 67 44 77C51 87 65 87 75 79C79 76 80 73 78 70Z",
    earR: "M126 70C129 58 139 50 150 52C162 54 167 67 160 77C153 87 139 87 129 79C125 76 124 73 126 70Z",
    innerEarL: "M70 68C67 62 61 59 55 60C50 61 48 67 51 72C55 78 63 78 68 74C71 72 72 70 70 68Z",
    innerEarR: "M134 68C137 62 143 59 149 60C154 61 156 67 153 72C149 78 141 78 136 74C133 72 132 70 134 68Z",
    facePatch: "M74 122C78 111 89 106 101 106C114 106 125 112 129 123C133 136 121 150 101 151C82 150 70 136 74 122Z",
    tail: null,
    tailTip: null,
    base: { eyeLX: 72, eyeRX: 130, eyeY: 108, mouthX: 101, mouthY: 132, noseX: 101, noseY: 120, noseRX: 5.2, noseRY: 4.1, handLX: 41, handLY: 145, handRX: 161, handRY: 145, legLX: 77, legRX: 108, legY: 168, earLPivotX: 69, earLPivotY: 73, earRPivotX: 133, earRPivotY: 73 },
  },
  {
    key: "rabbit", name: "토끼", english: "rabbit",
    color: "#F4A7D0", limb: "#FFC7E5", foot: "#D982B1", inner: "#E883BA", patch: "#FFD7EA", tailTip: "#FFD7EA",
    body: "M163 126C157 145 135 149 131 158C127 169 120 181 101 181C79 181 73 168 69 158C65 149 45 151 38 126C31 102 36 84 50 70C64 56 80 51 101 51C124 51 142 60 155 75C167 89 169 108 163 126Z",
    earL: "M91 16C112 15 111 53 106 69C103 78 88 79 83 71C78 63 70 18 91 16Z",
    earR: "M139 22C159 28 140 64 132 75C126 82 112 75 111 67C110 58 119 16 139 22Z",
    innerEarL: "M92 27C103 27 101 54 98 65C96 70 90 70 88 65C85 57 82 28 92 27Z",
    innerEarR: "M136 31C145 35 135 60 130 68C127 72 121 69 122 64C123 55 127 27 136 31Z",
    facePatch: null, tail: null, tailTip: null,
    base: { eyeLX: 72, eyeRX: 128, eyeY: 106, mouthX: 100, mouthY: 127, noseX: 100, noseY: 117, noseRX: 2.8, noseRY: 2.3, handLX: 85, handLY: 149, handRX: 115, handRY: 149, legLX: 80, legRX: 105, legY: 169, earLPivotX: 94, earLPivotY: 70, earRPivotX: 123, earRPivotY: 70 },
  },
  {
    key: "cat", name: "고양이", english: "cat",
    color: "#F1CA44", limb: "#FFD853", foot: "#D5A93A", inner: "#E79283", patch: "#FFE9A1", tailTip: "#F6DF73",
    body: "M171 124C171 145 161 162 144 173C126 183 100 184 79 177C56 169 42 152 40 130C37 109 44 91 58 79C72 67 87 61 106 61C128 61 145 69 158 82C168 93 173 108 171 124Z",
    earL: "M62 54C70 49 90 62 92 72C93 80 64 91 56 87C50 84 53 59 62 54Z",
    earR: "M154 55C164 60 166 85 160 90C153 95 128 81 128 73C128 66 147 51 154 55Z",
    innerEarL: "M66 61C72 59 83 66 84 72C84 76 68 81 63 79C60 77 62 64 66 61Z",
    innerEarR: "M151 62C155 65 157 78 154 80C150 82 137 75 137 71C138 67 147 59 151 62Z",
    facePatch: null,
    tail: "M152 142C174 135 184 143 181 155C178 167 161 172 146 164C150 158 153 150 152 142Z",
    tailTip: null,
    base: { eyeLX: 71, eyeRX: 130, eyeY: 109, mouthX: 101, mouthY: 130, noseX: 101, noseY: 119, noseRX: 3.1, noseRY: 2.4, handLX: 42, handLY: 145, handRX: 161, handRY: 146, legLX: 80, legRX: 109, legY: 168, earLPivotX: 79, earLPivotY: 77, earRPivotX: 137, earRPivotY: 77 },
  },
];

const P = {
  rigX: 0, rigY: 0, rigRot: 0, rigSX: 1, rigSY: 1,
  earLRot: 0, earRRot: 0,
  eyeLDX: 0, eyeLDY: 0, eyeLRX: 3.3, eyeLRY: 3.3, eyeLRot: 0,
  eyeRDX: 0, eyeRDY: 0, eyeRRX: 3.3, eyeRRY: 3.3, eyeRRot: 0,
  browLY: 0, browRY: 0, browLRot: 0, browRRot: 0, browO: .28,
  mouthDX: 0, mouthY: 0, mouthW: 9, mouthCurve: 1.2, mouthTilt: 0,
  handLDX: 0, handLDY: 0, handLRot: 0, handLS: 1,
  handRDX: 0, handRDY: 0, handRRot: 0, handRS: 1,
  legLDX: 0, legLDY: 0, legLRot: 0, legRDX: 0, legRDY: 0, legRRot: 0,
};

const state = (key, name, english, description, energy, values) => ({ key, name, english, description, energy, pose: { ...P, ...values } });
const EMOTIONS = [
  state("neutral", "편안", "neutral", "호흡과 눈깜빡임이 잔잔하게 이어져요", "calm", { browO: .2 }),
  state("happy", "기쁨", "happy", "눈꼬리와 입이 함께 올라가요", "calm", { rigY: -1, eyeLRY: 1.8, eyeRRY: 1.8, mouthW: 12.5, mouthCurve: 5.8, browLY: -1, browRY: -1, browO: .34, handLDY: -3, handRDY: -3 }),
  state("excited", "신남", "excited", "몸과 귀가 동시에 반응해요", "bright", { rigY: -6, rigSX: 1.035, rigSY: .955, earLRot: -9, earRRot: 9, eyeLRX: 4, eyeLRY: 4.3, eyeRRX: 4, eyeRRY: 4.3, mouthW: 12, mouthCurve: 8.5, browLY: -3, browRY: -3, browO: .62, handLDX: -7, handLDY: -15, handLRot: -22, handRDX: 7, handRDY: -15, handRRot: 22 }),
  state("love", "사랑", "love", "눈을 포근히 감고 손을 모아요", "calm", { rigRot: -2, rigY: 1, eyeLRX: 4.8, eyeLRY: .58, eyeRRX: 4.8, eyeRRY: .58, mouthW: 10, mouthCurve: 5.6, browO: .16, handLDX: 31, handLDY: -9, handLRot: -9, handRDX: -31, handRDY: -9, handRRot: 9 }),
  state("amused", "웃음", "amused", "눈이 접히고 입이 크게 열리는 웃음", "bright", { rigRot: 2, rigY: -2, eyeLRX: 4.5, eyeLRY: .55, eyeRRX: 4.5, eyeRRY: .55, mouthW: 15, mouthCurve: 9, browLY: -2, browRY: -2, browO: .3, handLDY: -6, handRDY: -8 }),
  state("proud", "뿌듯", "proud", "몸을 세우고 여유롭게 바라봐요", "calm", { rigY: -3, rigRot: -1.5, rigSX: 1.015, eyeLDY: -2, eyeRDY: -2, eyeLRY: 1.7, eyeRRY: 1.7, mouthDX: 2, mouthW: 8.5, mouthCurve: 3.6, mouthTilt: -5, browLY: -1.5, browRY: -1.5, browLRot: -4, browRRot: 4, browO: .48 }),
  state("curious", "궁금", "curious", "고개와 시선, 귀가 한 방향을 따라가요", "calm", { rigRot: 6.5, rigX: 3, earLRot: 8, earRRot: -11, eyeLDX: 3.5, eyeRDX: 3.5, eyeLDY: -1, eyeRDY: -1, mouthDX: 2, mouthW: 6, mouthCurve: 1, mouthTilt: 3, browLY: -2, browRY: 1, browLRot: -9, browRRot: 4, browO: .58 }),
  state("surprised", "놀람", "surprised", "눈과 입, 눈썹이 한 번에 크게 반응해요", "bright", { rigY: -5, rigSX: .965, rigSY: 1.05, earLRot: -10, earRRot: 10, eyeLRX: 4.5, eyeLRY: 4.8, eyeRRX: 4.5, eyeRRY: 4.8, mouthW: 5, mouthCurve: 10.5, browLY: -5, browRY: -5, browO: .78, handLDX: -6, handLDY: -8, handRDX: 6, handRDY: -8 }),
  state("confused", "혼란", "confused", "비대칭 눈과 눈썹으로 망설여요", "calm", { rigRot: -5, rigX: -1, earLRot: 9, earRRot: -4, eyeLRY: 1.4, eyeRRY: 3.3, eyeLDY: 1, eyeRDY: -1, eyeLRot: 7, eyeRRot: -3, mouthW: 9.5, mouthCurve: -1.5, mouthTilt: 9, browLY: -1, browRY: -3, browLRot: 12, browRRot: -8, browO: .72 }),
  state("shy", "수줍", "shy", "시선을 피하며 두 손을 가까이 모아요", "low", { rigRot: 3, rigY: 3, eyeLDX: -3.2, eyeRDX: -3.2, eyeLDY: 2, eyeRDY: 2, eyeLRY: 1.5, eyeRRY: 1.5, mouthDX: -2, mouthW: 5.5, mouthCurve: 3, browLY: 1, browRY: 1, browO: .3, handLDX: 29, handLDY: -6, handRDX: -29, handRDY: -6 }),
  state("sad", "슬픔", "sad", "귀와 몸이 함께 내려앉아요", "low", { rigY: 5, rigSY: .97, earLRot: 11, earRRot: -11, eyeLDY: 2.5, eyeRDY: 2.5, eyeLRY: 1.9, eyeRRY: 1.9, mouthW: 12, mouthCurve: -5.5, browLY: -1, browRY: -1, browLRot: -12, browRRot: 12, browO: .75, handLDY: 3, handRDY: 3 }),
  state("worried", "걱정", "worried", "눈썹과 입이 작게 떨리는 듯 모여요", "low", { rigY: 2, rigSX: .985, rigSY: 1.01, rigRot: -2.5, earLRot: 7, earRRot: -7, eyeLDY: 1, eyeRDY: 1, eyeLRY: 3.5, eyeRRY: 3.5, mouthW: 7.5, mouthCurve: -3.3, mouthTilt: -5, browLY: -2, browRY: -2, browLRot: -15, browRRot: 15, browO: .82, handLDY: -2, handRDY: -2 }),
  state("angry", "화남", "angry", "몸을 낮추고 눈과 눈썹을 날카롭게 좁혀요", "tense", { rigY: 4, rigSX: 1.04, rigSY: .95, earLRot: 12, earRRot: -12, eyeLDY: 1.5, eyeRDY: 1.5, eyeLRX: 4.2, eyeLRY: 1, eyeRRX: 4.2, eyeRRY: 1, eyeLRot: 18, eyeRRot: -18, mouthW: 12, mouthCurve: -4.5, browLY: -1, browRY: -1, browLRot: 18, browRRot: -18, browO: .9, handLDX: -5, handRDX: 5, handLDY: 1, handRDY: 1 }),
  state("annoyed", "시큰둥", "annoyed", "눈과 입을 한쪽으로 흘겨봐요", "calm", { rigRot: 2, eyeLDX: 3.5, eyeRDX: 3.5, eyeLRY: .9, eyeRRY: 1.35, eyeLDY: 1, eyeRDY: 2, mouthDX: 3, mouthW: 9, mouthCurve: -1, mouthTilt: 5, browLY: 1, browRY: -1, browLRot: 5, browRRot: -7, browO: .58 }),
  state("sleepy", "졸림", "sleepy", "몸이 가라앉고 눈이 천천히 감겨요", "low", { rigY: 5, rigRot: -4, rigSY: .975, earLRot: 6, earRRot: -5, eyeLRX: 4.5, eyeLRY: .48, eyeRRX: 4.5, eyeRRY: .48, eyeLDY: 3.5, eyeRDY: 3.5, mouthW: 7, mouthCurve: .8, browLY: 2, browRY: 2, browO: .18 }),
  state("crying", "울음", "crying", "두 손을 얼굴 가까이 올리고 몸을 웅크려요", "low", { rigY: 4, rigSX: .985, rigSY: .98, earLRot: 12, earRRot: -12, eyeLRX: 3.9, eyeLRY: 1.15, eyeRRX: 3.9, eyeRRY: 1.15, eyeLDY: 2.5, eyeRDY: 2.5, mouthW: 13, mouthCurve: -7.5, browLY: -1, browRY: -1, browLRot: -14, browRRot: 14, browO: .88, handLDX: 17, handLDY: -24, handLRot: -14, handRDX: -17, handRDY: -24, handRRot: 14 }),
];

const MODES = [
  { key: "idle", name: "평상시", english: "breathe" },
  { key: "listening", name: "듣기", english: "listen" },
  { key: "talking", name: "립싱크", english: "lip sync" },
];

const copyPose = (pose) => ({ ...pose });
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const smooth = (t) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const easeInOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = (t) => { const x = clamp01(t); const c1 = 1.08; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const easingFor = (key, raw) => key.startsWith("ear") || key.startsWith("hand") ? easeOutBack(raw) : key.startsWith("eye") || key.startsWith("brow") || key.startsWith("mouth") ? smooth(raw) : easeInOut(raw);

function setAround(el, pivotX, pivotY, dx, dy, rotation, sx = 1, sy = 1) {
  if (!el) return;
  el.setAttribute("transform", `translate(${dx} ${dy}) translate(${pivotX} ${pivotY}) rotate(${rotation}) scale(${sx} ${sy}) translate(${-pivotX} ${-pivotY})`);
}

function applyPose(refs, animal, pose) {
  const b = animal.base;
  setAround(refs.rig, 101, 195, pose.rigX, pose.rigY, pose.rigRot, pose.rigSX, pose.rigSY);
  setAround(refs.earL, b.earLPivotX, b.earLPivotY, 0, 0, pose.earLRot);
  setAround(refs.earR, b.earRPivotX, b.earRPivotY, 0, 0, pose.earRRot);

  const setEye = (el, x, y, rx, ry, rotation) => {
    if (!el) return;
    el.setAttribute("cx", x); el.setAttribute("cy", y); el.setAttribute("rx", rx); el.setAttribute("ry", Math.max(.35, ry));
    setAround(el, x, y, 0, 0, rotation);
  };
  const eyeLX = b.eyeLX + pose.eyeLDX;
  const eyeRX = b.eyeRX + pose.eyeRDX;
  const eyeLY = b.eyeY + pose.eyeLDY;
  const eyeRY = b.eyeY + pose.eyeRDY;
  setEye(refs.eyeL, eyeLX, eyeLY, pose.eyeLRX, pose.eyeLRY, pose.eyeLRot);
  setEye(refs.eyeR, eyeRX, eyeRY, pose.eyeRRX, pose.eyeRRY, pose.eyeRRot);

  const browLY = b.eyeY - 10 + pose.browLY;
  const browRY = b.eyeY - 10 + pose.browRY;
  refs.browL?.setAttribute("d", `M${eyeLX - 6} ${browLY + 1}Q${eyeLX} ${browLY - 1.8} ${eyeLX + 6} ${browLY + 1}`);
  refs.browR?.setAttribute("d", `M${eyeRX - 6} ${browRY + 1}Q${eyeRX} ${browRY - 1.8} ${eyeRX + 6} ${browRY + 1}`);
  refs.browL?.setAttribute("opacity", pose.browO);
  refs.browR?.setAttribute("opacity", pose.browO);
  setAround(refs.browL, eyeLX, browLY, 0, 0, pose.browLRot);
  setAround(refs.browR, eyeRX, browRY, 0, 0, pose.browRRot);

  const mx = b.mouthX + pose.mouthDX;
  const my = b.mouthY + pose.mouthY;
  const mw = pose.mouthW;
  refs.mouth?.setAttribute("d", `M${mx - mw} ${my}C${mx - mw * .48} ${my + pose.mouthCurve} ${mx + mw * .48} ${my + pose.mouthCurve} ${mx + mw} ${my}`);
  setAround(refs.mouthRig, mx, my, 0, 0, pose.mouthTilt);
  if (refs.voiceCavity) {
    refs.voiceCavity.setAttribute("cx", mx); refs.voiceCavity.setAttribute("cy", my + 4.2);
    refs.voiceCavity.setAttribute("rx", Math.max(4, mw * .52)); refs.voiceCavity.setAttribute("ry", 5.1);
  }
  if (refs.voiceTongue) {
    refs.voiceTongue.setAttribute("cx", mx); refs.voiceTongue.setAttribute("cy", my + 6.7);
    refs.voiceTongue.setAttribute("rx", Math.max(2.2, mw * .25)); refs.voiceTongue.setAttribute("ry", 1.7);
  }

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
    const duration = emotion.energy === "bright" ? 610 : emotion.energy === "low" ? 660 : emotion.energy === "tense" ? 560 : 580;
    nodes.current.svg?.classList.add("is-transitioning");
    const tick = (now) => {
      const raw = clamp01((now - start) / duration);
      const next = {};
      for (const key of Object.keys(to)) next[key] = from[key] + (to[key] - from[key]) * easingFor(key, raw);
      current.current = next;
      applyPose(nodes.current, animal, next);
      if (raw < 1) frame.current = requestAnimationFrame(tick);
      else {
        current.current = copyPose(to);
        nodes.current.svg?.classList.remove("is-transitioning");
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame.current); nodes.current.svg?.classList.remove("is-transitioning"); };
  }, [animal, emotion]);

  const ref = (name) => (node) => { nodes.current[name] = node; };
  const b = animal.base;
  const svgVars = {
    "--ear-lx": `${b.earLPivotX}px`, "--ear-ly": `${b.earLPivotY}px`,
    "--ear-rx": `${b.earRPivotX}px`, "--ear-ry": `${b.earRPivotY}px`,
  };

  return (
    <svg ref={ref("svg")} style={svgVars} className={`critter-svg v3 mode-${mode} energy-${emotion.energy}`} viewBox="0 0 200 200" role="img" aria-label={`${animal.name}의 ${emotion.name} 표정`}>
      <g className="breath-layer"><g className="activity-layer"><g className="morph-rig" ref={ref("rig")}>
        {animal.tail && <g className="tail-motion"><path d={animal.tail} fill={animal.color} />{animal.tailTip && <path d={animal.tailTip} fill={animal.tailTip} />}</g>}
        <rect ref={ref("legL")} x={b.legLX} y={b.legY} width="20" height="27" rx="10" fill={animal.foot} />
        <rect ref={ref("legR")} x={b.legRX} y={b.legY} width="21" height="27" rx="10.5" fill={animal.foot} />

        <g ref={ref("earL")} className="ear-pose"><g className="listen-ear listen-ear-left"><path d={animal.earL} fill={animal.color} /><path d={animal.innerEarL} fill={animal.inner} /></g></g>
        <g ref={ref("earR")} className="ear-pose"><g className="listen-ear listen-ear-right"><path d={animal.earR} fill={animal.color} /><path d={animal.innerEarR} fill={animal.inner} /></g></g>

        <path className="body-surface" d={animal.body} fill={animal.color} />
        {animal.facePatch && <path className="face-patch" d={animal.facePatch} fill={animal.patch} />}

        <g className="listen-face">
          <path ref={ref("browL")} className="brow" fill="none" stroke="#242024" strokeWidth="2.4" strokeLinecap="round" />
          <path ref={ref("browR")} className="brow" fill="none" stroke="#242024" strokeWidth="2.4" strokeLinecap="round" />
          <g className="blink-eye blink-left"><ellipse ref={ref("eyeL")} fill="#151518" /></g>
          <g className="blink-eye blink-right"><ellipse ref={ref("eyeR")} fill="#151518" /></g>
          <ellipse className="nose" cx={b.noseX} cy={b.noseY} rx={b.noseRX} ry={b.noseRY} fill="#3A2928" />
          <g ref={ref("mouthRig")} className="mouth-rig">
            <path ref={ref("mouth")} className="expression-mouth" fill="none" stroke="#242024" strokeWidth="3" strokeLinecap="round" />
            <g className="voice-mouth">
              <ellipse ref={ref("voiceCavity")} className="voice-cavity" fill="#2A2023" />
              <ellipse ref={ref("voiceTongue")} className="voice-tongue" fill="#EE8893" />
            </g>
          </g>
        </g>

        <ellipse ref={ref("handL")} cx={b.handLX} cy={b.handLY} rx="10.5" ry="10" fill={animal.limb} />
        <ellipse ref={ref("handR")} cx={b.handRX} cy={b.handRY} rx="10.5" ry="10" fill={animal.limb} />
      </g></g></g>
    </svg>
  );
}

function MiniCritter({ animal }) {
  const b = animal.base;
  return <svg viewBox="0 0 200 200" aria-hidden="true">
    {animal.tail && <path d={animal.tail} fill={animal.color} />}
    <path d={animal.earL} fill={animal.color} /><path d={animal.earR} fill={animal.color} />
    <path d={animal.body} fill={animal.color} />
    {animal.facePatch && <path d={animal.facePatch} fill={animal.patch} />}
    <circle cx={b.eyeLX} cy={b.eyeY} r="4" fill="#151518" /><circle cx={b.eyeRX} cy={b.eyeY} r="4" fill="#151518" />
  </svg>;
}

function FaceGlyph({ emotion }) {
  const p = emotion.pose;
  return <svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M8 9Q13 7 18 9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={Math.max(.2, p.browO)} transform={`rotate(${p.browLRot * .35} 13 9)`} />
    <path d="M22 9Q27 7 32 9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={Math.max(.2, p.browO)} transform={`rotate(${p.browRRot * .35} 27 9)`} />
    <ellipse cx={13 + p.eyeLDX * .18} cy={16 + p.eyeLDY * .22} rx={Math.max(1.2, p.eyeLRX * .55)} ry={Math.max(.5, p.eyeLRY * .55)} fill="currentColor" transform={`rotate(${p.eyeLRot} 13 16)`} />
    <ellipse cx={27 + p.eyeRDX * .18} cy={16 + p.eyeRDY * .22} rx={Math.max(1.2, p.eyeRRX * .55)} ry={Math.max(.5, p.eyeRRY * .55)} fill="currentColor" transform={`rotate(${p.eyeRRot} 27 16)`} />
    <path d={`M${20 - p.mouthW * .32} 27C18 ${27 + p.mouthCurve * .35} 22 ${27 + p.mouthCurve * .35} ${20 + p.mouthW * .32} 27`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

function App() {
  const [speciesKey, setSpeciesKey] = useState("dog");
  const [emotionKey, setEmotionKey] = useState("neutral");
  const [mode, setMode] = useState("idle");
  const animal = useMemo(() => SPECIES.find((item) => item.key === speciesKey), [speciesKey]);
  const emotion = useMemo(() => EMOTIONS.find((item) => item.key === emotionKey), [emotionKey]);
  return <main className="studio-shell">
    <header className="studio-header">
      <div className="studio-title"><span className="wordmark">Mood Critters V3</span><p>anchored ears, clearer listening, expressive lip sync</p></div>
      <dl className="studio-stats"><div><dt>characters</dt><dd>5</dd></div><div><dt>expressions</dt><dd>16</dd></div><div><dt>motion layers</dt><dd>5</dd></div></dl>
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
        <div className="panel-title"><div><h1>Expressions</h1><p>귀 접합부를 유지한 16개 감정 리그</p></div><span>{String(EMOTIONS.findIndex((item) => item.key === emotionKey) + 1).padStart(2, "0")}</span></div>
        <div className="expression-list">{EMOTIONS.map((item) => <button key={item.key} aria-pressed={emotionKey === item.key} onClick={() => setEmotionKey(item.key)}><FaceGlyph emotion={item} /><span><strong>{item.name}</strong><small>{item.english}</small></span></button>)}</div>
        <div className="motion-note"><span>rig v3</span><p>종별 귀 앵커와 독립 얼굴·립싱크 레이어를 사용합니다.</p></div>
      </aside>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
