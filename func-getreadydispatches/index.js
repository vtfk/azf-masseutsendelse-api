const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const blobClient = require('@vtfk/azure-blob-client');
const axios = require('axios');

// Arrays
let e18Jobs = [];

module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    if (req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
    else if (req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
    else throw new HTTPError(401, 'No authentication token provided');

    // Await the DB connection 
    await getDb()

    // Find all disptaches 
    let dispatches = await Dispatches.find({ 'status': 'approved' })
    if (!dispatches || dispatches.length === 0) return context.res.send([]);

    // Loop through all dispatches
    for(const dispatch of dispatches) {
      let e18Files = [];  // Stores all files that should be registrered to E18
      let e18Job = {
        system: 'masseutsendelse', 
        projectId: 30, 
        parallel: true,
        tasks: []
      }

      // Generate PDF from template, if applicable
      if (dispatch.template?.template) {
        let data = dispatch.template.data;
        if (dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length > 0) data.attachments = dispatch.attachments
        data.info = {
          'sector': dispatch.createdByDepartment,
          'our-reference': dispatch.archivenumber,
          'our-caseworker': dispatch.createdBy
        }

        const generatePDFRequest = {
          url: process.env.PDF_GENERATEV2,
          method: 'post',
          data: {
            template: dispatch.template.template,
            documentDefinitionId:  dispatch.template.documentDefinitionId || 'brevmal',
            data: data
          }
        }

        const response = await axios.request(generatePDFRequest);
        if(response.data) e18Files.push({ title: 'hoveddokument', format: 'pdf', base64: response.data.base64});
        else throw new HTTPError(404, `Could not genereate PDF for dispatch ${dispatch.title}`)
      }

      // Retreive any attachments if applicable
      if (dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length > 0) {
        for(const attachment of dispatch.attachments) {
          let file = await blobClient.get(`${dispatch._id}/${attachment.name}`)
          if (!file) { throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId') }
          if(file.data.startsWith('data:') && file.data.includes(',')) file.data = file.data.substring(file.data.indexOf(',') + 1);
          if(file.name.includes('.')) file.name = file.name.substring(0, file.name.indexOf('.'));
          e18Files.push({title: file.name, format: file.extension, base64: file.data});
        }
      }

      // Create the archive task
      let personArray = [];
      let businessArray = [];
      for(const owner of dispatch.owners) {
        if(owner._type.toLowerCase().includes('juridisk')) {
          businessArray.push({
            orgnr: owner.nummer
          })
        } else {
          personArray.push({
            ssn: owner.nummer
          })
        }
      }
      
      // Create tasks for create/update private persons
      personArray.forEach((person) => {
        e18Job.tasks.push({
          system: 'p360',
          method: 'SyncPrivatePerson',
          dependencyTag: 'sync',
          data: person
        });
      })

      // Create tasks for creating/updated persons
      businessArray.forEach((business) => {
        e18Job.tasks.push({
          system: 'p360',
          method: 'SyncEnterprise',
          dependencyTag: 'sync',
          data: business
        });
      })
      
      // Upload attachments to the archive document
      e18Job.tasks.push({
        system: 'p360',
        method: 'archive',
        dependencyTag: 'uploadDocuments',
        dependencies: ['sync'],
        data: {
          system: 'masseutsendelse',
          template: 'utsendelsessak',
          parameter: {
            title: dispatch.title,
            caseNumber: dispatch.archivenumber,
            date: new Date().toISOString(),
            contacts: dispatch.owners.map((o) => {return { ssn: o.nummer, role: 'Mottaker' }}),
            attachments: e18Files,
            accessCode: "U",                    // U = Alle
            accessGroup: "Alle",                // No access restriction
            paragraph: "",                      // No paragraph
            responsibleEnterpriseRecno: 506,    // TODO: Hva skal det stå her?
          }
        }
      });

      // Create task to sendt to each contact
      e18Job.tasks.push({
        system: 'p360',
        method: 'archive',
        dependencies: ['uploadDocuments'],
        dataMapping: "{\"parameter\": { \"Documents\": [ { \"DocumentNumber\": \"{{DocumentNumber}}\" }]}}",
        data: {
          method: "DispatchDocuments",
          service: "DocumentService",
        }
      });

      // Add the job to the e18 jobs array
      e18Jobs.push({_id: dispatch._id, e18Job });
    }

    context.res.send(e18Jobs)
    // Clear the e18Jobs Array
    e18Jobs = []
  } catch (err) {
    context.log(err)
    context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    throw err
  }
}
