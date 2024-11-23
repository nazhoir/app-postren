import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  13,
);

export function generateRegistrationNumber(
  gender?: "L" | "P",
  birthDate?: string,
): string {
  // Generate Id base on year
  const thisYear = new Date().getFullYear().toString().slice(-2);

  //generate id base on birth date

  const newBirth = new Date(birthDate!);
  const date = newBirth.getDate() + (gender === "L" ? 0 : 40);
  const mounth = newBirth.getMonth();
  const year = newBirth.getFullYear().toString().slice(-2);

  const birthDateID = `${date.toString().padStart(2, "0")}${mounth?.toString().padStart(2, "0")}${year}`;

  // generate random id
  const randID = customAlphabet("0123456789", 8);

  const result = `${thisYear}${birthDateID}${randID()}`;
  return result;
}
