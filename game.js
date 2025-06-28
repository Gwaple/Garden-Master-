// ... your existing JS up to and including getNextLevel() ...

// --- HOMEPAGE ---
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
}

