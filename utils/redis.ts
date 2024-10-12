import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export async function updateRedis(key: string, value: any) {
  await redis.set(key, JSON.stringify(value));
}

export async function getRedis(key: string) {
  const value = await redis.get(key);
  return value;
}

export async function appendToRedisArray(key: string, newValue: any) {
  const existingValue = await redis.get(key);
  let updatedArray = [];

  if (existingValue) {
    try {
      updatedArray = JSON.parse(existingValue as string);
      if (!Array.isArray(updatedArray)) {
        updatedArray = [updatedArray];
      }
    } catch (error) {
      console.error("Error parsing existing value:", error);
      updatedArray = [existingValue];
    }
  }

  updatedArray.push(newValue);
  await redis.set(key, JSON.stringify(updatedArray));
}
