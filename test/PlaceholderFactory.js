var PlaceholderFactory = {

  create: function(sticky) {
    sticky = sticky || this.createSticky();
    return Placeholder.create(sticky);
  },

  createSticky: function() {
    return PositionStickyFactory.create();
  }

};