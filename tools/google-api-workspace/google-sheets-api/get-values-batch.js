/**
 * Function to get values from a Google Sheets spreadsheet.
 *
 * @param {Object} args - Arguments for the batch get request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {Array<string>} args.ranges - The ranges of cells to retrieve values from.
 * @param {string} [args.majorDimension] - The major dimension of the values returned (ROWS or COLUMNS).
 * @param {string} [args.valueRenderOption] - How to render the values (e.g., USER_ENTERED, FORMATTED_VALUE).
 * @param {string} [args.dateTimeRenderOption] - How to render date and time values.
 * @returns {Promise<Object>} - The result of the batch get request.
 */
const executeFunction = async ({ spreadsheetId, ranges, majorDimension, valueRenderOption, dateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken = ''; // will be provided by the user

  try {
    // Construct the URL with the spreadsheet ID and query parameters
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values:batchGet`);
    if (ranges) url.searchParams.append('ranges', ranges.join(','));
    if (majorDimension) url.searchParams.append('majorDimension', majorDimension);
    if (valueRenderOption) url.searchParams.append('valueRenderOption', valueRenderOption);
    if (dateTimeRenderOption) url.searchParams.append('dateTimeRenderOption', dateTimeRenderOption);

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
    console.error('Error getting values from spreadsheet:', error);
    return {
      error: `An error occurred while getting values: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting values from a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_values_batch',
      description: 'Retrieve values from a Google Sheets spreadsheet.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          ranges: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The ranges of cells to retrieve values from.'
          },
          majorDimension: {
            type: 'string',
            enum: ['ROWS', 'COLUMNS'],
            description: 'The major dimension of the values returned.'
          },
          valueRenderOption: {
            type: 'string',
            description: 'How to render the values.'
          },
          dateTimeRenderOption: {
            type: 'string',
            description: 'How to render date and time values.'
          }
        },
        required: ['spreadsheetId', 'ranges']
      }
    }
  }
};

export { apiTool };