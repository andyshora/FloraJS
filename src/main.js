// Flora classes
var Flora = {
  BorderPalette: require('borderpalette'),
  ColorPalette: require('colorpalette'),
  SimplexNoise: require('quietriot'),
  SoundBed: require('soundbed'),
  System: require('burner').System,
  Utils: require('burner').Utils,
  Vector: require('burner').Vector,
  World: require('burner').World
};

Flora.System.Classes = {
  Agent: require('./Agent'),
  Attractor: require('./Attractor'),
  BorderPalette: require('borderpalette'),
  Caption: require('./Caption'),
  Connector: require('./Connector'),
  Dragger: require('./Dragger'),
  FlowField: require('./FlowField'),
  FlowFieldMarker: require('./FlowFieldMarker').FlowFieldMarker,
  InputMenu: require('./InputMenu').InputMenu,
  Mover: require('./Mover').Mover,
  Oscillator: require('./Oscillator').Oscillator,
  Particle: require('./Particle').Particle,
  ParticleSystem: require('./ParticleSystem').ParticleSystem,
  Point: require('./Point').Point,
  RangeDisplay: require('./RangeDisplay').RangeDisplay,
  Repeller: require('./Repeller').Repeller,
  Sensor: require('./Sensor').Sensor,
  Stimulus: require('./Stimulus').Stimulus,
  Walker: require('./Walker').Walker
};

module.exports = Flora;