// --- THEME, EVENT, SOUND, AND EXOTIC PLANTS ---
const themeData = {
  spring: {
    sound: "assets/spring.mp3",
    banner: "🌸 Cherry Blossom Festival! Sakura Bonsai is here!",
    event: "cherry-blossom",
    exotics: [
      {name:"Sakura Bonsai",emoji:"🌸",seeds:"🌱",sprout:"🌿",plant:"🌸",tips:["A rare and beautiful blossom!"], growTime: 3500}
    ]
  },
  summer: {
    sound: "assets/summer.mp3",
    banner: "🦋 Butterfly Season! Golden Sunflower is blooming!",
    event: "",
    exotics: [
      {name:"Golden Sunflower",emoji:"🌻✨",seeds:"🌱",sprout:"🌻",plant:"🌻",tips:["Shines with the sun."], growTime: 3500}
    ]
  },
  autumn: {
    sound: "assets/autumn.mp3",
    banner: "🍂 Harvest Festival! Special Pumpkin and Mushrooms!",
    event: "harvest",
    exotics: [
      {name:"Pumpkin King",emoji:"🎃👑",seeds:"🌰",sprout:"🍃",plant:"🎃",tips:["A legendary autumn squash."], growTime: 4200},
      {name:"Fairy Mushroom",emoji:"🍄✨",seeds:"🌱",sprout:"🍄",plant:"🍄",tips:["A magical mushroom!"], growTime: 3000}
    ]
  },
  winter: {
    sound: "assets/winter.mp3",
    banner: "❄️ Winter Solstice! Frost Lotus and Ghost Orchid unlocked!",
    event: "winter-solstice",
    exotics: [
      {name:"Frost Lotus",emoji:"❄️🪷",seeds:"🌱",sprout:"🌿",plant:"❄️🪷",tips:["Petals shimmer in the snow."], growTime: 3800},
      {name:"Ghost Orchid",emoji:"👻🪷",seeds:"🌱",sprout:"🌿",plant:"👻🪷",tips:["Blooms in the frost."], growTime: 3600}
    ]
  },
  night: {
    sound: "assets/night.mp3",
    banner: "🌙 Night Garden! Moonflower and Fireflies appear!",
    event: "",
    exotics: [
      {name:"Moonflower",emoji:"🌙🌸",seeds:"🌱",sprout:"🌿",plant:"🌙🌸",tips:["Blooms only at night."], growTime: 3100}
    ]
  },
  "lunar-new-year": {
    sound: "assets/lunar.mp3",
    banner: "🧧 Lunar New Year! Lucky Bamboo unlocked!",
    event: "lunar-new-year",
    exotics:[
      {name:"Lucky Bamboo",emoji:"🎍",seeds:"🌱",sprout:"🌿",plant:"🎍",tips:["Brings good fortune!"], growTime: 3300}
    ]
  },
  halloween: {
    sound: "assets/halloween.mp3",
    banner: "🎃 Halloween! Bat Flower and Ghostly Mists!",
    event:"halloween",
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

// --- SAVE/LOAD PROGRESS ---
function saveProgress(user, stats) {
  localStorage.setItem("garden-progress-"+user, JSON.stringify(stats));
}
function loadProgress(user) {
  const raw = localStorage.getItem("garden-progress-"+user);
  if (raw) return JSON.parse(raw);
  return {total:0, grown:{}};
}

// --- SEASON CHOOSER LOGIC ---
let manualSeason = "auto";
document.getElementById("seasonSelect").addEventListener("change", function() {
  manualSeason = this.value;
  applyThemeEffects();
  showSeedSelection();
});

// --- THEME/EVENT SYSTEM ---
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

function setThemeSound(soundUrl) {
  const audio = document.getElementById('bgSound');
  if (!audio) return;
  if (!soundUrl) {
    audio.pause();
    audio.src = "";
    return;
  }
  if (audio.src && audio.src.endsWith(soundUrl)) return;
  audio.src = soundUrl;
  audio.volume = 0.35;
  if (window.userHasInteracted) {
    audio.play().catch(()=>{});
  } else {
    const playOnInteraction = () => {
      audio.play().catch(()=>{});
      window.removeEventListener("click", playOnInteraction);
      window.userHasInteracted = true;
    };
    window.addEventListener("click", playOnInteraction);
  }
}

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
    b
