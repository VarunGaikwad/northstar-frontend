import type { DashboardState } from "../types";

// Simple unique id helper (no external deps)
export function uid(): string {
  return "id-" + Math.random().toString(36).slice(2, 10);
}

// Dummy seed data shown on first load (before localStorage is populated)
export const DEFAULT_STATE: DashboardState = {
  user: "User",
  activeFolderId: "f-work",
  weather: {
    city: "San Francisco",
    temp: 18,
    condition: "Partly Cloudy",
    icon: "⛅",
    humidity: 62,
    wind: 14,
    forecast: [
      { day: "Mon", icon: "☀️", temp: 21 },
      { day: "Tue", icon: "⛅", temp: 19 },
      { day: "Wed", icon: "🌧️", temp: 17 },
      { day: "Thu", icon: "⛈️", temp: 15 },
    ],
  },
  folders: [
    {
      id: "f-work",
      name: "Work",
      links: [
        { id: uid(), name: "Gmail", url: "https://mail.google.com" },
        { id: uid(), name: "GitHub", url: "https://github.com" },
        { id: uid(), name: "Notion", url: "https://notion.so" },
        { id: uid(), name: "Slack", url: "https://slack.com" },
      ],
    },
    {
      id: "f-personal",
      name: "Personal",
      links: [
        { id: uid(), name: "YouTube", url: "https://youtube.com" },
        { id: uid(), name: "Netflix", url: "https://netflix.com" },
        { id: uid(), name: "Reddit", url: "https://reddit.com" },
      ],
    },
    {
      id: "f-learning",
      name: "Learning",
      links: [
        { id: uid(), name: "MDN", url: "https://developer.mozilla.org" },
        { id: uid(), name: "freeCodeCamp", url: "https://freecodecamp.org" },
        { id: uid(), name: "W3Schools", url: "https://w3schools.com" },
        { id: uid(), name: "Khan Academy", url: "https://khanacademy.org" },
        { id: uid(), name: "Coursera", url: "https://coursera.org" },
      ],
    },
  ],
};
