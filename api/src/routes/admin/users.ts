import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/requireAdmin";

const adminUsersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);
  fastify.addHook("onRequest", requireAdmin);

  fastify.get("/admin/users", async (request) => {
    const page = Number((request.query as any).page) || 1;
    const limit = 50;
    const [users, total] = await Promise.all([
      fastify.prisma.user.findMany({
        skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" },
        select: { id: true, email: true, name: true, role: true, plan: true, suspended: true, customRateLimit: true, createdAt: true, _count: { select: { apiKeys: true, usageLogs: true } } },
      }),
      fastify.prisma.user.count(),
    ]);
    return { users, total, page, pages: Math.ceil(total / limit) };
  });

  fastify.get("/admin/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await fastify.prisma.user.findUnique({
      where: { id },
      include: { apiKeys: { orderBy: { createdAt: "desc" } }, invoices: { orderBy: { createdAt: "desc" }, take: 12 }, _count: { select: { usageLogs: true } } },
    });
    if (!user) return reply.status(404).send({ error: "User not found" });
    return user;
  });

  fastify.patch("/admin/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = z.object({
      suspended: z.boolean().optional(),
      customRateLimit: z.number().int().min(1).optional().nullable(),
      plan: z.enum(["FREE", "PRO", "ENTERPRISE"]).optional(),
    }).parse(request.body);
    const user = await fastify.prisma.user.update({ where: { id }, data: body, select: { id: true, email: true, suspended: true, plan: true, customRateLimit: true } });
    return reply.send(user);
  });
};

export default adminUsersRoutes;
