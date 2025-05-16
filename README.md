# ESP32 GPS Location Tracker

A real-time GPS location tracker web application that displays device location and alerts from an ESP32 GPS module via MQTT.

## Features

- Live location tracking on a Leaflet map
- ESP32 GPS integration via MQTT
- Simplified interface with coordinate display
- "Get Location" button for manual location requests
- Real-time notifications

## Running on Windows

### Prerequisites

1. **Install Node.js**
   - Download and install from [Node.js website](https://nodejs.org/) (LTS version recommended)
   - This includes npm (Node Package Manager)
   - Verify installation by opening Command Prompt and typing:
     ```
     node --version
     npm --version
     ```

2. **Install Git (Optional)**
   - Download from [Git website](https://git-scm.com/download/win)
   - Install with default settings

### Installation

1. **Download the Project**
   - Either download as a ZIP file and extract, or clone with Git:
     ```
     git clone [repository-url]
     cd [project-folder]
     ```

2. **Install Dependencies**
   - Open Command Prompt in the project directory
   - Run:
     ```
     npm install
     ```

### Running the Application

**For Node.js v20.3.1**
- Use the special Node.js 20 compatibility script:
- Double-click `run-node20.bat` file
- Or run it from Command Prompt:
  ```
  run-node20.bat
  ```

**For Other Node.js Versions (v18+ recommended)**

**Option 1: Using the Batch File**
- Double-click `run-windows.bat` file
- Or run it from Command Prompt:
  ```
  run-windows.bat
  ```

**Option 2: Using PowerShell**
- Right-click `run-windows.ps1` and select "Run with PowerShell"
- Or run it from PowerShell:
  ```
  .\run-windows.ps1
  ```

**Option 3: Manual Run**
- Open Command Prompt in the project directory
- Run:
  ```
  set NODE_ENV=development
  set NODE_OPTIONS=--no-warnings --experimental-modules
  npx tsx server/index.ts
  ```

The application will start and be available at: [http://localhost:5000](http://localhost:5000)

### Troubleshooting Node.js Version Issues

If you encounter errors with Node.js v20.3.1:

1. Update to a newer version of Node.js (v20.10.0+ recommended)
2. Try running with the `--no-warnings` and `--experimental-modules` flags
3. If using PowerShell, ensure execution policy allows running scripts:
   ```
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
4. Make sure TypeScript and tsx are properly installed:
   ```
   npm install -g typescript tsx
   ```

## Connecting Real ESP32 GPS Sensors

### MQTT Configuration

1. **Choose an MQTT Broker**
   - Local: [Mosquitto](https://mosquitto.org/download/)
   - Cloud: [HiveMQ](https://www.hivemq.com/), [CloudMQTT](https://www.cloudmqtt.com/), etc.

2. **Create Environment Variables**
   - Create a file named `.env` in the project root with:
     ```
     MQTT_BROKER_URL=mqtt://your-broker-address
     VITE_MQTT_BROKER_URL=mqtt://your-broker-address
     ```
   - For secure connections, use:
     ```
     MQTT_BROKER_URL=mqtts://your-broker-address
     VITE_MQTT_BROKER_URL=mqtts://your-broker-address
     ```
   - If authentication is required:
     ```
     MQTT_USERNAME=your_username
     MQTT_PASSWORD=your_password
     VITE_MQTT_USERNAME=your_username
     VITE_MQTT_PASSWORD=your_password
     ```

### ESP32 Code Requirements

Your ESP32 device should be programmed to:

1. Connect to WiFi
2. Connect to the MQTT broker
3. Obtain GPS data from GPS module
4. Publish data in the following format:

**Location Topic**: `location_tracker/device/location`
```json
{
  "latitude": 24.8607,
  "longitude": 67.0011,
  "timestamp": 1621234567890,
  "speed": 5.2
}
```

**Status Topic**: `location_tracker/device/status`
```json
{
  "battery": 85,
  "signalStrength": "good",
  "deviceId": "ESP32-GPS-01"
}
```

## Troubleshooting

### Common Issues on Windows

1. **Port Already in Use**
   - If you get an error like "Port 5000 is already in use", try:
     ```
     netstat -ano | findstr :5000
     ```
   - Then kill the process:
     ```
     taskkill /PID [Process-ID] /F
     ```

2. **Environment Variables Not Working**
   - If environment variables aren't set correctly, try modifying the code in `server/index.ts` to explicitly set them:
     ```typescript
     // Add at the top of the file
     process.env.NODE_ENV = process.env.NODE_ENV || 'development';
     ```

3. **MQTT Connection Issues**
   - Check your firewall settings for MQTT ports (typically 1883, 8883)
   - Verify broker address and credentials
   - Try a public test broker like `test.mosquitto.org` for testing

### ESP32 Troubleshooting

1. **GPS Not Getting Signal**
   - Place the GPS module with clear view of the sky
   - Check wiring connections
   - Verify the GPS module is powered correctly
   - Use a GPS status print function to debug

2. **MQTT Not Publishing**
   - Verify WiFi connection
   - Check MQTT broker connectivity
   - Add more debug prints in your code
   - Try publishing to a test topic first
