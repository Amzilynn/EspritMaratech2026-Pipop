#  Association Omnia - Humanitarian Intelligence Platform

Omnia is a modern, full-stack platform designed for a Tunisian humanitarian association. It aims to bridge the gap between financial support and moral assistance for underprivileged families, the elderly, and people with reduced mobility.

##  Project Architecture

The platform is built using a modern microservice-style architecture:

### 1. Frontend (Vue.js 3)
*   **Front Office**: A high-contrast, ultra-accessible public website for members and donors. Integrated with a custom AI Voice Assistant (TTS) and biometric Face ID login.
*   **Back Office (Admin Dashboard)**: A powerful interface for administrators and field managers to track beneficiaries, visits, and aid distribution.

### 2.  Backend (NestJS)
*   Built with **TypeScript** and **Node.js**.
*   **Database**: PostgreSQL with TypeORM for robust data management.
*   **Authentication**: Multi-modal (JWT + Biometric Face ID integration).
*   **Integration**: Connects directly with the ML service for intelligent scoring and OCR.

### 3.  ML Service (FastAPI)
*   **Vulnerability Scoring**: Custom algorithm to prioritize aid based on economic, health, and social factors.
*   **OCR Scanner**: Medical prescription extraction using EasyOCR.
*   **Face Recognition**: Biometric identity verification using VGG-Face models.

## 🌟 Key Features

*   ** Accessibility First**: Built to WCAG standards with a built-in Voice Assistant that provides spoken descriptions and visual feedback (pulsing animations).
*   ** Medical OCR**: Users can scan their medical prescriptions; the system automatically extracts the text and maintains a digital history.
*   ** Biometric Face ID**: Register and log in using your face. The ML service handles 2622-dimension vector matching for high accuracy.
*   ** Predictive Dashboard**: Administrators can see future needs and potential crises before they happen using AI-driven insights.
*   ** Modern Design**: A premium "Omnia Design System" with consistent styling, smooth animations, and a focus on visual excellence.

##  Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   PostgreSQL
*   npm / yarn

### Running the Project

#### 1. Backend
```bash
cd backend/omnia-backend
npm install
npm run start:dev
```


#### 2. ML Service
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```


#### 3. Front Office
```bash
cd frontend/frontoffice
npm install
npm run dev
```


#### 4. Back Office
```bash
cd frontend/backoffice
npm install
npm run dev
```

