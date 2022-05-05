import { clearRecommendations, recommendSong } from "./cypress";

describe("Upvote and downvote", () => {
  beforeEach(clearRecommendations);

  it("should upvote properly", () => {
    recommendSong();

    cy.get("#upvote").click();
    cy.get("#score").should("have.text", "1");
  });

  it("should downvote properly", () => {
    recommendSong();

    cy.get("#downvote").click();
    cy.get("#score").should("have.text", "-1");
  });
});
