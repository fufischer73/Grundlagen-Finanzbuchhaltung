/* Lernpfad-Baukasten – interaktive Aufgaben und Arbeitsstand.
 * - :::buchung  Buchungssatz mit Auswahlfeldern (Soll-Konto, Haben-Konto, Betrag, optional Bilanzveränderung)
 * - :::auswahl  Frage mit Antwortmöglichkeiten
 * - :::hinweis  Tipp, der erst auf Klick erscheint (mehrere nacheinander)
 * - Lösungen: erst nach einem eigenen Versuch (bei :::aufgabe nach einer Rückfrage)
 * - Arbeitsstand: wird automatisch im Browser gespeichert; „Weitermachen“ springt zur letzten Aufgabe;
 *   „Stand sichern“/„Stand laden“ speichert/lädt eine kleine Datei (zum Wechsel von Gerät oder PC).
 * Läuft nach app.js (gleiche Seite) und nutzt LP.state / LP.save von dort. Im Moodle-Paket gibt es
 * keine Stand-Datei (Moodle speichert).
 */
(function () {
  "use strict";
  var K = window.LP_KURS || {};
  var IN_PKG = !!(window.LP_SCORM_CONFIG);

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function jsonAttr(node, name) {
    try { return JSON.parse(node.getAttribute(name) || "[]"); } catch (e) { return []; }
  }
  function currentFile() { return location.pathname.split("/").pop() || "index.html"; }
  function pageKey() { return document.body.dataset.module || currentFile(); }

  var LPX = window.LP || {};
  var S = LPX.state;            // gemeinsamer Zustand aus app.js
  if (!S) { return; }
  if (!S.ans) S.ans = {};
  function save() { if (LPX.save) LPX.save(); }

  var KONTEN = {};              // Nr → Name
  (K.konten || []).forEach(function (k) { KONTEN[k[0]] = k[1]; });
  function kontoText(nr) { return nr + (KONTEN[nr] ? " " + KONTEN[nr] : ""); }
  var TYPEN = { AT: "Aktivtausch", PT: "Passivtausch", APM: "Aktiv-Passiv-Mehrung", APD: "Aktiv-Passiv-Minderung" };

  function merke(task, titel) {
    S.pos = { file: currentFile(), id: task.id, titel: titel || "", modul: document.body.dataset.module || "", seite: document.title.split(" – ")[0] };
    save();
  }

  function zahl(s) {
    s = String(s || "").replace(/\s|€/g, "");
    if (!s) return NaN;
    if (s.indexOf(",") > -1) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");   // 6.400 → 6400
    return /^-?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  function euro(n) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  // ---------- Tipp- und Lösungsknöpfe (für :::buchung und :::auswahl) ----------
  function werkzeuge(box, st, loesungHtml, tipps, nachPruefen) {
    var leiste = el("div", { "class": "lp-tools" });
    var tippBtn = tipps.length ? el("button", { type: "button", "class": "btn secondary lp-tipp" }) : null;
    var solBtn = el("button", { type: "button", "class": "btn secondary lp-sol" }, "🔒 Lösung anzeigen");
    var tippBox = el("div", { "class": "lp-tipps", "aria-live": "polite" });
    var solBox = el("div", { "class": "box note lp-loesung", hidden: "hidden" });
    if (tippBtn) leiste.appendChild(tippBtn);
    leiste.appendChild(solBtn);
    box.querySelector(".lp-bau").appendChild(leiste);
    box.querySelector(".lp-bau").appendChild(tippBox);
    box.querySelector(".lp-bau").appendChild(solBox);

    function malTipps() {
      tippBox.innerHTML = "";
      for (var i = 0; i < (st.tipps || 0); i++) tippBox.appendChild(el("div", { "class": "box tip lp-tippzeile" }, "<strong>Tipp " + (i + 1) + ":</strong> " + tipps[i]));
      if (tippBtn) {
        if ((st.tipps || 0) >= tipps.length) { tippBtn.hidden = true; }
        else { tippBtn.hidden = false; tippBtn.textContent = "💡 Tipp anzeigen (" + ((st.tipps || 0) + 1) + " von " + tipps.length + ")"; }
      }
    }
    function malLoesung() {
      var versucht = (st.versuche || 0) > 0;
      solBtn.disabled = !versucht && !st.sol;
      solBtn.title = versucht || st.sol ? "" : "Probiere die Aufgabe zuerst selbst. Dann kannst du die Lösung ansehen.";
      solBtn.textContent = st.sol ? "Lösung ausblenden" : (versucht ? "Lösung anzeigen" : "🔒 Lösung (erst nach deinem Versuch)");
      solBox.hidden = !st.sol;
      if (st.sol) solBox.innerHTML = "<strong>Lösung</strong><br>" + nachPruefen.loesungHtml() + (loesungHtml ? "<br>" + loesungHtml : "");
    }
    if (tippBtn) tippBtn.addEventListener("click", function () {
      st.tipps = (st.tipps || 0) + 1; malTipps(); save(); merke(box, box.querySelector("h3").textContent);
    });
    solBtn.addEventListener("click", function () {
      if (solBtn.disabled) return;
      st.sol = !st.sol; malLoesung(); save(); merke(box, box.querySelector("h3").textContent);
    });
    malTipps(); malLoesung();
    return { neuMalen: malLoesung };
  }

  // ---------- :::buchung ----------
  function baueBuchung(box, key) {
    var st = S.ans[key] || (S.ans[key] = {});
    var soll = box.dataset.soll, haben = box.dataset.haben, betrag = zahl(box.dataset.betrag), typ = box.dataset.typ || "";
    var ids = (box.dataset.konten || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    if (!ids.length) ids = Object.keys(KONTEN);
    [soll, haben].forEach(function (x) { if (ids.indexOf(x) < 0) ids.push(x); });
    ids.sort();
    var bau = box.querySelector(".lp-bau");
    function sel(id, label) {
      return '<label class="lp-feld"><span>' + label + '</span><select id="' + id + '"><option value="">– Konto wählen –</option>' +
        ids.map(function (k) { return '<option value="' + esc(k) + '">' + esc(kontoText(k)) + "</option>"; }).join("") + "</select></label>";
    }
    var id = key.replace(/[^\w-]/g, "-");
    bau.innerHTML = '<div class="lp-buchzeile"><div class="lp-satz">' +
      sel(id + "-s", "Soll") + '<span class="lp-an">an</span>' + sel(id + "-h", "Haben") +
      '<label class="lp-feld lp-betrag"><span>Betrag in €</span><input id="' + id + '-b" type="text" inputmode="decimal" autocomplete="off" placeholder="z. B. 6.400,00"></label></div>' +
      (typ ? '<fieldset class="lp-typ"><legend>Bilanzveränderung</legend>' + Object.keys(TYPEN).map(function (t) {
        return '<label><input type="radio" name="' + id + '-t" value="' + t + '"> ' + t + " <small>(" + TYPEN[t] + ")</small></label>";
      }).join("") + "</fieldset>" : "") +
      '<div class="lp-actions"><button type="button" class="btn lp-pruefen">Prüfen</button></div>' +
      '<div class="lp-fb" aria-live="polite"></div></div>';
    var s = bau.querySelector("#" + id + "-s"), h = bau.querySelector("#" + id + "-h"), b = bau.querySelector("#" + id + "-b");
    var fb = bau.querySelector(".lp-fb");
    var werk = werkzeuge(box, st, box.dataset.loesung || "", jsonAttr(box, "data-tipps"), {
      loesungHtml: function () {
        return "<strong>" + esc(kontoText(soll)) + " an " + esc(kontoText(haben)) + " " + euro(betrag) + "</strong>" +
          (typ ? " (" + typ + ", " + TYPEN[typ] + ")" : "");
      }
    });
    function lies() {
      var t = bau.querySelector('input[name="' + id + '-t"]:checked');
      return { s: s.value, h: h.value, b: b.value, t: t ? t.value : "" };
    }
    function setze(v) {
      s.value = v.s || ""; h.value = v.h || ""; b.value = v.b || "";
      if (v.t) { var r = bau.querySelector('input[name="' + id + '-t"][value="' + v.t + '"]'); if (r) r.checked = true; }
    }
    function markiere(feld, ok) { feld.classList.toggle("lp-ok", ok === true); feld.classList.toggle("lp-bad", ok === false); }
    function pruefe(zeigeLeer) {
      var v = lies();
      if (!v.s || !v.h || !v.b) {
        if (zeigeLeer) { fb.className = "lp-fb warn"; fb.textContent = "Wähle Soll-Konto und Haben-Konto und trage den Betrag ein."; }
        return false;
      }
      var okS = v.s === soll, okH = v.h === haben, okB = Math.abs(zahl(v.b) - betrag) < 0.005, okT = !typ || v.t === typ;
      markiere(s, okS); markiere(h, okH); markiere(b, okB);
      var teile = [];
      if (!okS || !okH) {
        if (v.s === haben && v.h === soll) teile.push("Soll und Haben sind vertauscht. Prüfe, ob die Konten zunehmen oder abnehmen.");
        else {
          if (!okS) teile.push("Das Soll-Konto stimmt noch nicht.");
          if (!okH) teile.push("Das Haben-Konto stimmt noch nicht.");
        }
      }
      if (!okB) teile.push(isNaN(zahl(v.b)) ? "Der Betrag ist keine Zahl." : "Der Betrag stimmt noch nicht.");
      if (typ && !v.t) teile.push("Wähle noch die Bilanzveränderung.");
      else if (typ && !okT) teile.push("Die Bilanzveränderung stimmt noch nicht.");
      var alles = okS && okH && okB && okT;
      st.eingabe = v; st.ok = alles; st.versuche = (st.versuche || 0) + 1;
      if (alles) { fb.className = "lp-fb ok"; fb.textContent = "✅ Richtig. Der Buchungssatz stimmt."; st.sol = true; }
      else { fb.className = "lp-fb bad"; fb.textContent = "❌ " + teile.join(" "); }
      save(); merke(box, box.querySelector("h3").textContent); werk.neuMalen();
      return alles;
    }
    bau.querySelector(".lp-pruefen").addEventListener("click", function () { pruefe(true); });
    // gespeicherten Stand wiederherstellen
    if (st.eingabe) {
      setze(st.eingabe);
      var v = st.eingabe;
      markiere(s, v.s ? v.s === soll : null); markiere(h, v.h ? v.h === haben : null); markiere(b, v.b ? Math.abs(zahl(v.b) - betrag) < 0.005 : null);
      if (st.ok) { fb.className = "lp-fb ok"; fb.textContent = "✅ Richtig. Der Buchungssatz stimmt."; }
      else if (st.versuche) { fb.className = "lp-fb bad"; fb.textContent = "❌ Noch nicht ganz. Prüfe deine Eingaben erneut."; }
    }
    [s, h, b].forEach(function (f) { f.addEventListener("change", function () {
      var v = lies(); st.eingabe = v; save(); merke(box, box.querySelector("h3").textContent);
    }); });
    werk.neuMalen();
  }

  // ---------- :::auswahl ----------
  function baueAuswahl(box, key) {
    var st = S.ans[key] || (S.ans[key] = {});
    var opts = jsonAttr(box, "data-optionen"), richtig = parseInt(box.dataset.richtig, 10) - 1;
    var id = key.replace(/[^\w-]/g, "-");
    var bau = box.querySelector(".lp-bau");
    bau.innerHTML = '<div class="lp-opts" role="radiogroup">' + opts.map(function (o, i) {
      return '<label class="lp-opt"><input type="radio" name="' + id + '" value="' + i + '"> <span>' + o + "</span></label>";
    }).join("") + '</div><div class="lp-actions"><button type="button" class="btn lp-pruefen">Prüfen</button></div><div class="lp-fb" aria-live="polite"></div>';
    var fb = bau.querySelector(".lp-fb");
    var labels = bau.querySelectorAll(".lp-opt");
    var werk = werkzeuge(box, st, box.dataset.loesung || "", jsonAttr(box, "data-tipps"), {
      loesungHtml: function () { return "Richtig ist: <strong>" + opts[richtig] + "</strong>"; }
    });
    function markiere(wahl) {
      for (var i = 0; i < labels.length; i++) {
        labels[i].classList.toggle("lp-ok", st.ok && i === wahl);
        labels[i].classList.toggle("lp-bad", !st.ok && i === wahl);
      }
    }
    bau.querySelector(".lp-pruefen").addEventListener("click", function () {
      var r = bau.querySelector('input[name="' + id + '"]:checked');
      if (!r) { fb.className = "lp-fb warn"; fb.textContent = "Wähle eine Antwort."; return; }
      var wahl = parseInt(r.value, 10);
      st.wahl = wahl; st.versuche = (st.versuche || 0) + 1; st.ok = wahl === richtig;
      markiere(wahl);
      if (st.ok) { fb.className = "lp-fb ok"; fb.textContent = "✅ Richtig."; st.sol = true; }
      else { fb.className = "lp-fb bad"; fb.textContent = "❌ Noch nicht. Probiere es noch einmal oder nimm einen Tipp."; }
      save(); merke(box, box.querySelector("h3").textContent); werk.neuMalen();
    });
    bau.addEventListener("change", function (e) {
      if (e.target && e.target.type === "radio") {
        st.wahl = parseInt(e.target.value, 10); save(); merke(box, box.querySelector("h3").textContent);
      }
    });
    if (st.wahl != null) {
      var r0 = bau.querySelector('input[name="' + id + '"][value="' + st.wahl + '"]'); if (r0) r0.checked = true;
      if (st.versuche) { markiere(st.wahl); fb.className = "lp-fb " + (st.ok ? "ok" : "bad"); fb.textContent = st.ok ? "✅ Richtig." : "❌ Noch nicht. Probiere es noch einmal oder nimm einen Tipp."; }
    }
    werk.neuMalen();
  }

  // ---------- :::hinweis – Tipp erst auf Klick, nacheinander (je Aufgabe) ----------
  function baueHinweise(seite) {
    var hints = Array.prototype.slice.call(seite.querySelectorAll(".lp-hinweis"));
    var n = 0, vorher = null;
    hints.forEach(function (h) {
      var key = pageKey() + ":h" + (n++);
      var body = h.querySelector(".lp-hint-body");
      var titel = h.dataset.titel || "Tipp";
      var btn = el("button", { type: "button", "class": "btn secondary lp-hint-btn" }, "💡 " + esc(titel) + " anzeigen");
      h.insertBefore(btn, body);
      var gruppeVorher = vorher && vorher.h.parentNode === h.parentNode ? vorher : null;
      function malen() {
        var offen = !!S.ans[key];
        var frei = !gruppeVorher || !!S.ans[gruppeVorher.key];
        h.hidden = !offen && !frei;
        body.hidden = !offen; btn.hidden = offen;
        h.classList.toggle("lp-offen", offen);
      }
      h._malen = malen;
      btn.addEventListener("click", function () {
        S.ans[key] = 1; save();
        malen();
        var weiter = h._weiter; if (weiter) weiter._malen();
        var task = h.closest(".task"); if (task) merke(task, (task.querySelector("h3") || {}).textContent);
      });
      if (gruppeVorher) gruppeVorher.h._weiter = h;
      vorher = { h: h, key: key };
    });
    hints.forEach(function (h) { h._malen(); });
  }

  // ---------- Lösungen in :::aufgabe erst nach Rückfrage ----------
  function sperreLoesungen() {
    var tasks = document.querySelectorAll(".box.task:not(.lp-aufg)");
    var n = 0;
    Array.prototype.forEach.call(tasks, function (task) {
      var det = Array.prototype.filter.call(task.children, function (c) { return c.tagName === "DETAILS"; })[0];
      if (!det) return;
      var key = pageKey() + ":l" + (n++);
      var leiste = el("div", { "class": "lp-solgate" });
      var btn = el("button", { type: "button", "class": "btn secondary" }, "🔒 Lösung anzeigen");
      var frage = el("div", { "class": "lp-solfrage", hidden: "hidden" },
        "<p>Hast du die Aufgabe zuerst selbst versucht?</p>" +
        '<button type="button" class="btn lp-ja">Ja, Lösung zeigen</button> <button type="button" class="btn secondary lp-nein">Nein, ich probiere es erst</button>');
      leiste.appendChild(btn); leiste.appendChild(frage);
      det.parentNode.insertBefore(leiste, det);
      function zeige(an) { det.hidden = !an; if (an) { det.open = true; } leiste.hidden = an; }
      zeige(!!S.ans[key]);
      btn.addEventListener("click", function () { btn.hidden = true; frage.hidden = false; });
      frage.querySelector(".lp-nein").addEventListener("click", function () { frage.hidden = true; btn.hidden = false; });
      frage.querySelector(".lp-ja").addEventListener("click", function () {
        S.ans[key] = 1; zeige(true); save(); merke(task, (task.querySelector("h3") || {}).textContent);
      });
    });
  }

  // ---------- Aufgaben mit Anker, Merken bei jeder Bedienung ----------
  function ankerUndMerken() {
    var tasks = document.querySelectorAll(".box.task");
    Array.prototype.forEach.call(tasks, function (t, i) {
      if (!t.id) t.id = "aufg-" + (i + 1);
      t.addEventListener("click", function (e) {
        if (e.target.closest("button, select, input, label, summary")) merke(t, (t.querySelector("h3") || {}).textContent);
      });
    });
  }

  // ---------- Arbeitsstand: Weitermachen, sichern, laden ----------
  function stand() {
    return { format: "lernpfad-stand", version: 1, kurs: K.kurzname, gespeichert: new Date().toISOString(),
      done: S.done, checks: S.checks, notes: S.notes, selfcheck: S.selfcheck, quiz: S.quiz, test: S.test, ans: S.ans, pos: S.pos || null, app: S.app };
  }
  function sichern() {
    var d = new Date(), p = function (x) { return (x < 10 ? "0" : "") + x; };
    var name = "stand-" + K.kurzname + "-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + ".json";
    var blob = new Blob([JSON.stringify(stand(), null, 1)], { type: "application/json" });
    var a = el("a", { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    meldung("Stand gesichert. Die Datei " + name + " liegt in deinem Download-Ordner. Mit „Stand laden“ machst du später genau hier weiter.");
  }
  function laden(datei) {
    var r = new FileReader();
    r.onload = function () {
      var d;
      try { d = JSON.parse(r.result); } catch (e) { meldung("Die Datei konnte nicht gelesen werden.", true); return; }
      if (!d || d.format !== "lernpfad-stand" || d.kurs !== K.kurzname) { meldung("Diese Datei gehört nicht zu diesem Lernpfad.", true); return; }
      ["done", "checks", "notes", "selfcheck", "quiz", "test", "ans"].forEach(function (k) { S[k] = d[k] || {}; });
      S.pos = d.pos || null; if (d.app) S.app = d.app;
      save();
      var ziel = S.pos && S.pos.file ? S.pos.file + (S.pos.id ? "#" + S.pos.id : "") : "";
      if (ziel && ziel.split("#")[0] !== currentFile()) location.href = ziel;
      else { if (ziel) location.hash = ziel.split("#")[1] || ""; location.reload(); }
    };
    r.readAsText(datei);
  }
  function meldung(text, fehler) {
    var m = document.getElementById("lp-meldung");
    if (!m) { m = el("div", { id: "lp-meldung", role: "status", "class": "lp-meldung" }); document.body.appendChild(m); }
    m.className = "lp-meldung" + (fehler ? " bad" : "");
    m.textContent = text; m.hidden = false;
    clearTimeout(meldung.t); meldung.t = setTimeout(function () { m.hidden = true; }, 7000);
  }
  function standKnoepfe() {
    var bar = document.getElementById("topbar"); if (!bar) return;
    var wrap = el("div", { "class": "lp-stand" });
    var b1 = el("button", { type: "button", title: "Arbeitsstand als Datei sichern (zum Weitermachen auf einem anderen Gerät)", "aria-label": "Stand sichern" }, "💾 <span>Stand sichern</span>");
    var b2 = el("button", { type: "button", title: "Gesicherten Arbeitsstand aus einer Datei laden", "aria-label": "Stand laden" }, "📂 <span>Stand laden</span>");
    var inp = el("input", { type: "file", accept: "application/json,.json", hidden: "hidden", id: "lp-standdatei", "aria-label": "Stand-Datei wählen" });
    b1.addEventListener("click", sichern);
    b2.addEventListener("click", function () { inp.value = ""; inp.click(); });
    inp.addEventListener("change", function () { if (inp.files && inp.files[0]) laden(inp.files[0]); });
    wrap.appendChild(b1); wrap.appendChild(b2); wrap.appendChild(inp);
    var spacer = bar.querySelector(".spacer");
    if (spacer) spacer.parentNode.insertBefore(wrap, spacer.nextSibling); else bar.appendChild(wrap);
  }
  function weitermachen() {
    var p = S.pos; if (!p || !p.file) return;
    var main = document.querySelector("main"); if (!main) return;
    var hier = p.file === currentFile();
    var istStart = !document.body.dataset.module;
    if (hier && !istStart) return;   // schon auf der Seite
    var wo = (p.seite ? p.seite : p.file) + (p.titel ? ", " + p.titel : "");
    var box = el("div", { "class": "box note lp-weiter" },
      "▶ <strong>Weitermachen:</strong> <a href=\"" + esc(p.file + (p.id ? "#" + p.id : "")) + "\">" + esc(wo) + "</a>");
    main.insertBefore(box, main.firstChild);
  }

  function start() {
    var seite = document.querySelector("main"); if (!seite) return;
    ankerUndMerken();
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll(".lp-aufg"), function (box) {
      var key = pageKey() + ":a" + (n++);
      if (box.dataset.kind === "buchung") baueBuchung(box, key); else baueAuswahl(box, key);
    });
    baueHinweise(seite);
    sperreLoesungen();
    if (!IN_PKG && K.mitStand !== false) { standKnoepfe(); weitermachen(); }
    if (location.hash && /^#aufg-\d+$/.test(location.hash)) {
      var z = document.querySelector(location.hash);
      if (z) setTimeout(function () { z.scrollIntoView({ block: "start" }); }, 100);
    }
  }
  // defer-Skript: läuft vor DOMContentLoaded. Der Aufbau muss nach dem von app.js laufen (Kopfleiste).
  if (document.readyState === "complete") start(); else document.addEventListener("DOMContentLoaded", start);
})();
