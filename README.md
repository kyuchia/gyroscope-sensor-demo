# Seascape Controller

A mobile web app (PWA) that captures phone sensor data and sends it as OSC messages to Max/MSP, TouchDesigner, or any OSC receiver via WebSocket.

> Originally developed for Yu-Chia Kuo's ICMC 2025 paper *"Seascape Serenity: Unveiling the Underwater Soundscape"* as a web-based replacement for proprietary sensor apps like GyrOSC.

## Architecture

```
Phone Browser ──WebSocket──▶ Node.js Server ──UDP/OSC──▶ Max/MSP
  (sensors)                    (server.js)                 SPAT
  (pads)                                                   TouchDesigner
```

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- For iOS testing: [ngrok](https://ngrok.com/) (`brew install ngrok`)

### Setup

```bash
cd server
npm install
npm start          # production (quiet)
npm run dev        # verbose (prints every sensor message)
```

The server will print your local IP. Open `http://<your-ip>:8080` on your phone (same Wi-Fi network).

### iOS HTTPS Requirement

iOS Safari requires HTTPS for motion/orientation sensor access. Use ngrok in a separate terminal:

```bash
ngrok http 8080
```

Open the `https://xxxxx.ngrok-free.app` URL on your iPhone. Leave the Server IP field empty — the app auto-connects to the serving host.

Android works over HTTP on local networks.

## Interface

4-tab mobile interface with glassmorphism design:

| Tab | Purpose |
|---|---|
| **Connect** | Server IP, port, OSC prefix, start/stop |
| **Sensors** | Toggle gyroscope, accelerometer, rotation rate, shake detection. Adjustable frequency (10–200ms) |
| **3D** | Live 3D phone orientation visualization + real-time sensor data readout |
| **Pads** | 8 trigger pads in 3-3-2 layout (press=1, release=0) with ripple animation |

## OSC Messages

All addresses use the configurable prefix (default `/seascape`).

### Sensor Data

| Address | Arguments | Source |
|---|---|---|
| `/seascape/orientation` | alpha beta gamma (float) | Gyroscope |
| `/seascape/orientation/alpha` | float | Gyroscope |
| `/seascape/orientation/beta` | float | Gyroscope |
| `/seascape/orientation/gamma` | float | Gyroscope |
| `/seascape/acceleration` | x y z (float) | Accelerometer (incl. gravity) |
| `/seascape/acceleration/x` | float | Accelerometer |
| `/seascape/acceleration/y` | float | Accelerometer |
| `/seascape/acceleration/z` | float | Accelerometer |
| `/seascape/rotationRate` | alpha beta gamma (float) | Angular velocity (°/s) |
| `/seascape/rotationRate/alpha` | float | Rotation rate |
| `/seascape/rotationRate/beta` | float | Rotation rate |
| `/seascape/rotationRate/gamma` | float | Rotation rate |
| `/seascape/shake` | 0 or 1 (int) | Shake detection |

### Pads & Client

| Address | Arguments | Source |
|---|---|---|
| `/seascape/pad/1` ~ `/pad/8` | 0 or 1 (int) | Trigger pads |
| `/seascape/client` | int | Client ID |

## Server Configuration

| Env Variable | Default | Description |
|---|---|---|
| `WS_PORT` | 8080 | WebSocket + HTTP server port |
| `OSC_HOST` | 127.0.0.1 | OSC target IP |
| `OSC_PORT` | 8000 | OSC target port |

```bash
# Example: send OSC to a different machine
OSC_HOST=192.168.1.50 OSC_PORT=9000 npm start
```

## Max/MSP Setup

```
[udpreceive 8000]
      |
[route /seascape]
      |
[route /orientation /acceleration /rotationRate /shake /pad]
```

## Features

- 4 sensor types with individual on/off toggles
- Adjustable send frequency (10–200ms)
- 8 trigger pads with haptic feedback and ripple animation
- Real-time 3D orientation visualization with perspective effects
- Lock mode to prevent accidental setting changes during performance
- Settings auto-saved to localStorage
- Auto-detect WebSocket URL (leave IP empty when using ngrok)
- Responsive design: iPhone SE → iPad, portrait + landscape
- Safe area support for notch/Dynamic Island phones
- `prefers-reduced-motion` accessibility support
- PWA installable (add to homescreen)

## Project Structure

```
seascape-osc/
├── client/
│   ├── index.html        ← Single-file PWA (HTML + CSS + JS)
│   └── manifest.json     ← PWA manifest
├── server/
│   ├── server.js         ← WebSocket → OSC bridge + HTTP file server
│   ├── package.json      ← Dependencies: ws, node-osc
│   └── package-lock.json
├── .gitignore
└── README.md
```

