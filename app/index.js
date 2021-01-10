import clock from "clock";
import * as datetime from "../common/datetime";
import * as activity from "../common/activity";

clock.granularity = "minutes";

clock.ontick = (evt) => {
  datetime.drawDateTime(evt.date);
  activity.drawAllActivities();
};
