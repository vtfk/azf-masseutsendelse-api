/*
  Import dependencies
*/
const config = require('../../config');
const axios = require('axios');

/**
 * Attempt to get a case from P360
 * @param {string} casenumber The P360 casenumber to check if exists
 */
module.exports.getCase = async function getCase (casenumber) {
  // Input validation
  if(!casenumber) throw new Error('Archive casenumber cannot be empty');
  if(!config.VTFK_P360_ARCHIVE_ENDPOINT) throw new Error('VTFK_P360_ARCHIVE_ENDPOINT environment variable cannot be empty');
  if(!config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY) throw new Error('VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY environment variable cannot be empty');

  // Build the request
  const request = {
    method: 'post',
    url: config.VTFK_P360_ARCHIVE_ENDPOINT + 'archive/',
    headers: {
      'Ocp-Apim-Subscription-Key': config.VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY
    },
    data: {
      service: "CaseService",
      method: "GetCases",
      parameter: {
        CaseNumber: casenumber
      },
      options: {
        onlyOpenCases: true
      }
    }
  }

  // Make the request
  const response = await axios.request(request);

  // Handle and return the response
  if(!response || !response.data) return undefined;
  if(Array.isArray(response.data)) {
    if(response.data.length === 0) return undefined;
    if(response.data.length > 1) throw new Error(`The casenumber ${casenumber} matched ${response.data.length} it must only match one`);
    response.data = response.data[0];
  }
  return response.data;
}