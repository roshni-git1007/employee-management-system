describe("Delete Employee", () => {
  it("deletes an employee successfully", () => {
    // Step 1: Login
    cy.visit("http://localhost:3000/login");

    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");
    cy.get("button").click();

    // Step 2: Go to Add Employee page
    cy.contains("Add Employee").click();

    // Step 3: Add employee to be deleted
    cy.get("input[name=name]").type("Delete Me");
    cy.get("input[name=department]").type("Testing");
    cy.get("button").click();

    // Step 4: Verify employee exists
    cy.contains("Delete Me");

    // Step 5: Delete employee
    cy.contains("Delete Me")
      .parent()
      .find("button")
      .contains("Delete")
      .click();

    // Step 6: Verify employee is removed
    cy.contains("Delete Me").should("not.exist");
  });
});