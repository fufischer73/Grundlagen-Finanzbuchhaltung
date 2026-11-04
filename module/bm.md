---
titel: "Meilenstein: Geschäftsgang mit Anfangsbeständen"
minuten: 40
meilenstein: true
review: entwurf
abgabe:
  titel: Meilenstein 1 abgeben
  text: Lade deine T-Konten, Eröffnungs- und Abschlussbuchungen als PDF oder Foto hoch (zum Beispiel aus einer OnlyOffice-Tabelle oder vom Blatt). Schreibe deinen Zwischenstand aus dem Kasten am Ende der Seite dazu.
  dateitypen: .pdf,.jpg,.png
  dateien: 2
raster:
  - {kriterium: Eröffnung und Eigenkapital, erreicht: "alle Anfangsbestände richtig, Eigenkapital 189.000 € berechnet", besonders_gut: "Eröffnungsbuchungen sind vollständig und fehlerfrei begründet"}
  - {kriterium: Buchungssätze und Bilanzveränderung, erreicht: "mindestens 7 von 9 Buchungssätzen richtig (Zwischenstand der Seite), Bilanzveränderung zu jedem Fall genannt", besonders_gut: "alle 9 Buchungssätze richtig mit Kontonummern"}
  - {kriterium: T-Konten und Salden, erreicht: "alle Buchungen in den T-Konten, Salden richtig", besonders_gut: "übersichtlich, mit Gegenkonto und Buchungsnummer"}
  - {kriterium: Abschluss und Kontrolle, erreicht: "Abschluss über SBK und Aktiva = Passiva geprüft", besonders_gut: "Schlussbilanz mit Summen und Bilanzsumme richtig"}
quellen: [q-ls-aufgabenmuster, q-kontenplan, q-buchungsregeln]
---
## Auftrag

Du arbeitest in der Buchhaltung des Modellunternehmens **Holzwerk Förde GmbH** (siehe Übersicht). Du bearbeitest die Belege eines Monats.
Dieser Meilenstein hat zwei Teile: Du beantwortest **interaktive Aufgaben** auf dieser Seite und gibst **deine T-Konten und
Buchungen** in Moodle ab. Eine Lösung zeigt die Seite hier nicht an. Tipps gibt es.

**Anfangsbestände:**

| Aktiva | Betrag | Passiva | Betrag |
| --- | --- | --- | --- |
| 0500 Grundstücke und Gebäude | 150.000 € | 4250 Darlehen | 120.000 € |
| 0700 Maschinen | 80.000 € | 4400 Verbindlichkeiten | 20.000 € |
| 0840 Fuhrpark | 25.000 € | 3000 Eigenkapital | ? |
| 0850 BGA | 18.000 € | | |
| 2000 Rohstoffe | 12.000 € | | |
| 2400 Forderungen | 14.000 € | | |
| 2800 Bank | 28.000 € | | |
| 2880 Kasse | 2.000 € | | |

## Teil 1: Eigenkapital berechnen

:::zahl Eigenkapital zu Beginn
frage: Berechne das Eigenkapital (Vermögen minus Schulden) aus den Anfangsbeständen.
antwort: 189000
einheit: €
keineloesung: ja
min: 3
tipp: Addiere alle Aktiva. Ziehe Darlehen und Verbindlichkeiten ab.
:::

## Teil 2: Buchungssätze zu den Belegen

Bilde zu jedem Beleg den Buchungssatz und bestimme die Bilanzveränderung.

:::buchung Beleg 1: Kontoauszug
fall: Ein Kunde überweist eine offene Rechnung.
soll: 2800
haben: 2400
betrag: 9000
typ: AT
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Der Kunde zahlt: Welches Konto verliert die Forderung, welches nimmt zu?
:::
:::buchung Beleg 2: Eingangsrechnung
fall: Kauf von Rohstoffen auf Ziel.
soll: 2000
haben: 4400
betrag: 8000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Rohstoffe nehmen zu. Auf Ziel heißt: Die Zahlung kommt später.
:::
:::buchung Beleg 3: Kontoauszug
fall: Tilgungsrate für das Darlehen (Lastschrift).
soll: 4250
haben: 2800
betrag: 6000
typ: APD
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Eine Schuld wird kleiner, und die Bank verliert Geld.
:::
:::buchung Beleg 4: Eingangsrechnung
fall: Kauf eines Büroschranks auf Ziel.
soll: 0850
haben: 4400
betrag: 2400
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Ein Büroschrank gehört zur BGA. Er wird nicht sofort bezahlt.
:::
:::buchung Beleg 5: Kontoauszug
fall: Überweisung an einen Lieferanten.
soll: 4400
haben: 2800
betrag: 10000
typ: APD
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Welche Schuld wird getilgt? Wer verliert das Geld?
:::
:::buchung Beleg 6: Quittung
fall: Barabhebung vom Bankkonto.
soll: 2880
haben: 2800
betrag: 1500
typ: AT
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Das Geld geht vom Bankkonto in die Kasse.
:::
:::buchung Beleg 7: Ausgangsrechnung
fall: Verkauf einer gebrauchten Maschine auf Ziel (zum Buchwert).
soll: 2400
haben: 0700
betrag: 7000
typ: AT
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Die Maschine verschwindet aus dem Vermögen, dafür gibt es eine Forderung.
:::
:::buchung Beleg 8: Kontoauszug
fall: Darlehensauszahlung der Bank (Gutschrift).
soll: 2800
haben: 4250
betrag: 20000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Die Bank zahlt Geld aus. Wie heißt die neue Schuld?
:::
:::buchung Beleg 9: Eingangsrechnung
fall: Kauf eines Transporters auf Ziel.
soll: 0840
haben: 4400
betrag: 15000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
keineloesung: ja
min: 3
tipp: Der Transporter gehört zum Fuhrpark und wird auf Ziel gekauft.
:::

## Teil 3: Buchen und abschließen (schriftlich)

Führe jetzt die **T-Konten**. Gehe so vor:

:::schritte
1. Eröffne alle Konten über das EBK (Anfangsbestände, Eigenkapital).
2. Buche alle 9 Belege in den T-Konten.
3. Berechne die Salden und schließe alle Konten über das SBK ab.
:::

Prüfe danach deine Ergebnisse in Teil 4.

## Teil 4: Ergebnisse kontrollieren

:::zahl Saldo Bank
frage: Wie hoch ist der Endbestand auf dem Konto 2800 Bank nach allen Buchungen?
antwort: 39500
einheit: €
keineloesung: ja
min: 2
tipp: Soll: Anfangsbestand plus Eingänge. Haben: alle Ausgänge. Dann die Differenz.
:::
:::zahl Saldo Verbindlichkeiten
frage: Wie hoch ist der Endbestand der Verbindlichkeiten (4400)?
antwort: 35400
einheit: €
keineloesung: ja
min: 2
tipp: Haben: Anfangsbestand plus neue Rechnungen. Soll: bezahlte Rechnungen.
:::
:::zahl Saldo Darlehen
frage: Wie hoch ist der Endbestand des Darlehens (4250)?
antwort: 134000
einheit: €
keineloesung: ja
min: 2
tipp: Tilgung mindert, Auszahlung erhöht das Darlehen.
:::
:::zahl Saldo Forderungen
frage: Wie hoch ist der Endbestand der Forderungen (2400)?
antwort: 12000
einheit: €
keineloesung: ja
min: 2
tipp: Zahlungen von Kunden mindern, Verkäufe auf Ziel erhöhen.
:::
:::zahl Bilanzsumme
frage: Wie hoch ist die Bilanzsumme im SBK (Summe der Aktiva)?
antwort: 358400
einheit: €
keineloesung: ja
min: 3
tipp: Addiere alle Endbestände der Aktivkonten. Sie muss gleich der Summe der Passiva sein.
:::

:::checkliste Checkliste vor der Abgabe
- Eigenkapital berechnet und eröffnet.
- Alle 9 Buchungssätze mit Kontonummern und Bilanzveränderung geprüft.
- Alle T-Konten geführt, die Gegenkonten stehen dabei.
- Abschlussbuchungen vollständig.
- Aktiva und Passiva im SBK sind gleich.
- Zwischenstand der Seite auf die Abgabe geschrieben.
:::

:::tipp
Arbeite so, wie du es in B3 geübt hast. Den Kontenplan findest du unter Extras.
:::
