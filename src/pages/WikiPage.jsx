import React, { useState, useEffect } from 'react';
import Template from '../components/WIKI/template';
import WikiSearch from '../components/WIKI/WikiSearch';
import { useParams, Outlet } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from '../components/LoadingSpinner';
import WikiRecent from '../components/WIKI/WikiRecent';


const IntroducePage = () => {
  const { wiki_title } = useParams();

  const NotFoundData = {
    "title": wiki_title,
    "content": `<div>해당 문서가 없습니다.</div> <a class="text-blue-500 hover:underline" href='/wiki/edit/${wiki_title}'>새 문서 만들기</a>`
  };

  const [wikiData, setWikiData] = useState(null);  // For fetched data
  const [error, setError] = useState(null);        // For error handling
  const [loading, setLoading] = useState(true);    // For loading state
  // let template =  <Template data={wikiData} />
  useEffect(() => {
    const fetchData = async (title) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/v1/wikis/${title}`);
        if (response.status === 200) {
          setWikiData(response.data.data); // Set the fetched data
          setError(null);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);  // Stop loading after fetching data
      }
    };
    if (wiki_title) {
      fetchData(wiki_title);  // Fetch only if wiki_title is present
    } else {
      fetchData("대문");
    }
  }, [wiki_title]);
  if (loading) return <LoadingSpinner />;  // Show loading state
  console.log(error);
  return (

    <div>
      <WikiSearch></WikiSearch>
      <WikiRecent />
      {wikiData && !error ? <Template data={wikiData} /> : <Template data={NotFoundData} notFoundFlag={true} />}
    </div >
  );
};

export default IntroducePage;
