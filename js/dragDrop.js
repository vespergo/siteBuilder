var DragDrop = {
  draggedComponentId: null,
  isSidebarDrag: false,
  dragType: null,
  targetFormId: null,

  init: function() {
    var self = this;
    var sidebarItems = document.querySelectorAll('.component-item');
    for (var i = 0; i < sidebarItems.length; i++) {
      sidebarItems[i].addEventListener('dragstart', function(e) { self.onSidebarDragStart(e); });
    }

    var canvas = document.getElementById('canvas');

    canvas.addEventListener('dragover', function(e) { self.onCanvasDragOver(e); });
    canvas.addEventListener('drop', function(e) { self.onCanvasDrop(e); });
    canvas.addEventListener('dragleave', function(e) { self.onCanvasDragLeave(e); });

    document.addEventListener('dragstart', function(e) {
      var compEl = e.target.closest('.canvas-component');
      if (compEl && !self.isSidebarDrag) {
        self.onComponentDragStart(e, compEl);
      }
    });

    document.addEventListener('dragend', function(e) {
      self.onDragEnd();
    });

    canvas.addEventListener('click', function(e) {
      if (e.target === canvas || e.target.id === 'canvas-placeholder' || e.target.closest('#canvas-placeholder')) {
        App.deselectAll();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        var sel = App.getSelected();
        if (sel && document.activeElement === document.body) {
          App.deleteComponent(sel.id);
        }
      }
      if (e.key === 'Escape') {
        App.deselectAll();
      }
    });

    document.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
      e.preventDefault();
    });

    document.addEventListener('dragover', function(e) {
      var dropZone = e.target.closest('.comp-form-children');
      if (dropZone) {
        e.preventDefault();
        if (self.isSidebarDrag) {
          e.dataTransfer.dropEffect = 'copy';
        } else {
          e.dataTransfer.dropEffect = 'move';
        }
        dropZone.classList.add('drop-active');
      }
    });

    document.addEventListener('dragleave', function(e) {
      var dropZone = e.target.closest('.comp-form-children');
      if (dropZone && !dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drop-active');
      }
    });

    document.addEventListener('drop', function(e) {
      var dropZone = e.target.closest('.comp-form-children');
      if (dropZone) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drop-active');
        var formId = dropZone.getAttribute('data-form-id');
        if (formId) {
          if (self.isSidebarDrag && self.dragType) {
            App.addComponentAsChild(formId, self.dragType);
          } else if (self.draggedComponentId) {
            var childComp = self.draggedComponentId;
            App.moveComponentToChild(formId, childComp);
          }
        }
        self.draggedComponentId = null;
        self.isSidebarDrag = false;
        self.dragType = null;
      }
    });
  },

  onSidebarDragStart: function(e) {
    this.isSidebarDrag = true;
    this.dragType = e.target.closest('.component-item').getAttribute('data-component-type');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', this.dragType);

    var ghost = document.createElement('div');
    ghost.style.cssText = 'position:fixed;left:-9999px;top:-9999px;padding:8px 16px;background:#3b82f6;color:#fff;border-radius:4px;font-size:13px;z-index:9999;';
    ghost.textContent = COMPONENT_META[this.dragType].label;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(function() { ghost.remove(); }, 0);
  },

  onComponentDragStart: function(e, compEl) {
    this.isSidebarDrag = false;
    this.draggedComponentId = compEl.getAttribute('data-component-id');
    compEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'reorder:' + this.draggedComponentId);
  },

  onCanvasDragOver: function(e) {
    e.preventDefault();
    
    var dropZone = e.target.closest('.comp-form-children');
    if (dropZone) {
      e.dataTransfer.dropEffect = this.isSidebarDrag ? 'copy' : 'move';
      return;
    }

    if (this.isSidebarDrag) {
      e.dataTransfer.dropEffect = 'copy';
      return;
    }

    if (this.draggedComponentId) {
      e.dataTransfer.dropEffect = 'move';
      var canvas = document.getElementById('canvas');
      var comps = canvas.querySelectorAll('.canvas-component:not(.dragging)');
      var closestIdx = this.getDropIndex(e.clientY, comps);

      for (var i = 0; i < comps.length; i++) {
        comps[i].classList.remove('drag-over');
      }
      if (closestIdx >= 0 && closestIdx < comps.length) {
        comps[closestIdx].classList.add('drag-over');
      }
    }
  },

  onCanvasDragLeave: function(e) {
    var canvas = document.getElementById('canvas');
    var dropZone = e.target.closest('.comp-form-children');
    if (dropZone) return;
    if (!canvas.contains(e.relatedTarget)) {
      var comps = canvas.querySelectorAll('.canvas-component');
      for (var i = 0; i < comps.length; i++) {
        comps[i].classList.remove('drag-over');
      }
    }
  },

  onCanvasDrop: function(e) {
    e.preventDefault();
    var canvas = document.getElementById('canvas');

    var dropZone = e.target.closest('.comp-form-children');
    if (dropZone) return;

    var comps = canvas.querySelectorAll('.canvas-component');
    for (var i = 0; i < comps.length; i++) {
      comps[i].classList.remove('drag-over');
    }

    if (this.isSidebarDrag && this.dragType) {
      App.addComponent(this.dragType);
    } else if (this.draggedComponentId) {
      var compsArr = canvas.querySelectorAll('.canvas-component:not(.dragging)');
      var targetIdx = this.getDropIndex(e.clientY, compsArr);
      App.reorderComponent(this.draggedComponentId, targetIdx);
    }

    this.draggedComponentId = null;
    this.isSidebarDrag = false;
    this.dragType = null;
  },

  onDragEnd: function() {
    var comps = document.querySelectorAll('.canvas-component');
    for (var i = 0; i < comps.length; i++) {
      comps[i].classList.remove('dragging', 'drag-over');
    }
    this.draggedComponentId = null;
    this.isSidebarDrag = false;
    this.dragType = null;
  },

  getDropIndex: function(clientY, compEls) {
    for (var i = 0; i < compEls.length; i++) {
      var rect = compEls[i].getBoundingClientRect();
      var mid = rect.top + rect.height / 2;
      if (clientY < mid) return i;
    }
    return compEls.length;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  DragDrop.init();
});