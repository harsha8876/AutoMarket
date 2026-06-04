import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

globalForPrisma.prisma = db;