import { FastifyPluginAsync } from "fastify";
import { authenticate } from "../middleware/authenticate";

const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);

  fastify.get("/v1/dashboard/summary", async (request) => {
    const userId = request.user.sub;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentLogs, previousLogs, activeKeys] = await Promise.all([
      fastify.prisma.usageLog.findMany({ where: { userId, createdAt: { gte: thirtyDaysAgo } } }),
      fastify.prisma.usageLog.findMany({ where: { userId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      fastify.prisma.apiKey.count({ where: { userId, status: "ACTIVE" } }),
    ]);

    const totalRequests = currentLogs.length;
    const prevRequests = previousLogs.length;
    const totalTokens = currentLogs.reduce((s, l) => s + l.inputTokens + l.outputTokens, 0);
    const prevTokens = previousLogs.reduce((s, l) => s + l.inputTokens + l.outputTokens, 0);
    const totalCost = currentLogs.reduce((s, l) => s + Number(l.costUsd), 0);
    const prevCost = previousLogs.reduce((s, l) => s + Number(l.costUsd), 0);
    const pct = (cur: number, prev: number) => prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100);

    const sparkline: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      sparkline[d.toISOString().split("T")[0]] = 0;
    }
    for (const log of currentLogs) {
      const day = log.createdAt.toISOString().split("T")[0];
      if (sparkline[day] !== undefined) sparkline[day]++;
    }

    const recentKeys = await fastify.prisma.apiKey.findMany({
      where: { userId, status: "ACTIVE" },
      take: 5,
      orderBy: { lastUsed: "desc" },
      select: { id: true, name: true, lastUsed: true, status: true },
    });

    return {
      totalRequests: { value: totalRequests, delta: pct(totalRequests, prevRequests) },
      totalTokens: { value: totalTokens, delta: pct(totalTokens, prevTokens) },
      activeKeys: { value: activeKeys, delta: 0 },
      spendThisMonth: { value: totalCost, delta: pct(totalCost, prevCost) },
      sparkline: Object.entries(sparkline).map(([date, value]) => ({ date, value })),
      recentKeys,
    };
  });
};

export default dashboardRoutes;
