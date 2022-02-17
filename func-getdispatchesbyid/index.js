const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');


module.exports = async function (context, req) {
  try {
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
    
    return await azfHandleResponse(disptachById, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}
