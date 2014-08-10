var StickyFactory      = require('./StickyFactory');
var PlaceholderFactory = require('./PlaceholderFactory');
var Placeholder        = require('../src/Placeholder');
var Sticky             = require('../src/Sticky');

describe("Placeholder", function() {

  describe("#_init", function() {

    it("saves the given Sticky instance in a property", function() {
      var sticky = StickyFactory.create();
      var instance = PlaceholderFactory.create(sticky);
      expect(instance._sticky).toBe(sticky);
    });

    it("creates the dom element", function() {
      spyOn(Placeholder, '_createElement');
      var instance = PlaceholderFactory.create();
      expect(instance._createElement).toHaveBeenCalled();
    });

  });

  describe("#_createElement", function() {

    var instance, _createElementSpy, sticky;

    beforeEach(function() {
      _createElementSpy = spyOn(Placeholder, '_createElement');
      spyOn(Sticky, '_setElementWidth');
      sticky = StickyFactory.create();
    });

    it("creates a hidden div with the same box model properties as the sticky element and inserts it just before the sticky element", function() {
      instance = PlaceholderFactory.create(sticky);
      instance._sticky.element.parentNode.style.width = '100px';
      instance._sticky.boundingBoxHeight = 200;
      instance._sticky.element.style.margin = '10px';

      _createElementSpy.and.callThrough();
      instance._createElement();

      expect(instance._sticky.element.previousElementSibling).toBe(instance.element);
      expect(instance.element.style.display).toEqual('none');
      expect(instance.element.style.width).toEqual('80px');
      expect(instance.element.style.height).toEqual('200px');
      expect(instance.element.style.margin).toEqual('10px');
    });

    it("applies sticky element's floating to the placeholder", function() {
      instance = PlaceholderFactory.create(sticky);
      instance._sticky.element.style.float = 'left';

      _createElementSpy.and.callThrough();
      instance._createElement();

      expect(instance.element.style.float).toEqual('left');
    });
  });

  describe("#refresh", function() {
    it("re-sets element's height from sticky's boundingBoxHeight", function() {
      var instance = PlaceholderFactory.create();
      instance._sticky.boundingBoxHeight = 5417;
      instance.refresh();
      expect(instance.element.style.height).toEqual('5417px');
    });
  });

});