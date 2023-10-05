export function getNextDayAt(date: Date): Date {
  date.setDate(date.getDate() + 1);

  return date;
}

export function getDaysAt(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);

  return date;
}
