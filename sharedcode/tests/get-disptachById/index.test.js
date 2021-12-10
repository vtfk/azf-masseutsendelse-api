const Dispatches = require('../../models/dispatches')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')
id = "61af1fba5a6bc089ba0fa896"
it('Should return a disptach object with the given id from the database', async () => {
    let dispatch = await Dispatches.findById(id)
    expect(dispatch).toBeTruthy()
})