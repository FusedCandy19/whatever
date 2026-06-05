import { FastifyRequest, FastifyReply } from "fastify";

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.user?.role !== "ADMIN") {
    reply.status(403).send({ error: "Forbidden" });
  }
}
