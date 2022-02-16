  const Dispatches = require('../sharedcode/models/dispatches.js')
  const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
  const utils = require('@vtfk/utilities');
  const HTTPError = require('../sharedcode/vtfk-errors/httperror');
  const validate = require('../sharedcode/validators/dispatches').validate;
  const blobClient = require('@vtfk/azure-blob-client');
  const { logConfig, logger } = require('@vtfk/logger');

  module.exports = async function (context, req) {
  try {
    // Configure the logging
    logConfig({
      azure: { context }
    })

    // Strip away som fields that should not bed set by the request.
    req.body = utils.removeKeys(req.body, ['validatedArchivenumber', 'createdTimestamp', 'createdBy', 'createdById', 'createdByDepartment', 'modifiedTimestamp', 'modifiedBy', 'modifiedById', 'modifiedByDepartment']);
    delete req.body._id;

    // Authentication / Authorization
    const requestor = await require('../sharedcode/auth/auth').auth(req);

    // Update modified by
    req.body.modifiedBy = requestor.name;
    req.body.modifiedById = requestor.id;
    req.body.modifiedTimestamp = new Date();
    req.body.modifiedByEmail = requestor.email;
    req.body.modifiedByDepartment = requestor.department;

    // Figure out if any items should be unset
    let unsets = {};
    if(Object.keys(req.body).length === 2 && !req.body.template) unsets.template = 1;
    if(req.body.attachments && !req.body.template) unsets.template = 1;

    // Get ID from request
    const id = context.bindingData.id
    
    // Await the Db conection 
    await getDb()

    // Get the existing disptach object 
    let existingDispatch = await Dispatches.findById(id).lean()
    if(!existingDispatch) throw new HTTPError(404, `Dispatch with id ${id} could not be found` )

    // If the status is running or completed, only status is allowed to be updated
    if(existingDispatch.status === 'inprogress' && req.body.status !== 'completed') throw new HTTPError(400, 'No changes can be done to a running dispatch except setting it to completed');
    if(existingDispatch.status === 'inprogress' && req.body.status === 'completed') {
      const result = await Dispatches.findByIdAndUpdate(id, { status: 'completed' }, { new: true});
      return context.res.status(201).send(result)
    }
    // Failsafe
    if(existingDispatch.status === 'inprogress' || existingDispatch.status === 'completed') throw new HTTPError(400, 'No changes can be done to running or completed dispatches');

    // Update fields
    req.body.validatedArchivenumber = existingDispatch.validatedArchivenumber;

    // Set approval information
    if(existingDispatch.status === 'notapproved' && req.body.status === 'approved') {
      req.body.approvedBy = requestor.name;
      req.body.approvedById = requestor.id;
      req.body.approvedByEmail = requestor.email;
      req.body.approvedTimestamp = new Date();
    }
    if(req.body.status === 'notapproved') {
      req.body.approvedBy = '';
      req.body.approvedById = '';
      req.body.approvedTimestamp = '';
    }

    // Validate dispatch against schenarios that cannot be described by schema
    // const toValidate = {...existingDispatch, ...req.body}
    await validate(req.body);
    req.body.validatedArchivenumber = req.body.archivenumber;

    // Validate attachments
    const allowedExtensions = ['pdf', 'xlsx', 'xls', 'rtf', 'msg', 'ppt', 'pptx', 'docx', 'doc', 'png', 'jpg', 'jpeg'];
    if(req.body.attachments && Array.isArray(req.body.attachments) && req.body.attachments.length > 0) {
      req.body.attachments.forEach((i) => {
        const split = i.name.split('.');
        if(split.length === 1) throw new HTTPError(400, 'All filenames must have an extension')
        const extension = split[split.length - 1];
        if(!allowedExtensions.includes(extension.toLowerCase())) throw new HTTPError(400, `The file extension ${extension} is not allowed`);
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
    if(req.body.attachments) {
      const attachmentsToAdd = req.body.attachments.filter((i) => !existingNames.includes(i.name) || i.data);
      const attachmentsToRemove = existingNames.filter((i) => !requestNames.includes(i));
    
      // Upload attachments if applicable
      if(!process.env.NODE_ENV === 'test') attachmentsToAdd.forEach(async (i) => { await blobClient.save(`${id}/${i.name}`, i.data); })
      // Remove attachments if applicable
      if(!process.env.NODE_ENV === 'test') attachmentsToRemove.forEach(async (i) => { await blobClient.remove(`${id}/${i}`); })
    }

    // Return the dispatch
    // return context.res.status(201).send(updatedDispatch)
    return {body: updatedDispatch, headers: {'Content-Type': 'application/json'}, status: 201}
  } catch (err) {
   err
    logger('error', [err])
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}
  }
}
