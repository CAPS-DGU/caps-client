import React, { useState, useEffect } from "react";
import BoardList from "../components/BoardList/List";
import Search from "../components/BoardList/Search";
import { board_categories } from "../constants/Board";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BoardPageProps } from "../types/pages";

const board_list = [
  "전체 게시판",
  "자유 게시판",
  "공모전 및 대회",
  "건의사항",
  "장부",
  "회의록",
  "(구)게시판",
];

const BoardPage: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { board_id } = useParams<{ board_id: string }>();

  const [posts, setPosts] = useState<BoardPageProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/board?category=${board_id}&page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
          }
        );
        console.log(response.data);
        setPosts(response.data.data);
        setTotalPages(response.data.data[0]?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };
    if (page >= 0) {
      fetchData();
    }
  }, [page, board_id]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="m-4 text-2xl text-center text-gray-500">
          {board_id ? board_categories[board_id] : board_categories[0]}
        </h1>
        <BoardList posts={posts} />
        <Search />
      </div>
    </div>
  );
};

export default BoardPage;
