import document from "document";
import { today } from "user-activity";
import { goals } from "user-activity";
import { primaryGoal } from "user-activity";

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

let activitySpacing = 80;

let activityTypes = [
  "steps",
  "distance",
  "calories",
  "elevationGain",
  "activeZoneMinutes",
];

if (today.local.elevationGain === undefined) {
  activityTypes = ["steps", "distance", "calories", "activeZoneMinutes"];
  document.getElementsByClassName("elevationGain")[0].style.display = "none";
  activitySpacing = 120;
}

const primaryGoalIndex = (function () {
  for (var i = 0; i < activityTypes.length; i++) {
    if (primaryGoal == activityTypes[i]) {
      return i;
    }
  }
})();

let currentActivityIndex = primaryGoalIndex;

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

function drawPrimaryActivity() {
  let primaryActivity = activityTypes[currentActivityIndex];

  const el = document.getElementById("primaryActivity");
  el.class = primaryActivity;

  const iconEl = el.getElementsByClassName("icon")[0];
  iconEl.href = `icons/${primaryActivity}_48.png`;

  drawActivity(el, primaryActivity);
}

function drawOtherActivities() {
  let posX = 0;

  for (var i = 0; i < activityTypes.length; i++) {
    const ind = (i + currentActivityIndex) % activityTypes.length;
    const activityType = activityTypes[ind];

    const el = document
      .getElementById("activities")
      .getElementsByClassName(activityType)[0];

    if (activityType == activityTypes[currentActivityIndex]) {
      el.style.display = "none";
    } else {
      el.style.display = "inline";
      el.x = posX;
      posX += activitySpacing;
      drawActivity(el, activityType);
    }
  }
}

export function drawAllActivities() {
  drawPrimaryActivity();
  drawOtherActivities();
}

export function resetGoalIndex() {
  currentActivityIndex = primaryGoalIndex;
}

export function cycleGoalIndex() {
  currentActivityIndex = (currentActivityIndex + 1) % activityTypes.length;
  drawAllActivities();
}
