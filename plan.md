# Site Builder - Drag & Drop Website Builder

## Overview
A plain HTML/CSS/JS drag-and-drop website builder. Select components from the sidebar, drop them onto the canvas, edit properties, and export as a standalone HTML file.

**No dependencies. No npm. No CDN.** Just open `index.html` in a browser.

## Project Structure
```
testSite/
├── index.html              # Main page: top bar, sidebar, canvas, properties panel
├── css/
│   ├── builder.css         # Builder chrome styles (layout, panels, controls)
│   └── components.css      # Styles for rendered components on canvas
└── js/
    ├── components.js        # Component definitions, content defaults, rendering
    ├── app.js              # Global state (App object), render cycle, lifecycle
    ├── dragDrop.js         # Drag from sidebar→canvas, reorder within canvas, selection
    ├── properties.js       # Right panel property editors (content + style fields)
    ├── export.js           # Serialize canvas → downloadable .html file
    └── responsive.js       # Desktop/Tablet/Mobile preview toggle, preview mode
```

## How to Run
1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. No server needed — it's a static HTML file

## Usage
| Action | How |
|--------|-----|
| Add component | Drag from sidebar palette onto the canvas |
| Select component | Click on it (blue border appears) |
| Edit content | Select a component, edit fields in the right properties panel |
| Edit styles | Change colors, font size, padding/margin, alignment in properties panel |
| Delete component | Click the red × button, or press Delete key when selected |
| Reorder | Drag a component up/down within the canvas |
| Preview | Click "Preview" in top bar to hide builder chrome |
| Responsive | Click Desktop/Tablet/Mobile icons to constrain canvas width |
| Export | Click "Export HTML" to download as a self-contained .html file |
| Clear all | Click "Clear" to reset the canvas |

## Data Model
Each component is a JS object:
```
{
  id: "c1",                    // Auto-generated unique ID
  type: "heading",             // One of the 10 component types
  content: { text: "...", ... },  // Type-specific content fields
  styles: { color: "#...", ... }  // CSS style properties
}
```

## Component Types
| Type | Default Content |
|------|----------------|
| heading | h2 with editable text and heading level (h1-h6) |
| paragraph | p with lorem ipsum text |
| button | Styled link/button with text and URL |
| container | Empty div block (background, border styling) |
| navbar | Brand name + 3 navigation links |
| hero | Large heading, subtitle, CTA button |
| card | Image, title, body text, CTA |
| form | Title, name/email/message fields, submit button |
| image | img with URL source or placeholder box |
| video | iframe embed or placeholder box |

## JavaScript File Dependencies
```
components.js (defines escapeHtml, COMPONENT_META, createComponentElement)
   ↓
app.js (defines App global state, calls createComponentElement)
   ↓
dragDrop.js (manages DnD, calls App methods)
properties.js (builds property panel, calls App methods)
export.js (generates download, reads App.components)
responsive.js (handles preview/responsive, calls App methods)
```

## Known Limitations
- No undo/redo
- No nested components (containers don't accept child drops)
- Single page only (no multi-page support)
- No saved projects (must re-import exported HTML)
- Image/video URLs must be absolute (no file upload)