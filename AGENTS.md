# Architecture rules
- Keep system design lab metadata and sprint definitions in `src/lib/systemDesign.ts` so the catalog, admin seeds, and learner sprint view stay aligned.
- Dispatch system design tickets to the shared `SystemDesignStudio` at the ticket-view boundary so direct links and admin previews use the same workspace.
- Scope design studio drafts by lab slug and ticket ID so work cannot leak between tasks; retain the standalone studio as a separate sandbox.
- Keep system-design ticket criteria in systemDesign metadata and shared evaluation contracts in lib/evaluation; use one right-side drawer, prefer explicit ticket criteria, fall back to actual requirements, and leave unvalidated criteria pending rather than inventing grades.