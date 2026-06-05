import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { hashPassword, verifyPassword, generateRefreshToken, hashToken } from "../lib/crypto";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({ refreshToken: z.string() });

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/auth/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await fastify.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return reply.status(409).send({ error: "Email already registered" });
    const passwordHash = await hashPassword(body.password);
    const user = await fastify.prisma.user.create({
      data: { email: body.email, name: body.name, passwordHash },
    });
    return issueTokens(fastify, user, reply);
  });

  fastify.post("/auth/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await fastify.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    if (user.suspended) return reply.status(403).send({ error: "Account suspended" });
    return issueTokens(fastify, user, reply);
  });

  fastify.post("/auth/refresh", async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    const tokenHash = hashToken(body.refreshToken);
    const stored = await fastify.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await fastify.prisma.refreshToken.delete({ where: { tokenHash } });
      return reply.status(401).send({ error: "Invalid or expired refresh token" });
    }
    await fastify.prisma.refreshToken.delete({ where: { tokenHash } });
    return issueTokens(fastify, stored.user, reply);
  });

  fastify.post("/auth/forgot-password", async (_req, reply) => {
    return reply.send({ message: "If that email exists, a reset link has been sent." });
  });
};

async function issueTokens(fastify: any, user: any, reply: any) {
  const accessToken = fastify.jwt.sign(
    { sub: user.id, email: user.email, role: user.role, plan: user.plan },
    { expiresIn: "15m" }
  );
  const rawRefresh = generateRefreshToken();
  await fastify.prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawRefresh),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return reply.send({
    accessToken,
    refreshToken: rawRefresh,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
  });
}

export default authRoutes;
