import document from "document";
import { preferences } from "user-settings";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeLabel = document.getElementById("time");
const dateLabel = document.getElementById("date");

function drawDate(date) {
  dateLabel.text = `${days[date.getDay()]}, ${
    months[date.getMonth()]
  } ${date.getDate()}`;
}

function drawTime(date) {
  let hours = date.getHours();
  let amPm = "";
  let mins = zeroPad(date.getMinutes());

  if (preferences.clockDisplay === "12h") {
    amPm = hours < 12 ? "am" : "pm";
    hours = hours % 12 || 12;
  } else {
    hours = zeroPad(hours);
  }

  timeLabel.text = `${hours}:${mins}${amPm}`;
}

export function drawDateTime(date) {
  drawTime(date);
  drawDate(date);
}
