# Clowl

[English](README.md)

Mod für Claude Code: eine treudoof schauende Eule über der Eingabe, solange Claude auf die nächste Aufgabe wartet. Sie schaut dich an, blinzelt etwa alle 5 Sekunden (manchmal doppelt) und verschwindet, sobald Claude arbeitet.

- Pixelbild 16 × 16 aus Halbblock-Zeichen (16 Spalten × 8 Zeilen), nur im Terminal.
- Erscheint nicht während einer Umfrage oder wenn das Band zu klein ist; ausblenden mit `[-]` rechts am Band.

## Installation

In einer Claude-Code-Sitzung im Terminal eingeben:

```
/plugin install clowl --marketplace Carismarkus/clowl
```

Die Frage, ob der Marketplace hinzugefügt werden soll, mit `y` beantworten und dann den Geltungsbereich wählen (`user` = in allen Projekten).

## Wie ändere ich den Text?

Neben der Eule stehen zwei Zeilen: „Hu-hu?“ und darunter, abgedunkelt, „Ich warte auf deine nächste Aufgabe.“ Beide stehen ganz oben in `hooks/register.tsx`:

```ts
const TEXT = 'Hu-hu?'
const SUBTEXT = 'Ich warte auf deine nächste Aufgabe.'
```

1. Den Mod lokal einbinden, damit Claude Code ihn aus deinem Ordner liest (siehe unten, „Aus einem lokalen Ordner“). Eine Installation aus GitHub liegt in einem Cache von Claude Code; Änderungen dort gehen beim nächsten Update verloren.
2. Den Text zwischen den einfachen Anführungszeichen ändern und die Datei speichern. Enthält der Text selbst ein `'`, davor einen Backslash setzen: `'Wie geht\'s?'`.
3. Eine leere Zeile (`''`) wird weggelassen: Mit `SUBTEXT = ''` steht nur eine Zeile neben der Eule.
4. In Claude Code `/reload-plugins` eingeben. Die Eule zeigt den neuen Text, sobald Claude wieder wartet.

Das Bild und die Farben stehen in derselben Datei: `OWL` (ein Buchstabe pro Pixel) und `PALETTE` (Farbe pro Buchstabe).

## Aus einem lokalen Ordner

Repo klonen oder herunterladen, dann (Pfad anpassen):

```
claude plugin marketplace add "C:\Pfad\zu\clowl"
```

```
claude plugin install clowl@clowl --scope user
```

Änderungen im Ordner lädt `/reload-plugins`.

## Entwicklung

- Prüfen: `claude plugin validate .` und `claude plugin test .`

## Lizenz

MIT, siehe [LICENSE](LICENSE).
