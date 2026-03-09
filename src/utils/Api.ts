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

// 토큰 없는 공개 API 호출 함수들
export async function apiGet(path) {
  return await apiWithoutToken("get", path, null);
}

export async function apiPost(path, data) {
  return await apiWithoutToken("post", path, data);
}

export async function apiPatch(path, data) {
  return await apiWithoutToken("patch", path, data);
}

export async function apiDelete(path) {
  return await apiWithoutToken("delete", path, null);
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

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if ((status === 401 || status === 403) && navigate) {
        alert("접근할 수 없는 사용자입니다.");
        navigate("/");
      }
    }

    throw error;
  }
}

export async function apiWithoutToken(
  method,
  path,
  data
): Promise<AxiosResponse> {
  try {
    const response = await axios({
      method: method,
      url: `${(import.meta as any).env.VITE_API_HOST}${path}`,
      data: data,
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
