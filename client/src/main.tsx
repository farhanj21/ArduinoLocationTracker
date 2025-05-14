import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the document title
document.title = "GPS Location Tracker";

// Add meta description for SEO
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Real-time GPS location tracking application with geofencing capabilities and anomaly detection for accurate device monitoring.";
document.head.appendChild(metaDescription);

// Add Open Graph tags for better social sharing
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("property", "og:title");
ogTitle.content = "GPS Location Tracker";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.setAttribute("property", "og:description");
ogDescription.content = "Real-time GPS location tracking application with geofencing capabilities and anomaly detection for accurate device monitoring.";
document.head.appendChild(ogDescription);

// Add Material Icons
const materialIcons = document.createElement("link");
materialIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
materialIcons.rel = "stylesheet";
document.head.appendChild(materialIcons);

// Add Roboto font
const robotoFont = document.createElement("link");
robotoFont.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
robotoFont.rel = "stylesheet";
document.head.appendChild(robotoFont);

createRoot(document.getElementById("root")!).render(<App />);
