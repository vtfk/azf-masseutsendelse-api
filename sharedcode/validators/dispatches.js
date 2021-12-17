const HTTPError = require('../sharedcode/vtfk-errors/httperror');

module.exports.validate = (dispatch) => {
  if(!dispatch) throw new HTTPError('400', 'No dispatch object was provided');
  if(!dispatch.attachments && !dispatch.template) throw new HTTPError('400', 'Template OR Attachments must be provided');
  if(dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length <= 0) throw new HTTPError('400', 'Attachments cannot be empty');
}