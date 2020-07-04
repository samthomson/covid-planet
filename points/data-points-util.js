
const axios = require('axios').default
var fs = require('fs');
var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('turf');

var countries = require('./countries.json');


const getStatsFromAPI = async () => {
	try {
		const summaryResp = await axios.get("https://api.covid19api.com/summary")
		
		const summary = summaryResp.data

		// console.log('summary', summary)
		
		const uniqueCountries = summary.Countries.map(country => country.CountryCode)
		
		return uniqueCountries


		

	} catch (err) {
		console.log('err', err)
	}
}

const getGeoJSONCountriesISOA2 = () => {
	return countries.features.map(country => country.properties.ISO_A2)
}

const getGeoJSONCountryByISOA2 = (ISOA2) => {
	return countries.features.find(country => country.properties.ISO_A2 === ISOA2)
}

const getGeoJSONCountries = () => {
	return countries
}


const randomPointsWithinGeoJSONCountry = (pointsRequested, countryPolygon) => {

	// var multiGeometry = turf.multiPolygon(countryPolygon);
	var points = randomPointsOnPolygon(pointsRequested, countryPolygon);
	const latLonPoints = points.map(point => ({lat: point.geometry.coordinates[1], lng: point.geometry.coordinates[0]}))

	return latLonPoints
}

module.exports = {
	getGeoJSONCountries,
	getGeoJSONCountriesISOA2,
	getGeoJSONCountryByISOA2,
	getStatsFromAPI,
	randomPointsWithinGeoJSONCountry
}