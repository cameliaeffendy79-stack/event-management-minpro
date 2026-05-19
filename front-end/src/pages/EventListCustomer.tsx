import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}

export default function EventListCustomer() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET EVENTS FROM BACKEND
  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/events"
      );

      const result = await response.json();

      setEvents(result.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ BOOK EVENT
  const handleBook = async (eventId: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            event_id: eventId,
            quantity: 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Booking success!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Browse Events
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h2 className="text-xl font-bold mb-2">
              {event.title}
            </h2>

            <p className="text-gray-600 mb-2">
              {event.description}
            </p>

            <p className="text-sm text-gray-500">
              📍 {event.location || "-"}
            </p>

            <p className="text-sm text-gray-500">
              🎫 {event.category || "-"}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              📅{" "}
              {event.start_date
                ? new Date(
                    event.start_date
                  ).toLocaleDateString()
                : "-"}
            </p>

            <button
              onClick={() =>
                handleBook(event.id)
              }
              className="
                w-full
                bg-blue-500
                hover:bg-blue-600
                text-white
                py-2
                rounded-lg
              "
            >
              Book Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}