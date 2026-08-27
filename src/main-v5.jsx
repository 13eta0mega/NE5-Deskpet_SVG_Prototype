import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./v5.css";

const IDS = ["legL","legR","earL","earR","body","eyeL","eyeR","mouth","handL","handR"];
const COLORS = { body:"#8CC9B1", feet:"#6EAA94", paws:"#B5E0CE", face:"#1F2523" };

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

const P=(x,y)=>({x,y});
const add=(p,dx=0,dy=0)=>P(p.x+dx,p.y+dy);
const pathFrom=(pts)=>`M${pts[0].x} ${pts[0].y}C${pts[1].x} ${pts[1].y} ${pts[2].x} ${pts[2].y} ${pts[3].x} ${pts[3].y}C${pts[4].x} ${pts[4].y} ${pts[5].x} ${pts[5].y} ${pts[6].x} ${pts[6].y}C${pts[7].x} ${pts[7].y} ${pts[8].x} ${pts[8].y} ${pts[9].x} ${pts[9].y}C${pts[10].x} ${pts[10].y} ${pts[11].x} ${pts[11].y} ${pts[0].x} ${pts[0].y}Z`;

const BASE_BODY=[P(101,57),P(137,56),P(160,75),P(165,113),P(170,145),P(150,177),P(101,181),P(54,181),P(33,152),P(38,116),P(40,79),P(65,58)];
const BASE_EAR_L=[P(68,69),P(54,50),P(31,46),P(24,62),P(17,81),P(31,102),P(52,102),P(69,101),P(83,84),P(78,69),P(76,65),P(72,66)];
const BASE_EAR_R=[P(133,69),P(147,50),P(170,46),P(177,62),P(184,81),P(170,102),P(149,102),P(132,101),P(118,84),P(123,69),P(125,65),P(129,66)];

const EMOTIONS=[
  ["neutral","편안","neutral",{}],
  ["happy","기쁨","happy",{eyeSY:.58,mouthSmile:5,mouthW:13,bodyY:-2,handIn:3}],
  ["excited","신남","excited",{eyeSY:1.18,eyeSX:1.12,mouthOpen:5.5,mouthSmile:3,bodyY:-6,bodyTall:4,handY:-15,handOut:7,earOpen:5}],
  ["love","사랑","love",{eyeSY:.36,mouthSmile:4.5,bodyTilt:-2,handIn:22,handY:-8}],
  ["amused","웃음","amused",{eyeSY:.22,mouthSmile:6,mouthOpen:4.5,mouthW:15,bodyY:-2}],
  ["proud","뿌듯","proud",{eyeSY:.58,eyeY:-2,mouthSmile:3,mouthW:9,bodyY:-3,bodyTilt:2}],
  ["curious","궁금","curious",{eyeX:4,bodyTilt:5,bodyX:3,mouthW:7,mouthSmile:1,earAsym:6}],
  ["surprised","놀람","surprised",{eyeSY:1.35,eyeSX:1.22,eyeY:-2,mouthOpen:8.5,mouthW:6,bodyY:-4,bodyTall:3,earOpen:7}],
  ["confused","혼란","confused",{eyeLSY:.52,eyeRSY:1.05,bodyTilt:-4,mouthW:8,mouthTilt:7,earAsym:-5}],
  ["shy","수줍","shy",{eyeSY:.48,eyeX:-3,eyeY:2,mouthSmile:2,mouthW:6,bodyTilt:3,handIn:24,handY:-5}],
  ["sad","슬픔","sad",{eyeSY:.7,eyeY:2,mouthSmile:-4.5,mouthW:11,bodyY:4,bodyShort:3,earDrop:6}],
  ["worried","걱정","worried",{eyeSY:1.05,mouthSmile:-2.5,mouthW:8,bodyY:2,bodyTilt:-2,earDrop:4,handIn:6}],
  ["angry","화남","angry",{eyeSY:.32,eyeSX:1.18,mouthSmile:-4,mouthW:11,bodyY:3,bodyWide:4,bodyShort:4,handOut:9,earDrop:3}],
  ["annoyed","시큰둥","annoyed",{eyeLSY:.28,eyeRSY:.45,eyeX:3,mouthSmile:-1,mouthW:8,mouthTilt:5,bodyTilt:2}],
  ["sleepy","졸림","sleepy",{eyeSY:.15,eyeY:3,mouthW:7,mouthOpen:.2,bodyY:5,bodyTilt:-3,bodyShort:3}],
  ["crying","울음","crying",{eyeSY:.4,eyeY:2,mouthSmile:-5,mouthOpen:3.8,mouthW:11,bodyY:4,earDrop:6,handIn:15,handY:-19}],
].map(([key,name,english,mods])=>({key,name,english,mods}));

function makeState(mods={}){
  const m={eyeSY:1,eyeSX:1,eyeLSY:null,eyeRSY:null,eyeX:0,eyeY:0,mouthW:10,mouthOpen:0,mouthSmile:1.5,mouthTilt:0,bodyX:0,bodyY:0,bodyTilt:0,bodyTall:0,bodyShort:0,bodyWide:0,handIn:0,handOut:0,handY:0,earOpen:0,earDrop:0,earAsym:0,...mods};
  const body=BASE_BODY.map((p,i)=>{
    let dx=m.bodyX,dy=m.bodyY;
    if(i===1||i===2||i===10||i===11) dy-=m.bodyTall;
    if(i>=4&&i<=8) dy-=m.bodyShort;
    if(i===2||i===3||i===4) dx+=m.bodyWide;
    if(i===8||i===9||i===10) dx-=m.bodyWide;
    const rad=m.bodyTilt*Math.PI/180,cx=101,cy=181;
    const x=p.x+dx,y=p.y+dy;
    return P(cx+(x-cx)*Math.cos(rad)-(y-cy)*Math.sin(rad),cy+(x-cx)*Math.sin(rad)+(y-cy)*Math.cos(rad));
  });
  const earL=BASE_EAR_L.map((p,i)=>add(p,-m.earOpen-(i<6?m.earAsym*.25:0),m.earDrop+(i<7?Math.max(0,m.earDrop*.25):0)));
  const earR=BASE_EAR_R.map((p,i)=>add(p,m.earOpen-(i<6?m.earAsym*.25:0),m.earDrop+(i<7?Math.max(0,m.earDrop*.25):0)));
  const eyeLSY=m.eyeLSY??m.eyeSY, eyeRSY=m.eyeRSY??m.eyeSY;
  const mx=101,my=118;
  const x1=mx-m.mouthW,x2=mx+m.mouthW;
  const tilt=Math.tan(m.mouthTilt*Math.PI/180)*m.mouthW;
  const upper=my-m.mouthSmile;
  const lower=my+Math.max(0,m.mouthOpen);
  const mouth=`M${x1} ${my-tilt}C${mx-m.mouthW*.5} ${upper} ${mx-m.mouthW*.2} ${upper} ${mx} ${my}C${mx+m.mouthW*.2} ${upper} ${mx+m.mouthW*.5} ${upper} ${x2} ${my+tilt}C${mx+m.mouthW*.45} ${lower} ${mx-m.mouthW*.45} ${lower} ${x1} ${my-tilt}Z`;
  return {
    paths:{
      legL:{tag:"rect",x:78,y:164+m.bodyY,width:21,height:30,rx:10.5,fill:COLORS.feet},
      legR:{tag:"rect",x:104,y:165+m.bodyY,width:23,height:30,rx:11.5,fill:COLORS.feet},
      earL:{tag:"path",d:pathFrom(earL),fill:COLORS.body},
      earR:{tag:"path",d:pathFrom(earR),fill:COLORS.body},
      body:{tag:"path",d:pathFrom(body),fill:COLORS.body},
      eyeL:{tag:"ellipse",cx:72+m.eyeX,cy:109+m.eyeY,rx:3*m.eyeSX,ry:3*eyeLSY,fill:COLORS.face},
      eyeR:{tag:"ellipse",cx:128+m.eyeX,cy:109+m.eyeY,rx:3*m.eyeSX,ry:3*eyeRSY,fill:COLORS.face},
      mouth:{tag:"path",d:mouth,stroke:COLORS.face,strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round",fill:m.mouthOpen>0?COLORS.face:"none"},
      handL:{tag:"ellipse",cx:44+m.handIn-m.handOut,cy:145+m.handY,rx:11,ry:10.5,fill:COLORS.paws},
      handR:{tag:"ellipse",cx:157-m.handIn+m.handOut,cy:145+m.handY,rx:11,ry:10.5,fill:COLORS.paws},
    }
  };
}

const STATES=Object.fromEntries(EMOTIONS.map(e=>[e.key,makeState(e.mods)]));

function parseNumbers(str){return (String(str).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).map(Number)}
function interpolateString(a,b,t){
  const numsA=parseNumbers(a),numsB=parseNumbers(b); let i=0;
  if(numsA.length!==numsB.length) return b;
  return String(b).replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi,()=>String(lerp(numsA[i],numsB[i++],t).toFixed(3)));
}
function snapshot(el,def){
  if(def.tag==="path") return {d:el.getAttribute("d"),fill:el.getAttribute("fill")||def.fill};
  const keys=def.tag==="rect"?["x","y","width","height","rx"]:["cx","cy","rx","ry"];
  return Object.fromEntries(keys.map(k=>[k,Number(el.getAttribute(k))]));
}

function Critter({state,mode}){
  const refs=useRef({});
  const currentState=useRef(state);
  const modeRef=useRef(mode);
  const transition=useRef(null);
  const idleAmp=useRef(1);
  const root=useRef(null);
  useEffect(()=>{modeRef.current=mode},[mode]);

  useEffect(()=>{
    const from={};
    for(const id of IDS){const el=refs.current[id]; if(el) from[id]=snapshot(el,STATES[currentState.current].paths[id]);}
    const to=STATES[state].paths;
    transition.current={from,to,start:performance.now(),duration:760};
    currentState.current=state;
  },[state]);

  useEffect(()=>{
    let raf=0;
    const tick=(now)=>{
      const tr=transition.current;
      let morphing=false;
      if(tr){
        const raw=clamp((now-tr.start)/tr.duration,0,1),t=ease(raw); morphing=raw<1;
        for(const id of IDS){
          const el=refs.current[id],a=tr.from[id],b=tr.to[id]; if(!el||!a||!b) continue;
          if(b.tag==="path"){
            el.setAttribute("d",interpolateString(a.d,b.d,t));
            if(raw>=1) el.setAttribute("fill",b.fill??"none");
          }else{
            const keys=b.tag==="rect"?["x","y","width","height","rx"]:["cx","cy","rx","ry"];
            keys.forEach(k=>el.setAttribute(k,String(lerp(a[k],Number(b[k]),t))));
          }
        }
        const targetAmp=morphing?.1:1;
        idleAmp.current=lerp(idleAmp.current,targetAmp,.08);
        if(!morphing){transition.current=null;idleAmp.current=lerp(idleAmp.current,1,.08)}
      }else idleAmp.current=lerp(idleAmp.current,1,.04);

      const sec=now/1000,amp=idleAmp.current;
      const listening=modeRef.current==="listening", talking=modeRef.current==="talking";
      const breathe=.012*amp*(.5+.5*Math.sin(sec*Math.PI));
      const sway=(listening?1.6*Math.sin(sec*3.1):.7*Math.sin(sec*2.1))*amp;
      const bob=(talking?.7*Math.sin(sec*8.2):0)*amp;
      if(root.current){root.current.style.transformOrigin="100px 195px";root.current.style.transform=`translateY(${bob}px) rotate(${sway}deg) scale(${1+breathe})`;}
      const earPulse=listening?Math.sin(sec*6.2):0;
      if(refs.current.earL) refs.current.earL.style.transform=`rotate(${(-4*earPulse-1.5*Math.sin(sec*3.1))*amp}deg)`;
      if(refs.current.earR) refs.current.earR.style.transform=`rotate(${(5*earPulse+1.2*Math.sin(sec*3.1))*amp}deg)`;
      if(refs.current.earL){refs.current.earL.style.transformOrigin="70px 82px";refs.current.earR.style.transformOrigin="132px 82px";}
      const speech=talking?clamp(.5+.35*Math.sin(sec*17)+.15*Math.sin(sec*29),0,1):0;
      const mouth=refs.current.mouth;
      if(mouth&&talking&&!transition.current){
        const cx=101,my=118,w=8+speech*5,open=1.5+speech*8;
        mouth.setAttribute("d",`M${cx-w} ${my}C${cx-w*.5} ${my-1} ${cx-w*.2} ${my-1} ${cx} ${my}C${cx+w*.2} ${my-1} ${cx+w*.5} ${my-1} ${cx+w} ${my}C${cx+w*.45} ${my+open} ${cx-w*.45} ${my+open} ${cx-w} ${my}Z`);
        mouth.setAttribute("fill",COLORS.face);
      } else if(mouth&&!transition.current){
        const stable=STATES[currentState.current].paths.mouth;
        mouth.setAttribute("d",stable.d);
        mouth.setAttribute("fill",stable.fill);
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
  },[]);

  const first=STATES.neutral.paths;
  const r=id=>el=>{refs.current[id]=el};
  return <svg className="mori-svg" viewBox="0 0 200 200" role="img" aria-label="Mori critter">
    <g ref={root} className="mori-rig">
      <rect ref={r("legL")} x={first.legL.x} y={first.legL.y} width={first.legL.width} height={first.legL.height} rx={first.legL.rx} fill={first.legL.fill}/>
      <rect ref={r("legR")} x={first.legR.x} y={first.legR.y} width={first.legR.width} height={first.legR.height} rx={first.legR.rx} fill={first.legR.fill}/>
      <path ref={r("earL")} d={first.earL.d} fill={first.earL.fill}/><path ref={r("earR")} d={first.earR.d} fill={first.earR.fill}/>
      <path ref={r("body")} d={first.body.d} fill={first.body.fill}/>
      <ellipse ref={r("eyeL")} cx={first.eyeL.cx} cy={first.eyeL.cy} rx={first.eyeL.rx} ry={first.eyeL.ry} fill={first.eyeL.fill}/>
      <ellipse ref={r("eyeR")} cx={first.eyeR.cx} cy={first.eyeR.cy} rx={first.eyeR.rx} ry={first.eyeR.ry} fill={first.eyeR.fill}/>
      <path ref={r("mouth")} d={first.mouth.d} stroke={first.mouth.stroke} strokeWidth={first.mouth.strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={first.mouth.fill}/>
      <ellipse ref={r("handL")} cx={first.handL.cx} cy={first.handL.cy} rx={first.handL.rx} ry={first.handL.ry} fill={first.handL.fill}/>
      <ellipse ref={r("handR")} cx={first.handR.cx} cy={first.handR.cy} rx={first.handR.rx} ry={first.handR.ry} fill={first.handR.fill}/>
    </g>
  </svg>
}

const MODES=[["idle","평상시"],["listening","듣기"],["talking","말하기"]];
function App(){
  const [emotion,setEmotion]=useState("neutral");
  const [mode,setMode]=useState("idle");
  const meta=useMemo(()=>EMOTIONS.find(e=>e.key===emotion),[emotion]);
  return <main className="v5-page">
    <header className="v5-header"><div><span className="eyebrow">MOOD CRITTERS / V5</span><h1>Mori</h1><p>molauu Critters의 단순한 SVG 문법을 바탕으로 새로 그린 오리지널 캐릭터</p></div><div className="engine-badge"><strong>10</strong><span>shared parts</span></div></header>
    <section className="v5-layout">
      <div className="preview-card">
        <div className="preview-top"><div><small>current emotion</small><strong>{meta.name}</strong><span>{meta.english}</span></div><div className="mode-row">{MODES.map(([k,n])=><button key={k} aria-pressed={mode===k} onClick={()=>setMode(k)}>{n}</button>)}</div></div>
        <div className="stage"><Critter state={emotion} mode={mode}/></div>
        <div className="design-note">flat fill · tiny eyes · round-capped mouth · shared topology · no crossfade</div>
      </div>
      <aside className="emotion-panel"><div><h2>16 Expressions</h2><p>모든 감정이 동일한 10개 SVG 파츠에서 연속 보간됩니다.</p></div><div className="emotion-grid">{EMOTIONS.map(e=><button key={e.key} aria-pressed={emotion===e.key} onClick={()=>setEmotion(e.key)}><span className="mini-face"><i/><i/></span><span><strong>{e.name}</strong><small>{e.english}</small></span></button>)}</div></aside>
    </section>
  </main>
}

createRoot(document.getElementById("root")).render(<App/>);
