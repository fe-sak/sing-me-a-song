describe("Recommend a song", () => {
  beforeEach(cy.clearRecommendations);
  afterEach(cy.clearRecommendations);

  it("should recommend song given valid inputs", () => {
    const song = {
      name: "One Who Craves Souls",
      youtubeUrl: "https://www.youtube.com/watch?v=6ESqvGzdnvs",
    };

    cy.recommendSong(song);

    cy.contains(song.name).should("be.visible");
  });
});
