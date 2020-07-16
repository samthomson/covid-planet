import { CronJob } from "cron";

import { crunch } from "./data-generation/util/crunch-new";

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
