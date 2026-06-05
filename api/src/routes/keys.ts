import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate";
import { generateApiKey, maskApiKey } from "../lib/crypto";

const createKeySchema = z.object({
  name: z.string().min(1).max(64),
  permissions: z.array(z.enum(["read", "write", "admin"])).min(1),
  rateLimit: z.number().int().min(1).max(100000).optional(),
  expiresAt: z.string().datetime().optional(),
});

const keysRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);

  fastify.get("/v1/keys", async (request) => {
    const keys = await fastify.prisma.apiKey.findMany({
      where: { userId: request.user.sub },
      orderBy: { createdAt: "desc" },
    });
    return {
      keys: keys.map((k) => ({
        id: k.id, name: k.name, keyMasked: maskApiKey(k.keyPrefix),
        permissions: k.permissions, rateLimit: k.rateLimit,
        expiresAt: k.expiresAt, status: k.status, lastUsed: k.lastUsed, createdAt: k.createdAt,
      })),
    };
  });

  fastify.post("/v1/keys", async (request, reply) => {
    const body = createKeySchema.parse(request.body);
    const { fullKey, keyHash, keyPrefix } = generateApiKey();
    const key = await fastify.prisma.apiKey.create({
      data: {
        userId: request.user.sub, name: body.name, keyHash, keyPrefix,
        permissions: body.permissions, rateLimit: body.rateLimit,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      },
    });
    return reply.status(201).send({
      id: key.id, name: key.name, key: fullKey,
      keyMasked: maskApiKey(keyPrefix), permissions: key.permissions,
      rateLimit: key.rateLimit, expiresAt: key.expiresAt, status: key.status, createdAt: key.createdAt,
    });
  });

  fastify.delete("/v1/keys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const key = await fastify.prisma.apiKey.findFirst({ where: { id, userId: request.user.sub } });
    if (!key) return reply.status(404).send({ error: "Key not found" });
    await fastify.prisma.apiKey.update({ where: { id }, data: { status: "REVOKED" } });
    return reply.status(204).send();
  });
};

export default keysRoutes;
