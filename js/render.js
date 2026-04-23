/**
 * Injects skills and project cards from PORTFOLIO into the DOM (jQuery).
 */
(function ($) {
  "use strict";

  function renderSkills() {
    var $root = $("#skills-root");
    if (!$root.length || !window.PORTFOLIO || !PORTFOLIO.skillsByCategory) return;

    var levelLabels = { expert: "Expert", advanced: "Advanced", growing: "Growing" };
    var groupToneLabels = { daily: "Daily", familiar: "Familiar" };

    function normalizeSkill(skill) {
      if (typeof skill === "string") {
        return { name: skill, level: null };
      }
      if (skill && typeof skill === "object") {
        return {
          name: skill.name != null ? String(skill.name) : "",
          level: skill.level != null ? String(skill.level).toLowerCase() : null,
        };
      }
      return { name: "", level: null };
    }

    function normalizeTone(tone) {
      var t = tone != null ? String(tone).toLowerCase() : "daily";
      return groupToneLabels[t] ? t : "daily";
    }

    function renderSkillBadge(skill, tone) {
      var s = normalizeSkill(skill);
      if (!s.name) return "";
      var lvl = s.level && levelLabels[s.level] ? s.level : null;
      var toneClass = tone === "familiar" ? " skill-badge--muted" : "";
      var out = '<span class="skill-badge' + (lvl ? " skill-badge--has-level" : "") + toneClass + '">';
      if (lvl) {
        out +=
          '<span class="skill-badge__level skill-badge__level--' +
          escapeHtml(lvl) +
          '">' +
          escapeHtml(levelLabels[lvl]) +
          "</span>";
      }
      out += '<span class="skill-badge__name">' + escapeHtml(s.name) + "</span>";
      out += "</span>";
      return out;
    }

    var html = "";
    if (PORTFOLIO.featuredSkillProject) {
      var f = PORTFOLIO.featuredSkillProject;
      html += '<div class="col-12 mb-4">';
      html += '  <article class="glass-card skill-feature-card h-100">';
      if (f.badge) {
        html += '    <span class="skill-feature-card__badge">' + escapeHtml(f.badge) + "</span>";
      }
      html += '    <div class="skill-feature-card__head">';
      html +=
        '      <h3 class="skill-feature-card__title"><i class="bi bi-pin-angle-fill me-2" aria-hidden="true"></i>' +
        escapeHtml(f.title || "") +
        "</h3>";
      html += '      <p class="skill-feature-card__subtitle">' + escapeHtml(f.subtitle || "") + "</p>";
      html += '      <p class="skill-feature-card__desc">' + escapeHtml(f.description || "") + "</p>";
      html += "    </div>";
      html += '    <div class="skill-feature-card__grid">';
      html += '      <div class="skill-feature-card__col">';
      html += '        <p class="skill-feature-card__label">Stack</p>';
      html += '        <div class="skill-feature-card__chips">';
      (Array.isArray(f.stack) ? f.stack : []).forEach(function (item) {
        html += '<span class="skill-feature-chip">' + escapeHtml(item) + "</span>";
      });
      html += "        </div>";
      html += '        <p class="skill-feature-card__label mt-3">Packages</p>';
      html += '        <div class="skill-feature-card__chips">';
      (Array.isArray(f.packages) ? f.packages : []).forEach(function (item) {
        html += '<span class="skill-feature-chip skill-feature-chip--muted">' + escapeHtml(item) + "</span>";
      });
      html += "        </div>";
      html += "      </div>";
      html += '      <div class="skill-feature-card__col">';
      html += '        <p class="skill-feature-card__label">What\'s included</p>';
      html += '        <ul class="skill-feature-list">';
      (Array.isArray(f.includes) ? f.includes : []).forEach(function (item) {
        html +=
          '          <li><span class="skill-feature-list__check" aria-hidden="true">&#9989;</span>' +
          "<span>" +
          escapeHtml(item) +
          "</span></li>";
      });
      html += "        </ul>";
      html += "      </div>";
      html += "    </div>";
      html += '    <div class="skill-feature-card__foot">';
      if (f.github) {
        html +=
          '      <a class="btn btn-sm btn-glass skill-feature-card__link" href="' +
          escapeAttr(f.github) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<i class="bi bi-github skill-feature-card__link-icon" aria-hidden="true"></i>' +
          escapeHtml(f.githubLabel || "GitHub") +
          "</a>";
      }
      if (f.note) {
        html += '      <p class="skill-feature-card__note">' + escapeHtml(f.note) + "</p>";
      }
      html += "    </div>";
      html += "  </article>";
      html += "</div>";
    }
    $.each(PORTFOLIO.skillsByCategory, function (category, items) {
      html += '<div class="col-lg-4 col-md-6 mb-4">';
      html += '  <div class="glass-card skill-card h-100">';
      html +=
        '    <h3 class="skill-card__title"><i class="bi bi-layers me-2" aria-hidden="true"></i>' +
        escapeHtml(category) +
        "</h3>";
      if (items && !Array.isArray(items) && Array.isArray(items.groups)) {
        html += '    <div class="skill-groups">';
        items.groups.forEach(function (group) {
          var tone = normalizeTone(group && group.tone);
          var tagText = group && group.label ? String(group.label) : groupToneLabels[tone];
          var toneClass = tone === "familiar" ? " skill-badges--familiar" : "";
          html += '      <div class="skill-group skill-group--' + tone + '">';
          html +=
            '        <p class="skill-group__tag skill-group__tag--' +
            tone +
            '">' +
            escapeHtml(tagText) +
            "</p>";
          html += '        <div class="skill-badges' + toneClass + '">';
          (group && Array.isArray(group.items) ? group.items : []).forEach(function (skill) {
            html += renderSkillBadge(skill, tone);
          });
          html += "        </div>";
          html += "      </div>";
        });
        html += "    </div>";
      } else {
        html += '    <div class="skill-badges">';
        (Array.isArray(items) ? items : []).forEach(function (skill) {
          html += renderSkillBadge(skill, null);
        });
        html += "    </div>";
      }
      html += "  </div>";
      html += "</div>";
    });
    $root.html(html);
  }

  function renderProjects() {
    var $root = $("#projects-root");
    if (!$root.length || !window.PORTFOLIO || !PORTFOLIO.projects) return;

    var html = "";
    PORTFOLIO.projects.forEach(function (p) {
      html += '<div class="col-lg-4 col-md-6 mb-4">';
      html += '  <article class="glass-card project-card h-100" data-tilt>';
      html += '    <div class="project-card__inner">';
      if (p.category) {
        html +=
          '      <span class="project-card__category-badge">' +
          escapeHtml(p.category) +
          "</span>";
      }
      html +=
        '      <h3 class="project-card__title">' + escapeHtml(p.title) + "</h3>";
      html +=
        '      <p class="project-card__desc">' + escapeHtml(p.description) + "</p>";
      if (Array.isArray(p.impact) && p.impact.length) {
        html += '      <p class="project-card__impact">';
        p.impact.forEach(function (metric, idx) {
          html += '<span class="project-card__impact-item">' + escapeHtml(metric) + "</span>";
          if (idx < p.impact.length - 1) {
            html += '<span class="project-card__impact-sep" aria-hidden="true">·</span>';
          }
        });
        html += "      </p>";
      }
      html += '      <div class="project-card__tech">';
      (p.tech || []).forEach(function (t) {
        html +=
          '<span class="tech-chip">' + escapeHtml(t) + "</span>";
      });
      html += "      </div>";
      html += "    </div>";
      html += "  </article>";
      html += "</div>";
    });
    $root.html(html);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function renderExperience() {
    var $root = $("#experience-root");
    if (!$root.length || !window.PORTFOLIO || !PORTFOLIO.experience) return;

    function highlightMetrics(text) {
      var safe = escapeHtml(text);
      return safe.replace(
        /(10K\+\s*RPS|100\+|20K\+)/g,
        '<span class="timeline-metric">$1</span>'
      );
    }

    var html = '<div class="timeline">';
    PORTFOLIO.experience.forEach(function (job, idx) {
      var cid = "exp-collapse-" + idx;
      var isCurrent = !!job.current;
      html += '<div class="timeline-item' + (isCurrent ? " timeline-item--current" : "") + '">';
      html +=
        '  <div class="timeline-marker' +
        (isCurrent ? " timeline-marker--current" : "") +
        '" aria-hidden="true"></div>';
      html += '  <div class="glass-card timeline-card">';
      html += '    <div class="timeline-card__head">';
      html += '      <div>';
      if (job.levelTag) {
        html +=
          '        <span class="timeline-level-tag">' + escapeHtml(job.levelTag) + "</span>";
      }
      html +=
        '        <h3 class="timeline-role">' + escapeHtml(job.role) + "</h3>";
      html +=
        '        <p class="timeline-company mb-1">' +
        escapeHtml(job.company) +
        " · " +
        escapeHtml(job.location) +
        "</p>";
      html +=
        '        <span class="timeline-period">' + escapeHtml(job.period) + "</span>";
      html += "      </div>";
      html +=
        '      <button class="timeline-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' +
        cid +
        '" aria-expanded="false" aria-controls="' +
        cid +
        '" aria-label="Show details for this role">' +
        '        <span class="timeline-toggle__text">Details</span>' +
        '        <span class="timeline-toggle__icon" aria-hidden="true"><i class="bi bi-chevron-down"></i></span>' +
        "      </button>";
      html += "    </div>";
      html += '    <div id="' + cid + '" class="collapse timeline-body">';
      html += '      <ul class="timeline-bullets">';
      (job.bullets || []).forEach(function (b) {
        html += "<li>" + highlightMetrics(b) + "</li>";
      });
      html += "      </ul>";
      html += "    </div>";
      html += "  </div>";
      html += "</div>";
    });
    html += "</div>";
    $root.html(html);
  }

  window.PortfolioRender = {
    init: function () {
      renderSkills();
      renderProjects();
      renderExperience();
    },
  };

  $(function () {
    window.PortfolioRender.init();
  });
})(jQuery);
