const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');

module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Await the DB connection 
    await getDb()

    // Find all disptaches
    let dispatches = [];
    if (req.query?.full === true || req.query?.full === 'true') dispatches = await Dispatches.find({})
    else dispatches = await Dispatches.find({}).select('-owners -excludedOwners -matrikkelUnitsWithoutOwners')

    // If no dispatches was found
    if (!dispatches) dispatches = [];

    // Return the disptaches
    return await azfHandleResponse(dispatches, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}
