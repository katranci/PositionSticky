var Placeholder   = require('../src/Placeholder');
var StickyFactory = require('./StickyFactory');

var PlaceholderFactory = {

  create: function(sticky) {
    sticky = sticky || this.createSticky();
    return Placeholder.create(sticky);
  },

  createSticky: function() {
    return StickyFactory.create();
  }

};

module.exports = PlaceholderFactory;