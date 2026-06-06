# 🏛️ HORUS: Virtual Egyptian Museum

An interactive web and mobile 3D experience showcasing Ancient Egyptian history. It features a Next.js frontend, Python Flask API, SQLite database, an interactive RAG guide named **Horus**, a hieroglyphics cartouche builder, and a Unity 3D WebGL tour running directly in the browser or on mobile devices (no VR headsets or special equipment required).

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)

### Run with Docker Compose
To build and run both the Next.js frontend and the Flask backend in containers:
```bash
docker compose up -d --build
```
Access the museum at [http://localhost:8080](http://localhost:8080)

### Run in Local Development
1. **Flask Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   Backend will run on [http://localhost:5000](http://localhost:5000)

2. **Next.js Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on [http://localhost:3000](http://localhost:3000)

---

## 👑 Main Features

- **Interactive 3D Virtual Tour**: Navigate 8 historic Stops (from the Temple of Horus at Edfu to Tutankhamun's sanctuary) directly in your browser or phone.
- **RAG Chatbot (Horus)**: Speak with your AI guide in real-time about Egyptian history, column architectures, and mythological symbolism.
- **Library of Kings**: Explore detailed biographies, dynasties, achievements, and YouTube documentaries for key Pharaohs.
- **Hieroglyphics Cartouche**: Write your name in English and generate/download a personalized Egyptian Royal Cartouche.
- **Royal Admin Panel**: Secured with an `HttpOnly` security cookie passcode gate for managing the museum records.
- **API Documentation**: Access the interactive Swagger API documentation at `/docs`.

---

## 📁 Project Structure

- `frontend/`: Primary Next.js web application (React, Tailwind CSS, Framer Motion).
- `backend/`: Python Flask API serving eras and kings records, with a seeded SQLite database (`museum.db`).
- `rag/`: GCP Terraform configurations and RAG document corpus supporting the AI chatbot.
