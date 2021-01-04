import document from "document";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

let activityTypes = [
  "steps",
  "distance",
  "calories",
  "elevationGain",
  "activeZoneMinutes",
];

function drawActivity(activityType) {
  let actual = today.adjusted[activityType] || 0;
  let goal = goals[activityType] || 1;

  if (activityType == "activeZoneMinutes") {
    actual = today.adjusted[activityType].total || 0;
    goal = goals[activityType].total || 1;
  }

  const el = document.getElementById(activityType);
  const progressArc = el.getElementsByClassName("progress")[0];
  const iconMet = el.getElementsByClassName("met")[0];
  const iconNotMet = el.getElementsByClassName("not-met")[0];

  if (actual >= goal) {
    iconMet.style.display = "inline";
    iconNotMet.style.display = "none";
    progressArc.sweepAngle = 360;
  } else {
    iconMet.style.display = "none";
    iconNotMet.style.display = "inline";
    progressArc.sweepAngle = 360 * (actual / goal);
  }

  const valueEl = el.getElementsByClassName("value")[0];

  if (valueEl !== undefined) {
    valueEl.text = formatNumber(actual);
  }

  // console.log(
  //   `${activityType}: ${actual} / ${goal} = ${progressArc.sweepAngle}`
  // );
}

export function drawAllActivities() {
  if (appbit.permissions.granted("access_activity")) {
    for (var i = 0; i < activityTypes.length; i++) {
      drawActivity(activityTypes[i]);
    }
  }
}
