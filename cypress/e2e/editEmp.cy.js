describe("Edit Employee", () => {
  it("edits an employee successfully", () => {
    // Step 1: Login
    cy.visit("http://localhost:3000/login");

    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");
    cy.get("button").click();

    // Step 2: Add employee to edit
    cy.contains("Add Employee").click();

    cy.get("input[name=name]").type("Edit Me");
    cy.get("input[name=department]").type("HR");
    cy.get("button").click();

    // Step 3: Verify employee exists
    cy.contains("Edit Me");

    // Step 4: Click Edit for that employee
    cy.contains("Edit Me")
      .parent()
      .find("a")
      .contains("Edit")
      .click();

    // Step 5: Update employee details
    cy.get("input[name=name]")
      .clear()
      .type("Edited Employee");

    cy.get("input[name=department]")
      .clear()
      .type("Finance");

    // Step 6: Submit update
    cy.get("button").click();

    // Step 7: Verify updated data
    cy.contains("Edited Employee");
    cy.contains("Finance");
  });
});
