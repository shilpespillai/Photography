export type SessionTypeId = "birthday" | "maternity" | "event";

export interface SessionType {
  id: SessionTypeId;
  name: string;
  duration: string;
  price: number; // USD, in dollars
  description: string;
}

export const SESSION_TYPES: SessionType[] = [
  {
    id: "birthday",
    name: "Birthday Session",
    duration: "1 hour",
    price: 250,
    description:
      "On-location or studio coverage for milestone birthdays and cake-smash sessions.",
  },
  {
    id: "maternity",
    name: "Maternity Session",
    duration: "1.5 hours",
    price: 300,
    description:
      "Golden-hour outdoor or studio maternity portraits, partner and family welcome.",
  },
  {
    id: "event",
    name: "Event Coverage",
    duration: "2 hours (extendable)",
    price: 400,
    description:
      "Candid and posed coverage for birthday parties, showers, and family gatherings.",
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
];
