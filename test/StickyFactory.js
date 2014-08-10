var Sticky = require('../src/Sticky');

var StickyFactory = {

  create: function(element) {
    element = element || this.createElement();
    return Sticky.create(element);
  },

  createElement: function() {
    this.removeExisting();

    var element = document.createElement('DIV');
    element.setAttribute('id', 'sticky');
    document.body.appendChild(element);

    return element;
  },

  removeExisting: function() {
    var existing = document.getElementById('sticky');
    if (existing) {
      existing.remove();
    }
  }

};

module.exports = StickyFactory;