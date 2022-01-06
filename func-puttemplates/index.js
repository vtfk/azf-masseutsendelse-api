const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const utils = require('@vtfk/utilities');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');


module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
    else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
    else throw new HTTPError(401, 'No authentication token provided');

    // Get the ID from the request
    const id = context.bindingData.id

    // Await the database
    await getDb()
    context.log("Mongoose is connected.");

    // Get the existing record
    let existingTemplate = await Templates.findById(id).lean();
    if(!existingTemplate) { throw new HTTPError(`Template with id ${id} could no be found`) }

    // Strip away some fields that should not be able to be set by the request
    req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'modifiedTimestamp', 'modifiedBy']);

    // Update values if applicable
    req.body.version = existingTemplate.version + 1;
    req.modifiedTimestamp = new Date();
    // TODO: Oppdatert modifiedBy

    // Update the template
    const updatedTemplate = await Templates.findByIdAndUpdate(id, req.body, {new: true})

    // Return the updated template
    context.res.status(200).send(updatedTemplate)

    // Close the database connection
    // mongoose.connection.close();
  } catch (err) {
    context.log(err);
    context.res.status(400).send(err);
    throw err;
  }
}
