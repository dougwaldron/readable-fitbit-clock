import { me as appbit } from "appbit";
import clock from "clock";
import document from "document";
import { display } from "display";
import * as datetime from "../common/datetime";
import * as activity from "../common/activity";

if (appbit.permissions.granted("access_activity")) {
  display.onchange = function () {
    if (!display.on) activity.resetClockFace();
  };

  document.getElementById("touch").addEventListener("click", () => {
    activity.toggleClockFace();
  });
}

clock.granularity = "minutes";

clock.ontick = () => {
  if (appbit.permissions.granted("access_activity")) {
    activity.drawClockFace();
  } else {
    datetime.drawDateTime();
  }
};
