

const geoData = require('./lift-country')
const DataPointsUtil = require('./data-points-util')




const uniqueGeoCountries = geoData.getGeoJSONCountriesISOA2()
console.log(uniqueGeoCountries.length, 'countries with geo polygons data')

const missing = []
uniqueGeoCountries.forEach(coronaResult => {
	if (!uniqueGeoCountries.includes(coronaResult)) {
		missing.push(coronaResult)
	}
	
});
console.log(missing)
console.log(missing.length, 'covid data countries with missing geodata')

// for each covid country, generate a some points, and add along with a 24hour count to file