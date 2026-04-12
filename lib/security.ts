/**
 * Sanitize untrusted text destined for an LLM prompt that ultimately renders
 * as plain text in a PDF. We do NOT HTML-encode — the output is not HTML, and
 * encoding mangles legitimate punctuation in names/addresses.
 *
 * Defense against prompt injection comes from XML-tag isolation in the prompt
 * itself. Here we only:
 *   1. strip ASCII control characters (except \n, \r, \t)
 *   2. neutralize any literal </user_input> the user pastes to break out of
 *      the isolation tag
 */
export function sanitizeInput(input: string): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/<\/?user_input>/gi, '');
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
