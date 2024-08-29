import { Redis } from "@upstash/redis";

const getRedisClient = () => {
  const client = new Redis({
    url: process.env.REDIS_URL || "",
    token: process.env.REDIS_TOKEN || "",
  });

  return client;
};

export default getRedisClient;
