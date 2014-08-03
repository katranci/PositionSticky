/**
 * @namespace Container
 * @author Ahmet Katrancı <ahmet@katranci.co.uk>
 */
var Container = {

  /**
   * Creates an instance of Container
   *
   * @param element
   * @returns {Container}
   * @static
   * @public
   */
  create: function(element) {
    return Object.create(Container)._init(element);
  },

  /**
   * Constructor method
   *
   * @param element {HTMLElement}
   * @returns {Container}
   * @instance
   * @private
   */
  _init: function(element) {
    this.constructor = Container;
    this._window = window;
    this.element = element;
    this.paddingTop = null;
    this.paddingBottom = null;
    this.borderTopWidth = null;
    this.borderBottomWidth = null;

    this._validatePosScheme();
    this._setLayoutProperties();

    return this;
  },

  /**
   * Ensures that the container's position is either 'relative' or 'absolute'
   * so that when the sticky element is positioned absolutely it is positioned within its container
   *
   * @instance
   * @private
   */
  _validatePosScheme: function() {
    var posScheme = this.element.style.position;
    if (posScheme != 'relative' && posScheme != 'absolute') {
      this.element.style.position = 'relative';
    }
  },

  /**
   * Caches several layout properties
   *
   * @instance
   * @private
   */
  _setLayoutProperties: function() {
    var computedStyles = this._window.getComputedStyle(this.element);
    this.paddingTop = parseInt(computedStyles.paddingTop, 10);
    this.paddingBottom = parseInt(computedStyles.paddingBottom, 10);
    this.borderTopWidth = parseInt(computedStyles.borderTopWidth, 10);
    this.borderBottomWidth = parseInt(computedStyles.borderBottomWidth, 10);
  }

};
/**
 * @namespace Placeholder
 * @author Ahmet Katrancı <ahmet@katranci.co.uk>
 */
var Placeholder = {

  /**
   * Creates an instance of Placeholder
   *
   * @param sticky {PositionSticky}
   * @returns {Placeholder}
   * @static
   * @public
   */
  create: function(sticky) {
    return Object.create(Placeholder)._init(sticky);
  },

  /**
   * Constructor method
   *
   * @param sticky {PositionSticky}
   * @returns {Placeholder}
   * @instance
   * @private
   */
  _init: function(sticky) {
    this.constructor = Placeholder;
    this._window = window;
    this._sticky = sticky;
    this.element = null;
    
    this._createElement();

    return this;
  },

  /**
   * Creates the placeholder that will be used in place of the element
   * when the element is positioned absolutely or fixed
   *
   * @instance
   * @private
   *
   * @todo Float computation doesn't work on Firefox and IE9
   */
  _createElement: function() {
    var placeholder = document.createElement('DIV');

    var width   = this._sticky.element.getBoundingClientRect().width + 'px';
    var height  = this._sticky.boundingBoxHeight + 'px';
    var margin  = this._window.getComputedStyle(this._sticky.element).margin;
    var float   = this._window.getComputedStyle(this._sticky.element).float;

    placeholder.style.display = 'none';
    placeholder.style.width   = width;
    placeholder.style.height  = height;
    placeholder.style.margin  = margin;
    placeholder.style.float   = float;

    this._sticky.element.parentNode.insertBefore(placeholder, this._sticky.element);
    this.element = placeholder;
  },

  /**
   * Re-sets element's height from sticky's boundingBoxHeight. It is called
   * from PositionSticky#refresh.
   *
   * @instance
   */
  refresh: function() {
    this.element.style.height = this._sticky.boundingBoxHeight + 'px';
  }

};
/**
 * @namespace PositionSticky
 * @author Ahmet Katrancı <ahmet@katranci.co.uk>
 */
var PositionSticky = {

  /**
   * @constant
   */
  POS_SCHEME_STATIC:   100,

  /**
   * @constant
   */
  POS_SCHEME_FIXED:    200,

  /**
   * @constant
   */
  POS_SCHEME_ABSOLUTE: 300,

  /**
   * Creates an instance of PositionSticky
   *
   * @param element
   * @param options
   * @returns {PositionSticky}
   * @static
   * @public
   */
  create: function(element, options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    return Object.create(PositionSticky)._init(element, options);
  },

  /**
   * Constructor method
   *
   * @param element {HTMLElement}
   * @param options {Object}
   * @returns {PositionSticky}
   * @instance
   * @private
   */
  _init: function(element, options) {
    this.constructor = PositionSticky;
    this._window = window;
    this.element = element;
    this._container = Container.create(element.parentNode);
    this._placeholder = null;
    this._posScheme = PositionSticky.POS_SCHEME_STATIC;
    this._isTicking = false;
    this._threshold = null;
    this._options = options;
    this.boundingBoxHeight = null;
    this._leftPositionWhenAbsolute = null;
    this._leftPositionWhenFixed = null;
    this._latestKnownScrollY = this._window.pageYOffset;

    this._setOffsetTop();
    this._setOffsetBottom();
    this._calcThreshold();
    this._setElementWidth();
    this._setLeftPositionWhenAbsolute();
    this._setLeftPositionWhenFixed();
    this._setBoundingBoxHeight();
    this._createPlaceholder();
    this._subscribeToWindowScroll();

    return this;
  },

  /**
   * Sets the distance that the sticky element will have from the top of viewport
   * when it becomes sticky
   *
   * @instance
   * @private
   */
  _setOffsetTop: function() {
    if (typeof this._options.offsetTop === 'number' && this._options.offsetTop >= 0) {
      this.offsetTop = this._options.offsetTop;
    } else {
      this.offsetTop = this._container.borderTopWidth + this._container.paddingTop;
    }
  },

  /**
   * Sets the amount to subtract in #_canStickyFitInContainer and also sets the
   * distance that the sticky element will have from the bottom of its container
   * when it is positioned absolutely
   *
   * @instance
   * @private
   */
  _setOffsetBottom: function() {
    this.offsetBottom = this._container.borderBottomWidth + this._container.paddingBottom;
  },

  /**
   * Calculates the point where the sticky behaviour should start
   *
   * @instance
   * @private
   */
  _calcThreshold: function() {
    this._threshold = this._getElementDistanceFromDocumentTop() - this.offsetTop;
  },

  /**
   * Applies element's computed width to its inline styling so that when the element
   * is positioned absolutely or fixed it doesn't lose its shape
   *
   * @instance
   * @private
   */
  _setElementWidth: function() {
    var width = this._window.getComputedStyle(this.element).width;
    this.element.style.width = width;
  },

  /**
   * Gets the element's distance from its offset parent's left
   * and subtracts any horizontal margins and saves it
   *
   * @instance
   * @private
   */
  _setLeftPositionWhenAbsolute: function() {
    var marginLeft = parseInt(this._window.getComputedStyle(this.element).marginLeft, 10);
    this._leftPositionWhenAbsolute = this.element.offsetLeft - marginLeft;
  },

  /**
   * Gets the element's distance from document left and saves it
   *
   * @instance
   * @private
   *
   * @todo Write a test that is covering when the page is scrolled
   */
  _setLeftPositionWhenFixed: function() {
    var marginLeft = parseInt(this._window.getComputedStyle(this.element).marginLeft, 10);
    this._leftPositionWhenFixed = this._window.pageXOffset + this.element.getBoundingClientRect().left - marginLeft;
  },

  /**
   * Saves element's bounding box height to an instance property so that it is not
   * calculated on every #_update.
   *
   * @instance
   * @private
   */
  _setBoundingBoxHeight: function() {
    this.boundingBoxHeight = this.element.getBoundingClientRect().height;
  },

  /**
   * Creates the placeholder that will be used in place of the element
   * when the element is positioned absolutely or fixed
   *
   * @instance
   * @private
   */
  _createPlaceholder: function() {
    this._placeholder = Placeholder.create(this);
  },

  /**
   * Attaches #_onScroll method to Window.onscroll event
   *
   * @instance
   * @private
   */
  _subscribeToWindowScroll: function() {
    this._window.addEventListener('scroll', this._onScroll.bind(this));
  },

  /**
   * Debounces the scroll event
   *
   * @see [Debouncing Scroll Events]{@link http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events}
   * @instance
   * @private
   *
   * @todo Don't run _update when container is not visible
   */
  _onScroll: function() {
    if (!this._isTicking) {
      this._latestKnownScrollY = this._window.pageYOffset;
      this._window.requestAnimationFrame(this._update.bind(this));
      this._isTicking = true;
    }
  },

  /**
   * @returns {boolean}
   * @instance
   * @private
   */
  _isStatic: function() {
    return this._posScheme === PositionSticky.POS_SCHEME_STATIC;
  },

  /**
   * @instance
   * @private
   */
  _makeStatic: function() {
    this.element.style.position = 'static';
    this._placeholder.element.style.display = 'none';
    this._posScheme = PositionSticky.POS_SCHEME_STATIC;
  },

  /**
   * @returns {boolean}
   * @instance
   * @private
   */
  _isFixed: function() {
    return this._posScheme === PositionSticky.POS_SCHEME_FIXED;
  },

  /**
   * @instance
   * @private
   */
  _makeFixed: function() {
    this.element.style.bottom = null;
    this.element.style.position = 'fixed';
    this.element.style.top = this.offsetTop + 'px';
    this.element.style.left = this._leftPositionWhenFixed + 'px';
    this._placeholder.element.style.display = 'block';
    this._posScheme = PositionSticky.POS_SCHEME_FIXED;
  },

  /**
   * @returns {boolean}
   * @instance
   * @private
   */
  _isAbsolute: function() {
    return this._posScheme === PositionSticky.POS_SCHEME_ABSOLUTE;
  },

  /**
   * @instance
   * @private
   */
  _makeAbsolute: function() {
    this.element.style.top = null;
    this.element.style.position = 'absolute';
    this.element.style.bottom = this._container.paddingBottom + 'px';
    this.element.style.left = this._leftPositionWhenAbsolute + 'px';
    this._placeholder.element.style.display = 'block';
    this._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
  },

  /**
   * This is the main method that runs on every animation frame during scroll.
   * It starts with checking whether the element is within the static range.
   * If not, it checks whether the element is within the fixed range.
   * Otherwise, it positions the element absolutely.
   *
   * @instance
   * @private
   */
  _update: function() {
    this._isTicking = false;

    if (this._isBelowThreshold()) {
      if (!this._isStatic()) {
        this._makeStatic();
      }
    } else if (this._canStickyFitInContainer()) {
      if (!this._isFixed()) {
        this._makeFixed();
      }
    } else {
      if (!this._isAbsolute()) {
        this._makeAbsolute();
      }
    }
  },

  /**
   * Returns true when the page hasn't been scrolled to the threshold point yet.
   * Otherwise, returns false.
   *
   * @returns {boolean}
   * @instance
   * @private
   */
  _isBelowThreshold: function() {
    if (this._latestKnownScrollY < this._threshold) {
      return true;
    }
    return false;
  },

  /**
   * Checks whether the element can fit inside the visible portion of the container or not
   *
   * @returns {boolean}
   * @instance
   * @private
   */
  _canStickyFitInContainer: function() {
    return this._getAvailableSpaceInContainer() >= this.boundingBoxHeight;
  },

  /**
   * Calculates the height of the visible portion of the container
   * that can be used to fit the sticky element
   *
   * @returns {number}
   * @instance
   * @private
   */
  _getAvailableSpaceInContainer: function() {
    return this._container.element.getBoundingClientRect().bottom - this.offsetBottom - this.offsetTop;
  },

  /**
   * Calculates element's total offset from the document top.
   * It uses placeholder if it is called when the element is
   * already sticky (e.g. through #refresh)
   *
   * @returns {number}
   * @instance
   * @private
   */
  _getElementDistanceFromDocumentTop: function() {
    var element = (this._isStatic() ? this.element : this._placeholder.element);
    var totalOffsetTop = this._latestKnownScrollY + element.getBoundingClientRect().top;
    return totalOffsetTop;
  },

  /**
   * Re-measures the cached positions/dimensions that are used during scroll
   *
   * @instance
   * @public
   */
  refresh: function() {
    this._calcThreshold();
    this._setBoundingBoxHeight();
    this._placeholder.refresh();
  }

};
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());