/*
  Import dependencies
*/
const axios = require('axios')
const HTTPError = require('../sharedcode/vtfk-errors/httperror')
const config = require('../config')
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers')

module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req)

    // Input validation
    if (!config.VTFK_MATRIKKELPROXY_BASEURL) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is not configured')
    if (!config.VTFK_MATRIKKELPROXY_APIKEY) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is missing the APIKey')

    // Get ID from request
    const endpoint = decodeURIComponent(context.bindingData.endpoint)

    const request = {
      method: 'post',
      url: `${config.VTFK_MATRIKKELPROXY_BASEURL}${endpoint}`,
      headers: {
        'X-API-KEY': config.VTFK_MATRIKKELPROXY_APIKEY
      },
      data: req.body
    }

    response = await axios.request(request)

    return await azfHandleResponse(response.data, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}
