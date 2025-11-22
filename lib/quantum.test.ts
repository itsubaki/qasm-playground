import { describe, test, expect } from "vitest";
import { examples, State, States } from "./quantum";

describe("quantum.ts", () => {
    test("examples should be defined", () => {
        expect(examples).toBeDefined();
        expect(Array.isArray(examples)).toBe(true);
    });

    test("examples should contain algorithm name and code", () => {
        for (const example of examples) {
            expect(example.name).toBeDefined();
            expect(typeof example.name).toBe("string");
            expect(example.code).toBeDefined();
            expect(typeof example.code).toBe("string");
            expect(example.code.length).toBeGreaterThan(0);
        }
    });
});
