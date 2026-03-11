import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { logger } from "@/src/lib/logger";
import {
  verifyWebhookSignature,
  matchKeyword,
  sendDM,
} from "@/src/lib/instagram-api";

const fnName = "API:webhooks/instagram";

/**
 * GET /api/webhooks/instagram
 * Meta의 webhook 검증 요청 응답
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  logger.debug(fnName, "GET webhook verification", {
    input: { mode, tokenProvided: !!token },
  });

  const verifyToken = process.env.META_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    logger.info(fnName, "Webhook verified successfully", {
      output: { challenge: challenge?.substring(0, 20) + "..." },
    });
    return new NextResponse(challenge);
  }

  logger.warn(fnName, "Invalid verification token", {
    input: { provided: token, expected: verifyToken },
  });
  return new NextResponse("Unauthorized", { status: 403 });
}

/**
 * POST /api/webhooks/instagram
 * Instagram 댓글 이벤트 수신 및 처리
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-hub-signature-256");
    const payload = await request.text();

    logger.debug(fnName, "POST webhook received", {
      input: `${payload.substring(0, 100)}...`,
    });

    // 1. 서명 검증
    const verifySecret = process.env.META_VERIFY_TOKEN || "";
    if (
      signature &&
      !verifyWebhookSignature(signature.replace("sha256=", ""), payload, verifySecret)
    ) {
      logger.warn(fnName, "Invalid webhook signature", { input: { signature } });
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 2. JSON 파싱
    const body = JSON.parse(payload);

    // 3. Meta webhook 구조 확인
    if (body.object !== "instagram") {
      logger.debug(fnName, "Ignoring non-instagram event", {
        input: { object: body.object },
      });
      return NextResponse.json({ received: true });
    }

    // 4. 이벤트 처리
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const field = change.field;
        const value = change.value || {};

        logger.debug(fnName, "Processing webhook event", {
          input: { field, userId: value.from?.id },
        });

        // 댓글 이벤트 처리
        if (field === "comments") {
          await handleCommentEvent({
            text: value.text,
            userId: value.from?.id,
            userName: value.from?.username,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error(fnName, "Failed to process webhook", { error });
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

/**
 * 댓글 이벤트 처리
 */
async function handleCommentEvent({
  text,
  userId,
  userName,
}: {
  text: string;
  userId: string;
  userName: string;
}) {
  const fnName = "handleCommentEvent";

  try {
    logger.debug(fnName, "Processing comment", {
      input: { userId, textLength: text?.length },
    });

    if (!text || !userId) {
      logger.warn(fnName, "Missing required fields", {
        input: { hasText: !!text, hasUserId: !!userId },
      });
      return;
    }

    // 1. 모든 활성화된 트리거 조회
    const triggers = await db.trigger.findMany({
      where: { enabled: true },
    });

    logger.debug(fnName, "Found triggers", {
      output: `${triggers.length} active triggers`,
    });

    // 2. 키워드 매칭
    for (const trigger of triggers) {
      if (matchKeyword(text, trigger.keyword)) {
        logger.info(fnName, "Keyword matched", {
          input: { keyword: trigger.keyword, userId },
        });

        // 3. DM 발송
        const token = process.env.META_PAGE_ACCESS_TOKEN || "";
        const dryRun = process.env.NODE_ENV === "development";

        const result = await sendDM({
          recipientId: userId,
          message: trigger.responseMsg,
          token,
          dryRun,
        });

        // 4. 로그 저장
        await db.log.create({
          data: {
            triggerId: trigger.id,
            userId,
            userName: userName || "unknown",
            message: trigger.responseMsg,
            status: result.success ? "sent" : "failed",
            error: result.error || undefined,
          },
        });

        logger.info(fnName, "DM sent and logged", {
          output: { messageId: result.messageId, status: result.success },
        });
      }
    }
  } catch (error) {
    logger.error(fnName, "Error processing comment", {
      input: { userId },
      error,
    });
  }
}
