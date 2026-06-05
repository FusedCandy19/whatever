import fs from "fs";
import path from "path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import prismaPlugin from "./plugins/prisma";
import { config } from "./config";
import authRoutes from "./routes/auth";
import keysRoutes from "./routes/keys";
import usageRoutes from "./routes/usage";
import dashboardRoutes from "./routes/dashboard";
import modelsRoutes from "./routes/models";
import billingRoutes from "./routes/billing";
import settingsRoutes from "./routes/settings";
import adminUsersRoutes from "./routes/admin/users";
import adminKeysRoutes from "./routes/admin/keys";
import adminModelsRoutes from "./routes/admin/models";
import adminHealthRoutes from "./routes/admin/health";
import adminBillingRoutes from "./routes/admin/billing";
import brandingRoutes from "./routes/admin/branding";

const certPath = path.join(config.CERT_DIR, "server.crt");
const keyPath = path.join(config.CERT_DIR, "server.key");

const fastify = Fastify({
  https: { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
  logger: { level: config.NODE_ENV === "production" ? "info" : "debug" },
});

fastify.register(helmet, { contentSecurityPolicy: false });
fastify.register(cors, { origin: true, credentials: true, methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] });
fastify.register(rateLimit, { max: 300, timeWindow: "1 minute" });
fastify.register(fastifyJwt, { secret: config.JWT_SECRET });
fastify.register(prismaPlugin);

fastify.setErrorHandler((error, _request, reply) => {
  if (error.validation) return reply.status(400).send({ error: "Validation error", details: error.message });
  if (error.name === "ZodError") return reply.status(400).send({ error: "Validation error", details: (error as any).issues });
  fastify.log.error(error);
  reply.status(error.statusCode ?? 500).send({ error: error.message ?? "Internal server error" });
});

fastify.get("/health", () => ({ status: "ok" }));
fastify.register(authRoutes);
fastify.register(keysRoutes);
fastify.register(usageRoutes);
fastify.register(dashboardRoutes);
fastify.register(modelsRoutes);
fastify.register(billingRoutes);
fastify.register(settingsRoutes);
fastify.register(adminUsersRoutes);
fastify.register(adminKeysRoutes);
fastify.register(adminModelsRoutes);
fastify.register(adminHealthRoutes);
fastify.register(adminBillingRoutes);
fastify.register(brandingRoutes);

fastify.listen({ port: config.API_PORT, host: "0.0.0.0" }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
