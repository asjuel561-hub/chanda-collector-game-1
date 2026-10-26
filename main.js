import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#game');
const $ = (id) => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fc4d0);
scene.fog = new THREE.Fog(0x9fc4d0, 28, 95);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 180);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

scene.add(new THREE.HemisphereLight(0xe4f5ff, 0x64523b, 2.0));
const sun = new THREE.DirectionalLight(0xffe3ad, 3.0);
sun.position.set(-14, 25, 10); sun.castShadow = true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-32; sun.shadow.camera.right=32; sun.shadow.camera.top=32; sun.shadow.camera.bottom=-32;
scene.add(sun);

const mat = (color, roughness=.9, extra={}) => new THREE.MeshStandardMaterial({color,roughness,...extra});
const mats = {
 road:mat(0x827d6f), concrete:mat(0xb9b09a), wall:mat(0xd5b58a), wall2:mat(0xc8d2b8),
 roof:mat(0x6c7772), metal:mat(0x64716f,.5), wood:mat(0x8a5934), red:mat(0xb8422f),
 green:mat(0x247c4a), yellow:mat(0xe7bd4f), blue:mat(0x397fb1), white:mat(0xece8d9),
 dark:mat(0x28342f), skin:mat(0xb77e59), fruit:mat(0x9e352a), leaf:mat(0x3e7c3f),
 sign:mat(0x174b39), glass:mat(0x78a9ad,.25,{metalness:.15})
};
const boxGeo = new THREE.BoxGeometry(1,1,1);
const cylGeo = new THREE.CylinderGeometry(.5,.5,1,10);
const sphereGeo = new THREE.SphereGeometry(.5,12,9);
function mesh(geo, material, parent, x,y,z,sx=1,sy=1,sz=1) {
  const o = new THREE.Mesh(geo, material); o.position.set(x,y,z); o.scale.set(sx,sy,sz); o.castShadow=true; o.receiveShadow=true; parent.add(o); return o;
}
function box(parent,x,y,z,sx,sy,sz,material){return mesh(boxGeo,material,parent,x,y,z,sx,sy,sz)}
function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g}

// Ground and market road
box(scene,0,-.45,0,100,1,100,mat(0x7c8b62));
box(scene,0,-.04,0,10,.12,100,mats.road);
for(let z=-46;z<48;z+=7) box(scene,0,.03,z,.12,.015,3.2,mat(0xd7cba6));
for(let side of [-1,1]){
  box(scene,side*7,-.03,0,3,.18,100,mats.concrete);
  for(let z=-44;z<47;z+=8){
    const width=4.6+Math.random()*1.2, depth=5.2+Math.random()*2;
    const building=group(scene,side*(10+Math.random()*1.3),0,z);
    const wallmat=[mats.wall,mats.wall2,mat(0xe0c29a),mat(0xb8c5b3)][Math.floor(Math.random()*4)];
    box(building,0,2.3,0,width,4.6,depth,wallmat);
    box(building,0,4.75,0,width+.25,.25,depth+.25,mats.roof);
    // shop awning, fascia and opening
    box(building,-side*.25,2.45,side*(depth/2+.08),width*.92,.48,.22,[mats.red,mats.green,mats.yellow,mats.blue][Math.floor(Math.random()*4)]);
    box(building,0,1.15,side*(depth/2+.04),width*.67,1.65,.1,mats.dark);
    box(building,0,1.1,side*(depth/2+.11),width*.58,1.35,.05,mats.glass);
    box(building,0,2.0,side*(depth/2+.16),width*.78,.1,.06,mats.wood);
    // shop sign
    box(building,0,3.15,side*(depth/2+.2),width*.85,.48,.12,mats.sign);
    // roof clutter
    if(Math.random()>.45) box(building,side*.3,5.1,0,.8,.45,.8,mat(0x887c65));
  }
}
// distant skyline
for(let i=0;i<18;i++){
 const x=(Math.random()-.5)*75, z=-48-Math.random()*18, h=5+Math.random()*13;
 box(scene,x,h/2,z,3+Math.random()*4,h,3,mat([0xc2b9a3,0xb7c5bd,0xd3b79a][i%3]));
}
// Shop counters, produce baskets, crates
for(let side of [-1,1]){
 for(let z=-42;z<45;z+=5.6){
   const x=side*5.55;
   box(scene,x,.55,z,1.45,1.05,2.0,mats.wood);
   box(scene,x,1.12,z,1.55,.13,2.1,mat(0xb88b52));
   // produce mounds
   for(let j=0;j<15;j++){
     const fruitMat=[mats.fruit,mats.green,mats.yellow,mat(0xd58d34)][j%4];
     const fx=x+(Math.random()-.5)*1.15, fz=z+(Math.random()-.5)*1.55;
     mesh(sphereGeo,fruitMat,scene,fx,1.28+Math.random()*.12,fz,.18,.16,.18);
   }
   if(Math.random()>.4){
     const aw=group(scene,x,0,z+1.15);
     box(aw,0,2.5,0,2.3,.12,.12,mats.metal);
     box(aw,0,2.48,0,2.2,.09,1.5,[mats.red,mats.green,mats.yellow][Math.floor(Math.random()*3)]);
   }
 }
}
// puddles, crates and traffic obstacles
for(let i=0;i<20;i++){
 const z=-40+Math.random()*80, side=Math.random()>.5?1:-1;
 if(Math.random()>.5) box(scene,side*(3.7+Math.random()*.6),.18,z,.65,.4,.7,mats.wood);
 else {
   const puddle=mesh(new THREE.CircleGeometry(.55+Math.random()*.6,16),mat(0x6e9a9b,.25,{transparent:true,opacity:.55}),scene,side*3.9,.04,z,1,.02,1);
   puddle.rotation.x=-Math.PI/2;
 }
}

// Handmade character rigs
function makeCharacter({shirt=mats.blue,pants=mats.dark,headband=false,player=false,skin=mats.skin}={}){
 const root=group(scene,0,0,0);
 const rig=group(root,0,0,0);
 const torso=mesh(boxGeo,shirt,rig,0,1.22,0,.62,.8,.34);
 const neck=mesh(cylGeo,skin,rig,0,1.68,0,.18,.18,.18);
 const head=mesh(sphereGeo,skin,rig,0,1.92,0,.34,.4,.32);
 // ears, nose, eyes and mouth
 mesh(sphereGeo,skin,rig,-.34,1.94,0,.1,.13,.1); mesh(sphereGeo,skin,rig,.34,1.94,0,.1,.13,.1);
 mesh(sphereGeo,skin,rig,0,1.88,.3,.09,.08,.1);
 const eyeMat=mat(0x211d18);
 mesh(sphereGeo,eyeMat,rig,-.12,2.03,.27,.045,.05,.025); mesh(sphereGeo,eyeMat,rig,.12,2.03,.27,.045,.05,.025);
 box(rig,0,1.77,.285,.16,.035,.025,mat(0x4a211b));
 // limbs pivot at shoulder/hip
 const arms=[],legs=[];
 for(const s of [-1,1]){
   const arm=group(rig,s*.39,1.48,0);
   mesh(cylGeo,shirt,arm,0,-.27,0,.14,.62,.14); mesh(sphereGeo,skin,arm,0,-.59,.02,.12,.13,.12);
   arms.push(arm);
   const leg=group(rig,s*.18,.82,0);
   mesh(cylGeo,pants,leg,0,-.34,0,.19,.72,.2);
   mesh(boxGeo,mat(0x34251c),leg,0,-.72,.09,.22,.13,.38);
   legs.push(leg);
 }
 if(headband){
   const band=mesh(boxGeo,mat(0xb6312a),rig,0,2.12,0,.69,.11,.37);
   box(rig,0,2.12,.195,.13,.11,.025,mat(0x267d48));
   // headband tail
   box(rig,-.36,2.05,-.12,.28,.07,.09,mat(0x267d48)).rotation.z=-.4;
 }
 if(player){
   // slogan shirt decal as a readable floating game label
   const label=makeLabel('১৭ বছর ধরে খাই নাই\\nসালা চাঁদা দে',0x17372b);
   label.position.set(0,1.28,.181); label.scale.set(.45,.24,1); rig.add(label);
 }
 return {root,rig,torso,head,arms,legs,headband,player,phase:Math.random()*5};
}
function makeLabel(text,bg=0x17372b){
 const c=document.createElement('canvas'); c.width=512;c.height=180;
 const ctx=c.getContext('2d');ctx.fillStyle='#'+bg.toString(16).padStart(6,'0');ctx.fillRect(0,0,c.width,c.height);
 ctx.fillStyle='#fff8df';ctx.font='bold 40px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 text.split('\\n').forEach((line,i)=>ctx.fillText(line,c.width/2,55+i*58));
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const m=new THREE.MeshBasicMaterial({map:tex,transparent:false,side:THREE.DoubleSide});
 return new THREE.Mesh(new THREE.PlaneGeometry(1,1),m);
}
// Player
const player=makeCharacter({shirt:mat(0xe4dfc7),pants:mat(0x4b4037),headband:true,player:true});
player.root.position.set(0,0,28);
// Headband green accent on all characters, colorful gang
const gang=[];
const shirtColors=[0xd8b747,0x397fb1,0x39834f,0x9a4b8e,0xe6e0d0];
for(let i=0;i<4;i++){
 const ch=makeCharacter({shirt:mat(shirtColors[i]),pants:mat(0x493a31),headband:true});
 ch.root.position.set((i%2?1:-1)*(.9+Math.random()),0,29+Math.floor(i/2)*1.2);
 gang.push(ch);
}
// NPC crowd with simple procedural pathing
const crowd=[];
for(let i=0;i<13;i++){
 const ch=makeCharacter({shirt:mat([0x5a8c69,0xb67c45,0x7c9cba,0xb4a7a0,0x805c4b][i%5]),pants:mat(0x393a32)});
 ch.root.position.set((Math.random()-.5)*8,0,-35+Math.random()*67);
 ch.root.rotation.y=Math.random()*Math.PI*2;
 crowd.push({ch,home:ch.root.position.clone(),phase:Math.random()*10,active:false});
}
// One shopkeeper NPCs are not aggressive until anger triggers
const pursuers=crowd.slice(0,8);
function addRickshaw(x,z){
 const g=group(scene,x,0,z);
 box(g,0,.75,0,1.35,.25,2.2,mat(0x26794d));
 box(g,0,1.15,-.35,1.1,.65,.8,mat(0xd3a84c));
 box(g,0,1.62,-.35,1.2,.08,.9,mat(0x2e4e3c));
 for(const wx of [-.48,.48])mesh(cylGeo,mat(0x282a28),g,wx,.34,.62,.48,.12,.48).rotation.z=Math.PI/2;
 box(g,0,1.2,1.1,.12,.12,.95,mat(0x55422d));
 for(let i=0;i<5;i++)box(g,(i-2)*.22,1.85,-.5,.18,.05,.08,mat(0xd6c2a0));
 return g;
}
addRickshaw(-3.1,10);addRickshaw(3.1,-15);addRickshaw(-3.1,-30);

// Bengali shop signs
function signText(text,x,z,color='#f5d66f'){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
 ctx.fillStyle='#164936';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#edce67';ctx.lineWidth=7;ctx.strokeRect(4,4,504,120);
 ctx.fillStyle=color;ctx.font='bold 54px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,65);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
 m.position.set(x,3.25,z);m.rotation.y=x<0?Math.PI/2:-Math.PI/2;scene.add(m);
}
signText('সবজি বাজার',-7.9,-7);signText('চায়ের দোকান',7.9,14);signText('মাছের আড়ত',-7.9,28);

// Ambient dust motes
const dustGeo=new THREE.BufferGeometry(), dustCount=220, dustPos=new Float32Array(dustCount*3);
for(let i=0;i<dustCount;i++){dustPos[i*3]=(Math.random()-.5)*24;dustPos[i*3+1]=Math.random()*8;dustPos[i*3+2]=(Math.random()-.5)*85;}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffe7b5,size:.045,transparent:true,opacity:.42}));scene.add(dust);

// Game state
const state={running:false,ended:false,time:90,anger:25,score:0,chase:false,toastTime:0,subtitleTime:0,nearShop:false,collectCooldown:0,escapeZ:-43};
const keys={};
let soundOn=true,audioCtx=null,ambientTimer=null,voiceTimer=0;
let cameraYaw=0, cameraPitch=.22, pointerDown=false, lastX=0,lastY=0;
let jumpVelocity=0, grounded=true, sprintEnergy=1, elapsed=0;
const targetCam=new THREE.Vector3();
const cameraOffset=new THREE.Vector3();
const clock=new THREE.Clock();

function showToast(text,seconds=2.4){$('toast').textContent=text;$('toast').classList.add('show');state.toastTime=seconds;}
function subtitle(text,seconds=2.6){$('subtitle').textContent=text;$('subtitle').classList.add('show');state.subtitleTime=seconds;}
function bn(n){return Math.round(n).toLocaleString('bn-BD');}
function updateUI(){
 $('timer').textContent=`${String(Math.floor(state.time/60)).padStart(2,'0')}:${String(Math.max(0,Math.floor(state.time%60))).padStart(2,'0')}`;
 $('score').textContent=bn(state.score);$('angerText').textContent=`${Math.round(state.anger)}%`;
 $('angerBar').style.width=`${state.anger}%`;
 $('angerBar').style.background=state.anger>75?'linear-gradient(90deg,#e99b39,#ed3f36)':'linear-gradient(90deg,#d8b649,#e94f3c)';
}
function ensureAudio(){
 if(audioCtx)return;
 const AC=window.AudioContext||window.webkitAudioContext;
 if(!AC)return;
 audioCtx=new AC();
 // gentle market ambience: low wind-like filtered noise and occasional bird/chime notes
 const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.11;
 const noise=audioCtx.createBufferSource();noise.buffer=buffer;noise.loop=true;
 const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=420;
 const gain=audioCtx.createGain();gain.gain.value=.16;
 noise.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);noise.start();
 ambientTimer=setInterval(()=>{if(soundOn&&audioCtx&&Math.random()>.45)tone([740,880,660,990][Math.floor(Math.random()*4)],.12,.018);},1800);
}
function tone(freq,duration=.16,volume=.05,type='sine'){
 if(!audioCtx||!soundOn)return;
 const osc=audioCtx.createOscillator(),g=audioCtx.createGain();
 osc.type=type;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);
 g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
 osc.connect(g);g.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration);
}
function speak(text){
 if(!soundOn||!('speechSynthesis'in window))return;
 try{
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='bn-BD';u.rate=.92;u.pitch=.86;u.volume=.95;
  const voices=speechSynthesis.getVoices();const v=voices.find(v=>v.lang.toLowerCase().startsWith('bn'));
  if(v)u.voice=v;speechSynthesis.speak(u);
 }catch(e){console.info('Speech synthesis unavailable',e)}
}
function slogan(){
 const lines=['কারেন্ট ছাড়া খাম্বা নেতা আমার আব্বা!','১৭ বছর ধরে খাই নাই, সালা চাঁদা দে!'];
 const line=lines[Math.floor(Math.random()*lines.length)];
 subtitle(line,3.2);speak(line);tone(220,.22,.07,'sawtooth');tone(180,.22,.04,'square');
}
function startGame(){
 ensureAudio();if(audioCtx?.state==='suspended')audioCtx.resume();
 state.running=true;state.ended=false;state.time=90;state.anger=25;state.score=0;state.chase=false;state.collectCooldown=0;
 player.root.position.set(0,0,28);player.rig.position.y=0;cameraYaw=0;cameraPitch=.22;jumpVelocity=0;grounded=true;sprintEnergy=1;
 gang.forEach((g,i)=>{g.root.position.set((i%2?1:-1)*(.9+Math.random()),0,29+Math.floor(i/2)*1.2);});
 crowd.forEach((n,i)=>{n.ch.root.position.copy(n.home);n.active=false;n.ch.root.visible=true;});
 $('startOverlay').classList.add('hidden');$('endOverlay').classList.add('hidden');
 showToast('মিশন শুরু! বাজারে সতর্ক থাকো।');subtitle('বাজারে স্বাগতম!',2.4);updateUI();
}
function endGame(win=false){
 if(state.ended)return;
 state.ended=true;state.running=false;
 $('endOverlay').classList.remove('hidden');
 $('endEyebrow').textContent=win?'মিশন সম্পন্ন':'মিশন শেষ';
 $('endTitle').textContent=win?'পালাতে পেরেছ!':'গেম ওভার!';
 $('endText').textContent=win?'বাজারের শেষ গলি পেরিয়ে নিরাপদে পৌঁছেছ। তবে চাঁদাবাজি কখনোই সমাধান নয়!':'বাজার কমিটি হিসাব চাইছে! চরিত্রটি সবজির ঝুড়িতে জড়িয়ে পড়ে—হাস্যকর Game Over!';
 $('finalScore').textContent=bn(state.score);
 if(!win){subtitle('ধরো ধরো! — হিসাব মেলেনি!',2.5);tone(110,.45,.1,'sawtooth');tone(82,.55,.08,'square');}
 else {tone(523,.18,.06);tone(659,.22,.06);tone(784,.3,.06);}
}
function triggerChase(){
 if(state.chase)return;
 state.chase=true;state.anger=Math.max(state.anger,68);
 showToast('জনগণের ক্ষোভ বেড়েছে — ধাওয়া শুরু!');slogan();
 crowd.forEach(n=>n.active=true);
}
function interact(){
 if(!state.running)return;
 if(state.collectCooldown>0)return;
 state.collectCooldown=1.2;
 state.anger=Math.min(100,state.anger+10);
 showToast('দোকানদার প্রতিবাদ করছেন! ক্ষোভ বেড়েছে।');
 subtitle('“আগের হিসাব আগে দাও!”',2.2);speak('আগের হিসাব আগে দাও!');
 tone(280,.12,.05,'triangle');
 state.score=Math.max(0,state.score-5);
 if(state.anger>=55)triggerChase();
}
function distanceXZ(a,b){const dx=a.x-b.x,dz=a.z-b.z;return Math.hypot(dx,dz);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

function animateCharacter(ch,moveAmount,t,run=false){
 ch.phase+=.09+moveAmount*.07;
 const swing=Math.sin(t*9+ch.phase)*(run?.65:.28)*Math.min(1,moveAmount*2.2);
 ch.legs[0].rotation.x=swing;ch.legs[1].rotation.x=-swing;
 ch.arms[0].rotation.x=-swing*.8;ch.arms[1].rotation.x=swing*.8;
 ch.rig.position.y=grounded&&moveAmount>.1?Math.abs(Math.sin(t*18))*.035:0;
}
function updatePlayer(dt){
 const forward=new THREE.Vector3(-Math.sin(cameraYaw),0,-Math.cos(cameraYaw));
 const right=new THREE.Vector3(Math.cos(cameraYaw),0,-Math.sin(cameraYaw));
 const move=new THREE.Vector3();
 if(keys.KeyW||keys.ArrowUp)move.add(forward);
 if(keys.KeyS||keys.ArrowDown)move.sub(forward);
 if(keys.KeyD||keys.ArrowRight)move.add(right);
 if(keys.KeyA||keys.ArrowLeft)move.sub(right);
 // mobile joystick
 move.x+=touchMove.x*right.x+touchMove.y*forward.x;
 move.z+=touchMove.x*right.z+touchMove.y*forward.z;
 const moving=move.lengthSq()>.02;
 if(moving)move.normalize();
 const sprint=(keys.ShiftLeft||keys.ShiftRight||touchRun)&&sprintEnergy>.03&&moving;
 let speed=sprint?8.0:4.5;
 if(sprint)sprintEnergy=Math.max(0,sprintEnergy-dt*.28);else sprintEnergy=Math.min(1,sprintEnergy+dt*.13);
 player.root.position.addScaledVector(move,speed*dt);
 player.root.position.x=clamp(player.root.position.x,-4.05,4.05);
 player.root.position.z=clamp(player.root.position.z,-47,35);
 if(moving)player.root.rotation.y=Math.atan2(move.x,move.z);
 if((keys.Space||keys.KeyJ)&&grounded){jumpVelocity=6.3;grounded=false;keys.Space=false;keys.KeyJ=false;tone(360,.1,.035);}
 if(!grounded){player.root.position.y+=jumpVelocity*dt;jumpVelocity-=16*dt;if(player.root.position.y<=0){player.root.position.y=0;jumpVelocity=0;grounded=true;}}
 animateCharacter(player,moving?speed/4.5:0,elapsed,sprint);
 // Escape condition
 if(state.chase&&player.root.position.z<-43)endGame(true);
 // encounter obstacles
 for(const obj of scene.children){
  if(obj.userData?.obstacle){
   if(distanceXZ(player.root.position,obj.position)<.7&&player.root.position.y<.45){
    state.anger=Math.min(100,state.anger+dt*9);
   }
  }
 }
}
const touchMove={x:0,y:0};let touchRun=false;
function updateCrowd(dt){
 for(let i=0;i<crowd.length;i++){
  const n=crowd[i],r=n.ch.root;
  if(n.active&&state.chase){
   const dx=player.root.position.x-r.position.x,dz=player.root.position.z-r.position.z;
   const dist=Math.hypot(dx,dz);
   if(dist>1.35){r.position.x+=dx/(dist||1)*dt*(2.65+(i%3)*.16);r.position.z+=dz/(dist||1)*dt*(2.65+(i%3)*.16);r.rotation.y=Math.atan2(dx,dz);}
   else if(state.running){endGame(false);}
   animateCharacter(n.ch,1,elapsed,true);
  }else{
   r.position.x=n.home.x+Math.sin(elapsed*.5+n.phase)*.45;
   r.position.z=n.home.z+Math.cos(elapsed*.4+n.phase)*.35;
   animateCharacter(n.ch,.2,elapsed,false);
  }
 }
 for(let i=0;i<gang.length;i++){
  const g=gang[i];g.root.position.x=Math.sin(elapsed*1.2+i)*.5+(i%2?1:-1)*.75;
  g.root.position.z=player.root.position.z+1.5+Math.floor(i/2)*.8;
  g.root.position.x=clamp(g.root.position.x,-4,4);
  g.root.rotation.y=player.root.rotation.y;
  animateCharacter(g,.8,elapsed,true);
 }
}
function updateCamera(dt){
 const p=player.root.position;
 const target=new THREE.Vector3(p.x,p.y+1.25,p.z);
 const distance=6.6;
 const desired=new THREE.Vector3(
  p.x+Math.sin(cameraYaw)*distance,
  p.y+2.6+cameraPitch*3.2,
  p.z+Math.cos(cameraYaw)*distance
 );
 camera.position.lerp(desired,1-Math.exp(-dt*5));
 camera.lookAt(target);
}
function loop(){
 requestAnimationFrame(loop);
 const dt=Math.min(clock.getDelta(),.04);elapsed+=dt;
 if(state.running){
  state.time=Math.max(0,state.time-dt);
  state.collectCooldown=Math.max(0,state.collectCooldown-dt);
  if(!state.chase)state.anger=Math.min(100,state.anger+dt*.55);
  if(state.anger>=65)triggerChase();
  if(state.time<=0&&!state.chase)triggerChase();
  if(state.time<=0&&state.chase&&player.root.position.z>-43)state.anger=Math.min(100,state.anger+dt*1.2);
  updatePlayer(dt);updateCrowd(dt);updateCamera(dt);
  if(state.toastTime>0){state.toastTime-=dt;if(state.toastTime<=0)$('toast').classList.remove('show');}
  if(state.subtitleTime>0){state.subtitleTime-=dt;if(state.subtitleTime<=0)$('subtitle').classList.remove('show');}
  if(state.chase&&Math.random()<dt*.13)slogan();
  updateUI();
 }else{
  updateCrowd(dt*.25);updateCamera(dt);
 }
 dust.rotation.y+=dt*.006;
 renderer.render(scene,camera);
}
loop();

// Controls
addEventListener('keydown',e=>{
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 keys[e.code]=true;
 if(e.code==='KeyE'&&!e.repeat)interact();
 if(e.code==='Escape'&&state.running){state.running=false;showToast('বিরতি — আবার শুরু করতে Resume চাপুন।');}
});
addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){pointerDown=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);}});
addEventListener('pointerup',()=>pointerDown=false);
addEventListener('pointermove',e=>{
 if(pointerDown&&state.running){cameraYaw-=(e.clientX-lastX)*.004;cameraPitch=clamp(cameraPitch+(e.clientY-lastY)*.003,-.2,.75);lastX=e.clientX;lastY=e.clientY;}
});
canvas.addEventListener('click',()=>{if(state.running&&document.pointerLockElement!==canvas&&innerWidth>700){canvas.requestPointerLock?.();}});
document.addEventListener('pointerlockchange',()=>{});
$('startBtn').addEventListener('click',startGame);
$('restartBtn').addEventListener('click',startGame);
$('soundBtn').addEventListener('click',()=>{
 soundOn=!soundOn;$('soundBtn').textContent=soundOn?'🔊 শব্দ চালু':'🔇 শব্দ বন্ধ';
 if(!soundOn&&'speechSynthesis'in window)speechSynthesis.cancel();
 if(soundOn)ensureAudio();
});
$('jumpBtn').addEventListener('pointerdown',e=>{e.preventDefault();keys.Space=true;});
$('runBtn').addEventListener('pointerdown',e=>{e.preventDefault();touchRun=true;});
$('runBtn').addEventListener('pointerup',()=>touchRun=false);$('runBtn').addEventListener('pointerleave',()=>touchRun=false);
$('jumpBtn').addEventListener('pointerup',()=>keys.Space=false);
const joy=$('joystick'),stick=$('stick');let joyId=null,joyRect=null;
joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joyRect=joy.getBoundingClientRect();joy.setPointerCapture(e.pointerId);moveJoy(e);});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)moveJoy(e);});
function moveJoy(e){const cx=joyRect.left+joyRect.width/2,cy=joyRect.top+joyRect.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=33,d=Math.hypot(dx,dy);if(d>max){dx=dx/d*max;dy=dy/d*max;}stick.style.transform=`translate(${dx}px,${dy}px)`;touchMove.x=dx/max;touchMove.y=dy/max;}
function resetJoy(){joyId=null;touchMove.x=0;touchMove.y=0;stick.style.transform='translate(0,0)';}
joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);joy.addEventListener('lostpointercapture',resetJoy);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
updateUI();
