context('Actions', () => {
    // beforeEach(() => {
    //     cy.visit('https://example.cypress.io/commands/actions')
    // })
    beforeEach(() => {
        // had to set the viewport in beforeEach because otherwise it keeps being reset between runs
        cy.viewport(1280, 768)
    })
    it('should visit to website',()=>{
        cy.visit('https://dos.codeyourfuture.io/')
    })

    it('should navigate to Register page',()=>{
        cy.get('.sign-title > :nth-child(2)').click()
        cy.get('#name').type('Khaled kzy').should('have.value', 'Khaled kzy')
        cy.get('#Organisation').type('Code Your Future').should('have.value', 'Code Your Future')
        cy.get('#email').type('khaled.kzy1@gmail.com').should('have.value','khaled.kzy1@gmail.com')
        cy.get('input[placeholder=Password]').type('Khaled.kzy1').should('have.value','Khaled.kzy1')
        cy.get('div:nth-child(5) > div > input').type('Khaled.kzy1').should('have.value','Khaled.kzy1')
        cy.get('button[type="submit"]').click()
    })

    it('should navigate to Login page',()=>{
        cy.get('.sign-title > :nth-child(1)').click()
        cy.get('input[type=text]').type('khaled.kzy1@gmail.com').should('have.value','khaled.kzy1@gmail.com')
        cy.get('input[type=password]').type('Khaled.kzy1').should('have.value','Khaled.kzy1')
        cy.get('form > button').click()
    })
})

