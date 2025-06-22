let selectedSeed = '';
let stage = 0; // 0=choose, 1=planted, 2=watered, 3=grown

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
  stage = 0;
}

function plantSeed() {
  if (stage !== 0) return;
  document.getElementById('plantStage').textContent = `You planted a ${selectedSeed} seed!`;
  document.getElementById('plantImg').textContent = "🌱";
  document.getElementById('tip').textContent = getTip();
  document.getElementById('plantBtn').style.display = 'none';
  document.getElementById('waterBtn').style.display = '';
  stage = 1;
}

function waterPlant() {
  if (stage !== 1) return;
  document.getElementById('plantStage').textContent = `You watered the ${selectedSeed}! Watch it grow...`;
  if (selectedSeed === "Carrot") {
    document.getElementById('plantImg').textContent = "🥕";
  } else if (selectedSeed === "Tomato") {
    document.getElementById('plantImg').textContent = "🍅";
  } else if (selectedSeed === "Sunflower") {
    document.getElementById('plantImg').textContent = "🌻";
  }
  document.getElementById('tip').textContent = getTip();
  document.getElementById('waterBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = '';
  stage = 2;
}

function restartGame() {
  document.getElementById('seedSelection').style.display = '';
  document.getElementById('garden').style.display = 'none';
  selectedSeed = '';
  stage = 0;
}

function getTip() {
  const factList = tips[selectedSeed];
  return factList[Math.floor(Math.random() * factList.length)];
}
