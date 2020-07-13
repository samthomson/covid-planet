import axios from "axios";

import * as validUSStates from "./datasets/validUSStates.json";

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
      state: state.state,
      newCases: state.positiveIncrease,
      newDeaths: state.deathIncrease,
    }));
    // console.log(filteredStateData);
    return filteredStateData;
  } catch {
    return [];
  }
};

const getValidUSStateCodes = (): string[] => {
  return validUSStates.map((state) => state["alpha-2"]);
};

requestUSStateData();
