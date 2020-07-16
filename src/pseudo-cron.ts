import { CronJob } from "cron";

import { crunch } from "./data-generation/util/crunch-new";

// const cronFrequency = "0 0,6,12,18 * * *";
// const cronFrequency = "0 */6 * * *";
const cronFrequency = "*/6 * * * *";
// const cronFrequency = "0 * * * * *";

// console.log("cron\n\n");
new CronJob(
  cronFrequency,
  () => {
    // console.log(new Date().toUTCString() + "crunch\n");
    crunch();
  },
  undefined,
  true,
  "Europe/London"
);
