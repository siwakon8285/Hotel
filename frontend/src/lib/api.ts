export type APIError = {
  code: string;
  message: string;
};

export type APIResponse<T> = {
  data?: T;
  error?: APIError;
};

export class APIException extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "APIException";
  }
}

/**
 * Centrally manages the API URL.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

/**
 * A reusable wrapper around fetch that standardizes error handling.
 */
export async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const json = (await response.json()) as APIResponse<T>;

    if (!response.ok) {
      if (json.error) {
        throw new APIException(json.error.code, json.error.message);
      }
      throw new APIException("UNKNOWN_ERROR", `HTTP error ${response.status}`);
    }

    if (json.error) {
      throw new APIException(json.error.code, json.error.message);
    }

    if (json.data === undefined) {
      throw new APIException("INVALID_FORMAT", "API response missing data field");
    }

    return json.data;
  } catch (err) {
    if (err instanceof APIException) {
      throw err;
    }
    // Network errors or JSON parsing errors
    throw new APIException("NETWORK_ERROR", err instanceof Error ? err.message : "Failed to connect to API");
  }
}
