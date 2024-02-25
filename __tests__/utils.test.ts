import { TimeEntry } from "src/interfaces";
import {
  formatSeconds,
  nowPercentageInDay,
  isSameTimer,
  formatTime,
  isToday,
} from "../src/utils";

it("formatSeconds", () => {
  expect(formatSeconds(0)).toBe("00:00:00");
  expect(formatSeconds(1)).toBe("00:00:01");
  expect(formatSeconds(59)).toBe("00:00:59");
  expect(formatSeconds(60)).toBe("00:01:00");
  expect(formatSeconds(61)).toBe("00:01:01");
  expect(formatSeconds(3599)).toBe("00:59:59");
  expect(formatSeconds(3600)).toBe("01:00:00");
  expect(formatSeconds(3601)).toBe("01:00:01");
  expect(formatSeconds(86399)).toBe("23:59:59");
  expect(formatSeconds(86400)).toBe("24:00:00");
  expect(formatSeconds(86401)).toBe("24:00:01");
});

it("nowPercentageInDay", () => {
  expect(nowPercentageInDay()).toBeGreaterThan(0);
  expect(nowPercentageInDay()).toBeLessThan(1);
});

it("isSameTimer", () => {
  const timer = {
    projectId: 1,
    description: "test",
    tagIds: [1, 2, 3],
    projectName: "123",
    tags: ["123", "456", "789"],
  };
  const entry: TimeEntry = {
    project_id: 1,
    description: "test",
    tag_ids: [1, 2, 3],
    tags: [],
    at: "2021-01-01T00:00:00Z",
    billable: false,
    duronly: false,
    duration: -1,
    start: "2021-01-01T00:00:00Z",
    stop: "2021-01-01T00:00:00Z",
    id: 1,
    pid: 1,
    server_deleted_at: null,
    task_id: null,
    tid: 1,
    uid: 1,
    user_id: 1,
    workspace_id: 1,
    wid: 1,
  };
  expect(isSameTimer({ timer, entry })).toBeTruthy();
});

describe("formatTime", () => {
  it("default format is HH:mm", () => {
    expect(formatTime("2021-11-24 01:02:03")).toBe("01:02");
  });

  it("invalid datetime format is --", () => {
    expect(formatTime("invalid")).toBe("--");
  });

  it("custom format", () => {
    expect(formatTime("2021-11-24 01:02:03", "HH:mm:ss")).toBe("01:02:03");
  });
});

describe("isToday", () => {
  it("1998-08-01 is not today", () => {
    expect(isToday("1998-08-01")).toBeFalsy();
  });

  it("new Date() is today", () => {
    const todayISO = new Date().toISOString();
    expect(isToday(todayISO)).toBeTruthy();
  });
});
