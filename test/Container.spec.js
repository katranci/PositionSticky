var ContainerFactory = require('./ContainerFactory');
var Container        = require('../src/Container');

describe("Container", function() {

  describe("#_init", function() {

    it("saves the given element in a property", function() {
      var instance = ContainerFactory.create();
      var element = document.getElementById('container');
      expect(instance.element).toBe(element);
    });

    it("validates container's positioning scheme", function() {
      spyOn(Container, '_validatePosScheme');
      var instance = ContainerFactory.create();
      expect(instance._validatePosScheme).toHaveBeenCalled();
    });

    it("stores container's layout properties", function() {
      var element = ContainerFactory.createElement();
      element.style.paddingTop = '123px';
      element.style.paddingBottom = '234px';
      element.style.borderTop = '17px solid red';
      element.style.borderBottom = '19px solid red';

      var instance = ContainerFactory.create(element);

      expect(instance.paddingTop).toEqual(123);
      expect(instance.paddingBottom).toEqual(234);
      expect(instance.borderTopWidth).toEqual(17);
      expect(instance.borderBottomWidth).toEqual(19);
    });

  });

  describe("#_validatePosScheme", function() {

    it("sets element's position to relative its positioning scheme is not either relative or absolute", function() {
      var instance = ContainerFactory.create();
      instance.element.style.position = 'static';
      instance._validatePosScheme();
      expect(instance.element.style.position).toEqual('relative');
    });

    it("doesn't change element's positioning scheme otherwise", function() {
      var instance = ContainerFactory.create();

      instance.element.style.position = 'relative';
      instance._validatePosScheme();
      expect(instance.element.style.position).toEqual('relative');

      instance.element.style.position = 'absolute';
      instance._validatePosScheme();
      expect(instance.element.style.position).toEqual('absolute');
    });
  });

});