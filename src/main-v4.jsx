import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./v4.css";

const SPECIES = [
  {
    key: "dog", name: "강아지", english: "dog",
    fur: "#D99258", light: "#F7D1A2", inner: "#B96C4D", dark: "#3A2928", paw: "#EAB77D",
    body: "M42 127C42 91 63 63 99 61C135 59 160 84 160 125C160 159 140 181 101 183C62 182 42 161 42 127Z",
    earL: "M65 79C54 67 34 67 27 83C20 101 29 132 45 141C54 146 61 136 64 122C69 105 74 89 65 79Z",
    earR: "M137 79C148 67 168 67 175 83C182 101 173 132 157 141C148 146 141 136 138 122C133 105 128 89 137 79Z",
    innerL: "M57 83C49 77 39 80 36 91C33 104 39 121 47 127C52 130 55 123 56 114C58 103 63 89 57 83Z",
    innerR: "M145 83C153 77 163 80 166 91C169 104 163 121 155 127C150 130 147 123 146 114C144 103 139 89 145 83Z",
    muzzle: "M72 126C72 111 84 101 101 101C118 101 130 111 130 126C130 143 118 154 101 154C84 154 72 143 72 126Z",
    forehead: "M78 68C88 61 113 60 124 69C117 78 111 83 101 84C91 83 84 78 78 68Z",
    tail: "M151 137C172 126 188 137 183 153C179 166 163 171 148 165C152 157 154 147 151 137Z",
    anchorL: [64, 82], anchorR: [138, 82], eyeL: [76,108], eyeR: [126,108], nose: [101,122], mouth: [101,134], handL: [50,148], handR: [152,148], footL: [77,171], footR: [108,171],
  },
  {
    key: "fox", name: "여우", english: "fox",
    fur: "#E56F3F", light: "#F7D7B9", inner: "#B94F46", dark: "#372525", paw: "#F18B56",
    body: "M39 129C39 94 57 67 94 60C131 53 162 80 164 122C166 157 142 181 101 183C60 182 39 162 39 129Z",
    earL: "M67 74C58 62 53 39 58 22C61 12 68 13 76 24C86 38 91 56 89 72C84 80 73 80 67 74Z",
    earR: "M132 73C134 55 142 35 154 22C162 13 168 15 169 26C171 44 163 65 153 76C146 82 137 80 132 73Z",
    innerL: "M69 63C64 53 63 39 66 30C68 25 72 28 76 35C81 44 83 53 82 62C79 66 73 67 69 63Z",
    innerR: "M139 63C142 50 149 37 155 30C159 26 161 30 160 36C159 47 155 57 150 64C146 67 142 67 139 63Z",
    muzzle: "M61 111C73 106 85 110 101 122C118 110 131 106 143 112C139 137 123 153 101 154C79 153 64 137 61 111Z",
    forehead: "M86 63C96 57 114 58 123 65L111 76L101 71L91 76Z",
    tail: "M145 135C167 115 190 126 190 146C190 168 169 180 145 171C136 168 131 164 127 159C139 154 147 145 145 135Z",
    tailTip: "M177 130C187 136 192 146 188 157C184 168 174 174 162 175C171 164 176 148 177 130Z",
    anchorL: [83,73], anchorR: [139,73], eyeL: [74,108], eyeR: [128,108], nose: [101,120], mouth: [101,133], handL: [49,148], handR: [153,148], footL: [78,171], footR: [109,171],
  },
  {
    key: "bear", name: "곰", english: "bear",
    fur: "#A87A5E", light: "#D9B99E", inner: "#7D5547", dark: "#352828", paw: "#C59673",
    body: "M38 128C38 91 61 64 101 62C141 61 164 88 164 126C164 162 141 182 101 183C61 182 38 162 38 128Z",
    earL: "M74 73C74 58 63 49 51 52C38 55 34 70 44 80C52 89 66 86 74 78Z",
    earR: "M128 73C128 58 139 49 151 52C164 55 168 70 158 80C150 89 136 86 128 78Z",
    innerL: "M67 70C66 62 60 59 54 61C48 63 47 70 51 74C56 79 63 77 67 74Z",
    innerR: "M135 70C136 62 142 59 148 61C154 63 155 70 151 74C146 79 139 77 135 74Z",
    muzzle: "M70 122C70 107 84 98 101 98C119 98 132 108 132 123C132 141 120 154 101 154C82 154 70 141 70 122Z",
    forehead: "M80 69C90 64 112 64 122 69C117 76 110 79 101 79C92 79 85 76 80 69Z",
    tail: null,
    anchorL: [72,76], anchorR: [130,76], eyeL: [75,108], eyeR: [127,108], nose: [101,121], mouth: [101,134], handL: [49,149], handR: [153,149], footL: [78,171], footR: [109,171],
  },
  {
    key: "rabbit", name: "토끼", english: "rabbit",
    fur: "#F1A9CF", light: "#FFD7EA", inner: "#DC7BAE", dark: "#35272F", paw: "#FFC3E1",
    body: "M42 127C42 91 64 63 101 61C138 60 160 87 160 126C160 162 137 181 101 183C64 182 42 161 42 127Z",
    earL: "M84 70C78 54 70 19 87 12C104 5 108 42 104 69C100 79 89 80 84 70Z",
    earR: "M118 70C117 45 127 12 142 17C159 23 142 58 134 72C129 81 120 78 118 70Z",
    innerL: "M90 62C87 49 83 25 90 22C97 19 99 46 97 62C95 67 92 67 90 62Z",
    innerR: "M125 62C126 48 133 26 139 27C146 29 136 53 132 63C130 67 126 67 125 62Z",
    muzzle: null, forehead: null, tail: null,
    anchorL: [97,71], anchorR: [122,71], eyeL: [75,106], eyeR: [127,106], nose: [101,119], mouth: [101,131], handL: [87,150], handR: [115,150], footL: [80,171], footR: [106,171],
  },
  {
    key: "cat", name: "고양이", english: "cat",
    fur: "#F0C949", light: "#FFEAA0", inner: "#DC8C7E", dark: "#342B23", paw: "#FFD85D",
    body: "M39 129C39 94 60 66 103 62C143 60 166 86 164 126C163 162 140 181 102 183C62 182 39 162 39 129Z",
    earL: "M62 59C68 49 90 55 94 70C96 79 67 91 57 86C49 82 55 66 62 59Z",
    earR: "M144 59C151 51 166 57 168 69C171 82 155 91 132 75C127 70 138 63 144 59Z",
    innerL: "M67 63C72 58 84 62 86 69C87 74 69 79 64 76C61 74 63 67 67 63Z",
    innerR: "M148 63C153 60 160 64 160 69C161 76 153 79 140 72C138 69 144 65 148 63Z",
    muzzle: null, forehead: null,
    tail: "M149 137C171 128 187 140 181 156C176 168 160 172 146 165C151 157 153 146 149 137Z",
    anchorL: [86,76], anchorR: [137,76], eyeL: [74,109], eyeR: [128,109], nose: [101,121], mouth: [101,133], handL: [50,148], handR: [153,148], footL: [79,171], footR: [109,171],
  },
];

const BASE = {
  bodyX:0, bodyY:0, bodyRot:0, bodySX:1, bodySY:1,
  earL:0, earR:0, eyeLX:0, eyeLY:0, eyeLSX:1, eyeLSY:1,
  eyeRX:0, eyeRY:0, eyeRSX:1, eyeRSY:1,
  browL:0, browR:0, browY:0,
  mouthW:10, mouthOpen:1.2, mouthSmile:1.5, mouthTilt:0,
  handLX:0, handLY:0, handLRot:0, handRX:0, handRY:0, handRRot:0,
};
const E = (key,name,english,pose) => ({ key,name,english,pose:{...BASE,...pose} });
const EMOTIONS = [
  E("neutral","편안","neutral",{}),
  E("happy","기쁨","happy",{bodyY:-2,eyeLSY:.55,eyeRSY:.55,mouthW:13,mouthOpen:1.8,mouthSmile:5,browL:-4,browR:4}),
  E("excited","신남","excited",{bodyY:-6,bodySX:1.035,bodySY:.96,earL:-8,earR:8,eyeLSX:1.2,eyeLSY:1.25,eyeRSX:1.2,eyeRSY:1.25,mouthW:12,mouthOpen:7,mouthSmile:3,handLX:-8,handLY:-15,handLRot:-20,handRX:8,handRY:-15,handRRot:20}),
  E("love","사랑","love",{bodyRot:-2,eyeLSY:.2,eyeRSY:.2,mouthW:10,mouthSmile:5,handLX:28,handLY:-7,handRX:-28,handRY:-7}),
  E("amused","웃음","amused",{bodyY:-2,eyeLSY:.18,eyeRSY:.18,mouthW:15,mouthOpen:7,mouthSmile:6}),
  E("proud","뿌듯","proud",{bodyY:-3,eyeLY:-2,eyeRY:-2,eyeLSY:.55,eyeRSY:.55,mouthW:9,mouthSmile:3,mouthTilt:-5,browL:-5,browR:5}),
  E("curious","궁금","curious",{bodyRot:6,bodyX:3,earL:7,earR:-10,eyeLX:3,eyeRX:3,mouthW:7,mouthSmile:1,browL:-10,browR:4}),
  E("surprised","놀람","surprised",{bodyY:-4,bodySY:1.04,earL:-9,earR:9,eyeLSX:1.25,eyeLSY:1.35,eyeRSX:1.25,eyeRSY:1.35,mouthW:6,mouthOpen:10,mouthSmile:0,browY:-4}),
  E("confused","혼란","confused",{bodyRot:-4,earL:8,earR:-4,eyeLSY:.45,eyeRSY:1.05,mouthW:9,mouthSmile:-1,mouthTilt:8,browL:10,browR:-8}),
  E("shy","수줍","shy",{bodyRot:3,bodyY:2,eyeLX:-3,eyeRX:-3,eyeLY:2,eyeRY:2,eyeLSY:.5,eyeRSY:.5,mouthW:6,mouthSmile:2,handLX:27,handLY:-6,handRX:-27,handRY:-6}),
  E("sad","슬픔","sad",{bodyY:5,bodySY:.97,earL:10,earR:-10,eyeLY:2,eyeRY:2,eyeLSY:.65,eyeRSY:.65,mouthW:11,mouthSmile:-5,browL:-13,browR:13}),
  E("worried","걱정","worried",{bodyY:2,bodyRot:-2,earL:6,earR:-6,eyeLSY:1.1,eyeRSY:1.1,mouthW:8,mouthSmile:-3,mouthTilt:-4,browL:-15,browR:15,browY:-2}),
  E("angry","화남","angry",{bodyY:3,bodySX:1.04,bodySY:.96,earL:10,earR:-10,eyeLSX:1.25,eyeLSY:.3,eyeRSX:1.25,eyeRSY:.3,mouthW:11,mouthSmile:-4,browL:18,browR:-18}),
  E("annoyed","시큰둥","annoyed",{bodyRot:2,eyeLX:3,eyeRX:3,eyeLSY:.28,eyeRSY:.45,mouthW:8,mouthSmile:-1,mouthTilt:5,browL:6,browR:-6}),
  E("sleepy","졸림","sleepy",{bodyY:5,bodyRot:-3,eyeLY:3,eyeRY:3,eyeLSY:.15,eyeRSY:.15,mouthW:7,mouthOpen:.8,mouthSmile:0}),
  E("crying","울음","crying",{bodyY:4,bodySY:.98,earL:10,earR:-10,eyeLY:2,eyeRY:2,eyeLSY:.35,eyeRSY:.35,mouthW:12,mouthOpen:5,mouthSmile:-5,browL:-14,browR:14,handLX:16,handLY:-23,handRX:-16,handRY:-23}),
];

const MODES=[{key:"idle",name:"평상시",english:"idle"},{key:"listening",name:"듣기",english:"listening"},{key:"talking",name:"립싱크",english:"talking"}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

function setTransform(el,pivot,dx,dy,rot,sx=1,sy=1){ if(!el)return; const [x,y]=pivot; el.setAttribute("transform",`translate(${dx} ${dy}) translate(${x} ${y}) rotate(${rot}) scale(${sx} ${sy}) translate(${-x} ${-y})`); }

function Character({animal,emotion,mode}){
  const n=useRef({});
  const pose=useRef({...emotion.pose});
  const target=useRef(emotion.pose);
  const modeRef=useRef(mode);
  useEffect(()=>{target.current=emotion.pose;},[emotion]);
  useEffect(()=>{modeRef.current=mode;},[mode]);
  useEffect(()=>{
    let raf=0; let last=performance.now();
    const draw=(now)=>{
      const dt=Math.min(40,now-last); last=now;
      const p=pose.current, t=target.current;
      const k=1-Math.pow(.0018,dt/600);
      Object.keys(t).forEach(key=>p[key]=lerp(p[key],t[key],k));
      const time=now/1000;
      const listening=modeRef.current==="listening";
      const talking=modeRef.current==="talking";
      const breath=Math.sin(time*2.05)*.7;
      const listenWave=listening?Math.sin(time*3.15):0;
      const listenPulse=listening?Math.sin(time*6.3+.8):0;
      const speech=talking?(0.5+0.5*Math.sin(time*17.5)+0.18*Math.sin(time*29.2)):0;
      const speech2=talking?Math.sin(time*8.75):0;
      const bodyX=p.bodyX+(listening?listenWave*1.6:0);
      const bodyY=p.bodyY+breath*.5+(talking?speech2*.45:0);
      const bodyRot=p.bodyRot+(listening?listenWave*1.8:0)+(talking?speech2*.28:0);
      setTransform(n.current.rig,[101,188],bodyX,bodyY,bodyRot,p.bodySX,p.bodySY*(1+breath*.0025));
      setTransform(n.current.earL,animal.anchorL,0,0,p.earL+(listening?-7*listenPulse-3*listenWave:0));
      setTransform(n.current.earR,animal.anchorR,0,0,p.earR+(listening?9*listenPulse+2*listenWave:0));
      const eyeBoost=listening?1+Math.max(0,listenPulse)*.08:1;
      setTransform(n.current.eyeL,animal.eyeL,p.eyeLX,p.eyeLY,0,p.eyeLSX*eyeBoost,p.eyeLSY*eyeBoost);
      setTransform(n.current.eyeR,animal.eyeR,p.eyeRX,p.eyeRY,0,p.eyeRSX*eyeBoost,p.eyeRSY*eyeBoost);
      const [elx,ely]=animal.eyeL,[erx,ery]=animal.eyeR;
      setTransform(n.current.browL,[elx,ely-11],p.eyeLX,p.eyeLY+p.browY,p.browL);
      setTransform(n.current.browR,[erx,ery-11],p.eyeRX,p.eyeRY+p.browY,p.browR);
      setTransform(n.current.handL,animal.handL,p.handLX,p.handLY,p.handLRot);
      setTransform(n.current.handR,animal.handR,p.handRX,p.handRY,p.handRRot);
      const [mx,my]=animal.mouth;
      const w=p.mouthW*(talking?1+.16*speech:1);
      const open=clamp(p.mouthOpen+(talking?2.2+7.8*speech:0),.5,13);
      const smile=p.mouthSmile*(talking?.55:1);
      const top=my-smile*.22-open*.16;
      const bottom=my+open;
      n.current.mouth?.setAttribute("d",`M${mx-w} ${my} C${mx-w*.55} ${top} ${mx+w*.55} ${top} ${mx+w} ${my} C${mx+w*.58} ${bottom} ${mx-w*.58} ${bottom} ${mx-w} ${my}Z`);
      setTransform(n.current.mouth,[mx,my],0,0,p.mouthTilt+(talking?speech2*.8:0));
      n.current.tongue?.setAttribute("cy",my+open*.72);
      n.current.tongue?.setAttribute("rx",Math.max(2,w*.28));
      n.current.tongue?.setAttribute("ry",Math.max(.5,open*.17));
      n.current.tongue?.setAttribute("opacity",talking?clamp((open-3)/7,0,1):0);
      if(n.current.tail) setTransform(n.current.tail,[148,151],0,0,(listening?4*listenWave:0)+(talking?2*speech2:Math.sin(time*2.4)*2));
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw); return()=>cancelAnimationFrame(raf);
  },[animal]);
  const ref=k=>el=>n.current[k]=el;
  return <svg className="critter-svg v4" viewBox="0 0 200 200" role="img" aria-label={`${animal.name} ${emotion.name}`}>
    <g ref={ref("rig")}>
      {animal.tail&&<g ref={ref("tail")}><path d={animal.tail} fill={animal.fur}/>{animal.tailTip&&<path d={animal.tailTip} fill={animal.light}/>}</g>}
      <ellipse cx={animal.footL[0]} cy={animal.footL[1]} rx="12" ry="13" fill={animal.paw}/><ellipse cx={animal.footR[0]} cy={animal.footR[1]} rx="12" ry="13" fill={animal.paw}/>
      <g ref={ref("earL")}><path d={animal.earL} fill={animal.fur}/><path d={animal.innerL} fill={animal.inner}/></g>
      <g ref={ref("earR")}><path d={animal.earR} fill={animal.fur}/><path d={animal.innerR} fill={animal.inner}/></g>
      <path d={animal.body} fill={animal.fur}/>
      {animal.forehead&&<path d={animal.forehead} fill={animal.light} opacity=".33"/>}
      {animal.muzzle&&<path d={animal.muzzle} fill={animal.light}/>} 
      <path d={`M${animal.anchorL[0]-10} ${animal.anchorL[1]+5}Q${animal.anchorL[0]} ${animal.anchorL[1]-1} ${animal.anchorL[0]+10} ${animal.anchorL[1]+5}`} fill={animal.fur}/>
      <path d={`M${animal.anchorR[0]-10} ${animal.anchorR[1]+5}Q${animal.anchorR[0]} ${animal.anchorR[1]-1} ${animal.anchorR[0]+10} ${animal.anchorR[1]+5}`} fill={animal.fur}/>
      <g ref={ref("browL")}><path d={`M${animal.eyeL[0]-7} ${animal.eyeL[1]-11}Q${animal.eyeL[0]} ${animal.eyeL[1]-14} ${animal.eyeL[0]+7} ${animal.eyeL[1]-11}`} fill="none" stroke={animal.dark} strokeWidth="2.2" strokeLinecap="round" opacity=".62"/></g>
      <g ref={ref("browR")}><path d={`M${animal.eyeR[0]-7} ${animal.eyeR[1]-11}Q${animal.eyeR[0]} ${animal.eyeR[1]-14} ${animal.eyeR[0]+7} ${animal.eyeR[1]-11}`} fill="none" stroke={animal.dark} strokeWidth="2.2" strokeLinecap="round" opacity=".62"/></g>
      <g ref={ref("eyeL")}><ellipse cx={animal.eyeL[0]} cy={animal.eyeL[1]} rx="4" ry="4.4" fill={animal.dark}/><circle cx={animal.eyeL[0]-1.2} cy={animal.eyeL[1]-1.4} r=".9" fill="#fff" opacity=".72"/></g>
      <g ref={ref("eyeR")}><ellipse cx={animal.eyeR[0]} cy={animal.eyeR[1]} rx="4" ry="4.4" fill={animal.dark}/><circle cx={animal.eyeR[0]-1.2} cy={animal.eyeR[1]-1.4} r=".9" fill="#fff" opacity=".72"/></g>
      <ellipse cx={animal.nose[0]} cy={animal.nose[1]} rx={animal.key==="bear"?5.2:4.3} ry={animal.key==="bear"?4:3.3} fill={animal.dark}/>
      <g ref={ref("mouth")}><path ref={ref("mouth")} fill={animal.dark}/><ellipse ref={ref("tongue")} cx={animal.mouth[0]} cy={animal.mouth[1]+4} rx="3" ry="1.3" fill="#F18A95" opacity="0"/></g>
      <g ref={ref("handL")}><ellipse cx={animal.handL[0]} cy={animal.handL[1]} rx="11" ry="10.5" fill={animal.paw}/></g>
      <g ref={ref("handR")}><ellipse cx={animal.handR[0]} cy={animal.handR[1]} rx="11" ry="10.5" fill={animal.paw}/></g>
    </g>
  </svg>;
}

function App(){
  const [species,setSpecies]=useState("dog"),[emotion,setEmotion]=useState("neutral"),[mode,setMode]=useState("idle");
  const animal=useMemo(()=>SPECIES.find(x=>x.key===species),[species]);
  const emo=useMemo(()=>EMOTIONS.find(x=>x.key===emotion),[emotion]);
  return <main className="studio-shell v4-shell">
    <header className="studio-header"><div className="studio-title"><span className="wordmark">Mood Critters V4</span><p>unified live rig / anchored ears / true mouth opening</p></div><dl className="studio-stats"><div><dt>characters</dt><dd>5</dd></div><div><dt>expressions</dt><dd>16</dd></div><div><dt>engine</dt><dd>1</dd></div></dl></header>
    <section className="workspace">
      <div className="preview-column"><div className="preview-toolbar"><div><span>{animal.english}</span><strong>{emo.name}</strong><p>감정·호흡·듣기·립싱크가 하나의 리그에서 연속적으로 합성됩니다.</p></div><div className="mode-tabs">{MODES.map(m=><button key={m.key} aria-pressed={mode===m.key} onClick={()=>setMode(m.key)}><strong>{m.name}</strong><small>{m.english}</small></button>)}</div></div>
      <div className="canvas-frame"><Character key={animal.key} animal={animal} emotion={emo} mode={mode}/></div>
      <div className="species-tabs">{SPECIES.map(a=><button key={a.key} aria-pressed={species===a.key} onClick={()=>setSpecies(a.key)}><svg viewBox="0 0 200 200"><path d={a.earL} fill={a.fur}/><path d={a.earR} fill={a.fur}/><path d={a.body} fill={a.fur}/>{a.muzzle&&<path d={a.muzzle} fill={a.light}/>}<circle cx={a.eyeL[0]} cy={a.eyeL[1]} r="4" fill={a.dark}/><circle cx={a.eyeR[0]} cy={a.eyeR[1]} r="4" fill={a.dark}/></svg><span>{a.name}</span></button>)}</div></div>
      <aside className="expression-panel"><div className="panel-title"><div><h1>Expressions</h1><p>16개 감정을 실시간 숫자 리그로 보간</p></div></div><div className="expression-list">{EMOTIONS.map(e=><button key={e.key} aria-pressed={emotion===e.key} onClick={()=>setEmotion(e.key)}><span className="face-dot"><i/></span><span><strong>{e.name}</strong><small>{e.english}</small></span></button>)}</div><div className="motion-note"><span>V4 motion engine</span><p>귀 뿌리는 몸통 뒤에 숨기고, 입은 단일 폐곡선 path의 높이를 연속 변형합니다.</p></div></aside>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App/>);
