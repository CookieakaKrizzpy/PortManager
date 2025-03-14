const net = require("net");

/**
 * Prüft, ob ein bestimmter Port verfügbar ist.
 * @param {number} port - Der zu prüfende Port.
 * @returns {Promise<boolean>} - Liefert true, wenn der Port verfügbar ist, sonst false.
 */
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();

    server.on("error", () => resolve(false)); // Falls Port belegt, false zurückgeben

    server.listen(port, () => {
      server.close(() => resolve(true)); // Falls verfügbar, schließen & true zurückgeben
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
 * @throws {Error} - Falls kein Port nach allen Versuchen verfügbar ist.
 */
const getAvailablePort = async (startPort = 4000, endPort = 4500, retries = 5, delay = 1000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const ports = Array.from({ length: endPort - startPort + 1 }, (_, i) => startPort + i);

    // Parallel prüfen, um die beste Performance zu erhalten
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

    console.warn(`⚠️ Kein freier Port gefunden. Warte ${delay}ms und versuche erneut...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error(`❌ Kein verfügbarer Port im Bereich ${startPort}-${endPort} nach ${retries} Versuchen.`);
};

module.exports = getAvailablePort;
