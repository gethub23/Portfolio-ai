/**
 * Quick quiz modal: PHP / Laravel / Public (MCQ), SQL Builder, System Design, API, events/queues, data layer, ops.
 */
(function ($) {
  "use strict";

  var $modal;
  var catKey = null;
  var activePickKey = "php";
  var deck = [];
  var qIndex = 0;
  var score = 0;

  var sqlPickedIds = [];
  var sqlTimerId = null;
  var sqlSeconds = 0;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(arr) {
    var a = arr.slice();
    var i = a.length;
    var j;
    var t;
    while (i) {
      j = Math.floor(Math.random() * i--);
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function getGamesStudio() {
    return window.PORTFOLIO && PORTFOLIO.gamesStudio ? PORTFOLIO.gamesStudio : null;
  }

  function getMcqPool(key) {
    var gs = getGamesStudio();
    if (gs && gs.categories && gs.categories[key]) return gs.categories[key];
    if (window.PORTFOLIO && PORTFOLIO.legacyQuiz && PORTFOLIO.legacyQuiz.categories[key]) {
      return PORTFOLIO.legacyQuiz.categories[key];
    }
    return null;
  }

  function categoryLabel(key) {
    var map = {
      php: "PHP",
      laravel: "Laravel",
      public: "Public topics",
      sqlBuilder: "SQL Builder",
      systemDesign: "System Design",
      apiDiagnosis: "API Diagnosis",
      eventQueues: "Queues & events",
      dataLayer: "Data layer",
      reliabilityOps: "Reliability & ops",
    };
    return map[key] || key;
  }

  function sanitizeHeroImageUrl(value) {
    if (!value) return "";
    var url = String(value).trim();
    // Block external Flickr hero images from being injected into the quiz shell.
    if (url.indexOf("live.staticflickr.com/65535/55222949354_911d111c80_b.jpg") !== -1) return "";
    if (url.indexOf("staticflickr.com") !== -1) return "";
    return url;
  }

  function applyBackground() {
    var gs = getGamesStudio();
    var url = sanitizeHeroImageUrl(gs && gs.heroImage);
    var el = document.getElementById("debugGameShell");
    if (!el) return;
    if (url) {
      el.style.setProperty(
        "--debug-bg-image",
        'url("' + String(url).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '")'
      );
    } else {
      el.style.removeProperty("--debug-bg-image");
    }
  }

  function updateCategoryBlurb() {
    var gs = getGamesStudio();
    var text =
      gs && gs.categoryBlurbs && gs.categoryBlurbs[activePickKey]
        ? gs.categoryBlurbs[activePickKey]
        : "";
    $("#gamesCategoryBlurb").text(text);
  }

  function syncTabs() {
    $(".games-tab")
      .removeClass("active")
      .attr("aria-selected", "false");
    $('.games-tab[data-category="' + activePickKey + '"]')
      .addClass("active")
      .attr("aria-selected", "true");
    updateCategoryBlurb();
  }

  function stopSqlTimer() {
    if (sqlTimerId) {
      clearInterval(sqlTimerId);
      sqlTimerId = null;
    }
  }

  function resetViews() {
    catKey = null;
    deck = [];
    qIndex = 0;
    score = 0;
    sqlPickedIds = [];
    stopSqlTimer();
    activePickKey = "php";
    $("#debugGameCategoryView").removeClass("d-none");
    $("#debugGameQuizView").addClass("d-none");
    $("#sqlBuilderView").addClass("d-none");
    $("#debugGameResultView").addClass("d-none");
    $("#debugExplain").addClass("d-none").empty();
    $("#debugOptions .debug-option").off("click");
    $("#sqlTokenBank .sql-token").off("click");
    $("#sqlBuildStrip").empty();
    $("#sqlFeedback").addClass("d-none").empty();
    syncTabs();
  }

  function startSqlTimer(seconds) {
    stopSqlTimer();
    sqlSeconds = seconds;
    $("#sqlTimeLabel").text("Time: " + sqlSeconds + "s");
    sqlTimerId = setInterval(function () {
      sqlSeconds -= 1;
      if (sqlSeconds <= 0) {
        sqlSeconds = 0;
        $("#sqlTimeLabel").text("Time: 0s");
        stopSqlTimer();
        $("#sqlFeedback")
          .removeClass("d-none sql-feedback--ok")
          .addClass("sql-feedback--bad")
          .text("Time’s up — adjust your tokens and Run again, or Clear to restart this challenge.");
      } else {
        $("#sqlTimeLabel").text("Time: " + sqlSeconds + "s");
      }
    }, 1000);
  }

  function startSqlBuilderGame() {
    var bank = window.PORTFOLIO && PORTFOLIO.sqlBuilderChallenges;
    if (!bank || !bank.length) return;
    var gs = getGamesStudio();
    var total = (gs && gs.roundsPerGame) || 5;
    catKey = "sqlBuilder";
    deck = shuffle(bank).slice(0, Math.min(total, bank.length));
    qIndex = 0;
    score = 0;
    sqlPickedIds = [];
    $("#debugGameCategoryView").addClass("d-none");
    $("#debugGameQuizView").addClass("d-none");
    $("#sqlBuilderView").removeClass("d-none");
    $("#debugGameResultView").addClass("d-none");
    $("#sqlCategoryBadge").text("SQL Builder");
    renderSqlChallenge();
    startSqlTimer(90);
  }

  function getCurrentSqlChallenge() {
    return deck[qIndex];
  }

  function renderSqlChallenge() {
    var ch = getCurrentSqlChallenge();
    if (!ch) return;
    sqlPickedIds = [];
    stopSqlTimer();
    startSqlTimer(90);

    $("#sqlRoundLabel").text("Challenge " + (qIndex + 1) + " of " + deck.length);
    $("#sqlScoreLabel").text("Score: " + score + " / " + deck.length);
    $("#sqlTaskBody").text(ch.task);
    var $sch = $("#sqlSchemaLines").empty();
    (ch.schema || []).forEach(function (line) {
      $sch.append($("<div></div>").text(line));
    });

    $("#sqlBuildStrip").empty();
    $("#sqlFeedback").addClass("d-none").removeClass("sql-feedback--ok sql-feedback--bad").empty();

    var $bank = $("#sqlTokenBank").empty();
    (ch.tokens || []).forEach(function (tok) {
      var $b = $('<button type="button" class="btn sql-token"></button>');
      $b.text(tok.display);
      $b.attr("data-tokid", tok.id);
      $b.data("tokid", tok.id);
      $bank.append($b);
    });

    $("#sqlTokenBank .sql-token").on("click", function () {
      var id = String($(this).data("tokid"));
      if ($(this).prop("disabled")) return;
      sqlPickedIds.push(id);
      $(this).prop("disabled", true).addClass("is-used");
      var $chip = $('<button type="button" class="btn sql-chip"></button>');
      $chip.text($(this).text());
      $chip.data("tokid", id);
      $chip.on("click", function () {
        var idx = $(this).index();
        var rid = String($(this).data("tokid"));
        sqlPickedIds.splice(idx, 1);
        $("#sqlTokenBank .sql-token").each(function () {
          if (String($(this).data("tokid")) === rid) {
            $(this).prop("disabled", false).removeClass("is-used");
          }
        });
        $(this).remove();
      });
      $("#sqlBuildStrip").append($chip);
    });
  }

  function sqlClear() {
    var ch = getCurrentSqlChallenge();
    sqlPickedIds = [];
    $("#sqlBuildStrip").empty();
    $("#sqlFeedback").addClass("d-none").empty();
    if (!ch) return;
    $("#sqlTokenBank .sql-token").each(function () {
      $(this).prop("disabled", false).removeClass("is-used");
    });
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    var i;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function sqlRun() {
    var ch = getCurrentSqlChallenge();
    if (!ch) return;
    var ok = arraysEqual(sqlPickedIds, ch.solution || []);
    if (ok) {
      stopSqlTimer();
      score += 1;
      $("#sqlFeedback")
        .removeClass("d-none sql-feedback--bad")
        .addClass("sql-feedback--ok")
        .text(ch.explain || "Correct — nice query.");
      setTimeout(function () {
        qIndex += 1;
        if (qIndex >= deck.length) {
          finishGame();
        } else {
          renderSqlChallenge();
        }
      }, 900);
    } else {
      $("#sqlFeedback")
        .removeClass("d-none sql-feedback--ok")
        .addClass("sql-feedback--bad")
        .text("Not quite — order and clauses must match the scenario. Try Clear or remove chips to adjust.");
    }
  }

  function startCategory(key) {
    if (key === "sqlBuilder") {
      startSqlBuilderGame();
      return;
    }
    var pool = getMcqPool(key);
    if (!pool) return;
    var gs = getGamesStudio();
    var total =
      (gs && gs.roundsPerGame) ||
      (window.PORTFOLIO && PORTFOLIO.legacyQuiz && PORTFOLIO.legacyQuiz.roundsPerGame) ||
      5;
    catKey = key;
    deck = shuffle(pool).slice(0, Math.min(total, pool.length));
    qIndex = 0;
    score = 0;
    $("#debugGameCategoryView").addClass("d-none");
    $("#sqlBuilderView").addClass("d-none");
    $("#debugGameQuizView").removeClass("d-none");
    $("#debugGameResultView").addClass("d-none");
    $("#debugCategoryBadge").text(categoryLabel(key));
    renderMcqQuestion();
  }

  function setProgress() {
    var pct = deck.length ? Math.round((qIndex / deck.length) * 100) : 0;
    $("#debugProgressBar").css("width", pct + "%");
  }

  function renderMcqQuestion() {
    var q = deck[qIndex];
    if (!q) return;

    $("#debugExplain").addClass("d-none").empty();
    $("#debugRoundLabel").text("Round " + (qIndex + 1) + " of " + deck.length);
    $("#debugScoreLabel").text("Score: " + score + " / " + deck.length);
    setProgress();

    $("#debugPrompt").html(escapeHtml(q.prompt).replace(/\n/g, "<br>"));

    if (catKey === "apiDiagnosis") {
      $("#debugOptionsLabel").removeClass("d-none");
    } else {
      $("#debugOptionsLabel").addClass("d-none");
    }

    var $wrap = $("#debugCodeWrap");
    var $pre = $("#debugCodeBlock").empty();
    if (q.codeLines && q.codeLines.length) {
      $wrap.removeClass("d-none");
      q.codeLines.forEach(function (line, i) {
        var $line = $('<div class="dq-line"></div>');
        if (typeof q.highlightLine === "number" && i === q.highlightLine) {
          $line.addClass("dq-line--hl");
        }
        $line.text(line);
        $pre.append($line);
      });
      if (q.codeHint) {
        $("#debugCodeHint").removeClass("d-none").text(q.codeHint);
      } else {
        $("#debugCodeHint").addClass("d-none").empty();
      }
    } else {
      $wrap.addClass("d-none");
    }

    var $opts = $("#debugOptions").empty();
    var letters = ["A", "B", "C", "D"];
    (q.options || []).forEach(function (opt, i) {
      var $btn = $(
        '<button type="button" class="btn debug-option w-100 text-start"></button>'
      );
      $btn.append(
        $('<span class="debug-option__lt"></span>').text(letters[i] || String(i + 1))
      );
      var $body = $('<div class="debug-option__body"></div>');
      if (opt.badge) {
        $body.append($('<span class="games-opt-badge"></span>').text(opt.badge));
      }
      var bodyText = opt.body != null ? opt.body : opt.text;
      $body.append($('<div class="games-opt-text"></div>').text(bodyText));
      $btn.append($body);
      $btn.data("correct", !!opt.correct);
      $opts.append($('<div class="col-12 mb-2"></div>').append($btn));
    });

    $("#debugOptions .debug-option")
      .prop("disabled", false)
      .removeClass("debug-option--ok debug-option--bad debug-option--pick");
    $("#debugOptions .debug-option").on("click", onMcqPick);
  }

  function onMcqPick() {
    var $btn = $(this);
    var correct = !!$btn.data("correct");
    $("#debugOptions .debug-option").prop("disabled", true).off("click");
    $btn.addClass("debug-option--pick");
    $("#debugOptions .debug-option").each(function () {
      var $b = $(this);
      if ($b.data("correct")) {
        $b.addClass("debug-option--ok");
      } else if ($b[0] === $btn[0] && !correct) {
        $b.addClass("debug-option--bad");
      }
    });
    if (correct) score += 1;

    var q = deck[qIndex];
    if (q && q.explain) {
      $("#debugExplain")
        .removeClass("d-none")
        .html("<strong>Note.</strong> " + escapeHtml(q.explain));
    }

    setTimeout(function () {
      qIndex += 1;
      if (qIndex >= deck.length) {
        finishGame();
      } else {
        renderMcqQuestion();
      }
    }, 1150);
  }

  function finishGame() {
    stopSqlTimer();
    $("#debugGameQuizView").addClass("d-none");
    $("#sqlBuilderView").addClass("d-none");
    $("#debugGameResultView").removeClass("d-none");
    $("#debugResultHeadline").text("Session complete");
    $("#debugResultScore").text(score + " / " + deck.length + " correct");
    $("#debugProgressBar").css("width", "100%");
  }

  function bindModal() {
    $modal = $("#debugGameModal");
    if (!$modal.length) return;

    applyBackground();

    $modal.on("shown.bs.modal", function () {
      resetViews();
      applyBackground();
    });

    $modal.on("hidden.bs.modal", function () {
      resetViews();
    });

    $(document).on("click", ".games-tab", function () {
      activePickKey = String($(this).data("category") || "php");
      syncTabs();
    });

    $("#gamesStartBtn").on("click", function () {
      startCategory(activePickKey);
    });

    $("#debugQuizBack").on("click", function () {
      resetViews();
    });

    $("#sqlQuizBack").on("click", function () {
      resetViews();
    });

    $("#sqlRunBtn").on("click", function () {
      sqlRun();
    });

    $("#sqlClearBtn").on("click", function () {
      sqlClear();
    });

    $("#debugQuizPlayAgain").on("click", function () {
      resetViews();
    });

    $(document).on("click", '[data-bs-target="#debugGameModal"]', function () {
      var $nav = $("#navbarContent");
      if ($nav.length && $nav.hasClass("show") && typeof bootstrap !== "undefined") {
        var inst = bootstrap.Collapse.getInstance($nav[0]);
        if (inst) inst.hide();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindModal);
  } else {
    bindModal();
  }
})(jQuery);
