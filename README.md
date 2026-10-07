# CivicSetu – Integrated Citizen Service Platform

**"One Gateway. Multiple Government Services. One Citizen Experience."**

## Project Information
- **Project Duration:** January 2026 – April 2026
- **Status:** Completed

## 1. Project Overview
CivicSetu was successfully developed and completed as a final-year B.Tech project addressing the Smart India Hackathon problem statement **SIH26129** (System Integration and Interoperability Among Government Digital Platforms). It is a unified citizen-facing gateway that integrates multiple government departments, services, workflows, and APIs to provide a seamless citizen experience.

## 2. SIH Problem Context
Citizens previously navigated a fragmented digital landscape, struggling to find the right portal, understand required documents, and track applications across different government departments. CivicSetu solves this by acting as a single entry point and intelligent orchestrator.

## 3. Features
- **Unified Citizen Dashboard:** Track applications across all departments.
- **AI-Assisted Service Discovery:** RAG-based AI to help citizens find services and requirements.
- **Configurable Workflows:** Flexible workflow engine for diverse department processes.
- **Interoperability Layer:** Adapter pattern for communicating with various department APIs.
- **Document Management & AI OCR:** Secure upload and AI-assisted document pre-verification.
- **Role-Based Access Control:** Distinct roles for Citizens, Officers, Department Admins, and Super Admins.
- **Analytics & SLA Monitoring:** Dashboards for tracking application processing times and bottlenecks.
- **Audit Logging:** Traceability for all critical system actions.

## 4. Architecture
See [Architecture Document](docs/architecture.md) for details.
- **Frontend:** React.js, Bootstrap
- **Backend:** Spring Boot, Spring Security (JWT)
- **Database:** MongoDB
- **AI Service:** Python, FastAPI, RAG/OCR

## 5. Technology Stack
- **Frontend:** React, React Router, Axios, CSS3, Bootstrap, Chart.js
- **Backend:** Java 17+, Spring Boot 3, Spring Data MongoDB, Maven
- **AI:** Python 3.10+, FastAPI, LangChain/LlamaIndex (for RAG), Tesseract/EasyOCR
- **Infra:** Docker, Docker Compose, Git

## 6. Folder Structure
```
CivicSetu/
├── frontend/          # React UI
├── backend/           # Spring Boot application
├── ai-service/        # Python FastAPI service
├── docs/              # Project documentation
├── docker-compose.yml # Local deployment
└── README.md
```

## 7. Database Design
See [Database Document](docs/database.md).

## 8. API Documentation
See [API Document](docs/api.md).

## 9. Authentication
Stateless authentication using JSON Web Tokens (JWT). Roles include `ROLE_CITIZEN`, `ROLE_OFFICER`, `ROLE_DEPT_ADMIN`, `ROLE_SUPER_ADMIN`.

## 10. AI Architecture
See [AI Document](docs/ai.md).

## 11. Interoperability Architecture
See [Interoperability Document](docs/interoperability.md).

## 12. Setup Instructions
*(To be detailed after implementation)*

## 13. Environment Variables
*(To be detailed after implementation)*

## 14. Docker Instructions
*(To be detailed after implementation)*

## 15. Demo Credentials
*(To be detailed after implementation)*

## 16. Testing
*(To be detailed after implementation)*

## 17. Future Scope
- Real API integrations (e.g., DigiLocker, e-Pramaan).
- WhatsApp/SMS integration for notifications.
- Multilingual support using dynamic translation services.
- GIS mapping for regional service availability.
