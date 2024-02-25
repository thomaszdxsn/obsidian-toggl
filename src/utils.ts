import { TimeEntry, Timer } from "./interfaces";
import dayjs from "dayjs";
import isTodayPlugin from "dayjs/plugin/isToday";
dayjs.extend(isTodayPlugin);

export const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const second = seconds - hours * 3600 - minutes * 60;
  return [hours, minutes, second]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
};

export const nowPercentageInDay = () => {
  const now = new Date();
  const secondsInDay = 24 * 60 * 60;
  const seconds =
    now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
  return Number((seconds / secondsInDay).toFixed(2));
};

export const isSameTimer = ({
  timer,
  entry,
}: {
  timer: Timer;
  entry: TimeEntry;
}) => {
  return (
    timer.projectId === entry.project_id &&
    timer.description === entry.description &&
    timer.tagIds.join(",") === entry.tag_ids.join(",")
  );
};

export const isActiveEntry = (entry: TimeEntry) => {
  return entry.stop === null;
};

export const calcPercentage = (value: number, total: number, fixed = 2) => {
  return Number((value / total).toFixed(fixed));
};

export const formatTime = (
  datetimeStr: string,
  format = "HH:mm",
  invalidText = "--",
) => {
  const d = dayjs(datetimeStr);
  if (d.isValid()) {
    return d.format(format);
  }
  return invalidText;
};

export const generateTimerId = (timer: Timer) => {
  return [timer.projectId, timer.description, timer.tagIds.join(",")].join("-");
};

export const isToday = (datetimeStr: string) => {
  return dayjs(datetimeStr).isToday();
};
