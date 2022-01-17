const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');

module.exports = async function (context, req) {
  try {
      // Strip away some fields that should not be able to be set by the request
      req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'createdByDepartment', 'modifiedTimestamp', 'modifiedBy', 'modifiedById', 'modifiedByDepartment']);

      // Authentication / Authorization
      let requestorName = undefined;
      let requestorId = undefined;
      if(req.headers.authorization) {
        token = await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        if(token && token.name) requestorName = token.name;
        if(token && token.oid) requestorId = token.oid;
        if(token && token.department) requestorDepartment = token.department;
      } else if(req.headers['x-api-key']) {
        require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        requestorName, requestorId, requestorDepartment = 'apikey';
      } 
      else throw new HTTPError(401, 'No authentication token provided');
      
      // Await database connection
      await getDb()
      context.log("Mongoose is connected.");

      // Set some default values
      req.body.version = 1;
      req.body.createdBy = requestorName
      req.body.createdById = requestorId
      req.body.createdByDepartment = requestorDepartment
      req.body.modifiedBy = requestorName
      req.body.modifiedById = requestorId
      req.body.modifiedByDepartment = requestorDepartment

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
      context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
      throw err
    };
    
}