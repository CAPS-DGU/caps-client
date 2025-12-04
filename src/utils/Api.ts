import axios, { AxiosResponse } from "axios";

export async function apiGetWithToken(path, navigate) {
  return await apiWithToken("get", path, null, navigate);
}

export async function apiPostWithToken(path, data, navigate) {
  return await apiWithToken("post", path, data, navigate);
}

export async function apiPatchWithToken(path, data, navigate) {
  return await apiWithToken("patch", path, data, navigate);
}

export async function apiDeleteWithToken(path, navigate) {
  return await apiWithToken("delete", path, null, navigate);
}

export async function apiWithToken(
  method,
  path,
  data,
  navigate
): Promise<AxiosResponse> {
  try {
    const response = await axios({
      method: method,
      url: `${(import.meta as any).env.VITE_API_HOST}${path}`,
      data: data,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    return response;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
}
