var App = {
  components: [],
  selectedId: null,
  _nextId: 1,
  previewMode: false,
  responsiveMode: 'desktop',

  get nextId() {
    return 'c' + (this._nextId++);
  },

  addComponent: function(type) {
    var comp = {
      id: this.nextId,
      type: type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    this.components.push(comp);
    this.selectComponent(comp.id);
  },

  selectComponent: function(id) {
    this.selectedId = id;
    this.render();
    updatePropertiesPanel();
  },

  deselectAll: function() {
    this.selectedId = null;
    this.render();
    updatePropertiesPanel();
  },

  getSelected: function() {
    var self = this;
    for (var i = 0; i < self.components.length; i++) {
      if (self.components[i].id === self.selectedId) return self.components[i];
    }
    return null;
  },

  deleteComponent: function(id) {
    this.components = this.components.filter(function(c) { return c.id !== id; });
    if (this.selectedId === id) this.selectedId = null;
    this.render();
    updatePropertiesPanel();
  },

  updateContent: function(updates) {
    var comp = this.getSelected();
    if (comp) {
      for (var key in updates) {
        if (updates.hasOwnProperty(key)) comp.content[key] = updates[key];
      }
      this.render();
    }
  },

  updateStyles: function(updates) {
    var comp = this.getSelected();
    if (comp) {
      for (var key in updates) {
        if (updates.hasOwnProperty(key)) comp.styles[key] = updates[key];
      }
      this.render();
    }
  },

  reorderComponent: function(fromId, toIndex) {
    var fromIdx = -1;
    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i].id === fromId) { fromIdx = i; break; }
    }
    if (fromIdx === -1) return;
    var comp = this.components.splice(fromIdx, 1)[0];
    if (toIndex > fromIdx) toIndex--;
    this.components.splice(toIndex, 0, comp);
    this.render();
  },

  addComponentAsChild: function(parentId, type) {
    var parent = this.findComponent(parentId);
    if (!parent || (parent.type !== 'form' && parent.type !== 'container')) return;
    var child = {
      id: this.nextId,
      type: type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    if (!parent.content.children) parent.content.children = [];
    parent.content.children.push(child);
    this.selectComponent(parentId);
    this.render();
  },

  findComponent: function(id) {
    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i].id === id) return this.components[i];
    }
    return null;
  },

  moveComponentToChild: function(parentId, childId) {
    // Prevent form from being dropped into itself
    if (parentId === childId) return;
    
    var parent = this.findComponent(parentId);
    if (!parent || (parent.type !== 'form' && parent.type !== 'container')) return;
    
    var child = this.findComponent(childId);
    if (!child) return;
    
    // Restrict which component types can become children
    var allowedChildTypes = ['heading', 'paragraph', 'button', 'input', 'textarea', 'label', 'select', 'image'];
    if (parent.type === 'container') {
      // Containers accept all component types except other containers (to avoid deep nesting)
      if (child.type === 'container') {
        alert('Cannot nest a container inside another container.');
        return;
      }
    } else if (allowedChildTypes.indexOf(child.type) === -1) {
      alert('This component type cannot be placed inside a form.');
      return;
    }
    
    this.components = this.components.filter(function(c) { return c.id !== childId; });
    if (!parent.content.children) parent.content.children = [];
    parent.content.children.push(child);
    this.selectComponent(parentId);
    this.render();
  },

  deleteChildComponent: function(parentId, childId) {
    var parent = this.findComponent(parentId);
    if (!parent || !parent.content.children) return;
    parent.content.children = parent.content.children.filter(function(c) { return c.id !== childId; });
    this.render();
  },

  render: function() {
    var canvas = document.getElementById('canvas');
    var ph = document.getElementById('canvas-placeholder');

    var existing = canvas.querySelectorAll('.canvas-component');
    for (var i = 0; i < existing.length; i++) {
      existing[i].remove();
    }

    if (this.components.length === 0) {
      if (ph) ph.style.display = '';
      return;
    }

    if (ph) ph.style.display = 'none';

    for (var i = 0; i < this.components.length; i++) {
      var el = createComponentElement(this.components[i]);
      canvas.appendChild(el);
    }
    this.saveToLocalStorage();
  },

  clearAll: function() {
    var self = this;
    if (self.components.length === 0) return;
    if (confirm('Clear the entire canvas? This cannot be undone.')) {
      self.components = [];
      self.selectedId = null;
      self.render();
      updatePropertiesPanel();
      // Ensure localstorage clears out too immediately
      self.saveToLocalStorage();
    }
  },

  togglePreview: function() {
    this.previewMode = !this.previewMode;
    if (this.previewMode) {
      document.body.classList.add('preview-mode');
      document.getElementById('btn-preview').textContent = 'Edit';
    } else {
      document.body.classList.remove('preview-mode');
      document.getElementById('btn-preview').textContent = 'Preview';
    }
  },

  saveToLocalStorage: function() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('project');
      const storageKey = projectId ? 'siteBuilderComponents_' + projectId : 'siteBuilderComponents';
      localStorage.setItem(storageKey, JSON.stringify(this.components));

      // Also update project count/date in projects list if this is a named project
      if (projectId) {
          const projectsJson = localStorage.getItem('siteBuilderProjects');
          if (projectsJson) {
              const projects = JSON.parse(projectsJson);
              const pIdx = projects.findIndex(p => p.id === projectId);
              if (pIdx !== -1) {
                  projects[pIdx].lastModified = new Date().toISOString();
                  projects[pIdx].componentCount = this.components.length;
                  localStorage.setItem('siteBuilderProjects', JSON.stringify(projects));
              }
          }
      }
    } catch (e) {}
  },

  loadFromLocalStorage: function() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('project');
      const storageKey = projectId ? 'siteBuilderComponents_' + projectId : 'siteBuilderComponents';
      var saved = localStorage.getItem(storageKey);
      
      // Fallback to legacy single project if none found
      if (!saved && projectId) {
          saved = localStorage.getItem('siteBuilderComponents');
      }

      if (saved) {
        this.components = JSON.parse(saved);
      }
    } catch (e) {
      this.components = [];
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  App.loadFromLocalStorage();
  App.render();
});