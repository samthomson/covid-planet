
const DataPointsUtil = require('./data-points-util')

const getStats = async () => {
  
	const stats = await DataPointsUtil.getStatsFromAPI()

	console.log(stats)
	console.log(stats.length, 'countries with covid data')
}
	
getStats()

// const uniqueGeoCountries = geoData.getCountriesISOA2()
// console.log(uniqueGeoCountries)
// console.log(uniqueGeoCountries.length)