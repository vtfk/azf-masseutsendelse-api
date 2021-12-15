const Dispatches = require('../../models/dispatches')
const Templates = require('../../models/templates')
const { ObjectID } = require('mongodb');
const { setupDB } = require('../test-setup');
const { downloadBlob } = require('../../blob-storage');

setupDB('endpoint-testing')
jest.setTimeout(30000) // Actions failer noen ganger med 5000ms 

const attachmentSchema = {
    _id: new ObjectID(),
    name: "test",
}

const bodyDispatch = {
    title: "Jest Test",
    projectnumber: "12",
    archivenumber: "1",
    stats: {
        affectedCount: "1",
        area: "1",
        totalOwners: "1",
        privateOwners: "1",
        businessOwners: "1", 
    },
    matrikkelEnheter: [],
    polygon: {
        coordinatesystem: "asd",
        filename: "qsd",
        area: "12",
        vertices: [],
        extremes: {
            north: "1",
            west: "1",
            east: "1",
            south: "1",
            center: "1",
        }
    },
    polygons: {
        area: "1",
        EPSG: "asde"
    },
    attachments: [ attachmentSchema ],
    geopolygon: {
        coordinateSystem: "a123sd",
        vertices: [],
        extremes: {
            north: "1",
            west: "1",
            east: "1",
            south: "1",
            center: "1",
        }
    },
}

const bodyTemplates = {
    name: "JEst test",
    description: "jest testing",
    documentDefinitionId: "asd123e1",
    template: "noe",
    
}

let templateId = ""
let dispatchId = ""
let attachments = ""
// Post a template objevt to the database
it('Should post a template to the database', async () => {
    // Create a new document using the model 
    const template = new Templates(bodyTemplates)

    // Save the new dispatch object to the database
    const results = await template.save()

    expect(results).toBeTruthy()
})
// Post a dispatch object to the database 
it('Should post a dispatch object to the database', async () => {
    // Create a new document using the model 
    const dispatch = new Dispatches(bodyDispatch)

    // Save the new dispatch object to the database
    const results = await dispatch.save()

    expect(results).toBeTruthy()
})
// Return all dispatches from the database
it('Should return all dispatches from the database', async () => {
    let dispatch = await Dispatches.find({}).lean()
    Dispatches.find({}).lean().exec(function(error, records) {
        records.forEach(function(record) {
            dispatchId = record._id
            attachments = record.attachments
        });
    });
    expect(dispatch).toBeTruthy()
})
// Return all templates from the database
it('Should return all templates from the database', async () => {
    let templates = await Templates.find({}).lean()
    Templates.find({}).lean().exec(function(error, records) {
        records.forEach(function(record) {
            templateId = record._id
        });
    });
    expect(templates).toBeTruthy()
})
// Return a dispatch object with the given id from the database

it('Should return a disptach object with the given id from the database', async () => {
    let dispatch = await Dispatches.findById(dispatchId)
    expect(dispatch).toBeTruthy()
})
// Return a template object with the given id from the database

it('Should return a template with the given id from the database', async () => {
    let template = await Templates.findById(templateId)
    expect(template).toBeTruthy()
})
// Edit a disptach object with the given id from the database
it('Should edit one dispatch with the given ID from the database', async () => {
    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(dispatchId).lean()
    
    // Update default values 
    let newDate = new Date()

    // Update the dispatch 
    const updatedDispatch = await Dispatches.findByIdAndUpdate(dispatchId, {modifiedTimestamp: `${newDate}`}, {new: true})
    
    expect(updatedDispatch.modifiedTimestamp).not.toBe(existingDispatch.modifiedTimestamp)
})
// Edit a template object with the given id from the database
it('Should edit one template with the given ID from the database', async () => {
    // Get the existing disptach object 
    let existingTemplate = await Templates.findById(templateId).lean()
    
    // Update default values 
    let newDate = new Date()

    // Update the dispatch 
    const updatedTemplate = await Templates.findByIdAndUpdate(templateId, {modifiedTimestamp: `${newDate}`}, {new: true})
    
    expect(updatedTemplate.modifiedTimestamp).not.toBe(existingTemplate.modifiedTimestamp)
})
// Check if attachments dosen't exist
it('Should return an attachment from the database', async () => {
    expect(attachments).toBeTruthy()
})

    

    