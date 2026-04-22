/**
 * Mini terminal: commands + simple "repair JSON" puzzle (easter egg).
 */
(function ($) {
  "use strict";

  var $panel;
  var $log;
  var $input;
  var repaired = false;

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
    appendLine("  decode     — hint for the debug challenge");
    appendLine('  repair <json> — fix the config, e.g. repair {"status":"online","mode":"prod"}');
    appendLine("  clear      — clear output");
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

    appendLine('Type "help" to explore a tiny simulated shell.', "term-dim");
  }

  $(init);
})(jQuery);
