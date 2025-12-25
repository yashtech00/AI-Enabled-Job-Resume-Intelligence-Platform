# AI-Enabled Job Resume Intelligence Platform

A full-stack web application to upload resumes, manage job descriptions, and use LLM-powered analysis to match/rank resumes for jobs and chat about a resume.

## Tech Stack

- **Frontend**: React (Create React App), React Router, Axios, TailwindCSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI/LLM**: LangChain, Groq (ChatGroq), Hugging Face Inference Embeddings

## Key Features

- **Resume management**
  - Upload resume (PDF) and store metadata in MongoDB
  - List, fetch, download, and delete resumes
- **Job management**
  - Create jobs and fetch job listings/details
  - Scrape jobs (backend endpoint available)
- **AI matching & ranking**
  - Analyze a resume against a job
  - Rank multiple resumes for a job
  - View matches per job and delete match records
- **Resume chat**
  - Start conversations, send messages, fetch history, clear/delete conversations

## Repository Structure

```
.
├── backend
│   ├── index.js
│   ├── package.json
│   └── src
│       ├── config
│       ├── controller
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── services
│       └── validation
└── frontend
    ├── package.json
    ├── public
    └── src
        ├── api
        ├── components
        └── pages
```

## Backend API

Base URL (default): `http://localhost:5000/api`

### Job Routes (`/api/job`)

- `POST /create-job`
- `POST /scrape-jobs`
- `GET /get-all-jobs`
- `GET /get-job-by-id/:jobId`

### Match Routes (`/api/match`)

- `POST /analyze-resume`
- `POST /rank-resume`
- `GET /job/:jobId`
- `DELETE /delete-match/:id`

### Chat Routes (`/api/chat`)

- `POST /start-conversation`
- `POST /send-message`
- `GET /get-conversation/:conversationId`
- `POST /clear/:conversationId`
- `GET /conversations/user/:userId`
- `DELETE /delete-conversation/:conversationId`

### Resume Routes (`/api/resume`)

- `POST /upload` (multipart form-data, field name: `resume`)
- `GET /get-resumes`
- `GET /get-resume-by-id/:resumeId`
- `GET /download/:resumeId`
- `DELETE /delete-resume/:resumeId`

## Local Setup

### Prerequisites

- Node.js (LTS recommended)
- MongoDB connection string (local or Atlas)
- Groq API key
- Hugging Face API key

### 1) Backend

Create a `backend/.env` file:

```bash
# Server
PORT=5000

# Database (either works)
MONGODB_URI=mongodb://127.0.0.1:27017/ai_resume
# MONGO_URI=mongodb://127.0.0.1:27017/ai_resume

# AI providers
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

Backend will start on: `http://localhost:5000`

### 2) Frontend

Create a `frontend/.env` file:

```bash
REACT_APP_BASE_URL=http://localhost:5000/api
```

Install and run:

```bash
cd frontend
npm install
npm start
```

Frontend will start on: `http://localhost:3000`

## NPM Scripts

### Backend (`/backend/package.json`)

- `npm run dev` - start with nodemon
- `npm start` - start server

### Frontend (`/frontend/package.json`)

- `npm start` - start dev server
- `npm run build` - production build
- `npm test` - tests

## Notes

- Keep `.env` files out of git. Add `.env.example` files if you want to share required variables without secrets.
- If you change the backend port, update `REACT_APP_BASE_URL` accordingly.



https://github.com/user-attachments/assets/99852880-f077-4761-aee6-cff537bb02b8


