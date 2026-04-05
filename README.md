# Seascape Controller

A mobile PWA that streams phone sensor data (gyroscope, accelerometer, rotation rate) as OSC messages via WebSocket.

## Architecture

```
Phone Browser ──WebSocket──▶ Node.js Server ──UDP/OSC──▶ Any OSC Receiver
  (sensors)                    (server.js)                 (DAW, VJ software,
  (pads)                                                    game engine, etc.)
```

## Quick Start

Requires [Node.js](https://nodejs.org/) v18+.

```bash
cd server
npm install
npm start
```

Open `http://<your-ip>:8080` on your phone (same Wi-Fi).

> **iOS note:** Safari requires HTTPS for sensor access. Use `ngrok http 8080` to get a temporary HTTPS URL.

## Features

- Gyroscope, accelerometer, rotation rate, shake detection
- Configurable OSC prefix and send frequency (10–200ms)
- 8 trigger pads with haptic feedback
- Real-time 3D orientation visualization
- Lock mode for live performance
- Responsive design with safe area support
- PWA installable

## OSC Output

All messages use a configurable prefix (default `/seascape`):

| Address | Arguments |
|---|---|
| `.../orientation` | alpha, beta, gamma |
| `.../acceleration` | x, y, z |
| `.../rotationRate` | alpha, beta, gamma |
| `.../shake` | 0 or 1 |
| `.../pad/1` ~ `.../pad/8` | 0 or 1 |

Each axis is also sent individually (e.g. `.../orientation/alpha`).

## Server Options

| Env Variable | Default | Description |
|---|---|---|
| `WS_PORT` | 8080 | Server port |
| `OSC_HOST` | 127.0.0.1 | OSC target IP |
| `OSC_PORT` | 8000 | OSC target port |

```bash
OSC_HOST=192.168.1.50 OSC_PORT=9000 npm start
npm run dev  # verbose logging
```

## Project Structure

```
├── client/
│   ├── index.html        ← Single-file PWA
│   └── manifest.json
├── server/
│   ├── server.js         ← WebSocket → OSC bridge
│   └── package.json
└── README.md
```
