/**
 * Function to get a Google Sheet by its ID.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to retrieve.
 * @param {string} [args.ranges] - The ranges of cells to retrieve.
 * @param {boolean} [args.includeGridData=false] - Whether to include grid data in the response.
 * @param {string} [args.accessToken] - The OAuth 2.0 access token.
 * @returns {Promise<Object>} - The response data from the Google Sheets API.
 */
const executeFunction = async ({ spreadsheetId, ranges, includeGridData = false }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken =  process.env.GOOGLE_API_WORKSPACE_API_KEY; // will be provided by the user
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}`);
    if (ranges) {
      url.searchParams.append('ranges', ranges);
    }
    url.searchParams.append('includeGridData', includeGridData.toString());
    if (accessToken) {
      url.searchParams.append('access_token', accessToken);
    }

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
    console.error('Error retrieving the spreadsheet:', error);
    return {
      error: `An error occurred while retrieving the spreadsheet: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving a Google Sheet.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
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
          },
          accessToken: {
            type: 'string',
            description: 'The OAuth 2.0 access token.'
          }
        },
        required: ['spreadsheetId']
      }
    }
  }
};

export { apiTool };