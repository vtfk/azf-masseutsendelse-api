const Dispatches = require('../../models/dispatches')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

it('Should return all dispatches from the database', async () => {
    let dispatch = await Dispatches.find({})
    expect(dispatch).toBeTruthy()
})
