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