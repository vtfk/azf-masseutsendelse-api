const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');

module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Await the db connection.
    await getDb()

    // Find all the templates
    let templates = await Templates.find({})
    if (!templates) throw new HTTPError(404, 'No templates found in the databases')

    //Return the Templates
    return await azfHandleResponse(templates, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}


