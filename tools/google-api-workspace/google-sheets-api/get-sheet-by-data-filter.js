import { GoogleAuth } from 'google-auth-library';

/**
 * Function to get a sheet by data filter from Google Sheets.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {Array} args.dataFilters - An array of data filters to apply.
 * @param {boolean} [args.includeGridData=true] - Whether to include grid data in the response.
 * @returns {Promise<Object>} - The result of the request to get the sheet by data filter.
 */
const execute = async ({ spreadsheetId, dataFilters, includeGridData = true }) => {
  const baseUrl = 'https://sheets.googleapis.com';

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Construct the request body
    const body = JSON.stringify({
      dataFilters,
      includeGridData
    });

    // Perform the fetch request
    const response = await client.request({
      url: `${baseUrl}/v4/spreadsheets/${spreadsheetId}:getByDataFilter`,
      method: 'POST',
      body
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error getting sheet by data filter:', error);
    throw error;
  }
};

/**
 * Tool configuration for getting a sheet by data filter from Google Sheets.
 * @type {Object}
 */
const apiTool = {
  function: execute,
  definition: {
    type: 'function',
    function: {
      name: 'get_sheet_by_data_filter',
      description: 'Get a sheet by data filter from Google Sheets.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          dataFilters: {
            type: 'array',
            description: 'An array of data filters to apply.'
          },
          includeGridData: {
            type: 'boolean',
            description: 'Whether to include grid data in the response.'
          }
        },
        required: ['spreadsheetId', 'dataFilters']
      }
    }
  }
};

export { apiTool, execute };