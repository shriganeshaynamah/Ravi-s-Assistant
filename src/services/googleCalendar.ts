import { getAccessToken } from './firebase';
import type { CalendarEvent } from '../types';

export interface GoogleCalendarApiEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export const listGoogleCalendarEvents = async (timeMin?: string): Promise<any[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const now = timeMin || new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    now
  )}&maxResults=50&singleEvents=true&orderBy=startTime`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Google Calendar API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
};

export const createGoogleCalendarEvent = async (event: CalendarEvent): Promise<any> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const startIso = event.startDate.includes('T')
    ? new Date(event.startDate).toISOString()
    : new Date(`${event.startDate}T09:00:00`).toISOString();

  const endDate = event.endDate
    ? (event.endDate.includes('T') ? new Date(event.endDate).toISOString() : new Date(`${event.endDate}T10:00:00`).toISOString())
    : new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();

  const payload: GoogleCalendarApiEvent = {
    summary: `[LifeOS] ${event.title}`,
    description: `${event.description || ''}\n\nCategory: ${event.category.toUpperCase()}\nPriority: ${event.priority.toUpperCase()}\nManaged in Dr. Ravi Shankar LifeOS`,
    location: event.location || 'Ayurvedic Practice & HQ',
    start: {
      dateTime: startIso,
    },
    end: {
      dateTime: endDate,
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to create Google Calendar event: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteGoogleCalendarEvent = async (googleEventId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(googleEventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404 && response.status !== 410) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to delete calendar event: ${response.statusText}`);
  }

  return true;
};

export const updateGoogleCalendarEvent = async (googleEventId: string, event: CalendarEvent): Promise<any> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const startIso = event.startDate.includes('T')
    ? new Date(event.startDate).toISOString()
    : new Date(`${event.startDate}T09:00:00`).toISOString();

  const endDate = event.endDate
    ? (event.endDate.includes('T') ? new Date(event.endDate).toISOString() : new Date(`${event.endDate}T10:00:00`).toISOString())
    : new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();

  const payload: GoogleCalendarApiEvent = {
    summary: `[LifeOS] ${event.title}`,
    description: `${event.description || ''}\n\nCategory: ${event.category.toUpperCase()}\nPriority: ${event.priority.toUpperCase()}\nManaged in Dr. Ravi Shankar LifeOS`,
    location: event.location || 'Ayurvedic Practice & HQ',
    start: {
      dateTime: startIso,
    },
    end: {
      dateTime: endDate,
    },
  };

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(googleEventId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to update Google Calendar event: ${response.statusText}`);
  }

  return await response.json();
};
