import { FastifyPluginAsync } from "fastify";

const modelsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/v1/models", async () => {
    const models = await fastify.prisma.model.findMany({ where: { enabled: true }, orderBy: { id: "asc" } });
    return {
      object: "list",
      data: models.map((m) => ({
        id: m.id, object: "model", displayName: m.displayName,
        contextWindow: m.contextWindow, inputPricePer1M: Number(m.inputPricePer1M),
        outputPricePer1M: Number(m.outputPricePer1M), created: Math.floor(m.createdAt.getTime() / 1000),
      })),
    };
  });
};

export default modelsRoutes;
