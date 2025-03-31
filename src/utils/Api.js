import axios from 'axios';


export async function apiGetWithToken(path, navigate) {
  return await apiWithToken('get', path, null, navigate);

}


export async function apiPostWithToken(path, data, navigate) {
  return await apiWithToken('post', path, data, navigate);
}


export async function apiWithToken(method, path, data, navigate) {
  let oldAccessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios({
      method: method,
      url: path,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + oldAccessToken
      }
    });

    return response;

  } catch (error) {
    if (error.response && error.response.status === 403) {
      const renewalResponse = await axios.post('/api/token/renewal',
        {
          refreshToken: localStorage.getItem('refreshToken')
        },
        {
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

      let { accessToken, refreshToken } = renewalResponse.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return await axios({
        method: method,
        url: path,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + accessToken
        }
      });
    }
  }
}
