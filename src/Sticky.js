/**
 * @namespace Sticky
 * @author Ahmet Katrancı <ahmet@katranci.co.uk>
 */
var Sticky = {

  /**
   * Creates an instance of Sticky
   *
   * @param element
   * @returns {Sticky}
   * @static
   * @public
   */
  create: function(element) {
    return Object.create(Sticky)._init(element);
  },

  /**
   * Constructor method
   *
   * @param element {HTMLElement}
   * @returns {Sticky}
   * @instance
   * @private
   */
  _init: function(element) {
    this.constructor = Sticky;
    this._window = window;
    this.element = element;
    this.boundingBoxHeight = null;

    this._setElementWidth();
    this._setBoundingBoxHeight();

    return this;
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
   * Saves element's bounding box height to an instance property so that it is not
   * calculated on every PositionSticky#_update.
   *
   * @instance
   * @private
   */
  _setBoundingBoxHeight: function() {
    this.boundingBoxHeight = this.element.getBoundingClientRect().height;
  },

  /**
   * Re-measures element's boundingBoxHeight. It is called
   * from PositionSticky#refresh.
   *
   * @instance
   */
  refresh: function() {
    this._setBoundingBoxHeight();
  }

};