const CATEGORIES = ["Reyal Or Fakeh", "Spot-ify", "ReCamp Review", "Dapat Alam Mo", "Kanta Haa?"];
const POINTS = [1, 2, 3, 4];
const DATA = {
  "Reyal Or Fakeh": [
    { q: "Saint Francis of Assisi ang Founder ng Jesuits", a: "FALSE" },
    { q: "Ang full name ni Bro. Bo ay Eugenio R. Sanchez Jr.", a: "TRUE" },
    { q: "May anay ang room ng girls", a: "TRUE" },
    { q: "Si kuya James ang nag talk ng God chose you", a: "FALSE" },
  ],
  "Spot-ify": [
    { q: "I’ve tried it my way ‘til I understand, You write _______________ than I ever could.", a: "Better Stories" },
    { q: "You ‘re full of glory and power, Your mighty hand lifts me up when the world gives way Jesus My Lord, ___________.", a: "You Reign" },
    { q: "There is more to life, don’t have to blend in, no need to cave in, Jesus is the life ___________ and let the light in.", a: "Come out of hiding" },
    { q: "My soul magnifies the Lord, My spirit rejoices In God my Savior, For all the Might One has done My life will proclaim ________________.", a: "Holy is His Name" },
  ],
  "ReCamp Review": [
    { q: "🦑 sa campo de kusina, sinu-sino ang naghiwa ng ingredients?", a: "Bro. Joshua & Bro. Marshall" },
    { q: "🐶 anong pangalan ng golden retriever sa Phillip’s Sanctuary?", a: "Kairo" },
    { q: "💪 saan naitago ang mga wise/strongest member nung amazing race?", a: "Bro. Ron Ramossshhhh" },
    { q: "⛪ anong pangalan ng brother na kasama ni Fr. Jean Christopher?", a: "Bro. Mary David" },
  ],
  "Dapat Alam Mo": [
    { q: "anong mystery ng rosary ang dinadasal pag Thursday?", a: "Luminous Mystery" },
    { q: "anong pangalan ng field na pinaglaruan at kung saan bonfire?", a: "Marky BAKURAN" },
    { q: "ilang beads and meron sa isang rosary?", a: "59 beads" },
    { q: "sinong patron saint ang dinadasal pag nawawala ang bagay bagay?", a: "St. Anthony of Padua" },
  ],
  "Kanta Haa?": [
    { q: "anong most listened song ng feast worship?", a: "Never Fail" },
    { q: "anong ang kinakanta bago mag gospel?", a: "Alleluia" },
    { q: "anu-ano ang mga lenggwaheng nasa kantang tribes ng victory worship?", a: "English, Filipino, and Spanish" },
    { q: "ilang i surrender ang nabanggit sa kantang i surrender ng feast worship?", a: "24 I Surrender's" }
  ],
};

const CATEGORY_ICONS = {
  "Reyal Or Fakeh": `<img src="./img/reyalorfakeh.png" alt="Science Icon" style="width: 120px; height: auto;"><img/>`,
  "Spot-ify": `<img src="./img/spotify.png" alt="Science Icon" style="width: 120px; height: auto;"><img/>`,
  "ReCamp Review": `<img src="./img/recampreview.png" alt="Science Icon" style="width: 120px; height: auto;"><img/>`,
  "Dapat Alam Mo": `<img src="./img/dapatalammo.png" alt="Science Icon" style="width: 120px; height: auto;"><img/>`,
  "Kanta Haa?": `<img src="./img/kantaha.png" alt="Science Icon" style="width: 120px; height: auto;"><img/>`,
};

let teams = [
  { name: "Sky Bound", score: 0 },
  { name: "Golden Faith", score: 0 },
  { name: "Jablee", score: 0 },
  { name: "Greeniation", score: 0 },
  { name: "Royal-Teas", score: 0 },
  { name: "Ca-campink", score: 0 },
];
let used = {}; // key `${cat}-${p}` -> true once played

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('scoreboard');
const overlay = document.getElementById('overlay');
const modalTag = document.getElementById('modalTag');
const modalQuestion = document.getElementById('modalQuestion');
const modalAnswer = document.getElementById('modalAnswer');
const revealBtn = document.getElementById('revealBtn');
const awardRow = document.getElementById('awardRow');
const closeBtn = document.getElementById('closeBtn');

let current = null;

function renderScoreboard() {
  scoreEl.innerHTML = '';
  teams.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'team';
    div.innerHTML = `
        <input type="text" value="${t.name}" aria-label="Team name" data-i="${i}">
        <div class="score">${t.score}</div>
        <div class="btnrow">
          <button data-i="${i}" data-d="1">+1</button>
          <button data-i="${i}" data-d="-1">−1</button>
        </div>`;
    scoreEl.appendChild(div);
  });
  scoreEl.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', e => {
      teams[+e.target.dataset.i].name = e.target.value || `Team ${+e.target.dataset.i + 1}`;
    });
  });
  scoreEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      teams[+btn.dataset.i].score += +btn.dataset.d;
      renderScoreboard();
    });
  });
}

function renderBoard() {
  boardEl.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const c = document.createElement('div');
    c.className = 'cat';
    c.innerHTML = CATEGORY_ICONS[cat];
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', cat);
    c.title = cat;
    boardEl.appendChild(c);
  });
  POINTS.forEach((pts, p) => {
    CATEGORIES.forEach(cat => {
      const key = `${cat}-${p}`;
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.textContent = pts.toLocaleString();
      btn.disabled = !!used[key];
      if (!used[key]) btn.addEventListener('click', () => openQuestion(cat, p));
      boardEl.appendChild(btn);
    });
  });
}

function openQuestion(cat, p) {
  current = { cat, p, key: `${cat}-${p}` };
  const item = DATA[cat][p];
  modalTag.textContent = `${cat} — ${POINTS[p].toLocaleString()}`;
  modalQuestion.textContent = item.q;
  modalAnswer.textContent = item.a;
  modalAnswer.classList.remove('shown');
  awardRow.classList.remove('shown');
  revealBtn.style.display = 'inline-block';
  overlay.classList.add('open');
}

revealBtn.addEventListener('click', () => {
  modalAnswer.classList.add('shown');
  revealBtn.style.display = 'none';
  awardRow.innerHTML = '';
  teams.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'action';
    b.textContent = `Award ${POINTS[current.p].toLocaleString()} to ${t.name}`;
    b.addEventListener('click', () => {
      teams[i].score += POINTS[current.p];
      finishQuestion();
    });
    awardRow.appendChild(b);
  });
  const skip = document.createElement('button');
  skip.className = 'action';
  skip.style.background = '#232B7A';
  skip.textContent = 'No one got it';
  skip.addEventListener('click', finishQuestion);
  awardRow.appendChild(skip);
  awardRow.classList.add('shown');
});

function finishQuestion() {
  used[current.key] = true;
  overlay.classList.remove('open');
  renderBoard();
  renderScoreboard();
  current = null;
}

closeBtn.addEventListener('click', () => {
  if (current) used[current.key] = true;
  overlay.classList.remove('open');
  renderBoard();
  current = null;
});

renderScoreboard();
renderBoard();