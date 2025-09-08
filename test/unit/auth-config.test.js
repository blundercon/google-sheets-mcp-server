import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthConfig } from '../../lib/auth/auth-config.js';

describe('AuthConfig', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('loadFromEnvironment', () => {
    it('should load valid configuration from environment variables', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');

      const config = AuthConfig.loadFromEnvironment();

      expect(config.serviceAccountEmail).toBe('test@test-project.iam.gserviceaccount.com');
      expect(config.privateKey).toBe('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----');
      expect(config.scopes).toEqual(['https://www.googleapis.com/auth/spreadsheets']);
      expect(config.tokenExpiryOffset).toBe(300);
      expect(config.maxRetries).toBe(3);
      expect(config.retryDelay).toBe(1000);
    });

    it('should throw error when service account email is missing', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('GOOGLE_SERVICE_ACCOUNT_EMAIL is required');
    });

    it('should throw error when private key is missing', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required');
    });

    it('should throw error when service account email format is invalid', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'invalid-email';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('Invalid service account email format');
    });

    it('should throw error when private key is not valid base64', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = 'invalid-base64!@#';

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('Invalid private key: must be base64 encoded');
    });

    it('should throw error when decoded private key is invalid format', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('invalid-key-content').toString('base64');

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('Invalid private key format: must start with -----BEGIN PRIVATE KEY-----');
    });

    it('should parse custom scopes from environment', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');
      process.env.GOOGLE_AUTH_SCOPES = 'https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive';

      const config = AuthConfig.loadFromEnvironment();

      expect(config.scopes).toEqual([
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]);
    });

    it('should parse numeric configuration values', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');
      process.env.GOOGLE_AUTH_TOKEN_EXPIRY_OFFSET = '600';
      process.env.GOOGLE_AUTH_MAX_RETRIES = '5';
      process.env.GOOGLE_AUTH_RETRY_DELAY = '2000';

      const config = AuthConfig.loadFromEnvironment();

      expect(config.tokenExpiryOffset).toBe(600);
      expect(config.maxRetries).toBe(5);
      expect(config.retryDelay).toBe(2000);
    });

    it('should validate numeric configuration ranges', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');
      process.env.GOOGLE_AUTH_TOKEN_EXPIRY_OFFSET = '4000';

      expect(() => AuthConfig.loadFromEnvironment()).toThrow('GOOGLE_AUTH_TOKEN_EXPIRY_OFFSET must be between 0 and 3600');
    });

    it('should set optional subject for impersonation', () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Buffer.from('-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').toString('base64');
      process.env.GOOGLE_AUTH_SUBJECT = 'user@example.com';

      const config = AuthConfig.loadFromEnvironment();

      expect(config.subject).toBe('user@example.com');
    });
  });

  describe('validate', () => {
    it('should return valid result for correct configuration', () => {
      const config = {
        serviceAccountEmail: 'test@test-project.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        tokenExpiryOffset: 300,
        maxRetries: 3,
        retryDelay: 1000
      };

      const result = AuthConfig.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return validation errors for invalid configuration', () => {
      const config = {
        serviceAccountEmail: 'invalid-email',
        privateKey: 'invalid-key',
        scopes: [],
        tokenExpiryOffset: -1,
        maxRetries: 15,
        retryDelay: 50
      };

      const result = AuthConfig.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid service account email format');
      expect(result.errors).toContain('Invalid private key format');
      expect(result.errors).toContain('Scopes must be a non-empty array');
      expect(result.errors).toContain('Token expiry offset must be between 0 and 3600');
      expect(result.errors).toContain('Max retries must be between 0 and 10');
      expect(result.errors).toContain('Retry delay must be between 100 and 10000');
    });
  });
});