// Shared types for dashboard state

export interface Link {
  id: string;
  name: string;
  url: string;
}

export interface Folder {
  id: string;
  name: string;
  links: Link[];
}

export interface ForecastDay {
  day: string;
  icon: string;
  temp: number;
}

export interface Weather {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  forecast: ForecastDay[];
}

export interface DashboardState {
  user: string;
  activeFolderId: string | null;
  weather: Weather;
  folders: Folder[];
  focus?: string;
  focusDate?: string;
}
