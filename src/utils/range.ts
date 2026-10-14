export const CHUNK_SIZE = 10 ** 6; // 1MB

/**
 * Parses a single `bytes=start-[end]` Range header into an inclusive byte range,
 * capped at CHUNK_SIZE bytes and the end of the file.
 *
 * Returns null if the header is malformed or the start is past the end of the file.
 */
export const parseRange = (range: string, size: number): { start: number; end: number } | null => {
  const match = /^bytes=(\d+)-(\d*)$/.exec(range.trim());

  if (!match) {
    return null;
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : Infinity;

  if (start >= size || requestedEnd < start) {
    return null;
  }

  const end = Math.min(requestedEnd, start + CHUNK_SIZE, size - 1);

  return { start, end };
};
