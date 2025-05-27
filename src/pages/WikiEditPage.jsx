import React, { useEffect } from 'react';
import WikiEditor from '../components/WIKI/WikiEditor';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetWithToken, apiPatchWithToken, apiPostWithToken } from '../utils/Api';
import { useNavigate } from 'react-router-dom';

const WikiEditPage = () => {
  const { wiki_title } = useParams();
  const [content, setContent] = useState({ "title": wiki_title, "content": "" });
  const [Error, setError] = useState(null);
  const [loading, setLoading] = useState(true);    // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetWithToken(`/api/v1/wikis/${wiki_title}`, navigate);
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
      fetchData();
    } else {
      setContent({ "title": wiki_title, "content": response.data.data })
      setLoading(false);
    }
  }, [wiki_title]);

  console.log(content);
  if (loading) return <div>Loading...</div>;  // Show loading state

  // 저장 함수
  const handleSave = async (newContent) => {
    setContent({ "title": content.title, "content": newContent });
    console.log(content);

    try {
      const response = await apiPatchWithToken(`/api/v1/wikis/${wiki_title}`, { "title": content.title, "content": newContent }, navigate);

      console.log(response.status);
      if (response.status === 200) {

        alert("내용이 저장되었습니다.");
        navigate(`/wiki/${wiki_title}`);
      }
    }
    catch (e) {
      // console.log(e);
      alert('잘못된 접근입니다.');
      navigate('/wiki/' + content.title);
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
