const Templates = require('../../models/templates')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

const id = "619eb77538cbfda999946df8"

it('Should edit one template with the given ID from the database', async () => {
    // Get the existing disptach object 
    let existingTemplate = await Templates.findById(id).lean()
    
    // Update default values 
    let newDate = new Date()

    // Update the dispatch 
    const updatedTemplate = await Templates.findByIdAndUpdate(id, {modifiedTimestamp: `${newDate}`}, {new: true})
    
    expect(updatedTemplate.modifiedTimestamp).not.toBe(existingTemplate.modifiedTimestamp)
})