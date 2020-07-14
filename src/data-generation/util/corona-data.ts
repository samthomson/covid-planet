import axios from "axios";

import * as validUSStates from "../datasets/validUSStates.json";

const requestUSStateData = async (): Promise<[]> => {
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

const getCountryCoronaData = async () => {
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

const getValidUSStateCodes = (): string[] => {
  return validUSStates.map((state) => state["alpha-2"]);
};

export const getStatsFromAPI = async () => {
  const countryData = await getCountryCoronaData();
  const USStateData = await requestUSStateData();

  const allCoronaData = [...countryData, ...USStateData];

  return allCoronaData;
};
