var fs = require('fs');

// load data file
var config = require('./countries.json');
const countryName = 'United States of America'

// lift off country we're after
const needle = config.features.find(feature => feature.properties.ADMIN === countryName)

// save it as isolated geojson data file
fs.writeFile(`out/${needle.properties.ISO_A3}.json`, JSON.stringify(needle), 'utf8', () => {
	console.log('done')
});