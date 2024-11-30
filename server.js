const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (data) => {
        console.log('Message received from client:', data);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Optionally send a message to confirm the connection
    ws.send('Hello from server');
});
