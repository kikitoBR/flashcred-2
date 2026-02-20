import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Get encryption key from environment.
 * Must be exactly 32 bytes (256 bits) for AES-256.
 */
function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('[Crypto] ENCRYPTION_KEY not set in .env! Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    return Buffer.from(key, 'hex');
}

/**
 * Encrypt a plaintext string.
 * Returns: iv:authTag:ciphertext (all hex-encoded, colon-separated)
 */
export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a string encrypted with encrypt().
 * Input format: iv:authTag:ciphertext (hex-encoded, colon-separated)
 */
export function decrypt(encryptedData: string): string {
    const key = getKey();
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
        throw new Error('[Crypto] Invalid encrypted data format. Expected iv:authTag:ciphertext');
    }

    const [ivHex, authTagHex, ciphertext] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
