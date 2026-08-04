const isSameCalendarDay = (left: Date | undefined, right: Date | undefined) =>
  left?.getFullYear() === right?.getFullYear() &&
  left?.getMonth() === right?.getMonth() &&
  left?.getDate() === right?.getDate();

interface ResolveCalendarFocusDateOptions {
  currentMonthDate: Date;
  isDateUnavailable: (date: Date) => boolean;
  preferredDate?: Date;
}

/**
 * Finds the closest selectable day in the visible month. Future days win ties
 * so the result is deterministic while keeping the roving tab stop rendered.
 */
export const resolveCalendarFocusDate = ({
  currentMonthDate,
  isDateUnavailable,
  preferredDate,
}: ResolveCalendarFocusDateOptions): Date | undefined => {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const preferredDay =
    preferredDate?.getFullYear() === year && preferredDate.getMonth() === month
      ? preferredDate.getDate()
      : 1;

  for (let distance = 0; distance < lastDay; distance += 1) {
    const candidateDays =
      distance === 0 ? [preferredDay] : [preferredDay + distance, preferredDay - distance];
    for (const day of candidateDays) {
      if (day < 1 || day > lastDay) {
        continue;
      }

      const candidate = new Date(year, month, day);
      if (!isDateUnavailable(candidate)) return candidate;
    }
  }

  return undefined;
};

export { isSameCalendarDay };
