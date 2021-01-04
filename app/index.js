import clock from "clock";
import * as time from "../common/time";
import * as activity from "../common/activity";

clock.granularity = "minutes";

clock.ontick = (evt) => {
  time.drawTime(evt.date);
  time.drawDate(evt.date);
  activity.drawAllActivities();
};
