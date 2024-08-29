import { type ClassValue, clsx } from "clsx";
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
