import { GoogleAuth } from 'google-auth-library';

/**
 * Function to update values in a specified range of a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {string} args.range - The range of cells to update.
 * @param {string} args.valueInputOption - Determines how input data should be interpreted.
 * @param {Object} args.values - The values to update in the spreadsheet.
 * @param {boolean} [args.includeValuesInResponse=false] - Indicates whether to include values in the response.
 * @param {string} [args.responseValueRenderOption] - Selector specifying how to render values in the response.
 * @param {string} [args.responseDateTimeRenderOption] - Selector specifying how to render date/time values in the response.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const execute = async ({ spreadsheetId, range, valueInputOption, values, includeValuesInResponse = false, responseValueRenderOption, responseDateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Construct the URL with path variables
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}`);
    url.searchParams.append('valueInputOption', valueInputOption);
    url.searchParams.append('includeValuesInResponse', includeValuesInResponse.toString());
    if (responseValueRenderOption) url.searchParams.append('responseValueRenderOption', responseValueRenderOption);
    if (responseDateTimeRenderOption) url.searchParams.append('responseDateTimeRenderOption', responseDateTimeRenderOption);

    // Perform the fetch request
    const response = await client.request({
      url: url.toString(),
      method: 'PUT',
      body: JSON.stringify({ values })
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error updating values:', error);
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
      name: 'update_values',
      description: 'Update values in a specified range of a Google Sheets spreadsheet.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          range: {
            type: 'string',
            description: 'The range of cells to update.'
          },
          valueInputOption: {
            type: 'string',
            description: 'Determines how input data should be interpreted.'
          },
          values: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          includeValuesInResponse: {
            type: 'boolean',
            description: 'Indicates whether to include values in the response.'
          },
          responseValueRenderOption: {
            type: 'string',
            description: 'Selector specifying how to render values in the response.'
          },
          responseDateTimeRenderOption: {
            type: 'string',
            description: 'Selector specifying how to render date/time values in the response.'
          }
        },
        required: ['spreadsheetId', 'range', 'valueInputOption', 'values']
      }
    }
  }
};

export { apiTool, execute };