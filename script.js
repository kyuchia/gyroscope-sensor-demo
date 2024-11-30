// document.addEventListener("DOMContentLoaded", () => {
//     let isRunning = false;
//     let orientationHandler;

//     const button = document.getElementById("toggleButton");

//     button.addEventListener("click", toggleDemo);

//     function toggleDemo() {
//         if (isRunning) {
//             window.removeEventListener("deviceorientation", orientationHandler);
//             orientationHandler = null;
//             button.textContent = "Start Demo";
//             button.classList.remove("stop-button");
//             console.log("Gyroscope demo stopped.");
//         } else {
//             if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
//                 DeviceOrientationEvent.requestPermission()
//                     .then((permissionState) => {
//                         if (permissionState === "granted") {
//                             startGyroscope();
//                         } else {
//                             alert("Permission denied.");
//                         }
//                     })
//                     .catch(console.error);
//             } else {
//                 startGyroscope();
//             }

//             button.textContent = "Stop Demo";
//             button.classList.add("stop-button");
//             console.log("Gyroscope demo started.");
//         }
//         isRunning = !isRunning;
//     }

//     function startGyroscope() {
//         orientationHandler = (event) => {
//             const rotateDegrees = event.alpha || 0;
//             const leftToRight = event.gamma || 0;
//             const frontToBack = event.beta || 0;

//             document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
//             document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
//             document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);
//         };

//         window.addEventListener("deviceorientation", orientationHandler, true);
//     }
// });

//10.254.113.215

document.addEventListener("DOMContentLoaded", () => {
    let isRunning = false; // Track the state of the demo
    let orientationHandler; // Reference to the orientation event handler

    // Initialize WebSocket connection
    const socket = new WebSocket("ws://10.254.113.215:8080"); // Replace <YOUR_SERVER_IP> with your server's IP address

    // WebSocket event handlers
    socket.onopen = () => {
        console.log("Connected to WebSocket serve");
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    // Start and stop the demo
    const button = document.getElementById("toggleButton");

    button.addEventListener("click", toggleDemo);

    function toggleDemo() {
        if (isRunning) {
            // Stop collecting gyroscope data
            window.removeEventListener("deviceorientation", orientationHandler);
            orientationHandler = null;
            button.textContent = "Start Demo";
            button.classList.remove("stop-button");
            console.log("Gyroscope demo stopped.");
        } else {
            // Request permissions for iOS
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
                // For non-iOS devices
                startGyroscope();
            }

            button.textContent = "Stop Demo";
            button.classList.add("stop-button");
            console.log("Gyroscope demo started.");
        }
        isRunning = !isRunning;
    }

    function startGyroscope() {
        // Gyroscope data handler
        orientationHandler = (event) => {
            const rotateDegrees = event.alpha || 0; // alpha: rotation around z-axis
            const leftToRight = event.gamma || 0;   // gamma: left-to-right tilt
            const frontToBack = event.beta || 0;    // beta: front-to-back tilt

            // Update gyroscope data in the UI
            document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
            document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
            document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);

            // Send gyroscope data to WebSocket server
            if (socket.readyState === WebSocket.OPEN) {
                const gyroData = {
                    x: frontToBack,
                    y: leftToRight,
                    z: rotateDegrees,
                };
                socket.send(JSON.stringify(gyroData));
                console.log("Sent gyroscope data:", gyroData);
            }
        };

        // Add the event listener
        window.addEventListener("deviceorientation", orientationHandler, true);
    }
});
