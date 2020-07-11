const express = require("express");

const app = express();

app.use(express.static("./src/public"));

const server = app.listen(8888, function () {
  console.log("server is running at %s", server.address().port);
});
