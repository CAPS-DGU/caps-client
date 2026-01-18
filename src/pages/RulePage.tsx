import React, { useState, useEffect } from "react";
import Template from "../components/WIKI/template";
import { useParams } from "react-router-dom";
import axios from "axios";
import { WikiData } from "../types/pages";

const wikiIntroData: WikiData = {
  title: "CAPS 규칙",
  content: `[[CAPS 위키]]의 규칙 페이지입니다.
CAPS 회원이라면 반드시 숙지해야 할 규칙들이 있습니다.

<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl">||[[회원 규칙]] || CAPS 회원으로서 지켜야 할 규칙들입니다.</div>
<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl">||[[위키 규칙]] || CAPS 위키를 사용할 때 지켜야 할 규칙들입니다.</div>
<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl">||[[스터디 규칙]] || CAPS 스터디를 진행할 때 지켜야 할 규칙들입니다.</div>
`,
};

const RulePage: React.FC = () => {
  const { wiki_title } = useParams<{ wiki_title: string }>();

  const NotFoundData: WikiData = {
    title: wiki_title || "",
    content: `<div>해당 문서가 없습니다.</div> <a class="text-blue-500 hover:underline" href='/wiki/edit/${wiki_title}'>새 문서 만들기</a>`,
  };

  const [wikiData, setWikiData] = useState<WikiData | null>(null); // For fetched data
  const [error, setError] = useState<string | null>(null); // For error handling
  const [loading, setLoading] = useState<boolean>(true); // For loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: WikiData }>(
          `/api/v1/wikis/CAPS%20회칙`
        );
        if (response.status === 200) {
          setWikiData(response.data.data); // Set the fetched data
          setError(null);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };
    fetchData();
    // If no title, show intro data
    setWikiData(wikiIntroData);
    setLoading(false); // Stop loading
  }, [wiki_title]);

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <Template data={wikiData} />
    </div>
  );
};

export default RulePage;
