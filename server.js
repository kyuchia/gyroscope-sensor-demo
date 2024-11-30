// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 }, () => {
//     console.log('WebSocket server started on port 8080');
// });

// wss.on('connection', (ws) => {
//     console.log('New client connected');

//     ws.on('message', (data) => {
//         console.log('Message received from client:', data);
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });

//     // Optionally send a message to confirm the connection
//     ws.send('Hello from server');
// });


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});

let unityClient = null;

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (data) => {
        // Decode the buffer to a string
        const decodedMessage = data.toString('utf-8');
        console.log('Message received from client:', decodedMessage);

        // Forward decoded data to Unity if connected
        if (unityClient && unityClient.readyState === WebSocket.OPEN) {
            unityClient.send(decodedMessage);
            console.log('Forwarded data to Unity:', decodedMessage);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle Unity connection
wss.on('connection', (ws) => {
    if (!unityClient) {
        unityClient = ws;
        console.log('Unity client connected');
    }
});
