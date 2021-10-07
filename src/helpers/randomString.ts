export const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
export function randomString(length: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map(el => ALPHABET[el % ALPHABET.length]).join("")
}