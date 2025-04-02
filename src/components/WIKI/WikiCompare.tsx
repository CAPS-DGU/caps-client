import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin } from "antd";
import ReactDiffViewer from "react-diff-viewer-continued";
import { useWiki } from "../../hooks/useWiki";
import { WikiHistoryData } from "../../types/wiki";
import useWindowDimensions from "../../hooks/useWindowDimensions";

export const WikiCompare: React.FC = () => {
  const { title, version } = useParams<{ title: string; version: string }>();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { wikiData, historyData, loading, historyLoading } = useWiki(title);

  const currentVersion = historyData?.find((h) => h.version === version);

  const handleBack = useCallback(() => {
    navigate(`/wiki/${title}`);
  }, [navigate, title]);

  if (loading || historyLoading || !wikiData || !currentVersion) {
    return (
      <div className="flex justify-center p-4">
        <Spin />
      </div>
    );
  }

  return (
    <div className="wiki-compare">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title} - 버전 비교</h1>
        <Button onClick={handleBack}>돌아가기</Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between p-4 rounded-md bg-gray-50">
          <div>
            <span className="font-medium">현재 버전:</span>
            <span className="ml-2 text-gray-600">
              {wikiData.writer} ({wikiData.time})
            </span>
          </div>
          <div>
            <span className="font-medium">선택한 버전:</span>
            <span className="ml-2 text-gray-600">
              {currentVersion.writer} ({currentVersion.time})
            </span>
          </div>
        </div>
      </div>

      <ReactDiffViewer
        oldValue={currentVersion.content}
        newValue={wikiData.content}
        splitView={width > 768}
        hideLineNumbers={width <= 768}
      />
    </div>
  );
};
