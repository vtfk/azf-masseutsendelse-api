  const Dispatches = require('../sharedcode/models/dispatches.js')
  const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
  const utils = require('@vtfk/utilities');
  const HTTPError = require('../sharedcode/vtfk-errors/httperror');
  const validate = require('../sharedcode/validators/dispatches').validate;
  const blobClient = require('@vtfk/azure-blob-client');


  module.exports = async function (context, req) {
  try {
    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['createdTimestamp', 'createdBy', 'createdById', 'modifiedTimestamp', 'modifiedBy', 'modifiedById']);

    // Authentication / Authorization
    let requestorName = undefined;
    let requestorId = undefined;
    if(req.headers.authorization) {
        token = await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        if(token && token.name) requestorName = token.name;
        if(token && token.oid) requestorId = token.oid;
    } else if(req.headers['x-api-key']) {
        require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        requestorName = 'apikey';
    } 
    else throw new HTTPError(401, 'No authentication token provided');

    // Update modified by
    req.body.modifiedBy = requestorName
    req.body.modifiedById = requestorId
    req.body.modifiedTimestamp = new Date();

    // Get the ID from the request 
    const id = context.bindingData.id
    
    // Validate dispatch against schenarios that cannot be described by schema
    validate(req.body);

    // Await the Db conection 
    await getDb()
    context.log("Mongoose is connected")

    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(id).lean()
    if(!existingDispatch) { throw new HTTPError(404, `Dispatch with id ${id} could not be found` ) }

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

    // Validate attachments
    if(req.body.attachments && Array.isArray(req.body.attachments) && req.body.attachments.length > 0) {
      req.body.attachments.forEach((i) => {
        blobClient.unallowedPathCharacters.forEach((char) => {
          if(i.name.includes(char)) throw new HTTPError(400, `${i} cannot contain illegal character ${char}`);
        })
      })
    }

    // Update the dispatch 
    const updatedDispatch = await Dispatches.findByIdAndUpdate(id, req.body, {new: true})
    
    // Handle attachments
    if(existingDispatch.attachments) {
      let attachmentsToRemove = [];
      let attachmentsToAdd = [];
      const existingNames = existingDispatch.attachments.map((i) => i.name);
      const updatedNames = req.body.attachments.map((i) => i.name);

      // Check for attachments to add
      attachmentsToAdd = updatedNames.filter((i) => !existingNames.includes(i));
      attachmentsToRemove = existingNames.filter((i) => !updatedNames.includes(i));
      req.body.attachments.forEach((i) => {
        if(i.data && !attachmentsToAdd.includes(i)) attachmentsToAdd.push(i.name);
      })

      attachmentsToAdd.forEach(async (i) => {
        const attachment = req.body.attachments.find((x) => x.name === i);
        await blobClient.save(`${id}/${i}`, attachment.data);
      })

      attachmentsToRemove.forEach(async (i) => {
        await blobClient.remove(`${id}/${i}`);
      })
    }

    // Return the dispatch 
    context.res.status(200).send(updatedDispatch)

  } catch (err) {
    context.log(err)
    context.res.status(400).send(err)
    throw err
  }
}
