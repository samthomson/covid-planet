var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('turf');
var fs = require('fs');


const countryGeoJson = require('./out/USA.json')
const coords = countryGeoJson

var numberOfPoints = 100;

var multiGeometry = turf.multiPolygon(coords);
  

var points = randomPointsOnPolygon(numberOfPoints, coords);

const latLonPoints = points.map(point => ({lat: point.geometry.coordinates[1], lng: point.geometry.coordinates[0]}))

console.log(JSON.stringify(latLonPoints, null, 4));

fs.writeFile(`out/random-points.json`, JSON.stringify(latLonPoints), 'utf8', () => {
	console.log('done')
});