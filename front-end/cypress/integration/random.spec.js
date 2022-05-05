import { clearRecommendations, recommendSong } from "./cypress";

describe("Random button", () => {
  afterEach(clearRecommendations);

  it("should navigate to /random if clicked", () => {
    cy.visit("/");

    cy.contains("Random").click();

    cy.url().should("equal", "http://localhost:3000/random");
  });

  it("should display one recommendation", () => {
    recommendSong();
    recommendSong();

    cy.visit("/random");

    cy.get("article").should(($article) => {
      expect($article).to.have.length(1);
    });
  });
});
