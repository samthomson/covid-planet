import * as fs from "fs";
import * as randomPointsOnPolygon from "random-points-on-polygon";

import * as countries from "../datasets/countries.json";

export const getGeoJSONCountries = () => {
  const sanitisedCountries = countries.features.map((country) => {
    const countryGeoJSON = country;

    // fix Kosovo
    if (countryGeoJSON.properties.ADMIN === "Kosovo") {
      countryGeoJSON.properties.ISO_A2 = "XK";
    }
    // only take certain properties we'll need, from each country.
    return {
      name: countryGeoJSON.properties.ADMIN,
      regionCode: countryGeoJSON.properties.ISO_A2, // iso2
      // iso3: countryGeoJSON.properties.ISO_A3,
      feature: countryGeoJSON,
    };
  });

  return sanitisedCountries;
};

export const getGeoJSONUSStates = () => {
  const dataDir = "./src/data-generation/datasets/us-states-geojson";
  const filenames = fs.readdirSync(dataDir);
  const geoJSON = filenames.map((path) =>
    JSON.parse(fs.readFileSync(dataDir + "/" + path, "utf8"))
  );

  const sanitised = geoJSON.map((state) => ({
    name: state.properties.name,
    regionCode: "US_" + state.properties.abbreviation,
    feature: state,
  }));

  return sanitised;
};

export const getGeoJSONRegions = () => {
  const sanitisedCountries = getGeoJSONCountries();
  const USStates = getGeoJSONUSStates();

  return [...sanitisedCountries, ...USStates];
};

export const getGeoJSONRegionCodes = () => {
  return getGeoJSONRegions().map((region) => region.regionCode);
};

export const getGeoJSONCountryByRegion = (regionCode) => {
  return getGeoJSONRegions().find(
    (country) => country.regionCode === regionCode
  );
};

export const randomPointsWithinGeoJSONCountry = (
  pointsRequested,
  countryPolygon
) => {
  if (pointsRequested === 0) {
    return [];
  }
  var points = randomPointsOnPolygon(pointsRequested, countryPolygon) ?? [];

  const latLonPoints = points.map((point) => ({
    lat: Number(point.geometry.coordinates[1].toFixed(3)),
    lng: Number(point.geometry.coordinates[0].toFixed(3)),
  }));

  return latLonPoints;
};
