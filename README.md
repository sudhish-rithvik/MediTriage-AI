# MediTriage AI 🏥🤖

**MediTriage AI** is a next-generation AI-powered healthcare dashboard designed to revolutionize hospital triage systems. It combines **real-time patient data visualization**, **predictive analytics**, and **AI-driven risk assessment** to help medical staff prioritize critical cases instantly.

![MediTriage Dashboard](https://via.placeholder.com/1200x600?text=MediTriage+AI+Dashboard+Preview)

## 🚀 Key Features

*   **⚡ Instant AI Triage:** Uses a **fine-tuned FLAN-T5 LLM** (running on FastAPI) to analyze patient symptoms and vitals, assigning an immediate Risk Score (0-100) and Priority Level.
*   **📊 Live Command Center:** A Cyberpunk-inspired dashboard showing real-time patient queues, department loads, and critical alerts.
*   **🔮 Predictive Deterioration:** Algorithms analyze vital trends to warn staff of patients at risk of crashing within the next hour.
*   **🎙️ Voice-Activated Intake:** Integrated Speech-to-Text allows nurses to dictate patient symptoms hands-free.
*   **🧪 Simulation Mode:** "Demo Magic" mode that simulates a busy ER night with incoming patient streams and critical trauma events.
*   **☁️ Cloud Sync:** Fully integrated with **Supabase** for real-time data persistence across multiple clients/screens.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite):** Blazing fast UI rendering.
*   **Tailwind CSS v4:** Cutting-edge utility-first styling with a custom "Cyber-Medical" dark theme.
*   **Lucide React:** Beautiful, consistent iconography.
*   **Supabase:** Real-time database and backend-as-a-service.

### Backend (Python)
*   **FastAPI:** High-performance async web framework.
*   **HuggingFace Transformers:** Runs the local `google/flan-t5-base` model.
*   **PyTorch:** Deep learning framework for the AI engine.
*   **Uvicorn:** ASGI server for production-ready deployment.

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   Supabase Account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/meditriage-ai.git
cd meditriage-ai
```

### 2. Frontend Setup
```bash
cd meditrage-ai
npm install
npm run dev
```
The frontend will launch at `http://localhost:5173`.

### 3. Backend Setup
Open a new terminal:
```bash
cd meditrage-ai/backend_python
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn torch transformers pydantic

# Run the Server
python main.py
```
The backend API will run at `http://localhost:5000`.

### 4. Database Setup (Supabase)
1.  Create a new Supabase project.
2.  Go to the **SQL Editor** in Supabase dashboard.
3.  Run the contents of `supabase_setup.sql` to create the `patients` table.
4.  Run the contents of `doctors_setup.sql` to create the `doctors` table.
5.  Update `src/supabaseClient.js` with your **Project URL** and **Anon Key**.

## 🎮 Usage Guide

### Triage a Patient
1.  Go to the **Dashboard**.
2.  Enter patient details manually OR click the **Mic** icon to speak.
3.  Click **Assess Patient**.
4.  The AI will generate a risk score and reasoning.
5.  Click **Admit Patient** to save to the live registry.

### Simulation Mode
1.  Go to the **Patients** tab.
2.  Click **🚀 Run Simulation**.
3.  Watch as 5 simulated patients with realistic data are generated and inserted into the system in real-time.

### Managing Records
*   **Sort:** Click column headers (Name, Score, Dept) to sort.
*   **Details:** Click a patient name to see full AI assessment.
*   **Delete:** Use the trash icon or "Clear All" button to manage the list.

## 🧠 AI Model Details

The core of MediTriage is a custom inference engine wrapping `google/flan-t5-base`. It requires natural language input (symptoms + vitals) and outputs a structured JSON containing:
*   **Risk Level:** Low/Medium/High/Critical
*   **Triage Score:** 0-100
*   **Reasoning:** Clinical justification for the score.

## 📄 License
MIT License. Built for the Future of Healthcare.
