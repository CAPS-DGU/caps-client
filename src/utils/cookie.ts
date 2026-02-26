/**
 * 쿠키에서 특정 이름의 쿠키 값을 가져옵니다.
 * @param name - 가져올 쿠키의 이름
 * @returns 쿠키 값 또는 null
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * 쿠키에서 accessToken을 가져옵니다.
 * @returns accessToken 또는 null
 */
export function getAccessToken(): string | null {
  return getCookie("accessToken");
}
