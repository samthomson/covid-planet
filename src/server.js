const express = require("express");
const serve = require("express-static");

const app = express();

app.use(serve(__dirname + "/public"));

const server = app.listen(8888, function () {
  console.log("server is running at %s", server.address().port);
});
