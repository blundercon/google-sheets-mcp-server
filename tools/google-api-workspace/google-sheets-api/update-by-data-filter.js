import { GoogleAuth } from 'google-auth-library';

/**
 * Function to update values in a Google Sheets spreadsheet by data filter.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {Object} args.data - The data to be updated.
 * @param {string} [args.valueInputOption='USER_ENTERED'] - Determines how input data should be interpreted.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const execute = async ({ spreadsheetId, data, valueInputOption = 'USER_ENTERED' }) => {
  const baseUrl = 'https://sheets.googleapis.com';

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    const body = JSON.stringify({
      data,
      valueInputOption
    });

    const response = await client.request({
      url: `${baseUrl}/v4/spreadsheets/${spreadsheetId}/values:batchUpdateByDataFilter`,
      method: 'POST',
      body
    });

    return response.data;
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for updating values in a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: execute,
  definition: {
    type: 'function',
    function: {
      name: 'update_spreadsheet_values_by_data_filter',
      description: 'Update values in a Google Sheets spreadsheet by data filter.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          data: {
            type: 'object',
            description: 'The data to be updated.'
          },
          valueInputOption: {
            type: 'string',
            description: 'Determines how input data should be interpreted.'
          }
        },
        required: ['spreadsheetId', 'data']
      }
    }
  }
};

export { apiTool, execute };