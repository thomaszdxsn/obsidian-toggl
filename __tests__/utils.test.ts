import { formatSeconds, nowPercentageInDay } from "../src/utils";


it("formatSeconds", () => {
  expect(formatSeconds(0)).toBe("00:00:00")
  expect(formatSeconds(1)).toBe("00:00:01")
  expect(formatSeconds(59)).toBe("00:00:59")
  expect(formatSeconds(60)).toBe("00:01:00")
  expect(formatSeconds(61)).toBe("00:01:01")
  expect(formatSeconds(3599)).toBe("00:59:59")
  expect(formatSeconds(3600)).toBe("01:00:00")
  expect(formatSeconds(3601)).toBe("01:00:01")
  expect(formatSeconds(86399)).toBe("23:59:59")
  expect(formatSeconds(86400)).toBe("24:00:00")
  expect(formatSeconds(86401)).toBe("24:00:01")
})

it("nowPercentageInDay", () => {
  expect(nowPercentageInDay()).toBeGreaterThan(0)
  expect(nowPercentageInDay()).toBeLessThan(1)
})