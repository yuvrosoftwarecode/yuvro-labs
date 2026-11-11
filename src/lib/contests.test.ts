import { describe, test, expect } from "bun:test";
import { makeContest, getSchedule, countdown } from "./schedule";
import { earn, catalog, priceFor, canRedeem, goals, voucherValue } from "./embers";
import { createMockContestData } from "../data/contests";
const weekly = makeContest("Weekly", 0), biweekly = makeContest("Biweekly", 0);
describe("contest schedule", () => {
  test("weekly anchor is #46 on 8 Nov 2026 at 20:00 IST, 90 minutes, 3 problems", () => {
    expect([weekly.number, weekly.start, weekly.duration, weekly.problems]).toEqual([46, Date.UTC(2026, 10, 8, 14, 30), 90, 3]);
    expect(makeContest("Weekly", 1).start - weekly.start).toBe(7 * 86400000);
  });
  test("biweekly anchor is #23 on 7 Nov 2026 at 20:00 IST, 120 minutes, 4 problems", () => {
    expect([biweekly.number, biweekly.start, biweekly.duration, biweekly.problems]).toEqual([23, Date.UTC(2026, 10, 7, 14, 30), 120, 4]);
    expect(makeContest("Biweekly", 1).start - biweekly.start).toBe(14 * 86400000);
  });
  test("next 4 weekly and 2 biweekly; last 6 weekly and 3 biweekly", () => {
    const { upcoming, past } = getSchedule(Date.UTC(2026, 10, 11));
    expect(upcoming.filter(c => c.kind === "Weekly").length).toBe(4);
    expect(upcoming.filter(c => c.kind === "Biweekly").length).toBe(2);
    expect(past.filter(c => c.kind === "Weekly").length).toBe(6);
    expect(past.filter(c => c.kind === "Biweekly").length).toBe(3);
    expect(upcoming[0].name).toBe("Weekly Contest 47");
  });
  test("running contest remains upcoming and closes at exact duration", () => {
    expect(getSchedule(weekly.start).upcoming[0].id).toBe(weekly.id);
    expect(countdown(weekly, weekly.start + 89 * 60000)).toBe("Live now");
    expect(getSchedule(weekly.start + 90 * 60000).past[0].id).toBe(weekly.id);
  });
});
describe("Embers economy", () => {
  test("50 participation plus 25 per solved problem", () => { expect(earn(weekly, 500, 1000, 2)).toBe(100); expect(earn(weekly, 1, 1000, 0)).toBe(0); });
  test("streak adds 10 per consecutive contest capped at 50", () => { expect(earn({ ...weekly, streak: 3 }, 500, 1000, 2)).toBe(130); expect(earn({ ...weekly, streak: 8 }, 500, 1000, 2)).toBe(150); });
  test("weekly podium replaces percentile awards", () => { expect([1, 2, 3].map(r => earn(weekly, r, 1000, 3))).toEqual([5125, 3125, 2125]); });
  test("biweekly podium replaces percentile awards", () => { expect([1, 2, 3].map(r => earn(biweekly, r, 1000, 4))).toEqual([10150, 6150, 4150]); });
  test("top 10 percent gets 300 weekly or 600 biweekly", () => { expect(earn(weekly, 100, 1000, 1)).toBe(375); expect(earn(biweekly, 100, 1000, 1)).toBe(675); });
  test("top 25 percent gets 150 weekly or 300 biweekly", () => { expect(earn(weekly, 250, 1000, 1)).toBe(225); expect(earn(biweekly, 250, 1000, 1)).toBe(375); expect(earn(weekly, 251, 1000, 1)).toBe(75); });
  test("10 Embers equals one rupee", () => { expect(voucherValue(3850)).toBe(385); });
  test("voucher catalog costs 5000, 10000, 25000", () => { expect(catalog[0].items.map(i => i.price)).toEqual([5000, 10000, 25000]); });
  test("partner offers cost 15000 and 20000", () => { expect(catalog[1].items.map(i => i.price)).toEqual([15000, 20000]); });
  test("platform costs and 20 percent international discount", () => { expect(catalog[2].items.map(i => priceFor(i, "IN"))).toEqual([1000, 500, 3000, 300]); expect(catalog[2].items.map(i => priceFor(i, "OTHER"))).toEqual([800, 400, 2400, 240]); });
  test("vouchers and partners are India-only", () => { for (const item of [...catalog[0].items, ...catalog[1].items]) expect(canRedeem(item, "OTHER", 200000)).toBe(false); });
  test("goals require 100000/150000 and 60/75 active days", () => { expect(goals.map(g => [g.price, g.activeDays])).toEqual([[100000, 60], [150000, 75]]); });
  test("mock redemption deducts exact cost and rejects insufficient balance", () => { const api = createMockContestData(), item = catalog[2].items[0]; expect(api.redeem(item, "IN", 3850).balance).toBe(2850); expect(() => api.redeem(item, "IN", 999)).toThrow(); });
  test("voucher review is seven days while platform item activates in mock", () => { const api = createMockContestData(); expect(api.redeem(catalog[0].items[0], "IN", 5000).redemption.status).toBe("Pending review, released in 7 days"); expect(api.redeem(catalog[2].items[0], "IN", 1000).redemption.status).toBe("Activated"); });
});
