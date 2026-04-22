/**
 * Code Wars v2.0 — hybrid arcade + boss Q&A (from index_4.html).
 * Portfolio build: boot, mobile capture, no ctx.ellipse, no inline onclick.
 */
(function () {
  "use strict";

  function boot() {
var cwShell = document.getElementById('cw-shell');
    const canvas = document.getElementById('game-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 720, H = 400;

  const C = {
    bg:'#060a10', grid:'#0c1220', accent:'#00c896',
    blue:'#1a7dff', red:'#ff6b6b', yellow:'#f5a623',
    purple:'#a855f7', muted:'#6b7b93', text:'#dce4f0',
    ship:'#00c896', bullet:'#00ffbb', shield:'#1a7dff'
  };

  // ── Q&A BANK (20 questions, 4 categories) ──────────────────
  const QA_BANK = [
    // PHP / Laravel
    { cat:'PHP', color:'#818cf8',
      q: "What does this PHP code return?",
      code: "function add($a, $b) {\n  $result = $a + $b;\n}\necho add(3, 4);",
      opts:["7","null","0","Error"], ans:1,
      exp:"The function never returns — missing 'return $result'. PHP returns null implicitly." },
    { cat:'LARAVEL', color:'#f97316',
      q: "Which Eloquent method eagerly loads relationships to prevent N+1 queries?",
      opts:["->load()","->with()","->join()","->include()"], ans:1,
      exp:"->with('relation') eager-loads related models in one extra query instead of N queries." },
    { cat:'PHP', color:'#818cf8',
      q: "What HTTP status code should a REST API return when a resource is successfully CREATED?",
      opts:["200 OK","204 No Content","201 Created","202 Accepted"], ans:2,
      exp:"201 Created is the correct response when a POST request successfully creates a new resource." },
    { cat:'LARAVEL', color:'#f97316',
      q: "In Laravel, where should you put business logic — Controller or Service class?",
      opts:["Controller, it's faster","Service class — keeps controllers thin","Model, closest to data","Middleware"], ans:1,
      exp:"Fat controllers are an anti-pattern. Service classes keep business logic testable, reusable, and separated from HTTP handling." },
    // MySQL / Database
    { cat:'MYSQL', color:'#00b4d8',
      q: "Why is this query slow on 1M rows even with an index on created_at?",
      code: "SELECT * FROM orders\nWHERE YEAR(created_at) = 2024;",
      opts:["SELECT * is too broad","YEAR() wraps the column — index cannot be used","Missing LIMIT clause","2024 needs quotes"], ans:1,
      exp:"Wrapping an indexed column in a function prevents index usage. Use: WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'" },
    { cat:'MYSQL', color:'#00b4d8',
      q: "What does adding an INDEX on a frequently queried column primarily improve?",
      opts:["Write speed","Storage size","Read query speed","Connection pooling"], ans:2,
      exp:"Indexes speed up SELECT queries by letting MySQL find rows without a full table scan. They slightly slow down writes." },
    { cat:'MYSQL', color:'#00b4d8',
      q: "Which SQL clause filters AFTER aggregation (GROUP BY)?",
      opts:["WHERE","FILTER","HAVING","AND"], ans:2,
      exp:"HAVING filters grouped results. WHERE filters rows before grouping. Example: GROUP BY user_id HAVING COUNT(*) > 5" },
    { cat:'MYSQL', color:'#00b4d8',
      q: "A transaction ensures which property — if one query fails, all queries in the batch are rolled back?",
      opts:["Indexing","Atomicity","Normalization","Replication"], ans:1,
      exp:"Atomicity is the 'A' in ACID. A transaction is all-or-nothing — either every query succeeds or none of them persist." },
    // Node.js / Backend
    { cat:'NODE.JS', color:'#4ade80',
      q: "What is wrong with this Node.js code?",
      code: "async function getUser(id) {\n  return db.query('SELECT * FROM users WHERE id=?', [id]);\n}\n\ngetUser(42);",
      opts:["db.query() doesn't exist","getUser(42) has no await/.catch() — unhandled rejection","async functions can't return","SQL syntax error"], ans:1,
      exp:"Calling an async function without await or .catch() means any thrown error becomes an unhandled promise rejection — a production crash." },
    { cat:'NODE.JS', color:'#4ade80',
      q: "Which Node.js feature allows real-time bidirectional communication between server and client?",
      opts:["REST","GraphQL","WebSockets","HTTP long-polling"], ans:2,
      exp:"WebSockets maintain a persistent, full-duplex connection — ideal for real-time features like chat, live tracking, and auctions." },
    { cat:'NODE.JS', color:'#4ade80',
      q: "What does Redis primarily excel at compared to MySQL?",
      opts:["Complex joins","In-memory key-value caching with sub-millisecond reads","Storing large files","Full-text search"], ans:1,
      exp:"Redis stores data in RAM — reads are 10-100x faster than disk-based databases. Perfect for sessions, caching, and pub/sub." },
    // Architecture
    { cat:'ARCHITECTURE', color:'#e879f9',
      q: "What pattern does this describe: 'Every state change is stored as an immutable event. Current state is rebuilt by replaying events.'",
      opts:["CQRS","Event Sourcing","Microservices","Repository Pattern"], ans:1,
      exp:"Event Sourcing stores every mutation as an append-only event. It provides full audit trail, time-travel, and is mandatory in FinTech." },
    { cat:'ARCHITECTURE', color:'#e879f9',
      q: "What does SOLID stand for? Which principle says 'a class should have only ONE reason to change'?",
      opts:["Open/Closed","Dependency Inversion","Single Responsibility","Liskov Substitution"], ans:2,
      exp:"Single Responsibility Principle (SRP) — each class/module should do one thing. Mixing concerns creates fragile, untestable code." },
    { cat:'ARCHITECTURE', color:'#e879f9',
      q: "In a high-traffic system, what is the main purpose of a Message Queue (RabbitMQ, SQS)?",
      opts:["Replace the database","Decouple services and smooth out traffic spikes asynchronously","Speed up SQL queries","Encrypt API responses"], ans:1,
      exp:"Message queues decouple producers from consumers — heavy tasks (emails, reports) are processed asynchronously without blocking the API response." },
    { cat:'ARCHITECTURE', color:'#e879f9',
      q: "A system at 10K RPS needs to scale. Which approach distributes load across multiple app servers?",
      opts:["Vertical scaling (bigger server)","Load balancer + horizontal scaling","Increasing PHP memory_limit","Adding more indexes"], ans:1,
      exp:"Horizontal scaling adds more identical servers behind a load balancer. It's cheaper and more fault-tolerant than one giant server." },
    // Security / DevOps
    { cat:'SECURITY', color:'#fb923c',
      q: "How should passwords ALWAYS be stored in a database?",
      opts:["Base64 encoded","MD5 hashed","bcrypt/Argon2 hashed with salt","AES encrypted"], ans:2,
      exp:"bcrypt/Argon2 are slow-by-design hashing algorithms with a random salt. MD5 and SHA1 are broken for passwords. Never store plaintext." },
    { cat:'SECURITY', color:'#fb923c',
      q: "What attack does parameterized queries (prepared statements) prevent?",
      opts:["CSRF","XSS","SQL Injection","DDoS"], ans:2,
      exp:"SQL Injection inserts malicious SQL via user input. Prepared statements separate data from SQL structure, making injection impossible." },
    { cat:'DEVOPS', color:'#94a3b8',
      q: "What is the main benefit of containerizing an app with Docker?",
      opts:["Makes it faster","Consistent environment across dev/staging/production","Replaces the database","Removes need for a server"], ans:1,
      exp:"Docker containers bundle the app + dependencies + config. 'Works on my machine' disappears — every environment runs identically." },
    { cat:'DEVOPS', color:'#94a3b8',
      q: "In a CI/CD pipeline, what does 'CD' (Continuous Deployment) mean?",
      opts:["Code is written continuously","Tested code is automatically deployed to production","Developers collaborate daily","Database is backed up continuously"], ans:1,
      exp:"CD automates the path from merged code to live production — cutting human error and deployment time from hours to minutes." },
    { cat:'DEVOPS', color:'#94a3b8',
      q: "What does an API rate limiter primarily protect against?",
      opts:["SQL injection","Slow database queries","DDoS attacks and API abuse by limiting requests per client","CSRF attacks"], ans:2,
      exp:"Rate limiting caps requests per IP/user/key in a time window — preventing abuse, scrapers, and denial-of-service attacks on your API." },
  ];

  // shuffle utility
  function shuffle(arr){ return arr.slice().sort(()=>Math.random()-.5); }

  // ── STATE ──────────────────────────────────────────
  let running=false, paused=false, over=false;
  let score=0, hi=0, hp=3, wave=1, frame=0;
  let streak=0, totalCorrect=0;
  let player, bullets, enemies, particles, pops, stars;
  let keys={}, fireCD=0, shakeF=0, waveMsg='', waveMsgTimer=0;
  let qaQueue=[], qaActive=false, qaCurrent=null;
  let qaTimer=0, qaMaxTime=15, qaAnswered=false, qaTimerID=null;
  let bossWarning=0;

  // ── INIT ───────────────────────────────────────────
  function init(){
    if (qaTimerID) { clearInterval(qaTimerID); qaTimerID = null; }
    running=false; paused=false; over=false;
    score=0; hp=3; wave=1; frame=0; fireCD=0; shakeF=0;
    streak=0; totalCorrect=0; qaActive=false; qaCurrent=null; qaAnswered=false;
    bossWarning=0; waveMsg='WAVE 1'; waveMsgTimer=90;
    player={x:W/2, y:H-55, speed:5.5, shieldTimer:0, rapidTimer:0};
    bullets=[]; enemies=[]; particles=[]; pops=[];
    stars=Array.from({length:90},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(.4,1.6),sp:rnd(.25,1.1),a:rnd(.25,.85)}));
    qaQueue=shuffle(QA_BANK);
    spawnWave(1);
    updateHUD();
  }

  function rnd(a,b){return Math.random()*(b-a)+a;}
  function rInt(a,b){return Math.floor(rnd(a,b+1));}

  // ── WAVE SPAWNER ──────────────────────────────────
  const MINIONS = [
    {label:'BUG',  color:'#ff6b6b', pts:10, hp:1, w:50, h:26},
    {label:'N+1',  color:'#f97316', pts:20, hp:1, w:50, h:26},
    {label:'500',  color:'#ef4444', pts:15, hp:1, w:50, h:26},
    {label:'LEAK', color:'#a855f7', pts:25, hp:2, w:50, h:26},
    {label:'CRASH',color:'#e05252', pts:30, hp:2, w:54, h:26},
  ];

  function spawnWave(w){
    const cols = Math.min(3+w, 9);
    const rows = Math.min(1+Math.floor(w/2), 4);
    const startX = (W - cols*64)/2 + 25;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const t = MINIONS[rInt(0, Math.min(MINIONS.length-1, w))];
        enemies.push({
          x:startX+c*64, y:28+r*50,
          vx:(rnd(0,1)>.5?1:-1)*(0.35+w*.11),
          vy:0.06+w*.018,
          w:t.w, h:t.h, hp:t.hp+Math.floor(w/5),
          maxHp:t.hp+Math.floor(w/5),
          pts:t.pts*w, color:t.color, label:t.label,
          fireTimer:rInt(70,220), bob:rnd(0,Math.PI*2),
          isBoss:false
        });
      }
    }
    // BOSS every wave
    const bossHp = 3 + w*2;
    enemies.push({
      x:W/2, y:50,
      vx:(rnd(0,1)>.5?1:-1)*(0.5+w*.15),
      vy:0,
      w:80, h:38, hp:bossHp, maxHp:bossHp,
      pts:100*w, color:'#ff3b3b', label:'BOSS',
      fireTimer:rInt(40,100), bob:rnd(0,Math.PI*2),
      isBoss:true
    });
    bossWarning = 120;
  }

  // ── PARTICLES & POPS ──────────────────────────────
  function burst(x,y,color,n){
    for(let i=0;i<n;i++){
      const a=rnd(0,Math.PI*2), s=rnd(1,6);
      particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color,r:rnd(1.5,4)});
    }
  }
  function pop(x,y,txt,color){
    pops.push({x,y,txt,color,life:1,vy:-1.5});
  }

  // ── HUD ───────────────────────────────────────────
  function updateHUD(){
    document.getElementById('gm-score').textContent=score;
    document.getElementById('gm-level').textContent=wave;
    const hearts='♥'.repeat(Math.max(0,hp))+'♡'.repeat(Math.max(0,3-hp));
    const hpEl=document.getElementById('gm-hp');
    hpEl.textContent=hearts;
    hpEl.style.color=hp<=1?C.red:hp===2?C.yellow:C.accent;
    document.getElementById('gm-streak').textContent=streak+'✓';
    document.getElementById('gm-hi').textContent=hi;
  }

  // ── DRAW UTILS ────────────────────────────────────
  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
    ctx.closePath();
  }

  function drawStars(){
    stars.forEach(s=>{
      s.y+=s.sp; if(s.y>H)s.y=0;
      ctx.fillStyle=`rgba(255,255,255,${s.a})`;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
  }

  function drawGrid(){
    ctx.strokeStyle='#0c1220';ctx.lineWidth=.5;
    for(let x=0;x<=W;x+=44){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=44){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  function drawPlayer(){
    const px=player.x, py=player.y;
    // shield
    if(player.shieldTimer>0){
      ctx.save();
      ctx.globalAlpha=Math.min(1,player.shieldTimer/60)*.7;
      ctx.strokeStyle=C.shield;ctx.lineWidth=2;
      ctx.shadowBlur=16;ctx.shadowColor=C.shield;
      ctx.beginPath();ctx.arc(px,py,30,0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;ctx.restore();
    }
    // engine glow
    const g=ctx.createRadialGradient(px,py+16,0,px,py+16,16);
    g.addColorStop(0,'rgba(0,200,150,.85)');g.addColorStop(1,'rgba(0,200,150,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py+16,16,0,Math.PI*2);ctx.fill();
    // rapid indicator
    if(player.rapidTimer>0){
      ctx.save();ctx.globalAlpha=.5;
      ctx.strokeStyle=C.yellow;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(px,py,22,0,Math.PI*2);ctx.stroke();
      ctx.restore();
    }
    // body
    ctx.fillStyle=C.ship;
    ctx.shadowBlur=14;ctx.shadowColor=C.accent;
    ctx.beginPath();
    ctx.moveTo(px,py-18);
    ctx.lineTo(px-16,py+14);ctx.lineTo(px-8,py+8);
    ctx.lineTo(px,py+14);
    ctx.lineTo(px+8,py+8);ctx.lineTo(px+16,py+14);
    ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;
    // cockpit
    ctx.fillStyle='rgba(0,220,180,.45)';
    ctx.save();
    ctx.translate(px, py - 2);
    ctx.scale(1, 8 / 5);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEnemy(e){
    const bob=Math.sin(frame*.04+e.bob)*3;
    ctx.save();
    ctx.translate(e.x, e.y+bob);
    ctx.shadowBlur=e.isBoss?18:10;ctx.shadowColor=e.color;
    // body
    ctx.fillStyle=e.color+'1a';
    ctx.strokeStyle=e.color;ctx.lineWidth=e.isBoss?2:1.5;
    roundRect(-e.w/2,-e.h/2,e.w,e.h,6);
    ctx.fill();ctx.stroke();
    // hp bar
    const bw=e.w-8,bh=3;
    ctx.fillStyle='#1e2535';
    ctx.fillRect(-bw/2,-e.h/2-8,bw,bh);
    ctx.fillStyle=e.isBoss?C.red:e.color;
    ctx.fillRect(-bw/2,-e.h/2-8,bw*(e.hp/e.maxHp),bh);
    // label
    ctx.fillStyle=e.color;
    ctx.font=`bold ${e.isBoss?13:11}px IBM Plex Mono,monospace`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(e.label,0,0);
    ctx.shadowBlur=0;
    ctx.restore();
  }

  function drawBullet(b){
    ctx.save();
    ctx.shadowBlur=8;ctx.shadowColor=b.color||C.bullet;
    ctx.fillStyle=b.color||C.bullet;
    const bx=b.x-(b.vx||0)*0;
    roundRect(bx-2,b.y-9,4,14,2);
    ctx.fill();
    ctx.shadowBlur=0;ctx.restore();
  }

  // ── FIRE ──────────────────────────────────────────
  function fire(){
    if(!running||over||fireCD>0||paused||qaActive)return;
    const rapid=player.rapidTimer>0;
    const cd=rapid?6:14;
    bullets.push({x:player.x,y:player.y-22,vy:-12,vx:0,owner:'player',color:C.bullet});
    if(rapid||wave>=3){
      bullets.push({x:player.x-14,y:player.y-10,vy:-11,vx:-.6,owner:'player',color:C.bullet});
      bullets.push({x:player.x+14,y:player.y-10,vy:-11,vx:.6,owner:'player',color:C.bullet});
    }
    fireCD=cd;
  }

  // ── HIT TEST ──────────────────────────────────────
  function hits(a,aw,ah,b,bw,bh){
    return Math.abs(a.x-b.x)<(aw+bw)/2&&Math.abs(a.y-b.y)<(ah+bh)/2;
  }

  // ── Q&A SYSTEM ────────────────────────────────────
  function showQuestion(){
    if (qaTimerID) { clearInterval(qaTimerID); qaTimerID = null; }
    paused=true; qaActive=true; qaAnswered=false;
    if(!qaQueue.length) qaQueue=shuffle(QA_BANK);
    qaCurrent=qaQueue.pop();
    const ov=document.getElementById('q-overlay');
    ov.style.display='flex';

    // badge
    const badge=document.getElementById('q-badge');
    badge.textContent=qaCurrent.cat;
    badge.style.background=(qaCurrent.color||C.accent)+'22';
    badge.style.color=qaCurrent.color||C.accent;
    badge.style.border=`1px solid ${(qaCurrent.color||C.accent)}44`;

    // question
    document.getElementById('q-text').textContent=qaCurrent.q;

    // code
    const codeEl=document.getElementById('q-code');
    if(qaCurrent.code){codeEl.style.display='block';codeEl.textContent=qaCurrent.code;}
    else codeEl.style.display='none';

    // options
    const optsEl=document.getElementById('q-opts');
    optsEl.innerHTML='';
    qaCurrent.opts.forEach((o,i)=>{
      const btn=document.createElement('button');
      btn.textContent=String.fromCharCode(65+i)+'.  '+o;
      btn.style.cssText=`font-family:var(--mono);font-size:.78rem;text-align:left;padding:.65rem 1rem;border-radius:4px;border:1px solid var(--border2);background:transparent;color:var(--text);cursor:pointer;transition:all .2s;letter-spacing:.02em;width:100%`;
      btn.addEventListener('mouseenter',()=>{if(!qaAnswered){btn.style.borderColor=C.accent;btn.style.color=C.accent;}});
      btn.addEventListener('mouseleave',()=>{if(!qaAnswered){btn.style.borderColor='';btn.style.color='';}});
      btn.addEventListener('click',()=>answerQ(i,btn));
      optsEl.appendChild(btn);
    });

    // feedback
    document.getElementById('q-feedback').style.display='none';

    // timer
    qaTimer=qaMaxTime;
    document.getElementById('q-timer-lbl').textContent=qaTimer+'s';
    document.getElementById('q-timer-bar').style.width='100%';
    document.getElementById('q-timer-bar').style.background=C.accent;

    let elapsed=0;
    qaTimerID=setInterval(()=>{
      elapsed+=.25;
      const pct=Math.max(0,1-elapsed/qaMaxTime);
      document.getElementById('q-timer-bar').style.width=(pct*100)+'%';
      const sLeft=Math.max(0,qaMaxTime-Math.floor(elapsed));
      document.getElementById('q-timer-lbl').textContent=sLeft+'s';
      document.getElementById('q-timer-bar').style.background=pct<.35?C.red:pct<.6?C.yellow:C.accent;
      if(elapsed>=qaMaxTime){clearInterval(qaTimerID);answerQ(-1,null);}
    },250);
  }

  function answerQ(idx, btn){
    if(qaAnswered)return;
    qaAnswered=true;
    clearInterval(qaTimerID);
    document.getElementById('q-timer-bar').style.transition='none';

    const correct = idx===qaCurrent.ans;
    const opts=document.getElementById('q-opts').children;

    // color all buttons
    Array.from(opts).forEach((b,i)=>{
      b.style.cursor='default';
      if(i===qaCurrent.ans){
        b.style.borderColor=C.accent;b.style.background='rgba(0,200,150,.1)';b.style.color=C.accent;
      } else if(i===idx&&!correct){
        b.style.borderColor=C.red;b.style.background='rgba(255,107,107,.08)';b.style.color=C.red;
      }
    });

    const fb=document.getElementById('q-feedback');
    fb.style.display='block';
    if(correct){
      streak++;totalCorrect++;
      fb.style.background='rgba(0,200,150,.07)';fb.style.border='1px solid rgba(0,200,150,.2)';fb.style.color=C.accent;
      fb.textContent='✓ Correct! '+qaCurrent.exp;
    } else {
      streak=0;
      fb.style.background='rgba(255,107,107,.07)';fb.style.border='1px solid rgba(255,107,107,.2)';fb.style.color=C.red;
      fb.textContent=(idx===-1?'⏱ Time\'s up! ':'✗ Wrong! ')+qaCurrent.exp;
    }
    updateHUD();

    setTimeout(()=>closeQuestion(correct), 2800);
  }

  function closeQuestion(wasCorrect){
    document.getElementById('q-overlay').style.display='none';
    qaActive=false; paused=false;
    if(wasCorrect){
      player.shieldTimer=180;
      player.rapidTimer=200;
      score+=500;
      pop(player.x,player.y-40,'+500 CORRECT!',C.accent);
      burst(player.x,player.y,C.accent,18);
      burst(W/2,200,C.blue,12);
    } else {
      hp=Math.max(0,hp-1);
      shakeF=14;
      pop(player.x,player.y-30,'WRONG -1HP',C.red);
      burst(player.x,player.y,C.red,10);
      if(hp<=0){setTimeout(()=>gameOver(),400);return;}
    }
    updateHUD();
    if(running) requestAnimationFrame(loop);
  }

  // ── MAIN LOOP ──────────────────────────────────────
  function loop(){
    if(!running||over||qaActive)return;
    frame++;
    if(shakeF>0)shakeF--;

    const sx=shakeF>0?rnd(-4,4):0, sy=shakeF>0?rnd(-4,4):0;
    ctx.save();ctx.translate(sx,sy);

    // bg
    ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
    drawGrid();drawStars();

    // boss warning banner
    if(bossWarning>0){
      bossWarning--;
      ctx.save();
      ctx.globalAlpha=Math.min(1,(bossWarning/40))*(.5+.5*Math.sin(frame*.15));
      ctx.fillStyle='rgba(255,59,59,.08)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle=C.red;ctx.font='bold 15px IBM Plex Mono,monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.shadowBlur=10;ctx.shadowColor=C.red;
      ctx.fillText('⚠  BOSS INCOMING — KILL IT TO UNLOCK QUESTION  ⚠',W/2,H/2);
      ctx.shadowBlur=0;ctx.restore();
    }

    // wave message
    if(waveMsgTimer>0){
      waveMsgTimer--;
      ctx.save();
      ctx.globalAlpha=Math.min(1,waveMsgTimer/30);
      ctx.fillStyle=C.accent;ctx.font='bold 26px DM Sans,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.shadowBlur=18;ctx.shadowColor=C.accent;
      ctx.fillText(waveMsg,W/2,H/2-40);
      ctx.shadowBlur=0;ctx.restore();
    }

    // player controls
    if((keys['ArrowLeft']||keys['a'])&&player.x>24) player.x-=player.speed;
    if((keys['ArrowRight']||keys['d'])&&player.x<W-24) player.x+=player.speed;
    if(keys[' ']||keys['Space']) fire();
    if(fireCD>0)fireCD--;
    if(player.shieldTimer>0)player.shieldTimer--;
    if(player.rapidTimer>0)player.rapidTimer--;

    // enemies
    enemies.forEach(e=>{
      e.x+=e.vx; e.y+=e.vy;
      if(e.x<e.w/2+4||e.x>W-e.w/2-4) e.vx*=-1;
      e.fireTimer--;
      if(e.fireTimer<=0){
        bullets.push({x:e.x,y:e.y+e.h/2,vy:3+wave*.25,vx:(rnd(0,1)>0.5?0.5:-0.5)*(e.isBoss?1.5:1),owner:'enemy',color:e.color});
        if(e.isBoss&&wave>2) bullets.push({x:e.x-10,y:e.y+e.h/2,vy:2.5+wave*.2,vx:-1,owner:'enemy',color:e.color});
        if(e.isBoss&&wave>2) bullets.push({x:e.x+10,y:e.y+e.h/2,vy:2.5+wave*.2,vx:1,owner:'enemy',color:e.color});
        e.fireTimer=rInt(40,180-wave*4);
      }
      drawEnemy(e);
    });

    // bullets
    bullets=bullets.filter(b=>{
      b.x+=(b.vx||0); b.y+=b.vy;
      if(b.y<-20||b.y>H+20||b.x<-20||b.x>W+20) return false;

      if(b.owner==='player'){
        let destroyed=false;
        enemies=enemies.filter(e=>{
          if(destroyed) return true;
          if(hits(b,4,14,e,e.w,e.h)){
            destroyed=true;
            e.hp--;
            if(e.hp<=0){
              burst(e.x,e.y,e.color,e.isBoss?20:10);
              pop(e.x,e.y-22,'+'+e.pts,e.color);
              score+=e.pts; if(score>hi)hi=score;
              shakeF=e.isBoss?12:4;
              updateHUD();
              if(e.isBoss){ showQuestion(); return false; }
              return false;
            }
            burst(e.x,e.y,e.color,3);
            return true;
          }
          return true;
        });
        if(destroyed) return false;
      } else {
        // enemy bullet hits player
        if(hits(b,4,14,player,24,20)){
          if(player.shieldTimer>0){burst(player.x,player.y,C.shield,8);return false;}
          hp--;
          pop(player.x,player.y-28,'-1 HP',C.red);
          shakeF=10; updateHUD();
          if(hp<=0){gameOver();return false;}
          return false;
        }
      }
      drawBullet(b);
      return true;
    });

    // enemies reach bottom
    enemies=enemies.filter(e=>{
      if(e.y>H-25){
        hp=Math.max(0,hp-1);
        burst(e.x,H,e.color,8); shakeF=8;
        updateHUD();
        if(hp<=0)gameOver();
        return false;
      }
      return true;
    });

    // particles
    particles=particles.filter(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=.028;
      ctx.globalAlpha=Math.max(0,p.life);
      ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
      return p.life>0;
    });

    // score pops
    pops=pops.filter(p=>{
      p.y+=p.vy;p.life-=.022;
      ctx.globalAlpha=p.life;
      ctx.fillStyle=p.color;ctx.font='bold 13px IBM Plex Mono,monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(p.txt,p.x,p.y);ctx.globalAlpha=1;
      return p.life>0;
    });

    // ground line
    ctx.strokeStyle='rgba(0,200,150,.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,H-18);ctx.lineTo(W,H-18);ctx.stroke();

    drawPlayer();
    ctx.restore();

    // next wave when all cleared
    if(enemies.length===0&&running&&!qaActive&&!paused){
      wave++;
      waveMsg='WAVE '+wave;
      waveMsgTimer=90;
      updateHUD();
      spawnWave(wave);
    }

    if(running&&!over&&!qaActive) requestAnimationFrame(loop);
  }

  // ── GAME OVER ─────────────────────────────────────
  function gameOver(){
    running=false;over=true;
    if (cwShell) cwShell.classList.remove('sd-shell--playing');
    clearInterval(qaTimerID);
    document.getElementById('q-overlay').style.display='none';
    if(score>hi)hi=score;
    updateHUD();
    const rank=totalCorrect>=8?'Backend Architect 🚀':totalCorrect>=5?'Senior Engineer 🔧':totalCorrect>=2?'Mid-Level Dev 💻':'Keep studying 📖';
    const ov=document.getElementById('game-overlay');
    ov.innerHTML=`
      <div style="font-family:var(--mono);font-size:.68rem;color:#ff6b6b;letter-spacing:.2em">SERVER DOWN</div>
      <div style="font-size:1.6rem;font-weight:700;color:var(--text);font-family:'DM Sans',sans-serif">Wave ${wave} reached</div>
      <div style="font-family:var(--mono);font-size:.85rem;color:var(--accent)">Score: ${score} &nbsp;·&nbsp; Best: ${hi}</div>
      <div style="font-family:var(--mono);font-size:.75rem;color:var(--muted)">Questions answered: ${totalCorrect} correct &nbsp;·&nbsp; ${rank}</div>
      <button type="button" class="btn btn-glow mt-3" id="cw-retry-btn">&#9654; Try again</button>
    `;
    ov.style.display='flex';
    wireRetry();
  }

  // ── KEYBOARD ──────────────────────────────────────

    function isFormField(el) {
      if (!el || !el.nodeName) return false;
      var n = el.nodeName;
      if (n === "INPUT" || n === "TEXTAREA" || n === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    }
    function syncKeyFromEvent(e, down) {
      if (isFormField(e.target)) return;
      if (e.code === "ArrowLeft" || e.key === "ArrowLeft") keys.ArrowLeft = down;
      if (e.code === "ArrowRight" || e.key === "ArrowRight") keys.ArrowRight = down;
      if (e.code === "KeyA" || (e.key && e.key.length === 1 && e.key.toLowerCase() === "a")) keys.a = down;
      if (e.code === "KeyD" || (e.key && e.key.length === 1 && e.key.toLowerCase() === "d")) keys.d = down;
      if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
        keys[" "] = down;
        keys.Space = down;
      }
    }

  document.addEventListener('keydown',function(e){
    if(isFormField(e.target)) return;
    if(['ArrowLeft','ArrowRight',' '].includes(e.key)){
      const r=canvas.getBoundingClientRect();
      if(r.top<window.innerHeight&&r.bottom>0&&running) e.preventDefault();
    }
    syncKeyFromEvent(e,true);
  }, true);
  document.addEventListener('keyup',function(e){
    if(isFormField(e.target)) return;
    syncKeyFromEvent(e,false);
  }, true);
  window.addEventListener('blur',function(){ keys={}; });

  // ── MOBILE CONTROLS ───────────────────────────────
  function hold(id,key){
    const el=document.getElementById(id);
    if(!el)return;
    el.style.touchAction='none';
    function setDown(e){
      if(e) e.preventDefault();
      keys[key]=true;
    }
    function setUp(e){
      if(e) e.preventDefault();
      keys[key]=false;
    }
    if (window.PointerEvent) {
      el.addEventListener('pointerdown',function(e){
        if(e.pointerType==='mouse'&&e.button!==0)return;
        setDown(e);
        try{if(typeof el.setPointerCapture==='function')el.setPointerCapture(e.pointerId);}catch(_){}
      },{passive:false});
      el.addEventListener('pointerup',function(e){
        setUp(e);
        try{if(el.releasePointerCapture&&el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);}catch(_){}
      });
      el.addEventListener('pointercancel',function(e){ setUp(e); });
    } else {
      el.addEventListener('touchstart', setDown, { passive: false });
      el.addEventListener('touchend', setUp, { passive: false });
      el.addEventListener('touchcancel', setUp, { passive: false });
      el.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        setDown(e);
      });
      el.addEventListener('mouseup', setUp);
      el.addEventListener('mouseleave', setUp);
    }
    // Safety net: some mobile browsers expose PointerEvent but still dispatch touch events inconsistently.
    el.addEventListener('touchstart', setDown, { passive: false });
    el.addEventListener('touchend', setUp, { passive: false });
    el.addEventListener('touchcancel', setUp, { passive: false });
  }
  hold('btn-left','ArrowLeft');
  hold('btn-right','ArrowRight');
  var fb=document.getElementById('btn-fire');
  if(fb){
    fb.style.touchAction='none';
    function fireTap(e){
      if(e) e.preventDefault();
      fire();
    }
    if (window.PointerEvent) {
      fb.addEventListener('pointerdown', fireTap, {passive:false});
    } else {
      fb.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        fireTap(e);
      });
    }
    fb.addEventListener('touchstart', fireTap, { passive: false });
  }

  // ── START ─────────────────────────────────────────
  function startGame(){
    document.getElementById('game-overlay').style.display='none';
    document.getElementById('q-overlay').style.display='none';
    init();
    running=true;
    over=false;
    if (cwShell) cwShell.classList.add('sd-shell--playing');
    var tb = document.getElementById('q-timer-bar');
    if (tb) tb.style.transition='width .25s linear';
    requestAnimationFrame(loop);
  }


    function bindPrimaryTap(el, fn) {
      if (!el) return;
      var last = 0;
      function invoke() {
        var n = Date.now();
        if (n - last < 350) return;
        last = n;
        fn();
      }
      if (window.PointerEvent) {
        el.addEventListener(
          "pointerdown",
          function (e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            e.preventDefault();
            invoke();
          },
          { passive: false }
        );
      } else {
        el.addEventListener("mousedown", function (e) {
          if (e.button !== 0) return;
          e.preventDefault();
          invoke();
        });
      }
      el.addEventListener(
        "touchstart",
        function (e) {
          e.preventDefault();
          invoke();
        },
        { passive: false }
      );
      el.addEventListener("click", function () {
        invoke();
      });
    }

    function wireRetry() {
      var retry = document.getElementById("cw-retry-btn");
      if (!retry) return;
      retry.onclick = function () {
        startGame();
      };
    }

    bindPrimaryTap(document.getElementById("cw-start-btn"), startGame);
    window.startCodeWars = startGame;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
