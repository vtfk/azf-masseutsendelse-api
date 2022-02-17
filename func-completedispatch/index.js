const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');

module.exports = async function (context, req) {
  try {
    // Get the ID from the request 
    const id = context.bindingData.id
    if(!id) throw new HTTPError(400, 'You cannot complete a dispatch without providing an id');

    // Authentication / Authorization
    const requestor = await require('../sharedcode/auth/auth').auth(req);

    // Await the DB conection 
    await getDb()

    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(id).lean()
    if(!existingDispatch) throw new HTTPError(404, `Dispatch with id ${id} could not be found`)
    if(existingDispatch.status !== 'approved') throw new HTTPError(404, `Cannot complete a dispatch that is not approved`)

    // Set completed information
    let completedData = {
      status: 'completed',
      owners: [],
      excludedOwners: [],
      matrikkelUnitsWithoutOwners: [],
      modifiedTimestamp: new Date(),
      modifiedBy: requestor.name,
      modifiedByEmail: requestor.email,
      modifiedByDepartment: requestor.department,
      modifiedById: requestor.id
    }
    if(req.body?.e18Id) completedData.e18Id = req.body.e18Id;

    // Update the dispatch 
    const updatedDispatch = await Dispatches.findByIdAndUpdate(id, completedData, { new: true})
    
    return await azfHandleResponse(updatedDispatch, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}