import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function rateLimit(identifier?: string) {
  if (!identifier) {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    identifier = forwardedFor ? forwardedFor.split(",")[0] : "anonymous";
  }

  const key = `rate-limit:${identifier}`;

  try {
    const current = (await redis.get(key)) as number | null;

    if (current === null) {
      await redis.set(key, 1, { ex: 60 });
      return { success: true, remaining: 4 };
    }

    if (current < 5) {
      await redis.incr(key);
      return { success: true, remaining: 5 - (current + 1) };
    }

    return { success: false, remaining: 0 };
  } catch (error) {
    console.error("Rate limiting error:", error);
    return { success: true, remaining: 1 };
  }
}
