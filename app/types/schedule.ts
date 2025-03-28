export type ScheduleType = "tutor" | "ai";

export interface Schedule {
  id: string;
  title: string;
  time: string;
  tutor?: string;
  status: "confirmed" | "pending";
  type: ScheduleType;
  startDate: Date;
  endDate: Date;
  duration: number; // in minutes
}

export interface DaySchedule {
  date: Date;
  schedules: Schedule[];
  busyness: number; // 0-1 scale
}

export const DURATION_PRESETS = [
  { label: "1 Week", value: 7 * 24 * 60 }, // 7 days in minutes
  { label: "2 Weeks", value: 14 * 24 * 60 },
  { label: "1 Month", value: 30 * 24 * 60 },
  { label: "3 Months", value: 90 * 24 * 60 },
  { label: "6 Months", value: 180 * 24 * 60 },
  { label: "1 Year", value: 365 * 24 * 60 },
  { label: "Custom", value: 0 },
];
