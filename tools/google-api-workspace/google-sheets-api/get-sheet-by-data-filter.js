/**
 * Function to get a sheet by data filter from Google Sheets.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.spreadsheetId - The ID of the spreadsheet to operate on.
 * @param {Array} args.dataFilters - An array of data filters to apply.
 * @param {boolean} [args.includeGridData=true] - Whether to include grid data in the response.
 * @returns {Promise<Object>} - The result of the request to get the sheet by data filter.
 */
const executeFunction = async ({ spreadsheetId, dataFilters, includeGridData = true }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const token = process.env.GOOGLE_API_WORKSPACE_API_KEY;

  try {
    // Construct the request body
    const body = JSON.stringify({
      dataFilters,
      includeGridData
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(`${baseUrl}/v4/spreadsheets/${spreadsheetId}:getByDataFilter`, {
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
    console.error('Error getting sheet by data filter:', error);
    return {
      error: `An error occurred while getting the sheet by data filter: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting a sheet by data filter from Google Sheets.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_sheet_by_data_filter',
      description: 'Get a sheet by data filter from Google Sheets.',
      parameters: {
        type: 'object',
        properties: {
          spreadsheetId: {
            type: 'string',
            description: 'The ID of the spreadsheet to operate on.'
          },
          dataFilters: {
            type: 'array',
            description: 'An array of data filters to apply.'
          },
          includeGridData: {
            type: 'boolean',
            description: 'Whether to include grid data in the response.'
          }
        },
        required: ['spreadsheetId', 'dataFilters']
      }
    }
  }
};

export { apiTool };