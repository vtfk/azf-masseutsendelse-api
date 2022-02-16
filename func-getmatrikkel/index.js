/*
  Import dependencies
*/
const axios = require('axios');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const config = require('../config');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure the logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);
<<<<<<< HEAD
   
    // Input validation
    if(!config.VTFK_MATRIKKELPROXY_BASEURL) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is not configured');
    if(!config.VTFK_MATRIKKELPROXY_APIKEY) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is missing the APIKey');
=======

    // Input validation
    if(!config.VTFK_MATRIKKELPROXY_BASEURL) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is not configured');
    if(!config.VTFK_MATRIKKELPROXY_BASEURL) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is missing the APIKey');
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
    
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
<<<<<<< HEAD
    // context.res.send(response.data);
    return {body: response.data, headers: {'Content-Type': 'application/json'}, status: 200}
  } catch (err) {
    logger('error', [err])
    // context.res.status(400).send(err)
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}
=======
    context.res.send(response.data);
  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err;
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
  }
}