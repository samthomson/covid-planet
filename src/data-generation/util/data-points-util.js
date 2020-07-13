import axios from "axios";
import randomPointsOnPolygon from "random-points-on-polygon";

import * as countries from "./../datasets/countries.json";

const getStatsFromAPI = async () => {
  try {
    const summaryResp = await axios.get("https://api.covid19api.com/summary");

    const countryStats = summaryResp.data.Countries;
    return countryStats;
  } catch (err) {
    console.log("err", err);
  }
};

const getGeoJSONRegions = () => {
  return countries.features.map((country) => {
    const countryGeoJSON = country;

    // fix Kosovo
    if (countryGeoJSON.properties.ADMIN === "Kosovo") {
      countryGeoJSON.properties.ISO_A2 = "XK";
    }
    // only take certain properties we'll need, from each country.
    return {
      name: countryGeoJSON.properties.ADMIN,
      iso2: countryGeoJSON.properties.ISO_A2,
      // iso3: countryGeoJSON.properties.ISO_A3,
      feature: countryGeoJSON,
    };
  });
};

const getGeoJSONCountriesISOA2 = () => {
  return getGeoJSONRegions().map((country) => country.iso2);
};

const getGeoJSONCountryByISOA2 = (ISOA2) => {
  return getGeoJSONRegions().find((country) => country.iso2 === ISOA2);
};

const randomPointsWithinGeoJSONCountry = (pointsRequested, countryPolygon) => {
  if (pointsRequested === 0) {
    return [];
  }
  var points = randomPointsOnPolygon(pointsRequested, countryPolygon);

  const latLonPoints = points.map((point) => ({
    lat: Number(point.geometry.coordinates[1].toFixed(3)),
    lng: Number(point.geometry.coordinates[0].toFixed(3)),
  }));

  return latLonPoints;
};

module.exports = {
  getGeoJSONRegions,
  getGeoJSONCountriesISOA2,
  getGeoJSONCountryByISOA2,
  getStatsFromAPI,
  randomPointsWithinGeoJSONCountry,
};
