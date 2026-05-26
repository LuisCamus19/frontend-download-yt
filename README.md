# 🎨 YouTube Multimedia Converter - Frontend Client

This repository contains the web client for the YouTube Multimedia Converter platform. It delivers a fast, fluid, and 100% ad-free interface built using modern **Angular** architecture to deliver an exceptional user experience on any device.

---

## ⚡ Key Features

- **Minimalist & Clean UI:** Zero pop-ups, zero intrusive ads, pure dark-mode utility focus.
- **Granular State Control:** Powered by modern **Angular Signals** for reactive, ultra-low overhead state handling.
- **Fully Responsive:** Customized CSS layout engineered to adapt dynamically to mobile, tablet, and desktop viewports.
- **Instant Validation:** Built-in client-side URL parsing and immediate error dispatching via custom notification snackbars.

---

## 🛠️ Tech Stack

- **Framework:** Angular (Modern Architecture)
- **State Management:** Angular Signals
- **Styling:** Vanilla CSS3 with semantic variables and responsive grid/flexbox models.

---

## 🚀 Getting Started

### Installation

Install the frontend development dependencies:
npm install

### Development Server

Run a local development server to test structural or style changes:
ng serve
Navigate to http://localhost:4200/ in your browser.

### Production Build

Compile and optimize the single-page application (SPA) assets into static files for deployment:
npm run build --configuration=production
The compiled output will be generated inside the dist/ directory, ready to be served by Nginx or any static hosting solution.

---

## 🔌 API Integration

The client application communicates asynchronously with the decoupled NestJS backend endpoint. Ensure your production environment configuration points to your VPS IP or custom domain where the API is running (Default port: `3000`).
