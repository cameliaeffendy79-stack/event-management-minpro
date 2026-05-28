import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  quantity?: number;
  total_price?: number;
  status?: string;
  created_at?: string;

  events?: {
    id: number;
    title?: string;
    location?: string;
    start_date?: string;
  };
}

export default function MyEventCustomer() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ✅ FETCH USER TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/transactions/my-transactions",
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
        "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">
        My Events
      </h2>

      {transactions.length === 0 && (
        <p>No events booked yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="
              bg-white
              p-5
              rounded-2xl
              shadow
            "
          >
            <h3 className="font-semibold text-lg mb-2">
              {t.events?.title}
            </h3>

            <p className="text-gray-600">
              📍 {t.events?.location || "-"}
            </p>

            <p className="text-gray-600">
              🎫 Quantity: {t.quantity}
            </p>

            <p className="text-gray-600">
              💰 Total: Rp{" "}
              {t.total_price?.toLocaleString(
                "id-ID"
              )}
            </p>

            <p className="text-gray-600">
              📅{" "}
              {t.events?.start_date
                ? new Date(
                    t.events.start_date
                  ).toLocaleDateString()
                : "-"}
            </p>

            <p className="mt-3">
              Status:{" "}
              <span className="font-semibold">
                {t.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}