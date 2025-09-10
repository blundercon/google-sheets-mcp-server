import { GoogleAuth } from 'google-auth-library';

/**
 * Function to copy a sheet from one spreadsheet to another using the Google Sheets API.
 *
 * @param {Object} args - Arguments for the copy operation.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet containing the sheet to copy.
 * @param {string} args.sheetId - The ID of the sheet to copy.
 * @param {string} args.destinationSpreadsheetId - The ID of the spreadsheet to copy the sheet to.
 * @returns {Promise<Object>} - The properties of the newly created sheet.
 */
const execute = async ({ spreadsheetId, sheetId, destinationSpreadsheetId }) => {
  const baseUrl = 'https://sheets.googleapis.com';

  const body = {
    destinationSpreadsheetId
  };

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Perform the fetch request
    const response = await client.request({
      url: `${baseUrl}/v4/spreadsheets/${spreadsheetId}/sheets/${sheetId}:copyTo`,
      method: 'POST',
      body: JSON.stringify(body)
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error copying the sheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for copying a sheet in Google Sheets.
 * @type {Object}
 */
const apiTool = {
  function: execute,
  definition: {
    type: 'function',
    function: {
      name: 'copy_to_sheet',
      description: 'Copy a sheet from one spreadsheet to another.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet containing the sheet to copy.'
          },
          sheetId: {
            type: 'string',
            description: 'The ID of the sheet to copy.'
          },
          destinationSpreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to copy the sheet to.'
          }
        },
        required: ['spreadsheetId', 'sheetId', 'destinationSpreadsheetId']
      }
    }
  }
};

export { apiTool, execute };