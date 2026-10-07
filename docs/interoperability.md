# Interoperability Architecture

The primary goal of MahaSeva is to unify access to disparate government systems. This is achieved through the **Adapter Pattern**.

## The Integration Layer

The Spring Boot backend contains an `IntegrationService` which acts as a facade.

### `DepartmentIntegrationAdapter` Interface
```java
public interface DepartmentIntegrationAdapter {
    String getDepartmentCode();
    
    IntegrationResponse submitApplication(Application application);
    
    IntegrationStatus checkStatus(String externalReferenceId);
    
    byte[] downloadResultDocument(String externalReferenceId);
}
```

### Mock Implementations
For the prototype, we implement mock adapters:
- `RevenueDepartmentMockAdapter`
- `MunicipalMockAdapter`

These adapters simulate external API calls (e.g., using `Thread.sleep` to mimic latency) and return standard success/failure responses.

### Flow
1. Core system approves the application.
2. `WorkflowService` triggers `IntegrationService.submitApplication()`.
3. `IntegrationService` routes to the correct adapter based on `departmentId`.
4. Adapter maps internal MahaSeva DTOs to the specific JSON payload required by the external department API.
5. Response is parsed, and an external reference ID is saved in the MahaSeva application record.
