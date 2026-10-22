import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE_DISPLAY = "(559) 653-2810";
export const PHONE_TEL = "+15596532810";
export const FORMSPREE = "https://formspree.io/f/mgojgodw";
