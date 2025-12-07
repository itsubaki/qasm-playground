import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMount } from "./useMount";

describe("useMount", () => {
    it("should return false before mounted and true after effect runs", () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useMount());
        expect(result.current.isMounted).toBe(false);

        act(() => {
            vi.runAllTimers();
        });
        expect(result.current.isMounted).toBe(true);

        vi.useRealTimers();
    });

    it("should clear timeout on unmount", () => {
        vi.useFakeTimers();

        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
        const { unmount } = renderHook(() => useMount());
        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();

        vi.useRealTimers();
    });
});
