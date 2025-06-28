// --- THEME, EVENT, SOUND, AND EXOTIC PLANTS ---
const themeData = {
  spring: {
    sound: "assets/spring.mp3",
    banner: "🌸 Cherry Blossom Festival! Sakura Bonsai is here!",
    event: "cherry-blossom",
    exotics: [
      {name:"Sakura Bonsai",emoji:"🌸",seeds:"🌱",sprout:"🌿",tips:["A rare and beautiful blossom!"], growTime: 3500}
    ]
  },
  summer: {
    sound: "assets/summer.mp3",
    banner: "🦋 Butterfly Season! Golden Sunflower is blooming!",
    event: "",
    exotics: [
      {name:"Golden Sunflower",emoji:"🌻✨",seeds:"🌱",sprout:"🌻",tips:["Shines with the sun."], growTime: 3500}
    ]
  },
  autumn: {
    sound: "assets/autumn.mp3",
    banner: "🍂 Harvest Festival! Special Pumpkin and Mushrooms!",
    event: "harvest",
    exotics: [
      {name:"Pumpkin King",emoji:"🎃👑",seeds:"🌰",sprout:"🍃",tips:["A legendary autumn squash."], growTime: 4200},
      {name:"Fairy Mushroom",emoji:"🍄✨",seeds:"🌱",sprout:"🍄",tips:["A magical mushroom!"], growTime: 3000}
    ]
  },
  winter: {
    sound: "assets/winter.mp3",
    banner: "❄️ Winter Solstice! Frost Lotus and Ghost Orchid unlocked!",
    event: "winter-solstice",
    exotics: [
      {name:"Frost Lotus",emoji:"❄️🪷",seeds:"🌱",sprout:"🌿",tips:["Petals shimmer in the snow."], growTime: 3800},
      {name:"Ghost Orchid",emoji:"👻🪷",seeds:"🌱",sprout:"🌿",tips:["Blooms in the frost."], growTime: 3600}
    ]
  },
  night: {
    sound: "assets/night.mp3",
    banner: "🌙 Night Garden! Moonflower and Fireflies appear!",
    event: "",
    exotics: [
      {name:"Moonflower",emoji:"🌙🌸",seeds:"🌱",sprout:"🌿",tips:["Blooms only at night."], growTime: 3100}
    ]
  },
  "lunar-new-year": {
    sound: "assets/lunar.mp3",
    banner: "🧧 Lunar New Year! Lucky Bamboo unlocked!",
    event: "lunar-new-year",
    exotics:[
      {name:"Lucky Bamboo",emoji:"🎍",seeds:"🌱",sprout:"🌿",tips:["Brings good fortune!"], growTime: 3300}
    ]
  },
  halloween: {
    sound: "assets/halloween.mp3",
    banner: "🎃 Halloween! Bat Flower and Ghostly Mists!",
    event:"halloween",
    exotics:[
      {name:"Bat Flower",emoji:"🦇🌸",seeds:"🌰",sprout:"🌿",tips:["Blooms under a spooky moon."], growTime: 3400}
    ]
  }
};
// --- YOUR REGULAR PLANTS ---
const allPlants = [
  {name:"Carrot", emoji:"🥕", seeds:"🥕", sprout:"🌱", tips:["Plant in loose soil!"], growTime: 3500},
  {name:"Potato", emoji:"🥔", seeds:"🥔", sprout:"🌱", tips:["Needs lots of earth."], growTime: 4000},
  {name:"Tomato", emoji:"🍅", seeds:"🍅", sprout:"🌱", tips:["Likes sunlight!"], growTime: 3500},
  {name:"Corn", emoji:"🌽", seeds:"🌽", sprout:"🌱", tips:["Keep well-watered."], growTime: 4200},
  {name:"Radish", emoji:"🌶️", seeds:"🌶️", sprout:"🌱", tips:["Grows quickly!"], growTime: 2500},
  {name:"Lettuce", emoji:"🥬", seeds:"🥬", sprout:"🌱", tips:["Cool and moist soil."], growTime: 3000}
];

// --- SEASON CHOOSER LOGIC ---
let manualSeason = "auto";
document.getElementById("seasonSelect").addEventListener("change", function() {
  manualSeason = this.value;
  applyThemeEffects();
  showSeedSelection(); // update exotics too
});

// --- THEME/EVENT SYSTEM ---
function getCurrentThemeAndEvent() {
  if (manualSeason !== "auto") {
    return {theme: manualSeason, event: (themeData[manualSeason]||{}).event || ""};
  }
  // Default: auto by date/time
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

// --- SEED SELECTION + GROWING ---
const seedSelection = document.getElementById('seedSelection');
const garden = document.getElementById('garden');
const seedButtonsDiv = document.getElementById('seedButtons');
let currentPlant = null;
let growTimer = null;
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
  document.getElementById("plantImg").textContent = currentPlant.emoji;
  document.getElementById("plantStage").textContent = "Sprout!";
  document.getElementById("tip").textContent = currentPlant.tips[0] || "";
  document.getElementById("seedType").textContent = currentPlant.name;
  document.getElementById("plantBtn").style.display = "";
  document.getElementById("waterBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  hideProgressBar();
}
function plantSeed() {
  document.getElementById("plantStage").textContent = "Growing...";
  document.getElementById("plantBtn").style.display = "none";
  document.getElementById("waterBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("tip").textContent = "Give it some water to help it grow!";
  showProgressBar(0);

  // Simulate growth progress
  let elapsed = 0;
  const total = currentPlant.growTime || 3500;
  growTimer = setInterval(() => {
    elapsed += 100;
    let percent = Math.min(100, Math.floor((elapsed/total)*100));
    updateProgressBar(percent);
    if (elapsed >= total) {
      clearInterval(growTimer);
      growTimer = null;
      document.getElementById("plantStage").textContent = "Ready to harvest! Click Water!";
      document.getElementById("waterBtn").style.display = "";
      document.getElementById("tip").textContent = "Click Water to finish growing!";
    }
  }, 100);
}
function waterPlant() {
  hideProgressBar();
  document.getElementById("plantStage").textContent = "Fully Grown!";
  document.getElementById("waterBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "";
  document.getElementById("tip").textContent = "Well done!";
}
function restartGame() {
  showSeedSelection();
}
function showProgressBar(percent) {
  let barWrap = document.getElementById("progressBarContainer");
  let bar = document.getElementById("progressBar");
  barWrap.style.display = "";
  bar.style.width = percent+"%";
}
function updateProgressBar(percent) {
  let bar = document.getElementById("progressBar");
  bar.style.width = percent+"%";
}
function hideProgressBar() {
  let barWrap = document.getElementById("progressBarContainer");
  let bar = document.getElementById("progressBar");
  barWrap.style.display = "none";
  bar.style.width = "0%";
}

// --- NAVIGATION + LOGIN/REGISTER (demo only, replace with real logic) ---
function showLogin() {
  document.getElementById("loginBox").style.display = "";
  document.getElementById("registerBox").style.display = "none";
}
function showRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "";
}
function login() {
  document.getElementById("authArea").style.display = "none";
  document.getElementById("homePage").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homeUser").textContent = document.getElementById("loginUser").value || "Gardener";
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
}

// --- STARTUP ---
window.onload = function() {
  applyThemeEffects();
  document.getElementById("authArea").style.display = "";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("homePage").style.display = "none";
  showLogin();
};
