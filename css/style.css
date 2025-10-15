:root{
  --bg:#061221;
  --card:#0d1a26;
  --muted:#7b8a93;
  --accent:#5be0c3;   /* Rialo-like accent */
  --accent-2:#62d2be;
  --text:#eaf6f5;
  --glass:rgba(255,255,255,0.03);
}

*{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;}
body{margin:0;background:linear-gradient(180deg,var(--bg),#03121a);color:var(--text);min-height:100vh;display:flex;flex-direction:column;}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.03)}
.brand{display:flex;align-items:center;gap:12px}
#logo{width:56px;height:56px;object-fit:contain;border-radius:8px}
.brand-text h1{margin:0;font-size:1.1rem}
.brand-text .subtitle{font-size:0.85rem;color:var(--muted)}
.top-actions{display:flex;gap:10px;align-items:center}
.btn{background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px 12px;border-radius:8px;color:var(--text);cursor:pointer}
.btn.primary{background:var(--accent);color:#041018;border:none}
.btn.hidden{display:none}
.addr{padding:8px 10px;border-radius:8px;background:rgba(0,0,0,0.25);font-weight:700}
.hidden{display:none}

/* layout */
.container{display:flex;gap:18px;padding:24px;align-items:flex-start;flex:1;max-width:1100px;margin:0 auto;width:100%}
.left-column{width:280px;display:flex;flex-direction:column;gap:14px}
.card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:16px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.6)}
.card-head{font-weight:700;margin-bottom:12px;color:var(--accent)}
.card-foot{margin-top:12px;display:flex;gap:8px;justify-content:flex-end;align-items:center}

/* progress */
.progress-wrap{position:relative;height:12px;background:rgba(255,255,255,0.03);border-radius:8px;margin:10px 0;padding:6px}
.progress-bar{position:absolute;left:6px;right:6px;top:6px;height:6px;background:linear-gradient(90deg,var(--accent),var(--accent-2));width:0%;border-radius:6px;transition:width .5s ease}
.node{position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--text)}
.node[data-i="0"]{left:6px;transform:translateX(-50%)}
.node[data-i="1"]{left:50%;transform:translateX(-50%)}
.node[data-i="2"]{right:6px;transform:translateX(50%)}
.node.active{background:var(--accent);color:#001218}

/* mission mini */
.missions-compact{display:flex;gap:8px;margin-top:8px}
.mission-mini{flex:1;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);text-align:center;font-weight:600;color:var(--muted)}

/* game area */
.game-area{flex:1;display:flex;flex-direction:column;gap:14px}
.game-card{min-height:320px;display:flex;flex-direction:column;justify-content:center;align-items:center}
.mission-title{font-size:1.2rem;font-weight:700;margin-bottom:8px}
.mission-desc{color:var(--muted);margin-bottom:16px}
.mission-ui{min-height:120px;display:flex;align-items:center;justify-content:center}

/* logs */
.logs{max-height:220px;overflow:auto;padding:8px;background:rgba(0,0,0,0.12);border-radius:8px}
.log-item{padding:8px;border-bottom:1px dashed rgba(255,255,255,0.02);font-size:0.9rem}
.log-item .time{color:var(--muted);font-size:0.8rem;margin-left:8px}

/* leaderboard */
.leaderboard{display:flex;flex-direction:column;gap:8px}
.lb-row{display:flex;justify-content:space-between;padding:8px;background:rgba(255,255,255,0.02);border-radius:8px}
.lb-row .wallet{font-family:monospace;color:var(--accent)}

/* responsive */
@media (max-width:880px){
  .container{flex-direction:column;padding:14px}
  .left-column{width:100%}
  .game-area{order:2}
}
.footer{text-align:center;padding:18px;color:var(--muted);font-size:13px}
