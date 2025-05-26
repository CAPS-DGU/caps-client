import axios from 'axios';


export async function apiGetWithToken(path, navigate) {
  return await apiWithToken('get', path, null, navigate);

}


export async function apiPostWithToken(path, data, navigate) {
  return await apiWithToken('post', path, data, navigate);
}


export async function apiWithToken(method, path, data, navigate) {
  try {
    const response = await axios({
      method: method,
      url: `${import.meta.env.VITE_API_HOST}${path}`,
      data: data,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      }
    });

    return response;

  } catch (error) {
    if (error.response && error.response.status === 403) {
      const renewalResponse = await axios.post('/api/token/renewal',
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
        }
      );

      if (renewalResponse.data.data === null) {
        alert(
          "장시간 활동이 없어 자동으로 로그아웃되었습니다. 계속하시려면 다시 로그인해 주세요."
        );
        localStorage.clear();
        navigate('/login');
        return;
      }

      return await axios({
        method: method,
        url: path,
        data: data,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        }
      });
    }
  }
}
