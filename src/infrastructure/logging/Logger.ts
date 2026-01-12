import { Writable } from "stream";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";

export type LogContext = {
    system?: boolean;
    botId?: string;
    userId?: string;
    eventId?: string;
};

export class Logger {
    private stdout: Writable;
    private stderr: Writable;
    private parentContext?: LogContext;

    constructor(stdout: Writable = process.stdout, stderr: Writable = process.stderr) {
        this.stdout = stdout;
        this.stderr = stderr;
    }

    private mergeContext(context?: LogContext) {
        return { ...(this.parentContext || {}), ...context };
    }

    private formatPrefix(context?: LogContext) {
        const parts: string[] = [];
        if (context?.system) parts.push(`${CYAN}[SYSTEM]${RESET}`);
        if (context?.botId) parts.push(`[BOT:${context.botId}]`);
        if (context?.userId) parts.push(`${MAGENTA}[ID:${context.userId}]${RESET}`);
        if (context?.eventId) parts.push(`[EVENT:${context.eventId}]`);
        return parts.join(" ") + (parts.length ? " " : "");
    }

    private writeAsync(stream: Writable, message: string) {
        if (!stream.write(message + "\n")) {
            stream.once("drain", () => {});
        }
    }

    info(message: string, context?: LogContext) {
        const ctx = this.mergeContext(context);
        this.writeAsync(this.stdout, `${CYAN}[#]${RESET} ${this.formatPrefix(ctx)}${message}`);
    }

    success(message: string, context?: LogContext) {
        const ctx = this.mergeContext(context);
        this.writeAsync(this.stdout, `${GREEN}[S]${RESET} ${this.formatPrefix(ctx)}${message}`);
    }

    warn(message: string, context?: LogContext) {
        const ctx = this.mergeContext(context);
        this.writeAsync(this.stderr, `${YELLOW}[X]${RESET} ${this.formatPrefix(ctx)}${message}`);
    }

    error(message: string, error?: Error, context?: LogContext) {
        const ctx = this.mergeContext(context);
        this.writeAsync(this.stderr, `${RED}[E]${RESET} ${this.formatPrefix(ctx)}${message}`);
        if (error) this.writeAsync(this.stderr, error.stack || error.message);
    }

    child(context: LogContext): Logger {
        const childLogger = new Logger(this.stdout, this.stderr);
        childLogger.parentContext = { ...(this.parentContext || {}), ...context };
        return childLogger;
    }
}
