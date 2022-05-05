describe("Top button", () => {
  beforeEach(cy.clearRecommendations);

  it("should navigate to /top if clicked", () => {
    cy.visit("/");

    cy.contains("Top").click();

    cy.url().should("equal", "http://localhost:3000/top");
  });

  it("should display songs in descending score order", () => {
    const highScoreSong = {
      name: "Thriller",
      youtubeUrl: "https://www.youtube.com/watch?v=sOnqjkJTMaA",
    };
    cy.recommendSong(highScoreSong);

    cy.contains(highScoreSong.name).get("#upvote").click();

    const lowerScoreSong = {
      name: "Billie Jean",
      youtubeUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    };
    cy.recommendSong(lowerScoreSong);

    cy.visit("/top");

    cy.get("article:first-of-type").should("contain", highScoreSong.name);
  });
});
