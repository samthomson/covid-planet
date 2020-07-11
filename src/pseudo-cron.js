const CronJob = require("cron").CronJob;

const crunch = require("./data-generation/util/crunch-new").crunch;

const cronFrequency = "0 0 * * *";

console.log("psudeo");
new CronJob(
  cronFrequency,
  () => {
    crunch();
  },
  undefined,
  true,
  "Europe/London"
);
