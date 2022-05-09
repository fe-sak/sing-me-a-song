import supertest from "supertest";
import app from "../src/app.js";
import { jest } from "@jest/globals";
import { prisma } from "../src/database.js";
import {
  CreateRecommendationData,
  recommendationService,
} from "../src/services/recommendationsService.js";
import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../src/repositories/recommendationRepository.js";
describe("Integration tests", () => {
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

      await upvote(id);

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

      const downvoteSixTimes = 6;
      for (let i = 0; i < downvoteSixTimes; i++) {
        await supertest(app).post(`/recommendations/${id}/downvote`);
      }

      const recommendation = await prisma.recommendation.findFirst({
        where: { id },
      });

      expect(recommendation).toBeNull();
    });
  });

  describe("get /recommendations", () => {
    it("should return last 10 recommendations in descending order by time", async () => {
      const data = Array.from({ length: 11 }).map(() =>
        recommendationFactory()
      );

      await prisma.recommendation.createMany({ data });

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

  describe("get /recommendations/random", () => {
    it("should return recommendation with score higher than 10", async () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.6);
      const higherScoreRecommendation = await persistRecommendation();

      const upvoteTwelveTimes = 12;
      for (let i = 0; i < upvoteTwelveTimes; i++) {
        await upvote(higherScoreRecommendation.id);
      }

      await persistRecommendation();

      const response = await supertest(app).get("/recommendations/random");
      const returnedRecommendation = response.body;

      expect(higherScoreRecommendation.id).toEqual(returnedRecommendation.id);
    });

    it("should return recommendation with score lower than 10", async () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.8);
      const higherScoreRecommendation = await persistRecommendation();
      const lowerScoreRecommendation = await persistRecommendation();

      const upvoteTwelveTimes = 12;
      for (let i = 0; i < upvoteTwelveTimes; i++) {
        await upvote(higherScoreRecommendation.id);
      }

      const response = await supertest(app).get("/recommendations/random");
      const returnedRecommendation = response.body;

      expect(lowerScoreRecommendation.id).toEqual(returnedRecommendation.id);
    });
  });

  describe("get /recommendations/top/:amount", () => {
    it("should return the highest score recommendation", async () => {
      const amount = 1;

      const firstRecommendation = await persistRecommendation();
      await persistRecommendation();

      await upvote(firstRecommendation.id);

      const response = await supertest(app).get(
        `/recommendations/top/${amount}`
      );
      const returnedRecommendation = response.body[0];

      expect(returnedRecommendation.id).toEqual(firstRecommendation.id);
    });

    it("should return two recommendations in descending order by score", async () => {
      const amount = 2;

      const firstRecommendation = await persistRecommendation();
      await persistRecommendation();

      await upvote(firstRecommendation.id);

      const response = await supertest(app).get(
        `/recommendations/top/${amount}`
      );
      const highestScoreRecommendation = response.body[0];
      const lowestScoreRecommendation = response.body[1];

      expect(lowestScoreRecommendation.score).toBeLessThan(
        highestScoreRecommendation.score
      );
    });
  });
});

describe("Unit tests", () => {
  describe("Recommendation service", () => {
    describe("upvote function", () => {
      it("should throw not found error", async () => {
        jest
          .spyOn(recommendationRepository, "find")
          .mockResolvedValueOnce(null);

        const randomId = 0;

        let thrownError: CustomError;

        try {
          await recommendationService.upvote(randomId);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).toMatchObject({ type: "not_found", message: "" });
      });
    });

    describe("downvote function", () => {
      it("should throw not found error", async () => {
        jest
          .spyOn(recommendationRepository, "find")
          .mockResolvedValueOnce(null);

        const randomId = 0;

        let thrownError: CustomError;

        try {
          await recommendationService.downvote(randomId);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).toMatchObject({ type: "not_found", message: "" });
      });
    });

    describe("getRandom function", () => {
      it("should throw not found error", async () => {
        jest
          .spyOn(recommendationRepository, "findAll")
          .mockResolvedValueOnce([]);

        let thrownError: CustomError;

        try {
          await recommendationService.getRandom();
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).toMatchObject({ type: "not_found", message: "" });
      });
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

function upvote(id: number) {
  return supertest(app).post(`/recommendations/${id}/upvote`);
}

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}

async function disconnect() {
  await prisma.$disconnect();
}

interface CustomError {
  type: string;
  message: string;
}
