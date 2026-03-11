import { logger } from "./logger";

const META_GRAPH_API_VERSION = "v18.0";
const BASE_URL = `https://graph.instagram.com/${META_GRAPH_API_VERSION}`;

interface SendDMParams {
  recipientId: string;
  message: string;
  token: string;
  dryRun?: boolean;
}

interface SendDMResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Instagram DM 발송
 * RULES.md 준수:
 * - dryRun: true면 실제 발송 안 함 (로그만)
 * - 입출력 로깅
 * - 타임아웃: 30초
 */
export async function sendDM({
  recipientId,
  message,
  token,
  dryRun = false,
}: SendDMParams): Promise<SendDMResponse> {
  const fnName = "sendDM";
  logger.debug(fnName, "Starting DM send", {
    input: { recipientId, messageLength: message.length, dryRun },
  });

  try {
    if (dryRun) {
      logger.info(fnName, "dryRun mode: skipping actual API call", {
        output: { messageId: "mock_" + Date.now() },
      });
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
      };
    }

    // 실제 API 호출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(
        `${BASE_URL}/me/messages?access_token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        logger.error(fnName, "Instagram API error", {
          input: { recipientId },
          error,
        });
        return {
          success: false,
          error: `API returned ${response.status}`,
        };
      }

      const data = await response.json();
      logger.info(fnName, "DM sent successfully", {
        output: { messageId: data.message_id },
      });

      return {
        success: true,
        messageId: data.message_id,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        logger.error(fnName, "API call timed out (30s)", {
          input: { recipientId },
        });
      }
      throw err;
    }
  } catch (error) {
    logger.error(fnName, "Unexpected error", {
      input: { recipientId },
      error,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Instagram 댓글 이벤트 검증
 * Meta는 webhook 요청을 HMAC-SHA256으로 서명함
 */
export function verifyWebhookSignature(
  signature: string,
  payload: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return signature === hash;
}

/**
 * 댓글 텍스트에서 키워드 매칭
 */
export function matchKeyword(text: string, keyword: string): boolean {
  const normalizedText = text.toLowerCase().trim();
  const normalizedKeyword = keyword.toLowerCase().trim();
  return normalizedText.includes(normalizedKeyword);
}
