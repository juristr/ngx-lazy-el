describe('ngx-lazy-el should lazy load components', () => {
  beforeEach(() => cy.visit('/'));

  it('should load the app', () => {
    cy.get('juristr-root');
  });

  it('should lazy load the component', () => {
    cy.get('[data-cy="lazy-load-button"]').click();

    cy.get('[data-cy="user-list-card"]').as('user-list');

    cy.get('@user-list')
      .find('mat-list-item')
      .should('have.length.gt', 1);

    cy.get('@user-list')
      .find('[data-cy="emit-event-btn"]')
      .click();

    cy.get('[data-cy="lazy-component-message"]')
      .find('pre')
      .should('contain', 'Juri');
  });

  it('should allow for programmatic lazy loading', () => {
    cy.get('[data-cy="lazy-load-programmatically-button"]').click();

    cy.get('#manualLoading').contains('Hi there');
  });
});
