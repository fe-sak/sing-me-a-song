// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const apiUrl = "http://localhost:5000";

Cypress.Commands.add("clearRecommendations", () => {
  cy.request("DELETE", `${apiUrl}/recommendations`).as("deleteRecommendations");
});

Cypress.Commands.add("recommendSong", (songParameter) => {
  const song = songParameter || {
    name: "One Who Craves Souls",
    youtubeUrl: "https://www.youtube.com/watch?v=6ESqvGzdnvs",
  };

  cy.visit("/");

  cy.get("input[placeholder='Name']").type(song.name);
  cy.get("input[placeholder='https://youtu.be/...']").type(song.youtubeUrl);

  cy.intercept("POST", `${apiUrl}/recommendations`).as("postRecommendations");
  cy.get("button").click();
  cy.wait("@postRecommendations");
});
