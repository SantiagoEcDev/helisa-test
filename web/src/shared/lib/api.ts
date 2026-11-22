const API_URL = import.meta.env.VITE_API_URL;

export async function apiGet<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error al consultar la API: ${response.status}`);
  }

  return (await response.json()) as T;
}
