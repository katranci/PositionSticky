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