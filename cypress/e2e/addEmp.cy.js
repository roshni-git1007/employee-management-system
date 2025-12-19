describe("Add Employee", () => {
  it("adds a new employee successfully", () => {
    // Step 1: Login
    cy.visit("http://localhost:3000/login");

    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");
    cy.get("button").click();

    // Step 2: Go to add employee page
    cy.contains("Add Employee").click();

    // Step 3: Fill employee form
    cy.get("input[name=name]").type("John Doe");
    cy.get("input[name=department]").type("Engineering");

    // Step 4: Submit form
    cy.get("button").click();

    // Step 5: Verify employee appears
    cy.contains("John Doe");
    cy.contains("Engineering");
  });
});
