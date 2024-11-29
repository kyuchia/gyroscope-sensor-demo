using System.Text;
using UnityEngine;
using NativeWebSocket;

public class WebSocketServer : MonoBehaviour
{
    private WebSocket websocket;

    async void Start()
    {
        // Start the WebSocket server
        websocket = new WebSocket("ws://localhost:8080");

        websocket.OnMessage += (bytes) =>
        {
            // Decode the received data
            string message = Encoding.UTF8.GetString(bytes);
            Debug.Log("Message received: " + message);

            // Process gyroscope data
            ProcessGyroscopeData(message);
        };

        await websocket.Connect();
    }

    void Update()
    {
        // Keep WebSocket connection alive
        websocket?.DispatchMessageQueue();
    }

    private void ProcessGyroscopeData(string data)
    {
        // Assume data is JSON format: {"x": 0.5, "y": 1.2, "z": -0.8}
        GyroscopeData gyroData = JsonUtility.FromJson<GyroscopeData>(data);
        Debug.Log($"Gyroscope Data: X={gyroData.x}, Y={gyroData.y}, Z={gyroData.z}");

        // Example: Apply gyroscope data to an object
        // transform.Rotate(gyroData.x, gyroData.y, gyroData.z);
    }

    private async void OnApplicationQuit()
    {
        await websocket.Close();
    }

    [System.Serializable]
    private class GyroscopeData
    {
        public float x;
        public float y;
        public float z;
    }
}
