/**
 * 디버그 로거
 * RULES.md 준수:
 * - 입력: 첫 200자 + 전체 길이
 * - 출력: 첫 300자 + 성공/실패
 * - 에러: 전체 에러 메시지 + 입력 정보
 * - 포맷: [함수명] key=value
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  function: string;
  message: string;
  input?: string;
  output?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDev = process.env.NODE_ENV === "development";

  private formatValue(value: unknown, maxLength: number = 200): string {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}... [total: ${str.length} chars]`;
    }
    return str;
  }

  log(
    level: LogLevel,
    fn: string,
    message: string,
    details?: {
      input?: unknown;
      output?: unknown;
      error?: unknown;
      metadata?: Record<string, unknown>;
    }
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      function: fn,
      message,
    };

    if (details?.input) {
      entry.input = this.formatValue(details.input, 200);
    }
    if (details?.output) {
      entry.output = this.formatValue(details.output, 300);
    }
    if (details?.error) {
      entry.error = this.formatValue(details.error);
    }
    if (details?.metadata) {
      entry.metadata = details.metadata;
    }

    // 포맷: [함수명] level=? message=? input=? output=? error=?
    const logParts = [`[${fn}]`, `level=${level}`, `msg="${message}"`];
    if (entry.input) logParts.push(`input="${entry.input}"`);
    if (entry.output) logParts.push(`output="${entry.output}"`);
    if (entry.error) logParts.push(`error="${entry.error}"`);
    if (entry.metadata) logParts.push(`meta=${JSON.stringify(entry.metadata)}`);

    const logLine = logParts.join(" ");

    // 콘솔 출력 (개발 모드)
    if (this.isDev) {
      const colorMap = {
        debug: "\x1b[36m", // cyan
        info: "\x1b[32m", // green
        warn: "\x1b[33m", // yellow
        error: "\x1b[31m", // red
      };
      const reset = "\x1b[0m";
      console.log(`${colorMap[level]}${logLine}${reset}`);
    }

    // 프로덕션에서는 json 로깅
    if (!this.isDev) {
      console.log(JSON.stringify(entry));
    }
  }

  debug(fn: string, msg: string, details?: Parameters<typeof this.log>[3]) {
    this.log("debug", fn, msg, details);
  }

  info(fn: string, msg: string, details?: Parameters<typeof this.log>[3]) {
    this.log("info", fn, msg, details);
  }

  warn(fn: string, msg: string, details?: Parameters<typeof this.log>[3]) {
    this.log("warn", fn, msg, details);
  }

  error(fn: string, msg: string, details?: Parameters<typeof this.log>[3]) {
    this.log("error", fn, msg, details);
  }
}

export const logger = new Logger();
