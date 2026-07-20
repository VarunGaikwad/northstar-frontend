// LRT types — mirrors backend DTOs from ENDPOINTS.md

export type LrtDirection = "INBOUND" | "OUTBOUND";
export type LrtTrainType = "LOCAL" | "RAPID";

export interface Station {
  code: number; // 0..18, inbound order
  name: string; // Japanese
  nameEn: string;
}

/** One upcoming train at the selected station (display-ready) */
export interface UpcomingTrain {
  time: string; // "H:MM" 24h
  minuteOfDay: number; // minutes since 00:00 (next-day = +1440)
  direction: LrtDirection;
  destination: string; // English name of train's terminal
  trainType: LrtTrainType;
  isNextDay: boolean;
}
