import React from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WikiRecentData } from "../../types/wiki";

const WikiRecent: React.FC = () => {
  const { data: recentWikis, isLoading } = useQuery<WikiRecentData[]>({
    queryKey: ["recent-wikis"],
    queryFn: async () => {
      const response = await axios.get(
        import.meta.env.VITE_API_HOST + "/api/v1/wikis/recent",
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    },
  });

  return (
    <section className="wiki-recent" aria-labelledby="wiki-recent-title">
      <h2
        id="wiki-recent-title"
        className="text-lg font-semibold text-center mb-4"
      >
        최근 수정 내역
      </h2>
      <div className="flex flex-wrap justify-center gap-1.5 mt-0 max-w-lg mx-auto">
        {isLoading ? (
          <Spin />
        ) : Array.isArray(recentWikis) && recentWikis.length > 0 ? (
          recentWikis.map((wiki) => (
            <Link
              key={wiki.title}
              to={`/wiki/${wiki.title}`}
              className="bg-[#a7e9fb] px-[15px] py-[6px] m-[2px_4px] rounded-[20px] text-base"
            >
              {wiki.title}
            </Link>
          ))
        ) : (
          <p>최근 수정된 문서가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default WikiRecent;
