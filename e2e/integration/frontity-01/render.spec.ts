import { ResolvePackages } from "../../../packages/types/src/utils";
import { Packages } from "../../packages/render/types";

type WindowWithFrontity = Cypress.AUTWindow & {
  frontity: ResolvePackages<Packages>;
};

describe("Render", () => {
  it("should rerender component subscribe to data object only once", () => {
    cy.visit("http://localhost:3001/?frontity_name=render");

    // Stubs calls to REST API.
    cy.intercept(
      "https://domain.com/wp-json/wp/v2/posts?_embed=true&slug=post-1",
      {
        fixture: "render/post-1.json",
        headers: {
          "x-wp-total": "1",
          "x-wp-totalpages": "1",
        },
      }
    );

    cy.window().then((win: WindowWithFrontity) => {
      win.frontity.actions.router.set("/post-1");
    });
    cy.location("href").should("eq", "http://localhost:3001/post-1/");
    cy.get("[data-test-id='content']").should("contain", "Post 1");
    cy.get("[data-test-id='counter']").should("have.text", "Renders: 2");
  });
});
