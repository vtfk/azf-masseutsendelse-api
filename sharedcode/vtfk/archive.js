/*
  Import dependencies
*/
const config = require('../../config')
const axios = require('axios')

/**
 * Attempt to get a case from P360
 * @param {string} casenumber The P360 casenumber to check if exists
 */
const syncRecipient = async (number, method) => {
  // Input validation
  if (!number) throw new Error('SSN cannot be empty')
  if (!method) throw new Error('Method cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_ENDPOINT) throw new Error('VTFK_P360_ARCHIVE_ENDPOINT environment variable cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY) throw new Error('VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY environment variable cannot be empty')

  // Build the request
  let request
  if (method === 'SyncPrivatePerson') {
    request = {
      method: 'post',
      url: config.VTFK_P360_ARCHIVE_ENDPOINT + method,
      headers: {
        'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
      },
      data: {
        ssn: number
      }
    }
  } else {
    request = {
      method: 'post',
      url: config.VTFK_P360_ARCHIVE_ENDPOINT + method,
      headers: {
        'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
      },
      data: {
        orgnr: number
      }
    }
  }

  // Make the request
  const response = await axios.request(request)

  // Handle and return the response
  if (response.status !== 200) return response.data[0]
  if (!response || !response.data) return undefined
  if (Array.isArray(response.data)) {
    if (response.data.length === 0) return undefined
    // if(response.data.length > 1) throw new Error(`Was not able to sync the recipient ${number}`);
    if (response.data.length > 1) return response.data[0]
    response.data = response.data[0]
  }
  return response.data
}

const addAttachment = async (method, documentNumber, base64, format, title) => {
  // Input validation
  if (!title) throw new Error('title cannot be empty')
  if (!method) throw new Error('Method cannot be empty')
  if (!base64) throw new Error('base64 cannot be empty')
  if (!format) throw new Error('format cannot be empty')
  if (!documentNumber) throw new Error('DocumentNumber cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_ENDPOINT) throw new Error('VTFK_P360_ARCHIVE_ENDPOINT environment variable cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY) throw new Error('VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY environment variable cannot be empty')

  // Build the request
  const request = {
    method: 'post',
    url: config.VTFK_P360_ARCHIVE_ENDPOINT + method,
    headers: {
      'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
    },
    data: {
      system: 'archive', // NB! Denne referere til hvilken system template som skal brukes "archive-add-attachment", se https://github.com/vtfk/azf-archive/tree/master/templates
      template: 'add-attachment',
      parameter: {
        documentNumber,
        base64,
        format,
        title,
        versionFormat: 'P'
      }
    }
  }

  // Make the request
  const response = await axios.request(request)

  // Handle and return the response
  if (!response || !response.data) return undefined
  if (Array.isArray(response.data)) {
    if (response.data.length === 0) return undefined
    if (response.data.length > 1) throw new Error(`Was not able to add attachment with the title ${title}`)
    response.data = response.data[0]
  }
  return response.data
}

const createCaseDocument = async (method, title, caseNumber, date, contacts, attachments, paragraph, responsiblePersonEmail) => {
  // Input validation
  if (!method) throw new Error('Method cannot be empty')
  if (!title) throw new Error('title cannot be empty')
  if (!caseNumber) throw new Error('caseNumber cannot be empty')
  if (!date) throw new Error('date cannot be empty')
  if (!contacts) throw new Error('contacts cannot be empty')
  // if(!attachments) throw new Error('attachments cannot be empty')
  // if(!paragraph) throw new Error('paragraph cannot be empty')
  if (!responsiblePersonEmail) throw new Error('responsiblePersonEmail cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_ENDPOINT) throw new Error('VTFK_P360_ARCHIVE_ENDPOINT environment variable cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY) throw new Error('VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY environment variable cannot be empty')

  // Build the request
  const request = {
    method: 'post',
    url: config.VTFK_P360_ARCHIVE_ENDPOINT + method,
    headers: {
      'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
    },
    data: {
      system: 'masseutsendelse',
      template: 'utsendelsesdokument',
      parameter: {
        title,
        caseNumber,
        date, // dato prosjektet ble opprettet i masseutsendelse
        contacts, // An array of contacts
        attachments, // An array of attachments
        accessCode: 'U',
        accessGroup: 'Alle',
        paragraph,
        responsiblePersonEmail
      }
    }
  }

  // Make the request
  const response = await axios.request(request)

  // Handle and return the response
  if (!response || !response.data) return undefined
  if (Array.isArray(response.data)) {
    if (response.data.length === 0) return undefined
    if (response.data.length > 1) throw new Error(`Was not able to create the case with the title: ${title}`)
    response.data = response.data[0]
  }
  return response.data
}

const dispatchDocuments = async (documents, method) => {
  // Input validation
  console.log(documents[0])
  if (!documents) throw new Error('Documents cannot be empty')
  // if(typeof(documents) !== Array) throw new Error('Documents must be of type array')
  if (documents.length < 0) throw new Error('Documents array must contain minimum one document')
  if (!config.VTFK_P360_ARCHIVE_ENDPOINT) throw new Error('VTFK_P360_ARCHIVE_ENDPOINT environment variable cannot be empty')
  if (!config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY) throw new Error('VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY environment variable cannot be empty')

  // Build the request
  const request = {
    method: 'post',
    url: config.VTFK_P360_ARCHIVE_ENDPOINT + method,
    headers: {
      'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
    },
    data: {
      service: 'DocumentService',
      method: 'DispatchDocuments',
      parameter: {
        Documents: [{
          DocumentNumber: documents[0]
        }]
      }
    }
  }

  // Make the request
  const response = await axios.request(request)

  // Handle and return the response
  if (!response || !response.data) return undefined
  if (Array.isArray(response.data)) {
    if (response.data.length === 0) return undefined
    if (response.data.length > 1) throw new Error(`Was not able to dispatch the documents: ${documents}`)
    response.data = response.data[0]
  }
  return response.data
}

module.exports = {
  syncRecipient,
  addAttachment,
  createCaseDocument,
  dispatchDocuments
}
