document.addEventListener("DOMContentLoaded", () => {
    let isRunning = false;
    let orientationHandler;

    const button = document.getElementById("toggleButton");

    // OSC setup
    const udpPort = new osc.UDPPort({
        localAddress: "0.0.0.0",   // IP address of the client (browser) 192:168:70:245
        localPort: 57121,          // Port to listen for incoming OSC messages (optional)
        remoteAddress: "127.0.0.1", // IP address of the OSC server (Unity)
        remotePort: 8000           // Port where Unity is listening
    });

    udpPort.open();

    udpPort.on("ready", () => {
        console.log("OSC UDP Port is ready!");
    });

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

            // Send OSC message
            udpPort.send({
                address: "/gyro",
                args: [
                    { type: "f", value: frontToBack }, // X-axis
                    { type: "f", value: leftToRight }, // Y-axis
                    { type: "f", value: rotateDegrees } // Z-axis
                ]
            });
        };

        window.addEventListener("deviceorientation", orientationHandler, true);
    }
});
