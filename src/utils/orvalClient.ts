import axios from "axios";

type HeadersInit = RequestInit["headers"];

const normalizeHeaders = (headers: HeadersInit): Record<string, string> => {
  if (!headers) {
    return {};
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
};

// Orval mutator (generated code calls: orvalClient(url, requestInit))
export const orvalClient = async <T = unknown>(
  url: string,
  init?: RequestInit
): Promise<T> => {
  // body가 Blob이 아닌 경우 JSON.stringify 처리
  let body = init?.body;
  const headers = normalizeHeaders(init?.headers);
  
  // Content-Type이 application/json이고 body가 Blob이 아닌 경우
  if (
    headers["Content-Type"]?.includes("application/json") &&
    !(body instanceof Blob) &&
    body !== undefined &&
    body !== null
  ) {
    // 이미 문자열이면 그대로 사용, 아니면 JSON.stringify
    body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await axios.request({
    baseURL: (import.meta as any).env.VITE_API_HOST,
    url,
    method: (init?.method ?? "GET") as any,
    headers: {
      Accept: "*/*",
      ...headers,
    },
    data: body,
    withCredentials: true,
    signal: init?.signal ?? undefined,
  });

  return response.data as T;
};


    