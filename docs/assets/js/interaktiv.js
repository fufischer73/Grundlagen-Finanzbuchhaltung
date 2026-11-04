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

  // ---------- :::reihenfolge – Nummern der richtigen Reihenfolge eingeben ----------
  function baueReihenfolge(box, key) {
    var st = S.ans[key] || (S.ans[key] = {});
    var items = jsonAttr(box, "data-items"), liste = jsonAttr(box, "data-liste");
    var richtig = (box.dataset.richtig || "").split(",").map(Number), n = items.length;
    var id = key.replace(/[^\w-]/g, "-");
    var bau = box.querySelector(".lp-bau");
    bau.innerHTML = '<ol class="lp-reihe">' + items.map(function (x, i) {
      return '<li><span class="lp-nr" aria-hidden="true">' + (i + 1) + '</span><span class="lp-rtext"><span class="lp-sr">Nummer ' + (i + 1) + ': </span>' + x + "</span></li>";
    }).join("") + '</ol><label class="lp-feld lp-folge"><span>Richtige Reihenfolge: Gib die ' + n + ' Nummern ein, zum Beispiel „' +
      (function () { var a = []; for (var i = 1; i <= Math.min(n, 4); i++) a.push(i); return a.join(", ") + (n > 4 ? ", …" : ""); })() +
      '“</span><input id="' + id + '-f" type="text" inputmode="numeric" autocomplete="off" placeholder="' + n + ' Nummern, mit Komma oder Leerzeichen getrennt"></label>' +
      '<div class="lp-actions"><button type="button" class="btn lp-pruefen">Prüfen</button></div><div class="lp-fb" aria-live="polite"></div>';
    var inp = bau.querySelector("#" + id + "-f"), fb = bau.querySelector(".lp-fb");
    var werk = werkzeuge(box, st, box.dataset.loesung || "", jsonAttr(box, "data-tipps"), {
      loesungHtml: function () {
        return "Reihenfolge der Nummern: <strong>" + richtig.join(", ") + "</strong><ol class=\"lp-loesliste\">" +
          liste.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>";
      }
    });
    function parse(s) {
      var teile = String(s).replace(/[;.\-→>]/g, " ").split(/[\s,]+/).filter(Boolean);
      return teile.map(function (x) { return /^\d+$/.test(x) ? parseInt(x, 10) : NaN; });
    }
    inp.addEventListener("change", function () { st.eingabe = inp.value; save(); merke(box, box.querySelector("h3").textContent); });
    bau.querySelector(".lp-pruefen").addEventListener("click", function () {
      var z = parse(inp.value);
      st.eingabe = inp.value;
      if (!z.length) { fb.className = "lp-fb warn"; fb.textContent = "Trage die Nummern in der richtigen Reihenfolge ein."; save(); return; }
      var ungueltig = z.some(function (x) { return isNaN(x) || x < 1 || x > n; });
      var doppelt = z.some(function (x, i) { return z.indexOf(x) !== i; });
      if (ungueltig || doppelt || z.length !== n) {
        fb.className = "lp-fb warn";
        fb.textContent = "Gib alle " + n + " Nummern (1 bis " + n + ") genau einmal ein. Du hast " + z.length + " eingegeben" + (doppelt ? ", eine Nummer doppelt" : "") + ".";
        save(); return;
      }
      var treffer = 0, anfang = 0, ok = true;
      z.forEach(function (x, i) { if (x === richtig[i]) treffer++; });
      for (var i = 0; i < n && z[i] === richtig[i]; i++) anfang++;
      st.versuche = (st.versuche || 0) + 1; st.ok = treffer === n;
      if (st.ok) { fb.className = "lp-fb ok"; fb.textContent = "✅ Richtig. Die Reihenfolge stimmt."; st.sol = true; }
      else {
        fb.className = "lp-fb bad";
        fb.textContent = "❌ " + treffer + " von " + n + " Plätzen stimmen." + (anfang ? " Die ersten " + anfang + (anfang === 1 ? " Nummer stimmt." : " Nummern stimmen.") : " Schon der erste Schritt stimmt noch nicht.");
      }
      save(); merke(box, box.querySelector("h3").textContent); werk.neuMalen();
    });
    if (st.eingabe != null) inp.value = st.eingabe;
    if (st.versuche) { fb.className = "lp-fb " + (st.ok ? "ok" : "bad"); fb.textContent = st.ok ? "✅ Richtig. Die Reihenfolge stimmt." : "❌ Noch nicht ganz. Prüfe deine Reihenfolge erneut."; }
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

  // ---------- Arbeitsstand: automatisch im Browser, dazu Datei sichern/laden, Weitermachen ----------
  var EXPKEY = "lernpfad-" + K.kurzname + "-v1:export";
  var SPEICHER = (function () {
    try { var k = "lp-test"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; } catch (e) { return false; }
  })();
  function letzteSicherung() { try { return localStorage.getItem(EXPKEY) || ""; } catch (e) { return ""; } }
  function datum(iso) {
    var d = new Date(iso); if (isNaN(d)) return "";
    return d.toLocaleDateString("de-DE") + ", " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
  }
  function hatFortschritt() {
    var n = Object.keys(S.done || {}).filter(function (k) { return S.done[k]; }).length +
      Object.keys(S.checks || {}).filter(function (k) { return S.checks[k]; }).length +
      Object.keys(S.notes || {}).filter(function (k) { return String(S.notes[k] || "").trim(); }).length +
      Object.keys(S.ans || {}).filter(function (k) { var a = S.ans[k]; return a === 1 || (a && (a.versuche || a.sol || a.tipps || a.eingabe || a.wahl != null)); }).length;
    return n > 0;
  }
  function stand() {
    return { format: "lernpfad-stand", version: 1, kurs: K.kurzname, gespeichert: new Date().toISOString(),
      done: S.done, checks: S.checks, notes: S.notes, selfcheck: S.selfcheck, quiz: S.quiz, test: S.test, ans: S.ans, pos: S.pos || null, app: S.app };
  }
  function aktualisiere() {
    var z = letzteSicherung();
    Array.prototype.forEach.call(document.querySelectorAll(".lp-lastsave"), function (n) {
      n.textContent = z ? "Letzte Datei-Sicherung: " + datum(z) : "Noch keine Datei gesichert.";
    });
  }
  function sichern() {
    var d = new Date(), p = function (x) { return (x < 10 ? "0" : "") + x; };
    var name = "stand-" + K.kurzname + "-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + ".json";
    var blob = new Blob([JSON.stringify(stand(), null, 1)], { type: "application/json" });
    var a = el("a", { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    try { localStorage.setItem(EXPKEY, new Date().toISOString()); } catch (e) { /* ignorieren */ }
    aktualisiere();
    meldung("Stand gesichert: " + name + ". Die Datei liegt jetzt in deinem Download-Ordner. Mit „Stand laden“ machst du später genau hier weiter.");
  }
  function uebernehmen(d) {
    ["done", "checks", "notes", "selfcheck", "quiz", "test", "ans"].forEach(function (k) { S[k] = d[k] || {}; });
    S.pos = d.pos || null; if (d.app) S.app = d.app;
    try { if (d.gespeichert) localStorage.setItem(EXPKEY, d.gespeichert); } catch (e) { /* ignorieren */ }
    save();
    var ziel = S.pos && S.pos.file ? S.pos.file + (S.pos.id ? "#" + S.pos.id : "") : "";
    if (ziel && ziel.split("#")[0] !== currentFile()) location.href = ziel;
    else { if (ziel) location.hash = ziel.split("#")[1] || ""; location.reload(); }
  }
  function laden(datei) {
    var r = new FileReader();
    r.onerror = function () { meldung("Die Datei konnte nicht gelesen werden.", true); };
    r.onload = function () {
      var d;
      try { d = JSON.parse(r.result); } catch (e) { meldung("Die Datei konnte nicht gelesen werden. Wähle eine Datei, die mit „Stand sichern“ erzeugt wurde.", true); return; }
      if (!d || d.format !== "lernpfad-stand" || d.kurs !== K.kurzname) { meldung("Diese Datei gehört nicht zu diesem Lernpfad.", true); return; }
      var wann = d.gespeichert ? " (gesichert am " + datum(d.gespeichert) + ")" : "";
      if (hatFortschritt()) {
        bestaetige("Auf diesem Gerät gibt es schon einen Arbeitsstand. Er wird durch die Datei" + wann + " ersetzt. Möchtest du fortfahren?",
          "Ja, Datei laden", function () { uebernehmen(d); });
      } else uebernehmen(d);
    };
    r.readAsText(datei);
  }
  function panel(text, fehler) {
    var m = document.getElementById("lp-meldung");
    if (!m) { m = el("div", { id: "lp-meldung", role: "status", "class": "lp-meldung" }); document.body.appendChild(m); }
    m.className = "lp-meldung" + (fehler ? " bad" : "");
    m.innerHTML = ""; m.appendChild(el("div", null, esc(text))); m.hidden = false;
    clearTimeout(meldung.t);
    return m;
  }
  function meldung(text, fehler) {
    var m = panel(text, fehler);
    meldung.t = setTimeout(function () { m.hidden = true; }, 9000);
  }
  function bestaetige(text, jaText, ja) {
    var m = panel(text, false);
    m.className = "lp-meldung lp-confirm"; m.setAttribute("role", "alertdialog");
    var zeile = el("div", { "class": "lp-confirm-btns" });
    var b1 = el("button", { type: "button", "class": "btn" }, esc(jaText)), b2 = el("button", { type: "button", "class": "btn secondary" }, "Abbrechen");
    b1.addEventListener("click", function () { m.hidden = true; ja(); });
    b2.addEventListener("click", function () { m.hidden = true; });
    zeile.appendChild(b1); zeile.appendChild(b2); m.appendChild(zeile); b1.focus();
  }
  function dateiWaehler() {
    var inp = document.getElementById("lp-standdatei");
    if (!inp) {
      inp = el("input", { type: "file", accept: "application/json,.json", hidden: "hidden", id: "lp-standdatei", "aria-label": "Stand-Datei wählen" });
      inp.addEventListener("change", function () { if (inp.files && inp.files[0]) laden(inp.files[0]); });
      document.body.appendChild(inp);
    }
    return inp;
  }
  function ladenKlick() { var i = dateiWaehler(); i.value = ""; i.click(); }
  function knopf(text, titel, fn, klasse) {
    var b = el("button", { type: "button", title: titel, "class": klasse || "" }, text); b.addEventListener("click", fn); return b;
  }
  var statusEl = null, statusT = null;
  function statusZeigen() {
    if (!statusEl) return;
    clearTimeout(statusT);
    statusT = setTimeout(function () {
      var d = new Date(), p = function (x) { return (x < 10 ? "0" : "") + x; };
      statusEl.textContent = SPEICHER ? "✓ gespeichert " + p(d.getHours()) + ":" + p(d.getMinutes()) : "⚠ nicht gespeichert";
    }, 250);
  }
  function standKnoepfe() {
    var bar = document.getElementById("topbar"); if (!bar) return;
    var wrap = el("div", { "class": "lp-stand" });
    var b1 = knopf("💾 <span>Stand sichern</span>", "Arbeitsstand als Datei sichern (zum Weitermachen auf einem anderen Gerät)", sichern);
    var b2 = knopf("📂 <span>Stand laden</span>", "Gesicherten Arbeitsstand aus einer Datei laden", ladenKlick);
    b1.setAttribute("aria-label", "Stand sichern"); b2.setAttribute("aria-label", "Stand laden");
    statusEl = el("span", { "class": "lp-status", "aria-live": "polite" }, SPEICHER ? "✓ automatisch gespeichert" : "⚠ nicht gespeichert");
    wrap.appendChild(b1); wrap.appendChild(b2); wrap.appendChild(statusEl);
    var spacer = bar.querySelector(".spacer");
    if (spacer) spacer.parentNode.insertBefore(wrap, spacer.nextSibling); else bar.appendChild(wrap);
    ["change", "input", "click"].forEach(function (ev) { document.addEventListener(ev, statusZeigen); });
  }
  function warnungOhneSpeicher() {
    if (SPEICHER) return;
    var main = document.querySelector("main"); if (!main) return;
    main.insertBefore(el("div", { "class": "box warn lp-nospeicher", role: "alert" },
      "<strong>Dein Browser speichert nicht automatisch</strong> (zum Beispiel im privaten Modus). Sichere deinen Stand regelmäßig mit " +
      "„💾 Stand sichern“. Wechselst du die Seite, gehen die Eingaben sonst verloren."), main.firstChild);
  }
  function weiterLink() {
    var p = S.pos; if (!p || !p.file) return "";
    var wo = (p.seite ? p.seite : p.file) + (p.titel ? ", " + p.titel : "");
    return "▶ <strong>Weitermachen:</strong> <a href=\"" + esc(p.file + (p.id ? "#" + p.id : "")) + "\">" + esc(wo) + "</a>";
  }
  function standBox() {
    var levels = document.querySelector(".levels"); if (!levels) return false;   // nur auf der Übersicht
    var box = el("section", { "class": "box note lp-standbox", "aria-labelledby": "lp-standtitel" });
    var w = weiterLink();
    box.innerHTML = '<div class="box-title" id="lp-standtitel">💾 Dein Arbeitsstand</div>' +
      "<ul><li>Alles, was du eingibst, wird <strong>automatisch in diesem Browser gespeichert</strong>. Du kannst zwischen den Modulen und Stufen springen und später an derselben Stelle weitermachen.</li>" +
      "<li>Willst du auf einem <strong>anderen Gerät oder PC</strong> weitermachen? Klicke auf „Stand sichern“. Die Datei lädst du dort mit „Stand laden“.</li>" +
      "<li>Manche Browser löschen gespeicherte Seitendaten nach längerer Pause (zum Beispiel Safari am iPad). Sichere deinen Stand deshalb vor Ferien oder einem Gerätewechsel.</li></ul>" +
      (w ? '<p class="lp-weiter-zeile">' + w + "</p>" : "") +
      '<div class="lp-actions"></div><p class="lp-lastsave muted"></p>';
    var act = box.querySelector(".lp-actions");
    act.appendChild(knopf("💾 Stand sichern", "", sichern, "btn")); act.appendChild(knopf("📂 Stand laden", "", ladenKlick, "btn secondary"));
    levels.parentNode.insertBefore(box, levels);
    return true;
  }
  function pauseBox() {
    var main = document.querySelector("main"); if (!main || !document.body.dataset.module) return;
    var box = el("div", { "class": "lp-pause" }, "<span>Pause oder Gerätewechsel? Sichere deinen Stand in einer Datei.</span>");
    box.appendChild(knopf("💾 Stand sichern", "", sichern, "btn secondary")); main.appendChild(box);
  }
  function weitermachen(inStandBox) {
    var p = S.pos; if (!p || !p.file || inStandBox) return;
    var main = document.querySelector("main"); if (!main) return;
    if (p.file === currentFile()) return;   // schon auf der Seite
    main.insertBefore(el("div", { "class": "box note lp-weiter" }, weiterLink()), main.firstChild);
  }

  function start() {
    var seite = document.querySelector("main"); if (!seite) return;
    ankerUndMerken();
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll(".lp-aufg"), function (box) {
      var key = pageKey() + ":a" + (n++);
      if (box.dataset.kind === "buchung") baueBuchung(box, key);
      else if (box.dataset.kind === "reihenfolge") baueReihenfolge(box, key);
      else baueAuswahl(box, key);
    });
    baueHinweise(seite);
    sperreLoesungen();
    if (!IN_PKG && K.mitStand !== false) { dateiWaehler(); standKnoepfe(); warnungOhneSpeicher(); var ib = standBox(); weitermachen(ib); pauseBox(); aktualisiere(); }
    if (location.hash && /^#aufg-\d+$/.test(location.hash)) {
      var z = document.querySelector(location.hash);
      if (z) setTimeout(function () { z.scrollIntoView({ block: "start" }); }, 100);
    }
  }
  // defer-Skript: läuft vor DOMContentLoaded. Der Aufbau muss nach dem von app.js laufen (Kopfleiste).
  if (document.readyState === "complete") start(); else document.addEventListener("DOMContentLoaded", start);
})();
