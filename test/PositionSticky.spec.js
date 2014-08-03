describe("PositionSticky", function() {

  describe("#_init", function() {

    it("sets the element as the element property", function() {
      var instance = PositionStickyFactory.create();
      var element = document.getElementById('element');
      expect(instance.element).toBe(element);
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

    it("calls #_setElementWidth", function() {
      spyOn(PositionSticky, '_setElementWidth');
      var instance = PositionStickyFactory.create();
      expect(instance._setElementWidth).toHaveBeenCalled();
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

    it("calls #_setBoundingBoxHeight", function() {
      spyOn(PositionSticky, '_setBoundingBoxHeight');
      var instance = PositionStickyFactory.create();
      expect(instance._setBoundingBoxHeight).toHaveBeenCalled();
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

    it("returns #_getElementDistanceFromDocumentTop - 'offsetTop'", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_getElementDistanceFromDocumentTop').and.returnValue(100);
      instance.offsetTop = 10;
      instance._calcThreshold();

      expect(instance._threshold).toEqual(90);
    });

  });

  describe("#_setElementWidth", function() {
    it("calculates element's computed width and applies it as inline style", function() {
      var spy = spyOn(PositionSticky, '_setElementWidth');
      var instance = PositionStickyFactory.create();

      instance._container.element.style.width = '1000px';
      instance.element.style.padding = '25px';
      instance.element.style.border = '25px solid black';

      spy.and.callThrough();
      instance._setElementWidth();

      expect(instance.element.style.width).toEqual('900px');
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

      instance.element.style.marginLeft = '100px';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(100);
    });
  });

  describe("#_setLeftPositionWhenFixed", function() {
    it("gets element's total offsetLeft and saves it", function() {
      var instance = PositionStickyFactory.create();

      instance.element.ownerDocument.body.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(100);

      instance.element.ownerDocument.body.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(110);

      instance.element.ownerDocument.body.style.paddingLeft = '100px';
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

      instance.element.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(420);

      instance.element.ownerDocument.body.style.marginLeft = null;
      instance.element.ownerDocument.body.style.borderLeft = null;
      instance.element.ownerDocument.body.style.paddingLeft = null;
    });
  });

  describe("#_setBoundingBoxHeight", function() {
    it("calculates element's bounding box height and sets it to 'boundingBoxHeight'", function() {
      var instance = PositionStickyFactory.create();

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

    it("updates placeholder height when 'updatePlaceholder' parameter is set to true", function() {
      var instance = PositionStickyFactory.create();
      instance.element.style.height = '100px';
      instance._setBoundingBoxHeight(true);
      expect(instance._placeholder.element.style.height).toEqual('100px');
    });
  });

  describe("#_createPlaceholder", function() {
    it("creates an instance of Placeholder with 'this", function() {
      var spy = spyOn(PositionSticky, '_createPlaceholder');
      var instance = PositionStickyFactory.create();
      spyOn(Placeholder, 'create');

      spy.and.callThrough();
      instance._createPlaceholder();

      expect(Placeholder.create).toHaveBeenCalledWith(instance);
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

    var mockWindow, mock, _onScroll;

    beforeEach(function() {
      mockWindow = { requestAnimationFrame: function(callback) { callback(); }};
      mock = { _window: mockWindow, isTicking: false, _update: function() {} };
      _onScroll = PositionSticky._onScroll.bind(mock);
      spyOn(mock, '_update');
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
      expect(instance.element.style.position).toEqual('static');
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
      instance.element.style.bottom = '0px';
      instance._makeFixed();
      expect(instance.element.style.bottom).toEqual('');
    });

    it("sets sticky element's position to 'fixed'", function() {
      instance._makeFixed();
      expect(instance.element.style.position).toEqual('fixed');
    });

    it("assigns 'offsetTop' to element's top style property", function() {
      instance.offsetTop = 50;
      instance._makeFixed();
      expect(instance.element.style.top).toEqual('50px');
    });

    it("assigns 'leftPositionWhenFixed' to element's left style property", function() {
      instance._leftPositionWhenFixed = 5417;
      instance._makeFixed();
      expect(instance.element.style.left).toEqual('5417px');
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
      instance.element.style.top = '0px';
      instance._makeAbsolute();
      expect(instance.element.style.top).toEqual('');
    });

    it("sets sticky element's position to 'absolute'", function() {
      instance._makeAbsolute();
      expect(instance.element.style.position).toEqual('absolute');
    });

    it("assigns 'containerPaddingBottom' to sticky element's bottom css property", function() {
      instance._container.paddingBottom = 50;
      instance._makeAbsolute();
      expect(instance.element.style.bottom).toEqual('50px');
    });

    it("assigns 'leftPositionWhenAbsolute' to element's left style property", function() {
      instance._leftPositionWhenAbsolute = 7145;
      instance._makeAbsolute();
      expect(instance.element.style.left).toEqual('7145px');
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
      instance.boundingBoxHeight = 100;
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

  describe("#_getElementDistanceFromDocumentTop", function() {

    it("returns total offsetTop", function() {
      var instance = PositionStickyFactory.create();

      instance._window.scrollTo(0, 100);

      instance.element.ownerDocument.body.style.marginTop = '100px';
      instance.element.ownerDocument.body.style.borderTop = '10px solid black';
      instance.element.ownerDocument.body.style.paddingTop = '100px';
      instance._container.element.style.marginTop = '100px';
      instance._container.element.style.borderTop = '10px solid black';
      instance._container.element.style.paddingTop = '100px';
      instance.element.style.marginTop = '100px';

      expect(instance._getElementDistanceFromDocumentTop()).toEqual(520);

      instance.element.ownerDocument.body.style.marginTop = null;
      instance.element.ownerDocument.body.style.borderTop = null;
      instance.element.ownerDocument.body.style.paddingTop = null;
    });

    it("uses placeholder in calculations when the element is not static", function() {
      var instance = PositionStickyFactory.create();

      instance._latestKnownScrollY = 0;
      instance._placeholder.element.style.marginTop = '123px';
      instance._makeFixed();

      expect(instance._getElementDistanceFromDocumentTop()).toEqual(123);
    });

  });

  describe("#refresh", function() {
    it("re-measures necessary positions/dimensions", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_calcThreshold');
      spyOn(instance, '_setBoundingBoxHeight');

      instance.refresh();

      expect(instance._calcThreshold).toHaveBeenCalled();
      expect(instance._setBoundingBoxHeight).toHaveBeenCalledWith(true);
    });
  });

});