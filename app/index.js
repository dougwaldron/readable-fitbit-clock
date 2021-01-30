import { me as appbit } from "appbit";
import clock from "clock";
import document from "document";
import { display } from "display";
import * as datetime from "../common/datetime";
import * as activity from "../common/activity";

if (appbit.permissions.granted("access_activity")) {
  display.onchange = function () {
    if (!display.on) {
      activity.resetGoalIndex();
    }
  };

  document.getElementById("root").addEventListener("click", (evt) => {
    activity.cycleGoalIndex();
  });
}

clock.granularity = "minutes";

clock.ontick = (evt) => {
  datetime.drawDateTime(evt.date);

  if (appbit.permissions.granted("access_activity")) {
    activity.drawAllActivities();
  }
};
