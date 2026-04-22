/**
 * Lightweight canvas particle network — throttled, capped nodes, reduced-motion safe.
 */
(function () {
  "use strict";

  var canvas;
  var ctx;
  var nodes = [];
  var w = 0;
  var h = 0;
  var rafId;
  var mouse = { x: -9999, y: -9999, active: false };
  var reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function maxNodes() {
    return window.innerWidth < 576 ? 35 : window.innerWidth < 992 ? 55 : 75;
  }

  function randomNode() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    };
  }

  function resize() {
    if (!canvas) return;
    var parent = canvas.parentElement;
    if (!parent) return;
    w = parent.clientWidth;
    h = parent.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildNodes();
  }

  function rebuildNodes() {
    var n = maxNodes();
    nodes = [];
    for (var i = 0; i < n; i++) nodes.push(randomNode());
  }

  function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function step() {
    if (!ctx || reducedMotion) return;
    var linkDist = Math.min(140, w * 0.12);
    var i;
    var j;
    var d;

    for (i = 0; i < nodes.length; i++) {
      var p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      if (mouse.active) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var m = Math.sqrt(dx * dx + dy * dy) || 1;
        if (m < 120) {
          p.x += (dx / m) * 0.6;
          p.y += (dy / m) * 0.6;
        }
      }
    }

    ctx.clearRect(0, 0, w, h);

    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        d = dist(nodes[i], nodes[j]);
        if (d < linkDist) {
          var alpha = (1 - d / linkDist) * 0.22;
          ctx.strokeStyle = "rgba(0, 200, 150, " + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = "rgba(0, 200, 150, 0.45)";
    for (i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function drawStatic() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    var grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "rgba(26, 125, 255, 0.12)");
    grd.addColorStop(0.5, "rgba(0, 200, 150, 0.1)");
    grd.addColorStop(1, "rgba(0, 224, 168, 0.08)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  }

  function onMove(e) {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function onLeave() {
    mouse.active = false;
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  }

  window.ParticleNetwork = {
    init: function (selector) {
      canvas = document.querySelector(selector);
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      resize();
      window.addEventListener("resize", onResize, { passive: true });
      canvas.addEventListener("mousemove", onMove, { passive: true });
      canvas.addEventListener("mouseleave", onLeave, { passive: true });

      if (reducedMotion) {
        drawStatic();
        return;
      }
      if (rafId) cancelAnimationFrame(rafId);
      step();
    },
  };
})();
