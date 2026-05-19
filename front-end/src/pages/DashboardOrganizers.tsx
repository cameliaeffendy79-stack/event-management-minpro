import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/UI/Button";

import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface EventItem {
  id: number;
  title: string;
}

interface Transaction {
  id: number;
  quantity: number;
  totalPrice: number;
  status: string;
  user: {
    fullName: string;
  };
  event: {
    title: string;
  };
}

/* ===================== SIDEBAR ===================== */

function Sidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          Event Pro
        </h1>
      </div>

      <nav className="sidebar-nav">
        <button
          onClick={() =>
            navigate("/dashboard-organizer")
          }
          className="sidebar-item"
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            navigate("/my-events")
          }
          className="sidebar-item"
        >
          My Events
        </button>

        <button
          onClick={() =>
            navigate(
              "/organizer/transactions"
            )
          }
          className="sidebar-item"
        >
          Transactions
        </button>

        <button
          onClick={() =>
            navigate(
              "/organizer/analytics"
            )
          }
          className="sidebar-item"
        >
          Analytics
        </button>

        <button
          onClick={() =>
            navigate(
              "/organizer/attendees"
            )
          }
          className="sidebar-item"
        >
          Attendee List
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="sidebar-logout"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

/* ===================== UI COMPONENTS ===================== */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="card card-hover">
      <p className="card-label">
        {title}
      </p>

      <h3 className="card-value">
        {value}
      </h3>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const color =
    status === "ACCEPTED"
      ? "badge-success"
      : status === "PENDING"
      ? "badge-warning"
      : "badge-danger";

  return (
    <span className={`badge ${color}`}>
      {status}
    </span>
  );
}

function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="card card-lg">
      <h3 className="table-header">
        Recent Transactions
      </h3>

      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Event</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id}>
              <td>
                {trx.user.fullName}
              </td>

              <td>
                {trx.event.title}
              </td>

              <td>
                Rp{" "}
                {trx.totalPrice.toLocaleString(
                  "id-ID"
                )}
              </td>

              <td>
                <StatusBadge
                  status={trx.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */

export default function DashboardOrganizer() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<
    EventItem[]
  >([]);

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
            "/transactions",
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
  // ANALYTICS
  //////////////////////////////////////////////////////

  const totalTicketsSold =
    transactions.reduce(
      (sum, trx) =>
        sum + trx.quantity,
      0
    );

  const totalRevenue =
    transactions
      .filter(
        (trx) =>
          trx.status === "ACCEPTED"
      )
      .reduce(
        (sum, trx) =>
          sum + trx.totalPrice,
        0
      );

  const summaryData = [
    {
      title: "Total Events",
      value: events.length,
    },
    {
      title: "Tickets Sold",
      value: totalTicketsSold,
    },
    {
      title: "Total Revenue",
      value: `Rp ${totalRevenue.toLocaleString(
        "id-ID"
      )}`,
    },
    {
      title: "Transactions",
      value: transactions.length,
    },
  ];

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
    <div className="layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="main">
        <div className="content">
          {/* HEADER */}

          <div className="page-header">
            <div>
              <h1>
                Performance Summary
              </h1>

              <p>
                Overview of your events
                and revenue
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  "/create-event"
                )
              }
            >
              + Create Event
            </Button>
          </div>

          {/* SUMMARY */}

          <div className="grid-4">
            {summaryData.map(
              (card, i) => (
                <SummaryCard
                  key={i}
                  {...card}
                />
              )
            )}
          </div>

          {/* GRID */}

          <div className="dashboard-grid">
            {/* LEFT */}

            <div className="grid-main">
              <TransactionTable
                transactions={
                  transactions
                }
              />
            </div>

            {/* RIGHT */}

            <div className="grid-side">
              <div className="card highlight-card">
                <h3>
                  Organizer Stats
                </h3>

                <h2>
                  {events.length} Events
                </h2>

                <p>
                  {totalTicketsSold} total
                  tickets sold
                </p>

                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: "85%",
                    }}
                  />
                </div>

                <Button
                  variant="secondary"
                  className="mt-4"
                >
                  Manage Events
                </Button>
              </div>

              <div className="card">
                <h3>
                  Quick Summary
                </h3>

                <ul className="milestones">
                  <li>
                    🎟 {events.length} Active
                    Events
                  </li>

                  <li>
                    💰 Rp{" "}
                    {totalRevenue.toLocaleString(
                      "id-ID"
                    )}
                  </li>

                  <li>
                    👥{" "}
                    {
                      transactions.length
                    }{" "}
                    Transactions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAB */}

        <Button
          size="icon"
          className="fab"
        >
          +
        </Button>
      </div>
    </div>
  );
}