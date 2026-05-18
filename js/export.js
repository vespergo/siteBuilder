function exportToHTML() {
  if (App.components.length === 0) {
    alert('Add some components to the canvas first.');
    return;
  }

  var parts = [];

  parts.push('<!DOCTYPE html>');
  parts.push('<html lang="en">');
  parts.push('<head>');
  parts.push('<meta charset="UTF-8">');
  parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  parts.push('<title>My Site</title>');
  parts.push('<style>');
  parts.push(getExportCSS());
  parts.push('</style>');
  parts.push('</head>');
  parts.push('<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">');

  for (var i = 0; i < App.components.length; i++) {
    parts.push(renderComponentForExport(App.components[i]));
  }

  parts.push('</body>');
  parts.push('</html>');

  var blob = new Blob([parts.join('\n')], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'my-site.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function styleToCSS(styles) {
  var css = '';
  for (var key in styles) {
    if (!styles.hasOwnProperty(key)) continue;
    var val = styles[key];
    var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    css += '  ' + cssKey + ': ' + val + ';\n';
  }
  return css;
}

function renderComponentForExport(comp) {
  var s = comp.styles;
  var c = comp.content;

  var styleStr = '';
  for (var key in s) {
    if (!s.hasOwnProperty(key)) continue;
    var val = s[key];
    var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    styleStr += cssKey + ':' + val + ';';
  }

  switch (comp.type) {
    case 'heading':
      return '<' + c.level + ' style="' + styleStr + '">' + escapeHtml(c.text) + '</' + c.level + '>';

    case 'paragraph':
      return '<p style="' + styleStr + '">' + escapeHtml(c.text) + '</p>';

    case 'button':
      return '<a href="' + escapeAttr(c.url) + '" style="display:inline-block;text-decoration:none;border:none;cursor:pointer;' + styleStr + '">' + escapeHtml(c.text) + '</a>';

    case 'container': {
      var containerChildrenHTML = (c.children || []).map(function(child) {
        return renderChildForExport(child);
      }).join('');
      return '<div style="' + styleStr + 'min-height:80px;">' + containerChildrenHTML + '</div>';
    }

    case 'navbar': {
      var linksHTML = (c.links || []).map(function(l) {
        return '<li><a href="' + escapeAttr(l.url) + '" style="color:inherit;text-decoration:none;">' + escapeHtml(l.text) + '</a></li>';
      }).join('');
      return '<nav style="' + styleStr + 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">' +
        '<span style="font-weight:700;font-size:18px;">' + escapeHtml(c.brand) + '</span>' +
        '<ul style="display:flex;align-items:center;gap:20px;list-style:none;margin:0;padding:0;">' + linksHTML + '</ul>' +
        '</nav>';
    }

    case 'hero':
      return '<div style="' + styleStr + 'text-align:center;">' +
        '<h1 style="font-size:48px;font-weight:800;margin-bottom:16px;color:#111827;">' + escapeHtml(c.heading) + '</h1>' +
        '<p style="font-size:18px;color:#4b5563;margin-bottom:32px;max-width:600px;margin-left:auto;margin-right:auto;">' + escapeHtml(c.subtext) + '</p>' +
        '<a href="' + escapeAttr(c.ctaUrl) + '" style="display:inline-block;padding:14px 32px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;border:none;cursor:pointer;">' + escapeHtml(c.cta) + '</a>' +
        '</div>';

    case 'card': {
      var imgHTML = c.image
        ? '<img src="' + escapeAttr(c.image) + '" alt="card image" style="width:100%;height:100%;object-fit:cover;">'
        : '<div style="color:#9ca3af;">Image</div>';
      return '<div style="' + styleStr + 'max-width:360px;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);background:#fff;">' +
        '<div style="width:100%;height:180px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;overflow:hidden;">' + imgHTML + '</div>' +
        '<div style="padding:16px;">' +
        '<h3 style="font-size:18px;font-weight:600;margin-bottom:8px;color:#111827;">' + escapeHtml(c.title) + '</h3>' +
        '<p style="font-size:14px;color:#4b5563;line-height:1.5;margin-bottom:12px;">' + escapeHtml(c.body) + '</p>' +
        '<a href="' + escapeAttr(c.ctaUrl) + '" style="display:inline-block;padding:8px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;border:none;">' + escapeHtml(c.cta) + '</a>' +
        '</div></div>';
    }

    case 'image':
      if (c.src) {
        return '<img src="' + escapeAttr(c.src) + '" alt="' + escapeAttr(c.alt) + '" style="' + styleStr + 'max-width:100%;height:auto;display:block;">';
      }
      // Strip backgroundColor from styleStr for placeholder to avoid clashing with #e5e7eb
      var placeholderStyleStr = styleStr.replace(/background-color:[^;]*;?/gi, '');
      return '<div style="' + placeholderStyleStr + 'width:' + (c.width || 400) + 'px;height:' + (c.height || 300) + 'px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;color:#9ca3af;border-radius:4px;">Image</div>';

    case 'form': {
      var fHTML = (c.fields || []).map(function(f) {
        if (f.type === 'textarea') {
          return '<div style="margin-bottom:12px;"><label style="display:block;font-size:14px;font-weight:500;margin-bottom:4px;color:#374151;">' + escapeHtml(f.label) + '</label><textarea placeholder="' + escapeAttr(f.placeholder) + '" rows="3" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;font-family:inherit;resize:vertical;"></textarea></div>';
        }
        return '<div style="margin-bottom:12px;"><label style="display:block;font-size:14px;font-weight:500;margin-bottom:4px;color:#374151;">' + escapeHtml(f.label) + '</label><input type="' + f.type + '" placeholder="' + escapeAttr(f.placeholder) + '" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;font-family:inherit;"></div>';
      }).join('');
      var childrenHTML = (c.children || []).map(function(child) {
        return renderChildForExport(child);
      }).join('');
      var childrenWrapper = childrenHTML ? '<div style="margin-bottom:12px;">' + childrenHTML + '</div>' : '';
      return '<form onsubmit="return false" style="' + styleStr + 'border-radius:8px;">' +
        (c.title ? '<h3 style="font-size:20px;font-weight:600;margin-bottom:16px;">' + escapeHtml(c.title) + '</h3>' : '') +
        fHTML +
        childrenWrapper +
        '<button style="padding:10px 24px;background:#3b82f6;color:#fff;border:none;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;">' + escapeHtml(c.submitText) + '</button>' +
        '</form>';
    }

    case 'video':
      if (c.src) {
        return '<div style="' + styleStr + 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="' + escapeAttr(c.src) + '" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen></iframe></div>';
      }
      return '<div style="' + styleStr + 'width:' + (c.width || 560) + 'px;height:' + (c.height || 315) + 'px;background:#1f2937;display:flex;align-items:center;justify-content:center;color:#fff;border-radius:4px;">Video</div>';

    default:
      return '';
  }
}

function getExportCSS() {
  return [
    '*,*::before,*::after{box-sizing:border-box}',
    'body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#111827;}',
    'h1,h2,h3,h4,h5,h6{margin:0;}',
    'p{margin:0;}',
    'img{max-width:100%;height:auto;display:block;}'
  ].join('\n');
}

function renderChildForExport(comp) {
  var c = comp.content;
  var s = comp.styles;
  var styleStr = '';
  for (var key in s) {
    if (!s.hasOwnProperty(key)) continue;
    var val = s[key];
    var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    styleStr += cssKey + ':' + val + ';';
  }
  switch (comp.type) {
    case 'heading':
      return '<' + c.level + ' style="' + styleStr + '">' + escapeHtml(c.text) + '</' + c.level + '>';
    case 'paragraph':
      return '<p style="' + styleStr + '">' + escapeHtml(c.text) + '</p>';
    case 'button':
      return '<a href="' + escapeAttr(c.url) + '" style="display:inline-block;text-decoration:none;border:none;cursor:pointer;' + styleStr + '">' + escapeHtml(c.text) + '</a>';
    case 'input': {
      var labelHTML = c.label ? '<label style="display:block;font-size:14px;font-weight:500;margin-bottom:4px;color:#374151;">' + escapeHtml(c.label) + '</label>' : '';
      return '<div style="margin-bottom:12px;">' + labelHTML + '<input type="' + (c.type || 'text') + '" placeholder="' + escapeAttr(c.placeholder || '') + '" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;font-family:inherit;"></div>';
    }
    case 'textarea': {
      var labelHTML = c.label ? '<label style="display:block;font-size:14px;font-weight:500;margin-bottom:4px;color:#374151;">' + escapeHtml(c.label) + '</label>' : '';
      return '<div style="margin-bottom:12px;">' + labelHTML + '<textarea placeholder="' + escapeAttr(c.placeholder || '') + '" rows="' + (c.rows || 3) + '" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;font-family:inherit;resize:vertical;"></textarea></div>';
    }
    case 'label':
      return '<label style="' + styleStr + '">' + escapeHtml(c.text || '') + '</label>';
    case 'select': {
      var opts = (c.options || []).map(function(o) {
        return '<option value="' + escapeAttr(o.value) + '">' + escapeHtml(o.text) + '</option>';
      }).join('');
      return '<select style="' + styleStr + 'padding:8px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;font-family:inherit;">' + opts + '</select>';
    }
    case 'image':
      if (c.src) {
        return '<img src="' + escapeAttr(c.src) + '" alt="' + escapeAttr(c.alt) + '" style="max-width:100%;height:auto;display:block;">';
      }
      return '<div style="width:' + (c.width || 400) + 'px;height:' + (c.height || 300) + 'px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;color:#9ca3af;border-radius:4px;">Image</div>';
    default:
      return '';
  }
}

document.getElementById('btn-export').addEventListener('click', exportToHTML);