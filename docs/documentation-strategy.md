# Documentation Strategy & Research: Alugard-Drop

Drag-and-drop libraries have evolved significantly. While older libraries like `dragula` relied on monolithic READMEs and imperative APIs, modern counterparts have established new standards for documentation. To position **Alugard-Drop** as a premium modern alternative, our documentation must adopt these best practices.

## 1. Research: Modern D&D Library Documentation

We analyzed the documentation structures of four leading modern drag-and-drop libraries:

### [dnd-kit](https://docs.dndkit.com/) (React)
- **Structure:** Highly modular. Separates Core concepts (Context, Draggable, Droppable) from Presets (Sortable).
- **Interactive:** Features embedded interactive sandboxes on almost every page.
- **Accessibility (a11y):** Has a dedicated, prominent section explaining how screen readers and keyboard navigation are handled natively by the library.
- **Architecture:** Clearly explains the "Unopinionated" architecture—meaning they provide sensors and modifiers, but the user builds the UI.

### [Pragmatic Drag and Drop](https://atlassian.design/components/pragmatic-drag-and-drop/) (Atlassian)
- **Framework Agnostic:** Emphasizes that it works with React, Svelte, Vue, or Vanilla JS.
- **Examples-First:** Their homepage immediately dives into visual "Core Packages" versus "Optional Packages".
- **Tutorial Integration:** They feature step-by-step tutorials (e.g., "Building a Kanban board from scratch", "Building a chessboard").

### [Framer Motion (Reorder)](https://www.framer.com/motion/reorder/) (React)
- **Visuals:** Relies heavily on high-quality CSS animations. Documentation focuses on the visual "feel" of dragging.
- **Simplicity:** The API looks deceptively simple (`<Reorder.Group>` and `<Reorder.Item>`). Docs focus on the *props* that change behavior.

### [SortableJS](https://sortablejs.github.io/Sortable/) (Vanilla JS Framework Agnostic)
- **Feature Checklists:** Documentation serves as a massive checklist of capabilities (Multi-drag, Swap, Cloning) with immediately playable examples next to each feature.
- **Plugins:** Explicitly separates core functionality from plugins to keep the main bundle light.

---

## 2. Gap Analysis: Alugard-Drop vs. Modern Standards

Currently, Alugard-Drop has basic "Getting Started" guides (README, column layout, grid layout, components). While helpful, it lacks the structure expected of a modern enterprise-grade library.

**What we are missing:**
1. **API Reference Book:** Comprehensive documentation on `alugard(containers, options)`, detailing every single option (`moves`, `accepts`, `invalid`, `slideFactor`, etc.) and event (`drag`, `drop`, `shadow`, etc.).
2. **Architecture / Mental Model:** Explaining *how* Alugard works under the hood (the Mirror element, the Transit element, pointer events vs touch events) so senior developers trust the library.
3. **Framework Wrappers:** Developers today rarely write Vanilla JS UI. We need explicit guides on how to wrap Alugard-Drop in **React**, **Vue**, and **Svelte**.
4. **Interactive Examples:** Static markdown code blocks aren't enough. We need CodeSandbox / StackBlitz templates linked in the docs.
5. **Accessibility (a11y):** Documentation on how to make Alugard-drop keyboard accessible (if supported) or warnings on limitations.

---

## 3. Proposed Documentation Structure

To elevate Alugard-Drop, we should adopt a Static Site Generator (SSG) specifically for documentation.

**Recommendation: [VitePress](https://vitepress.dev/)**
VitePress is built on Vite (which Alugard already uses), supports Markdown, and allows embedding Vue/Vanilla JS interactive components directly inside the Markdown files.

### Folder Structure (e.g., `docs/`)

```text
/
├── Getting Started
│   ├── Installation.md
│   ├── Quick Start.md
│   └── Framework Integrations (React, Vue, etc).md
├── Core Concepts
│   ├── The Drake Instance.md
│   ├── Physics & The Mirror.md  <-- Explains the visual shadow
│   └── Event Lifecycle.md
├── Advanced Guides
│   ├── Kanban Boards (Column Layout).md
│   ├── Grid Layouts.md
│   ├── Drag Handles & Validation.md
│   └── Copying & Cloning.md
├── API Reference
│   ├── Options.md          <-- moves, accepts, invalid, revertOnSpill
│   └── Events.md           <-- drag, drop, over, out, clone
└── Architecture
    ├── Touch & Pointer Events.md <-- Explain the fix applied to mobile
    └── Migration from Dragula.md
```

## 4. Next Steps for Implementation

1. **Initialize VitePress:** Scaffold a VitePress site in the `./docs` directory.
2. **Migrate Content:** Move the currently written markdown files (`column-layout.md`, `grid-layout.md`) into the VitePress structure.
3. **Write the API Reference:** Document the `AlugardOptions` interface and the `Drake` class events comprehensively.
4. **Create Framework Wrappers:** Write generic wrapper examples for React (`useAlugard`) and Vue (`v-alugard`).
5. **Deploy:** Setup GitHub pages or Vercel to host the documentation live.
