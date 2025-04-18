import React, { useEffect } from 'react';
import WikiEditor from '../components/WIKI/WikiEditor';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { apiPostWithToken } from '../utils/Api';
import { useNavigate } from 'react-router-dom';

const wikiData = {
  "title": "CAPS",
  "content": `
==개요==
[[동국대학교]] 학술 중앙 동아리.
[[동아리 방]] 위치는 동국대학교 [[원흥관]] E265.

현재 신입생은 [[38기]]로 동아리는 1988년에 처음으로 창설되었다. 지도 교수는 [[컴퓨터공학과]] [[김준태]] 교수님이다.

==이름과 호칭==
C.A.P.S. Computer Aided Progressive Study의 약자.
읽을 때는 캡스라고 한다.

==목적==
컴퓨터 관련 학술 교류 및 [[스터디]]와 친목 도모.

==활동==
매 학기 [[개강총회]], [[종강총회]]가 있으며 전체 회의를 이때 진행하게된다.
또한 [[스터디]]를 진행하며 1학기마다 진행되는 [[C언어]] 스터디는 신입생들이 주로 듣는다.
코시국을 고려해서 '[[N학년은처음이라]]'라고 선배님들께 궁금한 점을 실명이나 익명으로 질문하는 행사를 한다.
[[집부]][[세미나]]는 매해 개최하며 추가로 [[졸업생]]분들의 [[세미나]]가 이루어지기도 한다.
매 학기 친목을 다질 수 있는 [[게임대회]]를 진행하고 2학기 말에 상당한 상품이 걸려있는 [[알고리즘대회]]도 한다.
[[MT]]는 한해 약 3-4회 정도 간다.
또한, [[캡스인의 밤]]이라는 행사가 있는데 매년 초에 선배님들과 같이 술과 대화를 하는 시간이다.
1년에 한번 [[소프트웨어 전시회]]를 진행하며 신입생 유치를 위해 3월에 진행한다.

==회원==
회원은 동아리 전체를 관리하는 [[집행부]], [[정회원]], [[명예회원]]으로 크게 나눌 수 있다.
    `
};
const WikiEditPage = () => {
  const { wiki_title } = useParams();
  const [content, setContent] = useState({ "title": wiki_title, "content": "" });
  const [Error, setError] = useState(null);
  const [loading, setLoading] = useState(true);    // For loading state
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/wiki?title=${wiki_title}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Bearer ' + accessToken
          }
        });
        console.log(response);


        if (response.status === 200) {
          setContent({ "title": wiki_title, "content": response.data.data.content });
          setError(null);
          console.log(content);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (wiki_title) {
      fetchData();  // 여기서 함수 호출이 된다
    } else {
      setContent({ "title": wiki_title, "content": response.data.data })
      setLoading(false);
    }
  }, [wiki_title]);  // useEffect에 의존성을 추가해서, wiki_title이 변경될 때마다 실행되게 만든다.

  console.log(content);
  if (loading) return <div>Loading...</div>;  // Show loading state

  // 저장 함수
  const handleSave = async (newContent) => {
    setContent({ "title": content.title, "content": newContent });
    console.log(content);

    try {
      const response = await apiPostWithToken(`/api/wiki`, { "title": content.title, "content": newContent }, navigate);

      console.log(response.status);
      if (response.status === 201) {

        alert("내용이 저장되었습니다.");
        window.location.href = `/wiki/${wiki_title}`;
      }
    }
    catch (e) {
      // console.log(e);
      alert('잘못된 접근입니다.');
      window.location.href = '/wiki/' + content.title;
    }
  };

  return (
    <div>
      <h1 className="m-6 text-3xl font-bold text-center text-gray-800">{content.title} 수정하기</h1>

      <WikiEditor initialContent={content} onSave={handleSave} />
    </div>
  );
};

export default WikiEditPage;
