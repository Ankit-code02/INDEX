# INDEX — AI Document Intelligence

> A document intelligence workspace that turns uploaded PDFs into searchable, understandable information using semantic retrieval and AI-powered question answering.

INDEX is a full-stack application for uploading PDF documents, extracting their text, generating summaries, searching by meaning, and asking questions grounded in relevant document content.

## Features

- **PDF library** — Upload PDFs and view documents stored by the application.
- **Text extraction** — Extract text from PDF files for downstream processing.
- **AI summaries** — Generate concise summaries with a language model.
- **Semantic search** — Retrieve documents by meaning rather than relying only on exact keyword matches.
- **Document Q&A** — Ask questions in natural language and receive answers with source-document references.
- **Responsive workspace** — A React interface for Overview, Documents, Smart Search, and Ask Documents.

## Product areas

| Area | Purpose |
|---|---|
| Overview | Introduces the workspace and its core capabilities |
| Documents | Upload PDFs, extract text, and request summaries |
| Smart Search | Search document content using natural-language queries |
| Ask Documents | Ask questions and review answers with source references |

_Add screenshots of the Overview, Documents, Smart Search, and Ask Documents pages here before publishing the repository._

## Technology stack

**Frontend**
- React, TypeScript, Vite
- React Router
- Lucide React
- CSS

**Backend**
- Java 21
- Spring Boot REST APIs
- Spring Data JPA
- PostgreSQL
- Apache PDFBox
- Ollama integration

**AI and retrieval**
- `nomic-embed-text` for embeddings in local development
- `llama3.2` for local language-model generation
- Embeddings persisted as JSON in PostgreSQL
- Similarity-based semantic retrieval
- Retrieval-augmented question answering (RAG-style workflow)

## Architecture

```text
React + TypeScript (Vite)
          |
          | HTTP / JSON
          v
Spring Boot REST API
    |       |        |
    |       |        +---- Ollama (embeddings and text generation)
    |       |
    |       +------------- Apache PDFBox (PDF text extraction)
    |
    +--------------------- PostgreSQL (metadata, extracted text,
                                             embedding JSON)
```

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Basic API health check |
| `GET` | `/actuator/health` | Spring Boot Actuator health endpoint |
| `POST` | `/api/documents/upload` | Upload a PDF |
| `GET` | `/api/documents` | List documents |
| `GET` | `/api/documents/{id}` | Retrieve document metadata |
| `POST` | `/api/documents/{id}/extract` | Extract PDF text and generate an embedding |
| `POST` | `/api/documents/{id}/summarize` | Generate a document summary |
| `GET` | `/api/documents/search?keyword=...` | Search by filename/keyword |
| `GET` | `/api/documents/search/content?keyword=...` | Search extracted content by keyword |
| `GET` | `/api/documents/search/semantic?query=...` | Search by semantic similarity |
| `POST` | `/api/qa/ask` | Ask a question against retrieved document content |

Request and response details may evolve as the API is hardened for deployment.

## Run locally

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js and npm
- PostgreSQL
- Ollama

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Document-Intelligence
```

Expected project layout:

```text
AI-Document-Intelligence/
├── document-intelligence-backend/
│   ├── pom.xml
│   └── src/
└── document-intelligence-frontend/
    ├── package.json
    └── src/
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `document_intelligence`. Set credentials in your terminal; do not commit them.

**Windows PowerShell:**

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/document_intelligence"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = Read-Host "Enter your PostgreSQL password"
```

### 3. Start Ollama

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

Ensure the Ollama service is running at `http://localhost:11434`.

### 4. Start the backend

```powershell
cd document-intelligence-backend
mvn spring-boot:run
```

The backend uses port `8080` locally. Check `http://localhost:8080/api/health`.

### 5. Start the frontend

In a second terminal:

```powershell
cd document-intelligence-frontend
npm install
```

Create `document-intelligence-frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

Then run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Build the frontend with:

```bash
npm run build
```

## Configuration

### Backend environment variables

| Variable | Purpose |
|---|---|
| `DB_URL` | JDBC URL; local default is `jdbc:postgresql://localhost:5432/document_intelligence` |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `PORT` | Hosting-platform port, if the backend is configured to use it |

### Frontend environment variable

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot API |

Vite variables prefixed with `VITE_` are exposed to the browser. Never put secrets in frontend environment variables.

## Current limitations and deployment notes

- **Local AI dependency:** Local development uses Ollama. A deployed backend needs network access to its model service or must be adapted to a hosted model API.
- **File persistence:** PDFs are currently stored on the backend filesystem. Some free hosting services use ephemeral filesystems; persistent object storage or a compatible persistent disk is needed before relying on uploaded files in a public deployment.
- **Database migrations:** The local setup uses JPA schema generation. A production deployment should use managed schema migrations and review database settings.
- **Security:** Add authentication and authorization before exposing private document data publicly. Validate file contents and sizes, restrict CORS to the deployed frontend origin, and keep secrets in hosting-provider environment settings.
- **Free-tier constraints:** Free services may sleep, have usage limits, or change their terms. Treat a free deployment as a demo rather than a production availability guarantee.
- **AI accuracy:** Generated answers can be incomplete or incorrect. Review source documents for important decisions.

## Development status

Implemented and tested locally:
- PDF upload and document listing
- PDF text extraction
- Embedding generation and persistence
- Keyword and semantic search
- AI-generated document summaries
- Question answering with source-document references
- React production build

Deployment hardening, public file persistence, production AI connectivity, and security review remain necessary before treating the application as production-ready.

## Roadmap

- [ ] Add document detail and extracted-text preview
- [ ] Improve API error handling and observability
- [ ] Add authentication and access control
- [ ] Add persistent object storage for uploaded PDFs
- [ ] Configure a production-capable AI provider
- [ ] Add automated backend and frontend tests
- [ ] Deploy the frontend, API, and database
- [ ] Add final screenshots and a live demo URL

## License

Choose and add a license before distributing this project publicly. Until a license is added, do not assume others have permission to reuse or redistribute the code.
