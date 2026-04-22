/**
 * Legacy CV-themed MCQ banks (PHP, Laravel, Public) — 100 questions each, template-generated.
 */
(function () {
  "use strict";

  if (!window.PORTFOLIO) window.PORTFOLIO = {};

  function rotateOpts(opts, shift) {
    var n = opts.length;
    if (!n) return opts;
    shift = ((shift % n) + n) % n;
    return opts.slice(shift).concat(opts.slice(0, shift));
  }

  function pick(arr, i) {
    return arr[i % arr.length];
  }

  function buildPhp(i) {
    var a = i % 10;
    var v = Math.floor(i / 10);
    var tbl = pick(["orders", "payments", "invoices"], v);
    var prompt;
    var codeLines;
    var hl = null;
    var opts;
    var explain = "PHP production hygiene: types, security, resources, and predictable runtime behavior.";

    if (a === 0) {
      prompt =
        "Storing currency from `" +
        tbl +
        "` in cents: `$c = $amount * 100` when `$amount` is a string from JSON — main concern?";
      codeLines = ["$c = $amount * 100; // $amount from client JSON"];
      hl = 0;
      opts = [
        { text: "Float and implicit coercion can lose precision; use BCMath or integer cents with validation.", correct: true },
        { text: "PHP cannot multiply strings.", correct: false },
        { text: "JSON numbers are always floats in PHP.", correct: false },
        { text: "Multiplying by 100 always yields an integer.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "foreach by reference over `$rows` then iterating again without unset — risk?";
      codeLines = ["foreach ($rows as &$r) { $r['x']=1; }", "foreach ($rows as $r) { audit($r); }"];
      hl = 0;
      opts = [
        { text: "The reference can alias the last element; later loops may mutate data unexpectedly.", correct: true },
        { text: "PHP copies arrays automatically between foreach loops.", correct: false },
        { text: "References are scoped to the foreach block only.", correct: false },
        { text: "Only objects are affected, not arrays.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "`ini_set('display_errors','1')` left enabled in production — primary risk?";
      codeLines = ["ini_set('display_errors', '1');"];
      hl = 0;
      opts = [
        { text: "Information disclosure (paths, queries); log instead of echoing errors to users.", correct: true },
        { text: "It only affects CLI, not FPM.", correct: false },
        { text: "E_ALL is illegal in production.", correct: false },
        { text: "Opcache disables display_errors automatically.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "File lock with `flock` but never `fclose` on the handle — over many workers?";
      codeLines = ["$h = fopen('lock','c'); flock($h, LOCK_EX); /* ... */"];
      hl = 0;
      opts = [
        { text: "Descriptor leaks and unreliable locking under churn; fclose after unlock.", correct: true },
        { text: "PHP auto-closes handles at request end only in CLI.", correct: false },
        { text: "flock releases when the variable goes out of scope always.", correct: false },
        { text: "Locks are process-wide so leaks do not matter.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Password check with `md5($_POST['p']) === $row['hash']` — fix?";
      codeLines = ["md5($_POST['p']) === $row['password_hash']"];
      hl = 0;
      opts = [
        { text: "Use password_hash / password_verify (or Argon2id) and migrate hashes on login.", correct: true },
        { text: "MD5 is fine if you base64-encode it.", correct: false },
        { text: "Double MD5 adds enough entropy.", correct: false },
        { text: "Store plaintext and compare with strcmp.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "`declare(strict_types=1)` and `eta(int $m)` called with `eta('15')` — outcome?";
      codeLines = ["declare(strict_types=1);", "function eta(int $m): int { return $m * 60; }", "eta('15');"];
      hl = 2;
      opts = [
        { text: "TypeError: strict mode rejects string where int is required.", correct: true },
        { text: "PHP coerces '15' to 15 silently.", correct: false },
        { text: "strict_types only applies to return types.", correct: false },
        { text: "Remove declare to fix business logic.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Caching JSON in `/tmp/cache.json` per app server for `" + tbl + "` reads — scaling issue?";
      codeLines = ["if (file_exists('/tmp/cache.json')) return file_get_contents(...);"];
      hl = 0;
      opts = [
        { text: "Not shared across horizontal nodes; use Redis/Memcached with TTL and eviction.", correct: true },
        { text: "/tmp is replicated across all servers.", correct: false },
        { text: "Disk is faster than Redis for all workloads.", correct: false },
        { text: "file_get_contents is atomic for cache invalidation.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "Empty vs isset on array key after `unset($a['k'])` — which is safer to detect absence?";
      codeLines = ["unset($data['token']);", "// detect missing token"];
      hl = null;
      opts = [
        { text: "`array_key_exists` or null coalescing depending on semantics; empty() treats null/''/0 as empty.", correct: true },
        { text: "`isset` returns true after unset for missing keys.", correct: false },
        { text: "`empty` distinguishes unset from null.", correct: false },
        { text: "Always use `strlen($x) > 0` instead.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "Serializing closures with `serialize()` for queue jobs — problem?";
      codeLines = ["serialize(function () { return 1; });"];
      hl = 0;
      opts = [
        { text: "Closures are not serializable by default; use invokable classes or job DTOs.", correct: true },
        { text: "Opcache serializes closures automatically.", correct: false },
        { text: "serialize always returns base64.", correct: false },
        { text: "Only applies to async PHP.", correct: false },
      ];
    } else {
      prompt = "Comparing floats with `==` for money totals — better approach?";
      codeLines = ["if ($a == $b) { /* totals match */ }"];
      hl = 0;
      opts = [
        { text: "Compare in minor units as integers or use BCMath/decimal library.", correct: true },
        { text: "Float == is always safe below 1e6.", correct: false },
        { text: "Cast both to string before compare.", correct: false },
        { text: "Use `===` to fix float issues.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + " (PHP). " + prompt,
      codeLines: codeLines,
      highlightLine: hl,
      codeHint: hl !== null ? "Highlighted line shows the risky spot." : null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function buildLaravel(i) {
    var a = i % 10;
    var v = Math.floor(i / 10);
    var prompt;
    var codeLines;
    var hl = null;
    var opts;
    var explain = "Laravel: keep HTTP thin, models expressive, queues reliable, and schema migrations safe.";

    if (a === 0) {
      prompt = "Blade loops `$orders` then `$o->items->count()` without eager load — issue?";
      codeLines = ["Order::with(/* ??? */)->paginate(50);", "// view: $o->items->count()"];
      hl = 1;
      opts = [
        { text: "N+1 queries; add with('items') or withCount('items').", correct: true },
        { text: "Pagination fixes N+1 automatically.", correct: false },
        { text: "count() is cached per model.", correct: false },
        { text: "Use lazy() in Blade to batch.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "Mass assignment on `User` with `$guarded = []` exposed — fix?";
      codeLines = ["protected $guarded = [];"];
      hl = 0;
      opts = [
        { text: "Use $fillable allow-list or guarded carefully for request-massaged attributes.", correct: true },
        { text: "Set $guarded = ['*'].", correct: false },
        { text: "Disable Request in FormServiceProvider.", correct: false },
        { text: "Mass assignment is off by default in Laravel 11.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "Rotating `APP_KEY` without re-issuing tokens — symptom for Sanctum SPA?";
      codeLines = ["// personal access tokens encrypted with APP_KEY"];
      hl = null;
      opts = [
        { text: "Sessions/tokens decrypt fail; re-login users and revoke old tokens after rotation.", correct: true },
        { text: "Sanctum ignores APP_KEY.", correct: false },
        { text: "php artisan key:generate is safe without side effects.", correct: false },
        { text: "Only .env.example must change.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Non-null column added to 50M-row table in one migration without default — risk?";
      codeLines = ["$table->string('ref')->nullable(false);"];
      hl = 0;
      opts = [
        { text: "Long metadata locks / failures; multi-step nullable→backfill→enforce.", correct: true },
        { text: "MySQL adds default '' automatically always.", correct: false },
        { text: "Run at night only to avoid locks.", correct: false },
        { text: "Use DB::unprepared to skip locks.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Duplicate job processing payments — queue feature to reduce double charge?";
      codeLines = ["class PayJob implements ShouldQueue { /* ... */ }"];
      hl = null;
      opts = [
        { text: "WithoutOverlapping / unique jobs / DB unique constraints + idempotent handlers.", correct: true },
        { text: "Set driver to sync.", correct: false },
        { text: "Increase tries only.", correct: false },
        { text: "Queues guarantee exactly-once.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "Authorization skipped in route closures — better pattern?";
      codeLines = ["Route::post('/pay', function () { /* ... */ });"];
      hl = 0;
      opts = [
        { text: "Controllers + FormRequest authorize() or explicit $this->authorize().", correct: true },
        { text: "Policies attach to closures automatically.", correct: false },
        { text: "Middleware replaces policies entirely.", correct: false },
        { text: "Use Gate in Kernel only.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Long-running `while(true)` artisan command leaking memory — common fix?";
      codeLines = ["while (true) { /* poll redis */ }"];
      hl = 0;
      opts = [
        { text: "Supervised workers with periodic restart; avoid unbounded loops or gc_collect_cycles strategically.", correct: true },
        { text: "sleep(0) stops leaks.", correct: false },
        { text: "PHP frees all memory each loop iteration always.", correct: false },
        { text: "Use daemonize() built-in.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "API Resource wrapping models — when most valuable?";
      codeLines = ["return new UserResource($user);"];
      hl = null;
      opts = [
        { text: "Stable public JSON contracts, field filtering, and versioned payloads.", correct: true },
        { text: "Required for every internal job.", correct: false },
        { text: "Replaces database indexes.", correct: false },
        { text: "Only for GraphQL.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "`Schedule::command(...)->everyMinute()` overlaps on slow runs — mitigation?";
      codeLines = ["Schedule::command('sync')->everyMinute();"];
      hl = 0;
      opts = [
        { text: "withoutOverlapping() / mutex / runInBackground depending on workload.", correct: true },
        { text: "Increase cron frequency only.", correct: false },
        { text: "Laravel prevents overlap by default.", correct: false },
        { text: "Use sleep(60) inside command.", correct: false },
      ];
    } else {
      prompt = "Livewire component state growing large — first check?";
      codeLines = ["public $rows = []; // huge dataset"];
      hl = 0;
      opts = [
        { text: "Paginate / defer / lazy collections; trim serialized state size.", correct: true },
        { text: "Livewire compresses state automatically.", correct: false },
        { text: "Store everything in session always.", correct: false },
        { text: "Switch to Blade only.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + " (Laravel). " + prompt,
      codeLines: codeLines,
      highlightLine: hl,
      codeHint: hl !== null ? "Highlighted line shows the risky spot." : null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function buildPublic(i) {
    var a = i % 10;
    var v = Math.floor(i / 10);
    var prompt;
    var opts;
    var explain = "Leadership, reliability, and pragmatic trade-offs at scale.";

    if (a === 0) {
      prompt = "Aligning ~30 engineers on architecture — highest leverage artifact?";
      opts = [
        { text: "ADRs / RFCs + shared NFRs and review rubrics.", correct: true },
        { text: "Single architect approves every PR.", correct: false },
        { text: "Cancel retrospectives to save time.", correct: false },
        { text: "Standardize on one editor theme.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "10K+ RPS but DB CPU saturated — first scaling lever?";
      opts = [
        { text: "Read replicas + cache hot reads with jitter/single-flight; profile slow queries.", correct: true },
        { text: "Scale PHP workers only.", correct: false },
        { text: "Drop indexes to speed writes.", correct: false },
        { text: "Move reads to browser storage.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "Stakeholder pushes fixed date with growing scope — your first move?";
      opts = [
        { text: "Make trade-offs explicit: scope, time, risk; add flags and rollback plans.", correct: true },
        { text: "Hide risk until launch.", correct: false },
        { text: "Freeze testing to hit date.", correct: false },
        { text: "Add contractors without onboarding.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Big-bang rewrite vs strangler — when prefer strangler?";
      opts = [
        { text: "Reduce delivery risk by slicing boundaries behind APIs with measurable milestones.", correct: true },
        { text: "Rewrites are always cheaper long-term.", correct: false },
        { text: "Strangler forbids any new code.", correct: false },
        { text: "Microservices first without boundaries.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "LMS chat spike causes API timeouts — isolation strategy?";
      opts = [
        { text: "Isolate realtime fan-out from transactional APIs; queue and rate-limit chat.", correct: true },
        { text: "Increase max_children infinitely.", correct: false },
        { text: "Disable auth on chat.", correct: false },
        { text: "Store chat only in RAM.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "GPS ping storm for logistics — first cost control?";
      opts = [
        { text: "Throttle, batch, geohash buckets; avoid full reroute per tick.", correct: true },
        { text: "Call remote API synchronously per ping.", correct: false },
        { text: "Store all pings in one JSON row.", correct: false },
        { text: "Compute ETA once per driver lifetime.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Sustaining Core Web Vitals gains after a sprint — best practice?";
      opts = [
        { text: "Performance budgets in CI + RUM alerts tied to releases.", correct: true },
        { text: "Lighthouse once per year.", correct: false },
        { text: "Disable caching for honest metrics.", correct: false },
        { text: "Minify comments only.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "At-least-once consumers duplicate events — handler must be?";
      opts = [
        { text: "Idempotent via dedupe keys / upserts / monotonic versions.", correct: true },
        { text: "Exactly-once is guaranteed by Kafka always.", correct: false },
        { text: "Skip logging failures.", correct: false },
        { text: "Two-phase commit across broker and DB always.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "API gateway responsibility at the edge?";
      opts = [
        { text: "Auth, routing, rate limits, observability, cross-cutting policies.", correct: true },
        { text: "Replace domain services.", correct: false },
        { text: "Primary data store.", correct: false },
        { text: "Compile PHP to machine code.", correct: false },
      ];
    } else {
      prompt = "Replica lag makes dashboards stale — user-facing mitigation?";
      opts = [
        { text: "Expose staleness; read-your-writes for critical reads to primary.", correct: true },
        { text: "Assume replicas are synchronous.", correct: false },
        { text: "Delete replicas.", correct: false },
        { text: "CDN cache forever.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + " (Public). " + prompt,
      codeLines: null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function build100(fn) {
    var o = [];
    var k;
    for (k = 0; k < 100; k++) o.push(fn(k));
    return o;
  }

  window.PORTFOLIO.legacyQuiz = {
    roundsPerGame: 5,
    categories: {
      php: build100(buildPhp),
      laravel: build100(buildLaravel),
      public: build100(buildPublic),
    },
  };
})();
