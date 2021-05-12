import document from "document";
import { today } from "user-activity";
import { goals } from "user-activity";
import { primaryGoal } from "user-activity";
import { units } from "user-settings";
import * as datetime from "../common/datetime";

function formatNumber(num) {
  if (num < 0.01) return "0";
  if (num < 0.1) return num.toPrecision(1);
  if (num < 1) return num.toPrecision(2);
  if (num < 1000) return num;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

let activitySpacingHorizontal = 80;
let activitySpacingVertical = 60;

let activityTypes = [
  "steps",
  "activeZoneMinutes",
  "elevationGain",
  "calories",
  "distance",
];

if (today.local.elevationGain === undefined) {
  activityTypes = ["steps", "distance", "calories", "activeZoneMinutes"];
  document.getElementsByClassName("elevationGain")[0].style.display = "none";
  activitySpacingHorizontal = 120;
  activitySpacingVertical = 80;
}

const primaryGoalIndex = (function () {
  for (var i = 0; i < activityTypes.length; i++) {
    if (primaryGoal == activityTypes[i]) {
      return i;
    }
  }
})();

let showPrimaryClockFace = true;

function drawActivity(el, activityType) {
  let actual = today.adjusted[activityType] || 0;
  let goal = goals[activityType] || 1;

  if (activityType == "activeZoneMinutes") {
    actual = today.adjusted[activityType].total || 0;
    goal = goals[activityType].total || 1;
  } else if (activityType == "distance") {
    if (units.distance == "metric") {
      actual = (actual / 1000).toPrecision(3); // meters to kilometers
      goal = (goal / 1000).toPrecision(3); // meters to kilometers
    } else {
      actual = (actual / 1609.344).toPrecision(3); // meters to miles
      goal = (goal / 1609.344).toPrecision(3); // meters to miles
    }
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

function drawPrimaryClockFace() {
  document.getElementById("root").class = "";

  // Draw date & time
  datetime.drawDateTime();

  // Draw primary activity
  let primaryActivity = activityTypes[primaryGoalIndex];

  const el = document.getElementById("primaryActivity");
  el.class = primaryActivity;

  const iconEl = el.getElementsByClassName("icon")[0];
  iconEl.href = `icons/${primaryActivity}_48.png`;

  drawActivity(el, primaryActivity);

  // Draw other activities horizontally across bottom
  let posX = 0;

  for (var i = 0; i < activityTypes.length; i++) {
    const ind = (i + primaryGoalIndex) % activityTypes.length;
    const activityType = activityTypes[ind];

    const el = document
      .getElementById("activities")
      .getElementsByClassName(activityType)[0];

    if (activityType == activityTypes[primaryGoalIndex]) {
      el.style.display = "none";
    } else {
      el.style.display = "inline";
      el.x = posX;
      el.y = 0;
      posX += activitySpacingHorizontal;
      drawActivity(el, activityType);
    }
  }
}

function drawSecondaryClockFace() {
  document.getElementById("root").class = "secondaryClockFace";

  // Draw activities vertically
  let posY = 0;

  for (var i = 0; i < activityTypes.length; i++) {
    const ind = (i + primaryGoalIndex) % activityTypes.length;
    const activityType = activityTypes[ind];

    const el = document
      .getElementById("activities")
      .getElementsByClassName(activityType)[0];

    el.style.display = "inline";
    el.x = 0;
    el.y = posY;
    posY += activitySpacingVertical;
    drawActivity(el, activityType);
  }
}

export function resetClockFace() {
  showPrimaryClockFace = true;
}

export function toggleClockFace() {
  showPrimaryClockFace = !showPrimaryClockFace;
  drawClockFace();
}

export function drawClockFace() {
  if (showPrimaryClockFace) {
    drawPrimaryClockFace();
  } else {
    drawSecondaryClockFace();
  }
}
