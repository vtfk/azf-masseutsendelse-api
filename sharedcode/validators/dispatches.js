/*
  Import dependencies
*/
const HTTPError = require('../vtfk-errors/httperror');
const { getCase } = require('../vtfk/checkP360Case');

/*
  Validator function
*/
module.exports.validate = async (dispatch, req) => {
  try {
    // Validate that the dispatch is defined
    if(!dispatch) throw new HTTPError('400', 'No dispatch object was provided');
    
    // Validate that the dispatch has a template and/or attachments
    if((!dispatch.attachments || dispatch.attachments.length === 0) && (!dispatch.template || Object.keys(dispatch.template).length === 0)) throw new HTTPError('400', 'Template OR Attachments must be provided');
    if(!dispatch.template && dispatch.attachments && Array.isArray(dispatch.attachments) && dispatch.attachments.length <= 0) throw new HTTPError('400', 'Attachments cannot be empty when there is no template'); 

    // Validate that the provided archivenumber exists in P360
    if(!dispatch.archivenumber) throw new HTTPError('400', 'No archivenumber has been provided');
    if(dispatch.archivenumber !== dispatch.validatedArchivenumber) {
      const p360Case = await getCase(dispatch.archivenumber);
      if(!p360Case) throw new HTTPError('400', 'Could not find a valid case in the archive system');
    }

  } catch (err) {
    throw err;
  }
}