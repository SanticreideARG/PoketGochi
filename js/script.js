const TWEAKS = {
  "petName": "PIO",
  "speed": 1,
  "night": true,
  "autoHop": true
};

const STATE = {
  happy: 8, hunger: 6, energy: 7,
  sleeping: false, excited: false, sick: false,
  maxPips: 10,
  coins: parseInt(localStorage.getItem('poketgochi_coins')) || 0
};

const INVENTORY = JSON.parse(localStorage.getItem('poketgochi_inv')) || { headphones: false, recordplayer: false, glasses: false, guitar: false };

function updateInventoryUI() {
  document.getElementById('item-headphones').style.display = INVENTORY.headphones ? 'block' : 'none';
  document.getElementById('item-recordplayer').style.display = INVENTORY.recordplayer ? 'block' : 'none';
  document.getElementById('item-glasses').style.display = INVENTORY.glasses ? 'block' : 'none';
  document.getElementById('item-guitar').style.display = INVENTORY.guitar ? 'block' : 'none';

  if(INVENTORY.headphones) {
    const btn = document.querySelector('#shop-hp .buy-btn');
    if(btn) { btn.textContent = 'Comprado'; btn.disabled = true; }
  }
  if(INVENTORY.recordplayer) {
    const btn = document.querySelector('#shop-rp .buy-btn');
    if(btn) { btn.textContent = 'Comprado'; btn.disabled = true; }
  }
  if(INVENTORY.glasses) {
    const btn = document.querySelector('#shop-gl .buy-btn');
    if(btn) { btn.textContent = 'Comprado'; btn.disabled = true; }
  }
  if(INVENTORY.guitar) {
    const btn = document.querySelector('#shop-gt .buy-btn');
    if(btn) { btn.textContent = 'Comprado'; btn.disabled = true; }
  }
}
updateInventoryUI();

function buyItem(item, price) {
  if (item !== 'candy' && INVENTORY[item]) return;
  if (STATE.coins >= price) {
    STATE.coins -= price;
    localStorage.setItem('poketgochi_coins', STATE.coins);
    updateCoinsDisplay();

    if (item === 'candy') {
      STATE.happy = clamp(STATE.happy + 2);
      STATE.hunger = clamp(STATE.hunger + 2);
      STATE.energy = clamp(STATE.energy + 2);
      renderMeters();
      say("¡qué rico!", 1500);
      pulseExcited(1200);
    } else {
      INVENTORY[item] = true;
      localStorage.setItem('poketgochi_inv', JSON.stringify(INVENTORY));
      updateInventoryUI();
      say("¡gracias!", 1500);
    }
  } else {
    say("¡no alcanza!", 1500);
  }
}

function updateCoinsDisplay() {
  const coinsSpan = document.querySelector('#coins span');
  if (coinsSpan) {
    coinsSpan.textContent = STATE.coins;
  }
}
updateCoinsDisplay();

let coinTimer = 0;
setInterval(() => {
  let speed = 1;
  if (INVENTORY.guitar) speed = 1.3;
  coinTimer += 1000 * speed;
  if (coinTimer >= 20000) {
    STATE.coins++;
    coinTimer -= 20000;
    localStorage.setItem('poketgochi_coins', STATE.coins);
    updateCoinsDisplay();
  }
}, 1000);

function renderMeters(){
  document.querySelectorAll('[data-meter]').forEach(m => {
    const key = m.dataset.meter;
    const val = Math.round(STATE[key]);
    let html = '';
    for(let i=0;i<STATE.maxPips;i++){
      let cls = 'pip';
      if(i < val) cls += val <= 2 ? ' warn' : ' on';
      html += `<div class="${cls}"></div>`;
    }
    m.innerHTML = html;
  });
}

function tickClock(){
  const d = new Date();
  document.getElementById('clock').textContent =
    `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
setInterval(tickClock, 1000); tickClock();

let bubbleTimer;
function say(text, dur = 1600){
  const b = document.getElementById('bubble');
  b.textContent = text;
  b.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove('show'), dur);
}

const owl = document.getElementById('owl');
function setStateClass(){
  owl.classList.toggle('sleeping', STATE.sleeping);
  owl.classList.toggle('excited', STATE.excited);
  owl.classList.toggle('sick', STATE.sick);
  document.getElementById('zzz').classList.toggle('show', STATE.sleeping);
  document.getElementById('swirl').classList.toggle('show', STATE.sick);
}
const clamp = v => Math.max(0, Math.min(STATE.maxPips, v));

function feed(){
  if(STATE.sleeping){ say("zzz..."); return; }
  STATE.hunger = clamp(STATE.hunger + 3);
  STATE.happy = clamp(STATE.happy + 1);
  spawnCrumbs(8);
  say("¡ñam!");
  pulseExcited(900);
}
function play(){
  if(STATE.sleeping){ say("zzz..."); return; }
  if(STATE.energy < 2){ say("...cansado"); return; }
  STATE.happy = clamp(STATE.happy + 3);
  STATE.energy = clamp(STATE.energy - 2);
  STATE.hunger = clamp(STATE.hunger - 1);
  spawnHearts(6);
  say("¡yupi!");
  pulseExcited(1400);
}
function sleep(){
  STATE.sleeping = !STATE.sleeping;
  if(STATE.sleeping) say("buenas noches", 1200);
  else { say("¡buen día!", 1200); STATE.energy = clamp(STATE.energy + 3); }
  setStateClass();
}
function clean(){
  if(STATE.sleeping){ say("zzz..."); return; }
  STATE.sick = false;
  STATE.happy = clamp(STATE.happy + 1);
  say("¡limpio!");
  setStateClass();
}
function pulseExcited(dur){
  STATE.excited = true; setStateClass();
  setTimeout(() => { STATE.excited = false; setStateClass(); }, dur);
}
function spawnHearts(n){
  const layer = document.getElementById('hearts');
  for(let i=0;i<n;i++){
    const h = document.createElement('div');
    h.className = 'heart'; h.textContent = '♥';
    h.style.left = (35 + Math.random()*30) + '%';
    h.style.top = (50 + Math.random()*15) + '%';
    h.style.animationDelay = (i*0.12) + 's';
    layer.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
}
function spawnCrumbs(n){
  const layer = document.getElementById('crumbs');
  for(let i=0;i<n;i++){
    const c = document.createElement('div');
    c.className = 'crumb';
    c.style.left = (38 + Math.random()*24) + '%';
    c.style.top = (62 + Math.random()*8) + '%';
    c.style.setProperty('--dx', ((Math.random()-0.5)*60)+'px');
    c.style.animationDelay = (i*0.05) + 's';
    layer.appendChild(c);
    setTimeout(() => c.remove(), 1200);
  }
}

setInterval(() => {
  if(!STATE.sleeping){
    STATE.hunger = clamp(STATE.hunger - 0.3);
    let energyDecay = 0.15;
    if (INVENTORY.glasses) energyDecay *= 0.7;
    STATE.energy = clamp(STATE.energy - energyDecay);
    if(STATE.hunger < 3 || STATE.happy < 3) {
      let decay = 0.2;
      if (INVENTORY.headphones) decay *= 0.8;
      if (INVENTORY.recordplayer) decay *= 0.7;
      STATE.happy = clamp(STATE.happy - decay);
    }
    if(STATE.hunger <= 0 && Math.random() < 0.1) STATE.sick = true;
  } else {
    STATE.energy = clamp(STATE.energy + 0.4);
    STATE.hunger = clamp(STATE.hunger - 0.1);
  }
  setStateClass();
  renderMeters();
}, 4000);

setInterval(() => {
  if(STATE.sleeping) return;
  if(Math.random() < 0.18) {
    const phrases = ["¡hu hu!","¡pío!","♪","..."];
    say(phrases[Math.floor(Math.random()*phrases.length)], 1000);
  }
}, 5500);

setInterval(() => {
  if(STATE.sleeping) return;
  const longPhrases = [
    "Tengo hambre",
    "Tengo Sueño",
    "Estoy Sucio",
    "Quiero Jugar",
    "Eres aburrido",
    "Eres muy divertido",
    "Me agradas",
    "Mi GPS es la luna llena.",
    "El búho nunca llega tarde, siempre aparece de noche.",
    "Soy búho: trabajo en el turno más silencioso.",
    "El búho en el cine: solo compra entradas para funciones de medianoche.",
    "Un búho influencer: transmite en vivo a las 3 AM.",
    "El búho gamer: nunca apaga la consola, solo la pone en modo nocturno."
  ];
  say(longPhrases[Math.floor(Math.random() * longPhrases.length)], 4000);
}, 50000);

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.dataset.action;
    if(a==='feed') feed();
    else if(a==='play') play();
    else if(a==='sleep') sleep();
    else if(a==='clean') clean();
    else if(a==='shop') document.getElementById('shopModal').classList.add('open');
    renderMeters();
  });
});

document.getElementById('closeShop').addEventListener('click', () => {
  document.getElementById('shopModal').classList.remove('open');
});

const exitBtn = document.getElementById('exitBtn');
if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    window.close();
  });
}

function applyTweaks(){
  document.getElementById('petName').textContent = TWEAKS.petName || 'PIO';
  document.body.classList.toggle('night', !!TWEAKS.night);
  const sp = TWEAKS.speed || 1;
  const overrides = [
    ['.owl', TWEAKS.autoHop ? (2.6/sp)+'s' : '0s'],
    ['.eyelid', (5/sp)+'s'],
    ['.beak-bottom-grp', (3.4/sp)+'s'],
    ['.wing-left', (2.2/sp)+'s'],
    ['.wing-right', (2.2/sp)+'s'],
    ['.breathe', (3/sp)+'s']
  ];
  overrides.forEach(([sel, dur]) => {
    document.querySelectorAll(sel).forEach(el => {
      if(dur === '0s') el.style.animation = 'none';
      else { el.style.animation = ''; el.style.animationDuration = dur; }
    });
  });
}
applyTweaks(); renderMeters(); setStateClass();

/* =================== EVOLUTION =================== */
const EVO_KEY = 'poketgochi_evolved';
function isEvolved(){ return localStorage.getItem(EVO_KEY) === '1'; }
function setEvolved(v){
  if(v){ localStorage.setItem(EVO_KEY, '1'); document.body.classList.add('is-evolved'); }
  else { localStorage.removeItem(EVO_KEY); document.body.classList.remove('is-evolved'); }
}
let evoLock = false;
function runEvolution(){
  if(evoLock) return;
  if(isEvolved()){ say("¡ya evolucionó!", 1500); return; }
  evoLock = true;
  const btn = document.getElementById('evolveBtn');
  if(btn) btn.disabled = true;

  document.getElementById('bubble').classList.remove('show');
  STATE.sleeping = false; setStateClass();

  document.body.classList.add('evo-running');
  say("...!", 600);

  setTimeout(() => {
    document.body.classList.add('is-evolved');
    localStorage.setItem(EVO_KEY, '1');
  }, 2100);

  setTimeout(() => {
    document.body.classList.remove('evo-running');
    evoLock = false;
    if(btn) btn.disabled = false;
    say("¡EVOLUCIÓN!", 2000);
    spawnHearts(8);
    pulseExcited(1600);
  }, 3300);
}
function resetEvolution(){
  if(evoLock) return;
  setEvolved(false);
  document.body.classList.remove('evo-running');
  const btn = document.getElementById('evolveBtn');
  if(btn) btn.disabled = false;
  say("rebobinando...", 1200);
}
if(isEvolved()) document.body.classList.add('is-evolved');

document.getElementById('evolveBtn').addEventListener('click', runEvolution);
document.getElementById('resetEvolveBtn').addEventListener('click', resetEvolution);

/* tweaks panel */
let panelEl = null;
function buildPanel(){
  if(panelEl) return panelEl;
  panelEl = document.createElement('div');
  panelEl.style.cssText = `
    position: fixed; bottom: 16px; left: 16px; z-index: 9999;
    width: 240px; padding: 14px; border-radius: 14px;
    background: rgba(28, 18, 10, 0.92); color: #fff8e9;
    font-family: 'Fredoka', sans-serif; font-size: 12px;
    backdrop-filter: blur(8px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
  `;
  panelEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <strong style="letter-spacing:0.1em;">Tweaks</strong>
      <button id="tw-close" style="background:transparent;border:0;color:#fff8e9;font-size:18px;cursor:pointer;line-height:1;">×</button>
    </div>
    <label style="display:block;margin-bottom:8px;">
      Nombre
      <input id="tw-name" value="${TWEAKS.petName}" style="width:100%;margin-top:4px;padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.3);color:#fff;font-family:inherit;text-transform:uppercase;letter-spacing:0.1em;">
    </label>
    <label style="display:block;margin-bottom:8px;">
      Velocidad: <span id="tw-speed-v">${TWEAKS.speed.toFixed(1)}x</span>
      <input id="tw-speed" type="range" min="0.3" max="3" step="0.1" value="${TWEAKS.speed}" style="width:100%;">
    </label>
    <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:pointer;">
      <input id="tw-night" type="checkbox" ${TWEAKS.night?'checked':''}> Modo noche
    </label>
    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
      <input id="tw-hop" type="checkbox" ${TWEAKS.autoHop?'checked':''}> Saltos automáticos
    </label>
  `;
  document.body.appendChild(panelEl);
  const persist = (edits) => {
    Object.assign(TWEAKS, edits);
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits}, '*'); } catch(e){}
    applyTweaks();
  };
  panelEl.querySelector('#tw-name').addEventListener('input', e => persist({petName: e.target.value.toUpperCase()}));
  panelEl.querySelector('#tw-speed').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    panelEl.querySelector('#tw-speed-v').textContent = v.toFixed(1)+'x';
    persist({speed: v});
  });
  panelEl.querySelector('#tw-night').addEventListener('change', e => persist({night: e.target.checked}));
  panelEl.querySelector('#tw-hop').addEventListener('change', e => persist({autoHop: e.target.checked}));
  panelEl.querySelector('#tw-close').addEventListener('click', () => {
    panelEl.style.display = 'none';
    try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e){}
  });
  return panelEl;
}
window.addEventListener('message', (e) => {
  const t = e.data && e.data.type;
  if(t === '__activate_edit_mode'){ buildPanel().style.display = 'block'; }
  else if(t === '__deactivate_edit_mode'){ if(panelEl) panelEl.style.display = 'none'; }
});
try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
