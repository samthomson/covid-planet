import axios from "axios";
import * as fs from "fs";
import * as randomPointsOnPolygon from "random-points-on-polygon";

import * as countries from "../datasets/countries.json";
import * as validUSStates from "../datasets/validUSStates.json";

export const requestUSStateData = async (): Promise<[]> => {
  try {
    const usStatesResponse = await axios.get(
      "https://covid19api.io/api/v1/UnitedStateCasesByStates"
    );
    const statesCoronaData = usStatesResponse.data.data[0].table;
    const validStateCodes = getValidUSStateCodes();

    const validUSStatesOnly = statesCoronaData.filter((prospectiveState) =>
      validStateCodes.includes(prospectiveState.state)
    );
    const filteredStateData = validUSStatesOnly.map((state) => ({
      region: "US_" + state.state,
      cases: state.positiveIncrease,
      deaths: state.deathIncrease,
    }));
    return filteredStateData;
  } catch {
    return [];
  }
};

const getValidUSStateCodes = (): string[] => {
  return validUSStates.map((state) => state["alpha-2"]);
};

export const getStatsFromAPI = async () => {
  const countryData = await getCountryCoronaData();
  const USStateData = await requestUSStateData();

  const allCoronaData = [...countryData, ...USStateData];

  return allCoronaData;
};

export const getCountryCoronaData = async () => {
  try {
    const summaryResp = await axios.get("https://api.covid19api.com/summary");

    const countryStats = summaryResp.data.Countries;

    const omitCountries = ["US"];

    const filteredCountries = countryStats.filter(
      (country) => !omitCountries.includes(country.CountryCode)
    );

    const countryCoronaData = filteredCountries.map((country) => ({
      region: country.CountryCode,
      cases: country.NewConfirmed,
      deaths: country.NewDeaths,
    }));

    return countryCoronaData;
  } catch (err) {
    console.log("err", err);
  }
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

export const getGeoJSONRegions = () => {
  const sanitisedCountries = getGeoJSONCountries();
  const USStates = getGeoJSONUSStates();

  return [...sanitisedCountries, ...USStates];
};

export const getGeoJSONRegionCodes = () => {
  return getGeoJSONRegions().map((country) => country.regionCode);
};

export const getGeoJSONCountryByRegion = (ISOA2) => {
  return getGeoJSONRegions().find((country) => country.regionCode === ISOA2);
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
