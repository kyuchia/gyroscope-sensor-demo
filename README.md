# Seascape Controller

Mobile web app for sending phone sensor data as OSC to Max/MSP, TouchDesigner, or any OSC receiver.

## Quick Start

```bash
cd server
npm install
npm start
```

Open `http://<your-ip>:8080` on your phone (same Wi-Fi network).

## Architecture

```
Phone Browser ──WebSocket──▶ Node.js Server ──UDP/OSC──▶ Max/MSP
  (sensors)                    (server.js)                 SPAT
  (pads)                                                   TouchDesigner
```

## 4 Tabs

| Tab | Purpose |
|---|---|
| **Connect** | Server IP, port, OSC prefix, start/stop |
| **Sensors** | Toggle gyroscope, accelerometer, rotation rate, shake. Frequency slider |
| **3D** | Live 3D phone orientation + all sensor data readout |
| **Pads** | 8 trigger pads (press=1, release=0) |

## OSC Messages

All addresses use the configurable prefix (default `/seascape`).

| Address | Args | Source |
|---|---|---|
| `/seascape/orientation` | alpha beta gamma (float) | Gyroscope |
| `/seascape/orientation/alpha` | float | Gyroscope |
| `/seascape/orientation/beta` | float | Gyroscope |
| `/seascape/orientation/gamma` | float | Gyroscope |
| `/seascape/acceleration` | x y z (float) | Accelerometer |
| `/seascape/acceleration/x` | float | Accelerometer |
| `/seascape/acceleration/y` | float | Accelerometer |
| `/seascape/acceleration/z` | float | Accelerometer |
| `/seascape/rotationRate` | alpha beta gamma (float) | Rotation rate |
| `/seascape/rotationRate/alpha` | float | Rotation rate |
| `/seascape/rotationRate/beta` | float | Rotation rate |
| `/seascape/rotationRate/gamma` | float | Rotation rate |
| `/seascape/shake` | 0 or 1 (int) | Shake detection |
| `/seascape/pad/1` ~ `/pad/8` | 0 or 1 (int) | Trigger pads |
| `/seascape/client` | int | Client ID |

## Server Configuration

| Env Variable | Default | Description |
|---|---|---|
| `WS_PORT` | 8080 | WebSocket + HTTP server port |
| `OSC_HOST` | 127.0.0.1 | OSC target IP |
| `OSC_PORT` | 8000 | OSC target port |

```bash
OSC_HOST=192.168.1.50 OSC_PORT=9000 npm start
npm run dev  # verbose mode
```

## Max/MSP Setup

```
[udpreceive 8000]
      |
[route /seascape]
      |
[route /orientation /acceleration /rotationRate /shake /pad]
```

## iOS HTTPS Note

iOS Safari requires HTTPS for `deviceorientation`/`devicemotion`.
For local development: `ngrok http 8080` gives a temporary HTTPS URL.
Android works over HTTP on local networks.

## PWA

Add to homescreen for fullscreen, app-like experience. The manifest is included.
For icons, replace `icon-192.png` and `icon-512.png` in the client folder.

## Features

- 4 sensor types with individual toggles
- Adjustable send frequency (10-200ms)
- 8 trigger pads with ripple feedback
- 3D orientation visualization
- Lock mode for performance safety
- Settings auto-saved to localStorage
- Responsive: iPhone SE → iPad, portrait + landscape
- Safe area support for notch phones
- PWA installable

## Project Structure

```
seascape-osc/
├── client/
│   ├── index.html        ← Mobile web app
│   └── manifest.json     ← PWA manifest
├── server/
│   ├── server.js         ← WebSocket → OSC bridge
│   └── package.json
└── README.md
```
