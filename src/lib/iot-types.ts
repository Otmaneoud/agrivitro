import { z } from "zod";

export interface GreenhouseTelemetry {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lux: number;
  airPpm: number;
  fanStatus: number; // 0 = stopped, 1 = running
  fanManual: number; // 0 = auto mode, 1 = manual override
  pumpStatus: number; // 0 = stopped, 1 = pumping
  pumpManual: number; // 0 = auto mode, 1 = manual override
  time: string;
  location: string;
}

export interface TelemetryPoint {
  time: string;
  timestamp: number;
  timeLabel: string;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  lux?: number;
  airPpm?: number;
}

export interface RecentReadingRecord {
  time: string;
  timeFormatted: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lux: number;
  airPpm: number;
  fanStatus: number;
  pumpStatus: number;
}

export const actuatorCommandSchema = z.object({
  actuator: z.enum(["fan", "pump"]),
  action: z.enum(["on", "off", "auto"]),
  passkey: z.string().optional(),
});

export type ActuatorCommandInput = z.infer<typeof actuatorCommandSchema>;

export const timeRangeSchema = z.object({
  range: z.enum(["24h", "7d", "30d"]).default("24h"),
  location: z.string().default("fes"),
});

export type TimeRangeInput = z.infer<typeof timeRangeSchema>;

export interface CommandResult {
  ok: boolean;
  message: string;
  actuator: "fan" | "pump";
  action: "on" | "off" | "auto";
  writtenLine?: string;
  timestamp: string;
}
