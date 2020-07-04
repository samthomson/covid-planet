var fs = require('fs');

const DataPointsUtil = require('./data-points-util')

const countryGeoJSONInput = require('./out/RUS.json')

const latLonPoints = DataPointsUtil.randomPointsWithinGeoJSONCountry(50, countryGeoJSONInput)

console.log(JSON.stringify(latLonPoints, null, 4));

fs.writeFile(`out/random-points.json`, JSON.stringify(latLonPoints), 'utf8', () => {
	console.log('done')
});



// const testPoints = randomPointsWithinCountry(100, countryGeoJson)
