import { GoogleAuth } from 'google-auth-library';

/**
 * Function to create a new spreadsheet using the Google Sheets API.
 *
 * @param {Object} args - Arguments for creating the spreadsheet.
 * @param {string} args.title - The title of the spreadsheet.
 * @param {Object} [args.properties] - Additional properties for the spreadsheet.
 * @returns {Promise<Object>} - The result of the spreadsheet creation.
 */
const execute = async ({ title, properties }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  const requestBody = {
    properties: {
      title: title,
      ...properties
    }
  };

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    const response = await client.request({
      url: `${baseUrl}/v4/spreadsheets`,
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    return response.data;
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for creating a new spreadsheet using the Google Sheets API.
 * @type {Object}
 */
const apiTool = {
  function: execute,
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

export { apiTool, execute };