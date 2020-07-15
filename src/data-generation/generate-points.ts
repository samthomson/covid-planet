import * as fs from "fs";
import * as GeoJSONUtil from "./util/geoJSON";

const generate = () => {
  // get all georegions (sans US and subdivided regions)
  let regions = GeoJSONUtil.getGeoJSONRegions();

  // generate points within
  let pointsObject = {};
  regions.forEach((regionGeoJSON) => {
    const { feature, regionCode } = regionGeoJSON;
    // get points
    const points = GeoJSONUtil.randomPointsWithinGeoJSONCountry(20, feature);

    pointsObject[regionCode] = {
      points,
    };
  });

  // store as json
  fs.writeFile(
    `regional-points.json`,
    JSON.stringify(pointsObject, null, 4),
    "utf8",
    (err) => {
      console.log("wrote a file to disk containing regional points");
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

generate();
