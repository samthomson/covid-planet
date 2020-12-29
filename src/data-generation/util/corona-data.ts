import axios from "axios"
import * as moment from 'moment'

import * as validUSStates from "../datasets/validUSStates.json";

const keyValueValidUSStates = () => {
  const states = {}
  validUSStates.forEach(state => {
    states[state.name] = state['alpha-2']
  })
  return states
}

export const requestUSStateData = async (): Promise<[]> => {
  try {
    const usStatesResponse = await axios.get(
      `https://covid-api.com/api/reports?date=${moment().add(-1, 'days').format('YYYY-MM-DD')}&iso=USA`
    );
    const statesCoronaData = usStatesResponse.data.data
    const validStateNames = getValidUSStateNames();

    const validUSStatesOnly = statesCoronaData.filter((prospectiveState) =>
    validStateNames.includes(prospectiveState.region.province)
    );
    const validUSStateKeys = keyValueValidUSStates()
    const filteredStateData = validUSStatesOnly.map((state) => ({
      region: "US_" + validUSStateKeys[state.region.province],
      cases: state.confirmed_diff,
      deaths: state.deaths_diff,
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

    const omitCountries = ['US']; // add in 'US' when/if I later find US state data again

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

const getValidUSStateNames = (): string[] => {
  return validUSStates.map(({name}) => name);
};

export const getStatsFromAPI = async () => {
  const countryData = await getCountryCoronaData();
  const USStateData = await requestUSStateData();

  const allCoronaData = [...countryData, ...USStateData];

  return allCoronaData;
};
