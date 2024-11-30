const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});

let unityClient = null;

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (data) => {
        console.log('Message received from client:', data);

        // If Unity is connected, send data to Unity
        if (unityClient && unityClient.readyState === WebSocket.OPEN) {
            unityClient.send(data);
            console.log('Forwarded data to Unity:', data);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle Unity connection as the first client
wss.on('connection', (ws) => {
    if (!unityClient) {
        unityClient = ws;
        console.log('Unity client connected');
    }
});
