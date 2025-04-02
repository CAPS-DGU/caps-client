import React from "react";
import { List, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toRelativeTime } from "../../utils/Time";
import { WikiData } from "../../types/wiki";

const WikiRecent: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentWikis, isLoading } = useQuery<WikiData[]>({
    queryKey: ["recent-wikis"],
    queryFn: async () => {
      const response = await axios.get("/api/wiki/recent");
      return response.data || [];
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
      <h3 className="text-lg font-semibold mb-4">최근 수정된 문서</h3>
      <List
        dataSource={Array.isArray(recentWikis) ? recentWikis : []}
        renderItem={(item) => (
          <List.Item
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/wiki/${item.title}`)}
          >
            <List.Item.Meta
              title={item.title}
              description={`최근 수정: ${toRelativeTime(item.time)}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default WikiRecent;
