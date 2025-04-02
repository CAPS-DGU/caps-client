import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { List, Spin } from "antd";
import { useWiki } from "../../hooks/useWiki";
import { toRelativeTime } from "../../utils/Time";

export const WikiHistory: React.FC = () => {
  const { wiki_title } = useParams<{ wiki_title: string }>();
  const navigate = useNavigate();
  const { historyData, loading } = useWiki(wiki_title);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spin />
      </div>
    );
  }

  if (!historyData || historyData.length === 0) {
    return <div>수정 내역이 없습니다.</div>;
  }

  return (
    <div className="wiki-history">
      <h2 className="mb-4 text-xl font-bold">수정 내역</h2>
      <List
        dataSource={historyData}
        renderItem={(item) => (
          <List.Item
            className="cursor-pointer hover:bg-gray-50"
            onClick={() =>
              navigate(`/wiki/compare/${wiki_title}/${item.version}`)
            }
          >
            <List.Item.Meta
              title={`버전 ${item.version}`}
              description={`${toRelativeTime(item.time)} - ${item.writer}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default WikiHistory;
