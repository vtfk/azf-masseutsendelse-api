const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');


module.exports = async function (context, req) {
    try {
        // Await the DB connection
        await getDb()
        context.log("Mongoose is connected.")

        // Strip away som fields that should not bed set by the request.
        req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'modifiedTimestamp', 'modifiedBy'])

        // Default values 
        req.body.status = "notapproved"
        
        // Create a new document using the model
        const dispatch = new Dispatches(req.body)

        // Save the new dispatch to the database 
        const results = await dispatch.save()
        context.log('Dispatch har been saved');
        
        // Return the results
        context.res.status(201).send(results)

        // Close the connection 
        // // mongoose.connection.close()
    } catch (err) {
        context.log.error('ERROR', err)
        context.res.status(400).send(dispatch)
        throw err
    }
}