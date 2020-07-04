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
  const countryGrouppedGeoPoints = coronaStatsCountries.map(
    (coronaCountryCode) =>
      DataPointsUtil.randomPointsWithinGeoJSONCountry(
        2,
        DataPointsUtil.getGeoJSONCountryByISOA2(coronaCountryCode).feature
      )
  );

  let allGeoPoints = [];

  countryGrouppedGeoPoints.forEach((arrayOfPoints) => {
    allGeoPoints = [...allGeoPoints, ...arrayOfPoints];
  });

  fs.writeFile(
    `out/all-points.json`,
    JSON.stringify(allGeoPoints),
    "utf8",
    () => {
      console.log("wrote a file to disk containing all geo points");
    }
  );
};

crunch();
