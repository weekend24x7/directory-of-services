context('Actions', () => {
    // beforeEach(() => {
    //     cy.visit('https://example.cypress.io/commands/actions')
    // })
    beforeEach(() => {
        // had to set the viewport in beforeEach because otherwise it keeps being reset between runs
        cy.viewport(1280, 768)
    })
    it('Should visit to website',()=>{
        cy.visit('https://dos.codeyourfuture.io/')
    })
    it('Should navigate to Login page',()=>{
        cy.get('.sign-title > :nth-child(1)').click()
    })
    it('Should login',() => {
        cy.get('input[type=text]').type('khaled.kzy1@gmail.com').should('have.value','khaled.kzy1@gmail.com')
        cy.get('input[type=password]').type('Khaled.kzy1').should('have.value','Khaled.kzy1')
        cy.get('form > button').click()
    })
    it('Should search for the keyword Clubs', ()=> {
        cy.get('div > input').eq(0).type('clubs').should('have.value','clubs')
        cy.get('button[type=button]').eq(1).click()
    })
    it('Should search for the postcode', ()=> {
        cy.get('div > input').eq(0).clear({ force: true })
        cy.get('button[type=button]').eq(1).click()
        cy.get('div > input').eq(1).type('G22 5Qj').should('have.value','G22 5Qj')
        cy.get('button[type=button]').eq(1).click()
    })
    it('Should test Baby Equipment Category', () => {
        cy.get('ul > li').eq(0).click()
    })
})

