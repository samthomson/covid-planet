import * as fs from "fs";

import * as GeoJSONUtil from "./util/geoJSON";

const generate = () => {
  // read in countries json, and us state files
  const geoJSONRegions = GeoJSONUtil.getGeoJSONRegions();
  const filteredRegions = geoJSONRegions.filter(
    (region) => region.regionCode !== "-"
  );

  // output each individual region in to a suitable named file
  try {
    filteredRegions.forEach((region) => {
      const outputPath = `./src/data-generation/datasets/geoJSONRegions/${region.regionCode}.geojson`;
      const outputData = JSON.stringify(region.feature, null, 4);
      fs.writeFileSync(outputPath, outputData);
    });
  } catch (err) {
    console.error("error writing geojson files", err);
  }
};

generate();
