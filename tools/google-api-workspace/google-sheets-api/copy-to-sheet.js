/**
 * Function to copy a sheet from one spreadsheet to another using the Google Sheets API.
 *
 * @param {Object} args - Arguments for the copy operation.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet containing the sheet to copy.
 * @param {string} args.sheetId - The ID of the sheet to copy.
 * @param {string} args.destinationSpreadsheetId - The ID of the spreadsheet to copy the sheet to.
 * @returns {Promise<Object>} - The properties of the newly created sheet.
 */
const executeFunction = async ({ spreadsheetId, sheetId, destinationSpreadsheetId }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken = ''; // will be provided by the user
  const url = `${baseUrl}/v4/spreadsheets/${spreadsheetId}/sheets/${sheetId}:copyTo`;

  const body = {
    destinationSpreadsheetId
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error copying the sheet:', error);
    return {
      error: `An error occurred while copying the sheet: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for copying a sheet in Google Sheets.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
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

export { apiTool };