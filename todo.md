# Site Builder — TODO

> Generated from project audit. Items grouped by priority.

---

## 🔴 Bugs (Correctness)

- [x] **#1 – `properties.js` / `responsive.js` – bare top-level event listeners**
  `document.getElementById('btn-delete-component').addEventListener(...)` and similar calls in `responsive.js` run before `DOMContentLoaded`. Wrap all top-level `getElementById` + `addEventListener` calls in `DOMContentLoaded` for safety and consistency.

- [x] **#2 – `export.js` – navbar export applies nav styles to every link**
  `linksHTML` reuses the nav's `styleStr` (background, padding, flex…) on each `<a>`. Links should only receive `color:inherit;text-decoration:none;`.

- [x] **#3 – `export.js` – `a { color: inherit }` in `getExportCSS()` kills intentional link colours**
  The blanket rule overrides button, hero CTA, and card CTA colours. Remove the rule or scope it narrowly.

- [x] **#4 – `export.js` – button export hardcodes overrides that conflict with user styles**
  Hardcoded `display:inline-block;font-weight:500;border:none;cursor:pointer;` appended after `styleStr` may silently clash with user-set values. Ensure hardcoded export extras do not override user styles.

- [x] **#5 – `export.js` – empty form-children wrapper always emits `margin-bottom:12px`**
  Produces a blank gap when no children exist. Guard the wrapper `<div>` with `c.children && c.children.length`.

- [x] **#6 – `export.js` – image placeholder `background-color:transparent` from `styleStr` clashes with placeholder background**
  User style `background-color:transparent` overwrites the placeholder's `#e5e7eb` background. Strip or override `backgroundColor` from `styleStr` when rendering the placeholder path.

- [x] **#7 – `components.js` – `renderChildComponent` missing cases for complex types**
  `form`, `container`, `navbar`, `hero`, `card`, and `video` are not handled and silently return `''` if moved into a form. Either add cases or restrict which types can become children.

- [x] **#8 – `app.js` – `moveComponentToChild` accepts any component type**
  No type check prevents dropping a `form`, `navbar`, or `hero` inside another form, which then renders blank. Restrict accepted child types to the set that `renderChildComponent` actually handles.

- [x] **#9 – `dragDrop.js` – a form can be dropped into itself**
  `moveComponentToChild(formId, childId)` has no guard for `formId === childId`. Add an early return when they match.

- [x] **#10 – `dragDrop.js` – Backspace deletes selected component while user types in an unrelated field**
  The `document.activeElement === document.body` check is fragile with Tab navigation. Consider accepting only `Delete` (not `Backspace`) for component deletion, or additionally check that no input/textarea/select is focused anywhere.

- [x] **#11 – `properties.js` – colour inputs display `#ffffff` when `backgroundColor` is `transparent`**
  Editing then forces a real colour, silently dropping `transparent`. Show the real current value (or add a "transparent" toggle) so the round-trip is lossless.

- [x] **#12 – `properties.js` / `components.js` – `fontSize` text input produces invalid CSS**
  `applyStylesToEl` appends `px` only when the value is not a string. The input always returns a string, so typing `24` produces `font-size: 24` (no unit). Auto-append `px` when the value is a bare number string, or validate the input.

- [x] **#13 – `properties.js` – swapping a form field type (`text` → `textarea`) doesn't rebuild the properties panel**
   The `change` handler calls `App.render()` but not `updatePropertiesPanel()`, so the layout of placeholder/label fields in the panel stays stale. Add a `updatePropertiesPanel()` call.

- [x] **#14 – `components.js` – `container` renders no placeholder text in edit mode**
   `createComponentHTML` returns `''` for containers, leaving an empty visual box with no affordance. Render a visible "Drop content here" hint inside the container in edit mode.

- [x] **#15 – `dragDrop.js` – three duplicate `document.addEventListener('dragover', …)` registrations**
   `DragDrop.init` registers multiple document-level `dragover` and `drop` handlers. Consolidate into single handlers with internal branching to avoid event-order surprises and redundant calls.

- [x] **#16 – `components.js` – `renderChildComponent` `onclick="return false"` left on canvas anchors**
   Intentional for edit mode, but confirm it is never leaked into the export path (currently it isn't, but worth a test).

- [x] **#17 – `index.html` / `builder.css` – Delete button inside properties panel uses top-bar danger styling**
   `.tb-btn-danger` was designed for the translucent top bar. The in-panel Delete button should use a solid red variant so it is clearly visible against the dark panel background.

---

## 🟡 UX / Feature Gaps

- [ ] **#18 – No undo / redo**
  All changes are immediate and irreversible. Implement a history stack (push state before each mutating `App` call; expose `App.undo()` bound to Ctrl+Z).

- [x] **#19 – No autosave to `localStorage`**
   Refreshing the page loses all work. Serialize `App.components` to `localStorage` on every `render()` and restore on `DOMContentLoaded`.

- [x] **#20 – `container` component does not accept child drops**
   Containers visually imply grouping but have no drop-zone. Implement child-drop support for containers, mirroring the form's `.comp-form-children` zone.

- [ ] **#21 – Navbar links and form fields cannot be removed from the properties panel**
  Users can add links/fields but there is no delete button per-row. Add a remove button for each navbar link row and each form field row.

- [ ] **#22 – No keyboard navigation between canvas components**
  Arrow keys or Tab should cycle selection through placed components.

- [x] **#23 – Clear button is barely visible in the top bar**
   `.tb-btn-danger` renders as faint reddish text on the dark gradient header. Increase contrast or use a more distinctive treatment.

- [x] **#24 – Preview mode UX is jarring**
   The top bar fades to 30% opacity but remains interactive. Consider a full-screen preview overlay with a clear "Exit Preview" button instead.

---

## 🟠 Code Quality

- [ ] **#25 – Mixed `var` / `const` / `let` throughout**
  `components.js` uses `const` inside `escapeHtml`; everything else uses `var`. Standardise on `const`/`let` (all target browsers support ES6).

- [ ] **#26 – `App.nextId` getter has a side effect (increments `_nextId` on read)**
  Referencing `App.nextId` twice silently burns two IDs. Rename to a method `App.allocId()` to make the side effect explicit.

- [ ] **#27 – `styleToCSS` in `export.js` is defined but never used**
  The function is defined at module level but the same logic is duplicated inline in `renderComponentForExport` and `renderChildForExport`. Remove the dead function or refactor to use it everywhere.

- [ ] **#28 – Sidebar HTML is hand-written instead of driven by `COMPONENT_META`**
  Component type names and categories are duplicated between `index.html` and `COMPONENT_META` in `components.js`. Generate the sidebar from `COMPONENT_META` in JS to keep them in sync.

- [ ] **#29 – Inline styles in `properties.js` should live in `builder.css`**
  `style="flex:1"`, `style="margin-top:8px;"`, and delete-option-button styles are all inline in JS strings. Move them to `builder.css` classes.

- [ ] **#30 – No error handling around `Blob` / `URL.createObjectURL` in `export.js`**
  Wrap the export logic in a `try/catch` and surface a user-friendly message on failure.

- [ ] **#31 – Accessibility gaps**
  - Icon-only buttons (responsive toggles, component delete `×`) have no `aria-label`.
  - No keyboard-accessible drag and drop.
  - Properties panel `<label>` elements are not associated to their inputs via `for`/`id` pairs.

- [ ] **#32 – `plan.md` references `testSite/` but project folder is `siteBuilder/`**
  Update the project structure section in `plan.md` to reflect the actual folder name.

- [ ] **#33 – `README.md` data model section says "10 component types" but 14 are listed**
  Update the count to match the actual component library.

---

## 🔵 Nice-to-have / Future

- [ ] **#34 – Exported HTML has generic `<title>My Site</title>`**
  Allow the user to set a page title (and optionally a description meta tag) before exporting.

- [ ] **#35 – Export to external CSS file option**
  Offer a "Export as HTML + CSS" zip download in addition to the current single-file inline-style output.

- [ ] **#36 – Re-import exported HTML to resume editing**
  Parse an exported file back into `App.components` so projects can be reopened.

- [ ] **#37 – Multi-select and group move**
  Allow Shift+click to select multiple components and move or delete them together.
