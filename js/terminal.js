/**
 * Mini terminal: commands + simple "repair JSON" puzzle (easter egg).
 */
(function ($) {
  "use strict";

  var $panel;
  var $log;
  var $input;
  var repaired = false;
  var terminalQuestions = [
    {
      id: "q1",
      prompt: "In Laravel, which queue strategy helps keep HTTP requests fast for heavy jobs?",
      accepted: ["dispatch", "queue", "job", "async"],
      hint: "Think: move slow tasks out of request lifecycle.",
    },
    {
      id: "q2",
      prompt: "For real-time bids with 1000+ users, what transport is the best fit?",
      accepted: ["websocket", "socket.io", "websockets"],
      hint: "Think persistent two-way connection.",
    },
    {
      id: "q3",
      prompt: "What Redis pattern is commonly used to reduce repeated DB reads?",
      accepted: ["cache aside", "cache-aside", "caching"],
      hint: "Read-through via app logic.",
    },
    {
      id: "q4",
      prompt: "Which database index type is typically best for exact lookup by id/email?",
      accepted: ["btree", "b-tree"],
      hint: "Default index in MySQL for equality/range queries.",
    },
  ];

  function appendLine(text, cls) {
    var line = $('<div class="term-line"></div>');
    if (cls) line.addClass(cls);
    line.text(text);
    $log.append(line);
    $log.scrollTop($log[0].scrollHeight);
  }

  function printHelp() {
    appendLine("Available commands:", "term-dim");
    appendLine("  help       — show this list");
    appendLine("  whoami     — profile snapshot");
    appendLine("  skills     — tech keywords");
    appendLine("  status     — system health (simulated)");
    appendLine("  questions  — list terminal quiz questions");
    appendLine("  ask <id>   — show a specific question (e.g. ask q1)");
    appendLine('  answer <id> <text> — submit an answer (e.g. answer q1 use queues)');
    appendLine("  decode     — hint for the debug challenge");
    appendLine('  repair <json> — fix the config, e.g. repair {"status":"online","mode":"prod"}');
    appendLine("  clear      — clear output");
  }

  function findQuestionById(id) {
    var qid = String(id || "").toLowerCase();
    for (var i = 0; i < terminalQuestions.length; i++) {
      if (terminalQuestions[i].id === qid) return terminalQuestions[i];
    }
    return null;
  }

  function answerMatches(question, text) {
    var normalized = String(text || "").toLowerCase();
    return question.accepted.some(function (needle) {
      return normalized.indexOf(String(needle).toLowerCase()) !== -1;
    });
  }

  function runCommand(raw) {
    var line = $.trim(raw);
    if (!line) return;
    appendLine("$ " + line, "term-cmd");

    var parts = line.split(/\s+/);
    var cmd = parts[0].toLowerCase();

    if (cmd === "help") {
      printHelp();
      return;
    }
    if (cmd === "clear") {
      $log.empty();
      return;
    }
    if (cmd === "whoami") {
      if (window.PORTFOLIO && PORTFOLIO.profile) {
        appendLine(
          PORTFOLIO.profile.name +
            " — " +
            PORTFOLIO.profile.title +
            " (" +
            PORTFOLIO.profile.location +
            ")"
        );
      } else {
        appendLine("Portfolio profile not loaded.");
      }
      return;
    }
    if (cmd === "skills") {
      if (window.PORTFOLIO && PORTFOLIO.typingTerms) {
        appendLine(PORTFOLIO.typingTerms.join(" · "));
      }
      return;
    }
    if (cmd === "status") {
      appendLine("service: api-gateway", "term-dim");
      appendLine("uptime: 99.982%", "term-dim");
      appendLine("CONFIG_OK: false", "term-warn");
      appendLine('last payload: { "status": "offline", "mode": null }', "term-warn");
      appendLine("hint: bring status online with a valid mode string.", "term-dim");
      return;
    }
    if (cmd === "questions") {
      appendLine("Terminal quiz bank:", "term-accent");
      terminalQuestions.forEach(function (q) {
        appendLine("  " + q.id + " — " + q.prompt, "term-dim");
      });
      appendLine('Use "ask q1" then "answer q1 <text>".', "term-dim");
      return;
    }
    if (cmd === "ask") {
      var q = findQuestionById(parts[1]);
      if (!q) {
        appendLine('Question not found. Try: questions, then ask q1..q4', "term-warn");
        return;
      }
      appendLine(q.id.toUpperCase() + ": " + q.prompt, "term-accent");
      appendLine("Hint: " + q.hint, "term-dim");
      return;
    }
    if (cmd === "answer") {
      var aq = findQuestionById(parts[1]);
      var answerText = line.split(/\s+/).slice(2).join(" ");
      if (!aq) {
        appendLine('Question not found. Use "questions" first.', "term-warn");
        return;
      }
      if (!answerText) {
        appendLine("Missing answer text. Example: answer " + aq.id + " use queue jobs", "term-warn");
        return;
      }
      if (answerMatches(aq, answerText)) {
        appendLine("Correct direction. That's production-grade thinking.", "term-success");
      } else {
        appendLine("Not quite. Try a backend-specific keyword.", "term-warn");
        appendLine("Hint: " + aq.hint, "term-dim");
      }
      return;
    }
    if (cmd === "decode") {
      appendLine("Debug challenge:", "term-accent");
      appendLine(
        'Craft a JSON object with "status":"online" and non-null "mode" (e.g. "prod").',
        "term-dim"
      );
      appendLine('Prefix with: repair {"status":"online","mode":"prod"}', "term-dim");
      return;
    }
    if (cmd === "repair") {
      var jsonPart = line.slice("repair".length).trim();
      try {
        var obj = JSON.parse(jsonPart);
        if (obj && obj.status === "online" && obj.mode) {
          repaired = true;
          appendLine("CONFIG_OK: true — systems nominal.", "term-success");
          appendLine(
            "Easter egg: Thanks for debugging with me. Ship small, measure twice, cache wisely.",
            "term-accent"
          );
          $("#easterEggBanner")
            .text(
              "Systems nominal — you fixed the config. Ship small, measure twice, cache wisely."
            )
            .addClass("is-active");
          setTimeout(function () {
            $("#easterEggBanner").removeClass("is-active");
          }, 8000);
        } else {
          appendLine("Repair rejected: need status=online and a non-empty mode.", "term-warn");
        }
      } catch (e) {
        appendLine("Invalid JSON. Check quotes and commas.", "term-warn");
      }
      return;
    }

    appendLine("Unknown command: " + cmd + " (type help)", "term-warn");
  }

  function init() {
    $panel = $("#terminalPanel");
    $log = $("#terminalLog");
    $input = $("#terminalInput");
    if (!$panel.length || !$log.length || !$input.length) return;

    $("#terminalToggle").on("click", function () {
      $panel.toggleClass("is-open");
      var open = $panel.hasClass("is-open");
      $(this).attr("aria-expanded", open);
      if (open) $input.trigger("focus");
    });

    $input.on("keydown", function (e) {
      if (e.key === "Enter") {
        var v = $input.val();
        $input.val("");
        runCommand(v);
      }
    });

    appendLine('Type "help" to explore the terminal commands.', "term-dim");
    appendLine('Try: "questions" to start the terminal quiz.', "term-dim");
  }

  $(init);
})(jQuery);
