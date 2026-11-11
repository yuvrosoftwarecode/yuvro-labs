import { getSchedule, type Contest } from "../lib/schedule";
import { canRedeem, earn, priceFor, type CatalogItem, type Redemption, type Region } from "../lib/embers";
export interface LeaderboardEntry { rank: number; name: string; country: string; solved: number; time: string; embers: number; isYou?: boolean }
export interface ContestDataLayer {
  getContests(now: number): ReturnType<typeof getSchedule>;
  register(id: string, registered: boolean): void;
  redeem(item: CatalogItem, region: Region, balance: number): { balance: number; redemption: Redemption };
  getLeaderboard(contest: Contest): LeaderboardEntry[];
}
const hash = (id: string) => [...id].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
export const participants = (contest: Contest) => 2400 + hash(contest.id) % 2300;
export function myResult(contest: Contest) {
  if (hash(contest.id) % 3 === 2) return null;
  const rank = 100 + hash(contest.id) % 900, solved = 1 + hash(contest.id) % contest.problems;
  return { rank, solved, embers: earn(contest, rank, participants(contest), solved) };
}
export function createMockContestData(): ContestDataLayer {
  const registrations = new Set<string>();
  return {
    getContests: getSchedule,
    register(id, registered) { registered ? registrations.add(id) : registrations.delete(id); },
    redeem(item, region, balance) {
      if (!canRedeem(item, region, balance)) throw new Error("This reward is not available with your current balance or region.");
      const price = priceFor(item, region);
      return { balance: balance - price, redemption: { id: `${item.id}-${Date.now()}`, name: item.name, price, timestamp: Date.now(), status: item.indiaOnly ? "Pending review, released in 7 days" : "Activated" } };
    },
    getLeaderboard(contest) {
      const names = [["Aarav S.", "IN"], ["Meera K.", "IN"], ["Daniel O.", "NG"], ["Priya R.", "IN"], ["Lucas M.", "BR"], ["Ananya V.", "IN"], ["Chen W.", "SG"], ["Fatima A.", "AE"], ["Rohan P.", "IN"], ["Sofia L.", "ES"]];
      const rows: LeaderboardEntry[] = names.map(([name, country], i) => {
        const solved = contest.problems - (i > 5 ? 1 : 0), minutes = 55 + i * 3;
        return { rank: i + 1, name, country, solved, time: `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:00`, embers: earn(contest, i + 1, participants(contest), solved) };
      });
      const me = myResult(contest);
      if (me) rows.push({ ...me, name: "You", country: "", time: "—", isYou: true });
      return rows;
    },
  };
}
