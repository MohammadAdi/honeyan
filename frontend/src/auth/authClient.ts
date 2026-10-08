import type {AccessTokenResponse, AuthUser, ProblemDetails} from './types';

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
let accessToken: string | null = null;
let refreshPromise: Promise<AccessTokenResponse> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function readCookie(name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  const value = document.cookie.split('; ').find((cookie) => cookie.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : null;
}

async function parseError(response: Response): Promise<ApiError> {
  const problem = await response.json().catch(() => null) as ProblemDetails | null;
  return new ApiError(problem?.detail ?? 'Request failed. Please try again.', response.status);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function csrfHeaders(): HeadersInit {
  const csrfToken = readCookie('honeyan.csrf');
  return csrfToken ? {'X-CSRF-TOKEN': csrfToken} : {};
}

export async function login(email: string, password: string): Promise<AccessTokenResponse> {
  const result = await request<AccessTokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  });
  accessToken = result.accessToken;
  return result;
}

export async function refresh(): Promise<AccessTokenResponse> {
  if (!refreshPromise) {
    refreshPromise = request<AccessTokenResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      headers: csrfHeaders(),
    }).then((result) => {
      accessToken = result.accessToken;
      return result;
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function getCurrentUser(): Promise<AuthUser> {
  try {
    return await request<AuthUser>('/api/v1/auth/me');
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    await refresh();
    return request<AuthUser>('/api/v1/auth/me');
  }
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/api/v1/auth/logout', {
      method: 'POST',
      headers: csrfHeaders(),
    });
  } finally {
    accessToken = null;
  }
}

export function clearAccessToken(): void {
  accessToken = null;
}
