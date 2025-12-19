describe("Login Page", () => {
  it("logs in with valid credentials", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");

    cy.get("button").click();

    cy.contains("Dashboard");
  });
});