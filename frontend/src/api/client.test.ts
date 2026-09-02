import { afterEach, describe, expect, it, vi } from "vitest"
import { getAllSets } from "./client"

describe("fetchAPI (via getAllSets)", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("returns the parsed JSON body on a successful response", async () => {
        const sets = [{ id: 1, name: "Base Set" }]
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(sets),
        }))

        await expect(getAllSets()).resolves.toEqual(sets)
    })

    it("throws instead of silently returning an error body when the response isn't ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ detail: "Internal Server Error" }),
        }))

        await expect(getAllSets()).rejects.toThrow()
    })

    it("requests the expected endpoint path", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
        vi.stubGlobal("fetch", fetchMock)

        await getAllSets()

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/sets/"))
    })
})
