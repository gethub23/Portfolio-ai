/**
 * SQL Builder token challenges — 100 deterministic scenarios (task + schema + token bank + solution order).
 */
(function () {
  "use strict";

  if (!window.PORTFOLIO) window.PORTFOLIO = {};

  function pick(arr, v) {
    return arr[v % arr.length];
  }

  function shuffleCopy(arr) {
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

  function joinPending(v) {
    var O = pick(["orders", "purchases", "bookings"], v);
    var C = "customers";
    var st = pick(["'pending'", "'open'", "'new'"], v);
    var p = "p" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: C + ".name" },
      { id: p + "3", display: "," },
      { id: p + "4", display: O + ".id" },
      { id: p + "5", display: "FROM" },
      { id: p + "6", display: O },
      { id: p + "7", display: "JOIN" },
      { id: p + "8", display: C },
      { id: p + "9", display: "ON" },
      { id: p + "10", display: O + ".customer_id = " + C + ".id" },
      { id: p + "11", display: "WHERE" },
      { id: p + "12", display: O + ".status = " + st },
      { id: p + "d1", display: "LEFT JOIN " + C + " ON 1=1" },
      { id: p + "d2", display: "SELECT *" },
      { id: p + "d3", display: "WHERE " + C + ".id = 0" },
      { id: p + "d4", display: "FULL OUTER JOIN " + C },
    ];
    var solution = [
      p + "1",
      p + "2",
      p + "3",
      p + "4",
      p + "5",
      p + "6",
      p + "7",
      p + "8",
      p + "9",
      p + "10",
      p + "11",
      p + "12",
    ];
    return {
      task:
        "Get all " +
        String(st).replace(/'/g, "") +
        " rows from `" +
        O +
        "` together with the customer’s name using a JOIN.",
      schema: [
        "TABLE " + O + ": id, customer_id, status",
        "TABLE " + C + ": id, name, email",
      ],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain:
        "Select needed columns, join parent to " + C + " on the foreign key, then filter " + O + ".status.",
    };
  }

  function countByRegion(v) {
    var T = pick(["users", "accounts", "merchants"], v);
    var col = pick(["region", "country", "tier"], v);
    var p = "g" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: col },
      { id: p + "3", display: "," },
      { id: p + "4", display: "COUNT(*)" },
      { id: p + "5", display: "FROM" },
      { id: p + "6", display: T },
      { id: p + "7", display: "GROUP BY" },
      { id: p + "8", display: col },
      { id: p + "d1", display: "ORDER BY COUNT(*)" },
      { id: p + "d2", display: "HAVING " + col + " > 0" },
      { id: p + "d3", display: "DISTINCT " + col },
      { id: p + "d4", display: "SUM(" + col + ")" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8"];
    return {
      task: "Count how many rows exist per `" + col + "` in `" + T + "`.",
      schema: ["TABLE " + T + ": id, " + col + ", created_at"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "Use GROUP BY on the dimension you aggregate, with COUNT(*) for row counts.",
    };
  }

  function lowStock(v) {
    var P = pick(["products", "skus", "variants"], v);
    var p = "s" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: "id, name, stock" },
      { id: p + "3", display: "FROM" },
      { id: p + "4", display: P },
      { id: p + "5", display: "WHERE" },
      { id: p + "6", display: "stock < 5" },
      { id: p + "d1", display: "WHERE stock = NULL" },
      { id: p + "d2", display: "HAVING stock < 5" },
      { id: p + "d3", display: "SELECT *" },
      { id: p + "d4", display: "LIMIT 5" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6"];
    return {
      task: "List id, name, and stock for `" + P + "` rows where stock is below 5.",
      schema: ["TABLE " + P + ": id, name, stock, price"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "Filter with WHERE on numeric stock; avoid comparing NULL with =.",
    };
  }

  function updateBalance(v) {
    var L = pick(["ledger", "wallets", "balances"], v);
    var p = "u" + v + "_";
    var tokens = [
      { id: p + "1", display: "UPDATE" },
      { id: p + "2", display: L },
      { id: p + "3", display: "SET" },
      { id: p + "4", display: "amount = amount - 10" },
      { id: p + "5", display: "WHERE" },
      { id: p + "6", display: "id = " + (100 + v) },
      { id: p + "d1", display: "SET amount = -10" },
      { id: p + "d2", display: "WHERE 1=1" },
      { id: p + "d3", display: "DELETE FROM " + L },
      { id: p + "d4", display: "INSERT INTO " + L },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6"];
    return {
      task: "Subtract 10 from `amount` for the row with id " + (100 + v) + " in `" + L + "`.",
      schema: ["TABLE " + L + ": id, amount, currency"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "UPDATE ... SET ... WHERE targets a single row safely.",
    };
  }

  function deleteExpiredSessions(v) {
    var S = pick(["sessions", "tokens", "cache_keys"], v);
    var p = "d" + v + "_";
    var tokens = [
      { id: p + "1", display: "DELETE FROM" },
      { id: p + "2", display: S },
      { id: p + "3", display: "WHERE" },
      { id: p + "4", display: "expires_at < NOW()" },
      { id: p + "d1", display: "WHERE expires_at IS NULL" },
      { id: p + "d2", display: "TRUNCATE " + S },
      { id: p + "d3", display: "DROP TABLE " + S },
      { id: p + "d4", display: "DELETE " + S },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4"];
    return {
      task: "Remove expired rows from `" + S + "` (expiry in the past).",
      schema: ["TABLE " + S + ": id, user_id, expires_at"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "DELETE with a time predicate; prefer batching in production jobs.",
    };
  }

  function orderRecent(v) {
    var T = pick(["events", "logs", "audit_rows"], v);
    var p = "o" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: "*" },
      { id: p + "3", display: "FROM" },
      { id: p + "4", display: T },
      { id: p + "5", display: "ORDER BY" },
      { id: p + "6", display: "created_at DESC" },
      { id: p + "7", display: "LIMIT" },
      { id: p + "8", display: "20" },
      { id: p + "d1", display: "ORDER BY RAND()" },
      { id: p + "d2", display: "LIMIT 100 OFFSET 99999" },
      { id: p + "d3", display: "GROUP BY created_at" },
      { id: p + "d4", display: "DISTINCT *" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8"];
    return {
      task: "Fetch the 20 most recent rows from `" + T + "` by `created_at`.",
      schema: ["TABLE " + T + ": id, payload, created_at"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "ORDER BY created_at DESC with LIMIT for stable recent pages.",
    };
  }

  function innerJoinTwo(v) {
    var A = pick(["invoices", "shipments"], v);
    var B = pick(["carriers", "drivers"], v);
    var p = "j" + v + "_";
    var onExpr = A + ".carrier_id = " + B + ".id";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: A + ".*, " + B + ".name" },
      { id: p + "3", display: "FROM" },
      { id: p + "4", display: A },
      { id: p + "5", display: "INNER JOIN" },
      { id: p + "6", display: B },
      { id: p + "7", display: "ON" },
      { id: p + "8", display: onExpr },
      { id: p + "d1", display: "LEFT JOIN " + B + " ON 0" },
      { id: p + "d2", display: "CROSS JOIN " + B },
      { id: p + "d3", display: "WHERE " + B + ".id IS NULL" },
      { id: p + "d4", display: "SELECT * FROM " + A },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8"];
    return {
      task: "Return `" + A + "` rows with matching `" + B + ".name` via an inner join.",
      schema: [
        "TABLE " + A + ": id, carrier_id, total",
        "TABLE " + B + ": id, name, phone",
      ],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "INNER JOIN keeps only rows with a match on " + onExpr + ".",
    };
  }

  function leftAntiJoin(v) {
    var P = pick(["projects", "repos"], v);
    var T = pick(["tasks", "issues"], v);
    var p = "a" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: P + ".*" },
      { id: p + "3", display: "FROM" },
      { id: p + "4", display: P },
      { id: p + "5", display: "LEFT JOIN" },
      { id: p + "6", display: T },
      { id: p + "7", display: "ON" },
      { id: p + "8", display: P + ".id = " + T + ".project_id" },
      { id: p + "9", display: "WHERE" },
      { id: p + "10", display: T + ".id IS NULL" },
      { id: p + "d1", display: "WHERE " + T + ".id IS NOT NULL" },
      { id: p + "d2", display: "INNER JOIN " + T },
      { id: p + "d3", display: "RIGHT JOIN " + T },
      { id: p + "d4", display: "ON 1=1" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8", p + "9", p + "10"];
    return {
      task: "List `" + P + "` that have **no** `" + T + "` attached.",
      schema: [
        "TABLE " + P + ": id, name",
        "TABLE " + T + ": id, project_id, title",
      ],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "LEFT JOIN + WHERE child.id IS NULL is the classic anti-join pattern.",
    };
  }

  function havingAgg(v) {
    var O = pick(["orders", "subscriptions"], v);
    var p = "h" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT" },
      { id: p + "2", display: "user_id" },
      { id: p + "3", display: "," },
      { id: p + "4", display: "SUM(total) AS revenue" },
      { id: p + "5", display: "FROM" },
      { id: p + "6", display: O },
      { id: p + "7", display: "GROUP BY" },
      { id: p + "8", display: "user_id" },
      { id: p + "9", display: "HAVING" },
      { id: p + "10", display: "SUM(total) > 1000" },
      { id: p + "d1", display: "WHERE SUM(total) > 1000" },
      { id: p + "d2", display: "GROUP BY total" },
      { id: p + "d3", display: "COUNT(user_id)" },
      { id: p + "d4", display: "ORDER BY revenue" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8", p + "9", p + "10"];
    return {
      task: "Per `user_id`, sum `total` in `" + O + "` and keep only users with revenue over 1000.",
      schema: ["TABLE " + O + ": id, user_id, total, created_at"],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "Aggregates need GROUP BY; filter aggregates with HAVING, not WHERE.",
    };
  }

  function distinctUsers(v) {
    var U = pick(["users", "accounts"], v);
    var O = pick(["orders", "views"], v);
    var p = "n" + v + "_";
    var tokens = [
      { id: p + "1", display: "SELECT DISTINCT" },
      { id: p + "2", display: U + ".id" },
      { id: p + "3", display: "FROM" },
      { id: p + "4", display: U },
      { id: p + "5", display: "INNER JOIN" },
      { id: p + "6", display: O },
      { id: p + "7", display: "ON" },
      { id: p + "8", display: U + ".id = " + O + ".user_id" },
      { id: p + "d1", display: "SELECT " + U + ".id" },
      { id: p + "d2", display: "LEFT JOIN " + O },
      { id: p + "d3", display: "GROUP BY " + U + ".id" },
      { id: p + "d4", display: "UNION ALL" },
    ];
    var solution = [p + "1", p + "2", p + "3", p + "4", p + "5", p + "6", p + "7", p + "8"];
    return {
      task: "List distinct `" + U + ".id` values that appear in `" + O + "`.",
      schema: [
        "TABLE " + U + ": id, email",
        "TABLE " + O + ": id, user_id, amount",
      ],
      tokens: shuffleCopy(tokens),
      solution: solution,
      explain: "DISTINCT or GROUP BY; INNER JOIN restricts to users with at least one related row.",
    };
  }

  var builders = [
    joinPending,
    countByRegion,
    lowStock,
    updateBalance,
    deleteExpiredSessions,
    orderRecent,
    innerJoinTwo,
    leftAntiJoin,
    havingAgg,
    distinctUsers,
  ];

  function buildOne(i) {
    return builders[i % 10](Math.floor(i / 10));
  }

  var bank = [];
  var k;
  for (k = 0; k < 100; k++) {
    bank.push(buildOne(k));
  }

  window.PORTFOLIO.sqlBuilderChallenges = bank;
})();
