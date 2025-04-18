import React, { useState, useEffect } from 'react';
import Template from '../components/WIKI/template';
import WikiSearch from '../components/WIKI/WikiSearch';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiGetWithToken } from '../utils/Api';
import { useNavigate } from 'react-router-dom';


const WikiHistoryPage = () => {
  const { wiki_title } = useParams();
  const navigate = useNavigate();
  const [wikiData, setWikiData] = useState(null);  // For fetched data
  const [error, setError] = useState(null);        // For error handling
  const [loading, setLoading] = useState(true);    // For loading state

  // let template =  <Template data={wikiData} />
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetWithToken(`/api/wiki/history?title=${wiki_title}`, navigate);
        console.log(response.status);
        if (response.status === 200) {
          setWikiData(response.data.data); // Set the fetched data
          setError(null);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);  // Stop loading after fetching data
      }
    };
    if (wiki_title) {
      fetchData();  // Fetch only if wiki_title is present
    } else {
      // If no title, show intro data
      setWikiData(wikiIntroData);
      setLoading(false);  // Stop loading
    }
  }, [wiki_title]);
  if (loading) return <LoadingSpinner />;  // Show loading state
  const handleRedirect = () => {
    alert("잘못된 접근입니다.");
    window.location.href = '/wiki';  // 리다이렉트
  };
  // console.log(wikiData);
  return (

    <div>
      <WikiSearch></WikiSearch>

      {wikiData && !error ? (wikiData.map((wiki, index) => {
        return (
          <div key={index}>
            {index < wikiData.length - 1 &&
              <Template key={index} data={wiki} notFoundFlag={true} history={wiki.time} prevData={wikiData[index + 1]} />
            }
          </div>)
      })) : (handleRedirect())}
    </div >
  );
};

export default WikiHistoryPage;
