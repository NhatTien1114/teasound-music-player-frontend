"use client";

import { useEffect, useState } from "react";

type RGB = { r: number; g: number; b: number };

/**
 * Extracts the dominant color from an image URL using a hidden Canvas.
 * Uses color bucketing algorithm to find the most visually prominent color.
 * Includes CORS handling and timeout fallbacks.
 */
export function useDominantColor(imageUrl: string | undefined | null) {
    const [color, setColor] = useState<RGB | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!imageUrl) {
            setLoading(false);
            return;
        }

        setLoading(true);

        let isCancelled = false;
        let timer: NodeJS.Timeout;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            if (isCancelled) return;
            clearTimeout(timer);
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    const sampleSize = 64;
                    canvas.width = sampleSize;
                    canvas.height = sampleSize;

                    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
                    const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
                    const data = imageData.data;

                    const colorBuckets: Map<string, { r: number; g: number; b: number; count: number }> = new Map();
                    const bucketSize = 24;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        if (a < 128) continue;
                        if (r + g + b < 60) continue;
                        if (r > 240 && g > 240 && b > 240) continue;

                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        if (max - min < 20 && max < 200) continue;

                        const br = Math.floor(r / bucketSize);
                        const bg = Math.floor(g / bucketSize);
                        const bb = Math.floor(b / bucketSize);
                        const key = `${br},${bg},${bb}`;

                        const existing = colorBuckets.get(key);
                        if (existing) {
                            existing.r += r;
                            existing.g += g;
                            existing.b += b;
                            existing.count += 1;
                        } else {
                            colorBuckets.set(key, { r, g, b, count: 1 });
                        }
                    }

                    let maxCount = 0;
                    let dominantBucket: { r: number; g: number; b: number; count: number } | null = null;

                    colorBuckets.forEach((bucket) => {
                        if (bucket.count > maxCount) {
                            maxCount = bucket.count;
                            dominantBucket = bucket;
                        }
                    });

                    if (dominantBucket) {
                        const { r, g, b, count } = dominantBucket as { r: number; g: number; b: number; count: number };
                        setColor({
                            r: Math.round(r / count),
                            g: Math.round(g / count),
                            b: Math.round(b / count),
                        });
                    } else {
                        setColor({ r: 30, g: 30, b: 40 });
                    }
                } else {
                    setColor({ r: 30, g: 30, b: 40 });
                }
            } catch {
                setColor({ r: 30, g: 30, b: 40 });
            } finally {
                setLoading(false);
            }
        };

        img.onerror = () => {
            if (isCancelled) return;
            clearTimeout(timer);
            setColor({ r: 30, g: 30, b: 40 });
            setLoading(false);
        };

        // Fallback timeout in case image loading hangs or is blocked by CORS
        timer = setTimeout(() => {
            if (!isCancelled) {
                setColor({ r: 30, g: 30, b: 40 });
                setLoading(false);
            }
        }, 2000);

        img.src = imageUrl;

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [imageUrl]);

    return { color, loading };
}
