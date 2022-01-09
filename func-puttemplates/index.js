const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const utils = require('@vtfk/utilities');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');


module.exports = async function (context, req) {
  try {
    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'modifiedTimestamp', 'modifiedBy', 'modifiedById']);

    // Authentication / Authorization
    let requestorName = undefined;
    let requestorId = undefined;
    if(req.headers.authorization) {
        token = await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        if(token && token.name) requestorName = token.name;
        if(token && token.oid) requestorId = token.oid;
    } else if(req.headers['x-api-key']) {
        require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        requestorName, requestorId = 'apikey';
    } 
    else throw new HTTPError(401, 'No authentication token provided');

    // Update modified by
    req.body.modifiedBy = requestorName
    req.body.modifiedById = requestorId
    req.body.modifiedTimestamp = new Date();

    // Get the ID from the request
    const id = context.bindingData.id

    // Await the database
    await getDb()
    context.log("Mongoose is connected.");

    // Get the existing record
    let existingTemplate = await Templates.findById(id).lean();
    if(!existingTemplate) { throw new HTTPError(`Template with id ${id} could no be found`) }

    // Increment the version number
    req.body.version = existingTemplate.version + 1;

    // Update the template
    const updatedTemplate = await Templates.findByIdAndUpdate(id, req.body, {new: true})

    // Return the updated template
    context.res.status(200).send(updatedTemplate)
  } catch (err) {
    context.log(err);
    context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    throw err;
  }
}
