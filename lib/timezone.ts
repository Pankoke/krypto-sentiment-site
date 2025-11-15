const BERLIN_TIMEZONE = 'Europe/Berlin';

type DateFields = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function formatParts(date: Date): DateFields {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const result = {
    year: NaN,
    month: NaN,
    day: NaN,
    hour: NaN,
    minute: NaN,
  };
  for (const part of parts) {
    if (part.type === 'year') {
      result.year = Number(part.value);
    }
    if (part.type === 'month') {
      result.month = Number(part.value);
    }
    if (part.type === 'day') {
      result.day = Number(part.value);
    }
    if (part.type === 'hour') {
      result.hour = Number(part.value);
    }
    if (part.type === 'minute') {
      result.minute = Number(part.value);
    }
  }
  return result;
}

export function berlinDateString(date = new Date()): string {
  const { year, month, day } = formatParts(date);
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
}

export function berlinDateTimeParts(date = new Date()): DateFields {
  return formatParts(date);
}

export function formatBerlinSnapshotLabel(dateIso: string): { date: string; time: string } {
  const dateObj = new Date(dateIso);
  const parts = berlinDateTimeParts(dateObj);
  const formattedDate = `${parts.day.toString().padStart(2, '0')}.${parts.month
    .toString()
    .padStart(2, '0')}.${parts.year}`;
  const formattedTime = `${parts.hour.toString().padStart(2, '0')}:${parts.minute
    .toString()
    .padStart(2, '0')}`;
  return { date: formattedDate, time: formattedTime };
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function berlinHour(date = new Date()): number {
  return berlinDateTimeParts(date).hour;
}
