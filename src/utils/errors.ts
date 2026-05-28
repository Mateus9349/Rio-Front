interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponse;
    const message = apiError.response?.data?.message ?? apiError.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  return (error as ApiErrorResponse).response?.status;
}

export function toError(error: unknown, fallback: string): Error {
  return error instanceof Error ? error : new Error(getErrorMessage(error, fallback));
}
