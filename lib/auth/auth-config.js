/**
 * Configuration loader for Google Service Account authentication
 * Fully 12-factor compliant - configuration from environment only
 */
export class AuthConfig {
  /**
   * Load authentication configuration from environment variables
   * @returns {Object} Authentication configuration
   * @throws {Error} If configuration is invalid or missing
   */
  static loadFromEnvironment() {
    const config = {
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: this.decodePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
      scopes: this.parseScopes(process.env.GOOGLE_AUTH_SCOPES),
      subject: process.env.GOOGLE_AUTH_SUBJECT,
      tokenExpiryOffset: this.parseNumber(process.env.GOOGLE_AUTH_TOKEN_EXPIRY_OFFSET, 300, 0, 3600),
      maxRetries: this.parseNumber(process.env.GOOGLE_AUTH_MAX_RETRIES, 3, 0, 10),
      retryDelay: this.parseNumber(process.env.GOOGLE_AUTH_RETRY_DELAY, 1000, 100, 10000)
    };

    this.validateRequired(config);
    const validation = this.validate(config);
    
    if (!validation.valid) {
      throw new Error(validation.errors[0]);
    }

    return config;
  }

  /**
   * Validate required fields
   * @param {Object} config - Configuration to validate
   * @throws {Error} If required fields are missing
   */
  static validateRequired(config) {
    if (!config.serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is required');
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required');
    }
  }

  /**
   * Decode and validate private key from base64
   * @param {string} encodedKey - Base64 encoded private key
   * @returns {string} Decoded private key
   * @throws {Error} If key is invalid
   */
  static decodePrivateKey(encodedKey) {
    if (!encodedKey) {
      return null;
    }

    // Check if it's valid base64 format
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encodedKey)) {
      throw new Error('Invalid private key: must be base64 encoded');
    }

    let decodedKey;
    try {
      decodedKey = Buffer.from(encodedKey, 'base64').toString('utf-8');
    } catch (error) {
      throw new Error('Invalid private key: must be base64 encoded');
    }

    if (!decodedKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Invalid private key format: must start with -----BEGIN PRIVATE KEY-----');
    }

    return decodedKey;
  }

  /**
   * Parse scopes from environment variable
   * @param {string} scopesEnv - Comma-separated scopes
   * @returns {string[]} Array of scopes
   */
  static parseScopes(scopesEnv) {
    if (scopesEnv) {
      return scopesEnv.split(',').map(scope => scope.trim()).filter(Boolean);
    }
    return ['https://www.googleapis.com/auth/spreadsheets'];
  }

  /**
   * Parse and validate numeric configuration value
   * @param {string} value - Environment variable value
   * @param {number} defaultValue - Default value if not provided
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {number} Parsed and validated number
   * @throws {Error} If value is out of range
   */
  static parseNumber(value, defaultValue, min, max) {
    if (!value) {
      return defaultValue;
    }

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      return defaultValue;
    }

    if (parsed < min || parsed > max) {
      const envVar = this.getEnvVarName(defaultValue, min, max);
      throw new Error(`${envVar} must be between ${min} and ${max}`);
    }

    return parsed;
  }

  /**
   * Get environment variable name based on default value (helper for error messages)
   * @param {number} defaultValue - Default value to match against
   * @param {number} min - Min value
   * @param {number} max - Max value
   * @returns {string} Environment variable name
   */
  static getEnvVarName(defaultValue, min, max) {
    if (defaultValue === 300 && min === 0 && max === 3600) {
      return 'GOOGLE_AUTH_TOKEN_EXPIRY_OFFSET';
    }
    if (defaultValue === 3 && min === 0 && max === 10) {
      return 'GOOGLE_AUTH_MAX_RETRIES';
    }
    if (defaultValue === 1000 && min === 100 && max === 10000) {
      return 'GOOGLE_AUTH_RETRY_DELAY';
    }
    return 'Unknown environment variable';
  }

  /**
   * Validate configuration object
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  static validate(config) {
    const errors = [];

    // Validate email format
    if (config.serviceAccountEmail && !this.isValidServiceAccountEmail(config.serviceAccountEmail)) {
      errors.push('Invalid service account email format');
    }

    // Validate private key format
    if (config.privateKey && !config.privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      errors.push('Invalid private key format');
    }

    // Validate scopes
    if (!Array.isArray(config.scopes) || config.scopes.length === 0) {
      errors.push('Scopes must be a non-empty array');
    }

    // Validate numeric ranges
    if (config.tokenExpiryOffset < 0 || config.tokenExpiryOffset > 3600) {
      errors.push('Token expiry offset must be between 0 and 3600');
    }

    if (config.maxRetries < 0 || config.maxRetries > 10) {
      errors.push('Max retries must be between 0 and 10');
    }

    if (config.retryDelay < 100 || config.retryDelay > 10000) {
      errors.push('Retry delay must be between 100 and 10000');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is a valid service account email
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid service account email format
   */
  static isValidServiceAccountEmail(email) {
    return email && 
           email.includes('@') && 
           email.endsWith('.iam.gserviceaccount.com');
  }
}