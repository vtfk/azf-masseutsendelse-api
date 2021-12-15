const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');
const { ObjectID } = require('mongodb');
const HTTPError = require('../sharedcode/vtfk-errors/httperror.js');
const { uploadBlob } = require('../sharedcode/blob-storage.js');


module.exports = async function (context, req) {
    try {
        // Await the DB connection
        await getDb()
        context.log("Mongoose is connected.")

        // Strip away som fields that should not bed set by the request.
        req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'modifiedTimestamp', 'modifiedBy'])

        // Default values 
        req.body._id = new ObjectID()
        req.body.status = "notapproved"
        
        // Create a new document using the model
        const dispatch = new Dispatches(req.body)

        // Upload files attached to the dispatch object if files exist.
        if(req.body.attachments || Array.isArray(req.body.attachments)) {
            for await (const file of req.body.attachments) {
                if(file.name && file.name.includes('/')) throw new HTTPError(500, 'Illigal character in filname, "/" is not allowed.')
    
                const resultsFileUpload = await uploadBlob({
                    dispatchId: req.body._id,
                    fileName: file.name,
                    content: file.content
                }) 
                file.fileName = resultsFileUpload.split('/').pop
            }
        }

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