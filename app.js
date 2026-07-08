// CCA-F 学習アプリ ロジック
// 依存: window.QUESTIONS (questions.js) を先に読み込むこと。
// 進捗は localStorage("ccaf_progress") に保存。

(function () {
  "use strict";

  var QUESTIONS = window.QUESTIONS || [];
  var STORE_KEY = "ccaf_progress";

  // ドメインごとの表示メタ（表示順・短縮名・テーマ色）
  var DOMAIN_META = {
    "Agentic Architecture & Orchestration": { short: "Agentic Architecture", abbr: "Agentic", color: "#4a90e2" },
    "Prompt Engineering & Structured Output": { short: "Prompt Engineering", abbr: "Prompt", color: "#f0863a" },
    "Claude Code Configuration & Workflows": { short: "Claude Code Workflows", abbr: "Claude Code", color: "#46b37d" },
    "Tool Design & MCP Integration": { short: "Tool Design & MCP", abbr: "MCP", color: "#dca000" },
    "Context Management & Reliability": { short: "Context Management", abbr: "Context", color: "#8b7fe8" },
  };
  var DOMAINS = Object.keys(DOMAIN_META);

  // ---- 進捗ストア ------------------------------------------------------
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(p));
    } catch (e) {
      /* localStorage 不可でも演習は継続 */
    }
  }
  var progress = loadProgress();

  function recordResult(id, isCorrect) {
    var r = progress[id] || { seen: 0, correct: 0, wrong: 0, lastResult: null };
    r.seen += 1;
    if (isCorrect) r.correct += 1;
    else r.wrong += 1;
    r.lastResult = isCorrect ? "correct" : "wrong";
    progress[id] = r;
    saveProgress(progress);
  }

  // ドメイン単位の集計
  function domainStats(domain) {
    var qCount = 0, seenCount = 0, attempts = 0, correct = 0;
    QUESTIONS.forEach(function (q) {
      if (q.domain !== domain) return;
      qCount += 1;
      var r = progress[q.id];
      if (r && r.seen > 0) {
        seenCount += 1;
        attempts += r.seen;
        correct += r.correct;
      }
    });
    return {
      qCount: qCount,
      seenCount: seenCount,
      attempts: attempts,
      correct: correct,
      pct: attempts ? Math.round((correct / attempts) * 100) : null,
    };
  }

  function overallStats() {
    var answered = 0, totalCorrect = 0, totalAttempts = 0, wrongCount = 0;
    QUESTIONS.forEach(function (q) {
      var r = progress[q.id];
      if (r && r.seen > 0) {
        answered += 1;
        totalCorrect += r.correct;
        totalAttempts += r.seen;
        if (r.lastResult === "wrong") wrongCount += 1;
      }
    });
    return {
      total: QUESTIONS.length,
      answered: answered,
      totalAttempts: totalAttempts,
      wrongCount: wrongCount,
      pct: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    };
  }

  // ---- SVGヘルパー -----------------------------------------------------
  function ringSVG(pct, size, stroke) {
    size = size || 62;
    stroke = stroke || 7;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    var cx = size / 2;
    return (
      '<span class="ring"><svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '">' +
      '<g transform="rotate(-90 ' + cx + " " + cx + ')">' +
      '<circle class="ring-track" cx="' + cx + '" cy="' + cx + '" r="' + r + '" stroke-width="' + stroke + '"/>' +
      '<circle class="ring-fill" cx="' + cx + '" cy="' + cx + '" r="' + r + '" stroke-width="' + stroke +
      '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '" data-off="' + off.toFixed(1) + '"/>' +
      "</g>" +
      '<text class="ring-text" x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="' +
      (size * 0.3).toFixed(1) + '">' + Math.round(pct) + "</text>" +
      "</svg></span>"
    );
  }

  // ---- ホーム / Overview ----------------------------------------------
  function renderHome() {
    var o = overallStats();
    var el = document.getElementById("home-area");

    var msg =
      o.answered === 0
        ? "まずは1問、はじめてみましょう。"
        : "正答率 " + o.pct + "%。この調子でいきましょう。";

    var html = "";

    // 挨拶
    html += '<div class="greeting">';
    html += '<p class="hi">こんにちは <span class="accent">👋</span></p>';
    html += '<p class="msg">' + esc(msg) + "</p>";
    html += "</div>";

    // ドメイン別マスタリー
    html += '<h2 class="section-title">ドメイン別マスタリー</h2>';
    html += '<div class="mastery-grid">';
    DOMAINS.forEach(function (d) {
      var s = domainStats(d);
      var m = DOMAIN_META[d];
      var pct = s.pct === null ? 0 : s.pct;
      var meta =
        s.pct === null
          ? s.qCount + "問<b>未着手</b>"
          : s.correct + "/" + s.attempts + " 正解<b>" + s.qCount + "問</b>";
      html +=
        '<button class="mastery-card" data-domain="' + esc(d) + '" ' +
        'style="background:linear-gradient(140deg,' + m.color + "," + shade(m.color, -14) + ')">' +
        '<span class="mc-name">' + esc(m.short) + "</span>" +
        '<span class="mc-bottom">' + ringSVG(pct, 58, 7) +
        '<span class="mc-meta">' + meta + "</span></span>" +
        "</button>";
    });
    // 総合カード
    html +=
      '<button class="mastery-card is-overall" data-domain="ALL">' +
      '<span class="mc-name">総合マスタリー</span>' +
      '<span class="mc-bottom">' + ringSVG(o.pct, 58, 7) +
      '<span class="mc-meta">全' + o.total + "問<b>" + o.answered + "問 回答済み</b></span></span>" +
      "</button>";
    html += "</div>";

    // CTA
    html +=
      '<button class="cta" id="cta-start">' +
      '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>演習をはじめる</button>';

    // Statistics
    html += '<h2 class="section-title">Statistics</h2>';
    html += '<div class="stat-grid">';
    html += statTile("総合正答率", o.pct, "%");
    html += statTile("回答済み", o.answered, "/" + o.total);
    html += statTile("累計回答", o.totalAttempts, "回");
    html += statTile("復習リスト", o.wrongCount, "問");
    html += "</div>";

    // ドメイン別 正答率 棒グラフ
    html += '<h2 class="section-title">ドメイン別 正答率</h2>';
    html += '<div class="chart-card"><div class="bars">';
    DOMAINS.forEach(function (d) {
      var s = domainStats(d);
      var m = DOMAIN_META[d];
      var pct = s.pct === null ? 0 : s.pct;
      var ghost = s.pct === null ? " ghost" : "";
      var pctLabel = s.pct === null ? "—" : s.pct + "%";
      html +=
        '<div class="bar-col">' +
        '<span class="bar-pct" style="color:' + m.color + '">' + pctLabel + "</span>" +
        '<span class="bar-track"><span class="bar-fill' + ghost +
        '" data-h="' + pct + '" style="background:linear-gradient(180deg,' + shade(m.color, 12) + "," + m.color + ')"></span></span>' +
        '<span class="bar-lbl">' + esc(m.abbr) + "</span>" +
        "</div>";
    });
    html += "</div></div>";

    // リセット
    html += '<div class="reset-row"><button class="btn-ghost" id="btn-reset">進捗をリセット</button></div>';

    el.innerHTML = html;

    // アニメーション適用（挿入後に目標値へ）
    requestAnimationFrame(function () {
      el.querySelectorAll(".ring-fill").forEach(function (c) {
        c.style.strokeDashoffset = c.getAttribute("data-off");
      });
      el.querySelectorAll(".bar-fill").forEach(function (b) {
        b.style.height = b.getAttribute("data-h") + "%";
      });
    });

    // マスタリーカード → そのドメインで演習
    el.querySelectorAll(".mastery-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var d = btn.getAttribute("data-domain");
        document.getElementById("f-domain").value = d;
        document.getElementById("f-filter").value = "all";
        switchTab("quiz");
        buildQueue();
        renderCurrent();
      });
    });
    document.getElementById("cta-start").addEventListener("click", function () {
      switchTab("quiz");
    });
    document.getElementById("btn-reset").addEventListener("click", function () {
      if (confirm("進捗をすべてリセットします。よろしいですか？")) {
        progress = {};
        saveProgress(progress);
        renderHome();
      }
    });
  }

  function statTile(label, num, unit) {
    return (
      '<div class="stat"><div class="lbl">' + esc(label) + "</div>" +
      '<div class="val-row"><span class="bar-accent"></span>' +
      '<span class="num">' + esc(String(num)) + '<span class="unit">' + esc(unit) + "</span></span></div></div>"
    );
  }

  // 色を明/暗方向へずらす（percent: 正=明るく、負=暗く）
  function shade(hex, percent) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    var t = percent < 0 ? 0 : 255;
    var p = Math.abs(percent) / 100;
    function mix(x) { return Math.round((t - x) * p + x); }
    return "rgb(" + mix(r) + "," + mix(g) + "," + mix(b) + ")";
  }

  // ---- 出題キュー ------------------------------------------------------
  var queue = [];
  var queuePos = 0;
  var answeredThisQuestion = false;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function buildQueue() {
    var domain = document.getElementById("f-domain").value;
    var filter = document.getElementById("f-filter").value;
    var order = document.getElementById("f-order").value;

    var list = QUESTIONS.filter(function (q) {
      if (domain !== "ALL" && q.domain !== domain) return false;
      var r = progress[q.id];
      if (filter === "unanswered") return !r || r.seen === 0;
      if (filter === "wrong") return r && r.lastResult === "wrong";
      return true;
    });

    if (order === "random") list = shuffle(list);
    queue = list;
    queuePos = 0;
  }

  // ---- 演習描画 --------------------------------------------------------
  function normalizeAnswer(ans) {
    return Array.isArray(ans) ? ans.slice().sort() : [ans];
  }
  function isMulti(q) {
    return Array.isArray(q.answer);
  }

  function renderCurrent() {
    var container = document.getElementById("quiz-area");
    if (queue.length === 0) {
      container.innerHTML =
        '<div class="empty">対象の問題がありません。<br>条件を変えて「この条件で始める」を押してください。<br>' +
        "（「間違えた問題だけ」は、一度不正解にした問題が対象です）</div>";
      updateProgressLine();
      return;
    }
    if (queuePos >= queue.length) {
      container.innerHTML =
        '<div class="empty">このセットは終わりです 🎉<br>もう一度「この条件で始める」で続けられます。</div>';
      updateProgressLine();
      return;
    }

    var q = queue[queuePos];
    answeredThisQuestion = false;
    var multi = isMulti(q);
    var selected = [];
    var m = DOMAIN_META[q.domain] || { color: "#3d8bf0" };

    var html = "";
    html += '<div class="card">';
    html +=
      '<span class="domain-badge" style="color:' + m.color + ";background:" + shade(m.color, 86) + '">' +
      esc(q.domain) + "</span>";
    html += '<p class="qtext">' + esc(q.question_en) + "</p>";
    html += '<button class="toggle-ja" id="btn-ja">和訳を見る ⌄</button>';
    html += '<p class="qtext-ja" id="qtext-ja">' + esc(q.question_ja) + "</p>";
    if (multi) {
      html += '<p class="multi-note">※ 複数選択。該当をすべて選び「回答する」を押してください。</p>';
    } else {
      html += '<p class="hint">選択肢をタップすると採点します</p>';
    }

    html += '<div class="choices" id="choices">';
    q.choices.forEach(function (c) {
      html +=
        '<button class="choice" data-key="' + c.key + '">' +
        '<span class="key">' + c.key + "</span>" +
        '<span><span class="en">' + esc(c.en) + '</span><span class="ja">' + esc(c.ja) + "</span></span>" +
        "</button>";
    });
    html += "</div>";

    if (multi) {
      html += '<button class="btn-primary submit-multi" id="btn-submit">回答する</button>';
    }
    html += '<div id="result-area"></div>';
    html += "</div>";

    container.innerHTML = html;

    document.getElementById("btn-ja").addEventListener("click", function () {
      document.getElementById("qtext-ja").classList.toggle("show");
    });

    var choiceEls = container.querySelectorAll(".choice");
    choiceEls.forEach(function (elc) {
      elc.addEventListener("click", function () {
        if (answeredThisQuestion) return;
        var key = elc.getAttribute("data-key");
        if (multi) {
          var idx = selected.indexOf(key);
          if (idx >= 0) {
            selected.splice(idx, 1);
            elc.classList.remove("selected");
          } else {
            selected.push(key);
            elc.classList.add("selected");
          }
        } else {
          grade(q, [key], choiceEls);
        }
      });
    });

    if (multi) {
      document.getElementById("btn-submit").addEventListener("click", function () {
        if (answeredThisQuestion || selected.length === 0) return;
        grade(q, selected, choiceEls);
      });
    }

    updateProgressLine();
  }

  function grade(q, picked, choiceEls) {
    answeredThisQuestion = true;
    var correctKeys = normalizeAnswer(q.answer);
    var pickedSorted = picked.slice().sort();
    var isCorrect =
      pickedSorted.length === correctKeys.length &&
      pickedSorted.every(function (k, i) { return k === correctKeys[i]; });

    choiceEls.forEach(function (elc) {
      var key = elc.getAttribute("data-key");
      elc.disabled = true;
      elc.classList.remove("selected");
      var isAnswer = correctKeys.indexOf(key) >= 0;
      var wasPicked = picked.indexOf(key) >= 0;
      if (isAnswer) elc.classList.add("correct");
      if (wasPicked && !isAnswer) elc.classList.add("wrong");
    });

    var submitBtn = document.getElementById("btn-submit");
    if (submitBtn) submitBtn.style.display = "none";

    recordResult(q.id, isCorrect);

    var ra = document.getElementById("result-area");
    var out = "";
    out +=
      '<div class="verdict ' + (isCorrect ? "correct" : "wrong") + '">' +
      (isCorrect ? "✅ 正解！" : "❌ 不正解") + "　正解: " + correctKeys.join(", ") + "</div>";

    out += '<div class="explanation"><h4>EXPLANATION / 解説</h4>';
    out += '<p class="en">' + esc(q.explanation_en) + "</p>";
    out += '<p class="ja">' + esc(q.explanation_ja) + "</p></div>";

    if (q.vocab && q.vocab.length) {
      out += '<div class="vocab-block"><h4>この問題の頻出単語</h4>';
      q.vocab.forEach(function (v) {
        out += '<div class="vocab-card"><span class="word">' + esc(v.word) + "</span>";
        out += '<div class="meaning">' + esc(v.ja) + "</div>";
        if (v.example) out += '<div class="example">e.g. ' + esc(v.example) + "</div>";
        out += "</div>";
      });
      out += "</div>";
    }

    var last = queuePos >= queue.length - 1;
    out += '<div class="actions"><button class="btn-primary" id="btn-next">' +
      (last ? "セット完了へ" : "次の問題へ →") + "</button></div>";

    ra.innerHTML = out;
    document.getElementById("btn-next").addEventListener("click", function () {
      queuePos += 1;
      renderCurrent();
    });
    updateProgressLine();
  }

  function updateProgressLine() {
    var el = document.getElementById("progress-line");
    if (queue.length === 0) { el.textContent = ""; return; }
    var pos = Math.min(queuePos + 1, queue.length);
    el.textContent = pos + " / " + queue.length + " 問";
  }

  // ---- 単語モード ------------------------------------------------------
  function renderVocab() {
    var area = document.getElementById("vocab-area");
    var seen = {};
    var items = [];
    QUESTIONS.forEach(function (q) {
      (q.vocab || []).forEach(function (v) {
        var key = v.word.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;
        items.push({ v: v, domain: q.domain });
      });
    });
    items.sort(function (a, b) {
      return a.v.word.toLowerCase() < b.v.word.toLowerCase() ? -1 : 1;
    });

    if (items.length === 0) {
      area.innerHTML = '<div class="empty">単語がありません。</div>';
      return;
    }

    var html = '<p class="screen-sub" style="margin:0 2px 14px">全 ' + items.length + " 語</p>";
    items.forEach(function (it) {
      var m = DOMAIN_META[it.domain] || { color: "#3d8bf0", abbr: "" };
      html += '<div class="vocab-item"><div class="top">';
      html += '<span class="word">' + esc(it.v.word) + "</span>";
      html += '<span class="chip" style="color:' + m.color + ";background:" + shade(m.color, 86) + '">' + esc(m.abbr) + "</span>";
      html += "</div>";
      html += '<div class="meaning">' + esc(it.v.ja) + "</div>";
      if (it.v.example) html += '<div class="example">e.g. ' + esc(it.v.example) + "</div>";
      html += "</div>";
    });
    area.innerHTML = html;
  }

  // ---- タブ切替 --------------------------------------------------------
  function switchTab(name) {
    document.querySelectorAll(".nav-item").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-view") === name);
    });
    document.querySelectorAll(".view").forEach(function (v) {
      v.classList.toggle("active", v.id === "view-" + name);
    });
    if (name === "home") renderHome();
    if (name === "vocab") renderVocab();
    window.scrollTo(0, 0);
  }

  // ---- ユーティリティ --------------------------------------------------
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initDomainFilter() {
    var sel = document.getElementById("f-domain");
    DOMAINS.forEach(function (d) {
      var op = document.createElement("option");
      op.value = d;
      op.textContent = DOMAIN_META[d].abbr;
      sel.appendChild(op);
    });
  }

  function init() {
    if (!QUESTIONS.length) {
      document.getElementById("quiz-area").innerHTML =
        '<div class="empty">問題データが読み込めませんでした（questions.js を確認してください）。</div>';
      return;
    }
    initDomainFilter();

    document.querySelectorAll(".nav-item").forEach(function (t) {
      t.addEventListener("click", function () {
        switchTab(t.getAttribute("data-view"));
      });
    });

    document.getElementById("btn-start").addEventListener("click", function () {
      buildQueue();
      renderCurrent();
    });

    buildQueue();
    renderCurrent();
    renderHome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
