const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const blobClient = require('@vtfk/azure-blob-client');
const axios = require('axios');
const config = require('../config');
const { logConfig, logger } = require('@vtfk/logger')
const dayjs = require('dayjs');

// Arrays
let e18Jobs = [];
<<<<<<< HEAD
// Clear the e18Jobs Array
e18Jobs = []
=======

>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
module.exports = async function (context, req) {
  try {
    // Configure the logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Await the DB connection 
    await getDb()

    // Find all disptaches 
    let dispatches = await Dispatches.find({ 'status': 'approved' })
    if (!dispatches || dispatches.length === 0) return context.res.send([]);

    // Loop through all dispatches
    for(const dispatch of dispatches) {
      // Validate if the dispatch is ready
      if(!dispatch.approvedTimestamp) continue;

      // Check if the dispatch has passed the registration threshold
      let registrationThreshold = dayjs(dispatch.approvedTimestamp).set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 0);
      let delaySendUntil = dayjs().add(1, 'day').set('hour', 11).set('minute', 0).set('second', 0).set('millisecond', 0);
      if(!config.BYPASS_REGISTRATION_THRESHOLD) {
        if(dayjs(new Date()).isBefore(registrationThreshold)) continue;
      }
      
      // Variables
      let e18Files = [];  // Stores all files that should be registrered to E18
      let e18Job = {
        system: 'masseutsendelse', 
        projectId: 30, 
<<<<<<< HEAD
        parallel: true,
=======
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
        delayUntil: delaySendUntil.toISOString(),
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
          url: config.VTFK_PDFGENERATOR_ENDPOINT,
          method: 'post',
          data: {
            template: dispatch.template.template,
            documentDefinitionId:  dispatch.template.documentDefinitionId || 'brevmal',
            data: data
          }
        }

        // Generate PDF from template
        const legalFilename = dispatch.title.replace(/[/\\?%*:|"<>;¤]/g, '');
        const response = await axios.request(generatePDFRequest);
        if(response.data) e18Files.push({ title: legalFilename, format: 'pdf', versionFormat: 'A', base64: response.data.base64});
        else throw new HTTPError(404, `Could not genereate PDF for dispatch ${dispatch.title}`)
      }

      // Retreive any attachments if applicable
<<<<<<< HEAD
      if(!process.env.NODE_ENV === 'test'){
        if (dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length > 0) {
          for(const attachment of dispatch.attachments) {
            let file = await blobClient.get(`${dispatch._id}/${attachment.name}`)
            // Validate the files
            if (!file) throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')
            if(file.data.startsWith('data:') && file.data.includes(',')) file.data = file.data.substring(file.data.indexOf(',') + 1);
            if(file.name.includes('.')) file.name = file.name.substring(0, file.name.indexOf('.'));
            // Push it to the files array
            e18Files.push({title: file.name, format: file.extension, base64: file.data});
          }
        }
      } else {
        e18Files.push({title: 'test', format: '.txt' , base64: 'base64'});
=======
      if (dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length > 0) {
        for(const attachment of dispatch.attachments) {
          let file = await blobClient.get(`${dispatch._id}/${attachment.name}`)
          // Validate the files
          if (!file) throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')
          if(file.data.startsWith('data:') && file.data.includes(',')) file.data = file.data.substring(file.data.indexOf(',') + 1);
          if(file.name.includes('.')) file.name = file.name.substring(0, file.name.indexOf('.'));
          // Push it to the files array
          e18Files.push({title: file.name, format: file.extension, base64: file.data});
        }
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
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
<<<<<<< HEAD
          dependencyTag: 'sync',
=======
          group: 'sync',
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
          data: person
        });
      })

      // Create tasks for creating/updated persons
      businessArray.forEach((business) => {
        e18Job.tasks.push({
          system: 'p360',
          method: 'SyncEnterprise',
<<<<<<< HEAD
          dependencyTag: 'sync',
=======
          group: 'sync',
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
          data: business
        });
      })
      
      // Create the p360 caseDocument
      e18Job.tasks.push({
        system: 'p360',
        method: 'archive',
<<<<<<< HEAD
        dependencyTag: `createCaseDocument`,
        dependencies: ['sync'],
=======
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
        data: {
          system: 'masseutsendelse',
          template: 'utsendelsesdokument',
          parameter: {
            title: dispatch.title,
            caseNumber: dispatch.archivenumber,
            date: new Date().toISOString(),
            contacts: dispatch.owners.map((o) => {return { ssn: o.nummer, role: 'Mottaker' }}),
            attachments: [e18Files[0]],
            accessCode: "U",                    // U = Alle
            accessGroup: "Alle",                // No access restriction
            paragraph: "",                      // No paragraph
            responsiblePersonEmail: dispatch.createdByEmail
          }
        }
      })

      if(e18Files.length > 1) {
<<<<<<< HEAD
        // Create one uploadDocuments-job pr. Attachment
=======
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
        let fileIndex = -1;
        for(const file of e18Files) {
          fileIndex++;
          if(fileIndex === 0) continue;
<<<<<<< HEAD

          e18Job.tasks.push({
            system: 'p360',
            method: 'archive',
            dependencyTag: `uploadAttachment-${fileIndex}`,
            dependencies: fileIndex === 1 ? ['createCaseDocument'] : [`uploadAttachment-${fileIndex - 1}`],
=======
          e18Job.tasks.push({
            system: 'p360',
            method: 'archive',
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
            dataMapping: "parameter.documentNumber=DocumentNumber",
            data: {
              system: 'archive',
              template: 'add-attachment',
              parameter: {
                secure: false,
                title: file.title,
                format: file.format,
                base64: file.base64,
                versionFormat: 'P'
              }
            }
          });
        }
      }


      // Create task to sendt to each contact
      e18Job.tasks.push({
        system: 'p360',
        method: 'archive',
<<<<<<< HEAD
        dependencies: [`uploadAttachment-${e18Files.length - 1}`],
=======
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
        dataMapping: "{\"parameter\": { \"Documents\": [ { \"DocumentNumber\": \"{{DocumentNumber}}\" }]}}",
        data: {
          method: "DispatchDocuments",
          service: "DocumentService",
        }
      });

      // Add the job to the e18 jobs array
      e18Jobs.push({_id: dispatch._id, e18Job });
    }

<<<<<<< HEAD
    // context.res.send(e18Jobs)
    return {body: e18Jobs, headers: {'Content-Type': 'application/json'}, status: 200}
  } catch (err) {
    logger('error', [err])
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}
    // context.res.status(400).send(err)
=======
    context.res.send(e18Jobs)
    // Clear the e18Jobs Array
    e18Jobs = []
  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
  }
}
