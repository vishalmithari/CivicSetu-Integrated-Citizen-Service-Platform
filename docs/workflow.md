# Workflow Engine

The MahaSeva platform uses a configurable workflow engine to manage the lifecycle of applications, since different government services have different approval steps.

## State Machine Approach
Instead of hardcoding status updates in controllers, a workflow definition dictates valid transitions.

### Standard Workflow Example
1. `SUBMITTED` -> citizen submits the application.
2. `DOCUMENT_VERIFICATION` -> officer reviews uploaded proofs.
3. `OFFICER_REVIEW` -> officer evaluates eligibility.
4. `APPROVED` / `REJECTED` -> terminal states.

### Correction Workflow
If a document is invalid:
1. `DOCUMENT_VERIFICATION` -> `CORRECTION_REQUIRED` (officer adds remark).
2. `CORRECTION_REQUIRED` -> `SUBMITTED` (citizen re-uploads).

## Implementation
- A `Workflow` entity contains a list of allowed states and valid transitions.
- A `WorkflowService` validates any state change request against the workflow assigned to the service.
- The `Application` timeline records each transition, actor, and remark for auditability.
