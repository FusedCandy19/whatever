import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate";
import { hashPassword, verifyPassword } from "../lib/crypto";

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);

  fastify.get("/v1/settings", async (request) => {
    return fastify.prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      select: { id: true, email: true, name: true, role: true, plan: true, createdAt: true },
    });
  });

  fastify.patch("/v1/settings/profile", async (request, reply) => {
    const body = z.object({ name: z.string().min(1).max(100).optional(), email: z.string().email().optional() }).parse(request.body);
    const user = await fastify.prisma.user.update({
      where: { id: request.user.sub },
      data: body,
      select: { id: true, email: true, name: true, role: true, plan: true },
    });
    return reply.send(user);
  });

  fastify.post("/v1/settings/password", async (request, reply) => {
    const body = z.object({ currentPassword: z.string(), newPassword: z.string().min(8) }).parse(request.body);
    const user = await fastify.prisma.user.findUniqueOrThrow({ where: { id: request.user.sub } });
    if (!(await verifyPassword(body.currentPassword, user.passwordHash))) {
      return reply.status(400).send({ error: "Current password is incorrect" });
    }
    await fastify.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(body.newPassword) },
    });
    return reply.send({ message: "Password updated" });
  });
};

export default settingsRoutes;
