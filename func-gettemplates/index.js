const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure the logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Await the db connection.
    await getDb()

    // Find all the templates
    let templates = await Templates.find({})
    if (!templates) throw new HTTPError(404, 'No templates found in the databases')

    //Return the Templates
    context.res.send(templates)

  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err
  }
}


