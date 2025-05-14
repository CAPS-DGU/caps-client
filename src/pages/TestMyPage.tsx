import { useEffect } from 'react';
import axios from 'axios';

export default function TestMyPage() {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          '/api/api/v1/members/me',
          { withCredentials: true }
        )
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert("잘못된 접근입니다.");
      }
    }
    fetchUserData();
  }, [])
  return <>
    <div>안녕</div>
  </>
}
