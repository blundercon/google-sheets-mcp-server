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
const executeFunction = async ({ spreadsheetId, range, majorDimension, valueRenderOption, dateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken =  process.env.GOOGLE_API_WORKSPACE_API_KEY; // will be provided by the user
  try {
    // Construct the URL with path and query parameters
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}`);
    if (majorDimension) url.searchParams.append('majorDimension', majorDimension);
    if (valueRenderOption) url.searchParams.append('valueRenderOption', valueRenderOption);
    if (dateTimeRenderOption) url.searchParams.append('dateTimeRenderOption', dateTimeRenderOption);
    if (accessToken) url.searchParams.append('access_token', accessToken);

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
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
    console.error('Error retrieving values from spreadsheet:', error);
    return {
      error: `An error occurred while retrieving values: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving values from a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
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

export { apiTool };