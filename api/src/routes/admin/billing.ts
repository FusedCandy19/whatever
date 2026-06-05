import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/requireAdmin";

const adminBillingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticate);
  fastify.addHook("onRequest", requireAdmin);

  fastify.get("/admin/billing/invoices", async (request) => {
    const page = Number((request.query as any).page) || 1;
    const limit = 50;
    const [invoices, total] = await Promise.all([
      fastify.prisma.invoice.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" }, include: { user: { select: { email: true, name: true } } } }),
      fastify.prisma.invoice.count(),
    ]);
    return { invoices, total, page };
  });

  fastify.post("/admin/billing/credits", async (request, reply) => {
    const body = z.object({ userId: z.string(), amountUsd: z.number(), note: z.string().optional() }).parse(request.body);
    const invoice = await fastify.prisma.invoice.create({ data: { userId: body.userId, amountUsd: body.amountUsd, status: "PAID", period: new Date() } });
    return reply.status(201).send(invoice);
  });
};

export default adminBillingRoutes;
