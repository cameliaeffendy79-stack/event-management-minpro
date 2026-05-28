import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEvents } from "../services/eventService";
import type { Event, Ticket } from "../types/event";

function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  // 🔥 SORT BY NEAREST DATE + LIMIT 6
  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() -
        new Date(b.start_date).getTime()
    )
    .slice(0, 6);

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="pt-32 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-700 to-purple-500 rounded-3xl p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            Discover Unforgettable Experiences
          </h1>

          <p className="mb-6 text-lg opacity-80">
            Access the best events in Indonesia
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/events")}
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold"
            >
              Explore Events
            </button>

            <button className="border border-white px-6 py-3 rounded-full">
              How it Works
            </button>
          </div>
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section className="py-16 px-6 bg-[#f3ebf9]">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              Upcoming Events
            </h2>

            <button
              onClick={() => navigate("/events")}
              className="text-purple-600 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => {
              // ✅ SAFE tickets (no undefined)
              const tickets: Ticket[] = event.tickets || [];

              // ✅ CLEAN lowest price
              const lowestPrice =
                tickets.length > 0
                  ? Math.min(...tickets.map((t) => t.price))
                  : null;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white rounded-xl shadow hover:-translate-y-2 transition cursor-pointer"
                >
                  {/* IMAGE PLACEHOLDER */}
                  <div className="h-40 bg-gray-200 rounded-t-xl"></div>

                  <div className="p-4">
                    <p className="text-sm text-purple-600">
                      {new Date(event.start_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <h3 className="font-bold text-lg">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      📍 {event.location}
                    </p>

                    {/* ✅ FINAL PRICE */}
                    <p className="mt-2 font-semibold">
                      {lowestPrice
                        ? `Starting at Rp ${new Intl.NumberFormat("id-ID").format(
                            lowestPrice
                          )}`
                        : "Price unavailable"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;