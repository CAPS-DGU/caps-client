import React, { useState, useEffect } from "react";
import axios from "axios";
import { VoteData } from "../types/pages";

interface VoteChoice {
  id: number;
  text: string;
  votes: number;
}

interface Vote {
  id: number;
  title: string;
  description: string;
  choices: VoteChoice[];
  totalVotes: number;
  hasVoted: boolean;
}

const VotePage: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<Vote[]>("/api/vote", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVotes(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message || "투표 목록을 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  const handleVote = async (voteId: number, choiceId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await axios.post<VoteData>(
        "/api/vote",
        {
          voteId,
          choiceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // 투표 목록 다시 불러오기
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "투표에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">투표</h1>

        <div className="space-y-4">
          {votes.map((vote) => (
            <div key={vote.id} className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-2 text-xl font-semibold">{vote.title}</h2>
              <p className="mb-4 text-gray-600">{vote.description}</p>

              <div className="space-y-2">
                {vote.choices.map((choice) => {
                  const percentage =
                    vote.totalVotes > 0
                      ? Math.round((choice.votes / vote.totalVotes) * 100)
                      : 0;

                  return (
                    <div key={choice.id} className="relative">
                      <button
                        onClick={() => handleVote(vote.id, choice.id)}
                        disabled={vote.hasVoted}
                        className={`w-full p-3 text-left border rounded ${
                          vote.hasVoted
                            ? "bg-gray-100 cursor-default"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="relative z-10">
                          {choice.text}
                          {vote.hasVoted && (
                            <span className="ml-2 text-gray-500">
                              ({choice.votes}표, {percentage}%)
                            </span>
                          )}
                        </div>
                        {vote.hasVoted && (
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-100 rounded"
                            style={{ width: `${percentage}%`, zIndex: 0 }}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {vote.hasVoted && (
                <p className="mt-4 text-sm text-gray-500">
                  총 {vote.totalVotes}명이 투표했습니다.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
