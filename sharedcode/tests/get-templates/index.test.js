const Templates = require('../../models/templates')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

it('Should return all templates from the database', async () => {
    let templates = await Templates.find({})
    expect(templates).toBeTruthy()
})
