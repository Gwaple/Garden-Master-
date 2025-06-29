// ... keep your existing code above ...

// --- ADVANCED CANVAS ANIMATED BACKGROUNDS FOR SEASONS & EVENTS ---
let bgCanvas, bgCtx, bgActive="", bgAnimFrame=0, bgThings=[], bgImgCache={};

function startSpring() {
  endAllBG();
  initBGCanvas();
  bgActive = "spring";
  bgThings = [];
  for(let i=0;i<40;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:36+Math.random()*26,v:0.7+Math.random(),a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.03});
  if (!bgImgCache.petals) {
    let img = new Image(); img.src = "https://pngimg.com/d/petals_PNG16.png";
    bgImgCache.petals = img;
  }
  drawSpring();
}
function drawSpring() {
  if(bgActive!=="spring") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let p of bgThings) {
    bgCtx.save();
    bgCtx.globalAlpha=0.21;
    bgCtx.translate(p.x,p.y);
    bgCtx.rotate(p.a);
    bgCtx.drawImage(bgImgCache.petals, -p.s/2,-p.s/2,p.s,p.s);
    bgCtx.restore();
    p.y += p.v; p.a += p.va;
    if(p.y > window.innerHeight+40) { p.y=-30; p.x=Math.random()*window.innerWidth; }
    if(p.x < -40) p.x = window.innerWidth+40;
    if(p.x > window.innerWidth+40) p.x = -40;
  }
  bgAnimFrame=requestAnimationFrame(drawSpring);
}
function startSummer() {
  endAllBG();
  initBGCanvas();
  bgActive = "summer";
  bgThings = [];
  for(let i=0;i<18;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:34+Math.random()*16,vx:(Math.random()-0.5)*1.2,vy:(0.3+Math.random()*0.5),a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.07});
  if (!bgImgCache.butterfly) {
    let img = new Image(); img.src = "https://openmoji.org/data/color/svg/1F98B.svg";
    bgImgCache.butterfly = img;
  }
  drawSummer();
}
function drawSummer() {
  if(bgActive!=="summer") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let b of bgThings) {
    bgCtx.save();
    bgCtx.globalAlpha=0.25;
    bgCtx.translate(b.x,b.y);
    bgCtx.rotate(b.a);
    bgCtx.drawImage(bgImgCache.butterfly, -b.s/2,-b.s/2,b.s,b.s);
    bgCtx.restore();
    b.x += b.vx; b.y += b.vy; b.a += b.va;
    if(b.y > window.innerHeight+40) { b.y=-30; b.x=Math.random()*window.innerWidth; }
    if(b.x < -40) b.x = window.innerWidth+40;
    if(b.x > window.innerWidth+40) b.x = -40;
  }
  bgAnimFrame=requestAnimationFrame(drawSummer);
}
function startAutumn() {
  endAllBG();
  initBGCanvas();
  bgActive = "autumn";
  bgThings = [];
  if (!bgImgCache.leaf) {
    let img = new Image(); img.src = "https://pngimg.com/d/autumn_leaves_PNG3612.png";
    bgImgCache.leaf = img;
  }
  for(let i=0;i<24;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,w:36+Math.random()*30,h:20+Math.random()*14,vy:0.7+Math.random()*1.3,vx:(Math.random()-0.5)*1.1,a:Math.random()*Math.PI*2,va:(Math.random()-0.5)*0.06});
  drawAutumn();
}
function drawAutumn() {
  if(bgActive!=="autumn") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let l of bgThings) {
    bgCtx.save();
    bgCtx.globalAlpha=0.7;
    bgCtx.translate(l.x+l.w/2,l.y+l.h/2);
    bgCtx.rotate(l.a);
    bgCtx.drawImage(bgImgCache.leaf,-l.w/2,-l.h/2,l.w,l.h);
    bgCtx.restore();
    l.x += l.vx; l.y += l.vy; l.a += l.va;
    if(l.y > window.innerHeight+20){l.y=-30;l.x=Math.random()*window.innerWidth;}
    if(l.x < -30) l.x = window.innerWidth+30;
    if(l.x > window.innerWidth+30) l.x = -30;
  }
  bgAnimFrame=requestAnimationFrame(drawAutumn);
}
function startWinter() {
  endAllBG();
  initBGCanvas();
  bgActive = "winter";
  bgThings = [];
  for(let i=0; i<80; ++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:1.7+Math.random()*3.7,d:0.5+Math.random()*1.5,vx:(-0.6+Math.random()*1.2),vy:1+Math.random()*1.5,o:0.5+Math.random()*0.5});
  drawWinter();
}
function drawWinter() {
  if(bgActive!=="winter") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let f of bgThings) {
    bgCtx.globalAlpha = f.o;
    bgCtx.beginPath();
    bgCtx.arc(f.x, f.y, f.r, 0, 2*Math.PI);
    bgCtx.fillStyle = "#fff";
    bgCtx.shadowColor = "#bbf0ff";
    bgCtx.shadowBlur = 6;
    bgCtx.fill(); bgCtx.shadowBlur = 0;
    f.x += f.vx; f.y += f.vy;
    if(f.y > window.innerHeight+8){f.y=-6;f.x=Math.random()*window.innerWidth;}
    if(f.x < -6) f.x = window.innerWidth+6;
    if(f.x > window.innerWidth+6) f.x = -6;
  }
  bgCtx.globalAlpha=1;
  bgAnimFrame=requestAnimationFrame(drawWinter);
}
function startNight() {
  endAllBG();
  initBGCanvas();
  bgActive = "night";
  bgThings = [];
  for(let i=0;i<18;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:1.7+Math.random()*2.7,a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.03,blink:Math.random()*2*Math.PI});
  drawNight();
}
function drawNight() {
  if(bgActive!=="night") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  let t = Date.now()/500;
  for(let f of bgThings){
    let glow = 0.35+0.65*Math.abs(Math.sin(t+f.blink));
    bgCtx.save();
    bgCtx.globalAlpha=glow;
    bgCtx.beginPath();
    bgCtx.arc(f.x,f.y,f.r,0,2*Math.PI);
    bgCtx.fillStyle="#ffffa0";
    bgCtx.shadowColor="#fffca8";
    bgCtx.shadowBlur = 16*glow;
    bgCtx.fill(); bgCtx.shadowBlur = 0;
    bgCtx.restore();
    f.x += Math.sin(t+f.blink)*0.09;
    f.y += Math.cos(t+f.blink)*0.08;
  }
  bgAnimFrame=requestAnimationFrame(drawNight);
}
function startHalloween() {
  endAllBG();
  initBGCanvas();
  bgActive = "halloween";
  bgThings = [];
  if (!bgImgCache.ghost) {
    let img = new Image(); img.src = "https://openmoji.org/data/color/svg/1F47B.svg";
    bgImgCache.ghost = img;
  }
  for(let i=0;i<14;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:38+Math.random()*16,vy:0.5+Math.random()*0.8,vx:(Math.random()-0.5)*0.6,a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.07,fade:0.4+Math.random()*0.5});
  drawHalloween();
}
function drawHalloween() {
  if(bgActive!=="halloween") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let g of bgThings) {
    bgCtx.save();
    bgCtx.globalAlpha=g.fade;
    bgCtx.translate(g.x,g.y);
    bgCtx.rotate(g.a);
    bgCtx.drawImage(bgImgCache.ghost, -g.s/2,-g.s/2,g.s,g.s);
    bgCtx.restore();
    g.x += g.vx; g.y += g.vy; g.a += g.va;
    if(g.y > window.innerHeight+40){g.y=-30;g.x=Math.random()*window.innerWidth;}
    if(g.x < -40) g.x = window.innerWidth+40;
    if(g.x > window.innerWidth+40) g.x = -40;
  }
  bgAnimFrame=requestAnimationFrame(drawHalloween);
}
function startLunar() {
  endAllBG();
  initBGCanvas();
  bgActive = "lunar";
  bgThings = [];
  if (!bgImgCache.lantern) {
    let img = new Image(); img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Red_Lantern_icon.png/64px-Red_Lantern_icon.png";
    bgImgCache.lantern = img;
  }
  for(let i=0;i<12;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:36+Math.random()*20,vy:0.5+Math.random()*0.7,vx:(Math.random()-0.5)*0.09,a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.04,fade:0.7+Math.random()*0.3});
  drawLunar();
}
function drawLunar() {
  if(bgActive!=="lunar") return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  for (let l of bgThings) {
    bgCtx.save();
    bgCtx.globalAlpha=l.fade;
    bgCtx.translate(l.x,l.y);
    bgCtx.rotate(l.a);
    bgCtx.drawImage(bgImgCache.lantern, -l.s/2,-l.s/2,l.s,l.s);
    bgCtx.restore();
    l.x += l.vx; l.y += l.vy; l.a += l.va;
    if(l.y > window.innerHeight+40){l.y=-30;l.x=Math.random()*window.innerWidth;}
    if(l.x < -40) l.x = window.innerWidth+40;
    if(l.x > window.innerWidth+40) l.x = -40;
  }
  bgAnimFrame=requestAnimationFrame(drawLunar);
}
function endAllBG() {
  bgActive="";
  if(bgAnimFrame) cancelAnimationFrame(bgAnimFrame);
  if(bgCanvas) bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  if(bgCanvas) bgCanvas.style.display = "none";
}
function initBGCanvas() {
  bgCanvas = document.getElementById("snowCanvas");
  if (!bgCanvas) {
    bgCanvas = document.createElement("canvas");
    bgCanvas.id = "snowCanvas";
    document.body.appendChild(bgCanvas);
  }
  bgCanvas.style.display = "";
  resizeBGCanvas();
  bgCtx = bgCanvas.getContext("2d");
}
window.addEventListener("resize", resizeBGCanvas);
function resizeBGCanvas() {
  let c = document.getElementById("snowCanvas");
  if (c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
}

// --- Hook into theme changes ---
function applyThemeEffects() {
  const {theme, event} = getCurrentThemeAndEvent();
  document.body.className = "";
  document.body.classList.add("theme-"+theme);
  if(event) document.body.classList.add("event-"+event);
  const banner = document.getElementById("eventBanner");
  let themeObj = themeData[theme] || {};
  if (banner && themeObj.banner) {
    banner.innerText = themeObj.banner;
    banner.style.display = "";
  } else if (banner) {
    banner.style.display = "none";
  }
  setThemeSound(themeObj.sound);
  window.currentExoticPlants = (themeObj.exotics || []);
  // Animate backgrounds
  if(theme==="spring") startSpring();
  else if(theme==="summer") startSummer();
  else if(theme==="autumn") startAutumn();
  else if(theme==="winter") startWinter();
  else if(theme==="night") startNight();
  else if(theme==="halloween") startHalloween();
  else if(theme==="lunar-new-year") startLunar();
  else endAllBG();
}

// ... keep your plant growth/game logic as before ...
