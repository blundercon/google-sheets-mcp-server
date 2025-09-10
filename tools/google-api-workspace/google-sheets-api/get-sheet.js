import { GoogleAuth } from 'google-auth-library';

/**
 * Function to get a Google Sheet by its ID.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to retrieve.
 * @param {string} [args.ranges] - The ranges of cells to retrieve.
 * @param {boolean} [args.includeGridData=false] - Whether to include grid data in the response.
 * @returns {Promise<Object>} - The response data from the Google Sheets API.
 */
const execute = async ({ spreadsheetId, ranges, includeGridData = false }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}`);
    if (ranges) {
      url.searchParams.append('ranges', ranges);
    }
    url.searchParams.append('includeGridData', includeGridData.toString());

    // Perform the fetch request
    const response = await client.request({
      url: url.toString(),
      method: 'GET'
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error retrieving the spreadsheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for retrieving a Google Sheet.
 * @type {Object}
 */
const apiTool = {
  function: execute,
  definition: {
    type: 'function',
    function: {
      name: 'get_sheet',
      description: 'Retrieve a Google Sheet by its ID.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to retrieve.'
          },
          ranges: {
            type: 'string',
            description: 'The ranges of cells to retrieve.'
          },
          includeGridData: {
            type: 'boolean',
            description: 'Whether to include grid data in the response.'
          }
        },
        required: ['spreadsheetId']
      }
    }
  }
};

export { apiTool, execute };