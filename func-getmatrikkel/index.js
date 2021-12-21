/*
  Import dependencies
*/
const axios = require('axios');
const HTTPError = require('../sharedcode/vtfk-errors/httperror');

module.exports = async function (context, req) {
  try {
    // Input validation
    if(!process.env.MATRIKKELPROXY_BASEURL) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is not configured');
    if(!process.env.MATRIKKELPROXY_APIKEY) throw new HTTPError(400, 'The MatrikkelProxyAPI connection is missing the APIKey');
    // Get ID from request
    const endpoint = decodeURIComponent(context.bindingData.endpoint);

    let request = {
      method: 'post',
      url: `${process.env.MATRIKKELPROXY_BASEURL}${endpoint}`,
      headers: {
        'X-API-KEY': process.env.MATRIKKELPROXY_APIKEY
      },
      data: req.body
    }

    response = await axios.request(request);
    context.res.send(response.data);
  } catch (err) {
    context.log(err);
    context.res.status(400).send(err);
    throw err;
  }
}