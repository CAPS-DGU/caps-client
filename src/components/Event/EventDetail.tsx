import React from "react";
import { EventPageProps } from "../../types/pages";

interface EventDetailProps {
  eventData: EventPageProps;
}

const EventDetail: React.FC<EventDetailProps> = ({ eventData }) => {
  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{eventData.title}</h1>
      <div className="mb-4">
        <p className="text-gray-600">작성자: {eventData.author}</p>
        <p className="text-gray-600">
          작성일: {new Date(eventData.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="prose max-w-none">{eventData.content}</div>
    </div>
  );
};

export default EventDetail;
