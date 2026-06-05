import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/requireAdmin";

const updateBrandingSchema = z.object({
  platformName: z.string().min(1).max(64).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  logoUrl: z.string().url().optional().nullable(),
  themePreset: z.enum(["dark-violet", "dark-amber", "dark-teal", "dark-rose", "light"]).optional(),
});

const brandingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/admin/branding", async () => {
    const branding = await fastify.prisma.brandingConfig.findFirst();
    return branding ?? { platformName: "APIaaS", accentColor: "#8b5cf6", logoUrl: null, themePreset: "dark-violet" };
  });

  fastify.patch("/admin/branding", { onRequest: [authenticate, requireAdmin] }, async (request, reply) => {
    const body = updateBrandingSchema.parse(request.body);
    const branding = await fastify.prisma.brandingConfig.upsert({ where: { id: 1 }, update: body, create: { id: 1, ...body } });
    return reply.send(branding);
  });
};

export default brandingRoutes;
