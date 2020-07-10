(function () {
  var canvas = document.getElementById("globeCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  const colours = {
    land: "#D1D0CE",
    borders: "#B6B6B4",
    ocean: "#E5E4E2",
    confirmed: "red",
    death: "black",
  };
  const baseTTL = 8000;

  // Create our Planetary.js planet and set some initial values;
  // we use several custom plugins, defined at the bottom of the file
  var planet = planetaryjs.planet();
  planet.loadPlugin(autocenter());
  planet.loadPlugin(autoscale());
  planet.loadPlugin(
    planetaryjs.plugins.earth({
      topojson: { file: "/world-110m.json" },
      oceans: { fill: colours.ocean },
      land: { fill: colours.land },
      borders: {
        stroke: colours.borders,
      },
    })
  );
  planet.loadPlugin(planetaryjs.plugins.pings());
  planet.loadPlugin(
    planetaryjs.plugins.zoom({
      scaleExtent: [50, 5000],
    })
  );
  planet.loadPlugin(
    planetaryjs.plugins.drag({
      onDragStart: function () {
        this.plugins.autorotate.pause();
      },
      onDragEnd: function () {
        this.plugins.autorotate.resume();
      },
    })
  );
  // planet.loadPlugin(autorotate(5));
  planet.projection.rotate([100, -10, 0]);
  planet.draw(canvas);

  // Load our geo corona data in.
  d3.json("/country-data.json", function (err, data) {
    if (err) {
      console.error("Problem loading data.");
      return;
    }

    var paused = false;

    // Pause playback and update the time display
    // while scrubbing using the range input.
    d3.select("#slider").call(
      d3.behavior
        .drag()
        .on("dragstart", function () {
          paused = true;
        })
        .on("dragend", function () {
          paused = false;
        })
    );

    setInterval(function () {
      for (var countryCount = 0; countryCount < data.length; countryCount++) {
        var countryData = data[countryCount];
        const chance = Math.random();

        const numberOfPointsAvailable = data[countryCount].points.length;
        const randomPointIndice = Math.floor(
          Math.random() * numberOfPointsAvailable
        );

        const randomLocation = data[countryCount].points[randomPointIndice];

        if (chance < countryData.deathChancePerSecond) {
          // add a new death
          planet.plugins.pings.add(randomLocation.lng, randomLocation.lat, {
            color: colours.death,
            ttl: baseTTL * 2,
            // angle: Math.random() * 10,
          });
        } else if (chance < countryData.caseChancePerSecond) {
          // add a new confirmed case
          planet.plugins.pings.add(randomLocation.lng, randomLocation.lat, {
            color: colours.confirmed,
            ttl: baseTTL,
            // angle: Math.random() * 10,
          });
        }
      }
    }, 1000);
  });

  // Plugin to resize the canvas to fill the window and to
  // automatically center the planet when the window size changes
  function autocenter(options) {
    options = options || {};
    var needsCentering = false;
    var globe = null;

    var resize = function () {
      var width = window.innerWidth + (options.extraWidth || 0);
      var height = window.innerHeight + (options.extraHeight || 0);
      globe.canvas.width = width;
      globe.canvas.height = height;
      globe.projection.translate([width / 2, height / 2]);
    };

    return function (planet) {
      globe = planet;
      planet.onInit(function () {
        needsCentering = true;
        d3.select(window).on("resize", function () {
          needsCentering = true;
        });
      });

      planet.onDraw(function () {
        if (needsCentering) {
          resize();
          needsCentering = false;
        }
      });
    };
  }

  // Plugin to automatically scale the planet's projection based
  // on the window size when the planet is initialized
  function autoscale(options) {
    options = options || {};
    return function (planet) {
      planet.onInit(function () {
        var width = window.innerWidth + (options.extraWidth || 0);
        var height = window.innerHeight + (options.extraHeight || 0);
        planet.projection.scale(Math.min(width, height) / 2);
      });
    };
  }

  // Plugin to automatically rotate the globe around its vertical
  // axis a configured number of degrees every second.
  function autorotate(degPerSec) {
    return function (planet) {
      var lastTick = null;
      var paused = false;
      planet.plugins.autorotate = {
        pause: function () {
          paused = true;
        },
        resume: function () {
          paused = false;
        },
      };
      planet.onDraw(function () {
        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          var now = new Date();
          var delta = now - lastTick;
          var rotation = planet.projection.rotate();
          rotation[0] += (degPerSec * delta) / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  }
})();
