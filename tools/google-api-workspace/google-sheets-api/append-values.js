/**
 * Function to append values to a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for appending values.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {string} args.range - The range of cells to append values to.
 * @param {string} args.valueInputOption - Determines how input data should be interpreted.
 * @param {Object} args.values - The values to append to the spreadsheet.
 * @param {string} [args.insertDataOption] - How the input data should be inserted.
 * @param {boolean} [args.includeValuesInResponse] - Whether to include the values in the response.
 * @param {string} [args.responseValueRenderOption] - How to render the values in the response.
 * @param {string} [args.responseDateTimeRenderOption] - How to render date/time values in the response.
 * @returns {Promise<Object>} - The result of the append operation.
 */
const executeFunction = async ({ spreadsheetId, range, valueInputOption, values, insertDataOption, includeValuesInResponse, responseValueRenderOption, responseDateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken =  process.env.GOOGLE_API_WORKSPACE_API_KEY; // will be provided by the user
  try {
    // Construct the URL for the append request
    const url = `${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=${valueInputOption}` +
                (insertDataOption ? `&insertDataOption=${insertDataOption}` : '') +
                (includeValuesInResponse ? `&includeValuesInResponse=${includeValuesInResponse}` : '') +
                (responseValueRenderOption ? `&responseValueRenderOption=${responseValueRenderOption}` : '') +
                (responseDateTimeRenderOption ? `&responseDateTimeRenderOption=${responseDateTimeRenderOption}` : '');

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
      body: JSON.stringify({ values })
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
    console.error('Error appending values to spreadsheet:', error);
    return {
      error: `An error occurred while appending values: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for appending values to a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'append_values',
      description: 'Append values to a Google Sheets spreadsheet.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          range: {
            type: 'string',
            description: 'The range of cells to append values to.'
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
            },
            description: 'The values to append to the spreadsheet.'
          },
          insertDataOption: {
            type: 'string',
            description: 'How the input data should be inserted.'
          },
          includeValuesInResponse: {
            type: 'boolean',
            description: 'Whether to include the values in the response.'
          },
          responseValueRenderOption: {
            type: 'string',
            description: 'How to render the values in the response.'
          },
          responseDateTimeRenderOption: {
            type: 'string',
            description: 'How to render date/time values in the response.'
          }
        },
        required: ['spreadsheetId', 'range', 'valueInputOption', 'values']
      }
    }
  }
};

export { apiTool };