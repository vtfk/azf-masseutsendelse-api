
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

    // Get ID from request
    const id = context.bindingData.id
    if(!id) throw new HTTPError(400, 'No dispatch id was provided');

    // Await the database
    await getDb()

    //Find Dispatch by ID
    let disptach = await Dispatches.findById(id)
    if (!disptach) throw new HTTPError(404, `Disptach with id ${id} could no be found`)

    //Return the dispatch object 
    let disptachById = await Dispatches.findById(id, req.body, { new: true })
    return {body: disptachById, headers: {'Content-Type': 'application/json'}, status: 200}
    // context.res.send(disptachById)
  } catch (err) {
   err;
    logger('error', [err])
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}
    // context.res.status(400).send(err)
  }
}
