var Responsive = {
  init: function() {
    var self = this;
    var buttons = document.querySelectorAll('.resp-btn');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function() {
        var mode = this.getAttribute('data-mode');
        self.setMode(mode);
      });
    }
  },

  setMode: function(mode) {
    App.responsiveMode = mode;
    var container = document.getElementById('responsive-container');
    container.className = 'responsive-' + mode;

    var buttons = document.querySelectorAll('.resp-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active');
      if (buttons[i].getAttribute('data-mode') === mode) {
        buttons[i].classList.add('active');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Responsive.init();

  document.getElementById('btn-preview').addEventListener('click', function() {
    App.togglePreview();
  });

  document.getElementById('btn-clear').addEventListener('click', function() {
    App.clearAll();
  });
});