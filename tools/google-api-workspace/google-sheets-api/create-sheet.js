/**
 * Function to create a new spreadsheet using the Google Sheets API.
 *
 * @param {Object} args - Arguments for creating the spreadsheet.
 * @param {string} args.title - The title of the spreadsheet.
 * @param {Object} [args.properties] - Additional properties for the spreadsheet.
 * @returns {Promise<Object>} - The result of the spreadsheet creation.
 */
const executeFunction = async ({ title, properties }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken =  process.env.GOOGLE_API_WORKSPACE_API_KEY; // will be provided by the user
  const url = `${baseUrl}/v4/spreadsheets?access_token=${accessToken}`;
  
  const requestBody = {
    properties: {
      title: title,
      ...properties
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    return {
      error: `An error occurred while creating the spreadsheet: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for creating a new spreadsheet using the Google Sheets API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_spreadsheet',
      description: 'Create a new spreadsheet using the Google Sheets API.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the spreadsheet.'
          },
          properties: {
            type: 'object',
            description: 'Additional properties for the spreadsheet.'
          }
        },
        required: ['title']
      }
    }
  }
};

export { apiTool };