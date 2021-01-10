import document from "document";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";
import { primaryGoal } from "user-activity";

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

const primaryGoalIndex = (function () {
  for (var i = 0; i < activityTypes.length; i++) {
    if (primaryGoal == activityTypes[i]) {
      return i;
    }
  }
})();

let currentGoalIndex = primaryGoalIndex;

function drawActivity(el, activityType) {
  let actual = today.adjusted[activityType] || 0;
  let goal = goals[activityType] || 1;

  if (activityType == "activeZoneMinutes") {
    actual = today.adjusted[activityType].total || 0;
    goal = goals[activityType].total || 1;
  }

  const progressEl = el.getElementsByClassName("progress")[0];
  const completedEl = el.getElementsByClassName("completed")[0];

  if (actual >= goal) {
    completedEl.style.display = "inline";
    progressEl.sweepAngle = 360;
  } else {
    completedEl.style.display = "none";
    progressEl.sweepAngle = 360 * (actual / goal);
  }

  const valueEl = el.getElementsByClassName("value")[0];

  if (valueEl !== undefined) {
    valueEl.text = formatNumber(actual);

    if (actual > 99999) {
      valueEl.style.fontSize = 60;
      valueEl.x = 90;
    }
  }
}

function drawPrimaryGoal() {
  let goal = activityTypes[currentGoalIndex];

  const el = document.getElementById("primaryGoal");
  el.class = goal;

  const iconEl = el.getElementsByClassName("icon")[0];
  iconEl.href = `icons/${goal}_48.png`;

  drawActivity(el, goal);
}

function drawOtherActivities() {
  let posX = 0;

  for (var i = 0; i < activityTypes.length; i++) {
    const activityType = activityTypes[i];
    const el = document
      .getElementById("activities")
      .getElementsByClassName(activityType)[0];

    if (activityType == primaryGoal) {
      el.style.display = "none";
    } else {
      el.x = posX;
      posX += 80;
      drawActivity(el, activityType);
    }
  }
}

export function drawAllActivities() {
  if (appbit.permissions.granted("access_activity")) {
    drawPrimaryGoal();
    drawOtherActivities();
  }
}

export function resetGoalIndex() {
  currentGoalIndex = primaryGoalIndex;
}

export function cycleGoalIndex() {
  currentGoalIndex = (currentGoalIndex + 1) % activityTypes.length;
  drawPrimaryGoal();
}
