import { GoogleAuth } from 'google-auth-library';

/**
 * Function to get values from a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {string} args.range - The range of cells to retrieve values from.
 * @param {string} [args.majorDimension] - The major dimension of the values (ROWS or COLUMNS).
 * @param {string} [args.valueRenderOption] - How to render the values (e.g., FORMATTED_VALUE).
 * @param {string} [args.dateTimeRenderOption] - How to render dates and times.
 * @returns {Promise<Object>} - The result of the values retrieval.
 */
const execute = async ({ spreadsheetId, range, majorDimension, valueRenderOption, dateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Construct the URL with path and query parameters
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}`);
    if (majorDimension) url.searchParams.append('majorDimension', majorDimension);
    if (valueRenderOption) url.searchParams.append('valueRenderOption', valueRenderOption);
    if (dateTimeRenderOption) url.searchParams.append('dateTimeRenderOption', dateTimeRenderOption);

    // Perform the fetch request
    const response = await client.request({
      url: url.toString(),
      method: 'GET'
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error retrieving values from spreadsheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for retrieving values from a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: execute,
  definition: {
    type: 'function',
    function: {
      name: 'get_values',
      description: 'Retrieve values from a specified range in a Google Sheets spreadsheet.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          range: {
            type: 'string',
            description: 'The range of cells to retrieve values from.'
          },
          majorDimension: {
            type: 'string',
            description: 'The major dimension of the values (ROWS or COLUMNS).'
          },
          valueRenderOption: {
            type: 'string',
            description: 'How to render the values (e.g., FORMATTED_VALUE).'
          },
          dateTimeRenderOption: {
            type: 'string',
            description: 'How to render dates and times.'
          }
        },
        required: ['spreadsheetId', 'range']
      }
    }
  }
};

export { apiTool, execute };