import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { logger } from "@/src/lib/logger";

const fnName = "API:triggers";

/**
 * GET /api/triggers
 * 모든 트리거 조회
 */
export async function GET(_request: NextRequest) {
  try {
    logger.debug(fnName, "GET all triggers");

    const triggers = await db.trigger.findMany({
      orderBy: { createdAt: "desc" },
    });

    logger.info(fnName, "Triggers fetched", {
      output: `found ${triggers.length} triggers`,
    });

    return NextResponse.json(triggers);
  } catch (error) {
    logger.error(fnName, "Failed to fetch triggers", { error });
    return NextResponse.json(
      { error: "Failed to fetch triggers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/triggers
 * 새 트리거 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, responseMsg } = body;

    logger.debug(fnName, "POST new trigger", {
      input: { keyword, responseMsgLength: responseMsg?.length },
    });

    // 검증
    if (!keyword || !responseMsg) {
      logger.warn(fnName, "Missing required fields", {
        input: { keyword: !!keyword, responseMsg: !!responseMsg },
      });
      return NextResponse.json(
        { error: "keyword and responseMsg are required" },
        { status: 400 }
      );
    }

    if (keyword.length < 1 || keyword.length > 100) {
      logger.warn(fnName, "Invalid keyword length", {
        input: { keywordLength: keyword.length },
      });
      return NextResponse.json(
        { error: "keyword must be 1-100 characters" },
        { status: 400 }
      );
    }

    // DB 저장
    const trigger = await db.trigger.create({
      data: {
        keyword,
        responseMsg,
      },
    });

    logger.info(fnName, "Trigger created", {
      output: { id: trigger.id, keyword },
    });

    return NextResponse.json(trigger, { status: 201 });
  } catch (error) {
    logger.error(fnName, "Failed to create trigger", { error });
    if (error instanceof Error && error.message.includes("Unique")) {
      return NextResponse.json(
        { error: "This keyword already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create trigger" },
      { status: 500 }
    );
  }
}
