// let isRunning = false; // Track the state of the demo

// function toggleDemo() {
//     const button = document.getElementById("toggleButton");

//     if (isRunning) {
//         // Stop the demo
//         window.removeEventListener("deviceorientation", handleOrientationEvent);
//         button.textContent = "Start Demo";
//         button.classList.remove("stop-button");
//         button.classList.add("start-button");
//         console.log("Gyroscope demo stopped.");
//     } else {
//         // Request permissions for iOS
//         if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
//             DeviceOrientationEvent.requestPermission()
//                 .then((permissionState) => {
//                     if (permissionState === "granted") {
//                         startGyroscope();
//                     } else {
//                         alert("Permission to access device orientation was denied.");
//                     }
//                 })
//                 .catch(console.error);
//         } else {
//             // Non-iOS devices
//             startGyroscope();
//         }

//         button.textContent = "Stop Demo";
//         button.classList.remove("start-button");
//         button.classList.add("stop-button");
//         console.log("Gyroscope demo started.");
//     }

//     isRunning = !isRunning; // Toggle the running state
// }

// function startGyroscope() {
//     // Add the device orientation event listener
//     window.addEventListener("deviceorientation", handleOrientationEvent, true);
// }

// function handleOrientationEvent(event) {
//     const rotateDegrees = event.alpha || 0; // alpha: rotation around z-axis
//     const leftToRight = event.gamma || 0;   // gamma: left-to-right tilt
//     const frontToBack = event.beta || 0;   // beta: front-to-back tilt

//     // Update gyroscope data in the UI
//     document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
//     document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
//     document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);
// }

// Initialize WebSocket connection
const socket = new WebSocket("ws://localhost:8080"); // Replace localhost with the actual WebSocket server address if needed

// WebSocket Event Handlers
socket.onopen = () => {
    console.log("WebSocket connection established");
};

socket.onclose = () => {
    console.log("WebSocket connection closed");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// Global Variable to Track State
let isRunning = false;

// Toggle Gyroscope Demo
function toggleDemo() {
    const button = document.getElementById("toggleButton");

    if (isRunning) {
        // Stop the demo
        window.removeEventListener("deviceorientation", handleOrientationEvent);
        button.textContent = "Start Demo";
        button.classList.remove("stop-button");
        button.classList.add("start-button");
        console.log("Gyroscope demo stopped.");
    } else {
        // Request permissions for iOS
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === "granted") {
                        startGyroscope();
                    } else {
                        alert("Permission to access device orientation was denied.");
                    }
                })
                .catch(console.error);
        } else {
            // For non-iOS devices
            startGyroscope();
        }

        button.textContent = "Stop Demo";
        button.classList.remove("start-button");
        button.classList.add("stop-button");
        console.log("Gyroscope demo started.");
    }

    isRunning = !isRunning; // Toggle the running state
}

// Start Gyroscope
function startGyroscope() {
    // Add the device orientation event listener
    window.addEventListener("deviceorientation", handleOrientationEvent, true);
}

// Handle Device Orientation Event (Update UI)
function handleOrientationEvent(event) {
    const rotateDegrees = event.alpha || 0; // alpha: rotation around z-axis
    const leftToRight = event.gamma || 0;   // gamma: left-to-right tilt
    const frontToBack = event.beta || 0;   // beta: front-to-back tilt

    // Update gyroscope data in the UI
    document.getElementById("gyroX").textContent = frontToBack.toFixed(2);
    document.getElementById("gyroY").textContent = leftToRight.toFixed(2);
    document.getElementById("gyroZ").textContent = rotateDegrees.toFixed(2);

    // Send gyroscope data to WebSocket
    if (socket.readyState === WebSocket.OPEN) {
        const gyroData = {
            x: frontToBack,
            y: leftToRight,
            z: rotateDegrees,
        };

        // Send the gyroscope data as a JSON string
        socket.send(JSON.stringify(gyroData));
        console.log("Sent gyroscope data:", gyroData);
    }
}