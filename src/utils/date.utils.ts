export function getNextDayAt(date: Date): Date {
  date.setDate(date.getDate() + 1);

  return date;
}
