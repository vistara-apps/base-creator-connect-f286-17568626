/**
 * Error handling utilities for Base Creator Connect
 * 
 * This file contains utility functions for error handling and logging.
 */

// Error types
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  TRANSACTION = 'transaction',
  API = 'api',
  VALIDATION = 'validation',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
}

// Create error
export const createError = (
  type: ErrorType,
  message: string,
  code?: string,
  details?: any
): AppError => ({
  type,
  message,
  code,
  details
});

// Log error
export const logError = (error: AppError | Error | unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', error);
  } else {
    // In production, we could send errors to a monitoring service
    // like Sentry, LogRocket, etc.
    console.error('[ERROR]', error instanceof Error ? error.message : error);
  }
};

// Handle API error
export const handleApiError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return createError(
      ErrorType.API,
      error.message,
      'api_error',
      { stack: error.stack }
    );
  }
  
  return createError(
    ErrorType.UNKNOWN,
    'An unknown error occurred',
    'unknown_error',
    { error }
  );
};

// Handle database error
export const handleDatabaseError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return createError(
      ErrorType.DATABASE,
      error.message,
      'database_error',
      { stack: error.stack }
    );
  }
  
  return createError(
    ErrorType.DATABASE,
    'A database error occurred',
    'database_error',
    { error }
  );
};

// Handle transaction error
export const handleTransactionError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return createError(
      ErrorType.TRANSACTION,
      error.message,
      'transaction_error',
      { stack: error.stack }
    );
  }
  
  return createError(
    ErrorType.TRANSACTION,
    'A transaction error occurred',
    'transaction_error',
    { error }
  );
};

// Validation error
export const validationError = (message: string, details?: any): AppError => {
  return createError(
    ErrorType.VALIDATION,
    message,
    'validation_error',
    details
  );
};

// Authentication error
export const authenticationError = (message: string = 'Authentication required'): AppError => {
  return createError(
    ErrorType.AUTHENTICATION,
    message,
    'authentication_error'
  );
};

// Network error
export const networkError = (message: string = 'Network error'): AppError => {
  return createError(
    ErrorType.NETWORK,
    message,
    'network_error'
  );
};

