const { Server: WSServer } = require("ws");
const { Client: OSCClient } = require("node-osc");
const http = require("http");
const fs = require("fs");
const path = require("path");

const VERBOSE = process.argv.includes("--verbose");
const WS_PORT  = parseInt(process.env.WS_PORT)  || 8080;
const OSC_HOST = process.env.OSC_HOST            || "127.0.0.1";
const OSC_PORT = parseInt(process.env.OSC_PORT)  || 8000;

const MIME = {
    ".html":"text/html",".css":"text/css",".js":"application/javascript",
    ".json":"application/json",".png":"image/png",".svg":"image/svg+xml",
    ".ico":"image/x-icon",".webmanifest":"application/manifest+json"
};

const httpServer = http.createServer((req, res) => {
    let url = req.url.split("?")[0];
    if (url === "/") url = "/index.html";
    const filePath = path.join(__dirname, "..", "client", url);
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end("Not found"); return; }
        res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain", "Cache-Control": "no-cache" });
        res.end(data);
    });
});

const wss = new WSServer({ server: httpServer });
const oscClient = new OSCClient(OSC_HOST, OSC_PORT);
let clientCount = 0;

wss.on("connection", (ws, req) => {
    const id = ++clientCount;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(`Client #${id} connected from ${ip}`);

    ws.on("message", (raw) => {
        try {
            const msg = JSON.parse(raw.toString());
            const pfx = msg.prefix || "/webgyro";

            if (msg.orientation) {
                const { alpha, beta, gamma } = msg.orientation;
                oscClient.send(`${pfx}/orientation`, alpha, beta, gamma);
                oscClient.send(`${pfx}/orientation/alpha`, alpha);
                oscClient.send(`${pfx}/orientation/beta`, beta);
                oscClient.send(`${pfx}/orientation/gamma`, gamma);
                if (VERBOSE) console.log(`  [#${id}] orient a=${alpha} b=${beta} g=${gamma}`);
            }

            if (msg.acceleration) {
                const { x, y, z } = msg.acceleration;
                oscClient.send(`${pfx}/acceleration`, x, y, z);
                oscClient.send(`${pfx}/acceleration/x`, x);
                oscClient.send(`${pfx}/acceleration/y`, y);
                oscClient.send(`${pfx}/acceleration/z`, z);
                if (VERBOSE) console.log(`  [#${id}] accel x=${x} y=${y} z=${z}`);
            }

            if (msg.rotationRate) {
                const { alpha, beta, gamma } = msg.rotationRate;
                oscClient.send(`${pfx}/rotationRate`, alpha, beta, gamma);
                oscClient.send(`${pfx}/rotationRate/alpha`, alpha);
                oscClient.send(`${pfx}/rotationRate/beta`, beta);
                oscClient.send(`${pfx}/rotationRate/gamma`, gamma);
                if (VERBOSE) console.log(`  [#${id}] rot a=${alpha} b=${beta} g=${gamma}`);
            }

            if (msg.shake !== undefined) {
                oscClient.send(`${pfx}/shake`, msg.shake);
                if (msg.shake && VERBOSE) console.log(`  [#${id}] SHAKE`);
            }

            if (msg.pad !== undefined) {
                oscClient.send(`${pfx}/pad/${msg.pad.id}`, msg.pad.value);
                if (VERBOSE) console.log(`  [#${id}] pad/${msg.pad.id} = ${msg.pad.value}`);
            }

            oscClient.send(`${pfx}/client`, id);
        } catch (e) {
            console.error(`  [#${id}] Parse error:`, e.message);
        }
    });

    ws.on("close", () => console.log(`Client #${id} disconnected`));
    ws.on("error", (e) => console.error(`  [#${id}] Error:`, e.message));
});

httpServer.listen(WS_PORT, "0.0.0.0", () => {
    console.log(`\n  WebGyro Server`);
    console.log(`  WebSocket + HTTP: http://0.0.0.0:${WS_PORT}`);
    console.log(`  OSC target:       ${OSC_HOST}:${OSC_PORT}`);
    console.log(`  Verbose:          ${VERBOSE}\n`);
    const nets = require("os").networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
                console.log(`  Open on phone: http://${net.address}:${WS_PORT}`);
            }
        }
    }
    console.log("");
});
