import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

interface EventItem {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: string;
  venue_name: string;
}

export default function EventListOrganizer() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [events, setEvents] = useState<
    EventItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /////////////////////////////////////////////////////
  // GET EVENTS
  /////////////////////////////////////////////////////

  const fetchEvents = async () => {
    try {
      const response =
        await axios.get(
          "http://localhost:5000/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setEvents(
        response.data.data
      );
    } catch (error) {
      console.error(error);

      alert("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////////////////////////////
  // DELETE EVENT
  /////////////////////////////////////////////////////

  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prev) =>
        prev.filter(
          (event) =>
            event.id !== id
        )
      );

      alert(
        "Event deleted successfully"
      );
    } catch (error) {
      console.error(error);

      alert("Failed to delete event");
    }
  };

  /////////////////////////////////////////////////////
  // LOAD EVENTS
  /////////////////////////////////////////////////////

  useEffect(() => {
    fetchEvents();
  }, []);

  /////////////////////////////////////////////////////
  // UI
  /////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Events
        </h2>

        <button
          onClick={() =>
            navigate(
              "/create-event"
            )
          }
          className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded-lg
            font-semibold
            hover:bg-green-700
          "
        >
          Create Event
        </button>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 && (
        <p className="text-gray-600">
          No events available.
        </p>
      )}

      {/* EVENT LIST */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="
              bg-white
              p-5
              rounded-2xl
              shadow
            "
          >
            <h3 className="text-xl font-semibold">
              {event.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {event.description}
            </p>

            <p className="mt-2">
              📅{" "}
              {new Date(
                event.start_date
              ).toLocaleDateString(
                "id-ID"
              )}
            </p>

            <p>
              📍 {event.location}
            </p>

            <p>
              🏢{" "}
              {event.venue_name}
            </p>

            <p>
              🎫{" "}
              {event.category}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  navigate(
                    `/edit-event/${event.id}`
                  )
                }
                className="
                  bg-blue-600
                  text-white
                  px-3
                  py-1
                  rounded-lg
                  hover:bg-blue-700
                "
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    event.id
                  )
                }
                className="
                  bg-red-500
                  text-white
                  px-3
                  py-1
                  rounded-lg
                  hover:bg-red-600
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}