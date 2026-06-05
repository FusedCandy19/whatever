import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateApiKey() {
  const raw = crypto.randomBytes(32).toString("hex");
  const fullKey = `sk-${raw}`;
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");
  const keyPrefix = fullKey.substring(0, 10);
  return { fullKey, keyHash, keyPrefix };
}

export function maskApiKey(prefix: string): string {
  return `${prefix}...`;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}
