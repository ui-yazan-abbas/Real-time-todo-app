import todo from '../objects/todo.obj';

function visitHome() {
  cy.visit('/');
  cy.get(todo.getStartedButton).should('be.visible').click();
  cy.login();
  cy.wait(500);
  cy.visit('/todos');
  cy.wait(500);
}

module.exports = { visitHome };
