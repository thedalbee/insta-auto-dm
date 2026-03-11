import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { logger } from "@/src/lib/logger";

const fnName = "API:logs";

/**
 * GET /api/logs
 * DM 발송 이력 조회 (페이지네이션)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // 'sent', 'failed', 'pending'

    logger.debug(fnName, "GET logs", {
      input: { page, limit, status },
    });

    const where = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      db.log.findMany({
        where,
        include: {
          trigger: {
            select: { keyword: true },
          },
        },
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      }),
      db.log.count({ where }),
    ]);

    logger.info(fnName, "Logs fetched", {
      output: `${logs.length} logs, total: ${total}`,
    });

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(fnName, "Failed to fetch logs", { error });
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
