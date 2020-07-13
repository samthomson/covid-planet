const CronJob = require("cron").CronJob;

const crunch = require("./data-generation/util/crunch-new").crunch;

// const cronFrequency = "0 0 * * *";
const cronFrequency = "*/5 * * * *"; // every hour, - temp -to eval caching

new CronJob(
  cronFrequency,
  () => {
    crunch();
  },
  undefined,
  true,
  "Europe/London"
);
