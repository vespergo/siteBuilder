# 🧱 Site Builder

A lightweight, **drag-and-drop website builder** built with plain HTML, CSS, and JavaScript — no frameworks, no npm, no CDN required.

Open `index.html` in any modern browser and start building.

---

## ✨ Features

- **Drag & drop** components from the sidebar onto the canvas
- **Live property editing** — update content and styles in the right-hand panel
- **Responsive preview** — switch between Desktop, Tablet, and Mobile views
- **Export** your design as a fully self-contained `.html` file
- **Zero dependencies** — no build step, no internet connection needed

---

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. Drag components onto the canvas and start building!

```bash
# No installation needed — just open the file
open index.html
```

---

## 🖱️ Usage

| Action | How |
|---|---|
| **Add component** | Drag from the left sidebar onto the canvas |
| **Select component** | Click on it (a blue border appears) |
| **Edit content** | Select a component, then edit fields in the right Properties panel |
| **Edit styles** | Adjust colors, font size, padding, margin, and alignment in the Properties panel |
| **Delete component** | Click the red **×** button, or press the `Delete` key when selected |
| **Reorder components** | Drag a component up or down within the canvas |
| **Preview** | Click **Preview** in the top bar to hide the builder chrome |
| **Responsive view** | Click the 🖥️ / 📱 icons in the top bar to constrain the canvas width |
| **Export** | Click **Export HTML** to download a self-contained `.html` file |
| **Clear canvas** | Click **Clear** to reset and start over |

---

## 🧩 Component Library

Components are organised into groups in the sidebar:

### Typography
| Component | Description |
|---|---|
| **Heading** | `<h1>`–`<h6>` with editable text and level selector |
| **Paragraph** | `<p>` block with editable lorem ipsum text |

### Interactive
| Component | Description |
|---|---|
| **Button** | Styled link/button with editable label and URL |
| **Form** | Pre-built form with name, email, message fields and a submit button |

### Form Elements
| Component | Description |
|---|---|
| **Input** | Single-line text input |
| **Textarea** | Multi-line text area |
| **Label** | Form label element |
| **Select** | Dropdown select element |

### Sections
| Component | Description |
|---|---|
| **Container** | Empty `<div>` block (background, border, padding styling) |
| **Navbar** | Brand name + 3 navigation links |
| **Hero** | Large heading, subtitle, and a CTA button |
| **Card** | Image, title, body text, and a CTA link |

### Media
| Component | Description |
|---|---|
| **Image** | `<img>` with URL source or a placeholder box |
| **Video** | `<iframe>` embed or a placeholder box |

---

## 📁 Project Structure

```
siteBuilder/
├── index.html              # App shell: top bar, sidebar, canvas, properties panel
├── css/
│   ├── builder.css         # Builder UI chrome (layout, panels, controls)
│   └── components.css      # Styles for rendered components on the canvas
└── js/
    ├── components.js       # Component definitions, defaults, and rendering logic
    ├── app.js              # Global App state, render cycle, and lifecycle hooks
    ├── dragDrop.js         # Drag from sidebar → canvas; reorder within canvas
    ├── properties.js       # Right-panel property editors (content + style fields)
    ├── export.js           # Serialises the canvas to a downloadable .html file
    └── responsive.js       # Desktop / Tablet / Mobile preview toggle
```

### JavaScript Dependency Order

```
components.js   →  defines escapeHtml, COMPONENT_META, createComponentElement
    ↓
app.js          →  defines App global state, calls createComponentElement
    ↓
dragDrop.js     →  manages DnD, calls App methods
properties.js   →  builds property panel, calls App methods
export.js       →  generates download, reads App.components
responsive.js   →  handles preview & responsive modes
```

---

## 🗂️ Data Model

Each component placed on the canvas is represented as a plain JavaScript object:

```js
{
  id: "c1",                        // Auto-generated unique ID
  type: "heading",                 // One of the component type keys
  content: { text: "Hello!", level: "h2" },  // Type-specific content fields
  styles:  { color: "#111", fontSize: "2rem" }  // CSS style overrides
}
```

---

## ⚠️ Known Limitations

- **No undo / redo** — changes are immediate and irreversible
- **No nested components** — containers do not accept child drops
- **Single page only** — no multi-page support
- **No project save** — use *Export HTML* to preserve your work; re-importing is not yet supported
- **Image & video URLs must be absolute** — local file upload is not supported

---

## 🛠️ Browser Support

Any modern browser with HTML5 Drag and Drop API support:

| Browser | Support |
|---|---|
| Chrome 80+ | ✅ |
| Firefox 75+ | ✅ |
| Edge 80+ | ✅ |
| Safari 13+ | ✅ |

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute it.
