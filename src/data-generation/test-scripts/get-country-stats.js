var fs = require("fs");

const DataPointsUtil = require("../util/data-points-util");

const getStats = async (debug = false) => {
  const stats = await DataPointsUtil.getStatsFromAPI();

  if (debug) {
    console.log(stats);
    console.log(stats.length, "countries with covid data");

    fs.writeFile(
      `out/covid-api-data.json`,
      JSON.stringify(stats),
      "utf8",
      () => {
        console.log("wrote api data to disk.");
      }
    );
  }
};

getStats();
