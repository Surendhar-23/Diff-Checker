# 🏛️ SNDDiffX — Architecture & Implementation Deep-Dive

This document is the internal technical specification and developer guide for **SNDDiffX**. It details the architecture, design decisions, package justifications, core algorithms, data flows, SEO implementation, and recipes for future expansion.

---

## 1. 📦 Packages & Dependencies Justification

| Package | Version | Purpose & Why It Was Chosen |
| :--- | :--- | :--- |
| **`react` & `react-dom`** | `^19.2.8` | Modern UI rendering library. Utilizes concurrent rendering, clean custom hooks, and context-based state management. |
| **`@mui/material`** | `^7.x` (latest) | Production-grade UI component library providing accessible widgets (AppBars, Menus, Modals, Sliders, ToggleButtons, Drawers, Chips, Toolbars) with consistent design tokens. |
| **`@mui/icons-material`** | `^7.x` (latest) | Comprehensive rounded icon suite providing uniform iconography across the entire tool without external SVG assets. |
| **`@emotion/react` & `@emotion/styled`** | `^11.x` | CSS-in-JS engine required by Material UI for style caching, theme interpolation, and zero style collisions. |
| **`diff` (jsdiff)** | `^7.0.0` | Industry-standard implementation of the Myers diff algorithm in JavaScript. Provides line-level diffing (`diffLines`), word diffing (`diffWordsWithSpace`), char diffing (`diffChars`), and unified patch generation (`createTwoFilesPatch`). |
| **`prismjs`** | `^1.30.0` | Lightweight tokenization library for syntax-aware code presentation without heavy external bundle overhead. |
| **`vite`** | `^8.2.0` | Next-generation ESM bundler providing near-instant HMR, tree-shaking, Rollup-based production builds, and lightning-fast developer experience. |
| **`eslint` & plugins** | `^10.x` | Code quality enforcement with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`. |

---

## 2. 🧩 System Architecture & Directory Structure

The project strictly follows **Separation of Concerns (SoC)** and **Clean Architecture**. Business logic and diff calculation engines are completely decoupled from UI rendering and React hooks:

```
Diff-checker/
├── public/                    # Static Assets & SEO Files
│   ├── robots.txt             # Search crawler directives
│   └── sitemap.xml            # XML sitemap for Google indexing
│
├── src/
│   ├── core/                  # 1. Domain Logic & Pure Engines (Zero React dependencies)
│   │   ├── diffEngine.js      # Line diff, aligned Split matrix, Unified stream, inline word diffs
│   │   ├── formatters.js      # JSON recursive key sorter, normalizers, language detector
│   │   ├── exportService.js   # Git patch creator, HTML report generator, Markdown diff exporter
│   │   ├── samples.js         # Built-in mock test suites (JSON API, JS Async, SQL CTE, Changelog)
│   │   ├── constants.js       # View modes, diff granularities, default settings, storage keys
│   │   └── urlState.js        # URL hash state serializer/deserializer (base64 + URI encode)
│   │
│   ├── context/               # 2. State & Persistence Layer
│   │   ├── contexts.js        # Pure React Context instantiations (Vite Fast-Refresh safe)
│   │   ├── DiffContext.jsx    # Text inputs, active diff model, navigation stepper, action dispatchers
│   │   ├── ThemeContext.jsx   # Theme switcher (Dark/Light) + localStorage + CSS tokens sync
│   │   ├── HistoryContext.jsx # LRU History stack with pinning and persistence
│   │   └── SettingsContext.jsx# UI settings (fontSize, tabSize, wrapLines, syncScroll, collapse)
│   │
│   ├── hooks/                 # 3. Reusable Custom Hooks Layer
│   │   ├── index.js           # Central barrel export
│   │   ├── useDiff.js         # Context consumer for DiffContext
│   │   ├── useHistory.js      # Context consumer for HistoryContext
│   │   ├── useSettings.js     # Context consumer for SettingsContext
│   │   ├── useAppTheme.js     # Context consumer for ThemeContext
│   │   ├── useSyncScroll.js   # Synchronized dual-pane scrolling with loop prevention
│   │   ├── useKeyboardShortcuts.js # Global hotkey listeners with input-ignore heuristics
│   │   └── useClipboard.js    # Clipboard copy with fallback and status tracking
│   │
│   ├── theme/                 # 4. Design Tokens & Styling
│   │   └── index.js           # MUI theme definition (Dark/Light palettes & custom diff tokens)
│   │
│   ├── components/            # 5. Presentation & UI Components
│   │   ├── layout/            # AppHeader, DiffToolbar, DiffStatsBar, AppFooter
│   │   ├── editor/            # TextEditorPane, EditorHeader, DropZone
│   │   ├── viewer/            # DiffViewer, SplitDiffView, UnifiedDiffView, CollapsedLines
│   │   ├── modals/            # ExportModal, SettingsModal, HistoryDrawer, ShortcutsDialog, SamplePickerModal
│   │   └── common/            # StatBadge, ToastSnackbar
│   │
│   ├── App.jsx                # Root Application wiring providers and components
│   ├── main.jsx               # DOM entrypoint
│   └── index.css              # CSS variables, fonts, resets, scrollbar styles
```

---

## 3. 🔍 Detailed Feature Implementation Breakdown

### 1. Diff Engine & Sub-line Word Highlighting (`src/core/diffEngine.js`)
- **Myers Algorithm Execution**:
  `computeDiff(originalRaw, modifiedRaw, options)` runs `Diff.diffLines()`.
- **Side-by-Side Row Alignment Algorithm**:
  - Consecutive deletions (`chunk.removed`) and additions (`chunk.added`) are grouped into **Modified Pairs**.
  - For each paired modified line, a secondary word-level diff (`Diff.diffWordsWithSpace`) or char diff (`Diff.diffChars`) is computed via `computeInlineWordDiff()`.
  - For unbalanced hunks (e.g. 3 lines deleted, 1 line added), empty placeholder cells (`LINE_STATUS.EMPTY`) are inserted to guarantee row-by-row horizontal alignment.
- **Unified Stream Generation**:
  - Deletions are mapped with `-` markers and old line numbers.
  - Additions are mapped with `+` markers and new line numbers.
  - Unchanged lines retain both line numbers with a space `' '` marker.
- **Similarity Metric Computation**:
  Uses a Dice-coefficient inspired metric:
  $$\text{Similarity Score} = \left( \frac{2 \times \text{Unchanged Lines}}{\text{Total Compared Lines}} \right) \times 100$$

---

### 2. Semantic JSON Comparison Engine (`src/core/formatters.js`)
- Standard text diffs fail on JSON because key order differences (`{"a":1, "b":2}` vs `{"b":2, "a":1}`) create false positives.
- `deepSortJsonKeys(obj)` recursively traverses arrays and nested objects, alphabetically sorting object keys at every depth.
- `formatJsonString(raw, sortKeys, indent)` parses raw strings, sorts all keys recursively, and formats with clean 2-space indentation before feeding into the diff engine.

---

### 3. Synchronized Dual-Pane Scrolling (`src/hooks/useSyncScroll.js`)
- **Problem**: Directly binding `onScroll` on both panes leads to an infinite recursive event loop (Pane A scrolls Pane B, which scrolls Pane A).
- **Solution**:
  - Uses an `isScrollingRef` lock (`'left' | 'right' | null`).
  - When Left fires scroll, Right's `scrollTop` and `scrollLeft` are updated, and `isScrollingRef.current` is set to `'left'`.
  - Right's listener checks the lock and immediately returns if the event was triggered programmatically.
  - The lock is released on the next browser animation frame via `requestAnimationFrame`.

---

### 4. Collapsible Unchanged Line Sections (`src/components/viewer/CollapsedLines.jsx`)
- When files have hundreds of identical lines, showing all of them clutters the UI.
- `useMemo` in `SplitDiffView` and `UnifiedDiffView` scans for contiguous runs of `LINE_STATUS.UNCHANGED`.
- If the run exceeds `settings.collapseThreshold` (default: 8 lines), it extracts the top $N$ context lines, the bottom $N$ context lines, and replaces the middle with a `CollapsedLines` banner.
- Clicking the banner updates `expandedHunks[hunkKey] = true`, revealing the full block.

---

### 5. Difference Stepper & Auto-Scrolling
- Every change hunk receives a unique `changeIndex` (1 to $N$) and DOM element ID (`split-row-change-${idx}` / `unified-row-change-${idx}`).
- `DiffContext` exposes `currentChangeIndex`, `goToNextChange()`, and `goToPrevChange()`.
- A `useEffect` in the viewer detects index changes and triggers `targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })` with an active accent border.

---

### 6. Local Storage History Management (`src/context/HistoryContext.jsx`)
- `DiffContext` listens for changes in original/modified text and triggers a debounced auto-save (2.5 seconds) to `HistoryContext`.
- Deduplication ensures identical consecutive edits are replaced at the top.
- The history stack is bounded to 35 items using key `snddiffx_history_v1`.
- Pinned items (`isPinned: true`) are immune from eviction during pruning or `Clear Unpinned`.

---

### 7. Multi-Format Export & Deep-Linking (`src/core/exportService.js` & `urlState.js`)
- **Git Patch**: Calls `Diff.createTwoFilesPatch()` and triggers a Blob download with MIME type `text/x-diff`.
- **HTML Report**: Generates a self-contained HTML document with embedded CSS, header metadata, statistics badges, and formatted diff pre block.
- **Markdown Diff**: Produces a markdown block with ` ```diff ` fencing suitable for PR descriptions.
- **Deep-Link State**: Serializes `{ o: originalText, m: modifiedText, t: diffType }`, compresses it into a URI-safe Base64 string, and attaches it to `window.location.hash = #diff=<encoded>`. On initial load, `DiffContext` decodes this hash to restore the shared diff.

---

### 8. Drag-and-Drop File Upload (`src/components/editor/TextEditorPane.jsx`)
- Drop event handlers on both editor panes capture `e.dataTransfer.files[0]`.
- Reads contents asynchronously via `FileReader.readAsText()`.
- Automatically populates the text content and assigns the file's filename to the pane header.

---

## 4. 🌐 SEO Optimization Architecture for #1 Search Engine Ranking

To rank at the top of Google search results for terms like "diff checker", "online text diff", "json diff compare", and "snddiffx", the following strategies are baked into the codebase:

1. **Title Tag Strategy**:
   - `SNDDiffX - Free Online Diff Checker | Code, Text & JSON Comparison Tool`
   - Incorporates primary intent keywords (*free online diff checker*) and secondary query keywords (*code, text, JSON comparison tool*).
2. **Meta Description**:
   - Designed for high click-through rates (CTR) with clear value propositions: speed, privacy, precision, and zero installation.
3. **Structured Data (Schema.org JSON-LD)**:
   - **`WebApplication` Schema**: Informs Google crawler of features, application category (`DeveloperApplication`), free pricing (`0 USD`), and compatibility.
   - **`FAQPage` Schema**: Qualifies the site for Google's rich FAQ snippet SERP feature, expanding search real estate.
4. **Social & Discovery Cards**:
   - Full OpenGraph (`og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`) and Twitter Card (`summary_large_image`) tags.
5. **Crawler Directives**:
   - `public/robots.txt` granting explicit crawl access and declaring sitemap location.
   - `public/sitemap.xml` declaring URL canonicalization, `priority: 1.0`, and `changefreq: weekly`.
6. **NoScript Semantic Fallback**:
   - Provides clean semantic HTML (`<h1>`, `<main>`, `<ul>`) for search engine crawlers that index initial HTML before JavaScript hydration.

---

## 5. 🔮 How to Extend the Application (Developer Recipes)

### Recipe A: Adding a New Diff Provider (e.g. CSV Table Diff)
1. In `src/core/constants.js`, add `DIFF_TYPES.CSV = 'csv'`.
2. In `src/core/diffEngine.js`, implement `computeCsvDiff(oldCsv, newCsv)` using PapaParse or native row split.
3. In `src/components/layout/DiffToolbar.jsx`, add a `<ToggleButton value={DIFF_TYPES.CSV}>CSV Diff</ToggleButton>`.
4. In `src/components/viewer/DiffViewer.jsx`, render a dedicated `<CsvDiffView />` when `options.diffType === DIFF_TYPES.CSV`.

---

### Recipe B: Adding a New Export Format (e.g. PDF Export)
1. Install `jspdf` or `html2pdf.js`: `npm i jspdf`.
2. In `src/core/exportService.js`, export `exportPdfReport(original, modified, stats)`.
3. In `src/components/modals/ExportModal.jsx`, add a new `Paper` card with a "Download PDF" button calling `exportPdfReport()`.

---

### Recipe C: Adding 3-Way Merge / Conflict Resolution
1. In `src/core/constants.js`, add `VIEW_MODES.THREE_WAY = 'three_way'`.
2. Add a third state in `DiffContext`: `baseText`, `originalText`, `modifiedText`.
3. Create `src/components/viewer/ThreeWayMergeView.jsx` with 3 columns (Ours, Base, Theirs) and interactive "Accept Left" / "Accept Right" buttons on conflicting hunks.

---

## 🔒 Security & Performance Guidelines

- **No Remote Transmission**: All text processing, diffing, and formatting occurs entirely on the client thread.
- **Memory Safety**: LocalStorage entries are capped at 35 items with string size limits to prevent `QUOTA_EXCEEDED_ERR`.
- **HTML Injection Prevention**: `exportHtmlReport()` sanitizes user-supplied text using an `escapeHtml()` entity converter (`&`, `<`, `>`, `"`, `'`).
- **Render Performance**: `computeDiff` is memoized in `DiffContext` and only recalculates when `originalText`, `modifiedText`, or `options` change.
