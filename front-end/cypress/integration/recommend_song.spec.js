import { clearRecommendations, recommendSong } from "./cypress";

describe("Recommend a song", () => {
  beforeEach(clearRecommendations);
  afterEach(clearRecommendations);

  it("should recommend song given valid inputs", () => {
    const song = recommendSong();

    cy.contains(song.name).should("be.visible");
  });
});
