import React, { useEffect, useState } from "react";
import EventForm from "../components/Event/EventForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import { EventPageProps } from "../types/pages";

const EventCreationPage: React.FC<{ flag: boolean }> = ({ flag }) => {
  const [initialData, setinitialData] = useState<EventPageProps | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const accessToken = localStorage.getItem("accessToken");

  const handleEventSubmit = (eventData: EventPageProps) => {
    console.log("생성된 이벤트 데이터:", eventData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/event/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: "Bearer " + accessToken,
          },
        });
        console.log(response.data);
        setinitialData(response.data.data);
      } catch (error) {
        if (error.response?.status === 403) {
          alert("권한이 없습니다.");
          window.location.href = "/event";
        }
        console.error("Error fetching study data:", error);
      }
    };
    if (flag) {
      fetchData();
    }
  }, [eventId, flag, accessToken]);

  console.log(initialData);
  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gray-100">
      <EventForm
        eventId={eventId}
        initialData={initialData}
        onSubmit={handleEventSubmit}
      />
    </div>
  );
};

export default EventCreationPage;
