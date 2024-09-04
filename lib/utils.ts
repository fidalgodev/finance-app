import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts an amount to mili units
// E.g. "10.50" -> 10500
export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

// Converts an amount from mili units
// E.g. 10500 -> "10.50"
export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

// Format a currency amount
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Calculate the percentage change between two numbers
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  return ((current - previous) / previous) * 100;
}

// Fill in missing dates with 0 values
export function fillMissingDates(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  // Create an array of all days between the start and end date
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map((day) => {
    // Check if the day is in the active days array
    const found = activeDays.find((activeDay) =>
      isSameDay(activeDay.date, day),
    );

    // If the day is not found, return a new object with the date and 0 values
    return found ? found : { date: day, income: 0, expenses: 0 };
  });

  return transactionsByDay;
}
