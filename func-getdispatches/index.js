const Dispatches = require('../sharedcode/models/dispatches.js')
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

    // Await the DB connection 
    await getDb()

    // Find all disptaches
    let dispatches = [];
    if (req.query.full === true || req.query.full === 'true') dispatches = await Dispatches.find({})
    else dispatches = await Dispatches.find({}).select('-owners -excludedOwners -matrikkelUnitsWithoutOwners')

    // If no dispatches was found
    if (!dispatches) dispatches = [];

    // Return the disptaches
    context.res.send(dispatches)
  } catch (err) {
   err
    logger('error', [err])
    context.res.status(400).send(err)
    throw err
  }
}
