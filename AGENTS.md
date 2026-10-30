# Architecture rules
- Keep system design lab metadata and sprint definitions in `src/lib/systemDesign.ts` so the catalog, admin seeds, and learner sprint view stay aligned.
- Dispatch system design tickets to the shared `SystemDesignStudio` at the ticket-view boundary so direct links and admin previews use the same workspace.
- Scope design studio drafts by lab slug and ticket ID so work cannot leak between tasks; retain the standalone studio as a separate sandbox.
- Keep structural evaluation criteria in systemDesign metadata and evaluate current draft artifacts through a pure client-side evaluator; distinguish structural practice scores from task-specific grading.