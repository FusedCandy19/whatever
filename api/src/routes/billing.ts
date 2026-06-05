import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../middleware/authenticate";

const billingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);

  fastify.get("/v1/billing", async (request) => {
    const user = await fastify.prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      include: { invoices: { orderBy: { createdAt: "desc" }, take: 12 } },
    });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const usageLogs = await fastify.prisma.usageLog.findMany({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    });
    const planLimits: Record<string, any> = {
      FREE: { requests: 10000, price: 0 },
      PRO: { requests: 1000000, price: 20 },
      ENTERPRISE: { requests: -1, price: 200 },
    };
    return {
      plan: user.plan,
      planDetails: planLimits[user.plan],
      currentCharges: usageLogs.reduce((s, l) => s + Number(l.costUsd), 0),
      billingResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      invoices: user.invoices.map((i) => ({
        id: i.id, amount: Number(i.amountUsd), status: i.status, period: i.period, createdAt: i.createdAt,
      })),
    };
  });

  fastify.patch("/v1/billing/plan", async (request, reply) => {
    const { plan } = z.object({ plan: z.enum(["FREE", "PRO", "ENTERPRISE"]) }).parse(request.body);
    await fastify.prisma.user.update({ where: { id: request.user.sub }, data: { plan } });
    return reply.send({ plan });
  });
};

export default billingRoutes;
