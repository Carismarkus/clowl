# Eule

Mod für Claude Code: eine treudoof schauende Eule über der Eingabe, solange Claude auf die nächste Aufgabe wartet. Sie schaut den User an, blinzelt etwa alle 5 Sekunden (manchmal doppelt) und verschwindet, sobald Claude arbeitet.

- Pixelbild 16 × 16 aus Halbblock-Zeichen (16 Spalten × 8 Zeilen), nur im Terminal.
- Erscheint nicht während einer Umfrage oder wenn das Band zu klein ist; ausblenden mit `[-]` rechts am Band.
- Bild und Farben: `OWL` und `PALETTE` in `hooks/register.tsx`.

## Installation

Aus diesem Ordner (lokaler Marketplace, Claude Code liest den Mod direkt von hier):

```
claude plugin marketplace add "D:\Claude Projects\Eule"
```

```
claude plugin install eule@eule --scope user
```

Änderungen hier im Repo lädt `/reload-plugins`.

## Entwicklung

- Prüfen: `claude plugin validate .` und `claude plugin test .`
