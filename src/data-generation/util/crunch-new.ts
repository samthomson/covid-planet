import * as fs from "fs";

import * as DataPointsUtil from "./data-points-util";

export const crunch = async () => {
  // get corona stats per country
  const coronaStats = await DataPointsUtil.getStatsFromAPI();

  // check we have geo data for all corona country data
  const coronaStatsCountries = coronaStats.map((stat) => stat.region);
  const uniqueGeoRegions = DataPointsUtil.getGeoJSONRegionCodes();
  const missing = [];
  coronaStatsCountries.forEach((coronaResult) => {
    if (!uniqueGeoRegions.includes(coronaResult)) {
      missing.push(coronaResult);
    }
  });
  if (missing.length > 0) {
    console.error(
      missing.length,
      "covid data regions with missing geodata: ",
      missing.join(",")
    );
  } else {
    console.log(
      `got covid data for ${coronaStatsCountries.length} regions. All of which have geo data.`
    );
  }

  // for each covid country, generate a some points, and add along with a 24hour count to file
  const countryGrouppedGeoPoints = coronaStats.map((countryStats) => {
    const { region, cases, deaths } = countryStats;

    const pointsToAskFor = (() => {
      if (cases > 20000) {
        return 40;
      }
      if (cases > 10000) {
        return 30;
      }
      if (cases > 1000) {
        return 20;
      }
      if (cases > 100) {
        return 10;
      }
      if (cases > 10) {
        return 4;
      }
      if (cases > 0) {
        return 2;
      }
      return 0;
    })();

    const geoJSONForRegion = DataPointsUtil.getGeoJSONCountryByRegion(region);
    const pointsForCountry = geoJSONForRegion
      ? DataPointsUtil.randomPointsWithinGeoJSONCountry(
          pointsToAskFor,
          geoJSONForRegion.feature
        )
      : [];
    const casesPerSecond = 86400 / cases;
    const deathPerSecond = 86400 / deaths;

    const caseChancePerSecond = Number((1 / casesPerSecond).toFixed(4));
    const deathChancePerSecond = Number((1 / deathPerSecond).toFixed(4));

    return {
      country: region,
      newConfirmed: cases,
      newDeaths: deaths,
      caseChancePerSecond,
      deathChancePerSecond,
      points: pointsForCountry,
    };
  });

  const dirname = "/app/src/public/data";
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  const countryData = {
    meta: {
      crunchedAt: new Date().toISOString(),
    },
    data: countryGrouppedGeoPoints,
  };

  fs.writeFile(
    `${dirname}/country-data.json`,
    JSON.stringify(countryData, null, 4),
    "utf8",
    (err) => {
      console.log("wrote a file to disk containing all geo points");
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(
        `The script uses approximately ${Math.round(used * 100) / 100} MB`
      );
      if (err) {
        console.error("problem writing file to disk", err);
      }
    }
  );
};
