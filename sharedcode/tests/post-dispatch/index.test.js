const Dispatches = require('../../models/dispatches')
const { setupDB } = require('../test-setup')

setupDB('endpoint-testing')

const body = {
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

it('Should post a dispatch object to the database', async () => {
    // Create a new document using the model 
    const dispatch = new Dispatches(body)

    // Save the new dispatch object to the database
    const results = await dispatch.save()

    expect(results).toBeTruthy()
})