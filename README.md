# EcoSense
<img width="2787" height="1602" alt="image" src="https://github.com/user-attachments/assets/0d5383b9-c70c-47f5-993b-c97e83e451e8" />

---
Traditional irrigation wastes up to 50% of water due to blind scheduling and human error. That's a massive drain on resources. We built **EcoSense** to fix that. 

EcoSense is an advanced IoT-based environmental monitoring and smart water conservation system. It doesn't just guess when to water; it reads the room (or rather, the soil). By constantly parsing real-time telemetry from the dirt and the air around it, the system makes autonomous decisions to conserve water and protect environmental health. 

We've hooked this up to a custom web dashboard that pulls live hardware data so you can see exactly what your ecosystem is doing, right from your browser. 

## What It Actually Does

* **Smart Irrigation Logic:** It reads the soil's dry-out curve. When moisture drops below a critical threshold, it triggers a 5V relay to fire up the submersible pump. Exactly the right amount of water, exactly when needed.
* **Environmental Telemetry:** The onboard MQ-135 sensor is constantly sniffing the air for particulate spikes and harmful gases. It's an early warning system for your lungs.
* **Live Web Dashboard:** A sleek, dark/light mode UI built with vanilla JS that polls a local JSON endpoint to simulate/reflect the live hardware states.

## Tech Stack & Hardware

**Hardware:**
* **Arduino UNO** (The brain of the operation, ATmega328P)
* **Soil Moisture Sensor** (Analog/Digital resistance mapping)
* **MQ-135 Gas Sensor** (10-1000ppm broad-spectrum gas detection)
* **16x2 LCD Display** (I2C Protocol for onboard metrics)
* **5V Relay Module & Submersible Pump** (The muscle)

**Software / Frontend:**
* C++ (Arduino IDE for the microcontroller logic)
* HTML5 / CSS3 (Grid/Flexbox architecture, responsive design)
* Vanilla JavaScript (Web Serial API ready, JSON polling, DOM manipulation)

## Getting Started

### 1. The Hardware Deployment
1. Wire the sensors to the Arduino UNO analog pins (e.g., A0 for Moisture, A1 for MQ-135).
2. Connect the 5V Relay to a digital out pin (e.g., D8) and wire it in-line with the submersible pump power supply. 
3. Flash the C++ logic to the board via Arduino IDE. Ensure the Serial Monitor is printing data in the format: `Moisture,AQI,PumpStatus`.

### 2. The Frontend Dashboard
Because the JavaScript uses the `fetch()` API to poll the `data.json` endpoint, you can't just double-click the `index.html` file. You need a local server.
1. Clone this repo.
2. Open the folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server**.

*Note: The current `script.js` is set up to poll `data.json` every 3 seconds. To bridge the physical hardware to the web UI, you can easily swap the `fetch()` logic for the Web Serial API snippet to read the Arduino's COM port directly.*

## Real World Impact

We didn't just build this for a desktop toy. The logic scales:
* **Agriculture:** Prevents massive freshwater waste and optimizes crop yields by bypassing scheduled human error.
* **Smart Cities:** Integrates into municipal infrastructure to track roadside pollution and trigger automated misting systems for smog.
* **Hospitals:** Monitors sensitive zones (like ICUs) for particulate spikes, integrating directly with HVAC systems.

## Developed By

* **Prabhat Bhatia**
* **Yathartha Bhatia**
---
*Engineered for a sustainable, data-driven tomorrow.*
