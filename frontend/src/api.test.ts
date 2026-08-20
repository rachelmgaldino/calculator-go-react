import { describe, test, expect, vi } from "vitest";
import { calculate } from "./api";

describe("calculate", () => {
  test("returns the result on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 17 }),
    } as Response);

    const result = await calculate("add", 12, 5);

    expect(result).toBe(17);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/add",
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("throws the backend's error message on failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "cannot divide by zero" }),
    } as Response);

    await expect(calculate("divide", 5, 0)).rejects.toThrow(
      "cannot divide by zero",
    );
  });
});
