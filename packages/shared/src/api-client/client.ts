export interface ApiErrorDetails {
  status: number;
  code: string;
  message: string;
  requestId?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor({ status, code, message, requestId, details }: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isBrowser = typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined';
  const defaultBase = !isBrowser ? 'http://localhost:4000' : '';
  const baseUrl = (typeof globalThis !== 'undefined' && (globalThis as any).__API_BASE_URL__) || defaultBase;
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const requestId =
    (options.headers as Record<string, string>)?.[`X-Request-Id`] ||
    `req-${Math.random().toString(36).slice(2, 10)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': requestId,
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // httpOnly cookie sessions
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: err?.message || 'Network request failed',
      requestId,
    });
  }

  // Handle 401 with automatic token refresh attempt
  if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        isRefreshing = false;
        onRefreshed(refreshRes.ok);
        if (refreshRes.ok) {
          return request<T>(endpoint, options);
        }
      } catch {
        isRefreshing = false;
        onRefreshed(false);
      }
    } else {
      const success = await new Promise<boolean>((resolve) => {
        refreshSubscribers.push(resolve);
      });
      if (success) {
        return request<T>(endpoint, options);
      }
    }
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const body: any = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: body?.code || (response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : 'API_ERROR'),
      message: body?.message || response.statusText || 'Request failed',
      requestId: response.headers.get('x-request-id') || requestId,
      details: body?.details,
    });
  }

  return (body?.data !== undefined ? body.data : body) as T;
}
