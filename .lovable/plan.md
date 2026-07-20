## Scope

Refine the Evaluation Workspace — Candidates page (and shared header/tabs) inside `src/routes/recruiter.evaluations.$id.workspace.tsx`. Keep the existing recruiter design language (fonts, spacing, whites, neutrals). No visual redesign of unrelated pages.

Only these files change:
- `src/routes/recruiter.evaluations.$id.workspace.tsx` (main work)
- `src/lib/recruiterCandidates.ts` (drop lifecycle statuses from the review filter surface, add `Hidden Gem` recommendation, keep 1,000-candidate generator)
- (only if needed) tiny CSS tweak in `src/styles.css` for sticky layering

## 1. Shared Evaluation Header (all 5 tabs)

Extract a single `EvaluationHeader` component rendered above the tab bar on every tab (Overview, Candidates, Hiring Intelligence, Needs Your Attention, Settings).

Row 1 (sticky, single line, never wraps):
- Left: `← All Evaluations` · Status badge (Draft/Published) · Domain · Evaluation title
- Right (aligned): Copy Link · Invite Candidates · Download · More

Row 2 (subtle metadata, non-interactive, `·` separators):
- Created · Last Modified · Created By · Duration · Marks · Candidate Limit

Below header: existing underline tab nav (no boxed tabs) with the 5 tabs already present. Wire "Needs Your Attention" label exactly.

Sticky behaviour: header + tab bar stick to top of viewport; on Candidates page the Pipeline nav + Search + Toolbar also stick below it. Only the results table scrolls.

## 2. Candidates page hierarchy

Replace current Candidates tab layout with 5 clean levels — no colour dashboards, typography-driven:

1. **Pipeline nav** — All, Needs Review, Strong Hire, Selected, Rejected, Hold, each with live count derived from the full candidate set (Needs Review = hiringStatus "Pending Review", others match hiring status; Strong Hire pulls by AI recommendation). Underline-style active state.
2. **Universal search** — one large sticky input, placeholder as specified, live filters across name/email/phone/id/company/college, keeps recent searches in `localStorage` and shows a suggestions dropdown.
3. **Active filter summary** — hidden when no filters; shows count + removable chips + Clear All.
4. **Toolbar** — Advanced Filters, Sort, Columns, Export only.
5. **Results** — compact table or card view.

Remove the "Needs Your Attention" strip that currently sits above the results.

## 3. Advanced Filters drawer

Right-side drawer, sections collapsible, only "Candidate" section expanded by default:
- Candidate: Submission Status, Submission Date
- Performance: ECI, Labs, Assessment, Vitarka
- AI Recommendation: Strong Hire, Hire, Maybe, Needs Review, Hidden Gem, Reject
- Recruiter Review: Pending Review, Shortlisted, Selected, Rejected, Hold
- Background: Experience, College, Company, Skills, Domain
- Dates: Submission Date, Custom Date Range
- Tags: Priority, Campus, Referral, Internal, Bookmarked

Footer: Reset Filters · Apply Filters (Show N Matching Candidates).

## 4. Candidate table refinements

Final columns (widths tuned — Candidate + Actions wider, numeric columns narrow and right-aligned):

```text
Candidate | Eng. Labs | Knowledge Assessment | Vitarka | ECI | AI Recommendation | Submitted On | Review Status | Actions
```

- Remove Experience and Completion Time columns from the table.
- ECI cell: number on top, qualitative label (Excellent/Good/Average/Weak) below — typography only, no colour dot.
- AI Recommendation + Review Status: single shared neutral badge component (same border, same neutral bg, same type — only label differs). No green/red/yellow.
- Sticky table header, resizable columns, column pinning for Candidate + Actions, search-term highlighting in Candidate cell.
- Pagination sizes: 25 / 50 / 100 / 250 / 500 (persisted per recruiter in `localStorage`).
- Bulk selection + bulk actions bar (Shortlist / Reject / Hold / Export / Compare).
- Card view kept as an alternative and updated to match the new neutral badges + trimmed metadata.

## 5. Row actions menu

Per-row `More` menu: View Candidate, Open Resume, Download Report, Shortlist, Reject, Hold, Copy Candidate Link, Add Notes. Each wired to existing helpers or `localStorage` review-status writes + a toast — no dead buttons.

## 6. Micro-interactions & states

- Skeleton rows during first mount.
- Empty state (no candidates yet) and No-Results state (filters return 0) with distinct copy + "Clear filters" CTA.
- Drawer slide-in/out, dropdown fade, hover row highlight — reuse existing motion tokens; nothing new.

## 7. Demo data

Keep the deterministic 1,000-candidate generator. Extend the recommendation pool to include `Hidden Gem` so the new filter actually returns results. Ensure every filter, sort, search, bulk action and export path works against the generated set.

## Out of scope

- No redesign of Overview, Intelligence, Attention or Settings tab internals — they only inherit the new shared header + tab bar.
- No backend/API changes; all persistence stays in `localStorage`.
- No new dependencies.
