import { PrismaClient } from "@prisma/client";

// PrismaClient 싱글톤 관리 (Next.js 핫 리로드에서 중복 인스턴스 방지)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
