const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');

module.exports = async function (context, req) {
  try {
      // Authentication / Authorization
      if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
      else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
      else throw new HTTPError(401, 'No authentication token provided');

      // Await database connection
      await getDb()
      context.log("Mongoose is connected.");

      // Strip away some fields that should not be able to be set by the request
      req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'modifiedTimestamp', 'modifiedBy']);
      
      // Set some default values
      req.body.version = 1;

      // Create a new document from model
      const template = new Templates(req.body)

      // Save the template to the database
      const result = await template.save();

      // Return the result
      context.res.status(201).send(result);

      // Close the connection
      // mongoose.connection.close()
    } catch (err) {
      context.log.error('ERROR', err)
      context.res.status(400).send(template)
      throw err
    };
    
}