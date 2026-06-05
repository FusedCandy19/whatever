import { FastifyRequest, FastifyReply } from "fastify";

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  plan: string;
  iat: number;
  exp: number;
}

declare module "fastify" {
  interface FastifyRequest {
    user: JWTPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: "Unauthorized" });
  }
}
