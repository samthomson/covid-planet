
// var fs = require('fs');

const DataPointsUtil = require('./data-points-util')


const crunch = async () => {
	// get corona stats per country
	const coronaStats = await DataPointsUtil.getStatsFromAPI()

	// check we have geo data for all corona country data
	const coronaStatsCountries = coronaStats.map(stat => stat.CountryCode)
	const uniqueGeoCountries = DataPointsUtil.getGeoJSONCountriesISOA2()
	const missing = []
	coronaStatsCountries.forEach(coronaResult => {
		if (!uniqueGeoCountries.includes(coronaResult)) {
			missing.push(coronaResult)
		}		
	});
	if (missing.length > 0) {
		console.error(missing.length, 'covid data countries with missing geodata: ', missing.join(','))
	} 

	// for each covid country, generate a some points, and add along with a 24hour count to file
}

crunch()


// const geoCountries = DataPointsUtil.getGeoJSONCountries()
// fs.writeFile(`out/sanitizedGeoJSON.json`, JSON.stringify(geoCountries, null, 4), 'utf8', () => {
// 	console.log('done')
// });	