import request from "supertest";
import { createServer } from "http";
import { NextApiHandler } from "next";
import { POST } from "../app/api/recipe_search/route";

const handler: NextApiHandler = async (req, res) => {
  const response = await POST(req as any);
  res.status(response.status).json(response.body);
};

const server = createServer((req, res) => {
  if (req.url === "/api/recipe_search" && req.method === "POST") {
    handler(req as any, res as any);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

describe("POST /api/recipe_search", () => {
  it("should return recipes for valid ingredients", async () => {
    const response = await request(server)
      .post("/api/recipe_search")
      .send({
        ingredients: ["tomato", "cheese"],
        dietaryRestrictions: [],
        maxCookTime: 30,
        minRating: 4,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("length");
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should handle errors gracefully", async () => {
    const response = await request(server).post("/api/recipe_search").send({});

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
