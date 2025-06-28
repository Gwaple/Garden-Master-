// ... all your game logic, login/register, and gardenerLevels, allPlants, state variables, etc. ...

// --- Add garden shimmer overlay on garden show ---
function addGardenShimmer() {
  let shimmer = document.querySelector(".garden-shimmer");
  if (!shimmer) {
    shimmer = document.createElement("div");
    shimmer.className = "garden-shimmer";
    document.getElementById("garden").appendChild(shimmer);
  }
}

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

// --- Progress bar/milestone sparkle (call this after any level-up or on gardening area show) ---
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

// --- Garden shimmer on show ---
function selectSeed(seed) {
  // ... your normal logic ...
  setTimeout(addGardenShimmer, 80);
}

// --- Confetti Burst! ---
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
    let r = 220 + Math.random()*40;
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

// --- Also call confettiBurst after level up! ---
function waterPlant() {
  // ... your existing logic ...
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
    confettiBurst(); // <--- sparkle!
  }
  updateProgressBar();
}

