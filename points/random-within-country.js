var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('turf');


const countryGeoJson = require('./out/USA.json')
const coords = countryGeoJson

var numberOfPoints = 5;

var multiGeometry = turf.multiPolygon(coords);
  

var points = randomPointsOnPolygon(numberOfPoints, coords);

console.log(JSON.stringify(points, null, 4));