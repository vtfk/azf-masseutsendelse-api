  const Dispatches = require('../sharedcode/models/dispatches.js')
  const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
  const utils = require('@vtfk/utilities');
  const HTTPError = require('../sharedcode/vtfk-errors/httperror');
  const validate = require('../sharedcode/validators/dispatches').validate;
  const blobClient = require('@vtfk/azure-blob-client');


  module.exports = async function (context, req) {
  try {
    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'createdByDepartment', 'modifiedTimestamp', 'modifiedBy', 'modifiedById', 'modifiedByDepartment']);

    // Authentication / Authorization
    let requestorName = undefined;
    let requestorId = undefined;
    if(req.headers.authorization) {
        token = await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        if(token && token.name) requestorName = token.name;
        if(token && token.oid) requestorId = token.oid;
        if(token && token.department) requestorDepartment = token.department;
    } else if(req.headers['x-api-key']) {
        require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        requestorName, requestorId = 'apikey';
        requestorDepartment = 'apikey';
    } 
    else throw new HTTPError(401, 'No authentication token provided');

    // Update modified by
    req.body.modifiedBy = requestorName
    req.body.modifiedById = requestorId
    req.body.modifiedTimestamp = new Date();
    req.body.modifiedByDepartment = requestorDepartment

    // Figure out if any items should be unset
    let unsets = {};
    if(!req.body.template) unsets.template = 1;

    // Get the ID from the request 
    const id = context.bindingData.id
    
    // Await the Db conection 
    await getDb()

    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(id).lean()
    if(!existingDispatch) { throw new HTTPError(404, `Dispatch with id ${id} could not be found` ) }
    // If the status is running or completed, only status is allowed to be updated
    if(existingDispatch.status === 'inprogress' && req.body.status !== 'completed') throw new HTTPError(400, 'No changes can be done to a running dispatch except setting it to completed');
    if(existingDispatch.status === 'inprogress' && req.body.status === 'completed') {
      const result = await Dispatches.findByIdAndUpdate(id, { status: 'completed' }, { new: true});
      return context.res.status(201).send(result)
    }
    // Failsafe
    if(existingDispatch.status === 'inprogress' || existingDispatch.status === 'completed') throw new HTTPError(400, 'No changes can be done to running or completed dispatches');

    // Update fields
    req.body.modifiedBy = requestorName;
    req.body.modifiedById = requestorId
    req.body.modifiedTimestamp = new Date();

    // Set approval information
    if(existingDispatch.status !== 'approved' && req.body.status === 'approved') {
      req.body.approvedBy = requestorName;
      req.body.approvedById = requestorId;
      req.body.approvedTimestamp = new Date();
    }
    if(req.body.status !== 'approved') {
      req.body.approvedBy = '';
      req.body.approvedById = '';
      req.body.approvedTimestamp = '';
    }

    // Validate dispatch against schenarios that cannot be described by schema
    const toValidate = {...existingDispatch, ...req.body}
    validate(toValidate);

    // Validate attachments
    if(req.body.attachments && Array.isArray(req.body.attachments) && req.body.attachments.length > 0) {
      req.body.attachments.forEach((i) => {
        blobClient.unallowedPathCharacters.forEach((char) => {
          if(i.name.includes(char)) throw new HTTPError(400, `${i} cannot contain illegal character ${char}`);
        })
      })
    }

    // Update the dispatch 
    const updatedDispatch = await Dispatches.findByIdAndUpdate(id, { ...req.body, $unset: unsets }, { new: true})

    // Figure out the names of existing and requested attachments
    const existingNames = existingDispatch.attachments ? existingDispatch.attachments.map((i) => i.name) : [];
    const requestNames = req.body.attachments ? req.body.attachments.map((i) => i.name) : [];

    // Check for attachments to add
    const attachmentsToAdd = req.body.attachments.filter((i) => !existingNames.includes(i.name) || i.data);
    const attachmentsToRemove = existingNames.filter((i) => !requestNames.includes(i));

    // Upload attachments if applicable
    attachmentsToAdd.forEach(async (i) => { await blobClient.save(`${id}/${i.name}`, i.data); })
    // Remove attachments if applicable
    attachmentsToRemove.forEach(async (i) => { await blobClient.remove(`${id}/${i}`); })

    // Return the dispatch
    return context.res.status(201).send(updatedDispatch)
  } catch (err) {
    context.log(err)
    context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    throw err
  }
}
