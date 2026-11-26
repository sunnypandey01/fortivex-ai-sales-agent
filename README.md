
# Fortivex AI Sales Agent

An AI-powered sales assistant designed to automate customer interactions, capture potential leads, qualify prospects, and schedule consultations.

## Features

- **AI Sales Chatbot:** Handles natural-language customer conversations using Groq.
- **Lead Capture:** Extracts customer names, email addresses, phone numbers, and business requirements.
- **Lead Qualification:** Classifies leads based on customer interest and requirements.
- **Voice Interaction:** Supports speech-to-text input and text-to-speech responses.
- **Appointment Scheduling:** Allows customers to schedule consultations through the chatbot or dashboard.
- **Lead Management Dashboard:** Displays customer leads and their qualification status.
- **Appointment Dashboard:** Displays scheduled consultations.

## Tech Stack

### Frontend
- React
- Vite
- CSS
- Lucide React
- React Markdown
- Web Speech API

### Backend
- Node.js
- Express.js
- Groq API
- MongoDB
- Mongoose

## Architecture

```text
Customer
   |
   v
React Frontend
   |
   v
Express.js Backend
   |
   +------> Groq API
   |          |
   |          v
   |      AI Responses
   |      Lead Extraction
   |
   v
MongoDB Atlas
   |
   +------> Leads
   |
   +------> Appointments
```

## Project Structure

```text
fortivex-sales-agent/
├── architecture/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── server.js
├── docs/
├── frontend/
│   └── src/
│       ├── services/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sunnypandey01/fortivex-ai-sales-agent.git
cd fortivex-ai-sales-agent
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5002
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
node src/server.js
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

## Environment Variables

Never commit API keys, database credentials, or `.env` files to GitHub.

## Future Enhancements

- Retrieval-Augmented Generation (RAG) for company-specific knowledge.
- Vector database integration.
- Automated follow-up workflows.
- Calendar integration and appointment availability checks.
- Advanced lead analytics.

## Author

**Sunny Pandey**

- GitHub: [sunnypandey01](https://github.com/sunnypandey01)
- LinkedIn: [sunny-kumar-pandey](https://www.linkedin.com/in/sunny-kumar-pandey/)

---

Developed as an AI-powered sales automation MVP.
