import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";

describe("Recommendation tests", () => {
  afterEach(truncateRecommendations);
  afterAll(disconnect);

  describe("post /recommendations", () => {
    it("should persist recommendation given valid request body", async () => {
      const body = recommendationFactory();

      const response = await supertest(app).post("/recommendations").send(body);

      const persistedRecommendation = await prisma.recommendation.findUnique({
        where: { name: body.name },
      });

      expect(response.statusCode).toBe(201);
      expect(body.name).toEqual(persistedRecommendation.name);
    });
  });

  describe("post /recommendations/:id/upvote", () => {
    it("should persist upvote given valid id", async () => {
      const persistedRecommendation = await persistRecommendation();
      const id = persistedRecommendation.id;

      await supertest(app).post(`/recommendations/${id}/upvote`);

      const updatedPersistedRecommendation =
        await prisma.recommendation.findUnique({
          where: { name: persistedRecommendation.name },
          select: { score: true },
        });

      const score = updatedPersistedRecommendation.score;

      expect(score).toEqual(1);
    });
  });

  describe("post /recommendations/:id/downvote", () => {
    it("should persist downvote given valid id", async () => {
      const persistedRecommendation = await persistRecommendation();
      const id = persistedRecommendation.id;

      await supertest(app).post(`/recommendations/${id}/downvote`);

      const updatedPersistedRecommendation =
        await prisma.recommendation.findUnique({
          where: { name: persistedRecommendation.name },
          select: { score: true },
        });

      const score = updatedPersistedRecommendation.score;

      expect(score).toEqual(-1);
    });

    it("should delete recommendation after six downvotes", async () => {
      const persistedRecommendation = await persistRecommendation();
      const id = persistedRecommendation.id;

      await downvoteSixTimes(id);

      const recommendation = await prisma.recommendation.findFirst({
        where: { id },
      });

      expect(recommendation).toBeNull();
    });
  });

  describe("get /recommendations", () => {
    it("should return last 10 recommendations in descending order by time", async () => {
      await persistElevenRecommendations();

      const response = await supertest(app).get("/recommendations");

      const firstRecommendation = response.body[0];
      const secondRecommendation = response.body[1];

      expect(secondRecommendation.id).toBeLessThan(firstRecommendation.id);
    });
  });

  describe("get /recommendations/:id", () => {
    it("should return recommendation given valid id", async () => {
      const persistedRecommendation = await persistRecommendation();
      const id = persistedRecommendation.id;

      const response = await supertest(app).get(`/recommendations/${id}`);
      const returnedRecommendation = response.body;

      expect(returnedRecommendation).toMatchObject(persistedRecommendation);
    });
  });
});

function recommendationFactory(): CreateRecommendationData {
  return {
    name: `${faker.music.genre()} ${faker.internet.password()}`,
    youtubeLink: "https://www.youtube.com/watch?v=UBGfS7S9BYg",
  };
}

async function persistRecommendation() {
  const recommendation = recommendationFactory();

  const persistedRecommendation = await prisma.recommendation.create({
    data: recommendation,
  });

  return persistedRecommendation;
}

async function persistElevenRecommendations() {
  const data = Array.from({ length: 11 }).map(() => recommendationFactory());

  await prisma.recommendation.createMany({ data });
}

async function downvoteSixTimes(id: number) {
  const sixTimes = 6;

  const repeatSixTimes = Array.from({ length: sixTimes });

  for (const _repeat of repeatSixTimes) {
    await supertest(app).post(`/recommendations/${id}/downvote`);
  }
}

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}

async function disconnect() {
  await prisma.$disconnect();
}
