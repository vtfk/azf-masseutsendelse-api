const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const utils = require('@vtfk/utilities');

module.exports = async function (context, req, id) {
    try {
        // Get the ID from the request 
        const id = context.bindingData.id

        // Await the Db conection 
        await getDb()
        context.log("Mongoose is connected")

        // Get the existing disptach object 
        let existingDispatch = await Dispatches.findById(id).lean()
        if(!existingDispatch) { throw new Error(`Dispatch with id ${id} could not be found` ) }

        // Strip away some fields that should not be set by the request
        req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'modifiedTimestamp', 'modifiedBy']);

        // Update default values 
        req.modifiedTimestamp = new Date()
        // TODO - Oppdater modifiedBy 

        // Update the dispatch 
        const updatedDispatch = await Dispatches.findByIdAndUpdate(id, req.body, {new: true})

        // Return the dispatch 
        context.res.status(200).send(updatedDispatch)

        // Close the connection 
        mongoose.connection.close()
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}
