# API Documentation

## Auth Controller (`/api/auth`)
- `POST /register`: Register a new citizen.
- `POST /login`: Authenticate and return JWT.

## User Controller (`/api/users`)
- `GET /me`: Get current user profile.
- `PUT /me`: Update profile.

## Service Controller (`/api/services`)
- `GET /`: List all active services (paginated/filterable).
- `GET /{id}`: Get service details.
- `GET /departments/{deptId}`: Get services by department.
- `GET /search?q=query`: Search services.

## Application Controller (`/api/applications`)
- `POST /`: Submit a new application.
- `GET /{id}`: Get application details (secured by ownership/role).
- `GET /my`: Get applications for logged-in citizen.
- `GET /department`: Get applications for officer's department.
- `PUT /{id}/status`: Update application status (triggers workflow transition).
- `POST /{id}/remarks`: Add a remark to the timeline.

## Document Controller (`/api/documents`)
- `POST /upload`: Upload a document (multipart/form-data).
- `GET /{id}`: Download/view document.
- `PUT /{id}/verify`: Update document status (Officer only).

## Integration Controller (`/api/integrations`)
- `GET /departments`: List available department adapters.
- `POST /{deptCode}/sync`: Trigger manual sync with department API.

## AI Controller (`/api/ai`)
- `POST /ask`: Chat with the service discovery AI.
- `POST /ocr`: Trigger document analysis on an uploaded document.

## Analytics Controller (`/api/analytics`)
- `GET /dashboard/admin`: Get system-wide stats.
- `GET /dashboard/department/{deptId}`: Get department-specific stats.
