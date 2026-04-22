/**
 * Orchestration: typing hero, parallax, scrollspy, cursor glow, nav UX, contact form.
 */
(function ($) {
  "use strict";

  var typingIndex = 0;
  var charIndex = 0;
  var deleting = false;
  var typingTimer;

  function reducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function initTyping() {
    var $el = $("#typingTarget");
    if (!$el.length || !window.PORTFOLIO || !PORTFOLIO.typingTerms) return;

    if (reducedMotion()) {
      $el.text(PORTFOLIO.typingTerms[0]);
      return;
    }

    var terms = PORTFOLIO.typingTerms;

    function tick() {
      var term = terms[typingIndex % terms.length];
      if (!deleting) {
        charIndex++;
        $el.text(term.slice(0, charIndex));
        if (charIndex === term.length) {
          deleting = true;
          typingTimer = setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        $el.text(term.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          typingIndex++;
        }
      }
      var pause = deleting ? 40 : 85;
      typingTimer = setTimeout(tick, pause);
    }

    tick();
  }

  function throttle(fn, wait) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function initParallax() {
    if (reducedMotion()) return;
    var layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;

    var onScroll = throttle(function () {
      var scrollY = window.scrollY || window.pageYOffset;
      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute("data-parallax") || "0.15");
        var y = scrollY * depth;
        el.style.setProperty("--parallax-y", y.toFixed(1) + "px");
      });
    }, 16);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /** Body uses data-bs-spy; refresh after dynamic content changes layout. */
  function refreshScrollSpy() {
    if (typeof bootstrap === "undefined") return;
    var spy = bootstrap.ScrollSpy.getInstance(document.body);
    if (spy) spy.refresh();
  }

  function initNavCollapse() {
    $("#mainNav .nav-link, #mainNav a.btn-nav-arcade-quiz").on("click", function () {
      var $nav = $("#navbarContent");
      if ($nav.hasClass("show")) {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          var inst = bootstrap.Collapse.getInstance($nav[0]);
          if (inst) inst.hide();
        } else {
          $nav.removeClass("show");
        }
      }
    });
  }

  function initCursorGlow() {
    if (reducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    var $glow = $("#cursorGlow");
    if (!$glow.length) return;

    var move = throttle(function (e) {
      $glow.css({ left: e.clientX + "px", top: e.clientY + "px", opacity: 0.45 });
    }, 12);

    $(window).on("mousemove", move);
    $(window).on("mouseleave blur", function () {
      $glow.css({ opacity: 0 });
    });
  }

  function initProjectTilt() {
    if (reducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    $(document).on("mousemove", ".project-card", function (e) {
      var $card = $(this);
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rx = ((y / rect.height) - 0.5) * -6;
      var ry = ((x / rect.width) - 0.5) * 8;
      $card.css(
        "transform",
        "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(0)"
      );
    });
    $(document).on("mouseleave", ".project-card", function () {
      $(this).css("transform", "");
    });
  }

  function initContactForm() {
    var $form = $("#contactForm");
    if (!$form.length) return;

    $form.on("submit", function (e) {
      e.preventDefault();
      var name = String($form.find('[name="name"]').val() || "").trim();
      var email = String($form.find('[name="email"]').val() || "").trim();
      var msg = String($form.find('[name="message"]').val() || "").trim();
      if (!name || !email || !msg) return;

      var subject = encodeURIComponent("Portfolio contact from " + name);
      var body = encodeURIComponent(
        "From: " + name + " <" + email + ">\n\n" + msg
      );
      var to =
        window.PORTFOLIO && PORTFOLIO.socials
          ? PORTFOLIO.socials.email
          : "";
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }

  /** Hero stats (right column): slide-in reveal + count-up when in view */
  function initHeroStatsReveal() {
    var panel = document.getElementById("heroStatsPanel");
    if (!panel) return;

    function formatRunning(current, format) {
      if (format === "float2") {
        return current.toFixed(2);
      }
      return String(Math.round(current));
    }

    function runCounter(el) {
      var target = parseFloat(String(el.getAttribute("data-target") || "0"), 10);
      var format = el.getAttribute("data-format") || "int";
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1250;
      var start = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = easeOutCubic(p);
        var current = target * eased;
        el.textContent = formatRunning(current, format) + suffix;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatRunning(target, format) + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    function activate() {
      panel.classList.add("is-revealed");
      var $nums = $(panel).find(".hero-stat__num");
      if (reducedMotion()) {
        $nums.each(function () {
          var $n = $(this);
          var t = parseFloat(String($n.attr("data-target") || "0"), 10);
          var f = $n.attr("data-format") || "int";
          var s = $n.attr("data-suffix") || "";
          $n.text(formatRunning(t, f) + s);
        });
        return;
      }
      $nums.each(function (i) {
        var el = this;
        setTimeout(function () {
          runCounter(el);
        }, 320 + i * 140);
      });
    }

    if (reducedMotion()) {
      activate();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      activate();
      return;
    }

    var done = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (ent) {
          if (ent.isIntersecting && !done) {
            done = true;
            activate();
            obs.disconnect();
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.14 }
    );
    obs.observe(panel);
  }

  function initCopyEmail() {
    $("#copyEmailBtn").on("click", function () {
      var email =
        window.PORTFOLIO && PORTFOLIO.socials ? PORTFOLIO.socials.email : "";
      if (!email) return;

      function done(ok) {
        var $t = $("#copyEmailToast");
        $t.text(ok ? "Email copied" : "Copy failed — address in footer");
        $t.addClass("is-on");
        setTimeout(function () {
          $t.removeClass("is-on");
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          done(true);
        }).catch(function () {
          done(false);
        });
      } else {
        done(false);
      }
    });
  }

  $(function () {
    if (window.ParticleNetwork) {
      ParticleNetwork.init("#particle-canvas");
    }
    initTyping();
    initHeroStatsReveal();
    initParallax();
    initNavCollapse();
    initCursorGlow();
    initProjectTilt();
    initContactForm();
    initCopyEmail();

    [0, 200, 600].forEach(function (ms) {
      setTimeout(refreshScrollSpy, ms);
    });
  });
})(jQuery);
