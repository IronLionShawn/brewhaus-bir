describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('.toolbar-title', 'Brew Haus Bir');
  });
});
