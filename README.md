# Port Manager

Ein einfacher Node.js-Helper, um freie Ports in einem definierten Bereich zu finden.

## 📌 Funktionen

- Prüft, ob ein bestimmter Port verfügbar ist
- Durchsucht einen definierten Portbereich nach freien Ports
- Mehrfache Versuche mit Wartezeit zwischen den Versuchen
- Parallele Portprüfung für optimale Performance

## 🚀 Installation

Stelle sicher, dass Node.js installiert ist. Dann kannst du das Modul in deinem Projekt verwenden:

```sh
npm install
```

## 📖 Verwendung

### 1️⃣ Port auf Verfügbarkeit prüfen

```javascript
const isPortAvailable = require('./portChecker');

(async () => {
  const port = 8080;
  const available = await isPortAvailable(port);
  console.log(`Port ${port} ist ${available ? 'frei' : 'belegt'}`);
})();
```

### 2️⃣ Ersten verfügbaren Port im Bereich finden

```javascript
const getAvailablePort = require('./portChecker');

(async () => {
  try {
    const freePort = await getAvailablePort(4000, 4500);
    console.log(`Gefundener freier Port: ${freePort}`);
  } catch (error) {
    console.error(error.message);
  }
})();
```

## 🔧 API

### `isPortAvailable(port: number) => Promise<boolean>`

Prüft, ob ein bestimmter Port frei ist.

**Parameter:**
- `port` *(number)*: Der zu prüfende Port.

**Rückgabe:**
- `Promise<boolean>`: `true`, wenn der Port verfügbar ist, sonst `false`.

---

### `getAvailablePort(startPort: number = 4000, endPort: number = 4500, retries: number = 5, delay: number = 1000) => Promise<number>`

Sucht einen freien Port in einem definierten Bereich mit mehreren Versuchen.

**Parameter:**
- `startPort` *(number, optional)*: Startport des Bereichs (Standard: `4000`).
- `endPort` *(number, optional)*: Endport des Bereichs (Standard: `4500`).
- `retries` *(number, optional)*: Anzahl der Wiederholungsversuche (Standard: `5`).
- `delay` *(number, optional)*: Wartezeit zwischen den Versuchen in Millisekunden (Standard: `1000ms`).

**Rückgabe:**
- `Promise<number>`: Der erste gefundene freie Port.

**Fehler:**
- Löst einen Fehler aus, wenn kein Port nach allen Versuchen verfügbar ist.

## 🛠️ Entwicklung & Tests

Um das Skript zu testen, kannst du es einfach mit Node.js ausführen:

```sh
node test.js
```

## 📜 Lizenz

MIT License. Frei zur Nutzung und Anpassung.

