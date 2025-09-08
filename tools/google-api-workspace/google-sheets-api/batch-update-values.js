/**
 * Function to batch update values in a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for the batch update.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {Array} args.valueRanges - An array of value ranges to update.
 * @param {string} [args.valueInputOption='USER_ENTERED'] - Determines how input data should be interpreted.
 * @returns {Promise<Object>} - The result of the batch update operation.
 */
const executeFunction = async ({ spreadsheetId, valueRanges, valueInputOption = 'USER_ENTERED' }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken = ''; // will be provided by the user
  try {
    // Construct the URL for the batch update
    const url = `${baseUrl}/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Create the request body
    const body = JSON.stringify({
      valueInputOption,
      data: valueRanges
    });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error batch updating values:', error);
    return {
      error: `An error occurred while batch updating values: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for batch updating values in Google Sheets.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'batch_update_values',
      description: 'Batch update values in a Google Sheets spreadsheet.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          valueRanges: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                range: {
                  type: 'string',
                  description: 'The range of cells to update.'
                },
                values: {
                  type: 'array',
                  items: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  description: 'The values to set in the specified range.'
                }
              },
              required: ['range', 'values']
            },
            description: 'An array of value ranges to update.'
          },
          valueInputOption: {
            type: 'string',
            enum: ['USER_ENTERED', 'RAW'],
            description: 'Determines how input data should be interpreted.'
          }
        },
        required: ['spreadsheetId', 'valueRanges']
      }
    }
  }
};

export { apiTool };