/**
 * Quick quiz bank — extra MCQ categories (100 questions each), template-generated like System Design.
 */
(function () {
  "use strict";

  if (!window.PORTFOLIO) window.PORTFOLIO = {};

  function S(i) {
    return String(1000 + i);
  }

  function pick(arr, i) {
    return arr[i % arr.length];
  }

  /** Rotate options so the correct answer moves deterministically with question index. */
  function rotateOpts(opts, shift) {
    var n = opts.length;
    if (!n) return opts;
    shift = ((shift % n) + n) % n;
    return opts.slice(shift).concat(opts.slice(0, shift));
  }

  /** Build 100 questions; option order rotated by index for varied A–D positions. */
  function build100(fn) {
    var out = [];
    var i;
    for (i = 0; i < 100; i++) {
      out.push(fn(i));
    }
    return out;
  }

  function buildApi(i) {
    var a = i % 10;
    var path = pick(
      ["/api/orders", "/api/users", "/api/payments", "/api/inventory", "/api/bookings", "/api/refunds"],
      i
    );
    var id = S(i);
    var json201 = '{"id":' + id + ',"status":"pending"}';
    var json200 = '{"items":[],"page":1}';
    var wrong204 = "(empty body)";
    var wrong400 = '{"error":"validation_failed"}';

    var prompt;
    var correctIdx;
    var opts;

    if (a === 0) {
      var method = pick(["POST", "PUT"], i);
      prompt =
        "A client sends " +
        method +
        " " +
        path +
        " with a valid JSON body. The resource is created successfully in the database. What is the best-practice HTTP response?";
      opts = [
        { badge: "201 Created", body: method + " " + path + "\n" + json201, correct: true },
        { badge: "200 OK", body: method + " " + path + "\n" + json201, correct: false },
        { badge: "204 No Content", body: method + " " + path + "\n" + wrong204, correct: false },
        { badge: "302 Found", body: method + " " + path + "\nLocation: /done", correct: false },
      ];
    } else if (a === 1) {
      prompt =
        "DELETE " +
        path +
        "/" +
        id +
        " succeeds; the server intentionally returns no body. Which status is most appropriate?";
      opts = [
        { badge: "204 No Content", body: "DELETE " + path + "/" + id + "\n" + wrong204, correct: true },
        { badge: "200 OK", body: "DELETE " + path + "/" + id + "\n" + json200, correct: false },
        { badge: "202 Accepted", body: "DELETE " + path + "/" + id + "\n" + json200, correct: false },
        { badge: "404 Not Found", body: "DELETE " + path + "/" + id, correct: false },
      ];
    } else if (a === 2) {
      prompt =
        "GET " +
        path +
        " requires authentication but the bearer token is missing or malformed. What should the API return?";
      opts = [
        { badge: "401 Unauthorized", body: "GET " + path + "\nWWW-Authenticate: Bearer", correct: true },
        { badge: "403 Forbidden", body: "GET " + path, correct: false },
        { badge: "404 Not Found", body: "GET " + path, correct: false },
        { badge: "400 Bad Request", body: "GET " + path + "\n" + wrong400, correct: false },
      ];
    } else if (a === 3) {
      prompt =
        "The caller is authenticated but lacks permission for " +
        path +
        ". Which response fits REST semantics?";
      opts = [
        { badge: "403 Forbidden", body: "GET " + path, correct: true },
        { badge: "401 Unauthorized", body: "GET " + path, correct: false },
        { badge: "404 Not Found", body: "GET " + path, correct: false },
        { badge: "409 Conflict", body: "GET " + path, correct: false },
      ];
    } else if (a === 4) {
      prompt = "GET " + path + "/" + id + " refers to a resource that does not exist. Preferred response?";
      opts = [
        { badge: "404 Not Found", body: "GET " + path + "/" + id, correct: true },
        { badge: "204 No Content", body: "GET " + path + "/" + id, correct: false },
        { badge: "410 Gone", body: "GET " + path + "/" + id + "\n(rare unless permanently removed)", correct: false },
        { badge: "400 Bad Request", body: "GET " + path + "/" + id, correct: false },
      ];
    } else if (a === 5) {
      prompt =
        "POST " +
        path +
        " violates business rules (duplicate unique key). The client should fix the payload. Typical response?";
      opts = [
        { badge: "409 Conflict", body: "POST " + path + "\n" + wrong400, correct: true },
        { badge: "500 Internal Server Error", body: "POST " + path, correct: false },
        { badge: "200 OK", body: "POST " + path + "\n" + json200, correct: false },
        { badge: "301 Moved Permanently", body: "POST " + path, correct: false },
      ];
    } else if (a === 6) {
      prompt =
        "The client exceeded a per-API-key rate limit. Which status communicates throttling clearly?";
      opts = [
        { badge: "429 Too Many Requests", body: "GET " + path + "\nRetry-After: 2", correct: true },
        { badge: "503 Service Unavailable", body: "GET " + path, correct: false },
        { badge: "403 Forbidden", body: "GET " + path, correct: false },
        { badge: "408 Request Timeout", body: "GET " + path, correct: false },
      ];
    } else if (a === 7) {
      prompt =
        "A long-running export is accepted and will complete asynchronously. No resource URL exists yet. Best response?";
      opts = [
        { badge: "202 Accepted", body: "POST " + path + "\n" + json200, correct: true },
        { badge: "200 OK", body: "POST " + path + "\n" + json201, correct: false },
        { badge: "204 No Content", body: "POST " + path, correct: false },
        { badge: "201 Created", body: "POST " + path + "\n" + json201, correct: false },
      ];
    } else if (a === 8) {
      prompt =
        "GET " +
        path +
        " supports conditional requests; content unchanged since If-None-Match. Preferred status + body?";
      opts = [
        { badge: "304 Not Modified", body: "GET " + path + "\n" + wrong204, correct: true },
        { badge: "200 OK", body: "GET " + path + "\n" + json200, correct: false },
        { badge: "412 Precondition Failed", body: "GET " + path, correct: false },
        { badge: "204 No Content", body: "GET " + path, correct: false },
      ];
    } else {
      prompt =
        "PATCH " +
        path +
        "/" +
        id +
        " with malformed JSON (syntax error). Server cannot parse body. Best status?";
      opts = [
        { badge: "400 Bad Request", body: "PATCH " + path + "/" + id + "\n" + wrong400, correct: true },
        { badge: "415 Unsupported Media Type", body: "PATCH " + path + "/" + id, correct: false },
        { badge: "422 Unprocessable Entity", body: "PATCH " + path + "/" + id, correct: false },
        { badge: "500 Internal Server Error", body: "PATCH " + path + "/" + id, correct: false },
      ];
    }

    var q = {
      prompt: prompt,
      codeLines: null,
      explain: "See RFC 9110 semantics; prefer precise codes clients and caches can reason about.",
      options: rotateOpts(opts, i),
    };
    return q;
  }

  function buildSd(i) {
    var a = i % 10;
    var svc = pick(["checkout", "search", "notifications", "billing", "inventory-sync"], i);
    var prompt;
    var opts;
    var explain = "Trade-offs: consistency, latency, cost, operability — align with product SLOs.";

    if (a === 0) {
      prompt =
        "Hot key on Redis cache for `" +
        svc +
        "` causes thundering herd after TTL expiry. Mitigation with best ROI?";
      opts = [
        { text: "Jittered TTL + request coalescing / single-flight + stale-while-revalidate style patterns.", correct: true },
        { text: "Set TTL to infinite so keys never expire.", correct: false },
        { text: "Disable caching for that endpoint entirely forever.", correct: false },
        { text: "Use bigger Redis nodes only; no code changes.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "Designing idempotent " + svc + " webhooks from a payment provider — core mechanism?";
      opts = [
        { text: "Store processed event IDs (or idempotency keys) and short-circuit duplicates safely.", correct: true },
        { text: "Retry until HTTP 200 regardless of side effects.", correct: false },
        { text: "Use timestamps on client only to detect duplicates.", correct: false },
        { text: "Assume TCP guarantees exactly-once delivery.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "Downstream dependency for " + svc + " is flaky. Protect upstream with which pattern first?";
      opts = [
        { text: "Circuit breaker + timeouts + bulkheads to fail fast and shed load.", correct: true },
        { text: "Infinite retries with zero backoff.", correct: false },
        { text: "Return 500 to clients until dependency recovers.", correct: false },
        { text: "Queue requests unbounded in memory on each app server.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Read replicas lag behind primary for " + svc + ". User sees stale dashboard. First response?";
      opts = [
        { text: "Expose staleness bounds; route critical reads to primary or use read-your-writes strategy.", correct: true },
        { text: "Assume replicas are always strongly consistent.", correct: false },
        { text: "Delete replicas to remove lag.", correct: false },
        { text: "Cache forever in CDN to hide lag.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Synchronous chain of 6 microservices for " + svc + " adds tail latency. Architectural nudge?";
      opts = [
        { text: "Introduce async workflow / events for non-critical steps; shorten critical path.", correct: true },
        { text: "Increase thread pools until latency disappears.", correct: false },
        { text: "Merge all services into one binary without boundaries.", correct: false },
        { text: "Use HTTP/2 so parallel calls become free.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "Global rate limiting for " + svc + " — fairest unit to throttle?";
      opts = [
        { text: "Per authenticated tenant/user/API key with burst allowance — avoid punishing shared NAT unfairly if possible.", correct: true },
        { text: "Per TCP connection only.", correct: false },
        { text: "Per continent only.", correct: false },
        { text: "Throttle after 500 errors occur.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Stateful WebSocket layer scaled horizontally for " + svc + " — common requirement?";
      opts = [
        { text: "Sticky sessions or shared pub/sub bus so broadcasts reach all nodes consistently.", correct: true },
        { text: "WebSockets require one server only.", correct: false },
        { text: "Store all socket state in local RAM without sync.", correct: false },
        { text: "Use HTTP polling instead; no design needed.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "CQRS for " + svc + " reporting — primary benefit you communicate to stakeholders?";
      opts = [
        { text: "Scale and optimize read models independently from write-heavy OLTP paths.", correct: true },
        { text: "Guarantees ACID across all projections instantly.", correct: false },
        { text: "Removes need for any database.", correct: false },
        { text: "Makes writes faster automatically.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "At-least-once message consumer for " + svc + " may process duplicates. What must the handler guarantee?";
      opts = [
        { text: "Side effects are idempotent (dedupe keys, upserts, monotonic versioning).", correct: true },
        { text: "Exactly-once is provided by the broker always.", correct: false },
        { text: "Log errors and skip messages silently.", correct: false },
        { text: "Use transactions spanning broker and DB universally.", correct: false },
      ];
    } else {
      prompt = "API gateway vs each service exposing public endpoints — main gateway responsibility?";
      opts = [
        { text: "Cross-cutting auth, rate limits, routing, observability, and protocol translation at the edge.", correct: true },
        { text: "Replace all business logic for microservices.", correct: false },
        { text: "Store primary domain data for performance.", correct: false },
        { text: "Eliminate need for service-to-service auth.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + ". " + prompt,
      codeLines: null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function buildEventQueues(i) {
    var a = i % 10;
    var topic = pick(["webhooks", "order exports", "inventory sync", "notifications", "billing retries"], i);
    var prompt;
    var opts;
    var explain = "Queues, events, and outbox patterns: prefer at-least-once reality and explicit idempotency.";

    if (a === 0) {
      prompt =
        "Laravel job for `" +
        topic +
        "` fails mid-run after partial DB writes. You use `DB::transaction()` around the whole `handle()`. What is still missing for safe retries?";
      opts = [
        { text: "Idempotent steps or compensating logic: retries may re-run after commit; wrap only idempotent units or use outbox + single consumer guarantees.", correct: true },
        { text: "Nothing — transactions make retries always safe.", correct: false },
        { text: "Set tries=1 so the job never retries.", correct: false },
        { text: "Use sync driver in production to avoid duplicates.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "`ShouldQueue` listener vs synchronous listener for `" + topic + "` — when is sync still the right default?";
      opts = [
        { text: "When the side effect must be visible in the same request/DB transaction as the triggering write (read-your-writes, same-unit-of-work).", correct: true },
        { text: "Never — always queue every listener.", correct: false },
        { text: "When the event fires fewer than 10 times per day.", correct: false },
        { text: "When Redis is unavailable; sync skips the handler.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "Horizon reports growing `pending_jobs` for `" + topic + "` while CPU is idle — first check?";
      opts = [
        { text: "Worker processes / `queue:work` scaling, reserved workers per queue, and blocked supervisors — not just Redis memory.", correct: true },
        { text: "Increase PHP memory_limit only.", correct: false },
        { text: "Truncate failed_jobs to free slots.", correct: false },
        { text: "Switch to database queue driver for speed.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Publishing a domain event to Redis/RabbitMQ **after** local commit — classic race if you publish inside the transaction. Better pattern?";
      opts = [
        { text: "Transactional outbox: store event in the same DB transaction, then relay asynchronously to the broker.", correct: true },
        { text: "Publish first, then commit — ordering guarantees fix duplicates.", correct: false },
        { text: "Use two-phase commit across MySQL and Redis.", correct: false },
        { text: "Disable foreign keys so the transaction is faster.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Exponential backoff + jitter on `" + topic + "` job retries — primary purpose of jitter?";
      opts = [
        { text: "Spread retry storms so many failing jobs do not synchronize and hammer downstreams (thundering herd).", correct: true },
        { text: "Make logs easier to grep.", correct: false },
        { text: "Guarantee exactly-once delivery.", correct: false },
        { text: "Replace the need for dead-letter queues.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "Duplicate `" + topic + "` messages detected at the consumer (same idempotency key). Correct handling?";
      opts = [
        { text: "Short-circuit safely: return success without re-applying side effects; persist processed-key TTL or version.", correct: true },
        { text: "Throw so the broker drops the message.", correct: false },
        { text: "Process again and rely on unique indexes to sometimes fail.", correct: false },
        { text: "Delete the queue and recreate it.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Broadcasting Laravel events over WebSockets at scale — what breaks if every event hits a single Redis connection per request?";
      opts = [
        { text: "Connection churn and head-of-line blocking; pool/batch or use dedicated broadcaster processes and channel design.", correct: true },
        { text: "PHP opcache clears automatically.", correct: false },
        { text: "Nothing — one connection is ideal.", correct: false },
        { text: "Horizon fixes broadcaster throughput automatically.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "Scheduled job enqueues `" + topic + "` for all tenants every minute — DB load spikes. First refactor?";
      opts = [
        { text: "Shard work: chunk tenants, stagger schedules, or fan-out to per-tenant queues with bounded concurrency.", correct: true },
        { text: "Run scheduler every second for smoother load.", correct: false },
        { text: "Disable overlapping in cron only; no code changes.", correct: false },
        { text: "Store all tenants in one JSON row to scan faster.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "Laravel `SerializesModels` job references a deleted model instance — typical production outcome?";
      opts = [
        { text: "`ModelNotFoundException` on unserialize; handle with `deleteWhenMissingModels()` or avoid serializing volatile aggregates.", correct: true },
        { text: "The job silently becomes a no-op every time.", correct: false },
        { text: "Laravel restores the row from backups.", correct: false },
        { text: "The queue driver strips model payloads.", correct: false },
      ];
    } else {
      prompt = "Cross-service saga for `" + topic + "` without distributed transactions — coordinating compensations?";
      opts = [
        { text: "Choreography or orchestration with explicit compensate commands and durable process state per saga instance.", correct: true },
        { text: "Nested DB transactions across microservices.", correct: false },
        { text: "Global MySQL XA only.", correct: false },
        { text: "Fire-and-forget HTTP calls until all succeed.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + ". " + prompt,
      codeLines: null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function buildDataLayer(i) {
    var a = i % 10;
    var tbl = pick(["orders", "shipments", "ledger_entries", "subscriptions"], i);
    var prompt;
    var opts;
    var explain = "Schema design, isolation, and query plans: measure before optimizing; indexes serve real access paths.";

    if (a === 0) {
      prompt =
        "Heavy reporting on `" +
        tbl +
        "` slows OLTP. You add covering indexes on every column — risk?";
      opts = [
        { text: "Write amplification, larger buffers, slower inserts/updates; tune for actual predicates, not blanket coverage.", correct: true },
        { text: "PostgreSQL ignores extra indexes automatically.", correct: false },
        { text: "Covering indexes never affect write path.", correct: false },
        { text: "Always add indexes before profiling slow queries.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "`SELECT ... FOR UPDATE` inside a transaction on `" + tbl + "` row — which isolation concern is most relevant?";
      opts = [
        { text: "Lock duration and deadlock potential with other writers; keep transactions short and ordered lock acquisition.", correct: true },
        { text: "Dirty reads from other sessions.", correct: false },
        { text: "FOR UPDATE only applies to replicas.", correct: false },
        { text: "It prevents phantom reads in READ UNCOMMITTED.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "N+1 on `" + tbl + "` with Eager loading missing on a nested relation — fix at the data access layer?";
      opts = [
        { text: "`with()` / constrained eager loads or DTO queries that fetch the graph in bounded queries.", correct: true },
        { text: "Increase `max_connections` indefinitely.", correct: false },
        { text: "Cache the entire table in APCu.", correct: false },
        { text: "Switch to MongoDB to remove joins.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Partial index on `" + tbl + "` for `WHERE status = 'open'` — when is it better than a full btree on `status`?";
      opts = [
        { text: "Highly selective predicate and smaller hot index; verify planner uses it for real filters and sort orders.", correct: true },
        { text: "Always smaller regardless of cardinality.", correct: false },
        { text: "When the table has fewer than 1000 rows.", correct: false },
        { text: "Partial indexes speed up writes on excluded rows.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Read replica lag for `" + tbl + "` dashboard — user updates then reads replica. Mitigation?";
      opts = [
        { text: "Route critical reads to primary, session stickiness, or expose staleness and debounce UI.", correct: true },
        { text: "Disable binary logging on primary.", correct: false },
        { text: "Assume replicas are synchronous by default.", correct: false },
        { text: "Force `READ COMMITTED` on replica only.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "Long-running migration altering `" + tbl + "` on a busy MySQL — safest operational approach?";
      opts = [
        { text: "Online schema tools or expand-contract pattern; avoid full table rewrites in peak traffic without replicas strategy.", correct: true },
        { text: "Run `ALTER` inside a giant transaction to roll back easily.", correct: false },
        { text: "Pause traffic globally until migration finishes.", correct: false },
        { text: "Use `DELETE` then `INSERT` instead of `ALTER`.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Composite index `(tenant_id, created_at)` on `" + tbl + "` — query filters `created_at` range only. Planner behavior likely?";
      opts = [
        { text: "May not use index efficiently without `tenant_id` predicate; align index order with query shape.", correct: true },
        { text: "MySQL always skips leftmost prefix rules.", correct: false },
        { text: "Reverse column order never matters.", correct: false },
        { text: "Add `FORCE INDEX` in application code by default.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "Soft deletes on `" + tbl + "` — subtle cost at scale?";
      opts = [
        { text: "Unique constraints and index bloat; adjust partial uniques and housekeeping/archival policies.", correct: true },
        { text: "Soft deletes remove rows from disk immediately.", correct: false },
        { text: "They eliminate need for foreign keys.", correct: false },
        { text: "Always faster than hard deletes.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "Deadlock detected between two transactions updating `" + tbl + "` — first structural fix?";
      opts = [
        { text: "Consistent lock ordering, smaller transactions, and retry-safe idempotent updates.", correct: true },
        { text: "Set isolation level to SERIALIZABLE globally.", correct: false },
        { text: "Remove indexes to reduce lock types.", correct: false },
        { text: "Use `sleep()` between updates.", correct: false },
      ];
    } else {
      prompt = "Storing money amounts for `" + tbl + "` in floating JSON — production-safe alternative?";
      opts = [
        { text: "Integer minor units or DECIMAL with explicit rounding rules at boundaries.", correct: true },
        { text: "Double is fine if you round once on display.", correct: false },
        { text: "Store formatted strings with currency symbol.", correct: false },
        { text: "Use float and `number_format()` before insert.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + ". " + prompt,
      codeLines: null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  function buildReliabilityOps(i) {
    var a = i % 10;
    var svc = pick(["payments-api", "auth-service", "search", "webhooks-ingest"], i);
    var prompt;
    var opts;
    var explain = "Production ops: observe, limit blast radius, and automate safe rollbacks.";

    if (a === 0) {
      prompt = "Canary deploy for `" + svc + "` shows elevated 5xx on 5% traffic — first action?";
      opts = [
        { text: "Auto-rollback or halt progression; preserve observability correlation IDs across versions.", correct: true },
        { text: "Scale replicas until errors disappear.", correct: false },
        { text: "Route 100% traffic to canary to reproduce faster.", correct: false },
        { text: "Disable health checks to stabilize metrics.", correct: false },
      ];
    } else if (a === 1) {
      prompt = "SLO for `" + svc + "` p99 latency — error budget exhausted mid-quarter. Product wants new features. Guidance?";
      opts = [
        { text: "Freeze risky releases, pay down latency debt, and negotiate scope with budget visibility.", correct: true },
        { text: "Ignore SLO until next quarter.", correct: false },
        { text: "Lower SLO target in Grafana.", correct: false },
        { text: "Hide p99; report p50 only.", correct: false },
      ];
    } else if (a === 2) {
      prompt = "Docker image for `" + svc + "` includes dev tools and SSH — security posture?";
      opts = [
        { text: "Distroless or minimal runtime, non-root user, no secrets in layers, scan in CI.", correct: true },
        { text: "Smaller attack surface if you compress the image.", correct: false },
        { text: "SSH in container is required for twelve-factor.", correct: false },
        { text: "Dev dependencies help runtime debugging so keep them.", correct: false },
      ];
    } else if (a === 3) {
      prompt = "Structured JSON logs for `" + svc + "` — field you insist on for cross-service traces?";
      opts = [
        { text: "Trace/span IDs (W3C trace context) plus tenant/user correlation, not only free-text messages.", correct: true },
        { text: "PHP file path only.", correct: false },
        { text: "Log level `DEBUG` for all traffic permanently.", correct: false },
        { text: "Stack traces without hashing PII.", correct: false },
      ];
    } else if (a === 4) {
      prompt = "Blue/green cutover for `" + svc + "` with incompatible DB migration — safe sequence?";
      opts = [
        { text: "Expand/contract or backward-compatible schema first; dual-write/dual-read phases before dropping old shape.", correct: true },
        { text: "Migrate DB first, deploy code later without compatibility.", correct: false },
        { text: "Drop columns before deploying new code to save space.", correct: false },
        { text: "Run migration only on green database copy.", correct: false },
      ];
    } else if (a === 5) {
      prompt = "Secrets for `" + svc + "` in repo `.env.production` committed historically — remediation?";
      opts = [
        { text: "Rotate all exposed credentials, purge history or invalidate keys, move to vault/secret manager with short TTL.", correct: true },
        { text: "Revert the commit; git forgets secrets.", correct: false },
        { text: "Base64-encode values so scanners skip them.", correct: false },
        { text: "Private repo means no rotation needed.", correct: false },
      ];
    } else if (a === 6) {
      prompt = "Post-incident review for `" + svc + "` outage — most valuable artifact for senior backend team?";
      opts = [
        { text: "Blameless timeline, contributing factors, concrete guardrails (tests, limits, alerts), and tracked follow-ups.", correct: true },
        { text: "Single root cause name only.", correct: false },
        { text: "List of who was on call.", correct: false },
        { text: "Promise to never deploy Fridays.", correct: false },
      ];
    } else if (a === 7) {
      prompt = "Rate limit bypass attempts on `" + svc + "` via rotating IPs — edge mitigation?";
      opts = [
        { text: "Authenticated tenant limits, proof-of-work/captcha for anon, WAF/bot rules, and behavioral scoring.", correct: true },
        { text: "Block country TLDs entirely.", correct: false },
        { text: "Disable HTTPS to inspect payloads faster.", correct: false },
        { text: "Per-CPU core limits only.", correct: false },
      ];
    } else if (a === 8) {
      prompt = "Feature flag killswitch for `" + svc + "` misbehaving path — implementation preference?";
      opts = [
        { text: "Evaluated close to call site with safe default off; avoid remote flag RPC on hot inner loops without cache.", correct: true },
        { text: "Hardcode `if (false)` and redeploy.", correct: false },
        { text: "Database poll per request for flag state.", correct: false },
        { text: "Flags belong only in frontend bundles.", correct: false },
      ];
    } else {
      prompt = "Backup strategy for `" + svc + "` Postgres — validate restore how often?";
      opts = [
        { text: "Regular automated restore drills to non-prod; test RPO/RTO, not only dump size.", correct: true },
        { text: "Once at project kickoff.", correct: false },
        { text: "If `pg_dump` exits 0, restore is guaranteed.", correct: false },
        { text: "Replicas replace backups.", correct: false },
      ];
    }

    return {
      prompt: "Q" + (i + 1) + ". " + prompt,
      codeLines: null,
      options: rotateOpts(opts, i),
      explain: explain,
    };
  }

  window.PORTFOLIO.gamesStudio = {
    heroImage: "",
    roundsPerGame: 5,
    categoryBlurbs: {
      php: "CV-themed PHP: runtime, security, types, and production hygiene. 100-question bank — 5 random MCQ rounds.",
      laravel:
        "Laravel delivery patterns: Eloquent, queues, migrations, APIs. 100-question bank — 5 random MCQ rounds.",
      public:
        "Architecture, scale, and leadership judgment from real delivery. 100-question bank — 5 random MCQ rounds.",
      sqlBuilder:
        "Assemble SQL from tokens (TASK + schema + clauses). 100 challenges — 5 per run; validate with Run query.",
      systemDesign:
        "On-call style architecture judgment: caching, reliability, scaling, and messaging. 100-question bank — 5 random rounds.",
      apiDiagnosis:
        "Match real-world HTTP semantics to scenarios (RFC-minded). 100-question bank — 5 random rounds.",
      eventQueues:
        "Event-driven backends: Laravel queues, Horizon, retries, outbox, and idempotent consumers. 100-question bank — 5 random rounds.",
      dataLayer:
        "Databases in production: indexes, transactions, replicas, migrations, and money types. 100-question bank — 5 random rounds.",
      reliabilityOps:
        "Shipping safely: deploys, SLOs, containers, secrets, incidents, and flags. 100-question bank — 5 random rounds.",
    },
    categories: {
      systemDesign: build100(buildSd),
      apiDiagnosis: build100(buildApi),
      eventQueues: build100(buildEventQueues),
      dataLayer: build100(buildDataLayer),
      reliabilityOps: build100(buildReliabilityOps),
    },
  };
})();
