// --- PLANTS & LEVELS ---
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
const gardenerLevels = [
  { plants: 0, title: "Beginner", emoji: "🌱" },
  { plants: 5, title: "Growing Gardener", emoji: "🌿" },
  { plants: 15, title: "Green Thumb", emoji: "🍀" },
  { plants: 30, title: "Expert", emoji: "🌸" },
  { plants: 50, title: "Master Gardener", emoji: "🏆" }
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

// --- SAVE AND LOAD PROGRESS ---
function saveProgress() {
  localStorage.setItem('gardenGameProgress', JSON.stringify({
    plantsGrown,
    grownPlantsList
  }));
}
function loadProgress() {
  const data = localStorage.getItem('gardenGameProgress');
  if (data) {
    try {
      const prog = JSON.parse(data);
      plantsGrown = typeof prog.plantsGrown === "number" ? prog.plantsGrown : 0;
      grownPlantsList = Array.isArray(prog.grownPlantsList) ? prog.grownPlantsList : [];
    } catch { plantsGrown = 0; grownPlantsList = []; }
  } else {
    plantsGrown = 0;
    grownPlantsList = [];
  }
}

// --- HOME PAGE ---
function startGame() {
  homePage.style.display = "none";
  gameArea.style.display = "";
  loadProgress();
  updateLevelDisplay();
  updatePlantsGrown();
  showSeedSelection();
  showGrownPlantsStats();
}
function goHome() {
  gameArea.style.display = "none";
  homePage.style.display = "";
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

// --- LEVEL SYSTEM ---
function updateLevelDisplay() {
  let currLevel = gardenerLevels[0];
  for (let lvl of gardenerLevels) {
    if (plantsGrown >= lvl.plants) currLevel = lvl;
  }
  levelDisplay.textContent = `Level: ${currLevel.title} ${currLevel.emoji}`;
}
function updatePlantsGrown() {
  plantsGrownDisplay.textContent = `Plants Grown: ${plantsGrown}`;
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

// --- PROGRESS BAR ---
function updateProgressBar() {
  const percent = Math.min(100, (waterings / wateringsNeeded) * 100);
  progressBar.style.width = percent + "%";
}

// --- INITIALIZE ON LOAD ---
window.onload = function() {
  loadProgress();
  updateLevelDisplay();
  updatePlantsGrown();
  showGrownPlantsStats();
};


