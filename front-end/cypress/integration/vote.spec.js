describe("Upvote and downvote", () => {
  beforeEach(cy.clearRecommendations);

  it("should upvote properly", () => {
    cy.recommendSong();

    cy.get("#upvote").click();
    cy.get("#score").should("have.text", "1");
  });

  it("should downvote properly", () => {
    cy.recommendSong();

    cy.get("#downvote").click();
    cy.get("#score").should("have.text", "-1");
  });
});
