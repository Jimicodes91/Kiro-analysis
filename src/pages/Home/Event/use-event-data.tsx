import { Event } from "@/types/event.types";
import { useState } from "react";

const dummyEvents: Event[] = [
  {
    id: 1,
    eventTitle: "The Future of Commerce",
    projectName: "Dubai registration",
    projectType: "client",
    date: "02 Nov 2023",
    time: "14:00",
    venue: "Dubai Trade Center",
    description: "An event about the future of commerce",
    sendTo: "all",
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
  },
  {
    id: 2,
    eventTitle: "The Smart Money Expo",
    projectName: "Dubai registration",
    projectType: "public",
    date: "02 Nov 2023",
    time: "16:30",
    venue: "Financial Hub",
    description: "Exhibition on smart money technologies",
    sendTo: "team",
    visibleToClient: false,
    assignee: ["UO", "JO", "IO"],
  },
  {
    id: 3,
    eventTitle: "Vision Board & Goal-Setting",
    projectName: "Dubai registration",
    projectType: "internal",
    date: "02 Nov 2023",
    time: "09:00",
    venue: "Conference Room A",
    description: "Company goal setting workshop",
    sendTo: "team",
    visibleToClient: false,
    assignee: ["UO", "JO", "IO"],
  },
  {
    id: 4,
    eventTitle: "The Future of Commerce",
    projectName: "Dubai registration",
    projectType: "client",
    date: "02 Nov 2023",
    time: "10:30",
    venue: "Meeting Hall B",
    description: "Follow-up meeting on commerce strategies",
    sendTo: "clients",
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
  },
  {
    id: 5,
    eventTitle: "The Smart Money Expo",
    projectName: "Dubai registration",
    projectType: "public",
    date: "02 Nov 2023",
    time: "13:45",
    venue: "Exhibition Center",
    description: "Networking event for finance professionals",
    sendTo: "all",
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
  },
];

export const useEventData = () => {
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [loading, setLoading] = useState(false);

  const addEvent = async (newEvent: Event) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents((prev) => [...prev, newEvent]);
      return true;
    } catch (error) {
      console.error("Failed to add event:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents((prev) =>
        prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      );
      return true;
    } catch (error) {
      console.error("Failed to update event:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      return true;
    } catch (error) {
      console.error("Failed to delete event:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
