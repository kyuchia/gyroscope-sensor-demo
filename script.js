document.addEventListener("DOMContentLoaded", () => {
    let isRunning = false;
    let orientationHandler;

    const button = document.getElementById("toggleButton");

    button.addEventListener("click", toggleDemo);

    function toggleDemo() {
        if (isRunning) {
            window.removeEventListener("deviceorientation", orientationHandler);
            orientationHandler = null;
            button.textContent = "Start Demo";
            button.classList.remove("stop-button");
            console.log("Gyroscope demo stopped.");
        } else {
            if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
                DeviceOrientationEvent.requestPermission()
                    .then((permissionState) => {
                        if (permissionState === "granted") {
                            startGyroscope();
                        } else {
                            alert("Permission denied.");
                        }
                    })
                    .catch(console.error);
            } else {
                startGyroscope();
            }

            button.textContent = "Stop Demo";
            button.classList.add("stop-button");
            console.log("Gyroscope demo started.");
        }
        isRunning = !isRunning;
    }

    function startGyroscope() {
        orientationHandler = (event) => {
            const rotateDegrees = event.alpha || 0;
            const leftToRight = event.gamma || 0;
            const frontToBack = event.beta || 0;

            document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
            document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
            document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);
        };

        window.addEventListener("deviceorientation", orientationHandler, true);
    }
});

//10.254.113.215
// https://629d-207-164-135-99.ngrok-free.app

// console.log("Script loaded");

// document.addEventListener("DOMContentLoaded", () => {
//     let isRunning = false; // Track the state of the demo
//     let orientationHandler; // Reference to the orientation event handler

//     console.log("Script loaded"); // Debugging log to confirm script is loaded

//     // Initialize WebSocket connection
//     const socket = new WebSocket("wss://471d-207-164-135-99.ngrok-free.app"); // Replace with your Mac's local IP

//     // WebSocket event handlers
//     socket.onopen = () => {
//         console.log("WebSocket connection established");
//     };

//     socket.onclose = () => {
//         console.log("WebSocket connection closed");
//     };

//     socket.onerror = (error) => {
//         console.error("WebSocket error:", error);
//     };

//     // Start and stop the demo
//     const button = document.getElementById("toggleButton");

//     button.addEventListener("click", toggleDemo);

//     function toggleDemo() {
//         if (isRunning) {
//             // Stop collecting gyroscope data
//             window.removeEventListener("deviceorientation", orientationHandler);
//             orientationHandler = null;
//             button.textContent = "Start Demo";
//             button.classList.remove("stop-button");
//             console.log("Gyroscope demo stopped.");
//         } else {
//             // Request permissions for iOS
//             if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
//                 DeviceOrientationEvent.requestPermission()
//                     .then((permissionState) => {
//                         console.log("Permission state:", permissionState); // Debugging
//                         if (permissionState === "granted") {
//                             startGyroscope();
//                         } else {
//                             alert("Permission denied.");
//                         }
//                     })
//                     .catch((error) => console.error("Permission request error:", error));
//             } else {
//                 // For non-iOS devices
//                 startGyroscope();
//             }

//             button.textContent = "Stop Demo";
//             button.classList.add("stop-button");
//             console.log("Gyroscope demo started.");
//         }
//         isRunning = !isRunning;
//     }

//     function startGyroscope() {
//         console.log("Starting gyroscope..."); // Debugging

//         // Gyroscope data handler
//         orientationHandler = (event) => {
//             console.log("Gyroscope event:", event); // Log the raw event for debugging

//             const rotateDegrees = event.alpha || 0; // alpha: rotation around z-axis
//             const leftToRight = event.gamma || 0;   // gamma: left-to-right tilt
//             const frontToBack = event.beta || 0;    // beta: front-to-back tilt

//             // Update gyroscope data in the UI
//             document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
//             document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
//             document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);

//             // Send gyroscope data to WebSocket server
//             if (socket.readyState === WebSocket.OPEN) {
//                 const gyroData = {
//                     x: frontToBack,
//                     y: leftToRight,
//                     z: rotateDegrees,
//                 };
//                 socket.send(JSON.stringify(gyroData));
//                 console.log("Sent gyroscope data:", gyroData);
//             } else {
//                 console.warn("WebSocket is not open; data not sent.");
//             }
//         };

//         // Add the event listener
//         window.addEventListener("deviceorientation", orientationHandler, true);
//     }
// });

