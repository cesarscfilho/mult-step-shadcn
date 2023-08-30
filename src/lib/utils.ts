import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const RE_DIGIT = new RegExp(/^\d+$/)

export function formatPhoneNumber(input: string): string {
  const numericOnly = input.replace(/\D/g, '')

  if (numericOnly.length <= 2) {
    return numericOnly
  } else if (numericOnly.length <= 7) {
    return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(2)}`
  } else {
    return `(${numericOnly.slice(0, 2)}) ${numericOnly.slice(
      2,
      7,
    )}-${numericOnly.slice(7, 11)}`
  }
}

export function unformatPhoneNumber(input: string): string {
  const numericOnly = input.replace(/\D/g, '')
  return numericOnly
}
