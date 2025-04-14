import React, { useState, useCallback } from "react";
import { Input, List, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useWiki } from "../../hooks/useWiki";
import { toRelativeTime } from "../../utils/Time";
import { WikiData } from "../../types/wiki";

interface SearchResult extends WikiData {
  title: string;
  time: string;
}

const WikiSearch: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const { handleSearch, searchParams, loading } = useWiki();

  const handleSearchSubmit = useCallback(
    async (value: string) => {
      setKeyword(value);
      const results = await handleSearch(value);
      setSearchResults(results as SearchResult[]);
    },
    [handleSearch]
  );

  return (
    <div className="wiki-search">
      <Input.Search
        placeholder="위키 검색..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearchSubmit}
        className="mb-4"
      />
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <List
          dataSource={searchResults}
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
      )}
    </div>
  );
};

export default WikiSearch;
