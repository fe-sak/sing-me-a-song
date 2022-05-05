import { clearRecommendations, recommendSong } from "./cypress";

describe("Top button", () => {
  beforeEach(clearRecommendations);
  afterEach(clearRecommendations);

  it("should navigate to /top if clicked", () => {
    cy.visit("/");

    cy.contains("Top").click();

    cy.url().should("equal", "http://localhost:3000/top");
  });

  it("should display songs in descending score order", () => {
    const highScoreSong = recommendSong();

    cy.contains(highScoreSong.name).get("#upvote").click();

    recommendSong();

    cy.visit("/top");

    cy.get("article:first-of-type").should("contain", highScoreSong.name);
  });
});
