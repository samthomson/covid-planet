const CronJob = require("cron").CronJob;

const crunch = require("./data-generation/util/crunch-new").crunch;

const cronFrequency = "0 */6 * * *";

new CronJob(
  cronFrequency,
  () => {
    crunch();
  },
  undefined,
  true,
  "Europe/London"
);
