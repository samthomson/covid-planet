import { CronJob } from "cron";

import { crunch } from "./data-generation/util/crunch-new";

// const cronFrequency = "0 0,6,12,18 * * *";
const cronFrequency = "0,10,20,30,40,50 * * * *";

new CronJob(
  cronFrequency,
  () => {
    crunch();
  },
  undefined,
  true,
  "Europe/London"
);
