// --- Place this block at the top of your JS file, before your main gardening game logic ---

// --- THEME, EVENT, SOUND, AND EXOTIC PLANTS ---
const themeData = {
  spring: {
    sound: "assets/spring.mp3",
    banner: "🌸 Cherry Blossom Festival! Sakura Bonsai is here!",
    event: "cherry-blossom",
    exotics: [
      {name:"Sakura Bonsai",emoji:"🌸",seeds:"🌱",sprout:"🌿",tips:["A rare and beautiful blossom!"]}
    ]
  },
  summer: {
    sound: "assets/summer.mp3",
    banner: "🦋 Butterfly Season! Golden Sunflower is blooming!",
    event: "",
    exotics: [
      {name:"Golden Sunflower",emoji:"🌻✨",seeds:"🌱",sprout:"🌻",tips:["Shines with the sun."]}
    ]
  },
  autumn: {
    sound: "assets/autumn.mp3",
    banner: "🍂 Harvest Festival! Special Pumpkin and Mushrooms!",
    event: "harvest",
    exotics: [
      {name:"Pumpkin King",emoji:"🎃👑",seeds:"🌰",sprout:"🍃",tips:["A legendary autumn squash."]},
      {name:"Fairy Mushroom",emoji:"🍄✨",seeds:"🌱",sprout:"🍄",tips:["A magical mushroom!"]}
    ]
  },
  winter: {
    sound: "assets/winter.mp3",
    banner: "❄️ Winter Solstice! Frost Lotus and Ghost Orchid unlocked!",
    event: "winter-solstice",
    exotics: [
      {name:"Frost Lotus",emoji:"❄️🪷",seeds:"🌱",sprout:"🌿",tips:["Petals shimmer in the snow."]},
      {name:"Ghost Orchid",emoji:"👻🪷",seeds:"🌱",sprout:"🌿",tips:["Blooms in the frost."]}
    ]
  },
  night: {
    sound: "assets/night.mp3",
    banner: "🌙 Night Garden! Moonflower and Fireflies appear!",
    event: "",
    exotics: [
      {name:"Moonflower",emoji:"🌙🌸",seeds:"🌱",sprout:"🌿",tips:["Blooms only at night."]}
    ]
  },
  "lunar-new-year": {
    sound: "assets/lunar.mp3",
    banner: "🧧 Lunar New Year! Lucky Bamboo unlocked!",
    event: "lunar-new-year",
    exotics:[
      {name:"Lucky Bamboo",emoji:"🎍",seeds:"🌱",sprout:"🌿",tips:["Brings good fortune!"]}
    ]
  },
  halloween: {
    sound: "assets/halloween.mp3",
    banner: "🎃 Halloween! Bat Flower and Ghostly Mists!",
    event:"halloween",
    exotics:[
      {name:"Bat Flower",emoji:"🦇🌸",seeds:"🌰",sprout:"🌿",tips:["Blooms under a spooky moon."]}
    ]
  }
};

// Choose theme/event by date or time
function getCurrentThemeAndEvent() {
  const now = new Date();
  const m = now.getMonth(), d = now.getDate(), hour = now.getHours();
  // Night garden
  if (hour < 6 || hour >= 20) return {theme:"night", event:""};
  // Special events by date
  if (m === 2 && d >= 20 && d <= 31) return {theme: "spring", event:"cherry-blossom"};
  if (m === 9 && d >= 28 && d <= 31) return {theme: "halloween", event:"halloween"};
  if (m === 9 && d >= 20 && d <= 31) return {theme: "autumn", event:"harvest"};
  if (m === 0 && d >= 20 && d <= 31) return {theme: "winter", event:"winter-solstice"};
  if (m === 1 && d >= 10 && d <= 20) return {theme: "lunar-new-year", event:"lunar-new-year"};
  // Season
  if (m >= 2 && m <= 4) return {theme: "spring"};
  if (m >= 5 && m <= 7) return {theme: "summer"};
  if (m >= 8 && m <= 10) return {theme: "autumn"};
  if (m === 11 || m === 0 || m === 1) return {theme: "winter"};
  return {theme: "summer"};
}

// Apply theme: classes, banner, sound, and unlock exotics
function applyThemeEffects() {
  const {theme, event} = getCurrentThemeAndEvent();
  document.body.className = "";
  document.body.classList.add("theme-"+theme);
  if(event) document.body.classList.add("event-"+event);

  // Banner
  const banner = document.getElementById("eventBanner");
  let themeObj = themeData[theme] || {};
  if (themeObj.banner) {
    banner.innerText = themeObj.banner;
    banner.style.display = "";
  } else {
    banner.style.display = "none";
  }

  // Sound
  setThemeSound(themeObj.sound);

  // Store exotics for seed selection
  window.currentExoticPlants = (themeObj.exotics || []);
}
function setThemeSound(soundUrl) {
  const audio = document.getElementById('bgSound');
  if (!soundUrl) {
    audio.pause();
    audio.src = "";
    return;
  }
  if (audio.src && audio.src.endsWith(soundUrl)) return;
  audio.src = soundUrl;
  audio.volume = 0.45;
  audio.play().catch(()=>{});
}
window.applyThemeEffects = applyThemeEffects; // For debugging

// --- EXOTIC PLANTS UNLOCKING: Use in showSeedSelection ---
// Place this inside your showSeedSelection() function:
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

// --- On load: apply theme and effects ---
// Place this at the very end of your JS (or inside your window.onload callback)
window.onload = function() {
  applyThemeEffects();
  // ...your previous onload logic...
  document.getElementById("authArea").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homePage").style.display = "none";
  showLogin();
};
// --- USER ACCOUNTS & LOGIN SYSTEM ---
let currentUser = null;
function hash(str) {
  let h = 0; for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0; return h.toString();
}
function getAccounts() {
  return JSON.parse(localStorage.getItem("garden_accounts") || "{}");
}
function saveAccounts(accounts) {
  localStorage.setItem("garden_accounts", JSON.stringify(accounts));
}
function login() {
  let u = document.getElementById("loginUser").value.trim();
  let p = document.getElementById("loginPass").value;
  let accounts = getAccounts();
  if (accounts[u] && accounts[u].pw === hash(p)) {
    currentUser = u;
    document.getElementById("authArea").style.display = "none";
    showHome();
    document.getElementById("loginMsg").textContent = "";
  } else {
    document.getElementById("loginMsg").textContent = "Invalid username or password.";
  }
}
function logout() {
  currentUser = null;
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homePage").style.display = "none";
  document.getElementById("authArea").style.display = "";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
}
function showRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "";
  document.getElementById("registerMsg").textContent = "";
}
function showLogin() {
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("loginBox").style.display = "";
  document.getElementById("loginMsg").textContent = "";
}
function register() {
  let u = document.getElementById("regUser").value.trim();
  let p = document.getElementById("regPass").value;
  let accounts = getAccounts();
  if (!u || !p) {
    document.getElementById("registerMsg").textContent = "Username and password required.";
    return;
  }
  if (accounts[u]) {
    document.getElementById("registerMsg").textContent = "Username already taken.";
    return;
  }
  accounts[u] = { pw: hash(p), garden: { plantsGrown: 0, grownPlantsList: [] } };
  saveAccounts(accounts);
  document.getElementById("registerMsg").textContent = "Account created! Please login.";
  setTimeout(showLogin, 1200);
}

// --- LEVELS ---
const gardenerLevels = [
  { plants: 0, title: "Beginner", emoji: "🌱" },
  { plants: 3, title: "Sprout", emoji: "🌿" },
  { plants: 7, title: "Seedling", emoji: "🌾" },
  { plants: 12, title: "Green Thumb", emoji: "🍀" },
  { plants: 18, title: "Sprouter", emoji: "🎋" },
  { plants: 25, title: "Expert", emoji: "🌸" },
  { plants: 33, title: "Garden Hero", emoji: "🦸" },
  { plants: 42, title: "Plant Wizard", emoji: "🧙" },
  { plants: 52, title: "Botanist", emoji: "🌺" },
  { plants: 63, title: "Master Gardener", emoji: "🏆" }
];

// --- PLANTS ---
const allPlants = [
  {
    name: "Carrot", emoji: "🥕", seeds: "🌱", sprout: "🥬",
    tips: [
      "Carrots like loose, sandy soil!",
      "Carrots need sunlight to grow strong.",
      "Remember to water your carrots gently."
    ]
  },
  {
    name: "Tomato", emoji: "🍅", seeds: "🌱", sprout: "🌿",
    tips: [
      "Tomatoes love warm, sunny spots.",
      "Give tomatoes support as they grow tall.",
      "Water tomatoes at the base, not the leaves!"
    ]
  },
  {
    name: "Sunflower", emoji: "🌻", seeds: "🌱", sprout: "🌾",
    tips: [
      "Sunflowers always turn toward the sun.",
      "Give sunflowers lots of space to grow tall!",
      "Sunflowers attract bees and birds."
    ]
  },
  {
    name: "Pumpkin", emoji: "🎃", seeds: "🌰", sprout: "🍃",
    tips: [
      "Pumpkins need lots of space and water.",
      "Pumpkins love sunshine!",
      "Big leaves help pumpkins grow."
    ]
  },
  {
    name: "Lettuce", emoji: "🥬", seeds: "🌰", sprout: "🍃",
    tips: [
      "Lettuce likes cool weather.",
      "Keep lettuce soil moist.",
      "Pick leaves from the outside!"
    ]
  },
  {
    name: "Cucumber", emoji: "🥒", seeds: "🌰", sprout: "🌿",
    tips: [
      "Cucumbers need lots of water.",
      "Give cucumbers a trellis to climb.",
      "Harvest cucumbers when they're green and firm."
    ]
  }
];

// --- GAME STATE ---
let selectedSeed = '';
let stage = 0;
let waterings = 0;
const wateringsNeeded = 3;
let currentPlant = null;

// --- PROGRESS STATE ---
let plantsGrown = 0;
let grownPlantsList = [];

// --- DOM ELEMENTS ---
const homePage = document.getElementById('homePage');
const gameArea = document.getElementById('gameArea');
const seedButtonsDiv = document.getElementById('seedButtons');
const seedSelection = document.getElementById('seedSelection');
const garden = document.getElementById('garden');
const plantStageP = document.getElementById('plantStage');
const seedTypeSpan = document.getElementById('seedType');
const plantBtn = document.getElementById('plantBtn');
const waterBtn = document.getElementById('waterBtn');
const restartBtn = document.getElementById('restartBtn');
const plantImgDiv = document.getElementById('plantImg');
const tipP = document.getElementById('tip');
const progressBarContainer = document.getElementById('progressBarContainer');
const progressBar = document.getElementById('progressBar');
const wateringCan = document.getElementById('wateringCan');
const dropletsDiv = document.getElementById('droplets');
const levelDisplay = document.getElementById('levelDisplay');
const plantsGrownDisplay = document.getElementById('plantsGrownDisplay');
const levelProgressBar = document.getElementById('levelProgressBar');
const levelMilestones = document.getElementById('levelMilestones');
let statsDiv = document.getElementById('grownPlantsStats');

// --- SAVE AND LOAD PROGRESS (per user) ---
function saveProgress() {
  if (!currentUser) return;
  let accounts = getAccounts();
  accounts[currentUser].garden = {
    plantsGrown,
    grownPlantsList
  };
  saveAccounts(accounts);
}
function loadProgress() {
  if (!currentUser) return;
  let accounts = getAccounts();
  let garden = accounts[currentUser].garden || { plantsGrown: 0, grownPlantsList: [] };
  plantsGrown = typeof garden.plantsGrown === "number" ? garden.plantsGrown : 0;
  grownPlantsList = Array.isArray(garden.grownPlantsList) ? garden.grownPlantsList : [];
}

// --- HOMEPAGE (with sparkle & confetti) ---
function showHome() {
  loadProgress();
  document.getElementById("homePage").style.display = "";
  document.getElementById("gameArea").style.display = "none";

  // Set user
  document.getElementById('homeUser').textContent = currentUser;

  // Fun gardening quotes/tips
  const homeQuotes = [
    "“To plant a garden is to believe in tomorrow.” – Audrey Hepburn",
    "“Gardening adds years to your life and life to your years.”",
    "“The love of gardening is a seed once sown that never dies.”",
    "Every plant you grow brings you closer to nature 🌱",
    "“Where flowers bloom, so does hope.” – Lady Bird Johnson",
    "Just one more plant... said every gardener ever.",
    "Let’s make your garden grow!",
    "Gardening is cheaper than therapy – and you get tomatoes.",
    "🌻 Sunflowers follow the sun. Keep growing!"
  ];
  document.getElementById('homeQuote').textContent = homeQuotes[Math.floor(Math.random()*homeQuotes.length)];

  // Add sparkle emoji if not already present
  let sparkle = document.querySelector(".sparkle-emoji");
  if(!sparkle){
    sparkle = document.createElement("span");
    sparkle.className = "sparkle-emoji";
    sparkle.innerHTML = "✨";
    document.getElementById("homeWelcome").appendChild(sparkle);
  }

  let currLevel = getCurrentLevel();
  let nextLevel = getNextLevel();

  // Most grown and last grown plant
  let mostGrown = null, lastPlant = null;
  if (grownPlantsList.length) {
    mostGrown = grownPlantsList.reduce((a,b)=>a.count>=b.count?a:b);
    lastPlant = grownPlantsList.reduce((a,b)=>new Date(a.date)>new Date(b.date)?a:b);
  }

  document.getElementById('homeLevel').innerHTML = `${currLevel.emoji} <b>${currLevel.title}</b>`;
  document.getElementById('homePlants').innerHTML = `<b>${plantsGrown}</b>`;
  document.getElementById('homeMost').innerHTML = mostGrown ? `${mostGrown.emoji} ${mostGrown.name} (${mostGrown.count})` : '—';

  // Progress bar
  let start = currLevel.plants, end = nextLevel ? nextLevel.plants : currLevel.plants+10;
  let prog = Math.max(0, Math.min(1, (plantsGrown-start)/(end-start||1)));
  let progPercent = Math.round(prog*100);
  document.getElementById('homeLevelProgressBar').style.width = (progPercent) + "%";
  document.getElementById('homeNextMilestone').innerHTML = nextLevel
    ? `Next: <b>${nextLevel.title} ${nextLevel.emoji}</b> at <b>${nextLevel.plants}</b> plants`
    : "You’re a gardening legend!";

  // Highlight
  let highlight = "";
  if(lastPlant) {
    highlight = `Last plant grown: <span style="font-size:1.13em">${lastPlant.emoji} <b>${lastPlant.name}</b></span> <span style="font-size:0.93em;color:#777;">(${lastPlant.date})</span>`;
    if(nextLevel && plantsGrown+1===nextLevel.plants)
      highlight = `🌟 Next plant will unlock <b>${nextLevel.title} ${nextLevel.emoji}</b>!`;
  }
  document.getElementById('homeHighlight').innerHTML = highlight;

  confettiBurst();
}

// --- LEVELS & VISUAL TRACKER ---
function getCurrentLevel() {
  let curr = gardenerLevels[0];
  for (let lvl of gardenerLevels) {
    if (plantsGrown >= lvl.plants) curr = lvl;
  }
  return curr;
}
function getNextLevel() {
  for (let i=0;i<gardenerLevels.length;i++) {
    if (plantsGrown < gardenerLevels[i].plants)
      return gardenerLevels[i];
  }
  return null;
}
function updateLevelDisplay() {
  let currLevel = getCurrentLevel();
  levelDisplay.textContent = `Level: ${currLevel.title} ${currLevel.emoji}`;
}
function updatePlantsGrown() {
  plantsGrownDisplay.textContent = `Plants Grown: ${plantsGrown}`;
}
function showLevelProgress() {
  let curr = getCurrentLevel();
  let next = getNextLevel();
  let currIdx = gardenerLevels.findIndex(l=>l.title===curr.title);
  let start = curr.plants, end = next ? next.plants : curr.plants+10;
  let prog = Math.max(0, Math.min(1, (plantsGrown-start)/(end-start||1)));
  document.getElementById("levelProgressBar").style.width = (prog*100) + "%";
  // Dots
  let levelMilestones = document.getElementById("levelMilestones");
  levelMilestones.innerHTML = "";
  gardenerLevels.forEach((lvl, i) => {
    let dot = document.createElement("span");
    dot.className = "level-dot";
    if (plantsGrown >= lvl.plants) dot.classList.add('completed');
    if (i === currIdx) dot.classList.add('active');
    dot.innerHTML = `<span class="dot-emoji">${lvl.emoji}</span>
      <span class="dot-label">${lvl.title}<br><span style="font-size:0.9em">${lvl.plants}</span></span>`;
    levelMilestones.appendChild(dot);
  });
}

// --- GARDENING AREA ---
function startGame() {
  homePage.style.display = "none";
  gameArea.style.display = "";
  loadProgress();
  updateLevelDisplay();
  updatePlantsGrown();
  showLevelProgress();
  showSeedSelection();
  showGrownPlantsStats();
}
function goHome() {
  gameArea.style.display = "none";
  homePage.style.display = "";
  showHome();
}
function showSeedSelection() {
  seedSelection.style.display = '';
  garden.style.display = 'none';
  seedButtonsDiv.innerHTML = '';
  allPlants.forEach(plant => {
    const btn = document.createElement('button');
    btn.innerHTML = `${plant.emoji} ${plant.name}`;
    btn.onclick = () => selectSeed(plant.name);
    seedButtonsDiv.appendChild(btn);
  });
}
function addGardenShimmer() {
  let shimmer = document.querySelector(".garden-shimmer");
  if (!shimmer && garden) {
    shimmer = document.createElement("div");
    shimmer.className = "garden-shimmer";
    garden.appendChild(shimmer);
  }
}
function selectSeed(seed) {
  selectedSeed = seed;
  currentPlant = allPlants.find(p => p.name === seed);
  seedSelection.style.display = 'none';
  garden.style.display = '';
  plantStageP.textContent = `Ready to plant your ${seed}!`;
  seedTypeSpan.textContent = seed;
  plantBtn.style.display = '';
  waterBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  plantImgDiv.innerHTML = '';
  tipP.textContent = '';
  progressBarContainer.style.display = 'none';
  wateringCan.classList.add('hidden');
  dropletsDiv.innerHTML = '';
  waterings = 0;
  stage = 0;
  setTimeout(addGardenShimmer, 80);
}
function plantSeed() {
  if (stage !== 0) return;
  plantStageP.textContent = `You planted a ${selectedSeed} seed! Time to water it.`;
  plantImgDiv.textContent = currentPlant.seeds;
  tipP.textContent = getTip();
  plantBtn.style.display = 'none';
  waterBtn.style.display = '';
  progressBarContainer.style.display = '';
  wateringCan.classList.remove('hidden');
  dropletsDiv.innerHTML = '';
  updateProgressBar();
  stage = 1;
}
function waterPlant() {
  if (stage !== 1 && stage !== 2) return;
  animateWateringCan();
  showDroplets();
  waterings++;
  if (waterings < wateringsNeeded) {
    plantStageP.textContent = `You watered the ${selectedSeed}!`;
    plantImgDiv.textContent = currentPlant.sprout;
    tipP.textContent = getTip();
    stage = 2;
  } else {
    plantStageP.textContent = `Your ${selectedSeed} is fully grown!`;
    plantImgDiv.textContent = currentPlant.emoji;
    tipP.textContent = getTip();
    waterBtn.style.display = 'none';
    restartBtn.style.display = '';
    wateringCan.classList.add('hidden');
    stage = 3;
    plantsGrown++;
    updateGrownPlantsList(selectedSeed, currentPlant.emoji);
    saveProgress();
    updateLevelDisplay();
    updatePlantsGrown();
    showLevelProgress();
    showGrownPlantsStats();
    confettiBurst();
  }
  updateProgressBar();
}
function restartGame() {
  showSeedSelection();
  selectedSeed = '';
  waterings = 0;
  stage = 0;
  wateringCan.classList.add('hidden');
  dropletsDiv.innerHTML = '';
}
// --- GROWN PLANTS STATS ---
function updateGrownPlantsList(plantName, emoji) {
  const now = new Date().toLocaleString();
  let found = grownPlantsList.find(p => p.name === plantName);
  if (found) {
    found.count += 1;
    found.date = now;
  } else {
    grownPlantsList.push({ name: plantName, emoji, date: now, count: 1 });
  }
}
function showGrownPlantsStats() {
  if (!statsDiv) return;
  if (grownPlantsList.length === 0) {
    statsDiv.style.display = "none";
    statsDiv.innerHTML = "";
  } else {
    statsDiv.style.display = "";
    statsDiv.innerHTML = "<b>🌼 Your Plants:</b><ul style='list-style:disc;padding:0 0 0 16px;margin:4px 0'>";
    grownPlantsList.forEach(plant => {
      statsDiv.innerHTML += `<li>${plant.emoji} <b>${plant.name}</b> (${plant.count})<br><span style="font-size:0.88em;color:#555;">${plant.date}</span></li>`;
    });
    statsDiv.innerHTML += "</ul>";
  }
}

// --- ANIMATIONS ---
function animateWateringCan() {
  wateringCan.classList.remove('hidden');
  wateringCan.classList.add('animate');
  setTimeout(() => wateringCan.classList.remove('animate'), 600);
}
function showDroplets() {
  dropletsDiv.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const drop = document.createElement('span');
    drop.className = 'waterDroplet';
    drop.style.left = `${i * 22}px`;
    drop.textContent = "💧";
    dropletsDiv.appendChild(drop);
    setTimeout(() => {
      if (drop.parentNode) drop.parentNode.removeChild(drop);
    }, 700);
  }
}

// --- TIPS ---
function getTip() {
  const factList = currentPlant.tips;
  return factList[Math.floor(Math.random() * factList.length)];
}

// --- PROGRESS BAR (for plant watering) ---
function updateProgressBar() {
  const percent = Math.min(100, (waterings / wateringsNeeded) * 100);
  progressBar.style.width = percent + "%";
}

// --- CONFETTI BURST ---
function confettiBurst() {
  // Remove old canvas if present
  let old = document.querySelector(".confetti-canvas");
  if (old) old.remove();
  // Create canvas
  let cvs = document.createElement("canvas");
  cvs.className = "confetti-canvas";
  document.body.appendChild(cvs);
  let w = window.innerWidth, h = window.innerHeight;
  cvs.width = w; cvs.height = h;
  let ctx = cvs.getContext("2d");
  let particles = [];
  let colors = ["#43a047","#ffb6ff","#ffe082","#b2ffb6","#81c784","#aed581","#ffecb3"];
  let shapes = ["circle","rect"];
  let amount = 40 + Math.floor(Math.random()*10);
  for(let i=0;i<amount;i++){
    let a = (Math.PI*2)*Math.random();
    let cx = w/2 + Math.cos(a)*Math.random()*w*0.12;
    let cy = h*0.22 + Math.sin(a)*Math.random()*h*0.1;
    let vx = Math.cos(a)*((Math.random()*2+1.4));
    let vy = Math.sin(a)*((Math.random()*2+1.4));
    let sz = Math.random()*8+8;
    particles.push({
      x:cx,y:cy,vx,vy,sz,shape:shapes[Math.floor(Math.random()*shapes.length)],
      color:colors[Math.floor(Math.random()*colors.length)],
      alpha:1, rot:Math.random()*360, dRot:(Math.random()-0.5)*7
    });
  }
  let t=0, duration=45;
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      ctx.save();
      ctx.globalAlpha = Math.max(.01,p.alpha);
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      if(p.shape==="circle"){
        ctx.beginPath(); ctx.arc(0,0,p.sz,0,Math.PI*2); ctx.fill();
      }else{
        ctx.fillRect(-p.sz/2,-p.sz/2,p.sz,p.sz);
      }
      ctx.restore();
    });
  }
  function step(){
    t++;
    particles.forEach(p=>{
      p.x += p.vx*1.6; p.y += p.vy*1.1;
      p.vy += 0.35+Math.random()*0.05;
      p.vx *= 0.96;
      p.alpha -= 0.014+Math.random()*0.006;
      p.rot += p.dRot;
    });
    draw();
    if(t<duration) requestAnimationFrame(step);
    else setTimeout(()=>{cvs.remove();},420);
  }
  draw(); step();
}

// --- INITIALIZE ON LOAD: show login system ---
window.onload = function() {
  document.getElementById("authArea").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homePage").style.display = "none";
  showLogin();
};
