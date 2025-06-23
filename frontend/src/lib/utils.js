import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Utility function to read a file as a Data URL
// This is useful for previewing images before uploading them
// It returns a promise that resolves with the Data URL of the file
export const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })
}
