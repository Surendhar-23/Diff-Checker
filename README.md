# 🔍 SNDDiffX — Free Online Diff Checker & Code Comparison Tool

> **The ultra-fast, modern, and 100% private tool to compare text, code, JSON, and documents directly in your browser.**

**SNDDiffX** is engineered for developers, technical writers, analysts, and students who need instant, accurate, and secure difference checking. Whether reviewing code refactors, comparing API JSON schemas, checking Git patches, or proofreading markdown documents, SNDDiffX provides granular character-level precision with zero configuration.

---

## 🌟 Why Choose SNDDiffX?

- **⚡ Blazing Fast Performance**: Zero-lag comparison even for extensive datasets and multi-thousand line files.
- **👓 Dual Comparison Modes**:
  - **Side-by-Side (Split) View**: Synchronized scrolling with aligned rows and gutter line indices.
  - **Unified (Inline) View**: Linear Git-style diff showing insertions (`+`) and deletions (`-`).
- **🔍 Sub-line Word & Character Precision**: Pinpoints exact tokens and characters that changed inside modified lines.
- **📐 Semantic JSON Mode**: Recursively formats and sorts object keys alphabetically, preventing false positives caused by key reordering.
- **📁 Drag & Drop Ingestion**: Drop files directly into either pane for instant comparison.
- **📊 Real-time Change Metrics**: Live similarity percentage score alongside additions, deletions, and modifications counters.
- **🕒 Local History & Pinning**: Automatically preserves recent comparisons in your browser's private local storage. Pin critical comparisons for quick reference.
- **📤 Versatile Export & Sharing**:
  - Download standard unified Git patch (`.patch`) files
  - Export standalone, styled HTML reports
  - Copy Markdown diff blocks for GitHub Pull Requests, Issues, and Slack
  - Generate shareable deep links with compressed diff state
- **🌓 Adaptive Themes**: Polished Dark and Light themes with tailored color palettes for long sessions.
- **🔒 100% Client-Side Privacy**: Runs completely in your browser. No text, code, or data is ever transmitted to a server.

---

## 🚀 How to Use SNDDiffX

### 1. Input Your Data
- Paste original text into the left pane and modified text into the right pane.
- Or drag and drop two files from your desktop onto the editor windows.

### 2. Select View Mode
- **Split View (`Alt+1`)**: Side-by-side comparison with synchronized dual-pane scrolling.
- **Unified View (`Alt+2`)**: Compact Git-like inline diff view.
- **Edit Mode (`Alt+3`)**: Live editor to adjust text in real-time.

### 3. Apply Comparison Filters
Click **Filters** in the toolbar to customize the comparison engine:
- **Ignore Whitespace**: Disregards indentation and whitespace discrepancies.
- **Ignore Case**: Treats uppercase and lowercase letters identically.
- **Ignore Punctuation**: Focuses purely on alphanumeric content.
- **Trim Trailing Spaces**: Strips end-of-line whitespace.
- **Sort JSON Keys**: Alphabetically sorts JSON keys for structural comparison.

### 4. Step Through Differences
Navigate through each change hunk effortlessly with `< Prev` / `Next >` buttons or keyboard shortcuts (`Alt+N` / `Alt+P`).

---

## ⌨️ Power-User Keyboard Shortcuts

| macOS Shortcut | Windows / Linux Shortcut | Action |
| :--- | :--- | :--- |
| **`⌥ + N`** or **`⌥ + ↓`** | **`Alt + N`** or **`Alt + ↓`** | Jump to Next difference |
| **`⌥ + P`** or **`⌥ + ↑`** | **`Alt + P`** or **`Alt + ↑`** | Jump to Previous difference |
| **`⌥ + S`** | **`Alt + S`** | Swap left and right texts |
| **`⌥ + 1`** | **`Alt + 1`** | Switch to Side-by-Side (Split) View |
| **`⌥ + 2`** | **`Alt + 2`** | Switch to Unified (Inline) View |
| **`⌥ + 3`** | **`Alt + 3`** | Switch to Live Text Editor |
| **`⌥ + F`** or **`⌘ + Shift + F`** | **`Alt + F`** or **`Ctrl + Shift + F`** | Focus in-diff search box |
| **`Tab`** | **`Tab`** | Insert indent spaces in editor |
| **`?`** | **`?`** | Open keyboard shortcuts reference |
| **`Esc`** | **`Esc`** | Close open modals or clear search |

---

## 🛠️ Local Development & Deployment

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/snddiffx.git

# Navigate into directory
cd snddiffx

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🔒 Privacy Guarantee

SNDDiffX is built with a **strict privacy-first architecture**. All text processing, tokenization, sorting, and diff calculations happen locally inside your browser's JavaScript runtime. Your content is never logged, stored on external databases, or transmitted over any network.

---

## 📄 License
Distributed under the [MIT License](LICENSE).
