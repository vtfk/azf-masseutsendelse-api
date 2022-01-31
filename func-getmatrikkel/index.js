/*
  Import dependencies
*/
const axios = require('axios');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const config = require('../config');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  logConfig({
    azure: { context }
  })

  try {
    // Authentication / Authorization
    if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
    else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
    else {
      logger('error', ['No authentication token provided'])
      throw new HTTPError(401, 'No authentication token provided');
    }

    // Input validation
    if(!config.VTFK_MATRIKKELPROXY_BASEURL) {
      logger('error', ['The MatrikkelProxyAPI connection is not configured'])
      throw new HTTPError(400, 'The MatrikkelProxyAPI connection is not configured');
    }
    if(!config.VTFK_MATRIKKELPROXY_BASEURL) {
      logger('error', ['The MatrikkelProxyAPI connection is missing the APIKey'])
      throw new HTTPError(400, 'The MatrikkelProxyAPI connection is missing the APIKey');
    }
    
    // Get ID from request
    const endpoint = decodeURIComponent(context.bindingData.endpoint);

    let request = {
      method: 'post',
      url: `${config.VTFK_MATRIKKELPROXY_BASEURL}${endpoint}`,
      headers: {
        'X-API-KEY': config.VTFK_MATRIKKELPROXY_APIKEY
      },
      data: req.body
    }

    response = await axios.request(request);
    context.res.send(response.data);
  } catch (err) {
    context.log(err);
    logger('error', [err])
    context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    throw err;
  }
}