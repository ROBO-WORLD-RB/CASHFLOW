import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 500);
    this.name = 'NetworkError';
  }
}

export function handleError(error: unknown, context?: string): void {
  console.error(`Error in ${context || 'application'}:`, error);

  if (error instanceof ValidationError) {
    toast.error(`Validation Error: ${error.message}`);
  } else if (error instanceof AuthError) {
    toast.error(`Authentication Error: ${error.message}`);
  } else if (error instanceof NetworkError) {
    toast.error(`Network Error: ${error.message}`);
  } else if (error instanceof AppError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(`Unexpected error: ${error.message}`);
  } else {
    toast.error('An unexpected error occurred');
  }
}

export function createErrorHandler(context: string) {
  return (error: unknown) => handleError(error, context);
}

// Async error wrapper
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

// Form error helper
export function getFieldError(errors: Record<string, any>, fieldName: string): string | undefined {
  const error = errors[fieldName];
  return error?.message || error;
}

// API response helper
export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string,
  error?: string
) {
  return {
    data,
    success,
    message,
    error
  };
}

// Retry mechanism
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i === maxRetries - 1) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError!;
}