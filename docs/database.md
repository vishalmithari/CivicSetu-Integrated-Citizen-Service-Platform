# Database Design (MongoDB)

The application uses MongoDB to allow flexible schemas, particularly for application data and dynamic workflows.

## 1. Users Collection
```json
{
  "_id": "ObjectId",
  "username": "rahul.p",
  "email": "rahul@example.com",
  "passwordHash": "bcrypt_hash",
  "roles": ["ROLE_CITIZEN"],
  "firstName": "Rahul",
  "lastName": "Patil",
  "phone": "9876543210",
  "profileDetails": {
    "address": "...",
    "district": "Kolhapur"
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## 2. Departments Collection
```json
{
  "_id": "ObjectId",
  "departmentCode": "REV",
  "name": "Revenue Department",
  "description": "Handles land, income, and residence certificates",
  "isActive": true
}
```

## 3. Services Collection
```json
{
  "_id": "ObjectId",
  "serviceCode": "SRV_INC_CERT",
  "departmentId": "ObjectId(Revenue)",
  "name": "Income Certificate",
  "description": "Certificate to prove annual income.",
  "category": "Certificates",
  "eligibilityCriteria": ["Resident of Maharashtra", "Valid Aadhaar"],
  "requiredDocuments": [
    { "docType": "ID_PROOF", "name": "Aadhaar Card", "mandatory": true },
    { "docType": "INCOME_PROOF", "name": "Salary Slip / ITR", "mandatory": true }
  ],
  "processingTimeDays": 7,
  "fee": 50,
  "workflowId": "ObjectId(Workflow)",
  "isActive": true
}
```

## 4. Applications Collection
```json
{
  "_id": "ObjectId",
  "applicationNumber": "MH-KOL-2026-0001842",
  "citizenId": "ObjectId(User)",
  "serviceId": "ObjectId(Service)",
  "departmentId": "ObjectId(Department)",
  "status": "DOCUMENT_VERIFICATION",
  "formData": {
    "applicantName": "Rahul Patil",
    "annualIncome": "450000",
    "purpose": "Scholarship"
  },
  "documents": [
    {
      "docId": "ObjectId(Document)",
      "docType": "ID_PROOF",
      "status": "VERIFIED"
    }
  ],
  "assignedOfficerId": "ObjectId(Officer)",
  "timeline": [
    {
      "status": "SUBMITTED",
      "timestamp": "ISODate",
      "actorId": "ObjectId(User)",
      "remarks": "Application submitted by citizen."
    }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## 5. Workflows Collection
```json
{
  "_id": "ObjectId",
  "name": "Standard Certificate Workflow",
  "states": ["SUBMITTED", "DOCUMENT_VERIFICATION", "OFFICER_REVIEW", "APPROVED", "REJECTED", "CORRECTION_REQUIRED", "COMPLETED"],
  "transitions": [
    { "from": "SUBMITTED", "to": "DOCUMENT_VERIFICATION", "allowedRoles": ["ROLE_SYSTEM", "ROLE_OFFICER"] },
    { "from": "DOCUMENT_VERIFICATION", "to": "OFFICER_REVIEW", "allowedRoles": ["ROLE_OFFICER"] },
    { "from": "DOCUMENT_VERIFICATION", "to": "CORRECTION_REQUIRED", "allowedRoles": ["ROLE_OFFICER"] }
  ]
}
```

## 6. Audit Logs Collection
```json
{
  "_id": "ObjectId",
  "actorId": "ObjectId(User)",
  "role": "ROLE_OFFICER",
  "action": "UPDATE_STATUS",
  "resourceType": "APPLICATION",
  "resourceId": "ObjectId(Application)",
  "details": "Changed status from SUBMITTED to DOCUMENT_VERIFICATION",
  "ipAddress": "192.168.1.10",
  "timestamp": "ISODate"
}
```
