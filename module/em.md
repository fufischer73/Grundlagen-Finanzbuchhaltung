---
titel: "Meilenstein: Gesamtgang mit Abschluss"
minuten: 55
meilenstein: true
review: entwurf
abgabe:
  titel: Meilenstein 2 abgeben
  text: Lade deine T-Konten, das GuV-Konto und das SBK als OnlyOffice-Tabelle (.xlsx), als PDF oder als Foto hoch. Schreibe deinen Zwischenstand aus dem Kasten am Ende der Seite dazu.
  dateitypen: .xlsx,.pdf,.jpg,.png
  dateien: 2
raster:
  - {kriterium: Eröffnung, erreicht: "alle Anfangsbestände richtig eröffnet, Eigenkapital 34.000 € berechnet", besonders_gut: "Eröffnungsbuchungen vollständig mit Kontonummern"}
  - {kriterium: Buchungssätze und Erfolgskonten, erreicht: "mindestens 8 von 10 Buchungssätzen richtig (Zwischenstand der Seite) (Zwischenstand der Seite)", besonders_gut: "alle 10 Buchungssätze richtig mit Kontonummern"}
  - {kriterium: Abschluss über GuV und SBK, erreicht: "Erfolgskonten über GuV, Bestandskonten über SBK abgeschlossen", besonders_gut: "alle Abschlussbuchungen vollständig und in der richtigen Reihenfolge"}
  - {kriterium: Ergebnis und Kontrolle, erreicht: "Gewinn und neues Eigenkapital richtig, Aktiva = Passiva geprüft", besonders_gut: "Schlussbilanz mit Summen und Bilanzsumme richtig"}
quellen: [q-ls-aufgabenmuster, q-kontenplan, q-buchungsregeln]
---
## Auftrag

Du bist wieder in der Buchhaltung der **Holzwerk Förde GmbH** (siehe Übersicht). Du führst ein Geschäftsjahr einschließlich des
Abschlusses durch. Alle Fälle sind ohne Umsatzsteuer. Der Meilenstein hat zwei Teile: **interaktive Aufgaben** auf dieser Seite
und **deine T-Konten, GuV-Konto und SBK** als Abgabe in Moodle. Eine Lösung zeigt die Seite hier nicht an. Tipps gibt es.

**Anfangsbestände:**

| Aktiva | Betrag | Passiva | Betrag |
| --- | --- | --- | --- |
| 0850 BGA | 40.000 € | 4250 Darlehen | 20.000 € |
| 2000 Rohstoffe | 6.000 € | 4400 Verbindlichkeiten | 11.000 € |
| 2800 Bank | 18.000 € | 3000 Eigenkapital | ? |
| 2880 Kasse | 1.000 € | | |

Zu Fall 10: Der Endbestand an Rohstoffen laut Inventur beträgt 7.000 €. Die Umbuchung des Verbrauchs ist fertig vorgegeben.

## Teil 1: Eigenkapital berechnen

:::zahl Eigenkapital zu Beginn
frage: Berechne das Eigenkapital aus den Anfangsbeständen (Vermögen minus Schulden).
antwort: 34000
einheit: €
keineloesung: ja
min: 3
tipp: Aktiva: 40.000 + 6.000 + 18.000 + 1.000. Schulden: Darlehen und Verbindlichkeiten.
:::

## Teil 2: Buchungssätze zu den Geschäftsfällen

:::buchung Fall 1: Eingangsrechnung
fall: Kauf von Rohstoffen auf Ziel.
soll: 2000
haben: 4400
betrag: 20000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Rohstoffe nehmen zu. Gekauft auf Ziel.
:::
:::buchung Fall 2: Kontoauszug
fall: Kauf von BGA, Zahlung per Überweisung.
soll: 0850
haben: 2800
betrag: 5000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: BGA nimmt zu, die Bank nimmt ab.
:::
:::buchung Fall 3: Kontoauszug
fall: Verkauf von Fertigerzeugnissen, Bankgutschrift.
soll: 2800
haben: 5000
betrag: 61000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Ein Verkauf ist ein Ertrag (Umsatzerlöse). Das Geld kommt auf die Bank.
:::
:::buchung Fall 4: Kontoauszug
fall: Gehälter, Banküberweisung.
soll: 6300
haben: 2800
betrag: 21000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Gehälter sind ein Aufwand. Die Bank nimmt ab.
:::
:::buchung Fall 5: Kontoauszug
fall: Tilgung des Darlehens (Lastschrift).
soll: 4250
haben: 2800
betrag: 4000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Das Darlehen ist eine Schuld und wird kleiner.
:::
:::buchung Fall 6: Kontoauszug
fall: Zinsen für das Darlehen (Lastschrift).
soll: 7510
haben: 2800
betrag: 800
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Zinsen für Schulden sind ein Aufwand.
:::
:::buchung Fall 7: Kontoauszug
fall: Zinsgutschrift der Bank.
soll: 2800
haben: 5710
betrag: 200
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Zinsen, die du bekommst, sind ein Ertrag.
:::
:::buchung Fall 8: Kontoauszug
fall: Miete für die Lagerhalle, Banküberweisung.
soll: 6700
haben: 2800
betrag: 6000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Miete ist ein Aufwand, bezahlt per Bank.
:::
:::buchung Fall 9: Kontoauszug
fall: Überweisung an einen Lieferanten.
soll: 4400
haben: 2800
betrag: 15000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Eine Schuld beim Lieferer wird kleiner. Die Bank nimmt ab.
:::
:::buchung Fall 10: Buchungsanweisung
fall: Rohstoffverbrauch umbuchen (Inventur: Endbestand 7.000 €).
soll: 6000
haben: 2000
betrag: 19000
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Der Rohstoffverbrauch ist ein Aufwand. Er mindert das Konto Rohstoffe.
:::

## Teil 3: Buchen und abschließen (schriftlich)

:::schritte
1. Eröffne alle Konten über das EBK.
2. Buche alle 10 Fälle in den T-Konten.
3. Schließe die Erfolgskonten über das GuV-Konto ab und stelle das GuV-Konto auf.
4. Buche den Erfolg auf das Eigenkapital.
5. Schließe alle Bestandskonten über das SBK ab.
:::

## Teil 4: Abschluss kontrollieren

:::zahl Summe der Aufwendungen
frage: Wie hoch ist die Summe aller Aufwendungen?
antwort: 46800
einheit: €
keineloesung: ja
min: 2
tipp: Es sind vier Aufwandskonten. Addiere ihre Salden.
:::
:::zahl Summe der Erträge
frage: Wie hoch ist die Summe aller Erträge?
antwort: 61200
einheit: €
keineloesung: ja
min: 2
tipp: Umsatzerlöse und Zinserträge.
:::
:::zahl Erfolg
frage: Wie hoch ist der Gewinn? (Verlust als negative Zahl)
antwort: 14400
einheit: €
keineloesung: ja
min: 2
tipp: Erfolg = Erträge minus Aufwendungen.
:::
:::zahl Endbestand Bank
frage: Wie hoch ist der Endbestand auf dem Konto 2800 Bank?
antwort: 27400
einheit: €
keineloesung: ja
min: 2
tipp: Soll: Anfangsbestand plus Zugänge. Haben: alle Zahlungen. Differenz bilden.
:::
:::zahl Bilanzsumme
frage: Wie hoch ist die Bilanzsumme im SBK?
antwort: 80400
einheit: €
keineloesung: ja
min: 3
tipp: Summe aller Aktivkonten im SBK. Sie muss der Summe der Passiva entsprechen.
:::

:::buchung Gewinn buchen
fall: Das GuV-Konto zeigt den Gewinn. Buche ihn auf das Eigenkapital.
soll: GuV
haben: 3000
betrag: 14400
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Ein Gewinn mehrt das Eigenkapital. Das Eigenkapital steht im Haben.
:::
:::buchung Abschluss Eigenkapital
fall: Das Eigenkapital steht nach dem Gewinn bei einem neuen Stand. Bilde die Abschlussbuchung ins SBK.
soll: 3000
haben: SBK
betrag: 48400
konten: 2000, 2400, 2800, 2880, 3000, 4250, 4400, 5000, 5710, 6000, 6300, 6700, 7510, 0850, EBK, SBK, GuV
keineloesung: ja
min: 3
tipp: Das Eigenkapital ist ein Passivkonto.
:::

:::checkliste Checkliste vor der Abgabe
- Eigenkapital berechnet, Eröffnungsbuchungen vollständig.
- 10 Buchungssätze mit Kontonummern geprüft.
- Alle T-Konten geführt.
- GuV-Konto aufgestellt, Gewinn oder Verlust ermittelt.
- Eigenkapital um den Erfolg verändert.
- Alle Bestandskonten über das SBK abgeschlossen.
- Aktiva und Passiva im SBK sind gleich.
- Zwischenstand der Seite auf die Abgabe geschrieben.
:::

:::tipp
Arbeite in dieser Reihenfolge: Eröffnen, Buchen, Erfolgskonten abschließen, Eigenkapital buchen, SBK.
Den Kontenplan und das Merkblatt findest du unter Extras.
:::
