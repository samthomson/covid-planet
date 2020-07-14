import * as fs from "fs";

import * as GeoJSONUtil from "./util/geoJSON";
import * as CoronaDataUtil from "./util/corona-data";

// requestUSStateData();

const test = async () => {
  const mixedData = await CoronaDataUtil.getStatsFromAPI();

  fs.writeFile(
    `mixed-test.json`,
    JSON.stringify(mixedData, null, 4),
    "utf8",
    (err) => {
      console.log("wrote a file to disk containing all mixed data");
      if (err) {
        console.error("problem writing file to disk", err);
      }
    }
  );
};

// test();
GeoJSONUtil.getGeoJSONUSStates();
