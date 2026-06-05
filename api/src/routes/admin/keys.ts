import { FastifyPluginAsync } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/requireAdmin";
import { maskApiKey } from "../../lib/crypto";

const adminKeysRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);
  fastify.addHook("onRequest", requireAdmin);

  fastify.get("/admin/keys", async (request) => {
    const page = Number((request.query as any).page) || 1;
    const limit = 50;
    const [keys, total] = await Promise.all([
      fastify.prisma.apiKey.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" }, include: { user: { select: { email: true, name: true } } } }),
      fastify.prisma.apiKey.count(),
    ]);
    return { keys: keys.map((k) => ({ ...k, keyMasked: maskApiKey(k.keyPrefix), keyHash: undefined })), total, page };
  });

  fastify.delete("/admin/keys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const key = await fastify.prisma.apiKey.findUnique({ where: { id } });
    if (!key) return reply.status(404).send({ error: "Key not found" });
    await fastify.prisma.apiKey.update({ where: { id }, data: { status: "REVOKED" } });
    return reply.status(204).send();
  });
};

export default adminKeysRoutes;
