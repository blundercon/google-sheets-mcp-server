/**
 * Function to update values in a Google Sheets spreadsheet by data filter.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {string} args.range - The range of cells to update.
 * @param {string} [args.valueInputOption='USER_ENTERED'] - Determines how input data should be interpreted.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ spreadsheetId, range, valueInputOption = 'USER_ENTERED' }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken = ''; // will be provided by the user
  const url = `${baseUrl}/v4/spreadsheets/${spreadsheetId}/values:batchUpdateByDataFilter`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const body = JSON.stringify({
    data: [
      {
        range: range,
        values: [] // This should be populated with the actual values to update
      }
    ],
    valueInputOption: valueInputOption
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
    return {
      error: `An error occurred while updating the spreadsheet: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for updating values in a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_spreadsheet_values',
      description: 'Update values in a Google Sheets spreadsheet by data filter.',
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
          }
        },
        required: ['spreadsheetId', 'range']
      }
    }
  }
};

export { apiTool };