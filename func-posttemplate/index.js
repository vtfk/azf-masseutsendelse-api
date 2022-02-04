const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const utils = require('@vtfk/utilities');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
      // Configure the logger
      logConfig({
        azure: { context }
      })

      // Authentication / Authorization
      const requestor = await require('../sharedcode/auth/auth').auth(req);

      // Strip away some fields that should not be able to be set by the request
      req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'createdByDepartment', 'modifiedTimestamp', 'modifiedBy', 'modifiedById', 'modifiedByDepartment']);

      // Await database connection
      await getDb()

      // Set some default values
      req.body.version = 1;
      req.body.createdBy = requestor.name
      req.body.createdById = requestor.id
      req.body.createdByDepartment = requestor.department
      req.body.modifiedBy = requestor.name
      req.body.modifiedById = requestor.id
      req.body.modifiedByDepartment = requestor.department

      // Create a new document from model
      const template = new Templates(req.body)

      // Save the template to the database
      const result = await template.save();

      // Return the result
      context.res.status(201).send(result);

    } catch (err) {
      logger('error', [err])
      context.res.status(400).send(err)
      throw err
    };
    
}