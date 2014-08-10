var StickyFactory = require('./StickyFactory');
var Sticky        = require('../src/Sticky');

describe("Sticky", function() {

  describe("#_init", function() {
    it("saves the given element in a property", function() {
      var instance = StickyFactory.create();
      var element = document.getElementById('sticky');
      expect(instance.element).toBe(element);
    });

    it("calls #_setElementWidth", function() {
      spyOn(Sticky, '_setElementWidth');
      var instance = StickyFactory.create();
      expect(instance._setElementWidth).toHaveBeenCalled();
    });

    it("calls #_setBoundingBoxHeight", function() {
      spyOn(Sticky, '_setBoundingBoxHeight');
      var instance = StickyFactory.create();
      expect(instance._setBoundingBoxHeight).toHaveBeenCalled();
    });
  });

  describe("#_setElementWidth", function() {
    it("calculates element's computed width and applies it as inline style", function() {
      var spy = spyOn(Sticky, '_setElementWidth');
      var instance = StickyFactory.create();

      instance.element.parentNode.style.width = '1000px';
      instance.element.style.padding = '25px';
      instance.element.style.border = '25px solid black';

      spy.and.callThrough();
      instance._setElementWidth();

      expect(instance.element.style.width).toEqual('900px');
    });
  });


  describe("#_setBoundingBoxHeight", function() {
    it("calculates element's bounding box height and sets it to 'boundingBoxHeight'", function() {
      var instance = StickyFactory.create();

      var child = document.createElement('DIV');
      child.style.height = '500px';
      instance.element.appendChild(child);

      instance.element.style.overflow = 'scroll';
      instance.element.style.height = '100px';
      instance.element.style.padding = '10px';
      instance.element.style.border = '10px solid black';

      instance._setBoundingBoxHeight();
      expect(instance.boundingBoxHeight).toEqual(140);
    });
  });

  describe("#refresh", function() {
    it("re-measures _boundingBoxHeight", function() {
      var instance = StickyFactory.create();

      spyOn(instance, '_setBoundingBoxHeight');
      instance.refresh();

      expect(instance._setBoundingBoxHeight).toHaveBeenCalled();
    });
  });

});