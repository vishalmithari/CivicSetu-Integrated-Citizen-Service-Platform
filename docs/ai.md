# AI Architecture

The AI subsystem provides intelligence to the gateway, separated into a Python microservice to leverage NLP and computer vision libraries.

## 1. AI Service Assistant (RAG)
**Goal:** Help citizens find services, understand eligibility, and gather documents without navigating complex menus.

**Flow:**
1. **Knowledge Base:** JSON/Markdown documents containing service details are indexed.
2. **Citizen Query:** "I need an income certificate for college."
3. **Retrieval:** The service searches the knowledge base for "income certificate", "education".
4. **LLM Generation:** The LLM receives the retrieved context and generates a helpful response with a link to the service.
*Important:* The LLM is instructed strictly to answer *only* based on the retrieved context to prevent hallucinations of government rules.

## 2. Document Intelligence (OCR)
**Goal:** Assist officers by flagging potential mismatches between form data and uploaded documents.

**Flow:**
1. Document is uploaded to the backend.
2. Backend triggers an asynchronous or synchronous call to the AI service with the document link/bytes.
3. Python service uses Tesseract (or similar OCR) to extract text.
4. Basic NLP/regex is used to find Names, Dates, or IDs.
5. The extracted metadata is sent back to the core system and displayed as a "Verification Hint" for the officer.
*(Note: This is an assistive feature, not an authoritative automated approval).*
