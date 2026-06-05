import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/requireAdmin";

const adminModelsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);
  fastify.addHook("onRequest", requireAdmin);

  fastify.get("/admin/models", async () => fastify.prisma.model.findMany({ orderBy: { id: "asc" } }));

  fastify.patch("/admin/models/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = z.object({
      displayName: z.string().optional(),
      enabled: z.boolean().optional(),
      inputPricePer1M: z.number().positive().optional(),
      outputPricePer1M: z.number().positive().optional(),
    }).parse(request.body);
    return reply.send(await fastify.prisma.model.update({ where: { id }, data: body }));
  });

  fastify.post("/admin/models", async (request, reply) => {
    const body = z.object({
      id: z.string(), displayName: z.string(),
      contextWindow: z.number().int().positive(),
      inputPricePer1M: z.number().positive(),
      outputPricePer1M: z.number().positive(),
    }).parse(request.body);
    return reply.status(201).send(await fastify.prisma.model.create({ data: body }));
  });
};

export default adminModelsRoutes;
