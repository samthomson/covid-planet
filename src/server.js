var static = require("node-static");

var file = new static.Server("./src/public");

require("http")
  .createServer((request, response) => {
    request
      .addListener("end", () => {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(8888);
