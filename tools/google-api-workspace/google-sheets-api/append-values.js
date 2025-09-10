import { GoogleAuth } from 'google-auth-library';

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
const execute = async ({ spreadsheetId, range, valueInputOption, values, insertDataOption, includeValuesInResponse, responseValueRenderOption, responseDateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();

    // Construct the URL for the append request
    const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}:append`);
    url.searchParams.append('valueInputOption', valueInputOption);
    if (insertDataOption) url.searchParams.append('insertDataOption', insertDataOption);
    if (includeValuesInResponse) url.searchParams.append('includeValuesInResponse', includeValuesInResponse);
    if (responseValueRenderOption) url.search_params.append('responseValueRenderOption', responseValueRenderOption);
    if (responseDateTimeRenderOption) url.search_params.append('responseDateTimeRenderOption', responseDateTimeRenderOption);

    // Perform the fetch request
    const response = await client.request({
      url: url.toString(),
      method: 'POST',
      body: JSON.stringify({ values })
    });

    // Parse and return the response data
    return response.data;
  } catch (error) {
    console.error('Error appending values to spreadsheet:', error);
    throw error;
  }
};

/**
 * Tool configuration for appending values to a Google Sheets spreadsheet.
 * @type {Object}
 */
const apiTool = {
  function: execute,
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

export { apiTool, execute };