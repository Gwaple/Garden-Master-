// --- DATA: Themes and Plants ---
const themeData = {
  spring: {
    banner: "🌸 Cherry Blossom Festival! Sakura Bonsai is here!",
    exotics: [
      {name:"Sakura Bonsai",emoji:"🌸",seeds:"🌱",sprout:"🌿",plant:"🌸",tips:["A rare and beautiful blossom!"], growTime: 3500}
    ]
  },
  summer: {
    banner: "🦋 Butterfly Season! Golden Sunflower is blooming!",
    exotics: [
      {name:"Golden Sunflower",emoji:"🌻✨",seeds:"🌱",sprout:"🌻",plant:"🌻",tips:["Shines with the sun."], growTime: 3500}
    ]
  },
  autumn: {
    banner: "🍂 Harvest Festival! Special Pumpkin and Mushrooms!",
    exotics: [
      {name:"Pumpkin King",emoji:"🎃👑",seeds:"🌰",sprout:"🍃",plant:"🎃",tips:["A legendary autumn squash."], growTime: 4200},
      {name:"Fairy Mushroom",emoji:"🍄✨",seeds:"🌱",sprout:"🍄",plant:"🍄",tips:["A magical mushroom!"], growTime: 3000}
    ]
  },
  winter: {
    banner: "❄️ Winter Solstice! Frost Lotus and Ghost Orchid unlocked!",
    exotics: [
      {name:"Frost Lotus",emoji:"❄️🪷",seeds:"🌱",sprout:"🌿",plant:"❄️🪷",tips:["Petals shimmer in the snow."], growTime: 3800},
      {name:"Ghost Orchid",emoji:"👻🪷",seeds:"🌱",sprout:"🌿",plant:"👻🪷",tips:["Blooms in the frost."], growTime: 3600}
    ]
  },
  night: {
    banner: "🌙 Night Garden! Moonflower and Fireflies appear!",
    exotics: [
      {name:"Moonflower",emoji:"🌙🌸",seeds:"🌱",sprout:"🌿",plant:"🌙🌸",tips:["Blooms only at night."], growTime: 3100}
    ]
  },
  "lunar-new-year": {
    banner: "🧧 Lunar New Year! Lucky Bamboo unlocked!",
    exotics:[
      {name:"Lucky Bamboo",emoji:"🎍",seeds:"🌱",sprout:"🌿",plant:"🎍",tips:["Brings good fortune!"], growTime: 3300}
    ]
  },
  halloween: {
    banner: "🎃 Halloween! Bat Flower and Ghostly Mists!",
    exotics:[
      {name:"Bat Flower",emoji:"🦇🌸",seeds:"🌰",sprout:"🌿",plant:"🦇🌸",tips:["Blooms under a spooky moon."], growTime: 3400}
    ]
  }
};
const allPlants = [
  {name:"Carrot", emoji:"🥕", seeds:"🌰", sprout:"🌱", plant:"🥕", tips:["Plant in loose soil!"], growTime: 3500},
  {name:"Potato", emoji:"🥔", seeds:"🌰", sprout:"🌱", plant:"🥔", tips:["Needs lots of earth."], growTime: 4000},
  {name:"Tomato", emoji:"🍅", seeds:"🍅", sprout:"🌱", plant:"🍅", tips:["Likes sunlight!"], growTime: 3500},
  {name:"Corn", emoji:"🌽", seeds:"🌽", sprout:"🌿", plant:"🌽", tips:["Keep well-watered."], growTime: 4200},
  {name:"Radish", emoji:"🌶️", seeds:"🌶️", sprout:"🌱", plant:"🌶️", tips:["Grows quickly!"], growTime: 2500},
  {name:"Lettuce", emoji:"🥬", seeds:"🥬", sprout:"🌱", plant:"🥬", tips:["Cool and moist soil."], growTime: 3000}
];

// --- PROGRESS ---
function saveProgress(user, stats) {
  localStorage.setItem("garden-progress-"+user, JSON.stringify(stats));
}
function loadProgress(user) {
  const raw = localStorage.getItem("garden-progress-"+user);
  if (raw) return JSON.parse(raw);
  return {total:0, grown:{}};
}

// --- SEASON PICKER LOGIC ---
let manualSeason = "auto";
document.getElementById("seasonSelect").addEventListener("change", function() {
  manualSeason = this.value;
  applyThemeEffects();
  showSeedSelection();
});
function getCurrentThemeAndEvent() {
  if (manualSeason !== "auto") {
    return {theme: manualSeason, event: (themeData[manualSeason]||{}).event || ""};
  }
  const now = new Date();
  const m = now.getMonth(), d = now.getDate(), hour = now.getHours();
  if (hour < 6 || hour >= 20) return {theme:"night", event:""};
  if (m === 2 && d >= 20 && d <= 31) return {theme: "spring", event:"cherry-blossom"};
  if (m === 9 && d >= 28 && d <= 31) return {theme: "halloween", event:"halloween"};
  if (m === 9 && d >= 20 && d <= 31) return {theme: "autumn", event:"harvest"};
  if (m === 0 && d >= 20 && d <= 31) return {theme: "winter", event:"winter-solstice"};
  if (m === 1 && d >= 10 && d <= 20) return {theme: "lunar-new-year", event:"lunar-new-year"};
  if (m >= 2 && m <= 4) return {theme: "spring"};
  if (m >= 5 && m <= 7) return {theme: "summer"};
  if (m >= 8 && m <= 10) return {theme: "autumn"};
  if (m === 11 || m === 0 || m === 1) return {theme: "winter"};
  return {theme: "summer"};
}

// --- ANIMATED BACKGROUNDS ---
let bgCanvas = document.getElementById("snowCanvas");
let bgCtx = bgCanvas.getContext("2d");
let bgActive = "", bgAnimFrame=0, bgThings=[], bgImgCache={};
function startSpring() {
  endAllBG();
  bgActive = "spring";
  bgCanvas.style.display = "";
  resizeBGCanvas();
  bgThings = [];
  if (!bgImgCache.petals) {
    let img = new Image(); img.src = "https://pngimg.com/d/petals_PNG16.png";
    bgImgCache.petals = img;
  }
  for(let i=0;i<40;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:36+Math.random()*26,v:0.7+Math.random(),a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.03});
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
    if(bgImgCache.petals.complete) bgCtx.drawImage(bgImgCache.petals, -p.s/2,-p.s/2,p.s,p.s);
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
  bgActive = "summer";
  bgCanvas.style.display = "";
  resizeBGCanvas();
  bgThings = [];
  if (!bgImgCache.butterfly) {
    let img = new Image(); img.src = "https://openmoji.org/data/color/svg/1F98B.svg";
    bgImgCache.butterfly = img;
  }
  for(let i=0;i<18;++i)
    bgThings.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:34+Math.random()*16,vx:(Math.random()-0.5)*1.2,vy:(0.3+Math.random()*0.5),a:Math.random()*2*Math.PI,va:(Math.random()-0.5)*0.07});
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
    if(bgImgCache.butterfly.complete) bgCtx.drawImage(bgImgCache.butterfly, -b.s/2,-b.s/2,b.s,b.s);
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
  bgActive = "autumn";
  bgCanvas.style.display = "";
  resizeBGCanvas();
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
    if(bgImgCache.leaf.complete) bgCtx.drawImage(bgImgCache.leaf,-l.w/2,-l.h/2,l.w,l.h);
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
  bgActive = "winter";
  bgCanvas.style.display = "";
  resizeBGCanvas();
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
  bgActive = "night";
  bgCanvas.style.display = "";
  resizeBGCanvas();
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
  bgActive = "halloween";
  bgCanvas.style.display = "";
  resizeBGCanvas();
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
    if(bgImgCache.ghost.complete) bgCtx.drawImage(bgImgCache.ghost, -g.s/2,-g.s/2,g.s,g.s);
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
  bgActive = "lunar";
  bgCanvas.style.display = "";
  resizeBGCanvas();
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
    if(bgImgCache.lantern.complete) bgCtx.drawImage(bgImgCache.lantern, -l.s/2,-l.s/2,l.s,l.s);
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
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  bgCanvas.style.display = "none";
}
function resizeBGCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBGCanvas);

function applyThemeEffects() {
  const {theme, event} = getCurrentThemeAndEvent();
  document.body.className = "theme-" + theme;
  const banner = document.getElementById("eventBanner");
  let themeObj = themeData[theme] || {};
  if (banner && themeObj.banner) {
    banner.innerText = themeObj.banner;
    banner.style.display = "";
  } else if (banner) {
    banner.style.display = "none";
  }
  window.currentExoticPlants = (themeObj.exotics || []);
  if(theme==="spring") startSpring();
  else if(theme==="summer") startSummer();
  else if(theme==="autumn") startAutumn();
  else if(theme==="winter") startWinter();
  else if(theme==="night") startNight();
  else if(theme==="halloween") startHalloween();
  else if(theme==="lunar-new-year") startLunar();
  else endAllBG();
}

// --- PLANT LOGIC: Select, Grow (multi-press), Progress ---
const seedSelection = document.getElementById('seedSelection');
const garden = document.getElementById('garden');
const seedButtonsDiv = document.getElementById('seedButtons');
const plantAnimDiv = document.getElementById('plantAnim');
let currentPlant = null;
let currentUser = "";
let progressStats = {total:0, grown:{}};
let growStage = 0; // 0=seed, 1=sprout, 2=full
let growStagePress = 0;
let growPressesNeeded = [3, 5];

function showSeedSelection() {
  const unlockedPlants = [...allPlants, ...(window.currentExoticPlants||[])];
  seedSelection.style.display = '';
  garden.style.display = 'none';
  seedButtonsDiv.innerHTML = '';
  unlockedPlants.forEach(plant => {
    const btn = document.createElement('button');
    btn.innerHTML = `${plant.emoji} ${plant.name}`;
    btn.onclick = () => selectSeed(plant.name);
    seedButtonsDiv.appendChild(btn);
  });
}
function selectSeed(name) {
  garden.style.display = '';
  seedSelection.style.display = 'none';
  currentPlant = [...allPlants, ...(window.currentExoticPlants||[])].find(p => p.name === name);
  growStage = 0;
  growStagePress = 0;
  renderPlantAnim();
  document.getElementById("plantStage").textContent = "Seed planted!";
  document.getElementById("tip").textContent = currentPlant.tips[0] || "";
  document.getElementById("seedType").textContent = currentPlant.name;
  document.getElementById("growBtn").style.display = "";
  document.getElementById("restartBtn").style.display = "none";
  hideProgressBar();
}
function growPlant() {
  if (growStage === 0) {
    growStagePress++;
    document.getElementById("plantStage").textContent = `Growing seed... (${growStagePress}/${growPressesNeeded[0]})`;
    if (growStagePress >= growPressesNeeded[0]) {
      growStage = 1;
      growStagePress = 0;
      renderPlantAnim();
      document.getElementById("plantStage").textContent = "Sprouting!";
      document.getElementById("tip").textContent = "Keep growing!";
    }
  } else if (growStage === 1) {
    growStagePress++;
    document.getElementById("plantStage").textContent = `Sprout growing... (${growStagePress}/${growPressesNeeded[1]})`;
    if (growStagePress >= growPressesNeeded[1]) {
      growStage = 2;
      growStagePress = 0;
      renderPlantAnim();
      document.getElementById("plantStage").textContent = "Fully grown!";
      document.getElementById("tip").textContent = "Press Grow/Space to harvest!";
      document.getElementById("growBtn").style.display = "";
      document.getElementById("restartBtn").style.display = "";
      progressStats.total++;
      progressStats.grown[currentPlant.name] = (progressStats.grown[currentPlant.name]||0) + 1;
      saveProgress(currentUser, progressStats);
      updateProgressStats();
    }
  } else if (growStage === 2) {
    // Harvest
    restartGame();
  }
  renderPlantAnim();
}
function restartGame() {
  showSeedSelection();
}
function renderPlantAnim() {
  if (!currentPlant) return;
  let html = "";
  if (growStage === 0) {
    html = `<div style="text-align:center;font-size:2.2em;margin-top:60px;">
      <span style="position:relative;top:0">${currentPlant.seeds || "🌱"}</span>
      <div style="width:36px;height:10px;margin:0 auto;background:#a28250;border-radius:50%;filter:blur(0.5px);margin-top:2px"></div>
    </div>`;
  } else if (growStage === 1) {
    html = `<div style="text-align:center;font-size:2.2em;margin-top:35px;">
      <span style="position:relative;top:0">${currentPlant.sprout || "🌱"}</span>
      <div style="width:44px;height:16px;margin:0 auto;background:#a28250;border-radius:50%;filter:blur(0.5px);margin-top:2px"></div>
    </div>`;
  } else if (growStage === 2) {
    html = `<div style="text-align:center;font-size:2.5em;margin-top:15px;">
      <span style="position:relative;top:0">${currentPlant.plant || currentPlant.emoji}</span>
      <div style="width:50px;height:18px;margin:0 auto;background:#a28250;border-radius:50%;filter:blur(0.5px);margin-top:2px"></div>
    </div>`;
  }
  plantAnimDiv.innerHTML = html;
}
function updateProgressStats() {
  document.getElementById("progressStats").innerHTML =
    `<b>Total grown:</b> ${progressStats.total}<br>` +
    Object.keys(progressStats.grown).map(k=>`${k}: ${progressStats.grown[k]}`).join(", ");
}
function hideProgressBar() {
  let barWrap = document.getElementById("progressBarContainer");
  let bar = document.getElementById("progressBar");
  barWrap.style.display = "none";
  bar.style.width = "0%";
}

// --- KEYBOARD: SPACE TO GROW ---
document.addEventListener("keydown", function(e) {
  if(document.getElementById("gameArea").style.display !== "none") {
    if(e.code === "Space" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      if(document.getElementById("growBtn").style.display !== "none") {
        growPlant();
      } else if (document.getElementById("restartBtn").style.display !== "none") {
        restartGame();
      }
    }
  }
});

// --- AUTH LOGIC + STARTUP ---
function showLogin() {
  document.getElementById("loginBox").style.display = "";
  document.getElementById("registerBox").style.display = "none";
}
function showRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "";
}
function login() {
  currentUser = document.getElementById("loginUser").value || "Gardener";
  progressStats = loadProgress(currentUser);
  updateProgressStats();
  document.getElementById("authArea").style.display = "none";
  document.getElementById("homePage").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homeUser").textContent = currentUser;
}
function register() {
  showLogin();
}
function startGame() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("gameArea").style.display = "";
  showSeedSelection();
}
function goHome() {
  document.getElementById("homePage").style.display = "";
  document.getElementById("gameArea").style.display = "none";
}
function logout() {
  document.getElementById("authArea").style.display = "";
  document.getElementById("homePage").style.display = "none";
  document.getElementById("gameArea").style.display = "none";
  currentUser = "";
}

// --- INITIALIZATION ---
resizeBGCanvas();
applyThemeEffects();
showLogin();
