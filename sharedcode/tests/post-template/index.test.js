const Templates = require('../../models/templates')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

const body = {
    name: "JEst test",
    description: "jest testing",
    documentDefinitionId: "asd123e1",
    template: "noe",
    
}

it('Should post a template to the database', async () => {
    // Create a new document using the model 
    const template = new Templates(body)

    // Save the new dispatch object to the database
    const results = await template.save()

    expect(results).toBeTruthy()
})