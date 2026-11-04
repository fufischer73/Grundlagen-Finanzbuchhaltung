---
titel: "Meilenstein: Geschäftsgang mit Anfangsbeständen"
minuten: 40
meilenstein: true
abgabe: false
review: entwurf
---
## Auftrag

Du arbeitest in der Buchhaltung des Modellunternehmens **Holzwerk Förde GmbH** (siehe Übersicht) und bearbeitest die Belege eines Monats.
Dieser Meilenstein ist eine **Übung zur Vorbereitung auf die Klassenarbeit**. Es gibt keine Abgabe. Die Seite prüft deine Antworten.
Tipps und Lösung zeigt sie erst, wenn du es selbst versucht hast.

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
frage: Berechne das Eigenkapital aus den Anfangsbeständen.
antwort: 189000
einheit: €
min: 3
tipp: Addiere alle Aktiva. Ziehe Darlehen und Verbindlichkeiten ab.
loesung: Vermögen: 150.000 + 80.000 + 25.000 + 18.000 + 12.000 + 14.000 + 28.000 + 2.000 = 329.000 €. Schulden: 120.000 + 20.000 = 140.000 €. Eigenkapital: 329.000 € − 140.000 € = 189.000 €.
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
min: 3
tipp: Der Kunde zahlt: Welches Konto verliert die Forderung, welches nimmt zu?
loesung: Bank (Aktivkonto) nimmt zu: Soll. Forderungen (Aktivkonto) nimmt ab: Haben. Aktivtausch: Ein Aktivkonto nimmt zu, ein anderes ab. Die Bilanzsumme bleibt gleich.
:::
:::buchung Beleg 2: Eingangsrechnung
fall: Kauf von Rohstoffen auf Ziel.
soll: 2000
haben: 4400
betrag: 8000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Rohstoffe nehmen zu. Auf Ziel heißt: Die Zahlung kommt später.
loesung: Rohstoffe (Aktivkonto) nimmt zu: Soll. Verbindlichkeiten (Passivkonto) nimmt zu: Haben. Aktiv-Passiv-Mehrung: Aktiv- und Passivseite wachsen. Die Bilanzsumme steigt.
:::
:::buchung Beleg 3: Kontoauszug
fall: Tilgungsrate für das Darlehen (Lastschrift).
soll: 4250
haben: 2800
betrag: 6000
typ: APD
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Eine Schuld wird kleiner, und die Bank verliert Geld.
loesung: Darlehen (Passivkonto) nimmt ab: Soll. Bank (Aktivkonto) nimmt ab: Haben. Aktiv-Passiv-Minderung: Aktiv- und Passivseite sinken. Die Bilanzsumme sinkt.
:::
:::buchung Beleg 4: Eingangsrechnung
fall: Kauf eines Büroschranks auf Ziel.
soll: 0850
haben: 4400
betrag: 2400
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Ein Büroschrank gehört zur BGA. Er wird nicht sofort bezahlt.
loesung: BGA (Aktivkonto) nimmt zu: Soll. Verbindlichkeiten (Passivkonto) nimmt zu: Haben. Aktiv-Passiv-Mehrung: Aktiv- und Passivseite wachsen. Die Bilanzsumme steigt.
:::
:::buchung Beleg 5: Kontoauszug
fall: Überweisung an einen Lieferanten.
soll: 4400
haben: 2800
betrag: 10000
typ: APD
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Welche Schuld wird getilgt? Wer verliert das Geld?
loesung: Verbindlichkeiten (Passivkonto) nimmt ab: Soll. Bank (Aktivkonto) nimmt ab: Haben. Aktiv-Passiv-Minderung: Aktiv- und Passivseite sinken. Die Bilanzsumme sinkt.
:::
:::buchung Beleg 6: Quittung
fall: Barabhebung vom Bankkonto.
soll: 2880
haben: 2800
betrag: 1500
typ: AT
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Das Geld geht vom Bankkonto in die Kasse.
loesung: Kasse (Aktivkonto) nimmt zu: Soll. Bank (Aktivkonto) nimmt ab: Haben. Aktivtausch: Ein Aktivkonto nimmt zu, ein anderes ab. Die Bilanzsumme bleibt gleich.
:::
:::buchung Beleg 7: Ausgangsrechnung
fall: Verkauf einer gebrauchten Maschine auf Ziel (zum Buchwert).
soll: 2400
haben: 0700
betrag: 7000
typ: AT
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Die Maschine verschwindet aus dem Vermögen, dafür gibt es eine Forderung.
loesung: Forderungen (Aktivkonto) nimmt zu: Soll. Maschinen (Aktivkonto) nimmt ab: Haben. Aktivtausch: Ein Aktivkonto nimmt zu, ein anderes ab. Die Bilanzsumme bleibt gleich.
:::
:::buchung Beleg 8: Kontoauszug
fall: Darlehensauszahlung der Bank (Gutschrift).
soll: 2800
haben: 4250
betrag: 20000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Die Bank zahlt Geld aus. Wie heißt die neue Schuld?
loesung: Bank (Aktivkonto) nimmt zu: Soll. Darlehen (Passivkonto) nimmt zu: Haben. Aktiv-Passiv-Mehrung: Aktiv- und Passivseite wachsen. Die Bilanzsumme steigt.
:::
:::buchung Beleg 9: Eingangsrechnung
fall: Kauf eines Transporters auf Ziel.
soll: 0840
haben: 4400
betrag: 15000
typ: APM
konten: 0500, 0700, 0840, 0850, 2000, 2400, 2800, 2880, 3000, 4250, 4400, EBK, SBK
min: 3
tipp: Der Transporter gehört zum Fuhrpark und wird auf Ziel gekauft.
loesung: Fuhrpark (Aktivkonto) nimmt zu: Soll. Verbindlichkeiten (Passivkonto) nimmt zu: Haben. Aktiv-Passiv-Mehrung: Aktiv- und Passivseite wachsen. Die Bilanzsumme steigt.
:::

## Teil 3: Buchen und abschließen (schriftlich)

Führe jetzt die **T-Konten** wie in der Klassenarbeit. Die Vorlage hilft dir dabei.

:::material material/t-konten-meilenstein-1.pdf T-Konten-Vorlage (PDF) herunterladen
Fertige T-Konten mit den Konten dieser Aufgabe und eine Seite Grundbuch. Drucke sie aus oder fülle sie am Tablet aus.
:::

:::schritte
1. Eröffne alle Konten über das EBK (Anfangsbestände, Eigenkapital).
2. Buche alle 9 Belege in den T-Konten.
3. Berechne die Salden und schließe alle Konten über das SBK ab.
:::

## Teil 4: Ergebnisse kontrollieren

Vergleiche deine T-Konten mit den Ergebnissen.

:::zahl Saldo Bank
frage: Wie hoch ist der Endbestand auf dem Konto 2800 Bank nach allen Buchungen?
antwort: 39500
einheit: €
min: 2
tipp: Soll: Anfangsbestand plus Eingänge. Haben: alle Ausgänge. Dann die Differenz.
loesung: Soll: 28.000 + 9.000 + 20.000 = 57.000 €. Haben: 6.000 + 10.000 + 1.500 = 17.500 €. Saldo: 57.000 € − 17.500 € = 39.500 €.
:::
:::zahl Saldo Verbindlichkeiten
frage: Wie hoch ist der Endbestand der Verbindlichkeiten (4400)?
antwort: 35400
einheit: €
min: 2
tipp: Haben: Anfangsbestand plus neue Rechnungen. Soll: bezahlte Rechnungen.
loesung: Soll: 10.000 = 10.000 €. Haben: 20.000 + 8.000 + 2.400 + 15.000 = 45.400 €. Saldo: 45.400 € − 10.000 € = 35.400 €.
:::
:::zahl Saldo Darlehen
frage: Wie hoch ist der Endbestand des Darlehens (4250)?
antwort: 134000
einheit: €
min: 2
tipp: Tilgung mindert, Auszahlung erhöht das Darlehen.
loesung: Soll: 6.000 = 6.000 €. Haben: 120.000 + 20.000 = 140.000 €. Saldo: 140.000 € − 6.000 € = 134.000 €.
:::
:::zahl Saldo Forderungen
frage: Wie hoch ist der Endbestand der Forderungen (2400)?
antwort: 12000
einheit: €
min: 2
tipp: Zahlungen von Kunden mindern, Verkäufe auf Ziel erhöhen.
loesung: Soll: 14.000 + 7.000 = 21.000 €. Haben: 9.000 = 9.000 €. Saldo: 21.000 € − 9.000 € = 12.000 €.
:::
:::zahl Bilanzsumme
frage: Wie hoch ist die Bilanzsumme im SBK (Summe der Aktiva)?
antwort: 358400
einheit: €
min: 3
tipp: Addiere alle Endbestände der Aktivkonten. Sie muss gleich der Summe der Passiva sein.
loesung: Aktiva: 150.000 + 73.000 + 40.000 + 20.400 + 20.000 + 12.000 + 39.500 + 3.500 = 358.400 € Passiva: 189.000 + 134.000 + 35.400 = 358.400 €. Beide Seiten sind gleich.
:::

:::checkliste Checkliste
- Eigenkapital berechnet und eröffnet.
- Alle 9 Buchungssätze mit Kontonummern und Bilanzveränderung geprüft.
- Alle T-Konten geführt, die Gegenkonten stehen dabei.
- Abschlussbuchungen vollständig.
- Aktiva und Passiva im SBK sind gleich.
:::
