import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TransactionItem {
  id: number;
  quantity?: number;
  total_price?: number;
  status?: string;
  created_at?: string;

  events?: {
    id: number;
    title?: string;
  };
}

export default function OrganizerAnalytics() {
  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState<TransactionItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ✅ FETCH ORGANIZER TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/transactions/organizer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      setTransactions(result.data || []);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to fetch analytics data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ EVENT STATS
  const eventStats = useMemo(() => {
    const grouped: Record<
      string,
      {
        title: string;
        totalTransactions: number;
        totalTicketsSold: number;
        totalRevenue: number;
      }
    > = {};

    transactions.forEach((trx) => {
      const title =
        trx.events?.title ||
        "Unknown Event";

      if (!grouped[title]) {
        grouped[title] = {
          title,
          totalTransactions: 0,
          totalTicketsSold: 0,
          totalRevenue: 0,
        };
      }

      grouped[title].totalTransactions += 1;

      grouped[title].totalTicketsSold +=
        trx.quantity || 0;

      if (
        trx.status === "ACCEPTED"
      ) {
        grouped[title].totalRevenue +=
          trx.total_price || 0;
      }
    });

    return Object.values(grouped);
  }, [transactions]);

  // ✅ TOP SELLING EVENTS
  const topSellingEvents =
    [...eventStats]
      .sort(
        (a, b) =>
          b.totalTicketsSold -
          a.totalTicketsSold
      )
      .slice(0, 3);

  // ✅ MONTHLY REVENUE
  const monthlyRevenue =
    useMemo(() => {
      const revenueMap: Record<
        string,
        number
      > = {};

      transactions
        .filter(
          (trx) =>
            trx.status ===
            "ACCEPTED"
        )
        .forEach((trx) => {
          if (!trx.created_at)
            return;

          const month =
            trx.created_at.slice(0, 7);

          if (!revenueMap[month]) {
            revenueMap[month] = 0;
          }

          revenueMap[month] +=
            trx.total_price || 0;
        });

      return Object.entries(
        revenueMap
      );
    }, [transactions]);

  const maxRevenue = Math.max(
    ...monthlyRevenue.map(
      ([_, revenue]) => revenue
    ),
    0
  );

  if (loading) {
    return (
      <div className="p-8">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div
        className="
          bg-white
          p-5
          flex
          justify-between
          items-center
          shadow
        "
      >
        <h2 className="text-2xl font-bold">
          Event Analytics
        </h2>

        <button
          onClick={() =>
            navigate(
              "/dashboard-organizer"
            )
          }
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-blue-700
          "
        >
          Back to Dashboard
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {/* REVENUE CHART */}
        <h3 className="text-xl font-semibold mb-4">
          Revenue Chart
        </h3>

        <div
          className="
            bg-white
            rounded-2xl
            shadow
            p-6
          "
        >
          <div
            className="
              flex
              items-end
              gap-6
              h-64
            "
          >
            {monthlyRevenue.map(
              ([month, revenue]) => {
                const heightPercent =
                  maxRevenue > 0
                    ? (revenue /
                        maxRevenue) *
                      100
                    : 0;

                return (
                  <div
                    key={month}
                    className="
                      flex
                      flex-col
                      items-center
                      justify-end
                      flex-1
                      h-full
                    "
                  >
                    <div
                      className="
                        w-12
                        bg-blue-600
                        rounded-t-lg
                        transition-all
                      "
                      style={{
                        height: `${heightPercent}%`,
                      }}
                      title={`Rp ${revenue.toLocaleString(
                        "id-ID"
                      )}`}
                    />

                    <span className="mt-3 text-sm">
                      {month}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* EVENT PERFORMANCE */}
        <h3
          className="
            text-xl
            font-semibold
            mt-10
            mb-4
          "
        >
          Performance per Event
        </h3>

        <div className="space-y-4">
          {eventStats.map(
            (stat, index) => (
              <div
                key={index}
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow
                "
              >
                <h4 className="font-bold text-lg">
                  {stat.title}
                </h4>

                <p className="mt-2">
                  Total Transactions:{" "}
                  {
                    stat.totalTransactions
                  }
                </p>

                <p>
                  Tickets Sold:{" "}
                  {
                    stat.totalTicketsSold
                  }
                </p>

                <p>
                  Revenue: Rp{" "}
                  {stat.totalRevenue.toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            )
          )}
        </div>

        {/* TOP SELLING */}
        <h3
          className="
            text-xl
            font-semibold
            mt-10
            mb-4
          "
        >
          Top Selling Events
        </h3>

        <div className="space-y-4">
          {topSellingEvents.map(
            (event, index) => (
              <div
                key={index}
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow
                "
              >
                <h4 className="font-bold text-lg">
                  #{index + 1}{" "}
                  {event.title}
                </h4>

                <p className="mt-2">
                  Tickets Sold:{" "}
                  {
                    event.totalTicketsSold
                  }
                </p>

                <p>
                  Revenue: Rp{" "}
                  {event.totalRevenue.toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            )
          )}
        </div>

        {/* MONTHLY REVENUE */}
        <h3
          className="
            text-xl
            font-semibold
            mt-10
            mb-4
          "
        >
          Monthly Revenue
        </h3>

        <div className="space-y-4">
          {monthlyRevenue.map(
            ([month, revenue]) => (
              <div
                key={month}
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow
                "
              >
                <h4 className="font-bold">
                  {month}
                </h4>

                <p className="mt-2">
                  Revenue: Rp{" "}
                  {revenue.toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}