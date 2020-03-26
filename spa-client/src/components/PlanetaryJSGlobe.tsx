import React, { useEffect } from "react";
// @ts-ignore
import * as Planetaryjs from "planetary.js";
import worldData from "planetary.js/dist/world-110m.json";

const PlanetaryJSGlobe = () => {
  const PLANET_CIRCUMFERENCE = 700;

  useEffect(() => {
    const planet = Planetaryjs.planet();
    const canvas = document.getElementById("globe");

    planet.loadPlugin(
      Planetaryjs.plugins.earth({
        topojson: { world: worldData },
        oceans: { fill: "whitesmoke" },
        land: { fill: "silver" },
        borders: { stroke: "silver" }
      })
    );

    // load the pings plugin
    planet.loadPlugin(Planetaryjs.plugins.pings());

    // load the drag plugin
    planet.loadPlugin(Planetaryjs.plugins.drag());

    planet.projection
      .scale(PLANET_CIRCUMFERENCE / 2)
      .translate([PLANET_CIRCUMFERENCE / 2, PLANET_CIRCUMFERENCE / 2]);
    planet.draw(canvas);
  }, []);

  return (
    <div>
      <canvas
        id="globe"
        width={`${PLANET_CIRCUMFERENCE}px`}
        height={`${PLANET_CIRCUMFERENCE}px`}
      />
    </div>
  );
};

export default PlanetaryJSGlobe;
