import crypto from "crypto";

const ALGO = "aes-256-gcm";
const ENC_KEY = Buffer.from(process.env.TOKEN_ENC_KEY!, "hex"); // must be 32 bytes (openssl rand -hex 32)
const IV_LEN = 16;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, ENC_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(payload: string) {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, ENC_KEY, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
