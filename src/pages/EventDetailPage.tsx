import React, { useEffect, useState } from "react";
import EventDetail from "../components/Event/EventDetail";
import axios from "axios";
import { useParams } from "react-router-dom";
import { EventPageProps } from "../types/pages";

const EventDetailPage: React.FC = () => {
  const [eventData, setEventData] = useState<EventPageProps | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const accessToken = localStorage.getItem("accessToken");

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
        setEventData(response.data.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchData();
  }, [eventId, accessToken]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gray-100">
      {eventData && <EventDetail eventData={eventData} />}
    </div>
  );
};

export default EventDetailPage;
