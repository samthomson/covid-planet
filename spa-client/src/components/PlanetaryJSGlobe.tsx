import React from "react";
// @ts-ignore
import * as Planetaryjs from "planetary.js";
import worldData from "planetary.js/dist/world-110m.json";

class PlanetaryJSGlobe extends React.Component {
  componentDidMount() {
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

    planet.projection.scale(50).translate([50, 50]);
    planet.draw(canvas);
  }

  render() {
    return (
      <div>
        <canvas id="globe" width="100px" height="100px" />
      </div>
    );
  }
}

export default PlanetaryJSGlobe;
