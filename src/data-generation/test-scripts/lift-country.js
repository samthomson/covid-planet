const DataPointsUtil = require("../util/data-points-util");
var fs = require("fs");

// load data file
const countryNameISO2 = "RU";

// lift off country we're after
const needle = DataPointsUtil.getGeoJSONCountryByISOA2(countryNameISO2);

// save it as isolated geojson data file
fs.writeFile(
  `out/${needle.properties.ISO_A3}.json`,
  JSON.stringify(needle),
  "utf8",
  () => {
    console.log("done");
  }
);
