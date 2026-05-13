function updatePropertiesPanel() {
  var emptyEl = document.getElementById('props-empty');
  var contentEl = document.getElementById('props-content');
  var typeLabel = document.getElementById('props-type');
  var contentFields = document.getElementById('props-content-fields');
  var styleFields = document.getElementById('props-style-fields');

  var comp = App.getSelected();

  if (!comp) {
    emptyEl.style.display = '';
    contentEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  contentEl.style.display = '';

  typeLabel.textContent = COMPONENT_META[comp.type].label;

  contentFields.innerHTML = buildContentFields(comp);
  styleFields.innerHTML = buildStyleFields(comp);

  attachFieldListeners();
}

function buildContentFields(comp) {
  var c = comp.content;
  var html = '';

  switch (comp.type) {
    case 'heading':
      html += fieldTextarea('text', 'Text', c.text);
      html += fieldSelect('level', 'Level',
        ['h1','h2','h3','h4','h5','h6'].map(function(v) {
          return '<option value="' + v + '"' + (c.level === v ? ' selected' : '') + '>' + v.toUpperCase() + '</option>';
        }).join(''));
      break;

    case 'paragraph':
      html += fieldTextarea('text', 'Text', c.text);
      break;

    case 'button':
      html += fieldInput('text', 'text', 'Button Text', c.text);
      html += fieldInput('url', 'text', 'Link URL', c.url);
      break;

    case 'image':
      html += fieldInput('src', 'text', 'Image URL', c.src);
      html += fieldInput('alt', 'text', 'Alt Text', c.alt);
      html += '<div class="props-field-inline">';
      html += fieldInput('width', 'number', 'Width (px)', c.width);
      html += fieldInput('height', 'number', 'Height (px)', c.height);
      html += '</div>';
      break;

    case 'video':
      html += fieldInput('src', 'text', 'Embed URL', c.src);
      html += '<div class="props-field-inline">';
      html += fieldInput('width', 'number', 'Width (px)', c.width);
      html += fieldInput('height', 'number', 'Height (px)', c.height);
      html += '</div>';
      break;

    case 'navbar':
      html += fieldInput('brand', 'text', 'Brand Name', c.brand);
      if (c.links) {
        for (var i = 0; i < c.links.length; i++) {
          html += '<div class="props-field-inline">';
          html += fieldInput('linkText' + i, 'text', 'Link ' + (i+1), c.links[i].text);
          html += fieldInput('linkUrl' + i, 'text', 'URL', c.links[i].url);
          html += '</div>';
        }
      }
      break;

    case 'hero':
      html += fieldInput('heading', 'text', 'Heading', c.heading);
      html += fieldTextarea('subtext', 'Subtitle', c.subtext);
      html += fieldInput('cta', 'text', 'Button Text', c.cta);
      html += fieldInput('ctaUrl', 'text', 'Button URL', c.ctaUrl);
      break;

    case 'card':
      html += fieldInput('image', 'text', 'Image URL', c.image);
      html += fieldInput('title', 'text', 'Title', c.title);
      html += fieldTextarea('body', 'Body Text', c.body);
      html += fieldInput('cta', 'text', 'Button Text', c.cta);
      html += fieldInput('ctaUrl', 'text', 'Button URL', c.ctaUrl);
      break;

    case 'form':
      html += fieldInput('title', 'text', 'Title', c.title);
      html += fieldInput('submitText', 'text', 'Submit Text', c.submitText);
      if (c.fields) {
        for (var j = 0; j < c.fields.length; j++) {
          html += '<div class="props-field-inline">';
          html += fieldInput('fieldLabel' + j, 'text', 'Label', c.fields[j].label);
          html += fieldSelect('fieldType' + j, '',
            ['text','email','textarea'].map(function(v) {
              return '<option value="' + v + '"' + (c.fields[j].type === v ? ' selected' : '') + '>' + v + '</option>';
            }).join(''));
          html += '</div>';
          html += fieldInput('fieldPlaceholder' + j, 'text', 'Placeholder', c.fields[j].placeholder);
        }
      }
      // Add button to append new field
      html += '<button type="button" id="add-form-field" style="margin-top:8px;">Add Field</button>';
      break;

    case 'container':
      break;
  }

  return html;
}

function buildStyleFields(comp) {
  var s = comp.styles;
  var html = '';

  html += '<div class="props-field props-field-inline">';
  html += '<div><label>Text Color</label><input type="color" data-style="color" value="' + (s.color || '#111827') + '"></div>';
  html += '<div><label>Background</label><input type="color" data-style="backgroundColor" value="' + (s.backgroundColor || '#ffffff') + '"></div>';
  html += '</div>';

  html += fieldInput('fontSize', 'text', 'Font Size', s.fontSize);

  html += '<div class="props-field-inline">';
  html += fieldInput('padding', 'text', 'Padding', s.padding);
  html += fieldInput('margin', 'text', 'Margin', s.margin);
  html += '</div>';

  html += fieldAlignButtons(s.textAlign || 'left');

  if (comp.type === 'button' || comp.type === 'card') {
    html += fieldInput('borderRadius', 'text', 'Border Radius', s.borderRadius || '');
  }

  return html;
}

function fieldInput(name, type, label, value) {
  return '<div class="props-field"><label>' + label + '</label><input type="' + type + '" data-field="' + name + '" value="' + escapeAttr(String(value)) + '"></div>';
}

function fieldTextarea(name, label, value) {
  return '<div class="props-field"><label>' + label + '</label><textarea data-field="' + name + '" rows="3">' + escapeHtml(String(value)) + '</textarea></div>';
}

function fieldSelect(name, label, optionsHTML) {
  return '<div class="props-field"><label>' + label + '</label><select data-field="' + name + '">' + optionsHTML + '</select></div>';
}

function fieldAlignButtons(current) {
  var btns = [
    { val: 'left', label: '\u2190' },
    { val: 'center', label: '\u2194' },
    { val: 'right', label: '\u2192' }
  ];
  var html = '<div class="props-field"><label>Alignment</label><div class="align-buttons">';
  for (var i = 0; i < btns.length; i++) {
    html += '<button class="align-btn' + (current === btns[i].val ? ' active' : '') + '" data-align="' + btns[i].val + '">' + btns[i].label + '</button>';
  }
  html += '</div></div>';
  return html;
}

function attachFieldListeners() {
  var contentFields = document.getElementById('props-content-fields');
  var styleFields = document.getElementById('props-style-fields');

  if (contentFields._bound) return;
  contentFields._bound = true;

  contentFields.addEventListener('input', function(e) {
    var el = e.target;
    var name = el.getAttribute('data-field');
    if (!name) return;

    var comp = App.getSelected();
    if (!comp) return;

    if (name.indexOf('linkText') === 0) {
      var idx = parseInt(name.replace('linkText', ''));
      comp.content.links[idx].text = el.value;
      App.render();
      return;
    }
    if (name.indexOf('linkUrl') === 0) {
      var idx2 = parseInt(name.replace('linkUrl', ''));
      comp.content.links[idx2].url = el.value;
      App.render();
      return;
    }
    if (name.indexOf('fieldLabel') === 0) {
      var idx3 = parseInt(name.replace('fieldLabel', ''));
      comp.content.fields[idx3].label = el.value;
      App.render();
      return;
    }
    if (name.indexOf('fieldPlaceholder') === 0) {
      var idx4 = parseInt(name.replace('fieldPlaceholder', ''));
      comp.content.fields[idx4].placeholder = el.value;
      App.render();
      return;
    }

    var update = {};
    if (name === 'width' || name === 'height') {
      update[name] = parseInt(el.value) || 0;
    } else {
      update[name] = el.value;
    }
    App.updateContent(update);
  });

  contentFields.addEventListener('change', function(e) {
    var el = e.target;
    var name = el.getAttribute('data-field');
    if (!name) return;

    var comp = App.getSelected();
    if (!comp) return;

    if (name.indexOf('fieldType') === 0) {
      var idx = parseInt(name.replace('fieldType', ''));
      comp.content.fields[idx].type = el.value;
      App.render();
      return;
    }

    if (el.tagName === 'SELECT') {
      var update2 = {};
      update2[name] = el.value;
      App.updateContent(update2);
    }
  });

  styleFields.addEventListener('input', function(e) {
    var el = e.target;
    var key = el.getAttribute('data-style');
    if (!key) return;
    var update = {};
    update[key] = el.value;
    App.updateStyles(update);
  });

  styleFields.addEventListener('click', function(e) {
    var btn = e.target.closest('.align-btn');
    if (!btn) return;
    var align = btn.getAttribute('data-align');
    App.updateStyles({ textAlign: align });

    var buttons = styleFields.querySelectorAll('.align-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  // Listener for adding new form fields via the Add Field button
  contentFields.addEventListener('click', function(e) {
    var btn = e.target.closest('#add-form-field');
    if (!btn) return;
    var comp = App.getSelected();
    if (!comp) return;
    if (!comp.content.fields) comp.content.fields = [];
    comp.content.fields.push({ label: 'New Field', type: 'text', placeholder: '' });
    // Re-render canvas and refresh properties panel to show new field inputs
    App.render();
    updatePropertiesPanel();
  });
}

document.getElementById('btn-delete-component').addEventListener('click', function() {
  var comp = App.getSelected();
  if (comp) App.deleteComponent(comp.id);
});