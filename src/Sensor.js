var Item = require('Burner').Item,
    Mover = require('./Mover').Mover,
    System = require('Burner').System,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = ''] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 200] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 7] Width.
 * @param {number} [opt_options.height = 7] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 0] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 * @param {Array} [opt_options.activatedColor = [255, 255, 255]] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {Function} [opt_options.onConsume = null] If sensor.behavior == 'CONSUME', sensor calls this function when consumption is complete.
 */
function Sensor(opt_options) {
  Mover.call(this);
  var options = opt_options || {};

  this.name = options.name || 'Sensor';
  this.type = options.type || '';
  this.behavior = options.behavior || function() {};
  this.sensitivity = typeof options.sensitivity !== 'undefined' ? options.sensitivity : 200;
  this.width = typeof options.width !== 'undefined' ? options.width : 7;
  this.height = typeof options.height !== 'undefined' ? options.height : 7;
  this.offsetDistance = typeof options.offsetDistance !== 'undefined' ? options.offsetDistance : 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = typeof options.opacity !== 'undefined' ? options.opacity : 0.75;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius !== 'undefined' ? options.borderRadius : 100;
  this.borderWidth = typeof options.borderWidth !== 'undefined' ? options.borderWidth : 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.onConsume = options.onConsume || null;
}
Utils.extend(Sensor, Mover);

/**
 * Initializes Sensor.
 * @param  {Object} world       An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 */
Sensor.prototype.init = function(world, opt_options) {
  Sensor._superClass.init.call(this, world, opt_options);
  var options = opt_options || {};

  this.parent = options.parent || null;
  this.displayRange = !!options.displayRange;
  // TODO: enable
  /*if (this.displayRange) {
    this.rangeDisplay = this.createRangeDisplay();
  }*/
  this.displayConnector = !!options.displayConnector;

  this.activationLocation = new Vector();
  this._force = new Vector(); // used as a cache Vector

};

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false;

  /**
   * Check if any Simulus objects exist that match this sensor. If so,
   * loop thru the list and check if sensor should activate.
   */

  var list = System.getAllItemsByName(this.type);

  for (var i = 0, max = list.length; i < max; i++) { // heat

    if (this._sensorActive(list[i], this.sensitivity)) {

      this.target = list[i]; // target this stimulator
      if (!this.activationLocation.x && !this.activationLocation.y) {
        this.activationLocation.x = this.parent.location.x;
        this.activationLocation.y = this.parent.location.y;
      }
      this.activated = true; // set activation
      this.activatedColor = this.target.color;

      if (this.displayConnector && !this.connector) {
        this.connector = System.add('Connector', {
          parentA: this,
          parentB: this.target
        });
      }

      if (this.displayConnector && this.connector && this.connector.parentB !== this.target) {
        this.connector.parentB = this.target;
      }

      check = true;
    }
  }


  if (!check) {
    this.target = null;
    this.activated = false;
    this.state = null;
    this.color = [255, 255, 255];
    this.activationLocation.x = null;
    this.activationLocation.y = null;
    if (this.connector) {
      System.remove(this.connector);
      this.connector = null;
    }
  } else {
    this.color = this.activatedColor;
  }

  this.afterStep.call(this);
};

/**
 * Checks if a sensor can detect a stimulus object. Note: Assumes
 * target is a circle.
 *
 * @param {Object} target The stimulator.
 * @return {Boolean} true if sensor's range intersects target.
 */
Sensor.prototype._sensorActive = function(target) {

  // Two circles intersect if distance bw centers is less than the sum of the radii.
  var distance = Vector.VectorDistance(this.location, target.location),
      sensorRadius = this.sensitivity / 2,
      targetRadius = (target.width / 2) + target.boxShadowSpread;

  return distance < sensorRadius + targetRadius;
};

module.exports.Sensor = Sensor;
