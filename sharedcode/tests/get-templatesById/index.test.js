const Templates = require('../../models/templates')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')
id = "619eb77538cbfda999946df8"
it('Should return a template with the given id from the database', async () => {
    let template = await Templates.findById(id)
    expect(template).toBeTruthy()
})