

const DataPointsUtil = require('./data-points-util')
var fs = require('fs');

// load data file
const countryNameISO2 = 'FR'

// const countries = DataPointsUtil.getGeoJSONCountries()
// const uniqueCountries = countries.features.map(country => ({
// 	name: country.properties.ADMIN,
// 	iso_a2: country.properties.ISO_A2,
// 	iso_a3: country.properties.ISO_A3
// }))
// fs.writeFile(`out/all-countries.json`, JSON.stringify(uniqueCountries), 'utf8', () => {
// 	console.log('done')
// });

// lift off country we're after
const needle = DataPointsUtil.getGeoJSONCountryByISOA2(countryNameISO2)

// save it as isolated geojson data file
fs.writeFile(`out/${needle.properties.ISO_A3}.json`, JSON.stringify(needle), 'utf8', () => {
	console.log('done')
});


