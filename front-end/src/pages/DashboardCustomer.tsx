import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../lib/api";

import { useAuth } from "../context/AuthContext";

interface EventData {
  id: number;
  title: string;
  location: string;
  date: string;
  price: number;
  image?: string;
}

interface Transaction {
  id: number;
  status: string;
}

function Sidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col py-6 px-4 h-screen w-64 fixed left-0 top-0 bg-slate-50 z-50">
      {/* Logo */}

      <div className="flex items-center gap-3 px-2 mb-10">
        <h1 className="text-2xl font-bold">
          Eventify
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {/* Dashboard */}

        <button
          onClick={() =>
            navigate(
              "/dashboard-customer"
            )
          }
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary font-semibold relative before:content-[''] before:absolute before:left-0 before:w-1 before:h-8 before:bg-primary before:rounded-r-full w-full text-left"
        >
          <span className="material-symbols-outlined">
            dashboard
          </span>

          <span className="text-[13px] tracking-wide">
            Dashboard
          </span>
        </button>

        {/* My Events */}

        <button
          onClick={() =>
            navigate(
              "/my-events-customer"
            )
          }
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white w-full text-left"
        >
          <span className="material-symbols-outlined">
            event_upcoming
          </span>

          <span className="text-[13px] tracking-wide">
            My Events
          </span>
        </button>

        {/* Transactions */}

        <button
          onClick={() =>
            navigate(
              "/customer/transactions"
            )
          }
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white w-full text-left"
        >
          <span className="material-symbols-outlined">
            receipt_long
          </span>

          <span className="text-[13px] tracking-wide">
            Transactions
          </span>
        </button>
      </nav>

      {/* Bottom */}

      <div className="mt-auto space-y-4">
        <button
          onClick={() =>
            navigate("/events")
          }
          className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined">
            explore
          </span>

          Browse Events
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/20 transition-all duration-300 w-full text-left"
        >
          <span className="material-symbols-outlined">
            logout
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
}

function TopNavbar() {
  const { user } = useAuth();

  return (
    <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 shadow-[0_12px_40px_rgba(13,28,46,0.06)]">
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Welcome, {user?.name}
      </span>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-50 transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined">
            notifications
          </span>
        </button>

        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-50 transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined">
            settings
          </span>
        </button>
      </div>
    </header>
  );
}

function StatCard({
  icon,
  label,
  value,
  colorClass,
  bgColorClass,
}: {
  icon: string;
  label: string;
  value: string;
  colorClass: string;
  bgColorClass: string;
}) {
  return (
    <div className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-5">
      <div
        className={`w-14 h-14 ${bgColorClass} ${colorClass} rounded-2xl flex items-center justify-center`}
      >
        <span className="material-symbols-outlined text-3xl">
          {icon}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium text-on-surface-variant">
          {label}
        </p>

        <p className="text-2xl font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}

function EventCard({
  event,
}: {
  event: EventData;
}) {
  return (
    <div className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-outline-variant/10">
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h4 className="text-xl font-bold text-on-surface mb-2">
          {event.title}
        </h4>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-base">
              location_on
            </span>

            {event.location}
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-base">
              schedule
            </span>

            {new Date(
              event.date
            ).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-surface-container">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Ticket Price
            </p>

            <p className="text-sm font-bold text-primary">
              Rp{" "}
              {event.price.toLocaleString(
                "id-ID"
              )}
            </p>
          </div>

          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95">
            View Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const [events, setEvents] =
    useState<EventData[]>([]);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  //////////////////////////////////////////////////////
  // FETCH DATA
  //////////////////////////////////////////////////////

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        //////////////////////////////////////////////////////
        // EVENTS
        //////////////////////////////////////////////////////

        const eventsResponse =
          await api.get("/events", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setEvents(
          eventsResponse.data.data
        );

        //////////////////////////////////////////////////////
        // TRANSACTIONS
        //////////////////////////////////////////////////////

        const transactionResponse =
          await api.get(
            "/transactions/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setTransactions(
          transactionResponse.data.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  //////////////////////////////////////////////////////
  // STATS
  //////////////////////////////////////////////////////

  const acceptedTransactions =
    transactions.filter(
      (t) => t.status === "ACCEPTED"
    );

  const pendingTransactions =
    transactions.filter(
      (t) => t.status === "PENDING"
    );

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-8">
        <TopNavbar />

        <div className="p-8 max-w-7xl mx-auto">
          {/* HERO */}

          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
                  Welcome Back
                </span>

                <h2 className="text-4xl font-bold tracking-tight text-on-surface">
                  Experience the
                  Extraordinary
                </h2>

                <p className="mt-4 text-on-surface-variant max-w-xl text-lg leading-relaxed">
                  Discover curated
                  events tailored to
                  your interests.
                </p>
              </div>
            </div>
          </section>

          {/* STATS */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              icon="calendar_today"
              label="Booked Events"
              value={`${acceptedTransactions.length}`}
              colorClass="text-primary"
              bgColorClass="bg-primary/10"
            />

            <StatCard
              icon="receipt_long"
              label="Pending Transactions"
              value={`${pendingTransactions.length}`}
              colorClass="text-tertiary"
              bgColorClass="bg-tertiary/10"
            />

            <StatCard
              icon="event"
              label="Available Events"
              value={`${events.length}`}
              colorClass="text-on-secondary-container"
              bgColorClass="bg-secondary-container"
            />
          </section>

          {/* EVENTS */}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-on-surface">
                Upcoming Events
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}