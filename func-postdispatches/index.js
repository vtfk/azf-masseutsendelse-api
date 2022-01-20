const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');
const { ObjectID } = require('mongodb');
const HTTPError = require('../sharedcode/vtfk-errors/httperror.js');
const validate = require('../sharedcode/validators/dispatches').validate;
const blobClient = require('@vtfk/azure-blob-client');
const config = require('../config');

module.exports = async function (context, req) {
  try {
    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['_id', 'validatedArchivenumber', 'createdTimestamp', 'createdBy', 'createdById', 'modifiedTimestamp', 'modifiedBy', 'modifiedById']);

    // Authentication / Authorization
    let requestorName = undefined;
    let requestorId = undefined;
    if (req.headers.authorization) {
      token = await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
      if (token && token.name) requestorName = token.name;
      if (token && token.oid) requestorId = token.oid;
      if (token && token.department) requestorDepartment = token.department;
    } else if (req.headers['x-api-key']) {
      require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
      requestorName = 'apikey';
      requestorId = 'apikey';
      requestorDepartment = 'apikey';
    }
    else throw new HTTPError(401, 'No authentication token provided');

    // Set values
    req.body._id = new ObjectID()
    req.body.status = "notapproved"

    req.body.createdBy = requestorName
    req.body.createdById = requestorId
    req.body.createdByDepartment = requestorDepartment
    req.body.modifiedById = requestorId
    req.body.modifiedBy = requestorName
    req.body.modifiedByDepartment = requestorDepartment

    // Validate dispatch against schenarios that cannot be described by schema
    await validate(req.body);
    req.body.validatedArchivenumber = req.body.archivenumber;

    // Await the DB connection
    await getDb()
    context.log("Mongoose is connected.")

    // Check if the attachments contains any invalid characters
    if (req.body.attachments && Array.isArray(req.body.attachments) && req.body.attachments.length > 0) {
      if (!config.AZURE_BLOB_CONNECTIONSTRING || !config.AZURE_BLOB_CONTAINERNAME) { throw new HTTPError(500, 'Cannot upload attachments when azure blob storage is not configured'); }
      for (const blob of req.body.attachments) {
        for (const char of blobClient.unallowedPathCharacters) {
          if (blob.name.includes(char)) throw new HTTPError(400, `${blob.name} contains the illegal character ${char}`)
        }
      }
    }

    // Create a new document using the model
    const dispatch = new Dispatches(req.body)

    // Save the new dispatch to the database 
    const results = await dispatch.save()

    // Upload files attached to the dispatch object if files exist.
    if (req.body.attachments || Array.isArray(req.body.attachments)) {
      for await (let file of req.body.attachments) {
        if (file.name && file.name.includes('/')) throw new HTTPError(400, 'Illigal character in filname, "/" is not allowed.')
        if (!file.name) file.name = file._id;

        await blobClient.save(`${req.body._id}/${file.name}`, file.data)
      }
    }

    // Return the results
    context.res.status(201).send(results)
  } catch (err) {
    context.log.error('ERROR', err)
    context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    throw err
  }
}