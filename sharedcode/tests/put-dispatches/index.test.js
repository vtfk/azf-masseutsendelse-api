const Dispatches = require('../../models/dispatches')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

const id = "61af1fba5a6bc089ba0fa896"

it('Should edit one dispatch with the given ID from the database', async () => {
    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(id).lean()
    
    // Update default values 
    let newDate = new Date()

    // Update the dispatch 
    const updatedDispatch = await Dispatches.findByIdAndUpdate(id, {modifiedTimestamp: `${newDate}`}, {new: true})
    
    expect(updatedDispatch.modifiedTimestamp).not.toBe(existingDispatch.modifiedTimestamp)
})