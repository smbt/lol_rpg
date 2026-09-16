
# Game Design Document

## 1. Grundkonzept

**Genre:** 2D-Kachel-Open-World-Action-RPG  
**Zielplattform:** Primär Tablet/Smartphone, zusätzlich PC

Das Spiel kombiniert eine **kachelbasierte Rasterbewegung** mit **Echtzeit-Action**.

Der Spieler bewegt sich Schritt für Schritt über ein Kachelraster, kann aber gleichzeitig Aktionen und Angriffe ausführen. Dadurch sind beispielsweise Bewegung und Angriffe in unterschiedliche Richtungen gleichzeitig möglich.

---

## 2. Steuerung

### PC

- `WASD` → Bewegung
- Aktionstaste → Angriff/Aktion

### Touch

- Touch an beliebiger Stelle → dynamisches D-Pad/Joystick zur Bewegung
- Einfacher Tap → Schlag bzw. Aktion
- Multitouch → gleichzeitige Bewegung und Aktion

Die Steuerung soll möglichst ohne explizite Erklärung verstanden und entdeckt werden.

---

## 3. Informationsdesign

Zu Beginn wird bewusst möglichst wenig UI angezeigt.

UI-Elemente erscheinen erst, wenn sie durch das Gameplay relevant werden:

- **HP-Balken:** erscheint nach dem ersten HP-Verlust
- **XP-Anzeige:** erscheint nach dem ersten Erhalt von Erfahrung
- **Inventar-Button:** erscheint nach dem ersten eingesammelten Item
- Weitere UI-Elemente sollen nach Möglichkeit ebenfalls erst dann sichtbar werden, wenn der Spieler das entsprechende System entdeckt.

### Designprinzip

Der Spieler lernt das Spiel durch Experimentieren und Beobachten statt durch umfangreiche Tutorials.

---

## 4. Weltstruktur

Der Spieler startet ungefähr im Zentrum einer sehr großen Welt auf einem sicheren, grünen Gebiet.

Das zentrale Startgebiet ist zunächst ungefähr **64 × 64 Kacheln** groß.

Außerhalb dieses Gebiets beginnen weitere Weltregionen mit zunehmender Gefährlichkeit.

Die Welt kann technisch aus einzelnen Regionen bzw. Chunks bestehen, sodass eine sehr große Welt möglich bleibt.

---

## 5. Tag-Nacht-Zyklus

### Tag

- Das zentrale Startgebiet ist sicher.
- Im inneren Bereich erscheinen keine Monster.
- Außerhalb der sicheren Zone können stärkere Monster auftauchen.
- Der Spieler kann dadurch selbst erkennen, welche Bereiche momentan zu gefährlich sind.

### Nacht

- Monster können auch in bisher sicheren Bereichen auftauchen.
- Der Spieler benötigt Schutzmöglichkeiten.
- Dadurch entsteht früh ein konkretes Überlebensproblem.

Der Spieler soll selbst erkennen, dass er eine Möglichkeit benötigt, die Nacht zu überleben.

---

## 6. Gebäude und Schutz

In der Welt befinden sich Strukturen wie Häuser.

Gebäude können als sichere Rückzugsorte dienen.

Geplante Mechanik:

- Materialien sammeln
- Konstruktionen herstellen
- beispielsweise eine Tür herstellen
- Tür in ein Gebäude einsetzen
- ein vollständig verschlossenes Haus bietet vollständigen Schutz vor Nachtmonstern

### Feuer

Feuer bietet zusätzlichen Schutz, ist aber außerhalb eines geschlossenen Gebäudes nicht vollständig sicher.

Mögliche Funktionen:

- Lagerfeuer
- Licht
- Wärme
- begrenzter Schutz vor Monstern
- Fackel
- Fackel als mögliche Waffe

Einige Monster sollen sich trotz Feuer nähern können.

---

## 7. Ressourcen

### Frühe Ressourcen

- Holz
- Stein
- Seil/Schnur
- Feuerstein
- Nahrung

### Mögliche weitere Ressourcen

- Knochen
- Harz
- Lehm
- Kräuter
- weitere Pflanzenmaterialien

Ressourcen sollen grundsätzlich erneuerbar sein.

### Respawn

- Gefällte Bäume hinterlassen einen Baumstumpf und können später nachwachsen.
- Steine können erneut erscheinen.
- Monster respawnen.
- Die Welt soll dauerhaft farmbar bleiben.

---

## 8. Weltinteraktion

Die grundlegende Interaktion folgt dem Prinzip:

**Hingehen → Aktion ausführen → Welt reagiert**

Beispiel:

Baum → schlagen → mehrfach schlagen → Baum wird zerstört → Holz erscheint → Holz aufsammeln → Holz befindet sich im Inventar

Die Welt soll auf möglichst viele Objekte direkt reagieren können.

---

## 9. Crafting

Das Crafting-System soll bewusst einfach und experimentell funktionieren.

Es gibt kein klassisches Crafting-Menü.

Stattdessen werden Items direkt miteinander kombiniert:

**Item + Item → neues Item**

Beispiele:

- Holz + Seil → gebundenes Holz
- gebundenes Holz + Stein → primitive Waffe
- Holz + Holz → Holzkonstruktion
- weitere Materialien → komplexere Konstruktionen
- passende Konstruktion + Komponenten → Tür

Der Spieler soll Rezepte möglichst nicht vorab kennen müssen.

### Designprinzip

Das Crafting soll zum Experimentieren einladen:

**„Was passiert, wenn ich diese beiden Gegenstände miteinander kombiniere?“**

---

## 10. Feuer und erste Nacht

Feuer soll bereits sehr früh verfügbar sein.

Der Spieler kann beispielsweise ein Lagerfeuer oder eine Fackel herstellen.

Die erste Nacht dient gleichzeitig als erste größere Überlebenssituation und als Experimentierphase.

Möglicher Ablauf:

1. Tagsüber Ressourcen sammeln
2. Erste Gegenstände herstellen
3. Nacht bricht herein
4. Monster erscheinen
5. Spieler sucht oder baut Schutz
6. Spieler experimentiert innerhalb des sicheren Hauses mit seinen Gegenständen
7. Am nächsten Morgen kann die Erkundung fortgesetzt werden

---

## 11. Höhlensystem

Die Welt enthält Höhleneingänge, beispielsweise an Bergen oder Felswänden.

Es gibt **kein frei grabbares Terrain** wie bei Minecraft.

Stattdessen führt ein Höhleneingang in einen separaten Kartenabschnitt.

### Eigenschaften

- Höhlen sind unabhängig von der Tageszeit dunkel.
- Höhlen besitzen eigene Karten.
- In Höhlen können bereits tagsüber Monster existieren.
- Höhlen enthalten Erzvorkommen.
- Erz benötigt möglicherweise zunächst primitive Werkzeuge zum Abbau.
- Höhlen können zusätzliche Ressourcen und Gefahren enthalten.

### Höhlen-Respawn

Monster innerhalb einer Höhle respawnen nicht unmittelbar.

Wenn der Spieler die Höhle verlässt und für ungefähr eine Minute außerhalb bleibt, kann die Höhle zurückgesetzt werden und ihre Monster erneut erscheinen.

---

## 12. Progression

Die Progression soll primär durch **Entdeckung und zunehmende Möglichkeiten** funktionieren.

Der Spieler erkennt selbst:

- welche Gebiete gefährlich sind
- welche Ressourcen existieren
- welche Items kombinierbar sind
- welche Ausrüstung benötigt wird
- wie man nachts überlebt
- wie man Höhlen erkundet
- wie man zunehmend weiter in die Welt vordringen kann

### Grundprinzip

Nicht:

> „Gehe dorthin, weil das Spiel es dir sagt.“

Sondern:

> „Dort draußen ist etwas Interessantes. Wie werde ich stark genug, um dorthin zu gelangen?“

---

## 13. Vorläufige Core Loop

**Erkunden → Ressourcen entdecken → Ressourcen sammeln → Items ausprobieren → Crafting → neue Möglichkeiten erhalten → gefährlichere Gebiete erkunden → stärkere Gegner → Nacht überleben → neue Ressourcen und Ausrüstung → weiter in die Welt vordringen**

---

## 14. Übergeordnetes Designprinzip

Das zentrale Prinzip des Spiels ist:

**Discover → Experiment → Survive → Progress**

Der Spieler soll möglichst wenig vorgegeben bekommen und die Systeme des Spiels durch tatsächliche Interaktion entdecken.

