import * as fs from "fs";

import { requestUSStateData, getStatsFromAPI } from "./util/data-points-util";

// requestUSStateData();

const test = async () => {
  const mixedData = await getStatsFromAPI();

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

test();
