/*
  Import dependencies
*/
const HTTPError = require('../vtfk-errors/httperror');
const config = require('../../config');

/*
  Validation function
*/
module.exports = (key) => {
  // Validation
  if(!key) throw new HTTPError(401, 'No APIKey provided');
  if(!config.APIKEYS) throw new HTTPError(401, 'The APIKEY is invalid');

  // Get all keys that are over 24 keys long
  let keys = config.APIKEYS.split(',').filter(n => n.length >= config.APIKEYS_MINIMUM_LENGTH);
  if(!keys || keys.length === 0) throw new HTTPError(401, 'The APIKEY is invalid');

  let existingKey = keys.filter((n => n === key));
  if(!existingKey) throw new HTTPError(401, 'The APIKEY is invalid')

  return;
}