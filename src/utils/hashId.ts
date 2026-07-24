/**
 * Utility functions to encode and decode numeric IDs in URLs.
 * Obfuscates raw database IDs (e.g. 13 -> "dHNfMTNfa2V5") to keep client URLs clean and secure.
 */

export function encodeId(id: number | string | undefined | null): string {
    if (id === undefined || id === null) return "";
    const str = `ts_${id}_key`;
    if (typeof window !== "undefined") {
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return Buffer.from(str).toString("base64url");
}

export function decodeId(hash: string | undefined | null): number | null {
    if (!hash) return null;
    try {
        let base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
            base64 += "=";
        }
        const decoded = typeof window !== "undefined"
            ? atob(base64)
            : Buffer.from(base64, "base64").toString("utf-8");
        const match = decoded.match(/^ts_(\d+)_key$/);
        return match ? Number(match[1]) : null;
    } catch {
        return null;
    }
}
