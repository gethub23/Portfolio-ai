/**
 * Light/dark theme toggle — persists to localStorage, respects system preference on first visit.
 */
(function ($) {
  "use strict";

  var STORAGE_KEY = "portfolio-theme";

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var $btn = $("#themeToggle");
    var icon = theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill";
    $btn.find("i").attr("class", "bi " + icon);
    $btn.attr("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  }

  function init() {
    var stored = getStored();
    var prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (prefersLight ? "light" : "dark");
    apply(theme);

    $("#themeToggle").on("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      apply(next);
      setStored(next);
    });
  }

  $(init);
})(jQuery);
