# Architecture Overview

## 1. High-Level System Architecture

The MahaSeva system follows a microservices-inspired monolithic core architecture with a separate AI service, designed for clear separation of concerns and future scalability.

```mermaid
graph TD
    Client[Citizen / Officer Web App (React)]
    API_Gateway[API Gateway / Load Balancer (Optional/Nginx)]
    
    subgraph MahaSeva Core System
        Core[Spring Boot Backend]
        Auth[Auth & Security Module]
        Workflow[Workflow Engine]
        Integration[Interoperability Adapters]
    end
    
    subgraph AI Subsystem
        AI[Python FastAPI Service]
        RAG[Knowledge Base]
        OCR[Document Intelligence]
    end
    
    subgraph Storage
        DB[(MongoDB)]
        FileStore[Secure Document Storage]
    end
    
    subgraph External Systems (Mocked)
        Revenue[Revenue Dept API]
        Municipal[Municipal Dept API]
        Agri[Agriculture Dept API]
    end

    Client -->|REST/JSON| API_Gateway
    API_Gateway --> Core
    API_Gateway --> Auth
    Core --> Workflow
    Core --> Integration
    Core --> DB
    Core --> FileStore
    
    Core -->|REST| AI
    AI --> RAG
    AI --> OCR
    
    Integration --> Revenue
    Integration --> Municipal
    Integration --> Agri
```

## 2. Component Responsibilities

### React Frontend
- Handles UI rendering, state management (Context/Redux), routing, and user interactions.
- Uses Axios for API calls with JWT interception.

### Spring Boot Backend (Core)
- **Controllers:** Handle HTTP requests and DTO validation.
- **Services:** Business logic implementation.
- **Workflow Engine:** Validates and executes state transitions for applications.
- **Interoperability Layer:** Adapter interfaces connecting to specific department systems.
- **Security:** JWT generation, validation, and role-based endpoint protection.

### Python AI Service
- Exposes REST endpoints for the core backend.
- **Service Discovery:** Uses RAG to answer citizen queries based on a structured JSON/Markdown knowledge base.
- **Document Intelligence:** Extracts text from uploaded documents (OCR) and performs basic entity matching (e.g., matching name on form vs name on document).

### MongoDB
- Flexible document schema is well-suited for dynamic application forms, workflow histories, and diverse service metadata.
