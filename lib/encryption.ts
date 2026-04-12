import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * AES-256-GCM encryption for PII fields (input_data, letter content).
 *
 * Format: base64( iv[12] + authTag[16] + ciphertext )
 *
 * The encryption key is derived from the ENCRYPTION_KEY env var (must be 64 hex
 * chars = 32 bytes). This key should be:
 *   - Set in Vercel environment variables as a secret
 *   - NEVER committed to git or exposed to the client
 *   - Backed up securely — losing it means losing access to all encrypted data
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be set as a 64-character hex string (32 bytes). ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(hex, 'hex');
}

/** Encrypt a plaintext string. Returns a base64-encoded payload. */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Pack: iv + authTag + ciphertext
  const packed = Buffer.concat([iv, authTag, encrypted]);
  return packed.toString('base64');
}

/** Decrypt a base64-encoded payload back to plaintext. */
export function decrypt(encoded: string): string {
  const key = getKey();
  const packed = Buffer.from(encoded, 'base64');

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

/** Encrypt a JSON-serializable object. */
export function encryptJSON(data: unknown): string {
  return encrypt(JSON.stringify(data));
}

/** Decrypt back to a parsed JSON object. */
export function decryptJSON<T = unknown>(encoded: string): T {
  return JSON.parse(decrypt(encoded)) as T;
}

/**
 * Check whether a string looks like an encrypted payload (base64 with the
 * right minimum length for iv + authTag). Useful for migration: if data is
 * already plaintext JSON, skip decryption.
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 40) return false;
  // Encrypted payloads are base64; plain JSON starts with { or [
  return !/^[\s[{]/.test(value);
}
