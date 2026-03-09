import React from "react";
import { List, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WikiRecentData } from "../../types/wiki";

const WikiRecent: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentWikis, isLoading } = useQuery<WikiRecentData[]>({
    queryKey: ["recent-wikis"],
    queryFn: async () => {
      const response = await axios.get(import.meta.env.VITE_API_HOST + "/api/v1/wikis/recent");
      return response.data.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="wiki-recent">
      <div className="flex flex-wrap justify-center gap-1.5 mt-0 max-w-lg mx-auto">

        {/* <h3 className="text-lg font-semibold mb-4">최근 수정된 문서</h3> */}
        {Array.isArray(recentWikis) ? (
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
          <p>최근 수정된 인물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default WikiRecent;
