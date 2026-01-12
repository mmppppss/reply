import { describe, it, expect, vi, beforeEach } from "vitest";
import { Logger } from "../../../src/infrastructure/logging/Logger";

class MockStream {
    data: string[] = [];
    write(chunk: string) {
        this.data.push(chunk);
        return true;
    }
    clear() {
        this.data = [];
    }
}

describe("Logger", () => {
    let stdout: MockStream;
    let stderr: MockStream;
    let logger: Logger;

    beforeEach(() => {
        stdout = new MockStream();
        stderr = new MockStream();
        logger = new Logger(stdout as any, stderr as any);
    });

    it("creates a logger instance", () => {
        expect(logger).toBeInstanceOf(Logger);
    });

    it("logs info messages with [INFO] and context", () => {
        logger.info("Test info", { system: true });
        expect(stdout.data[0]).toContain("[INFO]");
        expect(stdout.data[0]).toContain("[SYSTEM]");
        expect(stdout.data[0]).toContain("Test info");
    });

    it("logs success messages with [SUCCESS] and context", () => {
        logger.success("Test success", { botId: "bot1" });
        expect(stdout.data[0]).toContain("[SUCCESS]");
        expect(stdout.data[0]).toContain("[BOT:bot1]");
        expect(stdout.data[0]).toContain("Test success");
    });

    it("logs warn messages with [WARN] and context", () => {
        logger.warn("Test warn", { userId: "u1" });
        expect(stderr.data[0]).toContain("[WARN]");
        expect(stderr.data[0]).toContain("[ID:u1]");
        expect(stderr.data[0]).toContain("Test warn");
    });

    it("logs error messages with [ERROR] and Error object", () => {
        const error = new Error("Some error");
        logger.error("Test error", error, { eventId: "evt1" });
        expect(stderr.data[0]).toContain("[ERROR]");
        expect(stderr.data[0]).toContain("[EVENT:evt1]");
        expect(stderr.data[0]).toContain("Test error");
        expect(stderr.data[1]).toContain("Some error"); // stack/message
    });

    it("creates child loggers with merged context", () => {
        const child = logger.child({ botId: "bot1" });
        const grandchild = child.child({ userId: "u1" });
        grandchild.info("Child log test", { eventId: "evt1" });

        const logOutput = stdout.data[0];
        expect(logOutput).toContain("[INFO]");
        expect(logOutput).toContain("[BOT:bot1]");
        expect(logOutput).toContain("[ID:u1]");
        expect(logOutput).toContain("[EVENT:evt1]");
        expect(logOutput).toContain("Child log test");
    });

    it("supports multiple logs in sequence", () => {
        logger.info("Info1");
        logger.success("Success1");
        logger.warn("Warn1");
        logger.error("Error1");

        expect(stdout.data[0]).toContain("[INFO]");
        expect(stdout.data[1]).toContain("[SUCCESS]");
        expect(stderr.data[0]).toContain("[WARN]");
        expect(stderr.data[1]).toContain("[ERROR]");
    });
});
