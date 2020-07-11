var fs = require("fs");

const DataPointsUtil = require("./data-points-util");

const crunch = async () => {
  // get corona stats per country
  const coronaStats = await DataPointsUtil.getStatsFromAPI();

  // check we have geo data for all corona country data
  const coronaStatsCountries = coronaStats.map((stat) => stat.CountryCode);
  const uniqueGeoCountries = DataPointsUtil.getGeoJSONCountriesISOA2();
  const missing = [];
  coronaStatsCountries.forEach((coronaResult) => {
    if (!uniqueGeoCountries.includes(coronaResult)) {
      missing.push(coronaResult);
    }
  });
  if (missing.length > 0) {
    console.error(
      missing.length,
      "covid data countries with missing geodata: ",
      missing.join(",")
    );
  } else {
    console.log(
      `got covid data for ${coronaStatsCountries.length} countries. All of which have geo data.`
    );
  }

  // for each covid country, generate a some points, and add along with a 24hour count to file
  const countryGrouppedGeoPoints = coronaStats.map((countryStats) => {
    const { CountryCode, NewConfirmed, NewDeaths } = countryStats;

    const pointsToAskFor = (() => {
      if (NewConfirmed > 20000) {
        return 200;
      }
      if (NewConfirmed > 10000) {
        return 100;
      }
      if (NewConfirmed > 1000) {
        return 20;
      }
      if (NewConfirmed > 100) {
        return 10;
      }
      if (NewConfirmed > 10) {
        return 4;
      }
      if (NewConfirmed > 0) {
        return 2;
      }
      return 0;
    })();

    const pointsForCountry = DataPointsUtil.randomPointsWithinGeoJSONCountry(
      pointsToAskFor,
      DataPointsUtil.getGeoJSONCountryByISOA2(CountryCode).feature
    );
    const casesPerSecond = 86400 / NewConfirmed;
    const deathPerSecond = 86400 / NewDeaths;

    const caseChancePerSecond = Number((1 / casesPerSecond).toFixed(4));
    const deathChancePerSecond = Number((1 / deathPerSecond).toFixed(4));

    return {
      country: CountryCode,
      newConfirmed: NewConfirmed,
      newDeaths: NewDeaths,
      caseChancePerSecond,
      deathChancePerSecond,
      points: pointsForCountry,
    };
  });

  const dirname = "/app/src/public/data";
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  fs.writeFile(
    `${dirname}/country-data.json`,
    JSON.stringify(countryGrouppedGeoPoints, null, 4),
    "utf8",
    (err) => {
      console.log("wrote a file to disk containing all geo points");
      if (err) {
        console.error("problem writing file to disk", err);
      }
    }
  );
};

module.exports = {
  crunch,
};
