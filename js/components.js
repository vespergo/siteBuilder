function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

var COMPONENT_META = {
  input: { label: 'Input', category: 'Form Elements' },
  textarea: { label: 'Textarea', category: 'Form Elements' },
  label: { label: 'Label', category: 'Form Elements' },
  select: { label: 'Select', category: 'Form Elements' },
  heading: { label: 'Heading', category: 'Typography' },
  paragraph: { label: 'Paragraph', category: 'Typography' },
  button: { label: 'Button', category: 'Interactive' },
  form: { label: 'Form', category: 'Interactive' },
  container: { label: 'Container', category: 'Sections' },
  navbar: { label: 'Navbar', category: 'Sections' },
  hero: { label: 'Hero', category: 'Sections' },
  card: { label: 'Card', category: 'Sections' },
  image: { label: 'Image', category: 'Media' },
  video: { label: 'Video', category: 'Media' }
};

function getDefaultContent(type) {
  switch (type) {
    case 'heading': return { text: 'Heading Text', level: 'h2' };
    case 'paragraph': return { text: 'This is a paragraph. Click to select and edit the text in the properties panel.' };
    case 'button': return { text: 'Click Me', url: '#' };
    case 'container': return {};
    case 'navbar': return {
      brand: 'Brand',
      links: [
        { text: 'Home', url: '#' },
        { text: 'About', url: '#' },
        { text: 'Contact', url: '#' }
      ]
    };
    case 'hero': return {
      heading: 'Welcome to My Site',
      subtext: 'A catchy subtitle describing your site goes right here.',
      cta: 'Get Started',
      ctaUrl: '#'
    };
    case 'card': return {
      image: '',
      title: 'Card Title',
      body: 'Card description goes here. A brief summary of the card content.',
      cta: 'Learn More',
      ctaUrl: '#'
    };
    case 'form': return {
      title: '',
      fields: [],
      submitText: 'Send',
      children: []
    };
    case 'input': return { placeholder: 'Enter text', type: 'text', label: '' };
    case 'textarea': return { placeholder: 'Enter text', rows: 3, label: '' };
    case 'label': return { text: 'Label' };
    case 'select': return { options: [{ value: '', text: 'Option' }] };
    case 'image': return { src: '', alt: 'Image description', width: 400, height: 300 };
    case 'video': return { src: '', width: 560, height: 315 };
    default: return {};
  }
}

function getDefaultStyles(type) {
  var base = {
    padding: '16px',
    margin: '8px 0',
    textAlign: 'left',
    color: '#111827',
    backgroundColor: 'transparent',
    fontSize: '16px'
  };

  switch (type) {
    case 'heading':
      return Object.assign({}, base, { color: '#111827', fontSize: '32px', fontWeight: '700' });
    case 'paragraph':
      return Object.assign({}, base, { color: '#374151', fontSize: '16px', lineHeight: '1.6' });
    case 'button':
      return Object.assign({}, base, {
        color: '#ffffff', backgroundColor: '#3b82f6', fontSize: '16px',
        padding: '12px 24px', borderRadius: '6px', fontWeight: '500',
        border: 'none', display: 'inline-block', textDecoration: 'none'
      });
    case 'container':
      return Object.assign({}, base, {
        padding: '32px', margin: '0', backgroundColor: '#f9fafb',
        border: '1px dashed #d1d5db', minHeight: '80px'
      });
    case 'navbar':
      return Object.assign({}, base, {
        backgroundColor: '#1f2937', color: '#ffffff', padding: '12px 24px',
        fontSize: '16px', margin: '0', display: 'flex'
      });
    case 'hero':
      return Object.assign({}, base, {
        backgroundColor: '#eff6ff', padding: '64px 32px', textAlign: 'center',
        color: '#111827', fontSize: '16px', margin: '0'
      });
    case 'card':
      return Object.assign({}, base, {
        backgroundColor: '#ffffff', padding: '0', borderRadius: '8px',
        color: '#111827', fontSize: '16px', maxWidth: '360px', margin: '8px 0'
      });
    case 'image':
      return Object.assign({}, base, { padding: '0', margin: '8px 0' });
    case 'form':
      return Object.assign({}, base, {
        backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px',
        color: '#111827', fontSize: '16px'
      });
    case 'video':
      return Object.assign({}, base, { padding: '0', margin: '8px 0' });
    case 'input':
    case 'textarea':
    case 'label':
    case 'select':
      return Object.assign({}, base, { padding: '4px 0', margin: '4px 0' });
    default:
      return base;
  }
}

function applyStylesToEl(el, styles) {
  for (var prop in styles) {
    if (!styles.hasOwnProperty(prop)) continue;
    var val = styles[prop];
    if (prop === 'fontSize' && typeof val !== 'string') val = val + 'px';
    try { el.style[prop] = val; } catch(e) {}
  }
}

function renderChildComponent(comp) {
  var c = comp.content;
  switch (comp.type) {
    case 'heading':
      return '<' + c.level + ' class="comp-heading">' + escapeHtml(c.text) + '</' + c.level + '>';
    case 'paragraph':
      return '<p class="comp-paragraph">' + escapeHtml(c.text) + '</p>';
    case 'button':
      return '<a href="' + escapeAttr(c.url) + '" class="comp-button" onclick="return false">' + escapeHtml(c.text) + '</a>';
    case 'input': {
      var labelHTML = c.label ? '<label>' + escapeHtml(c.label) + '</label>' : '';
      return '<div class="comp-input-field">' + labelHTML + '<input type="' + (c.type || 'text') + '" placeholder="' + escapeAttr(c.placeholder || '') + '"></div>';
    }
    case 'textarea': {
      var labelHTML = c.label ? '<label>' + escapeHtml(c.label) + '</label>' : '';
      return '<div class="comp-textarea-field">' + labelHTML + '<textarea placeholder="' + escapeAttr(c.placeholder || '') + '" rows="' + (c.rows || 3) + '"></textarea></div>';
    }
    case 'label':
      return '<label class="comp-label">' + escapeHtml(c.text || '') + '</label>';
    case 'select': {
      var opts = (c.options || []).map(function(o) {
        return '<option value="' + escapeAttr(o.value) + '">' + escapeHtml(o.text) + '</option>';
      }).join('');
      return '<select class="comp-select">' + opts + '</select>';
    }
    case 'image':
      if (c.src) {
        return '<img class="comp-image" src="' + escapeAttr(c.src) + '" alt="' + escapeAttr(c.alt) + '" style="max-width:100%;height:auto;">';
      }
      return '<div class="comp-image-placeholder" style="width:' + (c.width || 400) + 'px;height:' + (c.height || 300) + 'px;">Image Placeholder</div>';
    default:
      return '';
  }
}

function createComponentHTML(comp) {
  var c = comp.content;

  switch (comp.type) {
    case 'heading':
      return '<' + c.level + ' class="comp-heading">' + escapeHtml(c.text) + '</' + c.level + '>';

    case 'paragraph':
      return '<p class="comp-paragraph">' + escapeHtml(c.text) + '</p>';

    case 'button':
      return '<a href="' + escapeAttr(c.url) + '" class="comp-button" onclick="return false">' + escapeHtml(c.text) + '</a>';

    case 'container':
      return '';

    case 'navbar': {
      var linksHTML = (c.links || []).map(function(l) {
        return '<li><a href="' + escapeAttr(l.url) + '" onclick="return false" style="color:inherit;text-decoration:underline;">' + escapeHtml(l.text) + '</a></li>';
      }).join('');
      return '<nav class="comp-navbar">' +
        '<span class="comp-navbar-brand">' + escapeHtml(c.brand) + '</span>' +
        '<ul class="comp-navbar-links">' + linksHTML + '</ul>' +
        '</nav>';
    }

    case 'hero':
      return '<div class="comp-hero">' +
        '<h1 class="comp-hero-heading">' + escapeHtml(c.heading) + '</h1>' +
        '<p class="comp-hero-subtext">' + escapeHtml(c.subtext) + '</p>' +
        '<a href="' + escapeAttr(c.ctaUrl) + '" class="comp-hero-cta" onclick="return false">' + escapeHtml(c.cta) + '</a>' +
        '</div>';

    case 'card': {
      var imgHTML = c.image
        ? '<img src="' + escapeAttr(c.image) + '" alt="card image">'
        : 'Image';
      return '<div class="comp-card">' +
        '<div class="comp-card-image">' + imgHTML + '</div>' +
        '<div class="comp-card-body">' +
        '<h3 class="comp-card-title">' + escapeHtml(c.title) + '</h3>' +
        '<p class="comp-card-text">' + escapeHtml(c.body) + '</p>' +
        '<a href="' + escapeAttr(c.ctaUrl) + '" class="comp-card-cta" onclick="return false">' + escapeHtml(c.cta) + '</a>' +
        '</div></div>';
    }

    case 'image':
      if (c.src) {
        return '<img class="comp-image" src="' + escapeAttr(c.src) + '" alt="' + escapeAttr(c.alt) + '" style="max-width:100%;height:auto;">';
      }
      return '<div class="comp-image-placeholder" style="width:' + (c.width || 400) + 'px;height:' + (c.height || 300) + 'px;">Image Placeholder</div>';

    case 'form': {
      var fHTML = (c.fields || []).map(function(f) {
        if (f.type === 'textarea') {
          return '<div class="comp-form-field"><label>' + escapeHtml(f.label) + '</label><textarea placeholder="' + escapeAttr(f.placeholder) + '" rows="3"></textarea></div>';
        }
        return '<div class="comp-form-field"><label>' + escapeHtml(f.label) + '</label><input type="' + f.type + '" placeholder="' + escapeAttr(f.placeholder) + '"></div>';
      }).join('');
      return '<form class="comp-form" onsubmit="return false">' +
        (c.title ? '<h3 class="comp-form-title">' + escapeHtml(c.title) + '</h3>' : '') +
        fHTML +
        '<div class="comp-form-children"></div>' +
        '<button class="comp-form-submit">' + escapeHtml(c.submitText) + '</button>' +
        '</form>';
    }

    case 'video':
      if (c.src) {
        return '<div class="comp-video"><div class="comp-video-wrapper"><iframe src="' + escapeAttr(c.src) + '" allowfullscreen></iframe></div></div>';
      }
      return '<div class="comp-video-placeholder" style="width:' + (c.width || 560) + 'px;height:' + (c.height || 315) + 'px;">Video Embed Placeholder</div>';
    // Form element components
    case 'input': {
      var labelHTML = c.label ? '<label>' + escapeHtml(c.label) + '</label>' : '';
      return '<div class="comp-input-field">' + labelHTML + '<input type="' + (c.type || 'text') + '" placeholder="' + escapeAttr(c.placeholder || '') + '"></div>';
    }
    case 'textarea': {
      var labelHTML = c.label ? '<label>' + escapeHtml(c.label) + '</label>' : '';
      return '<div class="comp-textarea-field">' + labelHTML + '<textarea placeholder="' + escapeAttr(c.placeholder || '') + '" rows="' + (c.rows || 3) + '"></textarea></div>';
    }
    case 'label':
      return '<label class="comp-label">' + escapeHtml(c.text || '') + '</label>';
    case 'select': {
      var opts = (c.options || []).map(function(o) {
        return '<option value="' + escapeAttr(o.value) + '">' + escapeHtml(o.text) + '</option>';
      }).join('');
      return '<select class="comp-select">' + opts + '</select>';
    }
    default:
      return '';
  }
}

function createComponentElement(comp) {
  var wrapper = document.createElement('div');
  wrapper.className = 'canvas-component';
  wrapper.setAttribute('data-component-id', comp.id);
  wrapper.setAttribute('draggable', 'true');

  if (comp.type === 'form') {
    wrapper.classList.add('form-container');
  }

  if (App.selectedId === comp.id) {
    wrapper.classList.add('selected');
  }

  applyStylesToEl(wrapper, comp.styles);

  wrapper.innerHTML = createComponentHTML(comp);

  var deleteBtn = document.createElement('button');
  deleteBtn.className = 'component-delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.setAttribute('title', 'Delete component');
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    App.deleteComponent(comp.id);
  });
  wrapper.appendChild(deleteBtn);

  wrapper.addEventListener('click', function(e) {
    if (e.target === deleteBtn) return;
    e.stopPropagation();
    App.selectComponent(comp.id);
  });

  if (comp.type === 'form') {
    var dropZone = wrapper.querySelector('.comp-form-children');
    if (dropZone) {
      dropZone.setAttribute('data-form-id', comp.id);
    }
    var children = comp.content.children || [];
    for (var i = 0; i < children.length; i++) {
      var childEl = createChildComponentElement(comp.id, children[i]);
      if (dropZone) {
        dropZone.appendChild(childEl);
      }
    }
  }

  return wrapper;
}

function createChildComponentElement(parentId, childComp) {
  var childWrapper = document.createElement('div');
  childWrapper.className = 'canvas-component child-component';
  childWrapper.setAttribute('data-component-id', childComp.id);
  childWrapper.setAttribute('data-parent-id', parentId);
  childWrapper.setAttribute('draggable', 'true');

  if (App.selectedId === childComp.id) {
    childWrapper.classList.add('selected');
  }

  applyStylesToEl(childWrapper, childComp.styles);
  childWrapper.style.margin = '4px 0';

  childWrapper.innerHTML = renderChildComponent(childComp);

  var deleteBtn = document.createElement('button');
  deleteBtn.className = 'component-delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.setAttribute('title', 'Delete component');
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    App.deleteChildComponent(parentId, childComp.id);
  });
  childWrapper.appendChild(deleteBtn);

  childWrapper.addEventListener('click', function(e) {
    if (e.target === deleteBtn) return;
    e.stopPropagation();
    App.selectComponent(parentId);
  });

  return childWrapper;
}