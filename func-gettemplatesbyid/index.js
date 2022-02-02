const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Get ID from request
    const id = context.bindingData.id
    if(!id) throw new HTTPError('400', 'No dispatch id was provided');

    // Await the database
    await getDb()

    //Find Template by ID
    let template = await Templates.findById(id)
    if (!template) throw new HTTPError(`Template with id ${id} could no be found`)

    //Return the template object 
    let templateById = await Templates.findById(id, req.body, { new: true })
    context.res.send(templateById)

  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err;
  }
}
