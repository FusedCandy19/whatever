import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate";

const querySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  keyId: z.string().optional(),
  granularity: z.enum(["hour", "day", "week"]).default("day"),
});

const usageRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);

  fastify.get("/v1/usage", async (request) => {
    const query = querySchema.parse(request.query);
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();

    const where: any = { userId: request.user.sub, createdAt: { gte: from, lte: to } };
    if (query.keyId) where.apiKeyId = query.keyId;

    const logs = await fastify.prisma.usageLog.findMany({ where, orderBy: { createdAt: "asc" } });

    const byModel: Record<string, any> = {};
    const byDay: Record<string, any> = {};

    for (const log of logs) {
      if (!byModel[log.model]) byModel[log.model] = { requests: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 };
      byModel[log.model].requests++;
      byModel[log.model].inputTokens += log.inputTokens;
      byModel[log.model].outputTokens += log.outputTokens;
      byModel[log.model].costUsd += Number(log.costUsd);

      const day = log.createdAt.toISOString().split("T")[0];
      if (!byDay[day]) byDay[day] = { requests: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 };
      byDay[day].requests++;
      byDay[day].inputTokens += log.inputTokens;
      byDay[day].outputTokens += log.outputTokens;
      byDay[day].costUsd += Number(log.costUsd);
    }

    return {
      timeSeries: Object.entries(byDay).map(([date, data]) => ({ date, ...data })),
      modelBreakdown: Object.entries(byModel).map(([model, data]) => ({ model, ...data })),
    };
  });
};

export default usageRoutes;
