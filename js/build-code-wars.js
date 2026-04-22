/**
 * One-off builder: merges index_4 arcade IIFE with portfolio boot + fixes.
 * Run: node js/build-code-wars.js
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "index_4.html");
const outPath = path.join(root, "js", "code-wars.js");

const lines = fs.readFileSync(htmlPath, "utf8").split(/\r?\n/);
const inner = lines.slice(529, 1159).join("\n");

const prefix = `/**
 * Code Wars v2.0 — hybrid arcade + boss Q&A (from index_4.html).
 * Portfolio build: boot, mobile capture, no ctx.ellipse, no inline onclick.
 */
(function () {
  "use strict";

  function boot() {
`;

const suffix = `
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
      }
      el.addEventListener("click", function () {
        invoke();
      });
    }

    function wireRetry() {
      var retry = document.getElementById("cw-retry-btn");
      bindPrimaryTap(retry, startGame);
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
`;

let body = inner;

// Wrap IIFE body inside boot() — strip outer (function(){ ... })();
body = body.replace(/^\(function\(\)\{\s*/, "");
body = body.replace(/\}\)\(\);\s*$/, "");

// Shell + init timer clear
body = body.replace(
  "const canvas = document.getElementById('game-canvas');",
  "var cwShell = document.getElementById('cw-shell');\n    const canvas = document.getElementById('game-canvas');"
);

body = body.replace(
  "function init(){\n    running=false; paused=false; over=false;",
  "function init(){\n    if (qaTimerID) { clearInterval(qaTimerID); qaTimerID = null; }\n    running=false; paused=false; over=false;"
);

body = body.replace(
  "function showQuestion(){\n    paused=true; qaActive=true; qaAnswered=false;",
  "function showQuestion(){\n    if (qaTimerID) { clearInterval(qaTimerID); qaTimerID = null; }\n    paused=true; qaActive=true; qaAnswered=false;"
);

// cockpit: no ellipse
body = body.replace(
  /ctx\.fillStyle='rgba\(0,220,180,\.45\)';\s*ctx\.beginPath\(\);\s*ctx\.ellipse\(px,py-2,5,8,0,0,Math\.PI\*2\);ctx\.fill\(\);/,
  "ctx.fillStyle='rgba(0,220,180,.45)';\n    ctx.save();\n    ctx.translate(px, py - 2);\n    ctx.scale(1, 8 / 5);\n    ctx.beginPath();\n    ctx.arc(0, 0, 5, 0, Math.PI * 2);\n    ctx.fill();\n    ctx.restore();"
);

// Enemy bullet vx — explicit precedence
body = body.replace(
  "vx:(rnd(0,1)>.5?.5:-.5)*e.isBoss?1.5:.5,owner:'enemy'",
  "vx:(rnd(0,1)>0.5?0.5:-0.5)*(e.isBoss?1.5:1),owner:'enemy'"
);

// gameOver button
body = body.replace(
  '<button onclick="startGame()" style="font-family:var(--mono);font-size:.8rem;padding:.65rem 2rem;border-radius:5px;background:var(--accent);color:#060a10;border:none;cursor:pointer;font-weight:700;letter-spacing:.07em;margin-top:.4rem">&#9654; TRY AGAIN</button>',
  '<button type="button" class="btn btn-glow mt-3" id="cw-retry-btn">&#9654; Try again</button>'
);

body = body.replace(
  "ov.style.display='flex';\n  }",
  "ov.style.display='flex';\n    wireRetry();\n  }"
);

// startGame: shell class + transition restore on timer bar
body = body.replace(
  "window.startGame=function(){\n    document.getElementById('game-overlay').style.display='none';\n    document.getElementById('q-overlay').style.display='none';\n    init();\n    running=true;\n    requestAnimationFrame(loop);\n  };",
  "function startGame(){\n    document.getElementById('game-overlay').style.display='none';\n    document.getElementById('q-overlay').style.display='none';\n    init();\n    running=true;\n    over=false;\n    if (cwShell) cwShell.classList.add('sd-shell--playing');\n    var tb = document.getElementById('q-timer-bar');\n    if (tb) tb.style.transition='width .25s linear';\n    requestAnimationFrame(loop);\n  }"
);

body = body.replace(
  "function gameOver(){\n    running=false;over=true;\n    clearInterval(qaTimerID);",
  "function gameOver(){\n    running=false;over=true;\n    if (cwShell) cwShell.classList.remove('sd-shell--playing');\n    clearInterval(qaTimerID);"
);

// Form-safe keyboard
const kbPatch = `
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
`;

body = body.replace(
  "  // ── KEYBOARD ──────────────────────────────────────\n  document.addEventListener('keydown',e=>{\n    if(['ArrowLeft','ArrowRight',' '].includes(e.key)){\n      const r=canvas.getBoundingClientRect();\n      if(r.top<window.innerHeight&&r.bottom>0) e.preventDefault();\n    }\n    keys[e.key]=true;\n  });\n  document.addEventListener('keyup',e=>{keys[e.key]=false;});",
  "  // ── KEYBOARD ──────────────────────────────────────\n" +
    kbPatch +
    "\n  document.addEventListener('keydown',function(e){\n    if(isFormField(e.target)) return;\n    if(['ArrowLeft','ArrowRight',' '].includes(e.key)){\n      const r=canvas.getBoundingClientRect();\n      if(r.top<window.innerHeight&&r.bottom>0&&running) e.preventDefault();\n    }\n    syncKeyFromEvent(e,true);\n  }, true);\n  document.addEventListener('keyup',function(e){\n    if(isFormField(e.target)) return;\n    syncKeyFromEvent(e,false);\n  }, true);\n  window.addEventListener('blur',function(){ keys={}; });"
);

// Mobile hold with capture
body = body.replace(
  "  // ── MOBILE CONTROLS ───────────────────────────────\n  function hold(id,key){\n    const el=document.getElementById(id);\n    if(!el)return;\n    el.addEventListener('pointerdown',e=>{e.preventDefault();keys[key]=true;});\n    el.addEventListener('pointerup',()=>keys[key]=false);\n    el.addEventListener('pointerout',()=>keys[key]=false);\n  }\n  hold('btn-left','ArrowLeft');\n  hold('btn-right','ArrowRight');\n  document.getElementById('btn-fire')?.addEventListener('pointerdown',e=>{e.preventDefault();fire();});",
  "  // ── MOBILE CONTROLS ───────────────────────────────\n  function hold(id,key){\n    const el=document.getElementById(id);\n    if(!el)return;\n    el.style.touchAction='none';\n    el.addEventListener('pointerdown',function(e){\n      if(e.pointerType==='mouse'&&e.button!==0)return;\n      e.preventDefault();\n      keys[key]=true;\n      try{if(typeof el.setPointerCapture==='function')el.setPointerCapture(e.pointerId);}catch(_){}\n    },{passive:false});\n    el.addEventListener('pointerup',function(e){\n      keys[key]=false;\n      try{if(el.releasePointerCapture&&el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);}catch(_){}\n    });\n    el.addEventListener('pointercancel',function(){ keys[key]=false; });\n  }\n  hold('btn-left','ArrowLeft');\n  hold('btn-right','ArrowRight');\n  var fb=document.getElementById('btn-fire');\n  if(fb){\n    fb.style.touchAction='none';\n    fb.addEventListener('pointerdown',function(e){e.preventDefault();fire();},{passive:false});\n  }"
);

// fire: guard like portfolio
body = body.replace(
  "function fire(){\n    if(fireCD>0||paused||qaActive||!running)return;",
  "function fire(){\n    if(!running||over||fireCD>0||paused||qaActive)return;"
);

const out = prefix + body + "\n" + suffix;
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath, "bytes", Buffer.byteLength(out, "utf8"));
