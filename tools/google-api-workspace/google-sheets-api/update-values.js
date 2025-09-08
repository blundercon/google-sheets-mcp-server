/**
 * Function to update values in a specified range of a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {string} args.range - The range of cells to update.
 * @param {string} args.valueInputOption - Determines how input data should be interpreted.
 * @param {boolean} [args.includeValuesInResponse=false] - Indicates whether to include values in the response.
 * @param {string} [args.responseValueRenderOption] - Selector specifying how to render values in the response.
 * @param {string} [args.responseDateTimeRenderOption] - Selector specifying how to render date/time values in the response.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ spreadsheetId, range, valueInputOption, includeValuesInResponse = false, responseValueRenderOption, responseDateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken =  process.env.GOOGLE_API_WORKSPACE_API_KEY; // will be provided by the user
  try {
    // Construct the URL with path variables
    const url = `${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${encodeURIComponent(valueInputOption)}&includeValuesInResponse=${includeValuesInResponse}&responseValueRenderOption=${encodeURIComponent(responseValueRenderOption || '')}&responseDateTimeRenderOption=${encodeURIComponent(responseDateTimeRenderOption || '')}&access_token=${accessToken}`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PUT',
      headers
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
    console.error('Error updating values:', error);
    return {
      error: `An error occurred while updating values: ${error instanceof Error ? error.message : JSON.stringify(error)}`
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
        required: ['spreadsheetId', 'range', 'valueInputOption']
      }
    }
  }
};

export { apiTool };