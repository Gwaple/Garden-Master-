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
