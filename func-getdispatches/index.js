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
<<<<<<< HEAD
    if (req.query?.full === true || req.query?.full === 'true') dispatches = await Dispatches.find({})
=======
    if (req.query.full === true || req.query.full === 'true') dispatches = await Dispatches.find({})
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
    else dispatches = await Dispatches.find({}).select('-owners -excludedOwners -matrikkelUnitsWithoutOwners')

    // If no dispatches was found
    if (!dispatches) dispatches = [];

    // Return the disptaches
<<<<<<< HEAD
    // context.res.send(dispatches)
    return {body: dispatches, headers: {'Content-Type': 'application/json'}, status: 200}
  } catch (err) {
   err
    logger('error', [err])
    // context.res.status(400).send(err)
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}

=======
    context.res.send(dispatches)
  } catch (err) {
   err
    logger('error', [err])
    context.res.status(400).send(err)
    throw err
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
  }
}
