const API_URL = import.meta.env.VITE_API_URL;

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join(". "));
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está configurada.");
  }

  const response = await fetch(`${API_URL.replace(/\/$/, "")}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body: ApiErrorResponse | null = await response
      .json()
      .catch(() => null);

    const messages = body?.message
      ? Array.isArray(body.message)
        ? body.message
        : [body.message]
      : [`Error HTTP ${response.status}`];

    throw new ApiError(response.status, messages);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function apiGet<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  return request<T>(endpoint, {
    method: "GET",
    signal,
  });
}

export function apiPost<T, D>(endpoint: string, data: D): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
