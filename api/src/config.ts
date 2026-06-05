import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  API_PORT: z.coerce.number().default(443),
  CERT_DIR: z.string().default("/certs"),
});

export const config = envSchema.parse(process.env);
