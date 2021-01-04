import document from "document";
import { preferences } from "user-settings";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const timeLabel = document.getElementById("time");
const dateLabel = document.getElementById("date");

export function drawDate(now) {
  dateLabel.text = `${days[now.getDay()]}, ${
    months[now.getMonth()]
  } ${now.getDate()}`;
}

export function drawTime(now) {
  let hours = now.getHours();
  let amPm = "";
  let mins = zeroPad(now.getMinutes());

  if (preferences.clockDisplay === "12h") {
    amPm = hours < 12 ? " AM" : " PM";
    hours = hours % 12 || 12;
  } else {
    hours = zeroPad(hours);
  }

  timeLabel.text = `${hours}:${mins}${amPm}`;
}
