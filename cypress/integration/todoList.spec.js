/// <reference types="cypress"/>
import { visitHome } from '../support/visitHome';
import todo from '../objects/todo.obj';

describe('Test Basic App Functionality', () => {
  it('should add a todo', () => {
    visitHome();
    cy.get(todo.addTodoButton).click();
    cy.get(todo.titleInput).should('be.visible').type(todo.title);
    cy.get(todo.submitTodo).should('be.visible').click();
    cy.wait(500);
    cy.contains(todo.title).should('be.visible');
    cy.get(todo.form).should('not.exist');
    cy.get(todo.deleteButton).should('be.visible').click();
    cy.get(todo.todoCard).should('not.exist');
  });

  it('should edit a todo', () => {
    cy.get(todo.addTodoButton).click();
    cy.get(todo.titleInput).should('be.visible').type(todo.title);
    cy.get(todo.submitTodo).should('be.visible').click();
    cy.wait(500);
    cy.contains(todo.title).should('be.visible');
    cy.get(todo.form).should('not.exist');
    cy.get(todo.descriptionInput).click().type('Test Descr.{enter}');
    cy.get(todo.descriptionInput).should('contain', todo.description);
    cy.get(todo.deleteButton).should('be.visible').click();
    cy.get(todo.todoCard).should('not.exist');
  });

  it('should lock a todo', () => {
    cy.get(todo.addTodoButton).click();
    cy.get(todo.titleInput).should('be.visible').type(todo.title);
    cy.get(todo.submitTodo).should('be.visible').click();
    cy.wait(500);
    cy.contains(todo.title).should('be.visible');
    cy.get(todo.form).should('not.exist');
    cy.get(todo.switches).should('be.visible').first().first().click();
    cy.get(todo.deleteButton).should('not.exist');
    cy.get(todo.lockButton).should('be.visible').first().click();
    cy.get(todo.deleteButton).should('be.visible').click();
    cy.get(todo.todoCard).should('not.exist');
  });

  it('should mark a todo completed', () => {
    cy.get(todo.addTodoButton).click();
    cy.get(todo.titleInput).should('be.visible').type(todo.title);
    cy.get(todo.submitTodo).should('be.visible').click();
    cy.wait(500);
    cy.contains(todo.title).should('be.visible');
    cy.get(todo.form).should('not.exist');
    cy.get(todo.completedButton).should('be.visible').first().click();
    cy.contains(todo.title).should('not.exist');
    cy.get(todo.deleteButton).should('not.exist');
    cy.contains(todo.toggleButton).click();
    cy.get(todo.todoCard).should(
      'have.css',
      'background-color',
      'rgb(204, 255, 204)'
    );
    cy.get(todo.completedButton).should('be.visible').first().click();
    cy.wait(500);
    cy.contains(todo.toggleButton).click();
    cy.get(todo.deleteButton).should('be.visible').click();
    cy.get(todo.todoCard).should('not.exist');
  });

  it('should delete a todo', () => {
    cy.get(todo.addTodoButton).click();
    cy.get(todo.titleInput).should('be.visible').type(todo.title);
    cy.get(todo.submitTodo).should('be.visible').click();
    cy.wait(500);
    cy.get(todo.form).should('not.exist');
    cy.get(todo.deleteButton).should('be.visible').click();
    cy.get(todo.todoCard).should('not.exist');
  });

  it('should logout', () => {
    cy.get(todo.logoutButton).should('be.visible').click();
    cy.get(todo.addTodoButton).should('not.exist');
    cy.get(todo.todoCard).should('not.exist');
    cy.get(todo.homeTitle).should('be.visible');
    cy.get(todo.getStartedButton).should('be.visible');
  });
});
