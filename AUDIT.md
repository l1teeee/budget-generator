# Budget Generator — Ledger Terminal Audit

> **Theme update (post-audit):** by user request the UI was re-themed from the black-dominant terminal to a **light, friendly Linktree-inspired palette** (cream `#f1f1e9`, Linktree green `#43e660`, forest `#1f3d29`) with **rounded corners** throughout, the app identity changed to **"BG · Budget Generator" with a React-atom logo**, the default sender brand "Numen" was removed, and the localStorage key was bumped to `v2`. R1's "black-dominant" criterion below is therefore superseded; all other requirements (R2–R12) and the layout/data-flow still hold. The two documents keep explicit-hex styling (now cream + forest) so html2canvas still renders them.


**Summary verdict:** Build PASSES. 12 PASS / 0 PARTIAL / 0 FAIL after remediation. All four real findings (1-4 below) were fixed; finding 5 is a no-code-change risk note. No blocking bugs.

> Remediation note (post-audit): the audit ran during a race where `TotalHUD` was mid-wiring. `<TotalHUD />` is now rendered (TemplatePreview.jsx:87), so finding 1 and the R12 PARTIAL are resolved. Findings 2-4 were also fixed (see each item).

## Build

`npm run build` succeeds (`vite build`, built in ~276ms). Only warning is the standard "chunk > 500 kB" notice from bundling html2canvas/jsPDF/gsap. No errors, no failed imports.

## Requirements

| # | Requirement | Verdict | Evidence |
|---|-------------|---------|----------|
| R1 | Black-dominant dark theme, white only for document | PASS | App shell `background:#000000` (App.jsx:27), `--void:#000000` as body bg (index.css:47), panels `#050506`/`#0b0b0c`; white limited to the A4 doc bg `#ffffff` (DocLedger.jsx:24, DocStatement.jsx:37). No light-theme/broadsheet leftovers found. |
| R2 | Template chooser updates `state.template`, preview reflects it, switch animates | PASS | `setTemplate(t.id)` (FormStep4.jsx:41) -> store setter (useFormStore.jsx:134); `Doc` picks DocStatement vs DocLedger (TemplatePreview.jsx:11,75); `usePreviewSwap(swapRef, state.template)` re-fires on template change (TemplatePreview.jsx:45, useAnimations.js:47-54). |
| R3 | Live preview scaled-to-fit, both templates, no overflow | PASS | Measured scale via ResizeObserver (TemplatePreview.jsx:30-43), clamped `0.2..1`; outer box sized `A4*scale`, inner 794x1123 with `transform:scale` + `transformOrigin:top left` (lines 61-77); stage `overflow:hidden`. |
| R4 | A4 portrait PDF, captures un-transformed 1:1 hidden node, filename pattern, hex-only colors | PASS | jsPDF `orientation:'portrait', format:'a4'` (usePDFExport.js:25); `previewRef` targets the off-screen 1:1 node at `left:-20000px` with no transform (TemplatePreview.jsx:79-83); filename `presupuesto-${safe}-${date}.pdf` (usePDFExport.js:32); Doc components use only literal hex colors, no `var()`/`oklch`. |
| R5 | Versioned, debounced localStorage persistence with safe fallback | PASS | Key `budgen.quote.v1` (useFormStore.jsx:5); 350ms debounced save (lines 80-88); hydrate via `parseQuoteJson` with `ok` guard, falls back to defaults on missing/corrupt (loadInitial lines 65-73). |
| R6 | JSON panel: format, import, export, copy, load file — all local | PASS | format (JsonPanel.jsx:22, formatJsonString), import w/ validation (28-32, parseQuoteJson + replaceQuote), download via Blob (34-38, downloadJson), copy via clipboard (40-43), file load via FileReader (45-52). No network. |
| R7 | Brand/sender editable in BrandDrawer, flows to both docs | PASS | BrandDrawer edits name/tagline/website/email/phone + meta.quoteId (BrandDrawer.jsx:46-51); preview passes `state.brand`/`state.meta` into data (TemplatePreview.jsx:21-22) consumed by both DocLedger and DocStatement. |
| R8 | Discount/tax captured and applied subtotal->discount->tax->total; shown only when > 0 | PASS | Captured (FormStep3.jsx:97-98); ordered math in `totals` (useFormStore.jsx:157-166); docs gate on `discountAmount>0` / `taxAmount>0` (DocLedger.jsx:92,98; DocStatement.jsx:31-32,73). |
| R9 | Animations centralized in useAnimations.js via useGSAP with scope | PASS | All animation hooks live in useAnimations.js using `useGSAP` with `{ scope }` and `contextSafe` for listeners (lines 7-78). Only useAnimations.js imports gsap directly (verified by grep). |
| R10 | No external/network calls | PASS | grep for `fetch(`/`axios`/`http(s)://`/`cdn.` in src found no matches. Fonts bundled via @fontsource (main.jsx:1-9). Fully offline. |
| R11 | No dangling imports to deleted files | PASS | grep for TemplateMinimal, TemplateEditorial, SplitLayout, ProgressRail, StepLabel, FloatingInput: no matches anywhere. |
| R12 | Plain JS, no TS, no dead files breaking build | PASS | All components plain JSX, build clean. `TotalHUD` is now rendered (TemplatePreview.jsx:87) so `useCountUp` is live; unused `loadQuote` removed from the store. |

## Bugs / Risks

Real issues found (none block the build) — findings 1-4 FIXED:

1. **[FIXED] Dead import: `TotalHUD`** — was a race-condition artifact; `<TotalHUD />` is now rendered in the stage (TemplatePreview.jsx:87), so `useCountUp` is live and drives the count-up total HUD.

2. **[FIXED] Dead store method: `loadQuote`** — removed from `useFormStore.jsx`; JsonPanel uses `replaceQuote`.

3. **[FIXED] Custom-service quantity parses empty input to 1, blocking deletion** — `CustomServiceRow.jsx` now allows blanking the qty field while editing and coerces to a valid value on blur.

4. **[FIXED] `reducedMotion` does not disable GSAP tweens** — `useAnimations.js` now has a `prefersReduced()` guard that skips/instant-completes the entrance, preview-swap, progress-fill, and count-up tweens when `prefers-reduced-motion: reduce`.

5. **[RISK NOTE] html2canvas capturing an off-screen node** — `previewRef` lives at `left:-20000px` (TemplatePreview.jsx:79). The export passes explicit `width/height/windowWidth/windowHeight` (usePDFExport.js:14-22) which makes this pattern work in practice, but off-screen capture is environment-sensitive (some html2canvas versions clip negatively-offset nodes). This currently looks correct; flagged only as the highest-risk area to smoke-test on a real export. No code change recommended unless a blank/clipped PDF is observed.

### Checked and OK (not bugs)

- Empty-state access: all Doc fields use `data.x || {}` / `|| []` defaults and `Number(n||0)` formatting (DocLedger.jsx:8-15, DocStatement.jsx:17-24) — no undefined access on empty state.
- Number parsing of `''`: store coerces with `Number(...) || 0` for discount/tax/price (useFormStore.jsx:150-166), and PctInput renders `value || ''` so the field can be blanked (FormStep3.jsx:31).
- Refs before mount: every GSAP hook null-checks `ref.current` or relies on `useGSAP` scope; `usePreviewSwap`/`useProgressFill` target refs that are always mounted.
- `useGSAP` dependencies: `useCountUp`/`useProgressFill`/`usePreviewSwap` pass correct `dependencies` arrays so they re-run on value/template change.
- Remount key: `App.jsx:34` keys the form column on `step`, intentionally remounting to retrigger the entrance animation — preview/store are outside that key, so no state loss.
- Persistence loop: the save effect depends on `state` only; `saved` flag toggles via nested timeouts without retriggering the effect.

## Recommendations

1. Resolve `TotalHUD`: render it in the visible stage (it is a polished count-up HUD and fits the theme) or delete it plus `useCountUp` to satisfy "no dead files."
2. Remove the unused `loadQuote` store method (or document its intended use).
3. Fix the custom-service quantity input so clearing it does not snap to 1 mid-edit.
4. Honor `prefers-reduced-motion` for the GSAP animations, not just CSS keyframes.
5. Smoke-test one real PDF export to confirm the off-screen 1:1 node captures fully (highest environment risk).
6. Optional: code-split the vendor bundle (html2canvas/jsPDF) to clear the 500 kB chunk warning.
