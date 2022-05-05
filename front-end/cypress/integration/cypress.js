/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

export const apiUrl = "http://localhost:5000";

export function clearRecommendations() {
  cy.request("DELETE", `${apiUrl}/recommendations`).as("deleteRecommendations");
}

export function recommendSong() {
  const song = {
    name: `${faker.music.genre()} ${faker.internet.password()}`,
    youtubeUrl: "https://www.youtube.com/watch?v=6ESqvGzdnvs",
  };

  cy.visit("/");

  cy.get("input[placeholder='Name']").type(song.name);
  cy.get("input[placeholder='https://youtu.be/...']").type(song.youtubeUrl);

  cy.intercept("POST", `${apiUrl}/recommendations`).as("postRecommendations");
  cy.get("button").click();
  cy.wait("@postRecommendations");

  return song;
}
