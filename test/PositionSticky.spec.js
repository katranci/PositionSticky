var rewire                = require('rewire');
var PositionStickyFactory = rewire('./PositionStickyFactory');
var PositionSticky        = rewire('../src/PositionSticky');
var Container             = require('../src/Container');
var Placeholder           = require('../src/Placeholder');
var Sticky                = require('../src/Sticky');

PositionStickyFactory.__set__('PositionSticky', PositionSticky);

describe("PositionSticky", function() {

  describe("#_init", function() {

    it("creates an instance of Sticky with element", function() {
      var instance = PositionStickyFactory.create();
      var container = document.getElementById('sticky');
      expect(Object.getPrototypeOf(instance._sticky)).toBe(Sticky);
    });

    it("creates an instance of Container with element's parent node", function() {
      var instance = PositionStickyFactory.create();
      var container = document.getElementById('container');
      expect(Object.getPrototypeOf(instance._container)).toBe(Container);
    });

    it("calls #_setOffsetTop", function() {
      spyOn(PositionSticky, '_setOffsetTop');
      var instance = PositionStickyFactory.create();
      expect(instance._setOffsetTop).toHaveBeenCalled();
    });

    it("calls #_setOffsetBottom", function() {
      spyOn(PositionSticky, '_setOffsetBottom');
      var instance = PositionStickyFactory.create();
      expect(instance._setOffsetBottom).toHaveBeenCalled();
    });

    it("calls #_calcThreshold", function() {
      spyOn(PositionSticky, '_calcThreshold');
      var instance = PositionStickyFactory.create();
      expect(instance._calcThreshold).toHaveBeenCalled();
    });

    it("calls #_setLeftPositionWhenAbsolute", function() {
      spyOn(PositionSticky, '_setLeftPositionWhenAbsolute');
      var instance = PositionStickyFactory.create();
      expect(instance._setLeftPositionWhenAbsolute).toHaveBeenCalled();
    });

    it("calls #_setLeftPositionWhenFixed", function() {
      spyOn(PositionSticky, '_setLeftPositionWhenFixed');
      var instance = PositionStickyFactory.create();
      expect(instance._setLeftPositionWhenFixed).toHaveBeenCalled();
    });

    it("calls #_createPlaceholder", function() {
      spyOn(PositionSticky, '_createPlaceholder');
      var instance = PositionStickyFactory.create();
      expect(instance._createPlaceholder).toHaveBeenCalled();
    });

    it("calls #_subscribeToWindowScroll", function() {
      spyOn(PositionSticky, '_subscribeToWindowScroll');
      var instance = PositionStickyFactory.create();
      expect(instance._subscribeToWindowScroll).toHaveBeenCalled();
    });

  });

  describe("#_setOffsetTop", function() {

    describe("when offsetTop is given in options and it is zero or a positive integer", function() {
      it("assigns that to 'offsetTop'", function() {
        var instance;

        instance = PositionStickyFactory.create(null, {offsetTop: 0});
        expect(instance.offsetTop).toEqual(0);

        instance = PositionStickyFactory.create(null, {offsetTop: 1});
        expect(instance.offsetTop).toEqual(1);
      });
    });

    describe("otherwise", function() {
      it("assigns the sum of container's padding-top and border-top-width to 'offsetTop'", function() {
        var instance = PositionStickyFactory.create();
        instance._container.borderTopWidth = 20;
        instance._container.paddingTop = 10;

        instance._setOffsetTop();
        expect(instance.offsetTop).toEqual(30);
      });
    });

  });

  describe("#_setOffsetBottom", function() {
    it("assigns the sum of container's padding-bottom and border-bottom-width to 'offsetBottom'", function() {
      var instance = PositionStickyFactory.create();
      instance._container.borderBottomWidth = 20;
      instance._container.paddingBottom = 10;

      instance._setOffsetBottom();
      expect(instance.offsetBottom).toEqual(30);
    });
  });

  describe("#_calcThreshold", function() {

    it("returns #_getStickyDistanceFromDocumentTop - 'offsetTop'", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_getStickyDistanceFromDocumentTop').and.returnValue(100);
      instance.offsetTop = 10;
      instance._calcThreshold();

      expect(instance._threshold).toEqual(90);
    });

  });

  describe("#_setLeftPositionWhenAbsolute", function() {
    it("calculates left position to be used in absolute positioning", function() {
      var instance = PositionStickyFactory.create();

      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(0);

      instance._container.element.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(0);

      instance._container.element.style.paddingLeft = '100px';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(100);

      instance._sticky.element.style.marginLeft = '100px';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(100);
    });
  });

  describe("#_setLeftPositionWhenFixed", function() {
    it("gets element's total offsetLeft and saves it", function() {
      var instance = PositionStickyFactory.create();

      instance._sticky.element.ownerDocument.body.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(100);

      instance._sticky.element.ownerDocument.body.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(110);

      instance._sticky.element.ownerDocument.body.style.paddingLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(210);

      instance._container.element.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(310);

      instance._container.element.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(320);

      instance._container.element.style.paddingLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(420);

      instance._sticky.element.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(420);

      instance._sticky.element.ownerDocument.body.style.marginLeft = null;
      instance._sticky.element.ownerDocument.body.style.borderLeft = null;
      instance._sticky.element.ownerDocument.body.style.paddingLeft = null;
    });
  });

  describe("#_createPlaceholder", function() {
    it("creates an instance of Placeholder with _sticky", function() {
      var spy = spyOn(PositionSticky, '_createPlaceholder');
      var instance = PositionStickyFactory.create();
      spyOn(Placeholder, 'create');

      spy.and.callThrough();
      instance._createPlaceholder();

      expect(Placeholder.create).toHaveBeenCalledWith(instance._sticky);
    });
  });

  describe("#_subscribeToWindowScroll", function() {
    it("attaches #_onScroll to Window.onscroll event", function() {
      var mockWindow = { addEventListener: function(event, callback) { callback(); }};
      var mock = { _window: mockWindow, _onScroll: function() {} };
      var _subscribeToWindowScroll = PositionSticky._subscribeToWindowScroll.bind(mock);
      spyOn(mock, '_onScroll');

      _subscribeToWindowScroll();

      expect(mock._onScroll).toHaveBeenCalled();
    });
  });

  describe("#_onScroll", function() {

    var rAF, mock, _onScroll, rAFRevert;

    beforeEach(function() {
      rAF = function(callback) { callback(); };
      rAFRevert = PositionSticky.__set__('rAF', rAF);
      mock = { _window: jasmine.createSpy(), isTicking: false, _update: jasmine.createSpy() };
      _onScroll = PositionSticky._onScroll.bind(mock);
    });

    afterEach(function() {
      rAFRevert();
    });

    it("runs #_update on every animation frame", function() {
      _onScroll();
      expect(mock._update).toHaveBeenCalled();
    });

    it("doesn't run #_update more than once in the same animation frame", function() {
      _onScroll();
      _onScroll();
      _onScroll();

      expect(mock._update.calls.count()).toBe(1);
    });
  });

  describe("#_isStatic", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_STATIC", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isStatic()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isStatic()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isStatic()).toBe(false);
    });
  });

  describe("#_makeStatic", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("sets sticky element's position to 'static'", function() {
      instance._makeStatic();
      expect(instance._sticky.element.style.position).toEqual('static');
    });

    it("hides placeholder", function() {
      instance._placeholder.element.style.display = 'block';
      instance._makeStatic();
      expect(instance._placeholder.element.style.display).toEqual('none');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_STATIC", function() {
      instance._makeStatic();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_STATIC);
    });

  });

  describe("#_isFixed", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_FIXED", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isFixed()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isFixed()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isFixed()).toBe(false);
    });
  });

  describe("#_makeFixed", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("removes bottom property in case sticky element had absolute positioning before", function() {
      instance._sticky.element.style.bottom = '0px';
      instance._makeFixed();
      expect(instance._sticky.element.style.bottom).toEqual('');
    });

    it("sets sticky element's position to 'fixed'", function() {
      instance._makeFixed();
      expect(instance._sticky.element.style.position).toEqual('fixed');
    });

    it("assigns 'offsetTop' to element's top style property", function() {
      instance.offsetTop = 50;
      instance._makeFixed();
      expect(instance._sticky.element.style.top).toEqual('50px');
    });

    it("assigns 'leftPositionWhenFixed' to element's left style property", function() {
      instance._leftPositionWhenFixed = 5417;
      instance._makeFixed();
      expect(instance._sticky.element.style.left).toEqual('5417px');
    });

    it("shows placeholder", function() {
      instance._placeholder.element.style.display = 'none';
      instance._makeFixed();
      expect(instance._placeholder.element.style.display).toEqual('block');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_FIXED", function() {
      instance._makeFixed();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_FIXED);
    });

  });

  describe("#_isAbsolute", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_ABSOLUTE", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isAbsolute()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isAbsolute()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isAbsolute()).toBe(false);
    });
  });

  describe("#_makeAbsolute", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("removes top property in case sticky element had fixed positioning before", function() {
      instance._sticky.element.style.top = '0px';
      instance._makeAbsolute();
      expect(instance._sticky.element.style.top).toEqual('');
    });

    it("sets sticky element's position to 'absolute'", function() {
      instance._makeAbsolute();
      expect(instance._sticky.element.style.position).toEqual('absolute');
    });

    it("assigns 'containerPaddingBottom' to sticky element's bottom css property", function() {
      instance._container.paddingBottom = 50;
      instance._makeAbsolute();
      expect(instance._sticky.element.style.bottom).toEqual('50px');
    });

    it("assigns 'leftPositionWhenAbsolute' to element's left style property", function() {
      instance._leftPositionWhenAbsolute = 7145;
      instance._makeAbsolute();
      expect(instance._sticky.element.style.left).toEqual('7145px');
    });

    it("shows placeholder", function() {
      instance._placeholder.element.style.display = 'none';
      instance._makeAbsolute();
      expect(instance._placeholder.element.style.display).toEqual('block');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_ABSOLUTE", function() {
      instance._makeAbsolute();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_ABSOLUTE);
    });

  });

  describe("#_update", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    describe("when element is below the threshold", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(true);
      });

      it("sets the position to static if it is not already", function() {
        spyOn(instance, '_isStatic').and.returnValue(false);
        spyOn(instance, '_makeStatic');

        instance._update();

        expect(instance._makeStatic).toHaveBeenCalled();
      });

    });

    describe("when container is above the viewport and sticky can fit inside the visible portion of the container", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(false);
        spyOn(instance, '_canStickyFitInContainer').and.returnValue(true);
      });

      it("sets the position to fixed if it is not already", function() {
        spyOn(instance, '_isFixed').and.returnValue(false);
        spyOn(instance, '_makeFixed');

        instance._update();

        expect(instance._makeFixed).toHaveBeenCalled();
      });

    });

    describe("otherwise", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(false);
        spyOn(instance, '_canStickyFitInContainer').and.returnValue(false);
      });

      it("sets the position to absolute if it is not already", function() {
        spyOn(instance, '_isAbsolute').and.returnValue(false);
        spyOn(instance, '_makeAbsolute');

        instance._update();

        expect(instance._makeAbsolute).toHaveBeenCalled();
      });

    });

  });

  describe("#_isBelowThreshold", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
      instance._threshold = 100;
    });

    it("returns true when latestKnownScrollY is smaller than the threshold", function() {
      instance._latestKnownScrollY = 99;
      expect(instance._isBelowThreshold()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._latestKnownScrollY = 100;
      expect(instance._isBelowThreshold()).toBe(false);

      instance._latestKnownScrollY = 101;
      expect(instance._isBelowThreshold()).toBe(false);
    });
  });

  describe("#_canStickyFitInContainer", function() {
    var instance, _getAvailableSpaceInContainerSpy;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
      instance._sticky.boundingBoxHeight = 100;
      _getAvailableSpaceInContainerSpy = spyOn(instance, '_getAvailableSpaceInContainer');
    });

    it("returns true when visible portion of container's content height is equal or bigger than element's height", function() {
      _getAvailableSpaceInContainerSpy.and.returnValue(100);
      expect(instance._canStickyFitInContainer()).toBe(true);

      _getAvailableSpaceInContainerSpy.and.returnValue(101);
      expect(instance._canStickyFitInContainer()).toBe(true);
    });

    it("returns false otherwise", function() {
      _getAvailableSpaceInContainerSpy.and.returnValue(99);
      expect(instance._canStickyFitInContainer()).toBe(false);
    })
  });

  describe("#_getAvailableSpaceInContainer", function() {
    it("calculates and returns available visible portion of the container's height", function() {
      var instance = PositionStickyFactory.create();

      instance.offsetTop = 15;
      instance.offsetBottom = 15;
      spyOn(instance._container.element, 'getBoundingClientRect').and.returnValue({bottom: 100});

      expect(instance._getAvailableSpaceInContainer()).toEqual(70);
    });
  });

  describe("#_getStickyDistanceFromDocumentTop", function() {

    it("returns total offsetTop", function() {
      var instance = PositionStickyFactory.create();

      instance._window.scrollTo(0, 100);

      instance._sticky.element.ownerDocument.body.style.marginTop = '100px';
      instance._sticky.element.ownerDocument.body.style.borderTop = '10px solid black';
      instance._sticky.element.ownerDocument.body.style.paddingTop = '100px';
      instance._container.element.style.marginTop = '100px';
      instance._container.element.style.borderTop = '10px solid black';
      instance._container.element.style.paddingTop = '100px';
      instance._sticky.element.style.marginTop = '100px';

      expect(instance._getStickyDistanceFromDocumentTop()).toEqual(520);

      instance._sticky.element.ownerDocument.body.style.marginTop = null;
      instance._sticky.element.ownerDocument.body.style.borderTop = null;
      instance._sticky.element.ownerDocument.body.style.paddingTop = null;
    });

    it("uses placeholder in calculations when the sticky is not static", function() {
      var instance = PositionStickyFactory.create();

      instance._latestKnownScrollY = 0;
      instance._placeholder.element.style.marginTop = '123px';
      instance._makeFixed();

      expect(instance._getStickyDistanceFromDocumentTop()).toEqual(123);
    });

  });

  describe("#refresh", function() {
    it("re-measures necessary positions/dimensions", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_calcThreshold');
      spyOn(instance._sticky, 'refresh');
      spyOn(instance._placeholder, 'refresh');

      instance.refresh();

      expect(instance._calcThreshold).toHaveBeenCalled();
      expect(instance._sticky.refresh).toHaveBeenCalled();
      expect(instance._placeholder.refresh).toHaveBeenCalled();
    });
  });

});