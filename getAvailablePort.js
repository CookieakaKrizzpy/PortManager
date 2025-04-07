const net = require("net");

/**
 * Prüft, ob ein bestimmter Port verfügbar ist.
 * @param {number} port - Der zu prüfende Port.
 * @returns {Promise<boolean>} - Liefert true, wenn der Port verfügbar ist, sonst false.
 * @throws {Error} - Wenn der Port ungültig ist oder ein Netzwerkfehler auftritt.
 */
const isPortAvailable = (port) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
      reject(new Error(`Ungültiger Port: ${port}. Port muss zwischen 0 und 65535 liegen.`));
      return;
    }

    const server = net.createServer();
    server.unref();

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false); // Port ist belegt
      } else {
        reject(new Error(`Fehler beim Prüfen von Port ${port}: ${err.message}`));
      }
    });

    server.listen(port, () => {
      server.close(() => resolve(true)); // Port ist verfügbar
    });
  });
};

/**
 * Sucht in einem Portbereich nach einem freien Port mit Wiederholungen.
 * @param {number} [startPort=4000] - Der Startport des Bereichs.
 * @param {number} [endPort=4500] - Der Endport des Bereichs.
 * @param {number} [retries=5] - Max. Wiederholungen, falls kein Port frei ist.
 * @param {number} [delay=1000] - Wartezeit zwischen Versuchen (in ms).
 * @returns {Promise<number>} - Erster gefundener freier Port.
 * @throws {Error} - Falls kein Port nach allen Versuchen verfügbar ist oder ungültige Parameter.
 */
const getAvailablePort = async (startPort = 4000, endPort = 4500, retries = 5, delay = 1000) => {
  // Parameter validieren
  if (!Number.isInteger(startPort) || !Number.isInteger(endPort)) {
    throw new Error("Start- und Endport müssen ganze Zahlen sein.");
  }
  if (startPort > endPort) {
    throw new Error("Startport muss kleiner oder gleich Endport sein.");
  }
  if (startPort < 0 || endPort > 65535) {
    throw new Error("Ports müssen zwischen 0 und 65535 liegen.");
  }
  if (retries < 1) {
    throw new Error("Mindestens ein Versuch muss erlaubt sein.");
  }
  if (delay < 0) {
    throw new Error("Verzögerung muss positiv sein.");
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    const ports = Array.from(
      { length: endPort - startPort + 1 },
      (_, i) => startPort + i
    );

    try {
      // Parallel prüfen für beste Performance
      const results = await Promise.all(
        ports.map(async (port) => ({
          port,
          available: await isPortAvailable(port),
        }))
      );

      const foundPort = results.find((result) => result.available);
      if (foundPort) {
        return foundPort.port;
      }

      if (attempt < retries - 1) {
        console.warn(
          `⚠️ Kein freier Port im Bereich ${startPort}-${endPort} gefunden. ` +
          `Warte ${delay}ms und versuche erneut (${attempt + 1}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      throw new Error(`Fehler bei der Portsuche: ${error.message}`);
    }
  }

  throw new Error(
    `❌ Kein verfügbarer Port im Bereich ${startPort}-${endPort} nach ${retries} Versuchen.`
  );
};

module.exports = getAvailablePort;
