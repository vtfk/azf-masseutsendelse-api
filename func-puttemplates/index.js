const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const utils = require('@vtfk/utilities');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    const requestor = await require('../sharedcode/auth/auth').auth(req);

    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'modifiedTimestamp', 'modifiedBy', 'modifiedById']);

    // Update modified by
    req.body.modifiedBy = requestor.name
    req.body.modifiedById = requestor.id
    req.body.modifiedTimestamp = new Date();
    req.body.modifiedByDepartment = requestor.department;

    // Get the ID from the request
    const id = context.bindingData.id

    // Await the database
    await getDb()

    // Get the existing record
    let existingTemplate = await Templates.findById(id).lean();
    if(!existingTemplate) throw new HTTPError(`Template with id ${id} could no be found`) 

    // Increment the version number
    req.body.version = existingTemplate.version + 1;

    // Update the template
    const updatedTemplate = await Templates.findByIdAndUpdate(id, req.body, {new: true})

    // Return the updated template
    context.res.status(200).send(updatedTemplate)
  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err;
  }
}
