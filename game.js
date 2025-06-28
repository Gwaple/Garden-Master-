// --- LOGIN SYSTEM ---
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

// --- LEVELS (with harder milestones and more levels) ---
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
let grownPlantsList = []; // Array of {name, emoji, date, count}

// --- DOM ELEMENTS ---
const homePage = document.getElementById('homePage');
const homeStats = document.getElementById('homeStats');
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

// --- ADD: DOM for grown plants stats ---
let statsDiv = null;
window.addEventListener('DOMContentLoaded', () => {
  statsDiv = document.createElement('div');
  statsDiv.id = 'grownPlantsStats';
  statsDiv.style.marginTop = "16px";
  statsDiv.style.background = "#e7ffd8";
  statsDiv.style.borderRadius = "8px";
  statsDiv.style.padding = "10px";
  statsDiv.style.fontSize = "1em";
  statsDiv.style.display = "none";
  gameArea.appendChild(statsDiv);
});

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

// --- HOMEPAGE ---
function showHome() {
  loadProgress();
  document.getElementById("homePage").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  let currLevel = getCurrentLevel();
  let nextLevel = getNextLevel();
  let nextMsg = nextLevel ? 
    `<br><span style="color:#388e3c">Grow <b>${nextLevel.plants-plantsGrown}</b> more plant${nextLevel.plants-plantsGrown===1?'':'s'} to reach <b>${nextLevel.title} ${nextLevel.emoji}</b></span>` 
    : "<br><span style='color:#388e3c'>You've reached the top level!</span>";
  homeStats.innerHTML = `
    <div style="font-size:1.25em;">
      👤 <b>User:</b> ${currentUser}
    </div>
    <div style="margin-top:10px;">
      <b>Level:</b> ${currLevel.title} ${currLevel.emoji} <br>
      <b>Plants Grown:</b> ${plantsGrown}
    </div>
    ${nextMsg}
  `;
}

// --- GAME AREA ---
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

// --- LEVEL AND VISUAL TRACKER ---
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
  // Progress bar and milestone dots
  let curr = getCurrentLevel();
  let next = getNextLevel();
  let currIdx = gardenerLevels.findIndex(l=>l.title===curr.title);
  let nextIdx = next ? gardenerLevels.findIndex(l=>l.title===next.title) : gardenerLevels.length-1;
  // Progress bar
  let start = curr.plants, end = next ? next.plants : curr.plants+10;
  let prog = Math.max(0, Math.min(1, (plantsGrown-start)/(end-start||1)));
  levelProgressBar.style.width = (prog*100) + "%";
  // Dots
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

// --- SEED SELECTION ---
function showSeedSelection() {
  seedSelection.style.display = '';
  garden.style.display = 'none';
  // Dynamically create plant buttons
  seedButtonsDiv.innerHTML = '';
  allPlants.forEach(plant => {
    const btn = document.createElement('button');
    btn.innerHTML = `${plant.emoji} ${plant.name}`;
    btn.onclick = () => selectSeed(plant.name);
    seedButtonsDiv.appendChild(btn);
  });
}

// --- PLANTING ---
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
    statsDiv.innerHTML = "<b>🌼 Your Plant Collection:</b><ul style='list-style:none;padding:0;margin:8px 0'>";
    grownPlantsList.forEach(plant => {
      statsDiv.innerHTML += `<li>${plant.emoji} <b>${plant.name}</b> — grown <b>${plant.count}</b> time${plant.count>1?'s':''} <br><span style="font-size:0.93em;color:#555;">Last: ${plant.date}</span></li>`;
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

// --- INITIALIZE ON LOAD: show login system ---
window.onload = function() {
  document.getElementById("authArea").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homePage").style.display = "none";
  showLogin();
};


