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
    it('Should test Baby Equipment Category', () => {
        cy.get('ul > li').each(($el, index, $list) => {
              cy.wrap($el).click()
              cy.get('input[type=text]').eq(0).click({force:true})
              cy.wait(10)
              cy.location('href').then(($btn) => {
                const fullUrl = $btn.substr()
                const nameOfCategory = fullUrl.substr(fullUrl.lastIndexOf('/') + 1).substring(0,5);
                cy.get('input[type=text]').eq(0).type(`${nameOfCategory}`, {delay:10,force:true })
              })
        })
    })
})
