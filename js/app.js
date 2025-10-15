/* ====== Rialo Mission Simulator - app.js ======
   - MetaMask wallet connect (real wallet)
   - Missions (3 types)
   - Mission logs (localStorage)
   - Local leaderboard (localStorage)
   - Simple UI glue
*/

// ---------- Helpers ----------
const $ = sel => document.querySelector(sel);
const fmtAddr = a => a ? (a.slice(0,6) + '...' + a.slice(-4)) : '';
const nowStr = () => new Date().toLocaleString();

// ---------- State ----------
let state = {
  wallet: null,
  address: null,
  missionIndex: 0,
  missions: [],
  score: 0
};

// ---------- DOM refs ----------
const connectBtn = $('#connect-btn');
const addrDisplay = $('#addr-display');
const startBtn = $('#start-btn');
const missionTitle = $('#mission-title');
const missionDesc = $('#mission-desc');
const missionUI = $('#mission-ui');
const actionBtn = $('#action-btn');
const nextBtn = $('#next-btn');
const progressBar = $('#progress-bar');
const nodes = document.querySelectorAll('.node');
const logsEl = $('#logs');
const leaderboardBtn = $('#leaderboard-btn');
const leaderboardCard = $('#leaderboard-card');
const leaderboardEl = $('#leaderboard');
const exportLogsBtn = $('#export-logs');
const clearLeaderboardBtn = $('#clear-leaderboard');

// ---------- Missions data ----------
state.missions = [
  {
    id: 'm1',
    title: 'Mission 1 — Trigger an Event',
    desc: 'Click the button to send a simulated event into the network.',
    type: 'click',
    points: 100
  },
  {
    id: 'm2',
    title: 'Mission 2 — Bridge Web2 + Web3',
    desc: 'Drag the puzzle piece into the target zone to complete the bridge.',
    type: 'drag',
    points: 150
  },
  {
    id: 'm3',
    title: 'Mission 3 — Secure the Network',
    desc: 'Answer the quick quiz to secure the network node.',
    type: 'quiz',
    points: 200
  }
];

// ---------- Storage keys ----------
const LOGS_KEY = 'rialo_mission_logs_v1';
const LB_KEY = 'rialo_leaderboard_v1';

// ---------- Wallet (MetaMask) ----------
async function connectMetaMask() {
  if (!window.ethereum) {
    alert('No injected wallet detected. Install MetaMask or use a Web3-enabled browser.');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    state.address = accounts[0];
    addrDisplay.textContent = fmtAddr(state.address);
    addrDisplay.classList.remove('hidden');
    connectBtn.style.display = 'none';
    saveSession();
    addLog('Wallet connected: ' + fmtAddr(state.address));
  } catch (e) {
    console.error('Wallet connect error', e);
    alert('Wallet connection failed.');
  }
}
connectBtn.addEventListener('click', connectMetaMask);

// ---------- Session save (simple in-memory persistence) ----------
function saveSession() {
  const s = { address: state.address };
  sessionStorage.setItem('rialo_session', JSON.stringify(s));
}
function loadSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem('rialo_session') || '{}');
    if (s && s.address) {
      state.address = s.address;
      addrDisplay.textContent = fmtAddr(state.address);
      addrDisplay.classList.remove('hidden');
      connectBtn.style.display = 'none';
    }
  } catch(e){}
}
loadSession();

// ---------- Mission flow ----------
function updateProgress() {
  const p = Math.round((state.missionIndex / state.missions.length) * 100);
  progressBar.style.width = p + '%';
  nodes.forEach((n,i)=> {
    if (i < state.missionIndex) n.classList.add('active'); else n.classList.remove('active');
  });
}

function showMission(index) {
  const m = state.missions[index];
  if (!m) return finishAll();
  missionTitle.textContent = m.title;
  missionDesc.innerHTML = m.desc;
  missionUI.innerHTML = '';
  actionBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');

  // Build UI per type
  if (m.type === 'click') {
    actionBtn.textContent = 'Send Event';
    actionBtn.classList.remove('hidden');
    missionUI.innerHTML = `<div style="text-align:center;color:var(--muted)">Simulated event → press button</div>`;
    actionBtn.onclick = () => {
      addLog(`Event sent (${m.title})`);
      awardPoints(m.points);
      showCompletion(m);
    };
  } else if (m.type === 'drag') {
    missionUI.innerHTML = `
      <div id="drag-area" style="width:300px;height:120px;border-radius:8px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:space-around;padding:12px">
        <div id="piece" draggable="true" style="width:64px;height:64px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:grab">P</div>
        <div id="target" style="width:90px;height:90px;border:2px dashed rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted)">Drop</div>
      </div>
      <div style="margin-top:10px;color:var(--muted);font-size:0.9rem">Drag the piece into the target to complete the bridge.</div>
    `;
    const piece = document.getElementById('piece');
    const target = document.getElementById('target');
    piece.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain','piece'); });
    target.addEventListener('dragover', e => e.preventDefault());
    target.addEventListener('drop', e => {
      e.preventDefault();
      target.style.background = 'linear-gradient(90deg,var(--accent),var(--accent-2))';
      addLog(`Bridge assembled (${m.title})`);
      awardPoints(m.points);
      showCompletion(m);
    });
  } else if (m.type === 'quiz') {
    missionUI.innerHTML = `
      <div style="max-width:420px">
        <div style="margin-bottom:8px">What is the Rialo core idea?</div>
        <div id="quiz-opts" style="display:flex;flex-direction:column;gap:8px">
          <button class="btn opt">A — Event-driven web3 that bridges Web2</button>
          <button class="btn opt">B — A wallet provider only</button>
          <button class="btn opt">C — A social network</button>
        </div>
      </div>
    `;
    document.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', (e)=>{
      const ans = e.target.textContent;
      if (ans.startsWith('A')) {
        addLog(`Quiz correct (${m.title})`);
        awardPoints(m.points);
        showCompletion(m);
      } else {
        addLog(`Quiz wrong (${m.title})`);
        missionDesc.innerHTML = `<span style="color:#ff7b72">Incorrect — try again or press Next to skip.</span>`;
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = () => {
          showCompletion(m,false);
        };
      }
    }));
  }
  updateProgress();
}

function showCompletion(m, success=true) {
  missionDesc.innerHTML = success ? `<span style="color:var(--accent)">Mission complete — +${m.points} points</span>` :
    `<span style="color:var(--muted)">Mission skipped</span>`;
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = state.missionIndex === state.missions.length -1 ? 'Finish' : 'Next Mission';
  nextBtn.onclick = () => {
    state.missionIndex++;
    saveLogsToStorage();
    if (state.missionIndex < state.missions.length) showMission(state.missionIndex);
    else finishAll();
  };
}

function awardPoints(p) {
  state.score += p;
  addLog(`+${p} points (score: ${state.score})`);
  // save temporary score for leaderboard submission afterwards
}

// ---------- Mission control ----------
startBtn.addEventListener('click', () => {
  state.missionIndex = 0;
  state.score = 0;
  showMission(0);
  addLog('Mission run started');
});

// ---------- Mission logs ----------
function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  } catch(e){ return []; }
}
function saveLogsToStorage() {
  // we persist the last X logs (keeps history)
  localStorage.setItem(LOGS_KEY, JSON.stringify(getLogs()));
}
function addLog(text) {
  const logs = getLogs();
  const item = { text, time: nowStr() };
  logs.unshift(item);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0,200)));
  renderLogs();
}
function renderLogs() {
  const logs = getLogs();
  if (!logs || logs.length === 0) {
    logsEl.innerHTML = '<div style="color:var(--muted)">No mission activity yet.</div>';
    return;
  }
  logsEl.innerHTML = logs.map(l => `<div class="log-item">${l.text}<div class="time">${l.time}</div></div>`).join('');
}
exportLogsBtn.addEventListener('click', () => {
  const data = JSON.stringify(getLogs(), null, 2);
  const blob = new Blob([data],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'rialo_mission_logs.json'; a.click();
  URL.revokeObjectURL(url);
});

// ---------- Leaderboard (local) ----------
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); } catch(e){ return []; }
}
function saveLeaderboard(lb) { localStorage.setItem(LB_KEY, JSON.stringify(lb)); }
function submitScore() {
  if (!state.address) {
    alert('Connect wallet to submit your score to the leaderboard.');
    return;
  }
  const lb = getLeaderboard();
  lb.push({ wallet: state.address, score: state.score, missions: state.missionIndex, time: nowStr() });
  // sort desc and keep top 10
  lb.sort((a,b)=>b.score - a.score);
  saveLeaderboard(lb.slice(0,20));
  renderLeaderboard();
  addLog(`Score submitted: ${state.score} (${fmtAddr(state.address)})`);
}
function renderLeaderboard() {
  const lb = getLeaderboard();
  if (!lb || lb.length === 0) {
    leaderboardEl.innerHTML = `<div style="color:var(--muted)">No scores yet. Play a mission and submit.</div>`;
    return;
  }
  leaderboardEl.innerHTML = lb.slice(0,10).map((r,i) => `
    <div class="lb-row">
      <div>#${i+1} <span style="margin-left:6px" class="wallet">${fmtAddr(r.wallet)}</span></div>
      <div>${r.score} pts / ${r.missions} missions</div>
    </div>
  `).join('');
}
leaderboardBtn.addEventListener('click', ()=>{
  leaderboardCard.style.display = leaderboardCard.style.display === 'none' ? 'block' : 'none';
  renderLeaderboard();
});
clearLeaderboardBtn.addEventListener('click', ()=>{
  if (!confirm('Clear local leaderboard?')) return;
  localStorage.removeItem(LB_KEY);
  renderLeaderboard();
});

// ---------- When finished all missions ----------
function finishAll() {
  missionTitle.textContent = '🏁 All missions complete — Mission run finished';
  missionDesc.innerHTML = `Your score: <strong>${state.score}</strong>. Submit to the leaderboard to record your run.`;
  missionUI.innerHTML = `<div><button id="submit-score" class="btn primary">Submit Score</button></div>`;
  document.getElementById('submit-score').addEventListener('click', submitScore);
  updateProgress();
  addLog('All missions completed. Score: ' + state.score);
}

// ---------- Init ----------
function init() {
  renderLogs();
  renderLeaderboard();
  updateProgress();
  // show first "welcome" mission message
  missionTitle.textContent = 'Welcome, Builder 👾';
  missionDesc.textContent = 'Press Start Mission to begin your first mission. Connect a wallet to submit scores.';
}
init();
