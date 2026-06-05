import { PrismaClient, Plan, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 12);
  const userHash = await bcrypt.hash("demo123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: adminHash,
      role: Role.ADMIN,
      plan: Plan.ENTERPRISE,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash: userHash,
      role: Role.USER,
      plan: Plan.PRO,
    },
  });

  for (const [id, displayName, ctx, inp, out] of [
    ["gpt-4o", "GPT-4o", 128000, 5.0, 15.0],
    ["gpt-4o-mini", "GPT-4o Mini", 128000, 0.15, 0.6],
    ["gpt-3.5-turbo", "GPT-3.5 Turbo", 16385, 0.5, 1.5],
  ] as const) {
    await prisma.model.upsert({
      where: { id },
      update: {},
      create: { id, displayName, contextWindow: ctx, inputPricePer1M: inp, outputPricePer1M: out, enabled: true },
    });
  }

  const fullKey = `sk-${crypto.randomBytes(24).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");
  const keyPrefix = fullKey.substring(0, 10);

  await prisma.apiKey.upsert({
    where: { keyHash },
    update: {},
    create: {
      userId: user.id,
      name: "Default Key",
      keyHash,
      keyPrefix,
      permissions: ["read", "write"],
      status: "ACTIVE",
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  const key = await prisma.apiKey.findFirst({ where: { userId: user.id } });
  const models = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"];
  const now = Date.now();

  if (key) {
    for (let i = 89; i >= 0; i--) {
      const model = models[Math.floor(Math.random() * models.length)];
      const inputTokens = Math.floor(Math.random() * 50000) + 10000;
      const outputTokens = Math.floor(Math.random() * 30000) + 5000;
      await prisma.usageLog.create({
        data: {
          apiKeyId: key.id,
          userId: user.id,
          model,
          inputTokens,
          outputTokens,
          costUsd: (inputTokens * 5 + outputTokens * 15) / 1_000_000,
          createdAt: new Date(now - i * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  await prisma.invoice.createMany({
    skipDuplicates: true,
    data: [
      { userId: user.id, amountUsd: 42.5, status: "PAID", period: new Date("2024-05-01"), createdAt: new Date("2024-06-01") },
      { userId: user.id, amountUsd: 38.2, status: "PAID", period: new Date("2024-04-01"), createdAt: new Date("2024-05-01") },
    ],
  });

  await prisma.brandingConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, platformName: "APIaaS", accentColor: "#8b5cf6", themePreset: "dark-violet" },
  });

  console.log("Seed complete.");
  console.log("  Admin: admin@example.com / admin123");
  console.log("  User:  demo@example.com  / demo123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
