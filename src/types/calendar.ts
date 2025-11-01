export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  attendees?: Attendee[];
  source: CalendarSource;
  color?: string;
  recurring?: RecurringRule;
  reminders?: Reminder[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  visibility: 'public' | 'private' | 'confidential';
}

export interface Attendee {
  email: string;
  name?: string;
  status: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  optional?: boolean;
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  count?: number;
  byDay?: string[];
  byMonth?: number[];
}

export interface Reminder {
  id: string;
  minutes: number;
  method: 'popup' | 'email' | 'sms';
  enabled: boolean;
}

export interface CalendarSource {
  id: string;
  name: string;
  type: 'google' | 'apple' | 'outlook' | 'local';
  color: string;
  enabled: boolean;
  lastSync?: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child' | 'guardian';
  avatar?: string;
  preferences: UserPreferences;
  calendarSources: CalendarSource[];
}

export interface UserPreferences {
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultReminders: Reminder[];
  notificationSettings: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  departureAlerts: boolean;
  dailyDigest: boolean;
  eventReminders: boolean;
}

export interface DailyDigest {
  id: string;
  date: Date;
  events: CalendarEvent[];
  reminders: string[];
  weather?: WeatherInfo;
  trafficAlerts?: TrafficAlert[];
  aiInsights: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

export interface TrafficAlert {
  route: string;
  delay: number;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AIQuery {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  context: CalendarEvent[];
  userId: string;
}

export interface CalendarView {
  type: 'day' | 'week' | 'month' | 'agenda';
  date: Date;
  events: CalendarEvent[];
  loading: boolean;
  error?: string;
}
