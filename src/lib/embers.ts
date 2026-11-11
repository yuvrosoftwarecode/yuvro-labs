import type { Contest } from "./schedule";
export type Region = "IN" | "OTHER";
export interface CatalogItem { id: string; name: string; price: number; indiaOnly?: boolean; partner?: boolean; rupees?: number }
export interface Redemption { id: string; name: string; price: number; timestamp: number; status: string }
export function earn(contest: Contest, rank: number, participants: number, solved: number): number {
  if (solved <= 0) return 0;
  let amount = 50 + 25 * Math.min(solved, contest.problems) + Math.min(50, Math.max(0, contest.streak ?? 0) * 10);
  if (rank >= 1 && rank <= participants) {
    if (rank <= 3) amount += contest.podium[rank - 1] ?? 0;
    else if (rank <= participants * 0.1) amount += contest.top10;
    else if (rank <= participants * 0.25) amount += contest.top25;
  }
  return amount;
}
export const priceFor = (item: CatalogItem, region: Region) => region !== "IN" && !item.indiaOnly ? Math.round(item.price * 0.8) : item.price;
export const canRedeem = (item: CatalogItem, region: Region, balance: number) => !(item.indiaOnly && region !== "IN") && balance >= priceFor(item, region);
export const voucherValue = (embers: number) => embers / 10;
export const catalog: { name: string; note: string; items: CatalogItem[] }[] = [
  { name: "Shopping vouchers", note: "Available in India for now", items: [
    { id: "v500", name: "₹500 shopping voucher", price: 5000, indiaOnly: true, rupees: 500 },
    { id: "v1000", name: "₹1,000 shopping voucher", price: 10000, indiaOnly: true, rupees: 1000 },
    { id: "v2500", name: "₹2,500 shopping voucher", price: 25000, indiaOnly: true, rupees: 2500 }] },
  { name: "Partner offers", note: "Offered by partner organisations", items: [
    { id: "p1", name: "Developer tools, 3 months", price: 15000, indiaOnly: true, partner: true },
    { id: "p2", name: "Cloud credits worth ₹2,000", price: 20000, indiaOnly: true, partner: true }] },
  { name: "On Yuvro", note: "Available worldwide", items: [
    { id: "a1", name: "AI mock interview", price: 1000 }, { id: "a2", name: "AI learning help, 10 sessions", price: 500 },
    { id: "a3", name: "Premium lab unlock", price: 3000 }, { id: "a4", name: "Profile frame", price: 300 }] },
];
export const goals = [
  { name: "₹10,000 shopping voucher", price: 100000, activeDays: 60 },
  { name: "₹15,000 shopping voucher", price: 150000, activeDays: 75 },
];
