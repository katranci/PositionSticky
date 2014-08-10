var Container = require('../src/Container');

var ContainerFactory = {

  create: function(element) {
    element = element || this.createElement();
    return Container.create(element);
  },

  createElement: function() {
    this.removeExisting();

    var element = document.createElement('DIV');
    element.setAttribute('id', 'container');
    document.body.appendChild(element);

    return element;
  },

  removeExisting: function() {
    var existing = document.getElementById('container');
    if (existing) {
      existing.remove();
    }
  }

};

module.exports = ContainerFactory;