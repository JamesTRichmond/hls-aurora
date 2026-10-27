/** The sentence the cut is allowed to take. It is the one that explains the dark. */
export const LETTER_KEPT = "If the gallery seems darker, that is only Cygnus.";

export function crewLetter(intact: string, taken: boolean): string {
  if (!taken) return intact;
  const cut = intact.replace(LETTER_KEPT, "").replace(/\s+/g, " ").trim();
  return `${cut} The last line is gone.`;
}

export function obsLetter(intact: string, taken: boolean): string {
  if (!taken) return intact;
  return `${intact} Cut. That sentence was not written. Do not restore it.`;
}

/** A seam takes the line only if it has not been read. Reading it later does not put it back. */
export function takeLetterOnSeam(read: boolean, alreadyTaken: boolean): boolean {
  if (alreadyTaken) return true;
  return !read;
}
