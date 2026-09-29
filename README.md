# Urban Pulse Dashboard

### AI-Powered Mobile Urban Intelligence Platform

**Urban Pulse** is a Smart India Hackathon (SIH) prototype that transforms existing public-transport buses into **mobile AI sensing units** by combining their road-facing cameras with GPS data associated with each bus and edge intelligence.

As buses move through the city, the platform is designed to continuously detect visible **road, traffic, and safety conditions** and convert them into structured **Urban Event Objects** containing:

> **Event Type · Location · Timestamp · Bus ID · Route ID · Confidence · Severity · Evidence**

The dashboard provides a centralized view of these events and road-condition intelligence, enabling validated observations to feed into **maintenance, safety, and hazard-response workflows**.

---

## 🚍 How It Works

Urban Pulse is built around a simple pipeline:

**Existing Public Buses**
↓
**Road-Facing Cameras + GPS + Edge Intelligence**
↓
**Urban Condition Detection**
↓
**Structured Urban Event Objects**
↓
**Multi-Bus Validation**
↓
**Road Intelligence & Response Workflows**

### Core Principles

* **Observe wherever the fleet travels**
  Roads are observed as buses follow their normal routes instead of relying only on inspection vehicles or public complaints.

* **Turn video into actionable intelligence**
  Video is not the final output. Observations are converted into structured events that can be searched, mapped, prioritized, and acted upon.

* **Validate before escalation**
  Repeated observations from independent buses increase confidence while helping suppress false positives and duplicate reports.

* **Move from detection to decision**
  Validated events continuously update road-condition intelligence and feed into maintenance, safety, and hazard-response workflows.

---

## 🖥️ Current MVP

The current prototype focuses on a **single desktop dashboard** for demonstrating the intended urban-intelligence interface.

### Dashboard Features

* System status indicator
* KPI overview:

  * Active Buses
  * Active Events
  * Critical Events
  * Confirmed Events
  * Road Health
* Interactive Delhi-focused map
* Mock road-condition segments
* Road-health visualization using condition-based colors:

  * 🟢 Healthy
  * 🟡 Attention
  * 🟠 Poor
  * 🔴 Critical
* Mock urban event markers
* Event detail cards containing:

  * Event Type
  * Severity
  * Confidence
  * Bus ID
  * Route ID
  * Timestamp
  * Latitude
  * Longitude
* Layer controls for:

  * Road Health
  * Traffic
  * Safety
  * Waterlogging
  * Buses
* Presentation-ready dashboard interface

> **Note:** The current MVP uses mock data to demonstrate the intended user experience and system workflow.

---

## 🏗️ Tech Stack

* **React**
* **TypeScript**
* **Tailwind CSS**
* **Leaflet / React Leaflet**
* **Vite**
* **Mock data for the current MVP**

---

## 📁 Project Scope

This repository currently contains the **frontend dashboard prototype**.

The following are intentionally **not implemented in the current MVP**:

* Backend services
* Authentication
* Database
* Production APIs
* AI inference
* Google Maps API
* MQTT integration
* Advanced analytics
* Multi-page application architecture
* Live bus/GPS feeds

The prototype prioritizes a **working, reliable, presentation-ready frontend** while keeping the architecture open for future integration.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* [Node.js](https://nodejs.org/)
* npm

### Installation

Clone the repository:

```bash
git clone <this-repository-url>
cd <repository-name>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## 🌐 Live Prototype

**Live App:** https://city-vista-ui.lovable.app

---

## 🎯 SIH Prototype

**Project:** Urban Pulse
**Use Case:** Mobile urban sensing and road-condition intelligence
**Platform:** Public-transport buses as mobile sensing units
**Current Stage:** Frontend MVP / Demonstration Prototype

The prototype demonstrates how existing public-transport infrastructure can serve as a **distributed sensing layer for urban road, traffic, and safety intelligence**.
