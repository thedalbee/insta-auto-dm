import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { logger } from "@/src/lib/logger";

const fnName = "API:triggers:[id]";

/**
 * PUT /api/triggers/[id]
 * 트리거 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { keyword, responseMsg, enabled } = body;

    logger.debug(fnName, "PUT update trigger", {
      input: { id, keyword },
    });

    // 검증
    if (!keyword && !responseMsg && enabled === undefined) {
      logger.warn(fnName, "No fields to update", { input: { id } });
      return NextResponse.json(
        { error: "At least one field must be provided" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (keyword !== undefined) updateData.keyword = keyword;
    if (responseMsg !== undefined) updateData.responseMsg = responseMsg;
    if (enabled !== undefined) updateData.enabled = enabled;

    const trigger = await db.trigger.update({
      where: { id },
      data: updateData,
    });

    logger.info(fnName, "Trigger updated", { output: { id, keyword } });
    return NextResponse.json(trigger);
  } catch (error) {
    logger.error(fnName, "Failed to update trigger", { error });
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update trigger" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/triggers/[id]
 * 트리거 삭제
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    logger.debug(fnName, "DELETE trigger", { input: { id } });

    const trigger = await db.trigger.delete({
      where: { id },
    });

    logger.info(fnName, "Trigger deleted", { output: { id, keyword: trigger.keyword } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    logger.error(fnName, "Failed to delete trigger", { error });
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete trigger" },
      { status: 500 }
    );
  }
}
