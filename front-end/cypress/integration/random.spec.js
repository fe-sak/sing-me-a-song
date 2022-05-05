describe("Random button", () => {
  it("should navigate to /random if clicked", () => {
    cy.visit("/");

    cy.contains("Random").click();

    cy.url().should("equal", "http://localhost:3000/random");
  });

  it("should display one recommendation", () => {
    cy.recommendSong();

    cy.visit("/random");

    cy.get("article").should(($article) => {
      expect($article).to.have.length(1);
    });
  });
});
