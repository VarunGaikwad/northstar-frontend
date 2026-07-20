import type { Station, UpcomingTrain } from "../types/lrt";

// Dummy data only — no API. Later swap for GET /api/lrt/stations + /api/lrt/timetable.
// Real station names from the Utsunomiya-Haga LRT line (19 stops, inbound order).

export const STATIONS: Station[] = [
  { code: 0, name: "芳賀・高根沢工業団地", nameEn: "Haga-Takanezawa Industrial Park" },
  { code: 1, name: "かしの森公園前", nameEn: "Kashinomori-koen-mae" },
  { code: 2, name: "芳賀町工業団地管理中心前", nameEn: "Hagacho-kogyo-danchi-kanri-center-mae" },
  { code: 3, name: "芳賀台", nameEn: "Hagadai" },
  { code: 4, name: "グリーンスタジアム前", nameEn: "Green Stadium-mae" },
  { code: 5, name: "ゆいの杜西", nameEn: "Yuinomori-nishi" },
  { code: 6, name: "ゆいの杜中央", nameEn: "Yuinomori-chuo" },
  { code: 7, name: "ゆいの杜東", nameEn: "Yuinomori-higashi" },
  { code: 8, name: "宇都宮大学陽東キャンパス", nameEn: "Utsunomiya Univ. Yoto Campus" },
  { code: 9, name: "平石中央小学校前", nameEn: "Hiraishi-chuo-shogakko-mae" },
  { code: 10, name: "飛山城跡", nameEn: "Hiyamajoshi-ato" },
  { code: 11, name: "清陵高校前", nameEn: "Seiryo-koko-mae" },
  { code: 12, name: "清原地区市民センター前", nameEn: "Kiyohara-chiku-shimin-center-mae" },
  { code: 13, name: "平石", nameEn: "Hiraishi" },
  { code: 14, name: "グリーンヒル前", nameEn: "Greenhill-mae" },
  { code: 15, name: "陽東3丁目", nameEn: "Yoto 3-chome" },
  { code: 16, name: "宇都宮駅東口", nameEn: "Utsunomiya Station East" },
  { code: 17, name: "東宿郷", nameEn: "Higashi-Shukugo" },
  { code: 18, name: "宇都宮駅東口", nameEn: "Utsunomiya Station East Exit" },
];

const TERMINAL_INBOUND = "Utsunomiya Station East Exit";
const TERMINAL_OUTBOUND = "Haga-Takanezawa Industrial Park";

/**
 * Generate dummy departures from a station: first train 5:41, then every
 * `interval` minutes until 23:52, both directions. Deterministic so the
 * list stays stable across re-renders.
 */
export function generateDummyTimetable(stationCode: number): UpcomingTrain[] {
  const trains: UpcomingTrain[] = [];
  const FIRST = 5 * 60 + 41; // 5:41
  const LAST = 23 * 60 + 52; // 23:52

  // Times shift slightly per station (further down the line = later).
  // Slightly different headways per direction for variety.
  const stationShift = (stationCode % 5) * 2;
  for (const [direction, destination, interval, offset] of [
    ["INBOUND", TERMINAL_INBOUND, 12, 0],
    ["OUTBOUND", TERMINAL_OUTBOUND, 15, 6],
  ] as const) {
    for (let m = FIRST + offset + stationShift; m <= LAST; m += interval) {
      // Rapid only on weekday outbound rush hours (dummy rule)
      const isRapid =
        direction === "OUTBOUND" &&
        ((m >= 7 * 60 && m <= 9 * 60) || (m >= 17 * 60 && m <= 19 * 60));
      trains.push({
        time: formatTime(m),
        minuteOfDay: m,
        direction,
        destination,
        trainType: isRapid ? "RAPID" : "LOCAL",
        isNextDay: false,
      });
    }
  }

  // One next-day train so late-night still shows something upcoming
  trains.push({
    time: "0:21",
    minuteOfDay: 24 * 60 + 21,
    direction: "INBOUND",
    destination: TERMINAL_INBOUND,
    trainType: "LOCAL",
    isNextDay: true,
  });

  return trains.sort((a, b) => a.minuteOfDay - b.minuteOfDay);
}

/** "H:MM" 24h, leading zero omitted for hours < 10 (matches backend format) */
export function formatTime(minuteOfDay: number): string {
  const m = minuteOfDay % (24 * 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}
