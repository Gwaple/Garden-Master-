let selectedSeed = '';
let stage = 0; // 0=choose, 1=planted, 2=growing, 3=fully grown
let waterings = 0;
const wateringsNeeded = 3; // Number of waterings to fully grow

const plantStages = {
  Carrot: ["🌱", "🥬", "🥕"],
  Tomato: ["🌱", "🌿", "🍅"],
  Sunflower: ["🌱", "🌾", "🌻"]
};

const tips = {
  Carrot: [
    "Carrots like loose, sandy soil!",
    "Carrots need sunlight to grow strong.",
    "Remember to water your carrots gently."
  ],
  Tomato: [
    "Tomatoes love warm, sunny spots.",
    "Give tomatoes support as they grow tall.",
    "Water tomatoes at the base, not the leaves!"
  ],
  Sunflower: [
    "Sunflowers always turn toward the sun.",
    "Give sunflowers lots of space to grow tall!",
    "Sunflowers attract bees and birds."
  ]
};

function selectSeed(seed) {
  selectedSeed = seed;
  document.getElementById('seedSelection').style.display = 'none';
  document.getElementById('garden').style.display = '';
  document.getElementById('plantStage').textContent = `Ready to plant your ${seed}!`;
  document.getElementById('seedType').textContent = seed;
  document.getElementById('plantBtn').style.display = '';
  document.getElementById('waterBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('plantImg').innerHTML = '';
  document.getElementById('tip').textContent = '';
  document.getElementById('progressBarContainer').style.display = 'none';
  document.getElementById('wateringCan').classList.add('hidden');
  waterings = 0;
  stage = 0;
}

function plantSeed() {
  if (stage !== 0) return;
  document.getElementById('plantStage').textContent = `You planted a ${selectedSeed} seed! Time to water it.`;
  document.getElementById('plantImg').textContent = plantStages[selectedSeed][0];
  document.getElementById('tip').textContent = getTip();
  document.getElementById('plantBtn').style.display = 'none';
  document.getElementById('waterBtn').style.display = '';
  document.getElementById('progressBarContainer').style.display = '';
  document.getElementById('wateringCan').classList.remove('hidden');
  updateProgressBar();
  stage = 1;
}

function waterPlant() {
  if (stage !== 1 && stage !== 2) return;
  // Animate the watering can
  const can = document.getElementById('wateringCan');
  can.classList.remove('hidden');
  can.classList.add('animate');
  setTimeout(() => can.classList.remove('animate'), 600);

  waterings++;
  if (waterings < wateringsNeeded) {
    document.getElementById('plantStage').textContent = `You watered the ${selectedSeed}!`;
    document.getElementById('plantImg').textContent = plantStages[selectedSeed][1];
    document.getElementById('tip').textContent = getTip();
    stage = 2;
  } else {
    document.getElementById('plantStage').textContent = `Your ${selectedSeed} is fully grown!`;
    document.getElementById('plantImg').textContent = plantStages[selectedSeed][2];
    document.getElementById('tip').textContent = getTip();
    document.getElementById('waterBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = '';
    can.classList.add('hidden');
    stage = 3;
  }
  updateProgressBar();
}

function restartGame() {
  document.getElementById('seedSelection').style.display = '';
  document.getElementById('garden').style.display = 'none';
  selectedSeed = '';
  waterings = 0;
  stage = 0;
  document.getElementById('wateringCan').classList.add('hidden');
}

function getTip() {
  const factList = tips[selectedSeed];
  return factList[Math.floor(Math.random() * factList.length)];
}

function updateProgressBar() {
  const percent = Math.min(100, (waterings / wateringsNeeded) * 100);
  document.getElementById('progressBar').style.width = percent + "%";
}


